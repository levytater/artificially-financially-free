# Project Research Summary

**Project:** Artificially Financially Free - Canadian Rent vs Buy Calculator
**Domain:** Financial Calculator Platform (Canadian Real Estate)
**Researched:** 2026-02-24
**Confidence:** HIGH

## Executive Summary

This is a Canadian rent-vs-buy financial calculator with deep opportunity cost modeling — a specialized financial tool that combines mortgage calculations, tax rules, and investment projections. Experts build these as client-side calculators with server-side PDF/email capabilities, using React frameworks with pure calculation engines separated from UI. The recommended approach uses Next.js 15 App Router with Recharts for charts, React Hook Form for inputs, and shadcn/ui for components, deployed on Vercel. The core differentiator is combining PWL Capital-quality visualizations with HolyPotato-depth math while maintaining WOWA.ca-level accessibility.

The primary risk is Canadian-specific calculation accuracy. Semi-annual mortgage compounding (vs US monthly), CMHC insurance tiers with surcharges, provincial land transfer tax variations, and Toronto's double LTT must be implemented correctly from Day 1 or the entire product loses credibility. Mitigation: build and test the calculation engine first as pure TypeScript functions with Decimal.js for precision, validate against RBC/TD bank calculators, and handle all edge cases (9.99% vs 10% down payment, 25yr vs 30yr amortization, Toronto MLTT) before any UI work.

Secondary risks include mobile performance (chart crashes with 360 monthly data points), PDF generation memory leaks, and email deliverability for lead capture. These are addressed through data sampling for large datasets, server-side PDF generation via API routes, and proper email authentication (SPF/DKIM/DMARC) with Resend.

## Key Findings

### Recommended Stack

Next.js 15 with App Router provides the ideal foundation — server components for static content with SEO, client components for interactivity, built-in API routes for email/PDF, and zero-config Vercel deployment. React 19 is stable (Dec 2024) with Server Components and the new `use` hook. TypeScript 5.9 provides strict type safety critical for financial calculations. Tailwind CSS + shadcn/ui deliver the component system with February 2026's visual builder simplifying setup.

**Core technologies:**
- **Next.js 15 + React 19**: App Router with SSR for SEO, client components for calculator interactivity — industry standard with excellent Vercel integration
- **TypeScript 5.9**: Type safety prevents calculation errors (passing strings to number functions), 10-20% faster builds in 2026 release
- **Recharts 3.7**: Best React charting library for financial dashboards per 2026 LogRocket/Syncfusion analysis — declarative API, built-in animations, mobile-friendly
- **React Hook Form + Zod**: Form state with runtime validation and TypeScript inference — Formik is abandoned, RHF has superior performance and active maintenance
- **shadcn/ui + Radix UI**: Accessible component primitives with Tailwind styling, installed into codebase for full customization
- **Decimal.js**: Financial precision for all calculations — prevents floating-point errors that compound over 25+ year timelines
- **Resend + Kit**: Email delivery (Resend for transactional PDFs, Kit for list building with 10k free tier)

**Medium confidence items:**
- **@react-pdf/renderer**: May require `--legacy-peer-deps` with React 19. Fallback: Puppeteer-based server-side generation
- **@houski/canadian-financial-calculations**: Limited documentation on maintenance. Fallback: custom calculation functions

### Expected Features

**Must have (table stakes):**
- **Calculator Engine**: Semi-annual compounding, CMHC insurance (tiered 2.80-4.00% by LTV), provincial land transfer tax, property tax, opportunity cost modeling (renter invests difference), net worth comparison, break-even calculation
- **Core Inputs**: Province selector, purchase price, down payment %, mortgage rate, monthly rent, time horizon, investment return rate, first-time buyer checkbox
- **Basic Results**: Clear verdict (Rent or Buy with $ advantage), summary cards (final net worth comparison, break-even year), detailed cost breakdown table
- **Net Worth Visualization**: Animated area chart showing rent vs buy wealth over time (this is the engagement hook)
- **Helper Tooltips**: Every input explained (reduces confusion without AI chatbot complexity)
- **Lead Capture**: "Save Results" email flow, shareable link generation
- **Mobile Responsive**: Touch-friendly inputs, readable charts on mobile (80%+ users expect this)

