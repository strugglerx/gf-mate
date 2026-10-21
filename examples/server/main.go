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
//	# 多数据源演示（DQ_MULTI=1）：两个 MySQL 库（默认源 + go 源）
//	export DQ_MULTI=1
//	export DQ_MYSQL_LINK='mysql:user:pass@tcp(host:3306)/db1?loc=Local'   # 默认源
//	export DQ_MYSQL_GO_LINK='mysql:user:pass@tcp(host:3306)/db2?loc=Local' # go 源（dq.AddSource("go", ...)）
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
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
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

	// ---- 0) 公共配置 ----
	llmKey := os.Getenv("DQ_LLM_KEY")
	var enableThinking *bool
	if envThinking := os.Getenv("DQ_ENABLE_THINKING"); envThinking != "" {
		b := envThinking == "true" || envThinking == "1"
		enableThinking = &b
	}

	// ---- 1) 配置数据源 ----
	useMulti := os.Getenv("DQ_MULTI") == "1"
	var db gdb.DB
	var err error
	if useMulti {
		// 多源演示：默认源（mqcloud_experts）+ go 源（mqcloud_exports_go）。
		dbLink := os.Getenv("DQ_MYSQL_LINK")
		goLink := os.Getenv("DQ_MYSQL_GO_LINK")
		if dbLink == "" || goLink == "" {
			glog.Fatalf(ctx, "多源模式需要设置 DQ_MYSQL_LINK 与 DQ_MYSQL_GO_LINK 两个环境变量")
		}
		db, err = gdb.New(gdb.ConfigNode{Type: "mysql", Link: dbLink})
		if err != nil {
			glog.Fatalf(ctx, "连接默认源失败：%v", err)
		}
		goDB, err2 := gdb.New(gdb.ConfigNode{Type: "mysql", Link: goLink})
		if err2 != nil {
			glog.Fatalf(ctx, "连接 go 源失败：%v", err2)
		}
		if err != nil {
			glog.Fatalf(ctx, "连接 go 源失败：%v", err)
		}
		if err := dq.Init(db, multiSourceConfig(llmKey, enableThinking)); err != nil {
			glog.Fatalf(ctx, "初始化插件失败：%v", err)
		}
		// 注册命名数据源：数据集声明 Source: "go" 即自动路由。
		if err := dq.AddSource("go", goDB); err != nil {
			glog.Fatalf(ctx, "注册 go 数据源失败：%v", err)
		}
		for _, ds := range multiSourceDatasets() {
			if err := dq.Register(ds); err != nil {
				glog.Fatalf(ctx, "注册数据集 %s 失败：%v", ds.Name, err)
			}
		}
		glog.Infof(ctx, "多源模式：默认源 + go 源，已注册 %d 个数据集", len(multiSourceDatasets()))
	} else {
		dmLink := os.Getenv("DQ_DM_LINK")
		if dmLink == "" {
			glog.Fatalf(ctx, "缺少数据库连接：请设置环境变量 DQ_DM_LINK（如 dm:user:pass@tcp(host:5236)/db）")
		}
		db, err = gdb.New(gdb.ConfigNode{
			Type: "dm",
			Link: dmLink,
		})
		if err != nil {
			glog.Fatalf(ctx, "连接 DM8 失败：%v", err)
		}
	}

	// ---- 2) 配置插件（单源模式） ----
	if !useMulti {
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

// multiSourceConfig 多源演示模式的插件配置（白名单模式，AI 助手开）。
func multiSourceConfig(llmKey string, enableThinking *bool) *dq.Config {
	return &dq.Config{
		Mode: dq.DefaultMode,
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
}

// multiSourceDatasets 多源演示数据集：默认源（mqcloud_experts）+ go 源（mqcloud_exports_go）。
// Source 字段为空 = 默认源；Source: "go" = dq.AddSource("go", ...) 注册的命名源。
func multiSourceDatasets() []model.Dataset {
	return []model.Dataset{
		{
			Name:  "building",
			Table: "building",
			Label: "建筑项目",
			Description: "建筑项目主表（默认源 mqcloud_experts）。含项目名称、房屋编码、行政区等。" +
				"字段众多，查询前先 get_schema。",
			Fields: []model.Field{
				{Name: "id", Label: "建筑ID", Role: model.RoleMeasure, Type: "int", Aggs: []string{"count"}},
				{Name: "name", Label: "项目名称", Role: model.RoleDimension, Type: "string"},
				{Name: "code", Label: "房屋编码", Role: model.RoleDimension, Type: "string"},
			},
		},
		{
			Name:  "area",
			Table: "area",
			Label: "行政区",
			Description: "行政区表（默认源 mqcloud_experts）。name 为区名。",
			Fields: []model.Field{
				{Name: "id", Label: "区ID", Role: model.RoleMeasure, Type: "int", Aggs: []string{"count"}},
				{Name: "name", Label: "区名字", Role: model.RoleDimension, Type: "string"},
			},
		},
		{
			Name:  "curtain",
			Table: "c_curtain",
			Label: "幕墙排查信息",
			Description: "幕墙排查小程序信息表（go 源 mqcloud_exports_go）。" +
				"verify_status：1未提交 2待确认 3已完成；progress：1待街道审核 2待区局审核 3待市局审核 4市局已通过 5市局退回 6区局退回 7街道退回；" +
				"nature_use：1写字楼 2商业综合体 3餐饮酒店 4金融信息 5文体展览 6公寓住宅 7工业仓储 8交通 9学校 10医疗 11科研 12政府办公 13军事 14其他。",
			Source: "go",
			Fields: []model.Field{
				{Name: "id", Label: "记录ID", Role: model.RoleMeasure, Type: "int", Aggs: []string{"count"}},
				{Name: "building_id", Label: "建筑ID", Role: model.RoleDimension, Type: "int"},
				{Name: "common_name", Label: "常用名", Role: model.RoleDimension, Type: "string"},
				{Name: "verify_status", Label: "审核状态", Role: model.RoleDimension, Type: "enum",
					Enum: []model.EnumItem{
						{Value: 1, Label: "未提交"},
						{Value: 2, Label: "待确认"},
						{Value: 3, Label: "已完成"},
					}},
				{Name: "progress", Label: "审核进度", Role: model.RoleDimension, Type: "enum",
					Enum: []model.EnumItem{
						{Value: 1, Label: "待街道审核"},
						{Value: 2, Label: "待区局审核"},
						{Value: 3, Label: "待市局审核"},
						{Value: 4, Label: "市局已通过"},
						{Value: 5, Label: "市局退回"},
						{Value: 6, Label: "区局退回"},
						{Value: 7, Label: "街道退回"},
					}},
				{Name: "nature_use", Label: "建筑用途", Role: model.RoleDimension, Type: "int"},
			},
		},
		{
			Name:  "sys_user",
			Table: "common_user",
			Label: "系统用户",
			Description: "公共系统用户表（go 源 mqcloud_exports_go）。module_id 为模块，user_id 关联默认源的用户。",
			Source: "go",
			Fields: []model.Field{
				{Name: "id", Label: "记录ID", Role: model.RoleMeasure, Type: "int", Aggs: []string{"count"}},
				{Name: "module_id", Label: "模块ID", Role: model.RoleDimension, Type: "int"},
				{Name: "user_id", Label: "用户ID", Role: model.RoleDimension, Type: "int"},
				{Name: "is_share", Label: "分享权限", Role: model.RoleDimension, Type: "enum",
					Enum: []model.EnumItem{
						{Value: 0, Label: "无"},
						{Value: 1, Label: "有"},
					}},
			},
		},
	}
}
