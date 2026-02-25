'use client'

import { PlaceholderBlock } from './placeholder-block'

/**
 * Sidebar container for the calculator input panel.
 *
 * Desktop: Fixed width on the left side (320px).
 * Mobile: Full width, stacks above the main content area.
 */
export function AppSidebar() {
  return (
    <aside className="w-full shrink-0 bg-sidebar p-6 lg:w-80 lg:min-h-[calc(100vh-64px)]">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
        Calculator Inputs
      </h2>
      <PlaceholderBlock
        label="Input Panel"
        minHeight="400px"
        className="border-sidebar-border"
      />
    </aside>
  )
}
