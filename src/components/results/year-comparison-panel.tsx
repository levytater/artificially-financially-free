'use client'

import { useState, useDeferredValue } from 'react'
import type { ComparisonResult } from '@/types/investment'
import { formatCurrencyDecimal } from '@/lib/formatting'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface YearComparisonPanelProps {
  results: ComparisonResult
}

/**
 * Year-by-year comparison panel with slider and preset buttons.
 *
 * Shows net worth, annual costs, and cumulative position for the selected year.
 * Includes break-even and mortgage-paid-off preset buttons.
 */
export function YearComparisonPanel({ results }: YearComparisonPanelProps) {
  const maxYear = results.yearlyComparison.length
  const [selectedYear, setSelectedYear] = useState(1)
  const deferredYear = useDeferredValue(selectedYear)

  // Get data for the deferred year (0-indexed array, 1-indexed slider)
  const yearData = results.yearlyComparison[deferredYear - 1]
  const housingData = results.housingProjection.yearlyProjection[deferredYear - 1]

  // Calculate net worth difference
  const renterNetWorth = yearData.renterNetWorth
  const buyerNetWorth = yearData.buyerNetWorthWithSelling
  const netWorthDiff = renterNetWorth.minus(buyerNetWorth)
  const renterAhead = netWorthDiff.greaterThan(0)

  // Determine break-even button state
  const breakEvenYear =
    results.breakEvenWithSelling === 'never'
      ? null
      : results.breakEvenWithSelling

  // Mortgage paid off year (capped to time horizon)
  const mortgagePaidOffYear = Math.min(
    results.housingProjection.yearlyProjection.length,
    maxYear
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-by-Year Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => breakEvenYear && setSelectedYear(breakEvenYear)}
            disabled={!breakEvenYear}
          >
            Break-even Year
            {breakEvenYear && ` (${breakEvenYear})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedYear(mortgagePaidOffYear)}
          >
            Mortgage Paid Off (Year {mortgagePaidOffYear})
          </Button>
        </div>

        {/* Year Slider */}
        <div className="space-y-2">
          <Slider
            min={1}
            max={maxYear}
            step={1}
            value={[selectedYear]}
            onValueChange={([v]) => setSelectedYear(v)}
            className="w-full"
          />
          <p className="text-center text-sm text-muted-foreground">
            Year {selectedYear} of {maxYear}
          </p>
        </div>

        {/* Metrics Display */}
        <div className="space-y-4">
          {/* Net Worth Comparison (Primary) */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
              Net Worth Comparison
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Renter</p>
                <p className={`text-2xl font-bold ${renterAhead ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {formatCurrencyDecimal(renterNetWorth)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Buyer</p>
                <p className={`text-2xl font-bold ${!renterAhead ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {formatCurrencyDecimal(buyerNetWorth)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {renterAhead ? 'Renter' : 'Buyer'} ahead by{' '}
              {formatCurrencyDecimal(netWorthDiff.abs())}
            </p>
          </div>

          {/* Annual Costs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Renter Annual Cost
              </p>
              <p className="text-lg font-bold">
                {formatCurrencyDecimal(yearData.annualRent)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Buyer Annual Cost
              </p>
              <p className="text-lg font-bold">
                {formatCurrencyDecimal(yearData.buyerAnnualCost)}
              </p>
            </div>
          </div>

          {/* Cumulative Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Renter Portfolio
              </p>
              <p className="text-lg font-bold">
                {formatCurrencyDecimal(renterNetWorth)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Buyer Home Equity
              </p>
              <p className="text-lg font-bold">
                {formatCurrencyDecimal(housingData.homeEquity)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
