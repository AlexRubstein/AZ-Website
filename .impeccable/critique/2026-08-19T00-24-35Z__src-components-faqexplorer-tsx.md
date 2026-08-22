---
target: FAQ prototype (src/components/FaqExplorer.tsx)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-08-19T00-24-35Z
slug: src-components-faqexplorer-tsx
---
Method: dual-agent (A: design-review subagent · B: detector-evidence subagent)

## Design Health Score

Surface mode: **Read** (a help/FAQ page — visitor is trying to find and understand information). Heuristics 7 and 10 are directly applicable to this mode and were scored normally, not marked n/a.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Category switch swaps ~3,000px of content with no scroll reset, no focus move, and no question count anywhere |
| 2 | Match System / Real World | 3 | Rider language throughout, but rail labels don't match the section titles they load ("Vehicles & Access" → "Vehicles, Licenses & Legal Access") |
| 3 | User Control and Freedom | 2 | Category/query are React state only — no URL state, no deep link, nothing to share or bookmark |
| 4 | Consistency and Standards | 1 | `role="tablist"`/`role="tab"` declared with zero `role="tabpanel"`, no `aria-controls`, no arrow keys; heading outline is broken (H2→H3→H2) |
| 5 | Error Prevention | 2 | Content itself is careful, but search produces false negatives on content that's visibly on the page |
| 6 | Recognition Rather Than Recall | 2 | Only the active category (~10 of ~80 questions) exists in the DOM at a time, so browser find misses 7/8 of the content |
| 7 | Flexibility and Efficiency | 2 | Substring-only search, fixed category-index result ordering (not relevance), no `/` focus shortcut, no expand-all |
| 8 | Aesthetic and Minimalist Design | 3 | Clean hairline rhythm and measure, but 716–983px of title chrome before the first tool, and a near-monochrome palette |
| 9 | Error Recovery | 2 | Empty state exists but tells users to browse a category "on the left" — the categories that search just hid |
| 10 | Help and Documentation | 3 | Content quality is high, but the legal disclaimer is 12px muted text present on only 1 of 8 categories |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity Verdict

**Verdict: partial.** The content is unmistakably AZAT's own — 80 verbatim rider questions, Rusty's Route 1000, Apache-Sitgreaves/Tonto/Coconino alerts — but the visual layer around it is close to generic. Strip the words and this could be almost any FAQ page.

**LLM assessment (Assessment A).** The one place the brand genuinely shows up is the Zones & Enforcement glossary: clay mono uppercase codes against stone hairlines, the only correct application of the site's own Geist Mono kicker rule. Everywhere else the page runs on plain Geist sans — `.az-hero-title`, `.az-section-title`, `.az-kicker`, and `font-display` are all unused, even though the footer 40px below the last section uses the site's serif wordmark. The H1 also computes to `letter-spacing: -1.2px`, which both `docs/ui-direction.md` and `docs/azat-design-brief.md` name explicitly as a hard "do not." On the Airbnb-reference adaptation specifically: the layout skeleton transferred faithfully and Airbnb's own typography was correctly refused, but AZAT's typography wasn't put in its place either — the rail lost its anchor (no heading, no `h2` on the actual Q&A explorer), the "can't find it, contact us" escape hatch landed above the content on mobile instead of below it, and the reference's harmless "open item 0" default was carried over unexamined into a corpus where item 0 of one category is "Should I ride alone?" while the emergency procedure sits collapsed at the bottom of another.

