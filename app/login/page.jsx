import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

function LoginFallback() {
  return (
    <section className="mx-auto max-w-lg space-y-6 rounded border border-slate-800 p-6">
      <h1 className="text-2xl font-semibold">FaultLine — Demo login</h1>
      <p className="text-sm text-slate-400">Loading…</p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
