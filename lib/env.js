import { DEMO_MODE } from "@/lib/demo";

export { getAllowedEmailDomain, isAllowedParticipantEmail } from "./email-domain";

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

export function isUpstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Validate required env; throws in production when misconfigured. */
export function assertRuntimeEnv() {
  const missing = [];
  if (!process.env.NEXTAUTH_SECRET) missing.push("NEXTAUTH_SECRET");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SECRET_KEY) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  if (missing.length && isProductionRuntime()) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (isProductionRuntime() && !DEMO_MODE && !isUpstashConfigured()) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production (non-demo)."
    );
  }

  if (isProductionRuntime() && !DEMO_MODE) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required when demo login is off.");
    }
  }

  return { demoMode: DEMO_MODE, upstash: isUpstashConfigured(), missing };
}

export const APP_VERSION = process.env.npm_package_version || "0.1.0";
