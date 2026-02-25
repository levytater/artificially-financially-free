'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useCalculator } from '@/providers/calculator-provider'

/**
 * Simple/Advanced mode toggle switch.
 *
 * Simple mode: Hides per-account returns, maintenance %, selling costs %,
 * home insurance, inflation rate, rent increase rate, appreciation rate.
 *
 * Advanced mode: Reveals all advanced inputs with their current default values.
 * Switching modes does NOT change calculation results -- it only reveals
 * the values that were being used behind the scenes.
 */
export function ModeToggle() {
  const { state, setState } = useCalculator()

  const description = state.advancedMode
    ? 'Fine-tuning all parameters'
    : 'Using standard cost assumptions'

  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-4">
      {/* Switch row */}
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="advanced-mode-toggle" className="text-sm font-medium">
          Advanced Mode
        </Label>
        <Switch
          id="advanced-mode-toggle"
          checked={state.advancedMode}
          onCheckedChange={(checked) => setState({ advancedMode: checked })}
        />
      </div>

      {/* Description */}
      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
