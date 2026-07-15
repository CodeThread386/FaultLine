"use client";

import { useCallback, useState } from "react";
import { apiFetch } from "@/lib/http/client";
import { usePoll } from "@/lib/usePoll";

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Same UI as /dashboard/notifications — used by participants and organizer preview.
 * When manageable, organizer can remove one or all (stored in DB).
 */
export default function ParticipantNotificationsPanel({
  apiUrl = "/api/notifications",
  deleteUrl = "/api/organizer/notifications",
  pollMs = 30000,
  embedded = false,
  refreshKey = 0,
  manageable = false,
  onMutate
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const url = refreshKey ? `${apiUrl}?r=${refreshKey}` : apiUrl;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load notifications");
    return res.json();
  }, [apiUrl, refreshKey]);

  const { data, error } = usePoll(fetchNotifications, pollMs);
  const notifications = data?.notifications || [];

  const bump = () => {
    if (onMutate) onMutate();
  };

  const removeOne = async (id) => {
    if (!manageable || deletingId) return;
    setDeletingId(id);
    try {
      await apiFetch(`${deleteUrl}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      bump();
    } catch (e) {
      alert(e.message || "Could not delete notification");
    } finally {
      setDeletingId(null);
    }
  };

  const removeAll = async () => {
    if (!manageable || clearingAll || !notifications.length) return;
    if (!window.confirm("Remove all notifications for every participant?")) return;
    setClearingAll(true);
    try {
      await apiFetch(`${deleteUrl}?all=1`, { method: "DELETE" });
      bump();
    } catch (e) {
      alert(e.message || "Could not clear notifications");
    } finally {
      setClearingAll(false);
    }
  };

  const header = (
    <div className={embedded ? "border-b border-fl-border px-4 py-5" : "border-b border-fl-border px-10 py-8"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={embedded ? "fl-display text-lg" : "fl-display text-2xl"}>
            Notifications
          </h2>
          <p className="mt-1 text-sm text-fl-muted">
            {manageable
              ? "Stored in database · visible to all participants"
              : "Organizer broadcasts"}{" "}
            · {data?.unread_count ? `${data.unread_count} unread` : "All caught up"}
          </p>
          {embedded && (
            <p className="mt-2 text-xs text-fl-muted">
              {manageable
                ? "Remove items here to delete them for everyone."
                : "Live preview — same list every participant sees."}
            </p>
          )}
        </div>
        {manageable && notifications.length > 0 && (
          <button
            type="button"
            disabled={clearingAll || !!deletingId}
            onClick={removeAll}
            className="shrink-0 rounded-sm border border-fl-border px-3 py-1.5 text-xs font-bold text-fl-accent hover:bg-fl-bg3 disabled:opacity-50"
          >
            {clearingAll ? "Clearing…" : "Clear all"}
          </button>
        )}
      </div>
    </div>
  );

  const list = (
    <div className={embedded ? "max-h-[420px] overflow-y-auto px-4 py-4" : "px-10 py-6"}>
      {error && (
        <p className="mb-4 text-center text-sm text-fl-red">Could not refresh notifications.</p>
      )}
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
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-fl-border" : "bg-fl-accent"}`}
            />
            <div className="min-w-[80px] shrink-0 font-mono text-[11px] text-fl-muted">
              {formatTime(n.created_at)}
            </div>
            <p className={`flex-1 text-sm leading-relaxed ${n.read ? "text-fl-muted" : "text-fl-text"}`}>
              {n.message}
            </p>
            {manageable && (
              <button
                type="button"
                disabled={deletingId === n.id || clearingAll}
                onClick={() => removeOne(n.id)}
                className="shrink-0 self-start rounded px-2 py-1 text-xs font-semibold text-fl-muted hover:bg-fl-bg3 hover:text-fl-accent disabled:opacity-50"
                title="Remove for all participants"
              >
                {deletingId === n.id ? "…" : "Remove"}
              </button>
            )}
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
