package assistant

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gogf/gf/v2/encoding/gjson"

	"github.com/strugglerx/gf-mate/internal/logic/queryengine"
	"github.com/strugglerx/gf-mate/internal/logic/registry"
)

// Assistant AI 助手：工具调用循环 + 数据集元数据注入。
type Assistant struct {
	llm          *LLMClient
	engine       *queryengine.Engine
	registry     *registry.Registry
	maxToolCalls int  // 单轮最大工具调用次数（防失控）
	rawSQL       bool // 原生 SQL 模式开关（sql_query 工具是否可用）
}

// New 创建助手。maxToolCalls <= 0 时默认 8。
func New(llm *LLMClient, engine *queryengine.Engine, reg *registry.Registry, maxToolCalls int) *Assistant {
	if maxToolCalls <= 0 {
		maxToolCalls = 8
	}
	return &Assistant{llm: llm, engine: engine, registry: reg, maxToolCalls: maxToolCalls}
}

// SetRawSQL 开启/关闭原生 SQL 工具（由 dq.Init 按配置注入）。
func (a *Assistant) SetRawSQL(enabled bool) *Assistant {
	a.rawSQL = enabled
	return a
}

// ToolDefs 返回给 LLM 的工具定义（全部指向白名单能力）。
// rawSQL=true 时额外提供 sql_query 工具（只读原生 SQL，过五道安全防线）。
func (a *Assistant) ToolDefs() []ToolDefinition {
	defs := []ToolDefinition{
		{
			Type: "function",
			Function: Function{
				Name:        "list_datasets",
				Description: "列出当前可查询的数据集及其业务说明、字段概要。不确定能查什么时先调这个。",
				Parameters:  map[string]interface{}{"type": "object", "properties": map[string]interface{}{}},
			},
		},
		{
			Type: "function",
			Function: Function{
				Name:        "get_schema",
				Description: "获取某数据集的完整字段元数据（字段名、中文名、维度/度量角色、枚举值），用于构造查询。",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"dataset": map[string]interface{}{"type": "string", "description": "数据集名称"},
					},
					"required": []string{"dataset"},
				},
			},
		},
	}
	if a.rawSQL {
		defs = append(defs, ToolDefinition{
			Type: "function",
			Function: Function{
				Name: "sql_query",
				Description: "批量执行只读 SQL（一次可提交多条，效率更高）。支持任意复杂查询：多表 JOIN、窗口函数、CTE、子查询、UNION。" +
					"每条只允许单条 SELECT/WITH 语句；只能查已注册数据集对应的表；无 LIMIT 时自动追加行数上限；单次最多 10 条，逐条独立校验与返回。",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"sqls": map[string]interface{}{
							"type":        "array",
							"items":       map[string]interface{}{"type": "string"},
							"description": "只读 SELECT 语句数组（一次尽量把本轮分析需要的查询都提交齐）",
						},
					},
					"required": []string{"sqls"},
				},
			},
		})
	}
	return defs
}

// SystemPrompt 构建 system prompt：角色 + 数据集概要 + 查询规则。
func (a *Assistant) SystemPrompt(ctx context.Context) string {
	datasets := a.registry.List()
	overview := ""
	for _, ds := range datasets {
		src := ""
		if ds.Source != "" {
			src = fmt.Sprintf("，数据源 %s", ds.Source)
		}
		overview += fmt.Sprintf("- 数据集 %s（物理表 %s%s）：%s\n", ds.Name, ds.Table, src, ds.Description)
	}
	sqlRules := a.sqlQueryRules()
	return fmt.Sprintf(`你是数据查询助手，帮助用户查询和分析业务系统数据。

【可用数据集】
%s
【查询与思考规则】
1. 在调用工具前，你应当进行清晰的逻辑推理与查询规划（例如分析需要查询哪个数据集、哪些字段、过滤条件及排序逻辑）。
2. 所有数字必须来自工具结果，禁止编造。
3. 不确定字段含义时先调 get_schema。
4. query 报错时根据错误信息修正参数重试。%s

【最终回答规范】
- 只有在全部工具调用完成、获取到全部数据后，再面向用户输出最终分析结论与图表。
- 中文回答，先给结论再给数据。
- 适合图表的数据在回答末尾附一个渲染卡片，格式：三个反引号 + render 围栏包裹 JSON。

【渲染类型选择规则（重要：根据数据形态仔细选择，不要默认柱状图）】
- 查询结果只有 1 个总数/指标 → 不附卡片，直接文字给出数字。
- 2~5 个独立指标（不同字段的汇总值） → metric_cards：{"type":"metric_cards","title":"标题","cards":[{"label":"指标名","value":数值,"unit":"单位可选"}]}
- 分类对比（如各状态数量、各区域排名） → chart_bar：{"type":"chart_bar","title":"标题","x_axis":{"field":"分组字段"},"y_axis":{"name":"数值含义"},"series":[{"field":"数值字段","name":"系列名"}],"data":[...]}
- 时间趋势（按日期/月份分布） → chart_line（结构同 chart_bar）。
- 占比构成（部分占整体、百分比分布） → chart_pie：{"type":"chart_pie","title":"标题","name_field":"名称字段","value_field":"数值字段","data":[...]}
- 明细清单（用户要看具体项目/记录） → data_table：{"type":"data_table","title":"标题","columns":[{"field":"字段","label":"列名"}],"rows":[...]}
- 卡片内字段名用英文原字段名（与 query 结果 rows 一致），title/label 用中文。
- data 数组直接用 query 结果的 rows（字段名保持小写）。`, overview, sqlRules)
}

