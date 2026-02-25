/**
 * Labeled placeholder box component for the shell layout.
 *
 * Renders a subtle wireframe/blueprint-style box with a centered label.
 * These placeholders will be replaced by real components in future phases.
 */

interface PlaceholderBlockProps {
  /** Label text displayed centered in the block */
  label: string
  /** Additional CSS classes */
  className?: string
  /** Minimum height of the block (default: '120px') */
  minHeight?: string
}

export function PlaceholderBlock({
  label,
  className = '',
  minHeight = '120px',
}: PlaceholderBlockProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-card/30 text-muted-foreground ${className}`}
      style={{ minHeight }}
    >
      <span className="text-sm font-medium tracking-wide uppercase opacity-60">
        {label}
      </span>
    </div>
  )
}
