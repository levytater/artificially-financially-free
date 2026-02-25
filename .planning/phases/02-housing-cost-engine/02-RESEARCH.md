# Phase 2: Housing Cost Engine - Research

**Researched:** 2026-02-24
**Domain:** Canadian residential mortgage & housing cost calculations
**Confidence:** HIGH

## Summary

Phase 2 builds the pure calculation engine for all housing-side financial math: Canadian mortgage payments (semi-annual compounding), CMHC insurance premiums, provincial land transfer tax, property tax, closing costs, home appreciation, rent increases, and first-time buyer rebates. This is a math-only phase with no UI components.

The core challenge is precision: Canadian mortgage math uses semi-annual compounding (legally mandated for fixed-rate mortgages), which requires a two-step rate conversion that differs from US monthly compounding. All calculations must use Decimal.js (already installed) to prevent floating-point drift over 30-year projections. The project already has `effectiveMonthlyRate()` implemented in `src/lib/decimal.ts` -- this phase extends that foundation into a complete housing cost engine.

Provincial land transfer tax is the most complex data requirement: 10 provinces with different bracket systems ranging from flat-rate (New Brunswick at 1%) to multi-tier marginal rates (Ontario with 5 brackets). Four provinces have first-time buyer rebates (Ontario, BC, PEI, Toronto municipal). CMHC insurance has 6 LTV tiers plus surcharges and provincial sales tax in 3 provinces.

**Primary recommendation:** Build a modular calculation engine with separate pure functions per domain (mortgage, CMHC, LTT, closing costs, projection) that compose into a year-by-year homeowner cost projection. Store all province-specific data as typed constant objects, not inline magic numbers.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None explicitly locked -- user granted full discretion on all implementation decisions for this phase.

### Claude's Discretion
User granted full discretion on all implementation decisions for this phase. Claude should make sensible choices guided by:

**Default financial assumptions:**
- Choose current-market-appropriate defaults for mortgage rate, property tax %, maintenance %, home insurance, appreciation rate, rent increase rate
- Use well-sourced Canadian data (Bank of Canada, CMHC, StatsCan) as reference points
- Defaults should feel realistic to a Canadian user in 2025-2026

**Closing cost model:**
- Decide granularity (flat % vs itemized line items)
- Determine which buying costs (legal, inspection, appraisal, title insurance) and selling costs (realtor commission, legal) to include
- Balance accuracy with simplicity -- this is a comparison tool, not a legal closing statement

**Homeowner cost breakdown:**
- Decide what line items appear in year-by-year projections
- At minimum: mortgage payment (P&I split for equity tracking), property tax, maintenance, insurance
- Whether to track condo fees as a separate line item

**Sale/exit modeling:**
- Decide how to model homeowner's position at time horizon end
- Handle principal residence exemption (no capital gains tax on primary residence in Canada)
- Include or exclude selling costs (realtor commission, legal fees)
- Handle mortgage penalty for mid-term sale if applicable

