/**
 * Tests for simple calculation functions: property tax, maintenance,
 * appreciation, rent, and closing costs.
 *
 * All financial values use Decimal.js -- no native JS arithmetic on money.
 */
import { describe, it, expect } from 'vitest'
import { Decimal } from '@/lib/decimal'
import {
  calculatePropertyTax,
  calculateMaintenance,
} from '@/lib/calculations/property-tax'
import {
  calculateAppreciatedValue,
  calculateAppreciationSchedule,
} from '@/lib/calculations/appreciation'
import {
  calculateRentForYear,
  calculateAnnualRent,
  calculateRentSchedule,
} from '@/lib/calculations/rent'
import {
  calculateBuyingCosts,
  calculateSellingCosts,
} from '@/lib/calculations/closing-costs'

// ---------------------------------------------------------------------------
// Property Tax
// ---------------------------------------------------------------------------
describe('calculatePropertyTax', () => {
  it('calculates $600K home at 1% = $6,000/year', () => {
    const result = calculatePropertyTax(new Decimal(600000), new Decimal(1))
    expect(result.toFixed(2)).toBe('6000.00')
  })

  it('calculates $400K home at 1.5% = $6,000/year', () => {
    const result = calculatePropertyTax(new Decimal(400000), new Decimal(1.5))
    expect(result.toFixed(2)).toBe('6000.00')
  })

  it('calculates $0 for 0% rate', () => {
    const result = calculatePropertyTax(new Decimal(500000), new Decimal(0))
    expect(result.toFixed(2)).toBe('0.00')
  })
})

// ---------------------------------------------------------------------------
// Maintenance
// ---------------------------------------------------------------------------
describe('calculateMaintenance', () => {
  it('calculates $600K home at 1% = $6,000/year', () => {
    const result = calculateMaintenance(new Decimal(600000), new Decimal(1))
    expect(result.toFixed(2)).toBe('6000.00')
  })

  it('calculates $1M home at 1.5% = $15,000/year', () => {
    const result = calculateMaintenance(new Decimal(1000000), new Decimal(1.5))
    expect(result.toFixed(2)).toBe('15000.00')
  })
})

// ---------------------------------------------------------------------------
// Appreciation
// ---------------------------------------------------------------------------
describe('calculateAppreciatedValue', () => {
  it('calculates $600K at 3% for 5 years = $695,564.44', () => {
    const result = calculateAppreciatedValue(
      new Decimal(600000),
      new Decimal(3),
      5
    )
    expect(result.toFixed(2)).toBe('695564.44')
  })

  it('returns initial value at 0% for any number of years', () => {
    const result = calculateAppreciatedValue(
      new Decimal(600000),
      new Decimal(0),
      10
    )
    expect(result.toFixed(2)).toBe('600000.00')
  })

  it('returns initial value at year 0', () => {
    const result = calculateAppreciatedValue(
      new Decimal(600000),
      new Decimal(5),
      0
    )
    expect(result.toFixed(2)).toBe('600000.00')
  })
})

describe('calculateAppreciationSchedule', () => {
  it('produces array of totalYears + 1 entries', () => {
    const schedule = calculateAppreciationSchedule(
      new Decimal(500000),
      new Decimal(3),
      5
    )
    expect(schedule).toHaveLength(6) // years 0 through 5
  })

  it('first entry equals initial value', () => {
    const schedule = calculateAppreciationSchedule(
      new Decimal(500000),
      new Decimal(3),
      3
    )
    expect(schedule[0].toFixed(2)).toBe('500000.00')
  })

  it('last entry matches single-value calculation', () => {
    const schedule = calculateAppreciationSchedule(
      new Decimal(600000),
      new Decimal(3),
      5
    )
    const direct = calculateAppreciatedValue(new Decimal(600000), new Decimal(3), 5)
    expect(schedule[5].toFixed(2)).toBe(direct.toFixed(2))
  })
})

// ---------------------------------------------------------------------------
// Rent
// ---------------------------------------------------------------------------
describe('calculateRentForYear', () => {
  it('returns initial rent at year 0', () => {
    const result = calculateRentForYear(new Decimal(2000), new Decimal(2), 0)
    expect(result.toFixed(2)).toBe('2000.00')
  })

  it('calculates $2,000/mo at 2% for 5 years = $2,208.16', () => {
    const result = calculateRentForYear(new Decimal(2000), new Decimal(2), 5)
    expect(result.toFixed(2)).toBe('2208.16')
  })

  it('returns initial rent at 0% increase for any year', () => {
    const result = calculateRentForYear(new Decimal(2000), new Decimal(0), 10)
    expect(result.toFixed(2)).toBe('2000.00')
  })
})

