/** Each phase: 2 in-person visits + 1 final pitch (3 scores per phase) */

export const JUDGE_ROUNDS = [
  { value: "visit_1", label: "In-person visit 1" },
  { value: "visit_2", label: "In-person visit 2" },
  { value: "final_pitch", label: "Final pitch" }
];

const LEGACY_ROUND_MAP = {
  mid_build: "visit_1",
  pre_final: "visit_2",
  finals: "final_pitch",
  visit_1: "visit_1",
  visit_2: "visit_2",
  final_pitch: "final_pitch"
};

export function normalizeJudgeRound(round) {
  return LEGACY_ROUND_MAP[round] || "visit_1";
}

const VISIT_P1 = [
  { key: "functional", label: "Meets track functional spec", hint: "Core flow runs without crashing", max: 10 },
  { key: "creative_chaos", label: "Creative chaos", hint: "Intentionally broken, unmaintainable, entertaining", max: 10 },
  { key: "architecture", label: "Cursed architecture", hint: "Bad structure, spaghetti logic, painful UX", max: 10 },
  { key: "progress", label: "Build progress", hint: "How far along at this point in the phase", max: 10 }
];

const VISIT_P2 = [
  { key: "diagnosis", label: "Diagnosis quality", hint: "Understanding inherited codebase & brief", max: 10 },
  { key: "progress", label: "Rebuild progress", hint: "Ground-up rebuild, not patching", max: 10 },
  { key: "architecture", label: "Architecture decisions", hint: "Sound structure and modularity", max: 10 },
  { key: "execution", label: "Clean execution", hint: "UX, code quality, meets track spec", max: 10 }
];

const PITCH_P1 = [
  { key: "pitch", label: "Fake product pitch", hint: "Sells the disaster like a real startup", max: 10 },
  { key: "entertainment", label: "Entertainment value", hint: "Crowd engagement", max: 10 },
  { key: "disaster_demo", label: "Disaster demonstration", hint: "Shows intentional chaos clearly", max: 10 },
  { key: "overall", label: "Overall impression", hint: "Holistic Phase 1 pitch score", max: 10 }
];

const PITCH_P2 = [
  { key: "diagnosis", label: "Diagnosis quality", hint: "What was wrong and why", max: 10 },
  { key: "architecture", label: "Architecture decisions", hint: "Engineering choices in rebuild", max: 10 },
  { key: "contrast", label: "Before / after contrast", hint: "Transformation from disaster to clean", max: 10 },
  { key: "presentation", label: "Presentation clarity", hint: "Full arc communicated clearly", max: 10 }
];

const RUBRICS = {
  "phase_1:visit_1": VISIT_P1,
  "phase_1:visit_2": VISIT_P1,
  "phase_1:final_pitch": PITCH_P1,
  "phase_2:visit_1": VISIT_P2,
  "phase_2:visit_2": VISIT_P2,
  "phase_2:final_pitch": PITCH_P2
};

export function getRubric(phaseName, round) {
  const normalized = normalizeJudgeRound(round);
  return RUBRICS[`${phaseName}:${normalized}`] || [];
}

export function computeTotalScore(scores, rubric) {
  if (!rubric.length) return 0;
  let sum = 0;
  let count = 0;
  for (const field of rubric) {
    const v = Number(scores?.[field.key]);
    if (!Number.isFinite(v)) continue;
    sum += Math.min(field.max, Math.max(0, v));
    count += 1;
  }
  if (!count) return 0;
  return Math.round((sum / count) * 10);
}

export function validateScores(scores, rubric) {
  if (!rubric.length) return { ok: false, error: "Invalid rubric" };
  const normalized = {};
  for (const field of rubric) {
    const v = scores?.[field.key];
    if (v === undefined || v === null || v === "") {
      return { ok: false, error: `Enter ${field.label}` };
    }
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n > field.max) {
      return { ok: false, error: `${field.label} must be 0–${field.max}` };
    }
    normalized[field.key] = n;
  }
  return { ok: true, scores: normalized, total: computeTotalScore(normalized, rubric) };
}
