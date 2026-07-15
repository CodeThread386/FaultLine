export const ROLES = ["organizer", "participant"];

export const ROLE_PRIORITY = ["organizer", "participant"];

export const ROLE_DASHBOARDS = {
  organizer: "/organizer",
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

/** JWT / middleware token shape */
export function normalizeRolesFromToken(token) {
  if (!token) return [];
  if (Array.isArray(token.roles) && token.roles.length) return token.roles;
  if (token.role) return [token.role];
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
  if (pathname.startsWith("/organizer")) return roles.includes("organizer");
  return true;
}
