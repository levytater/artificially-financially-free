# Phase 4: Input Panel & State Management - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the input panel where users enter all calculator parameters (province, home price, down payment, mortgage, rent, income, investment returns, rates) with real-time recalculation, validation, Simple/Advanced mode toggle, and collapsible sections. The calculation engines (Phases 2-3) already exist — this phase wires UI inputs to them and manages state.

</domain>

<decisions>
## Implementation Decisions

### Input Layout & Grouping
- **Two-phase UX:** Modal wizard on first visit, then left sidebar + right results layout
- **Wizard:** 3 steps with forward/back navigation
  - Step 1: "Your Situation" — province, income, first-time buyer checkbox
  - Step 2: "The Home" — purchase price, down payment %, mortgage rate, amortization
  - Step 3: "The Alternative" — monthly rent, expected return, time horizon
- **Wizard educational content:** Short inline explainer paragraph above each input group, plus expandable "Learn more" for deeper detail (condensed info similar to WOWA.ca's calculator, plus opportunity cost explanation)
- **Post-wizard sidebar:** 3 collapsible sections mirroring the wizard steps, all expanded by default
- **Main layout after wizard:** Left sidebar (~350px) with inputs, results/charts fill the remaining space on the right

### Simple vs Advanced Mode
- **Simple mode:** Single investment return rate, single account pool — no TFSA/RRSP/Non-registered distinction. Simplest possible model
- **Advanced mode reveals:** Per-account returns (TFSA, RRSP, Non-registered), maintenance %, selling costs %, home insurance, inflation rate override, rent increase rate override
- **Toggle placement:** Offered in the wizard ("How detailed do you want to get?") AND persistent toggle at top of sidebar for switching later
- **Mode switch behavior:** When switching Simple → Advanced, reveal the default values that were being used behind the scenes. No surprise changes to calculation results

### Input Controls & Feel
- **Stepper arrows** (up/down buttons like PWL Capital) for most inputs, with context-specific increments:
  - Percentage fields (rates, returns): 10 basis points (0.10%) per click
  - Amortization period: 1 year per click
  - Down payment ($): $5,000 per click
  - Purchase price: $10,000 per click (Claude to determine exact increment)
  - Monthly rent: $50 per click (Claude to determine exact increment)
- **Time horizon (1-30 years):** Exception — uses horizontal slider + editable number field. Scrubbing years and watching charts update is the satisfying interaction
- **Dollar formatting:** Format on blur — type freely as plain numbers, formats to $500,000 with commas and $ prefix when field loses focus
- All fields also accept direct keyboard input (steppers are a convenience, not the only way)

### Defaults & Validation
- **Default province:** Ontario
- **Default purchase price:** $500,000
- **Other defaults:** Claude picks sensible 2025/2026 Canadian market values (research will verify exact numbers). Expected: ~4.5-5% mortgage rate, ~$2,000/mo rent, ~$75K income, ~6-7% investment return, 25yr amortization, 10yr time horizon
- **Validation display:** Inline red text below the offending field with specific guidance (e.g., "Down payment must be at least 5%")
- **Real-time recalculation:** Results update as user adjusts any input, debounced for performance (UX-04)

### Claude's Discretion
- Exact stepper increment amounts for purchase price and monthly rent
- Wizard step navigation UI (progress dots, step counter, etc.)
- Exact sidebar width and responsive breakpoint behavior
- Loading/transition states between wizard completion and main layout
- Which "Learn more" content to include per wizard step (research will inform)
- Animation/transition when switching Simple ↔ Advanced mode

</decisions>

<specifics>
## Specific Ideas

- "Condense the info from WOWA.ca's calculator page" into the wizard educational content — plus add explanation about opportunity cost returns
- PWL Capital stepper arrows as the reference for input controls — clean, consistent up/down increment pattern
- Wizard should feel like a guided experience, not a form to fill out — each step tells you WHY these numbers matter before asking for them
- After wizard completes, the sidebar should feel like a power-user control panel where everything is adjustable

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-input-panel-state-management*
*Context gathered: 2026-02-25*
