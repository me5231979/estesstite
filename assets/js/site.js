// Shared behavior: nav state, mobile menu, reveals, stat counters,
// hero weight on scroll, and the wireframe-to-screen resolve.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  // Reveals: fade up 24px, 80ms stagger between siblings in a [data-stagger] group.
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
      el.style.setProperty('--i', i);
    });
  });

  // Stat counters: count up once on first view over 1.2s.
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

  // Hero: Fraunces weight moves 300 to 600 as the hero scrolls away.
  var hero = document.querySelector('.hero');
  var heroType = hero && hero.querySelector('.t-hero');

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
    if (heroType && !reduced.matches) {
      var h = hero.offsetHeight || 1;
      var p = Math.min(Math.max(window.scrollY / (h * 0.7), 0), 1);
      heroType.style.setProperty('--hero-wght', Math.round(300 + 300 * p));
    }
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
