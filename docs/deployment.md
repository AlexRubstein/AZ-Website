# Deployment

## Vercel

Deploy the Next.js app on Vercel and set the environment variables from `.env.example`.

## Supabase Auth

This site uses immediate email/password registration without Supabase email
verification. In Supabase Dashboard, go to Authentication > Providers > Email:

- Keep Email enabled.
- Turn off Confirm email.

When Confirm email is off, successful registration creates a session immediately
and redirects the new user to the requested page.

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
