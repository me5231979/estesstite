# Building Brave Teams — Psychological Safety, Trust, and Honest Communication

An interactive, single-page teaching site for a 2-hour immersive workshop.
A **Learning on Demand** program: the facilitator projects it while
learners scan a QR code and work every exercise on their own devices, or
share the link for self-paced review. Nothing typed ever leaves the screen.

Part of the Vanderbilt Learning Series. Catalog:
[Course Library](https://me5231979.github.io/Course_Library/) ·
Sister program: [Difficult Conversations](https://me5231979.github.io/Difficult_Conversations/)

- **Learner edition:** https://me5231979.github.io/estesstite/learn/brave-teams/
- **Facilitator edition:** https://me5231979.github.io/estesstite/learn/brave-teams/facilitator/

## Running it

Plain HTML/CSS/JS, no build step:

```bash
python3 -m http.server 8000
```

## What it teaches (6 sections, framed by the why)

The deck opens with the hook and learning objectives ("You can meet. Now
say the hard thing."), then **the Chancellor's charge** (the institutional
vision — "define the great university of the 21st century, and be it" —
areas of focus, the reputation flywheel, and a mission-alignment builder),
then **Our Why** (Sinek's Golden Circle with a builder that renders your
why/how/what as concentric rings), before the six teaching sections:

1. What safety is (and isn't) — Edmondson's construct vs. the three myths
   (niceness, low bar, consensus)
2. Where your team stands — Clark's 4 Stages ladder + Edmondson's 7-item
   diagnostic, self-scored live
3. The evidence — nursing units (more errors reported), Tenerife/CRM,
   Google's Project Aristotle, and the working equation
4. The Johari Window — disclosure and feedback as the two moves that grow
   the Open quadrant (Luft & Ingham)
5. Expand or contract — the observable behaviors that move safety, mapped
   to all four stages
6. The candor rehearsal — SBI + Ask (adapted from CCL), drilled by ear

Ends with a scored recap mapped 1:1 to the objectives, the **Brave
Commitment capstone** (start, stop, question, note, rung — 14 days, one
witness), a flip-card glossary, and a one-word closing ritual.
`worksheet.html` mirrors the commitment card on paper (with the exit ticket
on the back); `cheatsheet.html` is the take-home reference. A closing
**Resources** slide maps Vanderbilt Oracle Learning courses (deep-linked),
talks, podcasts, and source documents to the rungs practiced in-session.

## The interactive tools

| Slide | Tool | What learners do |
|---|---|---|
| Safety | **Safety, or something else?** | Diagnose five team snapshots: real safety, niceness in disguise, or a lowered bar |
| The Ladder | **7-item diagnostic** | Rate Edmondson's actual instrument 1–5 and get a banded read + lowest-item nudge |
| The Ladder | **Quick check** | The comfort-zone trap: safety AND standards |
| Evidence | **Quick check** | Why better nursing units reported MORE errors |
| Johari | **Build your Open quadrant** | Pick 5–6 of the standard 56 adjectives; get a copyable opening claim |
| Johari | **Sort the sticky** | Map returned feedback into Open / Blind / Hidden / Unknown |
| Behaviors | **Expand or contract?** | Call eight real meeting moves, fast |
| Candor | **Fix the feedback** | Name the broken SBI + Ask joint in five attempts |
| Mission | **Alignment builder** | Locate your team's share of the vision: area of focus + rung + one concrete line |
| Why | **Golden Circle builder** | Construct your own why/how/what — rendered as concentric rings |
| Recap | **Scored quiz** | 6 questions mapped 1:1 to the objectives |
| Capstone | **Brave Commitment card** | Build and copy a dated, witnessed commitment |

## Instructional design

- **Kolb:** every 20–25 minute block completes the full cycle; no more
  than ~8 minutes of instruction before application.
- **Bloom (cognitive + affective):** objectives run Define → Diagnose →
  Explain → Practice/Disclose → Differentiate/Deliver → Commit.
- **Kirkpatrick:** L1 fist-to-five + equipped rating; L2 recap mapped to
  objectives + Johari artifact; L3 day-14 pulse, day-30 manager retro,
  day-60 re-pulse; L4 90-day metrics (retro candor, near-miss reporting,
  talk-time balance).
- **Autonomy preservation:** every activity has an opt-out; forced
  disclosure is never used. High-power-distance adaptation for the
  rehearsal is scripted, not improvised.

## The facilitator edition

Generated at `/facilitator/` by `python3 tools/build-facilitator.py` from
`facilitator/notes.json` — ATD-scripted rails (Say / Do / Ask with expected
answers / Debrief / Transition), a briefing slide (prep, materials, room
and wall setup, contingencies, tough questions, three copy-paste
templates), Full 120 / Core 90 timing. Its QR encodes the learner URL.

## Editing map

- Copy: `index.html` · Recap: `QUESTIONS` in `assets/js/main.js`
- Trainers: `makeTrainer` configs (myth, sticky-sort, expand/contract, SBI)
- Diagnostic: `PS_ITEMS`/`PS_BANDS` · Johari picker: `ADJ` in main.js
- Capstone maps: `ASK` / `NOTE` / `STAGE` in main.js
- Runbook: `facilitator/notes.json` (timing must sum Full 120 / Core 90)
- Publish: push to the repo default branch; `.github/workflows/deploy-pages.yml` republishes gh-pages
