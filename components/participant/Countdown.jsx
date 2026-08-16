"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms) {
  if (ms <= 0) return "0:00:00";

  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Countdown({
  deadline,
  label = "Submission Window",
  className = "",
  compact = false
}) {
  const [remaining, setRemaining] = useState("—");

  useEffect(() => {
    if (!deadline) return;

    const tick = () => {
      const ms = new Date(deadline).getTime() - Date.now();
      setRemaining(formatRemaining(ms));
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [deadline]);

  if (compact) {
    return (
      <span
        className={`font-mono text-base sm:text-lg md:text-2xl font-bold uppercase tracking-[0.05em] text-[#00E0FF] max-w-full truncate inline-block ${className}`}
      >
        {remaining}
      </span>
    );
  }

  return (
    <div className={`relative px-4 sm:px-8 py-4 sm:py-6 ${className}`}>
      {/* corner brackets */}
      <span className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b border-l border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-[#F5F5F0]" />

      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(245,245,240,0.5) 1px, transparent 1px)",
            backgroundSize: "18px 18px"
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        {label ? (
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[#FF2318]">
            {label}
          </div>
        ) : null}

        <div
          className="font-mono text-xl sm:text-3xl md:text-4xl font-bold tracking-[0.05em] text-[#00E0FF] max-w-full truncate"
          style={{
            textShadow: "-2px 2px 0 #FF2318"
          }}
        >
          {remaining}
        </div>
      </div>
    </div>
  );
}