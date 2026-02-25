# Requirements: Artificially Financially Free

**Defined:** 2026-02-24
**Core Value:** Canadians can see exactly how renting and investing the difference compares to buying -- with real opportunity cost math -- and understand the results without a finance degree.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Calculator Engine

- [ ] **CALC-01**: Mortgage payment calculated using Canadian semi-annual compounding (not US monthly)
- [ ] **CALC-02**: CMHC insurance calculated by LTV tier (2.80%-4.00%) when down payment < 20%, including amortization surcharge and provincial sales tax
- [ ] **CALC-03**: Provincial land transfer tax auto-calculated using province-specific marginal rate formulas for all provinces
- [ ] **CALC-04**: Property tax calculated as annual percentage of property value with province-level defaults and user override
- [ ] **CALC-05**: Closing costs calculated for buying (legal fees, home inspection, LTT) and selling (realtor commission, legal fees)
- [ ] **CALC-06**: Home value appreciation compounded annually over the full time horizon
- [ ] **CALC-07**: Rent increase compounded at user-specified rate (CPI default) over the full time horizon
- [ ] **CALC-08**: Break-even year identified as the first year where buying net worth exceeds renting net worth
- [ ] **CALC-09**: Renter's monthly savings (difference between buyer costs and rent) invested and compounded over time
- [ ] **CALC-10**: Year-by-year net worth comparison produced for both renter (investment portfolio) and buyer (home equity minus costs)
- [ ] **CALC-11**: First-time home buyer land transfer tax rebate applied when checkbox is selected, using province-specific rebate rules
- [ ] **CALC-12**: Investment returns modeled across three account types: TFSA (tax-free growth), RRSP (tax-deferred, taxed on withdrawal), and Non-registered (taxed annually on gains)
- [ ] **CALC-13**: Federal and provincial income tax estimated on investment gains using user's annual income and province
- [ ] **CALC-14**: Inflation adjustment applied to normalize future dollar values to present purchasing power

### Inputs & Controls

- [ ] **INPUT-01**: Province selector that auto-adjusts land transfer tax formula, property tax defaults, first-time buyer rebate, and marginal tax rates
- [ ] **INPUT-02**: Purchase price, down payment percentage, mortgage rate, and amortization period inputs with sensible Canadian defaults
- [ ] **INPUT-03**: Monthly rent input with currency formatting
- [ ] **INPUT-04**: Time horizon slider ranging from 1 to 30 years
- [ ] **INPUT-05**: First-time home buyer checkbox that triggers LTT rebate calculation and HBP eligibility note
- [ ] **INPUT-06**: Adjustable home appreciation rate, rent increase rate, and inflation rate with historical Canadian defaults
- [ ] **INPUT-07**: Master expected return dial that sets baseline investment return across all three account types
- [ ] **INPUT-08**: Per-account return fine-tuning inputs (TFSA, RRSP, Non-registered) for users with different risk profiles per account
- [ ] **INPUT-09**: Annual gross income input used for federal and provincial tax estimation on investment gains
- [ ] **INPUT-10**: Simple/Advanced mode toggle where Simple hides multi-account complexity and makes reasonable allocation assumptions
- [ ] **INPUT-11**: Collapsible input sections with sensible defaults visible and advanced inputs (maintenance %, selling costs, individual account returns) expandable

### Results & Visualizations

- [ ] **VIZ-01**: Clear verdict displaying "Rent" or "Buy" with dollar advantage amount and plain-English reasoning for the recommendation
- [ ] **VIZ-02**: Summary cards showing Rent final net worth, Buy final net worth, dollar and percentage advantage, and break-even year
- [ ] **VIZ-03**: Animated net worth area chart comparing rent and buy wealth trajectories over the full time horizon
- [ ] **VIZ-04**: Cash flow bar chart showing annual costs for renter versus buyer across the time horizon
- [ ] **VIZ-05**: Renter savings chart showing investment portfolio growth across account types over time
- [ ] **VIZ-06**: "Mortgage Paid Off" marker displayed on chart timeline at the amortization end year
- [ ] **VIZ-07**: Detailed cost breakdown table showing initial costs, recurring annual costs, opportunity costs, and net proceeds at sale
- [ ] **VIZ-08**: Side-by-side comparison panel at a user-selected year showing all key metrics for that point in time

