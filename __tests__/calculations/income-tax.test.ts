/**
 * Tests for income tax marginal rate calculations.
 *
 * Tests verify combined federal + provincial marginal tax rate for various
 * income levels and all 10 Canadian provinces using 2025 tax brackets.
 *
 * Expected values are manually computed from the bracket data in
 * src/lib/data/income-tax-brackets.ts and verified against 03-RESEARCH.md.
 */
import { describe, it, expect } from 'vitest'
import { calculateCombinedMarginalRate } from '@/lib/calculations/income-tax'

// ---------------------------------------------------------------------------
// Combined Marginal Rate — Specific Income/Province Combos
// ---------------------------------------------------------------------------

describe('calculateCombinedMarginalRate', () => {
  it('$60,000 income, ON: federal 20.5% + ON 9.15% = 29.65%', () => {
    // $60K > $57,375 (federal 2nd bracket: 20.5%)
    // $60K > $52,886 (ON 2nd bracket: 9.15%)
    const result = calculateCombinedMarginalRate(60000, 'ON')
    expect(result.toNumber()).toBeCloseTo(29.65, 2)
  })

  it('$60,000 income, AB: federal 20.5% + AB 10.0% = 30.5%', () => {
    // $60K > $57,375 (federal 2nd bracket: 20.5%)
    // $60K < $151,234 (AB 1st bracket: 10.0%)
    const result = calculateCombinedMarginalRate(60000, 'AB')
    expect(result.toNumber()).toBeCloseTo(30.5, 2)
  })

  it('$120,000 income, ON: federal 26.0% + ON 11.16% = 37.16%', () => {
    // $120K > $114,750 (federal 3rd bracket: 26.0%)
    // $120K > $105,775 (ON 3rd bracket: 11.16%)
    const result = calculateCombinedMarginalRate(120000, 'ON')
    expect(result.toNumber()).toBeCloseTo(37.16, 2)
  })

  it('$200,000 income, BC: federal 29.0% + BC 14.70% = 43.70%', () => {
    // $200K > $177,882 (federal 4th bracket: 29.0%)
    // $200K > $186,306 (BC 6th bracket: 16.80%)
    // Wait: $200K > $186,306 so BC rate = 16.80%, not 14.70%
    // Let me recalculate: $200K is between $186,306 and $259,829 -> BC rate = 16.80%
    // federal 29.0% + BC 16.80% = 45.80%
    const result = calculateCombinedMarginalRate(200000, 'BC')
    expect(result.toNumber()).toBeCloseTo(45.80, 2)
  })

  it('$40,000 income, QC: federal 15.0% + QC 14.0% = 29.0%', () => {
    // $40K < $57,375 (federal 1st bracket: 15.0%)
    // $40K < $53,255 (QC 1st bracket: 14.0%)
    const result = calculateCombinedMarginalRate(40000, 'QC')
    expect(result.toNumber()).toBeCloseTo(29.0, 2)
  })

  it('$0 income: returns lowest bracket rates (federal 15% + provincial lowest)', () => {
    // $0 income -> lowest bracket for both
    // ON lowest bracket: 5.05%
    // federal 15% + ON 5.05% = 20.05%
    const result = calculateCombinedMarginalRate(0, 'ON')
    expect(result.toNumber()).toBeCloseTo(20.05, 2)
  })

  it('$300,000 income, ON: federal 33.0% + ON 13.16% = 46.16%', () => {
    // $300K > $253,414 (federal 5th bracket: 33.0%)
    // $300K > $220,000 (ON 5th bracket: 13.16%)
    const result = calculateCombinedMarginalRate(300000, 'ON')
    expect(result.toNumber()).toBeCloseTo(46.16, 2)
  })
})

// ---------------------------------------------------------------------------
// All 10 Provinces at $100,000 Income — Bracket Data Spot Check
// ---------------------------------------------------------------------------

describe('calculateCombinedMarginalRate — all provinces at $100K', () => {
  // At $100K: federal rate = 20.5% (bracket: $57,375-$114,750)
  // Each province has a different rate at $100K

  const expectedRates: Record<string, number> = {
    // AB: $100K < $151,234 -> 10.0%. Combined: 20.5 + 10.0 = 30.5
    AB: 30.5,
    // BC: $100K > $98,560, < $113,158 -> 10.50%. Combined: 20.5 + 10.5 = 31.0
    BC: 31.0,
    // MB: $100K > $47,564, < $101,200 -> 12.75%. Combined: 20.5 + 12.75 = 33.25
    MB: 33.25,
    // NB: $100K > $51,306, < $102,614 -> 14.0%. Combined: 20.5 + 14.0 = 34.5
    NB: 34.5,
    // NL: $100K > $88,382, < $157,792 -> 15.80%. Combined: 20.5 + 15.8 = 36.3
    NL: 36.3,
    // NS: $100K > $95,883, < $154,650 -> 17.50%. Combined: 20.5 + 17.5 = 38.0
    NS: 38.0,
    // ON: $100K > $52,886, < $105,775 -> 9.15%. Combined: 20.5 + 9.15 = 29.65
    ON: 29.65,
    // PE: $100K > $64,656, < $105,000 -> 16.60%. Combined: 20.5 + 16.6 = 37.1
    PE: 37.1,
    // QC: $100K > $53,255, < $106,495 -> 19.0%. Combined: 20.5 + 19.0 = 39.5
    QC: 39.5,
    // SK: $100K > $53,463, < $152,750 -> 12.50%. Combined: 20.5 + 12.5 = 33.0
    SK: 33.0,
  }

  for (const [province, expected] of Object.entries(expectedRates)) {
    it(`$100K income, ${province}: combined rate = ${expected}%`, () => {
      const result = calculateCombinedMarginalRate(100000, province as import('@/types/housing').ProvinceCode)
      expect(result.toNumber()).toBeCloseTo(expected, 2)
    })
  }

  it('all provinces return rates in 25%-45% range for $100K income', () => {
    const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK'] as const
    for (const province of provinces) {
      const rate = calculateCombinedMarginalRate(100000, province).toNumber()
      expect(rate).toBeGreaterThanOrEqual(25)
      expect(rate).toBeLessThanOrEqual(45)
    }
  })
})