// maxHistoryMessages 单轮携带的最大历史消息条数（超出取最新 N 条）。
const maxHistoryMessages = 10

// buildMessages 组装 LLM 消息序列：system + 历史（截断）+ 当前用户问题。
// 历史只保留 user/assistant 角色（工具消息属于上一轮内部细节，不跨轮携带）。
func (a *Assistant) buildMessages(ctx context.Context, userMessage string, history []Message) []Message {
	var prior []Message
	for _, m := range history {
		if m.Role == "user" || m.Role == "assistant" {
			prior = append(prior, Message{Role: m.Role, Content: m.Content})
		}
	}
	if len(prior) > maxHistoryMessages {
		prior = prior[len(prior)-maxHistoryMessages:]
	}
	messages := make([]Message, 0, len(prior)+2)
	messages = append(messages, Message{Role: "system", Content: a.SystemPrompt(ctx)})
	messages = append(messages, prior...)
	messages = append(messages, Message{Role: "user", Content: userMessage})
	return messages
}

// sqlQueryRules 原生 SQL 模式下的追加规则（rawSQL=false 时为空串）。
func (a *Assistant) sqlQueryRules() string {
	if !a.rawSQL {
		return ""
	}
	var pairs []string
	for _, ds := range a.registry.List() {
		if ds.Source != "" {
			pairs = append(pairs, fmt.Sprintf("%s→%s（源 %s）", ds.Name, ds.Table, ds.Source))
		} else {
			pairs = append(pairs, fmt.Sprintf("%s→%s", ds.Name, ds.Table))
		}
	}
	return fmt.Sprintf(`
5. 用 sql_query 工具写只读 SQL 查数（一次尽量把本轮分析需要的查询全部提交，批量效率更高）：
   - 当前数据库：%s
   - 数据集与物理表名对照（SQL 里必须用物理表名，不要用数据集名）：%s
   - 每条只允许 SELECT 或 WITH 开头的单条语句，禁止任何写操作关键字。
   - 一条 SQL 里不得 JOIN 不同数据源的表（跨源查询会报错），需要跨源数据时拆成多条单源查询，自行在回答里合并。
   - 字段名以 get_schema 返回的真实列名为准。
   - 建议始终自己写 LIMIT，避免结果过大被自动截断。
   - 某条失败时结果里会带 error 字段，根据错误信息修正后重试该条即可。
   - 需要分析索引/性能时，优先查数据字典视图：USER_INDEXES、USER_IND_COLUMNS、USER_TAB_COLUMNS、USER_CONSTRAINTS（已在白名单内，只读元数据）。
   - 也可尝试 EXPLAIN SELECT ...（部分数据库如 DM8 不支持，会报错并提示改查字典视图）。
   - 查 USER_IND_COLUMNS 时用 SELECT *（DM8 驱动会误转义列清单里的 INDEX_NAME 导致报错）。`,
		a.engine.DialectDescAll(), strings.Join(pairs, ", "))
}

