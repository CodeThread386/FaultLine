const ADMIN_EMAILS = ["shreyas.r.menon@gmail.com","sarthaktrivedi386@gmail.com","hrishit.parida@gmail.com","sarakuthurjames@gmail.com"];

export function getAdminEmails() {
  return ADMIN_EMAILS;
}

export function isAdminEmail(email) {
  const normalized = email?.toLowerCase()?.trim();
  if (!normalized) return false;
  return getAdminEmails().includes(normalized);
}
