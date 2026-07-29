#!/usr/bin/env python3
"""Generate the facilitator edition at facilitator/index.html.

Mirrors the learner site (index.html) and renders the runbook
(facilitator/notes.json) as a notes rail on the right of each slide.
Run after editing index.html or notes.json:

    python3 tools/build-facilitator.py
"""
import json, re, html, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEARNER_URL = "https://me5231979.github.io/estesstite/learn/brave-teams/"

s = open(os.path.join(ROOT, 'index.html')).read()
notes = json.load(open(os.path.join(ROOT, 'facilitator', 'notes.json')))
by_id = {sec['id']: sec for sec in notes['sections']}

# ---- 1. asset + link paths (one directory deeper) ----
s = s.replace('href="assets/', 'href="../assets/')
s = s.replace('src="assets/', 'src="../assets/')
s = s.replace('href="cheatsheet.html"', 'href="../cheatsheet.html"')
s = s.replace('href="worksheet.html"', 'href="../worksheet.html"')

# ---- 2. head: title, noindex, no canonical/og confusion ----
s = s.replace('<title>Building Brave Teams | Vanderbilt</title>',
              '<title>Building Brave Teams — Facilitator Edition | Vanderbilt</title>')
s = re.sub(r'<link rel="canonical"[^>]*>\n', '', s)
s = s.replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"')

# ---- 3. QR points at the LEARNER site ----
s = s.replace('<div class="qr-card" id="qrCard" data-reveal>',
              f'<div class="qr-card" id="qrCard" data-reveal data-url="{LEARNER_URL}">')
s = s.replace('For the next two hours, the room itself is the lab', 'Learners scan this code and land on the learner edition; your screen keeps the notes. For the next two hours, the room itself is the lab')

# ---- 4. body class + nav badge ----
s = s.replace('<body>', '<body class="fac">')
s = s.replace('''    <img class="nav__vicon" src="../assets/img/vu-v-icon-nav.png" alt="Vanderbilt University" width="34" height="25">
  </a>''',
'''    <img class="nav__vicon" src="../assets/img/vu-v-icon-nav.png" alt="Vanderbilt University" width="34" height="25">
    <span class="fac__badge">Facilitator Edition</span>
  </a>''')

# ---- 5. inject the notes rail into each slide that has runbook notes ----
def rail(sec):
    def esc(t): return html.escape(t, quote=False)
    parts = [
        f'<div class="facnote__head"><span>Facilitator</span>'
        f'<span>Full {sec.get("minutes","–")} min · Core {sec.get("coreMinutes","–") or "skip"}</span></div>',
        f'<p class="facnote__purpose">{esc(sec.get("purpose",""))}</p>',
    ]
    if sec.get('say'):
        parts.append(f'<div class="facnote__blk"><span class="facnote__tag t-say">Say</span><p class="facnote__script">&ldquo;{esc(sec["say"])}&rdquo;</p></div>')
    steps = ''.join(f'<li>{esc(x)}</li>' for x in sec.get('facilitate', []))
    if steps:
        parts.append(f'<div class="facnote__blk"><span class="facnote__tag t-do">Do</span><ol class="facnote__steps">{steps}</ol></div>')
    ask = sec.get('ask')
    if ask:
        expect = ''.join(f'<li>{esc(x)}</li>' for x in ask.get('expect', []))
        parts.append(
            f'<div class="facnote__blk"><span class="facnote__tag t-ask">Ask</span>'
            f'<p class="facnote__script">&ldquo;{esc(ask["q"])}&rdquo;</p>'
            + (f'<p class="facnote__mini">Expect:</p><ul class="facnote__steps">{expect}</ul>' if expect else '')
            + (f'<p class="facnote__mini">Respond: {esc(ask["respond"])}</p>' if ask.get('respond') else '')
            + '</div>')
    if sec.get('debrief'):
        parts.append(f'<div class="facnote__blk"><span class="facnote__tag t-deb">Debrief</span><p class="facnote__mini">{esc(sec["debrief"])}</p></div>')
    if sec.get('validate'):
        parts.append(f'<p class="facnote__meta"><b>Validate:</b> {esc(sec["validate"])}</p>')
    if sec.get('watchFor'):
        parts.append(f'<p class="facnote__meta"><b>Watch for:</b> {esc(sec["watchFor"])}</p>')
    if sec.get('transition'):
        parts.append(f'<div class="facnote__blk"><span class="facnote__tag t-tra">Transition</span><p class="facnote__script">&ldquo;{esc(sec["transition"])}&rdquo;</p></div>')
    if sec.get('coreNote'):
        parts.append(f'<p class="facnote__meta facnote__core"><b>90-min core:</b> {esc(sec["coreNote"])}</p>')
    return '<aside class="facnote" aria-label="Facilitator notes">' + ''.join(parts) + '</aside>'

