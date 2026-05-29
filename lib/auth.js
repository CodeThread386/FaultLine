import CredentialsProvider from "next-auth/providers/credentials";
import { demoEmail } from "@/lib/login-codes";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getDashboardForRoles, pickPrimaryRole } from "@/lib/roles";

const USER_SELECT = "id, name, email, role";

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
    console.error("[auth] user lookup failed:", error.message);
    return null;
  }
  return byEmail;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "login-number",
      name: "Login number",
      credentials: {
        loginNumber: { label: "Login number", type: "text" }
      },
      async authorize(credentials) {
        const raw = String(credentials?.loginNumber ?? "").trim();
        if (!/^\d{1,3}$/.test(raw)) return null;

        const loginNumber = Number(raw);
        if (!Number.isInteger(loginNumber) || loginNumber < 1 || loginNumber > 999) {
          return null;
        }

        const db = getSupabaseServerClient();
        const user = await findUserByLoginNumber(db, loginNumber);
        if (!user?.id) return null;

        const { data: roleRows } = await db
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        const roles = (roleRows || []).map((r) => r.role);
        if (!roles.length && user.role) roles.push(user.role);
        if (!roles.length) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          loginNumber: resolveLoginNumber(user),
          role: pickPrimaryRole(roles),
          roles
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60
  },
  jwt: {
    maxAge: 12 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles || (user.role ? [user.role] : []);
        token.role = user.role || pickPrimaryRole(token.roles);
        token.email = user.email;
        token.name = user.name;
        token.loginNumber = user.loginNumber;
        return token;
      }

      if (!token.id) return token;

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

        token.roles = roles;
        token.role = pickPrimaryRole(roles);
        token.email = data.email;
        token.name = data.name ?? token.name;
        token.loginNumber = resolveLoginNumber(data);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
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
