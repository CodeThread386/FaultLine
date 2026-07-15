import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

function LoginFallback() {
  return (
    <section className="fl-glass space-y-6 rounded-sm border border-fl-border p-8">
      <p className="fl-label">Authentication</p>
      <h1 className="fl-display text-4xl">Sign in</h1>
      <p className="text-sm text-fl-muted">Loading…</p>
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
