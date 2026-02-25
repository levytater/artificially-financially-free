---
phase: 02-housing-cost-engine
plan: 01
subsystem: calculations
tags: [decimal.js, property-tax, closing-costs, appreciation, rent, provinces, ltt, cmhc, typescript]

# Dependency graph
requires:
  - phase: 01-project-foundation
    provides: Decimal.js config (src/lib/decimal.ts), CalculatorState types, defaults
provides:
  - Housing calculation types (15+ interfaces for mortgage, CMHC, LTT, closing costs, projections)
  - Province data constants (codes, names, property tax rates for all 10 provinces)
  - LTT bracket data for all 10 provinces with FTHB rebate configs
  - CMHC premium rate table (6 tiers, surcharge, PST rates)
  - Closing cost defaults (buying and selling)
  - Property tax and maintenance calculation functions
  - Home appreciation calculation with schedule generation
  - Rent increase calculation with schedule generation
  - Buying and selling closing cost calculation functions
affects: [02-02-PLAN, 02-03-PLAN, 02-04-PLAN, 03-investment-engine, 04-input-panel, 05-verdict-display]

# Tech tracking
tech-stack:
  added: [vitest]
  patterns: [pure-decimal-calculations, typed-province-constants, percentage-input-decimal-internal]

key-files:
  created:
    - src/types/housing.ts
    - src/lib/data/provinces.ts
    - src/lib/data/ltt-brackets.ts
    - src/lib/data/cmhc-rates.ts
    - src/lib/data/closing-cost-defaults.ts
    - src/lib/calculations/property-tax.ts
    - src/lib/calculations/closing-costs.ts
    - src/lib/calculations/appreciation.ts
    - src/lib/calculations/rent.ts
    - __tests__/calculations/simple-calcs.test.ts
    - vitest.config.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Vitest installed for test infrastructure (not in original project deps)"
  - "LTT for AB/SK modeled as 0% brackets with fee logic deferred to LTT calculation function"
  - "NL registration fee modeled as bracket from $500 with 0.4% rate; base fee handled in LTT function"
  - "PE FTHB rebate uses Infinity for maxRebate and fullExemptionUpTo (full exemption, no cap)"
  - "Closing cost defaults use readonly ClosingCostItem array for buying, plain object for selling"
  - "All rate inputs as percentages (e.g., 3.0 for 3%), converted to decimals inside calculation functions"

patterns-established:
  - "Pure calculation functions: Decimal inputs -> Decimal outputs, zero side effects"
  - "Province data as typed readonly constants with as const for type narrowing"
  - "Percentage-in, decimal-internal: user-facing rates stored as percentages, converted inside functions"
  - "Schedule generators: return arrays for years 0 through totalYears (length = totalYears + 1)"
  - "Closing costs: external calculations (LTT, CMHC PST) passed as params, internal defaults from data file"

requirements-completed: [CALC-04, CALC-05, CALC-06, CALC-07]

# Metrics
duration: 4min
completed: 2026-02-25
---

# Phase 2 Plan 1: Housing Data Foundation Summary

**Province data constants for all 10 provinces, housing calculation types, and 4 simple calculation modules (property tax, appreciation, rent, closing costs) with 25 passing tests using Decimal.js**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-25T05:29:27Z
- **Completed:** 2026-02-25T05:33:14Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- 15+ housing calculation interfaces covering mortgage, CMHC, LTT, closing costs, and year-by-year projections
- Province data for all 10 Canadian provinces: LTT brackets (with FTHB rebates for ON, BC, PE), CMHC rates (6 tiers + surcharge + PST), default property tax rates
- 4 calculation modules (property tax, appreciation, rent, closing costs) with Decimal.js-only arithmetic
- 25 test cases all passing via Vitest

## Task Commits

Each task was committed atomically:

1. **Task 1: Create housing types and province data constants** - `088c1df` (feat)
2. **Task 2: Implement simple calculation functions with tests** - `cdee3da` (feat)

## Files Created/Modified
- `src/types/housing.ts` - All housing calculation interfaces (ProvinceCode, TaxBracket, CmhcTier, BuyingCosts, SellingCosts, YearlyHousingCost, HousingProjection, etc.)
- `src/lib/data/provinces.ts` - Province codes, names, default property tax rates for all 10 provinces
- `src/lib/data/ltt-brackets.ts` - Land transfer tax brackets for all 10 provinces with FTHB rebate configs
- `src/lib/data/cmhc-rates.ts` - CMHC premium tiers, amortization surcharge, PST rates, max purchase price
- `src/lib/data/closing-cost-defaults.ts` - Buying/selling cost defaults, insurance, maintenance, appreciation, rent increase rates
- `src/lib/calculations/property-tax.ts` - calculatePropertyTax, calculateMaintenance
- `src/lib/calculations/appreciation.ts` - calculateAppreciatedValue, calculateAppreciationSchedule
- `src/lib/calculations/rent.ts` - calculateRentForYear, calculateAnnualRent, calculateRentSchedule
- `src/lib/calculations/closing-costs.ts` - calculateBuyingCosts, calculateSellingCosts
- `__tests__/calculations/simple-calcs.test.ts` - 25 test cases covering all calculation functions
- `vitest.config.ts` - Vitest configuration with @/ path alias

## Decisions Made
- Installed Vitest (not in original project dependencies) -- needed for test infrastructure (Rule 3: blocking issue)
- Modeled AB/SK as 0% LTT brackets; actual registration fee calculation deferred to the LTT calculation function in Plan 3
- NL registration fee modeled as a bracket from $500 at 0.4% rate; the $100 base fee will be handled in the LTT function
- PE FTHB uses Infinity for maxRebate and fullExemptionUpTo to represent full unconditional exemption
- All rate inputs use percentage convention (3.0 for 3%) matching how users and banks display rates; conversion happens inside each function

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed Vitest test framework**
- **Found during:** Pre-Task 2 setup
- **Issue:** Vitest not in package.json but required for running tests
- **Fix:** `npm install --save-dev vitest`, created `vitest.config.ts` with @/ alias
- **Files modified:** package.json, package-lock.json, vitest.config.ts
- **Verification:** `npx vitest run` executes successfully
- **Committed in:** `cdee3da` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Vitest installation was expected by the plan ("If vitest config doesn't exist yet, create a minimal vitest.config.ts"). No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Housing types ready for Plans 02-04 (mortgage, CMHC, LTT calculation functions)
- Province data constants ready for LTT calculation (Plan 03)
- CMHC rate table ready for CMHC calculation (Plan 03)
- Closing cost functions ready for housing projection orchestrator (Plan 04)
- Vitest infrastructure ready for TDD plans (Plans 02-03)

## Self-Check: PASSED

All 11 created files verified on disk. Both task commits (088c1df, cdee3da) found in git log. TypeScript compilation passes. All 25 tests pass.

---
*Phase: 02-housing-cost-engine*
*Completed: 2026-02-25*
