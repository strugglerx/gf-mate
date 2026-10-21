package queryengine

import (
	"context"
	"path/filepath"
	"strings"
	"testing"

	_ "github.com/gogf/gf/contrib/drivers/sqlite/v2"

	"github.com/gogf/gf/v2/database/gdb"

	"github.com/strugglerx/gf-mate/internal/logic/registry"
	"github.com/strugglerx/gf-mate/internal/model"
)

// testEngine 构建基于 sqlite 临时文件的测试引擎（表白名单：miniapp_project）。
func testEngine(t *testing.T) (*Engine, *registry.Registry) {
	t.Helper()
	dir := t.TempDir()
	node := gdb.ConfigNode{
		Type: "sqlite",
		Name: filepath.ToSlash(filepath.Join(dir, "test.db")),
	}
	db, err := gdb.New(node)
	if err != nil {
		t.Fatalf("gdb.New error = %v", err)
	}
	_, err = db.Exec(context.Background(), `
		CREATE TABLE miniapp_project (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			district TEXT,
			status INTEGER,
			amount REAL,
			created_at TEXT
		)`)
	if err != nil {
		t.Fatalf("CREATE TABLE error = %v", err)
	}
	_, err = db.Exec(context.Background(), `
		INSERT INTO miniapp_project (district, status, amount, created_at) VALUES
		('福田区', 1, 100.5, '2024-01-05 10:00:00'),
		('福田区', 2, 200.0, '2024-02-10 11:00:00'),
		('南山区', 1, 300.25, '2024-03-15 12:00:00'),
		('南山区', 2, 400.75, '2024-04-20 13:00:00'),
		('宝安区', 1, 500.0, '2024-05-25 14:00:00')`)
	if err != nil {
		t.Fatalf("INSERT error = %v", err)
	}

	reg := registry.New()
	ds := model.Dataset{
		Name:        "project_record",
		Table:       "miniapp_project",
		Label:       "工程备案",
		Description: "工程备案记录",
		Fields: []model.Field{
			{Name: "id", Label: "ID", Role: model.RoleDimension, Type: "number"},
			{Name: "district", Label: "区", Role: model.RoleDimension, Type: "string"},
			{Name: "status", Label: "状态", Role: model.RoleDimension, Type: "enum"},
			{Name: "amount", Label: "金额", Role: model.RoleMeasure, Type: "number",
				Aggs: []string{"sum", "avg", "max", "min", "count"}},
			{Name: "created_at", Label: "创建时间", Role: model.RoleDimension, Type: "datetime"},
		},
	}
	if err := reg.Register(ds); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	eng := New(db, reg, &Config{RawSQL: nil})
	return eng, reg
}

func TestDescribeDialect(t *testing.T) {
	cases := []struct {
		driver, version, wantSub string
	}{
		{"dm", "DM Database Server 64 V8", "达梦 DM"},
		{"dm", "", "Oracle 风格语法"},
		{"mysql", "8.0.30", "MySQL 语法"},
		{"pgsql", "", "PostgreSQL 语法"},
		{"sqlite", "", "SQLite 语法"},
		{"mssql", "", "SQL Server 语法"},
		{"oracle", "", "Oracle 语法"},
		{"unknowndb", "x1.2", "unknowndb"},
		{"", "", "未知类型"},
	}
	for _, c := range cases {
		got := describeDialect(c.driver, c.version)
		if !strings.Contains(got, c.wantSub) {
			t.Errorf("describeDialect(%q,%q)=%q, want contains %q", c.driver, c.version, got, c.wantSub)
		}
	}
}
