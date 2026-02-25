/**
 * Home value appreciation calculations.
 *
 * Compound growth: value_n = initial * (1 + rate)^n
 * All arithmetic uses Decimal.js exclusively.
 */
import { Decimal } from '@/lib/decimal'

/**
 * Calculate appreciated home value after N years of compound growth.
 *
 * @param initialValue - Starting home value as Decimal
 * @param annualRatePercent - Annual appreciation rate as a percentage (e.g., 3.0 for 3%)
 * @param years - Number of years to project
 * @returns Home value after appreciation as Decimal
 */
export function calculateAppreciatedValue(
  initialValue: Decimal,
  annualRatePercent: Decimal,
  years: number
): Decimal {
  const rate = annualRatePercent.div(100)
  return initialValue.mul(rate.plus(1).pow(years))
}

/**
 * Generate a schedule of appreciated values for years 0 through totalYears.
 *
 * @param initialValue - Starting home value as Decimal
 * @param annualRatePercent - Annual appreciation rate as a percentage (e.g., 3.0 for 3%)
 * @param totalYears - Number of years to project
 * @returns Array of Decimal values for years 0 through totalYears (length = totalYears + 1)
 */
export function calculateAppreciationSchedule(
  initialValue: Decimal,
  annualRatePercent: Decimal,
  totalYears: number
): Decimal[] {
  const schedule: Decimal[] = []
  for (let year = 0; year <= totalYears; year++) {
    schedule.push(calculateAppreciatedValue(initialValue, annualRatePercent, year))
  }
  return schedule
}
