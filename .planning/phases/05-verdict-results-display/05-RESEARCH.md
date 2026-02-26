# Phase 5: Verdict & Results Display - Research

**Researched:** 2026-02-25
**Domain:** React UI components for financial result displays, verdict cards, summary metrics, tabbed interfaces, expandable tables, and year selectors
**Confidence:** HIGH

## Summary

This phase builds the results display layer that consumes `ComparisonResult` from Phase 3 and presents it to users through verdict cards, summary metrics, tabbed chart placeholders (charts animated in Phase 6), detailed cost breakdowns, and year-by-year comparison interfaces. The stack is entirely within the existing Next.js 16 + React 19 + shadcn/ui ecosystem with no new dependencies required.

The design aesthetic copies PWL Capital's fintech-quality layout (tabs, spacing, colors) and enhances it with WOWA's detailed breakdowns. The existing project uses light-first theme with dark mode available via next-themes 0.4.6, Radix UI primitives for all interactive components (tabs, accordion, slider), and Tailwind CSS 4 with OKLCH color tokens for smooth theme transitions.

All calculation results are already available in `ComparisonResult` from Phase 3's comparison engine, which provides year-by-year net worth, break-even analysis, marginal tax rates, and portfolio growth. This phase focuses purely on presentation — no new calculation logic required.

**Primary recommendation:** Use existing shadcn/ui components (Tabs, Accordion, Card, Slider) composed into new results-specific components. Leverage native `Intl.NumberFormat` for Canadian dollar formatting. Build verdict logic from `ComparisonResult.yearlyComparison` final year data and break-even thresholds.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design & Aesthetic:**
- Copy PWL Capital's design aesthetic entirely — This is the primary visual reference
- Day/night light and dark theme toggle — Required; dark-first theme from Phase 1 continues
- Same 3-tab structure as PWL — Tabs will be populated by Phase 6 charts (Net Worth, Cash Flow, Investment Growth)
- Enhanced with WOWA metrics — Additional breakdown tables/comparisons beyond PWL's base offering
- Reference NY Times calculator approach — For interaction patterns and information architecture

**Verdict Presentation & Reasoning:**
- Verdict displayed as a panel/card (not a hero headline)
- Templated sentences for reasoning — Dynamic text like "Renting is $X better over Y years because..." filled with actual numbers
- Decision based on final net worth — Whichever path ends with more money wins
- "It's a tie" messaging if within threshold — When outcomes are nearly identical (within 5% or $X), acknowledge parity and note that other factors matter
- Break-even year mentioned in verdict reasoning, not as a separate metric card

**Summary Cards Layout & Hierarchy:**
- 2x2 grid layout — Rent final net worth, Buy final net worth, Dollar advantage, Percentage advantage
- Dollar advantage card visually emphasized — Largest/boldest to highlight the key takeaway
- Positioned below tabs — Cards appear after the tabbed charts section, as supporting context
- Only 4 cards; break-even year is mentioned in verdict text, not a separate card

**Cost Breakdown Table:**
- High-level summary table — Four main rows: Initial Costs, Recurring Annual Costs, Opportunity Costs, Net Proceeds at Sale
- Side-by-side comparison — Renter and Buyer in adjacent columns for direct cost comparison
- Explicit Opportunity Costs row — Shows renter's foregone investments and buyer's tied-up capital separately (educational)
- Expandable rows — Click "Initial Costs" to see sub-items (mortgage insurance, legal fees, LTT, etc.); "Recurring" to see property tax, maintenance, insurance breakdown
- Static summary view with optional expansion; not all details shown by default

**Year Comparison Panel:**
- Slider for year selection — Horizontal slider from Year 1 to final year; familiar and intuitive
- Three metrics displayed per year:
  1. Renter net worth vs Buyer net worth
  2. Annual costs (renter vs buyer that year)
  3. Cumulative invested vs home equity
- Preset buttons for key milestones — "Break-even year" and "Mortgage paid off" buttons for quick navigation
- Positioned below summary cards and tables — Natural scroll flow: verdict → summary cards → charts → year comparison → detailed table

### Claude's Discretion

