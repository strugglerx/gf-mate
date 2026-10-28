// sqlguard.go AI 原生 SQL 门禁：只读校验。
//
// 设计：AI 可写自由 SQL（解锁 JOIN/窗口函数/CTE 等复杂查询），但必须过五道防线：
//  1. 单语句：只允许一条语句（去尾分号后不得再出现 ;）；
//  2. 只读语句：必须以 SELECT / WITH / EXPLAIN 开头（EXPLAIN 后必须跟 SELECT/WITH），且全文不得出现写关键字（词边界匹配）；
//  3. 表白名单：FROM/JOIN 引用的表必须全部在注册数据集的表白名单内；
//  4. 行数上限：无顶层 LIMIT 时强制追加 LIMIT maxRows；
//  5. 超时：由调用方（ExecuteSQL）通过 context 控制。
//
// 注意：本模式绕过 RowScope 行级权限与字段级白名单，属于"可信内网 + 宿主显式开启"
// 的高级能力，默认关闭（Config.RawSQL.Enabled=false）。
package queryengine

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/gogf/gf/v2/errors/gerror"
)

// 写操作/危险关键字黑名单（词边界匹配，大小写不敏感）。
// 包含 DML/DDL/事务/过程调用/会话控制等一切非只读能力。
var sqlForbiddenKeywords = []string{
	// DML
	"insert", "update", "delete", "merge",
	// DDL
	"drop", "alter", "create", "truncate", "rename", "comment",
	// 权限
	"grant", "revoke",
	// 过程/调用
	"call", "exec", "execute", "begin", "declare",
	// 事务/锁
	"commit", "rollback", "savepoint", "lock", "unlock",
	// 会话/系统
	"set", "shutdown", "kill", "audit", "purge", "flashback", "analyze",
	// SELECT ... INTO 写表（部分数据库支持）
	"into",
}

// sqlForbiddenRe 黑名单整体正则（编译一次）。
var sqlForbiddenRe = buildForbiddenRe()

// buildForbiddenRe 构建黑名单正则：\b(kw1|kw2|...)\b，大小写不敏感。
func buildForbiddenRe() *regexp.Regexp {
	return regexp.MustCompile(`(?i)\b(` + strings.Join(sqlForbiddenKeywords, "|") + `)\b`)
}

// sqlFromRe 匹配 FROM / JOIN 后面的表引用（含 schema.table 形式）。
var sqlFromRe = regexp.MustCompile(`(?i)\b(from|join)\s+([A-Za-z_][A-Za-z0-9_$]*(?:\.[A-Za-z_][A-Za-z0-9_$]*)*)`)

// sqlCTERe 匹配 CTE 名：WITH name AS ( ... , name2 AS (
var sqlCTERe = regexp.MustCompile(`(?i)\b(?:with|,)\s*([A-Za-z_][A-Za-z0-9_$]*)\s+as\s*\(`)

// sqlIdentRe 单个标识符（表名/别名），整串匹配。
var sqlIdentRe = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_$]*$`)

// sqlIdentPrefixRe 标识符前缀匹配（提取用，不锚定结尾）。
var sqlIdentPrefixRe = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_$]*`)

// sqlCommentRe 行注释与块注释（校验前剔除，防止注释里藏关键字绕过词边界检查——
// 剔除后注释内容不再参与任何匹配，反而更安全：注释里的表名也不会被误判）。
var sqlLineCommentRe = regexp.MustCompile(`--[^\n]*`)
var sqlBlockCommentRe = regexp.MustCompile(`/\*.*?\*/`)

// guardSQL 校验 AI 提交的 SQL，通过则返回可执行版本（必要时追加 LIMIT）。
// allowedTables 为小写表名集合（白名单）；maxRows 为强制行数上限。
//
// 返回的 SQL 文本除追加 LIMIT 外不做任何改写——所有校验都是"拒绝或放行"，不做替换，
// 避免"改写语义"引入新风险。
func guardSQL(sql string, allowedTables map[string]bool, maxRows int) (string, error) {
	return guardSQLWithDeny(sql, allowedTables, nil, maxRows)
}

// sqlStarRe 匹配投影里的 * / alias.*（SELECT 后或逗号后），不匹配 COUNT(*)。
var sqlStarRe = regexp.MustCompile(`(?i)(?:\bselect\s+(?:distinct\s+|all\s+)?|,\s*)(?:[A-Za-z_][A-Za-z0-9_$]*\.)?\*`)

