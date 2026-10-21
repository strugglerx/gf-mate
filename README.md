# gf-mate — GoFrame v2 全能 AI 陪伴助手 (Copilot & 数据分析)

<p align="left">
  <b>简体中文</b> | <a href="README_EN.md">English</a>
</p>

给任何 GoFrame v2 项目一键注入**随行智能伙伴**与「自然语言查数 + 数据智能分析」能力。
自带可嵌入任意前端系统的悬浮陪伴小窗组件，AI 自动根据意图与数据形态选择表格/柱状/折线/饼图/指标卡精准呈现。

**极简快速集成**：不用手写字段，`mate.FromStruct(&entity.X{})` 反射 GoFrame 模型即得数据集；
或者 `Mode: "all"` 全库自动注册，一行代码都不用写。

---

## 目录

- [特性](#特性)
- [快速开始（5 分钟）](#快速开始5-分钟)
- [注册数据集（三种方式）](#注册数据集三种方式)
- [HTTP API 参考](#http-api-参考)
- [AI 助手](#ai-助手)
- [嵌入前端（任意系统）](#嵌入前端任意系统)
- [配置参考](#配置参考)
- [完整示例](#完整示例)
- [安全设计](#安全设计)
- [常见问题 FAQ](#常见问题-faq)
- [架构设计](docs/architecture.md)
- [License](#license)

---

## 特性

| 能力 | 说明 |
|---|---|
| **零手写字段** | 反射 GoFrame entity（`orm`/`json` tag）自动生成字段定义，`dq` tag 可选补语义 |
| **两种注册模式** | `whitelist`（显式注册，默认，最安全）或 `all`（全库自动注册，零代码） |
| **AI 自然语言查询** | OpenAI 兼容协议（`base_url` + `api_key` + `model`），无厂商锁定 |
| **AI 写 SQL** | AI 直接写只读 SQL（批量提交，一次多条），JOIN/窗口函数/CTE/UNION 任意复杂度 |
| **AI 自动选渲染** | 根据数据形状自动输出表格/柱状/折线/饼图/指标卡，无需用户手动选 |
| **默认深度思考** | 思考模式默认开启（`reasoning_content` 流式输出），可配置关闭/调强度 |
| **安全铁律** | 五道只读门禁：单语句 / SELECT-WITH 开头 / 写关键字黑名单 / 表白名单 / 强制 LIMIT + 超时 |
| **可嵌入前端** | 单文件 Web Component `<dq-assistant>`，一行 `<script>` 嵌入 React/Vue/原生 |
| **SSE 流式** | 标准 OpenAI `chat.completion.chunk`，工具调用过程在答案区可见 |
| **多数据库** | MySQL / DM8（达梦）开箱即用，方言层可扩展 |

---

## 快速开始（5 分钟）

### 1. 引入依赖

```bash
go get github.com/strugglerx/gf-mate
```

### 2. 初始化 + 注册数据集

```go
package main

import (
    "context"
    "os"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"

    mate "github.com/strugglerx/gf-mate"
)

func main() {
    ctx := context.Background()

    // 1. 初始化（复用宿主 g.DB()，支持 DM8/MySQL/PgSQL/SQLite）
    mate.Init(g.DB(), &mate.Config{
        Assistant: mate.AssistantConfig{
            Enabled: os.Getenv("DQ_LLM_KEY") != "",
            BaseURL: "https://api.deepseek.com/v1", // 任意 OpenAI 兼容端点
            APIKey:  os.Getenv("DQ_LLM_KEY"),
            Model:   "deepseek-chat",
        },
    })

    // 2. 注册业务模型（FromStruct 自动反射字段，零手写 schema）
    ds, _ := mate.FromStruct(&entity.Project{})
    mate.Register(*ds)

    // 3. 挂载路由（/mate 下自动提供 SSE 问答 API 与嵌入式前端小窗）
    s := g.Server()
    s.Group("/mate", func(group *ghttp.RouterGroup) {
        mate.Bind(ctx, group, s)
    })
    s.Run()
}
```

### 3. 嵌入前端（任意 HTML / React / Vue 页面）

```html
<script src="/mate/dist/dq-widget.js" data-dq-base="/mate"></script>
```

页面右下角出现悬浮气泡，点开即 AI 问答面板。详见[嵌入前端](#嵌入前端任意系统)。

---

## 注册数据集（三种方式）

### 方式一：反射 GoFrame entity（推荐，零手写字段）

`mate.FromStruct(&entity.X{})` 从 ORM 模型反射字段，**一张表一个调用，循环即可注册任意多张**：

```go
// 注册多张表：循环 FromStruct
for _, e := range []interface{}{
    &entity.MiniappProject{},
    &entity.MiniappInspection{},
    &entity.MiniappContractor{},
    &entity.MiniappBuilding{},
} {
    ds, _ := mate.FromStruct(e)
    mate.Register(*ds)
}
```

反射规则：

| 来源 | 规则 |
|---|---|
| `orm:"col"` tag | 取真实列名；无则字段名转 snake_case |
| Go 类型 | `string`→string、数值→number、时间→datetime |
| 角色推断 | 数值字段→measure（count/sum/avg/max/min）、其余→dimension |
| `dq:"label=,role=,type=,agg=,enum=,desc="` | 覆盖默认推断 |
| `dq:"-"` | 跳过该字段 |
| 自动跳过 | `*_json` 列、`DeletedAt` 软删字段 |

**给 AI 补语义（可选但推荐）**：反射结果是英文/占位标签，用 `dq` tag 补中文与枚举，AI 才能问得准：

```go
type OrderSemantic struct {
    Id       string  `orm:"id"        dq:"label=订单ID,role=measure,agg=count"`
    Status   string  `orm:"status"    dq:"label=订单状态,type=enum,enum=paid:已支付|pending:待付款|cancelled:已取消"`
    Category string  `orm:"category"  dq:"label=商品类目,type=enum,enum=electronics:数码数科|clothing:服饰鞋包"`
    Amount   float64 `orm:"amount"    dq:"label=销售金额,role=measure,agg=sum"`
    // ...
}

ds, _ := mate.FromStruct(&OrderSemantic{}, func(o *mate.FromStructOptions) {
    o.Name = "order"
    o.Table = "biz_order"
    o.Label = "业务订单"
    o.Description = "电商/业务订单主表。status:paid=已支付,pending=待付款..."
})
mate.Register(*ds)
```

### 方式二：全库自动注册（all 模式，零代码）

```go
mate.Init(g.DB(), &mate.Config{ Mode: "all" })
```

自动读系统元数据（MySQL 走 `INFORMATION_SCHEMA`，DM8 走 `USER_TABLES`），
把当前库**所有表**一次注册。支持排除表：

```go
mate.Init(g.DB(), &mate.Config{
    Mode:          "all",
    ExcludeTables: []string{"sys_log", "audit_trail"}, // 跳过不想暴露的表
})
```

> ⚠️ `all` 模式暴露全库，仅适合内网/受信环境；生产建议 `whitelist`。

### 方式三：手动定义（精细控制）

```go
mate.Register(mate.Dataset{
    Name:  "order",
    Table: "biz_order",
    Label: "业务订单",
    Description: "业务订单明细主表。",
    Fields: []mate.Field{
        {Name: "id", Label: "订单ID", Role: mate.RoleMeasure, Type: "number", Aggs: []string{"count"}},
        {Name: "status", Label: "订单状态", Role: mate.RoleDimension, Type: "enum",
            Enum: []mate.EnumItem{{Value: "paid", Label: "已支付"}, {Value: "pending", Label: "待付款"}}},
        {Name: "category", Label: "商品类目", Role: mate.RoleDimension, Type: "enum"},
    },
})
```

---

## HTTP API 参考

挂载后（`mate.Bind`）暴露以下路由：

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/dq/datasets` | 列出所有已注册数据集（名称/标签/描述） |
| `GET` | `/dq/datasets/:name/schema` | 取某数据集的字段元数据 |
| `POST` | `/dq/assistant/chat` | AI 助手对话（SSE 流式） |

### AI 对话（SSE 流式）

```bash
curl -N -X POST http://localhost:8200/dq/assistant/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"统计一下项目状态分布"}'
```

返回标准 OpenAI `chat.completion.chunk` SSE 流：

```text

data: {"choices":[{"delta":{"content":"我来帮您统计..."},"finish_reason":null,"index":0}],...}
data: {"object":"agent.event","x_agent":{"type":"tool_start","name":"get_schema",...}}
data: {"choices":[{"delta":{"content":"\`\`\`render\n{\"type\":\"chart_bar\",...}\n\`\`\`"},"finish_reason":null,"index":0}],...}
data: {"choices":[{"delta":{},"finish_reason":"stop","index":0}],...}
data: [DONE]
```

- **思考流**：`delta.reasoning_content`（DeepSeek 标准字段）
- **工具调用**：`agent.event` 扩展事件（`tool_start`/`tool_end`），答案区可见
- **渲染卡片**：LLM 在正文里输出 ```` ```render ```` 围栏包裹的 JSON，前端解析渲染
- 任何 OpenAI SDK 客户端可直接对接

---

## AI 助手

### 工作原理

1. 用户自然语言提问 → 发给 LLM（OpenAI 兼容协议，思考模式默认开启）
2. LLM 只看到**数据集元数据 + 可查表清单**（看不到连接信息）
3. LLM 通过 `sql_query` 工具**批量**提交只读 SQL（一次多条，效率高），服务端五道门禁校验后执行
4. 工具循环在服务端内部消化（`maxToolCallsPerTurn` 上限）
5. LLM 根据数据形状自动选择渲染类型，输出 ```` ```render ```` 围栏 JSON
6. 前端解析渲染为表格/柱状/折线/饼图/指标卡

### 渲染类型（AI 自动选择）

| 类型 | 适用场景 |
|---|---|
| `data_table` | 明细/多列数据 |
| `chart_bar` | 分类对比（如各状态项目数） |
| `chart_line` | 时间趋势 |
| `chart_pie` | 占比分布 |
| `metric_cards` | 关键指标（总数/均值/最大） |

### 配置

```go
Assistant: mate.AssistantConfig{
    Enabled:             os.Getenv("DQ_LLM_KEY") != "",
    BaseURL:             "https://your-llm/v1",   // OpenAI 兼容端点
    APIKey:              os.Getenv("DQ_LLM_KEY"), // 密钥永远走环境变量
    Model:               "your-model",
    MaxToolCallsPerTurn: 8,    // 单轮最大工具调用次数
    RequestTimeoutSec:   60,   // 单次请求超时
    MaxContextChars:     24000, // 上下文截断上限
    EnableThinking:      nil,   // 思考模式：nil=默认开启；传 false 关闭
    ReasoningEffort:     "",    // 思考强度：low / high / max（空=模型默认）
}
```

### 只读 SQL 门禁（核心机制）

AI 的唯一查数通道是 `sql_query` 工具：批量提交只读 SELECT（单次最多 10 条，逐条独立校验与返回），支持任意复杂查询——多表 JOIN、窗口函数、CTE、子查询、UNION。

```go
RawSQL: mate.RawSQLConfig{
    Enabled:    nil,   // 默认开启（AI 唯一查数通道）；显式传 false 关闭
    MaxRows:    500,   // 无顶层 LIMIT 时自动追加
    TimeoutSec: 30,    // 单条 SQL 超时
},
```

五道安全防线：

1. 单语句：只允许一条语句（多分号拒绝）
2. 只读门禁：必须 SELECT/WITH 开头，全文词边界匹配拒绝写关键字（INSERT/UPDATE/DELETE/DROP/GRANT/CALL/SET 等 25+ 个）
3. 表白名单：FROM/JOIN 引用的表必须全部在已注册数据集的表白名单内（CTE 名豁免）
4. 行数上限：无顶层 LIMIT 时强制追加 `LIMIT maxRows`
5. 超时：单条 SQL 强制超时，防全表扫描拖死数据库

注意：AI 可读白名单表的**任意列**（无字段级限制），行级权限需通过控制注册哪些表来实现；生产环境建议给插件配一个只读数据库账号，物理层面双保险。

---

## 嵌入前端（任意系统）

### 方式一：script 标签（最简单）

```html
<!-- 基础用法 -->
<script src="/mate/dist/dq-widget.js" data-dq-base="/mate"></script>

<!-- 自定义标题与品牌主题色 -->
<script src="/mate/dist/dq-widget.js" 
  data-dq-base="/mate" 
  data-dq-title="智慧工程助手" 
  data-dq-color="#059669">
</script>
```

| 参数 | 说明 | 示例 |
|---|---|---|
| `data-dq-base` | 后端服务基础路径 | `/mate` |
| `data-dq-title` | 自定义小窗标题与欢迎语 | `智慧工程助手`（默认：`AI 数据助手`） |
| `data-dq-color` | 自定义主题色（支持 HEX / RGB） | `#059669` / `#2563eb` |
| `data-dq-open` | 页面加载后默认展开小窗 | `data-dq-open` |

页面右下角出现悬浮气泡，点开即 AI 问答面板。**零样式污染**：面板内容在 Shadow DOM 中，不影响宿主页面样式。

### 方式二：JS API（React / Vue / 原生）

```js
// React / Vue / 任意框架
import "/mate/dist/dq-widget.js";

// 可传入自定义配置手动挂载
window.DQWidget.mount({
  title: "客服数据大脑",
  color: "#7c3aed"
});

window.DQWidget.open();   // 打开面板
window.DQWidget.close();  // 关闭面板
window.DQWidget.toggle(); // 切换开合
```

### 方式三：iframe（完全隔离）

```html
<iframe src="/mate/widget.html?title=工程助手&color=%23059669" style="position:fixed;right:20px;bottom:20px;width:420px;height:640px;border:none;z-index:9999"></iframe>
```

### 跨域

插件内置 CORS 中间件：回显 Origin + `Access-Control-Allow-Credentials` + OPTIONS 预检。
宿主页面与插件不同源时无需额外配置。

---

## 配置参考

```go
mate.Init(g.DB(), &mate.Config{
    Mode:           "whitelist",            // whitelist | all
    ExcludeTables:  []string{"sys_log"},    // all 模式下排除的表
    IncludeSchemas: []string{"public"},     // all 模式下只注册这些 schema（非空时）
    Assistant:      mate.AssistantConfig{ /* 见上 */ },
    Render:         mate.RenderConfig{ EnabledTypes: []string{"data_table","chart_bar","chart_line","chart_pie","metric_cards"} },
})
```

| 配置项 | 默认 | 说明 |
|---|---|---|
| `Mode` | `whitelist` | 白名单（显式注册）或 all（全库自动） |
| `ExcludeTables` | `[]` | all 模式下排除的表名 |
| `IncludeSchemas` | `[]` | all 模式下只注册这些 schema（非空时生效） |
| `CORSOrigins` | `[]` | 跨域来源白名单。为空时回显任意 Origin 并允许携带 Cookie（仅建议内网/开发环境）；生产环境应配置允许的宿主域名，如 `["https://host.example.com"]` |
| `RawSQL.Enabled` | `false` | AI 原生 SQL 模式（只读门禁，见「AI 助手」章） |
| `RawSQL.MaxRows` | `500` | 原生 SQL 强制行数上限 |
| `RawSQL.TimeoutSec` | `30` | 原生 SQL 执行超时 |
| `Assistant.Enabled` | `false` | 是否启用 AI |
| `Assistant.BaseURL` | — | OpenAI 兼容端点 |
| `Assistant.APIKey` | — | 密钥，**永远从环境变量读取** |
| `Assistant.Model` | — | 模型名 |
| `Assistant.MaxToolCallsPerTurn` | `8` | 单轮最大工具调用次数 |
| `Assistant.RequestTimeoutSec` | `60` | 单次请求超时 |
| `Assistant.MaxContextChars` | `24000` | 上下文截断上限 |
| `Render.EnabledTypes` | 全部 5 种 | 允许的渲染类型 |

---

## 完整示例

| 示例 | 说明 |
|---|---|
| `examples/server` | 单表演示：Playground + widget 完整界面 |
| `examples/rebuild-integration` | miniapp-rebuild 集成：`-all` 全库自动注册，或 `FromStruct` 反射注册 |

```bash
cd examples/rebuild-integration

# 方式一：FromStruct 反射注册演示表
export DQ_LLM_KEY='your-key'   # 不设置则 AI 关闭，仅查询
go run .

# 方式二：全库自动注册（120 张表）
go run . -all

# 打开 http://localhost:8200/dq/
```

---

## 安全设计

1. **只读门禁（五道防线）**：单语句 / SELECT-WITH 开头 + 写关键字黑名单（词边界匹配）/ 表白名单 / 强制 LIMIT / 超时，AI 提交的每条 SQL 逐一校验。
2. **表级控制**：whitelist 模式只开放显式注册的表；all 模式可用 `ExcludeTables` 排除敏感表——这是行级/字段级控制的主要手段。
3. **AI 隔离**：AI 只接触数据集元数据 + 可查表清单，**看不到连接串**。
4. **密钥管理**：密钥仅从环境变量 `DQ_LLM_KEY` 读取，代码/配置/文档中永不出现。
5. **只读账号建议**：生产环境给插件配只读数据库账号，物理层面双保险。

---

## 常见问题 FAQ

**Q: 能注册多张表吗？**
A: 能。`mate.Register` 一次注册一个数据集，循环调用即可；`FromStruct` 一张表一次调用；`Mode: "all"` 则一次注册全库。

**Q: AI 助手需要什么模型？**
A: 任何 OpenAI 兼容协议模型（DeepSeek、通义、智谱、本地 vLLM 等）。只需 `BaseURL` + `APIKey` + `Model` 三项配置。

**Q: 不配 LLM key 能用吗？**
A: AI 是核心功能，不配 key 时助手关闭，插件只剩数据集注册与 schema 查询接口。

**Q: 支持哪些数据库？**
A: MySQL、DM8（达梦）开箱即用；AI 写标准 SQL，其他库只要 gdb 驱动可用即可。

**Q: 前端能嵌入 Vue/React 吗？**
A: 能。单文件 Web Component `<dq-assistant>` 无框架依赖，script 标签或 JS API 均可，Shadow DOM 隔离不污染宿主样式。

**Q: AI 会不会写 DELETE/UPDATE 破坏数据？**
A: 不会。五道门禁在执行前拦截：非 SELECT/WITH 开头、含写关键字（词边界）、非白名单表、多语句全部拒绝，且强制超时。建议再配只读数据库账号双保险。

**Q: 如何限制 AI 能查的数据范围？**
A: 控制注册哪些表（whitelist 模式显式注册 / all 模式 `ExcludeTables` 排除敏感表）。未注册的表 AI 完全不可见、不可查。

**Q: 查询很慢怎么办？**
A: 调低 `RawSQL.MaxRows`/`TimeoutSec`；为常用过滤/分组字段建索引；`all` 模式全库注册在表多时启动较慢（有进度日志）。

---

## License

MIT
