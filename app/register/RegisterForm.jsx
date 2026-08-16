"use client";

import { useState } from "react";
import Link from "next/link";
import { TRACKS, TRACK_META } from "@/lib/tracks-meta";

const RED = "#ff0000";
const CYAN = "#00f0ff";

function Corners() {
  return (
    <>
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#ff0000]" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#ff0000]" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#ff0000]" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#FF0000]" />
    </>
  );
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    registerNumber: "",
    name: "",
    email: "",
    phone: "",
    track: TRACKS[0] || "Banking"
  });

  // Default to 2 teammates (Total Team Size = 3 members: 1 Leader + 2 Teammates)
  const [teammateCount, setTeammateCount] = useState(2);
  const [teammates, setTeammates] = useState([
    { name: "", registerNumber: "", email: "", phone: "" },
    { name: "", registerNumber: "", email: "", phone: "" }
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeammateCountChange = (count) => {
    const newCount = Math.max(2, Math.min(4, count));
    setTeammateCount(newCount);

    setTeammates((prev) => {
      const updated = [...prev];
      if (newCount > updated.length) {
        for (let i = updated.length; i < newCount; i++) {
          updated.push({ name: "", registerNumber: "", email: "", phone: "" });
        }
      } else {
        updated.splice(newCount);
      }
      return updated;
    });
  };

  const handleTeammateFieldChange = (index, field, value) => {
    setTeammates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessData(null);

    const totalMembers = 1 + teammateCount;
    if (totalMembers < 3 || totalMembers > 5) {
      setErrorMsg("A team must consist of minimum 3 and maximum 5 members.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      teammateCount,
      teammates
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Registration failed. Please check details.");
      } else {
        setSuccessData(data.registration);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden bg-[#0a0a0a] text-[#f5f5f0]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(0 224 255 / 15%) 1px, transparent 1px), repeating-radial-gradient(circle at center, transparent 0, transparent 120px, rgb(0 224 255 / 4%) 121px, transparent 122px)",
        backgroundSize: "32px 32px, 100% 100%",
        fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif"
      }}
    >
      {/* Background Decorative Graphic Overlays */}
      <svg
        className="absolute top-10 left-10 w-28 h-28 opacity-[0.08] pointer-events-none"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke="#00E0FF" strokeWidth="1" strokeDasharray="8,6" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#00E0FF" strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#00E0FF" strokeWidth="1" />
      </svg>
      <svg
        className="absolute bottom-10 right-10 w-40 h-40 opacity-[0.06] pointer-events-none"
        viewBox="0 0 100 100"
      >
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#00E0FF" strokeWidth="1" strokeDasharray="4,16" />
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#00E0FF" strokeWidth="1" />
      </svg>

      <section className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="mb-10 w-full text-center">
          <p
            className="mb-4 text-xs tracking-[0.3em] uppercase text-white/70"
            style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
          >
            <span className="text-[#00E0FF] font-bold mr-1">{"///"}</span> TEAM REGISTRATION (3 TO 5 MEMBERS)
          </p>

          <h1
            className="text-[clamp(3rem,8vw,5.5rem)] uppercase leading-[0.9]"
            style={{
              fontFamily: "'Clarendon', 'Rockwell', 'Arvo', serif",
              fontWeight: 700,
              letterSpacing: "-0.03em"
            }}
          >
            <span className="relative inline-block isolate">
              <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  color: RED,
                  transform: "translate(-3px, 2px)"
                }}
              >
                REGISTER
              </span>

              <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  color: CYAN,
                  transform: "translate(3px, -2px)"
                }}
              >
                REGISTER
              </span>

              REGISTER
            </span>
          </h1>
        </div>

        {/* Main Form Box */}
        <div className="relative w-full p-8 md:p-12 border border-[#00E0FF]/20 bg-black/80 backdrop-blur-sm">
          <Corners />

          {/* Success Banner */}
          {successData ? (
            <div className="flex flex-col gap-6 py-4">
              <div
                className="border-l-[4px] border-[#00E0FF] bg-[#00E0FF]/10 p-5 text-left"
                style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[#00E0FF] mb-1 font-bold">
                  {"/// REGISTRATION SUCCESSFUL"}
                </p>
                <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-1">
                  TEAM REGISTRATION CONFIRMED
                </h3>
                <p className="text-xs uppercase text-[#00E0FF] tracking-widest mb-3">
                  TOTAL TEAM SIZE: {successData.total_team_size} MEMBERS
                </p>
                <div className="text-sm text-white/80 space-y-2 border-t border-white/10 pt-3">
                  <p>
                    <span className="text-white/50">LEADER REGISTER NO:</span>{" "}
                    <strong className="text-[#00E0FF]">{successData.register_number}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">LEADER NAME:</span>{" "}
                    <strong>{successData.name}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">LEADER EMAIL:</span>{" "}
                    <strong>{successData.email}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">LEADER PHONE:</span>{" "}
                    <strong>{successData.phone}</strong>
                  </p>
                  <p>
                    <span className="text-white/50">TRACK:</span>{" "}
                    <strong className="text-[#00E0FF]">{successData.track}</strong>
                  </p>
                  {successData.teammate_count > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/20">
                      <p className="text-xs uppercase text-[#00E0FF] font-bold mb-2">
                        REGISTERED TEAMMATES ({successData.teammate_count})
                      </p>
                      <div className="space-y-2 pl-2 border-l border-[#00E0FF]/40">
                        {successData.teammates.map((tm, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-white/50">#{idx + 1}:</span>{" "}
                            <strong>{tm.name}</strong> ({tm.register_number})
                            {tm.email && <span className="text-white/60"> — {tm.email}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/login"
                  className="group flex-1 flex items-center justify-center border-[4px] border-white bg-black py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[6px_6px_0_0_#00E0FF] transition-all duration-200 hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  Proceed to Login →
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="px-6 py-4 font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-[#00E0FF] text-white/70 hover:text-[#00E0FF] transition-colors"
                >
                  Register Another Team
                </button>
              </div>
            </div>
          ) : (
            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              {/* Error Banner */}
              {errorMsg && (
                <p
                  className="border-l-[3px] border-[#FF2318] bg-[#FF2318]/10 pl-4 py-3 text-xs tracking-wide uppercase text-[#FF2318]"
                  style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                >
                  {errorMsg}
                </p>
              )}

              {/* PRIMARY REGISTRANT / LEADER SECTION */}
              <div className="pb-4 border-b border-white/10">
                <p
                  className="text-xs uppercase tracking-[0.3em] text-[#00E0FF] mb-4 font-bold"
                  style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                >
                  <span className="text-[#00E0FF] mr-1">{"///"}</span> LEADER / PRIMARY DETAILS
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field: Register Number */}
                  <div>
                    <label
                      htmlFor="registerNumber"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Register Number <span className="text-[#FF2318]">*</span>
                    </label>
                    <input
                      id="registerNumber"
                      name="registerNumber"
                      type="text"
                      required
                      placeholder="e.g. 21BCE0001"
                      value={formData.registerNumber}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00E0FF] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field: Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Full Name <span className="text-[#FF2318]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00E0FF] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field: Email ID */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Email ID <span className="text-[#FF2318]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00E0FF] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field: Phone no */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      Leader Phone No <span className="text-[#FF2318]">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/20 focus:border-[#00E0FF] px-4 py-3.5 text-base font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Field: Track Selection */}
                <div className="mt-4">
                  <label
                    htmlFor="track"
                    className="block mb-2 text-xs tracking-[0.25em] uppercase text-white/60"
                    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                  >
                    Track <span className="text-[#FF2318]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="track"
                      name="track"
                      value={formData.track}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 focus:border-[#00E0FF] px-4 py-3.5 text-base font-mono text-[#f5f5f0] focus:outline-none appearance-none cursor-pointer transition-colors"
                    >
                      {TRACKS.map((t) => {
                        const meta = TRACK_META[t];
                        return (
                          <option key={t} value={t} className="bg-black text-white py-2">
                            {meta?.icon ? `${meta.icon} ` : ""}{t} {meta?.desc ? `— ${meta.desc}` : ""}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/60 font-mono text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* TOTAL TEAM SIZE SELECTION */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="text-xs tracking-[0.25em] uppercase text-white/60"
                    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                  >
                    <span className="text-[#00E0FF] mr-1">{"///"}</span> Total Team Size (Min 3, Max 5 People)
                  </label>
                  <span className="text-xs font-mono text-[#00E0FF] font-bold">
                    {1 + teammateCount} Members Selected
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { total: 3, teammates: 2, label: "3 Members" },
                    { total: 4, teammates: 3, label: "4 Members" },
                    { total: 5, teammates: 4, label: "5 Members" }
                  ].map((option) => (
                    <button
                      key={option.total}
                      type="button"
                      onClick={() => handleTeammateCountChange(option.teammates)}
                      className={`py-3.5 px-2 font-mono text-xs md:text-sm font-bold uppercase transition-all border-2 ${
                        teammateCount === option.teammates
                          ? "border-[#00E0FF] bg-[#00E0FF] text-black shadow-[4px_4px_0_0_white]"
                          : "border-white/20 bg-black text-white/70 hover:border-[#00E0FF] hover:text-[#00E0FF]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC TEAMMATE TEXTBOXES */}
              <div className="space-y-6 pt-2">
                {teammates.map((tm, idx) => (
                  <div
                    key={idx}
                    className="p-5 border border-white/20 border-l-4 border-l-[#00E0FF] bg-black/60 relative animate-in fade-in slide-in-from-top-2"
                  >
                    <p
                      className="text-xs uppercase tracking-[0.25em] text-[#00E0FF] font-bold mb-4"
                      style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                    >
                      <span className="text-[#00E0FF] mr-1">{"///"}</span> {`TEAMMATE #${idx + 1} DETAILS`}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Name <span className="text-[#FF2318]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`e.g. Teammate ${idx + 1} Name`}
                          value={tm.name}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "name", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00E0FF] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Register No <span className="text-[#FF2318]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 21BCE0002"
                          value={tm.registerNumber}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "registerNumber", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00E0FF] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Email ID
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. teammate@example.com"
                          value={tm.email}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "email", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00E0FF] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 text-xs tracking-[0.2em] uppercase text-white/50"
                          style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
                        >
                          Teammate #{idx + 1} Phone No
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 9876543211"
                          value={tm.phone}
                          onChange={(e) =>
                            handleTeammateFieldChange(idx, "phone", e.target.value)
                          }
                          className="w-full bg-black/80 border border-white/20 focus:border-[#00E0FF] px-3.5 py-3 text-sm font-mono text-[#f5f5f0] placeholder:text-white/25 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full mt-6 flex items-center justify-center border-[5px] border-white bg-black py-5 font-mono text-lg font-bold uppercase tracking-[0.2em] text-white shadow-[8px_8px_0_0_white] transition-all duration-200 disabled:opacity-50 hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black hover:shadow-none hover:translate-x-2 hover:translate-y-2"
              >
                {loading ? "Processing..." : "EXECUTE // REGISTER TEAM"}
              </button>

              {/* Login Redirect Footer */}
              <div className="pt-4 text-center border-t border-white/10">
                <p className="text-xs font-mono uppercase text-white/60">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="text-[#00E0FF] hover:underline font-bold tracking-wider transition-colors"
                  >
                    LOG IN HERE
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
