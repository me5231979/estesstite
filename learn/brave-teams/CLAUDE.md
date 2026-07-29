# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Building Brave Teams — Vanderbilt Learning Series

This course lives at `learn/brave-teams/` inside the estesstite site repo;
all commands below run from this directory.

Single-page interactive workshop experience (Learning on Demand): a
facilitator projects `index.html` while learners follow on their own devices
via QR code. Plain HTML/CSS/JS — no frameworks, no build step, no package
manager, no tests.

- Learner edition: https://me5231979.github.io/estesstite/learn/brave-teams/ (GitHub Pages via the repo's deploy workflow)
- Facilitator edition: https://me5231979.github.io/estesstite/learn/brave-teams/facilitator/ (generated, see below)

Sister programs on the same engine: AI_Classroom (AI Basics), AI-Advanced
(AI 201), Difficult_Conversations, Coaching-for-Performance; catalog at
me5231979/Course_Library. Same standing principles across the series.

## Commands

```bash
python3 -m http.server 8000          # preview locally (no build step)
python3 tools/build-facilitator.py   # regenerate facilitator edition — REQUIRED after
                                     # any change to index.html or facilitator/notes.json;
                                     # must print "17 notes rails injected"
git push origin claude/tender-meitner-hrd0rx    # publish: the deploy-pages workflow republishes gh-pages
```

There is no linter or test suite. Verification = open the page in a browser,
exercise the interactives, and confirm the build script's rail count.

## Architecture

**Learner site** — three files carry everything:

- `index.html` — all copy for 17 `<section class="slide" id="s-*" data-title="…">`
  slides, separated by `<!-- ============ N · NAME ============ -->` banner
  comments. `data-count` marks the six numbered teaching sections.
- `assets/js/main.js` — one IIFE, organized by banner comments. Key pieces:
  - `makeTrainer(cfg)` — generic quiz engine instantiated four times (myth
    matcher, Johari sticky-sort, expand/contract, SBI fix-the-feedback).
    Each config supplies element selectors, `items` (`{q, opts?/labels,
    answer, why}`), pass threshold, and pass/fail copy.
  - Edmondson 7-item diagnostic: `PS_ITEMS` (with `reverse` flags — items
    1, 3, 5 are reverse-scored as 6 − rating) / `PS_BANDS`.
  - Johari picker: `ADJ` (the standard 56 adjectives), 5–6 selection cap,
    copyable card output.
  - Scored recap: `QUESTIONS` (6 items, mapped 1:1 to the hero objectives).
  - Capstone: `ASK` / `NOTE` / `STAGE` lookup maps building the copyable
    Brave Commitment card.
  - Deck navigation (dots, arrows, keyboard), reveal-on-scroll, hero
    particle canvas (no video montage in this course).
- `assets/css/styles.css` — the shared series stylesheet; brand tokens are
  CSS custom properties (`--vu-gold-flat`, `--vu-black`, font vars). This
  course reuses `.braving__*` (survey dots), `.quad__*` (Johari 2×2), and
  adds section 27 (`.adjgrid`/`.adj` adjective chips). Fonts self-hosted in
  `assets/fonts/`; QR lib vendored at `assets/js/qrcode.js`.

**Facilitator pipeline** — `tools/build-facilitator.py` reads `index.html` +
`facilitator/notes.json` and writes `facilitator/index.html` (generated output —
never hand-edit). It works by literal string/regex replacement on index.html, so
these anchors must survive any edit to index.html:

- the exact `<title>Building Brave Teams | Vanderbilt</title>` string
- `<div class="qr-card" id="qrCard" data-reveal>`
- the phrase `For the next two hours, the room itself is the lab` on the
  welcome slide (QR-explainer sentence is injected before it)
- the `<!-- ============ 0 · WELCOME / QR ============ -->` banner (briefing
  slide is injected before it)
- the footer line `Building Brave Teams · A Vanderbilt learning experience`
- slide closing tags indented exactly two spaces (`\n  </section>`) — the
  notes-rail regex depends on it

`facilitator/notes.json` schema: `meta` (program info, `paths` Full 120/Core 90,
ATD front matter: `materials`, `prep` {weekBefore, dayBefore, thirtyMinBefore},
`contingencies` {if, then}, `toughQuestions` {q, a}, `templates` {title, body},
`postSession`) plus `sections[]` keyed by slide `id` with per-slide `minutes`,
`coreMinutes` (0 = skipped in Core), `purpose`, `say`, `facilitate[]`,
`ask` {q, expect[], respond}, `debrief`, `validate`, `watchFor`, `transition`,
`coreNote`. **Timing must sum: Full 120 / Core 90.**

