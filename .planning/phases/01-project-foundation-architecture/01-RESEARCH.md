# Phase 1: Project Foundation & Architecture - Research

**Researched:** 2026-02-24
**Domain:** Next.js App Router project scaffolding, theming, URL state architecture, financial precision
**Confidence:** HIGH

## Summary

Phase 1 establishes a Next.js 15 application with TypeScript, Tailwind CSS v4, and shadcn/ui as the component library. The architecture must support three future-facing requirements: URL-serializable state (for shareable links), programmatic input control (for AI chatbot), and structured content data (for tooltips/explainers). Additionally, Decimal.js provides arbitrary-precision arithmetic to eliminate floating-point errors in financial calculations.

The user has made specific decisions: clean URLs during normal use with localStorage persistence, a share button that generates parameter URLs, a visible scaffold shell with Phantom.com-inspired dark theme, and TypeScript objects (not JSON) for content authoring. The nuqs library handles URL serialization via `createSerializer` for on-demand URL generation, while `use-local-storage-state` provides SSR-safe localStorage persistence. shadcn/ui's CSS variable theming system with OKLCH colors in Tailwind v4 makes the entire palette swappable from a single file.

**Primary recommendation:** Use `create-next-app@latest` with `--yes` defaults, then layer shadcn/ui (CSS variables mode), nuqs (for serialization utilities only -- not as live URL state), and Decimal.js. Build a visible scaffold shell with branded dark theme from day one.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Tooltip and explainer content stored as **TypeScript objects** (not JSON, not hardcoded JSX)
- Content split by category into separate files (e.g., `tooltips.ts`, `explainers.ts`, `verdictText.ts`)
- Content strings support **rich formatting via markdown** (bold, links, bullet lists) inside the TypeScript objects
- Claude writes all initial content; user reviews and edits
- **Clean URL while working** -- address bar stays clean (no params) during normal use
- **localStorage persistence** -- all input state saved to browser localStorage so page refresh preserves inputs
- **Share button generates param URL** -- readable params with human-friendly names (e.g., `?price=600000&province=ON`), only non-default values included
- When a user opens a shared param URL, inputs are populated from the URL params (URL takes precedence over localStorage)
- Phase 1 delivers a **visible page shell** (not just invisible architecture)
- **Sidebar + main layout**: inputs panel in left sidebar, results/charts in main content area on desktop; stacks vertically on mobile
- **Labeled placeholder blocks** in each section: subtle outlined boxes labeled "Input Panel", "Verdict", "Net Worth Chart", etc.
- **Brand styling applied from day one** -- not deferred to Phase 8
- **Phantom.com (crypto wallet)** as the starting visual reference: dark theme, deep purple/dark backgrounds, clean sans-serif typography, soft gradients, premium fintech feel
- **Templatized theme config** -- all colors, fonts, spacing tokens live in a single theme config file so the entire palette can be swapped later
- shadcn/ui components themed to match the Phantom-inspired palette

### Claude's Discretion
- Exact theme token structure and naming convention
- Choice of sans-serif font pairing
- Decimal.js integration pattern
- Component file organization and naming conventions
- Testing setup and tooling choices

