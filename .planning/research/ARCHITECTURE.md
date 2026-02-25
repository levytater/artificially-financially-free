# Architecture Research

**Domain:** Financial Calculator Platform (Canadian Rent vs Buy)
**Researched:** 2026-02-24
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Input     │  │   Chart     │  │  Results    │          │
│  │  Controls   │  │   Visuals   │  │   Cards     │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
├─────────┴────────────────┴────────────────┴──────────────────┤
│                    State Management                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐    │
│  │   Calculator State (inputs, results, UI state)        │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                      │
├───────────────────────┴───────────────────────────────────────┤
│                    Calculation Engine                        │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Mortgage  │  │ Tax Rules  │  │ Investment │            │
│  │   Math     │  │  (CMHC,    │  │  Returns   │            │
│  │            │  │   LTT)     │  │            │            │
│  └────────────┘  └────────────┘  └────────────┘            │
├─────────────────────────────────────────────────────────────┤
│                   API / Serverless Layer                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Email        │  │ PDF          │  │ Save/Share   │       │
│  │ Capture      │  │ Generation   │  │ Links        │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Input Controls | Gather user parameters, validate ranges, provide tooltips | Client components with controlled inputs, React Hook Form for validation |
| Chart Visuals | Render interactive financial charts with animations | Recharts/Chart.js with React wrappers, animated on state changes |
| Results Cards | Display net worth comparison, verdict, break-even | Static presentational components consuming calculator state |
| State Management | Coordinate global calculator state, trigger recalculations | Zustand store or Context API with reducer pattern |
| Calculation Engine | Pure functions for mortgage math, tax calculations, projections | TypeScript classes/functions in `/lib` or `/utils`, using Decimal.js for precision |
| Email Capture | Collect user emails, send to mailing list | Next.js API route → Resend/ConvertKit integration |
| PDF Generation | Create branded PDF reports from calculation results | Client-side with jsPDF or server-side with react-pdf |
| Save/Share Links | Generate unique URLs for saved calculator sessions | API route writing to KV store (Vercel KV) or URL params for simple cases |

## Recommended Project Structure

```
src/
├── app/                    # Next.js App Router (routing + pages)
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Homepage/calculator page
│   ├── api/                # API routes
│   │   ├── email/route.ts  # Email capture endpoint
│   │   ├── pdf/route.ts    # PDF generation endpoint
│   │   └── share/route.ts  # Save/share link endpoint
│   └── globals.css         # Global Tailwind styles
├── components/             # React components
│   ├── ui/                 # Reusable UI primitives (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── slider.tsx
│   │   ├── card.tsx
│   │   └── tooltip.tsx
│   ├── calculator/         # Calculator-specific components
│   │   ├── InputPanel.tsx       # Collapsible input sections
│   │   ├── ResultsCards.tsx     # Summary cards (verdict, NW, break-even)
│   │   ├── NetWorthChart.tsx    # Animated area chart
│   │   ├── CashFlowChart.tsx    # Bar chart
│   │   ├── SavingsChart.tsx     # Renter portfolio growth
│   │   ├── CostBreakdown.tsx    # Detailed table
│   │   └── EmailCaptureForm.tsx # Lead capture modal
│   └── layout/             # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                    # Core business logic
│   ├── calculation-engine/ # Calculation logic (pure functions)
│   │   ├── mortgage.ts     # Mortgage calculations
│   │   ├── taxes.ts        # CMHC, LTT, property tax
│   │   ├── investment.ts   # Opportunity cost modeling
│   │   ├── inflation.ts    # Inflation adjustments
│   │   └── comparator.ts   # Net worth comparison logic
│   ├── constants/          # Canadian tax rules, default values
│   │   ├── provinces.ts    # LTT rates, property tax defaults
│   │   └── defaults.ts     # Calculator default inputs
│   └── validators/         # Input validation schemas
│       └── calculator.ts   # Zod schemas for inputs
├── store/                  # State management
│   └── calculatorStore.ts  # Zustand store for calculator state
├── hooks/                  # Custom React hooks
│   ├── useCalculator.ts    # Main calculator logic + debouncing
│   ├── useLocalStorage.ts  # Persist inputs to localStorage
│   └── useMediaQuery.ts    # Responsive breakpoint detection
├── utils/                  # Utility functions
│   ├── formatters.ts       # Currency, percentage formatting
│   └── pdf.ts              # PDF generation helpers
└── types/                  # TypeScript type definitions
    └── calculator.ts       # Input/output types
```

