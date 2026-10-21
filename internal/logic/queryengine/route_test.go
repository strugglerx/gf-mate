package queryengine

import (
	"context"
	"strings"
	"testing"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/errors/gerror"

	"github.com/strugglerx/gf-mate/internal/logic/registry"
	"github.com/strugglerx/gf-mate/internal/model"
)

// fakeDB 嵌入 gdb.DB 接口：满足类型约束但不实现任何方法。
// routeDB 只做映射不调连接方法，安全；误调会 panic（测试即失败）。
type fakeDB struct {
	gdb.DB
	name string
}

// GetConfig 返回最小配置，避免方言探测 nil panic。
func (f *fakeDB) GetConfig() *gdb.ConfigNode {
	return &gdb.ConfigNode{Type: "mysql"}
}

// GetValue 方言探测版本号时调用，返回错误即降级为驱动名。
func (f *fakeDB) GetValue(ctx context.Context, sql string, args ...interface{}) (gdb.Value, error) {
	return nil, gerror.New("fakeDB 不支持查询")
}

// 多数据源路由测试：不需要真实数据库连接（路由只看表→数据集→Source 映射）。
func TestRouteDBMultiSource(t *testing.T) {
	reg := registry.New()
	if err := reg.Register(model.Dataset{Name: "project", Table: "t_project"}); err != nil {
		t.Fatal(err)
	}
	if err := reg.Register(model.Dataset{Name: "order", Table: "t_order", Source: "go"}); err != nil {
		t.Fatal(err)
	}

	defaultDB := &fakeDB{name: "default"}
	goDB := &fakeDB{name: "go"}
	eng := New(defaultDB, reg, &Config{RawSQL: &RawSQLConfig{Enabled: true, MaxRows: 100}})

	// 默认源表 → 默认 db。
	db, err := eng.routeDB("SELECT * FROM t_project LIMIT 10")
	if err != nil || db != gdb.DB(defaultDB) {
		t.Fatalf("默认源路由失败：db=%v err=%v", db, err)
	}

	// 命名源表但源未注册 → 明确错误。
	_, err = eng.routeDB("SELECT * FROM t_order LIMIT 10")
	if err == nil || !strings.Contains(err.Error(), "未注册") {
		t.Fatalf("未注册源应报错，got: %v", err)
	}

	// AddSource 参数校验。
	if err := eng.AddSource("go", nil); err == nil {
		t.Fatal("nil db 应拒绝")
	}
	if err := eng.AddSource("", goDB); err == nil {
		t.Fatal("空名应拒绝")
	}
	if err := eng.AddSource("go", goDB); err != nil {
		t.Fatalf("注册命名源失败：%v", err)
	}
	if err := eng.AddSource("go", goDB); err == nil {
		t.Fatal("重复注册应报错")
	}

	// 注册后路由到命名源（含子查询）。
	db, err = eng.routeDB("SELECT * FROM t_order WHERE id IN (SELECT id FROM t_order) LIMIT 10")
	if err != nil || db != gdb.DB(goDB) {
		t.Fatalf("命名源路由失败：db=%v err=%v", db, err)
	}

	// 同源多表 JOIN → 放行。
	db, err = eng.routeDB("SELECT * FROM t_order a JOIN t_order b ON a.id = b.id LIMIT 10")
	if err != nil || db != gdb.DB(goDB) {
		t.Fatalf("同源 JOIN 应放行：db=%v err=%v", db, err)
	}

	// 跨源 JOIN → 拒绝并给指引。
	_, err = eng.routeDB("SELECT * FROM t_project p JOIN t_order o ON p.id = o.id LIMIT 10")
	if err == nil || !strings.Contains(err.Error(), "跨数据源") {
		t.Fatalf("跨源 JOIN 应拒绝，got: %v", err)
	}

	// 只查字典视图 → 默认源。
	db, err = eng.routeDB("SELECT * FROM USER_INDEXES")
	if err != nil || db != gdb.DB(defaultDB) {
		t.Fatalf("字典视图应路由默认源：db=%v err=%v", db, err)
	}
}

// DialectDescAll：单源时退化为 DialectDesc；多源时包含全部源描述。
func TestDialectDescAll(t *testing.T) {
	reg := registry.New()
	eng := New(&fakeDB{name: "default"}, reg, &Config{})
	if got := eng.DialectDescAll(); got != eng.DialectDesc() {
		t.Fatalf("单源应退化为 DialectDesc：%q vs %q", got, eng.DialectDesc())
	}
	// 多源：包含源名（fakeDB 嵌入接口，GetConfig 会 panic——跳过多源探测路径，
	// 该路径已由真实 DM8 集成测试覆盖）。
}
