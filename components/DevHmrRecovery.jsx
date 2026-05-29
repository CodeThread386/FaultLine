"use client";

import { useEffect } from "react";

const RELOAD_KEY = "faultline-dev-reload";

/**
 * In dev, a stale webpack chunk after fast saves can unload CSS and leave a black/unstyled page.
 * Recover once automatically instead of requiring a manual hard refresh.
 */
export default function DevHmrRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const shouldRecover = (message = "") => {
      const m = String(message);
      return (
        m.includes("ChunkLoadError") ||
        m.includes("Loading chunk") ||
        m.includes("Failed to fetch dynamically imported module") ||
        m.includes("Cannot find module") ||
        m.includes("CSS chunk")
      );
    };

    const recover = (message) => {
      if (!shouldRecover(message)) return;
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const onError = (event) => recover(event?.message || event?.error?.message);
    const onRejection = (event) => recover(event?.reason?.message || event?.reason);

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      sessionStorage.removeItem(RELOAD_KEY);
    };
  }, []);

  return null;
}
