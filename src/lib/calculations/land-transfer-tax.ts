/**
 * Land transfer tax (LTT) calculations for all 10 Canadian provinces.
 *
 * Provides:
 * 1. A generic marginal rate calculator (reusable for income tax in Phase 3)
 * 2. Province-specific LTT with special handling for AB, SK, and NL fee formulas
 * 3. First-time home buyer (FTHB) rebate logic for ON, BC, and PE
 *
 * All arithmetic uses Decimal.js exclusively -- no native JS on financial values.
 *
 * Sources:
 * - Ontario: ontario.ca Land Transfer Tax Act
 * - BC: gov.bc.ca Property Transfer Tax + FTHB exemption
 * - Quebec: Standard provincial "droits de mutation" brackets (2025-2026 indexed thresholds)
 * - Manitoba: gov.mb.ca Land Transfer Tax
 * - New Brunswick: Flat 1% real property transfer tax
 * - Nova Scotia: Municipal deed transfer tax (Halifax 1.5% default)
 * - PEI: Real Property Transfer Tax Act, 1% with FTHB full exemption
 * - Newfoundland: Registration of Deeds Act ($100 base + $0.40/$100 over $500)
 * - Alberta: Land Titles Act ($50 + $5 per $5,000 registration fee)
 * - Saskatchewan: Land Titles Act 2000 ($25 base + 0.4% over $6,300)
 */
import { Decimal } from '@/lib/decimal'
import { LTT_CONFIG } from '@/lib/data/ltt-brackets'
import type { ProvinceCode, TaxBracket } from '@/types/housing'

/**
 * Calculate tax using marginal rate brackets.
 *
 * This is a generic utility that applies progressive/marginal tax rates
 * to an amount. It works for any bracket system: LTT, income tax, etc.
 *
 * @param amount - The taxable amount as Decimal
 * @param brackets - Ordered array of tax brackets (from lowest to highest)
 * @returns Total tax as Decimal
 *
 * @example
 * // Ontario LTT on $500,000
 * const tax = calculateMarginalTax(new Decimal(500000), ON_BRACKETS)
 * // Returns Decimal(6475)
 */
export function calculateMarginalTax(
  amount: Decimal,
  brackets: readonly TaxBracket[]
): Decimal {
  let tax = new Decimal(0)

  for (const bracket of brackets) {
    const from = new Decimal(bracket.from)
    const to = bracket.to === Infinity ? new Decimal(Infinity) : new Decimal(bracket.to)
    const rate = new Decimal(bracket.rate)

    // If the amount doesn't reach this bracket, stop
    if (amount.lte(from)) break

    // Calculate the taxable portion within this bracket
    const taxableInBracket = Decimal.min(amount, to).minus(from)

    tax = tax.plus(taxableInBracket.mul(rate))
  }

  return tax
}

/**
 * Calculate Alberta registration fee.
 *
 * Alberta has no LTT -- only a property transfer registration fee:
 * $50 base + $5 per $5,000 of property value.
 *
 * @param purchasePrice - Property value as Decimal
 * @returns Registration fee as Decimal
 */
function calculateAlbertaFee(purchasePrice: Decimal): Decimal {
  const baseFee = new Decimal(50)
  const perUnit = new Decimal(5)
  const unitSize = new Decimal(5000)
  const units = purchasePrice.div(unitSize).floor()
  return baseFee.plus(units.mul(perUnit))
}

/**
 * Calculate Saskatchewan title transfer fee.
 *
 * Saskatchewan has no LTT -- only a title transfer fee:
 * $25 for the first $6,300 + 0.4% on amounts over $6,300.
 *
 * @param purchasePrice - Property value as Decimal
 * @returns Transfer fee as Decimal
 */
function calculateSaskatchewanFee(purchasePrice: Decimal): Decimal {
  const baseFee = new Decimal(25)
  const threshold = new Decimal(6300)
  const rate = new Decimal(0.004)

  if (purchasePrice.lte(threshold)) {
    return baseFee
  }

  return baseFee.plus(purchasePrice.minus(threshold).mul(rate))
}

/**
 * Calculate Newfoundland registration fee.
 *
 * Newfoundland has no LTT -- only a registration fee:
 * $100 base + $0.40 per $100 of value over $500.
 * This is equivalent to: $100 + (value - $500) * 0.004
 *
 * @param purchasePrice - Property value as Decimal
 * @returns Registration fee as Decimal
 */
