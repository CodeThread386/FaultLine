import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardForRole, getDashboardForRoles, isAdminRole, normalizeRoles, pickPrimaryRole } from "@/lib/roles";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  if (isAdminRole(session.user.role)) redirect("/organizer");

  const roles = normalizeRoles(session.user);
  if (!roles.length) redirect("/login");

  const primaryRole = pickPrimaryRole(roles);
  if (primaryRole) redirect(getDashboardForRole(primaryRole));

  redirect(getDashboardForRoles(roles));
}
