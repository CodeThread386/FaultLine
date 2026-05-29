export const PHASE_NAMES = new Set(["phase_1", "phase_2"]);
export const PHASE_ACTIONS = new Set(["start", "stop", "activate", "lock", "unlock"]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidPhase(name) {
  return PHASE_NAMES.has(name);
}

export function isValidUuid(value) {
  return typeof value === "string" && UUID_RE.test(value);
}

export function isValidGithubUrl(url) {
  return /^https:\/\/(www\.)?github\.com\/[^/\s]+\/[^/\s]+/i.test(url || "");
}

export function sanitizeText(value, maxLen = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export function parseJsonBody(req, maxBytes = 16_384) {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > maxBytes) throw new Error("Payload too large");
  return req.json();
}