### Structure Rationale

- **`app/`**: File-based routing with App Router. Pages are server components by default; only client-interactive pieces marked `"use client"`.
- **`components/ui/`**: shadcn/ui primitives installed here, ensuring consistency across UI. Reusable, accessible, themeable.
- **`components/calculator/`**: Feature-specific components. Each chart/input panel is isolated for maintainability.
- **`lib/calculation-engine/`**: Pure TypeScript functions with no React dependencies. Testable, portable, zero coupling to UI. Uses Decimal.js for financial precision.
- **`lib/constants/`**: All Canadian tax rules, provincial LTT rates, CMHC tiers, defaults. Single source of truth.
- **`store/`**: Zustand store centralizes calculator state (inputs, results, UI state like collapsed panels). Lightweight, performant, no Context API re-render issues.
- **`hooks/`**: Custom hooks abstract complex logic (debounced calculations, localStorage persistence). Keeps components clean.
- **`utils/`**: Helper functions for formatting (currency, percentages), PDF generation setup.
- **`types/`**: Centralized TypeScript types. Calculator inputs/outputs typed once, used everywhere.

**Separation of concerns:** UI components (`components/`) consume state (`store/`) and trigger calculations (`lib/`) via hooks (`hooks/`). Calculation logic has zero awareness of React.

## Architectural Patterns

### Pattern 1: Calculation Engine Separation

**What:** Isolate all calculation logic into pure TypeScript functions/classes with no React dependencies. Treat the calculation engine as a standalone module.

**When to use:** Always, for any financial calculator. Ensures testability, reusability, and maintainability.

**Trade-offs:**
- **Pros:** Easy to unit test (no React testing library needed), portable to other frameworks, debugging is trivial, can run calculations server-side or client-side.
- **Cons:** Requires discipline to avoid mixing UI and logic. Slightly more files, but worth it.

**Example:**
```typescript
// lib/calculation-engine/mortgage.ts
import Decimal from 'decimal.js';

export interface MortgageParams {
  principal: number;
  annualRate: number;
  amortizationYears: number;
}

export function calculateMonthlyPayment(params: MortgageParams): number {
  const { principal, annualRate, amortizationYears } = params;

  // Canadian mortgages compound semi-annually
  const semiAnnualRate = new Decimal(annualRate).div(200);
  const monthlyRate = new Decimal(1).plus(semiAnnualRate).pow(1/6).minus(1);

  const numPayments = amortizationYears * 12;
  const payment = new Decimal(principal)
    .times(monthlyRate)
    .div(new Decimal(1).minus(new Decimal(1).plus(monthlyRate).pow(-numPayments)));

  return payment.toNumber();
}

// ✅ Pure function, testable, no React
// ✅ Decimal.js prevents floating-point errors
// ✅ Can be imported by components, API routes, or tests
```

### Pattern 2: Debounced Real-Time Calculations

**What:** Calculate results as the user types, but debounce expensive calculations to avoid performance issues.

**When to use:** Financial calculators with complex math and interactive charts that update on every input change.

**Trade-offs:**
- **Pros:** Instant feedback, no "Calculate" button needed, smooth UX.
- **Cons:** Can drain performance if calculations are expensive (mitigated by debouncing and memoization).

**Example:**
```typescript
// hooks/useCalculator.ts
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { calculateComparison } from '@/lib/calculation-engine/comparator';
import { useCalculatorStore } from '@/store/calculatorStore';

export function useCalculator() {
  const { inputs } = useCalculatorStore();

  // Debounce inputs to prevent excessive recalculations
  const debouncedInputs = useDebounce(inputs, 300);

  // Memoize expensive calculation
  const results = useMemo(() => {
    return calculateComparison(debouncedInputs);
  }, [debouncedInputs]);

  return { results };
}

// ✅ 300ms debounce prevents calculation spam
// ✅ useMemo ensures recalculation only when inputs change
// ✅ UI stays responsive even with heavy math
```

### Pattern 3: Hybrid Client/Server Components

**What:** Use Next.js App Router's server components for static/metadata-heavy content, client components for interactivity.

