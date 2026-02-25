/**
 * Default closing cost line items and housing cost assumptions.
 *
 * All dollar amounts are in CAD. Rates are as percentages where noted,
 * or as decimals where noted.
 *
 * Sources: Industry averages for Canadian real estate transactions (2025-2026).
 */
import type { ClosingCostItem } from '@/types/housing'

// ---------------------------------------------------------------------------
// Buying Closing Costs
// ---------------------------------------------------------------------------

/** Default buying closing cost line items (excluding LTT and CMHC PST) */
export const BUYING_COST_DEFAULTS: readonly ClosingCostItem[] = [
  {
    name: 'legal',
    defaultAmount: 2000,
    description: 'Real estate lawyer fees for purchase',
  },
  {
    name: 'inspection',
    defaultAmount: 500,
    description: 'Professional home inspection',
  },
  {
    name: 'titleInsurance',
    defaultAmount: 300,
    description: 'Title insurance policy',
  },
  {
    name: 'appraisal',
    defaultAmount: 0,
    description: 'Property appraisal (usually covered by lender)',
  },
] as const

// ---------------------------------------------------------------------------
// Selling Closing Costs
// ---------------------------------------------------------------------------

/** Default selling closing cost parameters */
export const SELLING_COST_DEFAULTS = {
  /** Realtor commission as a decimal (0.05 = 5%) */
  realtorCommissionRate: 0.05,
  /** Legal fees for selling */
  legal: 1000,
  /** Mortgage discharge fee */
  mortgageDischarge: 300,
} as const

// ---------------------------------------------------------------------------
// Ongoing Housing Cost Defaults
// ---------------------------------------------------------------------------

/** Annual home insurance premium in CAD ($200/month) */
export const DEFAULT_HOME_INSURANCE = 2400

/** Annual maintenance as a decimal rate of home value (0.01 = 1%) */
export const DEFAULT_MAINTENANCE_RATE = 0.01

/** Annual home appreciation as a decimal rate (0.03 = 3% nominal) */
export const DEFAULT_APPRECIATION_RATE = 0.03

/** Annual rent increase as a decimal rate (0.02 = 2% CPI target) */
export const DEFAULT_RENT_INCREASE_RATE = 0.02
