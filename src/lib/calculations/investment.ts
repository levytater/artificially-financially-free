/**
 * Investment portfolio growth calculations.
 *
 * Models the renter's side of the rent-vs-buy comparison:
 * - After-tax investment return using capital gains 50% inclusion rate
 * - Monthly-compounding portfolio growth from lump sum + monthly contributions
 *
 * All arithmetic uses Decimal.js for financial precision.
 */
import { Decimal } from '@/lib/decimal'
import type { PortfolioYear } from '@/types/investment'

/**
 * Calculate the after-tax annual return rate using capital gains 50% inclusion.
 *
 * In Canada, only 50% of capital gains are included in taxable income.
 * Formula: afterTaxRate = (nominalReturn/100) * (1 - (taxRate/100) * 0.5)
 *
 * @param nominalReturnPercent - Nominal annual return as a percentage (e.g., 7.0 for 7%)
 * @param marginalTaxRatePercent - Marginal tax rate as a percentage (e.g., 30.0 for 30%)
 * @returns After-tax annual return as a decimal (e.g., 0.0595 for 5.95%)
 */
export function calculateAfterTaxReturn(
  nominalReturnPercent: Decimal,
  marginalTaxRatePercent: Decimal
): Decimal {
  const nominalRate = nominalReturnPercent.div(100)
  const taxRate = marginalTaxRatePercent.div(100)
  const capitalGainsInclusion = new Decimal(0.5)

  // afterTax = nominalRate * (1 - taxRate * inclusionRate)
  const taxDrag = taxRate.mul(capitalGainsInclusion)
  return nominalRate.mul(new Decimal(1).minus(taxDrag))
}

/**
 * Calculate year-by-year investment portfolio growth with monthly compounding.
 *
 * The renter invests a lump sum on day 1 (down payment + closing costs the buyer
 * would have spent) and adds monthly contributions (difference between buyer costs
 * and rent). Both compound together in a single portfolio.
 *
 * Month-by-month loop: compound balance first, then add contribution.
 * Negative monthly savings are clamped to zero (no withdrawals).
 *
 * @param initialLumpSum - Day-1 investment amount
 * @param yearlyMonthlySavings - Array of monthly savings per year (index 0 = year 1).
 *                                Negative values are clamped to zero.
 * @param annualAfterTaxReturn - After-tax annual return as decimal (e.g., 0.0595 for 5.95%)
 * @returns Array of PortfolioYear snapshots, one per year
 */
export function calculatePortfolioGrowth(
  initialLumpSum: Decimal,
  yearlyMonthlySavings: Decimal[],
  annualAfterTaxReturn: Decimal
): PortfolioYear[] {
  // Convert annual rate to monthly: monthlyRate = (1 + annual)^(1/12) - 1
  // Handle 0% return edge case: monthlyRate = 0
  const monthlyRate = annualAfterTaxReturn.isZero()
    ? new Decimal(0)
    : annualAfterTaxReturn.plus(1).pow(new Decimal(1).div(12)).minus(1)

  const monthlyMultiplier = monthlyRate.plus(1)
  let balance = initialLumpSum
  const results: PortfolioYear[] = []

  for (let yearIdx = 0; yearIdx < yearlyMonthlySavings.length; yearIdx++) {
    const startBalance = balance
    // Clamp negative savings to zero -- no withdrawals from portfolio
    const monthlySaving = Decimal.max(yearlyMonthlySavings[yearIdx], 0)
    let yearContributions = new Decimal(0)

    for (let month = 0; month < 12; month++) {
      // Compound existing balance first
      balance = balance.mul(monthlyMultiplier)
      // Then add monthly contribution
      balance = balance.plus(monthlySaving)
      yearContributions = yearContributions.plus(monthlySaving)
    }

    results.push({
      year: yearIdx + 1,
      startBalance,
      contributions: yearContributions,
      growth: balance.minus(startBalance).minus(yearContributions),
      endBalance: balance,
    })
  }

  return results
}
