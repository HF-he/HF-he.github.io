/**
 * zoom-element.js
 * ------------------------------------------------------------------
 * 点击放大 Mermaid 图与 KaTeX 块级公式（含移动端）。
 *
 * 特点：
 *  · 官方 zoom-image 只处理 <img>，medium-zoom 也面向图片，对 <svg> / 公式无效，
 *    因此这里用自包含的浮层实现，不依赖任何第三方库。
 *  · 采用「克隆」方式，并保留元素 id：Mermaid 的配色写在 SVG 内嵌的
 *    `#<id> ...` 作用域 <style> 里，保留 id 即自动带上整套样式。
 *  · 背景/文字色跟随当前主题（var(--color-bg) / var(--color-text)），深浅色都可读。
 *  · 支持：鼠标滚轮缩放、触屏双指缩放、拖动平移、双击复位；
 *    点击空白处或按 Esc 关闭。
 *
 * 关闭：在 index.html 中注释掉本文件的 <script> 即可
 * ------------------------------------------------------------------
 */
(function () {
  'use strict';

  var SELECTOR = '.markdown-section .mermaid svg, .markdown-section .katex-display';
  var MIN_SCALE = 0.2;
  var MAX_SCALE = 12;

  var overlay = null;
  var stage = null;
  var current = null;      // 当前被放大的克隆元素

  var scale = 1, tx = 0, ty = 0;
  var pointers = new Map();
  var dragStartX = 0, dragStartY = 0, dragTx = 0, dragTy = 0;
  var pinchStartDist = 0, pinchStartScale = 1, pinchStartTx = 0, pinchStartTy = 0;
  var pinchStartMidX = 0, pinchStartMidY = 0;
  var didMove = false;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function midpoint(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

  function applyTransform() {
    if (!current) return;
    current.style.transform =
      'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }

  function stageCenter() {
    var r = stage.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // 以视口坐标 (cx, cy) 为焦点缩放到 newScale
  function zoomAt(cx, cy, newScale) {
    var c = stageCenter();
    var sx = cx - c.x, sy = cy - c.y;
    var lx = (sx - tx) / scale, ly = (sy - ty) / scale;
    scale = clamp(newScale, MIN_SCALE, MAX_SCALE);
    tx = sx - lx * scale;
    ty = sy - ly * scale;
    applyTransform();
  }

  function fitInitial() {
    if (!current) return;
    var r = current.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var s = Math.min(
      (window.innerWidth * 0.9) / r.width,
      (window.innerHeight * 0.9) / r.height
    );
    scale = clamp(s, MIN_SCALE, 6);
    tx = 0;
    ty = 0;
    applyTransform();
  }

  function close() {
    if (!overlay) return;
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = stage = current = null;
    pointers.clear();
    document.body.classList.remove('zoom-element-open');
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape' || e.keyCode === 27) close();
  }

  function resetView() {
    scale = 1; tx = 0; ty = 0;
    applyTransform();
    fitInitial();
  }

  function open(source) {
    close();

    scale = 1; tx = 0; ty = 0; didMove = false;

    overlay = document.createElement('div');
    overlay.className = 'zoom-element-overlay';

    stage = document.createElement('div');
    stage.className = 'zoom-element-stage';

    // 克隆元素：保留 id，从而带上 Mermaid 内嵌的 #id 作用域样式
    var clone = source.cloneNode(true);
    stage.appendChild(clone);
    current = clone;

    // 继承正文区域的字体/颜色，避免移动后配色改变
    var section = document.querySelector('.markdown-section');
    if (section) {
      var cs = getComputedStyle(section);
      stage.style.fontSize = cs.fontSize;
      stage.style.color = cs.color;
    }

    overlay.appendChild(stage);
    document.body.appendChild(overlay);
    document.body.classList.add('zoom-element-open');

    // 清除可能已有的内联 transform，再按视口自适应
    clone.style.transformOrigin = 'center center';
    clone.style.transition = 'none';

    if (window.requestAnimationFrame) {
      requestAnimationFrame(fitInitial);
    } else {
      setTimeout(fitInitial, 16);
    }

    overlay.addEventListener('click', function (e) {
      if ((e.target === overlay || e.target === stage) && !didMove) close();
    });
    overlay.addEventListener('dblclick', function (e) {
      e.preventDefault();
      resetView();
    });
    overlay.addEventListener('wheel', onWheel, { passive: false });
    overlay.addEventListener('pointerdown', onPointerDown);
    overlay.addEventListener('pointermove', onPointerMove);
    overlay.addEventListener('pointerup', onPointerUp);
    overlay.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('keydown', onKey);
  }

  function onWheel(e) {
    e.preventDefault();
    var factor = Math.exp(-e.deltaY * 0.0018);
    zoomAt(e.clientX, e.clientY, scale * factor);
  }

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (overlay.setPointerCapture) {
      try { overlay.setPointerCapture(e.pointerId); } catch (err) {}
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    didMove = false;

    if (pointers.size === 1) {
      dragStartX = e.clientX; dragStartY = e.clientY;
      dragTx = tx; dragTy = ty;
    } else if (pointers.size === 2) {
      var pts = Array.from(pointers.values());
      pinchStartDist = distance(pts[0], pts[1]) || 1;
      pinchStartScale = scale;
      pinchStartTx = tx; pinchStartTy = ty;
      var mid = midpoint(pts[0], pts[1]);
      pinchStartMidX = mid.x; pinchStartMidY = mid.y;
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    var pts = Array.from(pointers.values());

    if (pointers.size === 1) {
      var dx = e.clientX - dragStartX;
      var dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didMove = true;
      tx = dragTx + dx;
      ty = dragTy + dy;
      applyTransform();
    } else if (pointers.size >= 2) {
      didMove = true;
      var d = distance(pts[0], pts[1]) || 1;
      var mid = midpoint(pts[0], pts[1]);

      tx = pinchStartTx + (mid.x - pinchStartMidX);
      ty = pinchStartTy + (mid.y - pinchStartMidY);

      var c = stageCenter();
      var sx = mid.x - c.x, sy = mid.y - c.y;
      var lx = (sx - tx) / scale, ly = (sy - ty) / scale;
      scale = clamp(pinchStartScale * (d / pinchStartDist), MIN_SCALE, MAX_SCALE);
      tx = sx - lx * scale;
      ty = sy - ly * scale;
      applyTransform();
    }
    e.preventDefault();
  }

  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 1) {
      var p = Array.from(pointers.values())[0];
      dragStartX = p.x; dragStartY = p.y;
      dragTx = tx; dragTy = ty;
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || !el.closest) return;
    var target = el.closest(SELECTOR);
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      open(target);
    }
  });

  var css = [
    '.markdown-section .mermaid svg,.markdown-section .katex-display{cursor:zoom-in}',
    'body.zoom-element-open{overflow:hidden}',
    '.zoom-element-overlay{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.75);',
    'display:flex;align-items:center;justify-content:center;overflow:hidden;',
    'cursor:zoom-out;touch-action:none;-webkit-user-select:none;user-select:none;',
    '-webkit-tap-highlight-color:transparent}',
    '.zoom-element-stage{display:flex;align-items:center;justify-content:center;',
    'margin:0;padding:0;line-height:normal;will-change:transform}',

    /* Mermaid：背景跟随主题（深色主题用深色底）；仅作用于浮层直接子级的 svg，
       避免误伤 KaTeX 内部用于画根号的 <svg> */
    '.zoom-element-stage > svg{background:var(--color-bg,#fff);border-radius:8px;',
    'padding:12px;max-width:none;max-height:none;transition:none}',

    /* KaTeX：底色与文字色跟随主题 */
    '.zoom-element-overlay .katex-display{background:var(--color-bg,#fff);',
    'color:var(--color-text,#333);padding:1.2em 1.6em;border-radius:10px;',
    'margin:0;transition:none}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
