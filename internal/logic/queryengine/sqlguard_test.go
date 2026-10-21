package queryengine

import (
	"strings"
	"testing"
)

// guard 测试通用：白名单表 miniapp_project / miniapp_contractor。
var guardTables = map[string]bool{
	"miniapp_project":    true,
	"miniapp_contractor": true,
}

func TestGuardSQLAllowsSimpleSelect(t *testing.T) {
	out, err := guardSQL("SELECT status, COUNT(*) FROM miniapp_project GROUP BY status", guardTables, 500)
	if err != nil {
		t.Fatalf("simple select rejected: %v", err)
	}
	if !strings.Contains(out, "LIMIT 500") {
		t.Errorf("expected auto LIMIT, got %q", out)
	}
}

func TestGuardSQLKeepsUserLimit(t *testing.T) {
	out, err := guardSQL("SELECT * FROM miniapp_project LIMIT 10", guardTables, 500)
	if err != nil {
		t.Fatalf("select with limit rejected: %v", err)
	}
	if strings.Count(strings.ToUpper(out), "LIMIT") != 1 {
		t.Errorf("should not append extra LIMIT, got %q", out)
	}
}

func TestGuardSQLAllowsCTEAndJoin(t *testing.T) {
	sql := `WITH t AS (SELECT status, COUNT(*) c FROM miniapp_project GROUP BY status)
	        SELECT * FROM t JOIN miniapp_contractor ON 1=1 LIMIT 5`
	if _, err := guardSQL(sql, guardTables, 500); err != nil {
		t.Fatalf("CTE+JOIN rejected: %v", err)
	}
}

func TestGuardSQLAllowsCommaTables(t *testing.T) {
	sql := "SELECT p.id FROM miniapp_project p, miniapp_contractor c WHERE p.contractor_id = c.id"
	if _, err := guardSQL(sql, guardTables, 500); err != nil {
		t.Fatalf("comma join rejected: %v", err)
	}
}

func TestGuardSQLAllowsSchemaQualified(t *testing.T) {
	if _, err := guardSQL("SELECT * FROM XIAOSAN.miniapp_project", guardTables, 500); err != nil {
		t.Fatalf("schema-qualified table rejected: %v", err)
	}
}

func TestGuardSQLRejectsNonSelect(t *testing.T) {
	cases := []string{
		"UPDATE miniapp_project SET status = 1",
		"DELETE FROM miniapp_project",
		"INSERT INTO miniapp_project VALUES (1)",
		"DROP TABLE miniapp_project",
		"TRUNCATE TABLE miniapp_project",
		"CREATE TABLE x (id INT)",
		"ALTER TABLE miniapp_project ADD c INT",
		"GRANT SELECT ON miniapp_project TO u",
		"CALL some_proc()",
		"BEGIN",
		"COMMIT",
		"SET @x = 1",
		"SELECT * FROM miniapp_project INTO OUTFILE '/tmp/x'",
		"LOCK TABLES miniapp_project WRITE",
	}
	for _, sql := range cases {
		if _, err := guardSQL(sql, guardTables, 500); err == nil {
			t.Errorf("should reject %q", sql)
		}
	}
}

func TestGuardSQLRejectsMultiStatement(t *testing.T) {
	sql := "SELECT 1 FROM miniapp_project; DELETE FROM miniapp_project"
	if _, err := guardSQL(sql, guardTables, 500); err == nil {
		t.Fatal("should reject multi-statement")
	}
	// 尾分号的合法单语句应通过。
	if _, err := guardSQL("SELECT 1 FROM miniapp_project;", guardTables, 500); err != nil {
		t.Fatalf("trailing semicolon rejected: %v", err)
	}
}

func TestGuardSQLRejectsUnknownTable(t *testing.T) {
	cases := []string{
		"SELECT * FROM users",
		"SELECT * FROM miniapp_secret",
		"SELECT * FROM miniapp_project JOIN orders ON 1=1",
		"SELECT * FROM XIAOSAN.users",
		"SELECT * FROM miniapp_project p, other_table o",
	}
	for _, sql := range cases {
		if _, err := guardSQL(sql, guardTables, 500); err == nil {
			t.Errorf("should reject unknown table in %q", sql)
		}
	}
}

func TestGuardSQLRejectsKeywordInSubquery(t *testing.T) {
	// 子查询里的写关键字同样被拦截。
	sql := "SELECT * FROM (DELETE FROM miniapp_project) t"
	if _, err := guardSQL(sql, guardTables, 500); err == nil {
		t.Fatal("should reject delete in subquery")
	}
}

