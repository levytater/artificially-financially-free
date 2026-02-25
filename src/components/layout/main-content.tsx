'use client'

import { PlaceholderBlock } from './placeholder-block'

/**
 * Main content area with labeled placeholder blocks for each future section.
 *
 * Desktop: Takes remaining width to the right of the sidebar.
 * Mobile: Full width, stacks below the sidebar.
 *
 * Placeholder blocks will be replaced by real components in future phases:
 * - Verdict (Phase 5)
 * - Summary Cards (Phase 5)
 * - Charts (Phase 6)
 * - Cost Breakdown and Year Comparison (Phase 5)
 */
export function MainContent() {
  return (
    <main className="flex-1 p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {/* Verdict card -- prominent, at the top */}
        <PlaceholderBlock label="Verdict" minHeight="100px" />

        {/* Summary cards row */}
        <PlaceholderBlock label="Summary Cards" minHeight="80px" />

        {/* Chart visualizations -- larger blocks */}
        <PlaceholderBlock label="Net Worth Chart" minHeight="240px" />
        <PlaceholderBlock label="Cash Flow Chart" minHeight="240px" />
        <PlaceholderBlock label="Renter Savings Chart" minHeight="240px" />

        {/* Tabular data -- medium blocks */}
        <PlaceholderBlock label="Cost Breakdown Table" minHeight="160px" />
        <PlaceholderBlock label="Year-by-Year Comparison" minHeight="160px" />
      </div>
    </main>
  )
}
