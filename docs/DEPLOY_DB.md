# Database deployment (Supabase)

Run SQL in the **Supabase SQL editor** for each environment (staging, then production).

## Fresh database (ordered)

1. [`schema.sql`](../schema.sql) — tables, seed tracks/phases
2. [`rls.sql`](../rls.sql) — row-level security policies
3. [`schema_indexes.sql`](../schema_indexes.sql) — performance indexes

## Migrations (ordered)

| # | File | Purpose |
|---|------|---------|
| 4 | [`migration_multirole.sql`](../migration_multirole.sql) | `user_roles` table (if upgrading old DB) |
| 5 | [`migration_login_number.sql`](../migration_login_number.sql) | Optional `login_number` column |
| 6 | [`migration_demo_required.sql`](../migration_demo_required.sql) | `event_settings`, `reviews.scores`, round constraint |
| 7 | [`migration_one_judge_per_team.sql`](../migration_one_judge_per_team.sql) | One judge per team/phase/round |
| 8 | [`migration_atomic_ops.sql`](../migration_atomic_ops.sql) | Atomic phase/swap/registration RPCs |
| 9 | [`migration_rls_hardening.sql`](../migration_rls_hardening.sql) | Extra RLS (if policies already exist, run statements individually) |
| 10 | [`migration_notifications_fn.sql`](../migration_notifications_fn.sql) | `get_notifications_for_user` RPC |
| 11 | [`migration_schema_reviews_unique.sql`](../migration_schema_reviews_unique.sql) | Drop redundant review unique |
| 12 | [`migration_notifications_cascade.sql`](../migration_notifications_cascade.sql) | Cascade delete on notification reads |
| 13 | [`migration_rpc_grants.sql`](../migration_rpc_grants.sql) | Lock RPC execute to service role |
| 14 | [`migration_audit_log.sql`](../migration_audit_log.sql) | Organizer audit trail |

## Conditional (legacy DB only)

- [`migration_judge_rounds_v2.sql`](../migration_judge_rounds_v2.sql) — if `reviews.round` still uses `mid_build` / `pre_final` / `finals`
- [`migration_judge_scoring.sql`](../migration_judge_scoring.sql) — older scoring migrations
- [`migration_remove_finals_phase.sql`](../migration_remove_finals_phase.sql) — remove unused `finals` phase row
- [`migration_remove_finals_round.sql`](../migration_remove_finals_round.sql) — round cleanup

## Verify after migrate

```bash
npm run check:schema   # strict schema
npm run verify         # demo data (staging only, after seed)
```

## Seeding policy

| Environment | Command |
|-------------|---------|
| **Production** | Never run `npm run db:seed`. Pre-create users/judges in Supabase. |
| **Staging / rehearsal** | `NEXT_PUBLIC_DEMO_LOGIN=true` then `npm run db:seed` once |

## Repair

- [`scripts/repair-team-members.sql`](../scripts/repair-team-members.sql) — fix missing `team_members` for leaders