### Explanations & Education

- [ ] **EDU-01**: Helper tooltip on every input field explaining what it means and why it matters for the rent-vs-buy decision
- [ ] **EDU-02**: Plain-English verdict summary explaining the result, key cost drivers, and what would change the outcome
- [ ] **EDU-03**: Chart annotations explaining how to read each visualization and what the lines/bars represent
- [ ] **EDU-04**: Pre-written explainers for key financial concepts (opportunity cost, CMHC insurance, semi-annual compounding, land transfer tax, marginal tax rates)
- [ ] **EDU-05**: Simple mode includes beginner guidance on TFSA, RRSP, and Non-registered accounts -- what they are, key differences, and how to check contribution room

### Design & UX

- [ ] **UX-01**: Responsive layout that works on mobile (320px+) and desktop with touch-friendly input controls
- [ ] **UX-02**: Clean, modern fintech UI with visual polish comparable to PWL Capital's calculator
- [ ] **UX-03**: Smooth chart animations when inputs change, with performance-safe degradation on mobile
- [ ] **UX-04**: Real-time calculation updates triggered as user adjusts any input (debounced for performance)

### Architecture (v2 Readiness)

- [x] **ARCH-01**: All calculator inputs serializable to URL query parameters so shareable links can be added without re-architecting state management
- [ ] **ARCH-02**: Component architecture supports external programmatic control of inputs (for future AI chatbot integration)
- [ ] **ARCH-03**: Tooltip and explainer content stored as structured data objects (not hardcoded JSX) for future AI context consumption

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Lead Capture & Sharing

- **LEAD-01**: "Save Results" flow requiring email to generate saved analysis
- **LEAD-02**: Branded PDF report emailed to user with full analysis, charts, and assumptions
- **LEAD-03**: Shareable link with unique URL that restores all calculator inputs and results
- **LEAD-04**: Email captures feed into CRM/mailing list (ConvertKit/Kit integration)

### UX Enhancements

- **UX-05**: Dark mode toggle with light/dark theme support
- **UX-06**: Toronto municipal land transfer tax (additional LTT for Toronto buyers)
- **UX-07**: HBP (Home Buyer Plan) RRSP withdrawal modeling for first-time buyers
- **UX-08**: Year selector on charts -- click any year to see detailed comparison at that point

### AI Chatbot (v2)

- **AI-01**: Floating AI chatbot that acts as interactive tooltips -- users can ask about any input or result
- **AI-02**: Conversational input completion -- entire calculator can be filled via chat interface
- **AI-03**: Context-aware explanations that reference user's specific numbers and scenario

## v3+ Requirements

Features for future consideration after product-market fit.

### AI Video Summary

- **VID-01**: Auto-generated short video (60-90s) with AI avatar presenting personalized results summary
- **VID-02**: Template-based scripts for buy-better and rent-better scenarios with dynamic data insertion (dollar amounts, break-even year, key drivers)
- **VID-03**: Multiple script variants per scenario for variety and engagement
- **VID-04**: AI avatar uses creator's face for brand consistency and personal connection

### Advanced Features

