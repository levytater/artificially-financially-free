'use client'

import { useState } from 'react'
import { Gauge, Settings } from 'lucide-react'
import { useCalculator } from '@/providers/calculator-provider'
import { CurrencyInput } from './currency-input'
import { PercentageInput } from './percentage-input'
import { TimeHorizonInput } from './time-horizon-input'
import {
  validateMonthlyRent,
  validatePercentageRate,
  validateTimeHorizon,
} from '@/lib/validation'

/**
 * Wizard Step 3: "The Alternative"
 *
 * Collects monthly rent, investment return, time horizon, and Simple/Advanced mode choice.
 * Explains opportunity cost concept and the three account types available in Advanced mode.
 */
export function WizardStep3() {
  const { state, setState } = useCalculator()
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const handleMonthlyRentBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('monthlyRent'))
    const error = validateMonthlyRent(state.monthlyRent)
    setErrors((prev) => ({ ...prev, monthlyRent: error }))
  }

  const handleInvestmentReturnBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('investmentReturn'))
    const error = validatePercentageRate(state.investmentReturn, 'Investment return')
    setErrors((prev) => ({ ...prev, investmentReturn: error }))
  }

  const handleTimeHorizonBlur = () => {
    setTouchedFields((prev) => new Set(prev).add('timeHorizon'))
    const error = validateTimeHorizon(state.timeHorizon)
    setErrors((prev) => ({ ...prev, timeHorizon: error }))
  }

  return (
    <div className="space-y-6">
      {/* Educational intro */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">The Alternative</h3>
        <p className="text-sm text-muted-foreground">
          Instead of buying, you could rent and invest the difference. This step defines
          your rental costs and investment assumptions. The money you'd save by renting
          (including the down payment you'd keep) grows in the market — and that's the
          heart of the rent-vs-buy comparison.
        </p>

        {/* Learn more expandable section */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
            Learn more
          </summary>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Opportunity cost:</strong> The down payment alone invested at 6-7%
              can grow significantly over 25 years. For example, a $100,000 down payment
              growing at 6% becomes $430,000 in 25 years. That's the wealth you're giving
              up when you buy instead of rent and invest.
            </p>
            <p>
              <strong>Three account types:</strong> In Advanced mode, you can fine-tune
              returns for each investment account type: TFSA (tax-free growth), RRSP
              (tax-deferred growth with deduction), and Non-registered (taxable). Each
              has different tax treatment that affects your final wealth.
            </p>
          </div>
        </details>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <CurrencyInput
          label="Monthly Rent"
          value={state.monthlyRent}
          onChange={(monthlyRent) => setState({ monthlyRent })}
          onBlur={handleMonthlyRentBlur}
          step={50}
          min={0}
          max={50_000}
          error={touchedFields.has('monthlyRent') ? errors.monthlyRent : undefined}
        />

        <PercentageInput
          label="Expected Investment Return"
          value={state.investmentReturn}
          onChange={(investmentReturn) => setState({ investmentReturn })}
          onBlur={handleInvestmentReturnBlur}
          step={0.1}
          min={0}
          max={50}
          error={
            touchedFields.has('investmentReturn') ? errors.investmentReturn : undefined
          }
        />

        <TimeHorizonInput
          value={state.timeHorizon}
          onChange={(timeHorizon) => setState({ timeHorizon })}
          onBlur={handleTimeHorizonBlur}
          error={touchedFields.has('timeHorizon') ? errors.timeHorizon : undefined}
        />
      </div>

      {/* Simple/Advanced mode choice */}
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-sm font-medium">How detailed do you want to get?</h4>
        <div className="grid grid-cols-2 gap-3">
          {/* Simple mode card */}
          <button
            type="button"
            onClick={() => setState({ advancedMode: false })}
            className={`flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all hover:bg-accent/50 ${
              !state.advancedMode
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <span className="font-semibold">Simple</span>
            </div>
            <p className="text-xs text-muted-foreground">
              One investment return rate, standard cost assumptions. Best for a quick
              comparison.
            </p>
          </button>

          {/* Advanced mode card */}
          <button
            type="button"
            onClick={() => setState({ advancedMode: true })}
            className={`flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all hover:bg-accent/50 ${
              state.advancedMode
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <span className="font-semibold">Advanced</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Fine-tune per-account returns (TFSA, RRSP, Non-reg), maintenance costs,
              selling costs, and more.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
