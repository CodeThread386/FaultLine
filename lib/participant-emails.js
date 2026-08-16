const PARTICIPANT_ASSIGNMENTS = [
  {
    email: "shreyas.menon2025@vitstudent.ac.in",
    teamNumber: 1,
    teamName: "Team Aurora",
    track: "Banking"
  },
  {
    email: "hrishit.parida2025@vitstudent.ac.in",
    teamNumber: 2,
    teamName: "Team Nova",
    track: "E-Commerce"
  },
  {
    email: "sara.kj2025@vitstudent.ac.in",
    teamNumber: 3,
    teamName: "Team Eclipse",
    track: "Food Delivery"
  },
  {
    email: "s.r.m.2acc@gmail.com",
    teamNumber: 5,
    teamName: "RANDOM",
    track: "Food Delivery"
  },
  {
    email: "shreykaizen07@gmail.com",
    teamNumber: 5,
    teamName: "RANDOM",
    track: "Food Delivery"
  },
  {
    email: "sarthak.trivedi2024@vitstudent.ac.in",
    teamNumber: 4,
    teamName: "Team Orbit",
    track: "Healthcare"
  }
];

export function getParticipantAssignments() {
  return PARTICIPANT_ASSIGNMENTS;
}

export function getParticipantAssignment(email) {
  const normalized = email?.toLowerCase()?.trim();
  if (!normalized) return null;
  return PARTICIPANT_ASSIGNMENTS.find((entry) => entry.email === normalized) || null;
}

export function getParticipantEmails() {
  return PARTICIPANT_ASSIGNMENTS.map((entry) => entry.email);
}

export function isParticipantEmail(email) {
  return Boolean(getParticipantAssignment(email));
}
