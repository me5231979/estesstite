// Capability Gap Diagnostic: six questions, one readout.
// Each answer scores 1-3. Total 6-18 maps to Publisher, Program Shop, or
// Capability Engine. The three lowest-scoring dimensions pick the moves.
(function () {
  var QUESTIONS = [
    {
      id: 'decide',
      scenario: {
        title: 'From request queue to work map',
        setup: 'Right now your team builds what people ask for. The work that is actually changing never makes it into the queue.',
        steps: [
          ['Week 1', 'Interview 5 leaders about what changed in their teams\' work this quarter.'],
          ['Week 2', 'Rank the 3 gaps that cost the most, in time, errors, or turnover.'],
          ['Week 4', 'Ship the first fix inside the workflow, not in a catalog.']
        ],
        proof: 'Every AXL build starts the same way: SME intake on the task that is breaking.'
      },
      label: 'What gets built',
      q: 'How does your team decide what to build?',
      options: ['Someone requests it.', 'We review annual needs.', 'We track where work is changing.'],
      move: ['Track where the work is changing.', 'Pick 3 roles. Ask their leaders what changed this quarter. Build from that list, not the request queue.'],
      sharpen: ['Retire what the work no longer needs.', 'Each quarter, cut the content tied to work that has moved on. Reinvest the hours.']
    },
    {
      id: 'speed',
      scenario: {
        title: 'From 3 months to 3 hours',
        setup: 'By the time a course launches, the need has moved. Speed is your quality problem.',
        steps: [
          ['Week 1', 'Stand up an AI build pipeline with your brand and design standards baked in.'],
          ['Week 2', 'Rebuild one stalled course live, with your SMEs in the room.'],
          ['Month 2', 'Your team ships on its own, in hours, without me at the keyboard.']
        ],
        proof: 'I built this model and shipped ~80 courses in 12 months, 2 to 3 hours of working time each.'
      },
      label: 'Speed to build',
      q: 'How long does a new course take to build?',
      options: ['3+ months.', '1 to 3 months.', 'Under 2 weeks.'],
      move: ['Set a speed standard.', 'Cap a 30 minute build at 2 weeks. Use AI build tools to hit it.'],
      sharpen: ['Build in the flow of work.', 'Ship smaller pieces where the work happens. Update them every quarter.']
    },
    {
      id: 'report',
      scenario: {
        title: 'From completions to changed behavior',
        setup: 'Leadership sees activity. Nobody can say whether anyone works differently.',
        steps: [
          ['Week 1', 'Pick one program. Name the one behavior it should change.'],
          ['Week 3', 'Launch a 5-item pulse and set up a comparison group.'],
          ['Day 90', 'Report the behavior change, not the attendance.']
        ],
        proof: 'The Manager Standard I designed measures behavior with a pulse and a comparison group, across 677 managers.'
      },
      label: 'Measurement',
      q: 'How do you report success?',
      options: ['Completions.', 'Satisfaction scores.', 'Behavior or business change.'],
      move: ['Report one behavior.', 'For your next program, name the behavior that should change. Measure it at 90 days.'],
      sharpen: ['Run a comparison group.', 'Trial your next program against a group that didn\'t get it. Report the difference.']
    },
    {
      id: 'managers',
      scenario: {
        title: 'From manager training to a manager standard',
        setup: 'Managers decide whether learning sticks, and nobody has defined what good looks like.',
        steps: [
          ['Week 1', 'Draft 5 to 8 observable behaviors with your senior leaders.'],
          ['Week 4', 'Pulse employees on them. Auto-assign learning on role change.'],
          ['Quarter 1', 'Run a cohort against a comparison group. Show who got better.']
        ],
        proof: 'I built this as the Manager Standard: one standard across 677 managers and 36 business units.'
      },
      label: 'Managers',
      q: 'How do managers fit in?',
      options: ['They approve time off for training.', 'They\'re invited to programs.', 'They\'re held to a defined standard.'],
      move: ['Write the manager standard.', 'Define 5 to 8 observable behaviors. Pulse employees on them twice a year.'],
      sharpen: ['Connect the standard to retention.', 'Put pulse results next to turnover by team. Show leaders where it pays.']
    },
    {
      id: 'mobility',
      scenario: {
        title: 'From job postings to a talent marketplace',
        setup: 'Your best people can\'t see where they could grow, so they grow somewhere else.',
        steps: [
          ['Month 1', 'Build skills profiles for one job family.'],
          ['Month 2', 'Post roles and short gigs inside first.'],
          ['Month 3', 'Count internal moves every month and report them as retention.']
        ],
        proof: 'On the talent platform I championed, staff made 1,031 internal moves in 12 months.'
      },
      label: 'Internal mobility',
      q: 'How do people find their next role internally?',
      options: ['They don\'t.', 'Job postings.', 'Skills-based matching and gigs.'],
      move: ['Make internal moves visible.', 'Publish skills profiles and post roles inside first. Count moves every month.'],
      sharpen: ['Tie mobility to critical roles.', 'Name the roles you can\'t afford to lose. Build a ready-now bench for each one.']
    },
    {
      id: 'ai',
      scenario: {
        title: 'From tool training to job redesign',
        setup: 'People learned the tools. The work around them didn\'t change.',
        steps: [
          ['Week 1', 'Run an AI literacy self-assessment that routes each person to the right learning.'],
          ['Week 3', 'Map AI exposure for one role, task by task.'],
          ['Week 6', 'Redesign that role\'s workflow, then train to the new one.']
        ],
        proof: 'I built an AI literacy assessment on a validated research scale. It scores instantly and sends each person a path.'
      },
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
      slug: 'publisher',
      max: 10,
      verdict: 'You\'re not there <em>yet</em>. Let me help.',
      text: 'You produce content and report activity. That\'s how most functions work, and it\'s why most get cut first.',
      fit: {
        name: 'Strategy and Advisory',
        why: 'I diagnose your function and hand you a capability roadmap tied to business outcomes. Then we build the first win together, so leadership sees it work.'
      },
      cta: 'Let\'s find your first win'
    },
    {
      name: 'Program Shop',
      slug: 'program-shop',
      max: 14,
      verdict: 'You\'re <em>close</em>.',
      text: 'You build good programs. They\'re still programs. The next step is shifting from what people attend to what people can do.',
      fit: {
        name: 'Build Sprints',
        why: 'You have the foundation. A sprint turns one program into a working capability system in weeks, and gives you the model to repeat it.'
      },
      cta: 'Let\'s close the gap'
    },
    {
      name: 'Capability Engine',
      slug: 'capability-engine',
      max: 18,
      verdict: 'You and I think <em>alike</em>.',
      text: 'You\'re ahead of most of the field. The challenge now is speed and scale without losing quality.',
      fit: {
        name: 'Fractional Capability Leader',
        why: 'You don\'t need convincing. You need more hands that already think this way. I can run the next transformation with you for a defined term, or take the thinking to your leaders.'
      },
      cta: 'Let\'s compare notes'
    }
  ];

  // An Engine with no weak spot gets a scale scenario instead of a gap.
  var SCALE = {
    title: 'Scale without losing quality',
    setup: 'You already work like a capability team. The risk now is that quality depends on a few people.',
    steps: [
      ['Week 1', 'Audit build time and quality across every team that ships learning.'],
      ['Week 3', 'Codify your standards into the build process itself.'],
      ['Quarter 1', 'Open the model to subject matter experts, with guardrails, not a queue.']
    ],
    proof: 'That is exactly where I\'m taking AXL next: quality that doesn\'t depend on who\'s at the keyboard.'
  };

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

      // Weakest dimensions first; ties keep question order.
      var ranked = QUESTIONS.map(function (q, i) { return { q: q, s: answers[i], i: i }; })
        .sort(function (a, b) { return a.s - b.s || a.i - b.i; });
      var gap = ranked[0];
      var scenario = gap.s === 2 ? SCALE : gap.q.scenario;
      var gapSlug = gap.s === 2 ? 'scale' : gap.q.id;

      var base = contactHref.split('?')[0];
      var talkHref = base + '?topic=diagnostic&result=' + type.slug + '&gap=' + gapSlug;
      var fitHref = base.replace(/contact\/$/, 'work-with-me/');

      body.innerHTML = '';
      var heading = el('h3', { tabindex: '-1', class: 'diag__verdict', html: type.verdict });

      // 1. Verdict and where they sit on the scale
      var meter = el('div', { class: 'diag__meter', 'aria-hidden': 'true' },
        TYPES.map(function (t, i) {
          return el('span', { class: i < typeIndex ? 'is-on' : (i === typeIndex ? 'is-here' : ''), style: '--mi:' + i });
        }));
      var scale = el('div', { class: 'diag__scale t-label', 'aria-hidden': 'true' },
        TYPES.map(function (t, i) { return el('span', { text: t.name, class: i === typeIndex ? 'is-here' : '' }); }));

      // 2. Their profile, one bar per dimension
      var profile = el('ul', { class: 'diag__profile', 'aria-label': 'Your answers by area, out of 3' },
        QUESTIONS.map(function (q, i) {
          var v = answers[i] + 1;
          return el('li', { class: q === gap.q && gap.s < 2 ? 'is-gap' : '' }, [
            el('span', { class: 't-label', text: q.label }),
            el('span', { class: 'diag__bar2', 'aria-hidden': 'true' }, [el('span', { style: '--v:' + (v / 3) + ';--bi:' + i })]),
            el('span', { class: 'diag__val t-label', text: v + ' of 3' })
          ]);
        }));

      // 3. The scenario: what working together would look like
      var steps = el('ol', { class: 'diag__steps' }, scenario.steps.map(function (st, i) {
        return el('li', { style: '--si:' + i }, [
          el('span', { class: 't-label', text: st[0] }),
          el('p', { text: st[1] })
        ]);
      }));

      var again = el('button', { type: 'button', class: 'btn btn--secondary', text: 'Retake it' });
      again.addEventListener('click', function () {
        answers = new Array(QUESTIONS.length);
        step = 0;
        renderQuestion(true);
      });

      var result = el('div', { class: 'diag__result' }, [
        el('div', { class: 'diag__progress' }, [
          el('span', { class: 't-label', text: 'Your readout · The ' + type.name }),
          el('span', { class: 't-label', text: 'Score ' + total + ' of 18' })
        ]),
        heading,
        meter,
        scale,
        el('p', { class: 't-body-l diag__lede', text: type.text }),

        el('div', { class: 'diag__block' }, [
          el('p', { class: 't-label t-muted', text: 'Your profile' }),
          profile
        ]),

        el('div', { class: 'diag__block diag__scenario' }, [
          el('p', { class: 't-label t-muted', text: gap.s === 2 ? 'Where we\'d push next' : 'Where I\'d start: ' + gap.q.label }),
          el('h4', { text: scenario.title }),
          el('p', { class: 'diag__setup', text: scenario.setup }),
          steps,
          el('p', { class: 'diag__proof', text: scenario.proof })
        ]),

        el('div', { class: 'diag__block diag__fit' }, [
          el('p', { class: 't-label t-muted', text: 'How I can help' }),
          el('h4', {}, [el('a', { class: 'link', href: fitHref, text: type.fit.name })]),
          el('p', { text: type.fit.why })
        ]),

        el('p', { class: 'diag__note', text: 'A quick self-assessment for general information. It is not professional advice.' }),
        el('div', { class: 'diag__cta' }, [
          el('p', { text: 'Want the full read on your function?' }),
          el('a', { class: 'btn btn--primary', href: talkHref, text: type.cta }),
          again
        ])
      ]);
      body.appendChild(result);
      // Next frame: let the bars, meter, and steps animate in.
      requestAnimationFrame(function () { requestAnimationFrame(function () { result.classList.add('is-in'); }); });
      live.textContent = 'Readout ready. The ' + type.name + '. ' + heading.textContent;
      heading.focus();
    }

    renderQuestion(false);
  }

  document.querySelectorAll('[data-diagnostic]').forEach(mount);
})();
