// Motion layer: everything here shows how a thing is built.
// Kinetic headlines, hero type that answers the pointer, blueprint hovers on
// proof tiles, wireframe-to-screen cards, and an opt-in workshop sound set.
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  // Review mode shows every content gap (.todo, [data-pending]).
  // Use ?review on any page, or run the site locally.
  var params = new URLSearchParams(location.search);
  var host = location.hostname;
  if (params.has('review') || host === 'localhost' || host === '127.0.0.1') root.classList.add('review');

  // Base path for assets, so sounds load from any page depth.
  var script = document.currentScript;
  var assetBase = script ? script.src.replace(/js\/motion\.js.*$/, '') : 'assets/';

  /* ---------------- Sound (opt-in, never autoplays) ---------------- */
  var SOUND_KEY = 'me-sound';
  var soundOn = false;
  try { soundOn = localStorage.getItem(SOUND_KEY) === 'on'; } catch (e) {}
  var sounds = {};
  function load(name, vol) {
    var a = new Audio(assetBase + 'audio/' + name + '.mp3');
    a.preload = 'auto';
    a.volume = vol;
    sounds[name] = a;
  }
  function play(name) {
    if (!soundOn) return;
    if (!sounds.tick) { load('tick', 0.35); load('sketch', 0.3); }
    var a = sounds[name];
    if (!a) return;
    try { a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  function renderToggles() {
    document.querySelectorAll('[data-sound-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(soundOn));
      b.querySelector('[data-sound-state]').textContent = soundOn ? 'On' : 'Off';
    });
  }
  function addToggle(container, cls) {
    if (!container) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sound-toggle ' + (cls || '');
    b.setAttribute('data-sound-toggle', '');
    b.innerHTML = '<span class="sound-toggle__bars" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span>Sound <span data-sound-state>Off</span></span>';
    b.addEventListener('click', function () {
      soundOn = !soundOn;
      try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch (e) {}
      renderToggles();
      play('tick');
    });
    container.appendChild(b);
  }
  var navLinks = document.querySelector('.nav__links');
  if (navLinks) {
    var li = document.createElement('li');
    navLinks.insertBefore(li, navLinks.lastElementChild);
    addToggle(li);
  }
  addToggle(document.querySelector('.menu'), 'sound-toggle--menu');
  renderToggles();

  document.addEventListener('pointerenter', function (e) {
    var t = e.target;
    if (t.closest && t.closest('.btn--primary, .tile, .belief')) {
      if (t.matches('.btn--primary, .tile, .belief')) play('tick');
    }
  }, true);
  document.addEventListener('change', function (e) {
    if (e.target.closest('.diag')) play('tick');
  });

  /* ---------------- Text splitting ---------------- */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = 'words';
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement('span');
            w.className = 'w';
            var inner = document.createElement('span');
            inner.textContent = p;
            inner.style.setProperty('--wi', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
  }

  function splitLetters(el, hardSpaces) {
    var i = 0;
    var letters = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (word) {
            if (!word) return;
            if (/^\s+$/.test(word)) {
              frag.appendChild(document.createTextNode(hardSpaces ? '\u00a0' : word));
              return;
            }
            var w = document.createElement('span');
            w.className = 'lw';
            Array.prototype.forEach.call(word, function (ch) {
              var s = document.createElement('span');
              s.className = 'l';
              s.textContent = ch;
              s.style.setProperty('--li', i++);
              letters.push(s);
              w.appendChild(s);
            });
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
    return letters;
  }

  /* ---------------- Kinetic headlines ---------------- */
  var heads = document.querySelectorAll('.intro h2, .page-head h1, .close h2, .case-study__head h2, .diag h2');
  if (!reduced && 'IntersectionObserver' in window) {
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-set'); hio.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    heads.forEach(function (h) {
      if (h.classList.contains('visually-hidden')) return;
      splitWords(h);
      h.classList.add('kinetic');
      hio.observe(h);
    });
  }

  /* ---------------- Hero: letters answer the pointer ---------------- */
  var hero = document.querySelector('.hero');
  var heroTitle = hero && hero.querySelector('.t-hero');
  if (heroTitle && !reduced) {
    var letters = splitLetters(heroTitle);
    heroTitle.classList.add('is-split');
    requestAnimationFrame(function () { heroTitle.classList.add('is-in'); });

    if (canHover) {
      var px = -9999, py = -9999, raf = 0;
      var centers = [];
      function measure() {
        centers = letters.map(function (l) {
          var r = l.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
      }
      function paint() {
        raf = 0;
        var base = parseFloat(getComputedStyle(heroTitle).getPropertyValue('--hero-wght')) || 300;
        letters.forEach(function (l, i) {
          var c = centers[i];
          if (!c) return;
          var d = Math.hypot(c.x - px, c.y - py);
          var f = Math.max(0, 1 - d / 260);
          f = f * f * (3 - 2 * f);
          l.style.fontWeight = Math.round(base + (600 - base) * f);
        });
      }
      hero.addEventListener('pointerenter', measure);
      hero.addEventListener('pointermove', function (e) {
        px = e.clientX; py = e.clientY;
        if (!raf) raf = requestAnimationFrame(paint);
      });
      hero.addEventListener('pointerleave', function () {
        px = py = -9999;
        if (!raf) raf = requestAnimationFrame(paint);
      });
      window.addEventListener('scroll', function () { centers = []; px = py = -9999; letters.forEach(function (l) { l.style.fontWeight = ''; }); }, { passive: true });
      window.addEventListener('resize', measure);
    }
  }

  // Hero film: plays only when motion is welcome, pauses off screen.
  var film = document.querySelector('.hero__film');
  if (film) {
    if (reduced) {
      film.removeAttribute('autoplay');
      film.pause();
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { var p = film.play(); if (p && p.catch) p.catch(function () {}); }
          else film.pause();
        });
      }).observe(film);
    }
    film.addEventListener('playing', function () { film.classList.add('is-playing'); });
  }

  /* ---------------- Nav: letter weight wave ---------------- */
  if (canHover && !reduced) {
    document.querySelectorAll('.nav__links a:not(.btn)').forEach(function (a) {
      splitLetters(a, true);
      a.classList.add('wave');
    });
  }

  /* ---------------- Proof tiles: blueprint draws on hover ---------------- */
  function blueprint(tile) {
    var bp = document.createElement('span');
    bp.className = 'blueprint';
    bp.setAttribute('aria-hidden', 'true');
    ['c tl', 'c tr', 'c br', 'c bl', 'dim', 'h', 'v'].forEach(function (cls, i) {
      var s = document.createElement('span');
      s.className = 'bp-' + cls.replace(' ', ' bp-');
      s.style.setProperty('--pi', i);
      bp.appendChild(s);
    });
    tile.insertBefore(bp, tile.firstChild);

    var spec = document.createElement('span');
    spec.className = 'spec t-label';
    spec.setAttribute('aria-hidden', 'true');
    spec.textContent = 'Spec ' + String(Array.prototype.indexOf.call(tile.parentNode.children, tile) + 1).padStart(2, '0');
    tile.appendChild(spec);
  }
  document.querySelectorAll('.tile').forEach(blueprint);

  /* ---------------- Wireframe-to-screen media ---------------- */
  // Layouts on a 1600x1000 canvas: [x, y, w, h, kind].
  // kind: bar (chrome), block (panel), img (media), line (text), title, accent, amber, dot
  var L = {
    course: [[40,40,1520,72,'bar'],[40,144,360,816,'block'],[80,196,260,12,'line'],[80,256,220,12,'line'],[80,316,240,12,'line'],[80,376,200,12,'line'],[432,144,1128,420,'img'],[480,200,520,40,'title'],[480,264,680,14,'line'],[480,480,180,48,'accent'],[432,596,544,364,'block'],[1016,596,544,364,'block'],[472,648,140,56,'amber'],[1056,648,380,16,'title'],[1056,690,300,12,'line']],
    assessment: [[40,40,1520,72,'bar'],[200,170,1200,10,'block'],[200,170,520,10,'amber'],[200,240,900,44,'title'],[200,310,700,14,'line'],[200,380,1200,96,'block'],[200,500,1200,96,'amber'],[200,620,1200,96,'block'],[200,740,1200,96,'block'],[1180,880,220,56,'accent']],
    sim: [[40,40,1520,72,'bar'],[120,170,760,120,'block'],[720,330,760,96,'amber'],[120,466,860,150,'block'],[620,656,860,96,'amber'],[40,860,1520,100,'block'],[1300,884,220,52,'accent']],
    grid: [[40,40,1520,72,'bar'],[300,160,1000,780,'block'],[300,420,1000,2,'line'],[300,680,1000,2,'line'],[633,160,2,780,'line'],[966,160,2,780,'line'],[420,260,36,36,'dot'],[760,300,36,36,'dot'],[1100,220,36,36,'accent'],[480,520,36,36,'dot'],[820,560,36,36,'amber'],[1140,780,36,36,'dot']],
    pipeline: [[40,40,1520,72,'bar'],[40,150,360,810,'block'],[424,150,360,810,'block'],[808,150,360,810,'block'],[1192,150,368,810,'block'],[70,190,300,120,'img'],[70,330,300,120,'img'],[454,190,300,120,'amber'],[838,190,300,120,'img'],[838,330,300,120,'img'],[1222,190,308,120,'accent']],
    dashboard: [[40,40,1520,72,'bar'],[40,150,360,200,'block'],[424,150,360,200,'block'],[808,150,360,200,'block'],[1192,150,368,200,'block'],[80,200,160,60,'title'],[464,200,160,60,'title'],[848,200,160,60,'amber'],[1232,200,160,60,'title'],[40,384,1000,576,'img'],[1072,384,488,576,'block'],[1112,440,400,14,'line'],[1112,500,340,14,'line'],[1112,560,380,14,'line'],[1112,620,300,14,'line']],
    program: [[40,40,1520,72,'bar'],[80,200,200,200,'block'],[320,200,200,200,'block'],[560,200,200,200,'block'],[800,200,200,200,'block'],[1040,200,200,200,'block'],[1280,200,200,200,'block'],[80,460,1400,10,'line'],[80,460,960,10,'amber'],[80,540,1400,400,'img'],[140,600,520,40,'title'],[140,860,200,52,'accent']],
    pulse: [[40,40,1520,72,'bar'],[120,180,600,40,'title'],[120,250,800,14,'line'],[120,360,1360,560,'block'],[200,760,140,120,'img'],[420,640,140,240,'img'],[640,560,140,320,'amber'],[860,700,140,180,'img'],[1080,480,140,400,'accent'],[1300,600,140,280,'img']],
    marketplace: [[40,40,1520,72,'bar'],[40,150,440,810,'block'],[160,210,200,200,'img'],[100,460,320,24,'title'],[100,520,260,12,'line'],[100,570,300,12,'line'],[100,640,220,12,'amber'],[512,150,1048,250,'block'],[512,430,1048,250,'block'],[512,710,1048,250,'block'],[552,200,420,28,'title'],[552,480,360,28,'title'],[552,760,400,28,'title'],[1340,200,180,48,'accent']]
  };

  function rect(x, y, w, h, attrs) {
    var r = document.createElementNS(SVGNS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('rx', Math.min(4, h / 2));
    Object.keys(attrs).forEach(function (k) { r.setAttribute(k, attrs[k]); });
    return r;
  }
  function svgLayer(cls) {
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 1600 1000');
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    return s;
  }
  var FILL = { bar: '#2A2420', block: '#14110F', img: '#2A2420', line: '#A89F94', title: '#F2EDE4', accent: '#E8652B', amber: '#F2A541', dot: '#A89F94' };

  function buildMock(host, kind) {
    var layout = L[kind] || L.course;
    var wire = svgLayer('mock__wire');
    var built = svgLayer('mock__built');
    built.appendChild(rect(0, 0, 1600, 1000, { fill: '#1E1A17' }));
    layout.forEach(function (r) {
      var k = r[4];
      var isLine = k === 'line' || k === 'title';
      wire.appendChild(rect(r[0], r[1], r[2], r[3], {
        fill: 'none', stroke: '#A89F94', 'stroke-width': isLine ? 1.5 : 2,
        'stroke-dasharray': '8 8', pathLength: '1000'
      }));
      if (k === 'img') {
        var x1 = document.createElementNS(SVGNS, 'path');
        x1.setAttribute('d', 'M' + r[0] + ' ' + r[1] + ' L' + (r[0] + r[2]) + ' ' + (r[1] + r[3]) + ' M' + (r[0] + r[2]) + ' ' + r[1] + ' L' + r[0] + ' ' + (r[1] + r[3]));
        x1.setAttribute('stroke', '#3A322C'); x1.setAttribute('stroke-width', '2'); x1.setAttribute('fill', 'none');
        wire.appendChild(x1);
      }
      built.appendChild(rect(r[0], r[1], r[2], r[3], {
        fill: FILL[k], stroke: k === 'block' ? '#3A322C' : 'none', 'stroke-width': 2
      }));
    });
    var mock = document.createElement('div');
    mock.className = 'mock';
    mock.appendChild(wire);
    mock.appendChild(built);
    var seam = document.createElement('span');
    seam.className = 'mock__seam';
    mock.appendChild(seam);
    host.appendChild(mock);
    return mock;
  }

  var MAP = {
    axl: 'course', 'ai-literacy': 'assessment', 'er-simulator': 'sim', 'talent-review': 'grid',
    'intake-pipeline': 'pipeline', 'ops-command-center': 'dashboard',
    'leadership-redefined': 'program', 'manager-standard': 'pulse', 'talent-marketplace': 'marketplace',
    'ai-capability': 'assessment', simulations: 'sim'
  };
  function kindFor(el) {
    var withId = el.closest('[id]');
    var link = el.closest('.case') && el.closest('.case').querySelector('.case__title a');
    var key = (withId && MAP[withId.id] && withId.id) ||
      (link && (link.getAttribute('href').split('#')[1] || ''));
    return MAP[key] || 'course';
  }

  var mocks = [];
  document.querySelectorAll('.placeholder').forEach(function (ph) {
    if (ph.classList.contains('placeholder--bw')) return;
    var host = ph.parentNode;
    var mock = buildMock(host, kindFor(host));
    mocks.push(mock);
    var card = host.closest('.case');
    if (card && canHover && !reduced) {
      card.addEventListener('pointerenter', function () { mock.classList.add('is-built'); play('sketch'); });
      card.addEventListener('pointerleave', function () { mock.classList.remove('is-built'); });
      card.addEventListener('focusin', function () { mock.classList.add('is-built'); });
      card.addEventListener('focusout', function () { mock.classList.remove('is-built'); });
    } else {
      mock.classList.add('is-auto');
    }
  });
  if ('IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-drawn');
        if (en.target.classList.contains('is-auto')) {
          setTimeout(function () { en.target.classList.add('is-built'); }, reduced ? 0 : 900);
        }
        mio.unobserve(en.target);
      });
    }, { threshold: 0.35 });
    mocks.forEach(function (m) { mio.observe(m); });
  } else {
    mocks.forEach(function (m) { m.classList.add('is-drawn', 'is-built'); });
  }

  // Signature resolve: a pencil sketch sound the first time it starts to resolve.
  var resolve = document.querySelector('.resolve');
  if (resolve) {
    var sketched = false;
    window.addEventListener('scroll', function () {
      if (sketched) return;
      var p = parseFloat(resolve.style.getPropertyValue('--p')) || 0;
      if (p > 0.05) { sketched = true; play('sketch'); }
    }, { passive: true });
  }
})();
