---
phase: 04-input-panel-state-management
plan: 04
subsystem: input-panel
tags: [ui, state-management, real-time-calculation]
dependency_graph:
  requires:
    - 04-02 (input components)
    - 03-03 (comparison engine)
  provides:
    - InputSidebar with 3 collapsible sections
    - Simple/Advanced mode toggle
    - Debounced real-time comparison calculation
  affects:
    - Phase 5 (verdict and results display will consume comparison results)
    - Phase 6 (charts will consume yearly comparison data)
tech_stack:
  added:
    - useDebouncedComparison hook (300ms debounce)
    - computeBlendedReturn helper (equal-weight average for per-account returns)
  patterns:
    - Debounced calculation on state changes
    - Touch-based validation error display
    - Conditional rendering for advanced mode inputs
    - Rate format conversion (percentage -> decimal)
key_files:
  created:
    - src/components/input-panel/input-section.tsx (accordion section wrapper)
    - src/components/input-panel/mode-toggle.tsx (Simple/Advanced toggle)
    - src/components/input-panel/input-sidebar.tsx (main sidebar with all inputs)
    - src/hooks/use-debounced-comparison.ts (debounced comparison hook)
  modified:
    - src/components/layout/app-sidebar.tsx (renders InputSidebar)
    - src/components/layout/main-content.tsx (displays debounced results)
decisions:
  - Touch-based validation errors (show errors only after user interacts with field)
  - 300ms debounce delay (balances responsiveness vs calculation frequency)
  - Equal-weight blending of per-account returns (known simplification until Phase 3 enhancement)
  - Advanced mode rate inputs convert from percentage to decimal when passed to calculation engine
  - Province selector does not trigger validation errors (always valid)
metrics:
  duration: 4 minutes
  tasks_completed: 2
  commits: 2
  files_created: 4
  files_modified: 2
  completed_date: 2026-02-25
---

# Phase 04 Plan 04: Input Sidebar & Real-Time Calculation Summary

**One-liner:** Full input sidebar with 3 collapsible sections, Simple/Advanced mode toggle, and debounced real-time comparison engine wiring.

## What Was Built

Replaced the placeholder sidebar with a complete InputSidebar component that organizes all calculator inputs into 3 collapsible accordion sections (Your Situation, The Home, The Alternative). Added a Simple/Advanced mode toggle that reveals per-account investment returns and additional cost parameters without changing calculation results when switched. Created a debounced comparison hook that automatically recalculates rent-vs-buy results 300ms after the last input change and wires the calculation engine to the UI for real-time updates.

### Task 1: InputSection, ModeToggle, and InputSidebar Components

**Built:**
- `InputSection`: Accordion section wrapper using shadcn/ui AccordionItem with trigger and content
- `ModeToggle`: Simple/Advanced mode toggle with Switch component and descriptive subtitle
- `InputSidebar`: Main sidebar component with all inputs organized in 3 collapsible sections
  - Section 1 (Your Situation): Province, Annual Income, First-Time Buyer checkbox
  - Section 2 (The Home): Purchase Price, Down Payment, Mortgage Rate, Amortization, and advanced-only inputs (Appreciation, Maintenance, Selling Costs, Home Insurance)
  - Section 3 (The Alternative): Monthly Rent, Expected Return (master dial), Time Horizon, and advanced-only inputs (TFSA/RRSP/Non-reg returns, Rent Increase Rate, Inflation Rate)
- Touch-based validation: Errors shown only for fields the user has interacted with
- Updated AppSidebar to render InputSidebar with ~350px width

**Pattern:**
All inputs use a unified `handleChange` function that marks fields as touched and updates state. Validation errors only display after a field has been touched (changed at least once), preventing visual noise on initial load.

**Commit:** 70484a8

### Task 2: Debounced Comparison Hook and Main Content Wiring

**Built:**
- `useDebouncedComparison` hook: Watches calculator state and triggers comparison calculation 300ms after last change
- `computeBlendedReturn` helper: In advanced mode, computes equal-weight average of TFSA/RRSP/Non-registered returns
- ComparisonInput builder: Converts CalculatorState to ComparisonInput with proper rate format conversion (percentages -> decimals for optional housing cost rates)
- MainContent temporary results display: Shows break-even years, tax rate, after-tax return, and final net worth values
- Error handling: Calculation errors caught and logged without crashing UI

