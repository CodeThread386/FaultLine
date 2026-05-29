export default function HoldingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-10">
      <div className="max-w-md rounded-[10px] border border-fl-amber/30 bg-fl-amber/5 p-10 text-center">
        <div className="mb-4 text-5xl">⏳</div>
        <h1 className="text-2xl font-extrabold text-fl-amber">Registration Pending</h1>
        <p className="mt-3 text-sm leading-relaxed text-fl-muted">
          Your team leader has not completed registration yet. Ask your leader to register the team
          from the dashboard.
        </p>
      </div>
    </div>
  );
}
