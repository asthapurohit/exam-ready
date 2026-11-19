/*
 * picker.js: builds one attempt from the question bank.
 * Author: Astha Purohit
 *
 * Rule: pick one version (a, b or c) for every set of questions, and avoid the
 * version the learner saw last time. So a retake 2–3 weeks later is a real
 * re-test, not a memory test. Questions are then put in slot order
 * (V1…V5, G1…G5, R1…R5).
 */

const SLOT_ORDER = ["V1", "V2", "V3", "V4", "V5", "G1", "G2", "G3", "G4", "G5", "R1", "R2", "R3", "R4", "R5"];

/**
 * bank:   QUESTION_BANK
 * last:   { [set]: variant } from the previous attempt (or {})
 * random: a function returning 0..1 (Math.random by default; tests pass their own)
 * returns { questions, picks }
 */
function pickQuestions(bank, last = {}, random = Math.random) {
  const variantsBySet = {};
  for (const q of bank) {
    variantsBySet[q.set] = variantsBySet[q.set] || new Set();
    variantsBySet[q.set].add(q.variant);
  }

  const picks = {};
  for (const [set, variants] of Object.entries(variantsBySet)) {
    const all = [...variants].sort();
    const fresh = all.filter(v => v !== last[set]);
    const pool = fresh.length ? fresh : all;
    picks[set] = pool[Math.floor(random() * pool.length)];
  }

  const questions = SLOT_ORDER.map(slot => {
    const q = bank.find(x => x.slot === slot && x.variant === picks[x.set]);
    // deep-copy the options so shuffling them never changes the bank
    return { ...q, options: q.options.map(o => ({ ...o })) };
  });

  return { questions, picks };
}

if (typeof module !== "undefined") module.exports = { SLOT_ORDER, pickQuestions };