describe('calculateAnnualRent', () => {
  it('calculates monthly * 12', () => {
    const result = calculateAnnualRent(new Decimal(2000))
    expect(result.toFixed(2)).toBe('24000.00')
  })

  it('handles fractional monthly rent', () => {
    const result = calculateAnnualRent(new Decimal(2208.16))
    expect(result.toFixed(2)).toBe('26497.92')
  })
})

describe('calculateRentSchedule', () => {
  it('produces array of totalYears + 1 entries (years 0-3 for 3 years)', () => {
    const schedule = calculateRentSchedule(new Decimal(2000), new Decimal(2), 3)
    expect(schedule).toHaveLength(4) // years 0, 1, 2, 3
  })

  it('first entry has correct year and initial rent', () => {
    const schedule = calculateRentSchedule(new Decimal(2000), new Decimal(2), 3)
    expect(schedule[0].year).toBe(0)
    expect(schedule[0].monthlyRent.toFixed(2)).toBe('2000.00')
    expect(schedule[0].annualRent.toFixed(2)).toBe('24000.00')
  })

  it('annual rent equals monthly * 12 for each year', () => {
    const schedule = calculateRentSchedule(new Decimal(2000), new Decimal(2), 3)
    for (const entry of schedule) {
      expect(entry.annualRent.toFixed(2)).toBe(
        entry.monthlyRent.mul(12).toFixed(2)
      )
    }
  })
})

// ---------------------------------------------------------------------------
// Buying Closing Costs
// ---------------------------------------------------------------------------
describe('calculateBuyingCosts', () => {
  it('calculates total with defaults: LTT $6,475 + defaults = $9,275', () => {
    const result = calculateBuyingCosts({
      ltt: new Decimal(6475),
      cmhcPst: new Decimal(0),
    })
    // $6,475 LTT + $2,000 legal + $500 inspection + $300 title insurance + $0 appraisal + $0 CMHC PST
    expect(result.total.toFixed(2)).toBe('9275.00')
    expect(result.ltt.toFixed(2)).toBe('6475.00')
    expect(result.legal.toFixed(2)).toBe('2000.00')
    expect(result.inspection.toFixed(2)).toBe('500.00')
    expect(result.titleInsurance.toFixed(2)).toBe('300.00')
    expect(result.appraisal.toFixed(2)).toBe('0.00')
    expect(result.cmhcPst.toFixed(2)).toBe('0.00')
  })

  it('uses custom values when provided', () => {
    const result = calculateBuyingCosts({
      legalFees: 3000,
      homeInspection: 700,
      titleInsurance: 400,
      appraisalFee: 500,
      ltt: new Decimal(8000),
      cmhcPst: new Decimal(1200),
    })
    // $8,000 + $3,000 + $700 + $400 + $500 + $1,200 = $13,800
    expect(result.total.toFixed(2)).toBe('13800.00')
  })

  it('includes CMHC PST in total', () => {
    const result = calculateBuyingCosts({
      ltt: new Decimal(5000),
      cmhcPst: new Decimal(800),
    })
    // $5,000 + $2,000 + $500 + $300 + $0 + $800 = $8,600
    expect(result.total.toFixed(2)).toBe('8600.00')
  })
})

// ---------------------------------------------------------------------------
// Selling Closing Costs
// ---------------------------------------------------------------------------
describe('calculateSellingCosts', () => {
  it('calculates $780K sale at 5% commission: total = $40,300', () => {
    const result = calculateSellingCosts(new Decimal(780000))
    expect(result.realtorCommission.toFixed(2)).toBe('39000.00')
    expect(result.legal.toFixed(2)).toBe('1000.00')
    expect(result.mortgageDischarge.toFixed(2)).toBe('300.00')
    expect(result.total.toFixed(2)).toBe('40300.00')
  })

  it('uses custom commission rate', () => {
    const result = calculateSellingCosts(new Decimal(500000), {
      commissionRate: 0.04,
    })
    expect(result.realtorCommission.toFixed(2)).toBe('20000.00')
  })

  it('uses custom legal and discharge fees', () => {
    const result = calculateSellingCosts(new Decimal(600000), {
      legalFees: 1500,
      mortgageDischarge: 500,
    })
    // $30,000 commission + $1,500 legal + $500 discharge = $32,000
    expect(result.total.toFixed(2)).toBe('32000.00')
  })
})
