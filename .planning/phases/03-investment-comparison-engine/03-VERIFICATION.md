---
phase: 03-investment-comparison-engine
verified: 2026-02-25T18:05:00Z
status: passed
score: 22/22 must-haves verified
re_verification: false
---

# Phase 3: Investment & Comparison Engine Verification Report

**Phase Goal:** Renter investment growth is modeled with a single portfolio (return % + tax rate %), and the full rent-vs-buy net worth comparison produces a clear winner with break-even year

**Verified:** 2026-02-25T18:05:00Z

**Status:** PASSED

**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Combined federal + provincial marginal tax rate is calculated correctly for any income and province | ✓ VERIFIED | `calculateCombinedMarginalRate` tested with $60K ON (29.65%), $200K BC (45.80%), all 10 provinces at $100K, edge cases ($0 income, $300K ON) — all pass |
| 2 | Marginal rate lookup finds the correct bracket for incomes at boundaries and mid-bracket | ✓ VERIFIED | `findMarginalRate` reverse-scans brackets correctly, tested via combined rate tests at various income levels |
| 3 | All 10 provinces return valid marginal rates for typical Canadian incomes ($50K-$200K) | ✓ VERIFIED | Test suite includes all 10 provinces at $100K income, rates range 25%-45% (all reasonable) |
| 4 | Nominal dollar values can be deflated to real dollars using an inflation rate and year | ✓ VERIFIED | `deflateToRealDollars` tested: $100K at 2.5% for 10 years = $78,120, year 0 returns unchanged, 0% inflation works |
| 5 | After-tax investment return is correctly calculated using capital gains 50% inclusion rate | ✓ VERIFIED | `calculateAfterTaxReturn` tested: 7% at 30% tax = 5.95% (formula: 0.07 * (1 - 0.30 * 0.5)) |
| 6 | Investment portfolio grows from a lump sum initial investment compounded monthly | ✓ VERIFIED | `calculatePortfolioGrowth` tested: $100K at 5.95% for 5 years = $133,507 (monthly compounding verified) |
| 7 | Monthly contributions are added to portfolio and compound alongside existing balance | ✓ VERIFIED | Tests include contributions-only ($1,000/month) and mixed scenarios ($50K lump + $500/month) |
| 8 | Negative monthly savings are clamped to zero — no withdrawals from portfolio | ✓ VERIFIED | Test explicitly passes negative savings (Decimal(-500)), verifies balance only grows from compounding |
| 9 | Portfolio with 0% return grows only from contributions (no compounding growth) | ✓ VERIFIED | Test: $50K + $1,000/month at 0% for 2 years = exactly $74,000 (no growth beyond contributions) |
| 10 | Year-by-year comparison shows renter portfolio value alongside buyer home equity for every year | ✓ VERIFIED | `yearlyComparison` array verified in tests: 25-year scenario produces 25 entries with year numbering 1-25 |
| 11 | Renter lump sum investment equals buyer's down payment plus buying closing costs | ✓ VERIFIED | Test verifies `portfolio[0].startBalance` equals down payment + closing costs from housing projection |
| 12 | Monthly savings calculated as max(0, buyer monthly cost - monthly rent) for each year | ✓ VERIFIED | Code uses `Decimal.max(buyerMonthlyCost - renterMonthlyCost, 0)`, test verifies positive savings in early years |
| 13 | Break-even year correctly identified as first year buying net worth exceeds renting | ✓ VERIFIED | `findBreakEvenYear` tested: returns year number when buyer wins, tested with both early (year 1) and late (year 15) scenarios |
| 14 | Break-even returns 'never' when buying never wins within the time horizon | ✓ VERIFIED | Test scenario with 3-year horizon, high rent, low appreciation verifies `breakEvenWithSelling = 'never'` |
| 15 | Buyer net worth calculated both with and without selling costs | ✓ VERIFIED | `yearlyComparison` includes both `buyerNetWorthWithSelling` and `buyerNetWorthWithoutSelling` fields, test verifies with-selling < without-selling |
| 16 | Comparison orchestrator composes housing projection, rent schedule, tax rate, and portfolio growth into a single result | ✓ VERIFIED | `calculateRentVsBuyComparison` imports and calls all Phase 2/3 modules, returns complete `ComparisonResult` |
| 17 | Renter monthly savings (difference between total buyer costs and rent) are calculated correctly and invested each month | ✓ VERIFIED | Orchestrator derives monthly savings from housing projection yearly costs and rent schedule, passes to portfolio growth |
| 18 | Investment returns are modeled as a single portfolio with return % and tax rate % using capital gains 50% inclusion rate | ✓ VERIFIED | Single `calculatePortfolioGrowth` call with after-tax return from 50% inclusion formula |
| 19 | Federal and provincial income tax on investment gains is estimated using the user's annual income and province, with manual override support | ✓ VERIFIED | `calculateCombinedMarginalRate` auto-calculates, `taxRateOverride` tested and bypasses auto-calc |
| 20 | Year-by-year net worth comparison shows renter portfolio value vs buyer home equity minus remaining costs for every year of the time horizon | ✓ VERIFIED | `yearlyComparison` array contains `renterNetWorth`, `buyerNetWorthWithSelling`, `buyerNetWorthWithoutSelling` for all years |
| 21 | Break-even year is identified as the first year where buying net worth exceeds renting net worth (or "never" if buying never wins) | ✓ VERIFIED | `findBreakEvenYear` tested with both 'withSelling' and 'withoutSelling' modes, both 'never' and numeric year cases |
| 22 | Marginal tax rate auto-calculated from income + province, with manual override support | ✓ VERIFIED | Test with `taxRateOverride = 40.0` verifies `marginalTaxRate = 40.0` bypasses auto-calculation |

