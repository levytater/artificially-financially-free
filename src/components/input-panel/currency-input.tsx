'use client'

import { StepperInput } from './stepper-input'
import { formatCurrency, parseCurrency } from '@/lib/formatting'

export interface CurrencyInputProps {
  /** The current numeric value (from calculator state) */
  value: number
  /** Callback to update state */
  onChange: (value: number) => void
  /** Increment/decrement amount (default: 10000) */
  step?: number
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Accessible label text */
  label: string
  /** Inline error message */
  error?: string
  /** HTML id for the input element */
  id?: string
  /** Additional container classes */
  className?: string
  /** Optional callback fired after blur */
  onBlur?: () => void
}

/**
 * Dollar input with format-on-blur using StepperInput.
 * Formats to Canadian dollars (e.g., "$500,000") using Intl.NumberFormat.
 */
export function CurrencyInput({
  value,
  onChange,
  step = 10000,
  min,
  max,
  label,
  error,
  id,
  className,
  onBlur,
}: CurrencyInputProps) {
  return (
    <StepperInput
      value={value}
      onChange={onChange}
      step={step}
      min={min}
      max={max}
      formatDisplay={formatCurrency}
      parseInput={parseCurrency}
      label={label}
      error={error}
      id={id}
      className={className}
      onBlur={onBlur}
    />
  )
}