// Chat 执行一轮对话：工具调用循环直到 LLM 给出最终回答或达到次数上限。
// history 为本轮之前的对话（user/assistant 交替），可为空（无上下文首轮）。
// 返回：最终回答文本 + 本轮执行的工具调用记录（供测试报告/审计）。
func (a *Assistant) Chat(ctx context.Context, userMessage string, history ...Message) (string, []ToolCall, error) {
	messages := a.buildMessages(ctx, userMessage, history)
	tools := a.ToolDefs()
	var executed []ToolCall

	for round := 0; round < a.maxToolCalls; round++ {
		msg, err := a.llm.Chat(ctx, messages, tools)
		if err != nil {
			return "", executed, fmt.Errorf("第 %d 轮 LLM 调用失败：%w", round+1, err)
		}
		// 无工具调用 → 最终回答。
		if len(msg.ToolCalls) == 0 {
			return msg.Content, executed, nil
		}
		// 有工具调用 → 逐个执行，结果以 role=tool 回填。
		messages = append(messages, *msg)
		for _, tc := range msg.ToolCalls {
			executed = append(executed, tc)
			result, err := a.executeTool(ctx, tc.Function.Name, tc.Function.Arguments)
			if err != nil {
				result = fmt.Sprintf(`{"error":%q}`, err.Error())
			}
			messages = append(messages, Message{Role: "tool", ToolCallID: tc.ID, Content: result})
		}
	}
	return "", executed, fmt.Errorf("达到单轮最大工具调用次数 %d，强制收尾", a.maxToolCalls)
}

// ChatStream 流式版对话循环。
//
// emit 回调事件（event, data）：
//   - delta：文本片段（逐字追加）；
//   - render：完整渲染 JSON（一次性下发，前端解析 ```render 围栏）；
//   - done：收尾（含 toolCalls 摘要与 finishReason）；
//   - error：错误信息（JSON）。
//
// 工具调用轮次内不产生 delta（LLM 在思考/中间过程），只有最终回答轮才流式输出正文。
// 返回：最终回答文本 + 本轮执行的工具调用记录。
func (a *Assistant) ChatStream(ctx context.Context, userMessage string, emit func(event, data string)) (string, []ToolCall, error) {
	return a.ChatStreamHistory(ctx, userMessage, nil, emit)
}

// ChatStreamHistory 带历史上下文的流式对话（controller 用）。
func (a *Assistant) ChatStreamHistory(ctx context.Context, userMessage string, history []Message, emit func(event, data string)) (string, []ToolCall, error) {
	messages := a.buildMessages(ctx, userMessage, history)
	tools := a.ToolDefs()
	var executed []ToolCall

	for round := 0; round < a.maxToolCalls; round++ {
		var roundBuf strings.Builder

		msg, finish, err := a.llm.ChatStream(ctx, messages, tools,
			func(content string) {
				if round == 0 {
					// 第一轮数据尚未查询，任何模型自言自语皆为思考规划，实时作为 reasoning 流出
					if emit != nil {
						emit("reasoning", `{"text":`+jsonQuote(content)+`}`)
					}
					return
				}
				// 后续轮次先缓冲，等待确定是否有 tool_calls
				roundBuf.WriteString(content)
			},
			func(reasoning string) {
				if emit != nil {
					emit("reasoning", `{"text":`+jsonQuote(reasoning)+`}`)
				}
			})
		if err != nil {
			if emit != nil {
				emit("error", `{"message":`+jsonQuote(err.Error())+`}`)
			}
			return "", executed, fmt.Errorf("第 %d 轮 LLM 调用失败：%w", round+1, err)
		}

		// 无工具调用 → 最终回答轮次！
		if len(msg.ToolCalls) == 0 {
			if emit != nil {
				// 输出最终正文 delta
				finalText := roundBuf.String()
				if finalText == "" && msg.Content != "" {
					finalText = msg.Content
				}
				if finalText != "" {
					emit("delta", `{"text":`+jsonQuote(finalText)+`}`)
				}
				// 从回答中提取 ```render 围栏 JSON，作为独立 render 事件下发
				if rj := extractRenderJSON(msg.Content); rj != "" {
					emit("render", rj)
				}
				emit("done", fmt.Sprintf(`{"toolCalls":%d,"finishReason":%s}`,
					len(executed), jsonQuote(finish)))
			}
			return msg.Content, executed, nil
		}

		// 有工具调用 → 中间工具轮！
		// 若模型输出了中间分析（roundBuf），绝不污染正文，全部作为 reasoning 思考过程发出！
		if roundBuf.Len() > 0 && emit != nil {
			emit("reasoning", `{"text":`+jsonQuote(roundBuf.String()+"\n")+`}`)
			roundBuf.Reset()
		}

		_ = finish
		messages = append(messages, *msg)
		for _, tc := range msg.ToolCalls {
			executed = append(executed, tc)
			// 透出工具调用过程（前端展示为可折叠的工具调用块）。
			if emit != nil {
				args := tc.Function.Arguments
				if len(args) > 200 {
					args = args[:200] + "..."
				}
				emit("tool", fmt.Sprintf(`{"id":%s,"name":%s,"args":%s}`,
					jsonQuote(tc.ID), jsonQuote(tc.Function.Name), jsonQuote(args)))
			}
			result, err := a.executeTool(ctx, tc.Function.Name, tc.Function.Arguments)
			if emit != nil {
				if err != nil {
					emit("tool_result", fmt.Sprintf(`{"id":%s,"name":%s,"ok":false,"error":%s}`,
						jsonQuote(tc.ID), jsonQuote(tc.Function.Name), jsonQuote(truncateStr(err.Error(), 300))))
				} else {
					emit("tool_result", fmt.Sprintf(`{"id":%s,"name":%s,"ok":true,"summary":%s}`,
						jsonQuote(tc.ID), jsonQuote(tc.Function.Name), jsonQuote(truncateStr(result, 300))))
				}
			}
			if err != nil {
				result = fmt.Sprintf(`{"error":%q}`, err.Error())
			}
			messages = append(messages, Message{Role: "tool", ToolCallID: tc.ID, Content: result})
		}
	}
	err := fmt.Errorf("达到单轮最大工具调用次数 %d，强制收尾", a.maxToolCalls)
	if emit != nil {
		emit("error", `{"message":`+jsonQuote(err.Error())+`}`)
	}
	return "", executed, err
}

