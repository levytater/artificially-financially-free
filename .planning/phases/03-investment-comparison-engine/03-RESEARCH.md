# Phase 3: Investment & Comparison Engine - Research

**Researched:** 2026-02-25
**Domain:** Investment return modeling, Canadian income tax estimation, rent-vs-buy net worth comparison
**Confidence:** HIGH

## Summary

Phase 3 builds the comparison engine that takes the housing cost projection from Phase 2 and produces a full rent-vs-buy net worth comparison. The engine has four core calculation domains: (1) Canadian income tax estimation for the renter's investment gains, (2) investment portfolio growth with after-tax returns, (3) year-by-year net worth comparison between renter and buyer, and (4) break-even analysis. This is a calculation-only phase -- no UI, no charts.

The investment model has been simplified from the original three-account-type design (TFSA/RRSP/Non-registered) to a single portfolio with return % and tax rate %. This matches the reference Excel file approach. The key tax math: capital gains in Canada use a 50% inclusion rate (only half of gains are taxable), so the after-tax return formula is `afterTaxReturn = return * (1 - taxRate * 0.5)`. The tax rate itself is auto-calculated from combined federal + provincial marginal rates using the user's annual income and province, with manual override support.

The existing codebase provides a strong foundation: `calculateMarginalTax()` in `land-transfer-tax.ts` is a generic marginal bracket calculator already designed for reuse with income tax brackets. The `TaxBracket` interface, `Decimal.js` configuration, and test patterns from Phase 2 all carry forward directly. The main new data requirement is federal + provincial income tax brackets for all 10 provinces (researched and verified below).

**Primary recommendation:** Extend the existing calculation module pattern -- one file per domain (`income-tax.ts`, `investment.ts`, `comparison.ts`) with a final orchestrator function that composes Phase 2's `HousingProjection` + rent schedule + investment growth into a complete comparison result. Store all tax bracket data as typed constants in `src/lib/data/income-tax-brackets.ts`, reusing the existing `TaxBracket` interface.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **No account types.** Drop TFSA/RRSP/Non-registered distinction entirely
- Single investment portfolio with two inputs: **return %** and **tax rate %**
- Engine calculates after-tax return using capital gains 50% inclusion rate: `after_tax_return = return * (1 - tax_rate * 0.5)`
- Both return % and tax rate % visible in Simple and Advanced mode (not hidden)
- This replaces the original three-account model -- simpler, matches the Excel reference file approach
- **Auto-calculate** combined federal + provincial marginal tax rate from user's annual income + province
- Use **2025 tax brackets, hardcoded** -- federal and all provincial brackets
- User can **override** the auto-calculated rate with a manual tax rate input
- Capital gains **50% inclusion rate** applied to investment returns before tax
- **Lump sum investment on day 1:** Down payment + closing costs the buyer would have spent -- invested immediately
- **Monthly contributions:** Each month, difference between total buyer costs (mortgage + property tax + maintenance + insurance) and rent -- invested monthly
- Both components compound together as one portfolio at the after-tax return rate
- **Negative monthly savings -> zero:** When buyer costs are less than rent in a given month, no new investment but no withdrawal either. Portfolio keeps compounding
- Engine supports **two modes:** with and without selling costs at any given year for buyer net worth
- With selling costs: buyer net worth = home value - mortgage balance - selling costs (realtor commission + legal fees)
- Without selling costs: buyer net worth = home value - mortgage balance
- Phase 4 will expose this as a user toggle; engine must support both calculations
- First year where buying net worth exceeds renting net worth; if never: report "never"
- Engine always calculates in **nominal (unadjusted) dollars** internally
- **Toggle for "real dollars" view:** divides displayed values by (1 + inflation)^year
- Deflate displayed values only -- do NOT reduce the investment return rate
- Default inflation rate: **2.5%** (slightly above Bank of Canada 2% target)
- Inflation rate is **user-adjustable**

### Claude's Discretion
- Internal data structure for year-by-year results (array of objects, typed interfaces, etc.)
- How to structure the tax bracket lookup tables
- Compounding frequency for investment calculations (monthly vs annual)
- Edge case handling (zero time horizon, 0% return, 100% down payment)

