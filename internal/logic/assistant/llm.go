// Package assistant AI 助手：LLM 工具调用循环 → 查询引擎 → 组织回答。
// M4 最小实现：非流式，验证核心链路；SSE 流式在 M4 任务 13 补齐。
package assistant

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// LLMConfig OpenAI 兼容接口配置。
type LLMConfig struct {
	BaseURL         string // 如 https://eaichat.ctyun.cn/ai/platform/v2/cp
	APIKey          string
	Model           string // 如 deepseek-v4-flash-0731-oc
	Timeout         time.Duration
	EnableThinking  *bool  // 是否开启思考模式（默认 true）
	ReasoningEffort string // 思考深度：low / high / max
}

// ThinkingConfig DeepSeek 官方规范思考模式开关
type ThinkingConfig struct {
	Type string `json:"type"` // "enabled" / "disabled"
}

// Message OpenAI 协议消息。
type Message struct {
	Role       string     `json:"role"`
	Content    string     `json:"content,omitempty"`
	ToolCalls  []ToolCall `json:"tool_calls,omitempty"`
	ToolCallID string     `json:"tool_call_id,omitempty"`
}

// ToolCall LLM 发起的工具调用。
// Index 仅在流式增量（SSE）中使用：同一工具调用的多个增量按 Index 聚合。
type ToolCall struct {
	ID       string       `json:"id"`
	Index    int          `json:"index,omitempty"`
	Type     string       `json:"type"`
	Function FunctionCall `json:"function"`
}

// FunctionCall 函数名 + JSON 字符串参数。
type FunctionCall struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

// ToolDefinition 工具定义（function schema）。
type ToolDefinition struct {
	Type     string   `json:"type"`
	Function Function `json:"function"`
}

// Function function calling 定义。
type Function struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters"`
}

// chatRequest /chat/completions 请求体。
// Stream=true 时走 SSE 流式（ChatStream）。
type chatRequest struct {
	Model           string           `json:"model"`
	Messages        []Message        `json:"messages"`
	Tools           []ToolDefinition `json:"tools,omitempty"`
	Stream          bool             `json:"stream,omitempty"`
	Thinking        *ThinkingConfig  `json:"thinking,omitempty"`
	EnableThinking  *bool            `json:"enable_thinking,omitempty"`
	ReasoningEffort string           `json:"reasoning_effort,omitempty"`
}

