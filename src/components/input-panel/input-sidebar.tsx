'use client'

import { useState } from 'react'
import { useCalculator } from '@/providers/calculator-provider'
import { Accordion } from '@/components/ui/accordion'
import { ModeToggle } from './mode-toggle'
import { InputSection } from './input-section'
import { CurrencyInput } from './currency-input'
import { PercentageInput } from './percentage-input'
import { ProvinceSelector } from './province-selector'
import { TimeHorizonInput } from './time-horizon-input'
import { CheckboxInput } from './checkbox-input'
import { StepperInput } from './stepper-input'
import {
  validatePurchasePrice,
  validateDownPaymentPercent,
  validateMortgageRate,
  validateAmortization,
  validateMonthlyRent,
  validateAnnualIncome,
  validatePercentageRate,
  validateHomeInsurance,
  validateSellingCosts,
  validateTimeHorizon,
} from '@/lib/validation'

/**
 * Main input sidebar with all calculator inputs organized in 3 collapsible sections.
 *
 * Layout:
 * - ModeToggle at the top
 * - 3 accordion sections (Your Situation, The Home, The Alternative)
 * - Advanced mode reveals per-account returns and additional rate inputs
 *
 * All inputs read from and write to calculator state via useCalculator().
 * Validation errors shown only for touched fields.
 */
