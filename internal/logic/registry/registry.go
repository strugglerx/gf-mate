// Package registry 数据集注册表：内存存储 + 读写锁，白名单模式的唯一入口。
package registry

import (
	"sort"
	"strings"
	"sync"

	"github.com/gogf/gf/v2/errors/gerror"

	"github.com/strugglerx/gf-mate/internal/model"
)

// Registry 数据集注册表（并发安全）。
type Registry struct {
	mu       sync.RWMutex
	datasets map[string]*model.Dataset
}

// New 创建空注册表。
func New() *Registry {
	return &Registry{
		datasets: make(map[string]*model.Dataset),
	}
}

// Register 注册数据集。Name 为对外逻辑名（唯一 key），重复注册返回错误。
func (r *Registry) Register(ds model.Dataset) error {
	if ds.Name == "" {
		return gerror.New("数据集注册失败：数据集名称(name)不能为空")
	}
	if ds.Table == "" {
		return gerror.Newf("数据集注册失败：数据集 %q 的表名(table)不能为空", ds.Name)
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.datasets[ds.Name]; ok {
		return gerror.Newf("数据集注册失败：数据集 %q 已存在，请先注销或更换名称", ds.Name)
	}
	// 深拷贝，避免外部修改影响已注册元数据（白名单不可被调用方事后篡改）。
	cp := ds
	cp.Fields = append([]model.Field(nil), ds.Fields...)
	r.datasets[ds.Name] = &cp
	return nil
}

// Unregister 注销数据集。
func (r *Registry) Unregister(name string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.datasets, name)
}

// Clear 清空全部数据集（SetMode 切回 whitelist 时使用，宿主随后重新 Register）。
func (r *Registry) Clear() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.datasets = make(map[string]*model.Dataset)
}

// Get 按逻辑名获取数据集；未注册返回明确错误。
func (r *Registry) Get(name string) (*model.Dataset, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	ds, ok := r.datasets[name]
	if !ok {
		names := make([]string, 0, len(r.datasets))
		for n := range r.datasets {
			names = append(names, n)
		}
		sort.Strings(names)
		return nil, gerror.Newf("数据集 %q 未注册，可用数据集：%s", name, strings.Join(names, ", "))
	}
	// 返回副本，调用方不得修改白名单。
	cp := *ds
	cp.Fields = append([]model.Field(nil), ds.Fields...)
	return &cp, nil
}

// FindByTable 按物理表名查数据集（大小写不敏感），未找到返回 nil。
// 多数据源路由用：表 → 数据集 → Source。
func (r *Registry) FindByTable(table string) *model.Dataset {
	if table == "" {
		return nil
	}
	lt := strings.ToLower(table)
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, ds := range r.datasets {
		if strings.ToLower(ds.Table) == lt {
			cp := *ds
			return &cp
		}
	}
	return nil
}

// List 列出全部数据集（浅拷贝切片）。
func (r *Registry) List() []model.Dataset {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]model.Dataset, 0, len(r.datasets))
	for _, ds := range r.datasets {
		out = append(out, *ds)
	}
	return out
}