// chatResponse /chat/completions 响应体（只取需要的字段）。
type chatResponse struct {
	Choices []struct {
		Message      Message `json:"message"`
		FinishReason string  `json:"finish_reason"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

// chatStreamChunk SSE 流式响应中的单个 chunk。
// 与 chatResponse 结构一致（choices[0].delta），OpenAI 兼容协议。
type chatStreamChunk struct {
	Choices []struct {
		Delta struct {
			Content   string     `json:"content,omitempty"`
			Reasoning string     `json:"reasoning_content,omitempty"` // DeepSeek 思考流
			ToolCalls []ToolCall `json:"tool_calls,omitempty"`
		} `json:"delta"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

// LLMClient 极简 OpenAI 兼容客户端。
type LLMClient struct {
	cfg    LLMConfig
	client *http.Client
}

// NewLLMClient 创建客户端。
func NewLLMClient(cfg LLMConfig) *LLMClient {
	if cfg.Timeout == 0 {
		cfg.Timeout = 120 * time.Second
	}
	return &LLMClient{cfg: cfg, client: &http.Client{Timeout: cfg.Timeout}}
}

// buildChatRequest 构造请求体并装配思考模式参数。
func (c *LLMClient) buildChatRequest(messages []Message, tools []ToolDefinition, stream bool) chatRequest {
	req := chatRequest{
		Model:    c.cfg.Model,
		Messages: messages,
		Tools:    tools,
		Stream:   stream,
	}
	// 思考模式配置：默认开启思考（true），除非显式指定为 false
	isThinking := true
	if c.cfg.EnableThinking != nil {
		isThinking = *c.cfg.EnableThinking
	}
	if isThinking {
		req.Thinking = &ThinkingConfig{Type: "enabled"}
		bTrue := true
		req.EnableThinking = &bTrue
		if c.cfg.ReasoningEffort != "" {
			req.ReasoningEffort = c.cfg.ReasoningEffort
		}
	} else {
		req.Thinking = &ThinkingConfig{Type: "disabled"}
		bFalse := false
		req.EnableThinking = &bFalse
	}
	return req
}

// Chat 发起一次对话。tools 可为空。
func (c *LLMClient) Chat(ctx context.Context, messages []Message, tools []ToolDefinition) (*Message, error) {
	body, err := json.Marshal(c.buildChatRequest(messages, tools, false))
	if err != nil {
		return nil, fmt.Errorf("序列化请求失败：%w", err)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.cfg.BaseURL+"/chat/completions", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("构造请求失败：%w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.cfg.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求 LLM 失败：%w", err)
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败：%w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("LLM 返回 %d：%s", resp.StatusCode, truncate(string(raw), 500))
	}
	var cr chatResponse
	if err := json.Unmarshal(raw, &cr); err != nil {
		return nil, fmt.Errorf("解析响应失败：%w；body=%s", err, truncate(string(raw), 300))
	}
	if cr.Error != nil {
		return nil, fmt.Errorf("LLM 错误：%s", cr.Error.Message)
	}
	if len(cr.Choices) == 0 {
		return nil, fmt.Errorf("LLM 返回空 choices：%s", truncate(string(raw), 300))
	}
	msg := cr.Choices[0].Message
	return &msg, nil
}

// ChatStream 发起一次流式对话（stream:true）。
// 逐行解析 SSE（data: 前缀，[DONE] 结束）：
//   - content 增量通过 onDelta 回调（每次一个文本片段）；
//   - tool_calls 增量按 index 聚合 arguments 片段，最终返回完整 Message。
//
// 返回：完整 Message（content 拼接 + tool_calls 聚合）+ finishReason。
func (c *LLMClient) ChatStream(ctx context.Context, messages []Message, tools []ToolDefinition, onDelta func(content string), onReasoning func(reasoning string)) (*Message, string, error) {
	body, err := json.Marshal(c.buildChatRequest(messages, tools, true))
	if err != nil {
		return nil, "", fmt.Errorf("序列化请求失败：%w", err)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.cfg.BaseURL+"/chat/completions", bytes.NewReader(body))
	if err != nil {
		return nil, "", fmt.Errorf("构造请求失败：%w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.cfg.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, "", fmt.Errorf("请求 LLM 失败：%w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		raw, _ := io.ReadAll(resp.Body)
		return nil, "", fmt.Errorf("LLM 返回 %d：%s", resp.StatusCode, truncate(string(raw), 500))
	}

	// 聚合状态：content 拼接 + tool_calls 按 index 聚合。
	var (
		content    strings.Builder
		toolCalls  []ToolCall // 按 index 顺序
		finish     string
		streamErr  error
		sawContent bool
	)

	scanner := bufio.NewScanner(resp.Body)
	// SSE 行可能很长（tool_calls 增量），加大缓冲。
	scanner.Buffer(make([]byte, 64*1024), 1024*1024)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		payload := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if payload == "[DONE]" {
			break
		}
		var chunk chatStreamChunk
		if err := json.Unmarshal([]byte(payload), &chunk); err != nil {
			// 忽略无法解析的行（部分服务端会发心跳/注释）。
			continue
		}
		if chunk.Error != nil {
			streamErr = fmt.Errorf("LLM 流式错误：%s", chunk.Error.Message)
			break
		}
		if len(chunk.Choices) == 0 {
			continue
		}
		choice := chunk.Choices[0]
		if choice.FinishReason != "" {
			finish = choice.FinishReason
		}
		if choice.Delta.Reasoning != "" {
			if onReasoning != nil {
				onReasoning(choice.Delta.Reasoning)
			}
		}
		if choice.Delta.Content != "" {
			content.WriteString(choice.Delta.Content)
			sawContent = true
			if onDelta != nil {
				onDelta(choice.Delta.Content)
			}
		}
		// tool_calls 增量：按 index 聚合 arguments 片段。
		for _, tc := range choice.Delta.ToolCalls {
			idx := tc.Index
			for len(toolCalls) <= idx {
				toolCalls = append(toolCalls, ToolCall{Type: "function"})
			}
			tc2 := &toolCalls[idx]
			if tc.ID != "" {
				tc2.ID += tc.ID
			}
			if tc.Type != "" {
				tc2.Type = tc.Type
			}
			if tc.Function.Name != "" {
				tc2.Function.Name += tc.Function.Name
			}
			tc2.Function.Arguments += tc.Function.Arguments
		}
	}
	if err := scanner.Err(); err != nil && streamErr == nil {
		streamErr = fmt.Errorf("读取流式响应失败：%w", err)
	}
	if streamErr != nil {
		return nil, finish, streamErr
	}
	if !sawContent && len(toolCalls) == 0 {
		return nil, finish, fmt.Errorf("LLM 流式响应为空（无内容也无工具调用）")
	}

	msg := &Message{
		Role:      "assistant",
		Content:   content.String(),
		ToolCalls: toolCalls,
	}
	return msg, finish, nil
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "..."
}