### Deferred Ideas (OUT OF SCOPE)
- **Financial literacy level selector** -- toggle that adapts inputs/text complexity based on user competency. Belongs as its own phase or v2 feature.
- **URL shortener for shared links** -- short URLs like `artificiallyfinanciallyfree.com/c/abc123`. Requires backend/database. Natural fit for v2.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ARCH-01 | All calculator inputs serializable to URL query parameters so shareable links can be added without re-architecting state management | nuqs `createSerializer` + `createLoader` pattern; shared parser definitions used by both React state and serialization utilities; round-trip test verifiable with `serialize` then `parse` |
| ARCH-02 | Component architecture supports external programmatic control of inputs (for future AI chatbot integration) | React state lifted to a shared store (React Context or Zustand); input components accept values via props/context rather than owning internal state; external controller can call setter functions |
| ARCH-03 | Tooltip and explainer content stored as structured data objects (not hardcoded JSX) for future AI context consumption | TypeScript Record objects in dedicated files (`tooltips.ts`, `explainers.ts`); content keyed by input/section ID; markdown strings for rich formatting; content consumed by generic Tooltip/Explainer components |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x (latest) | React framework with App Router | Industry standard for React apps; App Router is the current default; `create-next-app --yes` gives TypeScript + Tailwind + ESLint + App Router + Turbopack out of the box |
| TypeScript | 5.x (bundled) | Type safety | Bundled with create-next-app; essential for structured content types and parser definitions |
| Tailwind CSS | v4 (bundled) | Utility-first CSS | create-next-app@latest bundles Tailwind v4; CSS-first config (no tailwind.config.js); works natively with shadcn/ui's `@theme inline` approach |
| shadcn/ui | 0.9.x (latest CLI) | Component library | Themeable via CSS variables; components are copied into project (not node_modules); OKLCH color format in v4; built on Radix UI primitives |
| React | 19.x (bundled) | UI library | Bundled with Next.js 15; shadcn/ui components updated for React 19 (no forwardRef) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nuqs | 2.x (latest) | URL query string serialization/parsing | Use `createSerializer` and `createLoader` from `nuqs/server` for share button URL generation and shared URL ingestion; do NOT use `useQueryState` for live state (user wants clean URLs) |
| Decimal.js | 10.x (latest) | Arbitrary-precision decimal arithmetic | All financial calculations -- mortgage payments, tax computations, investment returns; prevents `0.3 - 0.1 = 0.19999999999998` |
| use-local-storage-state | 19.x (latest) | SSR-safe localStorage React hook | Persist all calculator inputs to localStorage; handles SSR hydration, cross-tab sync, in-memory fallback when localStorage unavailable |
| next-themes | 0.4.x | Theme provider for dark mode | Required by shadcn/ui dark mode setup; provides `ThemeProvider` component wrapping root layout |
| lucide-react | latest | Icon library | Default icon library for shadcn/ui components |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| nuqs `createSerializer` | Manual `URLSearchParams` | nuqs provides type-safe parsers, `clearOnDefault` (only non-default values in URL), URL key remapping, and reusable parser definitions shared between serialization and future live URL state |
| use-local-storage-state | usehooks-ts `useLocalStorage` | use-local-storage-state has better SSR support (`useSyncExternalStore`-based), cross-tab sync, `isPersistent` API, and in-memory fallback; usehooks-ts is simpler but less robust for Next.js |
| use-local-storage-state | Custom `useLocalStorage` hook | Custom hooks miss cross-tab sync, SSR edge cases, and `isPersistent` indicator; not worth hand-rolling |
| Decimal.js | bignumber.js | Same author (mikemcl); Decimal.js supports `exp()`, `ln()`, `pow()` needed for compound interest; bignumber.js lacks these |
| Zustand | React Context | Context is sufficient for v1 (single page, <20 inputs); Zustand adds unnecessary dependency; upgrade path is clean if needed |

**Installation:**
```bash
# Project scaffold
npx create-next-app@latest artificially-financially-free --yes
cd artificially-financially-free

# shadcn/ui
npx shadcn@latest init

# Core dependencies
npm install decimal.js nuqs use-local-storage-state next-themes

# shadcn/ui components (initial set for scaffold)
npx shadcn@latest add button card tooltip sidebar
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout (NuqsAdapter, ThemeProvider, fonts)
│   ├── page.tsx            # Main calculator page
│   └── globals.css         # Tailwind v4 theme (CSS variables, @theme inline)
├── components/
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── layout/             # Shell layout components
│   │   ├── app-sidebar.tsx # Sidebar container (inputs panel)
│   │   ├── main-content.tsx# Main content area (results/charts)
│   │   └── placeholder-block.tsx # Labeled placeholder boxes
│   └── calculator/         # Calculator-specific components (future phases)
├── lib/
│   ├── decimal.ts          # Decimal.js configuration and helpers
│   ├── parsers.ts          # nuqs parser definitions (shared between serializer and future URL state)
│   ├── serializer.ts       # createSerializer instance for share button
│   ├── defaults.ts         # Default values for all calculator inputs
│   └── utils.ts            # shadcn/ui cn() utility (auto-generated)
├── hooks/
│   ├── use-calculator-state.ts  # Central state hook (localStorage + URL ingestion)
│   └── use-share-url.ts         # Share button URL generation
├── content/
│   ├── tooltips.ts         # Tooltip content by input ID
│   ├── explainers.ts       # Explainer content by concept ID
│   └── verdict-text.ts     # Verdict explanation templates
├── types/
│   └── calculator.ts       # TypeScript interfaces for calculator state
└── providers/
    └── calculator-provider.tsx  # React Context provider for calculator state
```