**When to use:** Always with App Router. Server components for layout/static text, client components for inputs/charts.

**Trade-offs:**
- **Pros:** Reduced JavaScript bundle size, faster initial page load, SEO-friendly.
- **Cons:** Must be intentional about `"use client"` boundaries.

**Example:**
```typescript
// app/page.tsx (Server Component by default)
import { Metadata } from 'next';
import CalculatorWrapper from '@/components/calculator/CalculatorWrapper';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator | Artificially Financially Free',
  description: 'Compare renting vs buying with real opportunity cost math.',
};

export default function HomePage() {
  return (
    <main>
      <h1>Rent vs Buy Calculator</h1>
      {/* Server component renders this heading without client JS */}
      <CalculatorWrapper />
    </main>
  );
}

// components/calculator/CalculatorWrapper.tsx (Client Component)
'use client';

import { useState } from 'react';
import InputPanel from './InputPanel';
import NetWorthChart from './NetWorthChart';

export default function CalculatorWrapper() {
  // All interactivity lives here
  return (
    <div>
      <InputPanel />
      <NetWorthChart />
    </div>
  );
}

// ✅ Server component = no JS for static content
// ✅ Client component boundary pushed to leaf nodes
// ✅ Smaller bundle, faster page load
```

### Pattern 4: Zustand for Lightweight State

**What:** Use Zustand instead of Context API for global calculator state to avoid re-render cascades.

**When to use:** Financial calculators with many inputs and real-time chart updates.

**Trade-offs:**
- **Pros:** No re-render issues like Context API, simple API, built-in persistence support, TypeScript-friendly.
- **Cons:** External dependency (small, ~1KB gzipped).

**Example:**
```typescript
// store/calculatorStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CalculatorState {
  inputs: {
    purchasePrice: number;
    downPaymentPercent: number;
    mortgageRate: number;
    // ... more inputs
  };
  updateInput: (key: string, value: number) => void;
  resetInputs: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      inputs: {
        purchasePrice: 500000,
        downPaymentPercent: 10,
        mortgageRate: 5.5,
      },
      updateInput: (key, value) =>
        set((state) => ({
          inputs: { ...state.inputs, [key]: value },
        })),
      resetInputs: () =>
        set({
          inputs: { purchasePrice: 500000, downPaymentPercent: 10, mortgageRate: 5.5 },
        }),
    }),
    {
      name: 'calculator-inputs', // localStorage key
    }
  )
);

// ✅ Auto-persists to localStorage
// ✅ No re-render issues
// ✅ Simple API: const { inputs, updateInput } = useCalculatorStore();
```

## Data Flow

### Request Flow (Client-Side Calculation)

```
[User Types in Input]
    ↓
[Input Component] → updateInput(key, value)
    ↓
[Zustand Store] → state.inputs updated
    ↓
[useCalculator Hook] → debounce 300ms → useMemo recalculates
    ↓
[Calculation Engine] → pure functions (mortgage.ts, taxes.ts, investment.ts)
    ↓
[Results Object] → { rentNW, buyNW, verdict, breakEven, ... }
    ↓
[Chart Components] → re-render with new data, trigger animations
```

### State Management Flow

```
┌─────────────────┐
│  Zustand Store  │
└────────┬────────┘
         │
         ├─► inputs (user-controlled values)
         ├─► results (calculated values)
         └─► uiState (collapsed panels, dark mode, etc.)
              ↓
    ┌────────┴────────┐
    │   useCalculator  │  (hook)
    └────────┬────────┘
             │
    ┌────────┴────────────────────────┐
    │  Calculation Engine (pure fns)   │
    └─────────────────────────────────┘
```

### Key Data Flows

1. **User Input → Chart Update:**
   - User changes slider → `updateInput()` → Zustand store updates → `useCalculator` debounces → `useMemo` recalculates → results propagate to chart components → Recharts animates transition.

2. **Email Capture → PDF Generation:**
   - User clicks "Save Results" → modal opens → user enters email → API route `/api/email` triggered → validates email → generates PDF server-side (Puppeteer) or client-side (jsPDF) → sends PDF via Resend → saves email to ConvertKit → returns shareable link.

