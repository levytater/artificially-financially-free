/**
 * Investment and comparison type definitions for Phase 3.
 *
 * All financial values in result types use Decimal for precision.
 * Input types use plain numbers (percentage convention matching Phase 2:
 * e.g., 5.5 for 5.5%, converted to decimals inside calculation functions).
 */
import type Decimal from 'decimal.js'
import type { HousingProjection, ProvinceCode } from '@/types/housing'

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

/** A single year snapshot of the renter's investment portfolio */
export interface PortfolioYear {
  year: number
  startBalance: Decimal
  contributions: Decimal
  growth: Decimal
  endBalance: Decimal
}

// ---------------------------------------------------------------------------
// Year-by-Year Comparison
// ---------------------------------------------------------------------------

/** A single year in the rent-vs-buy net worth comparison */
export interface YearlyComparison {
  year: number
  /** Renter's total net worth (portfolio value) at year end */
  renterNetWorth: Decimal
  /** Buyer's net worth after selling costs (home equity - selling costs) */
  buyerNetWorthWithSelling: Decimal
  /** Buyer's net worth without selling costs (home equity) */
  buyerNetWorthWithoutSelling: Decimal
  /** Monthly savings the renter invests (clamped to >= 0) */
  monthlySavings: Decimal
  /** Total rent paid during the year */
  annualRent: Decimal
  /** Total buyer costs during the year */
  buyerAnnualCost: Decimal
}

// ---------------------------------------------------------------------------
// Comparison Input
// ---------------------------------------------------------------------------

/** All inputs needed to run a full rent-vs-buy comparison */
export interface ComparisonInput {
  // Housing inputs
  purchasePrice: number
  downPaymentPercent: number
  mortgageRate: number
  amortizationYears: number
  province: ProvinceCode
  timeHorizon: number
  firstTimeBuyer: boolean

  // Rent inputs
  monthlyRent: number
  rentIncreasePercent: number

  // Investment inputs
  annualIncome: number
  investmentReturnPercent: number
  /** Manual tax rate override; null or undefined = auto-calculate from income + province */
  taxRateOverride?: number | null
  inflationRatePercent: number

  // Optional housing cost rates (use provincial defaults if omitted)
  propertyTaxRate?: number
  maintenanceRate?: number
  homeInsurance?: number
  appreciationRate?: number
}

// ---------------------------------------------------------------------------
// Comparison Result
// ---------------------------------------------------------------------------

/** Complete result of the rent-vs-buy comparison engine */
export interface ComparisonResult {
  /** Full housing cost projection from Phase 2 */
  housingProjection: HousingProjection
  /** Year-by-year portfolio growth for the renter */
  portfolio: PortfolioYear[]
  /** Year-by-year net worth comparison between renter and buyer */
  yearlyComparison: YearlyComparison[]
  /** First year where buying beats renting (with selling costs), or 'never' */
  breakEvenWithSelling: number | 'never'
  /** First year where buying beats renting (without selling costs), or 'never' */
  breakEvenWithoutSelling: number | 'never'
  /** Combined federal + provincial marginal tax rate as percentage */
  marginalTaxRate: Decimal
  /** After-tax investment return rate as decimal (e.g., 0.045 for 4.5%) */
  afterTaxReturnRate: Decimal
}
