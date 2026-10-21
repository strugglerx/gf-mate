# gf-mate 架构设计

> 本文面向贡献者，说明 gf-mate 的整体架构、数据流与关键设计决策。
> 使用与集成请看 [README](../README.md)。

## 总览

gf-mate 是一个 GoFrame v2 单包插件：宿主引入 → 注册数据集（表白名单）→ 挂载路由 → 前端一行 `<script>` 嵌入。AI 助手是唯一查数通道，通过**只读 SQL 门禁**直查数据库。

```
┌────────────────────────────────────────────────────┐
│ 宿主前端（React / Vue / 原生 HTML / 小程序）          │
│   <script src="/dq/dist/dq-widget.js">              │
│   → 浮动气泡 + iframe 面板（Shadow DOM 隔离）        │
└──────────────────────┬─────────────────────────────┘
                       │ POST /dq/assistant/chat (SSE)
┌──────────────────────▼─────────────────────────────┐
│ controller（HTTP 层）                                │
│   解析 message / messages（多轮历史，保留最新 10 条）  │
├────────────────────────────────────────────────────┤
│ assistant（AI 助手）                                 │
│   系统提示词（schema + 数据集↔表对照 + 数据库方言）    │
│   工具循环（服务端内部消化，最多 N 轮）                │
│   ├─ list_datasets / get_schema（元数据）            │
│   └─ sql_query（批量只读 SQL，≤10 条/次）            │
├────────────────────────────────────────────────────┤
│ queryengine（查询引擎）                              │
│   guardSQL 五道门禁 → gdb 执行 → 截断行数            │
├────────────────────────────────────────────────────┤
│ registry（注册表 = 表白名单 + schema 元数据）          │
│   FromStruct 反射 / 全库自动 / 手动定义               │
└────────────────────────────────────────────────────┘
```

## 关键设计决策

### 1. AI + 只读 SQL 是唯一查数通道（DSL 已移除）

早期版本有一层 JSON DSL（AI 输出 DSL → 校验 → 翻译 SQL）。实践证明：DSL 表达力天花板太低（JOIN/窗口函数/CTE/UNION 都要专门支持），而门禁层已经足够安全。**移除 DSL 后 AI 直接写 SQL，复杂度交给模型，安全性交给门禁**。

代价与对策：依赖 AI 写对 SQL → 提示词注入数据库方言探测结果（`Engine.DialectDesc()`，启动时探测驱动类型 + `V$VERSION`）、数据集↔物理表对照、字段 schema，把「猜名字」「用错方言」的错误消灭在提示词层。

### 2. 五道只读门禁（`internal/logic/queryengine/sqlguard.go`）

每条 AI 提交的 SQL 依次过：

1. **单语句**：分号截断多语句
2. **SELECT / WITH / EXPLAIN 开头**：写操作直接拒绝
3. **写关键字黑名单**：注释剥除后全词匹配 `INSERT/UPDATE/DELETE/...`
4. **表白名单**：注册表中的表 + 只读数据字典视图（`USER_INDEXES` 等 14 个，供索引/性能分析）
5. **强制 LIMIT + 超时**：无 LIMIT 自动追加，行数截断，单条超时兜底

CTE 名（`WITH x AS ...`）豁免表白名单。`EXPLAIN` 前缀剥除后照常过 2-4 道，不追加 LIMIT。

> 门禁是纵深防御的最后一层，不是唯一层。README 安全设计一节建议生产环境配合只读数据库账号。

### 3. 标准 OpenAI SSE 协议（工具循环在服务端）

`POST /dq/assistant/chat` 输出标准 `chat.completion.chunk` 流：

- `delta.reasoning_content`：思考过程 + 工具调用过程（`[工具调用]`/`[执行成功]`/`[执行失败]` 文本行 + `agent.event` 结构化事件）
- `delta.content`：最终回答（markdown + ```render 围栏图表 JSON）
- 结束帧 `finish_reason: stop` + `data: [DONE]`

任何 OpenAI SDK 客户端可直接对接。工具调用循环（LLM → tool → 结果回填 → 再调 LLM）完全在服务端消化，客户端只看到流。

### 4. render 渲染协议

AI 在正文里用 ```render 围栏输出 JSON，前端按 `type` 派发模板：`data_table` / `metric_cards` / `chart_bar` / `chart_line` / `chart_pie` / `map_view`。widget 内置零依赖 SVG 渲染器（`frontend/src/charts-svg.js`），bundle gzip ≤ 40KB 是红线——不引入 ECharts 等图表库。

### 5. 前端零框架 + Shadow DOM 隔离

原生 JS + CSS 是刻意决策（嵌入任意宿主、不污染宿主样式、不引入构建复杂度）。两层隔离：

- **iframe 沙箱**（`embed.js`）：样式零污染，支持拖拽/最大化
- **Shadow DOM**（`src/widget-core.js`）：bundle 模式下面板内样式天然隔离

挂在 light DOM 的元素（`.dq-bubble`/`.dq-panel`）统一 `dq-` 前缀避免选择器冲突。

### 6. 多轮对话上下文

前端维护完整历史随请求发送（`messages` 数组），服务端只保留最新 10 条 user/assistant 消息（工具消息不跨轮携带——属于上一轮内部细节）。兼容旧的单字段 `message`。

## 目录结构

```
gf-mate/
├── dq.go / config.go        # 对外门面（Init/Register/Bind）与配置
├── internal/
│   ├── controller/          # HTTP 层（SSE 编排、CORS、静态资源）
│   ├── logic/assistant/     # LLM 客户端、系统提示词、工具循环
│   ├── logic/queryengine/   # SQL 门禁、执行引擎、方言探测
│   ├── logic/registry/      # 数据集注册表（反射/全库/手动）
│   ├── model/               # 数据集/查询结果模型
│   └── render/              # render JSON 协议定义
├── frontend/                # 前端（详见 frontend/README 或主 README）
├── examples/                # server（demo 宿主）、rebuild-integration（真实接入）
├── test/                    # 集成测试（连真实 DM8 + LLM，需环境变量）
├── manifest/                # 配置示例
└── docs/                    # 本文档
```

## 已知限制

- `sqlguard` 的关键字黑名单是词法级而非 AST 级——配合表白名单与只读账号足够，但不追求对抗恶意 SQL 专家
- DM8 驱动（chunanyong/dm）会误转义列清单中的 `INDEX_NAME`，提示词已规避（查 `USER_IND_COLUMNS` 用 `SELECT *`）
- DM8 的 `EXPLAIN` 不通过 SQL 结果集返回执行计划，报错时引擎会给 AI 指引改查字典视图