### Deferred Ideas (OUT OF SCOPE)
- TFSA/RRSP/Non-registered account separation -- could be a future Advanced+ mode or v2 feature
- RRSP Home Buyer Plan (HBP) withdrawal modeling -- already listed as v2 requirement UX-07
- Per-account different return rates -- dropped with the account type simplification
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CALC-08 | Break-even year identified as the first year where buying net worth exceeds renting net worth | Simple array scan: iterate year-by-year comparison, find first year where `buyerNetWorth > renterNetWorth`. Return year number or "never" if never found. Both with-selling-costs and without-selling-costs modes must be supported per CONTEXT.md. |
| CALC-09 | Renter's monthly savings (difference between buyer costs and rent) invested and compounded over time | Monthly savings = max(0, buyerMonthlyCost - monthlyRent). Lump sum on day 1 = downPayment + closingCosts. Both compound in one portfolio at after-tax return rate. Phase 2's `YearlyHousingCost.totalAnnualCost` and rent schedule provide the inputs. Monthly compounding recommended. |
| CALC-10 | Year-by-year net worth comparison produced for both renter (investment portfolio) and buyer (home equity minus costs) | Renter net worth = portfolio value at year end. Buyer net worth = homeValue - remainingBalance (without selling costs) or homeValue - remainingBalance - sellingCosts (with). Phase 2's `HousingProjection.yearlyProjection` already has homeEquity. Engine produces both modes per CONTEXT.md. |
| CALC-12 | Investment returns modeled (originally across three account types -- SIMPLIFIED per CONTEXT.md to single portfolio with return % + tax rate %) | Single portfolio model. After-tax annual return = `nominalReturn * (1 - marginalTaxRate * capitalGainsInclusionRate)` where inclusionRate = 0.5. Monthly compounding: `monthlyRate = (1 + annualAfterTaxReturn)^(1/12) - 1`. Portfolio grows from lump sum + monthly contributions. |
| CALC-13 | Federal and provincial income tax estimated on investment gains using user's annual income and province | Reuse existing `calculateMarginalTax()` with new income tax bracket data. Auto-calculate combined marginal rate: run income through federal brackets + provincial brackets, sum the marginal rates at user's income level. All 10 provinces + federal 2025 brackets hardcoded. User can override with manual rate. |
| CALC-14 | Inflation adjustment applied to normalize future dollar values to present purchasing power | Deflation-only display adjustment: `realValue = nominalValue / (1 + inflationRate)^year`. Internal calculations always nominal. Default inflation 2.5%. Function takes any nominal value + year + inflation rate, returns real value. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| decimal.js | ^10.6.0 | Arbitrary-precision arithmetic for all financial calculations | Already installed and configured (precision 20, ROUND_HALF_UP). All Phase 2 calculations use it. Investment compounding over 30 years requires it to prevent drift. |
| TypeScript | ^5 | Type-safe interfaces for tax brackets, comparison results, projection data | Already installed. Essential for reusing `TaxBracket` interface and creating new typed result interfaces. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | ^4.0.18 | Test framework for pure calculation functions | Already installed with `@` path alias configured. All new calculation functions need unit tests. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hardcoded tax brackets | External tax API | User's CONTEXT.md explicitly requires hardcoded 2025 brackets. API would add latency, cost, and a runtime dependency for a static dataset that changes once per year. |
| Custom marginal tax calc | tax-brackets npm package | No established Canadian tax bracket library exists. The generic `calculateMarginalTax()` from Phase 2 already does this correctly with Decimal.js precision. |

**Installation:**
```bash
# No new packages needed -- all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── calculations/
│   │   ├── income-tax.ts          # NEW: marginal tax rate estimation
│   │   ├── investment.ts          # NEW: portfolio growth with after-tax returns
│   │   ├── comparison.ts          # NEW: rent-vs-buy orchestrator + break-even
│   │   ├── inflation.ts           # NEW: nominal-to-real deflation
│   │   ├── housing-projection.ts  # EXISTING: Phase 2 orchestrator (consumed)
│   │   ├── mortgage.ts            # EXISTING: consumed by housing-projection
│   │   ├── rent.ts                # EXISTING: consumed by comparison
│   │   └── ...                    # EXISTING: other Phase 2 modules
│   └── data/
│       ├── income-tax-brackets.ts # NEW: federal + provincial 2025 brackets
│       ├── ltt-brackets.ts        # EXISTING: land transfer tax brackets
│       ├── provinces.ts           # EXISTING: province codes, names, defaults
│       └── ...                    # EXISTING: other Phase 2 data
├── types/
│   ├── housing.ts                 # EXISTING: TaxBracket, HousingProjection, etc.
│   ├── investment.ts              # NEW: investment/comparison result types
│   └── calculator.ts              # EXISTING: CalculatorState (may need new fields)
└── __tests__/
    └── calculations/
        ├── income-tax.test.ts     # NEW
        ├── investment.test.ts     # NEW
        ├── comparison.test.ts     # NEW
        ├── inflation.test.ts      # NEW
        └── ...                    # EXISTING Phase 2 tests
```

