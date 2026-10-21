// Package dq 是 gf-mate 插件的对外门面。
//
// 使用方式（嵌入 GoFrame 宿主）：
//
//	dq.Init(g.DB(), nil)                 // 初始化，使用默认配置
//	dq.Register(model.Dataset{...})      // 注册数据集（白名单模式的唯一入口）
//	dq.Bind(ctx, group)                  // 挂载路由到宿主 server group
package dq

import (
	"context"
	"strings"
	"sync"
	"time"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/glog"

	"github.com/strugglerx/gf-mate/internal/controller"
	"github.com/strugglerx/gf-mate/internal/logic/assistant"
	"github.com/strugglerx/gf-mate/internal/logic/queryengine"
	"github.com/strugglerx/gf-mate/internal/logic/registry"
	"github.com/strugglerx/gf-mate/internal/model"
)

// 包级单例（插件按进程单例设计）。
var (
	instance   *dqInstance
	instanceMu sync.RWMutex
)

// dqInstance 插件内部状态。
type dqInstance struct {
	cfg       *Config
	db        gdb.DB
	registry  *registry.Registry
	engine    *queryengine.Engine
	assistant *assistant.Assistant
}

// Init 初始化插件。db 传宿主的 g.DB() 或 g.DB("name")；cfg 可为 nil 用默认值。
// 重复调用返回错误（幂等保护）。
// 当 cfg.Mode == "all" 时，初始化后自动执行全库表注册（见 SetMode）。
func Init(db gdb.DB, cfg *Config) error {
	if db == nil {
		return gerror.New("插件初始化失败：db 不能为 nil，请传入宿主的 g.DB()")
	}
	normCfg, err := cfg.normalize()
	if err != nil {
		return err
	}
	instanceMu.Lock()
	defer instanceMu.Unlock()
	if instance != nil {
		return gerror.New("插件初始化失败：dq 已初始化，请勿重复调用 Init")
	}
	reg := registry.New()
	inst := &dqInstance{
		cfg:      normCfg,
		db:       db,
		registry: reg,
		engine: queryengine.New(db, reg, &queryengine.Config{
			RawSQL: &queryengine.RawSQLConfig{
				Enabled:    *normCfg.RawSQL.Enabled,
				MaxRows:    normCfg.RawSQL.MaxRows,
				TimeoutSec: normCfg.RawSQL.TimeoutSec,
			},
		}),
	}
	instance = inst

	// 按配置初始化 AI 助手（Enabled=false 时不初始化，避免无 key 启动报错）。
	if err := inst.initAssistantLocked(); err != nil {
		instance = nil
		return err
	}

	// all 模式：初始化后自动全量注册当前库所有表。
	if normCfg.Mode == "all" {
		if err := inst.registerAllLocked(context.Background()); err != nil {
			instance = nil
			return err
		}
	}
	return nil
}

// initAssistantLocked 按 cfg.Assistant 初始化 AI 助手（调用方需持有 instanceMu 写锁）。
func (inst *dqInstance) initAssistantLocked() error {
	if !inst.cfg.Assistant.Enabled {
		return nil
	}
	if inst.cfg.Assistant.APIKey == "" {
		return gerror.New("插件初始化失败：assistant.enabled=true 但未配置 APIKey，请通过环境变量 DQ_LLM_KEY 注入")
	}
	llm := assistant.NewLLMClient(assistant.LLMConfig{
		BaseURL:         inst.cfg.Assistant.BaseURL,
		APIKey:          inst.cfg.Assistant.APIKey,
		Model:           inst.cfg.Assistant.Model,
		Timeout:         time.Duration(inst.cfg.Assistant.RequestTimeoutSec) * time.Second,
		EnableThinking:  inst.cfg.Assistant.EnableThinking,
		ReasoningEffort: inst.cfg.Assistant.ReasoningEffort,
	})
	inst.assistant = assistant.New(llm, inst.engine, inst.registry, inst.cfg.Assistant.MaxToolCallsPerTurn).SetRawSQL(inst.cfg.RawSQL.Enabled != nil && *inst.cfg.RawSQL.Enabled)
	return nil
}

