'use client'

import { useEffect, useState } from 'react'
import { useCalculator } from '@/providers/calculator-provider'
import { calculateRentVsBuyComparison } from '@/lib/calculations/comparison'
import type { ComparisonResult, ComparisonInput } from '@/types/investment'
import type { ProvinceCode } from '@/types/housing'
import type { CalculatorState } from '@/types/calculator'

/**
 * When advancedMode is true and the user has per-account return overrides,
 * compute a weighted-average blended return to pass to ComparisonInput.
 *
 * Phase 3's ComparisonInput only supports a single investmentReturnPercent.
 * The proper per-account portfolio modeling (separate TFSA/RRSP/Non-reg
 * portfolios with different tax treatments) is a Phase 3 enhancement.
 * For now, we approximate by equally weighting the three account returns.
 *
 * NOTE: This is a KNOWN SIMPLIFICATION. The blended rate collapses
 * TFSA (tax-free), RRSP (tax-deferred), and Non-registered (taxable)
 * into one rate. A future Phase 3 enhancement should model three
 * separate portfolios with account-specific tax treatment.
 */
function computeBlendedReturn(state: CalculatorState): number {
  if (!state.advancedMode) {
    return state.investmentReturn
  }
  // Equal-weight average of per-account returns
  return (state.tfsaReturn + state.rrspReturn + state.nonRegisteredReturn) / 3
}

/**
 * Debounced rent-vs-buy comparison hook.
 *
 * Watches calculator state and automatically recalculates comparison results
 * after 300ms of inactivity (debounced to prevent calculations on every keystroke).
 *
 * @returns Comparison results and isCalculating flag
 */
export function useDebouncedComparison(): {
  results: ComparisonResult | null
  isCalculating: boolean
} {
  const { state } = useCalculator()
  const [results, setResults] = useState<ComparisonResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    setIsCalculating(true)

    const timer = setTimeout(() => {
      try {
        // Build ComparisonInput from calculator state
        const input: ComparisonInput = {
          purchasePrice: state.purchasePrice,
          downPaymentPercent: state.downPaymentPercent,
          mortgageRate: state.mortgageRate,
          amortizationYears: state.amortizationYears,
          province: state.province as ProvinceCode,
          timeHorizon: state.timeHorizon,
          firstTimeBuyer: state.firstTimeBuyer,
          monthlyRent: state.monthlyRent,
          rentIncreasePercent: state.rentIncreaseRate,
          annualIncome: state.annualIncome,
          investmentReturnPercent: computeBlendedReturn(state),
          inflationRatePercent: state.inflationRate,
          // Optional overrides from advanced mode (convert percentages to decimals)
          propertyTaxRate: undefined, // Uses province default
          maintenanceRate: state.advancedMode ? state.maintenancePercent / 100 : undefined,
          homeInsurance: state.advancedMode ? state.homeInsurance : undefined,
          appreciationRate: state.advancedMode ? state.appreciationRate / 100 : undefined,
        }

        const result = calculateRentVsBuyComparison(input)
        setResults(result)
      } catch (error) {
        console.error('Comparison calculation error:', error)
        setResults(null)
      } finally {
        setIsCalculating(false)
      }
    }, 300)

    // Cleanup: cancel pending calculation if state changes again before 300ms
    return () => clearTimeout(timer)
  }, [state])

  return { results, isCalculating }
}
