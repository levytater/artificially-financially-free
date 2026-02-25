import type { CalculatorState } from '@/types/calculator'

/**
 * Sensible Canadian defaults for all calculator inputs.
 *
 * These values represent a typical scenario:
 * - $500K home (per CONTEXT.md locked decision)
 * - 20% down payment (avoids CMHC insurance)
 * - 5.5% mortgage rate (typical 5-year fixed in 2025-2026)
 * - 25-year amortization (Canadian standard)
 * - $2,000/month rent (typical 1-2 bedroom in major city)
 * - Ontario (most populous province)
 * - 10-year horizon (per CONTEXT.md expected time horizon)
 * - Not a first-time buyer (conservative default)
 * - $75,000 annual income (near Canadian median)
 * - Simple mode (Advanced mode off by default)
 * - 6% investment returns (historical stock market average)
 * - 3% home appreciation (long-term Canadian average)
 * - 2% rent increases (CPI-aligned)
 * - 2.5% inflation (Bank of Canada target + buffer)
 * - 1.5% maintenance (realistic annual upkeep)
 * - 6% selling costs (5% realtor + 1% legal)
 * - $2,400 annual home insurance ($200/month)
 */
export const calculatorDefaults: CalculatorState = {
  purchasePrice: 500000,
  downPaymentPercent: 20,
  mortgageRate: 5.5,
  amortizationYears: 25,
  monthlyRent: 2000,
  province: 'ON',
  timeHorizon: 10,
  firstTimeBuyer: false,
  annualIncome: 75000,
  advancedMode: false,
  investmentReturn: 6.0,
  tfsaReturn: 6.0,
  rrspReturn: 6.0,
  nonRegisteredReturn: 6.0,
  appreciationRate: 3.0,
  rentIncreaseRate: 2.0,
  inflationRate: 2.5,
  maintenancePercent: 1.5,
  sellingCostsPercent: 6.0,
  homeInsurance: 2400,
}
