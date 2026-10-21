// gf-mate 轻量 SVG 图表渲染器：零依赖替代 ECharts。
// 实现 renderRenderJSON 兼容的模板注册表：
//   data_table / chart_bar / chart_line / chart_pie / metric_cards
// 悬停提示用 SVG 原生 <title>（浏览器自带 tooltip）。

// smart-ai 调色盘（Editorial Indigo 系列）。
const PALETTE = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6', '#f97316'];

const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs, text) {
  const node = document.createElementNS(NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (text !== undefined) node.textContent = text;
  return node;
}

function fmtNum(v) {
  if (v === null || v === undefined || v === '') return '0';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return n.toLocaleString('zh-CN');
}

// ---- data_table ----
function renderTable(r) {
  const wrap = document.createElement('div');
  wrap.className = 'data-table-wrap';
  const table = document.createElement('table');
  table.className = 'data-table';
  const cols = (r.columns || []).map((c) => ({ field: c.field, label: c.label || c.field }));
  const thead = document.createElement('thead');
  const htr = document.createElement('tr');
  cols.forEach((c) => {
    const th = document.createElement('th');
    th.textContent = c.label;
    htr.appendChild(th);
  });
  thead.appendChild(htr);
  const tbody = document.createElement('tbody');
  (r.rows || []).forEach((row) => {
    const tr = document.createElement('tr');
    cols.forEach((c) => {
      const td = document.createElement('td');
      td.textContent = row[c.field] === undefined ? '' : String(row[c.field]);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
  wrap.appendChild(table);
  return wrap;
}

// ---- bar / line 通用坐标图 ----
function renderXY(r, type) {
  const data = r.data || [];
  const series = r.series || [];
  const xField = r.x_axis && r.x_axis.field;
  if (!data.length || !series.length || !xField) {
    return renderTable(r); // 数据不全退化为表格
  }

  const W = 480, H = 240;
  const padL = 48, padR = 14, padT = 16, padB = 42;
  const iw = W - padL - padR, ih = H - padT - padB;

  const xs = data.map((d, i) => (xField ? d[xField] : '第' + (i + 1) + '项'));
  let max = 0;
  series.forEach((s) => data.forEach((d) => { max = Math.max(max, Number(d[s.field]) || 0); }));
  if (max <= 0) max = 1;
  const niceMax = niceCeil(max);

  const svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'dq-svg-chart', role: 'img' });

  // y 轴网格 + 刻度（4 段）。
  for (let i = 0; i <= 4; i++) {
    const y = padT + ih - (ih * i) / 4;
    svg.appendChild(el('line', { x1: padL, y1: y, x2: W - padR, y2: y, stroke: '#f1f5f9', 'stroke-width': 1 }));
    const label = el('text', { x: padL - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#94a3b8' });
    label.textContent = fmtNum(Math.round((niceMax * i) / 4));
    svg.appendChild(label);
  }

  // x 轴标签（最多 12 个，多了抽稀）。
  const step = Math.ceil(xs.length / 12);
  xs.forEach((x, i) => {
    if (i % step !== 0) return;
    const t = el('text', {
      x: padL + (iw * (i + 0.5)) / xs.length, y: H - padB + 16,
      'text-anchor': 'middle', 'font-size': 10, fill: '#64748b',
    });
    t.textContent = String(x).length > 6 ? String(x).slice(0, 6) + '…' : x;
    svg.appendChild(t);
  });

  if (type === 'chart_bar') {
    // 分组柱状图。
    const groupW = iw / xs.length;
    const barW = Math.min(24, (groupW * 0.7) / series.length);
    series.forEach((s, si) => {
      data.forEach((d, i) => {
        const v = Number(d[s.field]) || 0;
        const h = (v / niceMax) * ih;
        const x = padL + groupW * i + (groupW - barW * series.length) / 2 + si * barW;
        const rect = el('rect', {
          x: x, y: padT + ih - h, width: barW - 1, height: Math.max(h, 1),
          fill: PALETTE[si % PALETTE.length], rx: 3, class: 'dq-svg-bar',
        });
        rect.setAttribute('data-tip', (xs[i] || '') + ' · ' + (s.name || s.field) + '：' + fmtNum(v));
        svg.appendChild(rect);
      });
    });
  } else {
    // 折线图。
    series.forEach((s, si) => {
      const pts = data.map((d, i) => {
        const v = Number(d[s.field]) || 0;
        return [(padL + iw * (i + 0.5)) / xs.length, padT + ih - (v / niceMax) * ih];
      });
      const dAttr = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      svg.appendChild(el('path', { d: dAttr, fill: 'none', stroke: PALETTE[si % PALETTE.length], 'stroke-width': 2, 'stroke-linejoin': 'round' }));
      pts.forEach((p, i) => {
        const c = el('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 3, fill: PALETTE[si % PALETTE.length] });
        c.setAttribute('data-tip', (xs[i] || '') + ' · ' + (s.name || s.field) + '：' + fmtNum(data[i][s.field]));
        svg.appendChild(c);
      });
    });
  }

  return wrapChart(svg, r, series);
}

// ---- pie ----
function renderPie(r) {
  const data = r.data || [];
  const nameField = r.name_field;
  const valueField = r.value_field;
  if (!data.length || !nameField || !valueField) return renderTable(r);

  const W = 480, H = 240;
  const cx = 130, cy = H / 2, R = 88;
  const total = data.reduce((s, d) => s + (Number(d[valueField]) || 0), 0) || 1;

  const svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'dq-svg-chart', role: 'img' });
  let angle = -Math.PI / 2;
  data.forEach((d, i) => {
    const v = Number(d[valueField]) || 0;
    const frac = v / total;
    const a2 = angle + frac * Math.PI * 2;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const large = frac > 0.5 ? 1 : 0;
    const path = el('path', {
      d: 'M' + cx + ' ' + cy + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' A' + R + ' ' + R + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z',
      fill: PALETTE[i % PALETTE.length], stroke: '#fff', 'stroke-width': 1.5,
    });
    path.setAttribute('data-tip', (d[nameField] || '') + '：' + fmtNum(v) + '（' + (frac * 100).toFixed(1) + '%）');
    svg.appendChild(path);
    angle = a2;
  });

  // 图例（右侧）。
  data.forEach((d, i) => {
    const y = 30 + i * 22;
    svg.appendChild(el('rect', { x: 260, y: y - 8, width: 10, height: 10, rx: 2, fill: PALETTE[i % PALETTE.length] }));
    const name = el('text', { x: 276, y: y, 'font-size': 11, fill: '#1e293b' });
    const label = String(d[nameField] || '');
    name.textContent = (label.length > 10 ? label.slice(0, 10) + '…' : label) + ' ' + fmtNum(d[valueField]);
    svg.appendChild(name);
  });

  return wrapChart(svg, r, []);
}

// ---- metric_cards ----
function renderMetrics(r) {
  const wrap = document.createElement('div');
  wrap.className = 'metric-cards';
  (r.cards || []).forEach((c) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    const label = document.createElement('div');
    label.className = 'metric-label';
    label.textContent = c.label || '';
    const value = document.createElement('div');
    value.className = 'metric-value';
    value.textContent = fmtNum(c.value);
    if (c.unit) {
      const unit = document.createElement('span');
      unit.className = 'metric-unit';
      unit.textContent = c.unit;
      value.appendChild(unit);
    }
    card.append(label, value);
    wrap.appendChild(card);
  });
  return wrap;
}

// 包装：标题 + svg 容器。
function wrapChart(svg, r, series) {
  const wrap = document.createElement('div');
  wrap.className = 'render-card';
  if (r.title) {
    const t = document.createElement('div');
    t.className = 'chart-title';
    t.textContent = r.title;
    wrap.appendChild(t);
  }
  // svg 自适应容器宽度。
  svg.style.width = '100%';
  svg.style.height = 'auto';
  wrap.appendChild(svg);
  // 多系列图例。
  if (series.length > 1) {
    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#64748b;margin-top:4px;';
    series.forEach((s, i) => {
      const item = document.createElement('span');
      const dot = document.createElement('span');
      dot.style.cssText = 'display:inline-block;width:8px;height:8px;border-radius:2px;background:' + PALETTE[i % PALETTE.length] + ';margin-right:4px;';
      item.appendChild(dot);
      item.appendChild(document.createTextNode(s.name || s.field));
      legend.appendChild(item);
    });
    wrap.appendChild(legend);
  }
  attachTooltip(wrap, svg);
  return wrap;
}

// 轻量自定义 tooltip：跟随鼠标、带样式，替代原生 <title>。
// 原理：wrap 内绝对定位一个 div，鼠标移入图形元素时填充内容并跟随。
function attachTooltip(wrap, svg) {
  const tip = document.createElement('div');
  tip.className = 'dq-tooltip';
  tip.style.cssText = [
    'position:absolute;', 'pointer-events:none;', 'z-index:10;',
    'background:rgba(15,23,42,.92);', 'color:#f8fafc;',
    'padding:5px 9px;', 'border-radius:6px;',
    'font-size:12px;', 'line-height:1.5;', 'white-space:nowrap;',
    'box-shadow:0 4px 12px rgba(0,0,0,.25);',
    'opacity:0;', 'transition:opacity .12s;',
    'top:0;', 'left:0;',
  ].join('');
  wrap.style.position = wrap.style.position || 'relative';
  wrap.appendChild(tip);

  const show = (target) => {
    const text = target.getAttribute('data-tip');
    if (!text) return;
    tip.textContent = text;
    tip.style.opacity = '1';
  };
  const move = (evt) => {
    const rect = wrap.getBoundingClientRect();
    let x = evt.clientX - rect.left + 12;
    let y = evt.clientY - rect.top - 10;
    // 边界翻转：右侧/底部溢出时往左/上放。
    if (x + tip.offsetWidth > rect.width) x = evt.clientX - rect.left - tip.offsetWidth - 12;
    if (y + tip.offsetHeight > rect.height) y = evt.clientY - rect.top - tip.offsetHeight - 4;
    if (y < 0) y = 4;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  };
  const hide = () => { tip.style.opacity = '0'; };

  // 对所有带 data-tip 的图形元素生效（rect/circle/path）。
  svg.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-tip]');
    if (t) show(t);
  });
  svg.addEventListener('mousemove', move);
  svg.addEventListener('mouseout', (e) => {
    const t = e.target.closest('[data-tip]');
    if (t) hide();
  });
}

// 向上取整到「好看的」刻度上限（1/2/5 × 10^n）。
function niceCeil(v) {
  if (v <= 5) return 5;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 5, 10]) {
    if (m * exp >= v) return m * exp;
  }
  return v;
}

// renderRenderJSON 兼容入口：type → 渲染函数，返回 DOM 元素。
function renderRenderJSON(renderObj) {
  if (!renderObj || !renderObj.type) return null;
  switch (renderObj.type) {
    case 'data_table': return renderTable(renderObj);
    case 'chart_bar': return renderXY(renderObj, 'chart_bar');
    case 'chart_line': return renderXY(renderObj, 'chart_line');
    case 'chart_pie': return renderPie(renderObj);
    case 'metric_cards': return renderMetrics(renderObj);
    default: return renderTable(renderObj);
  }
}

export { renderRenderJSON };
