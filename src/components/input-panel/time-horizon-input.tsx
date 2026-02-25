'use client'

import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface TimeHorizonInputProps {
  /** The current time horizon value in years */
  value: number
  /** Callback to update state */
  onChange: (value: number) => void
  /** Label text (default: "Time Horizon") */
  label?: string
  /** Inline error message */
  error?: string
  /** Additional container classes */
  className?: string
}

/**
 * Time horizon input with synchronized slider (1-30) and editable number field.
 * Both controls update the same state -- changes in either are reflected in the other immediately.
 */
export function TimeHorizonInput({
  value,
  onChange,
  label = 'Time Horizon',
  error,
  className,
}: TimeHorizonInputProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 30) {
      onChange(newValue)
    }
  }

  const errorId = error ? 'time-horizon-error' : undefined

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Label */}
      <Label htmlFor="time-horizon-slider">{label}</Label>

      {/* Slider */}
      <Slider
        id="time-horizon-slider"
        min={1}
        max={30}
        step={1}
        value={[value]}
        onValueChange={handleSliderChange}
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className="w-full"
      />

      {/* Number field + suffix */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={30}
          value={value}
          onChange={handleInputChange}
          aria-label={`${label} (years)`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">years</span>
      </div>

      {/* Error display */}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
