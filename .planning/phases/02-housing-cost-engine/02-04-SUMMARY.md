---
phase: 02-housing-cost-engine
plan: 04
subsystem: calculations
tags: [decimal.js, housing-projection, orchestrator, integration, tdd, vitest, mortgage, cmhc, ltt, closing-costs, appreciation]

# Dependency graph
requires:
  - phase: 02-housing-cost-engine
    plan: 01
    provides: Housing types, province data, property tax, maintenance, appreciation, rent, closing costs
  - phase: 02-housing-cost-engine
    plan: 02
    provides: Mortgage payment, amortization schedule, yearly summary, CMHC premium
  - phase: 02-housing-cost-engine
    plan: 03
    provides: Land transfer tax, marginal rate calculator, FTHB rebates
provides:
  - calculateHousingProjection orchestrator function (single entry point for complete housing cost analysis)
  - HousingProjectionInput interface for calculator inputs
  - Complete HousingProjection output: upfront costs, year-by-year projection, exit position
  - 147 total Phase 2 tests across 5 test files (25 simple + 15 mortgage + 16 CMHC + 48 LTT + 43 projection)
affects: [03-investment-engine, 04-input-panel, 05-verdict-display, 06-chart-visualizations]

# Tech tracking
tech-stack:
  added: []
  patterns: [orchestrator-composition, start-of-year-property-assessment, post-amortization-zero-cost]

key-files:
  created:
    - src/lib/calculations/housing-projection.ts
    - __tests__/calculations/housing-projection.test.ts
  modified: []

key-decisions:
  - "Property tax and maintenance use start-of-year home value (purchase price for year 1) for consistency and simplicity"
  - "Post-amortization years (timeHorizon > amortizationYears) set mortgage payment/principal/interest to $0"
  - "Defaults resolved from province data (property tax rate) and closing-cost-defaults (maintenance 1%, insurance $2400, appreciation 3%)"

patterns-established:
  - "Orchestrator composition: single function composes 6+ calculation modules into complete projection"
  - "Start-of-year assessment: property tax and maintenance based on home value at start of year (not appreciated end-of-year value)"
  - "Post-amortization handling: after mortgage payoff, only ongoing costs (tax + maintenance + insurance) apply"
  - "HousingProjectionInput uses percentage convention matching all other calculation functions"

requirements-completed: [CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-07, CALC-11]

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 2 Plan 4: Housing Projection Orchestrator Summary

**Single-function housing projection composing mortgage, CMHC, LTT, property tax, appreciation, and closing costs into year-by-year cost projection with upfront costs and exit position -- 43 integration tests passing, 147 total Phase 2 tests**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T05:43:34Z
- **Completed:** 2026-02-25T05:46:46Z
- **Tasks:** 2 (1 TDD implementation + 1 validation)
- **Files modified:** 2

## Accomplishments
- `calculateHousingProjection` orchestrator composing all 6+ Phase 2 calculation modules into a single function call
- Upfront costs: down payment, CMHC premium/PST, LTT with FTHB rebate, buying closing costs, total cash required
- Year-by-year projection with P&I split, property tax, maintenance, insurance, home value, equity, cumulative costs
- Exit position with appreciated home value, remaining mortgage, selling costs, and net proceeds
- Handles mortgage payoff before time horizon end (post-amortization years have $0 mortgage cost)
- 43 integration tests covering default scenario, CMHC scenario, extended horizon, exit positions, and edge cases
- Full Phase 2 test suite: 147 tests across 5 files, all passing
- TypeScript compiles cleanly with no errors
- No native JS arithmetic on financial values in any calculation file

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Failing tests for housing projection** - `9205aef` (test)
2. **Task 1 GREEN: Housing projection implementation** - `8c9b73e` (feat)

_Task 2 was validation-only (run full test suite, verify TypeScript compilation, check API exports) -- no code changes needed._

## Files Created/Modified
- `src/lib/calculations/housing-projection.ts` - calculateHousingProjection orchestrator function, HousingProjectionInput interface
- `__tests__/calculations/housing-projection.test.ts` - 43 integration tests: upfront costs (6), CMHC scenario (4), yearly projection (12), mortgage payoff (4), exit position (5), exit with remaining mortgage (3), edge cases (8), CMHC principal (1)

## Decisions Made
- **Start-of-year property assessment:** Property tax and maintenance calculated on home value at the start of each year (purchase price for year 1, previous year's appreciated value thereafter). This is simpler and matches how property tax assessments work in practice (assessed on prior year's value).
- **Post-amortization zero cost:** When time horizon exceeds amortization period, years after mortgage payoff have $0 mortgage payment, $0 principal/interest, and $0 remaining balance. Only ongoing costs (property tax, maintenance, insurance) apply.
- **Default resolution:** Optional inputs fall back to province-specific defaults (property tax rate) or global defaults (maintenance 1%, insurance $2,400, appreciation 3%) from existing data files.

## Deviations from Plan

None -- plan executed exactly as written. All 43 tests passed on first implementation without corrections needed.

## Issues Encountered
None

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- `calculateHousingProjection(input)` ready for Phase 3 investment comparison engine
- `HousingProjectionInput` interface matches `CalculatorState` structure for easy integration in Phase 4
- All types from `src/types/housing.ts` properly exported for downstream consumers
- `calculateMarginalTax` exported from LTT module ready for Phase 3 income tax bracket calculation
- Full Phase 2 test suite (147 tests) provides regression safety for future changes

## Self-Check: PASSED

All 2 created files verified on disk. Both task commits (9205aef, 8c9b73e) found in git log. All 147 tests pass. TypeScript compiles cleanly.

---
*Phase: 02-housing-cost-engine*
*Completed: 2026-02-25*
