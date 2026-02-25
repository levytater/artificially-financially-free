'use client'

import useLocalStorageState from 'use-local-storage-state'
import { calculatorDefaults } from '@/lib/defaults'
import type { CalculatorState } from '@/types/calculator'

const STORAGE_KEY = 'aff-calculator-state'

/**
 * Hook for localStorage-persisted calculator state.
 *
 * - Persists all inputs to localStorage under 'aff-calculator-state'
 * - Survives page refreshes and browser restarts
 * - SSR-safe via use-local-storage-state (useSyncExternalStore-based)
 * - Cross-tab sync built-in
 * - setState merges partial updates into existing state (spread pattern)
 */
export function useCalculatorState() {
  const [state, setStoredState] = useLocalStorageState<CalculatorState>(
    STORAGE_KEY,
    { defaultValue: calculatorDefaults },
  )

  /** Merge partial updates into the current state */
  const setState = (updates: Partial<CalculatorState>) => {
    setStoredState((prev) => ({ ...prev, ...updates }))
  }

  /** Reset all inputs to their default values */
  const resetToDefaults = () => {
    setStoredState(calculatorDefaults)
  }

  return { state, setState, resetToDefaults }
}
