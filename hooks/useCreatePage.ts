"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { saveToLocalStorage, loadFromLocalStorage } from "@/utils/localStorage"

/**
 * Main hook for managing create page state and functionality
 * Centralizes all state management and provides event handlers
 */
export function useCreatePage() {
  const searchParams = useSearchParams()
  
  // Main navigation state
  const [activeSection, setActiveSection] = useState("create")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')
  
  // Post management state
  const [openPosts, setOpenPosts] = useState<Array<{ id: number; type: string }>>([])
  const [selectedPostId, setSelectedPostId] = useState<number>(0)
  const [postContents, setPostContents] = useState<Record<number, string>>({})
  
  // Modal states
  const [showPostPicker, setShowPostPicker] = useState(false)
  const [isPostPickerVisible, setIsPostPickerVisible] = useState(false)
  const [showClonePicker, setShowClonePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSourceModal, setShowSourceModal] = useState(false)
  
  // Media state
  const [uploadedMedia, setUploadedMedia] = useState<Array<{
    id: string
    type: 'image' | 'video'
    preview: string
    file: File
  }>>([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  
  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<Record<string, Array<{
    platform: string
    time: string
    status: string
    noteType: 'green' | 'yellow' | 'red'
  }>>>({})
  
  // Posts data state
  const [draftPosts, setDraftPosts] = useState<Array<{
    id: number
    platform: string
    platformIcon?: string
    content: string
    time: string
    status: string
    media?: string[]
  }>>([])
  
  const [publishedPosts, setPublishedPosts] = useState<Array<{
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
  }>>([])
  
  const [failedPosts, setFailedPosts] = useState<Array<{
    id: number
    platform: string
    content: string
    date: string
    time: string
    error?: string
    profileName?: string
    profilePic?: string
    url?: string
  }>>([])
  // Retry UI states (for potential global popups)
  const [showRetryLoading, setShowRetryLoading] = useState(false)
  const [showRetryResult, setShowRetryResult] = useState(false)
  const [retrySuccess, setRetrySuccess] = useState(false)
  const [retryFailureReason, setRetryFailureReason] = useState("")
  
  // Video projects state
  const [videoProjects, setVideoProjects] = useState<Array<{
    id: string
    title: string
    thumbnail: string
    duration: string
    createdAt: string
    status: 'processing' | 'completed' | 'failed'
  }>>([])
  
  // API state
  const [apiStats, setApiStats] = useState({
    apiCalls: 1247,
    successRate: 98.5,
    rateLimit: {
      used: 750,
      total: 1000,
      resetTime: "2h 15m"
    }
  })
  
  const [apiKeys, setApiKeys] = useState<Array<{
    id: string
    name: string
    type: 'production' | 'development'
    lastUsed: string
    isActive: boolean
  }>>([
    {
      id: '1',
      name: 'Production Key',
      type: 'production',
      lastUsed: '2 hours ago',
      isActive: true
    },
    {
      id: '2',
      name: 'Development Key',
      type: 'development',
      lastUsed: '1 day ago',
      isActive: true
    }
  ])
  
  
  // Refs
  const postPickerRef = useRef<HTMLDivElement>(null)
  const clonePickerRef = useRef<HTMLDivElement>(null)
  
  // Initialize active section from URL
  useEffect(() => {
    const section = searchParams.get("section")
    if (section) {
      setActiveSection(section)
    }
  }, [searchParams])
  
  // Load data from localStorage on mount
  useEffect(() => {
    // Clear any previously saved/open tabs and their contents
    try {
      localStorage.removeItem('openPosts')
      localStorage.removeItem('postContents')
    } catch {}
    
    setOpenPosts([])
    setSelectedPostId(0)
    
    // Load post contents
    const savedPostContents = loadFromLocalStorage('postContents', {})
    if (Object.keys(savedPostContents).length > 0) {
      setPostContents(savedPostContents)
    }
    
    // Load calendar events
    const savedCalendarEvents = loadFromLocalStorage('calendarEvents', {})
    if (Object.keys(savedCalendarEvents).length > 0) {
      setCalendarEvents(savedCalendarEvents)
    }
    
    // Load draft posts
    const savedDraftPosts = loadFromLocalStorage('draftPosts', [])
    if (savedDraftPosts.length > 0) {
      setDraftPosts(savedDraftPosts)
    }
    
    // Load published posts
    const savedPublishedPosts = loadFromLocalStorage('publishedPosts', [])
    if (savedPublishedPosts.length > 0) {
      setPublishedPosts(savedPublishedPosts)
    }
    
    // Load failed posts
    const savedFailedPosts = loadFromLocalStorage('failedPosts', [])
    if (savedFailedPosts.length > 0) {
      // Remove legacy error text from all failed posts and improve placeholder content
      const vnThoughts = [
        'Hôm nay đi dạo và chợt nghĩ: đôi khi im lặng cũng là câu trả lời.',
        'Khi vui hãy viết lại, sau này đọc sẽ thấy mình đã mạnh mẽ thế nào.',
        'Sáng nay cà phê đắng hơn mọi khi, nhưng lại tỉnh táo lạ thường.',
        'Bài học nhỏ: chậm lại không phải là dừng lại.',
        'Gió chiều thổi, mang theo mùi mưa rất dễ chịu.',
        'Việc nhỏ làm đều đặn còn mạnh hơn kế hoạch lớn bỏ dở.',
        'Nếu có thể, hãy nói cảm ơn với chính mình của hôm qua.',
        'Một ý tưởng vụt qua: viết ngắn nhưng để lại dư âm dài.',
        'Hôm nay thử làm một việc khó – kết quả chưa hoàn hảo nhưng mình vui.',
        'Tối yên tĩnh là lúc ý tưởng xuất hiện nhiều nhất.',
        'Nụ cười của ai đó luôn là năng lượng rất thật.',
        'Đang đọc lại vài ghi chú cũ và thấy mình đã thay đổi nhiều.',
        'Có những ngày chỉ cần hoàn thành một việc nhỏ là đủ.',
        'Âm nhạc khiến mọi chuyện trở nên nhẹ hơn một chút.',
        'Khi bối rối, hãy dọn bàn làm việc trước.',
        'Một tách trà nóng và một danh sách việc cần làm – bắt đầu thôi!',
        'Đôi khi điều mình cần chỉ là hít thở thật sâu.',
        'Ghi nhớ: kiên nhẫn là kỹ năng, không phải tính cách bẩm sinh.',
        'Thử nghiệm mới: đi bộ 10 phút trước khi làm việc.',
        'Câu nói thích nhất hôm nay: “Làm ít nhưng đều”.'
      ]
      const extraChunks = [
        'Mình ghi lại để mai xem có còn thấy đúng không.',
        'Nếu mai bận, ít nhất hôm nay đã viết đôi dòng.',
        'Dường như thời tiết ảnh hưởng rất nhiều đến tâm trạng.',
        'Tò mò không biết mọi người có cảm nhận giống mình không.',
        'Có lẽ tối nay sẽ dành vài phút để tổng kết lại.',
      ]
      const makeLong = (base: string, idx: number) => {
        let out = base + ' ' + extraChunks[idx % extraChunks.length]
        let k = 0
        const words = () => out.split(/\s+/).filter(Boolean).length
        while (words() < 60) {
          out += ' ' + extraChunks[(idx + k) % extraChunks.length]
          // add small elaborations to boost word count
          out += ' ' + 'Mình ghi thêm một chút để ghi nhớ cảm xúc lúc này và lý do vì sao ý tưởng xuất hiện.'
          k++
        }
        return out
      }
      const longVN = vnThoughts.map((b, i) => makeLong(b, i))
      const cleaned = savedFailedPosts.map((p: any, i: number) => ({
        ...p,
        error: '',
        content: (p.content && !p.content.startsWith('Đăng bài thất bại')) ? p.content : longVN[i % longVN.length]
      }))
      setFailedPosts(cleaned)
      saveToLocalStorage('failedPosts', cleaned)
    }

    // If no data, seed mock Vietnamese data
    const needSeedDrafts = (savedDraftPosts || []).length === 0
    const needSeedPublished = (savedPublishedPosts || []).length === 0
    const needSeedFailed = (savedFailedPosts || []).length === 0

    const platforms = ['Twitter','Instagram','LinkedIn','Facebook','Threads','Bluesky','YouTube','TikTok','Pinterest'] as const

    const randomPlatform = () => platforms[Math.floor(Math.random() * platforms.length)]
    const randomContent = (plat: string, i: number) => (
      `Bài viết ${i + 1} trên ${plat}: Chia sẻ trải nghiệm hằng ngày, mẹo hữu ích và cảm hứng. #${i + 1}`
    )
    const formatViDate = (d: Date) => d.toISOString()
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n))

    // Generate dates from tháng 6 đến hôm nay (evenly spread)
    const generateDateBetween = (start: Date, end: Date, idx: number, total: number) => {
      const t = start.getTime() + ((end.getTime() - start.getTime()) * idx) / Math.max(total - 1, 1)
      return new Date(t)
    }

    if (needSeedPublished) {
      const start = new Date(new Date().getFullYear(), 5, 1) // tháng 6 (0-based)
      const end = new Date()
      const mockPublished = Array.from({ length: 30 }).map((_, i) => {
        const platform = randomPlatform()
        const when = generateDateBetween(start, end, i, 30)
        return {
          id: Date.now() + i,
          platform,
          content: randomContent(platform, i),
          time: formatViDate(when),
          status: 'published',
          url: `https://${platform.toLowerCase()}.com/bai-viet/${Date.now() + i}`,
          engagement: {
            likes: Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 120),
            shares: Math.floor(Math.random() * 60)
          }
        }
      })
      setPublishedPosts(mockPublished as any)
      saveToLocalStorage('publishedPosts', mockPublished)
    }

    if (needSeedDrafts) {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth() - 2, 1)
      const mockDrafts = Array.from({ length: 20 }).map((_, i) => {
        const platform = randomPlatform()
        const when = generateDateBetween(start, end, i, 20)
        const yyyy = when.getFullYear()
        const mm = pad(when.getMonth() + 1)
        const dd = pad(when.getDate())
        return {
          id: Date.now() + 1000 + i,
          platform,
          platformIcon: platform,
          content: `Bản nháp ${i + 1} cho ${platform}: ghi ý tưởng nhanh để hoàn thiện sau.`,
          time: `${yyyy}-${mm}-${dd}`,
          status: 'draft'
        }
      })
      setDraftPosts(mockDrafts as any)
      saveToLocalStorage('draftPosts', mockDrafts)
    }

    if (needSeedFailed) {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth() - 2, 1)
      const vnThoughts = [
        'Hôm nay đi dạo và chợt nghĩ: đôi khi im lặng cũng là câu trả lời.',
        'Khi vui hãy viết lại, sau này đọc sẽ thấy mình đã mạnh mẽ thế nào.',
        'Sáng nay cà phê đắng hơn mọi khi, nhưng lại tỉnh táo lạ thường.',
        'Bài học nhỏ: chậm lại không phải là dừng lại.',
        'Gió chiều thổi, mang theo mùi mưa rất dễ chịu.',
        'Việc nhỏ làm đều đặn còn mạnh hơn kế hoạch lớn bỏ dở.',
        'Nếu có thể, hãy nói cảm ơn với chính mình của hôm qua.',
        'Một ý tưởng vụt qua: viết ngắn nhưng để lại dư âm dài.',
        'Hôm nay thử làm một việc khó – kết quả chưa hoàn hảo nhưng mình vui.',
        'Tối yên tĩnh là lúc ý tưởng xuất hiện nhiều nhất.',
        'Nụ cười của ai đó luôn là năng lượng rất thật.',
        'Đang đọc lại vài ghi chú cũ và thấy mình đã thay đổi nhiều.',
        'Có những ngày chỉ cần hoàn thành một việc nhỏ là đủ.',
        'Âm nhạc khiến mọi chuyện trở nên nhẹ hơn một chút.',
        'Khi bối rối, hãy dọn bàn làm việc trước.',
        'Một tách trà nóng và một danh sách việc cần làm – bắt đầu thôi!',
        'Đôi khi điều mình cần chỉ là hít thở thật sâu.',
        'Ghi nhớ: kiên nhẫn là kỹ năng, không phải tính cách bẩm sinh.',
        'Thử nghiệm mới: đi bộ 10 phút trước khi làm việc.',
        'Câu nói thích nhất hôm nay: “Làm ít nhưng đều”.'
      ]
      const extraChunks = [
        'Mình ghi lại để mai xem có còn thấy đúng không.',
        'Nếu mai bận, ít nhất hôm nay đã viết đôi dòng.',
        'Dường như thời tiết ảnh hưởng rất nhiều đến tâm trạng.',
        'Tò mò không biết mọi người có cảm nhận giống mình không.',
        'Có lẽ tối nay sẽ dành vài phút để tổng kết lại.',
      ]
      const makeLong = (base: string, idx: number) => {
        let out = base + ' ' + extraChunks[idx % extraChunks.length]
        let k = 0
        const words = () => out.split(/\s+/).filter(Boolean).length
        while (words() < 60) {
          out += ' ' + extraChunks[(idx + k) % extraChunks.length]
          out += ' ' + 'Mình ghi thêm một chút để ghi nhớ cảm xúc lúc này và lý do vì sao ý tưởng xuất hiện.'
          k++
        }
        return out
      }
      const longVN = vnThoughts.map((b, i) => makeLong(b, i))
      const mockFailed = Array.from({ length: 20 }).map((_, i) => {
        const platform = randomPlatform()
        const when = generateDateBetween(start, end, i, 20)
        const yyyy = when.getFullYear()
        const mm = pad(when.getMonth() + 1)
        const dd = pad(when.getDate())
        const hh = pad(when.getHours())
        const mi = pad(when.getMinutes())
        return {
          id: Date.now() + 2000 + i,
          platform,
          content: longVN[i % longVN.length],
          date: `${yyyy}-${mm}-${dd}`,
          time: `${hh}:${mi}`,
          error: '',
          url: `https://${platform.toLowerCase()}.com/bai-viet/that-bai/${Date.now() + i}`
        }
      })
      setFailedPosts(mockFailed as any)
      saveToLocalStorage('failedPosts', mockFailed)
    }
  }, [])
  
  // Event handlers
  const handlePostSelect = (id: number) => {
    setSelectedPostId(id)
  }
  
  const handlePostCreate = (type: string) => {
    const newId = Date.now()
    setOpenPosts(prev => [...prev, { id: newId, type }])
    setPostContents(prev => ({ ...prev, [newId]: "" }))
    setSelectedPostId(newId)
  }
  
  const handlePostDelete = (id: number) => {
    const remaining = openPosts.filter(p => p.id !== id)
    setOpenPosts(remaining)
    const nextId = remaining.length > 0 ? remaining[0].id : 0
    setSelectedPostId(nextId)
    setPostContents(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  // Create a new post tab prefilled with provided content and focus it
  const handleCreatePostWithContent = (type: string, content: string) => {
    const newId = Date.now()
    setOpenPosts(prev => [...prev, { id: newId, type }])
    setPostContents(prev => {
      const updated = { ...prev, [newId]: content }
      saveToLocalStorage('postContents', updated)
      return updated
    })
    setSelectedPostId(newId)
  }

  // Clone current post into a new tab with same content
  const handleClonePost = (postId: number) => {
    const post = openPosts.find(p => p.id === postId)
    if (!post) return
    const newId = Date.now()
    const content = postContents[postId] || ""
    setOpenPosts(prev => [...prev, { id: newId, type: post.type }])
    setPostContents(prev => ({ ...prev, [newId]: content }))
    setSelectedPostId(newId)
  }

  // Save draft content for current post
  const handleSaveDraft = (postId: number) => {
    const content = postContents[postId] || ""
    const draft: any = {
      id: postId,
      platform: openPosts.find(p => p.id === postId)?.type || 'Unknown',
      content,
      time: new Date().toISOString(),
      status: 'draft'
    }
    const updated = [...draftPosts.filter(d => d.id !== postId), draft]
    setDraftPosts(updated)
    saveToLocalStorage('draftPosts', updated)
  }
  
  const handlePostContentChange = (id: number, content: string) => {
    const updatedPostContents = { ...postContents, [id]: content }
    setPostContents(updatedPostContents)
    saveToLocalStorage('postContents', updatedPostContents)
  }
  
  const handleMediaUpload = (files: File[]) => {
    const mediaFiles = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
      preview: URL.createObjectURL(file),
      file
    }))
    setUploadedMedia(prev => [...prev, ...mediaFiles])
  }
  
  const handleMediaRemove = (mediaId: string) => {
    setUploadedMedia(prev => prev.filter(media => media.id !== mediaId))
  }
  
  const handlePublish = (postId: number) => {
    const post = openPosts.find(p => p.id === postId)
    if (post) {
      // Move to published posts
      const publishedPost = {
        id: postId,
        platform: post.type,
        content: postContents[postId] || "",
        time: new Date().toLocaleString('vi-VN'),
        status: 'published',
        url: `https://${post.type.toLowerCase()}.com/post/${postId}`,
        engagement: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10)
        }
      }
      setPublishedPosts(prev => [...prev, publishedPost])
      saveToLocalStorage('publishedPosts', [...publishedPosts, publishedPost])
      
      // Remove from open posts
      handlePostDelete(postId)
    }
  }
  
  const handleEditDraft = (post: any) => {
    // Implementation for editing draft
    console.log('Edit draft:', post)
  }
  
  const handleDeleteDraft = (id: number) => {
    setDraftPosts(prev => prev.filter(p => p.id !== id))
    saveToLocalStorage('draftPosts', draftPosts.filter(p => p.id !== id))
  }
  
  const handlePublishDraft = (id: number) => {
    const draft = draftPosts.find(p => p.id === id)
    if (draft) {
      handlePublish(id)
      handleDeleteDraft(id)
    }
  }
  
  const handleViewPost = (url: string) => {
    window.open(url, '_blank')
  }
  
  const handleRetryPost = (id: number) => {
    const post = failedPosts.find(p => p.id === id)
    if (!post) return

    // Helper to derive failure reason
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
    const isContentIssue = contentLength > limit || err.includes('character') || err.includes('limit') || err.includes('policy')

    if (isContentIssue) {
      const newPostId = Date.now()
      setOpenPosts(prev => [...prev, { id: newPostId, type: post.platform }])
      setSelectedPostId(newPostId)
      setPostContents(prev => ({ ...prev, [newPostId]: post.content }))
      const updatedFailedPosts = failedPosts.filter(p => p.id !== id)
      setFailedPosts(updatedFailedPosts)
      saveToLocalStorage('failedPosts', updatedFailedPosts)
      setActiveSection('create')
    } else {
      // Show loading, then simulate result
      setShowRetryLoading(true)
      setTimeout(() => {
        const isSuccess = Math.random() > 0.4
        if (isSuccess) {
          const updatedFailedPosts = failedPosts.filter(p => p.id !== id)
          setFailedPosts(updatedFailedPosts)
          saveToLocalStorage('failedPosts', updatedFailedPosts)
          const newPublishedPost = {
            id: Date.now(),
            content: post.content,
            platform: post.platform,
            time: new Date().toISOString(),
            status: 'published' as const,
            url: `https://${post.platform.toLowerCase()}.com/post/${Date.now()}`
          }
          const updatedPublished = [...publishedPosts, newPublishedPost as any]
          setPublishedPosts(updatedPublished)
          saveToLocalStorage('publishedPosts', updatedPublished)
        } else {
          const failureMessage = 'Kết nối kém. Vui lòng thử lại.'
          const updatedFailed = failedPosts.map(p => p.id === id ? { ...p, error: failureMessage } : p)
          setFailedPosts(updatedFailed)
          saveToLocalStorage('failedPosts', updatedFailed)
          setRetryFailureReason(failureMessage)
        }
        setShowRetryLoading(false)
        setRetrySuccess(isSuccess)
        setShowRetryResult(true)
      }, 2000)
    }
  }
  
  const handleDeletePost = (id: number) => {
    setPublishedPosts(prev => prev.filter(p => p.id !== id))
    setFailedPosts(prev => prev.filter(p => p.id !== id))
  }
  
  const handleVideoUpload = () => {
    // Implementation for video upload
    console.log('Video upload')
  }
  
  const handleVideoEdit = (projectId: string) => {
    // Implementation for video editing
    console.log('Edit video:', projectId)
  }
  
  const handleVideoDelete = (projectId: string) => {
    setVideoProjects(prev => prev.filter(p => p.id !== projectId))
  }
  
  const handleEventAdd = (year: number, month: number, day: number, platform: string) => {
    const key = `${year}-${month}-${day}`
    const newEvent = {
      platform,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'scheduled',
      noteType: 'yellow' as const
    }
    setCalendarEvents(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newEvent]
    }))
    saveToLocalStorage('calendarEvents', {
      ...calendarEvents,
      [key]: [...(calendarEvents[key] || []), newEvent]
    })
  }

  // Clear all calendar events and remove persisted storage
  const handleClearCalendarEvents = () => {
    try {
      localStorage.removeItem('calendarEvents')
    } catch {}
    setCalendarEvents({})
  }
  
  const handleRegenerateKey = (keyId: string) => {
    // Implementation for regenerating API key
    console.log('Regenerate key:', keyId)
  }
  
  const handleCreateKey = () => {
    // Implementation for creating new API key
    console.log('Create new key')
  }
  
  
  return {
    // State
    activeSection,
    setActiveSection,
    isSidebarOpen,
    setIsSidebarOpen,
    language,
    setLanguage,
    openPosts,
    selectedPostId,
    postContents,
    showPostPicker,
    setShowPostPicker,
    isPostPickerVisible,
    setIsPostPickerVisible,
    showClonePicker,
    setShowClonePicker,
    showSettings,
    setShowSettings,
    showSourceModal,
    setShowSourceModal,
    uploadedMedia,
    currentMediaIndex,
    setCurrentMediaIndex,
    calendarEvents,
    draftPosts,
    publishedPosts,
    failedPosts,
    videoProjects,
    apiStats,
    apiKeys,
    
    // Refs
    postPickerRef,
    clonePickerRef,
    
    // Event handlers
    handlePostSelect,
    handlePostCreate,
    handlePostDelete,
    handlePostContentChange,
    handleClonePost,
    handleSaveDraft,
    handleCreatePostWithContent,
    handleMediaUpload,
    handleMediaRemove,
    handlePublish,
    handleEditDraft,
    handleDeleteDraft,
    handlePublishDraft,
    handleViewPost,
    handleRetryPost,
    handleDeletePost,
    handleVideoUpload,
    handleVideoEdit,
    handleVideoDelete,
    handleEventAdd,
    handleClearCalendarEvents,
    handleRegenerateKey,
    handleCreateKey,
  }
}
