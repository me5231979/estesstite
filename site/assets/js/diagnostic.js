// Capability Gap Diagnostic: six questions, one readout.
// Each answer scores 1-3. Total 6-18 maps to Publisher, Program Shop, or
// Capability Engine. The three lowest-scoring dimensions pick the moves.
(function () {
  var QUESTIONS = [
    {
      id: 'decide',
      label: 'What gets built',
      q: 'How does your team decide what to build?',
      options: ['Someone requests it.', 'We review annual needs.', 'We track where work is changing.'],
      move: ['Track where the work is changing.', 'Pick 3 roles. Ask their leaders what changed this quarter. Build from that list, not the request queue.'],
      sharpen: ['Retire what the work no longer needs.', 'Each quarter, cut the content tied to work that has moved on. Reinvest the hours.']
    },
    {
      id: 'speed',
      label: 'Speed to build',
      q: 'How long does a new course take to build?',
      options: ['3+ months.', '1 to 3 months.', 'Under 2 weeks.'],
      move: ['Set a speed standard.', 'Cap a 30 minute build at 2 weeks. Use AI build tools to hit it.'],
      sharpen: ['Build in the flow of work.', 'Ship smaller pieces where the work happens. Update them every quarter.']
    },
    {
      id: 'report',
      label: 'Measurement',
      q: 'How do you report success?',
      options: ['Completions.', 'Satisfaction scores.', 'Behavior or business change.'],
      move: ['Report one behavior.', 'For your next program, name the behavior that should change. Measure it at 90 days.'],
      sharpen: ['Run a comparison group.', 'Trial your next program against a group that didn\'t get it. Report the difference.']
    },
    {
      id: 'managers',
      label: 'Managers',
      q: 'How do managers fit in?',
      options: ['They approve time off for training.', 'They\'re invited to programs.', 'They\'re held to a defined standard.'],
      move: ['Write the manager standard.', 'Define 5 to 8 observable behaviors. Pulse employees on them twice a year.'],
      sharpen: ['Connect the standard to retention.', 'Put pulse results next to turnover by team. Show leaders where it pays.']
    },
    {
      id: 'mobility',
      label: 'Internal mobility',
      q: 'How do people find their next role internally?',
      options: ['They don\'t.', 'Job postings.', 'Skills-based matching and gigs.'],
      move: ['Make internal moves visible.', 'Publish skills profiles and post roles inside first. Count moves every month.'],
      sharpen: ['Tie mobility to critical roles.', 'Name the roles you can\'t afford to lose. Build a ready-now bench for each one.']
    },
    {
      id: 'ai',
      label: 'AI plan',
      q: 'What\'s your AI plan?',
      options: ['Tool training.', 'A literacy program.', 'Role-by-role work redesign.'],
      move: ['Treat AI as job redesign.', 'Pick 1 role. Map which tasks AI changes. Train people on the new workflow, not the tool.'],
      sharpen: ['Redesign the manager job next.', 'Managers decide whether new workflows stick. Give them a standard for leading AI-assisted teams.']
    }
  ];

  // Scores: 1, 2, or 3 points per answer. 6 to 18 total.
  var TYPES = [
    {
      name: 'Publisher',
      max: 10,
      text: 'You produce content and report activity. That\'s how most functions work, and it\'s why most get cut first. Start by measuring one behavior that matters to the business.'
    },
    {
      name: 'Program Shop',
      max: 14,
      text: 'You build good programs. They\'re still programs. The next step is shifting from what people attend to what people can do.'
    },
    {
      name: 'Capability Engine',
      max: 18,
      text: 'You\'re ahead of most of the field. The challenge now is speed and scale without losing quality.'
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
      var total = answers.reduce(function (a, b) { return a + b + 1; }, 0);
      var typeIndex = TYPES.findIndex(function (t) { return total <= t.max; });
      var type = TYPES[typeIndex];

      // Three lowest-scoring dimensions; ties keep question order.
      var ranked = QUESTIONS.map(function (q, i) { return { q: q, s: answers[i], i: i }; })
        .sort(function (a, b) { return a.s - b.s || a.i - b.i; })
        .slice(0, 3);

      body.innerHTML = '';
      var heading = el('h3', { tabindex: '-1', html: 'The <em>' + type.name + '</em>.' });
      var meter = el('div', { class: 'diag__meter', 'aria-hidden': 'true' },
        TYPES.map(function (t, i) {
          return el('span', { class: i < typeIndex ? 'is-on' : (i === typeIndex ? 'is-here' : '') });
        }));
      var scale = el('div', { class: 'diag__scale t-label', 'aria-hidden': 'true' },
        TYPES.map(function (t) { return el('span', { text: t.name }); }));

      var moves = el('ol', { class: 'diag__moves' }, ranked.map(function (r) {
        var m = r.s === 2 ? r.q.sharpen : r.q.move; // r.s is the 0-based option
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
          el('span', { class: 't-label', text: 'Score ' + total + ' of 18' })
        ]),
        heading,
        meter,
        scale,
        el('p', { class: 't-body-l', style: 'margin-top:24px', text: type.text }),
        el('p', { class: 't-label t-muted', style: 'margin-top:48px', text: 'Your 3 moves' }),
        moves,
        el('p', { class: 'diag__note', text: 'A quick self-assessment for general information. It is not professional advice.' }),
        el('div', { class: 'diag__cta' }, [
          el('p', { text: 'Want the full read on your function?' }),
          el('a', { class: 'btn btn--primary', href: contactHref, text: 'Let\'s talk' }),
          again
        ])
      ]));
      live.textContent = 'Readout ready. The ' + type.name + '.';
      heading.focus();
    }

    renderQuestion(false);
  }

  document.querySelectorAll('[data-diagnostic]').forEach(mount);
})();
