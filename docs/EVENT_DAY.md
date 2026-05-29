# Event day runbook

## T-24 hours

- [ ] Run all DB migrations on production Supabase ([DEPLOY_DB.md](./DEPLOY_DB.md))
- [ ] Vercel production env set (`NEXT_PUBLIC_DEMO_LOGIN` **not** `true`)
- [ ] `UPSTASH_REDIS_*` configured
- [ ] `GET /api/health` returns `{ "ok": true }`
- [ ] Pre-create organizer + judge users in Supabase with `user_roles` and judge `track_id`
- [ ] **Do not** run `npm run db:seed` on production

## T-1 hour

- [ ] Staging smoke: `SMOKE_BASE_URL=https://staging... npm run smoke`
- [ ] Set Phase 1 deadline in organizer panel
- [ ] Start Phase 1 (organizer → Participants → Phase control)
- [ ] Set active judge round to **In-person visit 1**
- [ ] Confirm scoring gate: **Allow scoring**

## During Phase 1

1. Teams submit repo + description (participants)
2. Judges score visit 1 → organizer switches round → visit 2 → final pitch
3. Organizer broadcasts via notifications as needed
4. Stop Phase 1 at cutoff

## Lunch — swaps

1. Organizer → **Assign codebase swaps**
2. **Show swaps to teams**
3. Start Phase 2 when ready

## Phase 2 + finals round

- Same judging pattern; `final_pitch` round shows all teams to judges
- Stop Phase 2 at cutoff

## Rollback

| Issue | Action |
|-------|--------|
| Scoring chaos | Organizer → **Pause scoring** |
| Wrong phase open | **Stop phase** immediately |
| Bad broadcast | Delete notification in organizer panel |

## Post-event

- Export `audit_log` from Supabase if needed
- Archive Supabase project or snapshot

## Pre-launch checklist (staging)

```bash
npm run check
npm run build
curl -s https://<staging>/api/health | jq .
```

Manual paths:

- [ ] Participant login → dashboard → Phase 1 submit
- [ ] Judge login → score one team → blocked on second judge same round
- [ ] Organizer → broadcast → appears on participant notifications
- [ ] Organizer → phase start/stop
