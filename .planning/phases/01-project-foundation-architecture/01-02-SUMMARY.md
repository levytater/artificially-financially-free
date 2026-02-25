---
phase: 01-project-foundation-architecture
plan: 02
subsystem: architecture
tags: [nuqs, decimal.js, react-context, url-serialization, localStorage, typescript, content-data]

# Dependency graph
requires:
  - phase: 01-project-foundation-architecture (plan 01)
    provides: Next.js scaffold with dark theme, shadcn/ui, NuqsAdapter, Inter font
provides:
  - CalculatorState type and CalculatorContextValue interface
  - calculatorDefaults with sensible Canadian defaults
  - nuqs parsers and URL serializer with clearOnDefault and short URL keys
  - Decimal.js configured for financial precision with effectiveMonthlyRate helper
  - useCalculatorState hook (localStorage persistence, SSR-safe)
  - CalculatorProvider React Context for externally controllable state
  - useShareUrl hook for share URL generation
  - Structured content data files (tooltips, explainers, verdict text)
  - Shell layout with sidebar and 8 labeled placeholder blocks
affects: [phase-02-housing-cost-engine, phase-03-investment-engine, phase-04-input-panel, phase-05-verdict-results, phase-06-chart-visualizations, phase-07-explanations]

# Tech tracking
tech-stack:
  added: [decimal.js, use-local-storage-state, nuqs createSerializer]
  patterns: [React Context for state, localStorage persistence, URL serialization on demand, TypeScript content objects with markdown, placeholder-block wireframe pattern]

key-files:
  created:
    - src/types/calculator.ts
    - src/lib/defaults.ts
    - src/lib/parsers.ts
    - src/lib/serializer.ts
    - src/lib/decimal.ts
    - src/hooks/use-calculator-state.ts
    - src/hooks/use-share-url.ts
    - src/providers/calculator-provider.tsx
    - src/content/tooltips.ts
    - src/content/explainers.ts
    - src/content/verdict-text.ts
    - src/components/layout/placeholder-block.tsx
    - src/components/layout/app-sidebar.tsx
    - src/components/layout/main-content.tsx
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx

key-decisions:
  - "React Context over Zustand for calculator state -- sufficient for single-page app with <20 inputs; clean upgrade path"
  - "localStorage persistence via use-local-storage-state -- SSR-safe with cross-tab sync"
  - "nuqs createSerializer with clearOnDefault for share URLs -- only non-default values in URL"
  - "TypeScript objects with markdown strings for content data -- not JSON, not hardcoded JSX"
  - "Custom flex layout for sidebar instead of shadcn/ui Sidebar component -- simpler for calculator input panel pattern"

patterns-established:
  - "Content data pattern: TypeScript Record objects in src/content/ with markdown strings"
  - "State architecture: React Context -> useCalculatorState hook -> localStorage"
  - "URL serialization: nuqs parsers shared between serializer and future URL ingestion"
  - "PlaceholderBlock component for wireframe scaffolding during development"
  - "Provider hierarchy: ThemeProvider -> NuqsAdapter -> CalculatorProvider"

requirements-completed: [ARCH-01, ARCH-02, ARCH-03]

# Metrics
duration: 4min
completed: 2026-02-25
---

# Phase 1 Plan 02: Architecture & Shell Layout Summary

**URL-serializable calculator state with React Context, Decimal.js financial precision, structured content data (tooltips/explainers/verdict), and branded shell layout with sidebar + 7 labeled placeholder blocks**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-25T04:47:08Z
- **Completed:** 2026-02-25T04:51:14Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Complete calculator state architecture: CalculatorState type with 9 inputs, React Context provider, localStorage persistence, partial-update setState
- URL serialization via nuqs with clearOnDefault and human-readable short URL keys (e.g., ?price=750000&province=BC)
- Decimal.js configured for financial precision with Canadian semi-annual compounding helper
- Structured content data: 9 tooltip entries, 5 explainer articles (CMHC, compounding, opportunity cost, LTT, tax rates), and verdict templates
- Shell layout with brand header, sidebar (Input Panel placeholder), and main content area (7 labeled placeholder blocks)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create type definitions, state management, URL serialization, Decimal.js config, and content data files** - `72a8848` (feat)
2. **Task 2: Build shell layout with sidebar, main content area, and labeled placeholder blocks** - `8fe59f4` (feat)

## Files Created/Modified
- `src/types/calculator.ts` - CalculatorState and CalculatorContextValue interfaces
- `src/lib/defaults.ts` - Sensible Canadian default values for all calculator inputs
- `src/lib/parsers.ts` - nuqs type-safe parser definitions with short URL keys
- `src/lib/serializer.ts` - createSerializer instance for share URL generation
- `src/lib/decimal.ts` - Configured Decimal.js with effectiveMonthlyRate and formatCurrency helpers
- `src/hooks/use-calculator-state.ts` - localStorage-persisted state hook (SSR-safe)
- `src/hooks/use-share-url.ts` - Share URL generation and clipboard copy hook
- `src/providers/calculator-provider.tsx` - React Context provider with useCalculator hook
- `src/content/tooltips.ts` - Tooltip content for all 9 inputs with markdown descriptions
- `src/content/explainers.ts` - 5 explainer articles with markdown body text
- `src/content/verdict-text.ts` - Verdict templates with {{placeholder}} syntax
- `src/components/layout/placeholder-block.tsx` - Wireframe/blueprint-style placeholder component
- `src/components/layout/app-sidebar.tsx` - Sidebar container for future input panel
- `src/components/layout/main-content.tsx` - Main content area with 7 labeled placeholders
- `src/app/layout.tsx` - Added CalculatorProvider to provider hierarchy
- `src/app/page.tsx` - Full shell layout with header, sidebar, and main content

## Decisions Made
- Used React Context (not Zustand) for calculator state -- sufficient for v1's single-page architecture with fewer than 20 inputs
- Used custom flex layout for sidebar rather than shadcn/ui Sidebar component -- simpler and more appropriate for a calculator input panel vs navigation sidebar
- Tooltip descriptions include Canadian-specific financial context (CMHC thresholds, FHSA limits, provincial LTT variations)
- Explainer content covers the 5 most important financial concepts for the rent-vs-buy comparison
- Verdict templates use {{placeholder}} syntax that Phase 5 will fill with computed values

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All architecture requirements (ARCH-01, ARCH-02, ARCH-03) are complete
- Phase 2 can import CalculatorState type and calculatorDefaults for housing cost calculations
- Phase 2 can use Decimal.js and effectiveMonthlyRate for mortgage payment math
- Phase 4 can build input components that read/write via useCalculator() hook
- Shell layout placeholder blocks provide clear visual targets for future phases

## Self-Check: PASSED

- All 16 files verified present on disk
- Commit 72a8848 (Task 1) verified in git log
- Commit 8fe59f4 (Task 2) verified in git log
- Build succeeds with zero TypeScript errors

---
*Phase: 01-project-foundation-architecture*
*Completed: 2026-02-25*
