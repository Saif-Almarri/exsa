/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Transfer — two-panel list picker (vanilla, zero-dependency)
   .transfer > (.transfer__panel ×2 + .transfer__actions)
   Items: .transfer__item[data-value] — click selects, double-click moves,
   Space toggles, Enter moves. Action buttons: data-action add/remove/add-all/remove-all.
   data-transfer-name → hidden input with comma-joined selected values.
   Event on the container: exsa:transfer-change {values, added, removed}. */
(function () {
  'use strict';

  document.querySelectorAll('.transfer').forEach(function (t) {
    var panels = t.querySelectorAll('.transfer__panel');
    if (panels.length < 2) return;

    var hidden = null;
    var hiddenName = t.getAttribute('data-transfer-name');
    if (hiddenName) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = hiddenName;
      hidden.className = 'transfer__value';
      t.appendChild(hidden);
    }

    function items(p) { return Array.prototype.slice.call(p.querySelectorAll('.transfer__item')); }
    function other(p) { return p === panels[0] ? panels[1] : panels[0]; }
    function selectedValues() { return items(panels[1]).map(function (i) { return i.getAttribute('data-value'); }); }
    function sync() { if (hidden) hidden.value = selectedValues().join(','); }
    function syncCount(p) {
      var c = p.querySelector('.transfer__count');
      if (c) c.textContent = items(p).length;
    }

    function move(list, destPanel) {
      if (!list.length) return;
      var added = destPanel === panels[1];
      list.forEach(function (li) {
        li.classList.remove('transfer__item--checked');
        li.removeAttribute('aria-selected');
        destPanel.querySelector('.transfer__list').appendChild(li);
      });
      panels.forEach(syncCount);
      sync();
      t.dispatchEvent(new CustomEvent('exsa:transfer-change', {
        detail: {
          values: selectedValues(),
          added: added ? list.map(function (li) { return li.getAttribute('data-value'); }) : [],
          removed: added ? [] : list.map(function (li) { return li.getAttribute('data-value'); })
        }
      }));
    }

    /* ── Action buttons ── */
    t.querySelectorAll('.transfer__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        if (action === 'add') move(items(panels[0]).filter(function (i) { return i.classList.contains('transfer__item--checked'); }), panels[1]);
        else if (action === 'remove') move(items(panels[1]).filter(function (i) { return i.classList.contains('transfer__item--checked'); }), panels[0]);
        else if (action === 'add-all') move(items(panels[0]), panels[1]);
        else if (action === 'remove-all') move(items(panels[1]), panels[0]);
      });
    });

    /* ── Item interaction (delegated) ── */
    t.addEventListener('click', function (e) {
      var li = e.target.closest('.transfer__item');
      if (!li || !t.contains(li)) return;
      li.classList.toggle('transfer__item--checked');
      if (li.classList.contains('transfer__item--checked')) li.setAttribute('aria-selected', 'true');
      else li.removeAttribute('aria-selected');
    });

    t.addEventListener('dblclick', function (e) {
      var li = e.target.closest('.transfer__item');
      if (!li || !t.contains(li)) return;
      move([li], other(li.closest('.transfer__panel')));
    });

    t.addEventListener('keydown', function (e) {
      var li = e.target.closest('.transfer__item');
      if (!li || !t.contains(li)) return;
      if (e.key === ' ') {
        e.preventDefault();
        li.classList.toggle('transfer__item--checked');
        if (li.classList.contains('transfer__item--checked')) li.setAttribute('aria-selected', 'true');
        else li.removeAttribute('aria-selected');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        move([li], other(li.closest('.transfer__panel')));
      }
    });

    /* ── Per-panel search ── */
    t.querySelectorAll('.transfer__search').forEach(function (input) {
      var panel = input.closest('.transfer__panel');
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        items(panel).forEach(function (li) {
          li.hidden = q !== '' && li.textContent.toLowerCase().indexOf(q) === -1;
        });
      });
    });

    panels.forEach(syncCount);
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
