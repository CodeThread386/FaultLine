export const ROLES = ["organizer", "judge", "participant"];

export const ROLE_PRIORITY = ["organizer", "judge", "participant"];

export const ROLE_DASHBOARDS = {
  organizer: "/organizer",
  judge: "/judge/phase-1",
  participant: "/dashboard"
};

export function pickPrimaryRole(roles = []) {
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) return role;
  }
  return null;
}

export function normalizeRoles(user) {
  if (!user) return [];
  if (user.roles?.length) return user.roles;
  if (user.role) return [user.role];
  return [];
}

export function getDashboardForRole(role) {
  return ROLE_DASHBOARDS[role] || "/login";
}

export function getDashboardForRoles(roles = []) {
  const primary = pickPrimaryRole(roles);
  if (!primary) return "/login";
  return getDashboardForRole(primary);
}

export function userHasRole(user, role) {
  return normalizeRoles(user).includes(role);
}

export function canAccessPath(pathname, roles = []) {
  if (pathname.startsWith("/dashboard")) return roles.includes("participant");
  if (pathname.startsWith("/judge")) return roles.includes("judge");
  if (pathname.startsWith("/organizer")) return roles.includes("organizer");
  return true;
}