**Province data:**
- All 10 provinces minimum
- Land transfer tax formulas per province with correct marginal rate brackets
- First-time buyer rebate rules per province (CALC-11)
- Whether to include territories (lower priority -- small population)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CALC-01 | Mortgage payment calculated using Canadian semi-annual compounding (not US monthly) | Semi-annual compounding formula verified: `effectiveMonthlyRate = (1 + r/2)^(1/6) - 1`. Already partially implemented in `src/lib/decimal.ts`. Monthly payment formula: `PMT = (r_m * P) / (1 - (1 + r_m)^(-n))`. Code examples from Mike Sukmanowsky's guide with TypeScript implementation. |
| CALC-02 | CMHC insurance calculated by LTV tier (2.80%-4.00%) when down payment < 20%, including amortization surcharge and provincial sales tax | Official CMHC rate table with 6 tiers from 0.60% to 4.50%. Amortization surcharge of 0.20% for >25yr terms. PST applies in ON (8%), QC (9%), SK (6%) -- must be paid cash at closing, cannot be added to mortgage. |
| CALC-03 | Provincial land transfer tax auto-calculated using province-specific marginal rate formulas for all provinces | Complete bracket data for all 10 provinces researched. Ranges from no LTT (AB, SK have registration fees only) to 5-bracket marginal systems (ON, BC). Quebec has municipal variation (Montreal vs standard). |
| CALC-04 | Property tax calculated as annual percentage of property value with province-level defaults and user override | Straightforward percentage calculation. Research indicates typical Canadian property tax rates range from 0.5% to 2.5% of assessed value depending on municipality. Province-level defaults are reasonable approximation. |
| CALC-05 | Closing costs calculated for buying (legal fees, home inspection, LTT) and selling (realtor commission, legal fees) | Buying costs: legal ($1,500-$2,500), inspection ($400-$700), appraisal ($300-$600), title insurance ($250-$400). Selling costs: realtor commission (typically 5% split), legal ($1,000-$1,500), mortgage discharge ($200-$400). Total typically 3-4% of purchase price. |
| CALC-06 | Home value appreciation compounded annually over the full time horizon | Simple compound growth: `value_year_n = purchasePrice * (1 + rate)^n`. Long-term Canadian average ~3-5% nominal (~2% real). Default recommendation: 3% nominal. |
| CALC-07 | Rent increase compounded at user-specified rate (CPI default) over the full time horizon | Same compound growth formula. Canadian CPI averaged 2.1% in 2025. Actual rent inflation higher (3.8-4.9% in 2025) but CPI is the standard reference. Default recommendation: 2% (CPI target). |
| CALC-11 | First-time home buyer land transfer tax rebate applied when checkbox is selected, using province-specific rebate rules | Rebates documented for 4 jurisdictions: Ontario (up to $4,000), BC (full exemption up to $835K, partial to $860K, max $8,000), PEI (full exemption for eligible FTHB), Toronto municipal (up to $4,475). Most provinces have no FTHB LTT rebate. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| decimal.js | ^10.6.0 | Arbitrary-precision decimal arithmetic | Already installed. Eliminates floating-point errors in 30-year projections. `0.1 + 0.2 = 0.3` not `0.30000000000000004`. Configured with precision 20 and ROUND_HALF_UP. |
| TypeScript | ^5 | Type safety for financial data structures | Already installed. Essential for typed province data, LTV tier definitions, and calculation interfaces. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | Phase 2 is pure math -- no additional libraries required beyond what's installed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| decimal.js | bignumber.js | Same author (MikeMcl). decimal.js has `pow()` with non-integer exponents needed for `(1+r/2)^(1/6)`. bignumber.js does NOT support non-integer exponents. decimal.js is the correct choice. |
| decimal.js | dinero.js | dinero.js is for currency formatting/money objects, not arbitrary-precision math. Wrong tool for mortgage rate calculations. |
| Hand-coded province data | @houski/canadian-financial-calculations | Package viability flagged as concern in STATE.md. After review: it's a small npm package with limited maintenance. Province data changes with legislation -- hand-coded typed constants are more maintainable and verifiable. |

**Installation:**
```bash
# No new packages needed -- decimal.js already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── calculations/
│   │   ├── mortgage.ts          # CALC-01: Payment, amortization schedule
│   │   ├── cmhc.ts              # CALC-02: Insurance premium + PST
│   │   ├── land-transfer-tax.ts # CALC-03, CALC-11: LTT + FTHB rebates
│   │   ├── closing-costs.ts     # CALC-05: Buying and selling costs
│   │   ├── appreciation.ts      # CALC-06: Home value projection
│   │   ├── rent.ts              # CALC-07: Rent increase projection
│   │   ├── property-tax.ts      # CALC-04: Annual property tax
│   │   └── housing-projection.ts # Orchestrator: year-by-year projection
│   ├── data/
│   │   ├── provinces.ts         # Province codes, names, defaults
│   │   ├── ltt-brackets.ts      # Land transfer tax brackets per province
│   │   ├── cmhc-rates.ts        # CMHC premium rate table
│   │   └── closing-cost-defaults.ts # Default closing cost line items
│   ├── decimal.ts               # (existing) Decimal.js config + helpers
│   └── defaults.ts              # (existing) Calculator defaults
├── types/
│   ├── calculator.ts            # (existing) CalculatorState
│   └── housing.ts               # Housing calculation types and interfaces
```

### Pattern 1: Pure Calculation Functions with Decimal.js
**What:** Every calculation function takes primitive inputs, returns Decimal results, has zero side effects.
**When to use:** All financial calculations in this phase.
**Example:**
```typescript
// Source: Verified against Mike Sukmanowsky's guide + CMHC official docs
import { Decimal } from '@/lib/decimal'

/**
 * Calculate monthly mortgage payment using Canadian semi-annual compounding.
 * Formula: PMT = (r_m * P) / (1 - (1 + r_m)^(-n))
 * Where r_m = (1 + annualRate/2)^(1/6) - 1
 */
export function calculateMonthlyPayment(
  principal: Decimal,
  annualRate: Decimal,
  amortizationMonths: Decimal
): Decimal {
  // Step 1: Convert nominal annual rate to effective monthly rate
  // Canadian mortgages compound semi-annually by law
  const semiAnnualRate = annualRate.div(2)
  const effectiveMonthly = semiAnnualRate.plus(1)
    .pow(new Decimal(1).div(6))
    .minus(1)

  // Step 2: Standard annuity payment formula
  const numerator = effectiveMonthly.mul(principal)
  const denominator = new Decimal(1).minus(
    effectiveMonthly.plus(1).pow(amortizationMonths.neg())
  )

  return numerator.div(denominator)
}
```

