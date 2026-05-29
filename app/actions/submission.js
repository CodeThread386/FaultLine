"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";
import { submitTeamPhase } from "@/lib/submissions";

/** @param {"phase_1" | "phase_2"} phaseName @param {FormData} formData */
export async function submitPhaseSubmission(phaseName, formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const repo_url = formData.get("repo_url")?.toString() || "";
  const description = formData.get("description")?.toString() || "";

  const db = getSupabaseServerClient();
  const result = await submitTeamPhase(db, session.user.id, phaseName, {
    repo_url,
    description
  });

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/dashboard");
  revalidatePath(phaseName === "phase_1" ? "/dashboard/phase-1" : "/dashboard/phase-2");
  revalidatePath("/dashboard/live");

  return { ok: true, submission: result.submission };
}