// guardSQLWithDeny 在 guardSQL 五道防线之外增加敏感列门禁：
// denyColumns 为「小写表名 → 小写敏感列集合」。SQL 引用了含敏感列的表时：
//   - 全文（含字符串字面量，宁可误拒）出现敏感列名即拒绝；
//   - 投影使用 * 或 alias.* 即拒绝（否则敏感列会随整行带出）。
func guardSQLWithDeny(sql string, allowedTables map[string]bool, denyColumns map[string]map[string]bool, maxRows int) (string, error) {
	// 去注释（注释内容整体剔除，不参与后续任何检查）。
	cleaned := sqlBlockCommentRe.ReplaceAllString(sql, " ")
	cleaned = sqlLineCommentRe.ReplaceAllString(cleaned, " ")
	cleaned = strings.TrimSpace(cleaned)
	if cleaned == "" {
		return "", gerror.New("SQL 校验失败：SQL 不能为空")
	}

	// 1. 单语句：去尾分号后不得再出现分号。
	trimmed := strings.TrimSuffix(cleaned, ";")
	if strings.ContainsRune(trimmed, ';') {
		return "", gerror.New("SQL 校验失败：只允许执行单条语句（不得包含多个分号）")
	}

	// 2. 只读语句头：SELECT / WITH / EXPLAIN SELECT 开头。
	// EXPLAIN 仅作为前缀放行：剥掉后内层必须是 SELECT/WITH，
	// 且后续表白名单/黑名单校验都在完整语句上执行，EXPLAIN 无法夹带写操作。
	isExplain := false
	body := cleaned
	upperAll := strings.ToUpper(cleaned)
	if strings.HasPrefix(upperAll, "EXPLAIN") && (len(upperAll) == 7 || !isIdentChar(upperAll[7])) {
		isExplain = true
		body = strings.TrimLeft(cleaned[7:], " \t\r\n")
	}
	upperBody := strings.ToUpper(body)
	if !strings.HasPrefix(upperBody, "SELECT") && !strings.HasPrefix(upperBody, "WITH") {
		return "", gerror.New("SQL 校验失败：只允许 SELECT / WITH（CTE）/ EXPLAIN 开头的只读查询")
	}

	// 3. 黑名单关键字（词边界匹配）。
	if m := sqlForbiddenRe.FindString(cleaned); m != "" {
		return "", gerror.Newf("SQL 校验失败：包含禁止的关键字 %q（只允许只读查询）", strings.ToLower(m))
	}

	// 4. 表白名单：提取 FROM/JOIN 引用的表 + CTE 名，逐一校验。
	cteNames := extractCTENames(cleaned)
	tables, err := extractTables(cleaned)
	if err != nil {
		return "", err
	}
	for _, t := range tables {
		if !allowedTables[strings.ToLower(t)] && !cteNames[strings.ToLower(t)] {
			return "", gerror.Newf("SQL 校验失败：表 %q 不在白名单内（只能查询已注册数据集对应的表）", t)
		}
	}
	if err := checkDeniedColumns(cleaned, tables, denyColumns); err != nil {
		return "", err
	}

	// 5. 行数上限：无顶层 LIMIT 时追加（EXPLAIN 只出执行计划，不追加）。
	if !isExplain && !hasTopLevelLimit(cleaned) {
		cleaned = cleaned + " LIMIT " + strconv.Itoa(maxRows)
	}
	return cleaned, nil
}

// checkDeniedColumns 敏感列门禁（只拒绝不改写）。
func checkDeniedColumns(sql string, tables []string, denyColumns map[string]map[string]bool) error {
	if len(denyColumns) == 0 {
		return nil
	}
	var sensitiveTable string
	denied := map[string]bool{}
	for _, t := range tables {
		cols := denyColumns[strings.ToLower(t)]
		if len(cols) == 0 {
			continue
		}
		if sensitiveTable == "" {
			sensitiveTable = t
		}
		for c := range cols {
			denied[c] = true
		}
	}
	if len(denied) == 0 {
		return nil
	}
	if sqlStarRe.MatchString(sql) {
		return gerror.Newf("SQL 校验失败：表 %q 含敏感字段，不允许 SELECT * 或 别名.*，请显式列出需要的列", sensitiveTable)
	}
	for _, word := range sqlWordRe.FindAllString(sql, -1) {
		if denied[strings.ToLower(word)] {
			return gerror.Newf("SQL 校验失败：列 %q 为敏感字段，禁止查询", strings.ToLower(word))
		}
	}
	return nil
}

