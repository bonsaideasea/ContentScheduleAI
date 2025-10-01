"use client"

import { useState } from "react"

interface PublishedPost {
  id: number
  platform: string
  content: string
  time: string
  status: string
  url: string
  profileName?: string
  profilePic?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

interface PublishedSectionProps {
  publishedPosts: PublishedPost[]
  onViewPost: (url: string) => void
  onRetryPost: (id: number) => void
  onDeletePost: (id: number) => void
}

/**
 * Published section component for viewing published posts
 * Displays a list of published posts with filtering, searching, and management options
 */
export default function PublishedSection({ 
  publishedPosts, 
  onViewPost, 
  onRetryPost, 
  onDeletePost 
}: PublishedSectionProps) {
  const [showPublishedPlatformDropdown, setShowPublishedPlatformDropdown] = useState(false)
  const [publishedPlatformFilter, setPublishedPlatformFilter] = useState("all")
  const [publishedDateFilter, setPublishedDateFilter] = useState("newest")
  const [publishedSearchTerm, setPublishedSearchTerm] = useState("")

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
    { value: "tiktok", label: "TikTok", icon: "/tiktok.png" },
    { value: "pinterest", label: "Pinterest", icon: "/pinterest.svg" }
  ]

  // Filter and sort posts
  const filterAndSortPosts = (posts: PublishedPost[], searchTerm: string, dateFilter: string, platformFilter: string) => {
    let filtered = posts.filter(post => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.platform.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Platform filter
      const matchesPlatform = platformFilter === "all" || 
        post.platform.toLowerCase() === platformFilter
      
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

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    const iconMap: Record<string, string> = {
      'Twitter': '/x.png',
      'Instagram': '/instagram.png',
      'LinkedIn': '/link.svg',
      'Facebook': '/fb.svg',
      'Threads': '/threads.png',
      'Bluesky': '/bluesky.png',
      'YouTube': '/ytube.png',
      'TikTok': '/tiktok.png',
      'Pinterest': '/pinterest.svg'
    }
    
    return iconMap[platform] || '/placeholder.svg'
  }

  // Check if platform icon needs inversion
  const needsInversion = (platform: string) => {
    return ['Twitter', 'Threads', 'TikTok'].includes(platform)
  }

  // Mock accounts – align layout with failed posts list
  const getAccountsForPlatform = (platform: string) => {
    const mockAccounts = {
      'Twitter': [{ username: '@whatevername', profilePic: '/shego.jpg' }],
      'Instagram': [{ username: '@instagram_user', profilePic: '/shego.jpg' }],
      'LinkedIn': [{ username: 'John Doe', profilePic: '/shego.jpg' }],
      'Facebook': [{ username: 'Unknown Account', profilePic: '/shego.jpg' }],
      'Threads': [{ username: '@threads_user', profilePic: '/shego.jpg' }],
      'Bluesky': [{ username: '@bluesky_user', profilePic: '/shego.jpg' }],
      'YouTube': [{ username: 'Unknown Account', profilePic: '/shego.jpg' }],
      'TikTok': [{ username: '@tiktok_user', profilePic: '/shego.jpg' }],
      'Pinterest': [{ username: 'Unknown Account', profilePic: '/shego.jpg' }]
    }
    return (mockAccounts as any)[platform] || [{ username: 'Unknown Account', profilePic: '/shego.jpg' }]
  }

  // Compute fixed width for right column username so rows align
  const getMaxProfileWidth = (posts: PublishedPost[]) => {
    const maxLength = Math.max(
      ...posts.map(p => (getAccountsForPlatform(p.platform)[0]?.username?.length || 0))
    )
    return Math.min(Math.max(maxLength * 8, 120), 200)
  }

  const filteredPosts = filterAndSortPosts(publishedPosts, publishedSearchTerm, publishedDateFilter, publishedPlatformFilter)

  return (
    <div className="w-full max-w-none mx-4 mt-4 overflow-hidden h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Bài đã đăng</h2>
      
      {/* Filter and Search Controls */}
      <div className="flex gap-4 mb-6">
        {/* Filter by Platform */}
        <div className="relative">
          <button 
            onClick={() => setShowPublishedPlatformDropdown(!showPublishedPlatformDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors"
          >
            <span>Lọc theo nền tảng</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showPublishedPlatformDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg z-50">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setPublishedPlatformFilter(option.value)
                    setShowPublishedPlatformDropdown(false)
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
            value={publishedDateFilter}
            onChange={(e) => setPublishedDateFilter(e.target.value)}
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
              value={publishedSearchTerm}
              onChange={(e) => setPublishedSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-[#E33265] transition-colors"
            />
          </div>
        </div>
      </div>
      
      {/* Published Posts List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="space-y-[1px]">
          {(() => {
            const maxWidth = getMaxProfileWidth(filteredPosts)
            return filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="group rounded-xl hover:bg-[#E33265]/70 transition-colors cursor-pointer"
                onClick={() => onViewPost(post.url)}
              >
                <div className="flex items-center px-4 py-3 w-full">
                  {/* Left: platform icon + content */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={getPlatformIcon(post.platform)} 
                      alt={post.platform} 
                      className={`w-[27px] h-[27px] flex-shrink-0 ${
                        needsInversion(post.platform) ? 'filter brightness-0 invert' : ''
                      }`} 
                    />
                    <div className="text-white/90 truncate flex-1 min-w-0 max-w-[1050px]">{post.content}</div>
                  </div>
                  {/* Right: profile info and date */}
                  <div className="flex flex-col items-start text-white/80 flex-shrink-0 ml-4" style={{ width: `${maxWidth}px` }}>
                    <div className="flex items-center gap-2 mb-1 w-full">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        <img src={getAccountsForPlatform(post.platform)[0]?.profilePic || '/shego.jpg'} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs whitespace-nowrap" style={{ fontWeight: '600', fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                        {getAccountsForPlatform(post.platform)[0]?.username || 'Unknown Account'}
                      </span>
                    </div>
                    <span className="text-xs whitespace-nowrap w-full">
                      {new Date(post.time).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      <span className="opacity-70" style={{ marginLeft: '5px' }}>
                        {new Date(post.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          })()}
        </div>
      </div>
    </div>
  )
}
