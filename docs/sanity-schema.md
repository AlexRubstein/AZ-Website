# Sanity Schema Notes

## Documents

The CMS includes `homePage`, `page`, `newsPost`, `trailSegment`, `town`, `route`, `itineraryDay`,
`waypoint`, `downloadFile`, `faq`, `resource`, `sponsorPartner`, `product`,
`donationCampaign`, `siteSettings`, and `redirect`.

## Shared Objects

- `seo`: title, description, and social image.
- `hero`: heading, subheading, image, alt text, and actions.
- `cta`: label, href, and visual variant.
- `externalImage`: optional Sanity image asset, external URL fallback, and required alt text.
- `mapLayer`: homepage map filter labels and default active state.
- `timelineStop`: Route 1000 day, title, miles, fuel, and lodging notes.
- `labeledItem`: reusable label/value/description rows for stats and downloads.
- `iconCard`: safety/resource card content with controlled icon names.
- `featuredNewsCard`: homepage news card preview with image metadata.
- `mapCoordinates`: latitude and longitude.
- `routeStats`: mileage, days, surface, and season.
- `richText`: portable body content with headings, links, quotes, and images.

## Modeling Rule

Trail data should be modeled structurally whenever it drives maps, filters, downloads, or deep links.
Long editorial explanation can live in `richText`.
