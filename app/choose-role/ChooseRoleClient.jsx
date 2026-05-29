"use client";

import { ROLE_DASHBOARDS } from "@/lib/roles";

const LABELS = {
  organizer: "Organizer Panel",
  judge: "Judge Panel",
  participant: "Participant Dashboard"
};

export default function ChooseRoleClient({ roles, email }) {
  return (
    <section className="mx-auto max-w-lg space-y-4 rounded border border-slate-800 p-6">
      <h1 className="text-2xl font-semibold">Choose your panel</h1>
      <p className="text-sm text-slate-300">
        Signed in as <span className="text-slate-100">{email}</span>. You have multiple roles.
      </p>
      <div className="grid gap-3">
        {roles.map((role) => (
          <a
            key={role}
            href={ROLE_DASHBOARDS[role]}
            className="rounded border border-slate-700 bg-slate-900 px-4 py-3 hover:border-cyan-500"
          >
            <p className="font-medium text-cyan-300">{LABELS[role] || role}</p>
            <p className="text-xs text-slate-400">{ROLE_DASHBOARDS[role]}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