### Pattern 1: State Architecture (localStorage + URL Ingestion + Share Generation)

**What:** Calculator state lives in React Context, persisted to localStorage. URL params are only used for ingestion (opening a shared link) and generation (share button). The address bar stays clean during normal use.

**When to use:** When you want refresh persistence without URL clutter, plus shareable links on demand.

**How it works:**

```
Normal use:        [React State] <--> [localStorage]     URL: /
Open shared link:  [URL params] --> [React State] --> [localStorage]     URL: /?price=600000&province=ON (cleared after ingestion)
Share button:      [React State] --> createSerializer --> clipboard     URL stays: /
```

**Example:**
```typescript
// lib/parsers.ts - Shared parser definitions (used by serializer AND future URL state)
// Source: Context7 /47ng/nuqs - createSerializer docs
import { parseAsInteger, parseAsFloat, parseAsString, parseAsBoolean, type UrlKeys } from 'nuqs/server'

export const calculatorParsers = {
  purchasePrice: parseAsInteger.withDefault(600000),
  downPaymentPercent: parseAsFloat.withDefault(20),
  mortgageRate: parseAsFloat.withDefault(5.5),
  amortizationYears: parseAsInteger.withDefault(25),
  monthlyRent: parseAsInteger.withDefault(2000),
  province: parseAsString.withDefault('ON'),
  timeHorizon: parseAsInteger.withDefault(25),
  firstTimeBuyer: parseAsBoolean.withDefault(false),
  annualIncome: parseAsInteger.withDefault(75000),
  // ... more inputs added in Phase 4
}

export const calculatorUrlKeys: UrlKeys<typeof calculatorParsers> = {
  purchasePrice: 'price',
  downPaymentPercent: 'dp',
  mortgageRate: 'rate',
  amortizationYears: 'amort',
  monthlyRent: 'rent',
  province: 'province',
  timeHorizon: 'years',
  firstTimeBuyer: 'ftb',
  annualIncome: 'income',
}
```

```typescript
// lib/serializer.ts - Share URL generation
// Source: Context7 /47ng/nuqs - createSerializer
import { createSerializer } from 'nuqs/server'
import { calculatorParsers, calculatorUrlKeys } from './parsers'

export const serializeCalculatorState = createSerializer(calculatorParsers, {
  clearOnDefault: true,  // Only non-default values appear in URL
  urlKeys: calculatorUrlKeys,
})

// Usage: serializeCalculatorState(window.location.origin, currentState)
// Returns: "https://artificiallyfinanciallyfree.com/?price=750000&province=BC&rent=2500"
```

```typescript
// hooks/use-share-url.ts
import { serializeCalculatorState } from '@/lib/serializer'
import { useCalculatorState } from '@/providers/calculator-provider'

export function useShareUrl() {
  const { state } = useCalculatorState()

  const generateShareUrl = () => {
    return serializeCalculatorState(window.location.origin, state)
  }

  const copyShareUrl = async () => {
    const url = generateShareUrl()
    await navigator.clipboard.writeText(url)
  }

  return { generateShareUrl, copyShareUrl }
}
```

### Pattern 2: Structured Content Data (TypeScript Objects with Markdown)

**What:** All tooltip and explainer content stored as typed TypeScript records, keyed by input/section ID, with markdown-formatted strings for rich text.

**When to use:** When content needs to be (a) separated from presentation, (b) consumed by AI systems, and (c) easily edited by non-developers.

**Example:**
```typescript
// content/tooltips.ts
export interface TooltipContent {
  label: string
  description: string  // Supports markdown
  learnMore?: string   // Optional link to explainer
}

export const tooltips: Record<string, TooltipContent> = {
  purchasePrice: {
    label: 'Purchase Price',
    description: 'The total price you would pay for the home. This is the **listing price** or your **offer amount**, not the mortgage amount.',
    learnMore: '#purchase-price',
  },
  downPaymentPercent: {
    label: 'Down Payment',
    description: 'The percentage of the purchase price you pay upfront. In Canada, the **minimum is 5%** for homes under $500K, **10%** for the portion above $500K, and **20%** for homes over $1M. Below 20% requires [CMHC insurance](#cmhc).',
  },
  mortgageRate: {
    label: 'Mortgage Rate',
    description: 'Your annual mortgage interest rate. Canadian mortgages use **semi-annual compounding**, which means the effective rate is slightly higher than the posted rate.',
    learnMore: '#semi-annual-compounding',
  },
}
```

