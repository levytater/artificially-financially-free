'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepperInputProps {
  /** The current numeric value (from calculator state) */
  value: number
  /** Callback to update state */
  onChange: (value: number) => void
  /** Increment/decrement amount per arrow click */
  step: number
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Format for display (default: v.toString()) */
  formatDisplay?: (value: number) => string
  /** Parse user input to number (default: strip non-numeric, parseFloat) */
  parseInput?: (input: string) => number
  /** Accessible label text */
  label: string
  /** Inline error message (red text below input) */
  error?: string
  /** Optional text suffix displayed after the input (e.g., "years", "%") */
  suffix?: string
  /** Additional container classes */
  className?: string
  /** HTML id for the input element */
  id?: string
}

/**
 * Generic number input with increment/decrement stepper buttons.
 * Format-on-blur behavior: raw number while focused, formatted while blurred.
 * External value changes update display when not focused.
 */
export function StepperInput({
  value,
  onChange,
  step,
  min,
  max,
  formatDisplay = (v) => v.toString(),
  parseInput = (input) => {
    const cleaned = input.replace(/[^\d.-]/g, '')
    return parseFloat(cleaned)
  },
  label,
  error,
  suffix,
  className,
  id,
}: StepperInputProps) {
  const [displayValue, setDisplayValue] = useState(formatDisplay(value))
  const [isFocused, setIsFocused] = useState(false)

  // When external value changes AND input is not focused, update display
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDisplay(value))
    }
  }, [value, isFocused, formatDisplay])

  const handleFocus = () => {
    setIsFocused(true)
    // Show raw number value for easy editing
    setDisplayValue(value.toString())
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Parse the local displayValue, call onChange with the parsed number
    const parsed = parseInput(displayValue)
    if (!isNaN(parsed)) {
      const clamped = clampValue(parsed)
      onChange(clamped)
      setDisplayValue(formatDisplay(clamped))
    } else {
      // Parse failed, revert to formatted current value
      setDisplayValue(formatDisplay(value))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update local displayValue, NOT the global state (prevent lag)
    setDisplayValue(e.target.value)
  }

  const clampValue = (v: number): number => {
    let clamped = v
    if (min !== undefined && clamped < min) {
      clamped = min
    }
    if (max !== undefined && clamped > max) {
      clamped = max
    }
    return clamped
  }

  const handleIncrement = () => {
    const newValue = clampValue(value + step)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = clampValue(value - step)
    onChange(newValue)
  }

  const isAtMax = max !== undefined && value >= max
  const isAtMin = min !== undefined && value <= min

  const errorId = error ? `${id || 'stepper'}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      {/* Input field + stepper buttons row */}
      <div className="flex items-center gap-1">
        <Input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="flex-1"
        />

        {/* Suffix (optional) */}
        {suffix && (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        )}

        {/* Stepper buttons column */}
        <div className="flex flex-col">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleIncrement}
            disabled={isAtMax}
            tabIndex={-1}
            aria-label={`Increase ${label}`}
            className="h-5 w-5 rounded-b-none border border-input"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleDecrement}
            disabled={isAtMin}
            tabIndex={-1}
            aria-label={`Decrease ${label}`}
            className="h-5 w-5 rounded-t-none border border-input border-t-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}
