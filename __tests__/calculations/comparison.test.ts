/**
 * Tests for rent-vs-buy comparison orchestrator and break-even analysis.
 *
 * This is the Phase 3 capstone: the complete rent-vs-buy calculation that
 * composes all Phase 2 and Phase 3 modules into a single comparison result.
 */
import { describe, it, expect } from 'vitest'
import { Decimal } from '@/lib/decimal'
import {
  calculateRentVsBuyComparison,
  findBreakEvenYear,
} from '@/lib/calculations/comparison'
import type { YearlyComparison, ComparisonInput } from '@/types/investment'

// ---------------------------------------------------------------------------
// findBreakEvenYear tests
// ---------------------------------------------------------------------------

describe('findBreakEvenYear', () => {
  it('returns "never" when buying never wins within time horizon', () => {
    const comparison: YearlyComparison[] = [
      {
        year: 1,
        renterNetWorth: new Decimal(100000),
        buyerNetWorthWithSelling: new Decimal(50000),
        buyerNetWorthWithoutSelling: new Decimal(60000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
      {
        year: 2,
        renterNetWorth: new Decimal(120000),
        buyerNetWorthWithSelling: new Decimal(55000),
        buyerNetWorthWithoutSelling: new Decimal(65000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
      {
        year: 3,
        renterNetWorth: new Decimal(140000),
        buyerNetWorthWithSelling: new Decimal(60000),
        buyerNetWorthWithoutSelling: new Decimal(70000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
    ]

    expect(findBreakEvenYear(comparison, 'withSelling')).toBe('never')
    expect(findBreakEvenYear(comparison, 'withoutSelling')).toBe('never')
  })

  it('returns year number when buying wins at that year (withSelling)', () => {
    const comparison: YearlyComparison[] = [
      {
        year: 1,
        renterNetWorth: new Decimal(100000),
        buyerNetWorthWithSelling: new Decimal(50000),
        buyerNetWorthWithoutSelling: new Decimal(60000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
      {
        year: 2,
        renterNetWorth: new Decimal(95000),
        buyerNetWorthWithSelling: new Decimal(96000),
        buyerNetWorthWithoutSelling: new Decimal(100000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
    ]

    expect(findBreakEvenYear(comparison, 'withSelling')).toBe(2)
  })

  it('returns year number when buying wins at that year (withoutSelling)', () => {
    const comparison: YearlyComparison[] = [
      {
        year: 1,
        renterNetWorth: new Decimal(100000),
        buyerNetWorthWithSelling: new Decimal(50000),
        buyerNetWorthWithoutSelling: new Decimal(80000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
      {
        year: 2,
        renterNetWorth: new Decimal(95000),
        buyerNetWorthWithSelling: new Decimal(92000),
        buyerNetWorthWithoutSelling: new Decimal(96000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
    ]

    expect(findBreakEvenYear(comparison, 'withoutSelling')).toBe(2)
  })

  it('returns 1 when buying wins immediately (year 1)', () => {
    const comparison: YearlyComparison[] = [
      {
        year: 1,
        renterNetWorth: new Decimal(100000),
        buyerNetWorthWithSelling: new Decimal(105000),
        buyerNetWorthWithoutSelling: new Decimal(110000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
    ]

    expect(findBreakEvenYear(comparison, 'withSelling')).toBe(1)
    expect(findBreakEvenYear(comparison, 'withoutSelling')).toBe(1)
  })

  it('returns "never" for empty array', () => {
    expect(findBreakEvenYear([], 'withSelling')).toBe('never')
    expect(findBreakEvenYear([], 'withoutSelling')).toBe('never')
  })

  it('correctly handles different break-even years for with/without selling', () => {
    const comparison: YearlyComparison[] = [
      {
        year: 1,
        renterNetWorth: new Decimal(100000),
        buyerNetWorthWithSelling: new Decimal(80000),
        buyerNetWorthWithoutSelling: new Decimal(90000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
      {
        year: 2,
        renterNetWorth: new Decimal(98000),
        buyerNetWorthWithSelling: new Decimal(95000),
        buyerNetWorthWithoutSelling: new Decimal(105000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
      {
        year: 3,
        renterNetWorth: new Decimal(96000),
        buyerNetWorthWithSelling: new Decimal(97000),
        buyerNetWorthWithoutSelling: new Decimal(107000),
        monthlySavings: new Decimal(500),
        annualRent: new Decimal(24000),
        buyerAnnualCost: new Decimal(30000),
      },
    ]

    expect(findBreakEvenYear(comparison, 'withoutSelling')).toBe(2)
    expect(findBreakEvenYear(comparison, 'withSelling')).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// calculateRentVsBuyComparison integration tests
// ---------------------------------------------------------------------------

describe('calculateRentVsBuyComparison', () => {
  // Baseline scenario for comprehensive structural testing
  const baselineInput: ComparisonInput = {
    purchasePrice: 500000,
    downPaymentPercent: 20,
    mortgageRate: 5.5,
    amortizationYears: 25,
    province: 'ON',
    timeHorizon: 25,
    firstTimeBuyer: false,
    monthlyRent: 2000,
    rentIncreasePercent: 2.0,
    annualIncome: 80000,
    investmentReturnPercent: 7.0,
    taxRateOverride: null,
    inflationRatePercent: 2.5,
  }

  it('returns complete comparison result with all required fields', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    // Verify structure
    expect(result).toHaveProperty('housingProjection')
    expect(result).toHaveProperty('portfolio')
    expect(result).toHaveProperty('yearlyComparison')
    expect(result).toHaveProperty('breakEvenWithSelling')
    expect(result).toHaveProperty('breakEvenWithoutSelling')
    expect(result).toHaveProperty('marginalTaxRate')
    expect(result).toHaveProperty('afterTaxReturnRate')

    // HousingProjection substructure
    expect(result.housingProjection).toHaveProperty('upfrontCosts')
    expect(result.housingProjection).toHaveProperty('yearlyProjection')
    expect(result.housingProjection).toHaveProperty('exitPosition')
  })

  it('produces arrays with correct length matching time horizon', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    expect(result.yearlyComparison).toHaveLength(25)
    expect(result.portfolio).toHaveLength(25)
    expect(result.housingProjection.yearlyProjection).toHaveLength(25)
  })

  it('numbers years correctly from 1 to time horizon', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    expect(result.yearlyComparison[0].year).toBe(1)
    expect(result.yearlyComparison[24].year).toBe(25)
    expect(result.portfolio[0].year).toBe(1)
    expect(result.portfolio[24].year).toBe(25)
  })

  it('correctly calculates lump sum as down payment + buying closing costs', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    // Lump sum = down payment + total buying closing costs
    const expectedLumpSum = result.housingProjection.upfrontCosts.downPayment.plus(
      result.housingProjection.upfrontCosts.buyingClosingCosts
    )

    expect(result.portfolio[0].startBalance.toNumber()).toBeCloseTo(
      expectedLumpSum.toNumber(),
      2
    )
  })

  it('calculates marginal tax rate correctly for $80K income in ON', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    // $80K in ON 2025:
    // Federal: 20.5% bracket (over $55,867)
    // ON: 9.15% bracket (over $51,446)
    // Combined: 29.65%
    expect(result.marginalTaxRate.toNumber()).toBeCloseTo(29.65, 2)
  })

  it('calculates after-tax return correctly using 50% capital gains inclusion', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    // 7.0% nominal return, 29.65% marginal rate
    // After-tax: 7.0% * (1 - 0.2965 * 0.5) = 0.07 * 0.85175 = 0.0596225
    expect(result.afterTaxReturnRate.toNumber()).toBeCloseTo(0.0596, 3)
  })

  it('produces positive monthly savings in early years (buyer costs > rent)', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    // Year 1: $500K purchase, $2K rent should produce positive savings
    // (buyer monthly costs should exceed $2K rent)
    const year1 = result.yearlyComparison[0]
    expect(year1.monthlySavings.toNumber()).toBeGreaterThan(0)
  })

  it('shows renter portfolio growing year over year', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    // With positive return + positive contributions, portfolio should grow
    for (let i = 1; i < result.portfolio.length; i++) {
      expect(result.portfolio[i].endBalance.toNumber()).toBeGreaterThan(
        result.portfolio[i - 1].endBalance.toNumber()
      )
    }
  })

  it('shows buyer net worth with selling < without selling (selling costs reduce equity)', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    for (const year of result.yearlyComparison) {
      expect(year.buyerNetWorthWithSelling.toNumber()).toBeLessThan(
        year.buyerNetWorthWithoutSelling.toNumber()
      )
    }
  })

  it('shows break-even with selling >= break-even without selling (selling costs delay break-even)', () => {
    const result = calculateRentVsBuyComparison(baselineInput)

    const withSelling = result.breakEvenWithSelling
    const withoutSelling = result.breakEvenWithoutSelling

    // If both are numbers, withSelling should be >= withoutSelling
    if (typeof withSelling === 'number' && typeof withoutSelling === 'number') {
      expect(withSelling).toBeGreaterThanOrEqual(withoutSelling)
    }

    // If withSelling is 'never', withoutSelling can be either number or 'never'
    // If withoutSelling is a number, withSelling must be 'never' or a higher number
    if (typeof withoutSelling === 'number') {
      expect(
        withSelling === 'never' || (typeof withSelling === 'number' && withSelling >= withoutSelling)
      ).toBe(true)
    }
  })

  it('respects tax rate override when provided', () => {
    const inputWithOverride: ComparisonInput = {
      ...baselineInput,
      taxRateOverride: 40.0,
    }

    const result = calculateRentVsBuyComparison(inputWithOverride)

    // Should use 40% instead of auto-calculated 29.65%
    expect(result.marginalTaxRate.toNumber()).toBe(40.0)
  })

  it('returns "never" for short horizon where buying costs exceed equity built', () => {
    const shortHorizonInput: ComparisonInput = {
      purchasePrice: 500000,
      downPaymentPercent: 20,
      mortgageRate: 5.5,
      amortizationYears: 25,
      province: 'ON',
      timeHorizon: 3,
      firstTimeBuyer: false,
      monthlyRent: 3000, // High rent
      rentIncreasePercent: 2.0,
      annualIncome: 80000,
      investmentReturnPercent: 7.0,
      taxRateOverride: null,
      inflationRatePercent: 2.5,
      appreciationRate: 1.0, // Low appreciation
    }

    const result = calculateRentVsBuyComparison(shortHorizonInput)

    // With 3-year horizon, high upfront costs, low appreciation,
    // buying likely doesn't win
    expect(result.breakEvenWithSelling).toBe('never')
  })
})