```typescript
// content/explainers.ts
export interface ExplainerContent {
  title: string
  slug: string
  body: string  // Markdown
  relatedInputs: string[]  // Keys into tooltips
}

export const explainers: Record<string, ExplainerContent> = {
  'cmhc': {
    title: 'CMHC Mortgage Insurance',
    slug: 'cmhc',
    body: `When your down payment is **less than 20%** of the purchase price...`,
    relatedInputs: ['downPaymentPercent', 'purchasePrice'],
  },
  // ...
}
```

### Pattern 3: Decimal.js Financial Precision

**What:** A configured Decimal.js instance with helpers for common financial operations.

**When to use:** Every financial calculation -- never use native JavaScript arithmetic for money.

**Example:**
```typescript
// lib/decimal.ts
// Source: Context7 /mikemcl/decimal.js - configuration docs
import Decimal from 'decimal.js'

// Configure for financial calculations
Decimal.set({
  precision: 20,         // 20 significant digits (overkill for currency, but safe)
  rounding: Decimal.ROUND_HALF_UP,  // Standard financial rounding (mode 4)
  toExpNeg: -9,          // Don't use exponential notation for small numbers
  toExpPos: 21,          // Don't use exponential notation below 10^21
})

// Helper: Canadian semi-annual compounding effective monthly rate
export function effectiveMonthlyRate(annualRate: number): Decimal {
  // Canadian mortgage: semi-annual compounding
  // Effective monthly rate = (1 + annual/2)^(1/6) - 1
  const r = new Decimal(annualRate).div(100)
  return r.div(2).plus(1).pow(new Decimal(1).div(6)).minus(1)
}

// Helper: Format as currency string
export function formatCurrency(value: Decimal | number): string {
  const d = value instanceof Decimal ? value : new Decimal(value)
  return d.toFixed(2)  // Always 2 decimal places for currency
}

// Demo: Prove precision works
// Native JS:  0.1 + 0.2 = 0.30000000000000004
// Decimal.js: new Decimal(0.1).plus(0.2).toString() = '0.3'
```

### Pattern 4: Externally Controllable State (ARCH-02)

**What:** Calculator state managed through React Context with exposed setter functions, allowing any component (or future AI chatbot) to programmatically control inputs.

**Example:**
```typescript
// types/calculator.ts
export interface CalculatorState {
  purchasePrice: number
  downPaymentPercent: number
  mortgageRate: number
  amortizationYears: number
  monthlyRent: number
  province: string
  timeHorizon: number
  firstTimeBuyer: boolean
  annualIncome: number
  // Extended in Phase 4 with more inputs
}

// providers/calculator-provider.tsx
export interface CalculatorContextValue {
  state: CalculatorState
  setState: (updates: Partial<CalculatorState>) => void
  resetToDefaults: () => void
  // Future: loadFromUrl, loadFromAiSuggestion, etc.
}
```

### Anti-Patterns to Avoid
- **URL as live state source:** User explicitly wants clean URLs. Do NOT use `useQueryState` for live state binding. nuqs is only for serialize/deserialize utilities.
- **Hardcoding content in JSX:** Content strings (tooltips, explainers) must live in TypeScript data files, never inline in components. Violates ARCH-03.
- **Native JS arithmetic for money:** `0.1 + 0.2 !== 0.3` in JavaScript. Always use Decimal.js for financial math. Even simple additions.
- **localStorage without SSR guard:** Direct `localStorage` access in server components or during SSR causes "window is undefined" errors. Always use `use-local-storage-state` or guard with `typeof window !== 'undefined'`.
- **Prop drilling calculator state:** With 20+ inputs, prop drilling is unmaintainable. Use React Context from day one so the state is accessible anywhere in the tree.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL query serialization | Custom URLSearchParams wrapper | nuqs `createSerializer` + parsers | Type-safe, `clearOnDefault`, URL key remapping, reusable parser definitions |
| localStorage persistence | Custom `useLocalStorage` hook | `use-local-storage-state` | SSR hydration handling, cross-tab sync, `isPersistent` API, in-memory fallback |
| Decimal arithmetic | Custom rounding functions | Decimal.js | Arbitrary precision, `pow()`, `exp()`, `ln()` for compound interest; handles edge cases (underflow, overflow, NaN) |
| UI component primitives | Custom buttons/cards/tooltips | shadcn/ui | Accessible (Radix UI), themed via CSS variables, keyboard navigation, focus management |
| Dark mode toggling | Custom theme context | next-themes | Handles SSR flash, localStorage sync, system preference detection, `class` attribute strategy |
| CSS variable theming | Custom CSS variable management | shadcn/ui `@theme inline` + OKLCH | Integrated with Tailwind v4, all components reference variables, palette swap = edit one `:root` block |
| Font loading/optimization | Manual `@font-face` declarations | `next/font/google` | Automatic font optimization, self-hosted (no external requests), CSS variable integration |

