/*!
 * gf-mate 嵌入脚本：任何系统（React / Vue / 原生 HTML）一行代码接入 AI 数据助手。
 *
 * 用法一（script 标签自动挂载，最简单）：
 *   <script src="https://your-host/dq/embed.js" data-dq-base="https://your-host/dq" data-dq-auto></script>
 *
 * 用法二（Web Component，React/Vue 里当普通标签用）：
 *   <dq-assistant base="https://your-host/dq" title="AI 助手"></dq-assistant>
 *
 * 用法三（JS API 动态创建）：
 *   DQAssistant.mount({ base: '/dq', title: 'AI 助手', position: 'right' })
 *
 * 内部实现：浮动气泡按钮 + iframe 加载 widget.html（沙箱隔离，样式零污染宿主，支持拖拽缩放与一键最大化）。
 */
(function (global) {
  'use strict';

  // 从 script 标签 data-dq-base 推导默认 base。
  function detectBase() {
    if (document.currentScript && document.currentScript.dataset.dqBase) {
      return document.currentScript.dataset.dqBase.replace(/\/$/, '');
    }
    // 兜底：与 embed.js 同目录（/dq/embed.js → /dq）。
    if (document.currentScript && document.currentScript.src) {
      return document.currentScript.src.replace(/[^/]*$/, '').replace(/\/$/, '');
    }
    return '';
  }

  var STYLE_ID = 'dq-embed-style';
  var CSS = [
    '.dq-bubble{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;',
    'background:linear-gradient(135deg,#4f46e5,#4338ca);color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;',
    'box-shadow:0 8px 24px -4px rgba(79,70,229,.45),0 2px 6px rgba(15,23,42,.08);font-size:24px;z-index:2147483000;',
    'display:flex;align-items:center;justify-content:center;transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .2s ease,background .2s;}',
    '.dq-bubble:hover{transform:translateY(-2px) scale(1.04);background:linear-gradient(135deg,#4338ca,#3730a3);box-shadow:0 12px 30px -4px rgba(79,70,229,.55);}',
    '.dq-bubble:active{transform:translateY(0) scale(.98);}',
    '.dq-panel{position:fixed;bottom:88px;right:24px;width:480px;height:640px;min-width:380px;min-height:460px;',
    'max-width:calc(100vw - 32px);max-height:calc(100vh - 110px);border-radius:16px;box-shadow:0 24px 60px -12px rgba(15,23,42,.2),0 0 0 1px rgba(15,23,42,.06);',
    'border:1px solid rgba(226,232,240,.9);overflow:hidden;z-index:2147483000;background:#fff;',
    'display:none;flex-direction:column;transform-origin:bottom right;transition:width .25s cubic-bezier(.16,1,.3,1),height .25s cubic-bezier(.16,1,.3,1);}',
    '.dq-panel.dq-open{display:flex;animation:dq-panel-in .26s cubic-bezier(.16,1,.3,1);}',
    '.dq-panel.dq-maximized{width:min(940px,calc(100vw - 32px))!important;height:min(88vh,880px)!important;}',
    '@keyframes dq-panel-in{from{opacity:0;transform:translateY(14px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}',
    '.dq-panel iframe{flex:1;border:none;width:100%;height:100%;}',
    '.dq-resize-handle{position:absolute;top:0;left:0;width:16px;height:16px;cursor:nwse-resize;z-index:100;user-select:none;}',
    '.dq-resize-edge-top{position:absolute;top:0;left:16px;right:0;height:6px;cursor:ns-resize;z-index:99;}',
    '.dq-resize-edge-left{position:absolute;top:16px;left:0;bottom:0;width:6px;cursor:ew-resize;z-index:99;}',
    '@media (max-width:520px){.dq-panel{right:8px;left:8px;width:auto!important;bottom:84px;height:calc(100vh - 100px)!important;border-radius:14px;}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /**
   * 创建一个助手实例（气泡 + 面板）。
   * opts: { base, title, position: 'right'|'left', open: boolean }
   */
  function createAssistant(opts) {
    opts = opts || {};
    var base = (opts.base || detectBase()).replace(/\/$/, '');
    injectStyle();

    var BUBBLE_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9.5v3"/><path d="M10 11v1.5"/></svg>';
    var CLOSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    // 气泡按钮。
    var bubble = document.createElement('button');
    bubble.type = 'button';
    bubble.className = 'dq-bubble';
    bubble.setAttribute('aria-label', opts.title || 'AI 数据助手');
    if (opts.color) {
      bubble.style.background = opts.color;
    }
    bubble.innerHTML = BUBBLE_SVG;
    if (opts.position === 'left') {
      bubble.style.right = 'auto';
      bubble.style.left = '24px';
    }

    // 面板（iframe 沙箱）。
    var panel = document.createElement('div');
    panel.className = 'dq-panel';
    if (opts.position === 'left') {
      panel.style.right = 'auto';
      panel.style.left = '24px';
    }

    // 拖拽缩放把手（隐式边缘，视觉无遮挡）
    var resizeHandle = document.createElement('div');
    resizeHandle.className = 'dq-resize-handle';
    var resizeEdgeTop = document.createElement('div');
    resizeEdgeTop.className = 'dq-resize-edge-top';
    var resizeEdgeLeft = document.createElement('div');
    resizeEdgeLeft.className = 'dq-resize-edge-left';
    panel.append(resizeHandle, resizeEdgeTop, resizeEdgeLeft);

    function initResize(handleEl, resizeX, resizeY) {
      handleEl.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var startX = e.clientX;
        var startY = e.clientY;
        var startW = panel.offsetWidth;
        var startH = panel.offsetHeight;
        panel.classList.remove('dq-maximized');
        panel.style.transition = 'none';

        // 防止拖拽过程中鼠标移入 iframe 导致事件丢失
        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;cursor:' + (resizeX && resizeY ? 'nwse-resize' : resizeX ? 'ew-resize' : 'ns-resize') + ';';
        document.body.appendChild(overlay);

        function onMouseMove(moveEvent) {
          if (resizeX) {
            var newW = startW + (startX - moveEvent.clientX);
            newW = Math.max(380, Math.min(window.innerWidth - 32, newW));
            panel.style.width = newW + 'px';
          }
          if (resizeY) {
            var newH = startH + (startY - moveEvent.clientY);
            newH = Math.max(460, Math.min(window.innerHeight - 110, newH));
            panel.style.height = newH + 'px';
          }
        }

        function onMouseUp() {
          panel.style.transition = '';
          overlay.remove();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    initResize(resizeHandle, true, true);
    initResize(resizeEdgeTop, false, true);
    initResize(resizeEdgeLeft, true, false);

    var iframe = document.createElement('iframe');
    var q = [];
    if (opts.title) q.push('title=' + encodeURIComponent(opts.title));
    if (opts.color) q.push('color=' + encodeURIComponent(opts.color));
    iframe.src = base + '/widget.html' + (q.length ? '?' + q.join('&') : '');
    iframe.title = opts.title || 'AI 数据助手';
    iframe.setAttribute('allow', 'clipboard-write');
    panel.appendChild(iframe);

    bubble.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('dq-open');
      bubble.innerHTML = isOpen ? CLOSE_SVG : BUBBLE_SVG;
    });

    // 监听子 iframe 最大化切换与关闭消息
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'dq-toggle-maximize') {
        if (e.data.maximized !== undefined) {
          if (e.data.maximized) {
            panel.classList.add('dq-maximized');
          } else {
            panel.classList.remove('dq-maximized');
          }
        } else {
          panel.classList.toggle('dq-maximized');
        }
      } else if (e.data && e.data.type === 'dq-close') {
        panel.classList.remove('dq-open');
        bubble.innerHTML = BUBBLE_SVG;
      }
    });

    var root = document.createElement('div');
    root.style.cssText = 'all:initial;';
    root.append(panel, bubble);
    document.body.appendChild(root);

    if (opts.open) panel.classList.add('dq-open');

    return {
      open: function () { panel.classList.add('dq-open'); bubble.innerHTML = CLOSE_SVG; },
      close: function () { panel.classList.remove('dq-open'); bubble.innerHTML = BUBBLE_SVG; },
      toggle: function () { bubble.click(); },
      maximize: function () { panel.classList.add('dq-maximized'); },
      restore: function () { panel.classList.remove('dq-maximized'); },
      destroy: function () { root.remove(); },
    };
  }

  // ---- Web Component：React/Vue 当普通标签用 ----
  function registerWebComponent() {
    if (typeof customElements === 'undefined') return;
    var DQAssistant = document.createElement('div').constructor && function () {
      return Reflect.construct(HTMLElement, [], DQAssistant);
    };
    DQAssistant.prototype = Object.create(HTMLElement.prototype);
    DQAssistant.prototype.constructor = DQAssistant;
    DQAssistant.observedAttributes = ['base', 'title', 'position', 'open', 'color'];
    DQAssistant.prototype.connectedCallback = function connectedCallback() {
      var self = this;
      if (self._inst) return;
      function mount() {
        self._inst = createAssistant({
          base: self.getAttribute('base') || undefined,
          title: self.getAttribute('title') || undefined,
          color: self.getAttribute('color') || undefined,
          position: self.getAttribute('position') || undefined,
          open: self.hasAttribute('open'),
        });
      }
      if (document.body) mount();
      else document.addEventListener('DOMContentLoaded', mount);
    };
    DQAssistant.prototype.disconnectedCallback = function disconnectedCallback() {
      if (this._inst) { this._inst.destroy(); this._inst = null; }
    };
    try {
      if (!customElements.get('gf-mate')) customElements.define('gf-mate', DQAssistant);
      if (!customElements.get('dq-assistant')) customElements.define('dq-assistant', DQAssistant);
    } catch (e) { /* 已注册忽略 */ }
  }

  registerWebComponent();

  // ---- JS API + script 标签自动挂载 ----
  global.DQAssistant = {
    mount: createAssistant,
  };

  if (document.currentScript && document.currentScript.dataset.dqAuto !== undefined) {
    var s = document.currentScript;
    var autoOpts = {
      base: s.dataset.dqBase,
      title: s.dataset.dqTitle,
      color: s.dataset.dqColor,
      position: s.dataset.dqPosition,
      open: s.dataset.dqOpen !== undefined,
    };
    if (document.body) createAssistant(autoOpts);
    else document.addEventListener('DOMContentLoaded', function () { createAssistant(autoOpts); });
  }
})(window);
