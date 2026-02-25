---
phase: 04-input-panel-state-management
plan: 03
subsystem: wizard-onboarding
tags: [wizard, modal, onboarding, educational-content, localStorage]
completed: 2026-02-25
duration: 4min
requirements:
  - INPUT-01
  - INPUT-02
  - INPUT-03
  - INPUT-04
  - INPUT-05
  - INPUT-09
  - INPUT-10
dependency_graph:
  requires:
    - src/hooks/use-wizard-state.ts (wizard step management)
    - src/components/input-panel/*.tsx (input components from Plan 04-02)
    - src/providers/calculator-provider.tsx (state management)
    - shadcn/ui dialog component
    - use-local-storage-state library
  provides:
    - WizardModal (first-visit modal with 3-step flow)
    - WizardStep1 (Your Situation inputs)
    - WizardStep2 (The Home inputs)
    - WizardStep3 (The Alternative inputs + Simple/Advanced mode)
    - useWizardState (step navigation + localStorage persistence)
  affects:
    - Plan 04-04 (sidebar will be visible after wizard completion)
    - Plan 04-05 (integration and polish)
tech_stack:
  added:
    - shadcn/ui dialog component
  patterns:
    - Unclosable modal pattern (prevent dismiss without completion)
    - localStorage persistence for wizard completion state
    - Educational content with expandable details sections
    - Touched-field validation (errors only after blur)
    - Mode selection via visual cards
key_files:
  created:
    - src/hooks/use-wizard-state.ts (62 lines, wizard state hook)
    - src/components/input-panel/wizard-modal.tsx (101 lines, modal container)
    - src/components/input-panel/wizard-step-1.tsx (82 lines, Your Situation step)
    - src/components/input-panel/wizard-step-2.tsx (147 lines, The Home step)
    - src/components/input-panel/wizard-step-3.tsx (164 lines, The Alternative step)
    - src/components/ui/dialog.tsx (shadcn component)
  modified:
    - src/app/page.tsx (added WizardModal import and render)
    - src/components/input-panel/stepper-input.tsx (added onBlur prop support)
    - src/components/input-panel/currency-input.tsx (added onBlur prop passthrough)
    - src/components/input-panel/percentage-input.tsx (added onBlur prop passthrough)
    - src/components/input-panel/time-horizon-input.tsx (added onBlur prop support)
decisions:
  - key: Wizard completion persisted to localStorage with key 'aff-wizard-completed'
    rationale: Simple boolean flag, no complex state needed. SSR-safe with use-local-storage-state library.
  - key: Modal is unclosable until completion (no outside click, no escape key)
    rationale: First-time users must go through educational flow to understand the calculator. Prevents incomplete setup.
  - key: Educational content uses native HTML details/summary elements
    rationale: No library needed, accessible by default, progressive disclosure pattern.
  - key: Simple/Advanced mode choice presented as visual cards, not toggle switch
    rationale: Wizard is about education. Cards allow descriptive text explaining each mode's purpose.
  - key: Validation errors shown only after field blur (touched-field tracking)
    rationale: Don't show errors on mount. Only validate after user interacts with a field.
  - key: onBlur callbacks added to all input components
    rationale: Wizard steps need to trigger validation after user moves to next field. Input components now support optional onBlur prop.
metrics:
  tasks_completed: 2
  commits: 1
  files_changed: 11
  lines_added: 740
---

# Phase 04 Plan 03: Wizard Modal Summary

Built first-visit 3-step wizard modal that guides users through initial calculator setup with educational context at each step. Wizard includes province/income inputs, home purchase details, rental alternative, and Simple/Advanced mode choice.

## Tasks Completed

| Task | Name                                                  | Commit  | Files                                                                                                      |
| ---- | ----------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| 1+2  | Create wizard (hook, modal, steps) and mount in page  | 55bc66b | use-wizard-state.ts, wizard-modal.tsx, wizard-step-1/2/3.tsx, page.tsx, dialog.tsx, input components     |

## What Was Built

### useWizardState Hook (Task 1)

**Hook for managing wizard step navigation and completion state.**

**State:**
- `hasCompletedWizard` — boolean persisted to localStorage via `use-local-storage-state` (key: `'aff-wizard-completed'`)
- `currentStep` — local state (1-3) for which step is currently shown

**API:**
- `nextStep()` — advances to next step (clamped to max 3)
- `prevStep()` — goes back to previous step (clamped to min 1)
- `completeWizard()` — sets `hasCompletedWizard` to true (persists to localStorage)
- `resetWizard()` — clears completion state and resets to step 1 (for testing/debug)
- `isFirstStep` — boolean, true when on step 1
- `isLastStep` — boolean, true when on step 3

**Why localStorage:** Simple boolean flag, SSR-safe with use-local-storage-state library. Once wizard is completed, it never shows again unless user clears localStorage.

### WizardModal Container (Task 1)

**Modal container with step routing and navigation.**

**Features:**
- Renders shadcn/ui Dialog with `open={!hasCompletedWizard}`
- Unclosable: `onInteractOutside` and `onEscapeKeyDown` prevented, no close button (`[&>button]:hidden`)
- Step content area with `min-h-[300px]` to prevent layout shifts between steps
- Navigation footer with:
  - Back button (disabled on step 1)
  - Next button (steps 1-2) or "See My Results" button with arrow icon (step 3)
  - Progress dots (3 circles, active step = primary color, inactive = muted)
- Conditionally renders WizardStep1/2/3 based on `currentStep`
- Calls `completeWizard()` on final step button click

**Why unclosable:** First-time users must complete the educational flow. Prevents incomplete setup where default values are used without user understanding.

### WizardStep1: Your Situation (Task 2)

**Step 1 collects province, income, and first-time buyer status.**

**Educational content:**
- **Intro paragraph:** Explains why province and income affect taxes (land transfer tax + marginal tax rate on investment gains)
- **Learn more (expandable):** Details on province-specific LTT rates, property tax rates, income tax brackets, and how marginal tax rate affects non-registered investment returns

**Inputs:**
1. `ProvinceSelector` — updates `state.province`
2. `CurrencyInput` — Annual Gross Income, step $5,000, validates via `validateAnnualIncome`
3. `CheckboxInput` — First-Time Home Buyer, description mentions LTT rebates

**Validation:** Tracks touched fields (Set), only shows errors after blur. Income validation uses `validateAnnualIncome`.

### WizardStep2: The Home (Task 2)

**Step 2 collects purchase price, down payment, mortgage rate, and amortization.**

**Educational content:**
- **Intro paragraph:** Explains mortgage size, CMHC insurance trigger at 20% down, and the tradeoff between down payment size and invested cash
- **Learn more (expandable):** Details on CMHC insurance (2-4% premium for <20% down), Canadian down payment minimums (5%/5%+10%/20% tiers), and semi-annual compounding (unique to Canada)

**Inputs:**
1. `CurrencyInput` — Purchase Price, step $10,000, validates via `validatePurchasePrice`
2. `PercentageInput` — Down Payment %, step 1%, validates via `validateDownPaymentPercent` (knows about purchase price tiers)
3. `PercentageInput` — Mortgage Rate, step 0.10%, validates via `validateMortgageRate`
4. `StepperInput` — Amortization Period, step 1 year, suffix "years", validates via `validateAmortization`

**Validation:** Tracks touched fields, validates on blur. Down payment validator checks Canadian minimum thresholds based on purchase price.

### WizardStep3: The Alternative (Task 2)

**Step 3 collects monthly rent, investment return, time horizon, and Simple/Advanced mode choice.**

**Educational content:**
- **Intro paragraph:** Explains opportunity cost concept — down payment + monthly savings growing in the market is the heart of rent-vs-buy comparison
- **Learn more (expandable):** Example: $100K down payment at 6% becomes $430K in 25 years. Mentions three account types (TFSA, RRSP, Non-reg) available in Advanced mode with different tax treatment.

**Inputs:**
1. `CurrencyInput` — Monthly Rent, step $50, validates via `validateMonthlyRent`
2. `PercentageInput` — Expected Investment Return, step 0.10%, validates via `validatePercentageRate`
3. `TimeHorizonInput` — Time Horizon (1-30 years), slider + number field, validates via `validateTimeHorizon`

**Simple/Advanced Mode Choice:**
- Question: "How detailed do you want to get?"
- Two visual cards (grid layout):
  - **Simple** (Gauge icon): "One investment return rate, standard cost assumptions. Best for a quick comparison."
  - **Advanced** (Settings icon): "Fine-tune per-account returns (TFSA, RRSP, Non-reg), maintenance costs, selling costs, and more."
- Selected card has `border-primary bg-primary/10`, unselected has `border-border bg-card`
- Updates `state.advancedMode` on click

**Validation:** Tracks touched fields, validates on blur.

### Input Component Updates (Task 2)

**Added `onBlur` prop support to all input components:**
- `StepperInput` — calls `onBlur()` after internal blur processing (after parsing and clamping)
- `CurrencyInput`, `PercentageInput` — pass through `onBlur` prop to `StepperInput`
- `TimeHorizonInput` — calls `onBlur` on number field blur

**Why needed:** Wizard steps track touched fields and validate on blur. Input components now support optional `onBlur` callback for this pattern.

### Page Integration (Task 2)

**Updated `src/app/page.tsx`:**
- Imported `WizardModal` from `@/components/input-panel/wizard-modal`
- Rendered `<WizardModal />` as first child in the outer div (before header)
- Wizard renders as Dialog overlay, so position in JSX doesn't affect visual layout

## Deviations from Plan

None. Plan executed exactly as written.

## Verification Results

- [x] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [x] Production build succeeds (`npm run build`)
- [x] useWizardState hook manages step (1-3) and completion state in localStorage
- [x] WizardModal renders as unclosable dialog when wizard not completed
- [x] Step routing renders correct step component based on currentStep
- [x] Back/Next navigation works with proper disable states
- [x] Progress dots indicate current step visually
- [x] Dialog hidden after wizard completion
- [x] WizardStep1 renders province, income, first-time buyer inputs
- [x] WizardStep2 renders purchase price, down payment, mortgage, amortization inputs
- [x] WizardStep3 renders rent, investment return, time horizon, Simple/Advanced mode choice
- [x] Each step has educational intro + expandable "Learn more" section
- [x] Validation errors appear only after blur (touched-field tracking)
- [x] All wizard inputs update calculator state via useCalculator()
- [x] WizardModal mounted in page.tsx

## Self-Check: PASSED

**Files verified:**
```bash
FOUND: src/hooks/use-wizard-state.ts
FOUND: src/components/input-panel/wizard-modal.tsx
FOUND: src/components/input-panel/wizard-step-1.tsx
FOUND: src/components/input-panel/wizard-step-2.tsx
FOUND: src/components/input-panel/wizard-step-3.tsx
FOUND: src/components/ui/dialog.tsx
FOUND: src/app/page.tsx (modified)
FOUND: src/components/input-panel/stepper-input.tsx (modified)
FOUND: src/components/input-panel/currency-input.tsx (modified)
FOUND: src/components/input-panel/percentage-input.tsx (modified)
FOUND: src/components/input-panel/time-horizon-input.tsx (modified)
```

**Commits verified:**
- 55bc66b: feat(04-03): add wizard modal with 3-step onboarding flow

## Impact & Next Steps

**First-visit wizard complete.** Users are now guided through initial setup with educational content at each step. Wizard only shows once (localStorage persistence).

**Next plan (04-04):** Build the sidebar that appears after wizard completion. Sidebar will have 3 collapsible sections mirroring wizard steps, plus advanced mode inputs.

**Downstream dependencies:**
- Plan 04-04: Sidebar will check `hasCompletedWizard` and render input sections
- Plan 04-05: Final integration, visual polish, and real-time recalculation wiring

**Requirements completed:**
- INPUT-01: All calculator inputs covered in wizard steps
- INPUT-02: Wizard uses validation functions from Plan 04-01
- INPUT-03: Educational content with expandable "Learn more" sections
- INPUT-04: ProvinceSelector in Step 1
- INPUT-05: TimeHorizonInput in Step 3
- INPUT-09: Error display with inline red text below inputs
- INPUT-10: Simple/Advanced mode choice presented in Step 3

## Technical Notes

1. **Unclosable modal implementation:** `onInteractOutside={(e) => e.preventDefault()}` prevents outside clicks, `onEscapeKeyDown={(e) => e.preventDefault()}` prevents Escape key, `[&>button]:hidden` class hides the default shadcn Dialog close button.

2. **localStorage key:** `'aff-wizard-completed'` boolean flag. Simple and effective. Use-local-storage-state library handles SSR safety and cross-tab sync.

3. **Native details/summary:** No library needed for expandable sections. Accessible by default. `<summary>` is clickable, `<details>` shows/hides content.

4. **Touched-field tracking:** Local state `Set<string>` stores field names that have been blurred. Errors only render when `touchedFields.has(fieldName)` is true.

5. **Simple/Advanced mode cards:** Visual pattern inspired by CONTEXT.md requirement: "How detailed do you want to get?" Cards make the choice more educational than a toggle switch.

6. **Educational content sources:** CONTEXT.md mentioned "condense the info from WOWA.ca's calculator page" — intro paragraphs explain tax implications, CMHC insurance, opportunity cost. "Learn more" sections provide deeper detail without overwhelming.

7. **Step layout consistency:** All steps follow the same structure: heading → intro paragraph → expandable "Learn more" → inputs. Step 3 adds the mode choice section after inputs.

8. **onBlur callback pattern:** Input components now accept optional `onBlur?: () => void` prop. Wizard steps use this to trigger validation + touched-field tracking after user finishes editing a field.

9. **Progress dots alignment:** Centered in navigation footer between Back and Next buttons. Provides visual feedback on wizard progress without cluttering the header.

10. **Build verification:** Production build succeeds with zero errors. Wizard renders correctly in static generation (localStorage is client-side only, no SSR issues).
