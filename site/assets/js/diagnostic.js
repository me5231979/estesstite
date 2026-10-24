// Capability Gap Diagnostic: six questions, one readout.
// Each answer scores 0-2. Total 0-12 maps to Publisher, Program Shop, or
// Capability Engine. The three lowest-scoring dimensions pick the moves.
(function () {
  var QUESTIONS = [
    {
      id: 'ai',
      label: 'AI readiness',
      q: 'How is your organization handling the work AI changes?',
      options: [
        'Mostly tool training, if anything.',
        'Pilots and guidance, team by team.',
        'Redesigning roles and workflows around it, with a plan.'
      ],
      move: ['Treat AI as job redesign.', 'Pick 1 role. Map which tasks AI changes, then train people on the new workflow, not the tool.'],
      sharpen: ['Redesign the manager job next.', 'Managers decide whether new workflows stick. Give them a standard for leading AI-assisted teams.']
    },
    {
      id: 'managers',
      label: 'Manager quality',
      q: 'How do you know your managers are good at managing?',
      options: [
        'We don\'t, beyond engagement scores and anecdotes.',
        'We run manager training and track who attended.',
        'A written standard, with behavior measured against it.'
      ],
      move: ['Write the manager standard.', 'Define 5 to 8 observable behaviors. Pulse employees on them twice a year.'],
      sharpen: ['Run a comparison group.', 'Trial your next manager program against a group that didn\'t get it. Report the difference.']
    },
    {
      id: 'mobility',
      label: 'Internal mobility',
      q: 'When a role opens, where does the hire usually come from?',
      options: [
        'Outside, almost always.',
        'Inside sometimes, mostly through who knows whom.',
        'Inside by design, through visible skills and open roles.'
      ],
      move: ['Make internal moves visible.', 'Publish skills profiles and post roles inside first. Count moves every month.'],
      sharpen: ['Tie mobility to critical roles.', 'Name the roles you can\'t afford to lose. Build a ready-now bench for each one.']
    },
    {
      id: 'measure',
      label: 'Measurement',
      q: 'What does your learning team report to leadership?',
      options: [
        'Completions, hours, and satisfaction.',
        'Business metrics for a few flagship programs.',
        'Behavior change and business results, as standard.'
      ],
      move: ['Report behavior, not attendance.', 'For your next program, name the behavior that should change. Measure it at 90 days.'],
      sharpen: ['Retire what doesn\'t move.', 'Cut the bottom 20% of programs by measured impact. Reinvest the hours.']
    },
    {
      id: 'speed',
      label: 'Speed to build',
      q: 'How long does it take to build a new 30 minute learning experience?',
      options: [
        '3 months or more.',
        'About a month.',
        'A week or less.'
      ],
      move: ['Set a speed standard.', 'Cap build time for a 30 minute experience at 2 weeks. Use AI build tools to hit it.'],
      sharpen: ['Build in the flow of work.', 'Ship smaller pieces where the work happens, then update them every quarter.']
    },
    {
      id: 'horizon',
      label: 'Planning horizon',
      q: 'How far ahead does your learning strategy plan?',
      options: [
        'This year\'s requests.',
        '1 to 2 years.',
        '3 years or more, tied to workforce plans.'
      ],
      move: ['Plan against the skill shift.', 'Tie a 3 year capability plan to workforce data. Revisit it every quarter.'],
      sharpen: ['Fund capability like a product.', 'Give each critical capability an owner, a roadmap, and a budget line.']
    }
  ];

  var TYPES = [
    {
      name: 'Publisher',
      max: 4,
      text: 'You produce courses and report activity. Leadership sees effort, not effect. Most learning functions sit here.'
    },
    {
      name: 'Program Shop',
      max: 8,
      text: 'You run good programs and can prove some of them. The gaps sit between programs, where the work is actually changing.'
    },
    {
      name: 'Capability Engine',
      max: 12,
      text: 'You diagnose, build, and measure like an operating function. The job now is holding that pace as the work keeps moving.'
    }
  ];

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function mount(root) {
    var contactHref = root.getAttribute('data-contact') || 'contact/';
    var answers = new Array(QUESTIONS.length);
    var step = 0;
    var uid = 'dg' + Math.random().toString(36).slice(2, 7);

    root.innerHTML = '';
    var live = el('div', { 'aria-live': 'polite', class: 'visually-hidden' });
    var body = el('div');
    root.appendChild(live);
    root.appendChild(body);

    function renderQuestion(focus) {
      var q = QUESTIONS[step];
      body.innerHTML = '';

      var progress = el('div', {}, [
        el('div', { class: 'diag__progress' }, [
          el('span', { class: 't-label', text: 'Question ' + (step + 1) + ' of ' + QUESTIONS.length }),
          el('span', { class: 't-label', text: q.label })
        ]),
        el('div', { class: 'diag__bar', 'aria-hidden': 'true' }, [
          el('span', { style: 'width:' + ((step) / QUESTIONS.length * 100) + '%' })
        ])
      ]);

      var fs = el('fieldset');
      var legend = el('legend', { text: q.q, tabindex: '-1' });
      fs.appendChild(legend);
      var opts = el('div', { class: 'diag__options' });
      q.options.forEach(function (text, i) {
        var id = uid + '-' + q.id + '-' + i;
        var input = el('input', { type: 'radio', name: uid + '-' + q.id, id: id, value: String(i) });
        if (answers[step] === i) input.checked = true;
        input.addEventListener('change', function () {
          answers[step] = i;
          next.disabled = false;
        });
        opts.appendChild(el('div', { class: 'diag__option' }, [
          input,
          el('label', { for: id }, [
            el('span', { class: 'diag__key', text: String.fromCharCode(65 + i) }),
            el('span', { text: text })
          ])
        ]));
      });
      fs.appendChild(opts);

      var back = el('button', { type: 'button', class: 'btn btn--secondary', text: 'Back' });
      back.disabled = step === 0;
      back.addEventListener('click', function () { step--; renderQuestion(true); });
      var last = step === QUESTIONS.length - 1;
      var next = el('button', { type: 'button', class: 'btn btn--primary', text: last ? 'See my readout' : 'Next question' });
      next.disabled = answers[step] === undefined;
      next.addEventListener('click', function () {
        if (answers[step] === undefined) return;
        if (last) renderResult();
        else { step++; renderQuestion(true); }
      });

      body.appendChild(progress);
      body.appendChild(fs);
      body.appendChild(el('div', { class: 'diag__nav' }, [back, next]));
      if (focus) legend.focus({ preventScroll: false });
    }

    function renderResult() {
      var total = answers.reduce(function (a, b) { return a + b; }, 0);
      var typeIndex = TYPES.findIndex(function (t) { return total <= t.max; });
      var type = TYPES[typeIndex];

      // Three lowest-scoring dimensions; ties keep question order.
      var ranked = QUESTIONS.map(function (q, i) { return { q: q, s: answers[i], i: i }; })
        .sort(function (a, b) { return a.s - b.s || a.i - b.i; })
        .slice(0, 3);

      body.innerHTML = '';
      var heading = el('h3', { tabindex: '-1', html: 'Your function is a <em>' + type.name + '</em>.' });
      var meter = el('div', { class: 'diag__meter', 'aria-hidden': 'true' },
        TYPES.map(function (t, i) {
          return el('span', { class: i < typeIndex ? 'is-on' : (i === typeIndex ? 'is-here' : '') });
        }));
      var scale = el('div', { class: 'diag__scale t-label', 'aria-hidden': 'true' },
        TYPES.map(function (t) { return el('span', { text: t.name }); }));

      var moves = el('ol', { class: 'diag__moves' }, ranked.map(function (r) {
        var m = r.s === 2 ? r.q.sharpen : r.q.move;
        return el('li', {}, [el('div', {}, [
          el('strong', { text: m[0] }),
          el('p', { text: m[1] })
        ])]);
      }));

      var again = el('button', { type: 'button', class: 'btn btn--secondary', text: 'Retake it' });
      again.addEventListener('click', function () {
        answers = new Array(QUESTIONS.length);
        step = 0;
        renderQuestion(true);
      });

      body.appendChild(el('div', { class: 'diag__result' }, [
        el('div', { class: 'diag__progress' }, [
          el('span', { class: 't-label', text: 'Your readout' }),
          el('span', { class: 't-label', text: 'Score ' + total + ' of 12' })
        ]),
        heading,
        meter,
        scale,
        el('p', { class: 't-body-l', style: 'margin-top:24px', text: type.text }),
        el('p', { class: 't-label t-muted', style: 'margin-top:48px', text: 'Your 3 moves' }),
        moves,
        el('div', { class: 'diag__cta' }, [
          el('p', { text: 'Want the full read?' }),
          el('a', { class: 'btn btn--primary', href: contactHref, text: 'Let\'s talk' }),
          again
        ])
      ]));
      live.textContent = 'Readout ready. Your function is a ' + type.name + '.';
      heading.focus();
    }

    renderQuestion(false);
  }

  document.querySelectorAll('[data-diagnostic]').forEach(mount);
})();