**Key insight:** Phase 1 is infrastructure. Every hand-rolled solution here becomes technical debt that compounds across Phases 2-8. The libraries above are battle-tested and integrate cleanly with each other.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Configuration Confusion
**What goes wrong:** Developers create a `tailwind.config.js` file (v3 pattern) when Tailwind v4 uses CSS-first configuration via `@theme inline` in `globals.css`.
**Why it happens:** Most tutorials and Stack Overflow answers still reference v3 setup. `create-next-app@latest` now bundles Tailwind v4.
**How to avoid:** Do NOT create `tailwind.config.js`. All theme configuration lives in `src/app/globals.css` using `@theme inline {}` and `:root {}` CSS variable blocks.
**Warning signs:** A `tailwind.config.js` file exists in the project root alongside Tailwind v4.

### Pitfall 2: shadcn/ui Color Format (OKLCH vs HSL)
**What goes wrong:** Mixing HSL and OKLCH color values in the theme. shadcn/ui v4 uses OKLCH; legacy docs show HSL.
**Why it happens:** OKLCH is relatively new. Many color pickers and design tools output HSL or HEX.
**How to avoid:** Use OKLCH for all shadcn/ui theme variables (the format in `:root {}` and `.dark {}`). Convert Phantom-inspired hex colors to OKLCH using an online converter or the `oklch()` CSS function. The `oklch(L C H)` format: L = lightness 0-1, C = chroma 0-0.4, H = hue angle 0-360.
**Warning signs:** `hsl()` values appearing in `:root` CSS variables alongside `oklch()` values.

### Pitfall 3: localStorage SSR Hydration Mismatch
**What goes wrong:** Server renders with default state, client hydrates with localStorage state, causing a React hydration mismatch warning and visual flash.
**Why it happens:** localStorage is browser-only; server has no access to it. The first server render always uses defaults.
**How to avoid:** `use-local-storage-state` handles this via `useSyncExternalStore`. Components may render twice during hydration (this is expected React behavior). Do not try to suppress this -- it's the correct SSR pattern.
**Warning signs:** Console warnings about hydration mismatches on initial page load.

### Pitfall 4: nuqs Adapter Missing
**What goes wrong:** `useQueryState` or nuqs utilities fail silently or throw errors.
**Why it happens:** nuqs requires `NuqsAdapter` wrapping the component tree in the root layout. This is easily forgotten.
**How to avoid:** Add `NuqsAdapter` in `src/app/layout.tsx` wrapping `{children}`. Even though we're not using `useQueryState` for live state in v1, the adapter is needed for `createLoader` to parse incoming shared URLs.
**Warning signs:** nuqs functions returning `null` or throwing "adapter not found" errors.

### Pitfall 5: Decimal.js Forgetting `.toNumber()` for Display
**What goes wrong:** Displaying Decimal objects in JSX shows `[object Object]` or `Decimal { ... }` instead of the number.
**Why it happens:** Decimal.js values are objects, not primitives. They need explicit conversion for display.
**How to avoid:** Use `.toFixed(2)` for currency display, `.toNumber()` when passing to charting libraries that expect native numbers. Keep values as Decimal throughout calculation chains; only convert at the boundary (display/serialization).
**Warning signs:** `[object Object]` appearing in rendered output; NaN from charting libraries.

### Pitfall 6: Theme Flash on Page Load (FOUC)
**What goes wrong:** Page briefly renders in light mode before dark theme applies, causing a white flash.
**Why it happens:** The theme class isn't applied until JavaScript runs.
**How to avoid:** `next-themes` with `attribute="class"` and `suppressHydrationWarning` on the `<html>` tag handles this. Ensure the `ThemeProvider` wraps the entire app in the root layout. Set `defaultTheme="dark"` since the Phantom-inspired theme is dark-first.
**Warning signs:** White flash on initial page load or page navigation.

