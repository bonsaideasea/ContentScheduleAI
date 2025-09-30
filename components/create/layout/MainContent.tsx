"use client"

import { ReactNode } from "react"

interface MainContentProps {
  /**
   * The currently active section key; used for conditional styles or future logic
   */
  activeSection: string
  /**
   * Child nodes to render inside the main content area
   */
  children: ReactNode
}

/**
 * MainContent
 *
 * Wrapper for the primary content area next to the sidebar. This centralizes
 * layout styling so the page can remain focused on composition. Exposes
 * `activeSection` for potential contextual UI adjustments (e.g., breadcrumbs,
 * sticky headers, etc.).
 */
export default function MainContent({ activeSection, children }: MainContentProps) {
  // NOTE: `activeSection` is currently unused visually, but is kept here to
  // make it easy to adjust the layout based on context without refactoring
  // consumers.
  void activeSection

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="h-full w-full pr-[30px]">
        {children}
      </div>
    </div>
  )
}