**Should have (competitive differentiators):**
- **Interactive Charts**: PWL Capital-quality animated area/bar charts with smooth transitions
- **Plain-English Explanations**: "You'd be $X better off renting because..." with chart annotations
- **Collapsible Input Sections**: Simple defaults visible, advanced inputs expandable (reduces overwhelm)
- **Asset Allocation Selector**: Stock/bond split determines expected returns (simpler than complex dividend breakdown)
- **Tax-Free vs Taxable Toggle**: TFSA vs non-registered investment accounts (meaningful personalization)
- **PDF Report**: Branded deliverable with full analysis (builds trust, professional feel)
- **Dark Mode**: 80%+ users prefer for extended use per 2026 research

**Defer (v2+):**
- Multi-period interest rates (complexity explosion, marginal accuracy gain)
- AI chatbot (pre-written tooltips deliver 80% of value for v1)
- City-level granular data (province defaults sufficient, manual override available)
- User accounts/authentication (email-only capture converts better)
- French language support (English MVP validates faster)

### Architecture Approach

Financial calculators follow a four-layer architecture: (1) Presentation (inputs, charts, results cards), (2) State Management (Zustand or Context API), (3) Calculation Engine (pure TypeScript functions with zero React dependencies), and (4) API/Serverless Layer (email, PDF, shareable links). The critical pattern is separating all calculation logic from React components into pure functions in `lib/calculation-engine/` — this ensures testability, portability, and prevents calculation errors from mixing with UI logic.

**Major components:**
1. **Calculation Engine** (`lib/calculation-engine/`) — Pure TypeScript functions for mortgage math, CMHC insurance, land transfer tax, investment returns, net worth comparison. Uses Decimal.js for precision. Tested independently before any UI work.
2. **State Management** (`store/calculatorStore.ts`) — Zustand store for calculator inputs, results, UI state. Avoids Context API re-render cascades. Includes localStorage persistence via `persist` middleware.
3. **Input Controls** (`components/calculator/InputPanel.tsx`) — React Hook Form with Zod validation. Debounced real-time updates trigger recalculations smoothly.
4. **Chart Visualizations** (`components/calculator/NetWorthChart.tsx`) — Recharts area/bar charts with Framer Motion animations. Data sampling for timelines >10 years prevents mobile crashes.
5. **API Routes** (`app/api/email/`, `app/api/pdf/`, `app/api/share/`) — Next.js serverless functions for email delivery (Resend), PDF generation, shareable link storage (Vercel KV).

**Key patterns:**
- **Debounced Calculations**: 300ms debounce on input changes prevents performance issues with heavy calculations
- **Hybrid SSR/Client**: Server components for static content/SEO, client components for interactivity
- **Late Validation**: Show errors on blur, remove on correction (better UX than validate-on-submit or validate-on-keystroke)

### Critical Pitfalls

1. **Semi-Annual Compounding Confusion** — Canadian mortgages compound semi-annually by law (not monthly like US). Using wrong formula understates interest by $3,000+/year. **Avoid:** Convert nominal rate to effective rate using `Math.pow(1 + nominalRate/2, 2) - 1`, then calculate monthly payment. Validate against RBC/TD bank calculators.

2. **CMHC Tier Edge Cases Not Handled** — Insurance premium has hard cutoffs at 10%, 15%, 20% down payment, plus 0.20% surcharge for amortization >25 years, provincial sales tax in ON/QC/MB/SK, and $1M+ properties can't use CMHC. **Avoid:** Test boundary cases (9.99%, 10%, 10.01%, 14.99%, 15%, 19.99%, 20%), add amortization surcharge separately, include provincial tax multiplier.

3. **Toronto Double Land Transfer Tax Not Applied** — Toronto has municipal LTT on top of provincial LTT (effectively doubles tax). Missing this shows $15k estimate when actual is $30k. **Avoid:** If province=Ontario AND city=Toronto, calculate MLTT separately. First-time buyer rebate applies to both (max $8,475 total).

