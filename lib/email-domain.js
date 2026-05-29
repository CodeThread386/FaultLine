const VIT_DOMAIN = (process.env.AUTH_ALLOWED_EMAIL_DOMAIN || "vitstudent.ac.in").toLowerCase();

export function getAllowedEmailDomain() {
  return VIT_DOMAIN;
}

export function isAllowedParticipantEmail(email) {
  if (!email || typeof email !== "string") return false;
  return email.toLowerCase().endsWith(`@${VIT_DOMAIN}`);
}
