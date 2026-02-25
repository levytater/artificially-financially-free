---
phase: 03-investment-comparison-engine
plan: 03
subsystem: calculations
tags: [comparison-orchestrator, break-even, year-by-year, net-worth, tdd]

# Dependency graph
requires:
  - phase: 02-housing-cost-engine
    provides: "calculateHousingProjection, calculateRentSchedule, calculateSellingCosts"
  - phase: 03-01
    provides: "calculateCombinedMarginalRate"
  - phase: 03-02
    provides: "calculateAfterTaxReturn, calculatePortfolioGrowth"
provides:
  - "calculateRentVsBuyComparison(input) -> ComparisonResult with year-by-year net worth comparison"
  - "findBreakEvenYear(comparison, mode) -> year number or 'never'"
  - "Complete composition of all Phase 2 + Phase 3 calculations"
affects: [04-input-panel, 05-verdict-display, 06-chart-visualizations]

# Tech tracking
tech-stack:
  added: []
  patterns: [lump-sum-calculation, monthly-savings-clamping, dual-break-even-scenarios]

key-files:
  created:
    - src/lib/calculations/comparison.ts
    - __tests__/calculations/comparison.test.ts
  modified: []

key-decisions:
  - "Lump sum = down payment + buying closing costs (total cash outlay buyer would spend on day 1)"
  - "Monthly savings clamped to max(0, buyer cost - rent) to prevent portfolio withdrawals"
  - "Dual break-even calculation: one with selling costs, one without (reflects whether buyer would sell or stay)"
  - "Tax rate override bypasses auto-calculation when user provides manual rate"

patterns-established:
  - "Comparison orchestrator pattern: compose multiple calculation modules into single top-level result"
  - "Break-even as first year where buyer net worth >= renter net worth, or 'never'"
  - "Year-by-year comparison includes both buyer scenarios (with/without selling costs)"

requirements-completed: [CALC-08, CALC-10]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 3 Plan 3: Comparison Orchestrator Summary

**Rent-vs-buy comparison engine that composes all Phase 2 and Phase 3 calculations into complete year-by-year net worth comparison with dual break-even analysis**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T14:54:33Z
- **Completed:** 2026-02-25T14:57:16Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- `calculateRentVsBuyComparison` orchestrates housing projection, rent schedule, tax rate, portfolio growth into complete comparison
- Year-by-year net worth tracking for renter (portfolio value) vs buyer (home equity with/without selling costs)
- Break-even analysis identifies first year buying wins, or 'never' if it doesn't within time horizon
- Dual break-even scenarios: one accounting for selling costs, one without
- Lump sum investment equals buyer's total day-1 cash outlay (down payment + buying closing costs)
- Monthly savings correctly clamped to zero (no withdrawals from portfolio)
- Tax rate auto-calculated from income + province, with manual override support
- All 199 tests pass (Phase 2: 147, Phase 3: 52), TypeScript compiles cleanly

## Task Commits

Each task was committed atomically (TDD RED then GREEN):

1. **Task 1 RED: Failing comparison orchestrator tests** - `15509d8` (test)
2. **Task 1 GREEN: Implement comparison orchestrator** - `7247a6a` (feat)
3. **Task 2: Full test suite validation** - `27f14f8` (chore)

## Files Created/Modified

- `src/lib/calculations/comparison.ts` - Complete rent-vs-buy comparison orchestrator with break-even analysis
- `__tests__/calculations/comparison.test.ts` - 18 tests covering findBreakEvenYear and full integration scenarios

## Decisions Made

- **Lump sum composition:** Renter invests buyer's total upfront cash (down payment + buying closing costs from housing projection's upfrontCosts.buyingClosingCosts). This matches the "opportunity cost" framing — the renter invests what the buyer would have spent.
- **Monthly savings clamping:** Applied `Decimal.max(buyerMonthlyCost - renterMonthlyCost, 0)` to prevent negative savings. Renter never withdraws from portfolio even if rent exceeds buyer costs in later years.
- **Tax rate override precedence:** When `taxRateOverride` is not null/undefined, use it directly as Decimal. Otherwise, auto-calculate via `calculateCombinedMarginalRate`. Supports users who want manual control over tax assumptions.
- **Break-even dual scenarios:** Calculate both 'withSelling' and 'withoutSelling' break-even years. Reflects two realistic outcomes: buyer sells (incurs selling costs) vs buyer stays long-term (no selling costs). Selling costs delay break-even.

## Deviations from Plan

None - plan executed exactly as written. All composition logic, break-even algorithms, and test scenarios matched the plan specification.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Phase 3 complete.** All calculation engines are implemented and tested:
  - Phase 2: Housing cost projection with mortgage, taxes, maintenance, appreciation
  - Phase 3-01: Income tax + inflation utilities
  - Phase 3-02: Investment portfolio growth with after-tax returns
  - Phase 3-03: Full rent-vs-buy comparison orchestrator
- **Phase 4 ready:** Input panel can now call `calculateRentVsBuyComparison` with a single `ComparisonInput` object and receive complete `ComparisonResult`
- **Phase 5 ready:** Verdict display has `yearlyComparison` array with all data needed for net worth summary
- **Phase 6 ready:** Chart components have `yearlyComparison` and `portfolio` arrays for time-series visualizations
- Total test suite: 199 tests, all passing

## Self-Check: PASSED

- [x] `src/lib/calculations/comparison.ts` exists
- [x] `__tests__/calculations/comparison.test.ts` exists
- [x] Commit `15509d8` (RED) exists
- [x] Commit `7247a6a` (GREEN) exists
- [x] Commit `27f14f8` (validation) exists
- [x] All 199 tests pass
- [x] TypeScript compiles with no errors
- [x] `calculateRentVsBuyComparison` returns complete `ComparisonResult`
- [x] `findBreakEvenYear` correctly identifies break-even or 'never'
- [x] Lump sum = down payment + buying closing costs
- [x] Monthly savings clamped to >= 0
- [x] Buyer net worth with selling < without selling (selling costs reduce equity)
- [x] Break-even with selling >= break-even without selling (or 'never')

---
*Phase: 03-investment-comparison-engine*
*Completed: 2026-02-25*
