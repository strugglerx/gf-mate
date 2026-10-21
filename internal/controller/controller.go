// Package controller 提供 gf-mate 插件的 HTTP API 层。
//
// 路由（全部挂在宿主传入的 group 下，鉴权由宿主中间件负责，插件不做鉴权）：
//
//	GET  /datasets                数据集摘要列表
//	GET  /datasets/:name/schema   完整 Dataset 元数据
//	POST /assistant/chat          AI 助手对话（SSE 流式）
//	GET  /                        前端静态资源（frontend/，需宿主传入 server）
package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"
	"strings"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gtime"

	"github.com/strugglerx/gf-mate/internal/logic/assistant"
	"github.com/strugglerx/gf-mate/internal/logic/queryengine"
	"github.com/strugglerx/gf-mate/internal/logic/registry"
)

// deps 控制器依赖集合（由 dq.Bind 注入）。
type deps struct {
	registry *registry.Registry
	engine   *queryengine.Engine
	assist   *assistant.Assistant
	cfg      *Config
}

// Config 控制器需要的配置子集。
type Config struct {
	AssistantEnabled bool
	AssistantModel   string
	// CORSOrigins 跨域来源白名单。为空时回显任意 Origin（兼容旧行为，
	// 但会打警告日志）；非空时只回显列表内的 Origin。
	CORSOrigins []string
}

func (d *deps) corsAllowed(origin string) bool {
	if len(d.cfg.CORSOrigins) == 0 {
		return true
	}
	for _, o := range d.cfg.CORSOrigins {
		if o == origin || o == "*" {
			return true
		}
	}
	return false
}

// Bind 把全部路由挂到 group 上。
func Bind(ctx context.Context, group *ghttp.RouterGroup, reg *registry.Registry, eng *queryengine.Engine, as *assistant.Assistant, cfg *Config) error {
	if group == nil {
		return gerror.New("路由挂载失败：group 不能为 nil")
	}
	d := &deps{registry: reg, engine: eng, assist: as, cfg: cfg}
	if cfg == nil {
		d.cfg = &Config{}
	}

	// CORS：嵌入式 widget 跨域接入（宿主系统域名与插件服务不同源）。
	// 配置了 CORSOrigins 白名单时只回显列表内 Origin；未配置时回显任意
	// Origin（兼容内网/开发环境），首次请求打警告日志提醒生产环境应配置白名单。
	corsWarned := false
	group.Middleware(func(r *ghttp.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" && d.corsAllowed(origin) {
			r.Response.Header().Set("Access-Control-Allow-Origin", origin)
			r.Response.Header().Set("Vary", "Origin")
			r.Response.Header().Set("Access-Control-Allow-Credentials", "true")
			r.Response.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			r.Response.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			r.Response.Header().Set("Access-Control-Max-Age", "86400")
		}
		if r.Method == "OPTIONS" {
			r.Response.WriteHeader(http.StatusNoContent)
			return
		}
		if origin != "" && len(d.cfg.CORSOrigins) == 0 && !corsWarned {
			corsWarned = true
			g.Log().Warningf(r.Context(), "gf-mate：CORS 未配置白名单（corsOrigins），当前回显任意 Origin 并允许携带 Cookie，生产环境请在 Config.CORSOrigins 中配置允许的宿主域名")
		}
		r.Middleware.Next()
	})

	group.GET("/datasets", d.handleListDatasets)
	group.GET("/datasets/:name/schema", d.handleGetSchema)
	group.POST("/assistant/chat", d.handleChat)
	group.GET("/", d.handleIndex)
	// 兼容无尾斜杠的根路径。
	group.GET("", d.handleIndex)
	return nil
}

// BindStatic 把 frontend/ 目录挂到指定前缀下（静态文件服务）。
// 注意：ghttp 静态文件优先级高于动态路由，/dq/ 会直接命中静态首页。
func BindStatic(server *ghttp.Server, prefix string) error {
	if server == nil {
		return gerror.New("静态资源挂载失败：server 不能为 nil")
	}
	if prefix == "" {
		prefix = "/"
	}
	// 依次尝试：当前工作目录 frontend/、插件源码目录 frontend/。
	// （demo/宿主从源码目录跑时直接命中；从其他目录跑时需宿主自行
	// 通过 ghttp AddStaticPath 挂载静态资源。）
	candidates := []string{
		"frontend",
	}
	for _, dir := range candidates {
		if st, err := os.Stat(dir); err == nil && st.IsDir() {
			server.AddStaticPath(prefix, dir)
			return nil
		}
	}
	return gerror.New("静态资源挂载失败：找不到 frontend 目录（尝试过：" + strings.Join(candidates, ", ") + "）")
}

