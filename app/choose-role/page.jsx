import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardForRole, normalizeRoles, pickPrimaryRole } from "@/lib/roles";

export default async function ChooseRolePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const roles = normalizeRoles(session.user);
  if (!roles.length) redirect("/login");

  const primaryRole = pickPrimaryRole(roles);
  if (primaryRole) redirect(getDashboardForRole(primaryRole));

  redirect("/login");
}
