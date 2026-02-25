/**
 * Income tax marginal rate calculations.
 *
 * Provides combined federal + provincial marginal tax rate estimation
 * for Canadian taxpayers. Used to calculate tax drag on investment
 * returns in the rent-vs-buy comparison.
 *
 * The marginal rate is the tax rate on the last dollar of income --
 * this is what applies to additional capital gains income on top of
 * the user's employment income.
 *
 * All arithmetic uses Decimal.js for precision.
 *
 * Note (v1 limitations):
 * - Ontario surtax not modeled (small impact, ~$90K+)
 * - Quebec 16.5% federal abatement not modeled
 * - Users can override with manual tax rate input
 */
import { Decimal } from '@/lib/decimal'
import {
  FEDERAL_TAX_BRACKETS,
  PROVINCIAL_TAX_BRACKETS,
} from '@/lib/data/income-tax-brackets'
import type { ProvinceCode, TaxBracket } from '@/types/housing'

/**
 * Find the marginal tax rate for a given income in a bracket set.
 *
 * Iterates brackets from highest to lowest, returning the rate of the
 * first bracket where the income exceeds the bracket's lower bound.
 * For $0 income, returns the lowest bracket rate as a fallback.
 *
 * @param income - Annual income as Decimal
 * @param brackets - Ordered array of tax brackets (lowest to highest)
 * @returns Marginal rate as a decimal (e.g., 0.205 for 20.5%)
 */
function findMarginalRate(
  income: Decimal,
  brackets: readonly TaxBracket[]
): Decimal {
  // Walk backwards through brackets to find the highest one that applies
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income.gt(brackets[i].from)) {
      return new Decimal(brackets[i].rate)
    }
  }
  // Fallback: income is 0 or below all brackets -> lowest bracket rate
  return new Decimal(brackets[0].rate)
}

/**
 * Calculate the combined federal + provincial marginal tax rate.
 *
 * Returns the sum of the federal marginal rate and the provincial
 * marginal rate at the given income level, as a percentage.
 *
 * @param annualIncome - Annual income in CAD (plain number, e.g., 60000)
 * @param province - Two-letter province code (e.g., 'ON')
 * @returns Combined marginal rate as a percentage Decimal (e.g., 29.65 for 29.65%)
 *
 * @example
 * calculateCombinedMarginalRate(60000, 'ON') // returns Decimal(29.65)
 */
export function calculateCombinedMarginalRate(
  annualIncome: number,
  province: ProvinceCode
): Decimal {
  const income = new Decimal(annualIncome)
  const federalRate = findMarginalRate(income, FEDERAL_TAX_BRACKETS)
  const provincialRate = findMarginalRate(income, PROVINCIAL_TAX_BRACKETS[province])

  // Return as percentage (multiply by 100)
  return federalRate.plus(provincialRate).mul(100)
}
