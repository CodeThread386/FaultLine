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
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden bg-black text-white fl-dot-grid">
      <div className="fl-scanline"></div>
      
      {/* Target Reticles */}
      <svg className="absolute top-10 left-10 w-32 h-32 opacity-30 animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10,5"/>
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="1"/>
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1"/>
      </svg>

      <svg className="absolute bottom-10 right-10 w-48 h-48 opacity-20 pointer-events-none mix-blend-difference" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,20" className="animate-spin-slow"/>
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="1"/>
      </svg>
      
      <section className="w-full relative z-10 flex flex-col items-center">
        <div className="mb-16 relative w-full flex justify-center group perspective-1000">
          <h1 className="fl-display text-[8rem] md:text-[14rem] tracking-tighter text-white mix-blend-difference leading-[0.7] transform group-hover:-rotate-6 transition-transform duration-500 relative z-20" style={{ letterSpacing: "-0.1em" }}>
            <span className="block transform -translate-x-12 animate-jitter opacity-90">LOG</span>
            <span className="block text-transparent transform translate-x-12 -translate-y-8" style={{ WebkitTextStroke: "4px white" }}>
              IN
            </span>
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[5vh] bg-white mix-blend-difference rotate-12 animate-shake z-10 pointer-events-none"></div>
        </div>

        <div className="fl-card p-12 md:p-16 w-[95vw] md:w-full md:px-32 transform -rotate-2 hover:rotate-1 transition-transform relative z-30 bg-black border-[12px] border-white">
          {loggedOut && (
            <p className="mb-8 border-l-8 border-white pl-4 py-2 text-xl font-display uppercase font-black text-white animate-jitter">
              SESSION DESTROYED.
            </p>
          )}
          {(error || message) && (
            <p className="mb-8 border-l-8 border-white bg-white text-black pl-4 py-2 text-xl font-display uppercase font-black animate-shake shadow-[8px_8px_0_0_#ffffff]">
              {message || decodeURIComponent(error)}
            </p>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-12 relative group">
              <label htmlFor="loginNumber" className="block text-3xl font-display uppercase font-black text-white mix-blend-difference mb-4 transform -skew-x-12">
                CLEARANCE CODE
              </label>
              <input
                id="loginNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                className="w-full bg-transparent border-b-8 border-white py-6 text-left text-[5rem] font-display font-black text-white placeholder:text-white/20 focus:outline-none focus:bg-white focus:text-black transition-colors leading-none"
                placeholder="000"
                value={loginNumber}
                onChange={(e) => setLoginNumber(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="fl-btn-primary w-full transform rotate-1 hover:-rotate-1 text-4xl py-8"
            >
              {loading ? <span className="animate-jitter inline-block">{"///"}</span> : <>EXECUTE {"//"} LOGIN</>}
            </button>
          </form>

          <div className="mt-16 pt-8 text-sm font-display uppercase tracking-widest text-white/50 w-full relative">
            <div className="absolute top-0 left-[-2rem] right-[-2rem] border-t-4 border-dashed border-white/50"></div>
            <p className="mb-4">
              <span className="text-white font-black text-lg bg-white/20 px-2">&gt; PARTICIPANTS ({DEMO_PARTICIPANT_COUNT})</span>
              <br /><br />
              {participantNums[0]}–{participantNums[participantNums.length - 1]} {"//"} {DEMO_TEAM_COUNT}{" "}
              TEAMS, {MEMBERS_PER_TEAM} MEMBERS (e.g. {roster[0]?.logins.join(", ")} = TEAM 1).
            </p>

            <p>
              <span className="text-white font-black text-lg bg-white/20 px-2">&gt; ROOT_ACCESS</span>
              <br /><br />
              {STAFF_LOGIN_NUMBERS.organizer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
