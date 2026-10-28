// Package model 定义数据查询插件的数据模型：数据集元数据（白名单来源）与查询 DSL。
package model

import (
	"reflect"
	"strings"
)

// FromStruct 从 GoFrame entity 结构体反射生成 Dataset 草稿。
// 小白快速集成：把 ORM 模型指针传入即得字段定义，无需手写 Fields。
//
// 反射规则：
//   - orm tag（如 `orm:"biz_order_id"`）取真实列名；无 orm tag 用字段名转 snake_case。
//   - json tag 作为 label 备选（转中文靠 dq 重载 tag 或后续 Inspect 补充）。
//   - Go 类型映射 Field.Type：string→string、数值→number、*gtime.Time/time→datetime。
//   - 角色推断：数值类型→measure（count/sum/avg/max/min），时间→dimension(datetime)，
//     其它→dimension。语义覆盖用 dq tag。
//   - dq tag（如 `dq:"label=状态,role=dimension,type=enum,enum=paid:已支付|unpaid:未支付"`）：
//     label/role/type/agg(s)/desc 覆盖默认推断；`dq:"-"` 跳过该字段。
//   - 默认跳过：以 Json 结尾的字段（JSON 存储列，对查询无意义）、DeletedAt 软删字段、
//     CreatedAt/UpdatedAt 之外的审计字段由 dq tag 显式放开。
//
// opts 可调整自动推断行为。返回的 Dataset 仅含元数据，未注册；调用 dq.Register 注册。
func FromStruct(s interface{}, opts ...func(*FromStructOptions)) (*Dataset, error) {
	o := &FromStructOptions{}
	for _, fn := range opts {
		fn(o)
	}
	rv := reflect.ValueOf(s)
	if rv.Kind() == reflect.Ptr {
		rv = rv.Elem()
	}
	if rv.Kind() != reflect.Struct {
		return nil, &ReflectError{msg: "FromStruct 入参必须是 struct 或 struct 指针，实际为 " + rv.Kind().String()}
	}
	rt := rv.Type()

	ds := &Dataset{
		Name:        o.Name,
		Table:       o.Table,
		Label:       o.Label,
		Description: o.Description,
		Fields:      make([]Field, 0, rt.NumField()),
		Tags:        o.Tags,
		DenyColumns: o.DenyColumns,
	}
	denied := make(map[string]bool, len(o.DenyColumns))
	for _, c := range o.DenyColumns {
		denied[strings.ToLower(strings.TrimSpace(c))] = true
	}
	if ds.Name == "" {
		// 默认逻辑名：取 struct 类型名转 snake_case。
		ds.Name = toSnake(stripTypePrefix(rt.Name()))
	}
	if ds.Table == "" {
		if o.TableFallback != nil {
			ds.Table = o.TableFallback(rt.Name())
		} else {
			ds.Table = toSnake(rt.Name())
		}
	}
	if ds.Label == "" {
		if o.LabelFallback != nil {
			ds.Label = o.LabelFallback(rt.Name())
		} else {
			ds.Label = rt.Name()
		}
	}

	for i := 0; i < rt.NumField(); i++ {
		sf := rt.Field(i)
		f, ok := fieldFromTag(sf, o)
		if ok && !denied[strings.ToLower(f.Name)] {
			ds.Fields = append(ds.Fields, f)
		}
	}

	// 至少需要一个字段，否则说明反射失败或全被跳过。
	if len(ds.Fields) == 0 {
		return nil, &ReflectError{msg: "FromStruct 未生成任何字段：" + rt.Name() + " 无有效字段（检查是否全被 dq:\"-\" 跳过）"}
	}
	return ds, nil
}

// FromStructOptions 反射行为选项。通常用默认值即可，需要时通过 FromStruct 的 opts 调整。
type FromStructOptions struct {
	Name        string   // 逻辑名，默认类型名 snake_case
	Table       string   // 真实表名，默认 orm tag 表名；无则类型名
	Label       string   // 中文名
	Description string   // 数据集描述（给 AI）
	Tags        []string // 标签
	// DenyColumns 敏感列（真实列名）：不进 Fields，并写入 Dataset.DenyColumns 由 SQL 门禁拦截。
	DenyColumns []string

	// 默认表名/标签的 fallback 钩子（自定义时覆盖默认推断）。
	TableFallback func(typeName string) string
	LabelFallback func(typeName string) string
}