### Pattern 2: Province Data as Typed Constants
**What:** Province-specific data stored as readonly typed objects, not inline magic numbers.
**When to use:** LTT brackets, property tax defaults, PST rates, FTHB rebates.
**Example:**
```typescript
// Source: Official provincial government websites (verified via web research)
export interface LttBracket {
  readonly upTo: number  // Upper bound in CAD (Infinity for last bracket)
  readonly rate: number  // Marginal rate as decimal (0.01 = 1%)
}

export interface ProvinceLttConfig {
  readonly code: string
  readonly brackets: readonly LttBracket[]
  readonly fthbRebate: FthbRebateConfig | null
}

export const ONTARIO_LTT: ProvinceLttConfig = {
  code: 'ON',
  brackets: [
    { upTo: 55000, rate: 0.005 },
    { upTo: 250000, rate: 0.01 },
    { upTo: 400000, rate: 0.015 },
    { upTo: 2000000, rate: 0.02 },
    { upTo: Infinity, rate: 0.025 },
  ],
  fthbRebate: { maxRebate: 4000, fullExemptionUpTo: 368333 },
} as const
```

### Pattern 3: Marginal Rate Calculator (Reusable)
**What:** Generic function to calculate tax using marginal rate brackets. Reusable for LTT, income tax, any bracketed calculation.
**When to use:** Land transfer tax in ON, BC, QC, MB. Also reusable in Phase 3 for income tax.
**Example:**
```typescript
export function calculateMarginalTax(
  amount: Decimal,
  brackets: readonly LttBracket[]
): Decimal {
  let tax = new Decimal(0)
  let remaining = amount

  for (const bracket of brackets) {
    const bracketCeiling = new Decimal(bracket.upTo === Infinity ? remaining.toNumber() : bracket.upTo)
    const previousCeiling = /* previous bracket's ceiling or 0 */
    const taxableInBracket = Decimal.min(
      remaining,
      bracketCeiling.minus(previousCeiling)
    )
    if (taxableInBracket.lte(0)) break

    tax = tax.plus(taxableInBracket.mul(bracket.rate))
    remaining = remaining.minus(taxableInBracket)
  }

  return tax
}
```

### Pattern 4: Year-by-Year Projection Orchestrator
**What:** Single function that composes all individual calculations into a complete yearly projection array.
**When to use:** The final output of this phase -- feeds into Phase 3 (comparison) and Phase 5+ (display).
**Example:**
```typescript
export interface YearlyHousingCost {
  year: number
  // Mortgage
  mortgagePayment: Decimal      // Total P&I for the year
  principalPaid: Decimal         // Principal portion (equity building)
  interestPaid: Decimal          // Interest portion (cost)
  remainingBalance: Decimal      // Outstanding mortgage balance
  // Ongoing costs
  propertyTax: Decimal
  maintenance: Decimal
  homeInsurance: Decimal
  // Property value
  homeValue: Decimal
  homeEquity: Decimal            // homeValue - remainingBalance
  // Totals
  totalAnnualCost: Decimal       // All cash out-of-pocket for the year
  cumulativeCost: Decimal        // Running total since purchase
}

export interface HousingProjection {
  upfrontCosts: UpfrontCosts     // Down payment + closing + CMHC PST
  yearlyProjection: YearlyHousingCost[]
  exitPosition: ExitPosition      // Net proceeds at sale after horizon
}
```

