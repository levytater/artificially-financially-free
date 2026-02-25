/**
 * Share URL serializer using nuqs createSerializer.
 *
 * Generates shareable URLs from calculator state. Only non-default values
 * appear in the URL thanks to clearOnDefault. Uses short URL keys for
 * human-readable links.
 *
 * Usage:
 *   serializeCalculatorState(window.location.origin, currentState)
 *   // Returns: "https://artificiallyfinanciallyfree.com/?price=750000&province=BC&rent=2500"
 */
import { createSerializer } from 'nuqs/server'
import { calculatorParsers, calculatorUrlKeys } from './parsers'

export const serializeCalculatorState = createSerializer(calculatorParsers, {
  clearOnDefault: true,
  urlKeys: calculatorUrlKeys,
})
