import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardForRoles, normalizeRoles } from "@/lib/roles";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const roles = normalizeRoles(session.user);
  if (!roles.length) redirect("/login?error=AccessDenied");

  if (roles.length > 1) redirect("/choose-role");

  redirect(getDashboardForRoles(roles));
}
