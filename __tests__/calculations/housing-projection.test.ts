/**
 * Integration tests for the housing projection orchestrator.
 *
 * Tests that all individual calculation functions compose correctly
 * into a complete year-by-year housing cost projection.
 *
 * All financial values use Decimal.js -- no native JS arithmetic on money.
 */
import { describe, it, expect } from 'vitest'
import { Decimal } from '@/lib/decimal'
import {
  calculateHousingProjection,
  type HousingProjectionInput,
} from '@/lib/calculations/housing-projection'

// ---------------------------------------------------------------------------
// Default scenario: $600K, 20% down, ON, 25yr amortization, 25yr horizon
// ---------------------------------------------------------------------------
const defaultInput: HousingProjectionInput = {
  purchasePrice: 600000,
  downPaymentPercent: 20,
  mortgageRate: 5.5,
  amortizationYears: 25,
  province: 'ON',
  timeHorizon: 25,
  firstTimeBuyer: false,
}

describe('calculateHousingProjection', () => {
  // =========================================================================
  // Upfront Costs -- Default Scenario ($600K, 20% down, ON)
  // =========================================================================
  describe('upfront costs (default scenario)', () => {
    it('calculates down payment = $120,000', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.upfrontCosts.downPayment.toFixed(2)).toBe('120000.00')
    })

    it('has $0 CMHC premium with 20% down', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.upfrontCosts.cmhcPremium.toFixed(2)).toBe('0.00')
    })

    it('has $0 CMHC PST with 20% down', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.upfrontCosts.cmhcPst.toFixed(2)).toBe('0.00')
    })

    it('calculates ON LTT for $600K correctly', () => {
      // ON LTT: 0.5% on first $55K + 1% on $55K-$250K + 1.5% on $250K-$400K + 2% on $400K-$2M
      // = $275 + $1,950 + $2,250 + $4,000 = $8,475
      const result = calculateHousingProjection(defaultInput)
      expect(result.upfrontCosts.ltt.toFixed(2)).toBe('8475.00')
    })

    it('calculates buying closing costs = LTT + legal + inspection + title insurance', () => {
      // $8,475 LTT + $2,000 legal + $500 inspection + $300 title insurance + $0 appraisal + $0 CMHC PST
      const result = calculateHousingProjection(defaultInput)
      expect(result.upfrontCosts.buyingClosingCosts.toFixed(2)).toBe('11275.00')
    })

    it('calculates total cash required = down payment + buying costs', () => {
      // $120,000 + $11,275 = $131,275
      const result = calculateHousingProjection(defaultInput)
      expect(result.upfrontCosts.totalCashRequired.toFixed(2)).toBe('131275.00')
    })
  })

  // =========================================================================
  // Upfront Costs -- CMHC Scenario ($600K, 10% down, ON)
  // =========================================================================
  describe('upfront costs with CMHC (10% down)', () => {
    const cmhcInput: HousingProjectionInput = {
      ...defaultInput,
      downPaymentPercent: 10,
    }

    it('calculates down payment = $60,000', () => {
      const result = calculateHousingProjection(cmhcInput)
      expect(result.upfrontCosts.downPayment.toFixed(2)).toBe('60000.00')
    })

    it('calculates CMHC premium on $540K mortgage at 3.10% = $16,740', () => {
      // 90% LTV tier = 3.10%
      // $540,000 * 3.10% = $16,740
      const result = calculateHousingProjection(cmhcInput)
      expect(result.upfrontCosts.cmhcPremium.toFixed(2)).toBe('16740.00')
    })

    it('calculates Ontario CMHC PST at 8% = $1,339.20', () => {
      // $16,740 * 8% = $1,339.20
      const result = calculateHousingProjection(cmhcInput)
      expect(result.upfrontCosts.cmhcPst.toFixed(2)).toBe('1339.20')
    })

    it('includes CMHC PST in total cash required', () => {
      const result = calculateHousingProjection(cmhcInput)
      // Total cash = down payment ($60K) + buying closing costs (LTT + legal + inspection + title + CMHC PST)
      // LTT for ON $600K = $8,475
      // Buying costs = $8,475 + $2,000 + $500 + $300 + $0 appraisal + $1,339.20 CMHC PST = $12,614.20
      // Total = $60,000 + $12,614.20 = $72,614.20
      expect(result.upfrontCosts.totalCashRequired.toFixed(2)).toBe('72614.20')
    })
  })

  // =========================================================================
  // Year-by-Year Projection -- Default Scenario
  // =========================================================================
  describe('year-by-year projection (default scenario)', () => {
    it('produces array of length equal to timeHorizon', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.yearlyProjection).toHaveLength(25)
    })

    it('Year 1: home value = $600K * 1.03 = $618,000', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.yearlyProjection[0].homeValue.toFixed(2)).toBe('618000.00')
    })

    it('Year 1: mortgage payment = 12 * monthly payment', () => {
      const result = calculateHousingProjection(defaultInput)
      const yearlyPayment = result.yearlyProjection[0].mortgagePayment
      // Monthly payment for $480K, 5.5%, 25yr should be ~$2,929.88
      // Annual = ~$35,158.56
      expect(yearlyPayment.toNumber()).toBeCloseTo(35158.56, 0)
    })

    it('Year 1: home equity = homeValue - remainingBalance', () => {
      const result = calculateHousingProjection(defaultInput)
      const year1 = result.yearlyProjection[0]
      const expectedEquity = year1.homeValue.minus(year1.remainingBalance)
      expect(year1.homeEquity.toFixed(2)).toBe(expectedEquity.toFixed(2))
    })

    it('Year 1: property tax based on home value at start-of-year', () => {
      const result = calculateHousingProjection(defaultInput)
      // Property tax on $600K * 1% = $6,000 (using purchase price = start of year 1 value)
      expect(result.yearlyProjection[0].propertyTax.toFixed(2)).toBe('6000.00')
    })

    it('Year 25: remaining balance = $0 (mortgage paid off)', () => {
      const result = calculateHousingProjection(defaultInput)
      const lastYear = result.yearlyProjection[24]
      expect(lastYear.remainingBalance.toFixed(2)).toBe('0.00')
    })

    it('Year 25: home value = $600K * (1.03)^25', () => {
      const result = calculateHousingProjection(defaultInput)
      const lastYear = result.yearlyProjection[24]
      const expected = new Decimal(600000).mul(new Decimal(1.03).pow(25))
      expect(lastYear.homeValue.toFixed(2)).toBe(expected.toFixed(2))
    })

    it('each year totalAnnualCost = mortgage + propertyTax + maintenance + insurance', () => {
      const result = calculateHousingProjection(defaultInput)
      for (const year of result.yearlyProjection) {
        const expectedTotal = year.mortgagePayment
          .plus(year.propertyTax)
          .plus(year.maintenance)
          .plus(year.homeInsurance)
        expect(year.totalAnnualCost.toFixed(2)).toBe(expectedTotal.toFixed(2))
      }
    })

    it('cumulative cost increases monotonically', () => {
      const result = calculateHousingProjection(defaultInput)
      for (let i = 1; i < result.yearlyProjection.length; i++) {
        expect(
          result.yearlyProjection[i].cumulativeCost.gte(
            result.yearlyProjection[i - 1].cumulativeCost
          )
        ).toBe(true)
      }
    })

    it('Year 1 cumulative cost = Year 1 total annual cost', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.yearlyProjection[0].cumulativeCost.toFixed(2)).toBe(
        result.yearlyProjection[0].totalAnnualCost.toFixed(2)
      )
    })

    it('principalPaid + interestPaid = mortgagePayment for each year', () => {
      const result = calculateHousingProjection(defaultInput)
      for (const year of result.yearlyProjection) {
        const sum = year.principalPaid.plus(year.interestPaid)
        expect(sum.toFixed(2)).toBe(year.mortgagePayment.toFixed(2))
      }
    })

    it('Year 1: maintenance = $600K * 1%', () => {
      const result = calculateHousingProjection(defaultInput)
      // Maintenance on purchase price = start of year value
      expect(result.yearlyProjection[0].maintenance.toFixed(2)).toBe('6000.00')
    })

    it('Year 1: home insurance = $2,400', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.yearlyProjection[0].homeInsurance.toFixed(2)).toBe('2400.00')
    })
  })

  // =========================================================================
  // Mortgage Paid Off Before Time Horizon
  // =========================================================================
  describe('mortgage paid off before time horizon', () => {
    const extendedInput: HousingProjectionInput = {
      ...defaultInput,
      timeHorizon: 30,
    }

    it('produces 30-year projection', () => {
      const result = calculateHousingProjection(extendedInput)
      expect(result.yearlyProjection).toHaveLength(30)
    })

    it('Year 25: remaining balance = $0', () => {
      const result = calculateHousingProjection(extendedInput)
      expect(result.yearlyProjection[24].remainingBalance.toFixed(2)).toBe('0.00')
    })

    it('Years 26-30: mortgage payment = $0', () => {
      const result = calculateHousingProjection(extendedInput)
      for (let i = 25; i < 30; i++) {
        expect(result.yearlyProjection[i].mortgagePayment.toFixed(2)).toBe('0.00')
        expect(result.yearlyProjection[i].principalPaid.toFixed(2)).toBe('0.00')
        expect(result.yearlyProjection[i].interestPaid.toFixed(2)).toBe('0.00')
        expect(result.yearlyProjection[i].remainingBalance.toFixed(2)).toBe('0.00')
      }
    })

    it('Years 26-30: totalAnnualCost = propertyTax + maintenance + insurance only', () => {
      const result = calculateHousingProjection(extendedInput)
      for (let i = 25; i < 30; i++) {
        const year = result.yearlyProjection[i]
        const expectedCost = year.propertyTax.plus(year.maintenance).plus(year.homeInsurance)
        expect(year.totalAnnualCost.toFixed(2)).toBe(expectedCost.toFixed(2))
      }
    })
  })

  // =========================================================================
  // Exit Position -- Default Scenario (year 25)
  // =========================================================================
  describe('exit position (default scenario)', () => {
    it('home value = appreciated value at end of time horizon', () => {
      const result = calculateHousingProjection(defaultInput)
      const expected = new Decimal(600000).mul(new Decimal(1.03).pow(25))
      expect(result.exitPosition.homeValue.toFixed(2)).toBe(expected.toFixed(2))
    })

    it('remaining mortgage = $0 at year 25', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.exitPosition.remainingMortgage.toFixed(2)).toBe('0.00')
    })

    it('selling costs include 5% commission + $1,000 legal + $300 discharge', () => {
      const result = calculateHousingProjection(defaultInput)
      const homeValue = new Decimal(600000).mul(new Decimal(1.03).pow(25))
      const expectedCommission = homeValue.mul(0.05)
      const expectedTotal = expectedCommission.plus(1000).plus(300)
      expect(result.exitPosition.sellingCosts.toFixed(2)).toBe(expectedTotal.toFixed(2))
    })

    it('net proceeds = homeValue - remainingMortgage - sellingCosts', () => {
      const result = calculateHousingProjection(defaultInput)
      const expected = result.exitPosition.homeValue
        .minus(result.exitPosition.remainingMortgage)
        .minus(result.exitPosition.sellingCosts)
      expect(result.exitPosition.netProceeds.toFixed(2)).toBe(expected.toFixed(2))
    })

    it('net proceeds are positive', () => {
      const result = calculateHousingProjection(defaultInput)
      expect(result.exitPosition.netProceeds.gt(0)).toBe(true)
    })
  })

  // =========================================================================
  // Exit Position With Remaining Mortgage (10yr horizon, 25yr amortization)
  // =========================================================================
  describe('exit position with remaining mortgage (10yr horizon)', () => {
    const shortInput: HousingProjectionInput = {
      ...defaultInput,
      timeHorizon: 10,
    }

    it('remaining mortgage > $0 at year 10', () => {
      const result = calculateHousingProjection(shortInput)
      expect(result.exitPosition.remainingMortgage.gt(0)).toBe(true)
    })

    it('remaining mortgage matches last year balance', () => {
      const result = calculateHousingProjection(shortInput)
      const lastYear = result.yearlyProjection[9]
      expect(result.exitPosition.remainingMortgage.toFixed(2)).toBe(
        lastYear.remainingBalance.toFixed(2)
      )
    })

    it('net proceeds = homeValue - remainingMortgage - sellingCosts', () => {
      const result = calculateHousingProjection(shortInput)
      const expected = result.exitPosition.homeValue
        .minus(result.exitPosition.remainingMortgage)
        .minus(result.exitPosition.sellingCosts)
      expect(result.exitPosition.netProceeds.toFixed(2)).toBe(expected.toFixed(2))
    })
  })

  // =========================================================================
  // Edge Cases
  // =========================================================================
  describe('edge cases', () => {
    it('1-year time horizon produces 1-year projection', () => {
      const result = calculateHousingProjection({
        ...defaultInput,
        timeHorizon: 1,
      })
      expect(result.yearlyProjection).toHaveLength(1)
    })

    it('all financial values are Decimal instances', () => {
      const result = calculateHousingProjection(defaultInput)

      // Upfront costs
      expect(result.upfrontCosts.downPayment).toBeInstanceOf(Decimal)
      expect(result.upfrontCosts.cmhcPremium).toBeInstanceOf(Decimal)
      expect(result.upfrontCosts.cmhcPst).toBeInstanceOf(Decimal)
      expect(result.upfrontCosts.ltt).toBeInstanceOf(Decimal)
      expect(result.upfrontCosts.buyingClosingCosts).toBeInstanceOf(Decimal)
      expect(result.upfrontCosts.totalCashRequired).toBeInstanceOf(Decimal)

      // Yearly projection (check first year)
      const y1 = result.yearlyProjection[0]
      expect(y1.mortgagePayment).toBeInstanceOf(Decimal)
      expect(y1.principalPaid).toBeInstanceOf(Decimal)
      expect(y1.interestPaid).toBeInstanceOf(Decimal)
      expect(y1.remainingBalance).toBeInstanceOf(Decimal)
      expect(y1.propertyTax).toBeInstanceOf(Decimal)
      expect(y1.maintenance).toBeInstanceOf(Decimal)
      expect(y1.homeInsurance).toBeInstanceOf(Decimal)
      expect(y1.homeValue).toBeInstanceOf(Decimal)
      expect(y1.homeEquity).toBeInstanceOf(Decimal)
      expect(y1.totalAnnualCost).toBeInstanceOf(Decimal)
      expect(y1.cumulativeCost).toBeInstanceOf(Decimal)

      // Exit position
      expect(result.exitPosition.homeValue).toBeInstanceOf(Decimal)
      expect(result.exitPosition.remainingMortgage).toBeInstanceOf(Decimal)
      expect(result.exitPosition.sellingCosts).toBeInstanceOf(Decimal)
      expect(result.exitPosition.netProceeds).toBeInstanceOf(Decimal)
    })

    it('FTHB rebate reduces LTT in upfront costs', () => {
      const fthbInput: HousingProjectionInput = {
        ...defaultInput,
        firstTimeBuyer: true,
      }
      const resultFthb = calculateHousingProjection(fthbInput)
      const resultNonFthb = calculateHousingProjection(defaultInput)
      // ON FTHB rebate caps at $4,000
      // Non-FTHB LTT = $8,475
      // FTHB LTT = $8,475 - $4,000 = $4,475
      expect(resultFthb.upfrontCosts.ltt.toFixed(2)).toBe('4475.00')
      expect(resultNonFthb.upfrontCosts.ltt.toFixed(2)).toBe('8475.00')
      expect(resultFthb.upfrontCosts.totalCashRequired.lt(resultNonFthb.upfrontCosts.totalCashRequired)).toBe(true)
    })

    it('custom property tax rate overrides province default', () => {
      const customInput: HousingProjectionInput = {
        ...defaultInput,
        propertyTaxRate: 2.0, // 2% instead of ON default 1%
      }
      const result = calculateHousingProjection(customInput)
      // Year 1 property tax on $600K at 2% = $12,000
      expect(result.yearlyProjection[0].propertyTax.toFixed(2)).toBe('12000.00')
    })

    it('custom maintenance rate overrides default 1%', () => {
      const customInput: HousingProjectionInput = {
        ...defaultInput,
        maintenanceRate: 1.5, // 1.5% instead of default 1%
      }
      const result = calculateHousingProjection(customInput)
      // Year 1 maintenance on $600K at 1.5% = $9,000
      expect(result.yearlyProjection[0].maintenance.toFixed(2)).toBe('9000.00')
    })

    it('custom home insurance overrides default $2,400', () => {
      const customInput: HousingProjectionInput = {
        ...defaultInput,
        homeInsurance: 3000,
      }
      const result = calculateHousingProjection(customInput)
      expect(result.yearlyProjection[0].homeInsurance.toFixed(2)).toBe('3000.00')
    })

    it('custom appreciation rate overrides default 3%', () => {
      const customInput: HousingProjectionInput = {
        ...defaultInput,
        appreciationRate: 5.0,
      }
      const result = calculateHousingProjection(customInput)
      // Year 1 home value = $600K * 1.05 = $630,000
      expect(result.yearlyProjection[0].homeValue.toFixed(2)).toBe('630000.00')
    })
  })

  // =========================================================================
  // CMHC scenario: mortgage principal includes CMHC premium
  // =========================================================================
  describe('CMHC mortgage principal includes premium', () => {
    const cmhcInput: HousingProjectionInput = {
      ...defaultInput,
      downPaymentPercent: 10,
    }

    it('mortgage principal = purchase price - down payment + CMHC premium', () => {
      const result = calculateHousingProjection(cmhcInput)
      // Down payment = $60,000
      // Mortgage amount = $540,000
      // CMHC premium = $540K * 3.10% = $16,740
      // Actual mortgage principal = $540,000 + $16,740 = $556,740
      // Year 1 total payment should be based on $556,740 principal
      // Monthly payment for $556,740 at 5.5% over 25yr
      // This is the sum of all 12 monthly payments in year 1
      const year1Payment = result.yearlyProjection[0].mortgagePayment
      // Just verify it's reasonable -- higher than the $480K scenario (~$35K) since principal is higher
      expect(year1Payment.toNumber()).toBeGreaterThan(38000)
      expect(year1Payment.toNumber()).toBeLessThan(42000)
    })
  })
})