4. **Floating-Point Precision Errors Accumulate** — JavaScript's `0.1 + 0.2 = 0.30000000000000004` compounds over 25-year timelines. **Avoid:** Use Decimal.js for ALL financial calculations, instantiate numbers as Decimal objects, only round for display.

5. **Tax Rules Hardcoded Instead of Configurable** — Canadian tax rules change annually (TFSA limits, RRSP limits, capital gains rates). Hardcoding creates maintenance burden. **Avoid:** Store in `TAX_RULES_2026` config object with last-updated comment and source URLs. Set December reminder to review.

6. **Chart Crashes Browser with Large Datasets** — 30-year timeline = 360 monthly points × multiple series = mobile browser crash (iOS Safari 384 MB canvas limit). **Avoid:** Data sampling for timelines >10 years (aggregate monthly → quarterly/annual), disable animations for >100 points, test on iPhone Safari.

7. **Email Deliverability Kills Lead Capture** — Emails without SPF/DKIM/DMARC land in spam or blocked entirely. **Avoid:** Use Resend with proper authentication, warm up domain gradually, test with mail-tester.com (target ≥8/10), avoid spam trigger words, personalize emails.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Core Calculator Engine
**Rationale:** Pure calculation functions have zero dependencies and are critical for accuracy. Must be built and validated first before any UI work. Canadian-specific math (semi-annual compounding, CMHC tiers, provincial LTT) is complex and error-prone — getting this wrong destroys product credibility. Building as pure TypeScript functions allows thorough testing independent of React.

**Delivers:**
- All calculation functions in `lib/calculation-engine/` (mortgage.ts, taxes.ts, investment.ts, comparator.ts)
- Canadian tax rules config file (LTT rates, CMHC tiers, provincial taxes)
- Decimal.js integration for precision
- Comprehensive test suite validating against bank calculators
- Zod schemas for input validation

**Addresses (from FEATURES.md):**
- Semi-annual mortgage compounding
- CMHC insurance with tiered rates and surcharges
- Provincial land transfer tax calculations
- Toronto municipal LTT
- Opportunity cost modeling (investment returns vs home equity)
- Net worth comparison logic
- Break-even year calculation

**Avoids (from PITFALLS.md):**
- Semi-annual compounding confusion (Pitfall 1)
- CMHC tier edge cases (Pitfall 2)
- Toronto double LTT (Pitfall 3)
- Floating-point precision errors (Pitfall 4)
- Tax rules hardcoded (Pitfall 5)
- Opportunity cost oversimplified (Pitfall 9)

**Research Flag:** 🟢 SKIP RESEARCH — Well-documented Canadian mortgage formulas, CMHC rates, and LTT rules available from government/bank sources.

---

### Phase 2: State Management & Input UI
**Rationale:** With calculations validated, build the state layer and input controls. Zustand store coordinates calculator state and triggers recalculations. Input panel allows user interaction and validates inputs. This phase proves the calculation engine integrates correctly before adding visual complexity (charts).

**Delivers:**
- Zustand store with localStorage persistence
- Input panel component with all core inputs (province, price, down payment %, rate, rent, timeline, investment return)
- React Hook Form + Zod validation integration
- Debounced calculation hook (300ms)
- Basic results cards (verdict, net worth comparison, break-even year)
- Helper tooltips on all inputs
- Collapsible sections (Basic/Advanced inputs)

**Uses (from STACK.md):**
- React Hook Form + Zod for form state and validation
- Zustand for global state (avoids Context API re-render issues)
- shadcn/ui for input components (Input, Slider, Select, Card, Tooltip)
- Framer Motion for smooth UI transitions

**Implements (from ARCHITECTURE.md):**
- State Management layer
- Input Controls component
- Results Cards component
- Debounced Real-Time Calculations pattern
- Late Validation pattern

**Avoids (from PITFALLS.md):**
- Form validation too aggressive (Pitfall 10)
- Mobile touch targets too small (Pitfall 8)

