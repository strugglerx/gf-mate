// gf-mate × miniapp-rebuild 集成示例（独立模块）。
//
// 两条"小白快速集成"路径（都不手写字段）：
//
//	A) -all 全库自动注册（DB introspection，零代码）：
//	     dq.Init(cfg.Mode="all") 自动读 INFORMATION_SCHEMA/ALL_TABLES，
//	     把当前库所有表一次性注册，无需任何 struct。
//
//	B) -fromstruct 反射注册（GoFrame entity 模型）：
//	     dq.FromStruct(&entity.X{}) 从 ORM struct 反射字段，用于
//	     精细控制哪些表、哪些字段。在真实 GoFrame v2 项目里，
//	     entity 就在本模块内可直接 import，故反射完全可用。
//	     （本独立示例因 Go internal 规则不能 import base-v2 的
//	      internal entity，故用 project_demo.go 里的本地语义 struct 演示。）
//
// 默认（不带 flag）：走 B，注册 project + 几张演示表。
//
// 启动：
//
//	export DQ_DM_LINK='dm:...'      # 连 miniapp-rebuild 用的库
//	export DQ_LLM_KEY='your-key'     # 不设置则 AI 关闭
//	go run .                 # B：FromStruct 演示表
//	go run . -all            # A：全库自动注册
package main

import (
	"context"
	"flag"
	"os"

	_ "github.com/gogf/gf/contrib/drivers/dm/v2"
	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/glog"

	dq "github.com/strugglerx/gf-mate"
)

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func main() {
	ctx := context.Background()
	allMode := flag.Bool("all", false, "全库自动注册（DB introspection，零代码）")
	flag.Parse()

	// ---- 1) 数据源 ----
	db, err := gdb.New(gdb.ConfigNode{
		Type: "dm",
		Link: os.Getenv("DQ_DM_LINK"),
	})
	if err != nil {
		glog.Fatalf(ctx, "连接 DM8 失败：%v", err)
	}

	// ---- 2) 插件配置 ----
	llmKey := os.Getenv("DQ_LLM_KEY")
	mode := dq.DefaultMode
	if *allMode {
		mode = "all" // 全库自动注册
	}
	if err := dq.Init(db, &dq.Config{
		Mode: mode,
		Assistant: dq.AssistantConfig{
			Enabled:             llmKey != "",
			BaseURL:             envOr("DQ_LLM_BASE", "https://eaichat.ctyun.cn/ai/platform/v2/cp"),
			APIKey:              llmKey,
			Model:               envOr("DQ_LLM_MODEL", "deepseek-v4-flash-0731-oc"),
			MaxToolCallsPerTurn: 8,
			RequestTimeoutSec:   120,
			MaxContextChars:     24000,
		},
	}); err != nil {
		glog.Fatalf(ctx, "初始化插件失败：%v", err)
	}

	// ---- 3) 快速集成 ----
	if *allMode {
		glog.Infof(ctx, "全库自动注册已由 Init(mode=all) 完成")
	} else {
		// FromStruct 反射注册（默认演示）。
		if err := registerProjectSemantic(); err != nil {
			glog.Fatalf(ctx, "注册 project 失败：%v", err)
		}
		glog.Infof(ctx, "已用 FromStruct 反射注册 project（语义化定义，零手写字段）")
	}

	// ---- 4) HTTP ----
	s := g.Server()
	s.SetPort(8210)
	s.SetServerRoot("")
	s.Group("/dq", func(group *ghttp.RouterGroup) {
		if err := dq.Bind(ctx, group, s); err != nil {
			glog.Fatalf(ctx, "挂载插件路由失败：%v", err)
		}
	})
	s.BindHandler("/", func(r *ghttp.Request) {
		r.Response.RedirectTo("/dq/")
	})
	glog.Infof(ctx, "gf-mate × miniapp-rebuild 集成示例启动：http://localhost:8200/dq/")
	s.Run()
}
