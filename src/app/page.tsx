import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Artificially Financially Free
      </h1>
      <p className="text-lg text-muted-foreground">Rent vs Buy Calculator</p>
      <Button size="lg">Coming Soon</Button>
    </div>
  )
}
