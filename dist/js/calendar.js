/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Calendar — month grid rendering + navigation (vanilla, zero-dependency)
   Targets .calendar elements with optional data-calendar-* attributes.
   Fires CustomEvents: exsa:day-select, exsa:event-click, exsa:month-change. */
(function () {
  'use strict';

  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function parseEvents(el) {
    var map = {};
    var raw = el.getAttribute('data-calendar-events');
    if (!raw) return map;
    try {
      JSON.parse(raw).forEach(function (ev) {
        if (!ev || !ev.date) return;
        (map[ev.date] = map[ev.date] || []).push(ev);
      });
    } catch (e) { /* invalid JSON — render without events */ }
    return map;
  }

  function build(el) {
    var events = parseEvents(el);
    var init = el.getAttribute('data-calendar-date') || new Date().toISOString().slice(0, 10);
    var y = parseInt(init.slice(0, 4), 10) || new Date().getFullYear();
    var m = (parseInt(init.slice(5, 7), 10) || (new Date().getMonth() + 1)) - 1;
    var weekStart = parseInt(el.getAttribute('data-calendar-week-start'), 10) || 0;

    /* ── Static chrome, built once ── */
    el.classList.add('calendar');
    el.innerHTML =
      '<div class="calendar__head">' +
        '<button type="button" class="calendar__nav calendar__nav--prev" aria-label="Previous month">&#8249;</button>' +
        '<div class="calendar__label"></div>' +
        '<button type="button" class="calendar__nav calendar__nav--next" aria-label="Next month">&#8250;</button>' +
        '<button type="button" class="calendar__today">Today</button>' +
      '</div>' +
      '<div class="calendar__weekdays" role="row">' +
        DOW.map(function (d, i) {
          var n = (i + weekStart) % 7;
          return '<div class="calendar__weekday" role="columnheader">' + DOW[n] + '</div>';
        }).join('') +
      '</div>' +
      '<div class="calendar__grid" role="grid"></div>';

    var label = el.querySelector('.calendar__label');
    var grid = el.querySelector('.calendar__grid');
    var todayIso = new Date().toISOString().slice(0, 10);
    var selected = init;

    function render() {
      label.textContent = MONTHS[m] + ' ' + y;
      var first = new Date(y, m, 1);
      var offset = (first.getDay() - weekStart + 7) % 7;
      var daysInMonth = new Date(y, m + 1, 0).getDate();
      var prevDays = new Date(y, m, 0).getDate();

      var html = '';
      for (var cell = 0; cell < 42; cell++) {
        var d, isOutside = false;
        if (cell < offset) { d = prevDays - offset + cell + 1; isOutside = true; }
        else if (cell >= offset + daysInMonth) { d = cell - offset - daysInMonth + 1; isOutside = true; }
        else { d = cell - offset + 1; }

        var dIso = isOutside
          ? iso(cell < offset ? (m === 0 ? y - 1 : y) : (m === 11 ? y + 1 : y), cell < offset ? (m === 0 ? 11 : m - 1) : (m === 11 ? 0 : m + 1), d)
          : iso(y, m, d);

        var cls = 'calendar__day';
        if (isOutside) cls += ' calendar__day--outside';
        if (dIso === todayIso) cls += ' calendar__day--today';
        if (dIso === selected) cls += ' calendar__day--selected';
        var selAttr = dIso === selected ? ' aria-selected="true"' : '';

        html += '<button type="button" class="' + cls + '" role="gridcell" data-date="' + dIso + '"' + selAttr + '>' +
          '<span class="calendar__daynum">' + d + '</span>' +
          '<span class="calendar__events">';
        var evs = events[dIso] || [];
        evs.slice(0, 3).forEach(function (ev) {
          html += '<button type="button" class="calendar__event calendar__event--' + esc(ev.type || 'primary') + '"' +
            ' data-event-title="' + esc(ev.title || '') + '" data-event-date="' + esc(ev.date) + '"' +
            ' data-event-type="' + esc(ev.type || 'primary') + '" title="' + esc(ev.title || '') + '">' + esc(ev.title || '') + '</button>';
        });
        if (evs.length > 3) html += '<span class="calendar__more">+' + (evs.length - 3) + ' more</span>';
        html += '</span></button>';
      }
      grid.innerHTML = html;
    }

    /* ── Delegated interactions ── */
    el.addEventListener('click', function (e) {
      var nav = e.target.closest('.calendar__nav');
      if (nav) {
        if (nav.classList.contains('calendar__nav--prev')) { m--; if (m < 0) { m = 11; y--; } }
        else { m++; if (m > 11) { m = 0; y++; } }
        render();
        el.dispatchEvent(new CustomEvent('exsa:month-change', { detail: { year: y, month: m + 1 } }));
        return;
      }
      if (e.target.closest('.calendar__today')) {
        var now = new Date();
        y = now.getFullYear(); m = now.getMonth();
        render();
        el.dispatchEvent(new CustomEvent('exsa:month-change', { detail: { year: y, month: m + 1 } }));
        return;
      }
      var ev = e.target.closest('.calendar__event');
      if (ev) {
        el.dispatchEvent(new CustomEvent('exsa:event-click', {
          detail: { date: ev.getAttribute('data-event-date'), title: ev.getAttribute('data-event-title'), type: ev.getAttribute('data-event-type'), eventEl: ev }
        }));
        return;
      }
      var day = e.target.closest('.calendar__day');
      if (day) {
        selected = day.getAttribute('data-date');
        grid.querySelectorAll('.calendar__day--selected').forEach(function (d2) { d2.classList.remove('calendar__day--selected'); d2.removeAttribute('aria-selected'); });
        day.classList.add('calendar__day--selected');
        day.setAttribute('aria-selected', 'true');
        el.dispatchEvent(new CustomEvent('exsa:day-select', { detail: { date: selected, dayEl: day } }));
      }
    });

    el.addEventListener('keydown', function (e) {
      var day = e.target.closest('.calendar__day');
      if (day && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        day.click();
      }
    });

    render();
  }

  document.querySelectorAll('.calendar').forEach(build);
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