### Anti-Patterns to Avoid
- **Mixing Decimal and native JS math:** Never use `+`, `-`, `*`, `/` on financial values. Always use `.plus()`, `.minus()`, `.mul()`, `.div()`. A single native operator contaminates the precision chain.
- **Storing rates as decimals in user-facing code:** Store rates as percentages (5.5 for 5.5%) in user state, convert to decimals inside calculation functions. Avoids confusion and matches how banks display rates.
- **Inline province data:** Never put `if (province === 'ON') { rate = 0.005 }` in calculation logic. Separate data from logic so brackets can be updated independently.
- **Assuming monthly compounding:** Canadian mortgage math is NOT the same as US math. The semi-annual compounding conversion is legally required and produces different monthly payment amounts.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Arbitrary-precision arithmetic | Custom BigInt wrapper | `decimal.js` | Already handles rounding modes, power of non-integers, financial formatting. Over 10 years of battle-testing. |
| Mortgage payment formula | Custom iterative solver | Standard annuity formula with Decimal.js | `PMT = (r*P) / (1-(1+r)^-n)` is a closed-form solution. No iteration needed. |
| Amortization schedule | Manual balance tracking | Loop with Decimal.js P&I split per period | Simple loop, but MUST use Decimal to prevent drift. Last payment adjustment is the tricky part. |
| Currency formatting | Custom string manipulation | `Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })` | Handles locale, decimal places, symbols. But use Decimal.js `.toFixed(2)` for calculation precision, Intl only for display. |

**Key insight:** The math formulas themselves are well-known and documented. The danger is floating-point errors compounding over 300+ monthly iterations. Decimal.js is the entire risk mitigation strategy.

## Common Pitfalls

### Pitfall 1: US vs Canadian Compounding
**What goes wrong:** Using monthly compounding formula produces different monthly payment than Canadian banks.
**Why it happens:** US mortgages compound monthly; Canadian fixed-rate mortgages compound semi-annually by law (Interest Act, Section 6). The difference on a $500K mortgage at 5.5% is approximately $15-20/month.
**How to avoid:** Always use the two-step conversion: (1) nominal to effective annual: `EAR = (1 + r/2)^2 - 1`, (2) effective annual to monthly: `r_m = (1 + EAR)^(1/12) - 1`. Or equivalently in one step: `r_m = (1 + r/2)^(1/6) - 1`.
**Warning signs:** Monthly payment doesn't match RBC/TD calculator output within $1.

### Pitfall 2: CMHC Premium Added to Mortgage, PST Paid Cash
**What goes wrong:** Adding PST to the mortgage balance, or forgetting to add the CMHC premium to the mortgage balance.
**Why it happens:** The CMHC premium IS added to the mortgage (increases the principal). But the PST on the premium must be paid cash at closing. These are different treatments.
**How to avoid:** Calculate: `mortgagePrincipal = purchasePrice - downPayment + cmhcPremium`. Separately: `closingCosts += cmhcPremiumPST`. The PST is on the original premium amount, not the mortgage-added premium.
**Warning signs:** Total upfront cash doesn't include PST, or mortgage principal doesn't include CMHC premium.

### Pitfall 3: LTT Marginal vs Flat Rate Confusion
**What goes wrong:** Applying the highest bracket rate to the entire purchase price instead of only the portion within each bracket.
**Why it happens:** Land transfer tax uses MARGINAL rates (like income tax), not flat rates. A $600K Ontario home isn't taxed at 2% on the full amount.
**How to avoid:** Use the generic marginal rate calculator pattern. Test with known examples: Ontario $500K home = $6,475 (not $10,000).
**Warning signs:** LTT amounts are dramatically higher than expected.

### Pitfall 4: Decimal.js Power Function Precision for Rate Conversion
**What goes wrong:** Loss of precision in the semi-annual to monthly rate conversion.
**Why it happens:** `(1 + 0.055/2)^(1/6)` involves a non-integer exponent. Decimal.js handles this via `exp(y*ln(x))` internally, which can introduce small approximation errors.
**How to avoid:** Set Decimal.js precision to 20 (already configured). Verify the effective monthly rate to at least 10 decimal places against known values. For 5.5%: `r_m = 0.00453168...`.
**Warning signs:** Calculated monthly payment drifts more than $0.01 from bank calculators.

### Pitfall 5: Last Mortgage Payment Adjustment
**What goes wrong:** The final mortgage payment in an amortization schedule may be slightly more or less than the regular payment due to rounding accumulation.
**Why it happens:** Each monthly payment's P&I split involves rounding, and over 300 payments small differences accumulate.
**How to avoid:** On the final payment, check if the remaining balance is less than the regular payment. If so, the final payment = remaining balance + final interest. This ensures the loan pays off exactly to $0.00.
**Warning signs:** Amortization schedule ends with a negative balance or a large final payment.

### Pitfall 6: BC Property Transfer Tax Has Two "Over $2M" Tiers
**What goes wrong:** Missing the additional 2% surcharge on residential properties over $3M.
**Why it happens:** BC has both a general 3% tier above $2M AND an additional 2% (total 5%) on the residential portion above $3M. Easy to miss the second tier.
**How to avoid:** BC brackets should be: 1% on first $200K, 2% on $200K-$2M, 3% on $2M-$3M, 5% (3%+2%) on amount over $3M for residential.
**Warning signs:** BC LTT on $4M property is too low.

