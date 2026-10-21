package dq

import (
	"github.com/gogf/gf/v2/errors/gerror"
)

// 默认配置常量。
const (
	// DefaultMode 默认白名单模式：只开放显式 Register 的数据集。
	DefaultMode = "whitelist"
)

// AssistantConfig AI 助手配置。
type AssistantConfig struct {
	Enabled             bool   `json:"enabled"`
	BaseURL             string `json:"baseUrl"`
	APIKey              string `json:"apiKey"`
	Model               string `json:"model"`
	MaxToolCallsPerTurn int    `json:"maxToolCallsPerTurn"`
	RequestTimeoutSec   int    `json:"requestTimeoutSec"`
	MaxContextChars     int    `json:"maxContextChars"`
	EnableThinking      *bool  `json:"enableThinking,omitempty"`  // 是否开启深度思考（默认开启）
	ReasoningEffort     string `json:"reasoningEffort,omitempty"` // 思考强度：low / high / max
}

// RenderConfig 渲染模板配置。
type RenderConfig struct {
	EnabledTypes []string `json:"enabledTypes"`
}

// RawSQLConfig 原生 SQL 模式配置（AI 写 SQL、只读门禁，默认开启——这是 AI 的唯一查数通道）。
// 开启后 AI 助手可通过 sql_query 工具提交任意复杂度的只读 SELECT
// （JOIN/窗口函数/CTE/子查询均可），过五道安全防线后执行。
// 注意：此模式绕过 RowScope 行级权限与字段白名单，仅建议可信内网环境开启。
type RawSQLConfig struct {
	Enabled    *bool `json:"enabled,omitempty"` // nil = 默认开启；显式 false 才关闭
	MaxRows    int  `json:"maxRows"`    // 强制行数上限，默认 500
	TimeoutSec int  `json:"timeoutSec"` // 单条 SQL 超时（秒），默认 30
}

// Config 插件配置。
type Config struct {
	Mode           string   `json:"mode"` // whitelist|all
	ExcludeTables  []string `json:"excludeTables"`
	IncludeSchemas []string `json:"includeSchemas"`
	// CORSOrigins 跨域来源白名单。非空时只回显列表内的 Origin；
	// 为空（默认）回显任意 Origin 并允许携带 Cookie——仅建议内网/开发环境使用。
	CORSOrigins []string        `json:"corsOrigins"`
	RawSQL      RawSQLConfig    `json:"rawSql"` // 原生 SQL 模式（默认开启，AI 唯一查数通道）
	Assistant   AssistantConfig `json:"assistant"`
	Render      RenderConfig    `json:"render"`
}

// DefaultConfig 返回默认配置。
func DefaultConfig() *Config {
	return &Config{
		Mode:         DefaultMode,
		Assistant: AssistantConfig{
			Enabled:             false,
			MaxToolCallsPerTurn: 8,
			RequestTimeoutSec:   180,
			MaxContextChars:     24000,
		},
		RawSQL: RawSQLConfig{
			Enabled:    func() *bool { b := true; return &b }(),
			MaxRows:    500,
			TimeoutSec: 30,
		},
		Render: RenderConfig{
			EnabledTypes: []string{
				"data_table",
				"chart_bar",
				"chart_line",
				"chart_pie",
				"metric_cards",
			},
		},
	}
}

// normalize 填充默认值并做基本校验，返回规范化后的配置。
func (c *Config) normalize() (*Config, error) {
	cfg := c
	if cfg == nil {
		cfg = DefaultConfig()
		return cfg, nil
	}
	if cfg.Mode == "" {
		cfg.Mode = DefaultMode
	}
	if cfg.Mode != "whitelist" && cfg.Mode != "all" {
		return nil, gerror.Newf("配置非法：mode 只能是 whitelist 或 all，当前为 %q", cfg.Mode)
	}
	if cfg.RawSQL.MaxRows <= 0 {
		cfg.RawSQL.MaxRows = 500
	}
	// RawSQL 默认开启：DSL 已移除，sql_query 是 AI 唯一查数通道。
	if cfg.RawSQL.Enabled == nil {
		bTrue := true
		cfg.RawSQL.Enabled = &bTrue
	}
	if cfg.RawSQL.TimeoutSec <= 0 {
		cfg.RawSQL.TimeoutSec = 30
	}
	if cfg.Assistant.MaxToolCallsPerTurn <= 0 {
		cfg.Assistant.MaxToolCallsPerTurn = 8
	}
	if cfg.Assistant.RequestTimeoutSec <= 0 {
		cfg.Assistant.RequestTimeoutSec = 180
	}
	if cfg.Assistant.MaxContextChars <= 0 {
		cfg.Assistant.MaxContextChars = 24000
	}
	if len(cfg.Render.EnabledTypes) == 0 {
		cfg.Render.EnabledTypes = []string{
			"data_table",
			"chart_bar",
			"chart_line",
			"chart_pie",
			"metric_cards",
		}
	}
	return cfg, nil
}