- Exact color palette and spacing (will align with PWL's fintech-quality aesthetic)
- Animation timing for day/night theme toggle
- Mobile responsiveness strategy for tables (may stack or scroll horizontally on small screens)
- Threshold definition for "tie" scenario (will infer from financial context — likely 5% or similar)

### Deferred Ideas (OUT OF SCOPE)

- Dark mode only in v1 — Light mode addition deferred; UI built in dark-first per Phase 1 decision *(NOTE: This contradicts locked decision for light/dark toggle — user clarification may be needed, but research proceeds assuming toggle is required per locked decisions)*
- Advanced cost breakdowns — Detailed mortgage amortization schedule, tax-by-year breakdown — future expansion
- Scenario comparison — "What if I change down payment?" comparisons — Phase v2+
- PDF export — Saving results as PDF — v2 (lead capture phase)

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIZ-01 | Clear verdict displaying "Rent" or "Buy" with dollar advantage amount and plain-English reasoning for the recommendation | Verdict logic built from `ComparisonResult.yearlyComparison` final year; Card component from shadcn/ui; templated reasoning strings with `Intl.NumberFormat` |
| VIZ-02 | Summary cards showing Rent final net worth, Buy final net worth, dollar and percentage advantage, and break-even year | 2x2 grid layout using Card components; data from `yearlyComparison[last]`; break-even from `breakEvenWithSelling` |
| VIZ-07 | Detailed cost breakdown table showing initial costs, recurring annual costs, opportunity costs, and net proceeds at sale | Accordion component for expandable rows; data from `housingProjection.upfrontCosts`, `yearlyProjection`, `exitPosition` |
| VIZ-08 | Side-by-side comparison panel at a user-selected year showing all key metrics for that point in time | Slider component with preset buttons; data from `yearlyComparison[selectedYear]`; displays net worth, costs, equity |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router framework | Already project foundation (Phase 1) |
| React | 19.2.3 | UI rendering | Project standard |
| TypeScript | ^5 | Type safety | Project standard |
| shadcn/ui | 3.8.5 | UI component library | Project standard; Radix UI + Tailwind CSS composition |
| Radix UI | 1.4.3 | Headless UI primitives | Project standard; provides Tabs, Accordion, Slider |
| Tailwind CSS | ^4 | Styling system | Project standard with OKLCH color tokens |
| next-themes | 0.4.6 | Theme management | Already installed (Phase 1); handles light/dark toggle |
| Decimal.js | 10.6.0 | Financial precision | Project standard for all financial values |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.1 | Component variant styling | Already used in project UI components |
| clsx | 2.1.1 | Conditional classNames | Standard utility in project |
| tailwind-merge | 3.5.0 | Merge conflicting Tailwind classes | Standard utility in project |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Radix UI Tabs | Headless UI Tabs | Radix already in use; switching adds dependency churn |
| Radix UI Accordion | Custom details/summary | Accordion provides better keyboard nav, animations, and accessibility |
| Native Intl.NumberFormat | react-currency-format | Native API is zero-dependency, smaller bundle, sufficient for display-only |
| Inline verdict logic | Separate verdict library | Verdict logic is simple (compare final net worth); no library needed |

**Installation:**
```bash
# No new dependencies required — all components use existing stack
```

## Architecture Patterns

### Recommended Component Structure
```
src/components/results/
├── verdict-card.tsx           # VIZ-01: Rent vs Buy verdict with reasoning
├── summary-cards.tsx          # VIZ-02: 2x2 grid of metric cards
├── chart-tabs.tsx             # Phase 6 placeholder: 3-tab structure (Net Worth, Cash Flow, Investment)
├── cost-breakdown-table.tsx   # VIZ-07: Expandable table with Accordion
├── year-comparison-panel.tsx  # VIZ-08: Slider + metrics display
└── theme-toggle-button.tsx    # Light/dark mode switcher
```

### Pattern 1: Verdict Logic from ComparisonResult

**What:** Compute verdict from final year net worth comparison, with tie threshold for near-parity scenarios.

**When to use:** In `verdict-card.tsx` component that consumes `ComparisonResult`.

**Example:**
```typescript
// Verdict logic pattern
function calculateVerdict(results: ComparisonResult, tieThreshold = 0.05) {
  const finalYear = results.yearlyComparison[results.yearlyComparison.length - 1]
  const renterFinal = finalYear.renterNetWorth
  const buyerFinal = finalYear.buyerNetWorthWithSelling
  const difference = buyerFinal.minus(renterFinal)
  const percentDiff = difference.div(renterFinal.abs()).abs()

  // Within 5% = tie
  if (percentDiff.lte(tieThreshold)) {
    return { decision: 'tie', difference, percentDiff }
  }

  return {
    decision: buyerFinal.gt(renterFinal) ? 'buy' : 'rent',
    difference: difference.abs(),
    percentDiff,
    winner: buyerFinal.gt(renterFinal) ? 'buyer' : 'renter'
  }
}
```

### Pattern 2: Canadian Dollar Formatting with Intl.NumberFormat

**What:** Use native `Intl.NumberFormat` for currency display with en-CA locale.

**When to use:** All currency displays in cards, tables, verdict text.

**Example:**
```typescript
// Utility function for consistent formatting
const formatCurrency = (value: Decimal, compact = false): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(compact && { notation: 'compact', compactDisplay: 'short' })
  }).format(value.toNumber())
}

// Usage
formatCurrency(new Decimal(1234567))        // "$1,234,567"
formatCurrency(new Decimal(1234567), true)  // "$1.2M"
```

### Pattern 3: Expandable Table Rows with Accordion

**What:** Use shadcn/ui Accordion component to wrap table rows for expand/collapse behavior.

**When to use:** Cost breakdown table where summary rows expand to show sub-items.

**Example:**
```typescript
// Expandable cost breakdown pattern
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="multiple" className="w-full">
  <AccordionItem value="initial-costs">
    <AccordionTrigger>
      <div className="flex w-full justify-between">
        <span>Initial Costs</span>
        <span>{formatCurrency(totalInitial)}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-2 pl-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Down Payment</span>
          <span>{formatCurrency(downPayment)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Land Transfer Tax</span>
          <span>{formatCurrency(ltt)}</span>
        </div>
        {/* More sub-items */}
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Pattern 4: Tabs for Chart Sections

**What:** Use shadcn/ui Tabs component with 3 tabs for Net Worth, Cash Flow, and Investment Growth charts.

**When to use:** Chart container that will be populated with animated charts in Phase 6.

**Example:**
```typescript
// Chart tabs pattern (Phase 5 creates structure, Phase 6 adds charts)
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="net-worth" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="net-worth">Net Worth</TabsTrigger>
    <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
    <TabsTrigger value="investment">Investment Growth</TabsTrigger>
  </TabsList>
  <TabsContent value="net-worth">
    {/* Phase 6: Net worth area chart */}
    <PlaceholderBlock label="Net Worth Chart" />
  </TabsContent>
  <TabsContent value="cash-flow">
    {/* Phase 6: Cash flow bar chart */}
    <PlaceholderBlock label="Cash Flow Chart" />
  </TabsContent>
  <TabsContent value="investment">
    {/* Phase 6: Investment growth chart */}
    <PlaceholderBlock label="Investment Growth Chart" />
  </TabsContent>
</Tabs>
```

### Pattern 5: Year Selector with Slider and Preset Buttons

**What:** Slider from 1 to timeHorizon with preset buttons for break-even year and mortgage payoff year.

**When to use:** Year comparison panel for exploring year-by-year metrics.

**Example:**
```typescript
// Year selector pattern
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

function YearSelector({
  value,
  onChange,
  max,
  breakEvenYear,
  mortgagePayoffYear
}: YearSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(breakEvenYear)}
        >
          Break-even Year
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(mortgagePayoffYear)}
        >
          Mortgage Paid Off
        </Button>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={max}
        step={1}
      />
      <div className="text-center text-sm text-muted-foreground">
        Year {value} of {max}
      </div>
    </div>
  )
}
```

### Pattern 6: Theme Toggle Integration

**What:** Add theme toggle button that uses next-themes `useTheme` hook with smooth transitions.

**When to use:** Header or sidebar for light/dark mode switching.

**Example:**
```typescript
// Theme toggle pattern
'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="transition-colors"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

