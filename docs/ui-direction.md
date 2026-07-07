# UI Direction

## Purpose

Use this file as the visual and interaction guide for future Arizona Alpine Trail pages, sections, and components. New UI should feel like it belongs to the same trail system as the current homepage, route map, itinerary feature, header, and footer.

This is a design direction document, not a component API. Prefer existing project patterns before inventing new ones.

## Visual North Star

Arizona Alpine Trail should feel rugged, practical, scenic, and grounded in a real nonprofit trail-system project. The UI should make the route, maps, downloads, towns, safety, and ride-planning information feel accessible and trustworthy while still carrying the emotional pull of the Arizona high country.

The best version of the site feels like:

- A field guide for riders.
- A scenic trail journal.
- A practical planning tool.
- A community and stewardship project.

Avoid generic SaaS styling, polished stock-marketing layouts, abstract gradient decoration, oversized empty hero copy, or pages that feel disconnected from the actual trail.

## Color System

Reuse the existing color variables in `src/app/globals.css` whenever possible:

- `--forest` / `--forest-deep`: primary dark UI, hero handoffs, footer, map overlays, dark photographic sections.
- `--pine`: secondary green for grounded outdoor surfaces and interactive states.
- `--clay`: primary warm action accent, focus color, and selected/emphasis state.
- `--ochre` / `--sun`: warm supporting accents, route lines, labels, and hover states.
- `--paper` / `--cream`: main light content surfaces.
- `--stone`: borders, dividers, and quiet structural lines.
- `--muted`: secondary body text.
- `--sky`: use sparingly as a natural supporting color, not as the dominant brand color.

Default page backgrounds should usually be `--background`, `--paper`, `--cream`, or `--forest-deep` depending on whether the section is informational, utility-focused, or photographic. Keep the palette varied but rooted in earth, forest, paper, and route-marker tones.

## Typography

Use the current type hierarchy:

- Big hero and section titles use the serif direction already defined by `.az-hero-title` and `.az-section-title`.
- Body text and standard UI use Geist sans via the project font setup.
- Kicker labels, metadata, map labels, and small utility text use Geist Mono with uppercase text and generous positive letter spacing.
- Keep letter spacing at `0` for large serif display text.
- Do not use negative letter spacing.

Hero-scale type belongs in true hero or major editorial sections. Smaller pages, cards, sidebars, forms, and utility surfaces should use tighter headings so text does not overwhelm the interface.

## Layout Patterns

Lead future pages with usable content, not marketing filler. The site should quickly expose maps, downloads, itinerary facts, town/service details, news, forms, or route-planning information.

Use these established patterns:

- Full-bleed photographic hero sections for major pages, with real trail imagery and dark forest gradients for readability.
- Dark-to-light section handoffs, especially from hero moments into map or paper content.
- Content widths around the existing `1320px` rhythm for major sections.
- Compact utility pages can use `PageShell`, but should still inherit the brand palette and typography.
- Cards should have small radii, generally `4px` to `8px`, and should frame real content rather than decorate the page.
- Avoid nested cards, floating page-section cards, and decorative card-heavy layouts.
- Keep map/download/itinerary interfaces dense enough to be useful, especially on desktop, while preserving readable mobile stacking.

Use stable dimensions for maps, galleries, controls, counters, and fact tiles so hover states or dynamic content do not shift the layout.

## Imagery

Prefer real AZAT assets from `public/azat`:

- `public/azat/photos`
- `public/azat/images`
- `public/azat/ride`
- `public/azat/brand/azat-logo.png`

Images should reveal actual trail terrain, towns, route context, riders, maps, roads, forests, or high-country landscape. Avoid generic stock imagery, vague atmospheric crops, abstract backgrounds, and visuals that do not help riders understand the trail.

For hero imagery, use strong readable overlays rather than placing hero text in a card. Keep the brand or page subject visible in the first viewport.

## Components

Keep shared UI behavior consistent:

- Preserve the fixed transparent-to-dark header behavior.
- Keep the footer simple, dark, and navigation-focused.
- Use `lucide-react` icons for buttons, facts, navigation controls, downloads, map actions, and utility affordances.
- Use rounded pill CTAs for primary actions and downloads when matching the existing hero/map patterns.
- Use icon-only buttons for familiar controls like previous/next, close, menu, download, and map actions when the icon is clear; include accessible labels.
- Keep focus states visible and aligned with the clay/forest palette.
- Respect `prefers-reduced-motion`; any scroll, parallax, hover, or route-drawing motion needs a reduced-motion fallback.
- Keep interactive controls at comfortable touch sizes, typically at least `40px` to `44px`.

Use animation sparingly: subtle rise, fade, parallax, and route drawing are on-brand; flashy or decorative motion is not.

## Page Guidance

Future pages should answer rider and community needs directly:

- Trail pages should prioritize route clarity, status, downloads, safety, and segment facts.
- Town pages should prioritize services, fuel, lodging, food, repairs, trail access, and planning notes.
- Itinerary pages should prioritize days, miles, start/end points, map context, downloadable files, and practical ride rhythm.
- Resource pages should prioritize safety, stewardship, land-use responsibility, and planning utility.
- News pages should feel editorial but restrained, with dates, excerpts, and real project context.
- Contact and form pages should stay simple, trustworthy, and easy to complete.

When a page needs a visual lead, use a relevant image or map. When a page is primarily functional, make the tool or content the first screen.

## Do / Avoid

Do:

- Reuse existing colors, typography, spacing, and image assets.
- Make maps, downloads, routes, towns, services, safety, and itineraries easy to find.
- Let photography and terrain carry the atmosphere.
- Keep UI practical, readable, and grounded.
- Check mobile layouts for text wrapping, button sizing, and non-overlap.
- Use accessible labels, semantic structure, and visible focus states.

Avoid:

- Generic landing-page sections that delay useful trail information.
- Abstract gradients, decorative blobs, or SVG-only scenery.
- One-note palettes dominated by a single hue.
- Large rounded marketing cards or nested cards.
- Stock imagery that does not show the real trail or ride context.
- Negative letter spacing.
- Motion without reduced-motion fallbacks.
- Text overlays that obscure important image content or become unreadable on mobile.
