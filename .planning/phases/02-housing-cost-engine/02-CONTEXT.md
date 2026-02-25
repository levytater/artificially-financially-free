# Phase 2: Housing Cost Engine - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

All housing-side financial calculations — mortgage payments, CMHC insurance, land transfer tax, property tax, closing costs, appreciation, rent increases, and first-time buyer rebates. Pure math engine producing year-by-year homeowner cost projections. No UI components in this phase — that's Phase 4+.

Requirements: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-07, CALC-11

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User granted full discretion on all implementation decisions for this phase. Claude should make sensible choices guided by:

**Default financial assumptions:**
- Choose current-market-appropriate defaults for mortgage rate, property tax %, maintenance %, home insurance, appreciation rate, rent increase rate
- Use well-sourced Canadian data (Bank of Canada, CMHC, StatsCan) as reference points
- Defaults should feel realistic to a Canadian user in 2025-2026

**Closing cost model:**
- Decide granularity (flat % vs itemized line items)
- Determine which buying costs (legal, inspection, appraisal, title insurance) and selling costs (realtor commission, legal) to include
- Balance accuracy with simplicity — this is a comparison tool, not a legal closing statement

**Homeowner cost breakdown:**
- Decide what line items appear in year-by-year projections
- At minimum: mortgage payment (P&I split for equity tracking), property tax, maintenance, insurance
- Whether to track condo fees as a separate line item

**Sale/exit modeling:**
- Decide how to model homeowner's position at time horizon end
- Handle principal residence exemption (no capital gains tax on primary residence in Canada)
- Include or exclude selling costs (realtor commission, legal fees)
- Handle mortgage penalty for mid-term sale if applicable

**Province data:**
- All 10 provinces minimum
- Land transfer tax formulas per province with correct marginal rate brackets
- First-time buyer rebate rules per province (CALC-11)
- Whether to include territories (lower priority — small population)

</decisions>

<specifics>
## Specific Ideas

- Must match RBC/TD mortgage calculators within $1/month (success criteria from roadmap)
- Use Decimal.js for all financial math — no floating-point drift over 30-year projections
- Canadian semi-annual compounding is non-negotiable (not US monthly compounding)
- Reference the Excel spreadsheet in project root for calculation logic patterns
- PWL Capital and HolyPotato spreadsheet are the math depth benchmarks from competitor research

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-housing-cost-engine*
*Context gathered: 2026-02-24*
