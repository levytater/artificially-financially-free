# Roadmap: Artificially Financially Free

## Overview

This roadmap delivers a Canadian Rent vs. Buy Calculator that combines deep opportunity cost math with accessible explanations and polished visualizations. The journey starts with project scaffolding and architecture patterns, builds the calculation engine in two focused phases (housing costs then investment/comparison), layers on input controls and state management, delivers results and charts as separate visual phases, adds educational content, and finishes with responsive design polish. Each phase delivers a coherent, testable capability. Lead capture is deferred to v2 per project decision.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Project Foundation & Architecture** - Next.js scaffolding with architecture patterns that support future shareable links and AI chatbot
- [ ] **Phase 2: Housing Cost Engine** - Pure TypeScript calculation functions for Canadian mortgage math, CMHC insurance, land transfer tax, and all homeowner costs
- [ ] **Phase 3: Investment & Comparison Engine** - Multi-account investment modeling (TFSA/RRSP/Non-reg), tax estimation, net worth comparison, and break-even analysis
- [ ] **Phase 4: Input Panel & State Management** - All calculator inputs with Zustand state, validation, collapsible sections, simple/advanced modes, and real-time recalculation
- [ ] **Phase 5: Verdict & Results Display** - Clear rent-vs-buy verdict, summary cards, detailed cost breakdown table, and side-by-side year comparison
- [ ] **Phase 6: Chart Visualizations** - Animated net worth, cash flow, and renter savings charts with performance-safe mobile rendering
- [ ] **Phase 7: Explanations & Education** - Helper tooltips, plain-English verdict explanations, chart annotations, and beginner guidance on account types
- [ ] **Phase 8: Responsive Design & Polish** - Mobile-first responsive layout and fintech-quality visual polish across all components

## Phase Details

### Phase 1: Project Foundation & Architecture
**Goal**: A running Next.js application with architecture patterns that ensure future features (shareable links, AI chatbot) can be added without re-architecting
**Depends on**: Nothing (first phase)
**Requirements**: ARCH-01, ARCH-02, ARCH-03
**Success Criteria** (what must be TRUE):
  1. Next.js application runs locally with TypeScript, Tailwind CSS, and shadcn/ui installed and configured
  2. All calculator inputs can be serialized to and deserialized from URL query parameters (verified with a round-trip test)
  3. Component architecture exposes props/APIs that allow external programmatic control of input values
  4. Tooltip and explainer content is stored as structured data objects (JSON/TypeScript records), not hardcoded in JSX
  5. Decimal.js is integrated and a sample financial calculation demonstrates correct precision (no floating-point drift)
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md -- Scaffold Next.js project, install dependencies, configure Phantom-inspired dark theme with providers
- [ ] 01-02-PLAN.md -- Architecture patterns (URL serialization, state management, content data) and shell layout with placeholder blocks

### Phase 2: Housing Cost Engine
**Goal**: All housing-side financial calculations produce correct results validated against bank calculators and government sources
**Depends on**: Phase 1
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-07, CALC-11
**Success Criteria** (what must be TRUE):
  1. Canadian mortgage payment calculation using semi-annual compounding matches RBC/TD mortgage calculator output within $1/month for representative scenarios
  2. CMHC insurance is correctly calculated across all tier boundaries (5%, 10%, 15%, 20% down) including amortization surcharge and provincial sales tax
  3. Provincial land transfer tax is correctly calculated for all provinces using marginal rate formulas, and first-time buyer rebates reduce tax correctly
  4. A complete homeowner cost projection (mortgage payments, property tax, maintenance, insurance, closing costs, appreciation) is produced year-by-year over a configurable time horizon
  5. All calculations use Decimal.js and produce identical results when run multiple times (no floating-point drift over 30-year projections)
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Investment & Comparison Engine
**Goal**: Renter investment growth is modeled across three account types with tax implications, and the full rent-vs-buy net worth comparison produces a clear winner with break-even year
**Depends on**: Phase 2
**Requirements**: CALC-08, CALC-09, CALC-10, CALC-12, CALC-13, CALC-14
**Success Criteria** (what must be TRUE):
  1. Renter monthly savings (difference between total buyer costs and rent) are calculated correctly and invested each month
  2. Investment returns are modeled separately for TFSA (tax-free growth), RRSP (tax-deferred, taxed on withdrawal), and Non-registered (taxed annually) accounts
  3. Federal and provincial income tax on investment gains is estimated using the user's annual income and province
  4. Year-by-year net worth comparison shows renter portfolio value vs buyer home equity minus remaining costs for every year of the time horizon
  5. Break-even year is identified as the first year where buying net worth exceeds renting net worth (or "never" if buying never wins)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Input Panel & State Management