**Per-Account Return Wiring:**
- **Simple mode:** Master `investmentReturn` dial passed directly to calculation engine
- **Advanced mode:** Three per-account fields (tfsaReturn, rrspReturn, nonRegisteredReturn) averaged into a single blended rate via `computeBlendedReturn`. Changing any per-account return in advanced mode WILL change calculation results.

**Known Simplification:** The blended rate collapses TFSA (tax-free), RRSP (tax-deferred), and Non-registered (taxable) into one rate. Proper multi-account modeling with account-specific tax treatment is a Phase 3 enhancement.

**Commit:** 24a4909

## Deviations from Plan

None. Plan executed exactly as written.

## Testing & Verification

**Automated:**
- TypeScript compilation passed with zero errors

**Manual verification needed:**
1. Run `npm run dev` and complete the wizard (or use existing state if wizard was completed earlier)
2. Verify sidebar shows 3 collapsible sections (all expanded by default)
3. Toggle Advanced mode and verify additional inputs appear (Appreciation, Maintenance, Selling Costs, Home Insurance, TFSA Return, RRSP Return, Non-Registered Return, Rent Increase Rate, Inflation Rate)
4. Verify switching to Advanced mode does NOT change the displayed results (reveals default values that were already being used)
5. Change any input and verify the results summary card updates within ~300ms
6. Try changing province (e.g., ON to BC) and verify calculation updates correctly
7. In Advanced mode, change any per-account return (TFSA/RRSP/Non-reg) and verify the final net worth values change
8. Verify validation errors only appear after touching a field (initial load should show no errors)

## Key Decisions

1. **Touch-based validation errors:** Only show errors for fields the user has interacted with. Prevents red error text on initial load, improving UX.

2. **300ms debounce delay:** Balances responsiveness (users see updates quickly) vs calculation frequency (avoids excessive recalculations during rapid typing).

3. **Equal-weight per-account return blending:** In advanced mode, the three per-account returns are averaged with equal weighting (1/3 each). This is a known simplification -- proper multi-account modeling (separate portfolios with account-specific tax treatment) is deferred to a Phase 3 enhancement.

4. **Rate format conversion:** CalculatorState stores percentages (3.0 for 3%), but ComparisonInput's optional housing cost rates expect decimals (0.03 for 3%). The hook converts by dividing by 100 when passing advanced-mode overrides.

## Architecture Notes

**End-to-end flow:**
1. User changes input → `handleChange` marks field as touched and updates calculator state
2. Calculator state change triggers `useDebouncedComparison` useEffect
3. After 300ms of inactivity, hook builds ComparisonInput from state
4. `calculateRentVsBuyComparison` runs (composes Phase 2 housing + Phase 3 investment calculations)
5. Results state updated → MainContent re-renders with new values

**Advanced mode behavior:**
- Toggle switch sets `advancedMode` boolean in state
- Conditionally renders advanced inputs via `{state.advancedMode && <PercentageInput ... />}`
- When switching to Advanced, inputs appear with current default values (no calculation changes)
- Changing advanced inputs (e.g., per-account returns) triggers recalculation via debounced hook

## Next Steps

Phase 5 will replace the temporary results summary card with proper Verdict and Results Display components. Phase 6 will add chart visualizations consuming the `yearlyComparison` data.

## Self-Check: PASSED

**Files created:**
- FOUND: src/components/input-panel/input-section.tsx
- FOUND: src/components/input-panel/mode-toggle.tsx
- FOUND: src/components/input-panel/input-sidebar.tsx
- FOUND: src/hooks/use-debounced-comparison.ts

**Files modified:**
- FOUND: src/components/layout/app-sidebar.tsx
- FOUND: src/components/layout/main-content.tsx

**Commits:**
- FOUND: 70484a8 (Task 1: InputSidebar components)
- FOUND: 24a4909 (Task 2: Debounced comparison hook)