**Research Flag:** 🟢 SKIP RESEARCH — Standard React patterns, well-documented libraries.

---

### Phase 3: Chart Visualizations
**Rationale:** With working inputs and calculations, add the key differentiator: animated net worth chart. This is the engagement hook and most complex UI element. Recharts integration, animation tuning, and mobile performance optimization require focused effort. Build net worth chart first (highest value), defer cash flow/savings charts to Phase 4.

**Delivers:**
- Net worth area chart (rent vs buy over time)
- Recharts integration with Framer Motion animations
- Data sampling for timelines >10 years (prevents mobile crashes)
- Responsive chart sizing and touch interactions
- Year markers and timeline annotations
- Chart hover tooltips with contextual data

**Uses (from STACK.md):**
- Recharts 3.7 for declarative chart components
- Framer Motion 11 for smooth entrance animations
- react-use for responsive breakpoint detection

**Implements (from ARCHITECTURE.md):**
- Chart Visuals components
- Performance optimization via data sampling

**Avoids (from PITFALLS.md):**
- Chart crashes browser with large datasets (Pitfall 6)
- Mobile touch targets too small (Pitfall 8)

**Research Flag:** 🟡 LIGHT RESEARCH — Recharts patterns are documented, but optimizing chart performance for mobile with 360-point datasets may need experimentation. Consider `/gsd:research-phase` if performance issues arise.

---

### Phase 4: SEO & Polish
**Rationale:** With core functionality working, optimize for discovery and UX polish. Next.js App Router SSR ensures Googlebot can index calculator content. Dark mode, additional charts (cash flow, renter savings), and detailed cost breakdown table round out the experience before lead capture.

**Delivers:**
- Server-side rendering with default calculator values (SEO)
- schema.org FinancialProduct markup
- Dark mode toggle
- Cash flow bar chart (annual costs)
- Renter savings chart (investment portfolio growth)
- Detailed cost breakdown table
- Plain-English explanations and chart annotations
- Mobile-first responsive design refinements

**Uses (from STACK.md):**
- Next.js App Router Server Components
- Tailwind CSS dark mode utilities
- Recharts for additional chart types

**Implements (from ARCHITECTURE.md):**
- Hybrid Client/Server Components pattern
- SEO optimization strategies

**Avoids (from PITFALLS.md):**
- SEO disaster with client-side rendering (Pitfall 11)

**Research Flag:** 🟢 SKIP RESEARCH — Next.js SSR/SEO is well-documented.

---

### Phase 5: Lead Capture & PDF
**Rationale:** Final phase adds business model enabler: email capture with PDF reports and shareable links. Most complex integration work (Resend, Vercel KV, PDF generation) happens here. Build after core calculator is validated to avoid premature optimization.

**Delivers:**
- "Save Results" email capture flow
- Shareable link generation (Vercel KV storage)
- Branded PDF report generation (server-side via API route)
- Resend integration for email delivery
- Kit (ConvertKit) integration for mailing list
- Email deliverability setup (SPF/DKIM/DMARC)
- Rate limiting on email endpoint

**Uses (from STACK.md):**
- Resend for transactional email delivery
- Kit for email list building
- @react-pdf/renderer or Puppeteer for PDF generation
- Vercel KV for shareable link storage

**Implements (from ARCHITECTURE.md):**
- API Routes for email/PDF/share endpoints
- External service integrations

**Avoids (from PITFALLS.md):**
- PDF generation causes memory leaks (Pitfall 7)
- Email deliverability kills lead capture (Pitfall 12)

**Research Flag:** 🟡 MODERATE RESEARCH — PDF generation approaches (client vs server, @react-pdf vs Puppeteer) may need prototyping to choose optimal path. Email deliverability setup requires following Resend/domain configuration guides.

---

### Phase Ordering Rationale

- **Phase 1 first**: Calculation engine has zero dependencies and is mission-critical for accuracy. Building as pure functions allows thorough testing before UI complexity. Canadian mortgage math is non-negotiable and must be perfect.

- **Phase 2 before 3**: State management and inputs prove calculation integration works. Charts depend on stable data flow. Validating calculations with simple results cards before adding chart complexity reduces debugging surface area.

