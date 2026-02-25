/**
 * Rent-vs-buy comparison orchestrator.
 *
 * This is the Phase 3 capstone: the top-level function that composes all
 * Phase 2 (housing costs) and Phase 3 (investment/tax) calculations into
 * a complete rent-vs-buy net worth comparison with break-even analysis.
 *
 * Composition flow:
 * 1. Calculate housing projection (Phase 2)
 * 2. Calculate marginal tax rate (Phase 3-01)
 * 3. Calculate after-tax investment return (Phase 3-02)
 * 4. Calculate rent schedule (Phase 2)
 * 5. Calculate monthly savings per year (buyer cost - rent, clamped >= 0)
 * 6. Calculate portfolio growth (Phase 3-02)
 * 7. Build year-by-year comparison with both seller scenarios
 * 8. Find break-even year(s)
 *
 * All arithmetic uses Decimal.js exclusively.
 */
import { Decimal } from '@/lib/decimal'
import type {
  ComparisonInput,
  ComparisonResult,
  YearlyComparison,
  PortfolioYear,
} from '@/types/investment'
import type { HousingProjectionInput } from '@/lib/calculations/housing-projection'
import { calculateHousingProjection } from '@/lib/calculations/housing-projection'
import { calculateRentSchedule } from '@/lib/calculations/rent'
import { calculateSellingCosts } from '@/lib/calculations/closing-costs'
import { calculateCombinedMarginalRate } from '@/lib/calculations/income-tax'
import { calculateAfterTaxReturn, calculatePortfolioGrowth } from '@/lib/calculations/investment'

/**
 * Find the first year where buying beats renting in net worth.
 *
 * @param yearlyComparison - Year-by-year comparison data
 * @param mode - Which buyer net worth to compare: 'withSelling' or 'withoutSelling'
 * @returns Year number when buying first wins, or 'never' if it doesn't within the horizon
 */
export function findBreakEvenYear(
  yearlyComparison: YearlyComparison[],
  mode: 'withSelling' | 'withoutSelling'
): number | 'never' {
  for (const year of yearlyComparison) {
    const buyerNetWorth =
      mode === 'withSelling' ? year.buyerNetWorthWithSelling : year.buyerNetWorthWithoutSelling

    if (buyerNetWorth.gte(year.renterNetWorth)) {
      return year.year
    }
  }

  return 'never'
}

/**
 * Calculate a complete rent-vs-buy comparison.
 *
 * Composes all Phase 2 and Phase 3 calculations into a single result:
 * - Housing projection (Phase 2)
 * - Rent schedule (Phase 2)
 * - Marginal tax rate (Phase 3-01)
 * - After-tax investment return (Phase 3-02)
 * - Portfolio growth (Phase 3-02)
 * - Year-by-year net worth comparison
 * - Break-even analysis
 *
 * @param input - All calculator inputs
 * @returns Complete comparison result with housing, portfolio, and break-even data
 */