// Register 注册数据集（白名单模式的唯一入口）。
// 多数据源场景：ds.Source 填逻辑源名（对应 AddSource 注册的名称），空 = 默认源。
// 必须在 Init 之后调用。
func Register(ds model.Dataset) error {
	inst, err := getInstance()
	if err != nil {
		return err
	}
	return inst.registry.Register(ds)
}

// AddSource 注册命名数据源（多数据库支持）。
// 例如宿主配置了两个库：dq.AddSource("go", g.DB("go"))，
// 之后 Register 的数据集声明 Source: "go" 即自动路由到该库。
// 必须在 Init 之后调用；重复注册同名源返回错误。
func AddSource(name string, db gdb.DB) error {
	inst, err := getInstance()
	if err != nil {
		return err
	}
	return inst.engine.AddSource(name, db)
}

// Inspect 读表结构生成 Dataset 草稿（人再补 Label/Role/Enum）。
// 表名会先过白名单校验，再作为参数绑定进元数据查询（只读系统视图）。
func Inspect(ctx context.Context, table string) (*model.Dataset, error) {
	inst, err := getInstance()
	if err != nil {
		return nil, err
	}
	return inst.engine.Inspect(ctx, table)
}

// FromStruct 从 GoFrame entity（ORM struct）反射生成 Dataset 草稿，零手写字段。
//
// 小白快速集成：把 model 指针传入即得字段定义，无需手写 Fields 列表。
// 反射规则见 model.FromStruct 文档：
//   - orm tag 取真实列名；无 orm tag 用字段名 snake_case。
//   - Go 类型映射 Field.Type（string→string、数值→number、时间→datetime）。
//   - 数值字段默认 measure（count/sum/avg/max/min），其余 dimension。
//   - dq tag 覆盖语义：dq:"label=状态,role=dimension,type=enum,enum=paid:已支付"。
//   - dq:"-" 跳过字段；默认跳过 *_json 与 DeletedAt。
//
// 返回的 Dataset 仅含元数据，未注册；调用 Register 注册。
func FromStruct(s interface{}, opts ...func(*FromStructOptions)) (*model.Dataset, error) {
	return model.FromStruct(s, opts...)
}

// FromStructOptions 反射选项，见 model.FromStructOptions。
type FromStructOptions = model.FromStructOptions

// Dataset 数据集元数据（白名单来源）。
type Dataset = model.Dataset

// Field 字段元数据。
type Field = model.Field

// EnumItem 枚举取值项。
type EnumItem = model.EnumItem

// RoleDimension / RoleMeasure 字段角色。
const (
	RoleDimension = model.RoleDimension
	RoleMeasure   = model.RoleMeasure
)

// InspectAndRegister 读表结构生成 Dataset 草稿并直接注册（all 模式的核心动作）。
func InspectAndRegister(ctx context.Context, table string) error {
	inst, err := getInstance()
	if err != nil {
		return err
	}
	ds, err := inst.engine.Inspect(ctx, table)
	if err != nil {
		return err
	}
	return inst.registry.Register(*ds)
}

// Bind 挂载路由到宿主 server group，prefix 如 "/dq"。
//
// 鉴权说明：插件不负责鉴权，路由直接挂到传入的 group；
// 宿主应自行在 group 上挂中间件（如 g.Middleware.CORS、登录鉴权），
// 插件只提供数据能力，不做任何权限判断。
//
// 静态资源：可选传入 server（如 g.Server()）用于把 frontend/ 目录
// 挂到 group 前缀下（AddStaticPath）。不传 server 时跳过静态资源挂载。
// 注意：ghttp 的静态文件优先级高于动态路由，因此 /dq/ 会命中静态首页。
func Bind(ctx context.Context, group *ghttp.RouterGroup, server ...*ghttp.Server) error {
	if group == nil {
		return gerror.New("路由挂载失败：group 不能为 nil")
	}
	inst, err := getInstance()
	if err != nil {
		return err
	}
	if err := controller.Bind(ctx, group, inst.registry, inst.engine, inst.assistant, &controller.Config{
		AssistantEnabled: inst.cfg.Assistant.Enabled,
		AssistantModel:   inst.cfg.Assistant.Model,
		CORSOrigins:      inst.cfg.CORSOrigins,
	}); err != nil {
		return err
	}
	if len(server) > 0 && server[0] != nil {
		if err := controller.BindStatic(server[0], controller.GroupPrefix(group)); err != nil {
			return err
		}
	}
	return nil
}

