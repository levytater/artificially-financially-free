'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { PlaceholderBlock } from '@/components/layout/placeholder-block'

/**
 * 3-tab chart structure for Phase 6 visualizations.
 *
 * Tabs: Net Worth, Cash Flow, Investment Growth.
 * Content: Placeholder blocks to be replaced with actual charts in Phase 6.
 */
export function ChartTabs() {
  return (
    <Tabs defaultValue="net-worth" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="net-worth">Net Worth</TabsTrigger>
        <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        <TabsTrigger value="investment-growth">Investment Growth</TabsTrigger>
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
    </Tabs>
  )
}
