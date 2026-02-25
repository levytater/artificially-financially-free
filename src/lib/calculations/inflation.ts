/**
 * Inflation deflation calculations.
 *
 * Converts nominal (future) dollar values to real (today's) purchasing
 * power using a standard present-value deflation formula.
 *
 * IMPORTANT: This is a display-only adjustment. The engine calculates
 * everything in nominal dollars internally. Deflation is applied only
 * when showing "real dollars" to the user. The investment return rate
 * is NEVER reduced by inflation (that would double-count it).
 *
 * Formula: realValue = nominalValue / (1 + inflationRate)^year
 *
 * All arithmetic uses Decimal.js for precision.
 */
import { Decimal } from '@/lib/decimal'

/**
 * Convert a nominal future value to real (today's) dollars.
 *
 * @param nominalValue - The future dollar amount as Decimal
 * @param inflationRatePercent - Annual inflation rate as a percentage Decimal (e.g., 2.5 for 2.5%)
 * @param year - Number of years in the future (0 = today)
 * @returns Value in today's purchasing power as Decimal
 *
 * @example
 * deflateToRealDollars(new Decimal(100000), new Decimal(2.5), 10)
 * // returns ~Decimal(78120.06)
 */
export function deflateToRealDollars(
  nominalValue: Decimal,
  inflationRatePercent: Decimal,
  year: number
): Decimal {
  // Year 0 -> no deflation needed
  if (year === 0) {
    return nominalValue
  }

  const rate = inflationRatePercent.div(100)
  const deflator = rate.plus(1).pow(year)
  return nominalValue.div(deflator)
}
