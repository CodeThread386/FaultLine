import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import JudgeShell from "@/components/judge/JudgeShell";

export default async function JudgeLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const roles = session.user.roles || (session.user.role ? [session.user.role] : []);
  if (!roles.includes("judge")) redirect("/post-login");

  return <JudgeShell>{children}</JudgeShell>;
}
