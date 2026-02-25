'use client'

import { serializeCalculatorState } from '@/lib/serializer'
import { useCalculator } from '@/providers/calculator-provider'

/**
 * Hook for generating and copying shareable calculator URLs.
 *
 * Uses nuqs createSerializer to produce URLs with only non-default values.
 * Example: https://artificiallyfinanciallyfree.com/?price=750000&province=BC&rent=2500
 */
export function useShareUrl() {
  const { state } = useCalculator()

  /** Generate a full shareable URL string from the current calculator state */
  const generateShareUrl = (): string => {
    return serializeCalculatorState(window.location.origin, state)
  }

  /** Copy the shareable URL to the clipboard */
  const copyShareUrl = async (): Promise<void> => {
    const url = generateShareUrl()
    await navigator.clipboard.writeText(url)
  }

  return { generateShareUrl, copyShareUrl }
}