### Pitfall 7: Quebec Welcome Tax is Municipal, Not Provincial
**What goes wrong:** Using a single set of brackets for all of Quebec.
**Why it happens:** Quebec's transfer duty ("droits de mutation") is set by each municipality. Montreal has significantly different (higher) brackets than the provincial default.
**How to avoid:** For v1, use the standard Quebec provincial brackets as default. This is an acceptable simplification since the calculator operates at province level, not city level. Document that Montreal buyers will see lower estimates. Consider noting this limitation.
**Warning signs:** Montreal users report estimates that are too low.

## Code Examples

Verified patterns from official sources:

### Canadian Mortgage Monthly Payment (Complete)
```typescript
// Source: Mike Sukmanowsky's Canadian mortgage guide + verified formula
// https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
import { Decimal } from '@/lib/decimal'

export function calculateMonthlyPayment(
  principal: Decimal,
  annualRatePercent: Decimal,
  amortizationYears: Decimal
): Decimal {
  const annualRate = annualRatePercent.div(100)
  const months = amortizationYears.mul(12)

  // Canadian semi-annual compounding: r_m = (1 + r/2)^(1/6) - 1
  const rm = annualRate.div(2).plus(1)
    .pow(new Decimal(1).div(6))
    .minus(1)

  // PMT = (r_m * P) / (1 - (1 + r_m)^(-n))
  const numerator = rm.mul(principal)
  const denominator = new Decimal(1).minus(
    rm.plus(1).pow(months.neg())
  )

  return numerator.div(denominator)
}

// Validation: $480,000 mortgage (600K - 20% down) at 5.5% for 25 years
// Expected: ~$2,921/month (verify against RBC/TD calculator)
```

### CMHC Insurance Premium Calculation
```typescript
// Source: CMHC official premium table
// https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/premium-information-for-homeowner-and-small-rental-loans

import { Decimal } from '@/lib/decimal'

interface CmhcTier {
  readonly maxLtv: number   // Upper bound of LTV (e.g., 0.65 for up to 65%)
  readonly rate: number     // Premium rate as decimal (e.g., 0.028 for 2.80%)
}

const CMHC_TIERS: readonly CmhcTier[] = [
  { maxLtv: 0.65, rate: 0.0060 },   // Up to 65% LTV
  { maxLtv: 0.75, rate: 0.0170 },   // 65.01% - 75%
  { maxLtv: 0.80, rate: 0.0240 },   // 75.01% - 80%
  { maxLtv: 0.85, rate: 0.0280 },   // 80.01% - 85%
  { maxLtv: 0.90, rate: 0.0310 },   // 85.01% - 90%
  { maxLtv: 0.95, rate: 0.0400 },   // 90.01% - 95%
]

const AMORTIZATION_SURCHARGE = 0.0020  // +0.20% for >25yr amortization

// PST on CMHC premium (paid cash at closing, NOT added to mortgage)
const CMHC_PST_RATES: Record<string, number> = {
  ON: 0.08,  // Ontario 8%
  QC: 0.09,  // Quebec 9%
  SK: 0.06,  // Saskatchewan 6%
}

export function calculateCmhcPremium(
  purchasePrice: Decimal,
  downPaymentPercent: Decimal,
  amortizationYears: Decimal,
  province: string
): { premium: Decimal; pst: Decimal; totalMortgageAddition: Decimal } {
  const downPayment = purchasePrice.mul(downPaymentPercent.div(100))
  const mortgageAmount = purchasePrice.minus(downPayment)
  const ltv = mortgageAmount.div(purchasePrice).toNumber()

  // No CMHC required if down payment >= 20%
  if (ltv <= 0.80) {
    return {
      premium: new Decimal(0),
      pst: new Decimal(0),
      totalMortgageAddition: new Decimal(0),
    }
  }

  // Find applicable tier
  const tier = CMHC_TIERS.find(t => ltv <= t.maxLtv)
  if (!tier) throw new Error(`Invalid LTV: ${ltv}`)

  let rate = new Decimal(tier.rate)

  // Amortization surcharge for >25 years
  if (amortizationYears.gt(25)) {
    rate = rate.plus(AMORTIZATION_SURCHARGE)
  }

  const premium = mortgageAmount.mul(rate)
  const pstRate = CMHC_PST_RATES[province] || 0
  const pst = premium.mul(pstRate)

  return {
    premium,          // Added to mortgage balance
    pst,              // Paid cash at closing
    totalMortgageAddition: premium,  // Only premium goes on mortgage
  }
}
```