// fieldFromTag 从单个 struct 字段反射 Field。ok=false 表示该字段应跳过。
func fieldFromTag(sf reflect.StructField, o *FromStructOptions) (Field, bool) {
	dqTag := sf.Tag.Get("dq")
	if dqTag == "-" {
		return Field{}, false
	}
	ormTag := sf.Tag.Get("orm")
	jsonTag := sf.Tag.Get("json")
	name := strings.TrimSpace(strings.Split(ormTag, ",")[0])
	if name == "" {
		name = toSnake(sf.Name)
	}

	f := Field{Name: name}
	// 默认跳过 JSON 存储列与软删字段。
	if strings.HasSuffix(sf.Name, "Json") || strings.HasSuffix(name, "_json") || sf.Name == "DeletedAt" || name == "deleted_at" {
		return Field{}, false
	}

	// dq tag 覆盖/默认推断。
	tagOpts := parseDQTag(dqTag)
	label := tagOpts["label"]
	if label == "" {
		label = jsonTag
	}
	f.Label = label
	if tagOpts["desc"] != "" {
		f.Desc = tagOpts["desc"]
	}

	f.Type = inferType(sf.Type)
	// type 显式覆盖。
	if t := tagOpts["type"]; t != "" {
		f.Type = t
	}

	// 角色推断：数值默认 measure，其余 dimension。
	role := tagOpts["role"]
	if role == "" {
		if isNumeric(sf.Type) {
			role = string(RoleMeasure)
		} else {
			role = string(RoleDimension)
		}
	}
	f.Role = FieldRole(role)

	// 聚合：measure 默认给全部可用；dq agg 可收窄。
	if f.Role == RoleMeasure {
		if a := tagOpts["agg"]; a != "" {
			f.Aggs = splitComma(a)
		} else {
			f.Aggs = []string{"count", "sum", "avg", "max", "min"}
		}
	}

	// 枚举（enum:a:b|c:d）。
	if e := tagOpts["enum"]; e != "" {
		f.Type = "enum"
		f.Enum = parseEnum(e)
	}
	return f, true
}

// ---- 类型推断 ----

func isNumeric(t reflect.Type) bool {
	switch t.Kind() {
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64,
		reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64,
		reflect.Float32, reflect.Float64:
		return true
	}
	// *int / *int64 等指针数值（entity 常出现）。
	if t.Kind() == reflect.Ptr {
		return isNumeric(t.Elem())
	}
	return false
}

func inferType(t reflect.Type) string {
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}
	switch t.Kind() {
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64,
		reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64,
		reflect.Float32, reflect.Float64:
		return "number"
	case reflect.Bool:
		return "number"
	case reflect.String:
		return "string"
	}
	// 时间类型（含 gtime.Time 及自定义 *Time 指针）。
	if strings.HasSuffix(t.Name(), "Time") {
		return "datetime"
	}
	return "string"
}

// ---- 工具 ----

func stripTypePrefix(name string) string {
	// 去掉常见前缀（MiniappProject → project）。
	lower := strings.ToLower(name)
	for _, p := range []string{"miniapp", "biz", "sys", "t_"} {
		if strings.HasPrefix(lower, p) && len(name) > len(p) {
			return name[len(p):]
		}
	}
	return name
}

func toSnake(s string) string {
	var b strings.Builder
	for i, r := range s {
		if i > 0 && r >= 'A' && r <= 'Z' {
			b.WriteByte('_')
		}
		b.WriteRune(r)
	}
	return strings.ToLower(b.String())
}

func splitComma(s string) []string {
	var out []string
	for _, v := range strings.Split(s, ",") {
		v = strings.TrimSpace(v)
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

// parseDQTag 解析 `dq:"label=x,role=y,type=z,agg=a|b,enum=..|..,desc=.."`。
// 值内可能含逗号（enum 用 | 分隔，避免冲突），故按逗号切分但不破坏 enum 值。
func parseDQTag(tag string) map[string]string {
	m := map[string]string{}
	if strings.TrimSpace(tag) == "" {
		return m
	}
	// 先按 key=value 对切，value 允许含 |。
	for _, part := range strings.Split(tag, ",") {
		kv := strings.SplitN(part, "=", 2)
		if len(kv) != 2 {
			continue
		}
		m[strings.TrimSpace(kv[0])] = strings.TrimSpace(kv[1])
	}
	return m
}

// parseEnum 解析 `enum=paid:已支付|unpaid:未支付`。
func parseEnum(s string) []EnumItem {
	var out []EnumItem
	for _, pair := range strings.Split(s, "|") {
		kv := strings.SplitN(pair, ":", 2)
		if len(kv) != 2 {
			continue
		}
		out = append(out, EnumItem{Value: strings.TrimSpace(kv[0]), Label: strings.TrimSpace(kv[1])})
	}
	return out
}

// ReflectError 反射失败错误（中文，指明原因）。
type ReflectError struct{ msg string }

func (e *ReflectError) Error() string { return e.msg }
