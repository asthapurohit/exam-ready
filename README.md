# Am I exam-ready?

**By Astha Purohit** · Globio Founder's Office – Product Manager Intern assignment

🔗 **Live app:** https://asthapurohit.github.io/exam-ready/

A 15-question check (about 8 minutes, drawn from a bank of 45) that tells an A1 German learner whether to book the Goethe or ÖSD exam now, broken down by skill, and the 2–3 things to practise first.

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

### A question bank, so retakes are real re-tests
The app tells learners who aren't ready to "practise 2–3 weeks, then retake the check". If a retake showed the same 15 questions, the second score would partly measure memory, not German, and could give a false "Ready". So each of the 15 slots has **3 versions** (45 questions in total). Each version tests the same topic in a different real situation, with the same rules: every wrong option is a real mistake, and every question has a reason for being in the check.

Each attempt picks one version per slot and **never repeats the version the learner saw last time**. This is remembered on their phone, so it works even weeks later. R1 and R2 share a reading text, so they're always picked together. Answer options are also shuffled on every attempt.

| Slot | Topic | Version a | Version b | Version c |
|---|---|---|---|---|
| V1 | Numbers & prices | 3,50 € at a bakery | "siebzehn Euro achtzig" at a supermarket | "vierundzwanzig" at a ticket machine (4-and-20) |
| V2 | Telling the time | Viertel nach acht (meeting) | halb zehn (doctor), the "half ten" trap | Viertel vor sieben (cinema) |
| V3 | Days & dates | Rent due "bis Mittwoch" | Class "am Donnerstag" | Flat free "ab dem ersten Juni" (Juni/Juli) |
| V4 | Family & people | Visa interview: father's mother | Visa form: "Ehemann" | Host's sister's son (Neffe) |
| V5 | Shops, places & signs | Headache: Apotheke vs Drogerie | Door sign "Ziehen" | Bottle label "Gift" (false friend) |
| G1 | Verb endings | Wir wohnen | Sie (she) lernt vs sie (they) lernen | Woher kommt ihr? |
| G2 | sein & haben | Du bist | Ich habe Kopfschmerzen | Meine Eltern sind |
| G3 | Accusative | einen Bruder | einen Kaffee | den Zug |
| G4 | Word order | Am Samstag gehe ich… | Heute habe ich… | Wo ist der Bahnhof? |
| G5 | Separable verbs | stehe … auf | kaufe … ein | rufe … an |
| R1–R2 | Messages, details | Tom can't come Saturday | Teacher: class moved to another room | Host mother at the supermarket |
| R3 | Signs & opening hours | Doctor's hours | Bakery on Sunday | Foreigners' office hours |
| R4 | Short ads | Room for rent | Babysitter job | Bike for sale |
| R5 | nicht … sondern | Train platform change | Bus route shortened | Exam moved to Tuesday |

## Code structure (no framework, no build step)
```
index.html            page shell
style.css             mobile-first styles (German-signage look)
fonts/                Barlow, self-hosted (SIL Open Font License)
questions.js          ALL content: 45-question bank, reasons, mistakes, topics, drills
picker.js             picks one version per slot for each attempt, avoiding the last one
scoring.js            ALL logic: scoreCheck() + RULES
app.js                the three screens: start → questions → results
tests/scoring.test.js run with: node tests/scoring.test.js
```
- **Change or add a question:** edit `questions.js` (give it a slot, a version letter and a set).
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
4. After about a minute, the app is live at `https://asthapurohit.github.io/exam-ready/`.
5. Replace the two placeholders: the live link at the top of this README, and the "View code" link (`id="code-link"`) in `index.html`.

## What I'd build next (V2)
- Validate the score: compare check results with learners' real exam results.
- Listening questions with short audio clips (most exam points come from Hören, Schreiben and Sprechen).
- Check that the three versions of each slot are equally hard (compare answer rates per version) and replace any that aren't.
- Ask Globio's ex-Goethe examiners which mistakes they see most, to weight topics with evidence instead of my estimates.