### Land Transfer Tax with Marginal Brackets
```typescript
// Source: Provincial government websites (verified via web research)
import { Decimal } from '@/lib/decimal'

export interface TaxBracket {
  readonly from: number
  readonly to: number      // Use Infinity for the last bracket
  readonly rate: number    // As decimal: 0.01 = 1%
}

export function calculateMarginalTax(
  amount: Decimal,
  brackets: readonly TaxBracket[]
): Decimal {
  let tax = new Decimal(0)

  for (const bracket of brackets) {
    const from = new Decimal(bracket.from)
    const to = bracket.to === Infinity
      ? amount
      : Decimal.min(new Decimal(bracket.to), amount)

    if (amount.lte(from)) break

    const taxable = to.minus(from)
    tax = tax.plus(taxable.mul(bracket.rate))
  }

  return tax
}

// Ontario example: $500,000 purchase price
// 0.5% on $0-$55K = $275
// 1.0% on $55K-$250K = $1,950
// 1.5% on $250K-$400K = $2,250
// 2.0% on $400K-$500K = $2,000
// Total = $6,475
```

### Year-by-Year Amortization (Principal vs Interest Split)
```typescript
// Source: Standard amortization schedule pattern
import { Decimal } from '@/lib/decimal'

export interface MonthlyPaymentBreakdown {
  month: number
  payment: Decimal
  principal: Decimal
  interest: Decimal
  remainingBalance: Decimal
}

export function generateAmortizationSchedule(
  principal: Decimal,
  annualRatePercent: Decimal,
  amortizationYears: Decimal
): MonthlyPaymentBreakdown[] {
  const annualRate = annualRatePercent.div(100)
  const totalMonths = amortizationYears.mul(12).toNumber()

  // Effective monthly rate (Canadian semi-annual compounding)
  const rm = annualRate.div(2).plus(1)
    .pow(new Decimal(1).div(6))
    .minus(1)

  const monthlyPayment = calculateMonthlyPayment(
    principal, annualRatePercent, amortizationYears
  )

  const schedule: MonthlyPaymentBreakdown[] = []
  let balance = principal

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance.mul(rm)
    let payment = monthlyPayment
    let principalPortion = payment.minus(interest)

    // Final payment adjustment
    if (balance.minus(principalPortion).lt(0)) {
      payment = balance.plus(interest)
      principalPortion = balance
    }

    balance = balance.minus(principalPortion)

    schedule.push({
      month,
      payment,
      principal: principalPortion,
      interest,
      remainingBalance: Decimal.max(balance, new Decimal(0)),
    })

    if (balance.lte(0)) break
  }

  return schedule
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| US-style monthly compounding for Canadian calc | Semi-annual compounding legally mandated | Always been law (Interest Act s.6) | Must use correct formula from day one |
| CMHC max purchase price $999,999 | Max insurable price $1,499,999 (since Dec 15, 2024) | Dec 2024 | Higher purchase prices now eligible for CMHC insurance |
| CMHC max amortization 25 years | 30-year amortization for first-time buyers (since Aug 2024) | Aug 2024 | Amortization surcharge of +0.20% applies to 26-30yr terms |
| BC FTHB exemption up to $500K | BC FTHB exemption up to $835K (partial to $860K) | Apr 1, 2024 | Significantly more BC buyers qualify for full exemption |
| Manitoba had PST on CMHC | Manitoba eliminated PST on CMHC | 2020 | Only ON, QC, SK charge PST on CMHC premium now |

**Deprecated/outdated:**
- CMHC $999,999 purchase price cap: Replaced with $1,499,999 as of December 15, 2024
- BC FTHB $500K full exemption threshold: Now $835K as of April 1, 2024 (with max $8,000 rebate for $500K-$835K)
- Manitoba PST on CMHC: Eliminated in 2020

## Province Data Reference

### Land Transfer Tax Brackets by Province

**Ontario (ON):**
| From | To | Rate |
|------|-----|------|
| $0 | $55,000 | 0.5% |
| $55,001 | $250,000 | 1.0% |
| $250,001 | $400,000 | 1.5% |
| $400,001 | $2,000,000 | 2.0% |
| $2,000,001+ | - | 2.5% |
FTHB rebate: Up to $4,000 (full exemption up to $368,333)

**British Columbia (BC):**
| From | To | Rate |
|------|-----|------|
| $0 | $200,000 | 1.0% |
| $200,001 | $2,000,000 | 2.0% |
| $2,000,001 | $3,000,000 | 3.0% |
| $3,000,001+ | - | 5.0% (3% general + 2% residential) |
FTHB rebate: Full exemption up to $835,000; partial $835K-$860K; max rebate $8,000

**Quebec (QC) -- Standard provincial brackets:**
| From | To | Rate |
|------|-----|------|
| $0 | $61,500 | 0.5% |
| $61,501 | $307,800 | 1.0% |
| $307,801+ | - | 1.5% |
Note: Municipal variation exists (Montreal has higher tiers). No FTHB rebate.

**Manitoba (MB):**
| From | To | Rate |
|------|-----|------|
| $0 | $30,000 | 0% |
| $30,001 | $90,000 | 0.5% |
| $90,001 | $150,000 | 1.0% |
| $150,001 | $200,000 | 1.5% |
| $200,001+ | - | 2.0% |
No FTHB rebate. Additional registration fee ~$70.

**New Brunswick (NB):**
Flat 1% of purchase price. No FTHB rebate.

**Nova Scotia (NS):**
Municipal deed transfer tax -- rate varies by municipality (0.5% to 1.5%). Halifax: 1.5%. For v1, use 1.5% as default (most buyers are in Halifax). No FTHB rebate.

**Prince Edward Island (PE):**
Flat 1% of purchase price. FTHB rebate: Full exemption for eligible first-time buyers.

**Newfoundland & Labrador (NL):**
Registration fee: $100 base + $0.40 per $100 of value over $500. Very low cost. No FTHB rebate. Max fee $5,000.

**Alberta (AB):**
No land transfer tax. Registration fees only: $50 + $5 per $5,000 of property value. Mortgage registration: $50 + $5 per $5,000 of mortgage. No FTHB rebate.

**Saskatchewan (SK):**
No land transfer tax. Title transfer fee: $25 for first $6,300; 0.4% on amounts over $6,300. No FTHB rebate.

### Recommended Default Financial Assumptions

| Parameter | Default | Source/Rationale |
|-----------|---------|------------------|
| Mortgage rate | 5.5% | Typical 5-year fixed rate in 2025-2026 (already set in defaults.ts) |
| Amortization | 25 years | Canadian standard (already set) |
| Property tax rate | 1.0% | Conservative middle estimate for Canadian municipalities |
| Home maintenance | 1.0% of home value/year | Industry standard (1-2% range, 1% is conservative) |
| Home insurance | $2,400/year ($200/month) | Typical Canadian homeowner insurance |
| Home appreciation | 3.0% nominal/year | Long-term Canadian average is ~3-5% nominal |
| Rent increase | 2.0%/year | Aligns with Bank of Canada CPI target |
| Inflation rate | 2.0%/year | Bank of Canada's target rate |
| Realtor commission (selling) | 5.0% | Typical Canadian commission (split buyer/seller agent) |
| Legal fees (buying) | $2,000 | Mid-range for Canadian real estate closing |
| Legal fees (selling) | $1,000 | Typically less than buying |
| Home inspection | $500 | Mid-range estimate |
| Title insurance | $300 | Typical one-time cost |

### Recommended Closing Cost Model

**Buying costs (itemized for transparency, but shown as grouped total):**
1. Land transfer tax (calculated per province) -- CALC-03
2. Legal fees -- $2,000 default
3. Home inspection -- $500 default
4. Title insurance -- $300 default
5. CMHC PST (if applicable) -- calculated per province
6. Appraisal fee -- $0 default (usually covered by lender)

**Selling costs (applied at end of time horizon):**
1. Realtor commission -- 5% of sale price default
2. Legal fees -- $1,000 default
3. Mortgage discharge fee -- $300 default

**Sale/exit modeling recommendation:**
- At time horizon end, calculate: `netProceeds = homeValue - remainingMortgage - sellingCosts`
- Apply principal residence exemption (no capital gains tax on primary home in Canada)
- Do NOT model mortgage penalty -- assume sale aligns with term renewal (simplification)
- Do NOT include condo fees as a separate line item in v1 -- user can mentally add to maintenance %

## Open Questions

1. **Quebec bracket thresholds may be indexed annually**
   - What we know: Quebec adjusts transfer duty brackets by CPI yearly. The $61,500 / $307,800 thresholds are approximate for 2025-2026.
   - What's unclear: Exact 2026 indexed amounts.
   - Recommendation: Use current known thresholds. Add a comment that these are indexed annually. Acceptable accuracy for a comparison tool.

2. **Nova Scotia municipal variation**
   - What we know: Deed transfer tax rate varies by municipality (0.5% to 1.5%). Halifax is 1.5%.
   - What's unclear: Whether to model multiple municipalities or use a single default.
   - Recommendation: Use 1.5% (Halifax rate) as default for Nova Scotia. This is the most common scenario and the calculator operates at province level. Note: most NS property transactions occur in Halifax.

3. **CMHC purchase price cap interaction with calculator**
   - What we know: CMHC insurance is only available for purchase prices up to $1,499,999 (as of Dec 2024). Down payment < 20% requires insurance.
   - What's unclear: Should the calculator warn/error if user enters $1.5M+ with <20% down?
   - Recommendation: Implement validation: if purchasePrice > $1,499,999 AND downPaymentPercent < 20%, CMHC cannot be obtained. Set CMHC premium to 0 and potentially flag for UI to display warning in Phase 4+.

4. **Territories (YT, NT, NU)**
   - What we know: Very small population (~120,000 total). Different tax structures.
   - What's unclear: Whether the effort to research territory-specific rules is justified for v1.
   - Recommendation: Exclude territories from v1. Focus on the 10 provinces. Can add later if requested.

5. **Validation test cases for bank calculator matching**
   - What we know: Success criteria requires matching RBC/TD within $1/month.
   - What's unclear: Don't have pre-computed RBC/TD outputs for specific scenarios.
   - Recommendation: After implementing the mortgage function, manually verify against RBC mortgage calculator (apps.royalbank.com) with 3-5 representative scenarios: (1) $500K at 5.5%/25yr, (2) $300K at 4.5%/25yr, (3) $800K at 6.0%/30yr, (4) $200K at 3.5%/20yr. Document expected outputs as test constants.

## Sources

### Primary (HIGH confidence)
- [CMHC Official Premium Table](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/premium-information-for-homeowner-and-small-rental-loans) - Premium rates, surcharges, PST rules
- [Mike Sukmanowsky's Canadian Mortgage Guide](https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations) - Complete TypeScript implementation with semi-annual compounding formula
- [BC Government FTHB Exemption](https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount) - Updated $835K threshold (April 2024)
- [Manitoba Government LTT](https://www.gov.mb.ca/finance/other/landtransfertax.html) - Official bracket thresholds
- [PEI Government FTHB Exemption](https://www.princeedwardisland.ca/en/information/finance/real-property-transfer-tax-first-time-home-buyers-exemption) - Eligibility criteria
- [Decimal.js API Documentation](https://github.com/mikemcl/decimal.js) via Context7 - pow(), toFixed(), precision configuration

### Secondary (MEDIUM confidence)
- [Loans Canada - Provincial LTT Overview](https://loanscanada.ca/mortgage/land-transfer-tax/) - All-province bracket data (cross-verified with official sources for ON, BC, MB)
- [Nesto.ca - PST on CMHC](https://www.nesto.ca/home-buying/provincial-sales-tax-pst-on-mortgage-default-insurance/) - ON 8%, QC 9%, SK 6% PST rates
- [Ratehub.ca - Land Transfer Tax](https://www.ratehub.ca/land-transfer-tax) - Ontario brackets and FTHB rebate
- [WOWA.ca - CMHC Calculator](https://wowa.ca/calculators/cmhc-insurance) - CMHC tier validation
- [York University Mortgage Reference](https://www.yorku.ca/amarshal/mortgage.htm) - Academic verification of Canadian compounding formula
- [StatsCan CPI Annual Review 2025](https://www150.statcan.gc.ca/n1/daily-quotidien/260119/dq260119b-eng.htm) - CPI 2.1% in 2025

### Tertiary (LOW confidence)
- Quebec welcome tax thresholds ($61,500 / $307,800) - sourced from aggregator sites, may be indexed annually. Verify against Quebec government gazette before shipping.
- Nova Scotia municipal rates beyond Halifax - only Halifax rate (1.5%) verified. Other municipalities need direct verification if expanded.
- Newfoundland registration fee cap ($5,000) - sourced from aggregator, not directly verified with NL government.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - decimal.js is already installed and configured. No new libraries needed.
- Architecture: HIGH - Pure calculation functions with typed data constants is a well-established pattern. Existing codebase already follows this structure.
- Pitfalls: HIGH - Canadian mortgage compounding is extensively documented. CMHC rates come from official source. LTT brackets verified against multiple sources.
- Province data: MEDIUM - Most province data verified against official sources, but Quebec thresholds may be slightly stale (indexed annually) and NS varies by municipality.

**Research date:** 2026-02-24
**Valid until:** 2026-04-24 (60 days -- province data stable, CMHC rates updated infrequently)