function calculateNewfoundlandFee(purchasePrice: Decimal): Decimal {
  const baseFee = new Decimal(100)
  const threshold = new Decimal(500)
  const rate = new Decimal(0.004)

  if (purchasePrice.lte(threshold)) {
    return baseFee
  }

  return baseFee.plus(purchasePrice.minus(threshold).mul(rate))
}

/**
 * Calculate land transfer tax for a specific province.
 *
 * Handles three categories:
 * 1. Provinces with marginal bracket LTT (ON, BC, QC, MB, NB, NS, PE)
 * 2. Provinces with registration fee formulas (AB, SK, NL)
 * 3. FTHB rebate application when firstTimeBuyer is true
 *
 * @param purchasePrice - Property purchase price as Decimal
 * @param province - Two-letter province code
 * @param firstTimeBuyer - Whether the buyer qualifies for FTHB rebate (default: false)
 * @returns Object with grossTax, rebate, and netTax (all Decimal)
 *
 * @example
 * const result = calculateLandTransferTax(new Decimal(500000), 'ON', true)
 * // result.grossTax = 6475, result.rebate = 4000, result.netTax = 2475
 */
export function calculateLandTransferTax(
  purchasePrice: Decimal,
  province: ProvinceCode,
  firstTimeBuyer: boolean = false
): { grossTax: Decimal; rebate: Decimal; netTax: Decimal } {
  let grossTax: Decimal

  // Special handling for provinces with fee formulas (not marginal bracket systems)
  switch (province) {
    case 'AB':
      grossTax = calculateAlbertaFee(purchasePrice)
      break
    case 'SK':
      grossTax = calculateSaskatchewanFee(purchasePrice)
      break
    case 'NL':
      grossTax = calculateNewfoundlandFee(purchasePrice)
      break
    default: {
      // Standard marginal bracket calculation
      const config = LTT_CONFIG[province]
      grossTax = calculateMarginalTax(purchasePrice, config.brackets)
      break
    }
  }

  // Calculate FTHB rebate if applicable
  const rebate = firstTimeBuyer
    ? calculateFthbRebate(grossTax, purchasePrice, province)
    : new Decimal(0)

  const netTax = grossTax.minus(rebate)

  return { grossTax, rebate, netTax }
}

/**
 * Calculate first-time home buyer rebate for a province.
 *
 * Rebate rules vary by province:
 * - Ontario: Rebate = min(grossTax, $4,000)
 * - BC: Full exemption up to $835K. Partial rebate $835K-$860K (linear scale). $0 above $860K.
 * - PEI: Full exemption (rebate = grossTax), no cap
 * - All others: No FTHB rebate ($0)
 *
 * @param grossTax - The gross LTT before rebate as Decimal
 * @param purchasePrice - Property purchase price as Decimal
 * @param province - Two-letter province code
 * @returns Rebate amount as Decimal (always >= 0)
 */
export function calculateFthbRebate(
  grossTax: Decimal,
  purchasePrice: Decimal,
  province: ProvinceCode
): Decimal {
  const config = LTT_CONFIG[province]
  const fthb = config.fthbRebate

  // No FTHB rebate for this province
  if (!fthb) {
    return new Decimal(0)
  }

  const maxRebate = fthb.maxRebate === Infinity
    ? new Decimal(Infinity)
    : new Decimal(fthb.maxRebate)
  const fullExemptionUpTo = fthb.fullExemptionUpTo === Infinity
    ? new Decimal(Infinity)
    : new Decimal(fthb.fullExemptionUpTo)

  // If purchase price is at or below full exemption threshold
  if (purchasePrice.lte(fullExemptionUpTo)) {
    return Decimal.min(grossTax, maxRebate)
  }

  // Check for partial exemption zone (only BC has this currently)
  if (fthb.partialExemptionUpTo !== undefined) {
    const partialUpTo = new Decimal(fthb.partialExemptionUpTo)

    if (purchasePrice.gt(partialUpTo)) {
      // Above partial zone -- no rebate
      return new Decimal(0)
    }

    // In partial zone: rebate scales linearly from full to zero
    // rebate = grossTax * (partialUpTo - purchasePrice) / (partialUpTo - fullExemptionUpTo)
    const numerator = partialUpTo.minus(purchasePrice)
    const denominator = partialUpTo.minus(fullExemptionUpTo)
    const partialRebate = grossTax.mul(numerator).div(denominator)

    return Decimal.min(partialRebate, maxRebate)
  }

  // Above full exemption threshold and no partial zone -- no rebate
  // For provinces like Ontario where the threshold is the breakeven (max rebate = LTT at threshold)
  // we still give min(grossTax, maxRebate) since the maxRebate is the cap
  return Decimal.min(grossTax, maxRebate)
}
