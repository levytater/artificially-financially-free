/**
 * Rent increase projection calculations.
 *
 * Compound growth: rent_n = initial * (1 + rate)^n
 * All arithmetic uses Decimal.js exclusively.
 */
import { Decimal } from '@/lib/decimal'

/**
 * Calculate monthly rent for a given year with compound annual increases.
 *
 * @param initialMonthlyRent - Starting monthly rent as Decimal
 * @param annualIncreasePercent - Annual rent increase as a percentage (e.g., 2.0 for 2%)
 * @param year - Year number (0 = initial rent, no increase applied)
 * @returns Monthly rent for the given year as Decimal
 */
export function calculateRentForYear(
  initialMonthlyRent: Decimal,
  annualIncreasePercent: Decimal,
  year: number
): Decimal {
  const rate = annualIncreasePercent.div(100)
  return initialMonthlyRent.mul(rate.plus(1).pow(year))
}

/**
 * Calculate annual rent from monthly rent.
 *
 * @param monthlyRent - Monthly rent as Decimal
 * @returns Annual rent (monthly * 12) as Decimal
 */
export function calculateAnnualRent(monthlyRent: Decimal): Decimal {
  return monthlyRent.mul(12)
}

/**
 * Generate a complete rent schedule for years 0 through totalYears.
 *
 * @param initialMonthlyRent - Starting monthly rent as Decimal
 * @param annualIncreasePercent - Annual rent increase as a percentage (e.g., 2.0 for 2%)
 * @param totalYears - Number of years to project
 * @returns Array of { year, monthlyRent, annualRent } for years 0 through totalYears
 */
export function calculateRentSchedule(
  initialMonthlyRent: Decimal,
  annualIncreasePercent: Decimal,
  totalYears: number
): Array<{ year: number; monthlyRent: Decimal; annualRent: Decimal }> {
  const schedule: Array<{ year: number; monthlyRent: Decimal; annualRent: Decimal }> = []

  for (let year = 0; year <= totalYears; year++) {
    const monthlyRent = calculateRentForYear(initialMonthlyRent, annualIncreasePercent, year)
    schedule.push({
      year,
      monthlyRent,
      annualRent: calculateAnnualRent(monthlyRent),
    })
  }

  return schedule
}
