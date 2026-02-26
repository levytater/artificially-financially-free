'use client'

import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface InfoTooltipProps {
  /** Tooltip text content */
  content: string
  /** Tooltip position relative to trigger */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** Additional classes for the trigger button */
  className?: string
}

/**
 * Reusable info icon tooltip component.
 *
 * Wraps shadcn/ui Tooltip primitives with an accessible info icon trigger.
 * Used for inline help text next to labels and result values.
 */
export function InfoTooltip({ content, side = 'top', className }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors',
            className
          )}
          aria-label="More information"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} collisionPadding={8} className="max-w-xs">
        <p className="text-xs leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
