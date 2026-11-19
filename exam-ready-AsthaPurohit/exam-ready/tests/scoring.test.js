// Run with: node tests/scoring.test.js
const assert = require("assert");
const { SKILLS, TOPICS, QUESTIONS } = require("../questions.js");
const { scoreCheck } = require("../scoring.js");

const rightIdx = q => q.options.findIndex(o => o.correct);
const wrongIdx = q => q.options.findIndex(o => !o.correct);
const answerAll = fn => Object.fromEntries(QUESTIONS.map(q => [q.id, fn(q)]));
const run = answers => scoreCheck(QUESTIONS, answers, SKILLS, TOPICS);

let passed = 0;
function test(name, fn) { fn(); passed++; console.log("✓", name); }

test("data: 15 questions, 5 per skill, exactly one correct option each", () => {
  assert.strictEqual(QUESTIONS.length, 15);
  for (const s of Object.keys(SKILLS)) assert.strictEqual(QUESTIONS.filter(q => q.skill === s).length, 5);
  for (const q of QUESTIONS) {
    assert.strictEqual(q.options.filter(o => o.correct).length, 1, q.id);
    for (const o of q.options) if (!o.correct) assert.ok(o.mistake, `${q.id} wrong option needs a mistake`);
    assert.ok(q.why && q.explain && TOPICS[q.topic], q.id);
  }
});

test("all right and sure → 100%, READY, no recommendations", () => {
  const r = run(answerAll(q => ({ choice: rightIdx(q), sure: true })));
  assert.strictEqual(r.overall, 100);
  assert.strictEqual(r.verdict, "READY");
  assert.strictEqual(r.recommendations.length, 0);
});

test("all right but all guessed → 70%, ALMOST (lucky guesses aren't readiness)", () => {
  const r = run(answerAll(q => ({ choice: rightIdx(q), sure: false })));
  assert.strictEqual(r.overall, 70);
  assert.strictEqual(r.verdict, "ALMOST");
  assert.strictEqual(r.recommendations.length, 3);
});

test("weakest-link rule: strong overall but grammar 40% → ALMOST, not READY", () => {
  const r = run(answerAll(q => {
    const wrong = q.skill === "grammar" && ["G3", "G4", "G5"].includes(q.id);
    return { choice: wrong ? wrongIdx(q) : rightIdx(q), sure: true };
  }));
  assert.strictEqual(r.skillScores.grammar, 40);
  assert.ok(r.overall >= 75, `overall ${r.overall}`);
  assert.strictEqual(r.verdict, "ALMOST");
  assert.deepStrictEqual(r.weakSkills, ["grammar"]);
});

test("all wrong → 0%, NOT_YET", () => {
  const r = run(answerAll(q => ({ choice: wrongIdx(q), sure: false })));
  assert.strictEqual(r.overall, 0);
  assert.strictEqual(r.verdict, "NOT_YET");
});

test("confident mistakes outrank guessed mistakes in recommendations", () => {
  const r = run(answerAll(q => {
    if (q.id === "G5") return { choice: wrongIdx(q), sure: true };   // separable, weight 1.0, need 3
    if (q.id === "V3") return { choice: wrongIdx(q), sure: false };  // days, weight 1.2, need 2
    return { choice: rightIdx(q), sure: true };
  }));
  assert.strictEqual(r.recommendations[0].topic, "separable");  // 3 × 1.0 = 3.0
  assert.strictEqual(r.recommendations[0].misconception, true);
  assert.strictEqual(r.recommendations[1].topic, "days");       // 2 × 1.2 = 2.4
});

test("on a tie, a misconception comes first", () => {
  const r = run(answerAll(q => {
    if (q.id === "G5") return { choice: wrongIdx(q), sure: true };   // 3 × 1.0 = 3.0, misconception
    if (q.id === "V1") return { choice: wrongIdx(q), sure: false };  // 2 × 1.5 = 3.0
    return { choice: rightIdx(q), sure: true };
  }));
  assert.strictEqual(r.recommendations[0].topic, "separable");
});

console.log(`\n${passed} tests passed`);
