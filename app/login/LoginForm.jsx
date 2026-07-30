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

const RED = "#ff2318";
const CYAN = "#00e0ff";
const TEXT = "#f5f5f0";

function Corners() {
  return (
    <>
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#f5f5f0]" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#f5f5f0]" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#f5f5f0]" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#f5f5f0]" />
    </>
  );
}

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
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0a] text-[#f5f5f0]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(245 245 240 / 18%) 1px, transparent 1px), repeating-radial-gradient(circle at center, transparent 0, transparent 120px, rgb(245 245 240 / 5.5%) 121px, transparent 122px)",
        backgroundSize: "32px 32px, 100% 100%",
        fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif"
      }}
    >
      {/* Faint static reticles */}
      <svg className="absolute top-10 left-10 w-28 h-28 opacity-[0.06] pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8,6" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-10 right-10 w-40 h-40 opacity-[0.05] pointer-events-none" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,16" />
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      <section className="w-full max-w-xl relative z-10 flex flex-col items-center">

{/* Headline */}
<div className="mb-12 w-full text-center">
  <p
    className="mb-4 text-xs tracking-[0.3em] uppercase text-white/60"
    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
  >
    Authentication
  </p>

  <h1
    className="text-[clamp(3.5rem,10vw,6.5rem)] uppercase leading-[0.9]"
    style={{
      fontFamily: "'Clarendon', 'Rockwell', 'Arvo', serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    }}
  >
    <span className="relative inline-block isolate">
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          color: RED,
          transform: "translate(-3px, 2px)",
        }}
      >
        LOG
      </span>

      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          color: CYAN,
          transform: "translate(3px, -2px)",
        }}
      >
        LOG
      </span>

      LOG
    </span>{" "}

    <span className="relative inline-block isolate">
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          color: RED,
          transform: "translate(-3px, 2px)",
        }}
      >
        IN
      </span>

      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          color: CYAN,
          transform: "translate(3px, -2px)",
        }}
      >
        IN
      </span>

      IN
    </span>
  </h1>
</div>

        {/* Card */}
        <div className="relative w-full p-10 md:p-14 border border-white/10 bg-transparent">
          <Corners />

          {loggedOut && (
            <p
              className="mb-6 border-l-[3px] border-[#f5f5f0] pl-4 py-3 text-sm tracking-wide uppercase"
              style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
            >
              Session destroyed.
            </p>
          )}
          {(error || message) && (
            <p
              className="mb-6 border-l-[3px] pl-4 py-3 text-sm tracking-wide uppercase"
              style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace", borderColor: RED, color: RED }}
            >
              {message || decodeURIComponent(error)}
            </p>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-8">
              <label
                htmlFor="loginNumber"
                className="block mb-4 text-xs tracking-[0.3em] uppercase text-white/60"
                style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
              >
                Clearance code
              </label>
              <input
                id="loginNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                className="w-full bg-transparent border-0 border-b-2 border-white/25 py-5 text-[3.5rem] font-bold leading-none focus:outline-none placeholder:text-white/15 transition-colors"
                style={{
                  fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
                  color: TEXT
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = CYAN)}
                onBlur={(e) => (e.target.style.borderBottomColor = "")}
                placeholder="000"
                value={loginNumber}
                onChange={(e) => setLoginNumber(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

           <button
  type="submit"
  disabled={loading}
  className="group w-full mt-4 flex items-center justify-center border-[5px] border-white bg-black py-5 font-mono text-lg font-bold uppercase tracking-[0.2em] text-white shadow-[8px_8px_0_0_white] transition-all duration-200 disabled:opacity-50 hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black hover:shadow-none hover:translate-x-2 hover:translate-y-2"
>
  {loading ? "///" : <>Execute // Login</>}
</button>
          </form>

          <div
            className="mt-12 pt-8 border-t border-dashed border-white/20 text-sm leading-relaxed text-white/60"
            style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
          >
            <span
              className="inline-block border px-2 py-1 text-xs tracking-[0.2em] uppercase mb-2"
              style={{ borderColor: RED, color: RED }}
            >
              Participants ({DEMO_PARTICIPANT_COUNT})
            </span>
            <p className="mt-2 mb-6">
              {participantNums[0]}–{participantNums[participantNums.length - 1]} {"//"} {DEMO_TEAM_COUNT}{" "}
              teams, {MEMBERS_PER_TEAM} members (e.g. {roster[0]?.logins.join(", ")} = Team 1).
            </p>

            <span
              className="inline-block border px-2 py-1 text-xs tracking-[0.2em] uppercase mb-2"
              style={{ borderColor: RED, color: RED }}
            >
              Root access
            </span>
            <p className="mt-2">{STAFF_LOGIN_NUMBERS.organizer}</p>
          </div>
        </div>
      </section>
    </div>
  );
}