import { getSupabaseServerClient } from './lib/supabase.js';

async function test() {
  const db = getSupabaseServerClient();
  const { data, error } = await db.from("users").select("id").limit(1);
  console.log("DATA:", data);
  console.log("ERROR:", error);
}

test();
