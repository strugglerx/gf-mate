// Package model 定义数据查询插件的数据模型：数据集元数据（表白名单 + schema 来源）与查询结果。
package model

// FieldRole 字段角色。
type FieldRole string

const (
	// RoleDimension 维度字段：可 group by / filter。
	RoleDimension FieldRole = "dimension"
	// RoleMeasure 度量字段：可聚合。
	RoleMeasure FieldRole = "measure"
)

// Field 字段元数据（白名单的来源）。
type Field struct {
	Name  string     `json:"name"`  // 真实列名
	Label string     `json:"label"` // 中文名（给 AI 和 UI）
	Role  FieldRole  `json:"role"`
	Type  string     `json:"type"`           // string|number|datetime|date|enum
	Aggs  []string   `json:"aggs,omitempty"` // measure 允许的聚合: sum/count/avg/max/min
	Enum  []EnumItem `json:"enum,omitempty"` // 枚举取值（如 status: 1=待审核）
	Desc  string     `json:"desc,omitempty"`
}

// EnumItem 枚举取值项。
type EnumItem struct {
	Value interface{} `json:"value"`
	Label string      `json:"label"`
}

// Dataset 数据集 = 一张表/视图 + 元数据（表级白名单 + AI 可见的 schema）。
type Dataset struct {
	Name        string   `json:"name"`  // 对外逻辑名（唯一 key）
	Table       string   `json:"table"` // 真实表名（sql_query 表白名单来源）
	Label       string   `json:"label"`
	Description string   `json:"description"`
	Fields      []Field  `json:"fields"`
	DefaultSort string   `json:"defaultSort,omitempty"`
	Tags        []string `json:"tags,omitempty"`
}

// QueryResult 查询结果。
type QueryResult struct {
	Columns []string                 `json:"columns"` // 输出列名（alias）
	Rows    []map[string]interface{} `json:"rows"`
	Total   int                      `json:"total"` // 不带 limit 的总数
}

// SQLResult 单条原生 SQL 的执行结果（批量模式下逐条返回）。
type SQLResult struct {
	Index  int          `json:"index"` // 在提交批次中的序号（0 起）
	Result *QueryResult `json:"result,omitempty"`
	Error  string       `json:"error,omitempty"` // 该条失败原因（中文，AI 可自纠）
}
