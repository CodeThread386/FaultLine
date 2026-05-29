# Deploy on Vercel + Supabase

## Projects

| Environment | Vercel | Supabase |
|-------------|--------|----------|
| Staging | Preview / `staging` branch | Separate project recommended |
| Production | Production domain | Separate project **required** |

## Environment variables

Set in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXTAUTH_URL` | Yes | `https://your-domain.vercel.app` (no trailing slash) |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Server only** — never expose to client |
| `GOOGLE_CLIENT_ID` | Prod | When `NEXT_PUBLIC_DEMO_LOGIN` is not `true` |
| `GOOGLE_CLIENT_SECRET` | Prod | Google Cloud OAuth client |
| `NEXT_PUBLIC_DEMO_LOGIN` | Staging | Set `true` for rehearsal; omit or `false` for production |
| `UPSTASH_REDIS_REST_URL` | Prod | Required in production (non-demo) |
| `UPSTASH_REDIS_REST_TOKEN` | Prod | Pair with URL above |
| `AUTH_ALLOWED_EMAIL_DOMAIN` | Optional | Default `vitstudent.ac.in` |

## Deploy steps

1. Apply DB migrations per [DEPLOY_DB.md](./DEPLOY_DB.md) on the Supabase project.
2. Connect GitHub repo to Vercel; framework preset **Next.js**.
3. Set all env vars for Production and Preview.
4. Deploy; confirm `GET /api/health` returns `{ "ok": true }`.
5. Staging: `NEXT_PUBLIC_DEMO_LOGIN=true`, run `npm run db:seed` locally against staging DB (service role in `.env.local`).
6. Production: pre-provision organizer/judge rows; **do not** run seed.

## CI

GitHub Actions [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs lint, test, typecheck, build on push/PR.

Optional: set repository variable `STAGING_URL` for post-deploy smoke.

## Health check

Monitor: `https://<your-app>/api/health`

## Never in production

- `npm run db:seed`
- `NEXT_PUBLIC_DEMO_LOGIN=true` (unless intentional dress rehearsal on prod URL)
