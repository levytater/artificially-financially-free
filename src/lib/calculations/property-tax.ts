/**
 * Property tax and maintenance cost calculations.
 *
 * Both are simple percentage-of-home-value calculations.
 * All arithmetic uses Decimal.js exclusively.
 */
import { Decimal } from '@/lib/decimal'

/**
 * Calculate annual property tax.
 *
 * @param homeValue - Current home value as Decimal
 * @param taxRatePercent - Annual property tax rate as a percentage (e.g., 1.0 for 1%)
 * @returns Annual property tax as Decimal
 */
export function calculatePropertyTax(
  homeValue: Decimal,
  taxRatePercent: Decimal
): Decimal {
  return homeValue.mul(taxRatePercent).div(100)
}

/**
 * Calculate annual maintenance cost.
 *
 * @param homeValue - Current home value as Decimal
 * @param maintenanceRatePercent - Annual maintenance rate as a percentage (e.g., 1.0 for 1%)
 * @returns Annual maintenance cost as Decimal
 */
export function calculateMaintenance(
  homeValue: Decimal,
  maintenanceRatePercent: Decimal
): Decimal {
  return homeValue.mul(maintenanceRatePercent).div(100)
}
