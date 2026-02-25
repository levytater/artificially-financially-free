'use client'

import { createContext, useContext } from 'react'
import { useCalculatorState } from '@/hooks/use-calculator-state'
import type { CalculatorContextValue } from '@/types/calculator'

const CalculatorContext = createContext<CalculatorContextValue | null>(null)

/**
 * React Context provider for the calculator state.
 *
 * This is the single source of truth for all calculator inputs.
 * Any component (or future AI chatbot) calls useCalculator() to read/write state.
 * Wrap your app with this provider in the root layout.
 */
export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const { state, setState, resetToDefaults } = useCalculatorState()

  return (
    <CalculatorContext.Provider value={{ state, setState, resetToDefaults }}>
      {children}
    </CalculatorContext.Provider>
  )
}

/**
 * Hook to access the calculator state from any component.
 *
 * Must be used within a CalculatorProvider. Throws if used outside.
 *
 * @returns CalculatorContextValue with state, setState, and resetToDefaults
 */
export function useCalculator(): CalculatorContextValue {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
