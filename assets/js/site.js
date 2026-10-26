// Shared behavior: nav state, mobile menu, reveals, stat counters,
// hero weight on scroll, and the wireframe-to-screen resolve.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Print buttons (the CSP blocks inline onclick handlers).
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });

  // Nav: transparent over the hero, ink at 90% with blur after scroll.
  var nav = document.querySelector('.nav');
  function onScrollNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  // Mobile menu: full-screen overlay.
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    document.querySelectorAll('main, footer, .skip-link').forEach(function (n) { n.inert = open; });
    document.body.classList.toggle('menu-open', open);
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
  }
  if (toggle && menu) {
    menu.inert = true;
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // Flip cards: a button on each face turns the card. The hidden face is inert,
  // and focus moves to the button on the face that turns toward the reader.
  document.querySelectorAll('.flip').forEach(function (card) {
    var front = card.querySelector('.flip__front');
    var back = card.querySelector('.flip__back');
    card.querySelectorAll('.flip__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var flipped = !card.classList.contains('is-flipped');
        card.classList.toggle('is-flipped', flipped);
        front.inert = flipped;
        back.inert = !flipped;
        card.querySelectorAll('.flip__btn').forEach(function (b) { b.setAttribute('aria-expanded', String(flipped)); });
        (flipped ? back : front).querySelector('.flip__btn').focus({ preventScroll: true });
      });
    });
  });

  // Reveals: fade up 24px, 80ms stagger between siblings in a [data-stagger] group.
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
      el.style.setProperty('--i', i);
    });
  });

  // Stat counters: count up once on first view over 1.2s. Screen readers get
  // the final value from a hidden copy, never the numbers in between.
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = el.textContent;
    el.setAttribute('aria-hidden', 'true');
    el.parentNode.insertBefore(sr, el.nextSibling);
  });

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    function fmt(n) {
      return prefix + n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    }
    if (reduced.matches) { el.textContent = fmt(target); return; }
    var start = null;
    var dur = 1200;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * ease(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains('reveal')) el.classList.add('is-in');
        if (el.hasAttribute('data-count')) runCounter(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    document.querySelectorAll('.reveal, [data-count]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }


  // Signature: wireframe resolves into the finished screen as you scroll.
  var tracks = Array.prototype.slice.call(document.querySelectorAll('.resolve-track'));

  function progress(el) {
    var r = el.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    if (span <= 0) span = r.height;
    return Math.min(Math.max(-r.top / span, 0), 1);
  }

  var ticking = false;
  function frame() {
    ticking = false;
    onScrollNav();
    tracks.forEach(function (track) {
      var target = track.querySelector('.resolve');
      if (!target) return;
      var p = progress(track);
      // Reduced motion: no scrubbing, a single fade once the block is in view.
      if (reduced.matches) p = track.getBoundingClientRect().top < window.innerHeight * 0.6 ? 1 : 0;
      target.style.setProperty('--p', p.toFixed(3));
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();
