#!/usr/bin/env node
/**
 * Applies fix_tracks.sql + seed.sql logic via Supabase service role.
 * Usage: node scripts/seed-db.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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

const SEED_USERS = [
  {
    email: "sarthaktrivedi386@gmail.com",
    name: "Sarthak Judge",
    role: "judge",
    trackName: "Banking"
  },
  {
    email: "sarthak.trivedi2024@vitstudent.ac.in",
    name: "Sarthak Participant",
    role: "participant",
    trackName: null
  },
  {
    email: "rarealriree@gmail.com",
    name: "Organizer",
    role: "organizer",
    trackName: null
  }
];

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

async function fixTracks() {
  console.log("→ Fixing tracks…");

  const { data: allTracks, error: fetchErr } = await db.from("tracks").select("id, name");
  if (fetchErr) throw new Error(fetchErr.message);

  const byName = new Map();
  for (const t of allTracks || []) {
    if (!byName.has(t.name)) byName.set(t.name, []);
    byName.get(t.name).push(t);
  }

  const keepers = new Map();
  for (const [name, rows] of byName) {
    rows.sort((a, b) => a.id.localeCompare(b.id));
    keepers.set(name, rows[0].id);
    for (let i = 1; i < rows.length; i++) {
      const dupId = rows[i].id;
      const keeperId = rows[0].id;
      await db.from("teams").update({ track_id: keeperId }).eq("track_id", dupId);
      await db.from("users").update({ track_id: keeperId }).eq("track_id", dupId);
      await db.from("tracks").delete().eq("id", dupId);
      console.log(`  merged duplicate track "${name}" → ${keeperId.slice(0, 8)}…`);
    }
  }

  const rows = TRACKS.map((name) => ({ name, functional_spec: TRACK_SPECS[name] }));
  const { error: upsertErr } = await db.from("tracks").upsert(rows, { onConflict: "name" });
  if (upsertErr) throw new Error(`Track upsert: ${upsertErr.message}`);

  const { data: canonical } = await db.from("tracks").select("id, name").in("name", TRACKS);
  const bankingId = canonical?.find((t) => t.name === "Banking")?.id;
  const canonicalIds = new Set((canonical || []).map((t) => t.id));

  const { data: legacy } = await db.from("tracks").select("id, name");
  for (const t of legacy || []) {
    if (TRACKS.includes(t.name)) continue;
    if (bankingId) {
      await db.from("teams").update({ track_id: bankingId }).eq("track_id", t.id);
      await db.from("users").update({ track_id: bankingId }).eq("track_id", t.id);
    }
    const { count } = await db
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("track_id", t.id);
    if (!count) {
      await db.from("tracks").delete().eq("id", t.id);
      console.log(`  removed legacy track "${t.name}"`);
    }
  }

  const { data: finalTracks } = await db.from("tracks").select("id, name").order("name");
  const names = (finalTracks || []).map((t) => t.name);
  console.log(`  tracks now: ${names.join(", ")}`);
  return Object.fromEntries((finalTracks || []).filter((t) => TRACKS.includes(t.name)).map((t) => [t.name, t.id]));
}

async function seedUsers(trackIds) {
  console.log("→ Seeding users…");

  for (const u of SEED_USERS) {
    const track_id = u.trackName ? trackIds[u.trackName] : null;
    const { data: user, error } = await db
      .from("users")
      .upsert(
        { email: u.email, name: u.name, role: u.role, track_id },
        { onConflict: "email" }
      )
      .select("id, email")
      .single();

    if (error) throw new Error(`User ${u.email}: ${error.message}`);

    await db.from("user_roles").delete().eq("user_id", user.id);
    const { error: roleErr } = await db
      .from("user_roles")
      .upsert({ user_id: user.id, role: u.role }, { onConflict: "user_id,role" });
    if (roleErr) throw new Error(`Role ${u.email}: ${roleErr.message}`);

    console.log(`  ✓ ${u.role}: ${u.email}`);
  }
}

async function main() {
  console.log("FaultLine DB seed\n");
  const trackIds = await fixTracks();
  await seedUsers(trackIds);
  console.log("\nDone. Refresh the app and register — tracks should appear.");
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
