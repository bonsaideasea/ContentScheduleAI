"use client"

import { ReactNode } from "react"
import Sidebar from "./Sidebar"

interface CreateLayoutProps {
  children: ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
  isSidebarOpen: boolean
  onSidebarToggle: (isOpen: boolean) => void
  language?: 'vi' | 'en'
  onLanguageChange?: (lang: 'vi' | 'en') => void
}

/**
 * Main layout wrapper for the create page
 * Combines sidebar and main content with consistent styling
 */
export default function CreateLayout({ 
  children, 
  activeSection, 
  onSectionChange, 
  isSidebarOpen, 
  onSidebarToggle,
  language = 'vi',
  onLanguageChange
}: CreateLayoutProps) {
  return (
    <div className="h-screen bg-[#1E1E23] text-white">
      <div className="relative flex h-screen">
        {/* Sidebar spacer keeps content fixed; actual sidebar overlays within */}
        <div className="relative flex-none w-[79px] h-full">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={onSidebarToggle}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>
        
        {/* Main content */}
        {children}
      </div>
    </div>
  )
}

