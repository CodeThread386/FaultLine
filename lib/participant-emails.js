const PARTICIPANT_EMAILS = ["shreyas.menon2025@vitstudent.ac.in","hrishit.parida2025@vitstudent.ac.in","sara.kj2025@vitstudent.ac.in","sarthak.trivedi2024@vitstudent.ac.in"];

export function getParticipantEmails() {
  return PARTICIPANT_EMAILS;
}

export function isParticipantEmail(email) {
  const normalized = email?.toLowerCase()?.trim();
  if (!normalized) return false;
  return getParticipantEmails().includes(normalized);
}