// GroupPrefix 读取 RouterGroup 的前缀（getPrefix 未导出，用反射读取）。
// 返回空串表示根路径。
func GroupPrefix(group *ghttp.RouterGroup) string {
	if group == nil {
		return ""
	}
	v := reflect.ValueOf(group)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	f := v.FieldByName("prefix")
	if !f.IsValid() || f.Kind() != reflect.String {
		return ""
	}
	return f.String()
}

// ---- 数据集 ----

// handleListDatasets GET /datasets → 摘要列表。
func (d *deps) handleListDatasets(r *ghttp.Request) {
	datasets := d.registry.List()
	out := make([]map[string]interface{}, 0, len(datasets))
	for _, ds := range datasets {
		out = append(out, map[string]interface{}{
			"name":        ds.Name,
			"label":       ds.Label,
			"description": ds.Description,
			"fieldCount":  len(ds.Fields),
		})
	}
	r.Response.WriteJson(g.Map{"datasets": out})
}

// handleGetSchema GET /datasets/:name/schema → 完整元数据。
func (d *deps) handleGetSchema(r *ghttp.Request) {
	name := r.GetRouter("name").String()
	ds, err := d.registry.Get(name)
	if err != nil {
		writeError(r, http.StatusNotFound, err)
		return
	}
	// RowScope 是函数，json 序列化时被 json:"-" 剔除。
	r.Response.WriteJson(ds)
}

// ---- 助手 ----

