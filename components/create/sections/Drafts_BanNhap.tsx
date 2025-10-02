"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DraftPost {
  id: number
  platform: string
  platformIcon?: string
  content: string
  time: string
  status: string
  media?: string[]
}

interface DraftsSectionProps {
  draftPosts: DraftPost[]
  onEditDraft: (post: DraftPost) => void
  onDeleteDraft: (id: number) => void
  onPublishDraft: (id: number) => void
}

/**
 * Drafts section component for managing draft posts
 * Displays a list of draft posts with filtering, searching, and management options
 */
export default function DraftsSection({ 
  draftPosts, 
  onEditDraft, 
  onDeleteDraft, 
  onPublishDraft 
}: DraftsSectionProps) {
  const [showDraftPlatformDropdown, setShowDraftPlatformDropdown] = useState(false)
  const [draftPlatformFilter, setDraftPlatformFilter] = useState("all")
  const [draftDateFilter, setDraftDateFilter] = useState("newest")
  const [draftSearchTerm, setDraftSearchTerm] = useState("")

  // Platform filter options
  const platformOptions = [
    { value: "all", label: "Tất cả nền tảng", icon: null },
    { value: "twitter", label: "Twitter (X)", icon: "/x.png" },
    { value: "instagram", label: "Instagram", icon: "/instagram.png" },
    { value: "linkedin", label: "LinkedIn", icon: "/link.svg" },
    { value: "facebook", label: "Facebook", icon: "/fb.svg" },
    { value: "threads", label: "Threads", icon: "/threads.png" },
    { value: "bluesky", label: "Bluesky", icon: "/bluesky.png" },
    { value: "youtube", label: "YouTube", icon: "/ytube.png" },
    { value: "tiktok", label: "TikTok", icon: "/tiktok.png" }
  ]

  // Filter and sort posts
  const filterAndSortPosts = (posts: DraftPost[], searchTerm: string, dateFilter: string, platformFilter: string) => {
    let filtered = posts.filter(post => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.platform.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Platform filter
      const matchesPlatform = platformFilter === "all" || 
        post.platform.toLowerCase() === platformFilter ||
        post.platformIcon?.toLowerCase() === platformFilter
      
      return matchesSearch && matchesPlatform
    })

    // Date sort
    if (dateFilter === "newest") {
      filtered.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    } else {
      filtered.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    }

    return filtered
  }

  // Get platform icon (case-insensitive, supports platform or platformIcon fields)
  const getPlatformIcon = (post: DraftPost) => {
    const iconMap: Record<string, string> = {
      twitter: '/x.png',
      instagram: '/instagram.png',
      linkedin: '/link.svg',
      facebook: '/fb.svg',
      threads: '/threads.png',
      bluesky: '/bluesky.png',
      youtube: '/ytube.png',
      tiktok: '/tiktok.png',
      pinterest: '/pinterest.svg'
    }
    const key = (post.platformIcon || post.platform || '').toLowerCase()
    return iconMap[key] || '/placeholder.svg'
  }

  // Check if platform icon needs inversion
  const needsInversion = (platform: string) => {
    const p = (platform || '').toLowerCase()
    return ['twitter', 'threads', 'tiktok'].includes(p)
  }

  const filteredPosts = filterAndSortPosts(draftPosts, draftSearchTerm, draftDateFilter, draftPlatformFilter)

  return (
    <div className="w-full max-w-none mx-4 mt-4 overflow-hidden h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Bản nháp</h2>
      
      {/* Filter and Search Controls */}
      <div className="flex gap-4 mb-6">
        {/* Filter by Platform */}
        <div className="relative">
          <button
            onClick={() => setShowDraftPlatformDropdown(!showDraftPlatformDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors"
          >
            <span>Lọc theo nền tảng</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDraftPlatformDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg z-50">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setDraftPlatformFilter(option.value)
                    setShowDraftPlatformDropdown(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.icon && (
                    <img 
                      src={option.icon} 
                      alt={option.label} 
                      className={`w-5 h-5 ${needsInversion(option.label.split(' ')[0]) ? 'filter brightness-0 invert' : ''}`} 
                    />
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Filter by Date */}
        <div className="relative">
          <select
            value={draftDateFilter}
            onChange={(e) => setDraftDateFilter(e.target.value)}
            className="appearance-none flex items-center gap-2 px-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors cursor-pointer pr-8"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={draftSearchTerm}
              onChange={(e) => setDraftSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-[#E33265] transition-colors"
            />
          </div>
        </div>
      </div>
      
      {/* Draft Posts List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="space-y-[1px]">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="group rounded-xl hover:bg-[#E33265]/70 transition-colors cursor-pointer"
              onClick={() => onEditDraft(post)}
            >
              <div className="flex items-center px-4 py-3 w-full">
                {/* Left: platform icon + content */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img 
                    src={getPlatformIcon(post)} 
                    alt={post.platform} 
                    className={`w-[27px] h-[27px] flex-shrink-0 ${
                      needsInversion(post.platform) ? 'filter brightness-0 invert' : ''
                    }`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white/90 truncate flex-1 min-w-0 max-w-[1050px]">
                      {post.content}
                    </div>
                  </div>
                </div>
                
                {/* Right: date and trash */}
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <span className="text-sm text-white/80 whitespace-nowrap">{(() => {
                    try {
                      const d = new Date(post.time)
                      if (!isNaN(d.getTime())) {
                        return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
                      }
                      return String(post.time).split('T')[0] || String(post.time)
                    } catch {
                      return String(post.time)
                    }
                  })()}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10"
                    onClick={(e) => { e.stopPropagation(); onDeleteDraft(post.id) }}
                    aria-label="Xóa bản nháp"
                  >
                    <img src="/Trash.svg" alt="Delete" className="opacity-80" style={{ width: 19, height: 19 }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
