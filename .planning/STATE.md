# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-24)

**Core value:** Canadians can see exactly how renting and investing the difference compares to buying -- with real opportunity cost math -- and understand the results without a finance degree.
**Current focus:** Phase 2: Housing Cost Engine

## Current Position

Phase: 2 of 8 (Housing Cost Engine) -- COMPLETE
Plan: 4 of 4 in current phase (all plans complete)
Status: Phase Complete
Last activity: 2026-02-25 -- Completed Plan 02-04 (Housing projection orchestrator)

Progress: [███░░░░░░░] 28%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 4.3 min
- Total execution time: 0.43 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 2 | 11 min | 5.5 min |
| 02 | 4 | 15 min | 3.8 min |

**Recent Trend:**
- Last 5 plans: 4 min, 4 min, 4 min, 4 min, 3 min
- Trend: stable/improving

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Multi-account investment model (TFSA/RRSP/Non-reg) confirmed for v1
- Lead capture deferred to v2; calculator validates first
- Architecture must support URL-serialized state for future shareable links
- Component APIs must support external control for future AI chatbot
- Decimal.js required for all financial calculations (floating-point risk)
- Dark-first theme in :root block (no .dark selector) since Phantom-inspired design is dark-only for v1
- Inter font as sole font family; display font deferred to Phase 8
- NuqsAdapter added from day one for future URL serialization support
- React Context over Zustand for calculator state -- sufficient for single-page with <20 inputs
- localStorage persistence via use-local-storage-state -- SSR-safe with cross-tab sync
- nuqs createSerializer with clearOnDefault for share URLs -- only non-default values in URL
- TypeScript objects with markdown strings for content data -- not JSON, not hardcoded JSX
- Custom flex sidebar layout instead of shadcn/ui Sidebar component -- simpler for input panel
- Vitest installed for test infrastructure in Phase 2
- All rate inputs as percentages (3.0 for 3%), converted to decimals inside calculation functions
- AB/SK modeled as 0% LTT brackets; registration fee logic deferred to LTT calculation function
- PE FTHB uses Infinity for maxRebate/fullExemptionUpTo (unconditional full exemption)
- Mortgage test expected values verified from formula (plan pre-computed values had minor inaccuracies)
- YearlyMortgageSummary interface co-located in mortgage.ts rather than housing types file
- CMHC validation errors thrown as exceptions rather than silent return values
- BC FTHB maxRebate corrected from $8,000 to Infinity (full PTT exemption, not capped)
- LttResult interface added to housing.ts for typed LTT calculation results
- Generic calculateMarginalTax designed for Phase 3 income tax reuse
- Property tax and maintenance use start-of-year home value assessment (purchase price for year 1)
- Post-amortization years set mortgage costs to $0, only ongoing costs apply
- Housing projection defaults resolved from province data and closing-cost-defaults

### Pending Todos

None yet.

### Blockers/Concerns

- RESOLVED: @houski/canadian-financial-calculations not needed -- hand-coded typed constants are more maintainable (decided during 02 research)
- RESOLVED: Toronto municipal LTT not included in v1 -- province-level only; city-level LTT deferred to future version
- RESOLVED: Provincial sales tax on CMHC premium rates verified -- ON 8%, QC 9%, SK 6% (in cmhc-rates.ts)

## Session Continuity

Last session: 2026-02-25
Stopped at: Completed 02-04-PLAN.md (Housing projection orchestrator -- Phase 2 complete)
Resume file: None