**Deterministic scan (Assessment B).** The static source scan (`detect.mjs` against the three changed files) came back clean — exit 0, zero findings. The **live browser overlay**, which evaluates the full rendered page including the site's existing Header/Footer chrome, found 6 anti-pattern instances:
- `overused-font` — primary font is Geist for 94% of visible text. This directly corroborates Assessment A's core specificity finding: the page essentially never reaches for the brand's serif display type.
- `all-caps-body` × 4 (uppercase runs of 31, 35, 35, and 38 characters) — these line up with the Zones glossary's `{code} · {name}` strings (e.g. "OHV CORRIDOR · OHV COMPLIANCE CORRIDOR" is 39 characters). This is a genuine tension worth naming rather than resolving either way by default: `ui-direction.md` does mandate uppercase mono for "kicker labels... and small utility text," and Assessment A independently called this section the strongest brand moment on the page — but the detector's underlying concern (long all-caps runs measurably slow reading) is legitimate general guidance, and 39 characters is well past what the kicker convention was designed for (compare "START HERE," 10 characters). The fix that honors both: keep the short *code* (EEZ, HISA, ZTZ...) in uppercase mono per the kicker rule, and let the descriptive *name* run in normal case.
- `gpt-thin-border-wide-shadow` × 1 — likely pre-existing site chrome (e.g. the header's pill badge) rather than anything in the reviewed component files, since it wasn't caught by the source-only scan; flagged here as a probable false positive for this task's scope, not confirmed.

No plain JavaScript console errors were found at either desktop (1440px) or mobile (375px) viewports. Note: the live-server used to run the browser overlay was stopped after evidence collection, per protocol, so there is no overlay currently visible in your browser — the findings above are the recorded console output, not a live view.

## Overall Impression

The content is the real win here — accurate, verbatim, appropriately hedged, and organized in a way that's genuinely more usable than a flat 80-question scroll. But the page currently under-serves its own stakes: it's built and styled like a generic help-center FAQ, when the actual content includes emergency procedures, citation risk, and land-access law. The single biggest opportunity is making the interface visibly match the seriousness of what it's saying — starting with search that doesn't lie about what's on the page, and an emergency answer that isn't the 7th collapsed row of a category most people won't open first.

## What's Working

1. **The Zones & Enforcement glossary** (`FaqExplorer.tsx:236–245`) — clay mono codes against hairline rules in a `220px_1fr` definition grid. It's the one section that reads as "AZAT" rather than "generic FAQ," and the one place the brand's own kicker typography rule is actually followed (the all-caps length issue above is a refinement of this, not a reason to abandon it).
2. **Non-exclusive `<details>` with a `resetKey` remount** (`FaqExplorer.tsx:66–68`) — multiple answers can stay open at once for cross-referencing, while switching category or search query cleanly resets state. That's a deliberate, correct decision most FAQ accordions get wrong in one direction or the other.
3. **Reading measure and rhythm** — `max-w-[65ch]` body copy with `leading-relaxed`, clean hairline row dividers, holds up at both 1440px and 375px. On genuinely dense statutory prose, this is the difference between readable and abandoned.

## Priority Issues

**[P0] Search reports "no matches" for content that is visibly on the page**
- **Why it matters**: `matchesQuery` does a single raw substring check against only `item.q`/`item.a` inside `faqCategories` — the checklist, the Zones glossary, and the Official Resources list are excluded entirely. Verified: searching "zero tolerance" returns 0 results directly above the glossary entry that defines ZTZ; "registration insurance" returns 0 despite both words appearing in visible text. On legal/safety content, a false "no matches" doesn't read as a search bug — it reads as "AZAT doesn't cover this."
- **Fix**: build one flat index across all four content blocks, tokenize the query (AND across words, not a single substring), weight question-title matches above body matches, and highlight matched terms in results.
- **Suggested command**: `/impeccable harden`

**[P1] The highest-stakes content is the hardest to reach**
- **Why it matters**: the emergency procedure ("call 911... stay with the vehicle") is the last, collapsed row of Safety & Prep, while the auto-open default opens whatever happens to be first in the array ("Should I ride alone?"). The legal disclaimer is 12px muted text at the bottom of one category out of eight (Safety & Prep has none at all). The content that matters most to get right is styled to be skipped.
- **Fix**: replace index-based `defaultOpen` with an explicit priority flag on the emergency/closure-conflict answers; add a persistent, clay-accented "In an emergency" block near the top of the page; move the legal note above the questions in every category, not just one.
- **Suggested command**: `/impeccable layout`

**[P1] Touch targets fail the project's own binding rule**
- **Why it matters**: `py-5` sits on `<details>` rather than `<summary>`, so a row that looks ~63px tall on mobile has a real clickable band of only ~22px with dead padding above and below — affects at least 4 of the first 10 questions. The 11 Official Resources links measure ~23px tall with 14px gaps. `docs/ui-direction.md` itself mandates "at least 40px to 44px" for interactive controls, and WCAG 2.2's 24×24 minimum isn't met either.
- **Fix**: move `py-5` from `<details>` to `<summary>` (restores a uniform full-row target); give resource links `min-h-11` with generous row padding.
- **Suggested command**: `/impeccable audit`

**[P1] Mobile layout inverts reading order and hides the navigation**
- **Why it matters**: the category pill row measures ~1329px of content inside a ~335px container — roughly 75% off-screen with no fade, arrow, or count, and only one of eight categories visible at rest. The "Can't find what you're looking for?" escape hatch sits above the actual questions in the mobile stack order. The search box — the primary tool on this page — sits below the fold on a 375×812 viewport.
- **Fix**: reorder the mobile stack to search → categories → content → escape hatch; replace the horizontal pill scroller with a wrapping grid or a native `<select>` so all categories are visible without scrolling.
- **Suggested command**: `/impeccable adapt`

**[P2] ARIA roles are declared but not implemented**
- **Why it matters**: `role="tablist"`/`role="tab"` is present with zero `role="tabpanel"`, no `aria-controls`, and no arrow-key handling — a screen-reader user is told this is a tab interface and then the tab contract doesn't work. The results container is wrapped in `aria-live="polite"` and currently holds up to ~3,300 characters, so every keystroke or category switch re-announces an entire category aloud.
- **Fix**: either implement the full tab pattern (`aria-controls`, `role="tabpanel"`, roving tabindex, arrow/Home/End keys) or drop `role="tab"` for a plain `<nav>` with `aria-current`; replace the wrapping live region with a small visually-hidden node that announces just a result count.
- **Suggested command**: `/impeccable audit`

**[P3] Visual specificity and alignment polish**
- **Why it matters**: the H1's inherited `letter-spacing: -1.2px` breaks the one typography rule both brand docs name explicitly; headings never reach for the site's own serif display type (corroborated by the detector's `overused-font` finding); the Zones section heading sits ~34px right of its sibling headings due to the icon's flex wrapper; a focused, populated search field shows two overlapping "clear" controls (the browser's native one plus the custom button).
- **Fix**: swap `tracking-tight` for `tracking-normal` (or 0) on this page's H1; bring `.az-section-title`/`font-display` into at least the page's own headings; align the Zones heading with its siblings; suppress the native search-cancel button (`[&::-webkit-search-cancel-button]:appearance-none`).
- **Suggested command**: `/impeccable polish`

## Persona Red Flags

**Casey (Distracted Mobile User)**: the first mobile screen shows only the title and an unmarked gray checklist — no search, no questions. The search field sits ~983px down a 812px viewport. Seven of eight categories are hidden behind a ~994px horizontal scroll with a single visible pill and no scroll affordance. When Casey does reach a question, several one-line rows have a real tap target roughly a third the height they appear to be. Searching "zero tolerance" one-handed returns nothing, and the contact escape hatch greets Casey before a single answer does.

**Jordan (Confused First-Timer)**: search is Jordan's natural way in, since they don't know AZAT's vocabulary yet — and it's the weakest surface, failing multi-word queries and giving no highlighting or snippet to explain why a result matched. Browsing fails differently: the rail's short labels don't match the full section titles they load, so Jordan can't confirm they're in the right place, and nothing indicates how many questions exist per topic. The Zones glossary hands Jordan six enforcement acronyms with no map or route context to act on.

**Sam (Accessibility-Dependent User)**: the category nav announces as a tablist with 8 tabs and implements none of the tab contract, so arrow-key navigation (the documented behavior for that role) does nothing. Every category switch or search keystroke re-announces a multi-thousand-character live region in full. The 80 question toggles expose as unnamed generic controls with no expanded/collapsed state communicated. Only the active category exists in the DOM, so both screen-reader "find" and ordinary browser find-in-page miss seven-eighths of the content.

## Minor Observations

- `document.title` and the meta description are still the site-wide homepage ones ("Arizona Alpine Trail" / route-and-GPX copy) — a bookmark of this page won't say FAQ.
- Only the active category's ~10 questions exist in the DOM at a time; there's no expand-all, print view, or offline-friendly rendering, which sits oddly next to the page's own advice that "cell service is unreliable in many parts of Eastern Arizona."
- The "Before every ride" checklist has no list markers, checkboxes, or numbers — visually indistinguishable from body paragraphs despite being the most actionable content on the page.
- The 11 Official Resources links repeat their agency-name prefix up to four times each; grouping by agency would roughly halve the scanning load.
- Selecting a short category (e.g. "Help & Contact," 2 questions) leaves a large visual void in the content column relative to the still-tall sticky rail.
- Reduced motion is handled correctly and needed no extra work here — `globals.css` already zeroes transition/animation durations globally, so the chevron rotation degrades gracefully.

## Questions to Consider

- If the emergency procedure is the one answer that could matter most, what would this page look like if it were the *first* thing below the headline, with everything else organized as the FAQ underneath it — the way a real trailhead sign is ordered?
- This page tells riders to expect no cell service and to carry the current route file offline — should the FAQ itself be ownable offline (a one-tap field-card export), the same trust move the site already makes for GPX downloads?
- The Zones glossary names six enforcement designations but gives no way to check whether any of them touch a specific route. Given the site already has a strong, under-linked 3D terrain view at `/trail/3d`, is there a version of this glossary that points into that map instead of standing alone as text?
