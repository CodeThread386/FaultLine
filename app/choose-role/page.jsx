import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardForRole, normalizeRoles } from "@/lib/roles";
import ChooseRoleClient from "./ChooseRoleClient";

export default async function ChooseRolePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const roles = normalizeRoles(session.user);
  if (!roles.length) redirect("/login?error=AccessDenied");
  if (roles.length === 1) redirect(getDashboardForRole(roles[0]));

  return <ChooseRoleClient roles={roles} email={session.user.email} />;
}
