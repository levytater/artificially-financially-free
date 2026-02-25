/**
 * Investment portfolio growth calculation tests.
 *
 * Tests cover:
 * - After-tax return with capital gains 50% inclusion rate
 * - Portfolio growth with monthly compounding
 * - Lump sum only, contributions only, mixed scenarios
 * - Zero return, negative savings clamping, variable yearly savings
 */
import { describe, it, expect } from 'vitest'
import Decimal from 'decimal.js'
import {
  calculateAfterTaxReturn,
  calculatePortfolioGrowth,
} from '@/lib/calculations/investment'

// ---------------------------------------------------------------------------
// calculateAfterTaxReturn
// ---------------------------------------------------------------------------

describe('calculateAfterTaxReturn', () => {
  it('7% nominal return, 30% tax rate -> 5.95% after-tax', () => {
    // afterTax = 0.07 * (1 - 0.30 * 0.5) = 0.07 * 0.85 = 0.0595
    const result = calculateAfterTaxReturn(new Decimal(7.0), new Decimal(30.0))
    expect(result.toNumber()).toBeCloseTo(0.0595, 6)
  })

  it('7% nominal return, 0% tax rate -> 7.0% after-tax (no tax drag)', () => {
    // afterTax = 0.07 * (1 - 0 * 0.5) = 0.07
    const result = calculateAfterTaxReturn(new Decimal(7.0), new Decimal(0))
    expect(result.toNumber()).toBeCloseTo(0.07, 6)
  })

  it('0% nominal return, any tax rate -> 0% after-tax', () => {
    const result = calculateAfterTaxReturn(new Decimal(0), new Decimal(30.0))
    expect(result.toNumber()).toBe(0)
  })

  it('10% nominal return, 46% tax rate -> 7.7% after-tax', () => {
    // afterTax = 0.10 * (1 - 0.46 * 0.5) = 0.10 * 0.77 = 0.077
    const result = calculateAfterTaxReturn(new Decimal(10.0), new Decimal(46.0))
    expect(result.toNumber()).toBeCloseTo(0.077, 6)
  })
})

// ---------------------------------------------------------------------------
// calculatePortfolioGrowth
// ---------------------------------------------------------------------------