### Anti-Patterns to Avoid

- **Prop drilling ComparisonResult through multiple layers:** Use component composition or pass only needed slices (e.g., pass `finalYear` to VerdictCard, not entire `ComparisonResult`).
- **Rendering all years in year comparison table:** Only render selected year metrics; use slider to change selection, not a massive scrollable list.
- **Client-side number formatting libraries:** Native `Intl.NumberFormat` is sufficient, faster, and zero-dependency.
- **Custom tab implementation:** Radix Tabs provides full keyboard navigation and ARIA support; don't reinvent.
- **Hardcoded verdict text:** Use templated strings with dynamic values so verdict updates reflect actual user inputs.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tabbed interface | Custom tab state management with conditional rendering | Radix UI Tabs via shadcn/ui | Keyboard navigation (arrow keys, Home/End), ARIA roles, focus management all built-in |
| Expandable table rows | Custom toggle state + CSS transitions | Radix UI Accordion via shadcn/ui | Smooth animations, keyboard support, multiple/single expand modes, proper ARIA |
| Currency formatting | String manipulation with regex | `Intl.NumberFormat` with en-CA locale | Handles locale-specific formatting, negative numbers, compact notation, and maintains accessibility |
| Theme persistence | Manual localStorage + useEffect | next-themes library | Handles SSR/CSR hydration, prevents FOUC, syncs system preferences, manages class toggling |
| Slider with range | Custom drag handlers and position calculations | Radix UI Slider via shadcn/ui | Touch support, keyboard input (arrow keys, Page Up/Down), RTL support, ARIA slider role |

