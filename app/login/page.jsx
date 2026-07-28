import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

function LoginFallback() {
  return (
    <main className="min-h-screen bg-black text-[#F5F5F0] flex items-center justify-center">
      <section className="w-full max-w-md border border-[#F5F5F0]/10 bg-black p-10 relative">
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#F5F5F0]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#F5F5F0]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#F5F5F0]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#F5F5F0]" />

        <p className="font-mono uppercase tracking-[0.25em] text-xs text-white/60 mb-4">
          Authentication
        </p>

        <h1
          className="text-5xl italic uppercase mb-4"
          style={{ fontFamily: "Bodoni Moda, serif" }}
        >
          Clearance
        </h1>

        <p className="font-mono text-sm text-white/60">
          Loading authentication interface...
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}