describe('calculatePortfolioGrowth', () => {
  it('lump sum only, no contributions -- $100K at 5.95% for 5 years', () => {
    // $100,000 * (1.0595)^5 ~ $133,469
    const result = calculatePortfolioGrowth(
      new Decimal(100000),
      [
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
      ],
      new Decimal(0.0595)
    )

    expect(result).toHaveLength(5)
    expect(result[0].year).toBe(1)
    expect(result[4].year).toBe(5)

    // Year 1 start balance should be the lump sum
    expect(result[0].startBalance.toNumber()).toBeCloseTo(100000, 0)
    // Year 1 contributions should be 0
    expect(result[0].contributions.toNumber()).toBe(0)

    // Final balance: $100K * (1.0595)^5 = $133,507.24
    // (Plan estimated ~$133,469 using incorrect manual math; verified via Decimal.js)
    expect(result[4].endBalance.toNumber()).toBeCloseTo(133507, -1)
  })

  it('contributions only, no lump sum -- $1,000/month at 6% for 3 years', () => {
    // Iterative month-by-month calculation:
    // monthlyRate = (1.06)^(1/12) - 1 ~ 0.004868
    // Each month: balance = balance * (1 + monthlyRate) + 1000
    const monthlyRate = Math.pow(1.06, 1 / 12) - 1

    let expectedBalance = 0
    for (let year = 0; year < 3; year++) {
      for (let month = 0; month < 12; month++) {
        expectedBalance = expectedBalance * (1 + monthlyRate) + 1000
      }
    }

    const result = calculatePortfolioGrowth(
      new Decimal(0),
      [new Decimal(1000), new Decimal(1000), new Decimal(1000)],
      new Decimal(0.06)
    )

    expect(result).toHaveLength(3)
    // Allow $1 tolerance for Decimal.js vs native float differences
    expect(result[2].endBalance.toNumber()).toBeCloseTo(expectedBalance, 0)
    // Total contributions = $1000 * 12 * 3 = $36,000
    const totalContributions = result.reduce(
      (sum, y) => sum + y.contributions.toNumber(),
      0
    )
    expect(totalContributions).toBeCloseTo(36000, 0)
  })

  it('mixed lump sum + contributions -- $50K + $500/month at 5% for 3 years', () => {
    const result = calculatePortfolioGrowth(
      new Decimal(50000),
      [new Decimal(500), new Decimal(500), new Decimal(500)],
      new Decimal(0.05)
    )

    expect(result).toHaveLength(3)

    // Year 1 start balance = lump sum
    expect(result[0].startBalance.toNumber()).toBeCloseTo(50000, 0)
    // Year 1 contributions = $500 * 12 = $6,000
    expect(result[0].contributions.toNumber()).toBeCloseTo(6000, 0)
    // Year 1 growth should be positive
    expect(result[0].growth.toNumber()).toBeGreaterThan(0)
    // Year 1 end balance = start + contributions + growth
    const expectedEnd = result[0].startBalance
      .plus(result[0].contributions)
      .plus(result[0].growth)
    expect(result[0].endBalance.toNumber()).toBeCloseTo(
      expectedEnd.toNumber(),
      2
    )

    // Year 2 start should equal year 1 end
    expect(result[1].startBalance.toNumber()).toBeCloseTo(
      result[0].endBalance.toNumber(),
      2
    )
  })

  it('zero return -- $50K + $1,000/month at 0% for 2 years = $74,000', () => {
    // No compounding: balance = lump sum + total contributions
    // $50,000 + ($1,000 * 12 * 2) = $50,000 + $24,000 = $74,000
    const result = calculatePortfolioGrowth(
      new Decimal(50000),
      [new Decimal(1000), new Decimal(1000)],
      new Decimal(0)
    )

    expect(result).toHaveLength(2)
    expect(result[1].endBalance.toNumber()).toBe(74000)
    // Growth should be exactly 0 for each year
    expect(result[0].growth.toNumber()).toBe(0)
    expect(result[1].growth.toNumber()).toBe(0)
  })

  it('negative savings clamped to zero -- no withdrawals', () => {
    // $50,000 lump sum, 2 years, year 1 = -$500/month, year 2 = $0/month
    // Negative savings should be treated as $0, portfolio only grows from compounding
    const result = calculatePortfolioGrowth(
      new Decimal(50000),
      [new Decimal(-500), new Decimal(0)],
      new Decimal(0.05)
    )

    expect(result).toHaveLength(2)
    // Contributions should be clamped to 0 (no negative)
    expect(result[0].contributions.toNumber()).toBe(0)
    // Balance should only grow from compounding, never decrease
    expect(result[0].endBalance.toNumber()).toBeGreaterThan(50000)
    expect(result[1].endBalance.toNumber()).toBeGreaterThan(
      result[0].endBalance.toNumber()
    )
  })

  it('variable yearly savings -- different amounts each year', () => {
    // Year 1 = $1,500/month, Year 2 = $1,200/month, Year 3 = $0/month
    const result = calculatePortfolioGrowth(
      new Decimal(10000),
      [new Decimal(1500), new Decimal(1200), new Decimal(0)],
      new Decimal(0.04)
    )

    expect(result).toHaveLength(3)
    // Year 1 contributions = $1,500 * 12 = $18,000
    expect(result[0].contributions.toNumber()).toBeCloseTo(18000, 0)
    // Year 2 contributions = $1,200 * 12 = $14,400
    expect(result[1].contributions.toNumber()).toBeCloseTo(14400, 0)
    // Year 3 contributions = $0 * 12 = $0
    expect(result[2].contributions.toNumber()).toBe(0)
    // Year 3 should still have positive growth (compounding on existing balance)
    expect(result[2].growth.toNumber()).toBeGreaterThan(0)
  })

  it('single year -- array has exactly 1 element with year=1', () => {
    const result = calculatePortfolioGrowth(
      new Decimal(25000),
      [new Decimal(800)],
      new Decimal(0.06)
    )

    expect(result).toHaveLength(1)
    expect(result[0].year).toBe(1)
    expect(result[0].startBalance.toNumber()).toBeCloseTo(25000, 0)
    expect(result[0].contributions.toNumber()).toBeCloseTo(9600, 0) // 800 * 12
    expect(result[0].endBalance.toNumber()).toBeGreaterThan(
      25000 + 9600 // lump sum + contributions, growth adds more
    )
  })
})
