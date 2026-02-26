'use client'

import { useMemo } from 'react'
import type { ComparisonResult } from '@/types/investment'
import { formatCurrencyDecimal } from '@/lib/formatting'
import { Card, CardContent } from '@/components/ui/card'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { tooltips } from '@/content/tooltips'
import Decimal from 'decimal.js'

interface SummaryCardsProps {
  results: ComparisonResult
}

/**
 * Displays 2x2 grid of summary metric cards.
 *
 * Shows final net worth for renter and buyer, dollar advantage, and
 * percentage advantage. Dollar advantage card is visually emphasized.
 */
export function SummaryCards({ results }: SummaryCardsProps) {
  const metrics = useMemo(() => {
    const finalYear = results.yearlyComparison[results.yearlyComparison.length - 1]
    const renterFinal = finalYear.renterNetWorth
    const buyerFinal = finalYear.buyerNetWorthWithSelling

    const advantage = renterFinal.greaterThan(buyerFinal)
      ? renterFinal.minus(buyerFinal)
      : buyerFinal.minus(renterFinal)

    const largerValue = Decimal.max(renterFinal, buyerFinal)
    const percentAdvantage = largerValue.isZero()
      ? new Decimal(0)
      : advantage.dividedBy(largerValue).times(100)

    const winner = renterFinal.greaterThan(buyerFinal)
      ? 'Renter Ahead'
      : buyerFinal.greaterThan(renterFinal)
        ? 'Buyer Ahead'
        : 'Tie'

    return {
      renterFinal,
      buyerFinal,
      advantage,
      percentAdvantage,
      winner,
    }
  }, [results])

  // Use compact format for values over $100K
  const shouldUseCompact = (value: Decimal) => value.greaterThan(100000)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Renter Final Net Worth */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-1.5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Renter Net Worth
            </p>
            <InfoTooltip content={tooltips.renterNetWorth.description} />
          </div>
          <p className="mt-2 text-xl font-bold">
            {formatCurrencyDecimal(metrics.renterFinal, shouldUseCompact(metrics.renterFinal))}
          </p>
        </CardContent>
      </Card>

      {/* Buyer Final Net Worth */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-1.5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Buyer Net Worth
            </p>
            <InfoTooltip content={tooltips.buyerNetWorth.description} />
          </div>
          <p className="mt-2 text-xl font-bold">
            {formatCurrencyDecimal(metrics.buyerFinal, shouldUseCompact(metrics.buyerFinal))}
          </p>
        </CardContent>
      </Card>

      {/* Dollar Advantage (Emphasized) */}
      <Card className="border-2 border-primary bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-1.5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Dollar Advantage
            </p>
            <InfoTooltip content={tooltips.dollarAdvantage.description} />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {formatCurrencyDecimal(metrics.advantage, shouldUseCompact(metrics.advantage))}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{metrics.winner}</p>
        </CardContent>
      </Card>

      {/* Percentage Advantage */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-1.5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Percentage Advantage
            </p>
            <InfoTooltip content={tooltips.percentageAdvantage.description} />
          </div>
          <p className="mt-2 text-xl font-bold">
            {metrics.percentAdvantage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
