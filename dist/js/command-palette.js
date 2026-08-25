/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Command Palette — Ctrl+K modal search (vanilla, zero-dependency)
   Reuses modal.css (.modal / .modal--open / .modal__dialog) for the shell.
   Items: .command-palette__item[data-command] inside .command-palette__group.
   Events on the palette: exsa:command-open / -close / -select. */
(function () {
  'use strict';

  document.querySelectorAll('.command-palette').forEach(function (pal) {
    var input = pal.querySelector('.command-palette__input');
    var empty = pal.querySelector('.command-palette__empty');
    if (!input) return;

    var activeIdx = 0;

    function items() { return Array.prototype.slice.call(pal.querySelectorAll('.command-palette__item')); }
    function visible() { return items().filter(function (i) { return !i.hidden; }); }

    function applyActive() {
      var vi = visible();
      if (!vi.length) return;
      activeIdx = Math.max(0, Math.min(activeIdx, vi.length - 1));
      items().forEach(function (it) {
        it.classList.remove('command-palette__item--active');
        it.removeAttribute('aria-selected');
      });
      vi[activeIdx].classList.add('command-palette__item--active');
      vi[activeIdx].setAttribute('aria-selected', 'true');
      vi[activeIdx].scrollIntoView({ block: 'nearest' });
    }

    function filter(q) {
      q = q.trim().toLowerCase();
      var any = false;
      pal.querySelectorAll('.command-palette__group').forEach(function (g) {
        var vis = 0;
        g.querySelectorAll('.command-palette__item').forEach(function (it) {
          var hay = ((it.getAttribute('data-command') || '') + ' ' + (it.textContent || '')).toLowerCase();
          var show = !q || hay.indexOf(q) !== -1;
          it.hidden = !show;
          if (show) vis++;
        });
        g.hidden = vis === 0;
        if (vis) any = true;
      });
      if (empty) empty.hidden = any;
      activeIdx = 0;
      applyActive();
    }

    function select(item) {
      if (!item) return;
      pal.dispatchEvent(new CustomEvent('exsa:command-select', {
        detail: {
          command: item.getAttribute('data-command'),
          label: (item.querySelector('.command-palette__item-label') || item).textContent.trim(),
          item: item
        }
      }));
      closePal();
    }

    function openPal() {
      pal.classList.add('modal--open');
      input.value = '';
      filter('');
      input.focus();
      document.body.style.overflow = 'hidden';
      pal.dispatchEvent(new CustomEvent('exsa:command-open'));
    }

    function closePal() {
      pal.classList.remove('modal--open');
      document.body.style.overflow = '';
      pal.dispatchEvent(new CustomEvent('exsa:command-close'));
    }

    /* ── Input keyboard ── */
    input.addEventListener('input', function () { filter(input.value); });
    input.addEventListener('keydown', function (e) {
      var vi = visible();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = (activeIdx + 1) % Math.max(vi.length, 1);
        applyActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = (activeIdx - 1 + Math.max(vi.length, 1)) % Math.max(vi.length, 1);
        applyActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        select(vi[activeIdx]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePal();
      }
    });

    /* ── Clicks: backdrop closes, items select ── */
    pal.addEventListener('click', function (e) {
      if (e.target === pal) { closePal(); return; }
      var item = e.target.closest('.command-palette__item');
      if (item && !item.hidden) select(item);
    });

    /* ── Global shortcut Ctrl/Cmd + K ── */
    document.addEventListener('keydown', function (e) {
      if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (pal.classList.contains('modal--open')) closePal();
        else openPal();
      }
    });
  });

  /* ── Any element with data-command-open opens the first palette ── */
  document.querySelectorAll('[data-command-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pal = document.querySelector('.command-palette');
      if (!pal) return;
      pal.classList.add('modal--open');
      var input = pal.querySelector('.command-palette__input');
      if (input) input.focus();
      document.body.style.overflow = 'hidden';
      pal.dispatchEvent(new CustomEvent('exsa:command-open'));
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
