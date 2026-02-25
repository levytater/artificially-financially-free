/**
 * CMHC mortgage default insurance rates and related constants.
 *
 * Source: CMHC official premium table
 * https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/
 *   mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/
 *   premium-information-for-homeowner-and-small-rental-loans
 *
 * Last verified: 2026-02-24
 */
import type { CmhcTier, ProvinceCode } from '@/types/housing'

/**
 * CMHC premium tiers by loan-to-value ratio.
 *
 * Premium is applied to the mortgage amount (purchase price - down payment).
 * The premium itself is added to the mortgage balance.
 */
export const CMHC_TIERS: readonly CmhcTier[] = [
  { maxLtv: 0.65, rate: 0.0060 }, // Up to 65% LTV: 0.60%
  { maxLtv: 0.75, rate: 0.0170 }, // 65.01% - 75% LTV: 1.70%
  { maxLtv: 0.80, rate: 0.0240 }, // 75.01% - 80% LTV: 2.40%
  { maxLtv: 0.85, rate: 0.0280 }, // 80.01% - 85% LTV: 2.80%
  { maxLtv: 0.90, rate: 0.0310 }, // 85.01% - 90% LTV: 3.10%
  { maxLtv: 0.95, rate: 0.0400 }, // 90.01% - 95% LTV: 4.00%
] as const

/**
 * Additional surcharge for amortization periods over 25 years.
 * Available for first-time home buyers since August 2024.
 */
export const CMHC_AMORTIZATION_SURCHARGE = 0.0020 // +0.20%

/**
 * Provincial sales tax rates applied to CMHC premium.
 *
 * PST on CMHC premium must be paid cash at closing -- it CANNOT be
 * added to the mortgage balance.
 *
 * Only ON, QC, and SK charge PST on CMHC premium.
 * Manitoba eliminated PST on CMHC in 2020.
 */
export const CMHC_PST_RATES: Readonly<Partial<Record<ProvinceCode, number>>> = {
  ON: 0.08, // Ontario 8%
  QC: 0.09, // Quebec 9%
  SK: 0.06, // Saskatchewan 6%
} as const

/**
 * Maximum purchase price eligible for CMHC mortgage default insurance.
 * Updated to $1,499,999 as of December 15, 2024.
 *
 * If purchase price exceeds this and down payment is < 20%, CMHC
 * insurance cannot be obtained -- minimum 20% down is required.
 */
export const CMHC_MAX_PURCHASE_PRICE = 1499999
