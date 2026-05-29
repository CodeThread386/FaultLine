# Audit fixes applied

Login mechanism remains **numeric demo** (optional via env). See [LOGIN_KNOWN_ISSUES.md](./LOGIN_KNOWN_ISSUES.md).

## All audit items addressed

### Critical & major
- Swap codebase uses Phase 1 submissions
- Rate limit: Upstash optional + in-memory fallback
- Demo mode opt-in (`NEXT_PUBLIC_DEMO_LOGIN=true`)
- Atomic RPCs: phase actions, swaps, team registration (`migration_atomic_ops.sql`)
- Judge track enforcement + finals (`final_pitch`) all teams
- Realtime on phases, swaps, notifications
- Unlock Phase 2 requires swaps assigned

### Security
- RLS hardened (`rls.sql`, `migration_rls_hardening.sql`)
- JWT roles cached; DB refresh max every 30 min

### Quality & architecture
- Supabase singleton, structured logging
- `/api/live` cache headers
- `usePoll` error recovery, `PhaseSubmissionForm` success flag
- Targeted logout storage
- `next.config.js` serverActions at root
- `.env.example` cleaned up
- Notifications single SQL query (`migration_notifications_fn.sql`)
- `insertReview` simplified (`lib/review-round.js`)
- Phase schedules from DB deadlines, not hardcoded times
- `normalizeRoles` / `normalizeRolesFromToken` used in middleware & layouts
- Reviews unique constraint deduped (`migration_schema_reviews_unique.sql`)
- **Organizer page split**: `useOrganizerConsole`, `OrganizerHomeTab`, `OrganizerParticipantsTab`, `OrganizerJudgesTab`
- **Middleware**: `getToken` from `next-auth/jwt` (App Router safe)
- **Next.js** bumped to 14.2.28
- **TypeScript**: `checkJs` + `app/` + `components/` in `tsconfig.json`
- `loadCanonicalTracks` read-only; seed via `ensureCanonicalTracks` only

## Supabase migrations (run in order)

1. `migration_demo_required.sql`
2. `migration_one_judge_per_team.sql`
3. `migration_atomic_ops.sql`
4. `migration_rls_hardening.sql`
5. `migration_notifications_fn.sql`
6. `migration_schema_reviews_unique.sql`

## Optional at scale

`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

## Still out of scope

- Google OAuth / VIT email (documented in LOGIN_KNOWN_ISSUES.md)
- Full `.ts` migration of entire codebase
