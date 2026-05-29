# FaultLine

End-to-end event platform built with Next.js 14, NextAuth, Supabase Postgres, polling dashboards, and Realtime live feed.

## Demo mode (rehearsal — numeric login)

1. `npm install`
2. Configure `.env.local` (Supabase + `NEXTAUTH_SECRET` + `NEXTAUTH_URL`)
3. Run `schema.sql`, `rls.sql`, `schema_indexes.sql` in Supabase
4. Optional: `migration_login_number.sql` in Supabase
5. Seed demo data (wipes old users/teams):
   - `npm run db:seed`
6. `npm run dev` → open `/login`

| Role | Login numbers |
|------|----------------|
| Participants | `1`–`18` (6 teams × 3) |
| Judges | `20`, `21`, `22` |
| Organizer | `25` |

No password — enter your assigned number only. Google login is disabled in demo mode. Team self-registration is off; teams are pre-seeded.

To restore email/Google login later, set `NEXT_PUBLIC_DEMO_LOGIN=false` and reconfigure `lib/auth.js`.

## Quick Start (legacy email seed)

If your database was already created before multi-role support, run `migration_multirole.sql` once before seeding.

## Routes

- Public: `/`, `/login`, `/live`
- Participant: `/dashboard`, `/dashboard/register`, `/dashboard/phase-1`, `/dashboard/phase-2`, `/dashboard/notifications`
- Judge: `/judge`
- Organizer: `/organizer`

## API

All API routes are under `app/api/**` and follow role checks via NextAuth session in server handlers.

## Notes

- Participant APIs only return data for the signed-in user’s team (`requireRegisteredTeam`).
- Judges can only score teams on their assigned track.
- Re-seed anytime: `npm run db:seed` (destructive to users/teams/submissions).
