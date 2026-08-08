/* ============================================================
   EXSA Carousel — <exsa-carousel> Web Component
   ── CSS scroll-snap + IntersectionObserver + pointer events.
   Usage: <exsa-carousel pagination navigation>
            <exsa-carousel-item><img src="..." alt=""></exsa-carousel-item>
          </exsa-carousel>
   ============================================================ */

class UniversalCarousel extends HTMLElement {
  static get observedAttributes() {
    return ['loop','navigation','pagination','autoplay','autoplay-interval',
            'slides-per-page','slides-per-move','orientation','mouse-dragging'];
  }

  constructor() {
    super();
    this._activeSlide = 0;
    this._scrolling = false;
    this._dragging = false;
    this._autoplayTimer = null;
    this._pendingSlideChange = false;

    var self = this;
    this._onDragBound = function(e) { self._onDrag(e); };
    this._onDragEndBound = function() { self._onDragEnd(); };
  }

  connectedCallback() {
    if (this._initialized) return;
    var self = this;
    if (!this.children.length || !this.querySelector('exsa-carousel-item')) {
      requestAnimationFrame(function() { self.connectedCallback(); });
      return;
    }

    this._initialized = true;
    this.setAttribute('role','region');
    this.setAttribute('aria-label','Carousel');

    var raw = this.innerHTML;
    this.innerHTML =
      '<div class="carousel" part="base">' +
        '<div class="carousel__navigation" part="navigation"></div>' +
        '<div class="carousel__slides carousel__slides--horizontal" part="scroll-container" tabindex="0">' + raw + '</div>' +
        '<div class="carousel__pagination" part="pagination" role="tablist"></div>' +
      '</div>';

    this._slidesEl = this.querySelector('.carousel__slides');
    this._navEl    = this.querySelector('.carousel__navigation');
    this._pagEl    = this.querySelector('.carousel__pagination');

    this._init();
    this._observeMutations();
  }

