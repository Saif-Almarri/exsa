/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Table — datatable behaviors (vanilla, zero-dependency)
   Sortable:  table.tbl--sortable with th[data-sort]
   Filter:    input.table-search[data-table="#id"] filters tbody rows
   Select:    table.tbl--selectable — checkboxes .tbl__check,
              head checkbox gets class .tbl__check--all
   Events:    'exsa:table-sort', 'exsa:table-filter', 'exsa:row-toggle' */
(function () {
  'use strict';

  /* ── Sorting ── */
  document.querySelectorAll('.tbl--sortable').forEach(function (table) {
    table.querySelectorAll('th[data-sort]').forEach(function (th) {
      th.setAttribute('tabindex', '0');
      th.setAttribute('role', 'columnheader');
      var dir = null;
      function run() {
        var next = dir === 'asc' ? 'desc' : 'asc';
        dir = next;
        var col = Array.prototype.indexOf.call(th.parentElement.children, th);
        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        rows.sort(function (a, b) {
          var av = (a.cells[col] ? a.cells[col].textContent.trim() : '');
          var bv = (b.cells[col] ? b.cells[col].textContent.trim() : '');
          var an = parseFloat(av.replace(/[^0-9.\-]/g, ''));
          var bn = parseFloat(bv.replace(/[^0-9.\-]/g, ''));
          var cmp;
          if (!isNaN(an) && !isNaN(bn) && /\d/.test(av) && /\d/.test(bv)) cmp = an - bn;
          else cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' });
          return next === 'asc' ? cmp : -cmp;
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
        table.querySelectorAll('th[aria-sort]').forEach(function (t) {
          if (t !== th) t.removeAttribute('aria-sort');
        });
        th.setAttribute('aria-sort', next === 'asc' ? 'ascending' : 'descending');
        table.dispatchEvent(new CustomEvent('exsa:table-sort', { detail: { column: col, direction: next } }));
      }
      th.addEventListener('click', run);
      th.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(); }
      });
    });
  });

  /* ── Filter ── */
  document.querySelectorAll('.table-search[data-table]').forEach(function (input) {
    var table = document.querySelector(input.getAttribute('data-table'));
    if (!table) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      table.querySelectorAll('tbody tr').forEach(function (row) {
        var hit = q === '' || row.textContent.toLowerCase().indexOf(q) !== -1;
        row.hidden = !hit;
        if (hit) visible++;
      });
      var empty = table.querySelector('.table-empty');
      if (empty) empty.hidden = visible > 0;
      table.dispatchEvent(new CustomEvent('exsa:table-filter', { detail: { query: q, visible: visible } }));
    });
  });

  /* ── Row selection ── */
  document.querySelectorAll('.tbl--selectable').forEach(function (table) {
    var all = table.querySelector('.tbl__check--all');
    var checks = function () { return table.querySelectorAll('tbody .tbl__check'); };
    function syncAll() {
      if (!all) return;
      var list = Array.prototype.slice.call(checks());
      var checked = list.filter(function (c) { return c.checked; }).length;
      all.checked = list.length > 0 && checked === list.length;
      all.indeterminate = checked > 0 && checked < list.length;
    }
    if (all) {
      all.addEventListener('change', function () {
        checks().forEach(function (c) {
          c.checked = all.checked;
          c.closest('tr').classList.toggle('tbl__row--selected', all.checked);
        });
      });
    }
    table.addEventListener('change', function (e) {
      var cb = e.target.closest('.tbl__check');
      if (!cb || cb === all || !table.contains(cb)) return;
      var row = cb.closest('tr');
      row.classList.toggle('tbl__row--selected', cb.checked);
      table.dispatchEvent(new CustomEvent('exsa:row-toggle', {
        detail: { row: row, checked: cb.checked }
      }));
      syncAll();
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
