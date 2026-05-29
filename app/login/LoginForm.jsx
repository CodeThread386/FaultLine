"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  DEMO_PARTICIPANT_COUNT,
  DEMO_TEAM_COUNT,
  MEMBERS_PER_TEAM,
  participantLoginNumbers,
  STAFF_LOGIN_NUMBERS,
  teamRoster
} from "@/lib/login-codes";

export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get("error");
  const loggedOut = params.get("loggedOut");
  const callbackUrl = params.get("callbackUrl") || "/post-login";

  const [loginNumber, setLoginNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const participantNums = participantLoginNumbers();
  const roster = teamRoster();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signIn("login-number", {
      loginNumber: loginNumber.trim(),
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (result?.error) {
      setMessage("Invalid login number. Use your assigned number only.");
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-lg space-y-6 rounded border border-slate-800 p-6">
      <div>
        <h1 className="text-2xl font-semibold">FaultLine — Demo login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Enter your assigned number. No email or password for this rehearsal run.
        </p>
      </div>

      {loggedOut && (
        <p className="rounded bg-emerald-950/70 p-2 text-sm text-emerald-300">Logged out.</p>
      )}
      {(error || message) && (
        <p className="rounded bg-red-950/70 p-2 text-sm text-red-300">
          {message || "Login failed. Check your number and try again."}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="loginNumber" className="mb-1 block text-sm text-slate-400">
            Login number
          </label>
          <input
            id="loginNumber"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-3 text-center font-mono text-2xl tracking-widest text-white"
            placeholder="e.g. 7"
            value={loginNumber}
            onChange={(e) => setLoginNumber(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !loginNumber}
          className="w-full rounded bg-cyan-500 px-3 py-2 font-medium text-slate-950 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="space-y-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
        <p>
          <span className="font-semibold text-slate-300">
            Participants ({DEMO_PARTICIPANT_COUNT}):
          </span>{" "}
          {participantNums[0]}–{participantNums[participantNums.length - 1]} — {DEMO_TEAM_COUNT} teams,{" "}
          {MEMBERS_PER_TEAM} members each (e.g. {roster[0]?.logins.join(", ")} = team 1).
        </p>
        <p>
          <span className="font-semibold text-slate-300">Judges:</span>{" "}
          {STAFF_LOGIN_NUMBERS.judges.join(", ")}
        </p>
        <p>
          <span className="font-semibold text-slate-300">Organizer:</span>{" "}
          {STAFF_LOGIN_NUMBERS.organizer}
        </p>
      </div>
    </section>
  );
}
