# Facilitation Guide — Building Brave Teams

Every activity carries a learner-visible **"Why this matters"** line, and
every teaching section has (1) an **interactive tool or practice moment**,
(2) a **labeled, timed activity** — *As a group* or *Flying solo* — and
(3) a **validation point**. Every 20–25 minute block completes a full Kolb
cycle; nobody receives content for more than ~8 minutes before applying,
reflecting, or dialoguing.

The full runbook lives in [`facilitator/notes.json`](facilitator/notes.json)
on the **ATD facilitator-guide framework**: per section a verbatim **Say**
script, **Do** choreography, an **Ask** with anticipated responses, a
**Debrief** line, and a scripted **Transition**, plus front matter
(materials, prep checklists, contingencies, tough questions, and copy-paste
templates: pre-work invite, 14-day pulse, 30-day manager retro).

**Pre-work (5–7 days prior, ~20 min):** the 2-page Edmondson excerpt, the
7-item baseline self-score, the 5–6 adjective pre-select from the standard
Johari list, and the one-sentence intention question (clustered and posted
anonymously on Wall D).

The **facilitator edition is live at `/facilitator/`** — regenerate after
any change to `index.html` or `notes.json`:

```bash
python3 tools/build-facilitator.py
```

## Run of show — two paths

| Slide | Full (120 min) | Core (90 min) |
|---|---|---|
| Arrival & Inclusion ritual / QR | 6 | 5 |
| Hook + objectives | 2 | 1 |
| The Chancellor's charge (alignment builder) | 4 | 2 |
| Our why (Golden Circle ring builder) | 4 | 2 |
| Agenda | 1 | — |
| 01 What safety is (and isn't) | 8 | 6 |
| Manifesto | 1 | — |
| 02 Where your team stands | 8 | 6 |
| 03 The evidence | 10 | 6 |
| 04 The Johari Window | 28 | 24 |
| 05 Expand or contract | 17 | 12 |
| 06 The candor rehearsal | 17 | 14 |
| Recap quiz | 4 | 4 |
| Commitment card (capstone) | 7 | 6 |
| Glossary | 1 | — |
| Resources (signpost in close) | — | — |
| Closing ritual | 2 | 2 |
| **Total** | **120** | **90** |

**Core-path rules:** the diagnostic, the full Johari cycle, the
Expand/Contract grid, the triad rehearsal, the recap, and the commitment
card all stay. Skip the agenda walk, manifesto pause, glossary, and the
in-class video (assign as the week's watch); debriefs shrink to one voice
each; the gallery walk becomes a stand-and-scan. Per-section cuts live in
each `coreNote`. **Never cut the Johari block or the rehearsal** — they
carry the affective objectives.

**Timing discipline:** the case-teach and the expand/contract synthesis are
the stretchy blocks. Protect the last 15 minutes (recap, commitment card,
closing circle) by trimming debriefs first — never Johari, never the
rehearsal, never the ritual.

**Affective arc:** the Johari block is the emotional peak; Sections 05–06
are deliberately more cognitive to allow recovery before the re-emotional
close. Every activity contains an opt-out ("answer one prompt, your
choice"; "share only if you choose") — forced disclosure destroys the very
thing being taught. In high-power-distance cultures, run the Candor
Rehearsal peer-to-peer only; adapt it, never delete it.

## Validation model

- **In the moment:** the 7-item diagnostic with lowest-item table debrief
  (02), trainer scores (01, 04, 05, 06), the Johari sheet with all four
  quadrants populated (04), the team-built Expand/Contract grids
  peer-checked by gallery walk (05), and observer checks in the triad
  rehearsal (06).
- **End of session:** the 6-question recap maps 1:1 to the six objectives
  (Kirkpatrick Level 2); the fist-to-five and the equipped-rating exit
  ticket are Level 1; the commitment card — photographed, posted, and
  witnessed — is the transfer artifact.
- **After (Level 3):** day-14 pulse (question asked? note sent? 7 items
  re-taken), day-30 manager-led retro on the team's own grid, day-60
  Edmondson re-pulse.
- **Results (Level 4, 90 days):** candor in retros, near-miss reporting,
  meeting talk-time balance — tracked with the program sponsor.

## Frameworks cited

Edmondson (1999; *The Fearless Organization*) · Clark, *The 4 Stages of
Psychological Safety* · Luft & Ingham, the Johari Window (1955) · Google
Project Aristotle (re:Work) · Kolb's Experiential Learning Cycle ·
Tuckman's stages · Revised Bloom's (Anderson & Krathwohl) for objective
verbs · Kirkpatrick's four levels · CCL's SBI (adapted as SBI + Ask).
