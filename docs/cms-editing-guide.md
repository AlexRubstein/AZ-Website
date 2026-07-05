# CMS Editing Guide

Sanity Studio lives at `/studio` and is the handoff surface for AZAT editors.

## Safe Daily Edits

- Update page copy, news posts, FAQs, resources, sponsors, and town descriptions.
- Add or replace images only when the `alt` or image description field is also updated.
- Upload new GPX, KML, shapefile, PDF, or external download entries as `downloadFile` documents.
- Update route status with the approved values: `Proposed`, `Preliminary`, `Open`, `Seasonal`, or `Closed`.

## Careful Edits

- Slugs affect URLs. Changing a slug requires a matching `redirect` document and a Next.js redirect entry for high-value legacy URLs.
- Coordinates affect map placement and should be checked on staging.
- Route files should use version labels and publication dates so riders know whether a file is current.

## Future Payments

Product and donation campaign documents can store Stripe metadata, but Stripe remains the payment record system.
