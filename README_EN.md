# gf-mate — GoFrame v2 All-in-One AI Copilot & Data Analysis Assistant

<p align="left">
  <a href="README.md">简体中文</a> | <b>English</b>
</p>

[![Go Reference](https://pkg.go.dev/badge/github.com/strugglerx/gf-mate.svg)](https://pkg.go.dev/github.com/strugglerx/gf-mate)
[![CI](https://github.com/strugglerx/gf-mate/actions/workflows/ci.yml/badge.svg)](https://github.com/strugglerx/gf-mate/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/strugglerx/gf-mate.svg)](https://github.com/strugglerx/gf-mate/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GoFrame](https://img.shields.io/badge/Powered%20By-GoFrame%20v2.10-f36c46.svg)](https://goframe.org)
[![Go Version](https://img.shields.io/badge/Go-1.23+-00ADD8?logo=go&logoColor=white)](https://go.dev)

An intelligent companion and natural language data analysis copilot for any **GoFrame v2** application.
Features an embeddable floating companion widget for any frontend stack. The AI automatically inspects query intent and result shapes to present tables, bar charts, line charts, pie charts, or metric cards.

**Zero-boilerplate Integration**: Reflect your GoFrame entity models with `mate.FromStruct(&entity.X{})` without manual field mapping, or enable `Mode: "all"` for automatic, zero-code registration across the entire database.

---

## Table of Contents

- [Features](#features)
- [Quickstart (5 Minutes)](#quickstart-5-minutes)
- [Dataset Registration (3 Methods)](#dataset-registration-3-methods)
- [HTTP API Reference](#http-api-reference)
- [AI Copilot](#ai-copilot)
- [Frontend Embedding](#frontend-embedding)
- [Configuration Reference](#configuration-reference)
- [Full Examples](#full-examples)
- [Security Guardrails](#security-guardrails)
- [FAQ](#faq)
- [Architecture](docs/architecture.md)
- [License](#license)

---

## Features

| Capability | Description |
|---|---|
| **Zero Field Mapping** | Reflects GoFrame entity tags (`orm`/`json`) automatically into field definitions; optional `dq` tag for semantic labels & enums |
| **Two Registration Modes** | `whitelist` (explicit registration, default & recommended) or `all` (auto-registers entire database, zero code) |
| **Natural Language AI Queries** | Standard OpenAI-compatible protocol (`base_url` + `api_key` + `model`), zero vendor lock-in |
| **AI Native SQL Writing** | AI writes read-only SQL directly with batch execution; supports multi-table JOINs, window functions, CTEs, and UNIONs |
| **Automatic Render Selection** | Automatically selects data tables, bar charts, line charts, pie charts, or metric cards based on data structure |
| **Thinking Mode by Default** | Deep thinking enabled by default (`reasoning_content` streaming), customizable intensity or toggled off |
| **5-Layer Security Guardrail** | Single statement / SELECT-WITH prefix / Write keyword blacklist / Table whitelist / Forced LIMIT & timeout |
| **Universal Frontend Embed** | Single-file Web Component widget (gzip ~36KB, zero framework dependencies), embeds into React/Vue/HTML via one line |
| **OpenAI SSE Streaming** | Standard `chat.completion.chunk` SSE stream with inline tool execution events visible in response |
| **Multi-Database Support** | MySQL and Dameng (DM8) out-of-the-box; extensible dialect layer |

---

## Quickstart (5 Minutes)

### 1. Install Package

```bash
go get github.com/strugglerx/gf-mate
```

### 2. Backend Initialization & Model Registration

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

    // 1. Initialize (reuses host g.DB(), supports MySQL / DM8 / PgSQL / SQLite)
    mate.Init(g.DB(), &mate.Config{
        Assistant: mate.AssistantConfig{
            Enabled: os.Getenv("DQ_LLM_KEY") != "",
            BaseURL: "https://api.deepseek.com/v1", // Any OpenAI-compatible endpoint
            APIKey:  os.Getenv("DQ_LLM_KEY"),
            Model:   "deepseek-chat",
        },
    })

    // 2. Register business models (FromStruct reflects fields automatically)
    ds, _ := mate.FromStruct(&entity.Project{})
    mate.Register(*ds)

    // 3. Bind routes (provides SSE AI Chat APIs and the embeddable web widget)
    s := g.Server()
    s.Group("/mate", func(group *ghttp.RouterGroup) {
        mate.Bind(ctx, group, s)
    })
    s.Run()
}
```

### 3. Embed into Frontend (Any HTML / React / Vue page)

```html
<script src="/mate/dist/dq-widget.js" data-dq-base="/mate"></script>
```

A floating companion bubble appears at the bottom-right corner. Click to open the AI conversation panel.

---

## Dataset Registration (3 Methods)

### Method 1: Reflection via GoFrame Entity (Recommended)

Call `mate.FromStruct(&entity.X{})` to reflect fields directly from your ORM models. Register multiple tables with a simple loop:

```go
for _, e := range []interface{}{
    &entity.Order{},
    &entity.OrderItem{},
    &entity.Product{},
    &entity.Customer{},
} {
    ds, _ := mate.FromStruct(e)
    mate.Register(*ds)
}
```

Reflection Rules:

| Source | Rule |
|---|---|
| `orm:"col"` tag | Column name; falls back to snake_case field name |
| Go Type | `string` → string, numeric → number, time → datetime |
| Role Inference | Numbers → measure (count/sum/avg/max/min), others → dimension |
| `dq:"label=,role=,type=,agg=,enum=,desc="` | Overrides default inference |
| `dq:"-"` | Skips field |
| Auto-skipped | `*_json` columns, `DeletedAt` soft-deletion fields |

**Enrich Semantics for AI (Optional but Recommended)**:

```go
type OrderSemantic struct {
    Id       string  `orm:"id"        dq:"label=Order ID,role=measure,agg=count"`
    Status   string  `orm:"status"    dq:"label=Status,type=enum,enum=paid:Paid|pending:Pending|cancelled:Cancelled"`
    Category string  `orm:"category"  dq:"label=Category,type=enum,enum=electronics:Electronics|clothing:Clothing"`
    Amount   float64 `orm:"amount"    dq:"label=Sales Amount,role=measure,agg=sum"`
}

ds, _ := mate.FromStruct(&OrderSemantic{}, func(o *mate.FromStructOptions) {
    o.Name = "order"
    o.Table = "biz_order"
    o.Label = "Business Order"
    o.Description = "Master orders table. status:paid=Paid..."
})
mate.Register(*ds)
```

### Method 2: Full Database Auto-Registration (`all` Mode)

```go
mate.Init(g.DB(), &mate.Config{
    Mode:          "all",
    ExcludeTables: []string{"sys_log", "audit_trail"}, // Skip sensitive tables
})
```

Inspects database metadata (`INFORMATION_SCHEMA` on MySQL, `USER_TABLES` on DM8) and auto-registers every table.

> ⚠️ `all` mode exposes every unexcluded table. Recommended for internal/trusted environments; use `whitelist` mode for production.

### Method 3: Manual Definition (Granular Control)

```go
mate.Register(mate.Dataset{
    Name:  "order",
    Table: "biz_order",
    Label: "Order",
    Description: "Order records table.",
    Fields: []mate.Field{
        {Name: "id", Label: "Order ID", Role: mate.RoleMeasure, Type: "number", Aggs: []string{"count"}},
        {Name: "status", Label: "Status", Role: mate.RoleDimension, Type: "enum",
            Enum: []mate.EnumItem{{Value: "paid", Label: "Paid"}, {Value: "pending", Label: "Pending"}}},
        {Name: "category", Label: "Category", Role: mate.RoleDimension, Type: "enum"},
    },
})
```

---

## HTTP API Reference

Mounted routes under your prefix (e.g. `/mate`):

| Method | Path | Description |
|---|---|---|
| `GET` | `/mate/datasets` | List all registered datasets and tables |
| `GET` | `/mate/datasets/:name/schema` | Retrieve field schema for a dataset |
| `POST` | `/mate/assistant/chat` | AI Copilot Chat (OpenAI-compatible SSE stream) |

### AI Chat SSE Stream

```bash
curl -N -X POST http://localhost:8200/mate/assistant/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Summarize project distribution by status"}'
```

Returns standard OpenAI `chat.completion.chunk` events:
- **Thinking stream**: `delta.reasoning_content`
- **Tool execution events**: `agent.event` custom SSE events (`tool_start`/`tool_end`)
- **Render blocks**: ```` ```render { ... } ``` ```` JSON blocks rendered natively by the frontend widget

---

## AI Copilot

### Workflow

1. User sends natural language prompt → forwarded to LLM with schema metadata.
2. LLM receives only registered dataset metadata and allowable table names (no database credentials exposed).
3. LLM executes batch read-only SQL via `sql_query` tool. Each query is verified by the 5-layer SQL guardrail.
4. Tool iteration loop executes server-side up to `MaxToolCallsPerTurn`.
5. LLM formats results and outputs a ```` ```render ```` fence.
6. Frontend parses the block and renders interactive tables or zero-dependency SVG charts.

### Render Formats

| Type | Best For |
|---|---|
| `data_table` | Detailed tabular records |
| `chart_bar` | Category comparisons |
| `chart_line` | Time-series trends |
| `chart_pie` | Proportions & shares |
| `metric_cards` | Key single metrics (totals, averages, counts) |

---

## Frontend Embedding

### Method 1: Script Tag (Recommended)

```html
<!-- Basic usage -->
<script src="/mate/dist/dq-widget.js" data-dq-base="/mate"></script>

<!-- Custom Title & Theme Color -->
<script src="/mate/dist/dq-widget.js" 
  data-dq-base="/mate" 
  data-dq-title="Project AI Copilot" 
  data-dq-color="#059669">
</script>
```

| Attribute | Description | Example |
|---|---|---|
| `data-dq-base` | Backend mount prefix | `/mate` |
| `data-dq-title` | Custom title & greeting | `Project AI Copilot` (Default: `AI 数据助手`) |
| `data-dq-color` | Brand primary color (HEX or RGB) | `#059669` / `#2563eb` |
| `data-dq-open` | Expand widget automatically on load | `data-dq-open` |

Zero CSS bleeding: the widget operates inside a Shadow DOM, isolated from host page styles.

### Method 2: JavaScript API (React / Vue / SPA)

```javascript
import "/mate/dist/dq-widget.js";

// Custom initialization
window.DQWidget.mount({
  title: "Analytics Copilot",
  color: "#7c3aed"
});

window.DQWidget.open();   // Open floating panel
window.DQWidget.close();  // Close floating panel
window.DQWidget.toggle(); // Toggle visibility
```

### Method 3: Iframe Embedding (Sandbox Isolation)

```html
<iframe src="/mate/widget.html?title=Analytics&color=%23059669" style="position:fixed;right:20px;bottom:20px;width:420px;height:640px;border:none;z-index:9999"></iframe>
```

### Method 4: Official Vue 3 Rich Renderer (@struggler/smart-ai-renderer)

If you are developing a **Vue 3 application** (e.g. an admin dashboard or embedded BI portal) and want to embed AI chat and interactive visualization cards **inline within your page**, use the companion rich renderer package:

```bash
npm install @struggler/smart-ai-renderer
# or pnpm add @struggler/smart-ai-renderer
```

The structured rendering protocols (`data_table`, `chart_bar`, `chart_line`, `chart_pie`, `metric_cards`) produced by `gf-mate` are **100% natively compatible** with this package, offering rich interactive features powered by Naive UI and ECharts:

```vue
<script setup>
import { ref } from 'vue'
import { ChatMessageRenderer } from '@struggler/smart-ai-renderer'
import '@struggler/smart-ai-renderer/style.css'

const content = ref('')
const streaming = ref(false)

async function queryAI(prompt) {
  streaming.value = true
  const res = await fetch('/mate/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt })
  })
  // Stream SSE response and append delta.content to content.value...
  streaming.value = false
}
</script>

<template>
  <!-- Renders markdown and all gf-mate chart blocks natively -->
  <ChatMessageRenderer 
    :content="content" 
    :streaming="streaming" 
    :theme="{ brand: '#4f46e5', radiusMd: '8px' }" 
  />
</template>
```

---

## Configuration Reference

```go
mate.Init(g.DB(), &mate.Config{
    Mode:           "whitelist",            // "whitelist" | "all"
    ExcludeTables:  []string{"sys_log"},    // Tables to exclude in "all" mode
    IncludeSchemas: []string{"public"},     // Schemas to include in "all" mode
    CORSOrigins:    []string{"https://app.example.com"}, // CORS allowed origins
    RawSQL: mate.RawSQLConfig{
        MaxRows:    500,                    // Default limit applied when missing
        TimeoutSec: 30,                     // Per-query timeout in seconds
    },
    Assistant: mate.AssistantConfig{
        Enabled:             true,
        BaseURL:             "https://api.deepseek.com/v1",
        APIKey:              os.Getenv("DQ_LLM_KEY"),
        Model:               "deepseek-chat",
        MaxToolCallsPerTurn: 8,
        RequestTimeoutSec:   60,
        MaxContextChars:     24000,
    },
    Render: mate.RenderConfig{
        EnabledTypes: []string{"data_table", "chart_bar", "chart_line", "chart_pie", "metric_cards"},
    },
})
```

---

## Security Guardrails

1. **5-Layer SQL Guardrail**: Single statement only / Must start with SELECT or WITH / Write-keyword blacklist (25+ words with word boundaries) / Table whitelist enforcement / Forced LIMIT & query timeout.
2. **Table Whitelisting**: `whitelist` mode only allows queries against explicitly registered tables.
3. **No Connection Leakage**: LLM only sees dataset schemas and allowable table names, never connection credentials or host details.
4. **Environment-Only Secrets**: API keys are only loaded from runtime environment variables.
5. **Read-Only Database User (Recommended)**: For production environments, configure a database user with `SELECT`-only privileges for complete defense-in-depth.

---

## FAQ

**Q: Can I register multiple tables?**
A: Yes. Loop through your entities with `mate.FromStruct` and call `mate.Register`, or use `Mode: "all"` to auto-register the whole database.

**Q: Which LLMs are supported?**
A: Any OpenAI-compatible model (DeepSeek, Qwen, Zhipu, OpenAI, Anthropic via gateway, or local vLLM/Ollama).

**Q: Can I embed this into Vue or React apps?**
A: Yes. The widget is a lightweight Web Component (gzip ~36KB) with zero runtime dependencies. It renders within a Shadow DOM, preventing style conflicts with Tailwind, Bootstrap, or custom CSS.

**Q: Can the AI execute DROP or DELETE?**
A: No. Every query passes through the 5-layer SQL guardrail before hitting the database. Write statements, multiple statements, and unlisted tables are strictly rejected.

---

## License

[MIT](LICENSE)
