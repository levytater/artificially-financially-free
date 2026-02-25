'use client'

import { StepperInput } from './stepper-input'
import { formatPercentage, parsePercentage } from '@/lib/formatting'

export interface PercentageInputProps {
  /** The current numeric value (from calculator state) */
  value: number
  /** Callback to update state */
  onChange: (value: number) => void
  /** Increment/decrement amount (default: 0.10 for 10 basis points) */
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
}

/**
 * Percentage input with 0.10% steps using StepperInput.
 * Formats to percentage with 2 decimal places (e.g., "5.50%").
 */
export function PercentageInput({
  value,
  onChange,
  step = 0.10,
  min,
  max,
  label,
  error,
  id,
  className,
}: PercentageInputProps) {
  return (
    <StepperInput
      value={value}
      onChange={onChange}
      step={step}
      min={min}
      max={max}
      formatDisplay={formatPercentage}
      parseInput={parsePercentage}
      label={label}
      error={error}
      id={id}
      className={className}
    />
  )
}