// handleChat POST /assistant/chat → SSE 流式对话。
func (d *deps) handleChat(r *ghttp.Request) {
	if d.cfg == nil || !d.cfg.AssistantEnabled || d.assist == nil {
		writeError(r, http.StatusServiceUnavailable,
			gerror.New("AI 助手未启用：请在插件配置中设置 assistant.enabled=true 并配置环境变量 DQ_LLM_KEY"))
		return
	}
	var body struct {
		Message string `json:"message"`
		// Messages 完整对话历史（含当前问题，最后一条必须是 user）。
		// 传入时优先于 message；服务端只保留最新 10 条。
		Messages []struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"messages"`
	}
	if err := r.Parse(&body); err != nil {
		writeError(r, http.StatusBadRequest, gerror.Wrap(err, "请求参数解析失败"))
		return
	}

	// 解析对话上下文：messages 优先（多轮），否则 message（单轮，向后兼容）。
	var history []assistant.Message
	userMessage := body.Message
	if len(body.Messages) > 0 {
		last := body.Messages[len(body.Messages)-1]
		if last.Role == "user" && last.Content != "" {
			userMessage = last.Content
			for _, m := range body.Messages[:len(body.Messages)-1] {
				if (m.Role == "user" || m.Role == "assistant") && m.Content != "" {
					history = append(history, assistant.Message{Role: m.Role, Content: m.Content})
				}
			}
		} else if userMessage == "" {
			writeError(r, http.StatusBadRequest, gerror.New("请求参数非法：messages 最后一条必须是 user 消息"))
			return
		}
	}
	if userMessage == "" {
		writeError(r, http.StatusBadRequest, gerror.New("请求参数非法：message 不能为空"))
		return
	}

	// 标准 OpenAI chat.completion.chunk SSE 流（smart-ai 方案）：
	//   工具循环在服务端内部消化，不暴露给客户端；
	//   render 卡片由 LLM 直接写在正文里（```render 围栏），随 content 流出；
	//   任何 OpenAI SDK 客户端可直接对接本接口。
	resp := r.Response
	resp.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	resp.Header().Set("Cache-Control", "no-cache")
	resp.Header().Set("Connection", "keep-alive")
	resp.Header().Set("X-Accel-Buffering", "no")
	resp.WriteHeader(http.StatusOK)
	resp.Flush()

	chunkID := fmt.Sprintf("chatcmpl-dq-%d", gtime.Now().UnixNano())
	model := ""
	if d.cfg != nil {
		model = d.cfg.AssistantModel
	}

	writeChunk := func(delta string, finishReason interface{}) {
		deltaObj := map[string]interface{}{"content": delta}
		if delta == "" && finishReason == nil {
			deltaObj["role"] = "assistant"
		}
		chunk := map[string]interface{}{
			"id":      chunkID,
			"object":  "chat.completion.chunk",
			"created": gtime.Now().Unix(),
			"model":   model,
			"choices": []map[string]interface{}{
				{"index": 0, "delta": deltaObj, "finish_reason": finishReason},
			},
		}
		b, _ := json.Marshal(chunk)
		resp.Write("data: " + string(b) + "\n\n")
		resp.Flush()
	}
	// writeReasoning：思考流（DeepSeek 标准 delta.reasoning_content 字段）。
	writeReasoning := func(text string) {
		chunk := map[string]interface{}{
			"id":      chunkID,
			"object":  "chat.completion.chunk",
			"created": gtime.Now().Unix(),
			"model":   model,
			"choices": []map[string]interface{}{
				{"index": 0, "delta": map[string]interface{}{"reasoning_content": text}, "finish_reason": nil},
			},
		}
		b, _ := json.Marshal(chunk)
		resp.Write("data: " + string(b) + "\n\n")
		resp.Flush()
	}
	// writeAgentEvent：smart-ai 标准 agent.event 扩展流（用于精准驱动 EventStream）。
	writeAgentEvent := func(xAgent map[string]interface{}) {
		evt := map[string]interface{}{
			"id":      fmt.Sprintf("evt-dq-%d", gtime.Now().UnixNano()),
			"object":  "agent.event",
			"created": gtime.Now().Unix(),
			"x_agent": xAgent,
		}
		b, _ := json.Marshal(evt)
		resp.Write("data: " + string(b) + "\n\n")
		resp.Flush()
	}

	writeChunk("", nil) // 首帧：role chunk（OpenAI 惯例）。

	// 把 assistant 内部事件翻译成标准 OpenAI chunk。
	emit := func(event, data string) {
		switch event {
		case "delta":
			var d struct {
				Text string `json:"text"`
			}
			if json.Unmarshal([]byte(data), &d) == nil && d.Text != "" {
				writeChunk(d.Text, nil)
			}
		case "reasoning":
			// 思考流 → delta.reasoning_content（纯思维链内容，不混杂工具）。
			var d struct {
				Text string `json:"text"`
			}
			if json.Unmarshal([]byte(data), &d) == nil && d.Text != "" {
				writeReasoning(d.Text)
			}
		case "tool":
			// smart-ai 标准 agent.event tool_start + widget 文本流兼容
			var d struct {
				ID   string `json:"id"`
				Name string `json:"name"`
				Args string `json:"args"`
			}
			if json.Unmarshal([]byte(data), &d) == nil {
				var parsedArgs interface{}
				if err := json.Unmarshal([]byte(d.Args), &parsedArgs); err != nil {
					parsedArgs = d.Args
				}
				callID := d.ID
				if callID == "" {
					callID = d.Name
				}
				writeAgentEvent(map[string]interface{}{
					"type":   "tool_start",
					"name":   d.Name,
					"status": "running",
					"extra": map[string]interface{}{
						"call_id":   callID,
						"arguments": parsedArgs,
					},
				})
				writeReasoning(fmt.Sprintf("[工具调用] %s %s\n", d.Name, d.Args))
			}
		case "tool_result":
			// smart-ai 标准 agent.event tool_end + widget 文本流兼容
			var d struct {
				ID      string `json:"id"`
				Name    string `json:"name"`
				Ok      bool   `json:"ok"`
				Error   string `json:"error"`
				Summary string `json:"summary"`
			}
			if json.Unmarshal([]byte(data), &d) == nil {
				status := "success"
				if !d.Ok {
					status = "fail"
				}
				var parsedRes interface{}
				if err := json.Unmarshal([]byte(d.Summary), &parsedRes); err != nil {
					parsedRes = d.Summary
				}
				callID := d.ID
				if callID == "" {
					callID = d.Name
				}
				writeAgentEvent(map[string]interface{}{
					"type":    "tool_end",
					"name":    d.Name,
					"status":  status,
					"message": d.Error,
					"extra": map[string]interface{}{
						"call_id":        callID,
						"result_preview": parsedRes,
					},
				})
				if d.Ok {
					writeReasoning(fmt.Sprintf("[执行成功] %s: %s\n", d.Name, d.Summary))
				} else {
					writeReasoning(fmt.Sprintf("[执行失败] %s: %s\n", d.Name, d.Error))
				}
			}
		case "render":
			// render 已在正文流里（```render 围栏），无需单独下发。
		case "done":
			// 结束帧在 ChatStream 返回后统一发。
		case "error":
			var e struct {
				Message string `json:"message"`
			}
			if json.Unmarshal([]byte(data), &e) == nil {
				writeChunk("\n\n[错误] "+e.Message, nil)
			}
		}
	}

	_, _, _ = d.assist.ChatStreamHistory(r.Context(), userMessage, history, emit)
	// 结束帧：finish_reason + [DONE]（无论成败都发，保证客户端能正常收尾）。
	writeChunk("", "stop")
	resp.Write("data: [DONE]\n\n")
	resp.Flush()
}

// ---- 静态首页 ----

// handleIndex GET / → 前端首页（若静态资源未挂载，返回提示）。
func (d *deps) handleIndex(r *ghttp.Request) {
	r.Response.Write("gf-mate 插件已就绪。请通过宿主配置静态资源服务访问前端界面（frontend/index.html）。")
}

// writeError 统一错误输出：JSON + 中文错误信息。
func writeError(r *ghttp.Request, status int, err error) {
	msg := err.Error()
	if msg == "" {
		msg = "未知错误"
	}
	r.Response.WriteStatus(status, g.Map{"error": msg})
}