### Pattern 1: Pure Calculation Function with Decimal.js
**What:** Every calculation function takes typed inputs (numbers or Decimals), returns typed Decimal results, has no side effects.
**When to use:** All financial calculations in this phase.
**Example:**
```typescript
// Source: Existing pattern from src/lib/calculations/appreciation.ts
import { Decimal } from '@/lib/decimal'

export function calculateAfterTaxReturn(
  nominalReturnPercent: Decimal,
  marginalTaxRatePercent: Decimal,
  capitalGainsInclusionRate: Decimal
): Decimal {
  // after_tax = nominal * (1 - taxRate * inclusionRate)
  const nominalRate = nominalReturnPercent.div(100)
  const taxRate = marginalTaxRatePercent.div(100)
  const taxDrag = taxRate.mul(capitalGainsInclusionRate)
  return nominalRate.mul(new Decimal(1).minus(taxDrag))
}
```

### Pattern 2: Data File as Typed Constant Object
**What:** Tax bracket data stored as a `Record<ProvinceCode, TaxBracket[]>` constant, just like `LTT_CONFIG` in `ltt-brackets.ts`.
**When to use:** For all 10 provincial bracket sets + federal brackets.
**Example:**
```typescript
// Source: Pattern from src/lib/data/ltt-brackets.ts
import type { ProvinceCode, TaxBracket } from '@/types/housing'

export const FEDERAL_TAX_BRACKETS: readonly TaxBracket[] = [
  { from: 0, to: 57375, rate: 0.15 },
  { from: 57375, to: 114750, rate: 0.205 },
  { from: 114750, to: 177882, rate: 0.26 },
  { from: 177882, to: 253414, rate: 0.29 },
  { from: 253414, to: Infinity, rate: 0.33 },
] as const

export const PROVINCIAL_TAX_BRACKETS: Readonly<Record<ProvinceCode, readonly TaxBracket[]>> = {
  ON: [
    { from: 0, to: 52886, rate: 0.0505 },
    { from: 52886, to: 105775, rate: 0.0915 },
    // ...
  ],
  // ... all 10 provinces
}
```

### Pattern 3: Orchestrator Function Composing Domain Functions
**What:** A single top-level function that takes all inputs, calls domain-specific calculation functions, and returns a complete typed result.
**When to use:** For the final comparison orchestrator (same pattern as `calculateHousingProjection()`).
**Example:**
```typescript
// Source: Pattern from src/lib/calculations/housing-projection.ts
export function calculateRentVsBuyComparison(
  input: ComparisonInput
): ComparisonResult {
  // 1. Calculate housing projection (Phase 2)
  const housing = calculateHousingProjection(housingInput)
  // 2. Calculate rent schedule
  const rentSchedule = calculateRentSchedule(...)
  // 3. Calculate marginal tax rate
  const marginalRate = calculateCombinedMarginalRate(...)
  // 4. Calculate investment portfolio growth
  const portfolio = calculatePortfolioGrowth(...)
  // 5. Build year-by-year comparison
  const comparison = buildYearlyComparison(...)
  // 6. Find break-even year
  const breakEven = findBreakEvenYear(comparison)
  return { housing, portfolio, comparison, breakEven, ... }
}
```

### Pattern 4: Reusing calculateMarginalTax for Income Tax
**What:** The generic `calculateMarginalTax(amount, brackets)` already in `land-transfer-tax.ts` works for any progressive bracket system -- LTT, income tax, etc.
**When to use:** For calculating both federal and provincial income tax from income + brackets.
**Important:** The function should be moved to a shared location (or re-exported) since it was designed for reuse (per STATE.md: "Generic calculateMarginalTax designed for Phase 3 income tax reuse").

