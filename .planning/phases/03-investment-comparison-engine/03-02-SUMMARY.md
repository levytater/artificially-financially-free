---
phase: 03-investment-comparison-engine
plan: 02
subsystem: calculations
tags: [investment, portfolio-growth, capital-gains, monthly-compounding, decimal.js, tdd]

# Dependency graph
requires:
  - phase: 01-project-foundation
    provides: Decimal.js configuration and financial precision helpers
provides:
  - calculateAfterTaxReturn function (capital gains 50% inclusion rate)
  - calculatePortfolioGrowth function (monthly compounding, lump sum + contributions)
  - PortfolioYear interface for year-by-year portfolio snapshots
affects: [03-investment-comparison-engine, 04-input-panel-state, 05-verdict-results]

# Tech tracking
tech-stack:
  added: []
  patterns: [month-by-month-investment-loop, negative-savings-clamping, percentage-to-decimal-conversion]

key-files:
  created:
    - src/lib/calculations/investment.ts
    - __tests__/calculations/investment.test.ts
    - src/types/investment.ts
  modified: []

key-decisions:
  - "Test expected value for $100K at 5.95% corrected from ~$133,469 to ~$133,507 (plan had incorrect manual calculation; verified via Decimal.js)"

patterns-established:
  - "Negative savings clamping via Decimal.max(savings, 0) inside the loop"
  - "Zero return edge case handled by explicit check before pow() to avoid precision issues"
  - "Monthly rate derived from annual: (1 + annual)^(1/12) - 1"

requirements-completed: [CALC-09, CALC-12]

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 3 Plan 2: Investment Portfolio Growth Summary

**After-tax return calculator with capital gains 50% inclusion and monthly-compounding portfolio growth engine using Decimal.js**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T14:46:36Z
- **Completed:** 2026-02-25T14:49:21Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files created:** 3

## Accomplishments
- `calculateAfterTaxReturn` correctly applies Canadian capital gains 50% inclusion rate to compute after-tax annual return from nominal return + marginal tax rate
- `calculatePortfolioGrowth` simulates month-by-month portfolio growth from lump sum + variable monthly contributions with monthly compounding
- All edge cases handled: zero return, negative savings clamped to zero, variable yearly savings, single-year horizon
- 11 new tests pass, 158 total tests green, TypeScript compiles cleanly

## Task Commits

Each task was committed atomically (TDD RED then GREEN):

1. **Task 1 RED: Failing investment tests** - `0c5e493` (test)
2. **Task 1 GREEN: Investment calculation implementation** - `6ea077a` (feat)

## Files Created/Modified
- `src/types/investment.ts` - PortfolioYear, YearlyComparison, ComparisonInput, ComparisonResult interfaces
- `src/lib/calculations/investment.ts` - calculateAfterTaxReturn and calculatePortfolioGrowth functions
- `__tests__/calculations/investment.test.ts` - 11 tests covering after-tax return and portfolio growth scenarios

## Decisions Made
- Test expected value for lump sum scenario corrected: plan stated $100K at 5.95% for 5 years should be ~$133,469 but the correct value is ~$133,507.24 (verified via Decimal.js computation of (1.0595)^5)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected test expected value for lump sum compounding**
- **Found during:** Task 1 GREEN phase
- **Issue:** Plan pre-computed $100K * (1.0595)^5 as ~$133,469 but the actual value is ~$133,507.24 (arithmetic error in plan)
- **Fix:** Updated test assertion from 133469 to 133507 with tolerance of 10
- **Files modified:** `__tests__/calculations/investment.test.ts`
- **Verification:** All 11 tests pass
- **Committed in:** `6ea077a` (GREEN phase commit)

---

**Total deviations:** 1 auto-fixed (1 bug in test expected value)
**Impact on plan:** Trivial correction to pre-computed test value. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Investment portfolio growth engine ready for use by Plan 03-03 (comparison orchestrator)
- `calculateAfterTaxReturn` and `calculatePortfolioGrowth` exported and tested
- Plan 03-01 (income tax brackets + combined marginal rate) provides the tax rate input
- Plan 03-03 will compose these with housing projection to produce full rent-vs-buy comparison

## Self-Check: PASSED

- [x] `src/lib/calculations/investment.ts` exists
- [x] `__tests__/calculations/investment.test.ts` exists
- [x] `src/types/investment.ts` exists
- [x] Commit `0c5e493` (RED) exists
- [x] Commit `6ea077a` (GREEN) exists
- [x] All 158 tests pass
- [x] TypeScript compiles with no errors

---
*Phase: 03-investment-comparison-engine*
*Completed: 2026-02-25*
