// gf-mate widget 核心：在给定 root 内构建 AI 助手 UI 并接管交互。
// 同时服务两种宿主：
//   1. iframe 模式（widget.html + CDN 依赖）
//   2. 单文件 bundle 模式（dist/dq-widget.js，Shadow DOM 内）
// 依赖宿主环境提供：window.renderRenderJSON（render.js）、
// window.marked / window.DOMPurify（CDN 或 bundle 注入）。

// resolveHeaders 解析宿主注入的请求头：支持对象、返回对象的函数或 Promise。
// 每次发送前重新求值，宿主 token 续期后无需重新挂载 widget。
async function resolveHeaders(headers) {
  try {
    const value = typeof headers === 'function' ? await headers() : await headers;
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

export function initWidget(root, opts) {
  'use strict';
  opts = opts || {};
  const BASE = (opts.base !== undefined ? opts.base : location.pathname.replace(/[^/]*$/, '')).replace(/\/$/, '');

  // 主题色配置（可通过 opts.color 或 opts.primaryColor 覆盖默认 Indigo 品牌色）
  const themeColor = opts.color || opts.primaryColor;
  if (themeColor) {
    root.style.setProperty('--c-brand', themeColor);
    root.style.setProperty('--primary', themeColor);
    root.style.setProperty('--c-brand-strong', themeColor);
    root.style.setProperty('--primary-hover', themeColor);
  }

  // ---- DOM 构建（安全：全部 createElement，无 innerHTML 拼接用户数据）----
  const header = document.createElement('div');
  header.className = 'widget-header';
  const h1 = document.createElement('h1');
  h1.textContent = opts.title || 'AI 数据助手';
  const status = document.createElement('span');
  status.className = 'status';
  status.id = 'chat-status';

  const actions = document.createElement('div');
  actions.className = 'header-actions';

  let isMaximized = false;
  const maxBtn = document.createElement('button');
  maxBtn.type = 'button';
  maxBtn.className = 'header-action-btn';
  maxBtn.title = '最大化 / 还原';
  maxBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

  function updateMaxBtn(maxed) {
    isMaximized = maxed;
    if (isMaximized) {
      maxBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>';
      maxBtn.title = '还原窗口';
    } else {
      maxBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
      maxBtn.title = '最大化窗口';
    }
  }

  maxBtn.addEventListener('click', () => {
    updateMaxBtn(!isMaximized);
    if (typeof opts.onToggleMaximize === 'function') {
      opts.onToggleMaximize(isMaximized);
    }
    window.parent.postMessage({ type: 'dq-toggle-maximize', maximized: isMaximized }, '*');
  });

  header.addEventListener('dblclick', (e) => {
    if (e.target.closest('button')) return;
    maxBtn.click();
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'header-action-btn';
  closeBtn.title = '关闭';
  closeBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  closeBtn.addEventListener('click', () => {
    if (typeof opts.onClose === 'function') {
      opts.onClose();
    }
    window.parent.postMessage({ type: 'dq-close' }, '*');
  });

  const newChatBtn = document.createElement('button');
  newChatBtn.type = 'button';
  newChatBtn.className = 'new-chat-btn';
  newChatBtn.title = '新建对话（清空当前上下文）';
  const newChatIcon = document.createElement('span');
  newChatIcon.className = 'new-chat-icon';
  newChatIcon.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  const newChatLabel = document.createElement('span');
  newChatLabel.textContent = '新对话';
  newChatBtn.append(newChatIcon, newChatLabel);
  newChatBtn.addEventListener('click', () => {
    // 中断进行中的流
    stopCurrentStream();
    // 清空历史与消息区，恢复欢迎页
    chatHistory.length = 0;
    messages.replaceChildren();
    messages.appendChild(welcome);
    input.value = '';
    status.textContent = '';
    input.focus();
  });

  actions.append(newChatBtn);
  if (!opts.inline) {
    actions.append(maxBtn, closeBtn);
  }
  header.append(h1, status, actions);

  const messages = document.createElement('div');
  messages.className = 'chat-messages';

  const welcome = document.createElement('div');
  welcome.className = 'welcome';
  const p1 = document.createElement('p');
  p1.className = 'welcome-title';
  p1.textContent = '你好，我是 ' + (opts.title || 'AI 数据助手');
  const p2 = document.createElement('p');
  p2.textContent = '基于元数据向我提问即可查数与出图';
  const examples = document.createElement('div');
  examples.className = 'examples';
  const defaultExamples = ['统计各状态数量分布', '查询最近新增的10条数据', '按类别汇总占比，给个饼图'];
  const exampleList = (Array.isArray(opts.examples) && opts.examples.length)
    ? opts.examples
    : (typeof opts.examples === 'string' && opts.examples ? opts.examples.split(',').map(s => s.trim()) : defaultExamples);
  exampleList.forEach((q) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'example-btn';
    const bullet = document.createElement('span');
    bullet.className = 'example-bullet';
    const textSpan = document.createElement('span');
    textSpan.textContent = q;
    btn.append(bullet, textSpan);
    examples.appendChild(btn);
  });
  welcome.append(p1, p2, examples);
  messages.appendChild(welcome);

  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';
  const input = document.createElement('textarea');
  input.rows = 1;
  input.placeholder = '提问，Enter 发送';
  const send = document.createElement('button');
  send.type = 'button';
  send.className = 'send-btn';
  send.textContent = '发送';
  inputRow.append(input, send);

  root.append(header, messages, inputRow);

  // ---- markdown / render 卡片 ----
  if (window.marked) window.marked.setOptions({ breaks: true });

  function renderMarkdown(raw) {
    if (!window.marked) return null;
    try {
      const html = window.marked.parse(raw || '');
      return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
    } catch {
      return null;
    }
  }

  function splitMixedChunks(raw, isStreaming) {
    const chunks = [];
    const re = /```(?:render|json)\s*\n([\s\S]*?)```/g;
    let lastIdx = 0;
    let m;
    while ((m = re.exec(raw)) !== null) {
      const before = raw.slice(lastIdx, m.index);
      if (before.trim()) chunks.push({ kind: 'md', text: before });
      const body = m[1].trim();
      if (body.startsWith('{') && body.includes('"type"')) {
        try {
          chunks.push({ kind: 'render', data: JSON.parse(body) });
        } catch {
          chunks.push({ kind: 'md', text: m[0] });
        }
      } else {
        chunks.push({ kind: 'md', text: m[0] });
      }
      lastIdx = re.lastIndex;
    }
    const tail = raw.slice(lastIdx);
    const unclosed = tail.match(/```(?:render|json)\s*\n([\s\S]*)$/);
    if (unclosed) {
      const before = tail.slice(0, unclosed.index);
      if (before.trim()) chunks.push({ kind: 'md', text: before });
      if (isStreaming) {
        chunks.push({ kind: 'loading' });
      } else {
        chunks.push({ kind: 'md', text: tail.slice(unclosed.index) });
      }
    } else if (tail.trim()) {
      chunks.push({ kind: 'md', text: tail });
    }
    return chunks;
  }

  // ---- Smart-AI 原生 Segments 时间线架构完全复刻 ----
  // 一个 assistant 气泡内部由线性 segments 构成：
  // 1. { kind: 'thinking', text: '', startedAt: 0, done: false, durationMs: 0, open: true, userTouched: false }
  // 2. { kind: 'tools', calls: [{ call_id, name, args, result, status: 'running'|'ok'|'fail', elapsed_ms }], openStates: {} }
  // 3. { kind: 'text', text: '' }
  function clearInitPlaceholder(div) {
    if (div && div._slots && div._slots.placeholder) {
      div._slots.placeholder.remove();
      div._slots.placeholder = null;
    }
  }

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    if (role === 'assistant') {
      const placeholder = document.createElement('div');
      placeholder.className = 'thinking-init-placeholder';
      placeholder.innerHTML = '<span class="think-spinner"></span><span class="thinking-label">正在思考…</span>';

      const thinkSlot = document.createElement('div');
      thinkSlot.className = 'ai-slot-think';
      const toolsSlot = document.createElement('div');
      toolsSlot.className = 'ai-slot-tools';
      const contentSlot = document.createElement('div');
      contentSlot.className = 'ai-slot-content';
      div.append(placeholder, thinkSlot, toolsSlot, contentSlot);

      div._slots = { placeholder, thinkSlot, toolsSlot, contentSlot };
      div._state = {
        thinking: { text: '', startedAt: 0, done: false, durationMs: 0, open: true, userTouched: false },
        tools: { calls: [], openStates: {} },
        content: { text: '' },
      };
      if (text) {
        clearInitPlaceholder(div);
        div._state.content.text = text;
        renderContentSlot(div, false);
      }
    } else {
      div.textContent = text || '';
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function formatJsonNice(payload) {
    if (payload == null || payload === '') return '(空)';
    if (typeof payload === 'string') {
      try {
        const obj = JSON.parse(payload);
        return JSON.stringify(obj, null, 2);
      } catch {
        return payload;
      }
    }
    try {
      return JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  }

  // ── 1. Smart-AI ThinkingSegment 渲染器（固定在顶部槽位） ──
  function renderThinkSlot(div) {
    if (!div._slots || !div._state) return;
    const { thinkSlot } = div._slots;
    const th = div._state.thinking;
    if (!th.text) {
      thinkSlot.innerHTML = '';
      return;
    }
    let thinkEl = thinkSlot.querySelector('.think');
    if (!thinkEl) {
      thinkEl = document.createElement('div');
      thinkSlot.appendChild(thinkEl);
    }
    thinkEl.className = 'think' + (th.done ? ' is-done' : ' is-streaming') + (th.open ? ' is-open' : '');

    const sec = Math.max(0, Math.round((th.durationMs || 0) / 100) / 10).toFixed(1).replace(/\.0$/, '');
    const labelText = !th.done
      ? (th.durationMs >= 800 ? `深度思考中 · ${sec}秒` : '深度思考中…')
      : (th.durationMs > 0 && sec !== '0' ? `已深度思考 · ${sec}秒` : '已深度思考');

    let headBtn = thinkEl.querySelector('.think-head');
    if (!headBtn) {
      headBtn = document.createElement('button');
      headBtn.type = 'button';
      headBtn.className = 'think-head';
      headBtn.innerHTML = `
        <svg class="think-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="think-spinner"></span>
        <span class="think-label"></span>
      `;
      headBtn.addEventListener('click', () => {
        th.userTouched = true;
        th.open = !th.open;
        renderThinkSlot(div);
      });
      thinkEl.appendChild(headBtn);
    }

    const chevron = headBtn.querySelector('.think-chevron');
    if (chevron) {
      if (th.open) {
        chevron.classList.add('rotated');
      } else {
        chevron.classList.remove('rotated');
      }
    }
    const spinner = headBtn.querySelector('.think-spinner');
    if (spinner) {
      spinner.style.display = th.done ? 'none' : 'inline-block';
    }
    const label = headBtn.querySelector('.think-label');
    if (label) {
      label.textContent = labelText;
    }

    let bodyWrapper = thinkEl.querySelector('.think-body-wrapper');
    if (!bodyWrapper) {
      bodyWrapper = document.createElement('div');
      bodyWrapper.className = 'think-body-wrapper';
      const inner = document.createElement('div');
      inner.className = 'think-inner';
      const bodyContent = document.createElement('div');
      bodyContent.className = 'think-body';
      inner.appendChild(bodyContent);
      bodyWrapper.appendChild(inner);
      thinkEl.appendChild(bodyWrapper);
    }
    bodyWrapper.className = 'think-body-wrapper' + (th.open ? ' is-open' : '');
    const bodyContent = bodyWrapper.querySelector('.think-body');
    bodyContent.textContent = th.text;

    if (!th.done && th.open) {
      bodyContent.scrollTop = bodyContent.scrollHeight;
    }
  }

  function createToolCardEl(tc, tcIdx, toolState, div) {
    const card = document.createElement('div');
    const isOpen = !!toolState.openStates[tcIdx];
    card.className = `tool-call-card is-${tc.status} ${isOpen ? 'is-open' : ''}`;

    const summary = document.createElement('div');
    summary.className = 'tool-call-summary';

    const arrow = document.createElement('span');
    arrow.className = `tool-call-arrow ${isOpen ? 'rotated' : ''}`;
    arrow.textContent = '›';

    const icon = document.createElement('span');
    icon.className = 'tool-call-icon';
    if (tc.status === 'running') {
      icon.className += ' is-spinning';
      icon.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
    } else if (tc.status === 'ok') {
      icon.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (tc.status === 'fail') {
      icon.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    } else {
      icon.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    }

    const main = document.createElement('span');
    main.className = 'tool-call-main';
    const name = document.createElement('span');
    name.className = 'tool-call-name';
    name.textContent = tc.name || '工具调用';

    const statusWrapper = document.createElement('span');
    statusWrapper.className = 'tool-call-status-wrapper';

    if (tc.durationMs != null && tc.durationMs > 0) {
      const dur = document.createElement('span');
      dur.className = 'tool-call-duration';
      dur.textContent = tc.durationMs < 1000
        ? `${Math.round(tc.durationMs)}ms`
        : `${(tc.durationMs / 1000).toFixed(1)}s`;
      statusWrapper.appendChild(dur);
    }

    const statusText = document.createElement('span');
    statusText.className = 'tool-call-status';
    statusText.textContent = tc.status === 'running' ? '运行中…' : tc.status === 'ok' ? '完成' : '调用失败';
    statusWrapper.appendChild(statusText);

    main.append(name, statusWrapper);
    summary.append(arrow, icon, main);
    summary.addEventListener('click', (e) => {
      e.stopPropagation();
      toolState.openStates[tcIdx] = !isOpen;
      toolState._structureDirty = true;
      renderToolsSlot(div);
    });

    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = `tool-call-body-wrapper ${isOpen ? 'is-open' : ''}`;
    const body = document.createElement('div');
    body.className = 'tool-call-body';
    const inner = document.createElement('div');
    inner.className = 'tool-call-inner';

    if (tc.args != null && tc.args !== '') {
      const fieldArgs = document.createElement('div');
      fieldArgs.className = 'tool-call-field';
      fieldArgs.innerHTML = '<span class="tool-call-label">参数</span>';
      const pre = document.createElement('pre');
      pre.textContent = formatJsonNice(tc.args);
      fieldArgs.appendChild(pre);
      inner.appendChild(fieldArgs);
    }
    if (tc.result != null && tc.result !== '') {
      const fieldRes = document.createElement('div');
      fieldRes.className = 'tool-call-field';
      fieldRes.innerHTML = `<span class="tool-call-label">${tc.status === 'fail' ? '错误' : '返回'}</span>`;
      const pre = document.createElement('pre');
      pre.textContent = formatJsonNice(tc.result);
      fieldRes.appendChild(pre);
      inner.appendChild(fieldRes);
    }
    body.appendChild(inner);
    bodyWrapper.appendChild(body);
    card.append(summary, bodyWrapper);
    return card;
  }

  // ── 2. Smart-AI EventStream 工具调用列表渲染器（支持多工具历史折叠，只留最新） ──
  function renderToolsSlot(div) {
    if (!div._slots || !div._state) return;
    const { toolsSlot } = div._slots;
    const toolState = div._state.tools;
    if (!toolState.calls || toolState.calls.length === 0) {
      toolsSlot.innerHTML = '';
      return;
    }
    let listEl = toolsSlot.querySelector('.tool-call-list');
    if (!listEl) {
      listEl = document.createElement('div');
      listEl.className = 'tool-call-list';
      toolsSlot.appendChild(listEl);
    }

    // 如果只是运行中更新耗时文本，做就地更新，避免销毁整个 DOM 重置 CSS 旋转动画！
    const total = toolState.calls.length;
    const existingCards = listEl.querySelectorAll('.tool-call-card');
    if (existingCards.length === total && !toolState._structureDirty) {
      toolState.calls.forEach((tc, idx) => {
        const card = existingCards[idx];
        if (!card) return;
        const durEl = card.querySelector('.tool-call-duration');
        if (durEl && tc.durationMs > 0) {
          durEl.textContent = tc.durationMs < 1000
            ? `${Math.round(tc.durationMs)}ms`
            : `${(tc.durationMs / 1000).toFixed(1)}s`;
        }
        const statusEl = card.querySelector('.tool-call-status');
        if (statusEl) {
          statusEl.textContent = tc.status === 'running' ? '运行中…' : tc.status === 'ok' ? '完成' : '调用失败';
        }
      });
      return;
    }
    toolState._structureDirty = false;
    listEl.innerHTML = '';

    if (total <= 1) {
      // 只有 1 个工具时直接展示
      listEl.appendChild(createToolCardEl(toolState.calls[0], 0, toolState, div));
      return;
    }

    // 超过 1 个工具调用时：前序历史工具收进折叠栏，始终只把最新的 1 个工具卡片在下方平铺展示
    const prevCalls = toolState.calls.slice(0, total - 1);
    const latestCall = toolState.calls[total - 1];

    const historyGroup = document.createElement('div');
    historyGroup.className = 'tool-history-group';

    const isHistoryOpen = !!toolState.historyOpen;
    const historyHead = document.createElement('button');
    historyHead.type = 'button';
    historyHead.className = 'tool-history-head';
    historyHead.addEventListener('click', () => {
      toolState.historyOpen = !isHistoryOpen;
      toolState._structureDirty = true;
      renderToolsSlot(div);
    });

    const arrow = document.createElement('span');
    arrow.className = `tool-history-arrow ${isHistoryOpen ? 'rotated' : ''}`;
    arrow.textContent = '›';

    const label = document.createElement('span');
    label.className = 'tool-history-label';
    const tag = document.createElement('span');
    tag.className = 'tool-history-tag';
    tag.textContent = prevCalls.length;
    const textSpan = document.createElement('span');
    textSpan.textContent = `个已完成前序工具调用`;
    label.append(arrow, tag, textSpan);
    historyHead.appendChild(label);
    historyGroup.appendChild(historyHead);

    const historyBody = document.createElement('div');
    historyBody.className = `tool-history-body ${isHistoryOpen ? 'is-open' : ''}`;
    const historyInner = document.createElement('div');
    historyInner.className = 'tool-history-inner';
    prevCalls.forEach((tc, idx) => {
      historyInner.appendChild(createToolCardEl(tc, idx, toolState, div));
    });
    historyBody.appendChild(historyInner);
    historyGroup.appendChild(historyBody);

    listEl.appendChild(historyGroup);

    // 始终展示最新工具卡片！
    listEl.appendChild(createToolCardEl(latestCall, total - 1, toolState, div));
  }

  // ── 3. Smart-AI Mixed Chunks 图文混排回答流渲染器（固定在最底部槽位） ──
  function renderContentSlot(div, isStreaming) {
    if (!div._slots || !div._state) return;
    const { contentSlot } = div._slots;
    const raw = div._state.content.text || '';
    if (!raw.trim()) {
      contentSlot.innerHTML = '';
      return;
    }
    let flow = contentSlot.querySelector('.assistant-flow-content');
    if (!flow) {
      flow = document.createElement('div');
      flow.className = 'assistant-flow-content';
      contentSlot.appendChild(flow);
    }

    const chunks = splitMixedChunks(raw, isStreaming);
    const renderKey = JSON.stringify(chunks.map((c) => c.kind + (c.text ? c.text.length : '') + (c.data ? JSON.stringify(c.data) : '')));
    if (flow.dataset.renderKey === renderKey) return;
    flow.dataset.renderKey = renderKey;

    flow.innerHTML = '';
    chunks.forEach((chunk) => {
      if (chunk.kind === 'md') {
        const mdEl = document.createElement('div');
        mdEl.className = 'markdown-body mixed-chunk--md';
        const safe = renderMarkdown(chunk.text);
        if (safe != null) {
          mdEl.innerHTML = safe;
        } else {
          mdEl.textContent = chunk.text;
        }
        flow.appendChild(mdEl);
      } else if (chunk.kind === 'render') {
        try {
          const cardEl = window.renderRenderJSON ? window.renderRenderJSON(chunk.data) : null;
          if (cardEl) {
            cardEl.classList.add('mixed-chunk--render');
            flow.appendChild(cardEl);
          }
        } catch { /* 忽略单个图表错误 */ }
      } else if (chunk.kind === 'loading') {
        const loadEl = document.createElement('div');
        loadEl.className = 'render-loading-tip mixed-chunk--loading';
        loadEl.innerHTML = '<span class="css-spinner"></span><span>正在生成图表数据…</span>';
        flow.appendChild(loadEl);
      }
    });
    messages.scrollTop = messages.scrollHeight;
  }

  function appendStreamReasoning(div, text) {
    if (!text || !div._state) return;
    clearInitPlaceholder(div);
    const th = div._state.thinking;
    if (!th.startedAt) th.startedAt = Date.now();
    th.text += text;
    renderThinkSlot(div);
  }

  function finalizeThinkingSeg(div) {
    if (!div._state) return;
    const th = div._state.thinking;
    if (th.text && !th.done) {
      th.done = true;
      th.durationMs = Math.max(0, Date.now() - (th.startedAt || Date.now()));
      if (thinkTimer) {
        clearInterval(thinkTimer);
        thinkTimer = null;
      }
      if (!th.userTouched) {
        th.open = false; // 正文生成时平滑收起思考折叠条
      }
      renderThinkSlot(div);
    }
  }

  function ensureToolsSeg(div) {
    clearInitPlaceholder(div);
    // 关键修正：工具执行属于整体思考推演的一部分，绝不能在工具刚触发时关闭思考条！
    return div._state ? div._state.tools : { calls: [], openStates: {} };
  }

  function appendStreamText(div, text) {
    if (!text || !div._state) return;
    clearInitPlaceholder(div);
    finalizeThinkingSeg(div);
    div._state.content.text += text;
    renderContentSlot(div, true);
  }

  // ---- 运行状态与中断控制 ----
  let isBusy = false;
  let currentAbortController = null;
  // 对话历史（随请求发给后端，服务端只保留最新 10 条）
  const chatHistory = [];
  const MAX_HISTORY = 20;
  let thinkTimer = null;
  let thinkStartTime = 0;

  function stopCurrentStream() {
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }
  }

  function setBusy(busy) {
    isBusy = busy;
    if (busy) {
      send.textContent = '停止';
      send.className = 'send-btn stop-btn';
      send.disabled = false;
      send.title = '停止回答 (Esc)';
      root.querySelectorAll('.example-btn').forEach((b) => {
        b.disabled = true;
        b.classList.add('disabled');
      });
    } else {
      if (thinkTimer) {
        clearInterval(thinkTimer);
        thinkTimer = null;
      }
      currentAbortController = null;
      send.textContent = '发送';
      send.className = 'send-btn';
      send.disabled = false;
      send.title = '发送 (Enter)';
      root.querySelectorAll('.example-btn').forEach((b) => {
        b.disabled = false;
        b.classList.remove('disabled');
      });
    }
  }



  async function sendChat(text) {
    if (isBusy) return;
    text = (text || input.value).trim();
    if (!text) return;
    input.value = '';
    if (welcome && welcome.parentNode) welcome.remove();
    addMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    if (chatHistory.length > MAX_HISTORY) chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
    const assistantDiv = addMessage('assistant', '');
    let finalAnswerText = '';

    setBusy(true);
    status.textContent = '';
    currentAbortController = new AbortController();

    thinkStartTime = Date.now();
    thinkTimer = setInterval(() => {
      if (assistantDiv && assistantDiv._state) {
        const th = assistantDiv._state.thinking;
        if (th && !th.done && th.startedAt) {
          th.durationMs = Date.now() - th.startedAt;
          if (th.text) {
            renderThinkSlot(assistantDiv);
          }
        }
        // 同步刷新正在运行中的工具耗时
        const tools = assistantDiv._state.tools;
        if (tools && tools.calls && tools.calls.length > 0) {
          let hasRunningTool = false;
          tools.calls.forEach((tc) => {
            if (tc.status === 'running' && tc.startedAt) {
              tc.durationMs = Date.now() - tc.startedAt;
              hasRunningTool = true;
            }
          });
          if (hasRunningTool) {
            renderToolsSlot(assistantDiv);
          }
        }
      }
    }, 150);

    try {
      const extraHeaders = await resolveHeaders(opts.headers);
      const resp = await fetch(BASE + '/assistant/chat', {
        method: 'POST',
        credentials: 'include',
        headers: Object.assign({}, extraHeaders, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message: text, messages: chatHistory.slice() }),
        signal: currentAbortController.signal,
      });
      if (!resp.ok) {
        let msg = 'HTTP ' + resp.status;
        try {
          const data = await resp.json();
          // 兼容插件自身 {error} 与宿主统一响应 {code,msg}（如鉴权失败 401/403）。
          const hostMsg = data && (data.error || data.msg || data.message);
          if (hostMsg) msg = hostMsg;
        } catch { /* ignore */ }
        throw new Error(msg);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const block = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          for (const line of block.split('\n')) {
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;
            try {
              const chunk = JSON.parse(payload);

              // 1. smart-ai 标准 agent.event（工具流精准驱动）
              if (chunk.object === 'agent.event') {
                const evt = chunk.x_agent || {};
                const extra = evt.extra || {};
                const toolsSeg = ensureToolsSeg(assistantDiv);
                const callId = extra.call_id || evt.name;
                toolsSeg._hasAgentEvents = true;

                if (evt.type === 'tool_start') {
                  status.textContent = '查询数据中…';
                  toolsSeg._structureDirty = true;
                  toolsSeg.calls.push({
                    call_id: callId,
                    name: evt.name,
                    args: extra.arguments,
                    result: '',
                    status: 'running',
                    startedAt: Date.now(),
                    durationMs: 0,
                  });
                  renderToolsSlot(assistantDiv);
                } else if (evt.type === 'tool_end') {
                  toolsSeg._structureDirty = true;
                  // 优先按 call_id 匹配处于 running 状态的工具；若 call_id 一致则倒序找到最新的那个
                  const tc = [...toolsSeg.calls].reverse().find((x) => x.call_id === callId && x.status === 'running')
                    || toolsSeg.calls.find((x) => x.call_id === callId)
                    || toolsSeg.calls[toolsSeg.calls.length - 1];
                  if (tc) {
                    tc.status = evt.status === 'success' ? 'ok' : 'fail';
                    tc.result = extra.result_preview || evt.message || '';
                    if (tc.startedAt) {
                      tc.durationMs = Math.max(1, Date.now() - tc.startedAt);
                    }
                  }
                  renderToolsSlot(assistantDiv);
                } else if (evt.type === 'tool_error') {
                  toolsSeg._structureDirty = true;
                  const tc = [...toolsSeg.calls].reverse().find((x) => x.call_id === callId && x.status === 'running')
                    || toolsSeg.calls.find((x) => x.call_id === callId)
                    || toolsSeg.calls[toolsSeg.calls.length - 1];
                  if (tc) {
                    tc.status = 'fail';
                    tc.result = evt.message || '调用失败';
                    if (tc.startedAt) {
                      tc.durationMs = Math.max(1, Date.now() - tc.startedAt);
                    }
                  }
                  renderToolsSlot(assistantDiv);
                }
                continue;
              }

              // 2. 标准 OpenAI chat.completion.chunk 流
              const delta = chunk.choices && chunk.choices[0] && chunk.choices[0].delta;
              if (!delta) continue;

              // 思考增量流（走独立 ThinkingSegment）
              if (delta.reasoning_content) {
                const raw = delta.reasoning_content;
                if (/^(\[工具调用\]|\[执行成功\]|\[执行失败\])/.test(raw)) {
                  // 如果已经通过 agent.event 驱动了结构化工具流，忽略文本兼容行，避免生成重影工具！
                  const toolsSeg = ensureToolsSeg(assistantDiv);
                  if (!toolsSeg._hasAgentEvents) {
                    if (raw.startsWith('[工具调用]')) {
                      const lineText = raw.replace(/^\[工具调用\]\s*/, '').trim();
                      const sp = lineText.indexOf(' ');
                      toolsSeg.calls.push({
                        name: sp > 0 ? lineText.slice(0, sp) : lineText,
                        args: sp > 0 ? lineText.slice(sp + 1) : '',
                        result: '',
                        status: 'running',
                        startedAt: Date.now(),
                        durationMs: 0,
                      });
                    } else if (raw.startsWith('[执行成功]')) {
                      const lineText = raw.replace(/^\[执行成功\]\s*/, '').trim();
                      const sp = lineText.indexOf(':');
                      const tc = [...toolsSeg.calls].reverse().find((x) => x.status === 'running')
                        || toolsSeg.calls[toolsSeg.calls.length - 1];
                      if (tc) {
                        tc.status = 'ok';
                        tc.result = sp > 0 ? lineText.slice(sp + 1).trim() : lineText;
                        if (tc.startedAt) {
                          tc.durationMs = Math.max(1, Date.now() - tc.startedAt);
                        }
                      }
                    } else if (raw.startsWith('[执行失败]')) {
                      const lineText = raw.replace(/^\[执行失败\]\s*/, '').trim();
                      const sp = lineText.indexOf(':');
                      const tc = [...toolsSeg.calls].reverse().find((x) => x.status === 'running')
                        || toolsSeg.calls[toolsSeg.calls.length - 1];
                      if (tc) {
                        tc.status = 'fail';
                        tc.result = sp > 0 ? lineText.slice(sp + 1).trim() : lineText;
                        if (tc.startedAt) {
                          tc.durationMs = Math.max(1, Date.now() - tc.startedAt);
                        }
                      }
                    }
                    renderToolsSlot(assistantDiv);
                  }
                } else {
                  appendStreamReasoning(assistantDiv, delta.reasoning_content);
                }
              }

              // 回答正文增量流（走独立 Mixed-Chunk Text）
              if (delta.content) {
                status.textContent = '回答中…';
                // 当正文已开始输出时，所有前序工具必须兜底置为已完成，防止意外状态残留
                const toolsSeg = assistantDiv._state && assistantDiv._state.tools;
                if (toolsSeg && toolsSeg.calls) {
                  let changed = false;
                  toolsSeg.calls.forEach((tc) => {
                    if (tc.status === 'running') {
                      tc.status = 'ok';
                      changed = true;
                    }
                  });
                  if (changed) renderToolsSlot(assistantDiv);
                }
                finalAnswerText += delta.content;
                appendStreamText(assistantDiv, delta.content);
              }
            } catch { /* 忽略非法 chunk */ }
          }
        }
      }

      // 无论如何流结束时，收尾确保没有留在 running 状态的工具卡片
      const toolsSeg = assistantDiv._state && assistantDiv._state.tools;
      if (toolsSeg && toolsSeg.calls) {
        let changed = false;
        toolsSeg.calls.forEach((tc) => {
          if (tc.status === 'running') {
            tc.status = 'ok';
            changed = true;
          }
        });
        if (changed) renderToolsSlot(assistantDiv);
      }

      clearInitPlaceholder(assistantDiv);
      finalizeThinkingSeg(assistantDiv);
      renderContentSlot(assistantDiv, false);
      status.textContent = '';
      // 回答入历史（供下一轮上下文；中断/失败不入）
      if (finalAnswerText.trim()) {
        chatHistory.push({ role: 'assistant', content: finalAnswerText });
        if (chatHistory.length > MAX_HISTORY) chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
      }
    } catch (e) {
      clearInitPlaceholder(assistantDiv);
      finalizeThinkingSeg(assistantDiv);
      if (e.name === 'AbortError') {
        appendStreamText(assistantDiv, '\n\n*（已停止生成）*');
        status.textContent = '已中断';
      } else {
        appendStreamText(assistantDiv, '\n\n[错误] ' + e.message);
        status.textContent = '失败';
      }
      renderContentSlot(assistantDiv, false);
    } finally {
      setBusy(false);
    }
  }

  send.addEventListener('click', () => {
    if (isBusy) {
      stopCurrentStream();
    } else {
      sendChat();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isBusy) sendChat();
    } else if (e.key === 'Escape' && isBusy) {
      e.preventDefault();
      stopCurrentStream();
    }
  });

  messages.addEventListener('click', (e) => {
    const btn = e.target.closest('.example-btn');
    if (btn) {
      if (isBusy) return;
      sendChat(btn.textContent.trim());
    }
  });

  return {
    setMaximized: updateMaxBtn,
  };
}
