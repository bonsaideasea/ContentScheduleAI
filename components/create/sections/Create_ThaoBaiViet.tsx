"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  PlusIcon, 
  X as CloseIcon, 
  ImageIcon, 
  VideoIcon, 
  SparklesIcon,
  ChevronDownIcon,
  SendIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon
} from "lucide-react"
import { getDaysInMonth, vietnameseWeekdays } from "@/utils/calendar"

interface Post {
  id: number
  type: string
  content?: string
}

interface MediaFile {
  id: string
  type: 'image' | 'video'
  preview: string
  file: File
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CreateSectionProps {
  posts: Post[]
  selectedPostId: number
  postContents: Record<number, string>
  onPostSelect: (id: number) => void
  onPostCreate: (type: string) => void
  onPostDelete: (id: number) => void
  onPostContentChange: (id: number, content: string) => void
  onClonePost: (postId: number) => void
  onSaveDraft: (postId: number) => void
  onMediaUpload: (files: File[]) => void
  onMediaRemove: (mediaId: string) => void
  onPublish: (postId: number) => void
}

/**
 * Create section component with three-panel layout:
 * 1. Left panel (241px) - Sources management
 * 2. Main panel (flex-1) - Post creation editor  
 * 3. Right panel (400px) - AI chatbox
 */
export default function CreateSection({
  posts,
  selectedPostId,
  postContents,
  onPostSelect,
  onPostCreate,
  onPostDelete,
  onPostContentChange,
  onClonePost,
  onSaveDraft,
  onMediaUpload,
  onMediaRemove,
  onPublish
}: CreateSectionProps) {
  // Post management state
  const [showPostPicker, setShowPostPicker] = useState(false)
  const [isPostPickerVisible, setIsPostPickerVisible] = useState(false)
  const [isAddPostActive, setIsAddPostActive] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState<MediaFile[]>([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const postPickerRef = useRef<HTMLDivElement>(null)

  // Sources state
  const [isAddingSource, setIsAddingSource] = useState(false)
  const [isSourcePickerVisible, setIsSourcePickerVisible] = useState(false)
  const [selectedSourceType, setSelectedSourceType] = useState<'text' | 'article' | 'youtube' | 'tiktok' | 'pdf' | 'audio'>('text')
  const [showSourceModal, setShowSourceModal] = useState(false)

  // AI Chat state
  const [selectedChatModel, setSelectedChatModel] = useState<string>("ChatGPT")
  const [showModelMenu, setShowModelMenu] = useState<boolean>(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const modelMenuRef = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  // Publish confirmation modal state
  const [showPublishModal, setShowPublishModal] = useState(false)
  // Publish modal selections
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [selectedAccountPic, setSelectedAccountPic] = useState<string>("/shego.jpg")
  const [showAccountDropdown, setShowAccountDropdown] = useState<boolean>(false)
  const [publishTime, setPublishTime] = useState<string>("now|Bây giờ")
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
  const [timeHour, setTimeHour] = useState<string>("")
  const [timeMinute, setTimeMinute] = useState<string>("")
  const [timeAmPm, setTimeAmPm] = useState<'AM'|'PM'>('AM')
  const [isScheduleFocused, setIsScheduleFocused] = useState<boolean>(false)

  const publishModalRef = useRef<HTMLDivElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const calendarAnchorRef = useRef<HTMLDivElement>(null)

  // Generate month grid for the selectedDate
  const getMonthGrid = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = new Date(year, month, 1).getDay() // 0=Sun
    // Convert to Monday-first index (Mon=0 ... Sun=6) matching our header
    const firstIdx = (firstDay + 6) % 7
    const cells: Array<{ day: number | null }>[] = []
    let row: Array<{ day: number | null }> = []
    for (let i = 0; i < firstIdx; i++) row.push({ day: null })
    for (let d = 1; d <= daysInMonth; d++) {
      row.push({ day: d })
      if (row.length === 7) { cells.push(row); row = [] }
    }
    if (row.length) {
      while (row.length < 7) row.push({ day: null })
      cells.push(row)
    }
    return cells
  }

  // When opening the calendar via "Chọn thời gian", default to user's current local time
  useEffect(() => {
    if (!showCalendar || publishTime !== 'pick a time') return
    const now = new Date()
    const hours24 = now.getHours()
    const minutes = now.getMinutes()
    const ampm: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM'
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
    const hh = String(hours12).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')
    setTimeHour(hh)
    setTimeMinute(mm)
    setTimeAmPm(ampm)
    setSelectedTime(`${hh}:${mm} ${ampm}`)
  }, [showCalendar, publishTime])

  function handleConfirmPickTime() {
    const hh = String(Math.min(12, Math.max(0, parseInt(timeHour || '0', 10))).toString().padStart(2, '0'))
    const mm = String(Math.min(59, Math.max(0, parseInt(timeMinute || '0', 10))).toString().padStart(2, '0'))
    setSelectedTime(`${hh}:${mm} ${timeAmPm}`)
    setShowCalendar(false)
  }

  // Close calendar when clicking outside the calendar popover
  useEffect(() => {
    if (!showCalendar) return
    const onDocClick = (e: MouseEvent) => {
      const node = calendarRef.current
      if (node && !node.contains(e.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showCalendar])

  // Platform options for post creation
  const platformOptions = [
    { name: "Twitter", icon: "/x.png" },
    { name: "Instagram", icon: "/instagram.png" },
    { name: "LinkedIn", icon: "/link.svg" },
    { name: "Facebook", icon: "/fb.svg" },
    { name: "Pinterest", icon: "/pinterest.svg" },
    { name: "TikTok", icon: "/tiktok.png" },
    { name: "Threads", icon: "/threads.png" },
    { name: "Bluesky", icon: "/bluesky.png" },
    { name: "YouTube", icon: "/ytube.png" }
  ]

  // Mock connected accounts per platform (can be wired to real data later)
  const getAccountsForPlatform = (platform: string): Array<{ username: string; profilePic: string }> => {
    const common = [{ username: '@whatevername', profilePic: '/shego.jpg' }]
    return common
  }

  const handleOpenPublish = () => {
    const active = posts.find((p) => p.id === selectedPostId)
    const activePlatform = active?.type || ''
    setSelectedPlatform(activePlatform)
    const list = getAccountsForPlatform(activePlatform)
    if (list.length > 0) {
      setSelectedAccount(list[0].username)
      setSelectedAccountPic(list[0].profilePic)
    }
    setPublishTime('now|Bây giờ')
    setShowCalendar(false)
    setSelectedDate(new Date())
    setSelectedTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    setShowPublishModal(true)
  }

  // Source type options
  const sourceTypeOptions = [
    { key: "text", label: "Văn bản" },
    { key: "article", label: "Bài Viết" },
    { key: "youtube", label: "YouTube" },
    { key: "tiktok", label: "TikTok" },
    { key: "perplexity", label: "Perplexity" },
    { key: "pdf", label: "PDF" },
    { key: "audio", label: "Âm thanh" },
  ]

  // AI model options
  const modelOptions = [
    "ChatGPT",
    "Claude Sonnet 4", 
    "gpt-4.1",
    "o4-mini",
    "o3",
    "gpt-4o"
  ]

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const mediaFiles: MediaFile[] = files.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        preview: URL.createObjectURL(file),
        file
      }))
      setUploadedMedia(prev => [...prev, ...mediaFiles])
      onMediaUpload(files)
    }
  }

  // Handle post picker visibility
  const handlePostPickerMouseEnter = () => {
    setShowPostPicker(true)
    setIsPostPickerVisible(true)
    setIsAddPostActive(true)
  }

  const handlePostPickerMouseLeave = () => {
    setIsAddPostActive(false)
    setTimeout(() => {
      setShowPostPicker(false)
      setIsPostPickerVisible(false)
    }, 150)
  }

  // Handle source picker visibility
  const handleSourcePickerMouseEnter = () => {
    setIsSourcePickerVisible(true)
  }

  const startSourcePickerHideTimer = () => {
    setTimeout(() => {
      setIsSourcePickerVisible(false)
      setIsAddingSource(false)
    }, 150)
  }

  // Helper functions for Vietnamese-first LLM UX
  const platformList = ['facebook','twitter','instagram','linkedin','tiktok','threads','bluesky','youtube','pinterest']
  const titleCase = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s
  const isGibberish = (text: string) => {
    const t = (text || '').trim(); if (t.length < 2) return true; const ratio = (t.match(/[^\p{L}\p{N}\s]/gu)?.length || 0) / Math.max(1, t.length); return ratio > 0.4
  }
  const detectPlatform = (text: string) => platformList.find(p => (text || '').toLowerCase().includes(p))
  const shouldCreatePost = (text: string) => /(write|post|draft|compose|tạo|viết|đăng)/.test((text||'').toLowerCase())
  const extractTopic = (text: string) => {
    const lower = (text||'').toLowerCase(); const mEn = lower.match(/write\s+(?:about|on)\s+([^.,!?]+)/); const mVi = lower.match(/viết\s+về\s+([^.,!?]+)/); const raw = (mEn?.[1] || mVi?.[1] || text).trim(); return raw.replace(/\s+on\s+(facebook|twitter|instagram|linkedin|tiktok|threads|bluesky|youtube|pinterest).*/, '').trim()
  }
  const generatePostContent = (msg: string, platform: string) => {
    const topic = extractTopic(msg); const p = titleCase(platform); return `Bài đăng ${p} về ${topic}:\n\n• Mở đầu ngắn gọn, dễ hiểu.\n• Nêu 2-3 lợi ích/điểm chính.\n• CTA rõ ràng ở cuối.\n\nVí dụ: ${topic} mang lại trải nghiệm linh hoạt và bảo mật. Hãy thử ngay hôm nay! #${topic.replace(/\s+/g,'')}`
  }
  const generateLLMResponse = (userMessage: string): { response: string; shouldCreatePost: boolean; platform?: string; postContent?: string } => {
    const trimmed = userMessage.trim(); if (isGibberish(trimmed)) return { response: "Mình chưa hiểu ý bạn. Bạn có thể mô tả rõ hơn không?", shouldCreatePost: false }
    const wants = shouldCreatePost(trimmed); const detected = detectPlatform(trimmed)
    if (wants || detected) { const platform = titleCase(detected || 'Facebook'); const postContent = generatePostContent(trimmed, platform); const response = `Tuyệt vời! Mình sẽ tạo một bài đăng mới${detected ? ` trên ${platform}` : ''}. Mình cũng đã phác thảo nội dung để bạn duyệt.`; return { response, shouldCreatePost: true, platform, postContent } }
    return { response: "Mình có thể viết bản nháp cho bạn. Bạn muốn tông giọng nào và đăng lên nền tảng nào?", shouldCreatePost: false }
  }

  // Handle chat submission using helper logic
  const submitChat = async () => {
    const text = chatInput.trim()
    if (!text || isTyping) return
    setChatMessages(prev => [...prev, { role: 'user', content: text }])
    setChatInput("")
    setIsTyping(true)
    const delay = Math.random() * 2000 + 800; await new Promise(r => setTimeout(r, delay))
    const ai = generateLLMResponse(text)
    setChatMessages(prev => [...prev, { role: 'assistant', content: ai.response }])
    if (ai.shouldCreatePost && ai.platform && ai.postContent) {
      onPostCreate(ai.platform)
      setTimeout(() => {
        const latest = [...posts].reverse().find(p => p.type.toLowerCase() === ai.platform!.toLowerCase())
        const id = latest?.id ?? selectedPostId
        if (id) { onPostSelect(id); onPostContentChange(id, ai.postContent!) }
      }, 0)
    }
    setIsTyping(false)
  }

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages, isTyping])

  // Listen for ai-create-post to prefill latest post content using parent hook
  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail || {}
      const pretty = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Facebook'
      const platformName = pretty(detail.platform || 'facebook')
      const content = detail.content || ''
      // Find most recent post of this platform
      const latest = [...posts].reverse().find(p => p.type.toLowerCase() === platformName.toLowerCase())
      const id = latest?.id ?? selectedPostId
      if (id) {
        onPostSelect(id)
        onPostContentChange(id, content)
      }
    }
    window.addEventListener('ai-create-post', handler as any)
    return () => window.removeEventListener('ai-create-post', handler as any)
  }, [posts, selectedPostId, onPostSelect, onPostContentChange])

  // Get current post
  const currentPost = posts.find(p => p.id === selectedPostId)

  return (
    <div className="flex h-full w-full">
      {/* Left Panel - Sources (241px) */}
      <div className="w-[241px] border-r border-white/10 p-4 pt-[30px] flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-gray-200 hover:text-white px-2 py-1"
            onClick={() => setShowSourceModal(true)}
          >
            + Thêm nguồn
          </Button>
        </div>

        {isAddingSource && (
          <div 
            className={`border border-white/10 rounded-md p-3 bg-gray-900/50 transition-opacity duration-75 ${
              isSourcePickerVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={handleSourcePickerMouseEnter}
            onMouseLeave={startSourcePickerHideTimer}
          >
            <div className="grid grid-cols-2 gap-2 mb-3">
              {sourceTypeOptions.map((option) => (
                <Button
                  key={option.key}
                  size="sm"
                  variant={selectedSourceType === (option.key as any) ? "secondary" : "ghost"}
                  className={selectedSourceType === (option.key as any) ? "bg-white/10" : ""}
                  onClick={() => setSelectedSourceType(option.key as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {selectedSourceType === "text" && (
                <Textarea 
                  placeholder="Dán hoặc nhập nguồn văn bản..." 
                  className="bg-gray-900/50 border-white/10" 
                />
              )}
              {selectedSourceType !== "text" && (
                <Input
                  placeholder={
                    selectedSourceType === "article"
                      ? "Dán URL bài viết..."
                      : selectedSourceType === "youtube"
                      ? "Dán liên kết YouTube..."
                      : selectedSourceType === "tiktok"
                      ? "Dán liên kết TikTok..."
                      : selectedSourceType === "pdf"
                      ? "Dán liên kết PDF..."
                      : "Dán liên kết âm thanh..."
                  }
                  className="bg-gray-900/50 border-white/10"
                />
              )}

              <div className="flex gap-2 pt-1">
                <Button size="sm" className="bg-[#E33265] hover:bg-[#c52b57]">Lưu</Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-transparent" 
                  onClick={() => setIsAddingSource(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Post Editor */}
      <div className="flex-1 flex ml-4 min-w-0">
        <div className="flex-1 p-6 pt-[30px] h-full overflow-hidden min-w-0">
          <div className="w-full flex flex-col h-full">
            {/* Tabs row */}
            <div className="flex items-center gap-3 mb-4">
              {/* Tabs container */}
              <div className="flex items-center gap-3 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`flex items-center gap-2 px-3 py-1 rounded-md border ${
                      selectedPostId === post.id 
                        ? "border-[#E33265] text-white" 
                        : "border-white/10 text-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => onPostSelect(post.id)}
                      className="text-sm"
                    >
                      {post.type}
                    </button>
                    <button
                      aria-label="Close tab"
                      className="p-1 rounded hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPostDelete(post.id)
                      }}
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add Post button */}
              <div
                className="relative flex-shrink-0"
                ref={postPickerRef}
                onMouseEnter={handlePostPickerMouseEnter}
                onMouseLeave={handlePostPickerMouseLeave}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${isAddPostActive ? 'bg-[#E33265] text-white hover:bg-[#c52b57]' : ''}`}
                  onClick={() => {
                    if (showPostPicker) {
                      handlePostPickerMouseLeave()
                    } else {
                      handlePostPickerMouseEnter()
                    }
                  }}
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Thêm bài
                </Button>
                
                {showPostPicker && (
                  <div 
                    className={`absolute right-0 z-20 mt-2 w-[13.75rem] bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg p-3 transition-opacity duration-75 ${
                      isPostPickerVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="space-y-1">
                      {platformOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onPostCreate(option.name)
                            setShowPostPicker(false)
                            setIsPostPickerVisible(false)
                            setIsAddPostActive(false)
                          }}
                          className="w-full text-left px-4 py-3 rounded-md hover:bg-white/5 text-base text-gray-200 flex items-center gap-4"
                        >
                          <img
                            src={option.icon}
                            alt=""
                            className={`w-7 h-7 ${
                              ["Twitter", "Threads"].includes(option.name) 
                                ? "filter brightness-0 invert" 
                                : ""
                            }`}
                          />
                          <span>{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Editor */}
            <Card className="bg-[#2A2A30] border-[#3A3A42] p-6 flex-1 flex flex-col w-full">
              {selectedPostId === 0 || posts.length === 0 ? (
                /* Empty state */
                <div className="flex-1 flex items-center justify-center">
                  <Button 
                    onClick={handlePostPickerMouseEnter}
                    className="bg-[#E33265] hover:bg-[#c52b57] text-white"
                  >
                    <PlusIcon className="w-6 h-6 mr-2" />
                    Tạo bài viết
                  </Button>
                </div>
              ) : (
                /* Editor when a post is selected */
                <div className="relative flex-1 overflow-hidden w-full">
                  <Textarea
                    placeholder={`Bạn muốn chia sẻ gì trên ${currentPost?.type || "bài viết"}?`}
                    value={postContents[selectedPostId] ?? ""}
                    onChange={(e) => onPostContentChange(selectedPostId, e.target.value)}
                    className="w-full h-full bg-[#2A2A30] border border-[#2A2A30] resize-none text-white placeholder:text-gray-400 focus:ring-0 focus:border-[#2A2A30] p-[10px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                  />
                  
                  {/* Media Preview Area */}
                  {uploadedMedia.length > 0 && (
                    <div className="mt-4">
                      <div className="relative bg-[#1E1E23] rounded-lg p-4 border border-[#3A3A42]">
                        <div className="relative">
                          {uploadedMedia[currentMediaIndex]?.type === 'image' ? (
                            <img 
                              src={uploadedMedia[currentMediaIndex].preview} 
                              alt="Uploaded media"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          ) : (
                            <video 
                              src={uploadedMedia[currentMediaIndex].preview} 
                              className="w-full h-64 object-cover rounded-lg"
                              controls
                            />
                          )}
                          
                          {/* Media Type Icon */}
                          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                            {uploadedMedia[currentMediaIndex]?.type === 'image' ? (
                              <ImageIcon className="w-4 h-4 text-white" />
                            ) : (
                              <VideoIcon className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                        
                        {/* Media Navigation */}
                        {uploadedMedia.length > 1 && (
                          <div className="flex items-center justify-center gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCurrentMediaIndex(prev => 
                                prev > 0 ? prev - 1 : uploadedMedia.length - 1
                              )}
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-gray-400">
                              {currentMediaIndex + 1} / {uploadedMedia.length}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCurrentMediaIndex(prev => 
                                prev < uploadedMedia.length - 1 ? prev + 1 : 0
                              )}
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Action bar - sticky with divider and character count */}
                  <div className="sticky bottom-0 left-0 right-0 bg-[#2A2A30] pt-3 mt-4">
                    <div className="relative border-t border-white/10 pt-3 flex items-center justify-between">
                      {/* Character count aligned to the right, above line */}
                      <div className="absolute -top-[22px] right-0 text-xs text-gray-400 mb-[10px]">
                        {(postContents[selectedPostId] ?? "").length}/
                        {(() => {
                          const platform = currentPost?.type || 'default'
                          const limits: Record<string, number> = { Twitter: 280, Instagram: 2200, LinkedIn: 3000, Facebook: 63206, Pinterest: 500, TikTok: 2200, Threads: 500, Bluesky: 300, YouTube: 5000, default: 5000 }
                          return limits[platform] ?? limits.default
                        })()} ký tự
                      </div>
                      {/* Left: Only Add Image button stays */}
                      <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <label htmlFor="media-upload">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 px-4 cursor-pointer bg-black hover:bg-black/80 border-black text-white"
                          asChild
                        >
                          <span>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Thêm ảnh
                          </span>
                        </Button>
                      </label>
                      </div>

                      {/* Right: Clone, Save, Publish */}
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-9 px-4 border-[#E33265] text-white hover:bg-[#E33265]/10"
                          onClick={() => onClonePost(selectedPostId)}
                        >
                          Nhân bản
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-9 px-4 border-[#E33265] text-white hover:bg-[#E33265]/10"
                          onClick={() => onSaveDraft(selectedPostId)}
                        >
                          Lưu
                        </Button>
                        <Button
                          onClick={handleOpenPublish}
                          className="bg-[#E33265] hover:bg-[#c52b57] text-white"
                        >
                          Đăng
                        </Button>
                      </div>
                  </div>
                </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Panel - AI Chatbox (400px) */}
        <div className="w-[400px] border-l border-white/10 pt-[25px] px-4 pb-[24px] flex-shrink-0">
          <Card className="bg-[#2A2A30] border-[#3A3A42] h-full flex flex-col">
            {/* Model Selector Header */}
            <div className="h-[30px] px-4 border-b border-white/10 flex items-center">
              <div className="relative -mt-[15px]" ref={modelMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowModelMenu((v) => !v)}
                  className="inline-flex items-center gap-2 text-sm font-semibold leading-none text-white/90 hover:text-white"
                >
                  <SparklesIcon className="w-4 h-4" />
                  {selectedChatModel}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                </button>
                {showModelMenu && (
                  <div className="absolute mt-2 w-56 bg-[#2A2A30] border border-[#3A3A42] rounded-md shadow-lg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] py-2 z-20">
                    {modelOptions.map((model) => (
                      <button
                        key={model}
                        onClick={() => { 
                          setSelectedChatModel(model)
                          setShowModelMenu(false) 
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${
                          selectedChatModel === model ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatScrollRef} className="h-[calc(100%-130px)] p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <div className="space-y-4 min-h-0">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`text-sm ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`rounded-lg p-3 max-w-[80%] break-words ${
                      message.role === "user" 
                        ? "bg-[#E33265] text-white ml-auto inline-block text-left" 
                        : "bg-[#2A2A30] text-[#F5F5F7] inline-block border border-[#3A3A42]"
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="text-sm text-left">
                    <div className="bg-[#2A2A30] text-[#F5F5F7] inline-block rounded-lg p-3 border border-[#3A3A42]">
                      <div className="flex items-center space-x-1">
                        <span>AI đang nhập</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#F5F5F7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-[#F5F5F7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-[#F5F5F7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-white/10 relative pt-[5px] pl-[9px] pr-[5px] h-[120px]">
              <div className="relative h-full">
                <textarea
                  placeholder="Tôi là trợ lý viết mới của bạn. Bạn muốn viết về điều gì?"
                  className="w-full h-full bg-[#2A2A30] border border-[#2A2A30] rounded-md outline-none focus:outline-none focus:ring-0 focus:border-[#2A2A30] resize-none text-[#F5F5F7] placeholder-gray-400 text-sm p-[10px] pr-12"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      submitChat()
                    }
                  }}
                />
                <button
                  onClick={submitChat}
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#E33265] hover:bg-[#E33265]/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                >
                  <SendIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Source Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowSourceModal(false) }}>
          <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-2xl w-[1000px] max-w-[95vw] max-h-[90vh] overflow-hidden shadow-xl shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Chỉnh sửa nguồn</h2>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowSourceModal(false)}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="grid grid-cols-7 gap-3">
                {sourceTypeOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`px-4 py-3 rounded-md text-sm ${
                      selectedSourceType === (option.key as any) 
                        ? 'bg-white/10 text-white' 
                        : 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedSourceType(option.key as any)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-4 space-y-3 overflow-auto" style={{ maxHeight: "60vh" }}>
              <div className="text-white">Văn bản</div>
              {selectedSourceType === 'text' && (
                <Textarea placeholder="Dán văn bản vào đây" className="bg-gray-900/50 border-white/10 h-40" />
              )}
              {selectedSourceType !== 'text' && (
                <Input
                  placeholder={
                    selectedSourceType === 'article' ? 'Dán URL bài viết...' :
                    selectedSourceType === 'youtube' ? 'Dán URL YouTube...' :
                    selectedSourceType === 'tiktok' ? 'Dán URL TikTok...' :
                    selectedSourceType === 'pdf' ? 'Dán URL PDF...' :
                    'Dán URL âm thanh...'
                  }
                  className="bg-gray-900/50 border-white/10"
                />
              )}
              <label className="flex items-center gap-3 text-white pt-2">
                <input type="checkbox" className="accent-[#E33265]" />
                <span>Lưu nguồn?</span>
              </label>
              <details className="text-white/90">
                <summary className="cursor-pointer select-none">Cài đặt nâng cao</summary>
                <div className="mt-2 text-sm text-gray-300">Chưa có cài đặt bổ sung.</div>
              </details>
            </div>
            
            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-md"
                onClick={() => setShowSourceModal(false)}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal - choose account and schedule */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowPublishModal(false) }}>
          <div ref={publishModalRef} className="bg-[#2A2A30] border border-[#3A3A42] rounded-lg p-7 w-[450px] max-w-[90vw] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] relative">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#F5F5F7]">Xác nhận đăng</h3>
              <p className="text-sm text-gray-400 mt-1">Chọn tài khoản và thời điểm đăng.</p>
            </div>

            {/* Account & Platform */}
            <div className="flex items-center gap-3 mb-4">
              {/* Platform icon */}
              <img src={platformOptions.find(p => p.name === selectedPlatform)?.icon || '/placeholder.svg'} alt={selectedPlatform} className={`w-7 h-7 ${['Twitter','Threads'].includes(selectedPlatform) ? 'filter brightness-0 invert' : ''}`} />
              <div className="flex-1 relative">
                <div 
                  className={`flex items-center gap-3 bg-[#1E1E23] rounded-lg p-3 h-12 cursor-pointer transition-colors border border-[#3A3A42] ${showAccountDropdown ? 'ring-2 ring-[#E33265]' : ''}`}
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={selectedAccountPic} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{selectedAccount || 'Chọn tài khoản'}</div>
                    <div className="text-xs text-white/50">{selectedPlatform}</div>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-white/70" />
                </div>

                {/* Account Dropdown */}
                {showAccountDropdown && (
                  <div ref={accountDropdownRef} data-account-dropdown className="absolute top-full left-0 right-0 mt-1 bg-[#1E1E23] rounded-lg border border-gray-700 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] z-10 max-h-48 overflow-y-auto">
                    {getAccountsForPlatform(selectedPlatform).map((account, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAccount(account.username)
                          setSelectedAccountPic(account.profilePic)
                          setShowAccountDropdown(false)
                        }}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img src={account.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">{account.username}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-4">
              <p className="text-white mb-2">Khi nào bạn muốn đăng?</p>
              <div ref={calendarAnchorRef} className={`relative rounded-lg bg-[#1E1E23] border border-[#3A3A42]`}>
                <select 
                  value={publishTime} 
                  onChange={(e) => {
                    setPublishTime(e.target.value)
                    setShowCalendar(e.target.value === 'pick a time')
                  }}
                  className="w-full bg-[#1E1E23] text-white rounded-lg p-3 appearance-none pr-8 focus:outline-none"
                >
                  <option value="now|Bây giờ">Bây giờ</option>
                  <option value="next free slot">Khe trống tiếp theo</option>
                  <option value="pick a time">Chọn thời gian</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>

            {publishTime === 'pick a time' && (
              <div className="mb-4">
                <div className="text-white mb-2">Chọn thời gian</div>
                <div 
                  className={`w-full bg-[#1E1E23] text-white rounded-lg p-3 cursor-pointer border border-[#3A3A42] ${showCalendar ? 'ring-2 ring-[#E33265]' : ''}`}
                  onClick={() => setShowCalendar(true)}
                  role="button"
                  aria-label="Chọn thời gian"
                >
                  {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {selectedTime}
                </div>
              </div>
            )}

            {/* Calendar Popup */}
            {showCalendar && publishTime === 'pick a time' && (
              <div
                ref={calendarRef}
                className="absolute left-full top-0 ml-[15px] bg-[#2A2A30] rounded-xl p-4 w-[360px] shadow-xl border border-[#3A3A42] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                tabIndex={0}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => { const d=new Date(selectedDate); d.setMonth(d.getMonth()-1); setSelectedDate(d) }} className="text-white hover:text-gray-300"><ChevronLeftIcon className="w-5 h-5" /></button>
                  <h3 className="text-white font-semibold">{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  <button onClick={() => { const d=new Date(selectedDate); d.setMonth(d.getMonth()+1); setSelectedDate(d) }} className="text-white hover:text-gray-300"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 text-center text-xs text-white/70 mb-2">
                  {vietnameseWeekdays.map((w) => (<div key={w} className="py-1">{w}</div>))}
                </div>
                {/* Month grid */}
                <div className="grid grid-cols-7 gap-1">
                  {getMonthGrid(selectedDate).flat().map((cell, idx) => {
                    const isSelected = cell.day === selectedDate.getDate()
                    return (
                      <button
                        key={idx}
                        disabled={!cell.day}
                        onClick={() => {
                          if (!cell.day) return
                          const d = new Date(selectedDate)
                          d.setDate(cell.day)
                          setSelectedDate(d)
                        }}
                        className={`h-9 rounded-md text-sm ${!cell.day ? 'opacity-30 cursor-default' : 'hover:bg-white/10'} ${isSelected ? 'bg-[#E33265]/20 text-white ring-1 ring-[#E33265]' : 'text-white/80'}`}
                      >
                        {cell.day || ''}
                      </button>
                    )
                  })}
                </div>
                {/* Time Input */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center bg-[#1E1E23] text-white rounded px-3 py-2 gap-2 border border-[#3A3A42]">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={timeHour}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2)
                        setTimeHour(v)
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmPickTime() }}
                      className="w-8 bg-transparent text-center"
                      placeholder="– –"
                      aria-label="Giờ"
                    />
                    <span>:</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={timeMinute}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2)
                        setTimeMinute(v)
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmPickTime() }}
                      className="w-8 bg-transparent text-center"
                      placeholder="– –"
                      aria-label="Phút"
                    />
                    <select
                      value={timeAmPm}
                      onChange={(e) => setTimeAmPm(e.target.value as 'AM'|'PM')}
                      className="bg-transparent"
                      aria-label="AM/PM"
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                  <button className="bg-[#E33265] text-white p-2 rounded active:bg-[#c52b57]" onClick={handleConfirmPickTime}>
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 border-[#E33265] text-white hover:bg-[#E33265]/10"
                onClick={() => setShowPublishModal(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1 bg-[#E33265] hover:bg-[#c52b57] text-white"
                onClick={() => { setShowPublishModal(false); onPublish(selectedPostId) }}
              >
                Đăng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
