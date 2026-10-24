// Contact form: no backend. Validates, then opens a prefilled email.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var TOPICS = {
    strategy: 'Strategy and Advisory',
    fractional: 'Fractional Capability Leader',
    sprint: 'Build Sprints',
    keynote: 'Keynotes and Workshops',
    pov: 'Your point of view',
    diagnostic: 'My diagnostic readout'
  };

  var name = form.elements.name;
  var org = form.elements.org;
  var message = form.elements.message;
  var timeline = form.elements.timeline;
  var status = document.getElementById('form-status');

  // Diagnostic readouts pass their result and weakest area. Only known values
  // are used, so nothing from the URL is ever written into the page as-is.
  var RESULTS = { publisher: 'Publisher', 'program-shop': 'Program Shop', 'capability-engine': 'Capability Engine' };
  var GAPS = {
    decide: 'what gets built', speed: 'speed to build', report: 'measurement',
    managers: 'managers', mobility: 'internal mobility', ai: 'our AI plan', scale: 'scaling what works'
  };

  // Prefill from ?topic= (Work With Me cards, essay links, diagnostic).
  var params = new URLSearchParams(window.location.search);
  var topic = params.get('topic');
  if (topic && TOPICS[topic] && !message.value) {
    var result = RESULTS[params.get('result')];
    var gap = GAPS[params.get('gap')];
    message.value = result
      ? 'My diagnostic readout: The ' + result + '.' + (gap ? ' Where I\'d like help first: ' + gap + '.' : '') + '\n\n'
      : 'Interested in: ' + TOPICS[topic] + '\n\n';
  }

  // "Start here" links on the same page prefill the topic before jumping to the form.
  document.querySelectorAll('[data-topic]').forEach(function (link) {
    link.addEventListener('click', function () {
      var t = TOPICS[link.getAttribute('data-topic')];
      if (t) message.value = 'Interested in: ' + t + '\n\n';
    });
  });

  function setError(field, text) {
    var hint = document.getElementById(field.getAttribute('aria-describedby'));
    if (hint) hint.textContent = text;
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    return !text;
  }

  function validate() {
    var ok = true;
    var first = null;
    function check(field, test, text) {
      var good = setError(field, test ? '' : text);
      if (!good && !first) first = field;
      ok = ok && good;
    }
    check(name, name.value.trim().length > 1, 'Add your name.');
    check(org, org.value.trim().length > 1, 'Add your organization.');
    check(message, message.value.trim().length > 3, 'Tell me what\'s changing, even in a line.');
    if (first) first.focus();
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      status.textContent = 'A few fields need attention.';
      return;
    }
    var subject = 'Let\'s talk: ' + name.value.trim() + ', ' + org.value.trim();
    var body = [
      message.value.trim(),
      '',
      'When I need to move: ' + timeline.value,
      name.value.trim() + ', ' + org.value.trim()
    ].join('\n');
    window.location.href = 'mailto:hello@mattestes.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    // No form backend yet: the note goes out from the visitor's own email app.
    status.textContent = 'Got it. Your email app has the note ready. Hit send, and I\'ll reply within 2 business days. If nothing opened, write to hello@mattestes.com.';
  });
})();
