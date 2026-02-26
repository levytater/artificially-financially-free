'use client'

import { useMemo } from 'react'
import type { ComparisonResult } from '@/types/investment'
import { calculateVerdict } from '@/lib/verdict'
import { verdictText } from '@/content/verdict-text'
import { formatCurrencyDecimal } from '@/lib/formatting'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface VerdictCardProps {
  results: ComparisonResult
}

/**
 * Displays the rent-vs-buy verdict with templated reasoning text.
 *
 * Shows a clear decision (rent/buy/tie), dollar advantage, and narrative
 * explanation based on the comparison results.
 */
export function VerdictCard({ results }: VerdictCardProps) {
  const verdict = useMemo(() => calculateVerdict(results), [results])

  // Determine border color based on verdict
  const borderColor =
    verdict.decision === 'buy'
      ? 'border-t-green-500'
      : verdict.decision === 'rent'
        ? 'border-t-blue-500'
        : 'border-t-amber-500'

  // Get appropriate text template or create tie message
  let headline: string
  let summaryText: string

  if (verdict.decision === 'tie') {
    headline = 'It\'s Essentially a Tie'
    summaryText = `Over ${verdict.timeHorizon} years, renting and buying produce nearly identical outcomes — within ${verdict.percentAdvantage.toFixed(1)}% of each other. Non-financial factors (stability, flexibility, lifestyle) should guide your decision.`
  } else {
    const scenario = verdict.decision === 'rent' ? 'rent-wins' : 'buy-wins'
    const template = verdictText[scenario]

    headline = template.headline

    // Replace placeholders in summary text
    summaryText = template.summary
      .replace('{{timeHorizon}}', verdict.timeHorizon.toString())
      .replace('{{advantage}}', formatCurrencyDecimal(verdict.advantage))
      .replace('{{renterNetWorth}}', formatCurrencyDecimal(verdict.renterFinal))
      .replace('{{buyerNetWorth}}', formatCurrencyDecimal(verdict.buyerFinal))
  }

  // Break-even text
  let breakEvenText: string
  if (verdict.breakEvenYear === 'never') {
    if (verdict.decision === 'rent') {
      breakEvenText = 'Buying never catches up within your time horizon.'
    } else if (verdict.decision === 'buy') {
      breakEvenText = 'Renting never catches up within your time horizon.'
    } else {
      breakEvenText = ''
    }
  } else {
    breakEvenText = `Buying becomes the better choice starting in Year ${verdict.breakEvenYear}.`
  }

  return (
    <Card className={`border-t-4 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{headline}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{summaryText}</p>
        {breakEvenText && verdict.decision !== 'tie' && (
          <p className="text-sm text-muted-foreground">{breakEvenText}</p>
        )}
      </CardContent>
    </Card>
  )
}
