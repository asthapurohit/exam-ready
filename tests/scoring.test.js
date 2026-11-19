// Run with: node tests/scoring.test.js
const assert = require("assert");
const { SKILLS, TOPICS, PASSAGES, QUESTION_BANK } = require("../questions.js");
const { SLOT_ORDER, pickQuestions } = require("../picker.js");
const { RULES, scoreCheck } = require("../scoring.js");
// Expectations are worked out from RULES, so changing a rule never breaks these tests.
const pct = x => Math.round(x * 100);

// a fixed attempt (all version a) for the scoring tests
const QUESTIONS = pickQuestions(QUESTION_BANK, {}, () => 0).questions;

const rightIdx = q => q.options.findIndex(o => o.correct);
const wrongIdx = q => q.options.findIndex(o => !o.correct);
const answerAll = fn => Object.fromEntries(QUESTIONS.map(q => [q.id, fn(q)]));
const run = answers => scoreCheck(QUESTIONS, answers, SKILLS, TOPICS);

let passed = 0;
function test(name, fn) { fn(); passed++; console.log("✓", name); }

// ---------- question bank ----------
test("bank: every slot has at least 3 versions, and ids are unique", () => {
  for (const slot of SLOT_ORDER) {
    const vs = QUESTION_BANK.filter(q => q.slot === slot).map(q => q.variant);
    assert.ok(vs.length >= 3, `${slot} has only ${vs.length} versions`);
    assert.strictEqual(new Set(vs).size, vs.length, `${slot} has a repeated version letter`);
  }
  assert.strictEqual(new Set(QUESTION_BANK.map(q => q.id)).size, QUESTION_BANK.length, "ids are unique");
  for (const q of QUESTION_BANK) assert.ok(SLOT_ORDER.includes(q.slot), `${q.id} has an unknown slot`);
});

test("bank: every version of a slot tests the same skill and topic", () => {
  for (const slot of SLOT_ORDER) {
    const qs = QUESTION_BANK.filter(q => q.slot === slot);
    assert.strictEqual(new Set(qs.map(q => q.skill)).size, 1, slot);
    assert.strictEqual(new Set(qs.map(q => q.topic)).size, 1, slot);
  }
});

test("bank: every question has a scenario, a why, an explanation, 4 options, 1 correct, a mistake per wrong option", () => {
  for (const q of QUESTION_BANK) {
    assert.ok(q.scenario && q.prompt && q.why && q.explain, q.id);
    assert.ok(TOPICS[q.topic] && SKILLS[q.skill], q.id);
    assert.strictEqual(q.options.length, 4, q.id);
    assert.strictEqual(q.options.filter(o => o.correct).length, 1, q.id);
    for (const o of q.options) if (!o.correct) assert.ok(o.mistake, `${q.id}: "${o.text}" needs a mistake`);
    assert.strictEqual(new Set(q.options.map(o => o.text)).size, 4, `${q.id} has duplicate options`);
    if (q.skill === "reading") assert.ok(PASSAGES[q.passage], `${q.id} passage`);
  }
});

test("bank: questions that share a set have the same versions (so they can be picked together)", () => {
  const sets = {};
  for (const q of QUESTION_BANK) ((sets[q.set] ||= {})[q.slot] ||= []).push(q.variant);
  for (const [set, slots] of Object.entries(sets)) {
    const lists = Object.values(slots).map(v => v.sort().join(","));
    assert.strictEqual(new Set(lists).size, 1, `set ${set}: slots have different versions`);
  }
  for (const v of ["a", "b", "c"]) {
    const r1 = QUESTION_BANK.find(q => q.slot === "R1" && q.variant === v);
    const r2 = QUESTION_BANK.find(q => q.slot === "R2" && q.variant === v);
    assert.strictEqual(r1.passage, r2.passage, `R1/R2 version ${v} must share a text`);
  }
});

