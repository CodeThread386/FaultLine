"use client";

import { useState, useTransition } from "react";
import { submitPhaseSubmission } from "@/app/actions/submission";
import { areSubmissionsOpen } from "@/lib/phase-control";

function BracketCorners() {
  return (
    <>
      <span className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b border-l border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-[#F5F5F0]" />
    </>
  );
}

export default function PhaseSubmissionForm({
  phaseName,
  phase,
  submission: initialSubmission,
  disabled = false,
  disabledMessage,
  submitLabel
}) {
  const [repoUrl, setRepoUrl] = useState(initialSubmission?.repo_url || "");
  const [description, setDescription] = useState(
    initialSubmission?.description || ""
  );
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
    <form
      onSubmit={onSubmit}
      className={`relative fl-fade-in p-6 ${closed ? "opacity-60" : ""}`}
    >
      <BracketCorners />

      <div
        className={`mb-6 inline-flex items-center border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] ${
          initialSubmission?.repo_url || repoUrl
            ? "border-[#FF2318] text-[#FF2318]"
            : "border-[#F5F5F0] text-[#F5F5F0]"
        }`}
      >
        {initialSubmission?.repo_url || repoUrl
          ? "SUBMITTED"
          : "NOT SUBMITTED"}
      </div>

      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#8A8A84]">
        GitHub Repo URL
      </label>

      <input
        className="fl-input font-mono text-xs sm:text-sm md:text-base break-all"
        type="url"
        name="repo_url"
        placeholder="https://github.com/your-team/repo"
        required
        disabled={closed || pending}
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      {(initialSubmission?.repo_url || repoUrl) && (
        <div className="mt-2 text-xs font-mono text-[#8A8A84] break-all">
          <span className="text-[#8A8A84]">Submitted Repo: </span>
          <a
            href={initialSubmission?.repo_url || repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#00E0FF] underline hover:text-white transition-colors"
          >
            {initialSubmission?.repo_url || repoUrl}
          </a>
        </div>
      )}

      <label className="mb-2 mt-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#8A8A84]">
        {phaseName === "phase_2"
          ? "Architecture Notes"
          : "System Description"}
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

      <button
        type="submit"
        className="fl-btn-primary mt-6 w-full"
        disabled={closed || pending}
      >
        {pending ? "Submitting..." : submitLabel}
      </button>

      {closed && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2318]">
          {disabledMessage ||
            (phase?.status === "active"
              ? "Submission deadline has passed."
              : phase?.status === "closed"
                ? "Organizers have stopped submissions for this phase."
                : "This phase has not started yet.")}
        </p>
      )}

      {result && (
        <p
          className={`mt-4 font-mono text-[10px] uppercase tracking-[0.2em] ${
            submitOk ? "text-[#F5F5F0]" : "text-[#FF2318]"
          }`}
        >
          {result}
        </p>
      )}
    </form>
  );
}