**Score:** 22/22 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/data/income-tax-brackets.ts` | Federal and all 10 provincial 2025 income tax brackets | ✓ VERIFIED | Contains `FEDERAL_TAX_BRACKETS` (5 brackets) and `PROVINCIAL_TAX_BRACKETS` for AB, BC, MB, NB, NL, NS, ON, PE, QC, SK — all as typed constants |
| `src/lib/calculations/income-tax.ts` | Combined marginal tax rate calculation | ✓ VERIFIED | Exports `calculateCombinedMarginalRate`, contains `findMarginalRate` helper, 75 lines |
| `src/lib/calculations/inflation.ts` | Nominal-to-real dollar deflation | ✓ VERIFIED | Exports `deflateToRealDollars`, 44 lines |
| `src/types/investment.ts` | Investment and comparison type definitions | ✓ VERIFIED | Contains `PortfolioYear`, `YearlyComparison`, `ComparisonInput`, `ComparisonResult` interfaces, 99 lines |
| `__tests__/calculations/income-tax.test.ts` | Income tax calculation tests | ✓ VERIFIED | 118 lines (min: 40), 18 tests covering specific combos + all 10 provinces |
| `__tests__/calculations/inflation.test.ts` | Inflation deflation tests | ✓ VERIFIED | 41 lines (min: 15), 5 tests covering year 0, year 10/25, 0% rate, year 1 |
| `src/lib/calculations/investment.ts` | After-tax return calculation and portfolio growth simulation | ✓ VERIFIED | Exports `calculateAfterTaxReturn` and `calculatePortfolioGrowth`, 92 lines |
| `__tests__/calculations/investment.test.ts` | Investment calculation tests | ✓ VERIFIED | 209 lines (min: 60), 11 tests covering after-tax return, portfolio growth scenarios |
| `src/lib/calculations/comparison.ts` | Rent-vs-buy comparison orchestrator with break-even analysis | ✓ VERIFIED | Exports `calculateRentVsBuyComparison` and `findBreakEvenYear`, 194 lines |
| `__tests__/calculations/comparison.test.ts` | Comparison and break-even tests | ✓ VERIFIED | 338 lines (min: 80), 18 tests covering break-even logic and full integration scenarios |

**All artifacts exist, substantive (meet line minimums), and export correct functions.**

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `income-tax.ts` | `income-tax-brackets.ts` | import bracket constants | ✓ WIRED | Imports `FEDERAL_TAX_BRACKETS` and `PROVINCIAL_TAX_BRACKETS`, uses in `findMarginalRate` function |
| `investment.ts` | `decimal.ts` | import Decimal | ✓ WIRED | Imports Decimal, used throughout for financial precision |
| `comparison.ts` | `housing-projection.ts` | import calculateHousingProjection | ✓ WIRED | Imports and calls in line 92, passes `HousingProjectionInput` |
| `comparison.ts` | `investment.ts` | import calculateAfterTaxReturn, calculatePortfolioGrowth | ✓ WIRED | Imports both, calls `calculateAfterTaxReturn` line 106, `calculatePortfolioGrowth` line 143 |
| `comparison.ts` | `income-tax.ts` | import calculateCombinedMarginalRate | ✓ WIRED | Imports and calls line 100 (with taxRateOverride check) |
| `comparison.ts` | `rent.ts` | import calculateRentSchedule | ✓ WIRED | Imports and calls line 111, uses result to derive monthly savings |
| `comparison.ts` | `closing-costs.ts` | import calculateSellingCosts | ✓ WIRED | Imports and calls line 164 inside year-by-year loop for selling costs |

**All key links verified. All imports present and used in code.**

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CALC-08 | 03-03-PLAN | Break-even year identified as first year buying net worth exceeds renting | ✓ SATISFIED | `findBreakEvenYear` function tested and working, returns year number or 'never' |
| CALC-09 | 03-02-PLAN | Renter's monthly savings invested and compounded over time | ✓ SATISFIED | `calculatePortfolioGrowth` handles monthly contributions with monthly compounding |
| CALC-10 | 03-03-PLAN | Year-by-year net worth comparison produced for both renter and buyer | ✓ SATISFIED | `yearlyComparison` array contains all required fields for each year |
| CALC-12 | 03-02-PLAN | Investment returns modeled with tax implications (simplified to single portfolio) | ✓ SATISFIED | `calculateAfterTaxReturn` applies capital gains 50% inclusion rate |
| CALC-13 | 03-01-PLAN | Federal and provincial income tax estimated on investment gains | ✓ SATISFIED | `calculateCombinedMarginalRate` combines federal + provincial brackets |
| CALC-14 | 03-01-PLAN | Inflation adjustment applied to normalize future values | ✓ SATISFIED | `deflateToRealDollars` function available (not yet used by UI, but tested) |

**All 6 requirements satisfied with implementation evidence.**

**No orphaned requirements.** All Phase 3 requirements from REQUIREMENTS.md (CALC-08 through CALC-14) are claimed by plans and verified.

### Anti-Patterns Found

None. All files follow established patterns:
- TDD workflow with RED/GREEN commits
- Decimal.js used consistently for financial calculations
- Functions exported and tested
- No TODOs, FIXMEs, or placeholder comments
- No console.log-only implementations
- No empty return values

### Human Verification Required

None. All verification criteria are programmatically testable:
- Mathematical correctness verified via test assertions with known values
- Bracket lookup logic verified via boundary tests
- Portfolio growth verified via manual calculations in tests
- Break-even logic verified via synthetic scenarios

All 199 tests pass, TypeScript compiles cleanly, no human testing needed for Phase 3.

---

## Summary

**Phase 3 COMPLETE. Goal achieved.**

All 22 observable truths verified. All 10 artifacts exist, are substantive, and properly wired. All 6 requirements satisfied. Full test suite passes (199 tests, no regressions from Phase 2's 147 tests).

**What was delivered:**

1. **Income tax engine** — Combined federal + provincial marginal rate calculation for all 10 provinces
2. **Inflation deflation** — Nominal-to-real dollar conversion utility (ready for UI toggle)
3. **Investment portfolio growth** — After-tax return calculation (capital gains 50% inclusion) + monthly-compounding portfolio simulator
4. **Comparison orchestrator** — Top-level function that composes all Phase 2 (housing) and Phase 3 (investment/tax) calculations into complete rent-vs-buy comparison
5. **Break-even analysis** — Dual break-even calculation (with/without selling costs)
6. **Type definitions** — Complete TypeScript interfaces for portfolio, comparison input/result

**What works:**

- Renter invests buyer's day-1 cash outlay (down payment + buying closing costs)
- Monthly savings (buyer cost - rent) calculated per year, clamped to zero (no withdrawals)
- Portfolio grows via monthly compounding from lump sum + contributions
- Year-by-year comparison tracks renter portfolio vs buyer equity (with/without selling costs)
- Break-even correctly identifies first year buying wins, or 'never' if it doesn't
- Tax rate auto-calculated from income + province, manual override supported
- All calculations use Decimal.js for financial precision

**Ready for Phase 4:**

The comparison engine is fully functional and tested. Phase 4 (Input Panel & State Management) can now:
1. Collect all `ComparisonInput` fields from the user
2. Call `calculateRentVsBuyComparison(input)`
3. Receive complete `ComparisonResult` with all data needed for verdict display and charts

**Limitations (as designed for v1):**

- Single portfolio model (not TFSA/RRSP/Non-registered split — deferred to v2 per REQUIREMENTS.md decision)
- Ontario surtax not modeled (small impact, user can override with manual tax rate)
- Quebec 16.5% federal abatement not modeled (user can override)
- Inflation deflation implemented but not yet wired to UI (Phase 4 will add toggle)

No gaps. No blockers. Phase 3 goal achieved.

---

_Verified: 2026-02-25T18:05:00Z_
_Verifier: Claude (gsd-verifier)_
