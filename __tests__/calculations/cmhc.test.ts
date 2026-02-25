/**
 * CMHC mortgage default insurance premium calculation tests.
 *
 * Tests cover:
 * - All 6 LTV tier boundaries
 * - Provincial sales tax (ON, QC, SK only)
 * - Amortization surcharge for >25 years
 * - Premium added to mortgage, PST kept separate
 * - Purchase price cap validation ($1,499,999)
 */
import { describe, it, expect } from 'vitest'
import Decimal from 'decimal.js'
import { calculateCmhcPremium } from '@/lib/calculations/cmhc'

describe('calculateCmhcPremium', () => {
  // -----------------------------------------------------------------------
  // Tier boundary tests (purchase price $600K)
  // -----------------------------------------------------------------------
  describe('tier boundaries', () => {
    it('20% down (LTV 80%) -- no CMHC required', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(20),
        new Decimal(25),
        'ON'
      )
      expect(result.premium.toNumber()).toBe(0)
      expect(result.pst.toNumber()).toBe(0)
      expect(result.totalMortgageAddition.toNumber()).toBe(0)
    })

    it('19.99% down (LTV 80.01%) -- triggers 80.01-85% tier at 2.80%', () => {
      // 19.99% down on $600K = $119,940 down, mortgage = $480,060
      // LTV = 480060/600000 = 0.80010 -> tier 80.01-85%: 2.80%
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(19.99),
        new Decimal(25),
        'AB' // No PST province to isolate premium
      )
      const expectedMortgage = new Decimal(600000).mul(new Decimal(1).minus(new Decimal(19.99).div(100)))
      const expectedPremium = expectedMortgage.mul(new Decimal(0.028))
      expect(result.premium.minus(expectedPremium).abs().toNumber()).toBeLessThan(0.01)
      expect(result.pst.toNumber()).toBe(0) // AB has no PST on CMHC
    })

    it('15% down (LTV 85%) -- rate = 2.80%', () => {
      // 15% down on $600K = $90K down, mortgage = $510K
      // LTV = 510000/600000 = 0.85 -> tier maxLtv 0.85: 2.80%
      // Premium = $510,000 * 0.028 = $14,280
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(15),
        new Decimal(25),
        'AB'
      )
      expect(result.premium.toNumber()).toBe(14280)
    })

    it('10% down (LTV 90%) -- rate = 3.10%', () => {
      // 10% down on $600K = $60K down, mortgage = $540K
      // LTV = 540000/600000 = 0.90 -> tier maxLtv 0.90: 3.10%
      // Premium = $540,000 * 0.031 = $16,740
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'AB'
      )
      expect(result.premium.toNumber()).toBe(16740)
    })

    it('5% down (LTV 95%) -- rate = 4.00%', () => {
      // 5% down on $600K = $30K down, mortgage = $570K
      // LTV = 570000/600000 = 0.95 -> tier maxLtv 0.95: 4.00%
      // Premium = $570,000 * 0.04 = $22,800
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(5),
        new Decimal(25),
        'AB'
      )
      expect(result.premium.toNumber()).toBe(22800)
    })
  })

  // -----------------------------------------------------------------------
  // PST tests
  // -----------------------------------------------------------------------
  describe('provincial sales tax on premium', () => {
    it('Ontario with 10% down: PST = premium * 0.08', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'ON'
      )
      // Premium = $16,740, PST = $16,740 * 0.08 = $1,339.20
      expect(result.premium.toNumber()).toBe(16740)
      expect(result.pst.toNumber()).toBeCloseTo(1339.20, 2)
    })

    it('Quebec with 10% down: PST = premium * 0.09', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'QC'
      )
      // Premium = $16,740, PST = $16,740 * 0.09 = $1,506.60
      expect(result.premium.toNumber()).toBe(16740)
      expect(result.pst.toNumber()).toBeCloseTo(1506.60, 2)
    })

    it('Saskatchewan with 10% down: PST = premium * 0.06', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'SK'
      )
      // Premium = $16,740, PST = $16,740 * 0.06 = $1,004.40
      expect(result.premium.toNumber()).toBe(16740)
      expect(result.pst.toNumber()).toBeCloseTo(1004.40, 2)
    })

    it('Alberta with 10% down: PST = $0 (no PST on CMHC)', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'AB'
      )
      expect(result.pst.toNumber()).toBe(0)
    })

    it('BC with 10% down: PST = $0 (no PST on CMHC)', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'BC'
      )
      expect(result.pst.toNumber()).toBe(0)
    })
  })

  // -----------------------------------------------------------------------
  // Amortization surcharge tests
  // -----------------------------------------------------------------------
  describe('amortization surcharge', () => {
    it('10% down with 25yr amortization -- no surcharge', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'AB'
      )
      // Rate = 3.10%, no surcharge
      // Premium = $540,000 * 0.031 = $16,740
      expect(result.premium.toNumber()).toBe(16740)
    })

    it('10% down with 30yr amortization -- surcharge +0.20%', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(30),
        'AB'
      )
      // Rate = 3.10% + 0.20% = 3.30%
      // Premium = $540,000 * 0.033 = $17,820
      expect(result.premium.toNumber()).toBe(17820)
    })
  })

  // -----------------------------------------------------------------------
  // Mortgage addition tests
  // -----------------------------------------------------------------------
  describe('mortgage addition vs PST', () => {
    it('premium is added to mortgage (totalMortgageAddition = premium)', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'ON'
      )
      expect(result.totalMortgageAddition.equals(result.premium)).toBe(true)
    })

    it('PST is NOT added to mortgage (returned separately)', () => {
      const result = calculateCmhcPremium(
        new Decimal(600000),
        new Decimal(10),
        new Decimal(25),
        'ON'
      )
      // PST should be non-zero for ON
      expect(result.pst.greaterThan(0)).toBe(true)
      // totalMortgageAddition should NOT include PST
      expect(result.totalMortgageAddition.equals(result.premium)).toBe(true)
      expect(result.totalMortgageAddition.lessThan(result.premium.plus(result.pst))).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // Validation tests
  // -----------------------------------------------------------------------
  describe('validation', () => {
    it('purchase price > $1,499,999 with < 20% down -- throws error', () => {
      expect(() =>
        calculateCmhcPremium(
          new Decimal(1500000),
          new Decimal(10),
          new Decimal(25),
          'ON'
        )
      ).toThrow()
    })

    it('down payment >= 20% for any price -- no CMHC needed (no error)', () => {
      const result = calculateCmhcPremium(
        new Decimal(2000000),
        new Decimal(20),
        new Decimal(25),
        'ON'
      )
      expect(result.premium.toNumber()).toBe(0)
      expect(result.pst.toNumber()).toBe(0)
    })
  })
})
