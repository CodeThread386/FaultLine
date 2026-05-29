"use client";

import { useCallback } from "react";
import { usePoll } from "@/lib/usePoll";

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Same UI as /dashboard/notifications — used by participants and organizer preview.
 */
export default function ParticipantNotificationsPanel({
  apiUrl = "/api/notifications",
  pollMs = 30000,
  embedded = false,
  refreshKey = 0
}) {
  const fetchNotifications = useCallback(async () => {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load notifications");
    return res.json();
  }, [apiUrl, refreshKey]);

  const { data } = usePoll(fetchNotifications, pollMs);
  const notifications = data?.notifications || [];

  const header = (
    <div className={embedded ? "border-b border-fl-border px-4 py-5" : "border-b border-fl-border px-10 py-8"}>
      <h2 className={embedded ? "text-lg font-extrabold tracking-tight" : "text-2xl font-extrabold tracking-tight"}>
        Notifications
      </h2>
      <p className="mt-1 text-sm text-fl-muted">
        Organizer broadcasts · {data?.unread_count ? `${data.unread_count} unread` : "All caught up"}
      </p>
      {embedded && (
        <p className="mt-2 text-xs text-fl-muted">Live preview — same list every participant sees.</p>
      )}
    </div>
  );

  const list = (
    <div className={embedded ? "max-h-[420px] overflow-y-auto px-4 py-4" : "px-10 py-6"}>
      {!notifications.length ? (
        <p className={`text-center text-sm text-fl-muted ${embedded ? "py-12" : "py-16"}`}>
          No notifications yet.
        </p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className="flex gap-4 border-b border-fl-border py-5 last:border-0"
          >
            <div
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-fl-border" : "bg-fl-red"}`}
            />
            <div className="min-w-[80px] shrink-0 font-mono text-[11px] text-fl-muted">
              {formatTime(n.created_at)}
            </div>
            <p className={`text-sm leading-relaxed ${n.read ? "text-fl-muted" : "text-fl-text"}`}>
              {n.message}
            </p>
          </div>
        ))
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="fl-card flex h-full min-h-[480px] flex-col overflow-hidden p-0">
        {header}
        {list}
      </div>
    );
  }

  return (
    <>
      {header}
      {list}
    </>
  );
}
