/**
 * CMHC mortgage default insurance premium calculation.
 *
 * CMHC insurance is required when down payment is less than 20%.
 * The premium is calculated based on LTV ratio tiers and added
 * to the mortgage balance. Provincial sales tax on the premium
 * (ON, QC, SK only) is paid separately at closing.
 *
 * All arithmetic uses Decimal.js to avoid floating-point errors.
 */
import { Decimal } from '@/lib/decimal'
import type { CmhcResult } from '@/types/housing'
import {
  CMHC_TIERS,
  CMHC_AMORTIZATION_SURCHARGE,
  CMHC_PST_RATES,
  CMHC_MAX_PURCHASE_PRICE,
} from '@/lib/data/cmhc-rates'

/**
 * Calculate CMHC mortgage default insurance premium and applicable PST.
 *
 * @param purchasePrice - Property purchase price
 * @param downPaymentPercent - Down payment as percentage (e.g., 10 for 10%)
 * @param amortizationYears - Amortization period in years
 * @param province - Province code for PST lookup (e.g., 'ON', 'AB')
 * @returns CmhcResult with premium, pst, and totalMortgageAddition
 * @throws Error if purchase price exceeds $1,499,999 with less than 20% down
 */
export function calculateCmhcPremium(
  purchasePrice: Decimal,
  downPaymentPercent: Decimal,
  amortizationYears: Decimal,
  province: string
): CmhcResult {
  const zero = new Decimal(0)

  // Calculate down payment and mortgage amounts
  const downPaymentFraction = downPaymentPercent.div(100)
  const downPayment = purchasePrice.mul(downPaymentFraction)
  const mortgageAmount = purchasePrice.minus(downPayment)

  // Calculate LTV ratio
  const ltv = mortgageAmount.div(purchasePrice)

  // No CMHC required if down payment >= 20% (LTV <= 80%)
  if (ltv.lessThanOrEqualTo(0.80)) {
    return {
      premium: zero,
      pst: zero,
      totalMortgageAddition: zero,
    }
  }

  // Validate purchase price cap for insured mortgages
  if (purchasePrice.greaterThan(CMHC_MAX_PURCHASE_PRICE)) {
    throw new Error(
      `CMHC insurance is not available for properties over $${CMHC_MAX_PURCHASE_PRICE.toLocaleString()} ` +
      `with less than 20% down payment. Purchase price: $${purchasePrice.toFixed(0)}, ` +
      `down payment: ${downPaymentPercent.toFixed(2)}%.`
    )
  }

  // Find applicable CMHC tier
  let rate: Decimal | null = null
  for (const tier of CMHC_TIERS) {
    if (ltv.lessThanOrEqualTo(tier.maxLtv)) {
      rate = new Decimal(tier.rate)
      break
    }
  }

  if (rate === null) {
    throw new Error(
      `No CMHC tier found for LTV ratio ${ltv.toFixed(4)}. ` +
      `Maximum insurable LTV is 95%.`
    )
  }

  // Apply amortization surcharge for periods over 25 years
  if (amortizationYears.greaterThan(25)) {
    rate = rate.plus(CMHC_AMORTIZATION_SURCHARGE)
  }

  // Calculate premium
  const premium = mortgageAmount.mul(rate)

  // Calculate PST (only ON, QC, SK)
  const pstRate = CMHC_PST_RATES[province as keyof typeof CMHC_PST_RATES]
  const pst = pstRate ? premium.mul(pstRate) : zero

  return {
    premium,
    pst,
    totalMortgageAddition: premium, // PST is NOT added to mortgage
  }
}
