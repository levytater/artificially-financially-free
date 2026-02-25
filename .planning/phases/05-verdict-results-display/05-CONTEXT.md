# Phase 5: Verdict & Results Display - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Display the final rent-vs-buy verdict to users with supporting summary metrics, detailed cost breakdowns, and interactive year-by-year comparison. Charts are displayed in tabbed sections (Phase 6 will add animations). Educational explanations are deferred to Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Design & Aesthetic
- **Copy PWL Capital's design aesthetic entirely** — This is the primary visual reference
- **Day/night light and dark theme toggle** — Required; dark-first theme from Phase 1 continues
- **Same 3-tab structure as PWL** — Tabs will be populated by Phase 6 charts (Net Worth, Cash Flow, Investment Growth)
- **Enhanced with WOWA metrics** — Additional breakdown tables/comparisons beyond PWL's base offering
- **Reference NY Times calculator approach** — For interaction patterns and information architecture (user provided screenshot)

### Verdict Presentation & Reasoning
- Verdict displayed as a **panel/card (not a hero headline)**
- **Templated sentences for reasoning** — Dynamic text like "Renting is $X better over Y years because..." filled with actual numbers
- **Decision based on final net worth** — Whichever path ends with more money wins
- **"It's a tie" messaging if within threshold** — When outcomes are nearly identical (within 5% or $X), acknowledge parity and note that other factors matter
- Break-even year mentioned in verdict reasoning, not as a separate metric card

### Summary Cards Layout & Hierarchy
- **2x2 grid layout** — Rent final net worth, Buy final net worth, Dollar advantage, Percentage advantage
- **Dollar advantage card visually emphasized** — Largest/boldest to highlight the key takeaway
- **Positioned below tabs** — Cards appear after the tabbed charts section, as supporting context
- Only 4 cards; break-even year is mentioned in verdict text, not a separate card

### Cost Breakdown Table
- **High-level summary table** — Four main rows: Initial Costs, Recurring Annual Costs, Opportunity Costs, Net Proceeds at Sale
- **Side-by-side comparison** — Renter and Buyer in adjacent columns for direct cost comparison
- **Explicit Opportunity Costs row** — Shows renter's foregone investments and buyer's tied-up capital separately (educational)
- **Expandable rows** — Click "Initial Costs" to see sub-items (mortgage insurance, legal fees, LTT, etc.); "Recurring" to see property tax, maintenance, insurance breakdown
- Static summary view with optional expansion; not all details shown by default

### Year Comparison Panel
- **Slider for year selection** — Horizontal slider from Year 1 to final year; familiar and intuitive
- **Three metrics displayed per year:**
  1. Renter net worth vs Buyer net worth
  2. Annual costs (renter vs buyer that year)
  3. Cumulative invested vs home equity
- **Preset buttons for key milestones** — "Break-even year" and "Mortgage paid off" buttons for quick navigation
- **Positioned below summary cards and tables** — Natural scroll flow: verdict → summary cards → charts → year comparison → detailed table

### Claude's Discretion
- Exact color palette and spacing (will align with PWL's fintech-quality aesthetic)
- Animation timing for day/night theme toggle
- Mobile responsiveness strategy for tables (may stack or scroll horizontally on small screens)
- Threshold definition for "tie" scenario (will infer from financial context — likely 5% or similar)

</decisions>

<specifics>
## Specific Ideas

- **"Copy PWL Capital's rent-vs-buy calculator entirely — same layout, same tab structure, same charts, then enhance with WOWA's additional metrics"** — User provided direct URL reference: https://research-tools.pwlcapital.com/research/rent-vs-buy
- **WOWA reference for additional breakdown detail** — https://wowa.ca/calculators/rent-vs-buy-calculator
- **NY Times calculator for UX patterns** — User provided screenshot showing NY Times approach to financial comparisons
- Verdict wording should feel like a clear recommendation ("Renting makes sense here" vs "Buying is the better choice") based on financial outcomes
- Year comparison slider should feel responsive and smooth, similar to PWL's interactive elements

</specifics>

<deferred>
## Deferred Ideas

- **Dark mode only in v1** — Light mode addition deferred; UI built in dark-first per Phase 1 decision
- **Advanced cost breakdowns** — Detailed mortgage amortization schedule, tax-by-year breakdown — future expansion
- **Scenario comparison** — "What if I change down payment?" comparisons — Phase v2+
- **PDF export** — Saving results as PDF — v2 (lead capture phase)

</deferred>

---

*Phase: 05-verdict-results-display*
*Context gathered: 2026-02-25*
