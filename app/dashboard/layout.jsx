import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardShell from "@/components/participant/DashboardShell";
import { EventSyncProvider } from "@/components/providers/EventSyncProvider";
import { getPhases, getUnreadNotificationCount, getTeamForUser } from "@/lib/participant-data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [team, phases, unreadCount] = await Promise.all([
    getTeamForUser(session.user.id),
    getPhases(),
    getUnreadNotificationCount(session.user.id)
  ]);

  return (
    <EventSyncProvider
      initialPhases={phases}
      initialUnread={unreadCount}
      teamId={team?.id || null}
    >
      <DashboardShell team={team} user={session.user}>
        {children}
      </DashboardShell>
    </EventSyncProvider>
  );
}
