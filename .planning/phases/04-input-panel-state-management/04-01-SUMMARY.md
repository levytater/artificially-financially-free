---
phase: 04-input-panel-state-management
plan: 01
subsystem: calculator-state
tags: [types, validation, formatting, url-state]
completed: 2026-02-25
duration: 2min
requirements:
  - INPUT-02
  - INPUT-06
  - INPUT-07
  - INPUT-08
  - INPUT-10
dependency_graph:
  requires: []
  provides:
    - Extended CalculatorState type with 11 new fields
    - Canadian-aware validation functions
    - Locale-aware formatting utilities
    - URL parsers for all state fields
  affects:
    - All Phase 4 input components (will consume these types)
    - Wizard and sidebar components (will use validation/formatting)
    - Future URL state ingestion (parsers ready)
tech_stack:
  added:
    - nuqs parsers for 11 new fields (advancedMode, investment returns, housing rates)
  patterns:
    - Field-specific validators returning undefined (valid) or error string (invalid)
    - Intl.NumberFormat for Canadian currency formatting
    - Type-safe validateField dispatcher for per-field validation
key_files:
  created:
    - src/lib/validation.ts (338 lines, 17 validator functions)
    - src/lib/formatting.ts (69 lines, 6 formatter functions)
  modified:
    - src/types/calculator.ts (extended with 11 new fields)
    - src/lib/defaults.ts (updated defaults to match CONTEXT.md decisions)
    - src/lib/parsers.ts (added parsers and URL keys for new fields)
    - src/content/tooltips.ts (added tooltip content for new fields)
decisions:
  - key: Default purchase price updated from $600K to $500K
    rationale: Per CONTEXT.md locked decision for realistic Canadian scenario
  - key: Default time horizon updated from 25 years to 10 years
    rationale: Per CONTEXT.md expected time horizon for typical user decisions
  - key: Maintenance default set to 1.5% (not 1%)
    rationale: Research recommended 1.5% as more realistic for Canadian homeownership
  - key: Canadian down payment tiers implemented in validation
    rationale: "Homes <=500K: 5%, 500K-1M: 5%+10%, >1M: 20% minimums"
  - key: Per-account return rates default to master dial value (6%)
    rationale: Advanced mode allows overrides, but Simple mode uses one master dial
metrics:
  tasks_completed: 2
  commits: 2
  files_changed: 6
  lines_added: 451
---

# Phase 04 Plan 01: Calculator State & Utilities Foundation Summary

Extended calculator state with all Phase 4 fields (advancedMode toggle, master investment return dial, per-account return overrides, housing cost rates). Created Canadian-aware validation and locale-aware formatting utilities. Updated defaults to match CONTEXT.md decisions ($500K purchase price, 10yr horizon).

## Tasks Completed

| Task | Name                                                         | Commit  | Files                                                                    |
| ---- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------------------ |
| 1    | Extend CalculatorState, defaults, and parsers with Phase 4   | 5bed878 | calculator.ts, defaults.ts, parsers.ts, tooltips.ts                      |
| 2    | Create validation and formatting utility modules             | 6835fd3 | validation.ts (new), formatting.ts (new)                                 |

## What Was Built

### Extended Calculator State (Task 1)

**CalculatorState interface** extended with 11 new fields:
- `advancedMode: boolean` — toggles between Simple and Advanced input modes
- `investmentReturn: number` — master dial for expected investment returns (6% default)
- `tfsaReturn`, `rrspReturn`, `nonRegisteredReturn` — per-account return overrides for Advanced mode
- `appreciationRate: number` — home appreciation rate (3% default)
- `rentIncreaseRate: number` — annual rent increase (2% default)
- `inflationRate: number` — general inflation (2.5% default)
- `maintenancePercent: number` — annual maintenance cost as % of home value (1.5% default)
- `sellingCostsPercent: number` — transaction costs at sale (6% default)
- `homeInsurance: number` — annual homeowner insurance ($2,400 default)

**Defaults updated** to match CONTEXT.md locked decisions:
- Purchase price: $600K → **$500K** (more realistic Canadian scenario)
- Time horizon: 25 years → **10 years** (expected user planning horizon)
- Maintenance: 1.5% (research-backed, more realistic than existing 1% in closing-cost-defaults)

**nuqs parsers and URL keys** added for all 11 new fields with compact URL parameter names:
- `advancedMode` → `?adv=true`
- `investmentReturn` → `?return=6`
- `appreciationRate` → `?appr=3`
- `rentIncreaseRate` → `?rentup=2`
- `maintenancePercent` → `?maint=1.5`
- etc.

**Tooltip content** added for all new fields:
- Investment return: Explains 6-7% historical stock market average
- Per-account returns: Describes tax treatment (TFSA tax-free, RRSP tax-deferred, Non-reg taxed)
- Appreciation rate: Historical Canadian 3-5% long-term average
- Rent increase: Provincial guidelines, CPI-aligned
- Maintenance: 1-2% rule of thumb
- Selling costs: 5% realtor commission + 1% legal fees

