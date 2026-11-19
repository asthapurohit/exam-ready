/*
 * app.js: screens and navigation. Content is in questions.js, logic in scoring.js.
 * Author: Astha Purohit
 */

const state = { index: 0, answers: {}, pendingChoice: null, picks: null };
let QUESTIONS = [];   // this attempt's 15 questions, picked from QUESTION_BANK

/* Remember which versions the learner saw, so a retake (even weeks later on the
   same phone) gets different questions. Storage can be blocked, so fail quietly. */
const LAST_KEY = "examReady.lastPicks";
function loadLastPicks() {
  try { return JSON.parse(localStorage.getItem(LAST_KEY)) || {}; } catch (e) { return {}; }
}
function saveLastPicks(picks) {
  try { localStorage.setItem(LAST_KEY, JSON.stringify(picks)); } catch (e) { /* ignore */ }
}

function startAttempt() {
  const { questions, picks } = pickQuestions(QUESTION_BANK, state.picks || loadLastPicks());
  QUESTIONS = questions;
  state.picks = picks;
  state.index = 0;
  state.answers = {};
  shuffleOptions();
}
const app = document.getElementById("app");
const KEYS = ["A", "B", "C", "D"];

const VERDICT_COPY = {
  READY:   { stamp: "READY",   title: "Ready to book",
             advice: "You're comfortably above the 60% pass mark in every skill we tested. Book your exam, and use the weeks before it for listening and speaking practice." },
  ALMOST:  { stamp: "DELAYED", title: "Almost there",
             advice: "Give it 2–3 more weeks. Practise the topics below, then retake this check before you pay for the exam." },
  NOT_YET: { stamp: "NOT YET", title: "Not yet",
             advice: "Booking now would put your exam fee at risk. Work on the topics below for 3–4 weeks, then retake this check." },
};

const STATUS_COPY = {
  misconception: "You were sure, but it was wrong. Fix this first.",
  gap: "You weren't sure and got it wrong.",
  lucky: "You got it right, but you were guessing.",
};

/* In questions.js the right answer is listed first, so shuffle the options
   on every attempt. Scoring reads o.correct, not the position. */
function shuffleOptions() {
  for (const q of QUESTIONS) {
    for (let i = q.options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
    }
  }
}

/* ---------- start screen ---------- */
function renderStart() {
  app.innerHTML = `
    <section class="sign" aria-label="Am I exam-ready?">
      <div class="sign-top"><span class="gleis">A1</span><span>Goethe-Zertifikat or ÖSD</span></div>
      <h1>Am I exam&#8209;ready?</h1>
    </section>

    <p class="lede">Finished A1 German? Check if you're ready before you pay for the exam, and find out what to practise first.</p>

    <ul class="board">
      <li><b>15 questions</b><span>Vocabulary, grammar, reading</span></li>
      <li><b>About 8 minutes</b><span>Works best on your phone</span></li>
      <li><b>Your result</b><span>Book now or wait, plus 3 things to practise</span></li>
    </ul>

    <div class="how">
      <h2>One thing before you start</h2>
      <p class="quiet">After each answer, say if you were <strong>sure</strong> or <strong>guessing</strong>. A lucky guess on exam day doesn't count for much, so being honest makes your result more accurate.</p>
    </div>

    <button class="btn btn-go" id="start">Start the check</button>
    <p class="fine">This check covers vocabulary, grammar and reading. It doesn't test listening or speaking yet.</p>
  `;
  document.getElementById("start").onclick = () => { startAttempt(); renderQuestion(); };
}

/* ---------- reading texts, drawn like the real thing ---------- */
function renderPassage(p) {
  if (p.kind === "chat") {
    const body = p.text.replace(/\s*((Liebe|Viele) Grüße|Bis später),\s*(\S+)$/, "<br>$1, $3");
    return `<div class="chat"><div class="bubble"><div class="who">${p.from}</div><p>${body}</p><div class="stamp">${p.time}</div></div></div>`;
  }
  if (p.kind === "sign") {
    const [name, ...rest] = p.text.split("\n");
    return `<div class="doorsign"><span class="name">${name}</span>${rest.join("\n")}</div>`;
  }
  if (p.kind === "ad") {
    const m = p.text.match(/^(.*?!)\s*(.*?)\s*Tel\.\s*(.*)$/);
    const tabs = Array(6).fill(`<span>${m[3]}</span>`).join("");
    return `<div class="ad"><div class="head">${m[1]}</div><div>${m[2]}</div><div class="tabs">${tabs}</div></div>`;
  }
  if (p.kind === "display") {
    const body = p.text.replace(/^Information:\s*/, "");
    return `<div class="display"><span class="info">Information</span><br>${body}</div>`;
  }
  return `<p>${p.text}</p>`;
}

