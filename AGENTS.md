# gf-mate 项目指南（给 AI 协作者）

## 这是什么项目

GoFrame v2 单包插件（`github.com/strugglerx/gf-mate`）：给任何业务系统提供「自然语言查数据 + AI 分析」能力。
后端 Go（只读 SQL 门禁 + AI 助手，AI + 原生 SQL 是唯一查数通道，DSL 已移除），前端原生 JS（无框架，零依赖 SVG 图表）。

**当前阶段**：功能全通（真实 DM8 + DeepSeek Flash 端到端验证），前端已适配 Smart-AI Editorial Indigo 规范，已按开源单包结构整理。

## 目录结构

```
gf-mate/
├── dq.go / config.go        # 对外门面（Init/Register/Bind）与配置
├── internal/
│   ├── controller/          # HTTP 层（SSE 编排、CORS、静态资源）
│   ├── logic/assistant/     # LLM 客户端、系统提示词、工具循环
│   ├── logic/queryengine/   # SQL 门禁（sqlguard.go）、执行引擎、方言探测
│   ├── logic/registry/      # 数据集注册表（FromStruct 反射/全库/手动）
│   ├── model/               # 数据集/查询结果模型
│   └── render/              # render JSON 协议
├── frontend/                # 前端（原生 JS，无框架）
│   ├── index.html           # Playground（iframe 包 widget.html）
│   ├── widget.html          # iframe 模式小窗（CDN 依赖版）
│   ├── embed.js             # <dq-assistant> Web Component（iframe 兜底）
│   ├── style.css            # Playground 外壳样式
│   ├── src/
│   │   ├── widget-core.js   # widget 核心逻辑（多轮历史、SSE 解析、工具流渲染）
│   │   ├── widget.css       # widget 样式（Shadow DOM 内注入）
│   │   ├── charts-svg.js    # 零依赖 SVG 图表渲染器
│   │   └── bundle.js        # 单文件 bundle 入口（浮动气泡 + Shadow DOM 面板）
│   ├── build.mjs            # esbuild 构建脚本
│   └── dist/dq-widget.js    # 构建产物（gzip ~36KB，红线 ≤40KB）
├── examples/                # server（demo 宿主）、rebuild-integration（真实接入示例）
├── test/                    # 集成测试（连真实 DM8 + LLM）
├── manifest/                # 配置示例
└── docs/architecture.md     # 架构文档
```

## 怎么跑起来

```bash
# 1. 构建前端 bundle（改了 src/ 或样式后必须重新构建）
cd frontend && npm install && npm run build
#    确认输出 raw/gzip 体积没超 40KB 红线

# 2. 构建并启动 demo 服务（端口 8200，连真实 DM8 + DeepSeek）
go build -o /tmp/dq-server ./examples/server
# 环境变量在 /tmp/dq-env（含 DQ_LLM_KEY），没有就问用户要
(lsof -ti:8200 | xargs kill) 2>/dev/null; source /tmp/dq-env && /tmp/dq-server &
```

三个页面（浏览器打开，⌘⇧R 强刷避免缓存）：
- `http://localhost:8200/dq/` — Playground
- `http://localhost:8200/dq/demo.html` — 宿主模拟页（右下角浮动气泡）
- `http://localhost:8200/dq/widget.html` — iframe 模式小窗

## 设计约束（改代码/样式必须遵守）

1. **不许引入前端框架**（React/Vue/jQuery 都不行）——原生 JS + CSS 是刻意决策
2. **bundle 体积红线**：`dist/dq-widget.js` gzip ≤ 40KB。不许把 ECharts 加回 bundle；Playground 页面可以用 CDN
3. **两套样式文件独立维护**：`style.css`（Playground 外壳，light DOM）与 `src/widget.css`（widget，Shadow DOM 内）。视觉语言统一，但不能互相 @import
4. **Shadow DOM 隔离**：widget 面板内样式天然隔离宿主；`.dq-bubble`/`.dq-panel` 挂 light DOM，选择器必须带 `.dq-` 前缀
5. **不许用 innerHTML 拼用户数据**（XSS 红线），用 DOM API 或 textContent
6. **CSS 类名是 JS 钩子**：`.msg`、`.msg.assistant`、`.markdown-body`、`.render-card`、`.example-btn`、`.new-chat-btn` 等被 widget-core.js 查询，改名必须同步改 JS，最好别改
7. **响应式**：widget 面板在 ≤480px 全宽，移动端体验要保住
8. **LLM key 永远不进代码/配置示例**，从环境变量 `DQ_LLM_KEY` 读
9. **SQL 门禁不许放宽**：五道防线（单语句/SELECT-WITH-EXPLAIN 开头/写关键字黑名单/表白名单/强制 LIMIT+超时）是安全底线，改动必须过 `sqlguard_test.go`

## 后端接口速查

| 接口 | 说明 |
|---|---|
| `GET /dq/datasets` | 数据集列表（含物理表名） |
| `GET /dq/datasets/:name/schema` | 字段 schema |
| `POST /dq/assistant/chat` | 标准 OpenAI SSE：`messages`（多轮历史，服务端保留最新 10 条）或 `message`（单轮）；`reasoning_content`（思考+工具）+ `content`（回答+```render 围栏）+ `[DONE]` |

## 验证清单

```bash
# Go 全量测试
go test ./...

# Playwright 程序化验证（几何断言，不依赖截图）
python3 - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    page = b.new_page(viewport={"width":1400,"height":900})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto('http://localhost:8200/dq/demo.html')
    page.wait_for_load_state('networkidle'); page.wait_for_timeout(1500)
    page.evaluate("document.querySelector('.dq-bubble').click()")
    page.wait_for_timeout(1000)
    frames = [f for f in page.frames if 'widget' in f.url]
    geo = frames[0].evaluate("""() => ({
      bubble: !!document.querySelector('.new-chat-btn'),
      msgs: !!document.querySelector('.chat-messages'),
      input: !!document.querySelector('.input-row'),
    })""")
    print(geo)  # 期望全 true
    print('errors:', errs or 'NONE')  # 期望 NONE
    b.close()
EOF

# 视觉验收：让用户开浏览器看三个页面（⌘⇧R 强刷）
```

## 其他约定

- 提交信息中文，格式：`feat:/fix:/chore: 摘要` + 空行 + 要点列表
- 长任务（>1 分钟）用后台执行，别前台硬等
- 数据锚点（验证用）：construction=8105、cancelled=4414、罗湖 district_code=440303000、2025-10 创建项目 54 个
- 删文件先备份到 /tmp 或确认 git 历史里有，不裸删