### Anti-Patterns to Avoid
- **Mixing nominal and real dollars in the same data structure:** Keep all internal calculations in nominal dollars. Apply inflation deflation only at the display/output layer. Never deflate the investment return rate.
- **Using native JS arithmetic on financial values:** All money math must use Decimal.js. Even intermediate calculations like `annualCost / 12` must use `Decimal.div(12)`.
- **Embedding tax bracket data inline in calculation functions:** All bracket data must live in `src/lib/data/` as typed constants, separate from calculation logic.
- **Annual compounding for investment returns:** Monthly compounding is more accurate for a tool that models monthly contributions. The contribution timing matters when thousands of dollars are added each month.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Marginal tax calculation | Custom loop per province | `calculateMarginalTax()` from `land-transfer-tax.ts` | Already tested, handles edge cases (amount below first bracket, Infinity in last bracket), uses Decimal.js. |
| Decimal arithmetic | Native JS `+`, `-`, `*`, `/` | `Decimal.js` `.plus()`, `.minus()`, `.mul()`, `.div()` | 30-year compound growth accumulates floating-point errors. Decimal.js maintains precision across hundreds of multiplications. |
| Month-by-month investment loop | Annual approximation formula | Explicit monthly loop with Decimal.js | Monthly contributions make closed-form formulas fragile. An explicit loop is clearer, testable, and handles variable monthly savings (which change yearly as rent increases and post-amortization mortgage drops to $0). |

**Key insight:** The monthly savings vary year-to-year (rent increases, buyer costs change, mortgage eventually hits $0), so a closed-form annuity formula won't work cleanly. An explicit month-by-month loop is simpler, more transparent, and easier to test.

## Common Pitfalls

### Pitfall 1: Confusing Marginal Rate with Average/Effective Rate
**What goes wrong:** Using the average tax rate (total tax / total income) instead of the marginal rate (tax rate on the last dollar earned). For capital gains estimation, the marginal rate is what matters because gains are added on top of employment income.
**Why it happens:** Average rate is simpler to calculate and seems "more fair". But capital gains are taxed at the margin -- they stack on top of the user's salary income.
**How to avoid:** Calculate marginal rate by finding which bracket the user's income falls into, then sum the federal bracket rate + provincial bracket rate at that income level. This is the rate that applies to additional investment income.
**Warning signs:** Tax rate seems too low (e.g., 20% combined for someone earning $100K).

### Pitfall 2: Double-Counting the Down Payment
**What goes wrong:** The renter invests the down payment amount, but also includes it in the monthly savings calculation by comparing buyer's total costs (which include mortgage payments on the full purchase price) against rent.
**Why it happens:** The down payment is a lump sum that the renter invests on day 1. Separately, the renter also invests the monthly difference between buyer costs and rent. These are independent and both should be included -- this is NOT double-counting.
**How to avoid:** Be explicit: lump sum = downPayment + buyingClosingCosts (what the buyer pays cash upfront). Monthly savings = buyerMonthlyCost - rent (ongoing difference). Both flow into the same portfolio.
**Warning signs:** If the initial lump sum is suspiciously large or small, check that closing costs are included/excluded consistently.

### Pitfall 3: Forgetting Post-Amortization Years
**What goes wrong:** After the mortgage is paid off, buyer's monthly costs drop dramatically (no more mortgage payments). If the time horizon extends past amortization, the monthly savings for the renter decrease or go negative.
**Why it happens:** Phase 2 already handles this (`mortgagePayment = $0` for post-amortization years), but the comparison engine must correctly read those $0 values and compute lower monthly savings.
**How to avoid:** Use Phase 2's `YearlyHousingCost.totalAnnualCost` directly -- it already handles post-amortization years correctly. Don't re-derive mortgage payments.
**Warning signs:** Break-even year seems too late, or renter always wins even over 30 years.

### Pitfall 4: Applying Inflation Deflation to the Return Rate
**What goes wrong:** Reducing the nominal investment return by inflation to get "real returns", which double-counts inflation because the comparison already uses nominal dollars on both sides.
**Why it happens:** Intuition says "real returns matter". But if home appreciation, rent increases, and all other values are in nominal dollars, then deflating only the investment return skews the comparison against renting.
**How to avoid:** Per CONTEXT.md: deflate DISPLAYED values only, using `realValue = nominalValue / (1 + inflation)^year`. Never touch the return rate. Both sides get deflated equally.
**Warning signs:** Renting looks much worse than expected when inflation adjustment is on.

### Pitfall 5: Not Handling Negative Monthly Savings
**What goes wrong:** When rent exceeds buyer costs (e.g., post-amortization), the "monthly savings" goes negative, and the engine tries to withdraw from the portfolio.
**Why it happens:** In some scenarios (low home price, high rent), buying can be cheaper monthly.
**How to avoid:** Per CONTEXT.md: `monthlyContribution = max(0, buyerCost - rent)`. Never withdraw. The portfolio keeps compounding on its existing balance.
**Warning signs:** Portfolio value decreases in later years when it should only grow.

