# Database deployment (Supabase)

Run SQL in the **Supabase SQL editor** for each environment (staging, then production).

## Fresh database (ordered)

| # | File | Purpose |
|---|------|---------|
| 1 | [`schema.sql`](../schema.sql) | Tables, tracks, phases, `audit_log`, settings |
| 2 | [`rls.sql`](../rls.sql) | Row-level security policies |
| 3 | [`schema_indexes.sql`](../schema_indexes.sql) | Performance indexes |
| 4 | [`migration_atomic_ops.sql`](../migration_atomic_ops.sql) | Atomic phase/swap/registration RPCs |
| 5 | [`migration_rls_hardening.sql`](../migration_rls_hardening.sql) | Extra RLS hardening |
| 6 | [`migration_notifications_fn.sql`](../migration_notifications_fn.sql) | `get_notifications_for_user` RPC |
| 7 | [`migration_notifications_cascade.sql`](../migration_notifications_cascade.sql) | Cascade delete on notification reads |
| 8 | [`migration_rpc_grants.sql`](../migration_rpc_grants.sql) | Lock RPC execute to service role |

## Verify after migrate

```bash
npm run check:schema   # strict schema
npm run verify         # demo data (staging only, after seed)
```

## Seeding policy

| Environment | Command |
|-------------|---------|
| **Production** | Never run `npm run db:seed`. Pre-create users/organizers in Supabase. |
| **Staging / rehearsal** | `NEXT_PUBLIC_DEMO_LOGIN=true` then `npm run db:seed` once |

## Repair

- [`scripts/repair-team-members.sql`](../scripts/repair-team-members.sql) — fix missing `team_members` for leaders
