'use client'

import { InputSidebar } from '@/components/input-panel/input-sidebar'
import { TimeHorizonInput } from '@/components/input-panel/time-horizon-input'
import { useCalculator } from '@/providers/calculator-provider'
import { validateTimeHorizon } from '@/lib/validation'
import { useState } from 'react'

/**
 * Sidebar container for the calculator input panel.
 *
 * Desktop: Sticky on the left side (~350px) with its own scroll.
 * Time horizon is pinned at the top since it affects all charts.
 * Mobile: Full width, stacks above the main content area.
 */
export function AppSidebar() {
  const { state, setState } = useCalculator()
  const [touched, setTouched] = useState(false)

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-border bg-sidebar lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:w-[350px]">
      {/* Time Horizon — always visible, pinned at top */}
      <div className="border-b border-border bg-sidebar p-4">
        <TimeHorizonInput
          value={state.timeHorizon}
          onChange={(v) => {
            setTouched(true)
            setState({ timeHorizon: v })
          }}
          error={touched ? validateTimeHorizon(state.timeHorizon) : undefined}
        />
      </div>

      {/* Scrollable input sections */}
      <div className="flex-1 overflow-y-auto p-4">
        <InputSidebar />
      </div>
    </aside>
  )
}
