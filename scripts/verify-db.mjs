#!/usr/bin/env node
/**
 * Verifies Supabase demo data matches lib/login-codes.js (team/logins sync).
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./load-env.mjs";
import {
  demoEmail,
  DEMO_TEAM_COUNT,
  DEMO_PARTICIPANT_COUNT,
  MEMBERS_PER_TEAM,
  participantLoginNumbers,
  STAFF_LOGIN_NUMBERS,
  teamRoster
} from "../lib/login-codes.js";

loadEnvLocal();

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

const failures = [];

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

function bad(msg) {
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
}

const strictSchema = process.argv.includes("--strict-schema");

async function main() {
  console.log("FaultLine DB verify\n");
  let schemaIssues = 0;

  const expectedLogins = participantLoginNumbers();
  const expectedEmails = expectedLogins.map(demoEmail);

  const { data: users } = await db.from("users").select("id, email, role");
  const { data: roles } = await db.from("user_roles").select("user_id, role");
  const { data: teams } = await db
    .from("teams")
    .select("id, name, registered, leader_id, track_id")
    .order("created_at");
  const { data: members } = await db.from("team_members").select("team_id, user_id");
  const { data: phases } = await db.from("phases").select("name, status");
  const { data: settings, error: settingsErr } = await db.from("event_settings").select("key, value");
  if (settingsErr?.message?.includes("event_settings")) {
    schemaIssues += 1;
    console.log("  ⚠ event_settings table MISSING — run migration_demo_required.sql in Supabase");
  } else ok("event_settings table exists");
  const { data: reviews } = await db.from("reviews").select("round").limit(500);

  const roleByUser = new Map();
  for (const r of roles || []) {
    if (!roleByUser.has(r.user_id)) roleByUser.set(r.user_id, []);
    roleByUser.get(r.user_id).push(r.role);
  }

  const participantUsers = (users || []).filter((u) => roleByUser.get(u.id)?.includes("participant"));
  const judgeUsers = (users || []).filter((u) => roleByUser.get(u.id)?.includes("judge"));
  const orgUsers = (users || []).filter((u) => roleByUser.get(u.id)?.includes("organizer"));

  if (participantUsers.length === DEMO_PARTICIPANT_COUNT) {
    ok(`${DEMO_PARTICIPANT_COUNT} participant users`);
  } else bad(`expected ${DEMO_PARTICIPANT_COUNT} participants, got ${participantUsers.length}`);

  if (judgeUsers.length === STAFF_LOGIN_NUMBERS.judges.length) {
    ok(`${judgeUsers.length} judges`);
  } else bad(`expected ${STAFF_LOGIN_NUMBERS.judges.length} judges`);

  if (orgUsers.length === 1) ok("1 organizer");
  else bad(`expected 1 organizer, got ${orgUsers.length}`);

  if ((teams || []).length === DEMO_TEAM_COUNT) ok(`${DEMO_TEAM_COUNT} teams`);
  else bad(`expected ${DEMO_TEAM_COUNT} teams, got ${teams?.length}`);

  if ((teams || []).every((t) => t.registered)) ok("all teams registered");
  else bad("some teams not registered");

  if ((members || []).length === DEMO_PARTICIPANT_COUNT) {
    ok(`${DEMO_PARTICIPANT_COUNT} team_members rows`);
  } else bad(`expected ${DEMO_PARTICIPANT_COUNT} team_members, got ${members?.length}`);

  for (const email of expectedEmails) {
    if (!(users || []).some((u) => u.email === email)) bad(`missing user ${email}`);
  }
  if (failures.length === 0 || !expectedEmails.some((e) => !(users || []).some((u) => u.email === e))) {
    ok("all participant demo emails exist");
  }

  for (const row of teamRoster()) {
    const team = teams?.[row.team - 1];
    if (!team) {
      bad(`missing team index ${row.team}`);
      continue;
    }
    const teamMemberIds = (members || []).filter((m) => m.team_id === team.id).map((m) => m.user_id);
    if (teamMemberIds.length !== MEMBERS_PER_TEAM) {
      bad(`team ${row.team} has ${teamMemberIds.length} members, expected ${MEMBERS_PER_TEAM}`);
    }
  }
  ok("each team has 3 members");

  const phase1 = (phases || []).find((p) => p.name === "phase_1");
  const phase2 = (phases || []).find((p) => p.name === "phase_2");
  if (phase1 && phase2) ok("phase_1 and phase_2 rows exist");
  else bad("missing phase rows");

  const finals = (phases || []).find((p) => p.name === "finals");
  if (finals) {
    console.log("  ⚠ finals row still in DB (app ignores it) — optional: delete from phases where name = 'finals'");
  } else ok("no finals phase in DB");

  const allowedRoundNames = new Set([
    "visit_1",
    "visit_2",
    "final_pitch",
    "mid_build",
    "pre_final",
    "finals"
  ]);
  const legacyRoundNames = new Set(["mid_build", "pre_final", "finals"]);

  if (!settingsErr) {
    const judgeRound = (settings || []).find((s) => s.key === "judge_round")?.value;
    let roundStr = judgeRound;
    if (typeof roundStr === "string") {
      try {
        roundStr = JSON.parse(roundStr);
      } catch {
        roundStr = roundStr.replace(/^"|"$/g, "");
      }
    }
    if (roundStr && allowedRoundNames.has(roundStr)) {
      ok(`judge_round setting present (${roundStr})`);
    } else if (!judgeRound) {
      console.log("  ⚠ judge_round missing — npm run db:seed after migration");
    } else bad(`unexpected judge_round: ${JSON.stringify(judgeRound)}`);
  }

  const badReviewRounds = (reviews || []).filter((r) => !allowedRoundNames.has(r.round));
  if (badReviewRounds.length) {
    bad(`unknown review rounds: ${[...new Set(badReviewRounds.map((r) => r.round))].join(", ")}`);
  } else if ((reviews || []).some((r) => legacyRoundNames.has(r.round))) {
    console.log("  ⚠ reviews use legacy round names — run migration_judge_rounds_v2.sql (app still works via fallback)");
  } else if ((reviews || []).length) ok("review rounds use canonical names");

  const legacyEmails = (users || []).filter(
    (u) =>
      u.email?.includes("@gmail.com") ||
      u.email?.includes("@vitstudent.ac.in") ||
      (u.email && !u.email.endsWith("@faultline.demo"))
  );
  if (!legacyEmails.length) ok("no legacy email users");
  else bad(`legacy users still present: ${legacyEmails.map((u) => u.email).join(", ")}`);

  console.log(`\n${failures.length ? failures.length + " data issue(s)" : "DB in sync with login-codes.js"}`);
  if (schemaIssues && strictSchema) {
    console.log("Schema check failed (--strict-schema). Run migration_demo_required.sql");
    process.exit(1);
  }
  if (schemaIssues) {
    console.log("Schema warning: run migration_demo_required.sql for full organizer/judge controls.");
  }
  if (failures.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
