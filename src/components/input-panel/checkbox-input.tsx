'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface CheckboxInputProps {
  /** Whether the checkbox is checked */
  checked: boolean
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void
  /** Label text for the checkbox */
  label: string
  /** Optional description text shown below the label */
  description?: string
  /** HTML id for the checkbox element */
  id?: string
  /** Additional container classes */
  className?: string
}

/**
 * Labeled checkbox with optional description text.
 * Layout: checkbox + label on same row, description below in muted color.
 */
export function CheckboxInput({
  checked,
  onCheckedChange,
  label,
  description,
  id,
  className,
}: CheckboxInputProps) {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Checkbox + Label row */}
      <div className="flex items-center gap-2">
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor={checkboxId} className="cursor-pointer">
          {label}
        </Label>
      </div>

      {/* Optional description */}
      {description && (
        <p className="text-sm text-muted-foreground ml-6">{description}</p>
      )}
    </div>
  )
}
