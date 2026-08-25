/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Chart — data arrays → SVG markup (vanilla, zero-dependency)
   Targets any element with [data-chart-values].
   Types: line | area | bar | sparkline (class or data-chart-type).
   Optional second series: data-chart-values-2. */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) { if (attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k]); }
    return el;
  }

  function parseList(str) {
    return String(str || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; });
  }

  function niceMax(n) {
    if (n <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log10(n)));
    var m = n / pow;
    var step = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
    return step * pow;
  }

  function fmt(n) {
    if (n >= 1000 && n % 1000 === 0) return (n / 1000) + 'k';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  function linePath(pts) {
    return pts.map(function (p, i) {
      return (i ? 'L' : 'M') + p.x + ' ' + p.y;
    }).join(' ');
  }

  function build(root) {
    var values = parseList(root.getAttribute('data-chart-values')).map(Number);
    if (!values.length) return;
    var values2 = parseList(root.getAttribute('data-chart-values-2')).map(Number);
    var labels = parseList(root.getAttribute('data-chart-labels'));
    var type = root.getAttribute('data-chart-type') ||
      (root.classList.contains('chart--bar') ? 'bar' :
       root.classList.contains('chart--area') ? 'area' :
       root.classList.contains('chart--sparkline') ? 'sparkline' : 'line');

    var spark = type === 'sparkline';
    var W = spark ? 300 : 600, H = spark ? 60 : 240;
    var padL = spark ? 2 : 42, padR = spark ? 2 : 16, padT = spark ? 4 : 18, padB = spark ? 4 : 30;

    var max = Math.max(niceMax(Math.max.apply(null, values.concat(values2.length ? values2 : []))), 1);
    var plotW = W - padL - padR, plotH = H - padT - padB;

    var g = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img',
      'aria-label': root.getAttribute('aria-label') || root.getAttribute('data-chart-title') || 'Chart' });

    function xy(i, v) {
      return {
        x: padL + (values.length === 1 ? plotW / 2 : (i / (values.length - 1)) * plotW),
        y: padT + plotH - (v / max) * plotH
      };
    }

    /* Grid + y axis */
    if (!spark) {
      var grid = svg('g', { class: 'chart__grid' });
      var axis = svg('g', { class: 'chart__axis' });
      for (var t = 0; t <= 4; t++) {
        var yv = (max / 4) * t;
        var gy = padT + plotH - (yv / max) * plotH;
        grid.appendChild(svg('line', { x1: padL, y1: gy, x2: W - padR, y2: gy }));
        var txt = svg('text', { x: padL - 8, y: gy + 3.5, 'text-anchor': 'end' });
        txt.textContent = fmt(Math.round(yv));
        axis.appendChild(txt);
      }
      g.appendChild(grid); g.appendChild(axis);
    }

    /* X labels */
    if (!spark && labels.length) {
      var xa = svg('g', { class: 'chart__axis' });
      var step = Math.ceil(labels.length / 8);
      labels.forEach(function (lb, i) {
        if (i % step !== 0 && i !== labels.length - 1) return;
        var t2 = svg('text', { x: xy(i, 0).x, y: H - 8, 'text-anchor': 'middle' });
        t2.textContent = lb;
        xa.appendChild(t2);
      });
      g.appendChild(xa);
    }

    function series(pts, cls, secondary) {
      var grp = svg('g', { class: 'chart__series' + (secondary ? ' chart__series--2' : '') });
      if (type === 'bar') {
        var bw = Math.min((plotW / values.length) * 0.55, 48);
        values.forEach(function (v, i) {
          var p = xy(i, v);
          var rect = svg('rect', { class: 'chart__bar', x: p.x - bw / 2, y: p.y,
            width: bw, height: Math.max(padT + plotH - p.y, 1), rx: 2 });
          if (root.getAttribute('data-chart-tabindex') === 'true') rect.setAttribute('tabindex', '0');
          grp.appendChild(rect);
        });
      } else {
        var path = svg('path', { class: 'chart__line', d: linePath(pts) });
        grp.appendChild(path);
        if (type === 'area') {
          var close = 'L' + pts[pts.length - 1].x + ' ' + (padT + plotH) + 'L' + pts[0].x + ' ' + (padT + plotH) + 'Z';
          grp.appendChild(svg('path', { class: 'chart__area chart__area--' + (secondary ? 2 : 1), d: linePath(pts) + close }));
        }
        if (!spark) {
          pts.forEach(function (p) {
            grp.appendChild(svg('circle', { class: 'chart__point', cx: p.x, cy: p.y, r: 3.5 }));
          });
        }
      }
      return grp;
    }

    var pts1 = values.map(function (v, i) { return xy(i, v); });
    g.appendChild(series(pts1, 'series-1', false));
    if (values2.length) {
      var pts2 = values2.map(function (v, i) { return xy(i, v); });
      g.appendChild(series(pts2, 'series-2', true));
    }

    root.innerHTML = '';
    root.appendChild(g);
    if (!root.classList.contains('chart')) root.classList.add('chart');
  }

  document.querySelectorAll('[data-chart-values]').forEach(function (el) { build(el); });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
