package model

import (
	"testing"
)

// 模拟 GoFrame entity：带 orm tag、数值/字符串/时间/JSON 存储/软删字段。
type _tOrder struct {
	Id        int64    `orm:"id"`
	Name      string   `orm:"name" json:"name"`
	Amount    *float64 `orm:"amount" dq:"label=金额,role=measure,agg=sum"`
	Status    string   `orm:"status" dq:"label=状态,type=enum,enum=paid:已支付|unpaid:未支付"`
	MetaJson  string   `orm:"meta_json"`
	CreatedAt *GTime   `orm:"created_at"`
	DeletedAt *GTime   `orm:"deleted_at"`
	Hidden    string   `dq:"-"`
}

// 用接口别名避免 gtime 依赖（测试只验证反射，不依赖时间类型）。
// GTime 模拟 gtime.Time（类型名以 Time 结尾）。
type GTime struct{}

func TestFromStruct_basic(t *testing.T) {
	ds, err := FromStruct(&_tOrder{}, func(o *FromStructOptions) {
		o.Name = "order"
		o.Table = "biz_order"
		o.Label = "订单"
	})
	if err != nil {
		t.Fatalf("FromStruct error: %v", err)
	}

	// 字段名/表名/标签。
	if ds.Name != "order" {
		t.Errorf("Name = %q, want order", ds.Name)
	}
	if ds.Table != "biz_order" {
		t.Errorf("Table = %q, want biz_order", ds.Table)
	}
	if ds.Label != "订单" {
		t.Errorf("Label = %q, want 订单", ds.Label)
	}

	// 反射出的字段。
	find := func(name string) (Field, bool) {
		for _, f := range ds.Fields {
			if f.Name == name {
				return f, true
			}
		}
		return Field{}, false
	}

	// id：数值 → measure + count。
	if f, ok := find("id"); ok {
		if f.Role != RoleMeasure {
			t.Errorf("id role = %q, want measure", f.Role)
		}
		if f.Type != "number" {
			t.Errorf("id type = %q, want number", f.Type)
		}
	} else {
		t.Error("missing id")
	}

	// name：字符串 → dimension。
	if f, ok := find("name"); ok {
		if f.Role != RoleDimension {
			t.Errorf("name role = %q, want dimension", f.Role)
		}
	} else {
		t.Error("missing name")
	}

	// amount：dq tag 显式 measure + agg=sum。
	if f, ok := find("amount"); ok {
		if f.Role != RoleMeasure {
			t.Errorf("amount role = %q, want measure", f.Role)
		}
		if len(f.Aggs) != 1 || f.Aggs[0] != "sum" {
			t.Errorf("amount aggs = %v, want [sum]", f.Aggs)
		}
		if f.Label != "金额" {
			t.Errorf("amount label = %q, want 金额", f.Label)
		}
	} else {
		t.Error("missing amount")
	}

	// status：dq tag enum。
	if f, ok := find("status"); ok {
		if f.Type != "enum" {
			t.Errorf("status type = %q, want enum", f.Type)
		}
		if len(f.Enum) != 2 || f.Enum[0].Value != "paid" || f.Enum[0].Label != "已支付" {
			t.Errorf("status enum = %+v, want paid=已支付", f.Enum)
		}
	} else {
		t.Error("missing status")
	}

	// 应跳过：meta_json（JSON 存储）、deleted_at（软删）、hidden（dq:-）。
	for _, skip := range []string{"meta_json", "deleted_at", "hidden"} {
		if _, ok := find(skip); ok {
			t.Errorf("字段 %s 应被跳过，但存在", skip)
		}
	}

	// created_at：时间 → dimension + datetime。
	if f, ok := find("created_at"); ok {
		if f.Role != RoleDimension {
			t.Errorf("created_at role = %q, want dimension", f.Role)
		}
		if f.Type != "datetime" {
			t.Errorf("created_at type = %q, want datetime", f.Type)
		}
	} else {
		t.Error("missing created_at")
	}
}

func TestFromStruct_invalidInput(t *testing.T) {
	if _, err := FromStruct(42); err == nil {
		t.Error("int 入参应报错")
	}
}

func TestFromStruct_toSnake(t *testing.T) {
	cases := map[string]string{
		"MiniappProject":   "miniapp_project",
		"AdminMessageRead": "admin_message_read",
		"AlreadyLower":     "already_lower",
	}
	for in, want := range cases {
		if got := toSnake(in); got != want {
			t.Errorf("toSnake(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestFromStruct_parseEnum(t *testing.T) {
	e := parseEnum("paid:已支付|unpaid:未支付")
	if len(e) != 2 || e[0].Value != "paid" || e[1].Value != "unpaid" {
		t.Errorf("parseEnum = %+v", e)
	}
}
