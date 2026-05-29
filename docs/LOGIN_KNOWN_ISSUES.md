# Login — known issues (intentionally unchanged for demo)

The app currently uses **numeric credential login** (`login-number` provider), not Google OAuth. Do not change without an explicit migration plan.

## Known gaps vs production spec

| Issue | Impact |
|--------|--------|
| No Google OAuth / `vitstudent.ac.in` validation | Production participants cannot use the spec’d sign-in flow |
| Demo is **opt-in** (`NEXT_PUBLIC_DEMO_LOGIN=true`) | For rehearsal, set `true` in `.env.local`; production OAuth build leaves it unset/false |
| Login numbers stored as synthetic emails `login-N@faultline.demo` | Works for rehearsal; not tied to real VIT accounts |
| No separate judge OAuth flow | Judges use the same numeric login table as participants |
| JWT re-fetches roles from DB when token ages (mitigated: roles cached on token at sign-in) | Extra DB load if refresh logic is re-enabled |
| `login_number` column optional; lookup uses email pattern | Seeding must keep emails in sync with numbers |
| No email verification / password reset | By design for demo; production needs OAuth |
| Session does not encode `track_id` for judges | Track comes from `users.track_id` at API time |

## Demo env

- Participants: logins `1`–`18` (see `lib/login-codes.js`)
- Judges: `20`–`22`
- Organizer: `25`

## Before production event

1. Implement Google OAuth + domain check
2. Set `NEXT_PUBLIC_DEMO_LOGIN=false`
3. Pre-create judge rows with `track_id` assigned
4. Run `migration_login_number.sql` only if using numeric fallback for staff