// SetMode 热切换 whitelist/all。
//
//	all：查 INFORMATION_SCHEMA.TABLES（DM8 用 ALL_TABLES）列出当前库所有表，
//	    跳过 cfg.ExcludeTables、只取 cfg.IncludeSchemas（非空时），逐个 InspectAndRegister。
//	whitelist：清空 registry，由宿主重新 Register（插件不保留任何自动注册的数据集）。
func SetMode(mode string) error {
	inst, err := getInstance()
	if err != nil {
		return err
	}
	if mode != "whitelist" && mode != "all" {
		return gerror.Newf("模式切换失败：mode 只能是 whitelist 或 all，当前为 %q", mode)
	}
	instanceMu.Lock()
	defer instanceMu.Unlock()
	if mode == "all" {
		if err := inst.registerAllLocked(context.Background()); err != nil {
			return err
		}
	} else {
		inst.registry.Clear()
		// 说明：切回白名单后，宿主需重新调用 dq.Register 注册所需数据集。
	}
	inst.cfg.Mode = mode
	return nil
}

// registerAllLocked all 模式全量注册（调用方需持有 instanceMu 写锁）。
// matchExcludeTable 判断表是否命中排除规则：精确匹配（不区分大小写），
// 或以 % 结尾的前缀通配（如 "miniapp_dead_%" 排除所有归档表）。
func matchExcludeTable(pattern, table string) bool {
	if strings.HasSuffix(pattern, "%") {
		return strings.HasPrefix(strings.ToLower(table), strings.ToLower(strings.TrimSuffix(pattern, "%")))
	}
	return strings.EqualFold(pattern, table)
}

func (inst *dqInstance) registerAllLocked(ctx context.Context) error {
	tables, err := inst.engine.ListTables(ctx)
	if err != nil {
		return err
	}
	var firstErr error
	registered := 0
	for i, t := range tables {
		// 进度日志（all 模式全量 introspection 较慢，让宿主看到进展）。
		if i > 0 && i%20 == 0 {
			glog.Infof(ctx, "全量注册进度：%d/%d 张表（已注册 %d）", i, len(tables), registered)
		}
		// 跳过排除表。
		skip := false
		for _, ex := range inst.cfg.ExcludeTables {
			if matchExcludeTable(ex, t) {
				skip = true
				break
			}
		}
		if skip {
			continue
		}
		ds, err := inst.engine.Inspect(ctx, t)
		if err != nil {
			if firstErr == nil {
				firstErr = err
			}
			continue
		}
		if err := inst.registry.Register(*ds); err != nil {
			if firstErr == nil {
				firstErr = err
			}
			continue
		}
		registered++
	}
	if firstErr != nil {
		// 部分失败不阻断整体：已注册的表照常可用，仅记录首个失败原因。
		glog.Warningf(ctx, "全量注册完成 %d 张表，存在失败项（首个：%v），失败表已跳过", registered, firstErr)
	}
	return nil
}

// Engine 返回内部查询引擎（供测试与高级用法）。
func Engine() (*queryengine.Engine, error) {
	inst, err := getInstance()
	if err != nil {
		return nil, err
	}
	return inst.engine, nil
}

// getInstance 获取已初始化的单例。
func getInstance() (*dqInstance, error) {
	instanceMu.RLock()
	defer instanceMu.RUnlock()
	if instance == nil {
		return nil, gerror.New("插件未初始化：请先调用 dq.Init(g.DB(), cfg)")
	}
	return instance, nil
}

// resetInstance 仅供测试使用：重置单例。
func resetInstance() {
	instanceMu.Lock()
	defer instanceMu.Unlock()
	instance = nil
}
