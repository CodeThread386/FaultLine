"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterTeamPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="max-w-2xl px-10 py-10">
      <p className="fl-label mb-2">Registration</p>
      <h1 className="fl-display text-[clamp(1.75rem,4vw,2.25rem)]">Registration Disabled</h1>
      <p className="mt-3 text-sm text-fl-muted">
        Team assignments are pre-set for participants. You will be redirected back to your dashboard automatically.
      </p>
    </div>
  );
}