count = 0
for sid, sec in by_id.items():
    pat = re.compile(r'(<section class="slide[^"]*" id="' + sid + r'"[^>]*>.*?)(\n  </section>)', re.S)
    m = pat.search(s)
    if not m:
        continue
    s = s[:m.end(1)] + '\n    ' + rail(sec) + s[m.end(1):]
    count += 1


# ---- 5b. facilitator briefing slide (ATD front matter) ----
def esc2(t): return html.escape(t, quote=False)
meta = notes['meta']
prep_cols = ''
for label, key in (("A week before","weekBefore"),("The day before","dayBefore"),("30 minutes before","thirtyMinBefore")):
    items = ''.join(f'<li>{esc2(x)}</li>' for x in meta['prep'][key])
    prep_cols += f'<div class="brief__box"><h3>{label}</h3><ol>{items}</ol></div>'
mats = ''.join(f'<li>{esc2(x)}</li>' for x in meta['materials'])
cont = ''.join(f'<div class="brief__row"><b>If {esc2(c["if"]).rstrip(".")}:</b> {esc2(c["then"])}</div>' for c in meta['contingencies'])
tough = ''.join(f'<details class="brief__q"><summary>{esc2(t["q"])}</summary><p>{esc2(t["a"])}</p></details>' for t in meta['toughQuestions'])
tmpl = ''.join(f'<details class="brief__q"><summary>{esc2(t["title"])}</summary><p>{esc2(t["body"])}</p></details>' for t in meta.get('templates', []))
tmpl_box = f'<div class="brief__box brief__wide"><h3>Copy-paste templates</h3>{tmpl}</div>' if tmpl else ''
briefing = f"""  <section class="slide on-dark" id="s-briefing" data-title="Facilitator briefing">
    <div class="wrap wrap-wide">
      <p class="eyebrow">Facilitator briefing · Read before you teach</p>
      <h2 class="h2">Run this <em>room</em>.</h2>
      <p class="lead">Two paths: Full ({meta['paths']['full']['minutes']} min) or Core ({meta['paths']['core']['minutes']} min). Every slide ahead carries your script in the right rail: Say, Do, Ask with expected answers, Debrief, Transition. This page is everything that happens before and around the room. Learners never see this edition.</p>
      <div class="brief__grid">{prep_cols}
        <div class="brief__box"><h3>Materials</h3><ul>{mats}</ul></div>
        <div class="brief__box brief__wide"><h3>When things go sideways</h3>{cont}</div>
        <div class="brief__box brief__wide"><h3>Tough questions, ready answers</h3>{tough}</div>
        {tmpl_box}
      </div>
      <p class="why" style="margin-top:1.5rem"><b>After the session:</b> {esc2(meta['postSession'])}</p>
    </div>
  </section>

"""
s = s.replace('  <!-- ============ 0 · WELCOME / QR ============ -->', briefing + '  <!-- ============ 0 · WELCOME / QR ============ -->', 1)