**Key insight:** Financial calculator UIs need bulletproof accessibility (keyboard nav, screen readers), consistent animations, and precise number formatting. Radix UI primitives and native browser APIs solve these better than custom implementations.

## Common Pitfalls

### Pitfall 1: Decimal-to-Number Conversion Timing

**What goes wrong:** Converting Decimal to number too early causes downstream formatting inconsistencies or precision loss.

**Why it happens:** Temptation to call `.toNumber()` immediately after receiving `ComparisonResult` to work with familiar JavaScript numbers.

**How to avoid:** Keep values as Decimal throughout component tree; only convert at the final display boundary (inside `formatCurrency` or similar).

**Warning signs:** Rounding errors in display, inconsistent decimal places across cards, or errors when comparing large Decimal values.

```typescript
// BAD: Convert early
const finalNetWorth = results.yearlyComparison[last].renterNetWorth.toNumber()
return <span>{finalNetWorth.toLocaleString()}</span>

// GOOD: Convert at display boundary
const finalNetWorth = results.yearlyComparison[last].renterNetWorth
return <span>{formatCurrency(finalNetWorth)}</span>
```

### Pitfall 2: Theme Flashing (FOUC)

**What goes wrong:** Dark mode "flashes" light theme briefly on page load before switching to dark.

**Why it happens:** Theme is stored in localStorage but needs to apply before React hydration.

**How to avoid:** Ensure `next-themes` ThemeProvider has `attribute="class"` and `defaultTheme="system"` set correctly; next-themes injects blocking script to prevent FOUC.

**Warning signs:** Visible flash of unstyled content or wrong theme on initial page load.

```typescript
// layout.tsx — ensure ThemeProvider wraps app
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange={false} // Smooth transitions on toggle
>
  {children}
</ThemeProvider>
```

### Pitfall 3: Break-Even Year Logic Bugs

**What goes wrong:** Break-even year shows "never" when buying is slightly better early on, or shows incorrect year due to with/without selling confusion.

**Why it happens:** Not distinguishing between `breakEvenWithSelling` (includes selling costs) and `breakEvenWithoutSelling` (equity only).

**How to avoid:** Use `breakEvenWithSelling` as primary metric (user expects to sell at horizon end); clarify in verdict text which scenario is used.

**Warning signs:** Verdict says "Buying is better" but break-even year is "never", or break-even year changes dramatically when toggling small inputs.

```typescript
// Use withSelling for user-facing verdict
const breakEven = results.breakEvenWithSelling
const verdictText = breakEven === 'never'
  ? 'Buying never catches up to renting within your time horizon.'
  : `Buying becomes the better choice starting in Year ${breakEven}.`
```

### Pitfall 4: Accordion Accessibility Issues

**What goes wrong:** Screen reader users can't navigate cost breakdown table; keyboard users can't expand rows.

**Why it happens:** Using custom `<details>` elements or manual toggle without proper ARIA attributes.

**How to avoid:** Use Radix Accordion component which includes `role="region"`, `aria-expanded`, `aria-controls`, and keyboard handling out-of-the-box.

**Warning signs:** Failing WCAG 2.1 Level AA automated audits; keyboard Tab key skips over expandable sections.

### Pitfall 5: Mobile Table Overflow

**What goes wrong:** Cost breakdown table overflows viewport on mobile, horizontal scroll is clunky or hidden.

**Why it happens:** Fixed-width columns or lack of responsive design for 3-column layout (label, renter, buyer).

