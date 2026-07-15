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

export default function Countdown({ deadline, label = "Closes in", className = "", compact = false }) {
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
    return <span className={`font-mono text-2xl font-bold text-fl-accent ${className}`}>{remaining}</span>;
  }

  return (
    <div className={`fl-card px-6 py-4 text-center ${className}`}>
      {label ? <div className="fl-label mb-2">{label}</div> : null}
      <div className="font-mono text-3xl font-bold text-fl-accent">{remaining}</div>
    </div>
  );
}
