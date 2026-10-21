package queryengine

// RawSQLConfig 原生 SQL 模式配置（AI 写 SQL、只读门禁）。
// 这是 AI 的唯一查数通道：sql_query 工具批量提交只读 SELECT，逐条过五道门禁。
type RawSQLConfig struct {
	// Enabled 是否启用（默认 false）。
	Enabled bool
	// MaxRows 强制行数上限（无顶层 LIMIT 时自动追加 LIMIT maxRows）。默认 500。
	MaxRows int
	// TimeoutSec 单条 SQL 执行超时（秒）。默认 30。
	TimeoutSec int
}

// Config 查询引擎配置（由 dq 门面从根 Config 转换而来）。
type Config struct {
	// RawSQL 原生 SQL 模式（nil = 关闭，AI 无查数能力）。
	RawSQL *RawSQLConfig
}
