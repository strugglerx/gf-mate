package queryengine

import (
	"context"
	"testing"

	"github.com/strugglerx/gf-mate/internal/model"
)

// ExecuteSQL 端到端测试（sqlite 真执行）。
// testEngine 注册了 miniapp_project 表（5 行数据）。

func TestExecuteSQLDisabledByDefault(t *testing.T) {
	eng, _ := testEngine(t) // RawSQL = nil
	if _, err := eng.ExecuteSQL(context.Background(), "SELECT 1"); err == nil {
		t.Fatal("should reject when rawSQL disabled")
	}
}

func TestExecuteSQLSimpleSelect(t *testing.T) {
	eng, _ := testEngine(t)
	eng.cfg.RawSQL = &RawSQLConfig{Enabled: true, MaxRows: 100, TimeoutSec: 5}
	res, err := eng.ExecuteSQL(context.Background(), "SELECT district, COUNT(*) AS cnt FROM miniapp_project GROUP BY district ORDER BY cnt DESC")
	if err != nil {
		t.Fatalf("ExecuteSQL() error = %v", err)
	}
	if len(res.Rows) != 3 {
		t.Fatalf("expected 3 districts, got %d", len(res.Rows))
	}
	if res.Rows[0]["cnt"] == nil {
		t.Fatalf("expected cnt column, got %v", res.Rows[0])
	}
}

func TestExecuteSQLAutoLimit(t *testing.T) {
	eng, _ := testEngine(t)
	eng.cfg.RawSQL = &RawSQLConfig{Enabled: true, MaxRows: 2, TimeoutSec: 5}
	res, err := eng.ExecuteSQL(context.Background(), "SELECT id FROM miniapp_project") // 无 LIMIT → 强制 LIMIT 2
	if err != nil {
		t.Fatalf("ExecuteSQL() error = %v", err)
	}
	if len(res.Rows) != 2 {
		t.Fatalf("expected auto-limit to 2 rows, got %d", len(res.Rows))
	}
}

func TestExecuteSQLRejectsWrite(t *testing.T) {
	eng, _ := testEngine(t)
	eng.cfg.RawSQL = &RawSQLConfig{Enabled: true, MaxRows: 100, TimeoutSec: 5}
	if _, err := eng.ExecuteSQL(context.Background(), "DELETE FROM miniapp_project"); err == nil {
		t.Fatal("should reject DELETE")
	}
	// 验证数据没被删。
	res, err := eng.ExecuteSQL(context.Background(), "SELECT COUNT(*) AS c FROM miniapp_project")
	if err != nil {
		t.Fatalf("count after rejected delete: %v", err)
	}
	if res.Rows[0]["c"] == 0 {
		t.Fatal("data was deleted despite guard!")
	}
}

func TestExecuteSQLRejectsUnknownTable(t *testing.T) {
	eng, _ := testEngine(t)
	eng.cfg.RawSQL = &RawSQLConfig{Enabled: true, MaxRows: 100, TimeoutSec: 5}
	if _, err := eng.ExecuteSQL(context.Background(), "SELECT * FROM sqlite_master"); err == nil {
		t.Fatal("should reject table outside whitelist (sqlite_master)")
	}
}

func TestExecuteSQLJoinCTE(t *testing.T) {
	eng, reg := testEngine(t)
	eng.cfg.RawSQL = &RawSQLConfig{Enabled: true, MaxRows: 100, TimeoutSec: 5}
	// 注册第二张表进白名单。
	if err := reg.Register(model.Dataset{
		Name:  "contractor",
		Table: "miniapp_contractor",
		Fields: []model.Field{
			{Name: "id", Role: model.RoleDimension, Type: "number"},
			{Name: "name", Role: model.RoleDimension, Type: "string"},
		},
	}); err != nil {
		t.Fatalf("Register contractor: %v", err)
	}
	// CTE + JOIN（sqlite 支持）。
	sql := `WITH t AS (SELECT district, COUNT(*) AS cnt FROM miniapp_project GROUP BY district)
	        SELECT t.district, t.cnt FROM t ORDER BY t.cnt DESC LIMIT 2`
	res, err := eng.ExecuteSQL(context.Background(), sql)
	if err != nil {
		t.Fatalf("CTE query error = %v", err)
	}
	if len(res.Rows) != 2 {
		t.Fatalf("expected 2 rows, got %d", len(res.Rows))
	}
}