- **Phase 3 before 4**: Net worth chart is the primary engagement hook and most complex UI element. Build it independently before adding polish/SEO optimizations. Data sampling and performance tuning need focused attention.

- **Phase 4 before 5**: SEO and polish create discoverable, polished experience before driving traffic. Don't build lead capture until calculator experience is solid — otherwise captured leads see unfinished product.

- **Phase 5 last**: Lead capture is business enabler but doesn't affect core calculator functionality. Most complex integrations (email, PDF, storage) happen here. Defer until calculator is validated and traffic-ready.

**Dependency flow:** Calculations → State → Inputs → Charts → Polish → Lead Capture

**Critical path:** Phase 1 is blocking for all others. Phases 2-4 are sequential. Phase 5 can be parallelized with Phase 4 if needed.

### Research Flags

**Needs research during planning:**
- **Phase 3 (Charts)**: May need `/gsd:research-phase` if Recharts performance optimization for 360-point datasets on mobile proves challenging. Most sources focus on desktop; mobile canvas memory limits (iOS Safari 384 MB) may require experimentation.

- **Phase 5 (PDF Generation)**: May need `/gsd:research-phase` to compare @react-pdf/renderer vs Puppeteer approaches. React 19 compatibility concerns with @react-pdf plus memory leak reports suggest server-side Puppeteer might be better, but requires testing.

**Standard patterns (skip research-phase):**
- **Phase 1 (Calculations)**: Canadian mortgage formulas, CMHC rates, LTT rules well-documented by government/bank sources
- **Phase 2 (State/Inputs)**: React Hook Form, Zod, Zustand have extensive documentation and standard patterns
- **Phase 4 (SEO/Polish)**: Next.js SSR, dark mode, schema.org markup all well-documented

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core framework (Next.js 15, React 19, TypeScript 5.9) verified with official 2026 documentation. Charting (Recharts) confirmed as industry standard via LogRocket/Syncfusion analysis. Forms (React Hook Form + Zod) validated as 2026 best practice with Formik abandonment confirmed. |
| Features | HIGH | Competitive analysis (WOWA, MDM, PWL Capital, HolyPotato) identified clear table stakes and differentiators. Canadian-specific requirements (CMHC, LTT, semi-annual compounding) verified via government sources. MVP scope well-defined. |
| Architecture | HIGH | Multiple 2026 sources confirm four-layer financial calculator architecture (presentation, state, calculation, API). Next.js patterns (SSR/Client split, App Router) documented in official guides. Separation of calculation engine from UI is proven pattern. |
| Pitfalls | HIGH | Critical pitfalls verified via official sources (Canadian mortgage formulas, CMHC rates, LTT rules). Technical pitfalls (floating-point errors, chart performance, PDF memory leaks) confirmed via GitHub issues and Stack Overflow. Email deliverability best practices validated via Resend documentation. |

**Overall confidence:** HIGH

### Gaps to Address

**MEDIUM-confidence items requiring validation during implementation:**

1. **@houski/canadian-financial-calculations package**: npm package exists but limited documentation on maintenance status. **Action:** Validate package during Phase 1 setup. If abandoned or insufficient, build custom calculation functions using formulas from WOWA/MDM/bank sources.

2. **@react-pdf/renderer React 19 compatibility**: Reports of peer dependency issues with React 19. **Action:** Prototype during Phase 5 planning. If `--legacy-peer-deps` workaround fails, switch to Puppeteer-based server-side generation.

3. **Recharts mobile performance with 360 data points**: Documented performance strategies exist, but iOS Safari 384 MB canvas limit may require device testing. **Action:** Test on actual iPhone Safari during Phase 3 with maximum timeline (30 years × 12 months). Implement data sampling if crashes occur.

4. **Toronto municipal LTT formula changes**: As of April 1, 2026, Toronto has graduated MLTT rates for properties >$3M (noted in PITFALLS.md sources). **Action:** Verify current Toronto MLTT tiers from city.toronto.ca during Phase 1. Update config if rates changed.

