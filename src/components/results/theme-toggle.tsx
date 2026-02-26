'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Theme toggle button for switching between light and dark modes.
 *
 * Uses sun/moon icon rotation pattern with mounted check to avoid
 * hydration mismatch.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="gap-2 hover:bg-accent"
    >
      {/* Show moon icon in light mode (click to go dark) */}
      <Moon className="h-4 w-4 rotate-90 scale-0 transition-all light:rotate-0 light:scale-100" />
      {/* Show sun icon in dark mode (click to go light) */}
      <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all light:-rotate-90 light:scale-0" />
      <span className="text-sm font-medium">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </Button>
  )
}
