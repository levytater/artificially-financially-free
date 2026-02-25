---
phase: 02-housing-cost-engine
plan: 03
subsystem: calculations
tags: [decimal.js, land-transfer-tax, marginal-rate, fthb-rebate, provinces, typescript, tdd]

# Dependency graph
requires:
  - phase: 02-housing-cost-engine
    plan: 01
    provides: Province data constants, LTT bracket data, housing types (TaxBracket, ProvinceLttConfig, FthbRebateConfig)
provides:
  - Generic marginal rate calculator (calculateMarginalTax) reusable for Phase 3 income tax
  - Province-specific LTT calculation for all 10 provinces (AB/SK/NL fee formulas + 7 bracket provinces)
  - FTHB rebate calculation for ON (max $4K), BC (full to $835K, partial to $860K), PE (full)
  - LttResult interface for typed LTT calculation results
affects: [02-04-PLAN, 03-investment-engine, 04-input-panel, 05-verdict-display]

# Tech tracking
tech-stack:
  added: []
  patterns: [tdd-red-green-refactor, marginal-rate-engine, province-fee-special-cases]

key-files:
  created:
    - src/lib/calculations/land-transfer-tax.ts
    - __tests__/calculations/land-transfer-tax.test.ts
  modified:
    - src/lib/data/ltt-brackets.ts
    - src/types/housing.ts

key-decisions:
  - "BC FTHB maxRebate corrected from $8,000 to Infinity -- BC provides full PTT exemption, not a capped rebate"
  - "LttResult interface added to housing.ts for typed return values from LTT calculations"
  - "AB/SK/NL use dedicated fee functions (not marginal brackets) for registration fee formulas"
  - "calculateMarginalTax designed as standalone generic utility for Phase 3 income tax reuse"

patterns-established:
  - "TDD RED-GREEN-REFACTOR: failing tests committed first, then implementation, then cleanup"
  - "Province fee special cases: switch on province code to delegate to formula-based functions"
  - "Generic tax engine: calculateMarginalTax works for any progressive bracket system"
  - "FTHB partial exemption: linear interpolation between full and partial thresholds (BC model)"

requirements-completed: [CALC-03, CALC-11]

# Metrics
duration: 4min
completed: 2026-02-25
---

# Phase 2 Plan 3: Land Transfer Tax Summary

**Generic marginal rate calculator, province-specific LTT for all 10 provinces (including AB/SK/NL fee formulas), and FTHB rebates for ON/BC/PE with 48 passing TDD tests**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-25T05:36:17Z
- **Completed:** 2026-02-25T05:40:20Z
- **Tasks:** 1 (TDD: RED + GREEN + REFACTOR)
- **Files modified:** 4

## Accomplishments
- Generic `calculateMarginalTax` function handling any progressive bracket system (reusable for income tax in Phase 3)
- Province-specific LTT for all 10 provinces: 7 bracket-based (ON, BC, QC, MB, NB, NS, PE) + 3 fee-formula-based (AB, SK, NL)
- FTHB rebate logic: Ontario capped at $4,000, BC full exemption to $835K with linear partial zone to $860K, PEI full unconditional exemption
- 48 test cases covering every province, edge cases ($0, exact boundary, top brackets), and all FTHB scenarios

## Task Commits

Each TDD phase was committed atomically:

1. **RED: Failing tests for LTT, marginal rate, and FTHB** - `420d071` (test)
2. **GREEN: Implementation passing all 48 tests** - `c37622b` (feat)
3. **REFACTOR: Extract LttResult type, clean exports** - `082a58b` (refactor)

## Files Created/Modified
- `src/lib/calculations/land-transfer-tax.ts` - calculateMarginalTax (generic), calculateLandTransferTax (province-specific), calculateFthbRebate; plus internal AB/SK/NL fee functions
- `__tests__/calculations/land-transfer-tax.test.ts` - 48 test cases: 5 generic marginal, 24 province-specific LTT, 12 FTHB rebate, 2 combined, 10 all-province smoke tests
- `src/lib/data/ltt-brackets.ts` - Fixed BC FTHB maxRebate from $8,000 to Infinity (data bug)
- `src/types/housing.ts` - Added LttResult interface for typed LTT calculation results

## Decisions Made
- **BC FTHB maxRebate corrected:** The original data had `maxRebate: 8000` for BC, but BC provides full PTT exemption (not a $8K cap). Changed to `Infinity` to match the actual government policy.
- **LttResult interface added:** Formalized the return type of `calculateLandTransferTax` as a named interface in `housing.ts` for better reusability and type documentation.
- **Province fee special cases via switch:** AB ($50 + $5/$5K), SK ($25 + 0.4% over $6.3K), and NL ($100 + $0.40/$100 over $500) use dedicated internal functions rather than the marginal bracket calculator, since their fee structures don't fit the bracket model.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] BC FTHB maxRebate data incorrect**
- **Found during:** Task 1 GREEN phase (test case: BC $835K full exemption)
- **Issue:** `ltt-brackets.ts` had `maxRebate: 8000` for BC, but BC provides full PTT exemption up to $835K -- not a capped $8,000 rebate. Test expected full LTT ($14,700) to be rebated but only $8,000 was returned.
- **Fix:** Changed BC `maxRebate` from `8000` to `Infinity` to match actual government policy
- **Files modified:** `src/lib/data/ltt-brackets.ts`
- **Verification:** BC $835K test now returns full LTT as rebate. All 48 tests pass.
- **Committed in:** `c37622b` (GREEN phase commit)

**2. [Rule 1 - Bug] Test expectation for ON $368,333 threshold rounding**
- **Found during:** Task 1 GREEN phase (test case: ON exact threshold)
- **Issue:** Test expected `3999.99` but Decimal.js `toFixed(2)` with `ROUND_HALF_UP` correctly rounds `3999.995` to `4000.00`
- **Fix:** Corrected test expectation to `4000.00`
- **Files modified:** `__tests__/calculations/land-transfer-tax.test.ts`
- **Verification:** Test passes with correct rounding behavior
- **Committed in:** `c37622b` (GREEN phase commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for correctness. The BC data bug was a real error in Plan 01 data. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- LTT calculation complete and tested -- ready for housing projection orchestrator (Plan 04)
- `calculateMarginalTax` exported and ready for Phase 3 income tax bracket calculation
- `LttResult` type available for downstream consumers
- All province data validated through comprehensive test coverage

## Self-Check: PASSED

All 4 modified/created files verified on disk. All 3 task commits (420d071, c37622b, 082a58b) found in git log. All 48 tests pass.

---
*Phase: 02-housing-cost-engine*
*Completed: 2026-02-25*
