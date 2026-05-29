"use client";

import { useState, useTransition } from "react";
import { submitPhaseSubmission } from "@/app/actions/submission";
import { areSubmissionsOpen } from "@/lib/phase-control";

export default function PhaseSubmissionForm({
  phaseName,
  phase,
  submission: initialSubmission,
  disabled = false,
  disabledMessage,
  submitLabel
}) {
  const [repoUrl, setRepoUrl] = useState(initialSubmission?.repo_url || "");
  const [description, setDescription] = useState(initialSubmission?.description || "");
  const [result, setResult] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  const [pending, startTransition] = useTransition();

  const open = areSubmissionsOpen(phase) && !disabled;
  const closed = !open;

  const onSubmit = (e) => {
    e.preventDefault();
    setResult("");
    setSubmitOk(false);
    const fd = new FormData();
    fd.set("repo_url", repoUrl);
    fd.set("description", description);

    startTransition(async () => {
      const res = await submitPhaseSubmission(phaseName, fd);
      if (res.error) {
        setSubmitOk(false);
        setResult(res.error);
      } else {
        setSubmitOk(true);
        setResult("Submitted successfully.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className={`fl-card p-6 fl-fade-in ${closed ? "opacity-60" : ""}`}>
      <div
        className={`mb-4 inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] ${
          initialSubmission?.repo_url || repoUrl
            ? "border border-fl-green/30 bg-fl-green/10 text-fl-green"
            : "border border-fl-amber/30 bg-fl-amber/10 text-fl-amber"
        }`}
      >
        {initialSubmission?.repo_url || repoUrl ? "● Submitted" : "● Not submitted"}
      </div>
      <label className="mb-1.5 block font-mono text-xs text-fl-muted">GitHub Repo URL</label>
      <input
        className="fl-input"
        type="url"
        name="repo_url"
        placeholder="https://github.com/your-team/repo"
        required
        disabled={closed || pending}
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <label className="mb-1.5 block font-mono text-xs text-fl-muted">
        {phaseName === "phase_2" ? "Architecture notes" : "System Description (1 paragraph)"}
      </label>
      <textarea
        className="fl-textarea"
        name="description"
        placeholder={
          phaseName === "phase_2"
            ? "Explain your rebuild decisions..."
            : "Describe what your system does. This is the only documentation the Phase 2 team will receive..."
        }
        disabled={closed || pending}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="fl-btn-primary transition active:scale-[0.98]" disabled={closed || pending}>
        {pending ? "Submitting..." : submitLabel}
      </button>
      {closed && (
        <p className="mt-2 text-xs text-fl-amber">
          {disabledMessage ||
            (phase?.status === "active"
              ? "Submission deadline has passed."
              : phase?.status === "closed"
                ? "Organizers have stopped submissions for this phase."
                : "This phase has not started yet.")}
        </p>
      )}
      {result && (
        <p className={`mt-3 text-sm ${submitOk ? "text-fl-green" : "text-fl-red"}`}>
          {result}
        </p>
      )}
    </form>
  );
}