3. **Save/Share Link:**
   - User clicks "Share" → inputs serialized to JSON → API route `/api/share` stores in Vercel KV → returns unique ID → shareable URL: `yoursite.com?session=abc123` → on page load, check query param → hydrate Zustand store from KV.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Client-side calculations only, no database needed, Vercel free tier handles API routes, localStorage for persistence |
| 1k-100k users | Add Vercel KV for shareable links, switch to Resend Pro for email delivery, optimize bundle size (lazy load PDF libs, code-split charts) |
| 100k+ users | Consider edge functions for PDF generation (move to server-side to reduce client load), add CDN caching for static assets, monitor Core Web Vitals, upgrade Vercel plan for higher API route limits |

### Scaling Priorities

1. **First bottleneck:** Client-side PDF generation. Solution: Move to server-side with Puppeteer/react-pdf or edge functions to avoid blocking UI.
2. **Second bottleneck:** Chart rendering performance with large datasets (30+ year projections). Solution: Virtualize chart data points, reduce granularity (annual instead of monthly), or lazy-load charts below fold.

## Anti-Patterns

### Anti-Pattern 1: Calculation Logic in Components

**What people do:** Write calculation logic directly inside React components with `useState` and inline functions.

```typescript
// ❌ BAD: Calculation logic mixed with UI
function Calculator() {
  const [payment, setPayment] = useState(0);

  useEffect(() => {
    // Complex mortgage math inside component
    const monthlyRate = (annualRate / 100) / 12;
    const numPayments = years * 12;
    const pmt = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numPayments)));
    setPayment(pmt);
  }, [principal, annualRate, years]);

  return <div>{payment}</div>;
}
```

**Why it's wrong:** Untestable (must render component to test math), non-portable (can't reuse in API routes or other frameworks), floating-point errors (using native `Math`), hard to debug.

**Do this instead:**
```typescript
// ✅ GOOD: Pure function in lib/
import { calculateMonthlyPayment } from '@/lib/calculation-engine/mortgage';

function Calculator() {
  const payment = useMemo(
    () => calculateMonthlyPayment({ principal, annualRate, years }),
    [principal, annualRate, years]
  );

  return <div>{payment}</div>;
}
```

### Anti-Pattern 2: Using Context API for Frequent Updates

**What people do:** Use React Context for calculator state that updates on every keystroke.

**Why it's wrong:** Context API re-renders every consumer on every state change. If you have 10+ input fields and 5+ charts all consuming the same context, every keystroke triggers 15+ re-renders. This kills performance.

**Do this instead:** Use Zustand, which selectively re-renders only components that consume the changed slice of state. Zustand's `useCalculatorStore((state) => state.inputs.purchasePrice)` only re-renders when `purchasePrice` changes, not on unrelated updates.

### Anti-Pattern 3: Generating PDFs in Next.js Middleware

**What people do:** Attempt to generate PDFs synchronously in middleware or server components.

**Why it's wrong:** Middleware has strict execution time limits (Edge Runtime ~50ms), and PDF generation takes 1-10 seconds with Puppeteer. This causes timeouts.

**Do this instead:** Use API routes with increased timeout limits (60s on Vercel Pro), or move to client-side PDF generation with jsPDF for simple reports.

### Anti-Pattern 4: Storing Financial Data in Cookies

**What people do:** Store calculator inputs or results in cookies to persist across sessions.

**Why it's wrong:** Cookies have a 4KB size limit, are sent with every request (bloating headers), and are less secure than localStorage for client-side data. Financial data should not be sent to the server unless necessary.

**Do this instead:** Use localStorage for input persistence, Zustand's `persist` middleware, or Vercel KV for shareable links.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Resend | API route → Resend SDK → send email | Use `/api/email` route, keep API key in env vars, ~100ms latency |
| ConvertKit | API route → POST to ConvertKit API → add subscriber | Use form ID from env, handle double opt-in flow |
| Vercel KV | API route → KV.set(id, data) → return ID | For shareable links, serialize inputs to JSON, 30-day TTL |
| Puppeteer (PDF) | API route → puppeteer-core + @sparticuz/chromium → generate PDF | 2-5s generation time, use Vercel Pro for 60s timeout |
| jsPDF (PDF) | Client-side → dynamic import jsPDF → generate PDF in browser | Faster (instant), but less powerful than Puppeteer |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| UI ↔ Store | Zustand hooks (`useCalculatorStore`) | Components consume state via hooks, update via actions |
| Store ↔ Calculation Engine | Direct function calls | Store calls pure functions in `lib/calculation-engine/` |
| Client ↔ API Routes | Fetch requests | Email capture, PDF generation, save/share links |
| API Route ↔ External Service | SDK or HTTP fetch | Resend SDK for emails, direct fetch for ConvertKit |

