/** Minimal structured logging for server routes (Vercel captures stdout). */
export function logError(scope, err, extra = {}) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(
    JSON.stringify({
      level: "error",
      scope,
      message,
      ...extra,
      ts: new Date().toISOString()
    })
  );
}

export function logWarn(scope, message, extra = {}) {
  console.warn(
    JSON.stringify({
      level: "warn",
      scope,
      message,
      ...extra,
      ts: new Date().toISOString()
    })
  );
}
