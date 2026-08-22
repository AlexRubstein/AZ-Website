# Protected Downloads

Downloads are gated by Supabase Auth, a Terms acceptance page, and a private Supabase Storage bucket.

## Runtime Environment

Set these variables locally and in the deployment environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-only. Do not expose it with a `NEXT_PUBLIC_` prefix.

## User Flow

1. Public download buttons point to `/downloads/[slug]`.
2. Logged-out visitors are redirected to `/sign-up?next=/downloads/[slug]`.
3. Logged-in visitors see the Terms and Conditions every time.
4. Clicking "I Agree and Download" inserts a `download_acceptances` row with terms version `azat-download-terms-2026-07-06`.
5. The confirmation page opens `/api/downloads/[slug]?token=...`, which validates the logged-in user, token, active download record, and token expiry before streaming the private Storage object.

## Supabase Dashboard Admin Workflow

1. Open Supabase Dashboard for the AZ Website project.
2. Go to Storage and open the private `protected-downloads` bucket.
3. Upload the file under the path used by `download_files.storage_path`, for example:
   - `current/arizona-alpine-trail.gpx`
   - `current/azat-segments-v5.kml`
   - `current/azat-shapefile.zip`
4. Go to Table Editor, open `download_files`, and add or update:
   - `slug`
   - `title`
   - `file_type`
   - `version`
   - `storage_path`
   - `filename`
   - `content_type`
   - `active`
   - `published_at`
   - `notes`
5. To replace a file version, upload the new object and update the existing row's `storage_path`, `version`, `filename`, and `content_type`.
6. To remove a download from the site, set `active` to `false`.

The current seed files were moved out of public web access and are stored in `protected-download-seed/current/`. Upload those files into the matching paths in the private bucket before testing real downloads.

## Database Objects

The live Supabase project has:

- Private Storage bucket: `protected-downloads`
- Table: `download_files`
- Table: `download_acceptances`

`download_files` exposes only active metadata through RLS. `download_acceptances` lets authenticated users read their own rows, but acceptance rows are inserted by the server action with the server-only key. The protected API route also uses the server-only key to verify acceptance and stream files.
