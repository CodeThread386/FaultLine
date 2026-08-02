export default function DashboardWelcome({ userName }) {
  return (
    <div className="px-10 py-10">
      <div className="mb-10 max-w-2xl">
        <p className="fl-label mb-3">Welcome to FaultLine</p>
        <h1 className="fl-display text-[clamp(2rem,5vw,3rem)] leading-tight">
          Hey{userName ? `, ${userName.split(" ")[0]}` : ""} — your team assignment is ready
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-fl-muted">
          Team number, team name, and track are pre-assigned for this event. Your dashboard will show the assigned team automatically.
        </p>
      </div>
    </div>
  );
}
