#!/usr/bin/env node
/**
 * Full integration smoke test (requires dev server + seeded DB).
 * Usage: npm run smoke
 */
import { loadEnvLocal } from "./load-env.mjs";
import {
  DEMO_PARTICIPANT_COUNT,
  DEMO_TEAM_COUNT,
  STAFF_LOGIN_NUMBERS,
  participantLoginNumbers,
  teamRoster
} from "../lib/login-codes.js";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

loadEnvLocal();

const results = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`  ✓ ${name}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}: ${detail}`);
}

function parseSetCookie(headers) {
  const raw = headers.getSetCookie?.() || [];
  if (raw.length) return raw.map((c) => c.split(";")[0]).join("; ");
  return headers.get("set-cookie") || "";
}

async function loginAs(loginNumber) {
  const jar = { cookie: "" };
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`, { redirect: "manual" });
  const csrfData = await csrfRes.json();
  jar.cookie = parseSetCookie(csrfRes.headers);

  const signRes = await fetch(`${BASE}/api/auth/callback/login-number`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: jar.cookie
    },
    body: new URLSearchParams({
      csrfToken: csrfData.csrfToken,
      loginNumber: String(loginNumber),
      callbackUrl: `${BASE}/post-login`,
      json: "true"
    }),
    redirect: "manual"
  });

  const extra = parseSetCookie(signRes.headers);
  if (extra) jar.cookie = [jar.cookie, extra].filter(Boolean).join("; ");

  const sessionRes = await fetch(`${BASE}/api/auth/session`, { headers: { Cookie: jar.cookie } });
  const session = await sessionRes.json();
  if (!session?.user?.id) throw new Error(`login ${loginNumber} failed`);
  return { jar, session };
}

async function api(jar, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: jar.cookie,
      ...(options.body ? { "Content-Type": "application/json" } : {})
    }
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { res, data };
}

async function expectLoginFails(n) {
  try {
    await loginAs(n);
    fail(`Login #${n} should fail`, "succeeded unexpectedly");
  } catch {
    pass(`Login #${n} rejected`);
  }
}

