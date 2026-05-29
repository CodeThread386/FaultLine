import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeRoles } from "@/lib/roles";
import { redirect } from "next/navigation";
import JudgeShell from "@/components/judge/JudgeShell";

export default async function JudgeLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const roles = normalizeRoles(session.user);
  if (!roles.includes("judge")) redirect("/post-login");

  return <JudgeShell>{children}</JudgeShell>;
}
