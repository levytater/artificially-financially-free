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
  purchasePrice: parseAsInteger.withDefault(500000),
  downPaymentPercent: parseAsFloat.withDefault(20),
  mortgageRate: parseAsFloat.withDefault(5.5),
  amortizationYears: parseAsInteger.withDefault(25),
  monthlyRent: parseAsInteger.withDefault(2000),
  province: parseAsString.withDefault('ON'),
  timeHorizon: parseAsInteger.withDefault(10),
  firstTimeBuyer: parseAsBoolean.withDefault(false),
  annualIncome: parseAsInteger.withDefault(75000),
  advancedMode: parseAsBoolean.withDefault(false),
  investmentReturn: parseAsFloat.withDefault(6.0),
  tfsaReturn: parseAsFloat.withDefault(6.0),
  rrspReturn: parseAsFloat.withDefault(6.0),
  nonRegisteredReturn: parseAsFloat.withDefault(6.0),
  appreciationRate: parseAsFloat.withDefault(3.0),
  rentIncreaseRate: parseAsFloat.withDefault(2.0),
  inflationRate: parseAsFloat.withDefault(2.5),
  maintenancePercent: parseAsFloat.withDefault(1.5),
  sellingCostsPercent: parseAsFloat.withDefault(6.0),
  homeInsurance: parseAsInteger.withDefault(2400),
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
  advancedMode: 'adv',
  investmentReturn: 'return',
  tfsaReturn: 'tfsa',
  rrspReturn: 'rrsp',
  nonRegisteredReturn: 'nonreg',
  appreciationRate: 'appr',
  rentIncreaseRate: 'rentup',
  inflationRate: 'infl',
  maintenancePercent: 'maint',
  sellingCostsPercent: 'sell',
  homeInsurance: 'ins',
}
