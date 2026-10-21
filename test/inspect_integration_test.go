//go:build integration

// M1-3 Inspect 表结构反推集成测试：连 DM8 对 miniapp_project 表执行 Inspect，
// 断言生成的 Dataset 草稿字段数 > 10 且包含 project_name 字段。
// 运行方式：DQ_DM_TEST=1 go test ./test/ -run TestInspect -v -tags integration -timeout 120s
package test

import (
	"context"
	"testing"
	"time"

	"github.com/gogf/gf/v2/database/gdb"

	"github.com/strugglerx/gf-mate/internal/logic/queryengine"
	"github.com/strugglerx/gf-mate/internal/logic/registry"
)

// TestInspectMiniappProject 对 miniapp_project 表执行 Inspect，验证字段反推。
func TestInspectMiniappProject(t *testing.T) {
	if !dmEnabled() {
		t.Skip("设置 DQ_DM_TEST=1 启用 DM8 集成测试")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	db, err := gdb.New(gdb.ConfigNode{Type: "dm", Link: dmLink})
	if err != nil {
		t.Fatalf("连接失败：%v", err)
	}
	reg := registry.New()
	eng := queryengine.New(db, reg, &queryengine.Config{
			RawSQL: &queryengine.RawSQLConfig{Enabled: true, MaxRows: 100, TimeoutSec: 30},
		})

	ds, err := eng.Inspect(ctx, "miniapp_project")
	if err != nil {
		t.Fatalf("Inspect miniapp_project 失败：%v", err)
	}

	// 断言 1：字段数 > 10。
	if len(ds.Fields) <= 10 {
		t.Fatalf("字段数应为 > 10，实际 %d", len(ds.Fields))
	}
	t.Logf("miniapp_project 反推字段数：%d", len(ds.Fields))

	// 断言 2：包含 project_name 字段。
	found := false
	for _, f := range ds.Fields {
		if f.Name == "project_name" {
			found = true
			t.Logf("project_name 字段：Role=%s Type=%s Label=%s", f.Role, f.Type, f.Label)
			break
		}
	}
	if !found {
		t.Fatal("生成的 Dataset 应包含 project_name 字段")
	}

	// 断言 3：表名/标签正确。
	if ds.Name != "miniapp_project" {
		t.Errorf("Dataset.Name 应为 miniapp_project，实际 %q", ds.Name)
	}
	if ds.Table != "miniapp_project" {
		t.Errorf("Dataset.Table 应为 miniapp_project，实际 %q", ds.Table)
	}
	if ds.Label == "" {
		t.Log("警告：miniapp_project 表注释为空（Label 回退为表名）")
	} else {
		t.Logf("表注释：%s", ds.Label)
	}

	// 断言 4：数字类型字段被推断为 measure 且带聚合函数。
	measureCount := 0
	for _, f := range ds.Fields {
		if f.Role == "measure" {
			measureCount++
			if len(f.Aggs) == 0 {
				t.Errorf("measure 字段 %s 应有 Aggs", f.Name)
			}
		}
	}
	t.Logf("measure 字段数：%d", measureCount)
	if measureCount == 0 {
		t.Error("数字类型字段应被推断为 measure")
	}

	// 断言 5：Inspect 后可直接 Register。
	if err := reg.Register(*ds); err != nil {
		t.Fatalf("Inspect 结果注册失败：%v", err)
	}
	t.Log("Inspect 结果注册成功")
}
