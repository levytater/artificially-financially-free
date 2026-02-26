'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { PlaceholderBlock } from '@/components/layout/placeholder-block'
import { AuditBreakdownTable } from '@/components/results/audit-breakdown-table'
import type { ComparisonResult } from '@/types/investment'

interface ChartTabsProps {
  results: ComparisonResult
}

/**
 * 4-tab chart structure for visualizations and audit breakdown.
 *
 * Tabs: Net Worth, Cash Flow, Investment Growth, Math Breakdown.
 * Content: Placeholder blocks for charts (Phase 6) + audit table.
 */
export function ChartTabs({ results }: ChartTabsProps) {
  return (
    <Tabs defaultValue="net-worth" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="net-worth">Net Worth</TabsTrigger>
        <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        <TabsTrigger value="investment-growth">Investment Growth</TabsTrigger>
        <TabsTrigger value="math-breakdown">Math Breakdown</TabsTrigger>
      </TabsList>
      <TabsContent value="net-worth">
        <PlaceholderBlock label="Net Worth Chart" minHeight="300px" />
      </TabsContent>
      <TabsContent value="cash-flow">
        <PlaceholderBlock label="Cash Flow Chart" minHeight="300px" />
      </TabsContent>
      <TabsContent value="investment-growth">
        <PlaceholderBlock label="Investment Growth Chart" minHeight="300px" />
      </TabsContent>
      <TabsContent value="math-breakdown">
        <AuditBreakdownTable results={results} />
      </TabsContent>
    </Tabs>
  )
}
