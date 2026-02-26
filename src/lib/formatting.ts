import type Decimal from 'decimal.js'

/**
 * Formats a number as Canadian currency.
 * @example formatCurrency(500000) => "$500,000"
 */
export function formatCurrency(value: number): string {
  if (isNaN(value)) {
    return '$0'
  }

  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(value)
}

/**
 * Formats a Decimal as Canadian currency.
 * @example formatCurrencyDecimal(new Decimal(500000)) => "$500,000"
 * @example formatCurrencyDecimal(new Decimal(1250000), true) => "$1.3M"
 */
export function formatCurrencyDecimal(value: Decimal, compact = false): string {
  const num = value.toNumber()

  if (isNaN(num)) {
    return '$0'
  }

  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(compact && {
      notation: 'compact',
      compactDisplay: 'short',
    }),
  })

  return formatter.format(num)
}

/**
 * Formats a Decimal as a percentage with configurable decimal places.
 * @example formatPercentageDecimal(new Decimal(5.5)) => "5.5%"
 * @example formatPercentageDecimal(new Decimal(12.345), 2) => "12.35%"
 */
export function formatPercentageDecimal(
  value: Decimal,
  decimals = 1
): string {
  const num = value.toNumber()

  if (isNaN(num)) {
    return '0.0%'
  }

  return num.toFixed(decimals) + '%'
}

/**
 * Parses a currency string into a number.
 * Strips $, commas, and spaces.
 * @example parseCurrency("$500,000") => 500000
 * @example parseCurrency("abc") => 0
 */
export function parseCurrency(input: string): number {
  const cleaned = input.replace(/[$,\s]/g, '')
  const parsed = parseInt(cleaned, 10)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Formats a number as a percentage with 2 decimal places.
 * @example formatPercentage(5.5) => "5.50%"
 */
export function formatPercentage(value: number): string {
  if (isNaN(value)) {
    return '0.00%'
  }
  return value.toFixed(2) + '%'
}

/**
 * Parses a percentage string into a number.
 * Strips % and spaces.
 * @example parsePercentage("5.50%") => 5.5
 * @example parsePercentage("abc") => NaN
 */
export function parsePercentage(input: string): number {
  const cleaned = input.replace(/[%\s]/g, '')
  return parseFloat(cleaned)
}

/**
 * Formats a whole number (no formatting).
 * @example formatWholeNumber(25) => "25"
 */
export function formatWholeNumber(value: number): string {
  if (isNaN(value)) {
    return '0'
  }
  return value.toString()
}

/**
 * Parses a string into a whole number.
 * Strips non-digit characters.
 * @example parseWholeNumber("25") => 25
 * @example parseWholeNumber("abc") => NaN
 */
export function parseWholeNumber(input: string): number {
  const cleaned = input.replace(/\D/g, '')
  return parseInt(cleaned, 10)
}
