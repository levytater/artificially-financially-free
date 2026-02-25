'use client'

import { useState } from 'react'
import { useCalculator } from '@/providers/calculator-provider'
import { CurrencyInput } from './currency-input'
import { PercentageInput } from './percentage-input'
import { StepperInput } from './stepper-input'
import {
  validatePurchasePrice,
  validateDownPaymentPercent,
  validateMortgageRate,
  validateAmortization,
} from '@/lib/validation'

/**
 * Wizard Step 2: "The Home"
 *
 * Collects purchase price, down payment, mortgage rate, and amortization.
 * Explains CMHC insurance trigger at 20% and the tradeoff between down payment size and invested cash.
 */
export function WizardStep2() {
  const { state, setState } = useCalculator()
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const handlePurchasePriceBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('purchasePrice'))
    const error = validatePurchasePrice(state.purchasePrice)
    setErrors((prev) => ({ ...prev, purchasePrice: error }))
  }

  const handleDownPaymentBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('downPaymentPercent'))
    const error = validateDownPaymentPercent(
      state.downPaymentPercent,
      state.purchasePrice
    )
    setErrors((prev) => ({ ...prev, downPaymentPercent: error }))
  }

  const handleMortgageRateBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('mortgageRate'))
    const error = validateMortgageRate(state.mortgageRate)
    setErrors((prev) => ({ ...prev, mortgageRate: error }))
  }

  const handleAmortizationBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('amortizationYears'))
    const error = validateAmortization(state.amortizationYears)
    setErrors((prev) => ({ ...prev, amortizationYears: error }))
  }

  return (
    <div className="space-y-6">
      {/* Educational intro */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">The Home</h3>
        <p className="text-sm text-muted-foreground">
          These numbers define the home you'd buy. The purchase price and down payment
          determine your mortgage size, and whether you'll need CMHC insurance (required
          with less than 20% down). A larger down payment means less mortgage interest
          but also less cash available to invest.
        </p>

        {/* Learn more expandable section */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
            Learn more
          </summary>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>CMHC insurance:</strong> If you put down less than 20%, you must
              pay mortgage default insurance (commonly called CMHC insurance). This adds
              2-4% to your mortgage principal and protects the lender, not you.
            </p>
            <p>
              <strong>Canadian down payment minimums:</strong> You need at least 5% down
              for homes under $500K, 5% on the first $500K plus 10% on the remainder for
              homes $500K-$1M, and 20% for homes over $1M.
            </p>
            <p>
              <strong>Semi-annual compounding:</strong> Canadian mortgages compound
              interest semi-annually, which is different from the US (monthly
              compounding). This is why Canadian mortgage calculators give slightly
              different results than American ones.
            </p>
          </div>
        </details>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <CurrencyInput
          label="Purchase Price"
          value={state.purchasePrice}
          onChange={(purchasePrice) => setState({ purchasePrice })}
          onBlur={handlePurchasePriceBlur}
          step={10_000}
          min={0}
          max={10_000_000}
          error={touchedFields.has('purchasePrice') ? errors.purchasePrice : undefined}
        />

        <PercentageInput
          label="Down Payment"
          value={state.downPaymentPercent}
          onChange={(downPaymentPercent) => setState({ downPaymentPercent })}
          onBlur={handleDownPaymentBlur}
          step={1}
          min={5}
          max={100}
          error={
            touchedFields.has('downPaymentPercent') ? errors.downPaymentPercent : undefined
          }
        />

        <PercentageInput
          label="Mortgage Rate"
          value={state.mortgageRate}
          onChange={(mortgageRate) => setState({ mortgageRate })}
          onBlur={handleMortgageRateBlur}
          step={0.1}
          min={0}
          max={20}
          error={touchedFields.has('mortgageRate') ? errors.mortgageRate : undefined}
        />

        <StepperInput
          label="Amortization Period"
          value={state.amortizationYears}
          onChange={(amortizationYears) => setState({ amortizationYears })}
          onBlur={handleAmortizationBlur}
          step={1}
          min={1}
          max={30}
          suffix="years"
          formatDisplay={(value) => Math.round(value).toString()}
          error={
            touchedFields.has('amortizationYears') ? errors.amortizationYears : undefined
          }
        />
      </div>
    </div>
  )
}
