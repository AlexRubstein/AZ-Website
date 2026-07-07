# Deployment

## Vercel

Deploy the Next.js app on Vercel and set the environment variables from `.env.example`.

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin, for example:

```bash
NEXT_PUBLIC_SITE_URL=https://azalpinetrail.org
```

This value is used for Supabase email confirmation callbacks. Without it,
confirmation emails can fall back to `localhost` or a preview deployment URL.

## Supabase Auth URLs

In Supabase Dashboard, go to Authentication > URL Configuration:

- Set Site URL to the production site origin, for example `https://azalpinetrail.org`.
- Add local and Vercel preview redirect URLs as needed:
  - `http://localhost:3000/**`
  - `https://*.vercel.app/**`
  - `https://azalpinetrail.org/**`
- If the confirmation email template has a custom link, use `{{ .RedirectTo }}`
  instead of `{{ .SiteURL }}` so the app-provided callback URL is honored.

## Sanity

Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and
`NEXT_PUBLIC_SANITY_API_VERSION`. The Studio route is `/studio`.

Current AZ Web values:

- Project ID: `ymwkx711`
- Dataset: `production`
- API version: `2026-07-03`

Sanity CLI 6 requires Node `22.12+`. If your shell is on an older Node version,
switch Node first, then authenticate and deploy:

```bash
sanity login --provider google
npm run sanity:schema:deploy
```

Use the provider that matches the Sanity account: `google`, `github`, or `sanity`.
After the schema is deployed, seed starter content with a write token:

```bash
SANITY_AUTH_TOKEN="..." npm run sanity:seed
```

Do not commit `SANITY_AUTH_TOKEN`; it is only for local or CI write operations.

## Redirects

High-value WordPress URLs are defined in `next.config.ts`. Additional editorial redirects can be stored in Sanity as `redirect` documents and wired into middleware later if needed.
