import Decimal from 'decimal.js'
import type { ComparisonResult } from '@/types/investment'

export interface VerdictResult {
  decision: 'rent' | 'buy' | 'tie'
  advantage: Decimal // absolute dollar difference (always positive)
  percentAdvantage: Decimal // percentage difference (always positive)
  renterFinal: Decimal
  buyerFinal: Decimal
  breakEvenYear: number | 'never'
  timeHorizon: number
}

/** Tie threshold: outcomes within 5% are considered a tie */
const TIE_THRESHOLD = new Decimal('0.05')

/**
 * Calculate the verdict from comparison results.
 * Compares final net worth with selling costs to determine rent/buy/tie outcome.
 */
export function calculateVerdict(results: ComparisonResult): VerdictResult {
  // Get final year data
  const finalYear = results.yearlyComparison[results.yearlyComparison.length - 1]
  const renterFinal = finalYear.renterNetWorth
  const buyerFinal = finalYear.buyerNetWorthWithSelling

  // Calculate absolute and percentage difference
  const advantage = renterFinal.greaterThan(buyerFinal)
    ? renterFinal.minus(buyerFinal)
    : buyerFinal.minus(renterFinal)

  // Use the larger value as the denominator for percentage calculation
  const largerValue = Decimal.max(renterFinal, buyerFinal)
  const percentAdvantage = largerValue.isZero()
    ? new Decimal(0)
    : advantage.dividedBy(largerValue).times(100)

  // Determine decision based on 5% tie threshold
  let decision: 'rent' | 'buy' | 'tie'
  if (percentAdvantage.dividedBy(100).lessThanOrEqualTo(TIE_THRESHOLD)) {
    decision = 'tie'
  } else if (renterFinal.greaterThan(buyerFinal)) {
    decision = 'rent'
  } else {
    decision = 'buy'
  }

  return {
    decision,
    advantage,
    percentAdvantage,
    renterFinal,
    buyerFinal,
    breakEvenYear: results.breakEvenWithSelling,
    timeHorizon: results.yearlyComparison.length,
  }
}
