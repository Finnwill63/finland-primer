/* ============================================================
   The Finland Primer — daylight chart
   ------------------------------------------------------------
   Renders Helsinki's daylight hours across the year into any
   element carrying data-daylight.

     <div class="chart" data-daylight></div>

   Optional: highlight a window, as day-of-year start,end
     <div class="chart" data-daylight data-window="312,319"
          data-window-label="Your week"></div>

   Single series, so no legend — the caption names it. Values are
   also given in the tables beside each chart, so the tooltip
   enhances rather than gates.
   ============================================================ */

(function () {
  'use strict';

  // Daylight hours at Helsinki (60.17°N), every 5th day of the year.
  // Sunrise and sunset computed separately with the NOAA algorithm
  // (-0.833° refraction, iterated so declination is taken at the actual
  // event time) and differenced. Simply doubling the hour angle runs
  // ~5 minutes long in spring and autumn. These figures match the
  // sunrise/sunset tables quoted elsewhere in the guide to the minute.
  var DAYLIGHT = [
    5.99, 6.19, 6.45, 6.75, 7.10, 7.48, 7.89, 8.31, 8.74, 9.19, 9.64, 10.09,
    10.55, 11.01, 11.47, 11.93, 12.39, 12.85, 13.31, 13.76, 14.22, 14.68,
    15.13, 15.58, 16.02, 16.45, 16.87, 17.27, 17.65, 17.99, 18.30, 18.56,
    18.75, 18.88, 18.93, 18.91, 18.81, 18.64, 18.40, 18.12, 17.79, 17.42,
    17.04, 16.63, 16.20, 15.77, 15.33, 14.89, 14.44, 13.99, 13.54, 13.09,
    12.64, 12.18, 11.73, 11.28, 10.83, 10.37, 9.92, 9.48, 9.03, 8.60,
    8.17, 7.76, 7.36, 6.99, 6.66, 6.37, 6.13, 5.95, 5.85, 5.82, 5.86
  ];
  var STEP = 5; // days between samples

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTH_START = [1,32,60,91,121,152,182,213,244,274,305,335]; // non-leap day-of-year

  var W = 720, H = 250;
  var PAD = { top: 26, right: 16, bottom: 30, left: 34 };
  var PLOT_W = W - PAD.left - PAD.right;
  var PLOT_H = H - PAD.top - PAD.bottom;
  var Y_MAX = 20;

  function x(doy) { return PAD.left + ((doy - 1) / 364) * PLOT_W; }
  function y(hours) { return PAD.top + PLOT_H - (hours / Y_MAX) * PLOT_H; }

  function hoursAt(doy) {
    var pos = (doy - 1) / STEP;
    var i = Math.max(0, Math.min(DAYLIGHT.length - 1, Math.floor(pos)));
    var j = Math.min(DAYLIGHT.length - 1, i + 1);
    var t = pos - i;
    return DAYLIGHT[i] + (DAYLIGHT[j] - DAYLIGHT[i]) * t;
  }

  function fmt(hours) {
    var h = Math.floor(hours);
    var m = Math.round((hours - h) * 60);
    if (m === 60) { h += 1; m = 0; }
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
  }

  function dateLabel(doy) {
    var m = 0;
    for (var i = 0; i < 12; i++) if (doy >= MONTH_START[i]) m = i;
    return (doy - MONTH_START[m] + 1) + ' ' + MONTHS[m];
  }

  function el(tag, attrs) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  function build(host) {
    var uid = 'dl' + Math.random().toString(36).slice(2, 8);

    var win = null;
    if (host.dataset.window) {
      var parts = host.dataset.window.split(',').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) win = parts;
    }
    var winLabel = host.dataset.windowLabel || 'Your window';

    var svg = el('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'daylight-svg',
      role: 'img',
      'aria-label': 'Daylight hours in Helsinki across the year, from 5 hours 49 minutes at the winter solstice to 18 hours 56 minutes at the summer solstice.'
    });

    // Area gradient
    var defs = el('defs');
    var grad = el('linearGradient', { id: uid + 'g', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(el('stop', { offset: '0%',   'stop-color': 'var(--chart-ink)', 'stop-opacity': '0.28' }));
    grad.appendChild(el('stop', { offset: '100%', 'stop-color': 'var(--chart-ink)', 'stop-opacity': '0.04' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Horizontal grid — solid hairlines, one shade off the surface
    [0, 4, 8, 12, 16, 20].forEach(function (h) {
      svg.appendChild(el('line', {
        x1: PAD.left, x2: W - PAD.right, y1: y(h), y2: y(h), class: 'daylight-grid'
      }));
      svg.appendChild(Object.assign(el('text', {
        x: PAD.left - 8, y: y(h) + 3.5, class: 'daylight-tick', 'text-anchor': 'end'
      }), { textContent: h }));
    });

    // White-nights band, only when no specific window is highlighted
    if (!win) {
      var wnA = x(132), wnB = x(214); // 12 May – 2 Aug
      svg.appendChild(el('rect', {
        x: wnA, y: PAD.top, width: wnB - wnA, height: PLOT_H, class: 'daylight-band'
      }));
      svg.appendChild(Object.assign(el('text', {
        x: (wnA + wnB) / 2, y: PAD.top - 10, class: 'daylight-bandlabel', 'text-anchor': 'middle'
      }), { textContent: 'White nights' }));
    }

    // Area + line
    var area = 'M ' + x(1) + ' ' + y(DAYLIGHT[0]);
    var line = area;
    for (var i = 1; i < DAYLIGHT.length; i++) {
      var doy = 1 + i * STEP;
      area += ' L ' + x(doy) + ' ' + y(DAYLIGHT[i]);
      line += ' L ' + x(doy) + ' ' + y(DAYLIGHT[i]);
    }
    area += ' L ' + x(365) + ' ' + y(0) + ' L ' + x(1) + ' ' + y(0) + ' Z';
    svg.appendChild(el('path', { d: area, fill: 'url(#' + uid + 'g)', stroke: 'none' }));
    svg.appendChild(el('path', { d: line, class: 'daylight-line' }));

    // Highlighted window
    if (win) {
      var wa = x(win[0]), wb = x(win[1]);
      svg.appendChild(el('rect', {
        x: wa, y: PAD.top, width: Math.max(wb - wa, 2), height: PLOT_H, class: 'daylight-window'
      }));
      var mid = (win[0] + win[1]) / 2;
      svg.appendChild(el('circle', { cx: x(mid), cy: y(hoursAt(mid)), r: 4.5, class: 'daylight-dot' }));
      svg.appendChild(Object.assign(el('text', {
        x: x(mid), y: y(hoursAt(mid)) - 28, class: 'daylight-callout', 'text-anchor': 'middle'
      }), { textContent: winLabel }));
      svg.appendChild(Object.assign(el('text', {
        x: x(mid), y: y(hoursAt(mid)) - 16, class: 'daylight-calloutsub', 'text-anchor': 'middle'
      }), { textContent: fmt(hoursAt(mid)) }));
    }

    // Selective direct labels — the two extremes only
    [
      { doy: 355, label: '5h 49m', anchor: 'start', dy: -12 },
      { doy: 172, label: '18h 56m', anchor: 'middle', dy: -12 }
    ].forEach(function (p) {
      if (win && Math.abs(p.doy - (win[0] + win[1]) / 2) < 60) return; // the window callout wins
      svg.appendChild(el('circle', { cx: x(p.doy), cy: y(hoursAt(p.doy)), r: 3.5, class: 'daylight-extreme' }));
      svg.appendChild(Object.assign(el('text', {
        x: x(p.doy) + (p.anchor === 'start' ? -6 : 0),
        y: y(hoursAt(p.doy)) + p.dy,
        class: 'daylight-extremelabel',
        'text-anchor': p.anchor === 'start' ? 'end' : p.anchor
      }), { textContent: p.label }));
    });

    // Month labels
    MONTH_START.forEach(function (start, i) {
      var next = i === 11 ? 366 : MONTH_START[i + 1];
      svg.appendChild(Object.assign(el('text', {
        x: x((start + next) / 2), y: H - 10, class: 'daylight-month', 'text-anchor': 'middle'
      }), { textContent: MONTHS[i].charAt(0) }));
    });

    // Hover layer
    var cross = el('line', { class: 'daylight-cross', y1: PAD.top, y2: PAD.top + PLOT_H, x1: 0, x2: 0 });
    cross.style.opacity = '0';
    var hoverDot = el('circle', { r: 4, class: 'daylight-hoverdot', cx: 0, cy: 0 });
    hoverDot.style.opacity = '0';
    svg.appendChild(cross);
    svg.appendChild(hoverDot);

    var hit = el('rect', {
      x: PAD.left, y: PAD.top, width: PLOT_W, height: PLOT_H,
      fill: 'transparent', style: 'cursor:crosshair'
    });
    svg.appendChild(hit);

    host.textContent = '';
    var wrap = document.createElement('div');
    wrap.className = 'daylight-wrap';
    wrap.appendChild(svg);

    var tip = document.createElement('div');
    tip.className = 'daylight-tip';
    tip.setAttribute('aria-hidden', 'true');
    wrap.appendChild(tip);
    host.appendChild(wrap);

    function move(evt) {
      var r = svg.getBoundingClientRect();
      var cx = ((evt.clientX - r.left) / r.width) * W;
      var doy = Math.round(((cx - PAD.left) / PLOT_W) * 364 + 1);
      doy = Math.max(1, Math.min(365, doy));
      var hrs = hoursAt(doy);
      cross.setAttribute('x1', x(doy)); cross.setAttribute('x2', x(doy));
      hoverDot.setAttribute('cx', x(doy)); hoverDot.setAttribute('cy', y(hrs));
      cross.style.opacity = '1'; hoverDot.style.opacity = '1';
      tip.textContent = dateLabel(doy) + ' · ' + fmt(hrs) + ' of daylight';
      tip.style.opacity = '1';
      var frac = (x(doy) / W);
      tip.style.left = (frac * 100) + '%';
      tip.style.transform = 'translateX(' + (frac > 0.72 ? '-100%' : frac < 0.18 ? '0' : '-50%') + ')';
    }
    function leave() {
      cross.style.opacity = '0'; hoverDot.style.opacity = '0'; tip.style.opacity = '0';
    }
    hit.addEventListener('mousemove', move);
    hit.addEventListener('mouseleave', leave);
    hit.addEventListener('touchmove', function (e) {
      if (e.touches[0]) move(e.touches[0]);
    }, { passive: true });
    hit.addEventListener('touchend', leave);
  }

  function init() {
    var hosts = document.querySelectorAll('[data-daylight]');
    for (var i = 0; i < hosts.length; i++) {
      try { build(hosts[i]); } catch (e) { /* leave the fallback text in place */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
