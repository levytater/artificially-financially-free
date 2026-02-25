'use client'

import { useDebouncedComparison } from '@/hooks/use-debounced-comparison'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PlaceholderBlock } from './placeholder-block'

/**
 * Main content area with labeled placeholder blocks for each future section.
 *
 * Desktop: Takes remaining width to the right of the sidebar.
 * Mobile: Full width, stacks below the sidebar.
 *
 * Temporary results summary shows debounced comparison results to prove
 * end-to-end wiring. This will be replaced by proper components in Phase 5-6.
 *
 * Placeholder blocks will be replaced by real components in future phases:
 * - Verdict (Phase 5)
 * - Summary Cards (Phase 5)
 * - Charts (Phase 6)
 * - Cost Breakdown and Year Comparison (Phase 5)
 */
export function MainContent() {
  const { results, isCalculating } = useDebouncedComparison()

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {/* Temporary results summary -- proves end-to-end wiring */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isCalculating ? 'Calculating...' : 'Comparison Results'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!results ? (
              <p className="text-sm text-muted-foreground">
                Adjust inputs to see results
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Break-even year (with selling):</span>{' '}
                  {results.breakEvenWithSelling === 'never'
                    ? 'Never'
                    : `Year ${results.breakEvenWithSelling}`}
                </p>
                <p>
                  <span className="font-medium">Break-even year (without selling):</span>{' '}
                  {results.breakEvenWithoutSelling === 'never'
                    ? 'Never'
                    : `Year ${results.breakEvenWithoutSelling}`}
                </p>
                <p>
                  <span className="font-medium">Marginal tax rate:</span>{' '}
                  {results.marginalTaxRate.toNumber().toFixed(2)}%
                </p>
                <p>
                  <span className="font-medium">After-tax return rate:</span>{' '}
                  {(results.afterTaxReturnRate.toNumber() * 100).toFixed(2)}%
                </p>
                <p>
                  <span className="font-medium">Final renter net worth:</span> $
                  {results.yearlyComparison[
                    results.yearlyComparison.length - 1
                  ].renterNetWorth
                    .toNumber()
                    .toLocaleString('en-CA', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                </p>
                <p>
                  <span className="font-medium">Final buyer net worth (with selling):</span> $
                  {results.yearlyComparison[
                    results.yearlyComparison.length - 1
                  ].buyerNetWorthWithSelling
                    .toNumber()
                    .toLocaleString('en-CA', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
