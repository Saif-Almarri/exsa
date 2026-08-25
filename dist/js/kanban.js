/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Kanban — pointer-based drag & drop board (vanilla, zero-dependency)
   Structure: .kanban > .kanban__col > (.kanban__col-head, .kanban__cards > .kanban__card, .kanban__add)
   Mouse AND touch: cards use touch-action:pan-y, so vertical page scroll
   still works on touch devices — horizontal movement initiates the drag.
   Fires CustomEvents on the board:
     exsa:kanban-drop {card, cardId, fromColId, toColId, afterId}
     exsa:kanban-add  {card, colId} */
(function () {
  'use strict';

  document.querySelectorAll('.kanban').forEach(function (board) {
    var dragging = null, clone = null, fromCol = null, overCol = null;
    var offsetX = 0, offsetY = 0;

    function syncCount(col) {
      var count = col.querySelector('.kanban__col-count');
      if (count) count.textContent = col.querySelector('.kanban__cards').children.length;
    }

    function cleanup() {
      if (clone) { clone.remove(); clone = null; }
      if (dragging) { dragging.classList.remove('kanban__card--ghost'); dragging = null; }
      if (overCol) { overCol.classList.remove('kanban__col--over'); overCol = null; }
      document.body.classList.remove('kanban-dragging');
    }

    /* ── Drag (pointer events cover mouse + touch) ── */
    board.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button > 0) return;
      var card = e.target.closest('.kanban__card');
      if (!card || !board.contains(card)) return;
      if (e.target.closest('button,a,input,textarea,[contenteditable]')) return;

      var col = card.closest('.kanban__col');
      var startX = e.clientX, startY = e.clientY, started = false;
      var rect = card.getBoundingClientRect();
      offsetX = startX - rect.left;
      offsetY = startY - rect.top;

      function move(ev) {
        if (!started) {
          if (Math.abs(ev.clientX - startX) < 6 && Math.abs(ev.clientY - startY) < 6) return;
          started = true;
          dragging = card;
          fromCol = col;
          clone = card.cloneNode(true);
          clone.classList.add('kanban__card--dragging');
          clone.style.width = rect.width + 'px';
          clone.style.height = rect.height + 'px';
          document.body.appendChild(clone);
          card.classList.add('kanban__card--ghost');
          document.body.classList.add('kanban-dragging');
          if (card.setPointerCapture) { try { card.setPointerCapture(ev.pointerId); } catch (err) { /* synthetic events */ } }
        }
        clone.style.transform = 'translate(' + (ev.clientX - offsetX) + 'px,' + (ev.clientY - offsetY) + 'px)';
        var target = document.elementFromPoint(ev.clientX, ev.clientY);
        var colEl = target ? target.closest('.kanban__col') : null;
        if (colEl !== overCol) {
          if (overCol) overCol.classList.remove('kanban__col--over');
          overCol = colEl && board.contains(colEl) ? colEl : null;
          if (overCol) overCol.classList.add('kanban__col--over');
        }
      }

      function finish(ev) {
        var targetCol = overCol || fromCol;
        var ref = null;
        if (dragging && fromCol && targetCol && ev) {
          var under = document.elementFromPoint(ev.clientX, ev.clientY);
          var underCard = under ? under.closest('.kanban__card') : null;
          if (underCard && underCard !== dragging && underCard.closest('.kanban__cards') === targetCol.querySelector('.kanban__cards')) {
            ref = underCard;
          }
          targetCol.querySelector('.kanban__cards').insertBefore(dragging, ref);
          syncCount(fromCol);
          if (targetCol !== fromCol) syncCount(targetCol);
          board.dispatchEvent(new CustomEvent('exsa:kanban-drop', {
            detail: {
              card: dragging,
              cardId: dragging.getAttribute('data-card-id') || null,
              fromColId: fromCol.getAttribute('data-col-id') || null,
              toColId: targetCol.getAttribute('data-col-id') || null,
              afterId: ref ? (ref.getAttribute('data-card-id') || null) : null
            }
          }));
        }
        cleanup();
      }

      function up(ev) {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', cancel);
        if (started) finish(ev);
      }
      function cancel() { up(null); }

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', cancel);
    });

    /* ── Quick add ── */
    board.addEventListener('click', function (e) {
      var btn = e.target.closest('.kanban__add');
      if (!btn) return;
      var col = btn.closest('.kanban__col');
      var card = document.createElement('article');
      card.className = 'kanban__card';
      card.setAttribute('tabindex', '0');
      var title = document.createElement('div');
      title.className = 'kanban__card-title';
      title.setAttribute('contenteditable', 'true');
      title.textContent = 'New card';
      card.appendChild(title);
      col.querySelector('.kanban__cards').appendChild(card);
      syncCount(col);
      title.focus();
      var range = document.createRange();
      range.selectNodeContents(title);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      board.dispatchEvent(new CustomEvent('exsa:kanban-add', {
        detail: { card: card, colId: col.getAttribute('data-col-id') || null }
      }));
    });

    /* ── Initial counts ── */
    board.querySelectorAll('.kanban__col').forEach(syncCount);
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
