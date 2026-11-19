# Am I exam-ready?

**By Astha Purohit** · Globio Founder's Office – Product Manager Intern assignment

🔗 **Live app:** https://YOUR-GITHUB-USERNAME.github.io/exam-ready/

A 15-question check (about 8 minutes) that tells an A1 German learner whether to book the Goethe or ÖSD exam now, broken down by skill, and the 2–3 things to practise first.

## The problem
Many learners finish A1 and book the exam without knowing if they're ready. Some fail and lose both the exam fee and time on their journey abroad. A false "you're ready" costs a learner far more than a false "not yet", so the app is deliberately cautious.

## How "ready" is defined
| Rule | Why |
|---|---|
| Right + **sure** = 1 point, right + **guessing** = 0.7, wrong = 0 | A lucky guess isn't real knowledge. Someone who guesses everything correctly scores 70%, which is "almost", not "ready". |
| Skill score = points ÷ 5. Overall = average of 3 skills | Mirrors the exam, where every part counts. |
| **Ready** = overall ≥ 75% **and** every skill ≥ 60% | The Goethe A1 pass mark is 60/100. A 15-question check is noisy (1 question = 20% of a skill) and exam day adds nerves, so there's a safety margin. |
| **Weakest-link rule** | A strong average can hide one weak section, and that's a real risk on exam day. |
| **Almost there** = ≥ 60%, **Not yet** = < 60% | Clear next step for each: retake in 2–3 weeks, or 3–4 weeks. |
| Practice list = top 3 topics by *need × exam weight* | Confident mistakes (misconceptions) = 3, wrong guesses = 2, lucky guesses = 1. Each topic is weighted by how often it appears in the exam. |

All thresholds are in one place: `RULES` in `scoring.js`.

## How the questions were chosen
1. **Real situations, exam formats.** Every question is something a learner will actually meet: paying at a bakery, a landlord's message, a visa interview, a doctor's door sign, a station notice. The reading texts copy the exam's formats (short message, ad, sign).
2. **One question = one sub-topic**, so a wrong answer points to something specific to practise.
3. **They target the classic A1 point-losers:** -zehn vs -zig numbers, Viertel nach/vor, Mittwoch vs Montag, the Drogerie/Apotheke false friend, verb endings, sein, accusative *einen*, verb-second word order, separable verbs, details in texts, abbreviations on signs, "nicht … sondern" traps.
4. **Every wrong option is a real mistake.** Each wrong option has a `mistake` explaining what it reveals, so the results can say *why* you lost the point.
5. **Honest about scope.** The check covers vocabulary, grammar and reading only. The app says so, and recommends a full model test for listening and speaking.

| ID | Situation | Topic | Why it's in the check |
|---|---|---|---|
| V1 | Paying 3,50 € at a bakery | Numbers & prices | Numbers are in almost every A1 task. -zehn/-zig is the top number mistake. |
| V2 | "Viertel nach acht" meeting | Telling the time | Time phrases don't translate 1:1 from English. |
| V3 | Pay the rent by Mittwoch | Days & dates | Deadlines and appointments are the key detail in many tasks. |
| V4 | Visa interview family photo | Family & people | A core A1 topic and real life for visa applicants. |
| V5 | Headache on a Sunday | Shops & places | Drogerie vs Apotheke is a classic false friend. |
| G1 | "Wir ___ in Pune" | Verb endings | Self-introduction opens the speaking exam. |
| G2 | Thank-you note: "Du ___ nett" | sein & haben | The most-used irregular verb. |
| G3 | "Ich habe ___ Bruder" | Accusative | The first grammar topic that really trips up A1 learners. |
| G4 | Weekend plans text | Word order | The most visible error in writing and speaking. |
| G5 | "Wann stehen Sie auf?" | Separable verbs | Daily-routine verbs are mostly separable. |
| R1–R2 | Tom's WhatsApp message | Messages, details | Reading Part 1 style. The options differ in one detail. |
| R3 | Doctor's opening hours | Signs | Abbreviations (Di, Do) and times. |
| R4 | Room ad | Short ads | Price per month, m², adjectives. |
| R5 | Station notice | nicht … sondern | The first number you see is the wrong answer. |

## Code structure (no framework, no build step)
```
index.html            page shell
style.css             mobile-first styles (German-signage look)
fonts/                Barlow, self-hosted (SIL Open Font License)
questions.js          ALL content: questions, reasons, mistakes, topics, drills
scoring.js            ALL logic: scoreCheck() + RULES
app.js                the three screens: start → questions → results
tests/scoring.test.js run with: node tests/scoring.test.js
```
- **Change a question:** edit `questions.js`.
- **Change what "ready" means:** edit `RULES` in `scoring.js`.
- **Change a screen:** edit `app.js`.

## Design
The look comes from the learner's world: German station signs and the trip abroad. It uses DIN-style type (Barlow), platform blue and signal yellow. Reading texts are drawn like the real thing (a WhatsApp chat, a doctor's door sign, a notice-board ad, a station display), so the check feels like the situations learners will actually face. The result is an "exam-readiness pass", stamped READY, DELAYED or NOT YET. Answer options are shuffled on every attempt.

## Run locally
Open `index.html` in a browser. That's it. Tests: `node tests/scoring.test.js`.

## Deploy (GitHub Pages)
1. Create a **public** repo on GitHub called `exam-ready`.
2. Upload all files (keep the `tests` folder).
3. Go to **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. After about a minute, the app is live at `https://YOUR-GITHUB-USERNAME.github.io/exam-ready/`.
5. Replace the two placeholders: the live link at the top of this README, and the "View code" link (`id="code-link"`) in `index.html`.

## What I'd build next (V2)
- Validate the score: compare check results with learners' real exam results.
- Listening questions with short audio clips (most exam points come from Hören, Schreiben and Sprechen).
- A larger question bank, so retakes aren't memorised.
- Ask Globio's ex-Goethe examiners which mistakes they see most, to weight topics with evidence instead of my estimates.