// sqlWordRe 提取 SQL 中的全部标识符词（敏感列比对用）。
var sqlWordRe = regexp.MustCompile(`[A-Za-z_][A-Za-z0-9_$]*`)

// extractCTENames 提取 WITH 子句定义的 CTE 名（小写 key 集合）。
// 覆盖 WITH t AS ( ... 以及递归逗号 , t2 AS ( ...。
func extractCTENames(sql string) map[string]bool {
	cte := map[string]bool{}
	for _, m := range sqlCTERe.FindAllStringSubmatch(sql, -1) {
		cte[strings.ToLower(m[1])] = true
	}
	return cte
}

// extractTables 提取 SQL 中 FROM/JOIN 引用的全部表名。
// 覆盖：FROM t / FROM schema.t / FROM t alias / FROM t1, t2 / JOIN t ON ...。
// 子查询 FROM (SELECT...) 中的内层 FROM 由正则全文扫描自然覆盖。
func extractTables(sql string) ([]string, error) {
	seen := map[string]bool{}
	var out []string

	locs := sqlFromRe.FindAllStringSubmatchIndex(sql, -1)
	for _, loc := range locs {
		kw := strings.ToLower(sql[loc[2]:loc[3]])
		ref := sql[loc[4]:loc[5]]
		// FROM 段：取标识符，再看后面是否跟逗号多表（FROM a, b）。
		name := normalizeTableName(ref)
		if name == "" {
			// FROM 后不是标识符（如子查询左括号），跳过。
			continue
		}
		if !seen[name] {
			seen[name] = true
			out = append(out, name)
		}
		if kw != "from" {
			continue
		}
		// 扫描 FROM 段的逗号多表：从 ref 结束处向后，先跳过可选别名，
		// 再遇 ", ident" 收集，遇其他关键字/子查询/字符串则停止。
		rest := sql[loc[5]:]
		rest = strings.TrimLeft(rest, " \t\r\n")
		// 跳过别名（FROM t alias / FROM t AS alias）。
		if alias := sqlIdentPrefixRe.FindString(rest); alias != "" {
			rest = rest[len(alias):]
			if strings.HasPrefix(strings.ToUpper(strings.TrimLeft(rest, " \t\r\n")), "AS ") {
				rest = rest[strings.Index(rest, " ")+1:]
			}
		}
		for {
			rest = strings.TrimLeft(rest, " \t\r\n")
			if !strings.HasPrefix(rest, ",") {
				break
			}
			rest = strings.TrimLeft(rest[1:], " \t\r\n")
			m := sqlIdentPrefixRe.FindString(rest)
			if m == "" {
				break
			}
			name := normalizeTableName(m)
			if name != "" && !seen[name] {
				seen[name] = true
				out = append(out, name)
			}
			rest = rest[len(m):]
		}
	}
	return out, nil
}

// normalizeTableName 规范化表引用：去引号、取 schema.table 的最后一段、去别名。
func normalizeTableName(ref string) string {
	ref = strings.TrimSpace(ref)
	ref = strings.Trim(ref, "\"`[]")
	// schema.table → 取 table 段。
	if i := strings.LastIndexByte(ref, '.'); i >= 0 {
		ref = ref[i+1:]
	}
	if !sqlIdentRe.MatchString(ref) {
		return ""
	}
	return ref
}

// hasTopLevelLimit 判断 SQL 是否存在括号深度为 0 的 LIMIT 子句。
func hasTopLevelLimit(sql string) bool {
	depth := 0
	upper := strings.ToUpper(sql)
	for i := 0; i+len("LIMIT") <= len(upper); i++ {
		switch upper[i] {
		case '(':
			depth++
		case ')':
			depth--
		}
		if depth == 0 && strings.HasPrefix(upper[i:], "LIMIT") {
			// 词边界：前一个字符不能是标识符字符。
			if i == 0 || !isIdentChar(upper[i-1]) {
				j := i + len("LIMIT")
				if j >= len(upper) || !isIdentChar(upper[j]) {
					return true
				}
			}
		}
	}
	return false
}

// isIdentChar 标识符字符（字母数字下划线 $）。
func isIdentChar(c byte) bool {
	return c == '_' || c == '$' || (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')
}