// ---------- picker ----------
test("picker: an attempt has one question per slot, in slot order, covering every skill", () => {
  const { questions } = pickQuestions(QUESTION_BANK);
  assert.deepStrictEqual(questions.map(q => q.slot), SLOT_ORDER);
  for (const s of Object.keys(SKILLS)) assert.ok(questions.some(q => q.skill === s), s);
});

test("picker: a retake never repeats a version from the last attempt", () => {
  let last = {};
  for (let i = 0; i < 200; i++) {
    const { questions, picks } = pickQuestions(QUESTION_BANK, last);
    for (const q of questions) assert.notStrictEqual(q.variant, last[q.set], `${q.slot} repeated`);
    last = picks;
  }
});

test("picker: R1 and R2 always come from the same message", () => {
  for (let i = 0; i < 50; i++) {
    const { questions } = pickQuestions(QUESTION_BANK);
    const [r1, r2] = ["R1", "R2"].map(s => questions.find(q => q.slot === s));
    assert.strictEqual(r1.passage, r2.passage);
  }
});

test("picker: shuffling an attempt's options never changes the bank", () => {
  const before = JSON.stringify(QUESTION_BANK);
  const { questions } = pickQuestions(QUESTION_BANK);
  for (const q of questions) q.options.reverse();
  assert.strictEqual(JSON.stringify(QUESTION_BANK), before);
});

// ---------- scoring ----------
test("all right and sure → 100%, READY, no recommendations", () => {
  const r = run(answerAll(q => ({ choice: rightIdx(q), sure: true })));
  assert.strictEqual(r.overall, 100);
  assert.strictEqual(r.verdict, "READY");
  assert.strictEqual(r.recommendations.length, 0);
});

test("all right but all guessed → score = guess credit, and never READY (lucky guesses aren't readiness)", () => {
  const r = run(answerAll(q => ({ choice: rightIdx(q), sure: false })));
  assert.strictEqual(r.overall, pct(RULES.points.rightGuess));
  assert.notStrictEqual(r.verdict, "READY");
  assert.strictEqual(r.recommendations.length, RULES.maxRecommendations);
});

test("weakest-link rule: strong overall but grammar 40% → not READY", () => {
  const r = run(answerAll(q => {
    const wrong = ["G3", "G4", "G5"].includes(q.slot);
    return { choice: wrong ? wrongIdx(q) : rightIdx(q), sure: true };
  }));
  assert.strictEqual(r.skillScores.grammar, 40);
  assert.notStrictEqual(r.verdict, "READY");
  if (RULES.readySkillMin > 40) assert.deepStrictEqual(r.weakSkills, ["grammar"]);
});

test("all wrong → 0%, NOT_YET", () => {
  const r = run(answerAll(q => ({ choice: wrongIdx(q), sure: false })));
  assert.strictEqual(r.overall, 0);
  assert.strictEqual(r.verdict, "NOT_YET");
});

test("confident mistakes outrank guessed mistakes in recommendations", () => {
  const r = run(answerAll(q => {
    if (q.slot === "G5") return { choice: wrongIdx(q), sure: true };   // separable: 3 × 1.0 = 3.0
    if (q.slot === "V3") return { choice: wrongIdx(q), sure: false };  // days: 2 × 1.2 = 2.4
    return { choice: rightIdx(q), sure: true };
  }));
  assert.strictEqual(r.recommendations[0].topic, "separable");
  assert.strictEqual(r.recommendations[0].misconception, true);
  if (RULES.maxRecommendations >= 2) assert.strictEqual(r.recommendations[1].topic, "days");
});

test("on a tie, a misconception comes first", () => {
  const r = run(answerAll(q => {
    if (q.slot === "G5") return { choice: wrongIdx(q), sure: true };   // 3 × 1.0 = 3.0, misconception
    if (q.slot === "V1") return { choice: wrongIdx(q), sure: false };  // 2 × 1.5 = 3.0
    return { choice: rightIdx(q), sure: true };
  }));
  assert.strictEqual(r.recommendations[0].topic, "separable");
});

console.log(`\n${passed} tests passed`);
