# Phase 3: Investment & Comparison Engine - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Calculate renter investment growth with tax implications, produce a year-by-year net worth comparison between renting and buying, and identify a clear winner with break-even year. This phase builds the calculation engine only — no UI, no charts, no inputs. Requirements: CALC-08, CALC-09, CALC-10, CALC-12, CALC-13, CALC-14.

</domain>

<decisions>
## Implementation Decisions

### Investment Model (simplification of CALC-12)
- **No account types.** Drop TFSA/RRSP/Non-registered distinction entirely
- Single investment portfolio with two inputs: **return %** and **tax rate %**
- Engine calculates after-tax return using capital gains 50% inclusion rate: `after_tax_return = return × (1 - tax_rate × 0.5)`
- Both return % and tax rate % visible in Simple and Advanced mode (not hidden)
- This replaces the original three-account model — simpler, matches the Excel reference file approach

### Tax Calculation (CALC-13)
- **Auto-calculate** combined federal + provincial marginal tax rate from user's annual income + province
- Use **2025 tax brackets, hardcoded** — federal and all provincial brackets
- User can **override** the auto-calculated rate with a manual tax rate input
- Capital gains **50% inclusion rate** applied to investment returns before tax

### Renter Net Worth (CALC-09, CALC-10)
- **Lump sum investment on day 1:** Down payment + closing costs the buyer would have spent — invested immediately
- **Monthly contributions:** Each month, difference between total buyer costs (mortgage + property tax + maintenance + insurance) and rent — invested monthly
- Both components compound together as one portfolio at the after-tax return rate
- **Negative monthly savings → zero:** When buyer costs are less than rent in a given month, no new investment but no withdrawal either. Portfolio keeps compounding

### Buyer Net Worth (CALC-10)
- Engine supports **two modes:** with and without selling costs at any given year
- With selling costs: buyer net worth = home value - mortgage balance - selling costs (realtor commission + legal fees)
- Without selling costs: buyer net worth = home value - mortgage balance
- Phase 4 will expose this as a user toggle; engine must support both calculations

### Break-Even Year (CALC-08)
- First year where buying net worth exceeds renting net worth
- If buying never wins within the time horizon: report "never"

### Inflation Adjustment (CALC-14)
- Engine always calculates in **nominal (unadjusted) dollars** internally
- **Toggle for "real dollars" view:** divides displayed values by (1 + inflation)^year
- Deflate displayed values only — do NOT reduce the investment return rate
- Default inflation rate: **2.5%** (slightly above Bank of Canada 2% target)
- Inflation rate is **user-adjustable**

### Claude's Discretion
- Internal data structure for year-by-year results (array of objects, typed interfaces, etc.)
- How to structure the tax bracket lookup tables
- Compounding frequency for investment calculations (monthly vs annual)
- Edge case handling (zero time horizon, 0% return, 100% down payment)

</decisions>

<specifics>
## Specific Ideas

- "Follow the Excel file method" — the reference spreadsheet uses return % + tax rate % approach, not account-type separation
- Selling costs toggle idea: user wants a "Sell house this year" control — engine needs to support this by calculating both modes at every year point

</specifics>

<deferred>
## Deferred Ideas

- TFSA/RRSP/Non-registered account separation — could be a future Advanced+ mode or v2 feature
- RRSP Home Buyer Plan (HBP) withdrawal modeling — already listed as v2 requirement UX-07
- Per-account different return rates — dropped with the account type simplification

</deferred>

---

*Phase: 03-investment-comparison-engine*
*Context gathered: 2026-02-25*
