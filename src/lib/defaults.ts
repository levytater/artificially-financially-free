import type { CalculatorState } from '@/types/calculator'

/**
 * Sensible Canadian defaults for all calculator inputs.
 *
 * These values represent a typical scenario:
 * - $600K home (near Canadian median in major cities)
 * - 20% down payment (avoids CMHC insurance)
 * - 5.5% mortgage rate (typical 5-year fixed in 2025-2026)
 * - 25-year amortization (Canadian standard)
 * - $2,000/month rent (typical 1-2 bedroom in major city)
 * - Ontario (most populous province)
 * - 25-year horizon (matches amortization)
 * - Not a first-time buyer (conservative default)
 * - $75,000 annual income (near Canadian median)
 */
export const calculatorDefaults: CalculatorState = {
  purchasePrice: 600000,
  downPaymentPercent: 20,
  mortgageRate: 5.5,
  amortizationYears: 25,
  monthlyRent: 2000,
  province: 'ON',
  timeHorizon: 25,
  firstTimeBuyer: false,
  annualIncome: 75000,
}
