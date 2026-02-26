'use client'

import type { ComparisonResult } from '@/types/investment'
import { formatCurrencyDecimal } from '@/lib/formatting'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface CostBreakdownTableProps {
  results: ComparisonResult
}

/**
 * Side-by-side cost breakdown table with expandable categories.
 *
 * Shows 4 expandable rows: Initial Costs, Recurring Costs, Opportunity Costs,
 * Net Proceeds. Each row displays renter vs buyer values with sub-item details.
 */
export function CostBreakdownTable({ results }: CostBreakdownTableProps) {
  const { housingProjection, yearlyComparison } = results
  const finalYear = yearlyComparison[yearlyComparison.length - 1]
  const firstYearHousing = housingProjection.yearlyProjection[0]

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        <h3 className="mb-4 text-lg font-semibold">Cost Breakdown</h3>
        <Accordion type="multiple" className="w-full">
          {/* Initial Costs */}
          <AccordionItem value="initial-costs">
            <AccordionTrigger>
              <div className="grid w-full grid-cols-3 gap-4 pr-4">
                <span className="text-left">Initial Costs</span>
                <span className="text-right font-normal text-muted-foreground">
                  $0
                </span>
                <span className="text-right font-normal">
                  {formatCurrencyDecimal(housingProjection.upfrontCosts.totalCashRequired)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Down Payment</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(housingProjection.upfrontCosts.downPayment)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">CMHC Premium</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(housingProjection.upfrontCosts.cmhcPremium)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">CMHC PST</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(housingProjection.upfrontCosts.cmhcPst)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Land Transfer Tax</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(housingProjection.upfrontCosts.ltt)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Closing Costs</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(housingProjection.upfrontCosts.buyingClosingCosts)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Recurring Annual Costs (Year 1) */}
          <AccordionItem value="recurring-costs">
            <AccordionTrigger>
              <div className="grid w-full grid-cols-3 gap-4 pr-4">
                <span className="text-left">Recurring Annual Costs (Year 1)</span>
                <span className="text-right font-normal">
                  {formatCurrencyDecimal(yearlyComparison[0].annualRent)}
                </span>
                <span className="text-right font-normal">
                  {formatCurrencyDecimal(firstYearHousing.totalAnnualCost)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Rent / Mortgage</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(yearlyComparison[0].annualRent)}
                  </span>
                  <span className="text-right">
                    {formatCurrencyDecimal(firstYearHousing.mortgagePayment)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Property Tax</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(firstYearHousing.propertyTax)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Maintenance</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(firstYearHousing.maintenance)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Home Insurance</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(firstYearHousing.homeInsurance)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Opportunity Costs */}
          <AccordionItem value="opportunity-costs">
            <AccordionTrigger>
              <div className="grid w-full grid-cols-3 gap-4 pr-4">
                <span className="text-left">Opportunity Costs</span>
                <span className="text-right font-normal text-muted-foreground">
                  Foregone Home Equity
                </span>
                <span className="text-right font-normal text-muted-foreground">
                  Foregone Investment Returns
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">
                    If renter had bought instead
                  </span>
                  <span className="text-right">
                    {formatCurrencyDecimal(finalYear.buyerNetWorthWithSelling)}
                  </span>
                  <span className="text-right text-muted-foreground">—</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">
                    If buyer had invested instead
                  </span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(finalYear.renterNetWorth)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Net Proceeds at Sale */}
          <AccordionItem value="net-proceeds">
            <AccordionTrigger>
              <div className="grid w-full grid-cols-3 gap-4 pr-4">
                <span className="text-left">Net Proceeds at Sale</span>
                <span className="text-right font-normal">
                  {formatCurrencyDecimal(finalYear.renterNetWorth)}
                </span>
                <span className="text-right font-normal">
                  {formatCurrencyDecimal(housingProjection.exitPosition.netProceeds)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Portfolio / Home Value</span>
                  <span className="text-right">
                    {formatCurrencyDecimal(finalYear.renterNetWorth)}
                  </span>
                  <span className="text-right">
                    {formatCurrencyDecimal(housingProjection.exitPosition.homeValue)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Remaining Mortgage</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right text-red-500">
                    -{formatCurrencyDecimal(housingProjection.exitPosition.remainingMortgage)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-muted-foreground">Selling Costs</span>
                  <span className="text-right text-muted-foreground">—</span>
                  <span className="text-right text-red-500">
                    -{formatCurrencyDecimal(housingProjection.exitPosition.sellingCosts)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
