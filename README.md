# FaultLine

One-day hackathon platform: build the worst system → swap codebases → redemption round. Next.js 14, NextAuth, Supabase.

## Quick start (rehearsal)

1. `npm install`
2. Copy `.env.example` → `.env.local` (Supabase, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_DEMO_LOGIN=true`)
3. Run SQL per [docs/DEPLOY_DB.md](docs/DEPLOY_DB.md)
4. `npm run db:seed`
5. `npm run dev` → `/login`

| Role | Demo login numbers |
|------|-------------------|
| Participants | `1`–`18` (6 teams × 3) |
| Judges | `20`, `21`, `22` |
| Organizer | `25` |

## Production

See [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md), [docs/EVENT_DAY.md](docs/EVENT_DAY.md), [docs/SECURITY_MODEL.md](docs/SECURITY_MODEL.md).

- Auth is numeric login only (assigned numbers); Google OAuth removed for now
- Upstash Redis required in production
- Never run `db:seed` on production

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Unit tests |
| `npm run verify` | DB vs demo seed |
| `npm run smoke` | Integration smoke (dev server required) |
| `npm run check` | test + verify + smoke |

## Routes

- Public: `/`, `/login`, `/live`
- Participant: `/dashboard`, `/dashboard/phase-1`, `/dashboard/phase-2`, `/dashboard/notifications`
- Judge: `/judge/phase-1`, `/judge/phase-2`
- Organizer: `/organizer`
