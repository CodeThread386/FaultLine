import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Phase2View from "@/components/participant/Phase2View";
import { authOptions } from "@/lib/auth";
import { getSubmission, getSwapForTeam, getTeamForUser } from "@/lib/participant-data";

export const dynamic = "force-dynamic";

export default async function Phase2Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const team = await getTeamForUser(session.user.id);
  if (!team) redirect("/dashboard/register");
  if (!team.registered) {
    redirect(team.leader_id === session.user.id ? "/dashboard/register" : "/dashboard/holding");
  }

  const [submission, swap] = await Promise.all([
    getSubmission(team.id, "phase_2"),
    getSwapForTeam(team.id)
  ]);

  return <Phase2View submission={submission} initialSwap={swap} />;
}
