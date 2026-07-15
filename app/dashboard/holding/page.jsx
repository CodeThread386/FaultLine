export default function HoldingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-10">
      <div className="fl-glass max-w-md rounded-sm border border-fl-border p-12 text-center fl-fade-up">
        <p className="fl-label mb-4">Pending</p>
        <h1 className="fl-display text-3xl text-fl-warn">Registration Pending</h1>
        <p className="mt-4 text-sm leading-relaxed text-fl-muted">
          Your team leader has not completed registration yet. Ask your leader to register the team
          from the dashboard.
        </p>
      </div>
    </div>
  );
}
