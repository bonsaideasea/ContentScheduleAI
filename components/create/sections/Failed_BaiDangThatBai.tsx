"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FailedPost {
  id: number
  platform: string
  content: string
  date: string
  time: string
  error?: string
  profileName?: string
  profilePic?: string
  url?: string
}

interface FailedSectionProps {
  failedPosts: FailedPost[]
  onRetryPost: (id: number) => void
  onDeletePost: (id: number) => void
  onViewPost: (url: string) => void
}

/**
 * Failed section component for managing failed posts
 * Displays a list of failed posts with retry and management options
 */
export default function FailedSection({ 
  failedPosts, 
  onRetryPost, 
  onDeletePost, 
  onViewPost 
}: FailedSectionProps) {
  // Modal state to show reason and confirm retry
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedFailedPost, setSelectedFailedPost] = useState<FailedPost | null>(null)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Filters and search state
  const [showFailedPlatformDropdown, setShowFailedPlatformDropdown] = useState(false)
  const [failedPlatformFilter, setFailedPlatformFilter] = useState("all")
  const [failedDateFilter, setFailedDateFilter] = useState("newest")
  const [failedSearchTerm, setFailedSearchTerm] = useState("")
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

  // Get accounts for platform (mock data)
  const getAccountsForPlatform = (platform: string) => {
    const mockAccounts = {
      'Twitter': [{ username: '@whatevername', profilePic: '/shego.jpg' }],
      'Instagram': [{ username: '@instagram_user', profilePic: '/shego.jpg' }],
      'LinkedIn': [{ username: 'LinkedIn User', profilePic: '/shego.jpg' }],
      'Facebook': [{ username: 'Facebook User', profilePic: '/shego.jpg' }],
      'Threads': [{ username: '@threads_user', profilePic: '/shego.jpg' }],
      'Bluesky': [{ username: '@bluesky_user', profilePic: '/shego.jpg' }],
      'YouTube': [{ username: 'YouTube Channel', profilePic: '/shego.jpg' }],
      'TikTok': [{ username: '@tiktok_user', profilePic: '/shego.jpg' }],
      'Pinterest': [{ username: 'Pinterest User', profilePic: '/shego.jpg' }]
    }
    
    return mockAccounts[platform as keyof typeof mockAccounts] || [{ username: 'Unknown Account', profilePic: '/shego.jpg' }]
  }

  // Calculate max profile width for consistent layout
  const getMaxProfileWidth = (posts: FailedPost[]) => {
    const maxLength = Math.max(...posts.map(post => 
      getAccountsForPlatform(post.platform)[0]?.username?.length || 0
    ))
    return Math.min(Math.max(maxLength * 8, 120), 200)
  }

  const maxWidth = getMaxProfileWidth(failedPosts)

  // Derive human-readable failure reason (VN)
  const getFailureReason = (post: FailedPost) => {
    const platform = (post.platform || '').toLowerCase()
    const contentLength = (post.content || '').length
    const characterLimits: Record<string, number> = {
      twitter: 280,
      facebook: 2200,
      instagram: 2200,
      linkedin: 3000,
      threads: 500,
      tiktok: 2200,
      bluesky: 300,
      youtube: 5000,
      pinterest: 500
    }
    const limit = characterLimits[platform] ?? 2200
    const err = (post.error || '').toLowerCase()

    if (contentLength > limit || err.includes('character') || err.includes('limit')) {
      return {
        type: 'character_limit',
        message: `Vượt giới hạn ký tự. Vui lòng rút gọn còn ${limit} ký tự.`,
        currentLength: contentLength,
        limit
      }
    }
    if (err.includes('network') || err.includes('timeout') || err.includes('connection')) {
      return { type: 'connection', message: 'Kết nối kém. Vui lòng thử lại.', currentLength: contentLength, limit }
    }
    if (err.includes('authentication') || err.includes('auth')) {
      return { type: 'authentication', message: 'Lỗi xác thực. Hãy kiểm tra cài đặt tài khoản.', currentLength: contentLength, limit }
    }
    if (err.includes('policy') || err.includes('violation')) {
      return { type: 'policy', message: 'Nội dung vi phạm chính sách. Vui lòng chỉnh sửa.', currentLength: contentLength, limit }
    }
    return { type: 'other', message: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.', currentLength: contentLength, limit }
  }

  const openReason = (post: FailedPost) => {
    setSelectedFailedPost(post)
    setShowReasonModal(true)
  }

  const closeReason = () => {
    setShowReasonModal(false)
    setSelectedFailedPost(null)
  }

  // Platform options for filters
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

  // Filter and sort failed posts
  const filterAndSortFailed = (
    posts: FailedPost[], searchTerm: string, dateFilter: string, platformFilter: string
  ) => {
    let filtered = posts.filter((post) => {
      const matchesSearch =
        searchTerm === "" ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.platform.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlatform =
        platformFilter === "all" || post.platform.toLowerCase() === platformFilter
      return matchesSearch && matchesPlatform
    })

    filtered.sort((a, b) => {
      const aDate = new Date(`${a.date} ${a.time}`).getTime()
      const bDate = new Date(`${b.date} ${b.time}`).getTime()
      return dateFilter === "newest" ? bDate - aDate : aDate - bDate
    })

    return filtered
  }

  const filteredFailed = filterAndSortFailed(
    failedPosts, failedSearchTerm, failedDateFilter, failedPlatformFilter
  )

  return (
    <>
    <div className="w-full max-w-none mx-4 mt-4 overflow-hidden h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Bài đăng thất bại</h2>

      {/* Filter and Search Controls */}
      <div className="flex gap-4 mb-6">
        {/* Filter by Platform */}
        <div className="relative">
          <button 
            onClick={() => setShowFailedPlatformDropdown(!showFailedPlatformDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors"
          >
            <span>Lọc theo nền tảng</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showFailedPlatformDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg z-50">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setFailedPlatformFilter(option.value); setShowFailedPlatformDropdown(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.icon && (
                    <img src={option.icon} alt={option.label} className={`w-5 h-5 ${['Twitter','Threads','TikTok'].includes(option.label.split(' ')[0]) ? 'filter brightness-0 invert' : ''}`} />
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
            value={failedDateFilter}
            onChange={(e) => setFailedDateFilter(e.target.value)}
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
              value={failedSearchTerm}
              onChange={(e) => setFailedSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-[#E33265] transition-colors"
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="space-y-[1px] pb-0">
          {filteredFailed.map((post) => (
            <div 
              key={post.id} 
              className="group rounded-xl hover:bg-[#E33265]/70 transition-colors cursor-pointer"
              onClick={() => openReason(post)}
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
                  <div className="text-white/90 truncate flex-1 min-w-0 max-w-[1050px]">
                    {post.content}
                  </div>
                </div>
                
                {/* Right: profile info and date */}
                <div className="flex flex-col items-start text-white/80 flex-shrink-0 ml-4" style={{ width: `${maxWidth}px` }}>
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={getAccountsForPlatform(post.platform)[0]?.profilePic || "/shego.jpg"} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ 
                      fontFamily: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.9)'
                    }}>
                      {getAccountsForPlatform(post.platform)[0]?.username || "Unknown Account"}
                    </span>
                  </div>
                  <span className="text-xs whitespace-nowrap w-full">
                    {post.date} 
                    <span className="opacity-70" style={{ marginLeft: '5px' }}>
                      {post.time}
                    </span>
                  </span>
                  
                  {/* Remove inline error preview per UX request */}
                </div>
                
                {/* No action buttons for failed posts as requested */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Reason modal */}
    {showReasonModal && selectedFailedPost && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) closeReason() }}>
        <div className="bg-[#1E1E23] border border-white/10 rounded-2xl w-[450px] max-w-[95vw] shadow-xl">
          <div className="px-6 pt-6 pb-4 text-center border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Thử lại?</h3>
          </div>
          <div className="px-6 py-5">
            {(() => {
              const r = getFailureReason(selectedFailedPost!)
              return (
                <div className="bg-[#7E1C39]/30 border border-[#E33265]/40 rounded-xl p-5 text-left">
                  <div className="text-[#FF8CA8] font-semibold mb-2">Lý do thất bại:</div>
                  <div className="text-white text-base leading-6 mb-3">{r.message}</div>
                  <div className="text-white/70 mb-3">Hiện tại: {r.currentLength} ký tự / {r.limit} ký tự</div>
                  {(r.type === 'character_limit' || r.type === 'policy') && (
                    <div className="text-blue-300">🖉 Sẽ mở trong tab chỉnh sửa để bạn có thể sửa nội dung</div>
                  )}
                </div>
              )
            })()}
          </div>
          <div className="px-6 pb-6 flex items-center justify-center gap-6">
            <button className="w-32 px-6 py-3 rounded-lg bg-white/15 text-white hover:bg-white/20" onClick={closeReason}>Không</button>
            <button
              className="w-32 px-6 py-3 rounded-lg bg-[#E33265] text-white hover:bg-[#c52b57]"
              onClick={() => {
                const reason = getFailureReason(selectedFailedPost!)
                // Content issue => open editor directly via onRetryPost (handled in hook)
                if (reason.type === 'character_limit' || reason.type === 'policy') {
                  onRetryPost(selectedFailedPost!.id)
                  closeReason()
                  return
                }
                // Connection/other => show loading then success, then call retry to move to published
                setShowLoadingModal(true)
                closeReason()
                setTimeout(() => {
                  setShowLoadingModal(false)
                  onRetryPost(selectedFailedPost!.id)
                  setShowSuccessModal(true)
                }, 1500)
              }}
            >
              Có
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Loading modal for retry */}
    {showLoadingModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1E1E23] border border-white/10 rounded-2xl w-[420px] max-w-[95vw] shadow-xl text-center p-10">
          <div className="mx-auto mb-4 w-10 h-10 rounded-full border-4 border-[#E33265]/40 border-t-[#E33265] animate-spin" />
          <div className="text-2xl font-bold text-white mb-2">Đang thử lại...</div>
          <div className="text-white/70">Vui lòng chờ trong giây lát</div>
        </div>
      </div>
    )}

    {/* Success modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowSuccessModal(false) }}>
        <div className="bg-[#1E1E23] border border-white/10 rounded-2xl w-[420px] max-w-[95vw] shadow-xl text-center p-8">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-green-900/60 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">Published!</div>
          <div className="text-white/70 mb-6">Bài viết đã được đăng thành công!</div>
          <button className="px-8 py-3 rounded-lg bg-[#E33265] text-white hover:bg-[#c52b57]" onClick={() => setShowSuccessModal(false)}>Đóng</button>
        </div>
      </div>
    )}
    </>
  )
}
