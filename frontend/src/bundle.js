// gf-mate 单文件 bundle 入口：打出一个 dq-widget.js，
// 宿主（React/Vue/原生）一行 <script> 即得浮动 AI 数据助手。
//
// 体积控制：图表用零依赖手写 SVG 渲染器（bar/line/pie + 原生 <title> 悬停），
// 不引入 ECharts；markdown 用 marked + DOMPurify。
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { initWidget } from './widget-core.js';
import { renderRenderJSON } from './charts-svg.js';
import cssText from './widget.css';

// widget-core 通过 window.renderRenderJSON / window.marked / window.DOMPurify 解耦，
// bundle 内注入（iframe 模式则由 CDN script 标签提供）。
window.renderRenderJSON = renderRenderJSON;
window.marked = marked;
window.DOMPurify = DOMPurify;

// ---- 浮动气泡 + Shadow DOM 面板 ----
const BUBBLE_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9.5v3"/><path d="M10 11v1.5"/></svg>';
const CLOSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

const BUBBLE_CSS = `
.dq-bubble {
  position: fixed; bottom: 24px; right: 24px; width: 50px; height: 50px; border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer;
  box-shadow: 0 8px 24px -4px rgba(79, 70, 229, 0.45), 0 2px 6px rgba(15, 23, 42, 0.08);
  z-index: 2147483000; display: flex; align-items: center; justify-content: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background 0.2s ease;
}
.dq-bubble:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 12px 30px -4px rgba(79, 70, 229, 0.55), 0 4px 10px rgba(15, 23, 42, 0.12);
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
}
.dq-bubble:active {
  transform: translateY(0) scale(0.98);
}
.dq-panel {
  position: fixed; bottom: 86px; right: 24px; width: 400px; height: 580px;
  max-width: calc(100vw - 32px); max-height: calc(100vh - 110px);
  border-radius: 16px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden; z-index: 2147483000; display: none; flex-direction: column;
  background: #ffffff;
  transform-origin: bottom right;
}
.dq-panel.dq-open {
  display: flex;
  animation: dq-panel-in 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes dq-panel-in {
  from { opacity: 0; transform: translateY(14px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (max-width: 480px) {
  .dq-panel { right: 8px; left: 8px; width: auto; bottom: 82px; border-radius: 14px; }
}
`;

const scriptEl = document.currentScript;
const scriptBase = (scriptEl && scriptEl.dataset.dqBase || '').replace(/\/$/, '');
const scriptTitle = scriptEl && scriptEl.dataset.dqTitle || undefined;
const scriptColor = scriptEl && scriptEl.dataset.dqColor || undefined;
const scriptExamples = scriptEl && scriptEl.dataset.dqExamples || undefined;

function mount(opts) {
  opts = opts || {};
  const base = (opts.base !== undefined ? opts.base : scriptBase).replace(/\/$/, '');
  const title = opts.title || scriptTitle || undefined;
  const color = opts.color || scriptColor || undefined;
  const examples = opts.examples || scriptExamples || undefined;

  // 气泡（挂 light DOM，宿主可 CSS 覆盖定位）。
  if (!document.getElementById('dq-bubble-style')) {
    const style = document.createElement('style');
    style.id = 'dq-bubble-style';
    style.textContent = BUBBLE_CSS;
    document.head.appendChild(style);
  }

  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'dq-bubble';
  bubble.setAttribute('aria-label', title || 'AI 数据助手');
  if (color) {
    bubble.style.background = color;
  }
  bubble.innerHTML = BUBBLE_SVG;

  // 面板：Shadow DOM 隔离样式（不污染宿主，也不被宿主污染）。
  const panel = document.createElement('div');
  panel.className = 'dq-panel';
  const shadow = panel.attachShadow({ mode: 'open' });
  const shadowStyle = document.createElement('style');
  shadowStyle.textContent = cssText;
  shadow.appendChild(shadowStyle);
  const widgetRoot = document.createElement('div');
  widgetRoot.className = 'dq-widget-root';
  widgetRoot.style.cssText = 'display:flex;flex-direction:column;height:100%;';
  shadow.appendChild(widgetRoot);

  initWidget(widgetRoot, { base: base || undefined, title, color, examples });

  bubble.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('dq-open');
    bubble.innerHTML = isOpen ? CLOSE_SVG : BUBBLE_SVG;
  });

  if (opts.open) {
    panel.classList.add('dq-open');
    bubble.innerHTML = CLOSE_SVG;
  }

  document.body.append(panel, bubble);
  return {
    open() { panel.classList.add('dq-open'); bubble.innerHTML = CLOSE_SVG; },
    close() { panel.classList.remove('dq-open'); bubble.innerHTML = BUBBLE_SVG; },
    toggle() { bubble.click(); },
    destroy() {
      bubble.remove();
      panel.remove();
    },
  };
}

// ---- Web Component 自定义标签：<gf-mate> / <dq-assistant> ----
class GfMateElement extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const base = this.getAttribute('base') || this.getAttribute('api') || scriptBase || undefined;
    const title = this.getAttribute('title') || scriptTitle || undefined;
    const color = this.getAttribute('color') || scriptColor || undefined;
    const examples = this.getAttribute('examples') || scriptExamples || undefined;
    const isInline = this.hasAttribute('inline') || this.getAttribute('mode') === 'inline';

    if (isInline) {
      const shadow = this.attachShadow({ mode: 'open' });
      const shadowStyle = document.createElement('style');
      shadowStyle.textContent = `:host { display: block; width: 100%; height: 100%; min-height: 420px; overflow: hidden; background: #fff; border-radius: inherit; }\n` + cssText;
      shadow.appendChild(shadowStyle);
      const widgetRoot = document.createElement('div');
      widgetRoot.className = 'dq-widget-root';
      widgetRoot.style.cssText = 'display:flex;flex-direction:column;height:100%;width:100%;';
      shadow.appendChild(widgetRoot);
      this._inst = initWidget(widgetRoot, { base: base ? base.replace(/\/$/, '') : undefined, title, color, examples, inline: true });
    } else {
      this._inst = mount({
        base,
        title,
        color,
        examples,
        open: this.hasAttribute('open'),
      });
    }
  }

  disconnectedCallback() {
    if (this._inst && typeof this._inst.destroy === 'function') {
      this._inst.destroy();
    }
    this._mounted = false;
  }

  open() { if (this._inst && this._inst.open) this._inst.open(); }
  close() { if (this._inst && this._inst.close) this._inst.close(); }
  toggle() { if (this._inst && this._inst.toggle) this._inst.toggle(); }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('gf-mate')) {
    customElements.define('gf-mate', GfMateElement);
  }
  if (!customElements.get('dq-assistant')) {
    customElements.define('dq-assistant', class extends GfMateElement {});
  }
}

// DOM 就绪后挂载；若页面已有 <gf-mate> 或指定 data-dq-auto="false"，由自定义标签接管，不重复创建
function ready() {
  if (document.querySelector('gf-mate, dq-assistant') || (scriptEl && scriptEl.dataset.dqAuto === 'false')) {
    window.DQWidget = { mount };
    return;
  }
  const inst = mount();
  if (scriptEl && scriptEl.dataset.dqOpen !== undefined) {
    inst.open();
  }
  window.DQWidget = inst;
  window.DQWidget.mount = mount;
}
if (document.body) ready();
else document.addEventListener('DOMContentLoaded', ready);

