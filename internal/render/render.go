// Package render 定义 AI 助手渲染协议：5 种渲染模板的 JSON 结构常量与校验。
//
// 前端（frontend/render.js）与后端（本包）共用同一套协议：
//
//	data_table:  { "type":"data_table", "title":"...", "columns":[{"field":"...","label":"..."}], "rows":[...] }
//	chart_bar:   { "type":"chart_bar", "title":"...", "x_axis":{"field":"..."}, "y_axis":{"name":"..."}, "series":[{"field":"...","name":"..."}], "data":[...] }
//	chart_line:  同 chart_bar
//	chart_pie:   { "type":"chart_pie", "title":"...", "name_field":"...", "value_field":"...", "data":[...] }
//	metric_cards:{ "type":"metric_cards", "title":"...", "cards":[{"label":"...","value":"...","unit":"..."}] }
package render

import "slices"

// 渲染模板类型常量。
const (
	TypeTable      = "data_table"
	TypeBar        = "chart_bar"
	TypeLine       = "chart_line"
	TypePie        = "chart_pie"
	TypeMetricCard = "metric_cards"
)

// AllTypes 全部支持的渲染模板类型。
var AllTypes = []string{TypeTable, TypeBar, TypeLine, TypePie, TypeMetricCard}

// IsValidType 判断渲染模板类型是否在白名单内。
func IsValidType(t string) bool {
	return slices.Contains(AllTypes, t)
}