export function InputSidebar() {
  const { state, setState } = useCalculator()

  // Track which fields have been touched (changed at least once) to show validation errors
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (field: string, value: number | string | boolean) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setState({ [field]: value } as Partial<typeof state>)
  }

  return (
    <div className="flex flex-col">
      {/* Advanced Mode Toggle */}
      <ModeToggle />

      {/* Input Sections */}
      <Accordion
        type="multiple"
        defaultValue={['situation', 'home', 'alternative']}
        className="space-y-3"
      >
        {/* Section 1: Your Situation */}
        <InputSection value="situation" title="Your Situation">
          <ProvinceSelector
            value={state.province}
            onChange={(v) => handleChange('province', v)}
          />

          <CurrencyInput
            label="Annual Gross Income"
            value={state.annualIncome}
            onChange={(v) => handleChange('annualIncome', v)}
            step={5000}
            min={0}
            error={touched.annualIncome ? validateAnnualIncome(state.annualIncome) : undefined}
          />

          <CheckboxInput
            label="First-Time Home Buyer"
            checked={state.firstTimeBuyer}
            onCheckedChange={(checked) => handleChange('firstTimeBuyer', checked)}
            description="Qualify for land transfer tax rebates"
          />
        </InputSection>

        {/* Section 2: The Home */}
        <InputSection value="home" title="The Home">
          <CurrencyInput
            label="Purchase Price"
            value={state.purchasePrice}
            onChange={(v) => handleChange('purchasePrice', v)}
            step={10000}
            min={0}
            error={touched.purchasePrice ? validatePurchasePrice(state.purchasePrice) : undefined}
          />

          <PercentageInput
            label="Down Payment"
            value={state.downPaymentPercent}
            onChange={(v) => handleChange('downPaymentPercent', v)}
            step={1}
            min={5}
            max={100}
            error={
              touched.downPaymentPercent
                ? validateDownPaymentPercent(state.downPaymentPercent, state.purchasePrice)
                : undefined
            }
          />

          <PercentageInput
            label="Mortgage Rate"
            value={state.mortgageRate}
            onChange={(v) => handleChange('mortgageRate', v)}
            step={0.10}
            min={0}
            max={20}
            error={touched.mortgageRate ? validateMortgageRate(state.mortgageRate) : undefined}
          />

          <StepperInput
            label="Amortization"
            value={state.amortizationYears}
            onChange={(v) => handleChange('amortizationYears', v)}
            step={1}
            min={1}
            max={30}
            suffix="years"
            error={touched.amortizationYears ? validateAmortization(state.amortizationYears) : undefined}
          />

          {/* Advanced mode only */}
          {state.advancedMode && (
            <>
              <PercentageInput
                label="Home Appreciation Rate"
                value={state.appreciationRate}
                onChange={(v) => handleChange('appreciationRate', v)}
                step={0.10}
                min={0}
                max={50}
                error={
                  touched.appreciationRate
                    ? validatePercentageRate(state.appreciationRate, 'Home appreciation rate')
                    : undefined
                }
              />

              <PercentageInput
                label="Maintenance"
                value={state.maintenancePercent}
                onChange={(v) => handleChange('maintenancePercent', v)}
                step={0.10}
                min={0}
                max={10}
                error={
                  touched.maintenancePercent
                    ? validatePercentageRate(state.maintenancePercent, 'Maintenance percentage')
                    : undefined
                }
              />

              <PercentageInput
                label="Selling Costs"
                value={state.sellingCostsPercent}
                onChange={(v) => handleChange('sellingCostsPercent', v)}
                step={0.10}
                min={0}
                max={20}
                error={
                  touched.sellingCostsPercent
                    ? validateSellingCosts(state.sellingCostsPercent)
                    : undefined
                }
              />

              <CurrencyInput
                label="Home Insurance"
                value={state.homeInsurance}
                onChange={(v) => handleChange('homeInsurance', v)}
                step={100}
                min={0}
                error={
                  touched.homeInsurance
                    ? validateHomeInsurance(state.homeInsurance)
                    : undefined
                }
              />
            </>
          )}
        </InputSection>

        {/* Section 3: The Alternative */}
        <InputSection value="alternative" title="The Alternative">
          <CurrencyInput
            label="Monthly Rent"
            value={state.monthlyRent}
            onChange={(v) => handleChange('monthlyRent', v)}
            step={50}
            min={0}
            error={touched.monthlyRent ? validateMonthlyRent(state.monthlyRent) : undefined}
          />

          <PercentageInput
            label="Expected Return"
            value={state.investmentReturn}
            onChange={(v) => handleChange('investmentReturn', v)}
            step={0.10}
            min={0}
            max={50}
            error={
              touched.investmentReturn
                ? validatePercentageRate(state.investmentReturn, 'Investment return')
                : undefined
            }
          />

          <TimeHorizonInput
            value={state.timeHorizon}
            onChange={(v) => handleChange('timeHorizon', v)}
            error={touched.timeHorizon ? validateTimeHorizon(state.timeHorizon) : undefined}
          />

          {/* Advanced mode only */}
          {state.advancedMode && (
            <>
              <PercentageInput
                label="TFSA Return"
                value={state.tfsaReturn}
                onChange={(v) => handleChange('tfsaReturn', v)}
                step={0.10}
                min={0}
                max={50}
                error={
                  touched.tfsaReturn
                    ? validatePercentageRate(state.tfsaReturn, 'TFSA return')
                    : undefined
                }
              />

              <PercentageInput
                label="RRSP Return"
                value={state.rrspReturn}
                onChange={(v) => handleChange('rrspReturn', v)}
                step={0.10}
                min={0}
                max={50}
                error={
                  touched.rrspReturn
                    ? validatePercentageRate(state.rrspReturn, 'RRSP return')
                    : undefined
                }
              />

              <PercentageInput
                label="Non-Registered Return"
                value={state.nonRegisteredReturn}
                onChange={(v) => handleChange('nonRegisteredReturn', v)}
                step={0.10}
                min={0}
                max={50}
                error={
                  touched.nonRegisteredReturn
                    ? validatePercentageRate(state.nonRegisteredReturn, 'Non-registered return')
                    : undefined
                }
              />

              <PercentageInput
                label="Rent Increase Rate"
                value={state.rentIncreaseRate}
                onChange={(v) => handleChange('rentIncreaseRate', v)}
                step={0.10}
                min={0}
                max={20}
                error={
                  touched.rentIncreaseRate
                    ? validatePercentageRate(state.rentIncreaseRate, 'Rent increase rate')
                    : undefined
                }
              />

              <PercentageInput
                label="Inflation Rate"
                value={state.inflationRate}
                onChange={(v) => handleChange('inflationRate', v)}
                step={0.10}
                min={0}
                max={20}
                error={
                  touched.inflationRate
                    ? validatePercentageRate(state.inflationRate, 'Inflation rate')
                    : undefined
                }
              />
            </>
          )}
        </InputSection>
      </Accordion>
    </div>
  )
}
