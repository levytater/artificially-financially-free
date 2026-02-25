'use client'

import { InputSidebar } from '@/components/input-panel/input-sidebar'

/**
 * Sidebar container for the calculator input panel.
 *
 * Desktop: Fixed width on the left side (~350px).
 * Mobile: Full width, stacks above the main content area.
 */
export function AppSidebar() {
  return (
    <aside className="w-full shrink-0 bg-sidebar p-6 lg:w-[350px] lg:min-h-[calc(100vh-64px)]">
      <InputSidebar />
    </aside>
  )
}
