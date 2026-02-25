'use client'

import { useState } from 'react'
import { useCalculator } from '@/providers/calculator-provider'
import { ProvinceSelector } from './province-selector'
import { CurrencyInput } from './currency-input'
import { CheckboxInput } from './checkbox-input'
import { validateAnnualIncome } from '@/lib/validation'

/**
 * Wizard Step 1: "Your Situation"
 *
 * Collects province, annual income, and first-time buyer status.
 * Explains why these inputs affect taxes (land transfer tax and investment gains).
 */
export function WizardStep1() {
  const { state, setState } = useCalculator()
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const handleIncomeBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('annualIncome'))
    const error = validateAnnualIncome(state.annualIncome)
    setErrors((prev) => ({ ...prev, annualIncome: error }))
  }

  return (
    <div className="space-y-6">
      {/* Educational intro */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Situation</h3>
        <p className="text-sm text-muted-foreground">
          Where you live and how much you earn determines the taxes you'll pay on both
          buying a home and investing. These numbers help us calculate province-specific
          land transfer taxes and the marginal tax rate on your investment gains.
        </p>

        {/* Learn more expandable section */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
            Learn more
          </summary>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Why province matters:</strong> Each province has different land
              transfer tax rates (with first-time buyer rebates), property tax rates, and
              income tax brackets. These can add up to tens of thousands of dollars in
              difference.
            </p>
            <p>
              <strong>Why income matters:</strong> Your marginal tax rate determines how
              much tax you'll pay on investment gains. Higher earners pay more tax on
              their non-registered investment returns, which affects the rent-vs-buy
              comparison.
            </p>
          </div>
        </details>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <ProvinceSelector
          value={state.province}
          onChange={(province) => setState({ province })}
        />

        <CurrencyInput
          label="Annual Gross Income"
          value={state.annualIncome}
          onChange={(annualIncome) => setState({ annualIncome })}
          onBlur={handleIncomeBlur}
          step={5000}
          min={0}
          max={10_000_000}
          error={touchedFields.has('annualIncome') ? errors.annualIncome : undefined}
        />

        <CheckboxInput
          label="First-Time Home Buyer"
          description="May qualify for land transfer tax rebates and other benefits"
          checked={state.firstTimeBuyer}
          onCheckedChange={(firstTimeBuyer) =>
            setState({ firstTimeBuyer: firstTimeBuyer as boolean })
          }
        />
      </div>
    </div>
  )
}
