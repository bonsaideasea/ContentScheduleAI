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
  // Navigation items organized by categories
  const navigationCategories = [
    {
      title: "MENU",
      items: [
        {
          id: "create",
          label: "Tạo bài viết",
          icon: "/Create.svg",
          url: "/create"
        },
        {
          id: "videos",
          label: "Sinh Video",
          icon: "/Video.svg",
          url: "/videos"
        },
        {
          id: "calendar", 
          label: "Lịch",
          icon: "/Calendar.svg",
          url: "/lich"
        }
      ]
    },
    {
      title: "QUẢN LÝ",
      items: [
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
        }
      ]
    },
    {
      title: "TÀI KHOẢN",
      items: [
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
    }
  ]

  return (
    <div 
      className={`${isSidebarOpen ? 'w-55' : 'w-[80px]'} transition-[width] duration-150 ease-out border-r border-white/10 p-4 pt-[30px] bg-[#1A0F30] absolute inset-y-0 left-0 z-20`}
      onMouseEnter={() => onSidebarToggle(true)}
      onMouseLeave={() => onSidebarToggle(false)}
    >
      <nav className="space-y-6">
        {navigationCategories.map((category, categoryIndex) => (
          <div key={category.title} className="space-y-2">
            {/* Category Header */}
            {isSidebarOpen ? (
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  {category.title}
                </h3>
              </div>
            ) : (
              /* White divider when sidebar is closed - skip for first category (MENU) */
              categoryIndex > 0 && <div className="w-full h-px bg-white/20"></div>
            )}
            
            {/* Category Items */}
            <div className={`space-y-1 ${category.title === 'QUẢN LÝ' ? 'pt-4' : ''} ${category.title === 'TÀI KHOẢN' ? 'pt-4' : ''}`}>
              {category.items.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] border ${
                    activeSection === item.id
                      ? "bg-[#9C5E79]/80 border-[#9C5E79]/80"
                      : "border-transparent hover:bg-transparent hover:border-[#9C5E79]/80 hover:border-[1.5px] focus:bg-transparent"
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
            </div>
          </div>
        ))}
      </nav>

      {/* Language toggle at bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex items-center gap-3">
          <img src="/Language.svg" alt="Language" className={`w-6 h-6 ${isSidebarOpen ? '' : 'mx-auto'}`} />
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
