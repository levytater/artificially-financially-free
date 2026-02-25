/**
 * Housing calculation interfaces and types.
 *
 * All financial values in calculation results use Decimal for precision.
 * Rates are stored as percentages (e.g., 5.5 for 5.5%) in user-facing
 * types and converted to decimals inside calculation functions.
 */
import type Decimal from 'decimal.js'

// ---------------------------------------------------------------------------
// Province
// ---------------------------------------------------------------------------

/** All 10 Canadian province codes (territories excluded from v1) */
export type ProvinceCode =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NS'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK'

// ---------------------------------------------------------------------------
// Land Transfer Tax
// ---------------------------------------------------------------------------

/** A single marginal tax bracket for land transfer tax */
export interface TaxBracket {
  readonly from: number
  readonly to: number // Use Infinity for the last bracket
  readonly rate: number // As decimal: 0.01 = 1%
}

/** First-time home buyer rebate configuration for a province */
export interface FthbRebateConfig {
  /** Maximum rebate amount in CAD */
  readonly maxRebate: number
  /** Purchase price up to which full exemption applies */
  readonly fullExemptionUpTo: number
  /** Purchase price up to which partial exemption applies (optional) */
  readonly partialExemptionUpTo?: number
}

/** Province-specific land transfer tax configuration */
export interface ProvinceLttConfig {
  readonly brackets: readonly TaxBracket[]
  readonly fthbRebate: FthbRebateConfig | null
}

/** Result of land transfer tax calculation */
export interface LttResult {
  /** Gross LTT before any rebates */
  grossTax: Decimal
  /** FTHB rebate amount (0 if not applicable) */
  rebate: Decimal
  /** Net LTT after rebate (grossTax - rebate) */
  netTax: Decimal
}

// ---------------------------------------------------------------------------
// CMHC Insurance
// ---------------------------------------------------------------------------

/** A single CMHC premium tier */
export interface CmhcTier {
  readonly maxLtv: number // Upper bound of LTV as decimal (e.g., 0.65)
  readonly rate: number // Premium rate as decimal (e.g., 0.006 = 0.60%)
}

/** Result of CMHC premium calculation */
export interface CmhcResult {
  /** Insurance premium (added to mortgage balance) */
  premium: Decimal
  /** Provincial sales tax on premium (paid cash at closing) */
  pst: Decimal
  /** Amount added to mortgage (equals premium; PST is separate) */
  totalMortgageAddition: Decimal
}

// ---------------------------------------------------------------------------
// Closing Costs
// ---------------------------------------------------------------------------

/** A default closing cost line item */
export interface ClosingCostItem {
  readonly name: string
  readonly defaultAmount: number
  readonly description: string
}

/** Result of buying closing cost calculation */
export interface BuyingCosts {
  ltt: Decimal
  legal: Decimal
  inspection: Decimal
  titleInsurance: Decimal
  cmhcPst: Decimal
  appraisal: Decimal
  total: Decimal
}

/** Result of selling closing cost calculation */
export interface SellingCosts {
  realtorCommission: Decimal
  legal: Decimal
  mortgageDischarge: Decimal
  total: Decimal
}

// ---------------------------------------------------------------------------
// Mortgage
// ---------------------------------------------------------------------------

/** Monthly payment breakdown for amortization schedule */
export interface MonthlyPaymentBreakdown {
  month: number
  payment: Decimal
  principal: Decimal
  interest: Decimal
  remainingBalance: Decimal
}

// ---------------------------------------------------------------------------
// Year-by-Year Projection
// ---------------------------------------------------------------------------

/** A single year in the homeowner cost projection */
export interface YearlyHousingCost {
  year: number
  /** Total mortgage principal & interest paid during the year */
  mortgagePayment: Decimal
  /** Principal portion paid (equity building) */
  principalPaid: Decimal
  /** Interest portion paid (cost) */
  interestPaid: Decimal
  /** Outstanding mortgage balance at year end */
  remainingBalance: Decimal
  /** Annual property tax */
  propertyTax: Decimal
  /** Annual maintenance cost */
  maintenance: Decimal
  /** Annual home insurance premium */
  homeInsurance: Decimal
  /** Home value at year end (after appreciation) */
  homeValue: Decimal
  /** Home equity: homeValue - remainingBalance */
  homeEquity: Decimal
  /** Total cash out-of-pocket for the year */
  totalAnnualCost: Decimal
  /** Running cumulative cost since purchase */
  cumulativeCost: Decimal
}

/** All upfront costs required to purchase */
export interface UpfrontCosts {
  downPayment: Decimal
  cmhcPremium: Decimal
  cmhcPst: Decimal
  ltt: Decimal
  buyingClosingCosts: Decimal
  totalCashRequired: Decimal
}

/** Financial position when selling at the end of the time horizon */
export interface ExitPosition {
  homeValue: Decimal
  remainingMortgage: Decimal
  sellingCosts: Decimal
  netProceeds: Decimal
}

/** Complete housing cost projection */
export interface HousingProjection {
  upfrontCosts: UpfrontCosts
  yearlyProjection: YearlyHousingCost[]
  exitPosition: ExitPosition
}

// ---------------------------------------------------------------------------
// Rent Projection
// ---------------------------------------------------------------------------

/** A single year in the renter cost projection */
export interface RentYearProjection {
  year: number
  monthlyRent: Decimal
  annualRent: Decimal
}

/** Complete rent cost projection */
export interface RentProjection {
  rentProjection: RentYearProjection[]
}
