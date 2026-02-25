/**
 * Buying and selling closing cost calculations.
 *
 * Buying costs include legal, inspection, title insurance, appraisal,
 * plus LTT and CMHC PST (passed in as they're calculated elsewhere).
 *
 * Selling costs include realtor commission, legal, and mortgage discharge.
 *
 * All arithmetic uses Decimal.js exclusively.
 */
import { Decimal } from '@/lib/decimal'
import type { BuyingCosts, SellingCosts } from '@/types/housing'
import {
  BUYING_COST_DEFAULTS,
  SELLING_COST_DEFAULTS,
} from '@/lib/data/closing-cost-defaults'

/** Inputs for buying cost calculation */
export interface BuyingCostInputs {
  /** Legal fees (default: $2,000) */
  legalFees?: number
  /** Home inspection fee (default: $500) */
  homeInspection?: number
  /** Title insurance fee (default: $300) */
  titleInsurance?: number
  /** Appraisal fee (default: $0) */
  appraisalFee?: number
  /** Land transfer tax (calculated by LTT module) */
  ltt: Decimal
  /** CMHC PST (calculated by CMHC module) */
  cmhcPst: Decimal
}

/** Inputs for selling cost calculation */
export interface SellingCostInputs {
  /** Realtor commission rate as decimal (default: 0.05 = 5%) */
  commissionRate?: number
  /** Legal fees (default: $1,000) */
  legalFees?: number
  /** Mortgage discharge fee (default: $300) */
  mortgageDischarge?: number
}

/**
 * Look up the default amount for a named buying cost item.
 */
function getBuyingDefault(name: string): number {
  const item = BUYING_COST_DEFAULTS.find((c) => c.name === name)
  return item?.defaultAmount ?? 0
}

/**
 * Calculate total buying closing costs.
 *
 * LTT and CMHC PST are passed in because they're calculated by separate
 * modules (land-transfer-tax.ts and cmhc.ts respectively).
 *
 * @param inputs - Buying cost parameters (optional fields use defaults)
 * @returns BuyingCosts breakdown with individual items and total
 */
export function calculateBuyingCosts(inputs: BuyingCostInputs): BuyingCosts {
  const legal = new Decimal(inputs.legalFees ?? getBuyingDefault('legal'))
  const inspection = new Decimal(inputs.homeInspection ?? getBuyingDefault('inspection'))
  const titleInsurance = new Decimal(inputs.titleInsurance ?? getBuyingDefault('titleInsurance'))
  const appraisal = new Decimal(inputs.appraisalFee ?? getBuyingDefault('appraisal'))
  const ltt = inputs.ltt
  const cmhcPst = inputs.cmhcPst

  const total = ltt.plus(legal).plus(inspection).plus(titleInsurance).plus(cmhcPst).plus(appraisal)

  return {
    ltt,
    legal,
    inspection,
    titleInsurance,
    cmhcPst,
    appraisal,
    total,
  }
}

/**
 * Calculate total selling closing costs.
 *
 * @param salePrice - Home sale price as Decimal
 * @param inputs - Optional selling cost parameters (use defaults when omitted)
 * @returns SellingCosts breakdown with individual items and total
 */
export function calculateSellingCosts(
  salePrice: Decimal,
  inputs?: SellingCostInputs
): SellingCosts {
  const commissionRate = new Decimal(
    inputs?.commissionRate ?? SELLING_COST_DEFAULTS.realtorCommissionRate
  )
  const legal = new Decimal(inputs?.legalFees ?? SELLING_COST_DEFAULTS.legal)
  const mortgageDischarge = new Decimal(
    inputs?.mortgageDischarge ?? SELLING_COST_DEFAULTS.mortgageDischarge
  )

  const realtorCommission = salePrice.mul(commissionRate)
  const total = realtorCommission.plus(legal).plus(mortgageDischarge)

  return {
    realtorCommission,
    legal,
    mortgageDischarge,
    total,
  }
}