**LOW-confidence items requiring research during planning:**

1. **PDF generation approach**: No clear consensus on @react-pdf vs Puppeteer for Next.js 15 App Router in 2026. Memory leak reports for @react-pdf concerning. **Action:** Prototype both approaches during Phase 5 planning. Compare memory usage, generation speed, layout quality. May need `/gsd:research-phase`.

2. **Provincial tax on CMHC premium**: PITFALLS.md mentions provincial sales tax on CMHC in ON/QC/MB/SK but didn't find definitive 2026 rates. **Action:** Verify current PST/HST application to CMHC premiums via provincial sources during Phase 1.

## Sources

### Primary (HIGH confidence)

**Stack Research:**
- [Next.js 15 Official Release Blog](https://nextjs.org/blog/next-15) — App Router, Turbopack, React 19 support verified
- [React v19 Official Release](https://react.dev/blog/2024/12/05/react-19) — Stable release Dec 2024 confirmed
- [Recharts npm package](https://www.npmjs.com/package/recharts) — Version 3.7.0, 18M+ downloads
- [React Hook Form Official Docs](https://react-hook-form.com/) — Current best practice, Formik abandonment confirmed
- [shadcn/ui Visual Builder Release](https://www.infoq.com/news/2026/02/shadcn-ui-builder/) — February 2026 Next.js integration

**Feature Research:**
- [WOWA.ca Rent vs Buy Calculator](https://wowa.ca/calculators/rent-vs-buy-calculator) — Competitor analysis
- [PWL Capital Rent vs Buy Tool](https://research-tools.pwlcapital.com/research/rent-vs-buy) — UI inspiration
- [CMHC Official Premium Calculator](https://www.cmhc-schl.gc.ca/consumers/home-buying/calculators/mortgage-loan-insurance-premium-calculator) — 2026 rates verified

**Architecture Research:**
- [Next.js App Router Official Docs](https://nextjs.org/docs/app/getting-started/server-and-client-components) — SSR/client patterns
- [Zustand Official Docs](https://github.com/pmndrs/zustand) — State management patterns
- [I Built a Financial Tools Platform with Next.js - DEV Community](https://dev.to/statementextract/i-built-a-financial-tools-platform-with-nextjs-heres-what-i-learned-178j) — Real-world architecture

**Pitfalls Research:**
- [A Guide to Canadian Mortgage Calculations - York University](https://www.yorku.ca/amarshal/mortgage.htm) — Semi-annual compounding formula
- [CMHC Mortgage Insurance Calculator 2026 - WOWA.ca](https://wowa.ca/calculators/cmhc-insurance) — Tier thresholds and surcharges
- [Municipal Land Transfer Tax - City of Toronto](https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/) — Toronto double LTT confirmed
- [Handle Money in JavaScript: Financial Precision - DEV Community](https://dev.to/benjamin_renoux/financial-precision-in-javascript-handle-money-without-losing-a-cent-1chc) — Decimal.js justification

### Secondary (MEDIUM confidence)

- [LogRocket: Best React Chart Libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/) — Recharts ranking
- [Syncfusion: Top 5 React Chart Libraries 2026](https://www.syncfusion.com/blogs/post/top-5-react-chart-libraries) — Recharts consensus
- [Nielsen Norman Group: Calculator Design Recommendations](https://www.nngroup.com/articles/recommendations-calculator/) — UX best practices
- [Email Deliverability Guide 2026 - Amplemarket](https://www.amplemarket.com/blog/email-deliverability-guide-2026) — SPF/DKIM/DMARC requirements

### Tertiary (LOW confidence, needs validation)

- [@houski/canadian-financial-calculations npm](https://www.npmjs.com/package/@houski/canadian-financial-calculations) — Package exists but maintenance status unclear
- [React-PDF Memory Leak Issue #718](https://github.com/diegomura/react-pdf/issues/718) — Reported but unclear if resolved in latest version
- Provincial sales tax on CMHC premium — mentioned in pitfalls research but rates need verification

---

*Research completed: 2026-02-24*
*Ready for roadmap: yes*
