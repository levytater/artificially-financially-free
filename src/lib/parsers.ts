/**
 * nuqs parser definitions shared between the serializer (share URL generation)
 * and future URL state ingestion (loading a shared link).
 *
 * Importing from 'nuqs/server' ensures these definitions are server-safe
 * and can be used in both server and client contexts.
 */
import {
  parseAsInteger,
  parseAsFloat,
  parseAsString,
  parseAsBoolean,
  type UrlKeys,
} from 'nuqs/server'

/**
 * Type-safe parsers for each calculator input with default values.
 * Each parser validates and converts URL string params to the correct type.
 */
export const calculatorParsers = {
  purchasePrice: parseAsInteger.withDefault(600000),
  downPaymentPercent: parseAsFloat.withDefault(20),
  mortgageRate: parseAsFloat.withDefault(5.5),
  amortizationYears: parseAsInteger.withDefault(25),
  monthlyRent: parseAsInteger.withDefault(2000),
  province: parseAsString.withDefault('ON'),
  timeHorizon: parseAsInteger.withDefault(25),
  firstTimeBuyer: parseAsBoolean.withDefault(false),
  annualIncome: parseAsInteger.withDefault(75000),
  // More parsers added in Phase 4 when additional inputs are introduced
}

/**
 * Short URL parameter names for human-readable share URLs.
 * Maps verbose state keys to compact query params:
 *   e.g., ?price=750000&province=BC&rent=2500
 */
export const calculatorUrlKeys: UrlKeys<typeof calculatorParsers> = {
  purchasePrice: 'price',
  downPaymentPercent: 'dp',
  mortgageRate: 'rate',
  amortizationYears: 'amort',
  monthlyRent: 'rent',
  province: 'province',
  timeHorizon: 'years',
  firstTimeBuyer: 'ftb',
  annualIncome: 'income',
}