  disconnectedCallback() {
    this._stopAutoplay();
    if (this._mutationObserver) this._mutationObserver.disconnect();
    if (this._intersectionObserver) this._intersectionObserver.disconnect();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || !this._slidesEl) return;
    if (name === 'slides-per-move' || name === 'slides-per-page')
      this.slidesPerMove = Math.min(this.slidesPerMove, this.slidesPerPage);
    if (name === 'autoplay') {
      this.hasAttribute('autoplay') ? this._startAutoplay() : this._stopAutoplay();
      return;
    }
    this._init();
  }

  /* ═══ Public API ═══ */
  next(behavior)     { this.goToSlide(this.activeSlide + this.slidesPerMove, behavior || 'smooth'); }
  previous(behavior) { this.goToSlide(this.activeSlide - this.slidesPerMove, behavior || 'smooth'); }

  goToSlide(index, behavior) {
    behavior = behavior || 'smooth';
    var slides = this._getSlides();
    if (!slides.length) return;

    var perPage = this.slidesPerPage;
    var loop = this.hasAttribute('loop');
    var rtl = this._isRTL();
    var max = loop ? slides.length - 1 : slides.length - perPage;
    this.activeSlide = loop
      ? ((index % slides.length) + slides.length) % slides.length
      : Math.max(0, Math.min(index, max));

    var clones = this._getSlides(false);
    var offset = (loop ? perPage : 0) + (rtl ? perPage - 1 : 0);
    var targetSlide = clones[Math.min(this.activeSlide + offset, clones.length - 1)];
    if (!targetSlide) return;

    var self = this;
    this._pendingSlideChange = true;
    requestAnimationFrame(function() {
      if (!self._slidesEl) return;
      var cr = self._slidesEl.getBoundingClientRect();
      var sr = targetSlide.getBoundingClientRect();
      self._slidesEl.scrollTo({
        left: Math.round(sr.left - cr.left + self._slidesEl.scrollLeft),
        top:  Math.round(sr.top  - cr.top  + self._slidesEl.scrollTop),
        behavior: self._prefersReducedMotion() ? 'auto' : behavior
      });
    });
  }

  get activeSlide()  { return this._activeSlide; }
  set activeSlide(v) {
    if (this._activeSlide === v) return;
    this._activeSlide = v;
    this.setAttribute('data-active', v);
    this._getSlides().forEach(function(s, i) { s.classList.toggle('--is-active', i === v); });
    this.dispatchEvent(new CustomEvent('exsa-slide-change', {
      detail: { index: v, slide: this._getSlides()[v] }
    }));
    this._syncUI();
  }

  get slidesPerPage() { return Math.max(1, parseInt(this.getAttribute('slides-per-page')) || 1); }
  get slidesPerMove() { return Math.min(parseInt(this.getAttribute('slides-per-move')) || 1, this.slidesPerPage); }
  set slidesPerMove(v) { this.setAttribute('slides-per-move', String(Math.min(v, this.slidesPerPage))); }
  get orientation()   { return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal'; }

  /* ═══ Internal ═══ */
  _init() {
    var perPage = this.slidesPerPage;
    var vert = this.orientation === 'vertical';
    var gap = getComputedStyle(this).getPropertyValue('--slide-gap').trim() || '0px';

    this.style.setProperty('--slides-per-page', perPage);
    this._slidesEl.style.setProperty('--slide-size',
      'calc((100% - (' + gap + ' * ' + (perPage - 1) + ')) / ' + perPage + ')');
    this._slidesEl.className = 'carousel__slides carousel__slides--' + (vert ? 'vertical' : 'horizontal');
    this._slidesEl.setAttribute('aria-atomic','true');

    this._updateSnap();
    this._removeClones();
    if (this.hasAttribute('loop')) this._createClones();
    this._renderNav();
    this._renderPagination();

    if (this.hasAttribute('autoplay')) this._startAutoplay(); else this._stopAutoplay();
    this.goToSlide(this.activeSlide, 'auto');

    var self = this;
    this._slidesEl.addEventListener('scroll',      function()  { self._onScroll();    }, { passive: true });
    this._slidesEl.addEventListener('scrollend',   function()  { self._onScrollEnd(); });
    this._slidesEl.addEventListener('keydown',     function(e) { self._onKeyDown(e); });
    this._slidesEl.addEventListener('pointerdown', function(e) { self._onDragStart(e); });

    this._syncSlides();
  }

  _getSlides(excludeClones) {
    if (excludeClones === undefined) excludeClones = true;
    return [].slice.call(this._slidesEl.children).filter(function(el) {
      return el.tagName.toLowerCase() === 'exsa-carousel-item' &&
        (!excludeClones || !el.hasAttribute('data-clone'));
    });
  }

  _createClones() {
    var slides = this._getSlides(), n = this.slidesPerPage, self = this;
    slides.slice(-n).reverse().forEach(function(s, i) {
      var c = s.cloneNode(true); c.setAttribute('data-clone', String(slides.length - i - 1));
      self._slidesEl.prepend(c);
    });
    slides.slice(0, n).forEach(function(s, i) {
      var c = s.cloneNode(true); c.setAttribute('data-clone', String(i));
      self._slidesEl.append(c);
    });
  }

  _removeClones() {
    var clones = this._slidesEl.querySelectorAll('[data-clone]');
    for (var i = 0; i < clones.length; i++) clones[i].remove();
  }

  _updateSnap() {
    var move = this.slidesPerMove;
    this._getSlides().forEach(function(s, i) {
      s.style.removeProperty('scroll-snap-align');
      if ((i + move) % move !== 0) s.style.setProperty('scroll-snap-align', 'none');
    });
  }

  _onScroll() {
    this._scrolling = true;
    this._slidesEl.setAttribute('aria-busy','true');
    if (!this._pendingSlideChange) this._syncSlides();
  }

  _onScrollEnd() {
    if (!this._scrolling || this._dragging) return;
    this._scrolling = false;
    this._pendingSlideChange = false;
    this._slidesEl.setAttribute('aria-busy','false');
    this._syncSlides();
  }

  _syncSlides() {
    if (this._intersectionObserver) this._intersectionObserver.disconnect();
    var self = this;
    var io = new IntersectionObserver(function(entries) {
      io.disconnect();
      entries.forEach(function(e) {
        e.target.classList.toggle('--in-view', e.isIntersecting);
        e.target.setAttribute('aria-hidden', e.isIntersecting ? 'false' : 'true');
      });
      var first = entries.filter(function(e) { return e.isIntersecting; })[0];
      if (!first) return;
      var clones = self._getSlides(false);
      var idx = clones.indexOf(first.target);
      var count = self._getSlides().length;
      var normalized = self.hasAttribute('loop') ? idx - self.slidesPerPage : idx;
      self.activeSlide = ((Math.ceil(normalized / self.slidesPerMove) * self.slidesPerMove) + count) % count;
      if (!self._scrolling && self.hasAttribute('loop') && first.target.hasAttribute('data-clone'))
        self.goToSlide(Number(first.target.getAttribute('data-clone')), 'instant');
    }, { root: this._slidesEl, threshold: 0.6 });
    this._getSlides(false).forEach(function(s) { io.observe(s); });
    this._intersectionObserver = io;
  }

  _onKeyDown(e) {
    var rtl = this._isRTL();
    var prev = e.key === 'ArrowUp'   || (!rtl && e.key === 'ArrowLeft')  || (rtl && e.key === 'ArrowRight');
    var next = e.key === 'ArrowDown' || (!rtl && e.key === 'ArrowRight') || (rtl && e.key === 'ArrowLeft');
    if (prev) { e.preventDefault(); this.previous(); }
    if (next) { e.preventDefault(); this.next(); }
    if (e.key === 'Home') { e.preventDefault(); this.goToSlide(0); }
    if (e.key === 'End')  { e.preventDefault(); this.goToSlide(this._getSlides().length - 1); }
  }

  _onDragStart(e) {
    if (!this.hasAttribute('mouse-dragging') || e.button !== 0) return;
    e.preventDefault();
    document.addEventListener('pointermove', this._onDragBound);
    document.addEventListener('pointerup', this._onDragEndBound, { once: true });
  }

  _onDrag(e) {
    if (!this._dragging) {
      this._slidesEl.style.setProperty('scroll-snap-type','none');
      this._dragging = true;
    }
    this._slidesEl.scrollBy({ left: -e.movementX, top: -e.movementY, behavior: 'instant' });
  }

  _onDragEnd() {
    document.removeEventListener('pointermove', this._onDragBound);
    var el = this._slidesEl;
    var sl = el.scrollLeft, st = el.scrollTop;
    el.style.removeProperty('scroll-snap-type');
    el.style.setProperty('overflow','hidden');
    var fl = el.scrollLeft, ft = el.scrollTop;
    el.style.removeProperty('overflow');
    el.style.setProperty('scroll-snap-type','none');
    el.scrollTo({ left: sl, top: st, behavior: 'instant' });

    var self = this;
    requestAnimationFrame(function() {
      if (sl !== fl || st !== ft)
        el.scrollTo({ left: fl, top: ft, behavior: self._prefersReducedMotion() ? 'auto' : 'smooth' });
      el.style.removeProperty('scroll-snap-type');
      self._dragging = false;
      self._onScrollEnd();
    });
  }

  _renderNav() {
    if (!this.hasAttribute('navigation')) { this._navEl.innerHTML = ''; return; }
    var self = this;
    this._navEl.innerHTML =
      '<button class="carousel__nav-btn carousel__nav-btn--prev" aria-label="Previous">&lt;</button>' +
      '<button class="carousel__nav-btn carousel__nav-btn--next" aria-label="Next">&gt;</button>';
    this._navEl.querySelector('.carousel__nav-btn--prev').onclick = function() { if (self._canScrollPrev()) self.previous(); };
    this._navEl.querySelector('.carousel__nav-btn--next').onclick = function() { if (self._canScrollNext()) self.next(); };
    this._updateNavState();
  }

  _updateNavState() {
    var p = this._navEl.querySelector('.carousel__nav-btn--prev');
    var n = this._navEl.querySelector('.carousel__nav-btn--next');
    if (p) p.setAttribute('aria-disabled', this._canScrollPrev() ? 'false' : 'true');
    if (n) n.setAttribute('aria-disabled', this._canScrollNext() ? 'false' : 'true');
  }

  _renderPagination() {
    if (!this.hasAttribute('pagination')) { this._pagEl.innerHTML = ''; return; }
    var pages = Math.ceil(this._getPageCount()), current = this._getCurrentPage(), self = this;
    this._pagEl.innerHTML = '';
    for (var i = 0; i < pages; i++) {
      (function(idx) {
        var d = document.createElement('button');
        d.className = 'carousel__pagination-item' + (idx === current ? ' carousel__pagination-item--active' : '');
        d.setAttribute('role','tab');
        d.setAttribute('aria-selected', idx === current ? 'true' : 'false');
        d.setAttribute('aria-label', 'Go to slide ' + (idx * self.slidesPerMove + 1));
        d.onclick = function() { self.goToSlide(idx * self.slidesPerMove); };
        self._pagEl.appendChild(d);
      })(i);
    }
  }

  _syncUI() {
    var cur = this._getCurrentPage();
    var dots = this._pagEl.querySelectorAll('.carousel__pagination-item');
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('carousel__pagination-item--active', i === cur);
      dots[i].setAttribute('aria-selected', i === cur ? 'true' : 'false');
    }
    this._updateNavState();
  }

  _getPageCount() {
    var s = this._getSlides().length, pp = this.slidesPerPage, pm = this.slidesPerMove;
    return this.hasAttribute('loop') ? s / pm : (s - pp) / pm + 1;
  }
  _getCurrentPage() { return Math.ceil(this.activeSlide / this.slidesPerMove); }
  _canScrollNext()  { return this.hasAttribute('loop') || this._getCurrentPage() < Math.ceil(this._getPageCount()) - 1; }
  _canScrollPrev()  { return this.hasAttribute('loop') || this._getCurrentPage() > 0; }

  _startAutoplay() {
    if (this._prefersReducedMotion()) return;
    this._stopAutoplay();
    var interval = parseInt(this.getAttribute('autoplay-interval')) || 3000, self = this;
    this._autoplayTimer = setInterval(function() { self.next(); }, interval);

    this._boundPause  = function() { if (self._autoplayTimer) { clearInterval(self._autoplayTimer); self._autoplayTimer = null; } };
    this._boundResume = function() {
      if (self.hasAttribute('autoplay') && !self._autoplayTimer)
        self._autoplayTimer = setInterval(function() { self.next(); }, interval);
    };
    this._slidesEl.addEventListener('mouseenter', this._boundPause);
    this._slidesEl.addEventListener('mouseleave', this._boundResume);
    this._slidesEl.addEventListener('focusin',   this._boundPause);
    this._slidesEl.addEventListener('focusout',  this._boundResume);
  }

  _stopAutoplay() {
    if (this._autoplayTimer) { clearInterval(this._autoplayTimer); this._autoplayTimer = null; }
    if (this._slidesEl) {
      if (this._boundPause)  this._slidesEl.removeEventListener('mouseenter', this._boundPause);
      if (this._boundResume) this._slidesEl.removeEventListener('mouseleave', this._boundResume);
    }
  }

  _observeMutations() {
    var self = this;
    this._mutationObserver = new MutationObserver(function(mutations) {
      if (mutations.some(function(m) {
        return [].slice.call(m.addedNodes).concat([].slice.call(m.removedNodes)).some(function(n) {
          return n.nodeType === 1 && n.tagName.toLowerCase() === 'exsa-carousel-item' && !n.hasAttribute('data-clone');
        });
      })) self._init();
    });
    this._mutationObserver.observe(this._slidesEl, { childList: true });
  }

  _isRTL()               { return getComputedStyle(this).direction === 'rtl'; }
  _prefersReducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
}

customElements.define('exsa-carousel', UniversalCarousel);
customElements.define('exsa-carousel-item', class extends HTMLElement {});