## Code Examples

Verified patterns from official sources:

### Next.js Root Layout with All Providers
```typescript
// src/app/layout.tsx
// Sources: Context7 /vercel/next.js, /shadcn-ui/ui, /47ng/nuqs
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from '@/components/theme-provider'
import { CalculatorProvider } from '@/providers/calculator-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator | Artificially Financially Free',
  description: 'See exactly how renting and investing compares to buying in Canada',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <CalculatorProvider>
              {children}
            </CalculatorProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### shadcn/ui Theme Provider Component
```typescript
// src/components/theme-provider.tsx
// Source: Context7 /shadcn-ui/ui - dark mode Next.js docs
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Phantom-Inspired Dark Theme (OKLCH CSS Variables)
```css
/* src/app/globals.css - Phantom-inspired dark theme */
/* Phantom brand reference: #ab9ff2 (brand purple), #1a1a1a (background), #98979C (secondary) */
/* Converted to OKLCH for shadcn/ui v4 compatibility */

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-inter);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* Dark-first theme inspired by Phantom.com */
/* Phantom: bg #1a1a1a, brand #ab9ff2, text #ffffff, secondary #98979C */
:root {
  --radius: 0.75rem;
  /* Dark theme as default (Phantom-inspired) */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.185 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.185 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.746 0.113 292);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.25 0.01 290);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.25 0.01 290);
  --muted-foreground: oklch(0.65 0.01 290);
  --accent: oklch(0.30 0.03 290);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.746 0.113 292);
  --chart-1: oklch(0.746 0.113 292);
  --chart-2: oklch(0.696 0.17 162);
  --chart-3: oklch(0.769 0.188 70);
  --chart-4: oklch(0.627 0.265 304);
  --chart-5: oklch(0.645 0.246 16);
  --sidebar: oklch(0.165 0.005 290);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.746 0.113 292);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.25 0.015 290);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.746 0.113 292);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Decimal.js Round-Trip Precision Test
```typescript
// Verification: Decimal.js precision for financial calculations
// Source: Context7 /mikemcl/decimal.js
import Decimal from 'decimal.js'

// Problem: Native JS floating point
console.log(0.1 + 0.2)           // 0.30000000000000004
console.log(0.3 - 0.1)           // 0.19999999999999998
console.log(1.005 * 100)         // 100.49999999999999

// Solution: Decimal.js
const a = new Decimal(0.1).plus(0.2)
console.log(a.toString())         // '0.3' (correct)

const b = new Decimal(0.3).minus(0.1)
console.log(b.toString())         // '0.2' (correct)

// Canadian mortgage: semi-annual compounding
// Monthly payment = P * r / (1 - (1 + r)^-n)
// where r = (1 + annual_rate/2)^(1/6) - 1
const principal = new Decimal(480000)  // $600K home, 20% down
const annualRate = new Decimal(0.055)
const r = annualRate.div(2).plus(1).pow(new Decimal(1).div(6)).minus(1)
const n = new Decimal(300)  // 25 years * 12 months
const payment = principal.mul(r).div(
  new Decimal(1).minus(r.plus(1).pow(n.neg()))
)
console.log(payment.toFixed(2))    // Monthly payment with 2 decimal precision
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 `tailwind.config.js` | Tailwind v4 CSS-first `@theme inline` | 2025 | No config file needed; all theming in `globals.css`; `@custom-variant dark` replaces `darkMode: 'class'` |
| shadcn/ui HSL colors | shadcn/ui OKLCH colors | 2025 (v4 update) | Better perceptual uniformity; `.dark {}` block in CSS handles dark mode colors |
| `forwardRef` in React components | Direct props (React 19) | 2024-2025 | shadcn/ui components simplified; no more forwardRef boilerplate |
| `tailwindcss-animate` | `tw-animate-css` | 2025 | Drop-in replacement; used in shadcn/ui globals.css imports |
| nuqs v1 (no adapter) | nuqs v2 (requires NuqsAdapter) | 2024 | Must wrap app in NuqsAdapter; supports Next.js 14.2+ |
| Manual `@font-face` | `next/font/google` variable fonts | 2023+ (stable) | Self-hosted, zero-layout-shift, CSS variable integration |

