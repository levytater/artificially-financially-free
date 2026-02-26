'use client'

import { useRef, useState, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportPdfButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>
}

export function ExportPdfButton({ contentRef }: ExportPdfButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const promiseResolveRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current()
    }
  }, [isPrinting])

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Rent-vs-Buy-Analysis-${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => {
      return new Promise<void>((resolve) => {
        promiseResolveRef.current = resolve
        setIsPrinting(true)
      })
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null
      setIsPrinting(false)
    },
  })

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      size="sm"
      className="no-print gap-2"
    >
      <Printer className="h-4 w-4" />
      Export PDF
    </Button>
  )
}
