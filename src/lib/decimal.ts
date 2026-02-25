/**
 * Configured Decimal.js instance with financial calculation helpers.
 *
 * ALL financial calculations must use Decimal.js -- never native JS arithmetic.
 * Native JS: 0.1 + 0.2 = 0.30000000000000004
 * Decimal.js: new Decimal(0.1).plus(0.2).toString() = '0.3'
 */
import Decimal from 'decimal.js'

// Configure for financial calculations
Decimal.set({
  precision: 20, // 20 significant digits (overkill for currency, but safe)
  rounding: Decimal.ROUND_HALF_UP, // Standard financial rounding
  toExpNeg: -9, // Don't use exponential notation for small numbers
  toExpPos: 21, // Don't use exponential notation below 10^21
})

/**
 * Calculate the effective monthly interest rate using Canadian semi-annual compounding.
 *
 * Canadian mortgages compound semi-annually (not monthly), so the effective
 * monthly rate is: (1 + annual_rate/2)^(1/6) - 1
 *
 * @param annualRate - Annual mortgage rate as a percentage (e.g., 5.5 for 5.5%)
 * @returns The effective monthly rate as a Decimal (e.g., ~0.004532 for 5.5%)
 */
export function effectiveMonthlyRate(annualRate: number): Decimal {
  const r = new Decimal(annualRate).div(100)
  return r.div(2).plus(1).pow(new Decimal(1).div(6)).minus(1)
}

/**
 * Format a Decimal or number value as a currency string with 2 decimal places.
 *
 * @param value - The value to format
 * @returns String with exactly 2 decimal places (e.g., "2847.63")
 */
export function formatCurrency(value: Decimal | number): string {
  const d = value instanceof Decimal ? value : new Decimal(value)
  return d.toFixed(2)
}

// Re-export Decimal for convenience
export { Decimal }