**Deprecated/outdated:**
- `tailwind.config.js` for Tailwind v4 projects -- use CSS-first configuration
- `hsl()` color values in shadcn/ui themes -- OKLCH is the new default
- `forwardRef` in shadcn/ui components -- React 19 doesn't need it
- `tailwindcss-animate` -- replaced by `tw-animate-css`

## Open Questions

1. **Exact OKLCH values for Phantom-inspired palette**
   - What we know: Phantom brand purple is `#ab9ff2`, background is `#1a1a1a`, secondary text is `#98979C`. Their SDK theme also references these colors.
   - What's unclear: The exact OKLCH conversions for a complete palette (success, warning, chart colors) that feel cohesive with the Phantom aesthetic. The `:root` block above uses approximate conversions.
   - Recommendation: The values provided are reasonable starting approximations. Fine-tune during implementation by eyeballing in the browser. The user explicitly wants the theme to be easily changeable later, so "good enough" is fine for Phase 1.

2. **Font pairing beyond Inter**
   - What we know: Inter is the standard sans-serif for modern fintech UIs. It ships as a variable font via `next/font/google`.
   - What's unclear: Whether a secondary display font (for headings/brand name) would elevate the design.
   - Recommendation: Start with Inter only (body + headings). A display font can be layered in Phase 8 (Polish) if desired. One font family keeps the initial setup simple and fast-loading.

3. **shadcn/ui Sidebar component vs custom sidebar**
   - What we know: shadcn/ui has a `Sidebar` component (added in 2024) with built-in mobile/desktop responsiveness, collapsible behavior, and keyboard navigation.
   - What's unclear: Whether it fits the calculator's "inputs panel" pattern or is designed more for navigation sidebars.
   - Recommendation: Start with the shadcn/ui Sidebar component. It provides responsive collapse and mobile sheet behavior for free. If it doesn't fit the calculator input panel pattern, fall back to a simpler flex layout with manual responsive handling.

## Sources

### Primary (HIGH confidence)
- Context7 `/vercel/next.js` - Installation, App Router setup, create-next-app CLI, Tailwind v3/v4 configuration
- Context7 `/shadcn-ui/ui` - Installation, theming (CSS variables, OKLCH), dark mode setup with next-themes, components.json configuration
- Context7 `/47ng/nuqs` - NuqsAdapter setup, createSerializer, createLoader, parser builders, URL key remapping, clearOnDefault
- Context7 `/mikemcl/decimal.js` - Configuration (precision, rounding), arithmetic operations, pow/exp for compound interest

### Secondary (MEDIUM confidence)
- [shadcn/ui official docs - Next.js installation](https://ui.shadcn.com/docs/installation/next) - Latest CLI init command (`npx shadcn@latest init`)
- [shadcn/ui official docs - Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) - CSS-first config, OKLCH migration, `tw-animate-css` replacement
- [Phantom blog - brand identity](https://phantom.com/learn/blog/introducing-phantom-s-new-brand-identity) - Custom typeface (F37 Foundry), purple brand color, design philosophy
- [Phantom React SDK docs](https://docs.phantom.com/sdks/react-sdk) - Theme hex values: `#ab9ff2` (brand), `#1a1a1a` (bg), `#98979C` (secondary), `#ffffff` (text)
- [nuqs GitHub discussion #832](https://github.com/47ng/nuqs/discussions/832) - localStorage integration guidance: avoid bidirectional sync, URL as source of truth for shared links
- [Next.js official docs - Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - `next/font/google` Inter variable font setup

### Tertiary (LOW confidence)
- [npm: use-local-storage-state](https://www.npmjs.com/package/use-local-storage-state) - Version 19.x; SSR support via `useSyncExternalStore`; cross-tab sync; `isPersistent` API. Could not verify via Context7; recommend checking npm page during implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via Context7 official docs; versions confirmed current
- Architecture: HIGH - State pattern (localStorage + serialize on demand) verified with nuqs maintainer guidance and official createSerializer docs
- Pitfalls: HIGH - Tailwind v4/OKLCH migration, SSR hydration, nuqs adapter requirement all documented in official sources
- Theme/visual: MEDIUM - Phantom hex values from official SDK; OKLCH conversions are approximate and need visual tuning

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (stable ecosystem; no major releases expected)
