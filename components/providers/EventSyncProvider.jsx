"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/http/client";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const EventSyncContext = createContext(null);

const POLL_MS = 15000;

export function EventSyncProvider({
  children,
  initialPhases = [],
  initialUnread = 0,
  teamId = null,
  publicMode = false
}) {
  const [phases, setPhases] = useState(initialPhases);
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  const [swap, setSwap] = useState(null);
  const [activity, setActivity] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const tasks = [apiFetch("/api/live")];
      if (!publicMode) {
        tasks.push(apiFetch("/api/notifications"));
        if (teamId) tasks.push(apiFetch("/api/swap"));
      }
      const results = await Promise.all(tasks);
      const [live, notif, swapRes] = results;
      setPhases(live.phases || []);
      setActivity(live.activity || []);
      if (!publicMode) {
        setUnreadCount(notif?.unread_count ?? 0);
        if (swapRes) setSwap(swapRes);
      }
    } catch {
      /* keep last good state */
    }
  }, [teamId, publicMode]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      const channel = supabase
        .channel("event_sync")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "activity_feed", filter: "public=eq.true" },
          (payload) => setActivity((prev) => [payload.new, ...prev].slice(0, 50))
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      return undefined;
    }
  }, []);

  const value = useMemo(
    () => ({
      phases,
      unreadCount,
      swap,
      activity,
      refresh,
      getPhase: (name) => phases.find((p) => p.name === name) || null
    }),
    [phases, unreadCount, swap, activity, refresh]
  );

  return <EventSyncContext.Provider value={value}>{children}</EventSyncContext.Provider>;
}

export function useEventSync() {
  const ctx = useContext(EventSyncContext);
  if (!ctx) throw new Error("useEventSync must be used within EventSyncProvider");
  return ctx;
}