**Goal**: Users can enter all calculator parameters through an intuitive input panel that validates input, manages state, and triggers real-time recalculation
**Depends on**: Phase 3
**Requirements**: INPUT-01, INPUT-02, INPUT-03, INPUT-04, INPUT-05, INPUT-06, INPUT-07, INPUT-08, INPUT-09, INPUT-10, INPUT-11, UX-04
**Success Criteria** (what must be TRUE):
  1. Province selector auto-adjusts land transfer tax formula, property tax defaults, first-time buyer rebate rules, and marginal tax rates when changed
  2. All core inputs (purchase price, down payment %, mortgage rate, amortization, monthly rent, time horizon, income) render with sensible Canadian defaults and validate correctly
  3. Master expected return dial sets baseline investment return across all three account types, and per-account fine-tuning inputs allow overrides
  4. Simple/Advanced mode toggle hides multi-account complexity in Simple mode and reveals full controls in Advanced mode
  5. Collapsible input sections show essential inputs by default and expand to reveal advanced parameters (maintenance %, selling costs, individual account returns)
  6. Calculation results update in real-time as user adjusts any input, with debounced performance (no lag or jank)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

### Phase 5: Verdict & Results Display
**Goal**: Users see a clear, understandable rent-vs-buy verdict with supporting summary metrics and detailed cost breakdowns
**Depends on**: Phase 4
**Requirements**: VIZ-01, VIZ-02, VIZ-07, VIZ-08
**Success Criteria** (what must be TRUE):
  1. A clear verdict ("Rent" or "Buy") is displayed with the dollar advantage amount and plain-English reasoning explaining why
  2. Summary cards show Rent final net worth, Buy final net worth, dollar and percentage advantage, and break-even year at a glance
  3. Detailed cost breakdown table shows initial costs, recurring annual costs, opportunity costs, and net proceeds at sale for both renter and buyer
  4. Side-by-side comparison panel lets the user select any year and see all key metrics for that specific point in time
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Chart Visualizations
**Goal**: Users can explore rent-vs-buy outcomes through animated, interactive charts that make the financial story visually intuitive
**Depends on**: Phase 5
**Requirements**: VIZ-03, VIZ-04, VIZ-05, VIZ-06, UX-03
**Success Criteria** (what must be TRUE):
  1. Animated net worth area chart shows rent and buy wealth trajectories over the full time horizon with smooth transitions when inputs change
  2. Cash flow bar chart shows annual costs for renter versus buyer across the time horizon
  3. Renter savings chart shows investment portfolio growth broken down by account type (TFSA/RRSP/Non-reg) over time
  4. "Mortgage Paid Off" marker appears on the chart timeline at the correct amortization end year
  5. Charts render without crashes or excessive lag on mobile devices, using data sampling for timelines longer than 10 years
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD
- [ ] 06-03: TBD

### Phase 7: Explanations & Education
**Goal**: Users without finance backgrounds can understand every input, every result, and the key financial concepts driving the analysis
**Depends on**: Phase 6
**Requirements**: EDU-01, EDU-02, EDU-03, EDU-04, EDU-05
**Success Criteria** (what must be TRUE):
  1. Every input field has a helper tooltip that explains what it means and why it matters for the rent-vs-buy decision
  2. The verdict includes a plain-English summary explaining the result, the key cost drivers, and what changes in inputs would flip the outcome
  3. Each chart has annotations explaining how to read the visualization and what the lines/bars/areas represent
  4. Pre-written explainers exist for key financial concepts: opportunity cost, CMHC insurance, semi-annual compounding, land transfer tax, and marginal tax rates
  5. Simple mode includes beginner guidance on TFSA, RRSP, and Non-registered accounts covering what they are, key differences, and how to check contribution room
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Responsive Design & Polish
**Goal**: The calculator looks and feels like a professional fintech product on any device from 320px mobile to widescreen desktop
**Depends on**: Phase 7
**Requirements**: UX-01, UX-02
**Success Criteria** (what must be TRUE):
  1. Layout adapts fluidly from 320px mobile to desktop with touch-friendly input controls (adequate tap targets, no hover-dependent interactions)
  2. Visual design achieves fintech-quality polish comparable to PWL Capital's calculator with consistent typography, spacing, color, and component styling
  3. All components (inputs, results cards, charts, tooltips, tables) render correctly and remain usable across mobile and desktop breakpoints
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Foundation & Architecture | 2/2 | Complete | 2026-02-25 |
| 2. Housing Cost Engine | 0/3 | Not started | - |
| 3. Investment & Comparison Engine | 0/3 | Not started | - |
| 4. Input Panel & State Management | 0/3 | Not started | - |
| 5. Verdict & Results Display | 0/2 | Not started | - |
| 6. Chart Visualizations | 0/3 | Not started | - |
| 7. Explanations & Education | 0/2 | Not started | - |
| 8. Responsive Design & Polish | 0/2 | Not started | - |