**How to avoid:** Use Tailwind responsive utilities to stack columns on mobile (`flex-col sm:flex-row`); add horizontal scroll container with visible scrollbar on small screens.

**Warning signs:** User reports "can't see buyer column on phone" or horizontal scroll doesn't work on touch devices.

```typescript
// Responsive table pattern
<div className="overflow-x-auto sm:overflow-x-visible">
  <div className="min-w-[640px] sm:min-w-0">
    {/* Table content */}
  </div>
</div>
```

### Pitfall 6: Year Slider Performance

**What goes wrong:** Dragging slider lags or feels janky, especially on mobile.

**Why it happens:** Recalculating/re-rendering year metrics on every slider movement (potentially 30+ times per drag).

**How to avoid:** Use React's `useDeferredValue` or `useTransition` to debounce expensive renders during drag; only update display when user releases slider.

**Warning signs:** Visible frame drops or delay when dragging slider; CPU usage spikes during interaction.

```typescript
// Deferred value pattern
const [selectedYear, setSelectedYear] = useState(1)
const deferredYear = useDeferredValue(selectedYear)

// Slider updates selectedYear immediately (smooth UI)
// Metrics display uses deferredYear (deferred expensive render)
```

## Code Examples

Verified patterns from existing project and official sources:

### ComparisonResult Data Access
```typescript
// Source: d:/Coding Projects/Artificially Financially Free/src/types/investment.ts
interface ComparisonResult {
  housingProjection: HousingProjection
  portfolio: PortfolioYear[]
  yearlyComparison: YearlyComparison[]  // Key data for display
  breakEvenWithSelling: number | 'never'
  breakEvenWithoutSelling: number | 'never'
  marginalTaxRate: Decimal
  afterTaxReturnRate: Decimal
}

interface YearlyComparison {
  year: number
  renterNetWorth: Decimal
  buyerNetWorthWithSelling: Decimal
  buyerNetWorthWithoutSelling: Decimal
  monthlySavings: Decimal
  annualRent: Decimal
  buyerAnnualCost: Decimal
}

// Access final year for verdict
const finalYear = results.yearlyComparison[results.yearlyComparison.length - 1]
```

### Theme Toggle with next-themes
```typescript
// Source: Official next-themes documentation + project globals.css
// Transitions enabled by Tailwind's transition-colors utility
'use client'
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  )
}

// globals.css already includes smooth transitions via:
// .dark { /* color tokens */ }
// body { @apply bg-background text-foreground; /* Tailwind transitions apply */ }
```

### Radix Tabs Implementation
```typescript
// Source: shadcn/ui Tabs documentation + project UI components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="net-worth">
  <TabsList>
    <TabsTrigger value="net-worth">Net Worth</TabsTrigger>
    <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
    <TabsTrigger value="investment">Investment</TabsTrigger>
  </TabsList>
  <TabsContent value="net-worth">
    {/* Content */}
  </TabsContent>
  {/* More TabsContent */}
</Tabs>
```

### Accordion for Expandable Rows
```typescript
// Source: shadcn/ui Accordion documentation
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="multiple"> {/* multiple allows expanding several at once */}
  <AccordionItem value="initial-costs">
    <AccordionTrigger>Initial Costs</AccordionTrigger>
    <AccordionContent>
      {/* Detail rows */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Canadian Currency Formatting
```typescript
// Source: MDN Intl.NumberFormat documentation
const formatCAD = (value: Decimal, options?: { compact?: boolean }) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: options?.compact ? 'compact' : 'standard'
  }).format(value.toNumber())
}

formatCAD(new Decimal(123456))           // "$123,456"
formatCAD(new Decimal(123456), { compact: true }) // "$123K"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom tab state with conditional rendering | Radix UI Tabs primitive | Radix UI 1.0+ (2022) | Better accessibility, keyboard navigation, and ARIA compliance out-of-the-box |
| Manual localStorage theme management | next-themes with SSR support | next-themes 0.1+ (2021) | Eliminates FOUC, handles system preference sync, reduces boilerplate |
| External currency formatting libraries | Native Intl.NumberFormat API | Supported all modern browsers (2020+) | Zero dependencies, smaller bundle, native performance, locale-aware |
| CSS transition hacks for theme switching | View Transitions API + CSS variables | View Transitions API (2023), OKLCH in Tailwind 4 (2024) | Smoother visual transitions, perceptually uniform color interpolation |
| Separate accordion libraries | Radix UI Collapsible/Accordion | Radix UI 1.0+ (2022) | Unified component API, consistent animation patterns, built-in accessibility |