func TestGuardSQLCommentStripping(t *testing.T) {
	// 注释里的表名/关键字不参与校验（剔除后更安全：注释藏不了任何东西）。
	sql := "SELECT * FROM miniapp_project /* DELETE FROM users */"
	if _, err := guardSQL(sql, guardTables, 500); err != nil {
		t.Fatalf("comment content should be stripped: %v", err)
	}
	// 行注释同理。
	sql = "SELECT * FROM miniapp_project -- DROP TABLE users"
	if _, err := guardSQL(sql, guardTables, 500); err != nil {
		t.Fatalf("line comment should be stripped: %v", err)
	}
}

func TestGuardSQLSubqueryLimitNotTopLevel(t *testing.T) {
	// 子查询里的 LIMIT 不算顶层，外层仍要追加。
	out, err := guardSQL("SELECT * FROM (SELECT * FROM miniapp_project LIMIT 10) t", guardTables, 500)
	if err != nil {
		t.Fatalf("subquery rejected: %v", err)
	}
	if !strings.HasSuffix(strings.ToUpper(out), "LIMIT 500") {
		t.Errorf("expected top-level LIMIT appended, got %q", out)
	}
}

func TestGuardSQLCaseInsensitive(t *testing.T) {
	if _, err := guardSQL("select * from MINIAPP_PROJECT", guardTables, 500); err != nil {
		t.Fatalf("lowercase select rejected: %v", err)
	}
	if _, err := guardSQL("sElEcT * FrOm miniapp_project", guardTables, 500); err != nil {
		t.Fatalf("mixed case rejected: %v", err)
	}
	if _, err := guardSQL("update miniapp_project set x=1", guardTables, 500); err == nil {
		t.Fatal("lowercase update should be rejected")
	}
}

func TestGuardSQLEmptyAndGarbage(t *testing.T) {
	for _, sql := range []string{"", "   ", ";", "123"} {
		if _, err := guardSQL(sql, guardTables, 500); err == nil {
			t.Errorf("should reject %q", sql)
		}
	}
}

func TestGuardSQLWordBoundary(t *testing.T) {
	// 字段名含关键字子串（如 created_at 含 "create"）不应误伤。
	sql := "SELECT created_at FROM miniapp_project"
	if _, err := guardSQL(sql, guardTables, 500); err != nil {
		t.Fatalf("created_at should not trigger keyword: %v", err)
	}
	// status_update 之类的列名同理。
	sql = "SELECT status_update FROM miniapp_project"
	if _, err := guardSQL(sql, guardTables, 500); err != nil {
		t.Fatalf("status_update should not trigger keyword: %v", err)
	}
}

func TestGuardSQLExplain(t *testing.T) {
	// EXPLAIN SELECT 放行，且不追加 LIMIT。
	out, err := guardSQL("EXPLAIN SELECT * FROM miniapp_project WHERE status = 'construction'", guardTables, 500)
	if err != nil {
		t.Fatalf("EXPLAIN SELECT should pass: %v", err)
	}
	if strings.Contains(strings.ToUpper(out), "LIMIT 500") {
		t.Fatalf("EXPLAIN should not get LIMIT appended: %s", out)
	}
	// 小写 explain 同样放行。
	if _, err := guardSQL("explain select id from miniapp_project", guardTables, 500); err != nil {
		t.Fatalf("lowercase explain should pass: %v", err)
	}
	// EXPLAIN 后必须是 SELECT/WITH。
	if _, err := guardSQL("EXPLAIN DELETE FROM miniapp_project", guardTables, 500); err == nil {
		t.Fatal("EXPLAIN DELETE should be rejected")
	}
	if _, err := guardSQL("EXPLAIN UPDATE miniapp_project SET status = 'x'", guardTables, 500); err == nil {
		t.Fatal("EXPLAIN UPDATE should be rejected")
	}
	// EXPLAIN 内层表白名单照常生效。
	if _, err := guardSQL("EXPLAIN SELECT * FROM secret_table", guardTables, 500); err == nil {
		t.Fatal("EXPLAIN on non-whitelisted table should be rejected")
	}
	// EXPLAINANALYZE 之类的伪前缀（词边界）不放行。
	if _, err := guardSQL("EXPLAINANALYZE SELECT * FROM miniapp_project", guardTables, 500); err == nil {
		t.Fatal("EXPLAINANALYZE (no word boundary) should be rejected")
	}
	// EXPLAIN + CTE 放行。
	if _, err := guardSQL("EXPLAIN WITH t AS (SELECT id FROM miniapp_project) SELECT * FROM t", guardTables, 500); err != nil {
		t.Fatalf("EXPLAIN with CTE should pass: %v", err)
	}
}
