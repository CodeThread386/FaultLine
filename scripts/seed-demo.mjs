#!/usr/bin/env node
/**
 * Demo event seed: numeric logins, 6 teams × 3 members, judges 20–22, organizer 25.
 * Wipes participant/team data and old email users.
 *
 * Usage: npm run db:seed
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import {
  demoEmail,
  DEMO_TEAM_COUNT,
  participantLoginNumbers,
  STAFF_LOGIN_NUMBERS
} from "../lib/login-codes.js";
import { insertReview } from "../lib/review-round.js";

const TEAM_NAMES = [
  "NullPointers",
  "Segfault Society",
  "Stack Overflow",
  "Git Push Force",
  "404 Found",
  "Infinite Loop"
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const TRACKS = [
  "Banking",
  "E-Commerce",
  "Food Delivery",
  "Dating App",
  "Job Portal"
];

const TRACK_SPECS = {
  Banking: "Users must complete core banking flows: accounts, transactions, and OTP verification.",
  "E-Commerce": "Users must browse products, add to cart, checkout, and view order status.",
  "Food Delivery": "Users must browse a menu, place an order, and see order tracking.",
  "Dating App": "Users must create a profile, match with others, and use a chat flow.",
  "Job Portal": "Users must browse job listings, apply, and manage applications."
};

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.error("Missing .env.local — add Supabase keys first.");
    process.exit(1);
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

async function ensureLoginNumberColumn() {
  // Best-effort: column may already exist from migration_login_number.sql
  const { error } = await db.rpc("exec_sql", { sql: "select 1" });
  if (error) {
    console.log("→ Ensure migration_login_number.sql is applied in Supabase if login fails.");
  }
}

async function wipeEventData() {
  console.log("→ Clearing old event data (including legacy email users)…");
  const steps = [
    () => db.from("reviews").delete().not("id", "is", null),
    () => db.from("notification_reads").delete().not("user_id", "is", null),
    () => db.from("notifications").delete().not("id", "is", null),
    () => db.from("submissions").delete().not("id", "is", null),
    () => db.from("swaps").delete().not("id", "is", null),
    () => db.from("team_members").delete().not("user_id", "is", null),
    () => db.from("teams").delete().not("id", "is", null),
    () => db.from("user_roles").delete().not("user_id", "is", null),
    () => db.from("users").delete().not("email", "is", null),
    () => db.from("activity_feed").delete().not("id", "is", null)
  ];
  for (const run of steps) {
    const { error } = await run();
    if (error) console.warn("  warn:", error.message);
  }
}

async function upsertTracks() {
  console.log("→ Tracks…");
  const rows = TRACKS.map((name) => ({ name, functional_spec: TRACK_SPECS[name] }));
  const { error } = await db.from("tracks").upsert(rows, { onConflict: "name" });
  if (error) throw new Error(error.message);

  const { data } = await db.from("tracks").select("id, name").in("name", TRACKS);
  return Object.fromEntries((data || []).map((t) => [t.name, t.id]));
}

async function createUser({ loginNumber, name, role, trackId = null }) {
  const email = demoEmail(loginNumber);
  const base = { email, name, role, track_id: trackId };

  let user;
  let error;
  ({ data: user, error } = await db
    .from("users")
    .insert({ ...base, login_number: loginNumber })
    .select("id, login_number")
    .single());

  if (error?.message?.includes("login_number")) {
    ({ data: user, error } = await db.from("users").insert(base).select("id").single());
  }

  if (error) throw new Error(`User ${loginNumber}: ${error.message}`);

  const { error: roleErr } = await db
    .from("user_roles")
    .upsert({ user_id: user.id, role }, { onConflict: "user_id,role" });
  if (roleErr) throw new Error(`Role ${loginNumber}: ${roleErr.message}`);

  return user;
}

async function seedParticipants(trackIds) {
  console.log(`→ ${DEMO_TEAM_COUNT * 3} participants (${DEMO_TEAM_COUNT} teams × 3)…`);
  const logins = participantLoginNumbers();
  const trackNames = TRACKS;
  const teams = [];
  const usersByLogin = new Map();

  for (let t = 0; t < DEMO_TEAM_COUNT; t += 1) {
    const trackName = trackNames[t % trackNames.length];
    const trackId = trackIds[trackName];
    const memberLogins = logins.slice(t * 3, t * 3 + 3);
    const leaderLogin = memberLogins[0];

    let leaderId = null;
    const memberIds = [];

    for (let m = 0; m < memberLogins.length; m += 1) {
      const loginNumber = memberLogins[m];
      const user = await createUser({
        loginNumber,
        name: `Team ${t + 1} · Member ${m + 1}`,
        role: "participant"
      });
      usersByLogin.set(loginNumber, user.id);
      memberIds.push(user.id);
      if (m === 0) leaderId = user.id;
    }

    const { data: team, error } = await db
      .from("teams")
      .insert({
        name: `${TEAM_NAMES[t]} ${t + 1}`,
        leader_id: leaderId,
        track_id: trackId,
        registered: true
      })
      .select("id, name, track_id")
      .single();

    if (error) throw new Error(`Team ${t + 1}: ${error.message}`);

    const memberRows = memberIds.map((user_id) => ({ team_id: team.id, user_id }));
    const { error: tmErr } = await db.from("team_members").insert(memberRows);
    if (tmErr) throw new Error(tmErr.message);

    teams.push({ ...team, leaderLogin, memberLogins });
  }

  return { teams, usersByLogin };
}

async function seedStaff(trackIds) {
  console.log("→ Judges (20, 21, 22) and organizer (25)…");

  const judgeTracks = ["Banking", "E-Commerce", "Food Delivery"];
  for (let i = 0; i < STAFF_LOGIN_NUMBERS.judges.length; i += 1) {
    const loginNumber = STAFF_LOGIN_NUMBERS.judges[i];
    await createUser({
      loginNumber,
      name: `Judge ${loginNumber}`,
      role: "judge",
      trackId: trackIds[judgeTracks[i]]
    });
  }

  await createUser({
    loginNumber: STAFF_LOGIN_NUMBERS.organizer,
    name: "Organizer",
    role: "organizer"
  });
}

async function seedPhases() {
  const { data: phases } = await db.from("phases").select("id, name").in("name", ["phase_1", "phase_2"]);
  const phase1 = phases?.find((p) => p.name === "phase_1");
  const phase2 = phases?.find((p) => p.name === "phase_2");

  const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  if (phase1) {
    await db
      .from("phases")
      .update({ status: "active", submission_deadline: deadline })
      .eq("id", phase1.id);
  }

  await db.from("event_settings").upsert(
    [
      { key: "judge_round", value: "visit_1", updated_at: new Date().toISOString() },
      { key: "judge_scoring_open", value: true, updated_at: new Date().toISOString() }
    ],
    { onConflict: "key" }
  );

  return { phase1, phase2 };
}

async function seedDummySubmissions(teams, phases) {
  if (!phases.phase1) return;
  console.log("→ Dummy submissions & reviews…");

  const repos = [
    "https://github.com/octocat/Hello-World",
    "https://github.com/github/roadmap",
    "https://github.com/nextauthjs/next-auth"
  ];

  for (let i = 0; i < teams.length; i += 1) {
    const team = teams[i];
    if (i % 3 === 2) continue;

    await db.from("submissions").upsert(
      {
        team_id: team.id,
        phase_id: phases.phase1.id,
        repo_url: repos[i % repos.length],
        description: `Intentionally cursed ${team.name} build for Phase 1.`,
        submitted_at: new Date().toISOString(),
        locked: false
      },
      { onConflict: "team_id,phase_id" }
    );
  }

  const judgeEmails = STAFF_LOGIN_NUMBERS.judges.map(demoEmail);
  const { data: judges } = await db
    .from("users")
    .select("id, email, track_id")
    .in("email", judgeEmails);

  const scoredTeams = teams;
  const seedJudge = judges?.[0];
  if (seedJudge) {
    for (const team of scoredTeams) {
      const score = 55 + (team.id.charCodeAt(0) % 30);
      const { ok, error } = await insertReview(db, {
        judge_id: seedJudge.id,
        team_id: team.id,
        phase_id: phases.phase1.id,
        round: "visit_1",
        score,
        scores: { functional: 6, creative_chaos: 6, architecture: 6, progress: 6 },
        notes: "Demo review",
        locked: true
      });
      if (!ok) console.warn(`  review seed warn (${team.name}):`, error?.message);
    }
  }

  await db.from("activity_feed").insert([
    { message: "Phase 1 is now active — submit your worst repo.", public: true },
    { message: `${DEMO_TEAM_COUNT} teams are locked in across 5 tracks.`, public: true }
  ]);

  await db.from("notifications").insert({
    message: "Welcome to FaultLine demo. Phase 1 submissions are open.",
    sent_by: null
  });
}

async function main() {
  console.log("FaultLine DEMO seed\n");
  await ensureLoginNumberColumn();
  await wipeEventData();
  const trackIds = await upsertTracks();
  const { teams } = await seedParticipants(trackIds);
  await seedStaff(trackIds);
  const phases = await seedPhases();
  await seedDummySubmissions(teams, phases);

  console.log("\n✓ Done\n");
  console.log("Participants: login numbers", participantLoginNumbers().join(", "));
  console.log("Judges: 20, 21, 22  |  Organizer: 25");
  console.log("\nSign in at /login with your number only (no password).");
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
