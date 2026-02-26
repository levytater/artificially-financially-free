import { AppSidebar } from '@/components/layout/app-sidebar'
import { MainContent } from '@/components/layout/main-content'
import { WizardModal } from '@/components/input-panel/wizard-modal'
import { ThemeToggle } from '@/components/results/theme-toggle'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <WizardModal />

      {/* Brand header bar — sticky so sidebar can anchor below it */}
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-bold tracking-tight text-primary">
            Artificially Financially Free
          </h1>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Canadian Rent vs Buy Calculator
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        <AppSidebar />
        <MainContent />
      </div>
    </div>
  )
}
