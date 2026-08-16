import GoogleProvider from "next-auth/providers/google";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getDashboardForRoles, pickPrimaryRole } from "@/lib/roles";
import { isAdminEmail } from "@/lib/admin-emails";
import { getMembershipByEmail } from "@/lib/team-lookup";
import { upsertUserFromGoogle } from "@/lib/auth-users";

const USER_SELECT = "id, name, email, role";

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
      } else {
        const membership = await getMembershipByEmail(db, email);
        if (!membership) {
          return "/login?error=not_registered";
        }
        const team = membership.team_members?.[0]?.teams;
        if (!team?.registered) {
          return "/login?error=pending_approval";
        }
        normalizedRole = "user";
      }

      if (account?.provider === "google") {
        const result = await upsertUserFromGoogle(db, {
          email,
          name: profile?.name || user.name || email.split("@")[0]
        });
        if (result?.error) {
          console.error("GOOGLE AUTH ERROR:", result.error);
          return false;
        }
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
        if (!user.role) return token;
        token.id = user.id;
        token.roles = user.roles || (user.role ? [user.role] : []);
        token.role = user.role;
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
        .select("id, role, email, name, login_number")
        .eq("id", token.id)
        .maybeSingle();

      if (data) {
        const { data: roleRows } = await db
          .from("user_roles")
          .select("role")
          .eq("user_id", data.id);
        const baseRoles = (roleRows || []).map((r) => r.role);

        let normalizedRole = null;
        if (isAdminEmail(data.email)) {
          normalizedRole = "admin";
        } else {
          const membership = await getMembershipByEmail(db, data.email);
          const team = membership?.team_members?.[0]?.teams;
          normalizedRole = team?.registered ? "user" : null;
        }
        if (!normalizedRole) return token;

        token.roles = [...new Set([...(baseRoles.length ? baseRoles : data.role ? [data.role] : []), normalizedRole])];
        token.role = normalizedRole;
        token.email = data.email;
        token.name = data.name ?? token.name;
        token.loginNumber = data.login_number ?? null;
        token.rolesSyncedAt = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || null;
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