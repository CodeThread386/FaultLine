import GoogleProvider from "next-auth/providers/google";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getDashboardForRoles, pickPrimaryRole } from "@/lib/roles";
import { isAdminEmail } from "@/lib/admin-emails";
import { isParticipantEmail } from "@/lib/participant-emails";
import { upsertUserFromGoogle } from "@/lib/auth-users";

const USER_SELECT = "id, name, email, role";

/*
function resolveLoginNumber(user) {
  if (user?.login_number != null) return user.login_number;
  const m = user?.email?.match(/^login-(\d+)@/);
  return m ? Number(m[1]) : null;
}

async function findUserByLoginNumber(db, loginNumber) {
  const { data: byEmail, error } = await db
    .from("users")
    .select(USER_SELECT)
    .eq("email", demoEmail(loginNumber))
    .maybeSingle();

  if (error) {
    logError("auth.lookup", error);
    return null;
  }
  return byEmail;
}
*/

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
];

const ROLE_REFRESH_MS = 5 * 60 * 1000;

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60
  },
  jwt: {
    maxAge: 12 * 60 * 60
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return false;

      const db = getSupabaseServerClient();
      const email = String(user.email).toLowerCase().trim();
      let normalizedRole = null;

      if (isAdminEmail(email)) {
        normalizedRole = "admin";
      } else if (isParticipantEmail(email)) {
        normalizedRole = "user";
      } else {
        return false;
      }

      if (account?.provider === "google") {
        const result = await upsertUserFromGoogle(db, {
          email,
          name: profile?.name || user.name || email.split("@")[0]
        });
        if (result?.error) return false;
        user.id = result.user.id;
        user.role = normalizedRole;
        user.roles = [result.user.role, normalizedRole].filter(Boolean);
        user.loginNumber = null;
      } else {
        const fallbackDbUser = await db
          .from("users")
          .select("id, name, email, role")
          .eq("email", email)
          .maybeSingle();
        if (fallbackDbUser.data?.id) {
          user.id = fallbackDbUser.data.id;
        }
        user.role = normalizedRole;
        user.roles = [user.role || "participant", normalizedRole].filter(Boolean);
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        const normalizedRole = isAdminEmail(user.email)
          ? "admin"
          : isParticipantEmail(user.email)
            ? "user"
            : null;
        if (!normalizedRole) return token;
        token.id = user.id;
        token.roles = user.roles || (user.role ? [user.role] : []);
        token.role = normalizedRole;
        token.email = user.email;
        token.name = user.name;
        token.loginNumber = user.loginNumber;
        token.rolesSyncedAt = Date.now();
        return token;
      }

      if (!token.id) return token;

      const privileged = (token.roles || []).some((r) => r === "organizer");
      const maxAgeMs = privileged ? ROLE_REFRESH_MS : 30 * 60 * 1000;
      const stale =
        !token.roles?.length ||
        !token.rolesSyncedAt ||
        Date.now() - Number(token.rolesSyncedAt) > maxAgeMs;

      if (!stale && trigger !== "update") {
        return token;
      }

      const db = getSupabaseServerClient();
      const { data } = await db
        .from("users")
        .select("id, role, email, name")
        .eq("id", token.id)
        .maybeSingle();

      if (data) {
        const { data: roleRows } = await db
          .from("user_roles")
          .select("role")
          .eq("user_id", data.id);
        const roles = (roleRows || []).map((r) => r.role);
        if (!roles.length && data.role) roles.push(data.role);

        const normalizedRole = isAdminEmail(data.email)
          ? "admin"
          : isParticipantEmail(data.email)
            ? "user"
            : null;
        if (!normalizedRole) return token;
        const baseRoles = (roleRows || []).map((r) => r.role);
        token.roles = [...new Set([...(baseRoles.length ? baseRoles : data.role ? [data.role] : []), normalizedRole])];
        token.role = normalizedRole;
        token.email = data.email;
        token.name = data.name ?? token.name;
        token.loginNumber = resolveLoginNumber(data);
        token.rolesSyncedAt = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || (isAdminEmail(token.email) ? "admin" : isParticipantEmail(token.email) ? "user" : null);
        session.user.roles = token.roles || (token.role ? [token.role] : []);
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.loginNumber = token.loginNumber;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const safeBase = baseUrl.replace(/\/$/, "");

      if (url.startsWith("/")) {
        return `${safeBase}${url}`;
      }

      try {
        const target = new URL(url);
        const base = new URL(safeBase);
        if (target.origin === base.origin) return url;
      } catch {
        // fall through
      }

      return `${safeBase}/post-login`;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export { pickPrimaryRole, getDashboardForRoles };