### Validation Utilities (Task 2)

**src/lib/validation.ts** created with comprehensive field validation:

Individual validators (17 functions):
- `validatePurchasePrice`: $0-$10M range
- `validateDownPaymentPercent`: **Canadian minimum down payment rules** implemented:
  - Homes ≤ $500K: minimum 5%
  - Homes $500K-$1M: 5% on first $500K + 10% on remainder (calculates exact percentage)
  - Homes > $1M: minimum 20%
- `validateMortgageRate`: 0-20% range, cannot be negative
- `validateAmortization`: 1-30 years, integer only
- `validateTimeHorizon`: 1-30 years
- `validateMonthlyRent`: $0-$50,000 range
- `validateAnnualIncome`: $0-$10M range
- `validatePercentageRate`: Generic validator for rates (0-50% range)
- `validateHomeInsurance`: $0-$50,000 range
- `validateSellingCosts`: 0-20% range

Aggregate validators:
- `validateCalculatorState`: Runs all validators, returns array of `ValidationError[]`
- `validateField`: Dispatcher that routes to the appropriate validator based on field name

**Key features:**
- All validators return `string | undefined` (undefined = valid, string = error message)
- Error messages are specific and helpful (e.g., "Down payment must be at least 7.50% for a home of this price")
- Canadian down payment tiers correctly implemented with graduated calculation

### Formatting Utilities (Task 2)

**src/lib/formatting.ts** created with Canadian locale formatting:

Currency formatters:
- `formatCurrency(500000)` → `"$500,000"` (uses Intl.NumberFormat with 'en-CA' locale)
- `parseCurrency("$500,000")` → `500000` (strips $, commas, spaces)

Percentage formatters:
- `formatPercentage(5.5)` → `"5.50%"` (2 decimal places)
- `parsePercentage("5.50%")` → `5.5` (strips % and spaces)

Whole number formatters:
- `formatWholeNumber(25)` → `"25"` (no formatting)
- `parseWholeNumber("25")` → `25` (strips non-digit characters)

**Edge case handling:**
- NaN inputs return safe defaults ("$0", "0.00%", "0")
- Negative numbers display correctly
- Invalid parse inputs return 0 or NaN as appropriate

## Deviations from Plan

None. Plan executed exactly as written.

## Verification Results

- [x] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [x] All 11 new CalculatorState fields present in types, defaults, parsers, tooltips
- [x] Canadian down payment rules correctly implemented (5%/10%/20% tiers)
- [x] Validation functions return undefined for valid inputs, specific error strings for invalid
- [x] Formatting functions use Intl.NumberFormat for Canadian locale
- [x] All files created and modified successfully

## Self-Check: PASSED

**Files verified:**
- FOUND: src/types/calculator.ts
- FOUND: src/lib/defaults.ts
- FOUND: src/lib/parsers.ts
- FOUND: src/content/tooltips.ts
- FOUND: src/lib/validation.ts (new)
- FOUND: src/lib/formatting.ts (new)

**Commits verified:**
- 5bed878: feat(04-01): extend calculator state with Phase 4 fields
- 6835fd3: feat(04-01): add validation and formatting utilities

## Impact & Next Steps

**Foundation complete for Phase 4.** All subsequent plans in this phase will consume:
- Extended CalculatorState type (11 new fields)
- Validation utilities (for input error handling)
- Formatting utilities (for display and parsing)
- nuqs parsers (for URL state serialization)

**Next plan (04-02):** Build input components (TextInput, SliderInput, ToggleInput) that consume these validation/formatting utilities and support both controlled and uncontrolled modes.

**Downstream dependencies:**
- Plan 04-02: Input components will import validation/formatting utilities
- Plan 04-03: Wizard organizes inputs into steps
- Plan 04-04: Sidebar provides advanced mode toggle and per-account overrides
- Plan 04-05: Final integration and visual polish

**Requirements completed:**
- INPUT-02: Calculator state supports all inputs (advancedMode, rates, per-account overrides)
- INPUT-06: Validation with helpful error messages (Canadian down payment rules, range checks)
- INPUT-07: Currency/percentage formatting with Canadian locale
- INPUT-08: URL parsers ready for shareable links
- INPUT-10: Tooltip content ready for all new fields

## Technical Notes

1. **Canadian down payment calculation** handles graduated minimum correctly:
   - For a $750K home: 5% of $500K ($25K) + 10% of $250K ($25K) = $50K total (6.67% minimum)
   - Validator displays: "Down payment must be at least 6.67% for a home of this price"

2. **Maintenance default divergence:** Set to 1.5% based on research, while existing `closing-cost-defaults.ts` uses 1%. This is intentional — 1.5% is more realistic per research recommendation.

3. **Per-account return rates** all default to the master dial value (6%). When advancedMode is enabled, users can override individual account returns.

4. **Type safety maintained:** All validators and formatters are fully typed. TypeScript enforces correct usage across the codebase.

5. **Edge cases handled:** NaN, negative values, zero, empty strings all handled gracefully in both validation and formatting.
