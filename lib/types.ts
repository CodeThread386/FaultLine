export type UserRole = "participant" | "judge" | "organizer";

export type PhaseName = "phase_1" | "phase_2";

export type PhaseStatus = "locked" | "active" | "closed";

export interface Phase {
  id: string;
  name: PhaseName;
  status: PhaseStatus;
  submission_deadline: string | null;
}

export interface Team {
  id: string;
  name: string;
  registered: boolean;
  track_id: string;
  tracks?: { id: string; name: string; functional_spec?: string };
}

export interface Submission {
  id?: string;
  repo_url: string | null;
  description: string | null;
  submitted_at?: string | null;
}