**Deprecated/outdated:**
- **react-currency-format / react-number-format for display:** Native `Intl.NumberFormat` is now sufficient and preferred for display-only use cases (input formatting may still benefit from libraries, but Phase 4 already handles inputs).
- **Manual dark mode with useEffect + localStorage:** next-themes handles this comprehensively; no need for custom solutions.
- **Headless UI (Tailwind Labs):** Project standardized on Radix UI via shadcn/ui; avoid mixing primitive libraries.

## Open Questions

1. **Tie threshold definition**
   - What we know: User wants "It's a tie" messaging when outcomes are nearly identical
   - What's unclear: Exact threshold (5% of final net worth? Fixed dollar amount like $10K?)
   - Recommendation: Start with 5% relative threshold; make it a constant that can be easily adjusted after user feedback

2. **Mobile table strategy**
   - What we know: Cost breakdown table has 3 columns (label, renter, buyer) plus expandable details
   - What's unclear: Whether to stack columns vertically on mobile or use horizontal scroll
   - Recommendation: Horizontal scroll with clear touch affordances (visible scrollbar, padding hints); vertical stacking breaks cost comparison context

3. **Year comparison metrics priority**
   - What we know: Three metrics per year (net worth, annual costs, cumulative invested vs equity)
   - What's unclear: Which metric is most important to display prominently vs secondary
   - Recommendation: Net worth difference is primary (largest font), annual costs and cumulative are supporting context (smaller, below)

4. **Dark mode as default vs light mode**
   - What we know: Phase 1 decided dark-first theme; CONTEXT.md says "dark-first theme from Phase 1 continues" but also "Day/night light and dark theme toggle required"
   - What's unclear: Is default light or dark? Deferred ideas say "Dark mode only in v1"
   - Recommendation: Clarify with user; research assumes toggle is implemented with system preference as default (`defaultTheme="system"`)

## Sources

### Primary (HIGH confidence)
- Existing project codebase: types/investment.ts, types/housing.ts, components/ui/* (tabs, accordion, slider, card)
- Existing project package.json: next-themes 0.4.6, radix-ui 1.4.3, shadcn 3.8.5, Decimal.js 10.6.0
- Existing project globals.css: OKLCH color tokens, light/dark theme definitions
- [MDN Intl.NumberFormat documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

### Secondary (MEDIUM confidence)
- [shadcn/ui Tabs documentation](https://ui.shadcn.com/docs/components/radix/tabs) - Official component API
- [shadcn/ui Accordion documentation](https://ui.shadcn.com/docs/components/radix/accordion) - Official component API
- [next-themes GitHub repository](https://github.com/pacocoursey/next-themes) - Official theme management library
- [React Slider with preset values pattern](https://www.shadcn.io/patterns/slider-interactive-3) - shadcn.io pattern library
- [WOWA Rent vs Buy Calculator](https://wowa.ca/calculators/rent-vs-buy-calculator) - Reference for breakdown table structure
- [Fintech design guide patterns](https://www.eleken.co/blog-posts/modern-fintech-design-guide) - Visual hierarchy and data presentation best practices
- [DEV Community: Expandable Data Table with shadcn/ui](https://dev.to/mfts/build-an-expandable-data-table-with-2-shadcnui-components-4nge) - Implementation pattern

### Tertiary (LOW confidence)
- [PWL Capital Rent vs Buy Calculator](https://research-tools.pwlcapital.com/research/rent-vs-buy) - Reference URL provided but page uses Next.js serialization (unable to extract detailed structure without browser inspection)
- WebSearch results on dashboard layout patterns (2026) - General guidance but not specific to financial calculators

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already installed and in active use from Phases 1-4
- Architecture: HIGH - Patterns follow existing project conventions (React Context, shadcn/ui composition, client components)
- Pitfalls: HIGH - Based on documented Radix UI gotchas, next-themes FOUC issues, and mobile responsiveness common issues
- Design decisions: MEDIUM - PWL Capital reference URL didn't yield extractable structure; relying on WOWA + general fintech UI patterns

**Research date:** 2026-02-25
**Valid until:** 2026-03-27 (30 days — stable stack, no fast-moving dependencies)
