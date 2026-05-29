import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function OrganizerLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const roles = session.user.roles || (session.user.role ? [session.user.role] : []);
  if (!roles.includes("organizer")) redirect("/post-login");

  return (
    <div className="flex min-h-screen flex-col bg-fl-bg">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-fl-border bg-fl-bg/95 px-6 backdrop-blur-md">
        <Link href="/organizer" className="text-xl font-extrabold tracking-tight text-fl-red">
          FAULT<span className="text-fl-text">LINE</span>
          <span className="ml-2 text-xs font-mono font-normal text-fl-muted">ORGANIZER</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/live" className="text-sm font-semibold text-fl-muted hover:text-fl-text">
            Live
          </Link>
          <span className="hidden text-sm text-fl-muted sm:inline">{session.user.email}</span>
          <LogoutButton className="rounded-md border border-fl-border px-3 py-1.5 text-sm hover:bg-fl-bg3" />
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
