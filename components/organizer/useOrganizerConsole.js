"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/http/client";

export const PHASE_ORDER = ["phase_1", "phase_2"];

export const PHASE_UI = {
  phase_1: { title: "Phase 1", sub: "Build worst system · repo link submission" },
  phase_2: { title: "Phase 2", sub: "Redemption rebuild · repo link submission" }
};

export const ORGANIZER_TABS = [
  { id: "home", label: "Home" },
  { id: "participants", label: "Participants" },
  { id: "marks", label: "Marks" }
];

export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function useOrganizerConsole() {
  const [tab, setTab] = useState("home");
  const [overview, setOverview] = useState(null);
  const [notifRefresh, setNotifRefresh] = useState(0);
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState("");
  const [deadlines, setDeadlines] = useState({ phase_1: "", phase_2: "" });
  const [scoreFilter, setScoreFilter] = useState("overall");

  const load = useCallback(async () => {
    try {
      const ov = await apiFetch("/api/organizer/overview");
      setOverview(ov);
      const dl = {};
      for (const name of PHASE_ORDER) {
        const p = (ov.phases || []).find((x) => x.name === name);
        if (p) dl[name] = toLocalInput(p.submission_deadline);
      }
      setDeadlines((prev) => ({ ...prev, ...dl }));
    } catch {
      /* keep last state */
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, [load]);

  const act = async (label, route, payload = {}) => {
    setBusy(label);
    setToast("");
    try {
      await apiFetch(route, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setToast(`✓ ${label}`);
      if (label.includes("Broadcast")) {
        setMsg("");
        setNotifRefresh((n) => n + 1);
      }
      await load();
    } catch (err) {
      setToast(err.message || "Failed");
    } finally {
      setBusy("");
    }
  };

  const startPhase = (phase) =>
    act(`Started ${PHASE_UI[phase]?.title}`, "/api/organizer/phase", { phase, action: "start" });

  const stopPhase = (phase) =>
    act(`Stopped ${PHASE_UI[phase]?.title}`, "/api/organizer/phase", { phase, action: "stop" });

  const saveDeadline = async (phase) => {
    if (!deadlines[phase]) {
      setToast("Pick a date and time first");
      return;
    }
    const label = `Deadline saved — ${PHASE_UI[phase]?.title}`;
    setBusy(label);
    setToast("");
    try {
      await apiFetch("/api/organizer/phase-deadline", {
        method: "POST",
        body: JSON.stringify({ phase, submission_deadline: deadlines[phase] })
      });
      setToast(`✓ ${label}`);
      await load();
    } catch (err) {
      setToast(err.message || "Failed");
    } finally {
      setBusy("");
    }
  };

  return {
    tab,
    setTab,
    overview,
    notifRefresh,
    msg,
    setMsg,
    toast,
    busy,
    deadlines,
    setDeadlines,
    scoreFilter,
    setScoreFilter,
    act,
    startPhase,
    stopPhase,
    saveDeadline,
    reload: load
  };
}
