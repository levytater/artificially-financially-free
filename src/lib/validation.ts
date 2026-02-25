import type { CalculatorState } from '@/types/calculator'

export interface ValidationError {
  field: keyof CalculatorState
  message: string
}

/**
 * Validates purchase price.
 * @returns Error message if invalid, undefined if valid
 */
export function validatePurchasePrice(price: number): string | undefined {
  if (price <= 0) {
    return 'Purchase price must be greater than $0'
  }
  if (price > 10_000_000) {
    return 'Purchase price cannot exceed $10 million'
  }
  return undefined
}

/**
 * Validates down payment percentage based on Canadian minimum requirements.
 * @returns Error message if invalid, undefined if valid
 */
export function validateDownPaymentPercent(
  percent: number,
  purchasePrice: number
): string | undefined {
  // Calculate minimum down payment based on purchase price
  let minPercent: number

  if (purchasePrice <= 500_000) {
    // Homes <= $500K: minimum 5%
    minPercent = 5
  } else if (purchasePrice <= 1_000_000) {
    // Homes $500K-$1M: 5% on first $500K + 10% on remainder
    const firstPortion = 500_000 * 0.05
    const secondPortion = (purchasePrice - 500_000) * 0.10
    const minDownPayment = firstPortion + secondPortion
    minPercent = (minDownPayment / purchasePrice) * 100
  } else {
    // Homes > $1M: minimum 20%
    minPercent = 20
  }

  if (percent < minPercent) {
    return `Down payment must be at least ${minPercent.toFixed(2)}% for a home of this price`
  }
  if (percent > 100) {
    return 'Down payment cannot exceed 100%'
  }
  return undefined
}

/**
 * Validates mortgage interest rate.
 * @returns Error message if invalid, undefined if valid
 */
export function validateMortgageRate(rate: number): string | undefined {
  if (rate < 0) {
    return 'Mortgage rate cannot be negative'
  }
  if (rate > 20) {
    return 'Mortgage rate cannot exceed 20%'
  }
  return undefined
}

/**
 * Validates amortization period.
 * @returns Error message if invalid, undefined if valid
 */
export function validateAmortization(years: number): string | undefined {
  if (!Number.isInteger(years)) {
    return 'Amortization must be a whole number of years'
  }
  if (years < 1) {
    return 'Amortization must be at least 1 year'
  }
  if (years > 30) {
    return 'Amortization cannot exceed 30 years'
  }
  return undefined
}

/**
 * Validates time horizon.
 * @returns Error message if invalid, undefined if valid
 */
export function validateTimeHorizon(years: number): string | undefined {
  if (years < 1) {
    return 'Time horizon must be at least 1 year'
  }
  if (years > 30) {
    return 'Time horizon cannot exceed 30 years'
  }
  return undefined
}

/**
 * Validates monthly rent.
 * @returns Error message if invalid, undefined if valid
 */
export function validateMonthlyRent(rent: number): string | undefined {
  if (rent < 0) {
    return 'Monthly rent cannot be negative'
  }
  if (rent > 50_000) {
    return 'Monthly rent cannot exceed $50,000'
  }
  return undefined
}

/**
 * Validates annual income.
 * @returns Error message if invalid, undefined if valid
 */
export function validateAnnualIncome(income: number): string | undefined {
  if (income < 0) {
    return 'Annual income cannot be negative'
  }
  if (income > 10_000_000) {
    return 'Annual income cannot exceed $10 million'
  }
  return undefined
}

/**
 * Generic percentage rate validator for appreciation, rent increase, inflation, etc.
 * @returns Error message if invalid, undefined if valid
 */
export function validatePercentageRate(
  rate: number,
  fieldName: string
): string | undefined {
  if (rate < 0) {
    return `${fieldName} cannot be negative`
  }
  if (rate > 50) {
    return `${fieldName} cannot exceed 50%`
  }
  return undefined
}

/**
 * Validates home insurance amount.
 * @returns Error message if invalid, undefined if valid
 */
export function validateHomeInsurance(amount: number): string | undefined {
  if (amount < 0) {
    return 'Home insurance cannot be negative'
  }
  if (amount > 50_000) {
    return 'Home insurance cannot exceed $50,000'
  }
  return undefined
}

/**
 * Validates selling costs percentage.
 * @returns Error message if invalid, undefined if valid
 */
export function validateSellingCosts(percent: number): string | undefined {
  if (percent < 0) {
    return 'Selling costs cannot be negative'
  }
  if (percent > 20) {
    return 'Selling costs cannot exceed 20%'
  }
  return undefined
}

/**
 * Helper to validate a single field based on its name.
 * @returns Error message if invalid, undefined if valid
 */
export function validateField(
  field: keyof CalculatorState,
  value: number,
  state: CalculatorState
): string | undefined {
  switch (field) {
    case 'purchasePrice':
      return validatePurchasePrice(value)
    case 'downPaymentPercent':
      return validateDownPaymentPercent(value, state.purchasePrice)
    case 'mortgageRate':
      return validateMortgageRate(value)
    case 'amortizationYears':
      return validateAmortization(value)
    case 'timeHorizon':
      return validateTimeHorizon(value)
    case 'monthlyRent':
      return validateMonthlyRent(value)
    case 'annualIncome':
      return validateAnnualIncome(value)
    case 'investmentReturn':
      return validatePercentageRate(value, 'Investment return')
    case 'tfsaReturn':
      return validatePercentageRate(value, 'TFSA return')
    case 'rrspReturn':
      return validatePercentageRate(value, 'RRSP return')
    case 'nonRegisteredReturn':
      return validatePercentageRate(value, 'Non-registered return')
    case 'appreciationRate':
      return validatePercentageRate(value, 'Home appreciation rate')
    case 'rentIncreaseRate':
      return validatePercentageRate(value, 'Rent increase rate')
    case 'inflationRate':
      return validatePercentageRate(value, 'Inflation rate')
    case 'maintenancePercent':
      return validatePercentageRate(value, 'Maintenance percentage')
    case 'homeInsurance':
      return validateHomeInsurance(value)
    case 'sellingCostsPercent':
      return validateSellingCosts(value)
    default:
      // For fields that don't need validation (province, firstTimeBuyer, advancedMode)
      return undefined
  }
}

/**
 * Validates the entire calculator state.
 * @returns Array of validation errors (empty if all valid)
 */
export function validateCalculatorState(
  state: CalculatorState
): ValidationError[] {
  const errors: ValidationError[] = []

  const fields: Array<keyof CalculatorState> = [
    'purchasePrice',
    'downPaymentPercent',
    'mortgageRate',
    'amortizationYears',
    'timeHorizon',
    'monthlyRent',
    'annualIncome',
    'investmentReturn',
    'tfsaReturn',
    'rrspReturn',
    'nonRegisteredReturn',
    'appreciationRate',
    'rentIncreaseRate',
    'inflationRate',
    'maintenancePercent',
    'homeInsurance',
    'sellingCostsPercent',
  ]

  for (const field of fields) {
    const value = state[field]
    if (typeof value === 'number') {
      const error = validateField(field, value, state)
      if (error) {
        errors.push({ field, message: error })
      }
    }
  }

  return errors
}
