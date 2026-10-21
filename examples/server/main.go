// gf-mate 演示宿主（demo host）。
//
// 启动方式：
//
//	# 1) 设置环境变量（可选，有默认值）
//	export DQ_DM_LINK='dm:user:pass@tcp(host:5236)/db?charset=utf8&compatibleMode=Mysql'  # 必填，无默认值
//	export DQ_LLM_KEY='your-key'          # 不设置则 AI 助手关闭
//	export DQ_LLM_BASE='https://eaichat.ctyun.cn/ai/platform/v2/cp'
//	export DQ_LLM_MODEL='deepseek-v4-flash-0731-oc'
//
//	# 2) 运行
//	go run ./examples/server
//
//	# 3) 访问
//	浏览器打开 http://localhost:8200/dq/ 查看前端页面。
//
// iframe 嵌入方式（宿主页面）：
//
//	<iframe src="http://localhost:8200/dq/" width="100%" height="800" frameborder="0"></iframe>
//
// 鉴权说明：demo 不做鉴权，仅演示插件能力；生产宿主应在 dq.Bind 的 group 上挂自己的鉴权中间件。
package main

import (
	"context"
	"os"

	_ "github.com/gogf/gf/contrib/drivers/dm/v2"
	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/glog"

	dq "github.com/strugglerx/gf-mate"
	"github.com/strugglerx/gf-mate/internal/model"
)

// 环境变量默认值。
const (
	defaultLLMBase  = "https://eaichat.ctyun.cn/ai/platform/v2/cp"
	defaultLLMModel = "deepseek-v4-flash-0731-oc"
)

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func main() {
	ctx := context.Background()

	// ---- 1) 配置 DM 数据源 ----
	dmLink := os.Getenv("DQ_DM_LINK")
	if dmLink == "" {
		glog.Fatalf(ctx, "缺少数据库连接：请设置环境变量 DQ_DM_LINK（如 dm:user:pass@tcp(host:5236)/db）")
	}
	db, err := gdb.New(gdb.ConfigNode{
		Type: "dm",
		Link: dmLink,
	})
	if err != nil {
		glog.Fatalf(ctx, "连接 DM8 失败：%v", err)
	}

	// ---- 2) 配置插件 ----
	llmKey := os.Getenv("DQ_LLM_KEY")
	var enableThinking *bool
	if envThinking := os.Getenv("DQ_ENABLE_THINKING"); envThinking != "" {
		b := envThinking == "true" || envThinking == "1"
		enableThinking = &b
	}
	// 模式开关：DQ_MODE=all 时全库自动注册（排除系统/垃圾表），否则白名单只注册 project。
	useAllMode := os.Getenv("DQ_MODE") == "all"
	cfg := &dq.Config{
		Mode: func() string {
			if useAllMode {
				return "all"
			}
			return dq.DefaultMode
		}(),
		ExcludeTables: []string{
			"miniapp_dead_%", "miniapp_schema_migration", "demo",
		},
		Assistant: dq.AssistantConfig{
			Enabled:             llmKey != "",
			BaseURL:             envOr("DQ_LLM_BASE", defaultLLMBase),
			APIKey:              llmKey,
			Model:               envOr("DQ_LLM_MODEL", defaultLLMModel),
			MaxToolCallsPerTurn: 8,
			RequestTimeoutSec:   120,
			MaxContextChars:     24000,
			EnableThinking:      enableThinking,
			ReasoningEffort:     os.Getenv("DQ_REASONING_EFFORT"),
		},
	}
	if err := dq.Init(db, cfg); err != nil {
		glog.Fatalf(ctx, "初始化插件失败：%v", err)
	}

	// ---- 3) 注册数据集（白名单模式时显式注册；all 模式已在 Init 内全量注册）----
	if !useAllMode {
		if err := dq.Register(projectDataset()); err != nil {
			glog.Fatalf(ctx, "注册数据集失败：%v", err)
		}
	}

	// ---- 4) 启动 HTTP server，挂载插件路由 ----
	s := g.Server()
	s.SetPort(8200)
	s.SetServerRoot("") // 不启用默认静态目录，静态资源由插件挂载

	// 挂载到 /dq 组（生产宿主可在此加鉴权中间件）。
	s.Group("/dq", func(group *ghttp.RouterGroup) {
		if err := dq.Bind(ctx, group, s); err != nil {
			glog.Fatalf(ctx, "挂载插件路由失败：%v", err)
		}
	})

	// 根路径重定向到 /dq/，方便直接打开 localhost:8200。
	s.BindHandler("/", func(r *ghttp.Request) {
		r.Response.RedirectTo("/dq/")
	})

	glog.Infof(ctx, "gf-mate demo 启动：http://localhost:8200/dq/")
	s.Run()
}

// projectDataset 注册的演示数据集（字段定义与 test/dm_integration_test.go 保持一致）。
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
