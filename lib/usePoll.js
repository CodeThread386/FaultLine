"use client";

import { useEffect, useState } from "react";

export function usePoll(fetchFn, intervalMs) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const result = await fetchFn();
        if (isMounted) setData(result);
      } catch (e) {
        if (isMounted) setError("Failed to refresh data");
      }
    };

    run();
    const id = setInterval(run, intervalMs);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [fetchFn, intervalMs]);

  return { data, error };
}
