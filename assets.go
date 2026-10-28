package dq

import (
	"crypto/sha256"
	_ "embed"
	"encoding/hex"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/net/ghttp"
)

// widgetJS 构建产物随 Go 二进制发布（go:embed），宿主运行目录不需要 frontend/。
//
//go:embed frontend/dist/dq-widget.js
var widgetJS []byte

// widgetETag 按内容生成，升级插件版本后浏览器自动拿到新脚本。
var widgetETag = func() string {
	sum := sha256.Sum256(widgetJS)
	return `"` + hex.EncodeToString(sum[:8]) + `"`
}()

// WidgetJS 返回内嵌的 dq-widget.js 内容（宿主需要自行托管脚本时使用）。
func WidgetJS() []byte {
	return widgetJS
}

// BindWidget 把内嵌的 widget 脚本挂到 group 下的 /dist/dq-widget.js。
//
// 与 Bind 分开挂载：<script> 标签加载脚本时带不了 Authorization 头，宿主通常把
// 脚本挂到不鉴权的分组，对话与数据集接口仍由 Bind 挂到鉴权分组。脚本本身不含
// 任何数据与配置，公开访问不泄露业务信息。
func BindWidget(group *ghttp.RouterGroup) error {
	if group == nil {
		return gerror.New("widget 挂载失败：group 不能为 nil")
	}
	group.GET("/dist/dq-widget.js", serveWidgetJS)
	return nil
}

func serveWidgetJS(r *ghttp.Request) {
	h := r.Response.Header()
	h.Set("Content-Type", "application/javascript; charset=utf-8")
	h.Set("Cache-Control", "public, max-age=300")
	h.Set("X-Content-Type-Options", "nosniff")
	h.Set("ETag", widgetETag)
	if r.Header.Get("If-None-Match") == widgetETag {
		r.Response.WriteHeader(304)
		return
	}
	r.Response.Write(widgetJS)
}
