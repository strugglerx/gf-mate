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
  position: fixed; bottom: 86px; right: 24px; width: 460px; height: 620px;
  min-width: 320px; min-height: 360px;
  max-width: calc(100vw - 32px); max-height: calc(100vh - 110px);
  border-radius: 16px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden; z-index: 2147483000; display: none; flex-direction: column;
  background: #ffffff;
  transform-origin: bottom right;
  transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.dq-panel.dq-maximized {
  width: min(940px, calc(100vw - 32px)) !important;
  height: min(88vh, 880px) !important;
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
  .dq-panel { right: 8px; left: 8px; width: auto !important; bottom: 82px; border-radius: 14px; }
}
`;

const RESIZE_SHADOW_CSS = `
.dq-panel-resizer {
  position: absolute; top: 0; left: 0; width: 18px; height: 18px;
  cursor: nwse-resize; z-index: 100; user-select: none; touch-action: none;
}
.dq-panel-resizer::before {
  content: ""; position: absolute; top: 5px; left: 5px; width: 7px; height: 7px;
  border-top: 2px solid rgba(100, 116, 139, 0.55);
  border-left: 2px solid rgba(100, 116, 139, 0.55);
  border-top-left-radius: 2px;
}
.dq-resize-edge-top {
  position: absolute; top: 0; left: 18px; right: 0; height: 6px;
  cursor: ns-resize; z-index: 99; user-select: none; touch-action: none;
}
.dq-resize-edge-left {
  position: absolute; top: 18px; left: 0; bottom: 0; width: 6px;
  cursor: ew-resize; z-index: 99; user-select: none; touch-action: none;
}
`;

const scriptEl = document.currentScript;
const scriptBase = (scriptEl && scriptEl.dataset.dqBase || '').replace(/\/$/, '');
const scriptTitle = scriptEl && scriptEl.dataset.dqTitle || undefined;
const scriptColor = scriptEl && scriptEl.dataset.dqColor || undefined;
const scriptExamples = scriptEl && scriptEl.dataset.dqExamples || undefined;

// attachResizer 在 Shadow DOM 内挂载左上角、上边缘、左边缘三个拖拽缩放热区。
// 注意：panel 挂载了 ShadowRoot 且无 <slot>，任何挂在 panel Light DOM 的子节点都不会渲染，
// 因此缩放手柄必须挂入 shadow 内部才能接收指针事件。
function attachResizer(panel, shadow, onManualResize) {
  const corner = document.createElement('div');
  corner.className = 'dq-panel-resizer';
  const topEdge = document.createElement('div');
  topEdge.className = 'dq-resize-edge-top';
  const leftEdge = document.createElement('div');
  leftEdge.className = 'dq-resize-edge-left';
  shadow.append(corner, topEdge, leftEdge);

  function bindHandle(el, resizeX, resizeY) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      const startW = rect.width;
      const startH = rect.height;
      panel.style.width = startW + 'px';
      panel.style.height = startH + 'px';
      panel.classList.remove('dq-maximized');
      panel.style.transition = 'none';
      if (typeof onManualResize === 'function') {
        onManualResize();
      }
      el.setPointerCapture(e.pointerId);
      const onMove = (ev) => {
        if (resizeX) {
          const nextW = Math.max(320, Math.min(window.innerWidth - 32, startW + (startX - ev.clientX)));
          panel.style.width = nextW + 'px';
        }
        if (resizeY) {
          const nextH = Math.max(360, Math.min(window.innerHeight - 110, startH + (startY - ev.clientY)));
          panel.style.height = nextH + 'px';
        }
      };
      const onUp = (ev) => {
        panel.style.transition = '';
        try { el.releasePointerCapture(ev.pointerId); } catch { /* ignore */ }
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
    });
  }

  bindHandle(corner, true, true);
  bindHandle(topEdge, false, true);
  bindHandle(leftEdge, true, false);
}

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
  } else {
    // 确保新版样式覆盖旧缓存标签
    document.getElementById('dq-bubble-style').textContent = BUBBLE_CSS;
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
  shadowStyle.textContent = cssText + '\n' + RESIZE_SHADOW_CSS;
  shadow.appendChild(shadowStyle);
  const widgetRoot = document.createElement('div');
  widgetRoot.className = 'dq-widget-root';
  widgetRoot.style.cssText = 'display:flex;flex-direction:column;height:100%;';
  shadow.appendChild(widgetRoot);

  // headers：对象 / 函数 / Promise，每次请求前求值（宿主 Bearer token 鉴权用）。
  const widgetCtrl = initWidget(widgetRoot, {
    base: base || undefined,
    title,
    color,
    examples,
    headers: opts.headers,
    onToggleMaximize(maxed) {
      panel.classList.toggle('dq-maximized', !!maxed);
    },
    onClose() {
      panel.classList.remove('dq-open');
      bubble.innerHTML = BUBBLE_SVG;
    },
  });

  attachResizer(panel, shadow, () => {
    if (widgetCtrl && typeof widgetCtrl.setMaximized === 'function') {
      widgetCtrl.setMaximized(false);
    }
  });

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
      this._inst = initWidget(widgetRoot, { base: base ? base.replace(/\/$/, '') : undefined, title, color, examples, inline: true, headers: () => this._headerValue() });
    } else {
      this._inst = mount({
        base,
        title,
        color,
        examples,
        open: this.hasAttribute('open'),
        headers: () => this._headerValue(),
      });
    }
  }

  // headers 属性（DOM property，非 attribute）：Vue 用 :headers.prop / React 用 ref 赋值，
  // 可传对象或函数；每次请求前读取最新值，赋值时机早于或晚于挂载都生效。
  get headers() { return this._headers; }
  set headers(value) { this._headers = value; }

  _headerValue() {
    return typeof this._headers === 'function' ? this._headers() : this._headers;
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

