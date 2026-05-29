const DEFAULTS = {
  judge_round: "visit_1",
  judge_scoring_open: true
};

const ROUND_MAP = {
  mid_build: "visit_1",
  pre_final: "visit_2",
  finals: "final_pitch"
};

export function isEventSettingsSchemaError(message) {
  return Boolean(message?.includes("event_settings"));
}

export async function getEventSettings(db, keys = null) {
  const { data, error } = await db.from("event_settings").select("key, value");
  if (error) {
    return {
      ...DEFAULTS,
      _event_settings_available: !isEventSettingsSchemaError(error.message)
    };
  }

  const out = { ...DEFAULTS, _event_settings_available: true };
  for (const row of data || []) {
    if (keys && !keys.includes(row.key)) continue;
    let v = row.value;
    if (typeof v === "string" && (v.startsWith('"') || v === "true" || v === "false")) {
      try {
        v = JSON.parse(v);
      } catch {
        /* keep raw */
      }
    }
    out[row.key] = v;
  }

  if (ROUND_MAP[out.judge_round]) out.judge_round = ROUND_MAP[out.judge_round];
  return out;
}

export async function setEventSetting(db, key, value) {
  const { error } = await db
    .from("event_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error && isEventSettingsSchemaError(error.message)) {
    return {
      error: new Error(
        "event_settings table is missing. Run migration_demo_required.sql in the Supabase SQL editor."
      )
    };
  }

  return { error };
}
