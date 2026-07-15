/** Reserved login numbers for staff (not participants). */
export const STAFF_LOGIN_NUMBERS = {
  organizer: 25
};

export const RESERVED_LOGIN_NUMBERS = new Set([25]);

export const DEMO_TEAM_COUNT = 6;
export const MEMBERS_PER_TEAM = 3;
export const DEMO_PARTICIPANT_COUNT = DEMO_TEAM_COUNT * MEMBERS_PER_TEAM;

/** Participant login numbers (skips staff slot 25). */
export function participantLoginNumbers() {
  const nums = [];
  let n = 1;
  while (nums.length < DEMO_PARTICIPANT_COUNT) {
    if (!RESERVED_LOGIN_NUMBERS.has(n)) nums.push(n);
    n += 1;
  }
  return nums;
}

export function demoEmail(loginNumber) {
  return `login-${loginNumber}@faultline.demo`;
}

export function teamIndexForLogin(loginNumber) {
  const nums = participantLoginNumbers();
  const idx = nums.indexOf(loginNumber);
  if (idx === -1) return null;
  return Math.floor(idx / 3) + 1;
}

export function isStaffLogin(loginNumber) {
  const n = Number(loginNumber);
  return RESERVED_LOGIN_NUMBERS.has(n);
}

/** Team index 1-based → member login numbers. */
export function loginsForTeam(teamIndex) {
  const logins = participantLoginNumbers();
  const i = teamIndex - 1;
  if (i < 0 || i >= DEMO_TEAM_COUNT) return [];
  return logins.slice(i * MEMBERS_PER_TEAM, i * MEMBERS_PER_TEAM + MEMBERS_PER_TEAM);
}

export function teamRoster() {
  return Array.from({ length: DEMO_TEAM_COUNT }, (_, i) => ({
    team: i + 1,
    logins: loginsForTeam(i + 1)
  }));
}
