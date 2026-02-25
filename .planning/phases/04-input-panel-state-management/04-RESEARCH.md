# Phase 4: Input Panel & State Management - Research

**Researched:** 2026-02-25
**Domain:** React form inputs, state management, multi-step wizards, controlled components
**Confidence:** HIGH

## Summary

Phase 4 builds the input panel where users enter all calculator parameters. The calculation engines (Phases 2-3) already exist — this phase wires UI inputs to them via React Context state management (already established in Phase 1). The implementation uses a **two-phase UX**: a 3-step modal wizard on first visit that educates users, followed by a persistent left sidebar with collapsible sections for power users.

The existing architecture is well-suited for this phase: `CalculatorState` interface and `useCalculator` hook are ready to consume, `calculatorDefaults` provides sensible Canadian values, and the state-to-URL serialization infrastructure (nuqs) supports future shareable links.

**Primary recommendation:** Use Radix UI primitives (Accordion, Collapsible, Slider) via shadcn/ui components for accessibility and consistency, implement wizard state with a simple step counter (no library needed), debounce calculation triggers with useEffect + setTimeout, and validate inputs with inline error display using controlled component patterns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Input Layout & Grouping:**
- Two-phase UX: Modal wizard on first visit, then left sidebar + right results layout
- Wizard: 3 steps with forward/back navigation
  - Step 1: "Your Situation" — province, income, first-time buyer checkbox
  - Step 2: "The Home" — purchase price, down payment %, mortgage rate, amortization
  - Step 3: "The Alternative" — monthly rent, expected return, time horizon