- **ADV-01**: Multi-period interest rates (different rates for first 5 years, next 5, final period)
- **ADV-02**: City-level data auto-fill for top 10 Canadian metros
- **ADV-03**: French language support (full bilingual interface)
- **ADV-04**: User accounts with saved calculation history
- **ADV-05**: Detailed investment tax breakdown (Canadian/foreign dividends, realized/unrealized capital gains)
- **ADV-06**: Multiple property comparison (side-by-side condo vs house vs townhouse)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| US mortgage calculations | Canadian-only product; US monthly compounding is different math entirely |
| Mobile native app | Web responsive covers mobile; native app is premature |
| Real-time market data feeds | Zero budget constraint; user enters their own rates |
| Mortgage payment schedule export | Dedicated amortization calculators exist; not core to rent-vs-buy |
| Historical market data visualization | Educational content, not a calculator feature; link to external resources |
| Social login (Google, Facebook) | No user accounts in v1; email-only capture in v2 is simpler |
| Multiple currency support | Canadian dollars only; no international use case |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1: Project Foundation & Architecture | Complete |
| ARCH-02 | Phase 1: Project Foundation & Architecture | Pending |
| ARCH-03 | Phase 1: Project Foundation & Architecture | Pending |
| CALC-01 | Phase 2: Housing Cost Engine | Pending |
| CALC-02 | Phase 2: Housing Cost Engine | Pending |
| CALC-03 | Phase 2: Housing Cost Engine | Pending |
| CALC-04 | Phase 2: Housing Cost Engine | Pending |
| CALC-05 | Phase 2: Housing Cost Engine | Pending |
| CALC-06 | Phase 2: Housing Cost Engine | Pending |
| CALC-07 | Phase 2: Housing Cost Engine | Pending |
| CALC-11 | Phase 2: Housing Cost Engine | Pending |
| CALC-08 | Phase 3: Investment & Comparison Engine | Pending |
| CALC-09 | Phase 3: Investment & Comparison Engine | Pending |
| CALC-10 | Phase 3: Investment & Comparison Engine | Pending |
| CALC-12 | Phase 3: Investment & Comparison Engine | Pending |
| CALC-13 | Phase 3: Investment & Comparison Engine | Pending |
| CALC-14 | Phase 3: Investment & Comparison Engine | Pending |
| INPUT-01 | Phase 4: Input Panel & State Management | Pending |
| INPUT-02 | Phase 4: Input Panel & State Management | Pending |
| INPUT-03 | Phase 4: Input Panel & State Management | Pending |
| INPUT-04 | Phase 4: Input Panel & State Management | Pending |
| INPUT-05 | Phase 4: Input Panel & State Management | Pending |
| INPUT-06 | Phase 4: Input Panel & State Management | Pending |
| INPUT-07 | Phase 4: Input Panel & State Management | Pending |
| INPUT-08 | Phase 4: Input Panel & State Management | Pending |
| INPUT-09 | Phase 4: Input Panel & State Management | Pending |
| INPUT-10 | Phase 4: Input Panel & State Management | Pending |
| INPUT-11 | Phase 4: Input Panel & State Management | Pending |
| UX-04 | Phase 4: Input Panel & State Management | Pending |
| VIZ-01 | Phase 5: Verdict & Results Display | Pending |
| VIZ-02 | Phase 5: Verdict & Results Display | Pending |
| VIZ-07 | Phase 5: Verdict & Results Display | Pending |
| VIZ-08 | Phase 5: Verdict & Results Display | Pending |
| VIZ-03 | Phase 6: Chart Visualizations | Pending |
| VIZ-04 | Phase 6: Chart Visualizations | Pending |
| VIZ-05 | Phase 6: Chart Visualizations | Pending |
| VIZ-06 | Phase 6: Chart Visualizations | Pending |
| UX-03 | Phase 6: Chart Visualizations | Pending |
| EDU-01 | Phase 7: Explanations & Education | Pending |
| EDU-02 | Phase 7: Explanations & Education | Pending |
| EDU-03 | Phase 7: Explanations & Education | Pending |
| EDU-04 | Phase 7: Explanations & Education | Pending |
| EDU-05 | Phase 7: Explanations & Education | Pending |
| UX-01 | Phase 8: Responsive Design & Polish | Pending |
| UX-02 | Phase 8: Responsive Design & Polish | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after roadmap creation*
