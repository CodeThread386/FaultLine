"use client";

import { getDashboardForRole } from "@/lib/roles";

const LABELS = {
  organizer: "Organizer Panel",
  judge: "Judge Panel",
  participant: "Participant Dashboard"
};

export default function ChooseRoleClient({ roles, email }) {
  return (
    <section className="fl-fade-up fl-glass space-y-8 rounded-sm border border-fl-border p-8 md:p-10">
      <div>
        <p className="fl-label mb-3">Multiple roles</p>
        <h1 className="fl-display text-4xl">Choose your panel</h1>
        <p className="mt-3 text-sm text-fl-muted">
          Signed in as <span className="text-fl-text">{email}</span>. Select where to go.
        </p>
      </div>
      <div className="grid gap-px border border-fl-border bg-fl-border">
        {roles.map((role) => {
          const targetHref = getDashboardForRole(role);
          return (
            <a
              key={role}
              href={targetHref}
              className="fl-hover-lift block bg-fl-bg2 px-6 py-5 transition hover:bg-fl-bg3"
            >
              <p className="font-semibold text-fl-text">{LABELS[role] || role}</p>
              <p className="mt-1 font-mono text-[11px] text-fl-muted">{targetHref}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
