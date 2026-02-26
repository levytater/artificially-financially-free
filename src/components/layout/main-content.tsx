'use client'

import { useDebouncedComparison } from '@/hooks/use-debounced-comparison'
import { VerdictCard } from '@/components/results/verdict-card'
import { ChartTabs } from '@/components/results/chart-tabs'
import { SummaryCards } from '@/components/results/summary-cards'
import { YearComparisonPanel } from '@/components/results/year-comparison-panel'
import { CostBreakdownTable } from '@/components/results/cost-breakdown-table'

/**
 * Main content area displaying full rent-vs-buy comparison results.
 *
 * Layout flow: verdict -> tabs -> summary cards -> year comparison -> cost breakdown
 *
 * Desktop: Takes remaining width to the right of the sidebar.
 * Mobile: Full width, stacks below the sidebar.
 */
export function MainContent() {
  const { results, isCalculating } = useDebouncedComparison()

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Loading indicator */}
        {isCalculating && (
          <p className="text-center text-sm text-muted-foreground">
            Recalculating...
          </p>
        )}

        {/* Results display */}
        {results && (
          <div className={isCalculating ? 'opacity-50' : ''}>
            <VerdictCard results={results} />
            <div className="mt-6">
              <ChartTabs />
            </div>
            <div className="mt-6">
              <SummaryCards results={results} />
            </div>
            <div className="mt-6">
              <YearComparisonPanel results={results} />
            </div>
            <div className="mt-6">
              <CostBreakdownTable results={results} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!results && !isCalculating && (
          <p className="py-12 text-center text-muted-foreground">
            Adjust inputs to see your rent vs. buy comparison
          </p>
        )}
      </div>
    </main>
  )
}