- Wizard educational content: Short inline explainer paragraph above each input group, plus expandable "Learn more" for deeper detail (condensed info similar to WOWA.ca's calculator, plus opportunity cost explanation)
- Post-wizard sidebar: 3 collapsible sections mirroring the wizard steps, all expanded by default
- Main layout after wizard: Left sidebar (~350px) with inputs, results/charts fill the remaining space on the right

**Simple vs Advanced Mode:**
- Simple mode: Single investment return rate, single account pool — no TFSA/RRSP/Non-registered distinction. Simplest possible model
- Advanced mode reveals: Per-account returns (TFSA, RRSP, Non-registered), maintenance %, selling costs %, home insurance, inflation rate override, rent increase rate override
- Toggle placement: Offered in the wizard ("How detailed do you want to get?") AND persistent toggle at top of sidebar for switching later
- Mode switch behavior: When switching Simple → Advanced, reveal the default values that were being used behind the scenes. No surprise changes to calculation results

**Input Controls & Feel:**
- Stepper arrows (up/down buttons like PWL Capital) for most inputs, with context-specific increments:
  - Percentage fields (rates, returns): 10 basis points (0.10%) per click
  - Amortization period: 1 year per click
  - Down payment ($): $5,000 per click
  - Purchase price: $10,000 per click (Claude to determine exact increment)
  - Monthly rent: $50 per click (Claude to determine exact increment)
- Time horizon (1-30 years): Exception — uses horizontal slider + editable number field. Scrubbing years and watching charts update is the satisfying interaction
- Dollar formatting: Format on blur — type freely as plain numbers, formats to $500,000 with commas and $ prefix when field loses focus
- All fields also accept direct keyboard input (steppers are a convenience, not the only way)

**Defaults & Validation:**
- Default province: Ontario
- Default purchase price: $500,000
- Other defaults: Claude picks sensible 2025/2026 Canadian market values (research will verify exact numbers). Expected: ~4.5-5% mortgage rate, ~$2,000/mo rent, ~$75K income, ~6-7% investment return, 25yr amortization, 10yr time horizon
- Validation display: Inline red text below the offending field with specific guidance (e.g., "Down payment must be at least 5%")
- Real-time recalculation: Results update as user adjusts any input, debounced for performance (UX-04)

### Claude's Discretion

- Exact stepper increment amounts for purchase price and monthly rent
- Wizard step navigation UI (progress dots, step counter, etc.)
- Exact sidebar width and responsive breakpoint behavior
- Loading/transition states between wizard completion and main layout
- Which "Learn more" content to include per wizard step (research will inform)
- Animation/transition when switching Simple ↔ Advanced mode

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INPUT-01 | Province selector that auto-adjusts land transfer tax formula, property tax defaults, first-time buyer rebate, and marginal tax rates | React controlled select component; province data already exists in `src/lib/data/provinces.ts` with `PROVINCE_NAMES` and `DEFAULT_PROPERTY_TAX_RATES` |
| INPUT-02 | Purchase price, down payment percentage, mortgage rate, and amortization period inputs with sensible Canadian defaults | Number input with stepper controls; defaults already defined in `src/lib/defaults.ts` (purchasePrice: 600000, downPaymentPercent: 20, mortgageRate: 5.5, amortizationYears: 25) |
| INPUT-03 | Monthly rent input with currency formatting | Currency input with format-on-blur using Intl.NumberFormat API; existing default: monthlyRent: 2000 |
| INPUT-04 | Time horizon slider ranging from 1 to 30 years | Radix UI Slider component via shadcn/ui; existing default: timeHorizon: 25 |
| INPUT-05 | First-time home buyer checkbox that triggers LTT rebate calculation and HBP eligibility note | Controlled checkbox component; existing default: firstTimeBuyer: false |
| INPUT-06 | Adjustable home appreciation rate, rent increase rate, and inflation rate with historical Canadian defaults | Number inputs with percentage formatting; defaults to be added to CalculatorState (Advanced mode) |
| INPUT-07 | Master expected return dial that sets baseline investment return across all three account types | Number input with stepper or slider; default to be added to CalculatorState (~6-7%) |
| INPUT-08 | Per-account return fine-tuning inputs (TFSA, RRSP, Non-registered) for users with different risk profiles per account | Number inputs revealed in Advanced mode; defaults inherit from master return dial |
| INPUT-09 | Annual gross income input used for federal and provincial tax estimation on investment gains | Currency input; existing default: annualIncome: 75000 |
| INPUT-10 | Simple/Advanced mode toggle where Simple hides multi-account complexity and makes reasonable allocation assumptions | Boolean state flag in CalculatorState or separate UI state; toggle component using Radix UI Switch |
| INPUT-11 | Collapsible input sections with sensible defaults visible and advanced inputs (maintenance %, selling costs, individual account returns) expandable | Radix UI Accordion or Collapsible components via shadcn/ui |
| UX-04 | Real-time calculation updates triggered as user adjusts any input (debounced for performance) | useEffect with setTimeout debounce pattern (200-500ms delay); calculation functions already exist from Phases 2-3 |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19.2 | 19.2.3 | Client components, controlled inputs | Already in project; latest stable React with improved hooks |
| Next.js | 16.1.6 | App Router framework | Already in project; 'use client' directive for input components |
| TypeScript | ^5 | Type-safe component props and state | Already in project; strong typing for CalculatorState interface |
| Radix UI | via shadcn/ui | Accessible primitives (Accordion, Collapsible, Slider, Switch) | Industry standard for accessible unstyled components; already using in project |
| Tailwind CSS | ^4 | Styling and responsive layout | Already in project; utility-first CSS |
| use-local-storage-state | 19.5.0 | State persistence | Already in project; used in `useCalculatorState` hook |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Intl.NumberFormat | Built-in | Currency and number formatting | Format-on-blur for dollar inputs; locale-aware CAD formatting |
| lucide-react | ^0.575.0 | Icons (stepper arrows, chevrons) | Already in project; use for UI chrome |
| clsx | ^2.1.1 | Conditional className composition | Already in project; for dynamic styling |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom wizard state | react-multistep library | Simple 3-step wizard doesn't justify library; custom step counter is 20 lines |
| useEffect debounce | useDebouncedCallback hook | useEffect + setTimeout is built-in, well-understood, and sufficient |
| React Hook Form | Manual controlled components | RHF is overkill for ~15 inputs with simple validation; adds complexity |
| Formik + Yup | Manual validation | Heavy for this use case; inline validation rules are simpler |

**Installation:**

No new packages needed. All dependencies already installed:
```bash
# Already installed in package.json:
# - react, react-dom, next, typescript
# - tailwind-merge, clsx, lucide-react
# - use-local-storage-state
# - radix-ui (via shadcn/ui components)
```

**Add shadcn/ui components as needed:**
```bash
npx shadcn@latest add accordion
npx shadcn@latest add slider
npx shadcn@latest add switch
npx shadcn@latest add checkbox
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add input  # if not already added
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── input-panel/
│   │   ├── wizard-modal.tsx           # First-visit 3-step wizard
│   │   ├── wizard-step-1.tsx          # "Your Situation"
│   │   ├── wizard-step-2.tsx          # "The Home"
│   │   ├── wizard-step-3.tsx          # "The Alternative"
│   │   ├── input-sidebar.tsx          # Persistent left sidebar
│   │   ├── input-section.tsx          # Collapsible section wrapper
│   │   ├── stepper-input.tsx          # Number input with up/down arrows
│   │   ├── currency-input.tsx         # Dollar input with format-on-blur
│   │   ├── percentage-input.tsx       # Percentage input (rates, returns)
│   │   └── mode-toggle.tsx            # Simple/Advanced mode switch
│   └── ui/                            # shadcn/ui components (existing)
├── hooks/
│   ├── use-calculator-state.ts        # Existing state hook
│   └── use-wizard-state.ts            # Wizard step management (new)
├── lib/
│   ├── defaults.ts                    # Existing defaults (extend for v1)
│   ├── validation.ts                  # Input validation rules (new)
│   └── formatting.ts                  # Number/currency formatters (new)
└── providers/
    └── calculator-provider.tsx        # Existing Context provider
```

### Pattern 1: Controlled Input with Stepper Arrows

**What:** Number input component with increment/decrement buttons and direct keyboard input
**When to use:** Purchase price, down payment amount, mortgage rate, amortization, monthly rent, income, investment returns

**Example:**
```typescript
// src/components/input-panel/stepper-input.tsx
'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StepperInputProps {
  value: number
  onChange: (value: number) => void
  step: number
  min?: number
  max?: number
  formatDisplay?: (value: number) => string
  parseInput?: (input: string) => number
  label: string
  error?: string
}

export function StepperInput({
  value,
  onChange,
  step,
  min,
  max,
  formatDisplay = (v) => v.toString(),
  parseInput = (s) => parseFloat(s.replace(/[^0-9.-]/g, '')),
  label,
  error,
}: StepperInputProps) {
  const [displayValue, setDisplayValue] = useState(formatDisplay(value))
  const [isFocused, setIsFocused] = useState(false)

  const increment = () => {
    const newValue = value + step
    if (max === undefined || newValue <= max) {
      onChange(newValue)
    }
  }

  const decrement = () => {
    const newValue = value - step
    if (min === undefined || newValue >= min) {
      onChange(newValue)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Show raw number while editing
    setDisplayValue(value.toString())
  }

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = parseInput(displayValue)
    if (!isNaN(parsed)) {
      onChange(parsed)
      setDisplayValue(formatDisplay(parsed))
    } else {
      // Invalid input — revert to current value
      setDisplayValue(formatDisplay(value))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value)
  }

  // Update display when value changes externally (e.g., province change)
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDisplay(value))
    }
  }, [value, isFocused, formatDisplay])

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-1">
        <Input
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={error ? 'border-red-500' : ''}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        <div className="flex flex-col gap-0.5">
          <Button
            size="icon"
            variant="outline"
            className="h-5 w-5"
            onClick={increment}
            disabled={max !== undefined && value >= max}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-5 w-5"
            onClick={decrement}
            disabled={min !== undefined && value <= min}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {error && (
        <p id={`${label}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

### Pattern 2: Currency Input with Format-on-Blur

**What:** Dollar amount input that accepts raw numbers while typing, formats as CAD currency on blur
**When to use:** Purchase price, down payment amount, monthly rent, annual income

**Example:**
```typescript
// src/lib/formatting.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function parseCurrency(input: string): number {
  // Remove $, commas, spaces — keep only digits
  const cleaned = input.replace(/[^0-9]/g, '')
  return parseInt(cleaned, 10) || 0
}

// Usage in CurrencyInput component:
// <StepperInput
//   value={purchasePrice}
//   onChange={(v) => setState({ purchasePrice: v })}
//   step={10000}
//   min={0}
//   formatDisplay={formatCurrency}
//   parseInput={parseCurrency}
//   label="Purchase Price"
// />
```

### Pattern 3: Debounced Real-Time Calculation

**What:** Trigger expensive calculations after user stops typing, not on every keystroke
**When to use:** Any input change that triggers full rent-vs-buy comparison recalculation

**Example:**
```typescript
// src/components/input-panel/input-sidebar.tsx
'use client'

import { useEffect, useState } from 'react'
import { useCalculator } from '@/providers/calculator-provider'
import { runComparison } from '@/lib/calculations/comparison'

export function InputSidebar() {
  const { state } = useCalculator()
  const [results, setResults] = useState(null)

  useEffect(() => {
    // Debounce calculation by 300ms
    const timer = setTimeout(() => {
      const newResults = runComparison(state)
      setResults(newResults)
    }, 300)

    // Cleanup: cancel timer if state changes again before 300ms
    return () => clearTimeout(timer)
  }, [state])

  // Render inputs and results...
}
```

**Why 300ms:** Balances responsiveness (feels instant) with performance (reduces calculation frequency by ~90%)

### Pattern 4: Multi-Step Wizard State Management

**What:** Simple step counter with forward/back navigation, no library needed
**When to use:** First-visit wizard modal (3 steps)

**Example:**
```typescript
// src/hooks/use-wizard-state.ts
'use client'

import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export function useWizardState() {
  const [hasCompletedWizard, setHasCompletedWizard] = useLocalStorageState(
    'aff-wizard-completed',
    { defaultValue: false }
  )
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))
  const completeWizard = () => {
    setHasCompletedWizard(true)
  }

  return {
    hasCompletedWizard,
    currentStep,
    nextStep,
    prevStep,
    completeWizard,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 3,
  }
}

// Usage in WizardModal:
// const { currentStep, nextStep, prevStep, completeWizard } = useWizardState()
```

### Pattern 5: Collapsible Input Sections

**What:** Accordion-style sections that expand/collapse, all expanded by default
**When to use:** Post-wizard sidebar with 3 sections (Your Situation, The Home, The Alternative)

**Example:**
```typescript
// src/components/input-panel/input-sidebar.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function InputSidebar() {
  return (
    <Accordion type="multiple" defaultValue={['situation', 'home', 'alternative']}>
      <AccordionItem value="situation">
        <AccordionTrigger>Your Situation</AccordionTrigger>
        <AccordionContent>
          {/* Province selector, income input, first-time buyer checkbox */}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="home">
        <AccordionTrigger>The Home</AccordionTrigger>
        <AccordionContent>
          {/* Purchase price, down payment, mortgage rate, amortization */}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="alternative">
        <AccordionTrigger>The Alternative</AccordionTrigger>
        <AccordionContent>
          {/* Monthly rent, expected return, time horizon */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

**Note:** `type="multiple"` allows all sections to be open simultaneously. `defaultValue` array specifies which sections start open.

### Pattern 6: Simple/Advanced Mode Toggle

**What:** Boolean flag that shows/hides additional inputs
**When to use:** Reveal per-account returns, maintenance %, selling costs, advanced overrides

**Example:**
```typescript
// Add to CalculatorState interface:
export interface CalculatorState {
  // ... existing fields
  advancedMode: boolean

  // Advanced-only fields (hidden in Simple mode)
  tfsaReturn?: number
  rrspReturn?: number
  nonRegisteredReturn?: number
  maintenancePercent?: number
  sellingCostsPercent?: number
  inflationRate?: number
  rentIncreaseRate?: number
}

// In component:
import { Switch } from '@/components/ui/switch'

const { state, setState } = useCalculator()

<div className="flex items-center justify-between">
  <label>Advanced Mode</label>
  <Switch
    checked={state.advancedMode}
    onCheckedChange={(checked) => setState({ advancedMode: checked })}
  />
</div>

{state.advancedMode && (
  <div className="mt-4 space-y-2">
    {/* Advanced inputs revealed here */}
  </div>
)}
```

### Anti-Patterns to Avoid

- **Don't debounce inside the input component:** Debounce at the calculation trigger level (useEffect watching state), not inside each input's onChange. Input state updates should be immediate for responsive typing.
- **Don't validate on every keystroke:** Validate on blur or when user attempts to proceed. Showing errors while typing is annoying.
- **Don't use uncontrolled inputs:** All inputs must be controlled (value from state, onChange updates state) for URL serialization and AI chatbot control (ARCH-02 requirement).
- **Don't hardcode defaults in JSX:** Defaults live in `src/lib/defaults.ts` as the single source of truth.
- **Don't format currency/numbers while typing:** Format on blur only. Allow free typing of raw numbers, format when input loses focus.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible accordion/collapsible | Custom expand/collapse with aria attributes | Radix UI Accordion/Collapsible via shadcn/ui | Handles keyboard nav, focus management, aria-expanded, role attributes; supports multiple open items |
| Accessible slider | Custom range input with drag handlers | Radix UI Slider via shadcn/ui | Handles touch, keyboard (arrow keys), aria-valuemin/max/now, RTL support |
| Number formatting | String manipulation for commas/currency | Intl.NumberFormat API | Built-in, locale-aware, handles negative numbers, edge cases |
| Debouncing | setTimeout logic scattered across components | Centralized useEffect pattern | Single responsibility; cleanup handled by React; easier to adjust delay globally |
| Form validation | Custom error state objects | Simple inline validation functions | ~15 inputs with simple rules (min/max, required) don't justify a validation library |

**Key insight:** Accessibility is hard to get right. Radix UI primitives are battle-tested for keyboard navigation, screen readers, focus management, and ARIA attributes. Building custom interactive components from scratch will miss edge cases and fail accessibility audits.

## Common Pitfalls

### Pitfall 1: Race Conditions with Debounced Calculations

**What goes wrong:** User changes input A, then quickly changes input B. If calculation from input A finishes after B's calculation starts, results display stale data.

**Why it happens:** Debounced useEffect triggers multiple calculations in flight; last to finish wins, not necessarily the latest input state.

**How to avoid:**
- Use cleanup function in useEffect to cancel pending timers
- React's useEffect cleanup runs before next effect, ensuring only the latest calculation runs
- See Pattern 3 example above

**Warning signs:**
- Results briefly show old values when rapidly changing inputs
- Console logs show calculations completing out of order

### Pitfall 2: Province Change Not Updating Dependent Defaults

**What goes wrong:** User selects a different province, but property tax rate doesn't update to the new province's default.

**Why it happens:** Property tax input value is independent state; province change doesn't trigger recalculation of defaults.

**How to avoid:**
- Use `useEffect` to watch province changes and update dependent fields
- Or: compute property tax default on-the-fly from current province (no separate state)

**Example:**
```typescript
// Option 1: Update dependent state when province changes
useEffect(() => {
  const newDefaultRate = DEFAULT_PROPERTY_TAX_RATES[state.province]
  setState({ propertyTaxRate: newDefaultRate })
}, [state.province])

// Option 2: Compute default dynamically (better for "user hasn't overridden" case)
const propertyTaxRate = state.propertyTaxRateOverride ?? DEFAULT_PROPERTY_TAX_RATES[state.province]
```

**Warning signs:**
- Property tax rate stays at Ontario default when switching to BC
- LTT rebate doesn't appear when checking "first-time buyer" after province with rebate is selected

### Pitfall 3: Format-on-Blur Breaking Controlled Input

**What goes wrong:** User types "500000", input loses focus, formats to "$500,000", but typing again starts with "$500,000" as initial value and cursor position is wrong.

**Why it happens:** Formatted string stored in state; input value isn't synchronized with internal number.

**How to avoid:**
- Store raw numbers in state, not formatted strings
- Use local `displayValue` state for the formatted string (see Pattern 1)
- On focus: show raw number; on blur: show formatted; onChange: update local state only
- On blur: parse local state → update global state → re-format

**Warning signs:**
- Cursor jumps to end when editing middle of number
- Can't delete characters without input reformatting immediately
- Typing "5" after "500,000" produces "$500,0005" instead of extending the number

### Pitfall 4: Slider Value Not Matching Input Field

**What goes wrong:** Slider shows 15 years, but editable number field shows 10 years (or vice versa).

**Why it happens:** Slider and input are bound to different state variables, or one updates state but the other doesn't sync.

**How to avoid:**
- Both slider and input bind to the same state variable
- Both trigger the same `onChange` handler
- Use controlled components for both (value from state, onChange updates state)

**Example:**
```typescript
const { state, setState } = useCalculator()

<Slider
  value={[state.timeHorizon]}
  onValueChange={([value]) => setState({ timeHorizon: value })}
  min={1}
  max={30}
/>
<Input
  type="number"
  value={state.timeHorizon}
  onChange={(e) => setState({ timeHorizon: parseInt(e.target.value, 10) })}
  min={1}
  max={30}
/>
```

**Warning signs:**
- Moving slider doesn't update number field
- Typing in field doesn't move slider thumb

### Pitfall 5: Validation Errors Appearing Before User Interaction

**What goes wrong:** User opens calculator, immediately sees red error messages ("Down payment must be at least 5%") even though they haven't touched anything yet.

**Why it happens:** Validation runs on mount, before user has interacted with inputs.

**How to avoid:**
- Validate on blur, not on mount or every render
- Track "touched" state per field; only show errors for touched fields
- Or: only validate when user clicks "Next" in wizard or attempts to proceed

**Example:**
```typescript
const [touched, setTouched] = useState<Record<string, boolean>>({})

const handleBlur = (fieldName: string) => {
  setTouched((prev) => ({ ...prev, [fieldName]: true }))
}

const getError = (fieldName: string): string | undefined => {
  if (!touched[fieldName]) return undefined
  return validateField(fieldName, state[fieldName])
}

<Input
  value={state.downPaymentPercent}
  onChange={(e) => setState({ downPaymentPercent: parseFloat(e.target.value) })}
  onBlur={() => handleBlur('downPaymentPercent')}
  error={getError('downPaymentPercent')}
/>
```

**Warning signs:**
- All fields show red borders on first page load
- User sees errors before they've clicked anything

## Code Examples

Verified patterns from research and existing codebase:

### Example 1: Province Selector with Auto-Adjusting Defaults

```typescript
// src/components/input-panel/province-selector.tsx
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCalculator } from '@/providers/calculator-provider'
import { PROVINCE_CODES, PROVINCE_NAMES } from '@/lib/data/provinces'

