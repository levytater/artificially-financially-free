'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PROVINCE_CODES, PROVINCE_NAMES } from '@/lib/data/provinces'
import { cn } from '@/lib/utils'

export interface ProvinceSelectorProps {
  /** The current province code (from calculator state) */
  value: string
  /** Callback to update state */
  onChange: (value: string) => void
  /** Label text (default: "Province") */
  label?: string
  /** Inline error message */
  error?: string
  /** Additional container classes */
  className?: string
}

/**
 * Province dropdown using shadcn Select.
 * Renders all 10 Canadian provinces with province code as value and full name as display text.
 */
export function ProvinceSelector({
  value,
  onChange,
  label = 'Province',
  error,
  className,
}: ProvinceSelectorProps) {
  const errorId = error ? 'province-selector-error' : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      <Label htmlFor="province-selector">{label}</Label>

      {/* Select */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="province-selector"
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="w-full"
        >
          <SelectValue placeholder="Select a province" />
        </SelectTrigger>
        <SelectContent>
          {PROVINCE_CODES.map((code) => (
            <SelectItem key={code} value={code}>
              {PROVINCE_NAMES[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Error display */}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
