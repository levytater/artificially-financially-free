'use client'

import { useRef } from 'react'
import { useDebouncedComparison } from '@/hooks/use-debounced-comparison'
import { useCalculator } from '@/providers/calculator-provider'
import { VerdictCard } from '@/components/results/verdict-card'
import { ChartTabs } from '@/components/results/chart-tabs'
import { SummaryCards } from '@/components/results/summary-cards'
import { YearComparisonPanel } from '@/components/results/year-comparison-panel'
import { CostBreakdownTable } from '@/components/results/cost-breakdown-table'
import { ExportPdfButton } from '@/components/results/export-pdf-button'
import { PROVINCE_NAMES } from '@/lib/data/provinces'
import { formatCurrencyDecimal } from '@/lib/formatting'
import Decimal from 'decimal.js'

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
  const { state } = useCalculator()
  const printRef = useRef<HTMLDivElement>(null)

  // Get province name for print header
  const provinceName = PROVINCE_NAMES[state.province as keyof typeof PROVINCE_NAMES]

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Loading indicator */}
        {isCalculating && (
          <p className="no-print text-center text-sm text-muted-foreground">
            Recalculating...
          </p>
        )}

        {/* Export PDF button */}
        {results && (
          <div className="flex justify-end no-print">
            <ExportPdfButton contentRef={printRef} />
          </div>
        )}

        {/* Results display */}
        {results && (
          <div ref={printRef} className={isCalculating ? 'opacity-50' : ''}>
            {/* Print-only report header */}
            <div className="hidden print-only print-full-width mb-6">
              <h1 className="text-2xl font-bold text-black">Rent vs. Buy Analysis Report</h1>
              <p className="text-sm text-gray-600 mt-2">
                Generated on {new Date().toLocaleDateString('en-CA')}
              </p>
              <p className="text-sm text-gray-600">
                Province: {provinceName} | Time Horizon: {state.timeHorizon} years | Purchase Price: {formatCurrencyDecimal(new Decimal(state.purchasePrice))}
              </p>
              <hr className="my-4 border-gray-300" />
            </div>

            <VerdictCard results={results} />
            <div className="mt-6">
              <ChartTabs results={results} />
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
          <p className="no-print py-12 text-center text-muted-foreground">
            Adjust inputs to see your rent vs. buy comparison
          </p>
        )}
      </div>
    </main>
  )
}
