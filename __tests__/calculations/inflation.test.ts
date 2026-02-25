/**
 * Tests for inflation deflation calculations.
 *
 * Tests verify that nominal future dollar values are correctly converted
 * to real (today's) purchasing power using the standard deflation formula:
 * realValue = nominalValue / (1 + inflationRate)^year
 */
import { describe, it, expect } from 'vitest'
import { Decimal } from '@/lib/decimal'
import { deflateToRealDollars } from '@/lib/calculations/inflation'

describe('deflateToRealDollars', () => {
  it('year 0: returns nominal value unchanged', () => {
    const result = deflateToRealDollars(new Decimal(100000), new Decimal(2.5), 0)
    expect(result.toNumber()).toBe(100000)
  })

  it('$100,000 at 2.5% inflation, year 10: ~$78,120.06', () => {
    // $100,000 / 1.025^10 = $100,000 / 1.2800845... = $78,120.06
    const result = deflateToRealDollars(new Decimal(100000), new Decimal(2.5), 10)
    expect(result.toNumber()).toBeCloseTo(78120.06, 0)
  })

  it('$500,000 at 0% inflation, year 25: returns $500,000', () => {
    // 0% inflation -> no deflation regardless of year
    const result = deflateToRealDollars(new Decimal(500000), new Decimal(0), 25)
    expect(result.toNumber()).toBe(500000)
  })

  it('$1,000,000 at 2.5% inflation, year 25: ~$539,390.91', () => {
    // $1,000,000 / 1.025^25 = $1,000,000 / 1.8539... = $539,390.91
    const result = deflateToRealDollars(new Decimal(1000000), new Decimal(2.5), 25)
    expect(result.toNumber()).toBeCloseTo(539390.91, 0)
  })

  it('year 1: simple single-year deflation', () => {
    // $100,000 / 1.025 = $97,560.98
    const result = deflateToRealDollars(new Decimal(100000), new Decimal(2.5), 1)
    expect(result.toNumber()).toBeCloseTo(97560.98, 0)
  })
})