**Standalone pages:** `cheatsheet.html` (take-home reference),
`worksheet.html` (paper commitment card + exit ticket / no-device fallback),
`404.html`. `FACILITATION.md` documents the run-of-show and validation model.

## Standing design principles (do not regress these)

1. **Simulators, practice, and play throughout.** Every teaching section
   has an interaction; the 7-item diagnostic and the Johari picker are the
   signature pieces, the triad Candor Rehearsal is the in-room peak.
2. **A reason and facilitation behind every activity.** Learner-visible
   "Why this matters" lines; activities labeled As a group / Flying solo
   with steps, timings, and solo variants.
3. **Every section facilitatable, learning validatable.** ATD runbook in
   `facilitator/notes.json`. Kirkpatrick: L1 fist-to-five + equipped
   rating, L2 recap mapped to the six objectives + Johari artifact,
   L3 day-14 pulse + day-30 manager retro + day-60 re-pulse.
4. **Autonomy preservation.** Every activity has an opt-out; nothing typed
   is saved or sent; sheet contents are never shared aloud; forced
   disclosure is never used. This is pedagogy, not just privacy.
5. **Facilitator edition is generated, never hand-edited** — run
   `python3 tools/build-facilitator.py` after ANY change to index.html or
   notes.json. Its QR encodes the LEARNER url.
6. **Brand: Vanderbilt FLH system.** Black #1C1C1C / white / flat gold
   #CFAE70; Libre Caslon Display headlines (one italic word), Inter body,
   Antonio eyebrows; motion ≤400ms; real VU lockups (authorized use only).
7. **No frameworks.** One CSS file, one JS file, vendored QR lib,
   self-hosted fonts.

## Layout (17 slides)

Welcome/QR (pre-work note) →
The Chancellor's charge (institutional vision + areas of focus + reputation
flywheel + mission-alignment builder) →
Our why (Sinek Golden Circle + TED embed + circle builder) →
Hero (6 objectives + skills row + particles) → Agenda → 01 What safety is (myth trainer + Edmondson TEDx) → manifesto →
02 Where your team stands (4 stage cards + 7-item diagnostic) →
03 The evidence (3 case cards + equation) →
04 Johari Window (2×2 + adjective picker + sticky sort) →
05 Expand or contract (trainer) → 06 Candor rehearsal (SBI cards + trainer) →
Recap quiz → Capstone Brave Commitment → Glossary →
Resources (Oracle Learning deep links + watch/listen/read shelf, gold links) →
Closing (one-word ritual).

Slide ids: `s-welcome`, `s-mission`, `s-why`, `s-hero`, `s-agenda`,
`s-safety`, `s-belief`, `s-diagnose`, `s-case`, `s-johari`, `s-expand`,
`s-candor`, `s-recap`, `s-plan`, `s-glossary`, `s-resources`, `s-close`.

## Editing map

- Copy: `index.html` · Recap: `QUESTIONS` in `assets/js/main.js`
- Trainers: `makeTrainer` configs (myth, sticky-sort, expand/contract, SBI)
- Diagnostic: `PS_ITEMS` / `PS_BANDS` · Johari picker: `ADJ` in main.js
- Capstone maps: `ASK` / `NOTE` / `STAGE` in main.js
- Runbook: `facilitator/notes.json` (timing must sum: Full 120 / Core 90)
- Resources shelf: `s-resources` in `index.html` — Oracle Learning deep links
  (base: `ecsr.fa.us2.oraclecloud.com/...learningItemId=<id>`); links must stay
  gold (`.res a`), never browser blue.
- Citations to keep honest: Edmondson 1999 + 1996 nursing studies + The
  Fearless Organization + TEDx talk, Clark's 4 Stages, Luft & Ingham 1955
  (Johari, standard 56-adjective list), Google Project Aristotle (re:Work),
  CCL SBI (adapted as SBI + Ask), Tenerife 1977 / Crew Resource Management,
  Kolb, Tuckman, Anderson & Krathwohl, Kirkpatrick, Sinek's Golden Circle
  (TED, u4ZoJKF_VuA), and Chancellor Diermeier's "Daring to Grow" vision
  (news.vanderbilt.edu, 2022) for the mission section.
