import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Phase1View from "@/components/participant/Phase1View";
import { authOptions } from "@/lib/auth";
import { getSubmission, getTeamForUser } from "@/lib/participant-data";

export const dynamic = "force-dynamic";

export default async function Phase1Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const team = await getTeamForUser(session.user.id);

  if (!team) redirect("/dashboard/register");
  if (!team.registered) {
    redirect(team.leader_id === session.user.id ? "/dashboard/register" : "/dashboard/holding");
  }

  const submission = await getSubmission(team.id, "phase_1");

  return <Phase1View team={team} submission={submission} />;
}
