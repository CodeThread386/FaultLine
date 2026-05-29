const buckets = new Map();

function rateLimitMemory(key, { limit = 120, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

/** Upstash Redis REST (optional). Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN. */
async function rateLimitUpstash(key, { limit = 120, windowMs = 60_000 } = {}) {
  const base = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return rateLimitMemory(key, { limit, windowMs });

  const redisKey = `rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const res = await fetch(`${base}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["TTL", redisKey]
      ]),
      signal: AbortSignal.timeout(2000)
    });

    if (!res.ok) return rateLimitMemory(key, { limit, windowMs });

    const body = await res.json();
    const count = Number(body?.[0]?.result ?? 0);
    const ttl = Number(body?.[1]?.result ?? -1);

    if (count === 1 || ttl < 0) {
      await fetch(`${base}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([["EXPIRE", redisKey, String(windowSec)]]),
        signal: AbortSignal.timeout(2000)
      });
    }

    if (count > limit) {
      return { ok: false, remaining: 0, retryAfterMs: windowMs };
    }
    return { ok: true, remaining: Math.max(0, limit - count) };
  } catch {
    return rateLimitMemory(key, { limit, windowMs });
  }
}

export async function rateLimit(key, options = {}) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return rateLimitUpstash(key, options);
  }
  return rateLimitMemory(key, options);
}

export function getClientKey(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return ip;
}