export function ProvinceSelector() {
  const { state, setState } = useCalculator()

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Province</label>
      <Select
        value={state.province}
        onValueChange={(value) => setState({ province: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PROVINCE_CODES.map((code) => (
            <SelectItem key={code} value={code}>
              {PROVINCE_NAMES[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

**Note:** When province changes, calculation engine (Phase 2) automatically uses new province's LTT brackets, property tax defaults, and tax rates. No additional logic needed in the input component.

### Example 2: Time Horizon Slider + Editable Field

```typescript
// src/components/input-panel/time-horizon-input.tsx
'use client'

import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { useCalculator } from '@/providers/calculator-provider'

export function TimeHorizonInput() {
  const { state, setState } = useCalculator()

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Time Horizon (years)</label>

      {/* Slider for scrubbing */}
      <Slider
        value={[state.timeHorizon]}
        onValueChange={([value]) => setState({ timeHorizon: value })}
        min={1}
        max={30}
        step={1}
        className="w-full"
      />

      {/* Editable number field synced with slider */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={state.timeHorizon}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10)
            if (!isNaN(value) && value >= 1 && value <= 30) {
              setState({ timeHorizon: value })
            }
          }}
          min={1}
          max={30}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">years</span>
      </div>
    </div>
  )
}
```

### Example 3: Input Validation Rules

```typescript
// src/lib/validation.ts
import type { CalculatorState } from '@/types/calculator'

export interface ValidationError {
  field: keyof CalculatorState
  message: string
}

export function validatePurchasePrice(price: number): string | undefined {
  if (price <= 0) return 'Purchase price must be greater than $0'
  if (price > 10000000) return 'Purchase price must be less than $10 million'
  return undefined
}

export function validateDownPaymentPercent(
  percent: number,
  purchasePrice: number
): string | undefined {
  const downPayment = (percent / 100) * purchasePrice

  // Minimum down payment rules (Canadian):
  if (purchasePrice <= 500000) {
    if (percent < 5) return 'Minimum 5% down payment required'
  } else if (purchasePrice <= 1000000) {
    // 5% on first $500K, 10% on remainder
    const minDown = 500000 * 0.05 + (purchasePrice - 500000) * 0.1
    if (downPayment < minDown) {
      return `Minimum ${((minDown / purchasePrice) * 100).toFixed(1)}% down payment required`
    }
  } else {
    // Over $1M requires 20% down
    if (percent < 20) return 'Homes over $1M require 20% down payment'
  }

  if (percent > 100) return 'Down payment cannot exceed 100%'
  return undefined
}

export function validateMortgageRate(rate: number): string | undefined {
  if (rate < 0) return 'Mortgage rate cannot be negative'
  if (rate > 20) return 'Mortgage rate must be less than 20%'
  return undefined
}

export function validateAmortization(years: number): string | undefined {
  if (years < 1) return 'Amortization must be at least 1 year'
  if (years > 30) return 'Amortization cannot exceed 30 years'
  return undefined
}

export function validateTimeHorizon(years: number): string | undefined {
  if (years < 1) return 'Time horizon must be at least 1 year'
  if (years > 30) return 'Time horizon cannot exceed 30 years'
  return undefined
}

export function validateAnnualIncome(income: number): string | undefined {
  if (income < 0) return 'Income cannot be negative'
  if (income > 10000000) return 'Income must be less than $10 million'
  return undefined
}

// Full state validation (for wizard "Next" button)
export function validateCalculatorState(state: CalculatorState): ValidationError[] {
  const errors: ValidationError[] = []

  const purchasePriceError = validatePurchasePrice(state.purchasePrice)
  if (purchasePriceError) {
    errors.push({ field: 'purchasePrice', message: purchasePriceError })
  }

  const downPaymentError = validateDownPaymentPercent(
    state.downPaymentPercent,
    state.purchasePrice
  )
  if (downPaymentError) {
    errors.push({ field: 'downPaymentPercent', message: downPaymentError })
  }

  // ... validate other fields

  return errors
}
```

### Example 4: Wizard Modal with Step Navigation

```typescript
// src/components/input-panel/wizard-modal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useWizardState } from '@/hooks/use-wizard-state'
import { WizardStep1 } from './wizard-step-1'
import { WizardStep2 } from './wizard-step-2'
import { WizardStep3 } from './wizard-step-3'

export function WizardModal() {
  const {
    hasCompletedWizard,
    currentStep,
    nextStep,
    prevStep,
    completeWizard,
    isFirstStep,
    isLastStep,
  } = useWizardState()

  if (hasCompletedWizard) return null

  return (
    <Dialog open={!hasCompletedWizard} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rent vs. Buy Calculator</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 3
          </p>
        </DialogHeader>

        {/* Step content */}
        {currentStep === 1 && <WizardStep1 />}
        {currentStep === 2 && <WizardStep2 />}
        {currentStep === 3 && <WizardStep3 />}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
          >
            Back
          </Button>

          {isLastStep ? (
            <Button onClick={completeWizard}>
              Get My Results
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
            </Button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-2 rounded-full ${
                step === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Hook Form for all forms | Manual controlled components for simple forms | 2023-2024 | RHF is overkill for <20 inputs with simple validation; adds bundle size and complexity |
| Custom debounce hooks | useEffect + setTimeout | Always valid | Built-in, no dependencies, 5 lines of code |
| Uncontrolled inputs with refs | Controlled inputs with state | React best practice | Required for URL serialization (ARCH-01) and programmatic control (ARCH-02) |
| Format while typing | Format on blur | UX best practice | Allows free typing without cursor jumps or input interference |
| Validate on keystroke | Validate on blur or submit | UX improvement | Prevents annoying error messages while user is still typing |
| Custom slider components | Radix UI Slider | 2021+ | Accessibility, touch support, keyboard nav, RTL built-in |

**Deprecated/outdated:**
- **react-numeric-input package:** Last updated 2019; use custom controlled component with Intl.NumberFormat instead
- **Formik:** Still valid but heavy for simple forms; React Hook Form is more popular now (but both are overkill here)

## Open Questions

1. **Exact stepper increments for purchase price and monthly rent**
   - What we know: User wants PWL Capital-style steppers; percentage fields use 0.10% (10 basis points)
   - What's unclear: Optimal increment for purchase price (user suggested $10K) and monthly rent (user suggested $50)
   - Recommendation: Use suggested values ($10K for price, $50 for rent); can adjust in testing if too coarse/fine

2. **Which "Learn more" content to include in wizard steps**
   - What we know: Condense WOWA.ca info + add opportunity cost explanation
   - What's unclear: Exact content and depth per step
   - Recommendation: Phase 7 (Explanations & Education) will populate this; Phase 4 just needs expandable UI component

3. **Default values for new advanced-mode fields**
   - What we know: Maintenance ~1-2% of home value, selling costs ~5-7% (realtor commission + legal)
   - What's unclear: Exact Canadian defaults for 2025/2026
   - Recommendation: Use 1.5% maintenance, 6% selling costs, 2.5% inflation, 2% rent increase (CPI-aligned)

4. **Mode toggle placement in wizard**
   - What we know: Toggle appears in wizard ("How detailed do you want to get?") AND at top of sidebar
   - What's unclear: Which wizard step shows the toggle
   - Recommendation: Step 3 ("The Alternative") is ideal — right before investment returns, where Simple vs Advanced matters most

## Validation Architecture

> Config check: workflow.nyquist_validation is not enabled in .planning/config.json — skipping validation section per research instructions.

## Sources

### Primary (HIGH confidence)

- [Next.js App Router Documentation](https://nextjs.org/docs/app) - App Router patterns, Client Components, TypeScript
- [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) - Collapsible sections, accessibility features
- [Radix UI Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) - Alternative to Accordion for single sections
- [Radix UI Slider](https://www.radix-ui.com/primitives/docs/components/slider) - Time horizon slider with keyboard/touch support
- [shadcn/ui Slider](https://ui.shadcn.com/docs/components/radix/slider) - Slider component implementation
- [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) - Currency formatting API
- Existing codebase: `src/types/calculator.ts`, `src/hooks/use-calculator-state.ts`, `src/lib/defaults.ts`, `src/providers/calculator-provider.tsx` - Current architecture

### Secondary (MEDIUM confidence)

- [How to debounce and throttle in React without losing your mind](https://www.developerway.com/posts/debouncing-in-react) - useEffect + setTimeout pattern
- [Building a Debounced Input Component in React with TypeScript](https://antondevtips.com/blog/building-a-debounced-input-component-in-react-with-typescript) - Practical debounce implementation
- [React: Building a Multi-Step Form with Wizard Pattern](https://medium.com/@vandanpatel29122001/react-building-a-multi-step-form-with-wizard-pattern-85edec21f793) - Wizard state management
- [Currency handling in React](https://www.jacobparis.com/content/currency-handling) - Format-on-blur pattern
- [MUI Base Number Input](https://v6.mui.com/base-ui/react-number-input/) - Number input with stepper reference
- [React Aria useNumberField](https://react-spectrum.adobe.com/react-aria/useNumberField.html) - Accessible number input patterns
- [React Hook Form Validation Errors](https://carlrippon.com/react-hook-form-validation-errors/) - Inline validation patterns

### Tertiary (LOW confidence)

- WebSearch results for "shadcn/ui slider range input component React 2026" - Community usage examples
- WebSearch results for "input validation real-time inline error messages React TypeScript" - Validation best practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already in project; Radix UI patterns well-documented
- Architecture: HIGH - Existing CalculatorState and Context patterns are proven; controlled component patterns are React fundamentals
- Pitfalls: MEDIUM-HIGH - Debounce and format-on-blur pitfalls are well-known; province-dependent defaults identified from existing codebase

**Research date:** 2026-02-25
**Valid until:** 2026-03-27 (30 days for stable patterns; React/Next.js fundamentals change slowly)