## Build Order Implications

**Suggested build order based on dependencies:**

1. **Calculation Engine First** (`lib/calculation-engine/`)
   - Build and test pure functions independently
   - No UI dependencies, fully testable
   - Can be developed/validated before any React code

2. **State Management** (`store/calculatorStore.ts`)
   - Set up Zustand store with input schema
   - Integrate with calculation engine
   - Add localStorage persistence

3. **UI Components** (`components/calculator/`)
   - Start with `InputPanel.tsx` to test state updates
   - Add `ResultsCards.tsx` to display calculated results
   - Build charts last (most complex, depend on stable data)

4. **Charts** (`NetWorthChart.tsx`, etc.)
   - Choose library (Recharts recommended)
   - Implement animations
   - Optimize performance with memoization

5. **API Routes** (`app/api/`)
   - Email capture first (simplest)
   - Shareable links next (requires KV setup)
   - PDF generation last (most complex, longest integration)

6. **Email/PDF Features**
   - Integrate Resend for transactional emails
   - Build PDF template
   - Test end-to-end flow

**Why this order:** Calculation engine has zero dependencies, so build it first and validate math. State management depends on calculation schema. UI depends on state. Charts depend on stable UI. API routes can be built in parallel once core calculator works. This minimizes rework and allows incremental testing.

## Sources

- [I Built a Financial Tools Platform with Next.js — Here's What I Learned - DEV Community](https://dev.to/statementextract/i-built-a-financial-tools-platform-with-nextjs-heres-what-i-learned-178j)
- [How I Built 3 Professional Calculators in One Weekend with Next.js 14 - DEV Community](https://dev.to/ro_lax/how-i-built-3-professional-calculators-in-one-weekend-with-nextjs-14-1904)
- [How I Built a Mortgage Calculator That Actually Helps People Save $200K+ (Next.js + Real Math) - DEV Community](https://dev.to/wernerpj_purens_jaco/how-i-built-a-mortgage-calculator-that-actually-helps-people-save-200k-nextjs-real-math-44)
- [The Complete Guide to Scalable Next.js Architecture - DEV Community](https://dev.to/melvinprince/the-complete-guide-to-scalable-nextjs-architecture-39o0)
- [How to structure scalable Next.js project architecture - LogRocket Blog](https://blog.logrocket.com/structure-scalable-next-js-project-architecture/)
- [Getting Started: Server and Client Components | Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Getting Started: Project Structure | Next.js](https://nextjs.org/docs/app/getting-started/project-structure)
- [State Management with Next.js App Router](https://www.pronextjs.dev/tutorials/state-management)
- [React State Management in 2025: Context API vs Zustand - DEV Community](https://dev.to/cristiansifuentes/react-state-management-in-2025-context-api-vs-zustand-385m)
- [The Top 5 React Chart Libraries to Know in 2026 for Modern Dashboards | Syncfusion Blogs](https://www.syncfusion.com/blogs/post/top-5-react-chart-libraries)
- [Top 5 React Stock Chart Libraries for 2026 | Syncfusion Blogs](https://www.syncfusion.com/blogs/post/top-5-react-stock-charts-in-2026)
- [Send emails with Next.js - Resend](https://resend.com/docs/send-with-nextjs)
- [How to Send Emails in Next.js (App Router, 2026) | Sequenzy](https://www.sequenzy.com/blog/send-emails-nextjs)
- [Newsletter Subscriptions with NextJS & ConvertKit](https://www.tybarho.com/articles/nextjs-convertkit-blog-subscriber-form)
- [JS Pdf Generation libraries comparison](https://dmitriiboikov.com/posts/2025/01/pdf-generation-comarison/)
- [6 Open-Source PDF generation and modification libraries every React dev should know in 2025 - DEV Community](https://dev.to/ansonch/6-open-source-pdf-generation-and-modification-libraries-every-react-dev-should-know-in-2025-13g0)

---
*Architecture research for: Canadian Financial Calculator Platform*
*Researched: 2026-02-24*
