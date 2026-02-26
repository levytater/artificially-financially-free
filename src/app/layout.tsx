import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from '@/components/theme-provider'
import { CalculatorProvider } from '@/providers/calculator-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator | Artificially Financially Free',
  description:
    'See exactly how renting and investing compares to buying in Canada',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <NuqsAdapter>
            <CalculatorProvider>
              <TooltipProvider delayDuration={200}>
                {children}
              </TooltipProvider>
            </CalculatorProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
