/**
 * Core calculator state and context types.
 *
 * This defines the shape of all calculator inputs. More inputs will be added
 * in Phase 4 (master return dial, per-account returns, property tax rate,
 * maintenance rate, closing costs, etc.).
 */

export interface CalculatorState {
  /** Total purchase price of the home in CAD */
  purchasePrice: number
  /** Down payment as a percentage of purchase price (e.g., 20 = 20%) */
  downPaymentPercent: number
  /** Annual mortgage interest rate (e.g., 5.5 = 5.5%) */
  mortgageRate: number
  /** Mortgage amortization period in years */
  amortizationYears: number
  /** Monthly rent payment in CAD */
  monthlyRent: number
  /** Canadian province code (e.g., 'ON', 'BC', 'AB') */
  province: string
  /** Comparison time horizon in years */
  timeHorizon: number
  /** Whether the buyer qualifies as a first-time home buyer */
  firstTimeBuyer: boolean
  /** Annual gross income in CAD (used for tax estimation on investment gains) */
  annualIncome: number
  /** Whether Advanced mode is active (shows per-account returns, extra rates) */
  advancedMode: boolean
  /** Master expected investment return rate as percentage (e.g., 6.0 = 6%) */
  investmentReturn: number
  /** TFSA return rate override as percentage (Advanced mode) */
  tfsaReturn: number
  /** RRSP return rate override as percentage (Advanced mode) */
  rrspReturn: number
  /** Non-registered return rate override as percentage (Advanced mode) */
  nonRegisteredReturn: number
  /** Annual home appreciation rate as percentage (e.g., 3.0 = 3%) */
  appreciationRate: number
  /** Annual rent increase rate as percentage (e.g., 2.0 = 2%) */
  rentIncreaseRate: number
  /** Annual inflation rate as percentage (e.g., 2.0 = 2%) */
  inflationRate: number
  /** Annual maintenance cost as percentage of home value (e.g., 1.0 = 1%) */
  maintenancePercent: number
  /** Selling costs as percentage of home value at sale (e.g., 6.0 = 6%) */
  sellingCostsPercent: number
  /** Annual home insurance in CAD */
  homeInsurance: number
}

export interface CalculatorContextValue {
  /** Current calculator input state */
  state: CalculatorState
  /** Merge partial updates into the current state */
  setState: (updates: Partial<CalculatorState>) => void
  /** Reset all inputs to their default values */
  resetToDefaults: () => void
  // Future: loadFromUrl, loadFromAiSuggestion, etc.
}
