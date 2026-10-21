/* Sabbar — site behaviour. Plain JavaScript, no dependencies.
   Sections: 1 Reveal  2 Drawer  3 Hero video  4 Journeys rail  5 Gallery  6 Contact form */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Scroll reveal ------------------------------------------------------ */
  (function () {
    var els = [].slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.removeAttribute('data-reveal'); });
      return;
    }
    // Items inside the first screen of the page stagger in one after another.
    var hero = [].slice.call(document.querySelectorAll('.hero [data-reveal], .page-top [data-reveal], .site-header[data-reveal]'));
    els.forEach(function (el) {
      var d = 0;
      var h = hero.indexOf(el);
      if (h > -1) d = 100 + h * 110;
      else if (el.hasAttribute('data-stagger') && el.parentElement) d = ([].indexOf.call(el.parentElement.children, el) % 8) * 70;
      if (el.dataset.delay) d = +el.dataset.delay;
      el.style.setProperty('--d', d + 'ms');
      el._d = d;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.classList.add('is-visible');
        // After the entrance finishes, hand the element back to its normal (hover) transitions.
        setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('is-visible'); el.style.removeProperty('--d'); }, el._d + 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* 2. Side drawer -------------------------------------------------------- */
  (function () {
    var drawer = document.getElementById('drawer');
    var openBtn = document.querySelector('[data-drawer-open]');
    if (!drawer || !openBtn) return;
    var closers = drawer.querySelectorAll('[data-drawer-close]');
    function set(open) {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
      if (open) drawer.querySelector('.drawer__close').focus(); else openBtn.focus();
    }
    openBtn.addEventListener('click', function () { set(true); });
    [].forEach.call(closers, function (c) { c.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) set(false); });
  })();

  /* 3. Hero video: autoplay everywhere, including iOS/Android ---------------- */
  (function () {
    var v = document.querySelector('.hero video');
    if (!v) return;
    v.muted = true; v.defaultMuted = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    play();
    // Some browsers (low-power mode) need a first touch/scroll before they allow playback.
    function resume() { if (v.paused) play(); }
    ['touchstart', 'click', 'scroll'].forEach(function (e) { window.addEventListener(e, resume, { once: true, passive: true }); });
    document.addEventListener('visibilitychange', resume);
  })();

  /* 4. Journeys rail: slow continuous movement, arrows, filters, drag --------
        Pauses while the pointer is over a project card or while dragging.  */
  (function () {
    var rail = document.querySelector('[data-rail]');
    if (!rail) return;
    var track = rail.querySelector('.rail__track');
    var all = [].slice.call(track.children);                 // original project cards
    all.forEach(function (c) { track.removeChild(c); });
    var SPEED = 0.35;                                        // px per frame (~21px/s). Lower = slower.
    var offset = 0, setW = 0, target = null, paused = false, dragging = false, filter = 'all';
    var rtl = getComputedStyle(track).direction === 'rtl';

    function build() {
      var list = all.filter(function (c) { return filter === 'all' || c.dataset.cat === filter; });
      track.innerHTML = '';
      offset = 0; target = null;
      if (!list.length) return;
      function add(copy) {
        list.forEach(function (c) {
          var n = c.cloneNode(true);
          if (copy) { n.setAttribute('aria-hidden', 'true'); n.setAttribute('tabindex', '-1'); }
          track.appendChild(n);
        });
      }
      add(false);
      var first = track.children[0], gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var last = track.children[track.children.length - 1];
      setW = Math.abs(last.getBoundingClientRect().left - first.getBoundingClientRect().left) + first.offsetWidth + gap;
      var reps = Math.ceil((rail.clientWidth * 2) / setW) + 1;   // enough copies for a seamless loop
      for (var i = 0; i < reps; i++) add(true);
      apply();
    }
    function apply() {
      // RTL copies extend to the left: shift a repeated set into the right edge.
      // Wrap only the rendered position so arrows and drags keep a continuous target.
      var rendered = 0;
      if (setW) {
        rendered = rtl ? ((offset % setW) + setW) % setW : -(((-offset % setW) + setW) % setW);
      }
      track.style.transform = 'translate3d(' + rendered + 'px,0,0)';
    }
    function tick() {
      if (target !== null) {                                   // eased jump from the arrow buttons
        var diff = target - offset;
        if (Math.abs(diff) < 0.5) { offset = target; target = null; } else offset += diff * 0.12;
      } else if (!paused && !dragging && !reduce) {
        offset -= SPEED;                                       // RTL: content drifts left
      }
      apply();
      requestAnimationFrame(tick);
    }
    function step(dir) {                                       // dir: -1 = forward, 1 = back
      var card = track.children[0];
      var w = card ? card.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0) : 220;
      target = (target === null ? offset : target) + dir * w * 2;
    }

    track.addEventListener('pointerover', function (e) { if (e.target.closest('.proj')) paused = true; });
    track.addEventListener('pointerout', function (e) { if (e.target.closest('.proj') && !e.relatedTarget) paused = false; else if (!(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.proj'))) paused = false; });
    track.addEventListener('focusin', function () { paused = true; });
    track.addEventListener('focusout', function () { paused = false; });

    var sx = 0, so = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.button !== 0) return; dragging = true; moved = false; sx = e.clientX; so = offset; target = null; rail.classList.add('is-dragging'); });
    window.addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; offset = so + dx; });
    window.addEventListener('pointerup', function () { dragging = false; rail.classList.remove('is-dragging'); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);

    var prev = document.querySelector('[data-rail-prev]'), next = document.querySelector('[data-rail-next]');
    if (prev) prev.addEventListener('click', function () { step(1); });
    if (next) next.addEventListener('click', function () { step(-1); });

    var buttons = [].slice.call(document.querySelectorAll('[data-filter]'));
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.dataset.filter;
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        build();
      });
    });
    var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(build, 200); });
    build();
    requestAnimationFrame(tick);
  })();

  /* 5. Detail gallery: arrows + dots -------------------------------------- */
  (function () {
    var g = document.querySelector('[data-gallery]');
    if (!g) return;
    var shots = [].slice.call(g.children);
    var dots = [].slice.call(document.querySelectorAll('[data-gallery-dot]'));
    var idx = 0;
    function centerOf(el) { var r = el.getBoundingClientRect(); return r.left + r.width / 2; }
    function go(i) {
      i = Math.max(0, Math.min(shots.length - 1, i));
      var gr = g.getBoundingClientRect();
      g.scrollBy({ left: centerOf(shots[i]) - (gr.left + gr.width / 2), behavior: reduce ? 'auto' : 'smooth' });
    }
    function update() {
      var gr = g.getBoundingClientRect(), mid = gr.left + gr.width / 2, best = 0, bd = Infinity;
      shots.forEach(function (s, i) { var d = Math.abs(centerOf(s) - mid); if (d < bd) { bd = d; best = i; } });
      idx = best;
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === best ? 'true' : 'false'); });
    }
    g.addEventListener('scroll', update, { passive: true });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    var p = document.querySelector('[data-gallery-prev]'), n = document.querySelector('[data-gallery-next]');
    if (p) p.addEventListener('click', function () { go(idx - 1); });
    if (n) n.addEventListener('click', function () { go(idx + 1); });
    update();
  })();

  /* 6. Contact form --------------------------------------------------------
        Set data-endpoint on <form id="contact-form"> to the URL that receives the
        message. The form is sent as JSON via POST. With no endpoint it only shows the
        success state (demo mode).                                           */
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var done = document.getElementById('form-done'), err = document.getElementById('form-error');
    function show(ok) { form.hidden = !ok; done.classList.toggle('is-shown', !ok); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      var endpoint = form.dataset.endpoint;
      if (!endpoint) { show(false); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); show(false); })
        .catch(function () { err.textContent = 'تعذّر إرسال الرسالة، حاولوا مرة أخرى.'; })
        .then(function () { btn.disabled = false; });
    });
    var again = document.getElementById('form-again');
    if (again) again.addEventListener('click', function () { show(true); });
  })();
})();
