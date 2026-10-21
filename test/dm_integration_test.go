//go:build integration

// DM8 真实数据库集成测试。
// 运行方式：DQ_DM_TEST=1 DQ_DM_LINK='dm:user:pass@tcp(host:5236)/db' go test ./test/ -run TestDM -v -tags integration -timeout 120s
// 连接串只从环境变量 DQ_DM_LINK 读取，绝不硬编码（安全红线）。
package test

import (
	"context"
	"os"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/dm/v2"

	"github.com/gogf/gf/v2/database/gdb"

	"github.com/strugglerx/gf-mate/internal/logic/queryengine"
	"github.com/strugglerx/gf-mate/internal/logic/registry"
	"github.com/strugglerx/gf-mate/internal/model"
)

var dmLink = os.Getenv("DQ_DM_LINK")

func dmEnabled() bool {
	return os.Getenv("DQ_DM_TEST") == "1" && dmLink != ""
}

func projectDataset() model.Dataset {
	return model.Dataset{
		Name:  "project",
		Table: "miniapp_project",
		Label: "工程项目",
		Description: "限额以下工程备案项目主表。status：pendingFill=待填报, aiReview=AI资料核查, " +
			"propertyConfirm=待物业确认, streetAccept=待街道受理, siteCheck=待现场审核, rejected=已驳回, " +
			"refiling=重新填报, construction=施工中, rectification=整改中, cancelled=已注销。" +
			"district_code：440303000=罗湖区, 440304000=福田区。",
		Fields: []model.Field{
			{Name: "id", Label: "项目ID", Role: model.RoleMeasure, Type: "string", Aggs: []string{"count"}},
			{Name: "name", Label: "项目名称", Role: model.RoleDimension, Type: "string"},
			{Name: "status", Label: "备案状态", Role: model.RoleDimension, Type: "enum",
				Enum: []model.EnumItem{
					{Value: "pendingFill", Label: "待填报"},
					{Value: "aiReview", Label: "AI资料核查"},
					{Value: "propertyConfirm", Label: "待物业确认"},
					{Value: "streetAccept", Label: "待街道受理"},
					{Value: "siteCheck", Label: "待现场审核"},
					{Value: "rejected", Label: "已驳回"},
					{Value: "refiling", Label: "重新填报"},
					{Value: "construction", Label: "施工中"},
					{Value: "rectification", Label: "整改中"},
					{Value: "cancelled", Label: "已注销"},
				}},
			{Name: "district_code", Label: "行政区", Role: model.RoleDimension, Type: "enum",
				Enum: []model.EnumItem{
					{Value: "440303000", Label: "罗湖区"},
					{Value: "440304000", Label: "福田区"},
				}},
			{Name: "street_community", Label: "街道社区", Role: model.RoleDimension, Type: "string"},
			{Name: "contractor", Label: "施工单位", Role: model.RoleDimension, Type: "string"},
			{Name: "project_type", Label: "工程类型", Role: model.RoleDimension, Type: "string"},
			{Name: "risk", Label: "风险等级", Role: model.RoleDimension, Type: "string"},
			{Name: "created_at", Label: "备案时间", Role: model.RoleDimension, Type: "datetime"},
		},
	}
}

// TestDM8Connection 验证 DM8 连接与基础查询。
func TestDM8Connection(t *testing.T) {
	if !dmEnabled() {
		t.Skip("设置 DQ_DM_TEST=1 启用 DM8 集成测试")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	db, err := gdb.New(gdb.ConfigNode{Type: "dm", Link: dmLink})
	if err != nil {
		t.Fatalf("连接失败：%v", err)
	}
	cnt, err := db.Model("miniapp_project").Ctx(ctx).Count()
	if err != nil {
		t.Fatalf("查询 miniapp_project 数量失败：%v", err)
	}
	t.Logf("miniapp_project 总行数：%d", cnt)
	if cnt == 0 {
		t.Log("警告：表为空，后续聚合测试可能无数据")
	}
}

// TestDM8EngineQuery 用真实引擎对 DM8 执行 DSL 查询（聚合/过滤/明细/like/between）。
func TestDM8EngineQuery(t *testing.T) {
	if !dmEnabled() {
		t.Skip("设置 DQ_DM_TEST=1 启用 DM8 集成测试")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()

	db, err := gdb.New(gdb.ConfigNode{Type: "dm", Link: dmLink})
	if err != nil {
		t.Fatalf("连接失败：%v", err)
	}

	reg := registry.New()
	if err := reg.Register(projectDataset()); err != nil {
		t.Fatalf("注册数据集失败：%v", err)
	}
	eng := queryengine.New(db, reg, &queryengine.Config{
		RawSQL: &queryengine.RawSQLConfig{Enabled: true, MaxRows: 100, TimeoutSec: 30},
	})

	// 批量提交多条只读 SQL（模拟 AI 的 sql_query 工具调用）。
	batch, err := eng.ExecuteSQLBatch(ctx, []string{
		// 1. 按状态分组统计项目数。
		"SELECT status, COUNT(id) AS count_id FROM miniapp_project GROUP BY status ORDER BY count_id DESC",
		// 2. 罗湖区按街道社区分组。
		"SELECT street_community, COUNT(id) AS count_id FROM miniapp_project WHERE district_code = '440303000' " +
			"GROUP BY street_community ORDER BY count_id DESC",
		// 3. 施工中项目明细。
		"SELECT name, contractor, created_at FROM miniapp_project WHERE status = 'construction' " +
			"ORDER BY created_at DESC",
		// 4. like 模糊查询。
		"SELECT id, name FROM miniapp_project WHERE name LIKE '%工程%' LIMIT 5",
		// 5. 时间范围 + 聚合。
		"SELECT COUNT(id) AS c FROM miniapp_project WHERE created_at BETWEEN '2025-01-01 00:00:00' AND '2026-12-31 23:59:59'",
	})
	if err != nil {
		t.Fatalf("批量执行失败：%v", err)
	}
	for _, r := range batch {
		if r.Error != "" {
			t.Errorf("第 %d 条失败：%s", r.Index, r.Error)
			continue
		}
		t.Logf("第 %d 条：%d 行，列 %v", r.Index, len(r.Result.Rows), r.Result.Columns)
		for i, row := range r.Result.Rows {
			if i >= 3 {
				break
			}
			t.Logf("  %v", row)
		}
	}

	// 门禁验证：写语句必须被拒。
	if _, err := eng.ExecuteSQL(ctx, "DELETE FROM miniapp_project"); err == nil {
		t.Fatal("DELETE 应被门禁拦截")
	}
	if _, err := eng.ExecuteSQL(ctx, "SELECT * FROM miniapp_user"); err == nil {
		t.Fatal("未注册表应被白名单拦截")
	}
	t.Log("门禁拦截 OK")
}
