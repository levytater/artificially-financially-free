/**
 * Housing projection orchestrator -- composes all individual calculation
 * functions into a complete year-by-year housing cost projection.
 *
 * This is the final output of Phase 2: a single function that takes
 * calculator inputs and produces a complete HousingProjection object.
 * It feeds directly into Phase 3 (investment comparison) and Phase 5+
 * (display).
 *
 * All arithmetic uses Decimal.js exclusively -- no native JS on financial values.
 */
import { Decimal } from '@/lib/decimal'
import type {
  HousingProjection,
  UpfrontCosts,
  YearlyHousingCost,
  ExitPosition,
  ProvinceCode,
} from '@/types/housing'
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  calculateYearlyMortgageSummary,
} from '@/lib/calculations/mortgage'
import { calculateCmhcPremium } from '@/lib/calculations/cmhc'
import { calculateLandTransferTax } from '@/lib/calculations/land-transfer-tax'
import { calculatePropertyTax, calculateMaintenance } from '@/lib/calculations/property-tax'
import { calculateBuyingCosts, calculateSellingCosts } from '@/lib/calculations/closing-costs'
import { calculateAppreciatedValue } from '@/lib/calculations/appreciation'
import { DEFAULT_PROPERTY_TAX_RATES } from '@/lib/data/provinces'
import {
  DEFAULT_HOME_INSURANCE,
  DEFAULT_MAINTENANCE_RATE,
  DEFAULT_APPRECIATION_RATE,
} from '@/lib/data/closing-cost-defaults'

// ---------------------------------------------------------------------------
// Input Interface
// ---------------------------------------------------------------------------

/**
 * Input parameters for the housing projection calculation.
 *
 * Rate inputs use percentage convention (e.g., 3.0 for 3%) consistent
 * with the rest of the calculation engine. Optional parameters fall back
 * to sensible Canadian defaults.
 */
export interface HousingProjectionInput {
  /** Property purchase price in CAD */
  purchasePrice: number
  /** Down payment as percentage of purchase price (e.g., 20 for 20%) */
  downPaymentPercent: number
  /** Annual mortgage interest rate as percentage (e.g., 5.5 for 5.5%) */
  mortgageRate: number
  /** Mortgage amortization period in years (e.g., 25) */
  amortizationYears: number
  /** Two-letter province code (e.g., 'ON') */
  province: string
  /** Number of years to project (e.g., 25) */
  timeHorizon: number
  /** Whether buyer qualifies for first-time home buyer rebate */
  firstTimeBuyer: boolean
  /** Annual property tax rate as percentage (default: from province data) */
  propertyTaxRate?: number
  /** Annual maintenance rate as percentage of home value (default: 1%) */
  maintenanceRate?: number
  /** Annual home insurance premium in CAD (default: $2,400) */
  homeInsurance?: number
  /** Annual home appreciation rate as percentage (default: 3%) */
  appreciationRate?: number
}

// ---------------------------------------------------------------------------
// Main Orchestrator
// ---------------------------------------------------------------------------

/**
 * Calculate a complete housing cost projection from purchase through sale.
 *
 * Composes all Phase 2 calculation functions:
 * - CMHC premium and PST (cmhc.ts)
 * - Land transfer tax with FTHB rebate (land-transfer-tax.ts)
 * - Buying/selling closing costs (closing-costs.ts)
 * - Mortgage payment and amortization (mortgage.ts)
 * - Property tax and maintenance (property-tax.ts)
 * - Home appreciation (appreciation.ts)
 *
 * @param input - Calculator inputs (purchase price, rates, province, etc.)
 * @returns Complete HousingProjection with upfront costs, yearly data, and exit position
 */
