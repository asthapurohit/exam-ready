/*
 * scoring.js: how "ready" is calculated.
 * Author: Astha Purohit
 *
 * The rules (all thresholds live in RULES so they're easy to change):
 *  1. Points per question: right + sure = 1, right + guessing = 0.7, wrong = 0.
 *     A lucky guess isn't real knowledge, so it doesn't earn full marks.
 *  2. Skill score = points / questions in that skill × 100.
 *     Overall = average of the 3 skills, weighted equally like the exam's parts.
 *  3. Verdict:
 *       READY       overall ≥ 75 AND every skill ≥ 60
 *       ALMOST      overall ≥ 60 (or ready overall but one weak skill)
 *       NOT_YET     overall < 60
 *     Why 75 and not 60? The real Goethe A1 pass mark is 60/100, but this is a
 *     short check (one question = 20% of a skill) and exam day adds nerves.
 *     A false "you're ready" costs the learner the exam fee, so we stay cautious.
 *  4. What to practise: each answer adds "need" to its topic:
 *       wrong + sure     = 3  (a misconception, the most dangerous case)
 *       wrong + guessing = 2  (a known gap)
 *       right + guessing = 1  (shaky)
 *     need × topic weight (how often it's in the exam) → top 3 topics.
 */

const RULES = {
  points: { rightSure: 1, rightGuess: 0.7, wrong: 0 },
  readyOverall: 75,
  readySkillMin: 60,
  almostOverall: 60,
  need: { wrongSure: 3, wrongGuess: 2, rightGuess: 1 },
  maxRecommendations: 3,
};

/**
 * answers: { [questionId]: { choice: number, sure: boolean } }
 * returns a result object used by the results screen.
 */
function scoreCheck(questions, answers, skills, topics, rules = RULES) {
  const skillPoints = {}, skillCount = {};
  const topicNeed = {};
  const review = [];

  for (const q of questions) {
    const a = answers[q.id];
    const opt = a ? q.options[a.choice] : null;
    const correct = !!(opt && opt.correct);
    const sure = !!(a && a.sure);

    let pts = rules.points.wrong;
    if (correct) pts = sure ? rules.points.rightSure : rules.points.rightGuess;

    skillPoints[q.skill] = (skillPoints[q.skill] || 0) + pts;
    skillCount[q.skill] = (skillCount[q.skill] || 0) + 1;

    let need = 0, status;
    if (correct && sure)       { status = "solid"; }
    else if (correct)          { status = "lucky";         need = rules.need.rightGuess; }
    else if (sure)             { status = "misconception"; need = rules.need.wrongSure; }
    else                       { status = "gap";           need = rules.need.wrongGuess; }

    if (need > 0) {
      const t = topicNeed[q.topic] || { need: 0, misconception: false, questions: [] };
      t.need += need;
      t.misconception = t.misconception || status === "misconception";
      t.questions.push(q.id);
      topicNeed[q.topic] = t;
    }

    review.push({ id: q.id, correct, sure, status, chosen: opt, points: pts });
  }

  const skillScores = {};
  for (const s of Object.keys(skills)) {
    skillScores[s] = skillCount[s] ? Math.round((skillPoints[s] / skillCount[s]) * 100) : 0;
  }
  const vals = Object.values(skillScores);
  const overall = Math.round(vals.reduce((x, y) => x + y, 0) / vals.length);

  const weakSkills = Object.keys(skillScores).filter(s => skillScores[s] < rules.readySkillMin);

  let verdict;
  if (overall >= rules.readyOverall && weakSkills.length === 0) verdict = "READY";
  else if (overall >= rules.almostOverall) verdict = "ALMOST";
  else verdict = "NOT_YET";

  const recommendations = Object.entries(topicNeed)
    .map(([topic, t]) => ({
      topic, ...t,
      priority: t.need * (topics[topic] ? topics[topic].weight : 1),
    }))
    .sort((a, b) => b.priority - a.priority || (b.misconception - a.misconception))
    .slice(0, rules.maxRecommendations);

  return { overall, skillScores, weakSkills, verdict, recommendations, review };
}

if (typeof module !== "undefined") module.exports = { RULES, scoreCheck };
