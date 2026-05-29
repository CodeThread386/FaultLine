import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="space-y-5">
      <h1 className="text-4xl font-bold text-cyan-300">FaultLine</h1>
      <p className="max-w-2xl text-slate-300">
        Build, swap, rebuild, and present. FaultLine is a one-day technical event platform with
        role-based dashboards for participants, judges, and organizers.
      </p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-950">
          Sign in
        </Link>
        <Link href="/live" className="rounded border border-slate-700 px-4 py-2 text-slate-100">
          View live schedule
        </Link>
      </div>
    </section>
  );
}