export function calculateHousingProjection(
  input: HousingProjectionInput
): HousingProjection {
  // -------------------------------------------------------------------------
  // 1. Convert inputs to Decimal
  // -------------------------------------------------------------------------
  const purchasePrice = new Decimal(input.purchasePrice)
  const downPaymentPercent = new Decimal(input.downPaymentPercent)
  const mortgageRate = new Decimal(input.mortgageRate)
  const amortizationYears = new Decimal(input.amortizationYears)
  const province = input.province as ProvinceCode
  const timeHorizon = input.timeHorizon
  const firstTimeBuyer = input.firstTimeBuyer

  // Resolve optional parameters to defaults
  const propertyTaxRate = new Decimal(
    input.propertyTaxRate ?? DEFAULT_PROPERTY_TAX_RATES[province]
  )
  const maintenanceRate = new Decimal(
    input.maintenanceRate ?? DEFAULT_MAINTENANCE_RATE * 100
  )
  const homeInsurance = new Decimal(
    input.homeInsurance ?? DEFAULT_HOME_INSURANCE
  )
  const appreciationRate = new Decimal(
    input.appreciationRate ?? DEFAULT_APPRECIATION_RATE * 100
  )

  // -------------------------------------------------------------------------
  // 2. Calculate CMHC premium and PST
  // -------------------------------------------------------------------------
  const cmhcResult = calculateCmhcPremium(
    purchasePrice,
    downPaymentPercent,
    amortizationYears,
    province
  )

  // -------------------------------------------------------------------------
  // 3. Determine actual mortgage principal
  //    mortgage = purchasePrice - downPayment + cmhcPremium
  //    (CMHC premium is added to mortgage; PST is paid cash at closing)
  // -------------------------------------------------------------------------
  const downPayment = purchasePrice.mul(downPaymentPercent).div(100)
  const baseMortgage = purchasePrice.minus(downPayment)
  const mortgagePrincipal = baseMortgage.plus(cmhcResult.premium)

  // -------------------------------------------------------------------------
  // 4. Calculate land transfer tax (with FTHB rebate if applicable)
  // -------------------------------------------------------------------------
  const lttResult = calculateLandTransferTax(purchasePrice, province, firstTimeBuyer)

  // -------------------------------------------------------------------------
  // 5. Calculate buying closing costs
  // -------------------------------------------------------------------------
  const buyingCosts = calculateBuyingCosts({
    ltt: lttResult.netTax,
    cmhcPst: cmhcResult.pst,
  })

  // -------------------------------------------------------------------------
  // 6. Build UpfrontCosts
  // -------------------------------------------------------------------------
  const upfrontCosts: UpfrontCosts = {
    downPayment,
    cmhcPremium: cmhcResult.premium,
    cmhcPst: cmhcResult.pst,
    ltt: lttResult.netTax,
    buyingClosingCosts: buyingCosts.total,
    totalCashRequired: downPayment.plus(buyingCosts.total),
  }

  // -------------------------------------------------------------------------
  // 7. Generate amortization schedule for full amortization period
  // -------------------------------------------------------------------------
  const amortSchedule = generateAmortizationSchedule(
    mortgagePrincipal,
    mortgageRate,
    amortizationYears
  )
  const yearlySummary = calculateYearlyMortgageSummary(amortSchedule)

  // -------------------------------------------------------------------------
  // 8. Build year-by-year projection
  // -------------------------------------------------------------------------
  const yearlyProjection: YearlyHousingCost[] = []
  let cumulativeCost = new Decimal(0)
  const zero = new Decimal(0)

  for (let year = 1; year <= timeHorizon; year++) {
    // Home value appreciated for this year (end-of-year value)
    const homeValue = calculateAppreciatedValue(purchasePrice, appreciationRate, year)

    // Start-of-year value for property tax and maintenance
    // Year 1 start = purchase price, Year N start = appreciated value at year N-1
    const startOfYearValue = year === 1
      ? purchasePrice
      : calculateAppreciatedValue(purchasePrice, appreciationRate, year - 1)

    // Mortgage: use yearly summary if within amortization, else $0
    const mortgageYear = yearlySummary[year - 1] // 0-indexed
    const hasMortgage = mortgageYear !== undefined

    const mortgagePayment = hasMortgage ? mortgageYear.totalPayment : zero
    const principalPaid = hasMortgage ? mortgageYear.totalPrincipal : zero
    const interestPaid = hasMortgage ? mortgageYear.totalInterest : zero
    const remainingBalance = hasMortgage ? mortgageYear.endBalance : zero

    // Property tax and maintenance based on start-of-year value
    const propTax = calculatePropertyTax(startOfYearValue, propertyTaxRate)
    const maint = calculateMaintenance(startOfYearValue, maintenanceRate)

    // Home equity
    const homeEquity = homeValue.minus(remainingBalance)

    // Total annual cash outflow
    const totalAnnualCost = mortgagePayment
      .plus(propTax)
      .plus(maint)
      .plus(homeInsurance)

    // Cumulative cost
    cumulativeCost = cumulativeCost.plus(totalAnnualCost)

    yearlyProjection.push({
      year,
      mortgagePayment,
      principalPaid,
      interestPaid,
      remainingBalance,
      propertyTax: propTax,
      maintenance: maint,
      homeInsurance,
      homeValue,
      homeEquity,
      totalAnnualCost,
      cumulativeCost,
    })
  }

  // -------------------------------------------------------------------------
  // 9. Calculate exit position
  // -------------------------------------------------------------------------
  const finalHomeValue = calculateAppreciatedValue(
    purchasePrice,
    appreciationRate,
    timeHorizon
  )
  const finalBalance = yearlyProjection.length > 0
    ? yearlyProjection[yearlyProjection.length - 1].remainingBalance
    : zero

  const sellingCostsResult = calculateSellingCosts(finalHomeValue)

  const exitPosition: ExitPosition = {
    homeValue: finalHomeValue,
    remainingMortgage: finalBalance,
    sellingCosts: sellingCostsResult.total,
    netProceeds: finalHomeValue.minus(finalBalance).minus(sellingCostsResult.total),
  }

  return {
    upfrontCosts,
    yearlyProjection,
    exitPosition,
  }
}
