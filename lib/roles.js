export const ROLES = ["organizer", "participant"];

export const ROLE_PRIORITY = ["organizer", "participant"];

export const ROLE_DASHBOARDS = {
  organizer: "/organizer",
  participant: "/dashboard"
};

function normalizeRoleName(role) {
  if (!role) return null;
  const normalized = String(role).toLowerCase();
  if (normalized === "admin") return "organizer";
  if (normalized === "user") return "participant";
  return normalized;
}

function normalizeRoleList(roles = []) {
  return (roles || [])
    .map((role) => normalizeRoleName(role))
    .filter(Boolean);
}

export function pickPrimaryRole(roles = []) {
  const normalized = normalizeRoleList(roles);
  for (const role of ROLE_PRIORITY) {
    if (normalized.includes(role)) return role;
  }
  return null;
}

export function normalizeRoles(user) {
  if (!user) return [];
  const roles = user.roles?.length ? user.roles : user.role ? [user.role] : [];
  return normalizeRoleList(roles);
}

/** JWT / middleware token shape */
export function normalizeRolesFromToken(token) {
  if (!token) return [];
  const roles = Array.isArray(token.roles) && token.roles.length ? token.roles : token.role ? [token.role] : [];
  return normalizeRoleList(roles);
}

export function getDashboardForRole(role) {
  const normalized = normalizeRoleName(role);
  return ROLE_DASHBOARDS[normalized] || "/login?error=AccessDenied";
}

export function isAdminRole(role) {
  const normalized = normalizeRoleName(role);
  return normalized === "admin" || normalized === "organizer";
}

export function isParticipantRole(role) {
  const normalized = normalizeRoleName(role);
  return normalized === "user" || normalized === "participant";
}

export function getDashboardForRoles(roles = []) {
  const primary = pickPrimaryRole(roles);
  if (!primary) return "/login?error=AccessDenied";
  return getDashboardForRole(primary);
}

export function userHasRole(user, role) {
  return normalizeRoles(user).includes(normalizeRoleName(role));
}

export function canAccessPath(pathname, roles = []) {
  const normalized = normalizeRoleList(roles);
  if (pathname.startsWith("/dashboard")) return normalized.includes("participant");
  if (pathname.startsWith("/organizer")) return normalized.includes("organizer");
  return true;
}