# ---- 6. facilitator styles ----
FAC_CSS = '''
<style>
/* ============ facilitator edition ============ */
.fac__badge { font-family: var(--font-condensed); font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; font-size: .7rem; color: var(--vu-black); background: var(--vu-gold-flat);
  padding: .3rem .55rem; border-radius: 3px; margin-left: .9rem; white-space: nowrap; }
@media (min-width: 1200px) {
  body.fac .slide { display: grid; grid-template-columns: minmax(0,1fr) 350px; align-items: center; column-gap: 0; overflow: visible; }
  body.fac .slide > .wrap { grid-column: 1; }
  body.fac .slide > .hero__video, body.fac .slide > .hero__canvas, body.fac .slide > .hero__scrim { grid-column: 1 / -1; }
  body.fac .facnote { grid-column: 2; align-self: start; position: sticky; top: calc(var(--nav-h) + 16px);
    margin: 0 18px 0 0; }
  body.fac .dots { display: none; } /* rail replaces the dot rail on the right */
}
.facnote {
  background: rgba(20,20,20,.96); color: rgba(255,255,255,.85); border: 1px solid rgba(207,174,112,.45);
  border-left: 3px solid var(--vu-gold-flat); border-radius: 6px; padding: 1rem 1.1rem;
  font-size: .82rem; line-height: 1.5; max-height: calc(100vh - var(--nav-h) - 48px); overflow: auto; z-index: 5;
}
@media (max-width: 1199px) { .facnote { margin: 1.5rem var(--pad-x) 0; } }
.facnote__head { display: flex; justify-content: space-between; gap: .5rem; align-items: baseline;
  font-family: var(--font-condensed); font-weight: 700; text-transform: uppercase; letter-spacing: .07em;
  font-size: .68rem; color: var(--vu-gold-flat); border-bottom: 1px solid rgba(207,174,112,.3);
  padding-bottom: .5rem; margin-bottom: .6rem; }
.facnote__purpose { margin: 0 0 .6rem; color: #fff; font-weight: 500; }
.facnote__steps { margin: 0 0 .6rem; padding-left: 1.05rem; display: grid; gap: .35rem; }
.facnote__meta { margin: .35rem 0 0; color: rgba(255,255,255,.75); }
.facnote__meta b { color: var(--vu-gold-flat); font-weight: 600; }
.facnote__core { border-top: 1px dashed rgba(207,174,112,.35); padding-top: .5rem; }
.facnote__blk { margin: .55rem 0 0; }
.facnote__tag { display: inline-block; font-family: var(--font-condensed); font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; font-size: .6rem; padding: .15rem .4rem; border-radius: 2px; margin-bottom: .25rem; }
.t-say { background: var(--vu-gold-flat); color: var(--vu-black); }
.t-do  { background: rgba(179,201,205,.9); color: var(--vu-black); }
.t-ask { background: rgba(139,161,142,.9); color: var(--vu-black); }
.t-deb { background: rgba(236,183,72,.9); color: var(--vu-black); }
.t-tra { background: rgba(255,255,255,.25); color: #fff; }
.facnote__script { margin: 0; font-family: var(--font-serif); font-style: italic; font-size: .88rem; color: #fff; }
.facnote__mini { margin: .25rem 0 0; font-size: .78rem; color: rgba(255,255,255,.75); }
.brief__grid { display: grid; gap: 1rem; grid-template-columns: 1fr; margin-top: 1.5rem; }
@media (min-width: 980px) { .brief__grid { grid-template-columns: repeat(2, 1fr); }
  body.fac #s-briefing { grid-template-columns: 1fr !important; } }
.brief__box { background: #262626; border: 1px solid rgba(207,174,112,.3); border-radius: 6px; padding: 1.1rem 1.25rem; font-size: .92rem; }
.brief__box h3 { font-family: var(--font-condensed); font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
  font-size: .8rem; color: var(--vu-gold-flat); margin-bottom: .6rem; }
.brief__box ol, .brief__box ul { margin: 0; padding-left: 1.1rem; display: grid; gap: .4rem; color: rgba(255,255,255,.85); }
.brief__wide { grid-column: 1 / -1; }
.brief__row { padding: .45rem 0; border-bottom: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.85); }
.brief__row b { color: var(--vu-gold-flat); }
.brief__q { border-bottom: 1px solid rgba(255,255,255,.08); padding: .4rem 0; }
.brief__q summary { cursor: pointer; font-weight: 500; color: #fff; }
.brief__q p { margin: .4rem 0 .2rem; color: rgba(255,255,255,.8); font-size: .9rem; }
</style>
'''
s = s.replace('</head>', FAC_CSS + '</head>')

# ---- 7. footer marker ----
s = s.replace('Building Brave Teams · A Vanderbilt learning experience',
              'Building Brave Teams · Facilitator Edition · learner link: <a href="' + LEARNER_URL + '" style="color:rgba(255,255,255,.7);text-decoration:underline">me5231979.github.io/estesstite/learn/brave-teams</a>')

out = os.path.join(ROOT, 'facilitator', 'index.html')
open(out, 'w').write(s)
print(f'wrote {out}: {count} notes rails injected')