### Pitfall 6: Off-by-One in Year Indexing
**What goes wrong:** Housing projection uses year 1-N, rent schedule uses year 0-N, comparison tries to align them and gets off by one.
**Why it happens:** Phase 2's `YearlyHousingCost` array is 0-indexed but `.year` property starts at 1. Rent schedule from `calculateRentSchedule()` includes year 0 (initial rent).
**How to avoid:** Document the indexing convention clearly. For the comparison: year 1 of comparison = year 1 of housing projection = year 1 of rent schedule (skip year 0 of rent for annual totals, but use year 0's monthlyRent for month-by-month calculations within year 1).
**Warning signs:** First year's numbers look wrong, or array lengths don't match.

## Code Examples

Verified patterns from the existing codebase and financial math:

### Combined Marginal Tax Rate Calculation
```typescript
// Reuses calculateMarginalTax from land-transfer-tax.ts
// Source: existing pattern + standard Canadian tax math
import { Decimal } from '@/lib/decimal'
import { calculateMarginalTax } from '@/lib/calculations/land-transfer-tax'
import { FEDERAL_TAX_BRACKETS, PROVINCIAL_TAX_BRACKETS } from '@/lib/data/income-tax-brackets'
import type { ProvinceCode } from '@/types/housing'

/**
 * Calculate the combined federal + provincial marginal tax rate
 * for a given annual income and province.
 *
 * Returns the marginal rate as a percentage (e.g., 29.65 for 29.65%).
 */
export function calculateCombinedMarginalRate(
  annualIncome: number,
  province: ProvinceCode
): Decimal {
  const income = new Decimal(annualIncome)

  // Calculate total tax at income and income - $1 to derive marginal rate
  const federalTax = calculateMarginalTax(income, FEDERAL_TAX_BRACKETS)
  const provincialTax = calculateMarginalTax(income, PROVINCIAL_TAX_BRACKETS[province])

  const incomeMinus1 = income.minus(1)
  const federalTaxMinus1 = calculateMarginalTax(incomeMinus1, FEDERAL_TAX_BRACKETS)
  const provincialTaxMinus1 = calculateMarginalTax(incomeMinus1, PROVINCIAL_TAX_BRACKETS[province])

  // Marginal rate = tax on last dollar = totalTax(income) - totalTax(income - 1)
  const marginalFederal = federalTax.minus(federalTaxMinus1)
  const marginalProvincial = provincialTax.minus(provincialTaxMinus1)

  return marginalFederal.plus(marginalProvincial).mul(100)
}
```

**Alternative (simpler, recommended):** Instead of the delta approach, find which bracket the income falls into directly:
```typescript
/**
 * Find the marginal rate for a given income in a bracket set.
 * Returns the rate as a decimal (e.g., 0.15 for 15%).
 */
function findMarginalRate(income: Decimal, brackets: readonly TaxBracket[]): Decimal {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income.gt(brackets[i].from)) {
      return new Decimal(brackets[i].rate)
    }
  }
  return new Decimal(brackets[0].rate) // fallback: lowest bracket
}

export function calculateCombinedMarginalRate(
  annualIncome: number,
  province: ProvinceCode
): Decimal {
  const income = new Decimal(annualIncome)
  const federalRate = findMarginalRate(income, FEDERAL_TAX_BRACKETS)
  const provincialRate = findMarginalRate(income, PROVINCIAL_TAX_BRACKETS[province])
  return federalRate.plus(provincialRate).mul(100) // return as percentage
}
```

### Investment Portfolio Growth (Monthly Compounding)
```typescript
// Source: standard compound interest math with monthly contributions
import { Decimal } from '@/lib/decimal'

interface PortfolioYear {
  year: number
  startBalance: Decimal
  contributions: Decimal
  growth: Decimal
  endBalance: Decimal
}

/**
 * Calculate monthly investment portfolio growth.
 *
 * @param initialLumpSum - Day-1 investment (down payment + closing costs)
 * @param yearlyMonthlySavings - Array of monthly savings amounts per year
 *                                (length = timeHorizon, index 0 = year 1)
 * @param annualAfterTaxReturn - After-tax annual return as decimal (e.g., 0.045 for 4.5%)
 * @returns Array of yearly portfolio snapshots
 */
export function calculatePortfolioGrowth(
  initialLumpSum: Decimal,
  yearlyMonthlySavings: Decimal[],
  annualAfterTaxReturn: Decimal
): PortfolioYear[] {
  const monthlyRate = annualAfterTaxReturn.plus(1).pow(
    new Decimal(1).div(12)
  ).minus(1)

  let balance = initialLumpSum
  const results: PortfolioYear[] = []

  for (let yearIdx = 0; yearIdx < yearlyMonthlySavings.length; yearIdx++) {
    const startBalance = balance
    const monthlySaving = yearlyMonthlySavings[yearIdx]
    let yearContributions = new Decimal(0)

    for (let month = 0; month < 12; month++) {
      // Compound existing balance
      balance = balance.mul(monthlyRate.plus(1))
      // Add monthly contribution (clamped to >= 0 by caller)
      balance = balance.plus(monthlySaving)
      yearContributions = yearContributions.plus(monthlySaving)
    }

    results.push({
      year: yearIdx + 1,
      startBalance,
      contributions: yearContributions,
      growth: balance.minus(startBalance).minus(yearContributions),
      endBalance: balance,
    })
  }

  return results
}
```

### Inflation Deflation
```typescript
// Source: standard present-value deflation formula
import { Decimal } from '@/lib/decimal'

/**
 * Convert a nominal future value to real (today's) dollars.
 *
 * realValue = nominalValue / (1 + inflationRate)^year
 *
 * @param nominalValue - The future dollar amount
 * @param inflationRatePercent - Annual inflation rate as percentage (e.g., 2.5)
 * @param year - Number of years in the future
 * @returns Value in today's purchasing power
 */
export function deflateToRealDollars(
  nominalValue: Decimal,
  inflationRatePercent: Decimal,
  year: number
): Decimal {
  const rate = inflationRatePercent.div(100)
  const deflator = rate.plus(1).pow(year)
  return nominalValue.div(deflator)
}
```

### Break-Even Year Detection
```typescript
// Source: standard comparison logic
export function findBreakEvenYear(
  yearlyComparison: YearlyComparison[]
): number | 'never' {
  for (const year of yearlyComparison) {
    if (year.buyerNetWorth.gte(year.renterNetWorth)) {
      return year.year
    }
  }
  return 'never'
}
```

## 2025 Canadian Income Tax Brackets (Verified Data)

### Federal Brackets
| From | To | Rate |
|------|----|------|
| $0 | $57,375 | 15.0% |
| $57,375 | $114,750 | 20.5% |
| $114,750 | $177,882 | 26.0% |
| $177,882 | $253,414 | 29.0% |
| $253,414 | Infinity | 33.0% |

Source: Fidelity.ca 2025 Canadian income tax brackets, cross-verified with Wealthsimple and TaxTips.ca.

**Note on 2025 rate change:** The federal government reduced the lowest bracket from 15% to 14% effective July 1, 2025, making the effective 2025 rate 14.5%. For 2026+, the rate is 14%. Since this is a forward-looking estimation tool (not a tax filing calculator), I recommend using the standard published **15%** rate for the 2025 bracket set. This is the rate shown on Fidelity.ca and other major sources. If the user wants more precision, the bracket data can be updated annually.

### Provincial Brackets (All 10 Provinces)

**Alberta:**
| From | To | Rate |
|------|----|------|
| $0 | $151,234 | 10.0% |
| $151,234 | $181,481 | 12.0% |
| $181,481 | $241,974 | 13.0% |
| $241,974 | $362,961 | 14.0% |
| $362,961 | Infinity | 15.0% |

**British Columbia:**
| From | To | Rate |
|------|----|------|
| $0 | $49,279 | 5.06% |
| $49,279 | $98,560 | 7.70% |
| $98,560 | $113,158 | 10.50% |
| $113,158 | $137,407 | 12.29% |
| $137,407 | $186,306 | 14.70% |
| $186,306 | $259,829 | 16.80% |
| $259,829 | Infinity | 20.50% |

**Manitoba:**
| From | To | Rate |
|------|----|------|
| $0 | $47,564 | 10.80% |
| $47,564 | $101,200 | 12.75% |
| $101,200 | Infinity | 17.40% |

**New Brunswick:**
| From | To | Rate |
|------|----|------|
| $0 | $51,306 | 9.40% |
| $51,306 | $102,614 | 14.00% |
| $102,614 | $190,060 | 16.00% |
| $190,060 | Infinity | 19.50% |

**Newfoundland and Labrador:**
| From | To | Rate |
|------|----|------|
| $0 | $44,192 | 8.70% |
| $44,192 | $88,382 | 14.50% |
| $88,382 | $157,792 | 15.80% |
| $157,792 | $220,910 | 17.80% |
| $220,910 | $282,214 | 19.80% |
| $282,214 | $564,429 | 20.80% |
| $564,429 | $1,128,858 | 21.30% |
| $1,128,858 | Infinity | 21.80% |

**Nova Scotia:**
| From | To | Rate |
|------|----|------|
| $0 | $30,507 | 8.79% |
| $30,507 | $61,015 | 14.95% |
| $61,015 | $95,883 | 16.67% |
| $95,883 | $154,650 | 17.50% |
| $154,650 | Infinity | 21.00% |

**Ontario:**
| From | To | Rate |
|------|----|------|
| $0 | $52,886 | 5.05% |
| $52,886 | $105,775 | 9.15% |
| $105,775 | $150,000 | 11.16% |
| $150,000 | $220,000 | 12.16% |
| $220,000 | Infinity | 13.16% |

**Prince Edward Island:**
| From | To | Rate |
|------|----|------|
| $0 | $33,328 | 9.50% |
| $33,328 | $64,656 | 13.47% |
| $64,656 | $105,000 | 16.60% |
| $105,000 | $140,000 | 17.62% |
| $140,000 | Infinity | 19.00% |

**Quebec:**
| From | To | Rate |
|------|----|------|
| $0 | $53,255 | 14.00% |
| $53,255 | $106,495 | 19.00% |
| $106,495 | $129,590 | 24.00% |
| $129,590 | Infinity | 25.75% |

**Saskatchewan:**
| From | To | Rate |
|------|----|------|
| $0 | $53,463 | 10.50% |
| $53,463 | $152,750 | 12.50% |
| $152,750 | Infinity | 14.50% |

Sources: Fidelity.ca (federal + all provinces), cross-verified with Wealthsimple.com and TaxTips.ca. All figures are 2025 values.

## Capital Gains Taxation in Canada

- **Inclusion rate:** 50% of capital gains are included in taxable income (confirmed: the proposed increase to 66.67% was cancelled as of March 2025)
- **Formula:** `taxableGain = capitalGain * 0.5`; `tax = taxableGain * marginalTaxRate`
- **For the engine:** `afterTaxReturn = nominalReturn * (1 - marginalTaxRate * 0.5)`
- **Primary residence exemption:** No capital gains tax on the sale of a primary residence in Canada. This means the buyer's home equity is not taxed at sale -- only the renter's investment gains are taxed.
- **Timing:** Capital gains are only taxed when realized (sold). For simplicity, the engine applies tax drag annually as if gains are realized each year. This slightly overstates taxes (real investors defer) but is the standard approach for comparison calculators.

Source: Canada.ca Capital Gains publications, confirmed by multiple financial sources.

## Compounding Frequency Recommendation

**Use monthly compounding** for the investment portfolio. Rationale:
1. Monthly contributions are the natural unit (renter saves monthly, not annually)
2. Monthly compounding is more accurate than annual for scenarios with regular contributions
3. The monthly loop is straightforward with Decimal.js
4. Aligns with how real investment accounts compound (daily/continuous, but monthly is a good approximation)

Formula: `monthlyRate = (1 + annualRate)^(1/12) - 1`

This is the same mathematical approach used for the Canadian semi-annual mortgage compounding already in the codebase (`effectiveMonthlyRate` in `decimal.ts`), but simpler since investment compounding doesn't have the semi-annual conversion step.

## Edge Cases to Handle

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Zero time horizon | Return empty comparison, break-even = "never" |
| 0% investment return | Portfolio only grows from contributions (no compounding growth) |
| 0% tax rate | After-tax return equals nominal return |
| 100% down payment | No mortgage, lump sum = full purchase price + closing costs, monthly buyer cost = property tax + maintenance + insurance only |
| Rent exceeds all buyer costs from year 1 | Monthly savings = $0 every month, portfolio only grows from lump sum |
| Time horizon < amortization | Buyer still has mortgage balance at end |
| Time horizon > amortization | Post-amortization years have $0 mortgage, buyer costs drop, renter monthly savings may drop to $0 |
| Very high income (>$250K) | Marginal rate hits top bracket -- should work with the bracket lookup |
| Very low income (<$30K) | Lowest bracket for both federal and provincial |
| Income = $0 | Marginal rate = lowest bracket rate (still valid) |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Three account types (TFSA/RRSP/Non-reg) | Single portfolio with return % + tax rate % | Phase 3 CONTEXT.md decision | Massive simplification. One set of calculations instead of three. Tax treatment abstracted into a single rate. |
| Capital gains 66.67% inclusion rate (proposed) | 50% inclusion rate (confirmed) | March 2025 (cancellation announced) | Use 50%. The proposed increase was cancelled. No legislative change. |
| Federal 15% lowest bracket | 14% effective July 2025, 14.5% blended for 2025 | July 1, 2025 | For hardcoded "2025 brackets", use standard 15% rate per published bracket tables. The 14%/14.5% is a transitional detail. |

**Deprecated/outdated:**
- Three-account investment model: Replaced by single portfolio per CONTEXT.md
- 66.67% capital gains inclusion rate: Never enacted, cancelled March 2025

## Open Questions

1. **Relocating `calculateMarginalTax()`**
   - What we know: The function lives in `land-transfer-tax.ts` but was designed for reuse (per STATE.md)
   - What's unclear: Should it be moved to a shared utility file, or should `income-tax.ts` simply import it from `land-transfer-tax.ts`?
   - Recommendation: Import from `land-transfer-tax.ts` for now. Moving it would change import paths in existing Phase 2 code. If it feels wrong, extract to `src/lib/calculations/tax-utils.ts` and re-export from both modules. LOW priority.

2. **Ontario Surtax**
   - What we know: Ontario has a surtax on top of basic provincial tax (20% of basic tax over $5,315 + 36% of basic tax over $6,802). This is not a bracket -- it's a surcharge on the calculated provincial tax.
   - What's unclear: Whether to include it for more accuracy or skip for simplicity.
   - Recommendation: Skip for v1. The surtax is small (affects incomes ~$90K+) and adds complexity. The auto-calculated rate is already an estimate. Users who care about precision will use the manual override. MEDIUM priority for future improvement.

3. **Quebec Abatement**
   - What we know: Quebec taxpayers receive a 16.5% federal tax abatement because Quebec administers its own income tax. This effectively reduces the federal tax rate for Quebec residents.
   - What's unclear: Whether to model this or let users handle it via the manual override.
   - Recommendation: Skip for v1. The manual override covers this. Note in tooltips that Quebec residents may want to adjust their tax rate. LOW priority.

4. **Selling Costs Inflation Over Time**
   - What we know: The comparison engine needs selling costs at any given year, not just at the time horizon end. Realtor commission is a percentage of home value (which appreciates), but legal fees are fixed amounts.
   - What's unclear: Should legal fees be inflation-adjusted for intermediate years?
   - Recommendation: Use percentage-based selling costs (realtor commission as % of appreciated home value) + fixed legal/discharge fees. Don't inflation-adjust the fixed fees -- they're small relative to the commission. The existing `calculateSellingCosts(salePrice)` already handles this correctly.

## Sources

### Primary (HIGH confidence)
- Fidelity.ca - 2025 federal and provincial income tax brackets for all 10 provinces (https://www.fidelity.ca/en/insights/articles/2025-canadian-income-tax-brackets/)
- Canada.ca - Capital Gains 2025 publication confirming 50% inclusion rate (https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4037/capital-gains.html)
- Canada.ca - Cancellation of proposed capital gains inclusion rate increase (https://www.canada.ca/en/department-finance/news/2025/01/government-of-canada-announces-deferral-in-implementation-of-change-to-capital-gains-inclusion-rate.html)

### Secondary (MEDIUM confidence)
- Wealthsimple - 2025 provincial tax brackets (https://www.wealthsimple.com/en-ca/learn/tax-brackets-canada) - Cross-verified with Fidelity
- TaxTips.ca - Federal rate change details, 14.5% blended rate for 2025 (https://www.taxtips.ca/taxrates/canada.htm) - Cross-verified with CRA sources
- Scotia Wealth Management - Confirmation of capital gains inclusion rate cancellation (https://enrichedthinking.scotiawealthmanagement.com/2025/04/07/cancellation-of-the-proposed-capital-gains-inclusion-rate-increase/)

### Tertiary (LOW confidence)
- None -- all critical findings verified with multiple sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new libraries needed. All Phase 2 tools carry forward.
- Architecture: HIGH - Established patterns from Phase 2 (pure functions, typed constants, orchestrator composition) apply directly. `calculateMarginalTax()` was designed for this exact reuse.
- Tax bracket data: HIGH - Federal and all 10 provincial brackets verified across 3 independent sources (Fidelity, Wealthsimple, TaxTips.ca).
- Capital gains: HIGH - 50% inclusion rate confirmed, 66.67% proposal cancelled per official government sources.
- Pitfalls: HIGH - Based on analysis of the existing codebase architecture, standard financial calculation pitfalls, and the specific CONTEXT.md decisions.

**Research date:** 2026-02-25
**Valid until:** 2027-01-01 (tax brackets change annually; update when 2026 brackets are published)
