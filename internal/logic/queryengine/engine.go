package queryengine

import (
	"context"
	"fmt"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/errors/gerror"

	"github.com/strugglerx/gf-mate/internal/logic/registry"
	"github.com/strugglerx/gf-mate/internal/model"
)

// 数据库类型常量（与 gdb 配置的 Type 对应）。
const (
	dbTypeDM    = "dm"
	dbTypeMySQL = "mysql"
)

// 表名白名单：仅允许字母、数字、下划线，且不能以数字开头。
// Inspect 的 table 参数必须匹配该正则，防止表名被拼进元数据查询 SQL。
var inspectTableRe = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*$`)

// Engine 查询引擎：校验 → 构建链式查询 → 执行 → 组装结果。
type Engine struct {
	db       gdb.DB
	registry *registry.Registry
	cfg      *Config

	dialectOnce  sync.Once
	dialectDesc  string // 数据库方言描述（含版本，供 AI 提示词使用）
	dialectProbe func() (string, error)

	srcMu      sync.RWMutex
	sources    map[string]gdb.DB    // 命名数据源（key = Dataset.Source）
	srcDialect map[string]string    // 命名源方言描述缓存（探测一次）
}

// New 创建查询引擎。
func New(db gdb.DB, reg *registry.Registry, cfg *Config) *Engine {
	return &Engine{
		db:         db,
		registry:   reg,
		cfg:        cfg,
		sources:    make(map[string]gdb.DB),
		srcDialect: make(map[string]string),
	}
}

// AddSource 注册命名数据源（多数据库支持）。
// name 为逻辑源名，与 Dataset.Source 对应；重复注册返回错误。
// 数据集声明了 Source 但未注册对应源时，查询会返回明确错误。
func (e *Engine) AddSource(name string, db gdb.DB) error {
	if db == nil {
		return gerror.Newf("数据源注册失败：%q 未传入有效数据库连接", name)
	}
	if name == "" {
		return gerror.New("数据源注册失败：源名称不能为空")
	}
	e.srcMu.Lock()
	defer e.srcMu.Unlock()
	if _, ok := e.sources[name]; ok {
		return gerror.Newf("数据源注册失败：%q 已存在，请勿重复注册", name)
	}
	e.sources[name] = db
	return nil
}

// routeDB 根据已过门禁的 SQL 中引用的业务表路由到对应数据源。
// 规则：FROM/JOIN 引用的业务表必须全部落在同一数据源（跨源 JOIN 直接拒绝，
// 错误信息引导 AI 拆成多次单源查询）；只查数据字典视图时路由到默认源。
func (e *Engine) routeDB(finalSQL string) (gdb.DB, error) {
	tables, _ := extractTables(finalSQL)
	srcSet := false
	src := ""
	for _, t := range tables {
		lt := strings.ToLower(t)
		if metadataViewSet[lt] {
			continue // 字典视图跟随当前源，不参与路由判定
		}
		ds := e.registry.FindByTable(t)
		if ds == nil {
			continue // 白名单已在 guardSQL 拦截，这里只做路由
		}
		if !srcSet {
			src, srcSet = ds.Source, true
		} else if src != ds.Source {
			return nil, gerror.Newf(
				"跨数据源查询不支持：表 %q 属于数据源 %q，其他表属于 %q；请拆成多次单源查询，在应用层合并结果",
				t, sourceLabel(ds.Source), sourceLabel(src))
		}
	}
	e.srcMu.RLock()
	defer e.srcMu.RUnlock()
	if db, ok := e.sources[src]; ok {
		return db, nil
	}
	if src == "" {
		return e.db, nil
	}
	return nil, gerror.Newf(
		"数据集声明了数据源 %q，但该源未注册：请宿主先调用 dq.AddSource(%q, g.DB(%q))", src, src, src)
}

// sourceLabel 数据源展示名（空源显示为「默认源」）。
func sourceLabel(src string) string {
	if src == "" {
		return "默认源"
	}
	return src
}

// DialectDesc 返回数据库方言描述（如 "达梦 DM8（Oracle 兼容语法）"），
// 首次调用时探测一次并缓存。探测失败时降级为驱动类型名。
// 供 AI 助手在系统提示词中明确告知模型当前数据库与应使用的 SQL 语法。
func (e *Engine) DialectDesc() string {
	e.dialectOnce.Do(func() {
		driverType := ""
		if c := e.db.GetConfig(); c != nil {
			driverType = strings.ToLower(c.Type)
		}
		version := ""
		if e.dialectProbe == nil {
			e.dialectProbe = func() (string, error) {
				ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
				defer cancel()
				v, err := e.db.GetValue(ctx, "SELECT BANNER FROM V$VERSION")
				if err != nil {
					return "", err
				}
				return v.String(), nil
			}
		}
		if v, err := e.dialectProbe(); err == nil {
			version = v
		}
		e.dialectDesc = describeDialect(driverType, version)
	})
	return e.dialectDesc
}

// DialectDescAll 返回全部数据源的方言描述（多源时逐个列出，供 AI 提示词）。
// 单源（未 AddSource）时退化为 DialectDesc。
func (e *Engine) DialectDescAll() string {
	e.srcMu.RLock()
	named := make([]string, 0, len(e.sources))
	for name := range e.sources {
		named = append(named, name)
	}
	e.srcMu.RUnlock()
	if len(named) == 0 {
		return e.DialectDesc()
	}
	sort.Strings(named)
	parts := []string{"默认源：" + e.DialectDesc()}
	for _, name := range named {
		e.srcMu.RLock()
		db := e.sources[name]
		cached, ok := e.srcDialect[name]
		e.srcMu.RUnlock()
		if !ok {
			cached = probeDialectDesc(db)
			e.srcMu.Lock()
			e.srcDialect[name] = cached
			e.srcMu.Unlock()
		}
		parts = append(parts, fmt.Sprintf("数据源 %s：%s", name, cached))
	}
	return strings.Join(parts, "；")
}

// probeDialectDesc 探测单个数据库连接的方言描述（探测失败降级为驱动名）。
func probeDialectDesc(db gdb.DB) string {
	driverType := ""
	if c := db.GetConfig(); c != nil {
		driverType = strings.ToLower(c.Type)
	}
	version := ""
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if v, err := db.GetValue(ctx, "SELECT BANNER FROM V$VERSION"); err == nil {
		version = v.String()
	}
	return describeDialect(driverType, version)
}

// describeDialect 根据驱动类型 + 版本串生成方言描述与语法要点。
func describeDialect(driverType, version string) string {
	var name, syntax string
	switch driverType {
	case "dm":
		name = "达梦 DM"
		syntax = "Oracle 风格语法：用 SUBSTR/INSTR/NVL/TO_CHAR/TO_DATE 等标准函数，字符串拼接用 ||，日期比较用 TO_DATE；支持 LIMIT；避免 MySQL 特有函数（SUBSTRING_INDEX、GROUP_CONCAT）"
	case "mysql":
		name = "MySQL"
		syntax = "MySQL 语法：SUBSTRING_INDEX/GROUP_CONCAT/DATE_FORMAT 可用"
	case "pgsql", "postgresql":
		name = "PostgreSQL"
		syntax = "PostgreSQL 语法：STRING_AGG/TO_CHAR/ILIKE 可用"
	case "sqlite":
		name = "SQLite"
		syntax = "SQLite 语法：函数集精简，用 SUBSTR/INSTR/COALESCE，日期用 strftime"
	case "mssql", "sqlserver":
		name = "SQL Server"
		syntax = "SQL Server 语法：分页用 TOP/OFFSET FETCH，用 SUBSTRING/CHARINDEX"
	case "oracle":
		name = "Oracle"
		syntax = "Oracle 语法：分页用 ROWNUM/FETCH FIRST，用 SUBSTR/INSTR/NVL"
	default:
		if driverType != "" {
			name = driverType
		} else {
			name = "未知类型"
		}
		syntax = "用 ANSI 标准 SQL 函数（SUBSTR/INSTR/COALESCE），避免方言特有函数"
	}
	if version != "" {
		return name + "（版本：" + version + "）。语法要点：" + syntax
	}
	return name + "。语法要点：" + syntax
}

// ExecuteSQL 执行 AI 提交的原生 SQL（只读门禁模式）。
// 五道防线：单语句 / SELECT|WITH 开头 / 写关键字黑名单 / 表白名单 / 强制 LIMIT。
// 超时由调用方 context 控制（assistant 层已带 LLM 请求级超时）。
//
// 安全说明：本方法绕过 RowScope 行级权限与字段白名单，属于宿主显式开启的
// 高级能力（Config.RawSQL.Enabled），默认关闭。表白名单来自已注册数据集的 Table。
func (e *Engine) ExecuteSQL(ctx context.Context, sql string) (*model.QueryResult, error) {
	if e.cfg == nil || e.cfg.RawSQL == nil || !e.cfg.RawSQL.Enabled {
		return nil, gerror.New("原生 SQL 查询未启用：请在插件配置中设置 rawSql.enabled=true")
	}
	maxRows := e.cfg.RawSQL.MaxRows
	if maxRows <= 0 {
		maxRows = 500
	}
	timeout := time.Duration(e.cfg.RawSQL.TimeoutSec) * time.Second
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	// 单条 SQL 超时：防止 AI 写出全表扫描把库拖死。
	if ctx == nil {
		ctx = context.Background()
	}
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()
	// 表白名单：全部已注册数据集的表名（小写）。
	allowed := make(map[string]bool)
	for _, ds := range e.registry.List() {
		allowed[strings.ToLower(ds.Table)] = true
	}
	// 只读数据字典视图（索引/列/约束元数据），供 AI 做索引与性能分析。
	for _, v := range metadataViews {
		allowed[v] = true
	}
	finalSQL, err := guardSQL(sql, allowed, maxRows)
	if err != nil {
		return nil, err
	}
	// 多数据源路由：按 SQL 引用的业务表选择对应源（跨源 JOIN 在此拦截）。
	target, err := e.routeDB(finalSQL)
	if err != nil {
		return nil, err
	}
	rows, err := target.GetAll(ctx, finalSQL)
	if err != nil {
		// DM8 等库的 EXPLAIN 不通过 SQL 结果集返回执行计划，给出明确指引让 AI 自纠。
		if strings.HasPrefix(strings.ToUpper(strings.TrimSpace(finalSQL)), "EXPLAIN") {
			return nil, gerror.New("EXPLAIN 在当前数据库不返回结果集（DM8 仅 disql 支持）；" +
				"请改查 USER_INDEXES / USER_IND_COLUMNS / USER_TAB_COLUMNS 等字典视图分析索引与表结构")
		}
		return nil, gerror.Wrap(err, "SQL 执行失败")
	}
	result := &model.QueryResult{
		Rows:  make([]map[string]interface{}, 0, len(rows)),
		Total: len(rows),
	}
	// 列名从首行取（SQL 列由 AI 决定，无法预知）。
	if len(rows) > 0 {
		for k := range rows[0].Map() {
			result.Columns = append(result.Columns, k)
		}
	}
	for _, row := range rows {
		result.Rows = append(result.Rows, row.Map())
	}
	return result, nil
}

// ExecuteSQLBatch 批量执行 AI 提交的多条只读 SQL（一次工具调用、多次查询，减少工具循环往返）。
// 每条独立过门禁校验；某条失败不影响已执行的结果，返回逐条错误信息（AI 可自纠重试）。
// metadataViews 只读数据字典视图白名单（小写）。
// 这些视图只暴露当前用户可见的表/索引/列/约束元数据，无业务数据，供 AI 分析索引。
var metadataViews = []string{
	"user_indexes", "user_ind_columns", "user_tab_columns", "user_tables",
	"user_constraints", "user_cons_columns", "user_segments", "user_col_comments",
	"all_indexes", "all_ind_columns", "all_tab_columns", "all_tables",
	"all_constraints", "all_cons_columns",
}

// metadataViewSet 字典视图集合（路由判定用）。
var metadataViewSet = func() map[string]bool {
	m := make(map[string]bool, len(metadataViews))
	for _, v := range metadataViews {
		m[v] = true
	}
	return m
}()

func (e *Engine) ExecuteSQLBatch(ctx context.Context, sqls []string) ([]*model.SQLResult, error) {
	if len(sqls) == 0 {
		return nil, gerror.New("SQL 批量执行失败：SQL 列表不能为空")
	}
	const maxBatch = 10
	if len(sqls) > maxBatch {
		return nil, gerror.Newf("SQL 批量执行失败：单次最多 %d 条，当前 %d 条", maxBatch, len(sqls))
	}
	out := make([]*model.SQLResult, 0, len(sqls))
	for i, sql := range sqls {
		res, err := e.ExecuteSQL(ctx, sql)
		if err != nil {
			out = append(out, &model.SQLResult{Index: i, Error: err.Error()})
			continue
		}
		out = append(out, &model.SQLResult{Index: i, Result: res})
	}
	return out, nil
}

// Inspect 读表结构生成 Dataset 草稿（人再补 Label/Role/Enum）。
//
// 安全说明：table 必须通过白名单正则校验（仅字母数字下划线），
// 之后作为参数绑定进元数据查询，绝不直接拼接；
// 元数据查询本身是只读的 INFORMATION_SCHEMA / ALL_TAB_* 系统视图。
// 表不存在时返回中文错误（指明表名）。
func (e *Engine) Inspect(ctx context.Context, table string) (*model.Dataset, error) {
	table = strings.TrimSpace(table)
	if table == "" {
		return nil, gerror.New("表结构检查失败：table 不能为空")
	}
	if !inspectTableRe.MatchString(table) {
		return nil, gerror.Newf("表结构检查失败：表名 %q 含非法字符（仅允许字母、数字、下划线）", table)
	}

	// 先确认表存在（同时取表注释），不存在返回中文错误。
	tableComment, err := e.queryTableComment(ctx, table)
	if err != nil {
		return nil, err
	}

	// 取列元数据。
	cols, err := e.queryTableColumns(ctx, table)
	if err != nil {
		return nil, err
	}
	if len(cols) == 0 {
		return nil, gerror.Newf("表结构检查失败：表 %q 未查询到任何列，请确认表存在且有权限访问", table)
	}

	label := tableComment
	if label == "" {
		label = table
	}
	ds := &model.Dataset{
		Name:        table,
		Table:       table,
		Label:       label,
		Description: fmt.Sprintf("由表结构自动生成的数据集（表 %s）", table),
		Fields:      make([]model.Field, 0, len(cols)),
	}
	for _, c := range cols {
		f := model.Field{
			Name:  c.Name,
			Label: c.Comment,
			Type:  mapColumnType(c.DataType),
		}
		if f.Label == "" {
			f.Label = c.Name
		}
		if isNumericType(c.DataType) {
			f.Role = model.RoleMeasure
			f.Aggs = []string{"sum", "avg", "count", "max", "min"}
		} else {
			f.Role = model.RoleDimension
		}
		ds.Fields = append(ds.Fields, f)
	}
	return ds, nil
}

// ListTables 列出当前库所有表名（all 模式全量注册用）。
// MySQL 走 INFORMATION_SCHEMA.TABLES；DM8（Oracle 系）走 ALL_TABLES。
// 返回的表名全部经过白名单正则校验，非法表名直接跳过。
func (e *Engine) ListTables(ctx context.Context) ([]string, error) {
	dbType := e.db.GetConfig().Type
	var rows gdb.Result
	var err error
	if dbType == dbTypeMySQL {
		rows, err = e.db.GetAll(ctx,
			"SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME",
			e.db.GetSchema())
	} else {
		// DM8（Oracle 系）：当前 schema（OWNER = USER）下的所有表。
		// 用 USER_TABLES 只取当前用户自己的表，避免 ALL_TABLES 混入其他 schema 的表。
		rows, err = e.db.GetAll(ctx, "SELECT TABLE_NAME FROM USER_TABLES ORDER BY TABLE_NAME")
	}
	if err != nil {
		return nil, gerror.Wrap(err, "全量注册失败：查询数据库表列表出错")
	}
	out := make([]string, 0, len(rows))
	seen := make(map[string]bool)
	for _, r := range rows {
		name := r["TABLE_NAME"].String()
		if !inspectTableRe.MatchString(name) || seen[name] {
			continue
		}
		seen[name] = true
		out = append(out, name)
	}
	return out, nil
}

// columnMeta 列元数据（Inspect 内部使用）。
// 字段名/类型/注释/可空均来自数据库系统视图，非用户输入。
type columnMeta struct {
	Name      string
	DataType  string
	Comment   string
	Nullable  bool
	IsPrimary bool
}

// queryTableComment 查表注释；表不存在返回中文错误。
// 兼容 MySQL（INFORMATION_SCHEMA.TABLES）与 DM8（ALL_TAB_COMMENTS，Oracle 系）。
func (e *Engine) queryTableComment(ctx context.Context, table string) (string, error) {
	dbType := e.db.GetConfig().Type
	if dbType == dbTypeMySQL {
		schema := e.db.GetSchema()
		rows, err := e.db.GetAll(ctx,
			"SELECT TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
			schema, table)
		if err != nil {
			return "", gerror.Wrapf(err, "表结构检查失败：查询表 %q 注释出错", table)
		}
		if len(rows) == 0 {
			return "", gerror.Newf("表结构检查失败：表 %q 不存在（当前库 %q）", table, schema)
		}
		return rows[0]["TABLE_COMMENT"].String(), nil
	}

	// 默认按 DM8（Oracle 系）处理：表名/库名统一大写比较。
	owner := strings.ToUpper(e.db.GetSchema())
	rows, err := e.db.GetAll(ctx,
		"SELECT COMMENTS FROM ALL_TAB_COMMENTS WHERE TABLE_NAME = ? AND OWNER = ?",
		strings.ToUpper(table), owner)
	if err != nil {
		return "", gerror.Wrapf(err, "表结构检查失败：查询表 %q 注释出错", table)
	}
	if len(rows) == 0 {
		return "", gerror.Newf("表结构检查失败：表 %q 不存在（当前库 %q）", table, owner)
	}
	return rows[0]["COMMENTS"].String(), nil
}

// queryTableColumns 查列元数据。
// MySQL 走 INFORMATION_SCHEMA.COLUMNS；DM8 走 ALL_TAB_COLUMNS + ALL_COL_COMMENTS（按 COLUMN_ID 排序）。
func (e *Engine) queryTableColumns(ctx context.Context, table string) ([]columnMeta, error) {
	dbType := e.db.GetConfig().Type
	if dbType == dbTypeMySQL {
		rows, err := e.db.GetAll(ctx,
			"SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT, IS_NULLABLE, COLUMN_KEY "+
				"FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
			e.db.GetSchema(), table)
		if err != nil {
			return nil, gerror.Wrapf(err, "表结构检查失败：查询表 %q 列信息出错", table)
		}
		out := make([]columnMeta, 0, len(rows))
		for _, r := range rows {
			out = append(out, columnMeta{
				Name:      r["COLUMN_NAME"].String(),
				DataType:  strings.ToLower(r["DATA_TYPE"].String()),
				Comment:   r["COLUMN_COMMENT"].String(),
				Nullable:  !strings.EqualFold(r["IS_NULLABLE"].String(), "NO"),
				IsPrimary: strings.EqualFold(r["COLUMN_KEY"].String(), "PRI"),
			})
		}
		return out, nil
	}

	// DM8（Oracle 系）。
	owner := strings.ToUpper(e.db.GetSchema())
	rows, err := e.db.GetAll(ctx,
		"SELECT COLUMN_NAME, DATA_TYPE, NULLABLE, DATA_DEFAULT FROM ALL_TAB_COLUMNS "+
			"WHERE TABLE_NAME = ? AND OWNER = ? ORDER BY COLUMN_ID",
		strings.ToUpper(table), owner)
	if err != nil {
		return nil, gerror.Wrapf(err, "表结构检查失败：查询表 %q 列信息出错", table)
	}
	out := make([]columnMeta, 0, len(rows))
	for _, r := range rows {
		out = append(out, columnMeta{
			Name:     r["COLUMN_NAME"].String(),
			DataType: strings.ToLower(r["DATA_TYPE"].String()),
			Nullable: !strings.EqualFold(r["NULLABLE"].String(), "N"),
		})
	}

	// 列注释（ALL_COL_COMMENTS），按列名回填。
	commentRows, err := e.db.GetAll(ctx,
		"SELECT COLUMN_NAME, COMMENTS FROM ALL_COL_COMMENTS WHERE TABLE_NAME = ? AND OWNER = ?",
		strings.ToUpper(table), owner)
	if err == nil {
		commentByCol := make(map[string]string, len(commentRows))
		for _, r := range commentRows {
			commentByCol[r["COLUMN_NAME"].String()] = r["COMMENTS"].String()
		}
		for i := range out {
			out[i].Comment = commentByCol[out[i].Name]
		}
	}
	return out, nil
}

// mapColumnType 数据库类型 → DSL 类型（string|number|datetime|date）。
// 未知类型一律归为 string（保守，避免 AI 误用）。
func mapColumnType(dbType string) string {
	switch {
	case strings.Contains(dbType, "int") || strings.Contains(dbType, "decimal") ||
		strings.Contains(dbType, "numeric") || strings.Contains(dbType, "number") ||
		strings.Contains(dbType, "float") || strings.Contains(dbType, "double") ||
		strings.Contains(dbType, "real") || strings.Contains(dbType, "money") ||
		strings.Contains(dbType, "smallmoney"):
		return "number"
	case strings.Contains(dbType, "datetime") || strings.Contains(dbType, "timestamp"):
		return "datetime"
	case strings.Contains(dbType, "date"):
		return "date"
	default:
		return "string"
	}
}

// isNumericType 判断数据库类型是否数值型（用于推断 measure/dimension 角色）。
func isNumericType(dbType string) bool {
	switch {
	case strings.Contains(dbType, "int"), strings.Contains(dbType, "decimal"),
		strings.Contains(dbType, "numeric"), strings.Contains(dbType, "number"),
		strings.Contains(dbType, "float"), strings.Contains(dbType, "double"),
		strings.Contains(dbType, "real"), strings.Contains(dbType, "money"),
		strings.Contains(dbType, "smallmoney"):
		return true
	default:
		return false
	}
}
