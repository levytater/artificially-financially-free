# Artificially Financially Free

## What This Is

A Canadian financial tools platform that helps people make smarter rent-vs-buy decisions using opportunity cost math that most calculators ignore. The MVP is a Rent vs. Buy Calculator that combines the analytical depth of the HolyPotato spreadsheet with the visual polish of PWL Capital's tool, wrapped in plain-English explanations accessible to anyone — not just finance nerds. It's the first tool in a planned suite of Canadian financial calculators that drive email capture and realtor leads.

## Core Value

Canadians can see exactly how renting and investing the difference compares to buying — with real opportunity cost math — and understand the results without a finance degree.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

**Calculator Engine**
- [ ] Canadian mortgage math with semi-annual compounding
- [ ] CMHC insurance calculation (tiered by down payment %)
- [ ] Provincial land transfer tax (all provinces)
- [ ] Toronto municipal land transfer tax (when applicable)
- [ ] Opportunity cost modeling — renter invests savings at expected return rate
- [ ] After-tax investment returns (Tax-Free vs Taxable toggle)
- [ ] Property tax, maintenance, insurance costs for homeowner
- [ ] Renter's insurance costs
- [ ] Closing costs (buying and selling)
- [ ] Home appreciation over time
- [ ] Rent increase (CPI) over time
- [ ] Inflation adjustment
- [ ] Net worth comparison: renter vs buyer over N years
- [ ] Break-even year calculation
- [ ] First-time home buyer incentives (land transfer tax rebate, HBP)

**Inputs & Controls**
- [ ] Province selector (auto-adjusts land transfer tax, property tax defaults)
- [ ] Purchase price, down payment %, mortgage rate, amortization
- [ ] Monthly rent
- [ ] Expected investment return rate (single rate for v1)
- [ ] Asset allocation selector (stock/bond split for expected returns)
- [ ] Time horizon slider
- [ ] Tax-Free vs Taxable investment toggle
- [ ] Home appreciation rate, rent increase rate, inflation rate
- [ ] First-time home buyer checkbox

**Results & Visualizations**
- [ ] Clear verdict: "Rent" or "Buy" with dollar amount and plain-English reasoning
- [ ] Summary cards: Rent Final NW, Buy Final NW, Advantage ($, %), Break-even Year
- [ ] Interactive Net Worth chart (animated area chart, rent vs buy over time)
- [ ] Cash Flow chart (bar chart showing annual costs)
- [ ] Renter Savings chart (investment portfolio growth)
- [ ] "Mortgage Paid Off" marker on timeline
- [ ] Detailed cost breakdown table (initial, recurring, opportunity costs, net proceeds)
- [ ] Side-by-side comparison at user-selected year

**Explanations & Accessibility**
- [ ] Helper tooltips on every input explaining what it means and why it matters
- [ ] Plain-English summary explaining the verdict and key drivers
- [ ] Chart annotations explaining how to read each visualization
- [ ] Pre-written explanations for key concepts (opportunity cost, CMHC insurance, semi-annual compounding, land transfer tax, etc.)

**Lead Capture & Sharing**
- [ ] "Save Results" flow requiring email
- [ ] Branded PDF report emailed to user with full analysis
- [ ] Shareable link (unique URL to revisit/update inputs)
- [ ] Email capture feeds into CRM/mailing list

**Design & UX**
- [ ] Responsive design (mobile + desktop)
- [ ] Clean, modern fintech UI (PWL-quality visual polish)
- [ ] Smooth chart animations
- [ ] Collapsible input sections (simple defaults, expandable for power users)
- [ ] Dark mode support

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Multi-period interest rates (first 5 yrs, next 5, final 15) — Simplify to single rate for v1, revisit in v2
- AI chatbot — v2 feature; v1 uses pre-written helper tooltips and explanations
- User accounts / authentication — No login needed; email capture only via "save results"
- City-level data auto-fill (like WOWA's city selector) — Province-level for v1; city granularity in v2
- Multiple property type selector (condo, detached, etc.) — User enters their own numbers for v1
- French language support — English only for v1; bilingual in v2
- Other calculators (Home Valuation, Investment Allocation, Financial Dashboard) — Future tools after MVP validated
- Detailed investment return breakdown (Canadian/foreign dividends, realized/unrealized capital gains) — Too complex for v1; use single expected return rate + asset allocation selector
- Mobile app — Web-first, responsive design covers mobile

## Context

**Competitive landscape (researched 2026-02-24):**

| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| WOWA.ca | Province/city-aware, break-even chart, good SEO content | No opportunity cost math, simple calculations |
| MDM.ca | Has opportunity cost field, detailed input sections, semi-annual compounding | No interactive visuals, static comparison table, dated defaults (2015 CMHC data) |
| PWL Capital | Beautiful animated charts, 3 views (NW/CF/Savings), sophisticated inputs, shareable links, dark mode | Zero explanation/context, no verdict, confusing for non-experts, no lead capture |
| HolyPotato Spreadsheet | Deep math with investment returns, year-by-year comparison, tax-aware | Unusable for normal people, giant spreadsheet, no UI |

**Key insight:** No existing tool combines deep opportunity cost math with accessible explanations. PWL has the math and visuals but assumes finance expertise. WOWA/MDM are accessible but lack the math. The spreadsheet has everything but is unusable.

**Our edge:** PWL-quality visuals + spreadsheet-depth math + plain-English explanations + lead capture funnel.

**Brand:** "Artificially Financially Free" — plays on financial freedom + AI/real estate investing theme. Target audience: Canadians considering renting vs buying, first-time home buyers, real estate curious millennials.

**Business model:**
1. Free calculator (no login) → top of funnel
2. "Save/share results" → email capture → mailing list
3. Home Valuation Tool (v2) → strongest realtor lead magnet
4. Premium tier (v3) → financial dashboard + AI chatbot

## Constraints

- **Tech stack**: Next.js (App Router) + TypeScript + Tailwind CSS — decided in strategy session
- **Deployment**: Vercel — free tier to start, scales easily
- **No backend for v1**: All calculations client-side; email capture via serverless function or third-party (Resend, ConvertKit, etc.)
- **Canadian-only**: All tax rules, rates, and defaults are Canadian-specific
- **Budget**: Zero — free tools only, no paid APIs for MVP
- **Creator context**: First major coding project — needs clean architecture, good patterns, comprehensive commenting

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single rate for v1 (not multi-period) | Simpler UX, less intimidating for users | — Pending |
| Helper tooltips over AI chatbot for v1 | Chatbot adds complexity; tooltips deliver 80% of the value | — Pending |
| Both PDF + shareable link for lead capture | Maximizes conversion — PDF for trust, link for return visits | — Pending |
| Province-level (not city-level) for v1 | Reduces data requirements, still captures key tax differences | — Pending |
| Client-side calculations only | No backend needed, faster UX, simpler architecture | — Pending |
| PWL Capital as primary UI inspiration | Best-in-class fintech calculator UI, animated charts, collapsible panels | — Pending |
| Asset allocation selector for expected returns | Simpler than PWL's dividend/capital gains breakdown, still meaningful | — Pending |

---
*Last updated: 2026-02-24 after initialization*
