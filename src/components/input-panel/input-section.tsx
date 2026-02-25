'use client'

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export interface InputSectionProps {
  /** Accordion item value (must be unique) */
  value: string
  /** Section title displayed in the trigger */
  title: string
  /** Input components to render inside the section */
  children: React.ReactNode
}

/**
 * Collapsible accordion section for organizing calculator inputs.
 * Wraps shadcn/ui AccordionItem with trigger + content.
 * Parent Accordion component lives in InputSidebar.
 */
export function InputSection({ value, title, children }: InputSectionProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-base font-semibold">
        {title}
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
