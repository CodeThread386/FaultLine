import { logError } from "@/lib/logger";

/** @param {import('@supabase/supabase-js').SupabaseClient} db */
export async function writeAudit(db, { actorId, action, payload = {} }) {
  try {
    await db.from("audit_log").insert({
      actor_id: actorId || null,
      action,
      payload
    });
  } catch (err) {
    logError("audit.write", err, { action });
  }
}
