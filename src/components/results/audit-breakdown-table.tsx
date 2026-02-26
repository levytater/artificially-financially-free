'use client'

import Decimal from 'decimal.js'
import type { ComparisonResult } from '@/types/investment'
import { formatCurrencyDecimal } from '@/lib/formatting'
import { cn } from '@/lib/utils'

interface AuditBreakdownTableProps {
  results: ComparisonResult
}

/**
 * Year-by-year audit breakdown showing all calculation details.
 *
 * Displays three focused tables:
 * 1. Home Equity Growth - tracks property value, mortgage balance, equity
 * 2. Cost Comparison - compares buyer vs renter annual and cumulative costs
 * 3. Net Worth Progression - shows portfolio vs equity over time
 *
 * This is the "show your work" feature that builds trust with advanced users.
 */
export function AuditBreakdownTable({ results }: AuditBreakdownTableProps) {
  const { housingProjection, portfolio, yearlyComparison } = results

  // Build Year 0 row for initial position
  const purchasePrice = housingProjection.upfrontCosts.downPayment.plus(
    housingProjection.yearlyProjection[0]?.remainingBalance ?? 0
  )

  return (
    <div className="space-y-8">
      {/* Section 1: Home Equity Growth */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Home Equity Growth</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Home Value</th>
                <th className="px-4 py-3 text-right">Mortgage Balance</th>
                <th className="px-4 py-3 text-right">Home Equity</th>
                <th className="px-4 py-3 text-right">Annual Appreciation</th>
              </tr>
            </thead>
            <tbody>
              {/* Year 0 - Initial Position */}
              <tr className="border-t transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">0</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(purchasePrice)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(
                    housingProjection.yearlyProjection[0]?.remainingBalance ??
                      new Decimal(0)
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(
                    housingProjection.upfrontCosts.downPayment
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  —
                </td>
              </tr>

              {/* Yearly rows */}
              {housingProjection.yearlyProjection.map((yearData, i) => {
                const prevHomeValue =
                  i === 0
                    ? purchasePrice
                    : housingProjection.yearlyProjection[i - 1].homeValue
                const annualAppreciation = yearData.homeValue.minus(prevHomeValue)

                return (
                  <tr
                    key={yearData.year}
                    className={cn(
                      'border-t transition-colors hover:bg-muted/30',
                      i % 2 === 1 && 'bg-muted/10'
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{yearData.year}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(yearData.homeValue)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(yearData.remainingBalance)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(yearData.homeEquity)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(annualAppreciation)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Cost Comparison */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Cost Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Buyer Annual Cost</th>
                <th className="px-4 py-3 text-right">Annual Rent</th>
                <th className="px-4 py-3 text-right">Monthly Savings</th>
                <th className="px-4 py-3 text-right">
                  Cumulative Buyer Cost
                </th>
                <th className="px-4 py-3 text-right">Cumulative Rent</th>
              </tr>
            </thead>
            <tbody>
              {/* Year 0 - Initial Position */}
              <tr className="border-t transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">0</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(
                    housingProjection.upfrontCosts.totalCashRequired
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  —
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  —
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(
                    housingProjection.upfrontCosts.totalCashRequired
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">$0</td>
              </tr>

              {/* Yearly rows */}
              {yearlyComparison.map((yearData, i) => {
                const housingYear = housingProjection.yearlyProjection[i]

                // Calculate cumulative rent
                let renterCumulativeRent = new Decimal(0)
                for (let j = 0; j <= i; j++) {
                  renterCumulativeRent = renterCumulativeRent.plus(
                    yearlyComparison[j].annualRent
                  )
                }

                return (
                  <tr
                    key={yearData.year}
                    className={cn(
                      'border-t transition-colors hover:bg-muted/30',
                      i % 2 === 1 && 'bg-muted/10'
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{yearData.year}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(housingYear.totalAnnualCost)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(yearData.annualRent)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(yearData.monthlySavings)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(housingYear.cumulativeCost)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(renterCumulativeRent)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Net Worth Progression */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Net Worth Progression</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Renter Portfolio</th>
                <th className="px-4 py-3 text-right">
                  Buyer Equity (net of selling)
                </th>
                <th className="px-4 py-3 text-right">Difference</th>
              </tr>
            </thead>
            <tbody>
              {/* Year 0 - Initial Position */}
              <tr className="border-t transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">0</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(
                    housingProjection.upfrontCosts.totalCashRequired
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">$0</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyDecimal(
                    housingProjection.upfrontCosts.totalCashRequired
                  )}
                </td>
              </tr>

              {/* Yearly rows */}
              {yearlyComparison.map((yearData, i) => {
                const portfolioYear = portfolio[i]
                const difference = yearData.renterNetWorth.minus(
                  yearData.buyerNetWorthWithSelling
                )
                const isRenterAhead = difference.greaterThan(0)

                return (
                  <tr
                    key={yearData.year}
                    className={cn(
                      'border-t transition-colors hover:bg-muted/30',
                      i % 2 === 1 && 'bg-muted/10'
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{yearData.year}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(portfolioYear.endBalance)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrencyDecimal(yearData.buyerNetWorthWithSelling)}
                    </td>
                    <td
                      className={cn(
                        'px-4 py-3 text-right font-medium tabular-nums',
                        isRenterAhead
                          ? 'text-green-400'
                          : difference.isZero()
                            ? 'text-muted-foreground'
                            : 'text-red-400'
                      )}
                    >
                      {formatCurrencyDecimal(difference)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