/* ---------- question screen ---------- */
function renderQuestion() {
  const q = QUESTIONS[state.index];
  const prev = state.answers[q.id];
  state.pendingChoice = prev ? prev.choice : null;
  const passage = q.passage ? PASSAGES[q.passage] : null;
  const track = QUESTIONS.map((_, i) => `<i class="${i < state.index ? "done" : i === state.index ? "now" : ""}"></i>`).join("");

  app.innerHTML = `
    <div class="q-top"><strong>${SKILLS[q.skill].label}</strong><span>Question ${state.index + 1} of ${QUESTIONS.length}</span></div>
    <div class="track" aria-hidden="true">${track}</div>

    ${passage ? `<div class="artefact"><div class="artefact-cap">${passage.title}</div>${renderPassage(passage)}</div>` : ""}
    <p class="scenario">${q.scenario}</p>
    <h1 class="prompt">${q.prompt}</h1>

    <div class="options" role="radiogroup" aria-label="Answers">
      ${q.options.map((o, i) => `
        <button class="option ${state.pendingChoice === i ? "selected" : ""}" data-i="${i}" role="radio" aria-checked="${state.pendingChoice === i}">
          <span class="key">${KEYS[i]}</span><span>${o.text}</span>
        </button>`).join("")}
    </div>

    <div id="conf-slot">${state.pendingChoice === null ? "" : confidenceHtml()}</div>

    <button class="btn-link" id="back" ${state.index === 0 ? "disabled" : ""}>Previous question</button>
  `;

  app.querySelectorAll(".option").forEach(btn => {
    btn.onclick = () => {
      state.pendingChoice = Number(btn.dataset.i);
      app.querySelectorAll(".option").forEach(b => {
        const on = b === btn;
        b.classList.toggle("selected", on);
        b.setAttribute("aria-checked", on);
      });
      const slot = document.getElementById("conf-slot");
      if (!slot.innerHTML) { slot.innerHTML = confidenceHtml(); bindConfidence(q); }
      slot.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  });
  bindConfidence(q);

  document.getElementById("back").onclick = () => {
    if (state.index > 0) { state.index--; renderQuestion(); }
  };
}

function confidenceHtml() {
  return `
    <div class="confidence">
      <p>How sure are you?</p>
      <div class="conf-btns">
        <button class="btn btn-go" data-sure="1">I'm sure</button>
        <button class="btn guess" data-sure="0">I'm guessing</button>
      </div>
    </div>`;
}

function bindConfidence(q) {
  app.querySelectorAll("[data-sure]").forEach(btn => {
    btn.onclick = () => {
      state.answers[q.id] = { choice: state.pendingChoice, sure: btn.dataset.sure === "1" };
      if (state.index < QUESTIONS.length - 1) { state.index++; renderQuestion(); }
      else renderResults();
      window.scrollTo(0, 0);
    };
  });
}

/* ---------- results screen ---------- */
function meterColor(score) {
  if (score >= RULES.readyOverall) return "var(--go)";
  if (score >= RULES.readySkillMin) return "var(--delay)";
  return "var(--stop)";
}

function renderResults() {
  const r = scoreCheck(QUESTIONS, state.answers, SKILLS, TOPICS);
  saveLastPicks(state.picks);
  const num = id => QUESTIONS.findIndex(q => q.id === id) + 1;
  const copy = VERDICT_COPY[r.verdict];
  const weakList = r.weakSkills.map(s => SKILLS[s].label).join(" and ");
  const weakNote = r.verdict !== "READY" && r.weakSkills.length
    ? `<p class="weak">${r.overall >= RULES.readyOverall ? "Your overall score is strong, but " : ""}${weakList} ${r.weakSkills.length > 1 ? "are" : "is"} below 60%. One weak section is a real risk on exam day.</p>`
    : "";

  const skillsHtml = Object.keys(SKILLS).map(s => {
    const v = r.skillScores[s];
    return `
      <div class="skill-row">
        <span>${SKILLS[s].label}</span>
        <div class="meter" role="img" aria-label="${SKILLS[s].label} ${v}%">
          <div class="fill" style="width:${v}%;background:${meterColor(v)}"></div>
          <div class="tick" style="left:${RULES.readySkillMin}%"></div>
          <div class="tick" style="left:${RULES.readyOverall}%"></div>
        </div>
        <span class="pct">${v}%</span>
      </div>`;
  }).join("");

  const recsHtml = r.recommendations.length
    ? `<ol class="recs">${r.recommendations.map(rec => {
        const t = TOPICS[rec.topic];
        const status = rec.misconception ? "misconception" : r.review.find(x => x.id === rec.questions[0]).status;
        return `
          <li>
            <h3>${t.label}${rec.misconception ? '<span class="tag-misc">Misconception</span>' : ""}</h3>
            <div class="reason">${STATUS_COPY[status]} Question ${rec.questions.map(num).join(", ")}.</div>
            <div class="drill"><strong>10-minute drill:</strong> ${t.drill}</div>
          </li>`;
      }).join("")}</ol>`
    : `<ol class="recs"><li><h3>Do one full model test</h3>
         <div class="reason">Nothing to fix in this check. Before you book, test the parts we don't cover.</div>
         <div class="drill">Take a full Goethe A1 model test (Modellsatz) with the audio, under timed conditions, to check your listening, writing and speaking.</div></li></ol>`;

  const reviewHtml = QUESTIONS.map(q => {
    const rv = r.review.find(x => x.id === q.id);
    const right = q.options.find(o => o.correct);
    const mark = rv.status === "solid" ? '<span class="ok">Correct</span>'
               : rv.status === "lucky" ? '<span class="meh">Correct, guessed</span>'
               : '<span class="bad">Wrong</span>';
    return `
      <div class="review-item">
        <div class="ri-head">${num(q.id)}. ${q.prompt} ${mark}</div>
        ${rv.correct ? "" : `<div>You chose <em>${rv.chosen ? rv.chosen.text : "nothing"}</em>. ${rv.chosen && rv.chosen.mistake ? rv.chosen.mistake : ""}</div>`}
        <div>Answer: <strong>${right.text.replace(/\.$/, "")}</strong>. ${q.explain}</div>
        <div class="ri-why">Why this question: ${q.why}</div>
      </div>`;
  }).join("");

  app.innerHTML = `
    <article class="pass ${r.verdict}">
      <div class="pass-band"><b>Exam-readiness pass</b><span>Goethe / ÖSD A1</span></div>
      <div class="stamp" aria-hidden="true">${copy.stamp}</div>
      <div class="pass-main">
        <div class="status-label">Your status</div>
        <h1>${copy.title}</h1>
        ${weakNote}
        <p class="advice">${copy.advice}</p>
      </div>
      <div class="perf" aria-hidden="true"></div>
      <div class="pass-stub">
        <div class="overall"><b>${r.overall}%</b><span>overall</span></div>
        <div class="skills">${skillsHtml}</div>
      </div>
      <div class="pass-foot">The exam pass mark is 60%. You're "ready" at 75% or more, with no skill under 60% (the two lines on each bar).</div>
    </article>

    <h2 class="section-title">${r.recommendations.length ? "Practise these before you book" : "What to do next"}</h2>
    ${recsHtml}

    <div class="notice"><strong>Not tested here:</strong> listening (Hören), writing (Schreiben) and speaking (Sprechen). They're three of the four exam parts, so practise them too.</div>

    <details>
      <summary>How is "ready" calculated?</summary>
      <ul>
        <li>Right and sure = 1 point. Right but guessing = 0.7, because a lucky guess isn't real knowledge. Wrong = 0.</li>
        <li>Each skill is scored out of 100%. Overall is the average of the three skills.</li>
        <li><strong>Ready</strong> = overall 75%+ and every skill 60%+. The real pass mark is 60%, but this is a short check and exam day adds nerves, so there's a safety margin.</li>
        <li><strong>Almost there</strong> = overall 60%+. <strong>Not yet</strong> = under 60%.</li>
        <li>Practice topics are ranked with confident mistakes first, then wrong guesses, then lucky guesses, weighted by how often the topic appears in the exam.</li>
      </ul>
    </details>
    <details>
      <summary>Review all 15 answers</summary>
      ${reviewHtml}
    </details>

    <button class="btn btn-plate" id="retake">Retake the check</button>
  `;
  document.getElementById("retake").onclick = () => {
    renderStart(); window.scrollTo(0, 0);
  };
}

renderStart();
