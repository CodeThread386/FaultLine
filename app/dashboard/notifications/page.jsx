"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ParticipantNotificationsPanel from "@/components/notifications/ParticipantNotificationsPanel";

export default function NotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    })
      .then(() => router.refresh())
      .catch(() => {});
  }, [router]);

  return <ParticipantNotificationsPanel />;
}
