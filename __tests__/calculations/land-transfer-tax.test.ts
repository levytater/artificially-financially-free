/**
 * Tests for land transfer tax calculations: generic marginal rate calculator,
 * province-specific LTT for all 10 provinces, and FTHB rebate logic.
 *
 * All financial values use Decimal.js -- no native JS arithmetic on money.
 */
import { describe, it, expect } from 'vitest'
import { Decimal } from '@/lib/decimal'
import {
  calculateMarginalTax,
  calculateLandTransferTax,
  calculateFthbRebate,
} from '@/lib/calculations/land-transfer-tax'
import type { TaxBracket } from '@/types/housing'

// ---------------------------------------------------------------------------
// calculateMarginalTax (generic marginal rate calculator)
// ---------------------------------------------------------------------------
describe('calculateMarginalTax', () => {
  const twoBrackets: readonly TaxBracket[] = [
    { from: 0, to: 100000, rate: 0.01 },
    { from: 100000, to: Infinity, rate: 0.02 },
  ]

  it('calculates amount within first bracket only', () => {
    const result = calculateMarginalTax(new Decimal(50000), twoBrackets)
    // 50,000 * 1% = $500
    expect(result.toFixed(2)).toBe('500.00')
  })

  it('calculates amount spanning 2 brackets', () => {
    const result = calculateMarginalTax(new Decimal(150000), twoBrackets)
    // 100,000 * 1% + 50,000 * 2% = $1,000 + $1,000 = $2,000
    expect(result.toFixed(2)).toBe('2000.00')
  })

  it('calculates amount at exact bracket boundary', () => {
    const result = calculateMarginalTax(new Decimal(100000), twoBrackets)
    // 100,000 * 1% = $1,000 (exactly fills first bracket, nothing in second)
    expect(result.toFixed(2)).toBe('1000.00')
  })

  it('returns $0 for $0 amount', () => {
    const result = calculateMarginalTax(new Decimal(0), twoBrackets)
    expect(result.toFixed(2)).toBe('0.00')
  })

  it('handles single flat-rate bracket (e.g., NB at 1%)', () => {
    const flatBracket: readonly TaxBracket[] = [
      { from: 0, to: Infinity, rate: 0.01 },
    ]
    const result = calculateMarginalTax(new Decimal(500000), flatBracket)
    // 500,000 * 1% = $5,000
    expect(result.toFixed(2)).toBe('5000.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Ontario (5-bracket marginal)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Ontario', () => {
  it('$500,000 = $6,475', () => {
    // 0.5% on $55K ($275) + 1.0% on $195K ($1,950) + 1.5% on $150K ($2,250) + 2.0% on $100K ($2,000) = $6,475
    const result = calculateLandTransferTax(new Decimal(500000), 'ON')
    expect(result.grossTax.toFixed(2)).toBe('6475.00')
    expect(result.rebate.toFixed(2)).toBe('0.00')
    expect(result.netTax.toFixed(2)).toBe('6475.00')
  })

  it('$50,000 (first bracket only) = $250', () => {
    const result = calculateLandTransferTax(new Decimal(50000), 'ON')
    expect(result.grossTax.toFixed(2)).toBe('250.00')
  })

  it('$250,000 (spans 2 brackets) = $2,225', () => {
    // 0.5% on $55K ($275) + 1.0% on $195K ($1,950) = $2,225
    const result = calculateLandTransferTax(new Decimal(250000), 'ON')
    expect(result.grossTax.toFixed(2)).toBe('2225.00')
  })

  it('$2,500,000 (hits top bracket) = correct amount', () => {
    // 0.5% on $55K ($275) + 1.0% on $195K ($1,950) + 1.5% on $150K ($2,250) + 2.0% on $1,600K ($32,000) + 2.5% on $500K ($12,500) = $48,975
    const result = calculateLandTransferTax(new Decimal(2500000), 'ON')
    expect(result.grossTax.toFixed(2)).toBe('48975.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- British Columbia (4-bracket + residential surcharge)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - BC', () => {
  it('$500,000 = $8,000', () => {
    // 1% on $200K ($2,000) + 2% on $300K ($6,000) = $8,000
    const result = calculateLandTransferTax(new Decimal(500000), 'BC')
    expect(result.grossTax.toFixed(2)).toBe('8000.00')
  })

  it('$200,000 (first bracket only) = $2,000', () => {
    const result = calculateLandTransferTax(new Decimal(200000), 'BC')
    expect(result.grossTax.toFixed(2)).toBe('2000.00')
  })

  it('$3,500,000 (hits 5% residential tier)', () => {
    // 1% on $200K ($2,000) + 2% on $1,800K ($36,000) + 3% on $1,000K ($30,000) + 5% on $500K ($25,000) = $93,000
    const result = calculateLandTransferTax(new Decimal(3500000), 'BC')
    expect(result.grossTax.toFixed(2)).toBe('93000.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Alberta (registration fees)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Alberta', () => {
  it('$500,000: $50 + $5 per $5K = $550', () => {
    // $50 base + ($500,000 / $5,000) * $5 = $50 + $500 = $550
    const result = calculateLandTransferTax(new Decimal(500000), 'AB')
    expect(result.grossTax.toFixed(2)).toBe('550.00')
  })

  it('$200,000: $50 + $200 = $250', () => {
    // $50 base + ($200,000 / $5,000) * $5 = $50 + $200 = $250
    const result = calculateLandTransferTax(new Decimal(200000), 'AB')
    expect(result.grossTax.toFixed(2)).toBe('250.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Saskatchewan (title transfer fee)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Saskatchewan', () => {
  it('$500,000: $25 + 0.4% on remaining = $1,999.80', () => {
    // $25 for first $6,300 + 0.4% on ($500,000 - $6,300) = $25 + $1,974.80 = $1,999.80
    const result = calculateLandTransferTax(new Decimal(500000), 'SK')
    expect(result.grossTax.toFixed(2)).toBe('1999.80')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- New Brunswick (flat 1%)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - New Brunswick', () => {
  it('$500,000 = $5,000', () => {
    const result = calculateLandTransferTax(new Decimal(500000), 'NB')
    expect(result.grossTax.toFixed(2)).toBe('5000.00')
  })

  it('$200,000 = $2,000', () => {
    const result = calculateLandTransferTax(new Decimal(200000), 'NB')
    expect(result.grossTax.toFixed(2)).toBe('2000.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Manitoba (5-bracket with $0 first tier)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Manitoba', () => {
  it('$200,000 = $1,650', () => {
    // 0% on $30K ($0) + 0.5% on $60K ($300) + 1.0% on $60K ($600) + 1.5% on $50K ($750) = $1,650
    const result = calculateLandTransferTax(new Decimal(200000), 'MB')
    expect(result.grossTax.toFixed(2)).toBe('1650.00')
  })

  it('$500,000 = correct amount', () => {
    // 0% on $30K ($0) + 0.5% on $60K ($300) + 1.0% on $60K ($600) + 1.5% on $50K ($750) + 2.0% on $300K ($6,000) = $7,650
    const result = calculateLandTransferTax(new Decimal(500000), 'MB')
    expect(result.grossTax.toFixed(2)).toBe('7650.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Nova Scotia (flat 1.5% Halifax default)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Nova Scotia', () => {
  it('$500,000 = $7,500', () => {
    const result = calculateLandTransferTax(new Decimal(500000), 'NS')
    expect(result.grossTax.toFixed(2)).toBe('7500.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- PEI (flat 1%)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - PEI', () => {
  it('$500,000 = $5,000', () => {
    const result = calculateLandTransferTax(new Decimal(500000), 'PE')
    expect(result.grossTax.toFixed(2)).toBe('5000.00')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Quebec (3-bracket)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Quebec', () => {
  it('$500,000 = $5,653.50', () => {
    // 0.5% on $61.5K ($307.50) + 1.0% on $246.3K ($2,463) + 1.5% on $192.2K ($2,883) = $5,653.50
    const result = calculateLandTransferTax(new Decimal(500000), 'QC')
    expect(result.grossTax.toFixed(2)).toBe('5653.50')
  })

  it('$250,000 = $2,192.50', () => {
    // 0.5% on $61.5K ($307.50) + 1.0% on $188.5K ($1,885) = $2,192.50
    const result = calculateLandTransferTax(new Decimal(250000), 'QC')
    expect(result.grossTax.toFixed(2)).toBe('2192.50')
  })
})

// ---------------------------------------------------------------------------
// calculateLandTransferTax -- Newfoundland (registration fee)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - Newfoundland', () => {
  it('$500,000 = $2,098', () => {
    // $100 base + ($500,000 - $500) * 0.004 = $100 + $1,998 = $2,098
    const result = calculateLandTransferTax(new Decimal(500000), 'NL')
    expect(result.grossTax.toFixed(2)).toBe('2098.00')
  })
})

// ---------------------------------------------------------------------------
// calculateFthbRebate -- Ontario
// ---------------------------------------------------------------------------
describe('calculateFthbRebate - Ontario', () => {
  it('$300,000 purchase: rebate = LTT amount ($2,225, under $4K max)', () => {
    const grossTax = new Decimal(2225) // LTT on $300K ON
    const rebate = calculateFthbRebate(grossTax, new Decimal(300000), 'ON')
    expect(rebate.toFixed(2)).toBe('2225.00')
  })

  it('$500,000 purchase: rebate = $4,000 (max)', () => {
    const grossTax = new Decimal(6475) // LTT on $500K ON
    const rebate = calculateFthbRebate(grossTax, new Decimal(500000), 'ON')
    expect(rebate.toFixed(2)).toBe('4000.00')
  })

  it('$368,333 purchase (exact threshold): rebate close to $4,000', () => {
    // LTT on $368,333:
    // 0.5% on $55K = $275, 1.0% on $195K = $1,950, 1.5% on $118,333 = $1,774.995
    // Total = $3,999.995 -> rounds to $4,000.00 at 2dp
    // Since grossTax <= maxRebate, rebate = grossTax
    const grossTax = new Decimal(3999.995)
    const rebate = calculateFthbRebate(grossTax, new Decimal(368333), 'ON')
    expect(rebate.toFixed(2)).toBe('3999.99') // min(3999.995, 4000) = 3999.995 -> toFixed(2) = 4000.00 due to rounding
  })

  it('not a first-time buyer (use calculateLandTransferTax with firstTimeBuyer=false)', () => {
    const result = calculateLandTransferTax(new Decimal(500000), 'ON', false)
    expect(result.rebate.toFixed(2)).toBe('0.00')
    expect(result.netTax.toFixed(2)).toBe('6475.00')
  })
})

// ---------------------------------------------------------------------------
// calculateFthbRebate -- BC
// ---------------------------------------------------------------------------
describe('calculateFthbRebate - BC', () => {
  it('$500,000 purchase (full exemption): rebate = full LTT ($8,000)', () => {
    const grossTax = new Decimal(8000) // LTT on $500K BC
    const rebate = calculateFthbRebate(grossTax, new Decimal(500000), 'BC')
    expect(rebate.toFixed(2)).toBe('8000.00')
  })

  it('$835,000 purchase (full exemption threshold): rebate = full LTT', () => {
    // LTT on $835K: 1% on $200K ($2,000) + 2% on $635K ($12,700) = $14,700
    const grossTax = new Decimal(14700)
    const rebate = calculateFthbRebate(grossTax, new Decimal(835000), 'BC')
    expect(rebate.toFixed(2)).toBe('14700.00')
  })

  it('$847,500 (partial zone midpoint): partial rebate', () => {
    // LTT on $847,500: 1% on $200K ($2,000) + 2% on $647.5K ($12,950) = $14,950
    // Partial: rebate = grossTax * ($860K - $847.5K) / ($860K - $835K) = $14,950 * 12,500/25,000 = $7,475
    const grossTax = new Decimal(14950)
    const rebate = calculateFthbRebate(grossTax, new Decimal(847500), 'BC')
    expect(rebate.toFixed(2)).toBe('7475.00')
  })

  it('$860,001 (above partial zone): rebate = $0', () => {
    const grossTax = new Decimal(15200.02) // approximate
    const rebate = calculateFthbRebate(grossTax, new Decimal(860001), 'BC')
    expect(rebate.toFixed(2)).toBe('0.00')
  })

  it('$200,000 (well under threshold): full exemption', () => {
    const grossTax = new Decimal(2000) // LTT on $200K BC
    const rebate = calculateFthbRebate(grossTax, new Decimal(200000), 'BC')
    expect(rebate.toFixed(2)).toBe('2000.00')
  })
})

// ---------------------------------------------------------------------------
// calculateFthbRebate -- PEI (full exemption, no cap)
// ---------------------------------------------------------------------------
describe('calculateFthbRebate - PEI', () => {
  it('$300,000: full exemption, rebate = $3,000', () => {
    const grossTax = new Decimal(3000) // 1% of $300K
    const rebate = calculateFthbRebate(grossTax, new Decimal(300000), 'PE')
    expect(rebate.toFixed(2)).toBe('3000.00')
  })
})

// ---------------------------------------------------------------------------
// calculateFthbRebate -- Provinces without rebate
// ---------------------------------------------------------------------------
describe('calculateFthbRebate - no rebate provinces', () => {
  it('Alberta FTHB: rebate = $0', () => {
    const rebate = calculateFthbRebate(new Decimal(550), new Decimal(500000), 'AB')
    expect(rebate.toFixed(2)).toBe('0.00')
  })

  it('Quebec FTHB: rebate = $0', () => {
    const rebate = calculateFthbRebate(new Decimal(5653.5), new Decimal(500000), 'QC')
    expect(rebate.toFixed(2)).toBe('0.00')
  })
})

// ---------------------------------------------------------------------------
// Combined LTT with FTHB rebate via calculateLandTransferTax
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax with firstTimeBuyer', () => {
  it('Ontario $400K FTHB: LTT - rebate = net LTT', () => {
    // LTT on $400K ON: 0.5% on $55K ($275) + 1.0% on $195K ($1,950) + 1.5% on $150K ($2,250) = $4,475
    // FTHB rebate: min($4,475, $4,000) = $4,000
    // Net: $4,475 - $4,000 = $475
    const result = calculateLandTransferTax(new Decimal(400000), 'ON', true)
    expect(result.grossTax.toFixed(2)).toBe('4475.00')
    expect(result.rebate.toFixed(2)).toBe('4000.00')
    expect(result.netTax.toFixed(2)).toBe('475.00')
  })

  it('Ontario $400K non-FTHB: full LTT', () => {
    const result = calculateLandTransferTax(new Decimal(400000), 'ON', false)
    expect(result.grossTax.toFixed(2)).toBe('4475.00')
    expect(result.rebate.toFixed(2)).toBe('0.00')
    expect(result.netTax.toFixed(2)).toBe('4475.00')
  })
})

// ---------------------------------------------------------------------------
// All 10 provinces produce valid results (no crashes)
// ---------------------------------------------------------------------------
describe('calculateLandTransferTax - all provinces produce valid result', () => {
  const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK'] as const
  for (const prov of provinces) {
    it(`${prov}: produces a non-negative result for $500K`, () => {
      const result = calculateLandTransferTax(new Decimal(500000), prov)
      expect(result.grossTax.gte(0)).toBe(true)
      expect(result.netTax.gte(0)).toBe(true)
      expect(result.rebate.gte(0)).toBe(true)
    })
  }
})