export function calculateRentVsBuyComparison(
  input: ComparisonInput
): ComparisonResult {
  // -------------------------------------------------------------------------
  // 1. Calculate housing projection (Phase 2)
  // -------------------------------------------------------------------------
  const housingInput: HousingProjectionInput = {
    purchasePrice: input.purchasePrice,
    downPaymentPercent: input.downPaymentPercent,
    mortgageRate: input.mortgageRate,
    amortizationYears: input.amortizationYears,
    province: input.province,
    timeHorizon: input.timeHorizon,
    firstTimeBuyer: input.firstTimeBuyer,
    propertyTaxRate: input.propertyTaxRate,
    maintenanceRate: input.maintenanceRate,
    homeInsurance: input.homeInsurance,
    appreciationRate: input.appreciationRate,
  }

  const housingProjection = calculateHousingProjection(housingInput)

  // -------------------------------------------------------------------------
  // 2. Calculate marginal tax rate (Phase 3-01)
  // -------------------------------------------------------------------------
  const marginalTaxRate =
    input.taxRateOverride != null
      ? new Decimal(input.taxRateOverride)
      : calculateCombinedMarginalRate(input.annualIncome, input.province)

  // -------------------------------------------------------------------------
  // 3. Calculate after-tax investment return (Phase 3-02)
  // -------------------------------------------------------------------------
  const investmentReturnPercent = new Decimal(input.investmentReturnPercent)
  const afterTaxReturnRate = calculateAfterTaxReturn(investmentReturnPercent, marginalTaxRate)

  // -------------------------------------------------------------------------
  // 4. Calculate rent schedule (Phase 2)
  // -------------------------------------------------------------------------
  const rentSchedule = calculateRentSchedule(
    new Decimal(input.monthlyRent),
    new Decimal(input.rentIncreasePercent),
    input.timeHorizon
  )

  // -------------------------------------------------------------------------
  // 5. Calculate monthly savings per year (buyer cost - rent, clamped >= 0)
  // -------------------------------------------------------------------------
  const yearlyMonthlySavings: Decimal[] = []

  for (let year = 1; year <= input.timeHorizon; year++) {
    const yearlyHousing = housingProjection.yearlyProjection[year - 1]
    const buyerMonthlyCost = yearlyHousing.totalAnnualCost.div(12)

    // Rent schedule is indexed from 0, so year 1 uses index 1, year 2 uses index 2, etc.
    const renterMonthlyCost = rentSchedule[year].monthlyRent

    // Monthly savings = max(0, buyer cost - renter cost)
    const monthlySavings = Decimal.max(buyerMonthlyCost.minus(renterMonthlyCost), 0)
    yearlyMonthlySavings.push(monthlySavings)
  }

  // -------------------------------------------------------------------------
  // 6. Calculate lump sum and portfolio growth (Phase 3-02)
  // -------------------------------------------------------------------------
  // Renter invests buyer's total cash outlay on day 1:
  // down payment + buying closing costs
  const lumpSum = housingProjection.upfrontCosts.downPayment.plus(
    housingProjection.upfrontCosts.buyingClosingCosts
  )

  const portfolio = calculatePortfolioGrowth(
    lumpSum,
    yearlyMonthlySavings,
    afterTaxReturnRate
  )

  // -------------------------------------------------------------------------
  // 7. Build year-by-year comparison
  // -------------------------------------------------------------------------
  const yearlyComparison: YearlyComparison[] = []

  for (let year = 1; year <= input.timeHorizon; year++) {
    const yearIdx = year - 1
    const yearlyHousing = housingProjection.yearlyProjection[yearIdx]
    const yearlyPortfolio = portfolio[yearIdx]
    const yearlyRent = rentSchedule[year]

    // Buyer net worth = home equity (without selling costs)
    const buyerNetWorthWithoutSelling = yearlyHousing.homeEquity

    // Buyer net worth with selling = home equity - selling costs at this year's value
    const sellingCosts = calculateSellingCosts(yearlyHousing.homeValue)
    const buyerNetWorthWithSelling = buyerNetWorthWithoutSelling.minus(sellingCosts.total)

    yearlyComparison.push({
      year,
      renterNetWorth: yearlyPortfolio.endBalance,
      buyerNetWorthWithSelling,
      buyerNetWorthWithoutSelling,
      monthlySavings: yearlyMonthlySavings[yearIdx],
      annualRent: yearlyRent.annualRent,
      buyerAnnualCost: yearlyHousing.totalAnnualCost,
    })
  }

  // -------------------------------------------------------------------------
  // 8. Find break-even years
  // -------------------------------------------------------------------------
  const breakEvenWithSelling = findBreakEvenYear(yearlyComparison, 'withSelling')
  const breakEvenWithoutSelling = findBreakEvenYear(yearlyComparison, 'withoutSelling')

  return {
    housingProjection,
    portfolio,
    yearlyComparison,
    breakEvenWithSelling,
    breakEvenWithoutSelling,
    marginalTaxRate,
    afterTaxReturnRate,
  }
}
