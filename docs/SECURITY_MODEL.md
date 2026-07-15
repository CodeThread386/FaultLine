# Security model

## Trust boundaries

| Layer | Trust | Notes |
|-------|-------|-------|
| Browser | Untrusted | May call APIs with forged requests |
| Next.js API (`app/api/*`) | Trusted gate | Session JWT + role checks + validation |
| Service role (Supabase) | Full DB access | Used only on server — never expose key to client |
| Anon key + Realtime | Limited | Public `activity_feed` inserts only; phases/swaps via polling |

## Authentication

- **Current:** Numeric login only (pre-provisioned users in DB). Google OAuth is disabled.
- **Rehearsal:** `NEXT_PUBLIC_DEMO_LOGIN=true` enables numeric login provider.
- Login endpoints rate-limited: 20 requests/minute/IP (`middleware.js` on `/api/auth/*`).
- Logout: `POST /api/auth/force-logout` requires active session.

## Authorization

- Middleware enforces role → route (`participant`, `organizer`).
- API routes use `withApiRoute({ role })` where required.
- Organizer: track enforced server-side on team list and scoring.
- Participants: team-scoped via `team_members` / `requireRegisteredTeam`.

## Database

- RLS policies in `rls.sql` protect direct PostgREST access with Supabase Auth JWT.
- This app uses **NextAuth**, not Supabase Auth — server APIs bypass RLS via service role.
- `SECURITY DEFINER` RPCs are granted to `service_role` only (`migration_rpc_grants.sql`).

## Rate limiting

- Default API: 120 req/min/IP/path (in-memory per instance).
- Production (non-demo): **Upstash Redis required** (`lib/env.js`).
- Auth routes: stricter limit in middleware.

## Audit

Organizer mutations write to `audit_log` (see `lib/audit.js`). Query via `GET /api/organizer/audit`.

## Health

`GET /api/health` — DB connectivity + env validation (no secrets returned).
