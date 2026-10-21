package registry

import (
	"strings"
	"testing"

	"github.com/strugglerx/gf-mate/internal/model"
)

func testDataset() model.Dataset {
	return model.Dataset{
		Name:        "project_record",
		Table:       "miniapp_project",
		Label:       "工程备案",
		Description: "工程备案记录",
		Fields: []model.Field{
			{Name: "id", Label: "ID", Role: model.RoleDimension, Type: "number"},
			{Name: "district", Label: "区", Role: model.RoleDimension, Type: "string"},
			{Name: "status", Label: "状态", Role: model.RoleDimension, Type: "enum",
				Enum: []model.EnumItem{{Value: 1, Label: "待审核"}, {Value: 2, Label: "已通过"}}},
			{Name: "amount", Label: "金额", Role: model.RoleMeasure, Type: "number", Aggs: []string{"sum", "avg", "max", "min", "count"}},
			{Name: "created_at", Label: "创建时间", Role: model.RoleDimension, Type: "datetime"},
		},
		DefaultSort: "id desc",
	}
}

func TestRegisterAndGet(t *testing.T) {
	r := New()
	if err := r.Register(testDataset()); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	got, err := r.Get("project_record")
	if err != nil {
		t.Fatalf("Get() error = %v", err)
	}
	if got.Name != "project_record" || got.Table != "miniapp_project" {
		t.Fatalf("Get() = %+v, want name/table match", got)
	}
	if len(got.Fields) != 5 {
		t.Fatalf("Get() fields = %d, want 5", len(got.Fields))
	}
}

func TestRegisterDuplicate(t *testing.T) {
	r := New()
	if err := r.Register(testDataset()); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	err := r.Register(testDataset())
	if err == nil {
		t.Fatal("Register() duplicate should error")
	}
	if !strings.Contains(err.Error(), "已存在") {
		t.Fatalf("Register() duplicate error = %v, want 中文错误", err)
	}
}

func TestRegisterEmptyName(t *testing.T) {
	r := New()
	ds := testDataset()
	ds.Name = ""
	if err := r.Register(ds); err == nil {
		t.Fatal("Register() empty name should error")
	}
}

func TestGetUnregistered(t *testing.T) {
	r := New()
	_, err := r.Get("not_exist")
	if err == nil {
		t.Fatal("Get() unregistered should error")
	}
	if !strings.Contains(err.Error(), "未注册") {
		t.Fatalf("Get() error = %v, want 中文错误", err)
	}
}

func TestUnregister(t *testing.T) {
	r := New()
	if err := r.Register(testDataset()); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	r.Unregister("project_record")
	if _, err := r.Get("project_record"); err == nil {
		t.Fatal("Get() after Unregister should error")
	}
}

func TestList(t *testing.T) {
	r := New()
	if err := r.Register(testDataset()); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	list := r.List()
	if len(list) != 1 {
		t.Fatalf("List() len = %d, want 1", len(list))
	}
}

func TestRegistryConcurrent(t *testing.T) {
	r := New()
	if err := r.Register(testDataset()); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	done := make(chan struct{})
	for i := 0; i < 20; i++ {
		go func() {
			defer func() { done <- struct{}{} }()
			for j := 0; j < 100; j++ {
				if _, err := r.Get("project_record"); err != nil {
					t.Errorf("concurrent Get() error = %v", err)
					return
				}
			}
		}()
	}
	for i := 0; i < 20; i++ {
		<-done
	}
}
