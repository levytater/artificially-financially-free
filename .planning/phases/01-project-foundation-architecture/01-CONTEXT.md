# Phase 1: Project Foundation & Architecture - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up a running Next.js application with TypeScript, Tailwind CSS, and shadcn/ui. Establish architecture patterns for URL-serializable state, programmatic input control, structured content data, and Decimal.js precision. Deliver a visible shell layout with branded placeholder sections.

</domain>

<decisions>
## Implementation Decisions

### Content Authoring Format
- Tooltip and explainer content stored as **TypeScript objects** (not JSON, not hardcoded JSX)
- Content split by category into separate files (e.g., `tooltips.ts`, `explainers.ts`, `verdictText.ts`)
- Content strings support **rich formatting via markdown** (bold, links, bullet lists) inside the TypeScript objects
- Claude writes all initial content; user reviews and edits

### URL Parameter & State Persistence
- **Clean URL while working** — address bar stays clean (no params) during normal use
- **localStorage persistence** — all input state saved to browser localStorage so page refresh preserves inputs
- **Share button generates param URL** — readable params with human-friendly names (e.g., `?price=600000&province=ON`), only non-default values included
- When a user opens a shared param URL, inputs are populated from the URL params (URL takes precedence over localStorage)
- This is the PWL Capital pattern with the added benefit of refresh persistence

### Scaffold Shell Layout
- Phase 1 delivers a **visible page shell** (not just invisible architecture)
- **Sidebar + main layout**: inputs panel in left sidebar, results/charts in main content area on desktop; stacks vertically on mobile
- **Labeled placeholder blocks** in each section: subtle outlined boxes labeled "Input Panel", "Verdict", "Net Worth Chart", etc. — acts as a visual roadmap of what's coming
- Placeholder blocks get replaced by real components in Phases 4-7

### Brand Styling & Theme
- **Brand styling applied from day one** — not deferred to Phase 8
- **Phantom.com (crypto wallet)** as the starting visual reference: dark theme, deep purple/dark backgrounds, clean sans-serif typography, soft gradients, premium fintech feel
- **Templatized theme config** — all colors, fonts, spacing tokens live in a single theme config file so the entire palette can be swapped later as brand identity evolves
- shadcn/ui components themed to match the Phantom-inspired palette

### Claude's Discretion
- Exact theme token structure and naming convention
- Choice of sans-serif font pairing
- Decimal.js integration pattern
- Component file organization and naming conventions
- Testing setup and tooling choices

</decisions>

<specifics>
## Specific Ideas

- **Phantom.com** is the visual reference for brand styling — dark premium fintech aesthetic with purple/dark tones, soft gradients, clean typography
- **PWL Capital** remains the primary UX/interaction inspiration for the calculator itself (collapsible panels, animated charts in later phases)
- User explicitly wants the theme to be easily changeable later — "templatize so I can easily change the colors, fonts, and so on as I figure out my brand"
- Labeled placeholder blocks should feel like a wireframe roadmap — motivating to see progress as future phases fill them in

</specifics>

<deferred>
## Deferred Ideas

- **Financial literacy level selector** — A toggle/question upfront asking the user's financial competency level. Based on response: (A) adapts the number of inputs/configuration shown, and (B) changes helper text to be more/less detailed and plain-spoken. This is a significant UX capability — belongs as its own phase or v2 feature.
- **URL shortener for shared links** — Generate short URLs (e.g., `artificiallyfinanciallyfree.com/c/abc123`) instead of long param URLs. Requires a backend/database. Natural fit for v2 when backend is added for email capture.

</deferred>

---

*Phase: 01-project-foundation-architecture*
*Context gathered: 2026-02-24*