// extractRenderJSON 从回答文本中提取 ```render 围栏内的 JSON（含 ```json 变体）。
// 找不到返回空串。
func extractRenderJSON(content string) string {
	const fence = "```"
	idx := strings.Index(content, fence)
	if idx < 0 {
		return ""
	}
	rest := content[idx+len(fence):]
	// 跳过语言标记行（render / json）。
	if nl := strings.IndexByte(rest, '\n'); nl >= 0 {
		rest = rest[nl+1:]
	} else {
		return ""
	}
	end := strings.Index(rest, fence)
	if end < 0 {
		return ""
	}
	jsonStr := strings.TrimSpace(rest[:end])
	if jsonStr == "" {
		return ""
	}
	// 校验是合法 JSON，避免把任意文本当渲染卡下发。
	if !json.Valid([]byte(jsonStr)) {
		return ""
	}
	return jsonStr
}

// jsonQuote 把字符串编码为合法 JSON 字符串字面量。
func jsonQuote(s string) string {
	b, _ := json.Marshal(s)
	return string(b)
}

// executeTool 执行白名单工具。
func (a *Assistant) executeTool(ctx context.Context, name, argsJSON string) (string, error) {
	switch name {
	case "list_datasets":
		datasets := a.registry.List()
		out := make([]map[string]interface{}, 0, len(datasets))
		for _, ds := range datasets {
			fields := make([]map[string]interface{}, 0, len(ds.Fields))
			for _, f := range ds.Fields {
				fields = append(fields, map[string]interface{}{
					"name": f.Name, "label": f.Label, "role": string(f.Role), "type": f.Type,
				})
			}
			out = append(out, map[string]interface{}{
				"name": ds.Name, "table": ds.Table, "label": ds.Label, "description": ds.Description, "fields": fields,
			})
		}
		b, _ := json.Marshal(out)
		return string(b), nil

	case "get_schema":
		j, err := gjson.LoadContent([]byte(argsJSON))
		if err != nil {
			return "", fmt.Errorf("参数解析失败：%w", err)
		}
		ds, err := a.registry.Get(j.Get("dataset").String())
		if err != nil {
			return "", err
		}
		b, _ := json.Marshal(ds)
		return string(b), nil

	case "sql_query":
		if !a.rawSQL {
			return "", fmt.Errorf("未知工具 %q，可用：list_datasets / get_schema / sql_query", name)
		}
		j, err := gjson.LoadContent([]byte(argsJSON))
		if err != nil {
			return "", fmt.Errorf("参数解析失败：%w", err)
		}
		var sqls []string
		for _, v := range j.Get("sqls").Strings() {
			if s := strings.TrimSpace(v); s != "" {
				sqls = append(sqls, s)
			}
		}
		res, err := a.engine.ExecuteSQLBatch(ctx, sqls)
		if err != nil {
			return "", err
		}
		b, _ := json.Marshal(res)
		return string(b), nil

	default:
		return "", fmt.Errorf("未知工具 %q，可用：list_datasets / get_schema / sql_query", name)
	}
}

// truncateStr 截断字符串（超长部分用 ... 代替）。
func truncateStr(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "..."
}
