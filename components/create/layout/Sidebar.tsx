"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isSidebarOpen: boolean
  onSidebarToggle: (isOpen: boolean) => void
  language?: 'vi' | 'en'
  onLanguageChange?: (lang: 'vi' | 'en') => void
}

/**
 * Main sidebar navigation component for the create page
 * Handles navigation between different sections and sidebar expand/collapse
 */
export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isSidebarOpen, 
  onSidebarToggle,
  language = 'vi',
  onLanguageChange
}: SidebarProps) {
  // Navigation items configuration
  const navigationItems = [
    {
      id: "create",
      label: "Tạo bài viết",
      icon: "/Create.svg",
      url: "/create"
    },
    {
      id: "calendar", 
      label: "Lịch",
      icon: "/Calendar.svg",
      url: "/lich"
    },
    {
      id: "drafts",
      label: "Bản nháp", 
      icon: "/Draft.svg",
      url: "/ban-nhap"
    },
    {
      id: "published",
      label: "Bài đã đăng",
      icon: "/Published.svg", 
      url: "/bai-da-dang"
    },
    {
      id: "failed",
      label: "Bài đăng thất bại",
      icon: "/Failed.svg",
      url: "/bai-loi"
    },
    {
      id: "videos",
      label: "Videos",
      icon: "/Video.svg",
      url: "/videos"
    },
    {
      id: "api",
      label: "API Dashboard", 
      icon: "/API.svg",
      url: "/api-dashboard"
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: "/Settings.svg",
      url: "/settings"
    }
  ]

  return (
    <div 
      className={`${isSidebarOpen ? 'w-64' : 'w-[79px]'} transition-[width] duration-150 ease-out border-r border-white/10 p-4 pt-[30px] bg-[#1E1E23] absolute inset-y-0 left-0 z-20`}
      onMouseEnter={() => onSidebarToggle(true)}
      onMouseLeave={() => onSidebarToggle(false)}
    >
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "secondary" : "ghost"}
            className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
              activeSection === item.id ? "bg-purple-500/20 border-purple-500/30" : ""
            }`}
            onClick={() => { 
              onSectionChange(item.id)
              window.history.pushState(null, "", item.url) 
            }}
          >
            {isSidebarOpen ? (
              <div className="mr-2">
                <img 
                  src={item.icon} 
                  alt={item.label} 
                  className="w-6 h-6 flex-none" 
                  style={{ width: 24, height: 24 }} 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center px-2">
                <img 
                  src={item.icon} 
                  alt={item.label} 
                  className="w-6 h-6 flex-none" 
                  style={{ width: 24, height: 24 }} 
                />
              </div>
            )}
            {isSidebarOpen && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Language toggle at bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex items-center gap-3">
          <img src="/Language.svg" alt="Language" className={`w-5 h-5 ${isSidebarOpen ? '' : 'mx-auto'}`} />
          {isSidebarOpen && (
            <div className="flex bg-[#2A2A30] rounded-full p-1 border border-white/10">
              <button
                className={`px-3 py-1 rounded-full text-xs ${language === 'vi' ? 'bg-purple-600 text-white' : 'text-white/80'}`}
                onClick={() => onLanguageChange && onLanguageChange('vi')}
              >
                VI
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs ${language === 'en' ? 'bg-purple-600 text-white' : 'text-white/80'}`}
                onClick={() => onLanguageChange && onLanguageChange('en')}
              >
                EN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
