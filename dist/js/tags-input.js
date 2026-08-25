/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Tags Input — chips + suggestions (vanilla, zero-dependency)
   .tags-input with optional data-tags-suggestions / -max / -name / -free.
   The text field and suggestions menu are created by this script.
   Events on the container: exsa:tags-add, exsa:tags-remove, exsa:tags-change. */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  document.querySelectorAll('.tags-input').forEach(function (root) {
    var suggestions = [];
    try { suggestions = JSON.parse(root.getAttribute('data-tags-suggestions') || '[]'); } catch (e) { /* ignore */ }
    var max = parseInt(root.getAttribute('data-tags-max'), 10) || 0;
    var free = (root.getAttribute('data-tags-free') || 'true') !== 'false';

    var field = root.querySelector('.tags-input__field');
    if (!field) {
      field = document.createElement('input');
      field.type = 'text';
      field.className = 'tags-input__field';
      field.setAttribute('aria-label', root.getAttribute('data-tags-label') || 'Add tag');
      root.appendChild(field);
    }

    var menu = document.createElement('div');
    menu.className = 'tags-input__menu';
    menu.setAttribute('role', 'listbox');
    root.appendChild(menu);

    var hidden = null;
    var hiddenName = root.getAttribute('data-tags-name');
    if (hiddenName) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = hiddenName;
      hidden.className = 'tags-input__value';
      root.appendChild(hidden);
    }

    var menuItems = [];

    function chips() { return Array.prototype.slice.call(root.querySelectorAll('.tags-input__chip')); }
    function values() {
      return chips().map(function (c) {
        return c.getAttribute('data-value') || (c.querySelector('.tags-input__chip-label') || c).textContent.trim();
      });
    }
    function syncHidden() { if (hidden) hidden.value = values().join(','); }

    function addTag(v) {
      v = String(v || '').trim().replace(/,/g, '');
      if (!v) return;
      if (max && chips().length >= max) return;
      if (values().indexOf(v) !== -1) return;
      if (!free && suggestions.length && suggestions.indexOf(v) === -1) return;

      var chip = document.createElement('span');
      chip.className = 'tags-input__chip';
      chip.setAttribute('data-value', v);
      var label = document.createElement('span');
      label.className = 'tags-input__chip-label';
      label.textContent = v;
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'tags-input__remove';
      x.setAttribute('aria-label', 'Remove ' + v);
      x.innerHTML = '&times;';
      chip.appendChild(label);
      chip.appendChild(x);
      root.insertBefore(chip, field);
      syncHidden();
      root.dispatchEvent(new CustomEvent('exsa:tags-add', { detail: { tag: v, tags: values() } }));
      root.dispatchEvent(new CustomEvent('exsa:tags-change', { detail: { tags: values(), added: v } }));
    }

    function removeTag(chip) {
      var v = chip.getAttribute('data-value') || chip.querySelector('.tags-input__chip-label').textContent.trim();
      chip.remove();
      syncHidden();
      root.dispatchEvent(new CustomEvent('exsa:tags-remove', { detail: { tag: v, tags: values() } }));
      root.dispatchEvent(new CustomEvent('exsa:tags-change', { detail: { tags: values(), removed: v } }));
    }

    function showMenu() {
      var q = field.value.trim().toLowerCase();
      menuItems = suggestions
        .filter(function (s) { return !q || s.toLowerCase().indexOf(q) !== -1; })
        .filter(function (s) { return values().indexOf(s) === -1; })
        .slice(0, 8);
      if (!menuItems.length) { hideMenu(); return; }
      menu.innerHTML = menuItems.map(function (s, i) {
        return '<div class="tags-input__item' + (i === 0 ? ' tags-input__item--active' : '') + '" role="option">' + esc(s) + '</div>';
      }).join('');
      menu.classList.add('tags-input__menu--open');
    }
    function hideMenu() {
      menu.classList.remove('tags-input__menu--open');
      menuItems = [];
      menu.innerHTML = '';
    }
    function activeIndex() {
      var active = menu.querySelector('.tags-input__item--active');
      return active ? Array.prototype.indexOf.call(menu.children, active) : -1;
    }
    function setActive(i) {
      var items = menu.children;
      if (!items.length) return;
      i = (i + items.length) % items.length;
      Array.prototype.forEach.call(items, function (it) { it.classList.remove('tags-input__item--active'); });
      items[i].classList.add('tags-input__item--active');
      items[i].scrollIntoView({ block: 'nearest' });
    }

    root.addEventListener('click', function (e) {
      var x = e.target.closest('.tags-input__remove');
      if (x) { removeTag(x.closest('.tags-input__chip')); field.focus(); }
      else if (e.target === root) { field.focus(); }
    });

    menu.addEventListener('click', function (e) {
      var item = e.target.closest('.tags-input__item');
      if (!item) return;
      addTag(item.textContent);
      field.value = '';
      hideMenu();
      field.focus();
    });

    field.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        var idx = activeIndex();
        if (idx >= 0) addTag(menuItems[idx]);
        else addTag(field.value);
        field.value = '';
        hideMenu();
      } else if (e.key === 'Backspace' && field.value === '') {
        var cs = chips();
        if (cs.length) removeTag(cs[cs.length - 1]);
      } else if (e.key === 'Escape') {
        hideMenu();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (menuItems.length) {
          e.preventDefault();
          setActive(activeIndex() + (e.key === 'ArrowDown' ? 1 : -1));
        }
      }
    });

    field.addEventListener('input', showMenu);
    field.addEventListener('focus', function () { if (field.value) showMenu(); });
    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) hideMenu();
    });
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