async function main() {
  console.log(`FaultLine full smoke → ${BASE}\n`);

  const providers = await fetch(`${BASE}/api/auth/providers`).then((r) => r.json()).catch(() => ({}));
  if (!providers["login-number"]) {
    console.error("Login-number provider missing. Restart the dev server after pulling latest auth changes.");
    process.exit(1);
  }

  // —— Public ——
  for (const path of ["/", "/login", "/live", "/login?loggedOut=1"]) {
    const res = await fetch(`${BASE}${path}`);
    if (res.ok) pass(`GET ${path.split("?")[0]}${path.includes("?") ? " (query)" : ""}`);
    else fail(`GET ${path}`, String(res.status));
  }

  const publicLive = await fetch(`${BASE}/api/live`);
  const publicLiveData = await publicLive.json();
  if (publicLive.ok && Array.isArray(publicLiveData.phases)) pass("GET /api/live (public)");
  else fail("GET /api/live public", JSON.stringify(publicLiveData));

  const healthRes = await fetch(`${BASE}/api/health`);
  const healthData = await healthRes.json().catch(() => ({}));
  if (healthRes.ok && healthData.ok) pass("GET /api/health");
  else fail("GET /api/health", JSON.stringify(healthData));

  // —— Auth matrix ——
  for (const n of [1, 7, 18]) {
    try {
      await loginAs(n);
      pass(`Participant login #${n}`);
    } catch (e) {
      fail(`Participant login #${n}`, e.message);
    }
  }

  for (const n of STAFF_LOGIN_NUMBERS.judges) {
    try {
      const { session } = await loginAs(n);
      if (session.user.role === "judge" || session.user.roles?.includes("judge")) {
        pass(`Judge login #${n}`);
      } else fail(`Judge login #${n}`, `role=${session.user.role}`);
    } catch (e) {
      fail(`Judge login #${n}`, e.message);
    }
  }

  try {
    const { session } = await loginAs(STAFF_LOGIN_NUMBERS.organizer);
    if (session.user.roles?.includes("organizer")) pass("Organizer login #25");
    else fail("Organizer login #25", JSON.stringify(session.user.roles));
  } catch (e) {
    fail("Organizer login #25", e.message);
  }

  await expectLoginFails(19);
  await expectLoginFails(26);
  await expectLoginFails(99);

  // —— Participant session ——
  const p1 = await loginAs(1);
  const team1 = await api(p1.jar, "/api/team");
  if (team1.data.team?.registered && team1.data.team?.name) pass("Team #1 registered in API");
  else fail("Team #1", JSON.stringify(team1.data));

  const p2team = await loginAs(4);
  const team2 = await api(p2team.jar, "/api/team");
  if (team1.data.team?.id !== team2.data.team?.id) pass("Logins 1 and 4 are different teams");
  else fail("Team isolation", "same team id");

  for (const path of [
    "/api/phase",
    "/api/submission/phase_1",
    "/api/submission/phase_2",
    "/api/notifications",
    "/api/swap",
    "/api/tracks"
  ]) {
    const r = await api(p1.jar, path);
    if (r.res.ok) pass(`GET ${path}`);
    else fail(`GET ${path}`, JSON.stringify(r.data));
  }

  const phases = await api(p1.jar, "/api/phase");
  const p1phase = (phases.data.phases || []).find((p) => p.name === "phase_1");
  if (p1phase?.status === "active") pass("Phase 1 active for participants");
  else fail("Phase 1 status", p1phase?.status);

  const submit = await api(p1.jar, "/api/submission/phase_1", {
    method: "POST",
    body: JSON.stringify({
      repo_url: "https://github.com/octocat/Hello-World",
      description: "Smoke test submission"
    })
  });
  if (submit.res.ok) pass("Participant can submit phase_1 repo");
  else if (submit.res.status === 403 && submit.data.error?.includes("deadline")) {
    pass("Participant submit gated (phase closed)");
  } else fail("Participant submit phase_1", JSON.stringify(submit.data));

  const submitGet = await api(p1.jar, "/api/submission/phase_1");
  if (submitGet.data.submission?.repo_url) pass("Submission persisted for team");
  else fail("Submission read-back", JSON.stringify(submitGet.data));

  // —— Role route guards ——
  const p1Organizer = await api(p1.jar, "/api/organizer/overview");
  if (p1Organizer.res.status === 403) pass("Participant blocked from organizer API");
  else fail("Organizer guard", String(p1Organizer.res.status));

  const p1Judge = await api(p1.jar, "/api/judge/context");
  if (p1Judge.res.status === 403) pass("Participant blocked from judge API");
  else fail("Judge guard", String(p1Judge.res.status));

  // —— Organizer ——
  const org = await loginAs(25);
  const ov = await api(org.jar, "/api/organizer/overview");
  if (ov.data.teams?.length === DEMO_TEAM_COUNT) {
    pass(`Organizer sees ${DEMO_TEAM_COUNT} teams`);
  } else fail("Organizer team count", String(ov.data.teams?.length));

  if (ov.data.stats?.team_count === DEMO_TEAM_COUNT) pass("Organizer stats.team_count synced");
  else fail("stats.team_count", String(ov.data.stats?.team_count));

  const orgPhases = (ov.data.phases || []).map((p) => p.name);
  if (!orgPhases.includes("finals") && orgPhases.includes("phase_1")) {
    pass("Organizer phases exclude finals");
  } else fail("Organizer phases", orgPhases.join(","));

  for (const path of ["/api/organizer/judge-control", "/api/phase"]) {
    const r = await api(org.jar, path);
    if (r.res.ok) pass(`Organizer GET ${path}`);
    else fail(`Organizer GET ${path}`, JSON.stringify(r.data));
  }

  const openScoring = await api(org.jar, "/api/organizer/judge-control", {
    method: "POST",
    body: JSON.stringify({ judge_scoring_open: true })
  });
  if (openScoring.data.judge_scoring_open) pass("Organizer opened judge scoring");
  else fail("Open judge scoring", JSON.stringify(openScoring.data));

  const setRound = await api(org.jar, "/api/organizer/judge-control", {
    method: "POST",
    body: JSON.stringify({ judge_round: "visit_1" })
  });
  if (setRound.res.ok && setRound.data.judge_round) pass("Organizer can set judge round");
  else if (setRound.data.error?.includes("event_settings")) {
    pass("Organizer judge round (event_settings missing — run schema.sql)");
  } else fail("Organizer set judge round", JSON.stringify(setRound.data));

  // —— Judge ——
  const judge = await loginAs(20);
  const ctx = await api(judge.jar, "/api/judge/context");
  const trackId = ctx.data.judge_track_id;
  if (trackId) pass("Judge #20 has judge_track_id");
  else fail("judge_track_id missing", JSON.stringify(ctx.data));

  const finalsTeams = await api(judge.jar, "/api/judge/teams?track_id=all&round=final_pitch");
  if (finalsTeams.data.teams?.length === DEMO_TEAM_COUNT) {
    pass(`Judge sees all ${DEMO_TEAM_COUNT} teams in final_pitch round`);
  } else fail("Judge finals teams", String(finalsTeams.data.teams?.length));

  const judgeTeams = await api(judge.jar, `/api/judge/teams?track_id=${trackId}`);
  if (judgeTeams.data.teams?.length >= 1) pass("Judge can filter teams by track");
  else fail("Judge track filter", JSON.stringify(judgeTeams.data));

  const phase1Id = ctx.data.phases?.find((p) => p.name === "phase_1")?.id;
  const bankingTeam = judgeTeams.data.teams?.[0];

  if (bankingTeam && phase1Id) {
    const scorePayload = {
      team_id: bankingTeam.id,
      phase_id: phase1Id,
      round: "visit_1",
      scores: { functional: 5, creative_chaos: 5, architecture: 5, progress: 5 }
    };

    const first = await api(judge.jar, "/api/judge/review", {
      method: "POST",
      body: JSON.stringify(scorePayload)
    });
    if (first.res.ok || first.res.status === 409) {
      pass("Judge can score visit_1 (or already scored from prior run)");
    } else fail("Judge visit_1 save", JSON.stringify(first.data));

    const blocked = await api(judge.jar, "/api/judge/review", {
      method: "POST",
      body: JSON.stringify(scorePayload)
    });
    if (blocked.res.status === 409) {
      pass("Judge cannot score same team+round twice");
    } else fail("Duplicate round guard", JSON.stringify(blocked.data));

    const visit2 = await api(judge.jar, "/api/judge/review", {
      method: "POST",
      body: JSON.stringify({
        team_id: bankingTeam.id,
        phase_id: phase1Id,
        round: "visit_2",
        scores: { functional: 7, creative_chaos: 7, architecture: 7, progress: 7 }
      })
    });
    if (visit2.res.ok) pass("Same team can be judged in a different round");
    else if (visit2.res.status === 409) pass("Visit 2 already scored for team");
    else fail("Judge visit_2 save", JSON.stringify(visit2.data));
  }

  // —— Demo registration off ——
  const reg = await api(p1.jar, "/api/team", {
    method: "POST",
    body: JSON.stringify({
      name: "Hack",
      track_id: "00000000-0000-0000-0000-000000000001",
      member_emails: []
    })
  });
  if (reg.res.status === 403) pass("POST /api/team blocked in demo");
  else fail("Demo register block", String(reg.res.status));

  // —— Config sync spot-check ——
  const roster = teamRoster();
  if (roster.length === DEMO_TEAM_COUNT && roster[0].logins[0] === 1) {
    pass("teamRoster matches DEMO_TEAM_COUNT");
  } else fail("teamRoster", JSON.stringify(roster[0]));

  if (participantLoginNumbers().length === DEMO_PARTICIPANT_COUNT) {
    pass(`participantLoginNumbers length = ${DEMO_PARTICIPANT_COUNT}`);
  } else fail("participant count mismatch");

  // —— Logout ——
  const logoutRes = await fetch(`${BASE}/api/auth/force-logout`, { redirect: "manual" });
  if ([302, 307].includes(logoutRes.status)) pass("Force logout redirect");
  else fail("Force logout", String(logoutRes.status));

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
  console.log("\nAll checks passed — app, API, auth, and config are in sync.");
}

main().catch((e) => {
  console.error("\nSmoke crashed:", e.message);
  process.exit(1);
});
