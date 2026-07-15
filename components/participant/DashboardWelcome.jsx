import Link from "next/link";
import { DEMO_MODE } from "@/lib/demo";

export default function DashboardWelcome({ userName }) {
  return (
    <div className="px-10 py-10">
      <div className="mb-10 max-w-2xl">
        <p className="fl-label mb-3">Welcome to FaultLine</p>
        <h1 className="fl-display text-[clamp(2rem,5vw,3rem)] leading-tight">
          Hey{userName ? `, ${userName.split(" ")[0]}` : ""} — no team linked to this login
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-fl-muted">
          {DEMO_MODE
            ? "Teams are pre-assigned for the demo. Ask the organizer if your login number should be on a team."
            : "Your team leader must register before anyone can submit."}
        </p>
      </div>

      {!DEMO_MODE && (
        <div className="fl-card fl-accent-bar max-w-xl p-6">
          <h2 className="fl-display text-xl">Team leaders — start here</h2>
          <Link href="/dashboard/register" className="fl-btn-primary mt-6 inline-block w-auto px-8">
            Register Your Team →
          </Link>
        </div>
      )}
    </div>
  );
}
