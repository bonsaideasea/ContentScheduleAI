"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  PlusIcon,
  ImageIcon,
  VideoIcon,
  CalendarIcon,
  SparklesIcon,
  LightbulbIcon as LightBulbIcon,
  SendIcon,
  CopyIcon,
  X as CloseIcon,
  PlayIcon,
  BarChart3Icon,
  TrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
    Settings as SettingsIcon,
} from "lucide-react"

export default function CreatePage() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState("create")
  // Tabs for content creation. Start with no active posts.
  const [openPosts, setOpenPosts] = useState<Array<{ id: number; type: string }>>([])
  const [selectedPostId, setSelectedPostId] = useState<number>(0)
  const [postContents, setPostContents] = useState<Record<number, string>>({})
  const [showPostPicker, setShowPostPicker] = useState(false)
  const [isPostPickerVisible, setIsPostPickerVisible] = useState(false)
  const [showClonePicker, setShowClonePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const clonePickerRef = useRef<HTMLDivElement | null>(null)
  // Initialize active section from URL (?section=...)
  useEffect(() => {
    const s = searchParams.get("section")
    if (s) {
      setActiveSection(s as any)
    }
  }, [searchParams])
  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("Twitter")
  const [selectedAccount, setSelectedAccount] = useState("@whatevername")
  const [selectedAccountPic, setSelectedAccountPic] = useState<string>("/shego.jpg")
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [publishTime, setPublishTime] = useState("now")
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("12:07 AM")
  // Time input pieces for strict 12h format with AM/PM toggle
  const [timeHour, setTimeHour] = useState<string>("12")
  const [timeMinute, setTimeMinute] = useState<string>("07")
  const [timeAmPm, setTimeAmPm] = useState<'AM' | 'PM'>("AM")
  const calendarRef = useRef<HTMLDivElement | null>(null)
  const publishModalRef = useRef<HTMLDivElement | null>(null)
  const [isScheduleFocused, setIsScheduleFocused] = useState(false)
  const accountDropdownRef = useRef<HTMLDivElement | null>(null)
  // Chat model selector state and refs
  const [selectedChatModel, setSelectedChatModel] = useState<string>("ChatGPT")
  const [showModelMenu, setShowModelMenu] = useState<boolean>(false)
  const modelMenuRef = useRef<HTMLDivElement | null>(null)
  // Next free slot box removed; using a "Pick a time" summary box instead
  function handleConfirmPickTime() {
    // Close the calendar popover and keep the chosen date/time reflected in the summary box
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

  // Close publish modal on outside click or Escape
  useEffect(() => {
    if (!showPublishModal) return
    const handleDocMouseDown = (e: MouseEvent) => {
      const node = publishModalRef.current
      if (node && !node.contains(e.target as Node)) {
        setShowPublishModal(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPublishModal(false)
    }
    document.addEventListener('mousedown', handleDocMouseDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleDocMouseDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [showPublishModal])

  // Close model menu on outside click
  useEffect(() => {
    if (!showModelMenu) return
    const onDocClick = (e: MouseEvent) => {
      const node = modelMenuRef.current
      if (node && !node.contains(e.target as Node)) {
        setShowModelMenu(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showModelMenu])

  
  
  // Mock data for connected accounts per platform
  const connectedAccounts = {
    Twitter: [
      { username: "@whatevername", profilePic: "/shego.jpg", name: "Main Account" },
      { username: "@business", profilePic: "/shego.jpg", name: "Business Account" },
      { username: "@personal", profilePic: "/shego.jpg", name: "Personal Account" },
      { username: "@blackbird", profilePic: "/shego.jpg", name: "Blackbird" },
      { username: "@barleygrains", profilePic: "/shego.jpg", name: "Barley Grains" }
    ],
    Instagram: [
      { username: "@whatevername_ig", profilePic: "/shego.jpg", name: "Instagram Main" },
      { username: "@business_ig", profilePic: "/shego.jpg", name: "Business IG" }
    ],
    Facebook: [
      { username: "John Doe", profilePic: "/shego.jpg", name: "Facebook Profile" },
      { username: "Business Page", profilePic: "/shego.jpg", name: "Business Page" }
    ],
    LinkedIn: [
      { username: "John Doe", profilePic: "/shego.jpg", name: "LinkedIn Profile" }
    ]
  }
  // LLM model options for Chat panel selector
  const modelOptions = [
    "ChatGPT",
    "Claude Sonnet 4",
    "gpt-4.1",
    "o4-mini",
    "o3",
    "gpt-4o",
  ]

  // Helper to get accounts by platform safely
  function getAccountsForPlatform(platform: string) {
    const list = (connectedAccounts as any)[platform] as Array<{ username: string; profilePic: string; name: string }>
    return Array.isArray(list) ? list : []
  }

  // Derive current account info when needed
  const selectedAccountInfo = (() => {
    const accounts = getAccountsForPlatform(selectedPlatform)
    return accounts.find((a) => a.username === selectedAccount) || accounts[0]
  })()
  // Calendar view state: 'monthly' | 'weekly'
  const [calendarView, setCalendarView] = useState<'monthly' | 'weekly'>("monthly")
  // Vietnamese month navigation state for the calendar toolbar
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()) // 0-11
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  // Track clicked cells by full date key to avoid cross-month collisions (e.g., 1 of Sep vs 1 of Oct)
  const [clickedDays, setClickedDays] = useState<Set<string>>(new Set())
  // Drag and drop state for social media icons
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<{[key: number]: Array<{platform: string, time: string, status: string, noteType: 'red' | 'yellow' | 'green'}>}>({})
  // Today's date for pink circle indicator
  const today = new Date().getDate()
  // Calendar note popup state
  const [selectedNote, setSelectedNote] = useState<{dayNum: number, noteIndex: number} | null>(null)
  const [showNotePopup, setShowNotePopup] = useState(false)
  const [noteTime, setNoteTime] = useState({hour: '10', minute: '00', amPm: 'AM'})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notePopupPosition, setNotePopupPosition] = useState({x: 0, y: 0})
  const notePopupRef = useRef<HTMLDivElement>(null)
  // Calendar note content storage
  const [calendarNoteContent, setCalendarNoteContent] = useState<{[key: string]: string}>({})
  // Draft delete confirmation state
  const [showDraftDeleteConfirm, setShowDraftDeleteConfirm] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<number | null>(null)
  // Publish confirmation state
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [publishedPosts, setPublishedPosts] = useState<Array<{ id: number; content: string; platform: string; date: string; status: string }>>([])
  // Removed experimental calendar UI flag
  // Helper: Vietnamese month names "Tháng 1" .. "Tháng 12"
  const vietnameseMonths = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  // Helper: get number of days in month for simplistic grid
  function getDaysInMonth(year: number, monthIndex: number) {
    return new Date(year, monthIndex + 1, 0).getDate()
  }

  // Drag and drop handlers for social media icons
  const handleIconDragStart = (e: React.DragEvent, platform: string) => {
    setDraggedIcon(platform)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleCalendarNoteDragStart = (e: React.DragEvent, dayNum: number, noteIndex: number) => {
    console.log('Drag start triggered for day:', dayNum, 'note:', noteIndex)
    const event = calendarEvents[dayNum]?.[noteIndex]
    console.log('Event data:', event)
    if (event && (event.noteType === 'yellow' || event.noteType === 'green')) {
      console.log('Note is draggable, setting up drag data')
      const eventData = {
        sourceDay: dayNum,
        eventIndex: noteIndex,
        event: event
      }
      e.dataTransfer.setData('application/json', JSON.stringify(eventData))
      e.dataTransfer.effectAllowed = 'move'
      // Prevent click event during drag
      e.currentTarget.style.pointerEvents = 'none'
    } else {
      console.log('Note is not draggable (red note)')
      e.preventDefault() // Prevent dragging red notes
    }
  }

  const handleCalendarNoteDragEnd = (e: React.DragEvent) => {
    // Re-enable pointer events after drag
    e.currentTarget.style.pointerEvents = 'auto'
  }

  const handleCalendarDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleCalendarDrop = (e: React.DragEvent, dayNum: number) => {
    e.preventDefault()
    console.log('Drop triggered on day:', dayNum)
    const draggedEventData = e.dataTransfer.getData('application/json')
    console.log('Dragged event data:', draggedEventData)
    
    // Check if the date is in the past
    const currentDate = new Date()
    const todayDay = currentDate.getDate()
    const todayMonth = currentDate.getMonth()
    const todayYear = currentDate.getFullYear()
    
    // Only allow drops on today or future dates (same month and year)
    if (dayNum >= todayDay && currentMonth === todayMonth && currentYear === todayYear) {
      // If dragging an existing calendar note (yellow/green)
      if (draggedEventData) {
        try {
          const eventData = JSON.parse(draggedEventData)
          const { sourceDay, eventIndex, event } = eventData
          console.log('Moving event from day', sourceDay, 'to day', dayNum)
          
          // Remove from source day
          setCalendarEvents(prev => {
            const newEvents = { ...prev }
            if (newEvents[sourceDay]) {
              newEvents[sourceDay] = newEvents[sourceDay].filter((_, idx) => idx !== eventIndex)
              if (newEvents[sourceDay].length === 0) {
                delete newEvents[sourceDay]
              }
            }
            return newEvents
          })
          
          // Add to new day
          setCalendarEvents(prev => ({
            ...prev,
            [dayNum]: [...(prev[dayNum] || []), event]
          }))
          
          return
        } catch (error) {
          console.error('Error parsing dragged event data:', error)
        }
      }
      
      // If dragging a new social media icon
      if (draggedIcon) {
        console.log('Creating new event for icon:', draggedIcon)
        const newEvent = {
          platform: draggedIcon,
          time: '10:00',
          status: 'not scheduled',
          noteType: 'yellow' as 'red' | 'yellow' | 'green'
        }
        setCalendarEvents(prev => ({
          ...prev,
          [dayNum]: [...(prev[dayNum] || []), newEvent]
        }))
      }
    } else {
      console.log('Drop rejected - past date')
    }
    setDraggedIcon(null)
  }

  // Calendar note popup handlers
  const handleNoteClick = (dayNum: number, noteIndex: number, event: React.MouseEvent) => {
    // Get the note to check its type
    const note = calendarEvents[dayNum]?.[noteIndex]
    
    // Don't show popup if no note
    if (!note) {
      return
    }
    
    const rect = event.currentTarget.getBoundingClientRect()
    const popupWidth = 200 // Approximate popup width
    const popupHeight = 120 // Approximate popup height
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let x = rect.right + 2
    let y = rect.top
    
    // Adjust horizontal position if popup would go off-screen
    if (x + popupWidth > viewportWidth) {
      x = rect.left - popupWidth - 2
    }
    
    // Adjust vertical position if popup would go off-screen
    if (y + popupHeight > viewportHeight) {
      // Position popup above the calendar note instead of below
      y = rect.top - popupHeight - 5
    }
    
    // Ensure popup doesn't go above viewport
    if (y < 10) {
      y = 10
    }
    
    // Ensure popup doesn't go left of viewport
    if (x < 10) {
      x = 10
    }
    
    setNotePopupPosition({ x, y })
    setSelectedNote({dayNum, noteIndex})
    setShowNotePopup(true)
    // Set current time from the note
    if (note) {
      const timeParts = note.time.split(':')
      const hour = parseInt(timeParts[0])
      setNoteTime({
        hour: hour > 12 ? (hour - 12).toString().padStart(2, '0') : hour.toString().padStart(2, '0'),
        minute: timeParts[1],
        amPm: hour >= 12 ? 'PM' : 'AM'
      })
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (selectedNote) {
      setCalendarEvents(prev => {
        const newEvents = {...prev}
        if (newEvents[selectedNote.dayNum]) {
          newEvents[selectedNote.dayNum] = newEvents[selectedNote.dayNum].filter((_, index) => index !== selectedNote.noteIndex)
          if (newEvents[selectedNote.dayNum].length === 0) {
            delete newEvents[selectedNote.dayNum]
          }
        }
        return newEvents
      })
      setShowNotePopup(false)
      setSelectedNote(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  // Handle editing a draft - switch to create post and load content
  const handleEditDraft = (draft: { id: number; content: string; platform: string; date: string; status: string }) => {
    // Switch to create post section
    setActiveSection("create")
    
    // Create a new post tab for this platform if it doesn't exist
    const existingPost = openPosts.find(p => p.type === draft.platform)
    if (existingPost) {
      setSelectedPostId(existingPost.id)
    } else {
      const newPostId = Date.now()
      const newPost = {
        id: newPostId,
        type: draft.platform,
        characterLimit: draft.platform === 'Twitter' ? 280 : 2200
      }
      setOpenPosts(prev => [...prev, newPost])
      setSelectedPostId(newPostId)
    }
    
    // Load the draft content
    setPostContents(prev => ({
      ...prev,
      [selectedPostId]: draft.content
    }))
  }

  // Handle draft delete click
  const handleDraftDeleteClick = (draftId: number) => {
    setDraftToDelete(draftId)
    setShowDraftDeleteConfirm(true)
  }

  // Handle draft delete confirmation
  const handleDraftDeleteConfirm = () => {
    if (draftToDelete) {
      setDraftPosts(prev => prev.filter(draft => draft.id !== draftToDelete))
      setShowDraftDeleteConfirm(false)
      setDraftToDelete(null)
    }
  }

  // Handle draft delete cancellation
  const handleDraftDeleteCancel = () => {
    setShowDraftDeleteConfirm(false)
    setDraftToDelete(null)
  }

  // Click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notePopupRef.current && !notePopupRef.current.contains(event.target as Node)) {
        setShowNotePopup(false)
        setSelectedNote(null)
      }
    }

    if (showNotePopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotePopup])

  const handleUpdateTime = () => {
    if (selectedNote) {
      const newTime = `${noteTime.hour}:${noteTime.minute}`
      setCalendarEvents(prev => ({
        ...prev,
        [selectedNote.dayNum]: prev[selectedNote.dayNum].map((note, index) => 
          index === selectedNote.noteIndex 
            ? {...note, time: newTime}
            : note
        )
      }))
      setShowNotePopup(false)
      setSelectedNote(null)
    }
  }

  const handleCalendarNoteView = () => {
    if (selectedNote) {
      const { dayNum, noteIndex } = selectedNote
      const noteKey = `${dayNum}-${noteIndex}`
      const event = calendarEvents[dayNum]?.[noteIndex]
      
      // Set the active section to create post
      setActiveSection('create')
      
      // Set the active platform based on the calendar note
      if (event) {
        setSelectedPlatform(event.platform)
        
        // Load existing content if available
        const existingContent = calendarNoteContent[noteKey] || ''
        
        // Create a new post tab for this calendar note
        const newPostId = Date.now()
        setOpenPosts(prev => [...prev, { id: newPostId, type: event.platform }])
        setSelectedPostId(newPostId)
        setPostContents(prev => ({
          ...prev,
          [newPostId]: existingContent
        }))
        
        // Store the calendar note info for this post so we can save the icon later
        setCalendarNoteContent(prev => ({
          ...prev,
          [`${newPostId}-calendar-note`]: JSON.stringify({
            dayNum,
            noteIndex,
            platform: event.platform
          })
        }))
        
        // Close the popup
        setShowNotePopup(false)
      }
    }
  }

  const handleRedNoteView = () => {
    if (selectedNote) {
      const { dayNum, noteIndex } = selectedNote
      const event = calendarEvents[dayNum]?.[noteIndex]
      
      if (event) {
        // For red notes (posted), open external URL
        const postUrl = getPostUrl(event.platform, event)
        if (postUrl) {
          window.open(postUrl, '_blank')
        }
        
        // Close the popup
        setShowNotePopup(false)
      }
    }
  }

  const getPostUrl = (platform: string, note: any) => {
    // Generate external URLs based on platform
    // This is a placeholder - you'll need to implement actual URL generation
    // based on your post data structure
    switch (platform) {
      case 'Twitter':
        return `https://twitter.com/yourusername/status/123456789` // Replace with actual post ID
      case 'Instagram':
        return `https://instagram.com/p/123456789` // Replace with actual post ID
      case 'Facebook':
        return `https://facebook.com/yourpage/posts/123456789` // Replace with actual post ID
      case 'TikTok':
        return `https://tiktok.com/@yourusername/video/123456789` // Replace with actual post ID
      case 'YouTube':
        return `https://youtube.com/watch?v=123456789` // Replace with actual video ID
      case 'Pinterest':
        return `https://pinterest.com/pin/123456789` // Replace with actual pin ID
      case 'LinkedIn':
        return `https://linkedin.com/posts/yourcompany_123456789` // Replace with actual post ID
      case 'Threads':
        return `https://threads.net/@yourusername/post/123456789` // Replace with actual post ID
      case 'Bluesky':
        return `https://bsky.app/profile/yourusername/post/123456789` // Replace with actual post ID
      default:
        return null
    }
  }
  function goPrevMonth() {
    const prev = new Date(currentYear, currentMonth - 1, 1)
    setCurrentMonth(prev.getMonth())
    setCurrentYear(prev.getFullYear())
    // Keep selected day within range of new month
    const maxDay = getDaysInMonth(prev.getFullYear(), prev.getMonth())
    if (selectedDay > maxDay) setSelectedDay(maxDay)
  }
  function goNextMonth() {
    const next = new Date(currentYear, currentMonth + 1, 1)
    setCurrentMonth(next.getMonth())
    setCurrentYear(next.getFullYear())
    const maxDay = getDaysInMonth(next.getFullYear(), next.getMonth())
    if (selectedDay > maxDay) setSelectedDay(maxDay)
  }
  // Ref to close the Add Post dropdown on outside click
  const postPickerRef = useRef<HTMLDivElement | null>(null)
  const postPickerHideTimerRef = useRef<number | null>(null)

  function clearPostPickerHideTimer() {
    if (postPickerHideTimerRef.current) {
      clearTimeout(postPickerHideTimerRef.current)
      postPickerHideTimerRef.current = null
    }
  }

  function startPostPickerHideTimer() {
    clearPostPickerHideTimer()
    postPickerHideTimerRef.current = window.setTimeout(() => {
      setIsPostPickerVisible(false)
      // Hide the picker after fade animation completes
      setTimeout(() => setShowPostPicker(false), 80)
    }, 80)
  }

  function handlePostPickerMouseEnter() {
    clearPostPickerHideTimer()
    setShowPostPicker(true)
    setIsPostPickerVisible(true)
  }

  function clearSourcePickerHideTimer() {
    if (sourcePickerHideTimerRef.current) {
      clearTimeout(sourcePickerHideTimerRef.current)
      sourcePickerHideTimerRef.current = null
    }
  }

  function startSourcePickerHideTimer() {
    clearSourcePickerHideTimer()
    sourcePickerHideTimerRef.current = window.setTimeout(() => {
      setIsSourcePickerVisible(false)
      // Hide the picker after fade animation completes
      setTimeout(() => setIsAddingSource(false), 80)
    }, 80)
  }

  function handleSourcePickerMouseEnter() {
    clearSourcePickerHideTimer()
    setIsAddingSource(true)
    setIsSourcePickerVisible(true)
  }

  // Video upload handlers
  function handleVideoBoxClick() {
    setShowVideoModal(true)
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Selected file:', file.name)
      // Handle file upload logic here
    }
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      console.log('Dropped file:', file.name)
      // Handle file upload logic here
    }
  }

  // Image upload handlers for Add Media
  function handleImageFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Selected image:', file.name)
    }
  }
  function handleImageDragOver(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOverImage(true)
  }
  function handleImageDragLeave(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOverImage(false)
  }
  function handleImageDrop(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOverImage(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      console.log('Dropped image:', file.name)
    }
  }

  // Outside click handler removed per requirement; hover-based auto-hide is used instead.
  /**
   * UI state for Sources panel in the left sidebar
   */
  const [isAddingSource, setIsAddingSource] = useState(false)
  const [isSourcePickerVisible, setIsSourcePickerVisible] = useState(false)
  const [selectedSourceType, setSelectedSourceType] = useState<
    "text" | "article" | "youtube" | "tiktok" | "pdf" | "audio"
  >("text")
  const sourcePickerHideTimerRef = useRef<number | null>(null)
  // Video upload modal state
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  // Image upload modal state for Add Media
  const [showImageModal, setShowImageModal] = useState(false)
  const [isDragOverImage, setIsDragOverImage] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState("")
  function submitChat() {
    const text = chatInput.trim()
    if (!text) return
    setChatMessages((prev) => [...prev, { role: "user", content: text }])
    setChatInput("")
    
    // Add ChatGPT response (placeholder for now)
    // Optionally handle assistant response later
  }

  const characterLimits = {
    Facebook: 63206,
    Instagram: 2200,
    Twitter: 280,
    LinkedIn: 3000,
    TikTok: 2200,
    YouTube: 5000,
    Pinterest: 500,
    Threads: 500,
    Bluesky: 300,
    Blog: 20000,
  }


  // Draft posts state so new drafts appear in the Drafts section
  const [draftPosts, setDraftPosts] = useState<Array<{ id: number; content: string; platform: string; platformIcon?: string; date: string; status: string }>>([])

  function handleSaveDraft() {
    const active = openPosts.find((p) => p.id === selectedPostId)
    const content = postContents[selectedPostId] || ""
    if (!active || !content) return
    
    // Check if this post originated from a calendar note
    const calendarNoteInfo = calendarNoteContent[`${selectedPostId}-calendar-note`]
    let platformIcon = null
    
    if (calendarNoteInfo) {
      try {
        const noteData = JSON.parse(calendarNoteInfo)
        platformIcon = noteData.platform
      } catch (e) {
        console.error('Error parsing calendar note info:', e)
      }
    }
    
    const newDraft = {
      id: Date.now(),
      content,
      platform: active.type,
      platformIcon: platformIcon || active.type, // Include the platform icon
      date: new Date().toISOString().slice(0, 10),
      status: "draft",
    }

    // Check if a draft already exists for this platform
    const existingDraftIndex = draftPosts.findIndex(draft => draft.platform === active.type)
    
    if (existingDraftIndex !== -1) {
      // Update existing draft
      setDraftPosts(prev => prev.map((draft, index) => 
        index === existingDraftIndex ? newDraft : draft
      ))
    } else {
      // Create new draft only if none exists for this platform
      setDraftPosts(prev => [...prev, newDraft])
    }
  }

  // Save content to calendar note when user is working on a calendar note
  useEffect(() => {
    if (selectedNote) {
      const { dayNum, noteIndex } = selectedNote
      const noteKey = `${dayNum}-${noteIndex}`
      const content = postContents[selectedPostId] || ""
      if (content) {
        setCalendarNoteContent(prev => ({
          ...prev,
          [noteKey]: content
        }))
      }
    }
  }, [postContents, selectedPostId, selectedNote])

  const handlePublish = () => {
    // Sync the modal's selected platform to the active content tab's platform
    const active = openPosts.find((p) => p.id === selectedPostId)
    if (active?.type) {
      setSelectedPlatform(active.type)
      // If we have connected accounts for this platform, preselect the first one
      const list = (connectedAccounts as any)[active.type] as Array<{ username: string }>
      if (Array.isArray(list) && list.length > 0) {
        setSelectedAccount(list[0].username)
        const firstPic = (list as any)[0]?.profilePic || "/shego.jpg"
        setSelectedAccountPic(firstPic)
      }
    }
    setShowPublishModal(true)
  }

  const handlePublishConfirm = () => {
    console.log("handlePublishConfirm called")
    const active = openPosts.find((p) => p.id === selectedPostId)
    const content = postContents[selectedPostId] || ""
    
    console.log("Active post:", active)
    console.log("Content:", content)
    console.log("Publish time:", publishTime)
    
    if (!active || !content) {
      console.log("No active post or content, closing modal")
      setShowPublishModal(false)
      return
    }

    // If scheduled for later, create a green calendar note
    if (publishTime === "pick a time" && selectedDate && selectedTime) {
      const scheduledDate = new Date(selectedDate)
      const dayNum = scheduledDate.getDate()
      
      // Create calendar note
      const calendarNote = {
        platform: selectedPlatform,
        time: selectedTime,
        status: `scheduled for ${selectedTime}`,
        noteType: 'green' as const
      }
      
      // Add to calendar events
      setCalendarEvents(prev => ({
        ...prev,
        [dayNum]: [...(prev[dayNum] || []), calendarNote]
      }))
      
      // Save content to calendar note
      const noteKey = `${dayNum}-${(calendarEvents[dayNum] || []).length}`
      setCalendarNoteContent(prev => ({
        ...prev,
        [noteKey]: content
      }))
    }
    
    if (publishTime === "now" || publishTime === "Bây giờ" || publishTime === "now|Bây giờ") {
      console.log("Publishing immediately - Bây giờ selected")
      // Immediate publish - add to published posts
      const newPublishedPost = {
        id: Date.now(),
        content,
        platform: active.type,
        date: new Date().toISOString().slice(0, 10),
      status: "published",
      }
      console.log("Adding to published posts:", newPublishedPost)
      setPublishedPosts(prev => [...prev, newPublishedPost])
      
      // Create red calendar note for today (successfully posted)
      const today = new Date().getDate()
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      
                const redCalendarNote = {
                  platform: selectedPlatform,
                  time: currentTime,
                  status: `posted ${currentTime}`,
                  noteType: 'red' as const
                }
                
                console.log("Creating red calendar note with platform:", selectedPlatform)
                console.log("Calendar note object:", redCalendarNote)
                console.log("TikTok platform check:", selectedPlatform === 'TikTok')
      
      // Add to calendar events
      setCalendarEvents(prev => ({
        ...prev,
        [today]: [...(prev[today] || []), redCalendarNote]
      }))
      
      // Save content to calendar note
      const noteKey = `${today}-${(calendarEvents[today] || []).length}`
      setCalendarNoteContent(prev => ({
        ...prev,
        [noteKey]: content
      }))
      
                // Show confirmation popup
                console.log("Setting showPublishConfirm to true")
                setShowPublishConfirm(true)
                
                // Remove the published post tab after successful publish
                // Add a small delay to ensure the popup shows first
                setTimeout(() => {
                  // Remove the published post tab
                  const remainingPosts = openPosts.filter(post => post.id !== selectedPostId)
                  setOpenPosts(remainingPosts)
                  
                  // Clear the post content
                  setPostContents(prev => {
                    const newContents = { ...prev }
                    delete newContents[selectedPostId]
                    return newContents
                  })
                  
                  // Select the next available post if there are any remaining
                  if (remainingPosts.length > 0) {
                    setSelectedPostId(remainingPosts[0].id)
                  } else {
                    // No posts remaining - set to null or handle empty state
                    setSelectedPostId(0)
                  }
                }, 100)
    } else {
      // Scheduled publish - save as draft
      const newDraft = {
        id: Date.now(),
        content,
        platform: active.type,
        platformIcon: selectedPlatform,
        date: new Date().toISOString().slice(0, 10),
        status: "scheduled",
      }

      // Check if a draft already exists for this platform
      const existingDraftIndex = draftPosts.findIndex(draft => draft.platform === active.type)
      
      if (existingDraftIndex !== -1) {
        // Update existing draft
        setDraftPosts(prev => prev.map((draft, index) => 
          index === existingDraftIndex ? newDraft : draft
        ))
      } else {
        // Create new draft
        setDraftPosts(prev => [...prev, newDraft])
      }
    }

    // Here you would implement the actual publish logic
    console.log("Publishing post:", {
      platform: selectedPlatform,
      account: selectedAccount,
      time: publishTime,
      date: selectedDate,
      timeValue: selectedTime
    })
    
    setShowPublishModal(false)
  }

  // Close account dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showAccountDropdown) return
      const target = event.target as Node
      const inDropdown = accountDropdownRef.current?.contains(target)
      if (!inDropdown) setShowAccountDropdown(false)
    }
    
    if (showAccountDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAccountDropdown])

  const failedPosts = [
    {
      id: 1,
      content: "This post failed to publish due to API limits",
      platform: "Twitter",
      date: "2024-01-12",
      error: "Rate limit exceeded",
    },
    { id: 2, content: "Image upload failed", platform: "Instagram", date: "2024-01-11", error: "File too large" },
  ]

  const renderMainContent = () => {
    switch (activeSection) {
      case "settings":
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Kết nối mạng xã hội và đăng nhập</h2>
            <p className="text-white/70 mb-6">Connect to your social media and login.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[ 
                { name: 'Twitter (X)', icon: '/x.png', url: 'https://twitter.com/login' },
                { name: 'LinkedIn', icon: '/link.svg', url: 'https://www.linkedin.com/login' },
                { name: 'Facebook', icon: '/fb.svg', url: 'https://www.facebook.com/login' },
                { name: 'TikTok', icon: '/tiktok.png', url: 'https://www.tiktok.com/login' },
                { name: 'Instagram', icon: '/instagram.png', url: 'https://www.instagram.com/accounts/login/' },
                { name: 'Threads', icon: '/threads.png', url: 'https://www.threads.net/login' },
                { name: 'Bluesky', icon: '/bluesky.png', url: 'https://bsky.app' },
                { name: 'YouTube', icon: '/ytube.png', url: 'https://accounts.google.com/signin/v2/identifier' },
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(s.url, '_blank')}
                  className="flex items-center justify-center px-3 py-3 rounded-md hover:bg-white/5 transition-colors"
                >
                  <img src={s.icon} alt={s.name} className={`w-[36px] h-[36px] ${['Twitter (X)','Threads','TikTok'].includes(s.name) ? 'filter brightness-0 invert' : ''} cursor-pointer hover:opacity-80 transition-opacity`} />
                </button>
              ))}
                  </div>
          </div>
        )
      case "calendar":
        return (
          <div className="w-full max-w-none mx-0 mt-1">{/* moved up by 5px */}
            {/* Calendar toolbar - Vietnamese UI */}
            <div className="flex items-center justify-between mb-6 -mt-2.5">
              <div className="flex items-center gap-3">
                {/* Month selector with arrows */}
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="w-8 h-8 text-white/80 hover:text-white" onClick={goPrevMonth}>
                    ‹
                    </Button>
                  <div className="px-4 py-1 rounded-md border border-white/20 bg-white/10 text-white flex items-center justify-center">
                    {vietnameseMonths[currentMonth]}
                  </div>
                  <Button size="icon" variant="ghost" className="w-8 h-8 text-white/80 hover:text-white" onClick={goNextMonth}>
                    ›
                    </Button>
                  </div>
            </div>

              {/* Social media icons */}
              <div className="flex items-center gap-[30px] -ml-[70px]">
                <img 
                  src="/fb.svg" 
                  alt="Facebook" 
                  className="w-[36px] h-[36px] cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'Facebook')}
                />
                <img 
                  src="/instagram.png" 
                  alt="Instagram" 
                  className="w-[36px] h-[36px] cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'Instagram')}
                />
                <img 
                  src="/x.png" 
                  alt="Twitter" 
                  className="w-[36px] h-[36px] filter brightness-0 invert cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'Twitter')}
                />
                <img 
                  src="/threads.png" 
                  alt="Threads" 
                  className="w-[36px] h-[36px] filter brightness-0 invert cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'Threads')}
                />
                <img 
                  src="/bluesky.png" 
                  alt="Bluesky" 
                  className="w-[36px] h-[36px] cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'Bluesky')}
                />
                <img 
                  src="/ytube.png" 
                  alt="YouTube" 
                  className="w-[36px] h-[36px] cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'YouTube')}
                />
                <img 
                  src="/tiktok.png" 
                  alt="TikTok" 
                  className="w-[36px] h-[36px] cursor-grab hover:opacity-80 transition-opacity" 
                  draggable
                  onDragStart={(e) => handleIconDragStart(e, 'TikTok')}
                />
          </div>

              {/* View toggle translated */}
              <div className="inline-flex rounded-md overflow-hidden border border-white/10">
                <Button
                  variant={calendarView === 'monthly' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('monthly')}
                  className={calendarView === 'monthly' ? 'bg-white/10' : ''}
                >
                  Tháng
                  </Button>
                <Button
                  variant={calendarView === 'weekly' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('weekly')}
                  className={calendarView === 'weekly' ? 'bg-white/10' : ''}
                >
                  Tuần
                    </Button>
            </div>
          </div>

            {calendarView === 'monthly' ? (
                <div className="rounded-lg border border-white/10 overflow-hidden mt-4">
                {/* Weekday headers - Vietnamese: T2..CN */}
                <div className="grid grid-cols-7 bg-white/5">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-white/70 py-2">
                      {day}
                    </div>
              ))}
            </div>
                {/* Day grid */}
                <div className="grid grid-cols-7">
                  {Array.from({ length: 35 }, (_, i) => {
                    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
                    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
                    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Monday-first index
                    const totalCells = firstDayIndex + daysInMonth
                    const dayOffset = i - firstDayIndex
                    const cellDate = new Date(currentYear, currentMonth, 1)
                    cellDate.setDate(dayOffset + 1)
                    const dayNum = cellDate.getDate()
                    const inCurrentMonth = cellDate.getMonth() === currentMonth
                    const isSelected =
                      selectedYear === cellDate.getFullYear() &&
                      selectedMonth === cellDate.getMonth() &&
                      selectedDay === dayNum
                    const clickedKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}-${dayNum}`
                    const isClicked = clickedDays.has(clickedKey)
                    // Get events for this day from state
                    const dayEvents = calendarEvents[dayNum] || []
                    const cellEvents: Array<{ platform: string; label: string; color: string; text: string; icon: string }> = dayEvents.map(event => {
                      console.log("Rendering calendar note for platform:", event.platform)
                      console.log("TikTok check:", event.platform === 'TikTok')
                      console.log("Icon path:", event.platform === 'TikTok' ? '/tiktok.png' : 'not tiktok')
                      return {
                      platform: event.platform,
                      label: event.noteType === 'red' ? `posted ${event.time}` :
                             event.noteType === 'yellow' ? 'not scheduled' :
                             event.noteType === 'green' ? `scheduled for ${event.time}` :
                             `${event.status} ${event.time}`,
                      color: event.noteType === 'red' ? 'bg-[#FF4F4F]/20 border-[#FF4F4F]/40' :
                             event.noteType === 'yellow' ? 'bg-[#FACD5B]/20 border-[#FACD5B]/40' :
                             event.noteType === 'green' ? 'bg-[#8AE177]/20 border-[#8AE177]/40' :
                             'bg-white/10 border-white/20',
                      text: event.noteType === 'red' ? 'text-[#FF4F4F]' :
                            event.noteType === 'yellow' ? 'text-[#FACD5B]' :
                            event.noteType === 'green' ? 'text-[#8AE177]' :
                            'text-white/80',
                      icon: event.platform === 'Instagram' ? '/instagram.png' :
                            event.platform === 'Facebook' ? '/fb.svg' :
                            event.platform === 'Twitter' ? '/x.png' :
                            event.platform === 'Threads' ? '/threads.png' :
                            event.platform === 'Bluesky' ? '/bluesky.png' :
                            event.platform === 'YouTube' ? '/ytube.png' :
                            event.platform === 'TikTok' ? '/tiktok.png' :
                            event.platform === 'Pinterest' ? '/pinterest.svg' :
                            ''
                      }
                    })
        return (
                      <div
                        key={i}
                        className={`h-28 p-2 cursor-pointer ${
                          isClicked ? "border-2 border-[#E33265]" : "border-t border-b border-white/10"
                        } ${
                          isSelected ? "outline outline-2 outline-[#E33265]/60" : ""
                        }`}
                        onClick={() => {
                          // Allow clicking ANY visible date; record the full Y/M/D for selection and clicked key
                          setSelectedYear(cellDate.getFullYear())
                          setSelectedMonth(cellDate.getMonth())
                          setSelectedDay(dayNum)
                          setClickedDays(new Set([clickedKey]))
                        }}
                        onDragOver={handleCalendarDragOver}
                        onDrop={(e) => handleCalendarDrop(e, dayNum)}
                      >
              <div className="relative">
                          {dayNum === today && (
                            <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#E33265] rounded-full flex items-center justify-center">
                              <div className="text-xs text-white font-medium">{dayNum}</div>
              </div>
                          )}
                          <div className={`text-xs ${inCurrentMonth ? 'text-white/90' : 'text-white/40'}`}>{dayNum}</div>
            </div>
                        <div className="mt-2 space-y-1 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                          {cellEvents.map((ev, idx) => {
                            const event = calendarEvents[dayNum]?.[idx]
                            const isDraggable = event && (event.noteType === 'yellow' || event.noteType === 'green')
                            
        return (
                              <button
                                key={idx}
                                onClick={(e) => handleNoteClick(dayNum, idx, e)}
                                draggable={isDraggable}
                                onDragStart={(e) => handleCalendarNoteDragStart(e, dayNum, idx)}
                                onDragEnd={handleCalendarNoteDragEnd}
                                className={`inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-md border ${ev.color} ${ev.text} hover:opacity-80 transition-opacity ${isDraggable ? 'cursor-move' : 'cursor-pointer'} ${isDraggable ? 'hover:scale-105' : ''}`}
                              >
                                <img 
                                  src={ev.icon} 
                                  alt={ev.platform} 
                                  className={`w-4 h-4 ${ev.platform === 'Twitter' || ev.platform === 'Threads' || ev.platform === 'TikTok' ? 'filter brightness-0 invert' : ''}`}
                                />
                                <span className="truncate">{ev.label}</span>
                              </button>
                            )
                          })}
            </div>
          </div>
        )
                  })}
                </div>
                </div>
            ) : (
            <div className="mb-4">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <Card key={i} className="bg-gray-900/50 border-white/10 p-3 h-56 flex flex-col text-xs">
                      <div className="text-gray-400 mb-2">Ngày {i + 1}</div>
                      <div className="space-y-2">
                        {i === 1 && (
                          <div className="bg-[#E33265]/20 border border-[#E33265]/30 text-[#E33265] rounded px-2 py-1">
                            10:00 • Bài đăng: Mẹo sản phẩm
                          </div>
                        )}
                        {i === 3 && (
                          <div className="bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded px-2 py-1">
                            14:30 • Story: Hậu trường
                          </div>
                        )}
                        {i !== 1 && i !== 3 && (
                          <div className="text-gray-500">Không có lịch</div>
                        )}
                      </div>
                </Card>
              ))}
            </div>
          </div>
            )}

            {/* Calendar Note Popup */}
            {showNotePopup && selectedNote && (() => {
              const { dayNum, noteIndex } = selectedNote
              const note = calendarEvents[dayNum]?.[noteIndex]
              const isRedNote = note?.noteType === 'red'
              
        return (
                <div 
                  ref={notePopupRef}
                  className="fixed z-50 bg-[#190F2F] rounded-lg pt-4 pb-[5px] pl-4 pr-4 border border-white/10 shadow-lg"
                  style={{
                    left: `${notePopupPosition.x}px`,
                    top: `${notePopupPosition.y}px`
                  }}
                >
                  {/* X Button - Top Right */}
                  <button
                    onClick={() => setShowNotePopup(false)}
                    className="absolute top-[4px] right-[3px] w-6 h-6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded"
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-4 mt-[8px]">
                    {isRedNote ? (
                      /* Red Note - Only View Icon */
                      <button
                        onClick={handleRedNoteView}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    ) : (
                      /* Yellow/Green Notes - Time Selection, View, and Delete Icons */
                      <>
                        {/* Time Selection - No Labels */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={noteTime.hour}
                            onChange={(e) => setNoteTime(prev => ({...prev, hour: e.target.value}))}
                            className="w-12 bg-gray-800/50 text-white rounded px-2 py-1 text-center"
                            placeholder="10"
                            maxLength={2}
                          />
                          <span className="text-white">:</span>
                          <input
                            type="text"
                            value={noteTime.minute}
                            onChange={(e) => setNoteTime(prev => ({...prev, minute: e.target.value}))}
                            className="w-12 bg-gray-800/50 text-white rounded px-2 py-1 text-center"
                            placeholder="00"
                            maxLength={2}
                          />
                          <select
                            value={noteTime.amPm}
                            onChange={(e) => setNoteTime(prev => ({...prev, amPm: e.target.value}))}
                            className="bg-gray-800/50 text-white rounded px-2 py-1"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
              </div>

                        {/* View Icon */}
                        <button
                          onClick={handleCalendarNoteView}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Delete Icon */}
                        <button
                          onClick={handleDeleteClick}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-red-500/20 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
            </div>
            </div>
              )
            })()}

            {/* Delete Confirmation Popup */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#190F2F] rounded-lg p-6 w-80 border border-white/10">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">Confirm delete</h3>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleConfirmDelete}
                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "drafts":
        return (
          <div className="w-full max-w-none mx-0">
            <h2 className="text-2xl font-bold mb-6">Bản nháp</h2>
            <div className="space-y-[1px]">
              {draftPosts.map((post) => (
                <div key={post.id} className="group rounded-xl hover:bg-[#E33265]/70 transition-colors">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: platform icon + content */}
                    <div className="flex items-center gap-3">
                      {post.platformIcon === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platformIcon === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px]" />}
                      {post.platformIcon === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px]" />}
                      {post.platformIcon === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px]" />}
                      {post.platformIcon === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platformIcon === 'Bluesky' && <img src="/bluesky.png" alt="Bluesky" className="w-[27px] h-[27px]" />}
                      {post.platformIcon === 'YouTube' && <img src="/ytube.png" alt="YouTube" className="w-[27px] h-[27px]" />}
                      {post.platformIcon === 'TikTok' && <img src="/tiktok.png" alt="TikTok" className="w-[27px] h-[27px]" />}
                      {/* Fallback to platform if platformIcon is not available */}
                      {!post.platformIcon && post.platform === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {!post.platformIcon && post.platform === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px]" />}
                      {!post.platformIcon && post.platform === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px]" />}
                      {!post.platformIcon && post.platform === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px]" />}
                      {!post.platformIcon && post.platform === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      <div className="text-white/90 truncate flex-1 mr-5">{post.content}</div>
                    </div>
                    {/* Right: date/time stub and action */}
                    <div className="flex items-center text-white/80">
                      <span className="text-sm whitespace-nowrap mr-[10px]">{post.date}</span>
                      <button
                        onClick={() => handleEditDraft(post)}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-blue-400 hover:bg-blue-400/20 rounded transition-colors mr-[10px] ml-[2px]"
                      >
                        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDraftDeleteClick(post.id)}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "published":
        return (
          <div className="w-full max-w-none mx-0">
            <h2 className="text-2xl font-bold mb-6">Published Posts</h2>
            <div className="space-y-[1px]">
              {publishedPosts.map((post) => (
                <div key={post.id} className="group rounded-xl hover:bg-[#E33265]/70 transition-colors">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: platform icon + content */}
                    <div className="flex items-center gap-3">
                      {post.platform === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platform === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px]" />}
                      {post.platform === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px]" />}
                      {post.platform === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px]" />}
                      {post.platform === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platform === 'TikTok' && <img src="/tiktok.png" alt="TikTok" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platform === 'Bluesky' && <img src="/bluesky.png" alt="Bluesky" className="w-[27px] h-[27px]" />}
                      {post.platform === 'YouTube' && <img src="/ytube.png" alt="YouTube" className="w-[27px] h-[27px]" />}
                      {post.platform === 'Pinterest' && <img src="/pinterest.svg" alt="Pinterest" className="w-[27px] h-[27px]" />}
                      <div className="text-white/90">{post.content}</div>
                    </div>
                    {/* Right: date/time stub and action */}
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-sm">{post.date}</span>
                      <Button size="lg" variant="outline" className="bg-transparent text-white/90 border-white/20 hover:bg-white/10 px-5 py-2.5">Xem</Button>
                  </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Draft Delete Confirmation Modal */}
            {showDraftDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#190F2F] rounded-lg p-6 w-80 border border-white/10">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">Confirm delete</h3>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleDraftDeleteConfirm}
                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleDraftDeleteCancel}
                        className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )

      case "failed":
        return (
          <div className="w-full max-w-none mx-0">
            <h2 className="text-2xl font-bold mb-6">Failed Posts</h2>
            <div className="space-y-[1px]">
              {failedPosts.map((post) => (
                <div key={post.id} className="group rounded-xl hover:bg-[#E33265]/70 transition-colors">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: platform icon + content */}
                    <div className="flex items-center gap-3">
                      {post.platform === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platform === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px]" />}
                      {post.platform === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px]" />}
                      {post.platform === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px]" />}
                      {post.platform === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platform === 'TikTok' && <img src="/tiktok.png" alt="TikTok" className="w-[27px] h-[27px] filter brightness-0 invert" />}
                      {post.platform === 'Bluesky' && <img src="/bluesky.png" alt="Bluesky" className="w-[27px] h-[27px]" />}
                      {post.platform === 'YouTube' && <img src="/ytube.png" alt="YouTube" className="w-[27px] h-[27px]" />}
                      {post.platform === 'Pinterest' && <img src="/pinterest.svg" alt="Pinterest" className="w-[27px] h-[27px]" />}
                      <div className="text-white/90">{post.content}</div>
                    </div>
                    {/* Right: date/time stub and action */}
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-sm">{post.date}</span>
                      <Button size="lg" variant="outline" className="bg-transparent text-white/90 border-white/20 hover:bg-white/10 px-5 py-2.5">Thử lại</Button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "videos":
        return (
          <div className="w-full max-w-none mx-0">
            {/* Quick start */}
            <h2 className="text-lg font-semibold mb-3">Bắt đầu nhanh</h2>

            {/* Feature tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Card 
                className="bg-[#180F2E] border-white/10 p-4 flex items-center gap-3 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
                onClick={handleVideoBoxClick}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-300 flex items-center justify-center text-sm">cc</div>
                  <div>
                    <div className="text-m font-medium text-white">Tạo phụ đề</div>
                    <div className="text-sm text-white mt-[10px]">Thêm phụ đề và b-rolls</div>
                  </div>
                </Card>
              <Card 
                className="bg-[#180F2E] border-white/10 p-4 flex items-center gap-3 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
                onClick={handleVideoBoxClick}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-300 flex items-center justify-center text-sm">✂</div>
                  <div>
                    <div className="text-m font-medium text-white">Cắt ghép video</div>
                    <div className="text-sm text-white mt-[10px]">Kết hợp nhiều clip</div>
            </div>
              </Card>
              <Card 
                className="bg-[#180F2E] border-white/10 p-4 flex items-center gap-3 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
                onClick={handleVideoBoxClick}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-300 flex items-center justify-center text-sm">🎞</div>
                  <div>
                    <div className="text-m font-medium text-white">Extract Video Clips</div>
                    <div className="text-sm text-white mt-[10px]">Trích clip từ video dài</div>
                  </div>
              </Card>
            </div>

            {/* Action chips row */}
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                <Card 
                  className="bg-[#180F2E] border-white/10 p-3 flex items-center gap-2 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
                  onClick={handleVideoBoxClick}
                >
                  <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-300 flex items-center justify-center text-xs">◎</div>
                  <div className="text-sm text-white">Tạo B-rolls</div>
                </Card>
                <Card 
                  className="bg-[#180F2E] border-white/10 p-3 flex items-center gap-2 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
                  onClick={handleVideoBoxClick}
                >
                  <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-300 flex items-center justify-center text-xs">译</div>
                  <div className="text-sm text-white">Dịch phụ đề</div>
                </Card>
                  </div>
            </div>

            {/* Projects header with search */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">1 Dự án</div>
              <div className="relative w-60">
                <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input placeholder="Tìm kiếm..." className="pl-9 bg-gray-900/50 border-white/10 h-9 text-sm" />
              </div>
            </div>

            {/* Project list item (example) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <Card 
                className="bg-[#180F2E] border-white/10 p-0 overflow-hidden hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
                onClick={handleVideoBoxClick}
              >
                <div className="relative w-full h-32 bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <PlayIcon className="w-6 h-6" />
                  </div>
                  <div className="absolute left-2 top-2 text-[10px] bg-red-500 text-white rounded-full px-2 py-0.5">Failed</div>
                  <div className="absolute right-2 bottom-2 text-[10px] bg-black/60 text-white rounded-md px-2 py-0.5">00:08</div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-white">IMG_8252</div>
                  <div className="text-xs text-white mt-1">Hôm nay</div>
                </div>
              </Card>
            </div>
          </div>
        )

      case "api":
        return (
          <div className="w-full max-w-none mx-0">
            <h2 className="text-2xl font-bold mb-6">API Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">API Calls</span>
                </div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-green-400">+12% from last month</div>
              </Card>
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Success Rate</span>
                </div>
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-sm text-green-400">+0.3% from last month</div>
              </Card>
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Rate Limit</span>
                </div>
                <div className="text-2xl font-bold">750/1000</div>
                <div className="text-sm text-gray-400">Resets in 2h 15m</div>
              </Card>
            </div>
            <Card className="bg-gray-900/50 border-white/10 p-4">
              <h3 className="font-semibold mb-4">API Keys</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                  <span>Production Key</span>
                  <Button size="sm" variant="outline">
                    Regenerate
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                  <span>Development Key</span>
                  <Button size="sm" variant="outline">
                    Regenerate
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )

      case "coach":
        return (
          <div className="max-w-4xl mx-auto flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">Viral AI Coach</h2>
            <Card className="bg-gray-900/50 border-white/10 p-6 mb-6">
              <h3 className="font-semibold mb-4">Content Performance Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Engagement Rate</span>
                  <span className="text-green-400">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Optimal Posting Time</span>
                  <span className="text-blue-400">2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Top Performing Hashtags</span>
                  <span className="text-purple-400">#marketing #AI #growth</span>
                </div>
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-white/10 p-6">
              <h3 className="font-semibold mb-4">AI Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                  <p className="text-sm">Try adding more visual content to increase engagement by 23%</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="text-sm">Your audience is most active on weekdays between 1-3 PM</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-sm">Consider using trending hashtags: #TechTrends #Innovation</p>
                </div>
              </div>
            </Card>
          </div>
        )

      default:
        return (
          <div className="max-w-4xl mx-auto flex flex-col h-full">
            {/* Tabs row: dynamic per openPosts */}
            <div className="flex items-center gap-3 mb-4">
              {openPosts.map((p) => (
                <div key={p.id} className={`flex items-center gap-2 px-3 py-1 rounded-md border ${selectedPostId === p.id ? "border-[#E33265] text-white" : "border-white/10 text-gray-300"}`}>
                  <button
                    onClick={() => setSelectedPostId(p.id)}
                    className="text-sm"
                  >
                    {p.type}
                  </button>
                  <button
                    aria-label="Close tab"
                    className="p-1 rounded hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      const remaining = openPosts.filter((op) => op.id !== p.id)
                      setOpenPosts(remaining)
                      const nextId = remaining.length > 0 ? remaining[0].id : 0
                      setSelectedPostId(nextId)
                      setPostContents((pc) => {
                        const nc = { ...pc }
                        delete (nc as any)[p.id]
                        return nc
                      })
                    }}
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div
                className="relative"
                ref={postPickerRef}
                onMouseEnter={handlePostPickerMouseEnter}
                onMouseLeave={startPostPickerHideTimer}
              >
                <Button variant="ghost" size="sm">
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Post
              </Button>
                {showPostPicker && (
                  <div 
                    className={`absolute z-20 mt-2 w-[13.75rem] bg-[#0F111A] border border-white/10 rounded-lg shadow-lg p-3 transition-opacity duration-75 ${
                      isPostPickerVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="space-y-1">
                      {[
                        { name: "Twitter", icon: "/x.png" },
                        { name: "Instagram", icon: "/instagram.png" },
                        { name: "LinkedIn", icon: "/link.svg" },
                        { name: "Facebook", icon: "/fb.svg" },
                        { name: "Pinterest", icon: "/pinterest.svg" },
                        { name: "Tiktok", icon: "/tiktok.png" },
                        { name: "Threads", icon: "/threads.png" },
                        { name: "Bluesky", icon: "/bluesky.png" },
                        { name: "YouTube", icon: "/ytube.png" },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const newId = Date.now()
                            setOpenPosts((prev) => [...prev, { id: newId, type: item.name }])
                            setPostContents((pc) => ({ ...pc, [newId]: "" }))
                            setSelectedPostId(newId)
                            setShowPostPicker(false)
                          }}
                          className="w-full text-left px-4 py-3 rounded-md hover:bg-white/5 text-base text-gray-200 flex items-center gap-4"
                        >
                          {item.icon && (
                            <img
                              src={item.icon}
                              alt=""
                              className={`w-7 h-7 ${["Twitter", "Threads"].includes(item.name) ? "filter brightness-0 invert" : ""}`}
                            />
                          )}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Editor for the selected tab or empty state */}
            <Card className="bg-gray-900/50 border-white/10 p-6 flex-1 flex flex-col">
              {selectedPostId === 0 || openPosts.length === 0 ? (
                /* Empty state when no posts are open */
                <div className="flex-1 flex items-center justify-center">
                  <Button 
                    onClick={() => {
                      setShowPostPicker(true)
                      setIsPostPickerVisible(true)
                    }}
                    className="bg-[#E33265] hover:bg-[#c52b57] text-white"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tạo bài viết
                  </Button>
                </div>
              ) : (
                /* Editor when a post is selected */
                <div className="relative flex-1 overflow-hidden">
              <Textarea
                    placeholder={`Bạn muốn chia sẻ gì trên ${openPosts.find((p) => p.id === selectedPostId)?.type || "bài viết"}?`}
                    value={postContents[selectedPostId] || ""}
                    onChange={(e) => setPostContents({ ...postContents, [selectedPostId]: e.target.value })}
                    className="h-full bg-transparent border-none resize-none text-white placeholder:text-gray-500 focus:ring-0 pr-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                  />
                  {/* Character count overlay inside textarea area */}
                  <div className="pointer-events-none absolute right-0 bottom-0 translate-y-full mt-1 pt-[12px] text-xs text-gray-400">
                    {(postContents[selectedPostId] || "").length}/
                    {characterLimits[(openPosts.find((p) => p.id === selectedPostId)?.type as keyof typeof characterLimits) || "Facebook"]}
                  {" "}ký tự
                </div>
              </div>

              )}
              
              {/* Action buttons - only show when there's an active post */}
              {selectedPostId !== 0 && openPosts.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowImageModal(true)}
                    className="h-9 px-4 py-2 border-blue-400 text-blue-200 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-600/40"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Thêm ảnh
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative" onMouseLeave={() => setShowClonePicker(false)}>
                    <Button
                      variant="outline"
                      className="h-9 px-4 py-2 border-[#E33265] text-white hover:bg-[#E33265] hover:text-white active:bg-[#c52b57]"
                      onClick={() => setShowClonePicker((v)=>!v)}
                    >
                    <CopyIcon className="w-4 h-4 mr-1" />
                      Nhân bản
                  </Button>
                    {showClonePicker && (
                      <div className="absolute z-20 bottom-full mb-2 right-0 w-[13.75rem] bg-[#0F111A] border border-white/10 rounded-lg shadow-lg p-3" onMouseEnter={() => setShowClonePicker(true)} onMouseLeave={() => setShowClonePicker(false)}>
                        <div className="space-y-1">
                          {[
                            { name: "Twitter", icon: "/x.png" },
                            { name: "Instagram", icon: "/instagram.png" },
                            { name: "LinkedIn", icon: "/link.svg" },
                            { name: "Facebook", icon: "/fb.svg" },
                            { name: "Pinterest", icon: "/pinterest.svg" },
                            { name: "Tiktok", icon: "/tiktok.png" },
                            { name: "Threads", icon: "/threads.png" },
                            { name: "Bluesky", icon: "/bluesky.png" },
                            { name: "YouTube", icon: "/ytube.png" },
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                const newId = Date.now()
                                setOpenPosts((prev) => [...prev, { id: newId, type: item.name }])
                                setPostContents((pc) => ({ ...pc, [newId]: "" }))
                                setSelectedPostId(newId)
                                setShowClonePicker(false)
                              }}
                              className="w-full text-left px-4 py-3 rounded-md hover:bg-white/5 text-base text-gray-200 flex items-center gap-4"
                            >
                              {item.icon && (
                                <img
                                  src={item.icon}
                                  alt=""
                                  className={`w-7 h-7 ${["Twitter", "Threads"].includes(item.name) ? "filter brightness-0 invert" : ""}`}
                                />
                              )}
                              <span>{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="h-9 px-4 py-2 border-[#E33265] text-white hover:bg-[#E33265] hover:text-white active:bg-[#c52b57]" onClick={handleSaveDraft}>
                    Lưu
                  </Button>
                  <Button className="bg-[#E33265] hover:bg-[#c52b57]" onClick={handlePublish}>
                    <SendIcon className="w-4 h-4 mr-1" />
                    Đăng
                  </Button>
                </div>
              </div>
              )}
            </Card>

            {/* Publish Confirmation Modal - inside Create Post section */}
            {showPublishConfirm && (
              <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowPublishConfirm(false)
                  }
                }}
              >
                <div 
                  className="bg-[#190F2F] rounded-lg p-6 w-80 border border-white/10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      setShowPublishConfirm(false)
                    }
                  }}
                  tabIndex={0}
                  autoFocus
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
            </div>
                    <h3 className="text-lg font-semibold text-white mb-4">Your post was published!</h3>
                    <button
                      onClick={() => setShowPublishConfirm(false)}
                      className="bg-[#E33265] text-white px-6 py-2 rounded hover:bg-[#c52b57] transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="h-screen bg-[#0A0C18] text-white">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-white/10 p-4 pt-[30px]">
          <nav className="space-y-2">
            <Button
              variant={activeSection === "create" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeSection === "create"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("create"); window.history.pushState(null, "", "/create") }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Tạo bài viết
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left ${
                activeSection === "calendar" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("calendar"); window.history.pushState(null, "", "/lich") }}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Lịch
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "drafts" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("drafts"); window.history.pushState(null, "", "/ban-nhap") }}
            >
              <span className="w-4 h-4 mr-2">📝</span>
              Bản nháp
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "published" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("published"); window.history.pushState(null, "", "/bai-da-dang") }}
            >
              <SendIcon className="w-4 h-4 mr-2" />
              Bài đã đăng
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "failed" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("failed"); window.history.pushState(null, "", "/bai-loi") }}
            >
              <span className="w-4 h-4 mr-2 text-red-400">⚠</span>
              Bài lỗi
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "videos" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("videos"); window.history.pushState(null, "", "/videos") }}
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "api" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveSection("api"); window.history.pushState(null, "", "/api-dashboard") }}
            >
              <span className="w-4 h-4 mr-2">⚡</span>
              Bảng điều khiển API
            </Button>
          </nav>

          {/* Settings */}
          <div className="mb-4">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeSection === 'settings' ? 'text-purple-300 bg-purple-500/10' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setActiveSection('settings'); window.history.pushState(null, '', '/settings') }}
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Cài đặt
            </Button>
          </div>

          {/* Sources Section (hover to show panel) */}
          <div
            onMouseEnter={handleSourcePickerMouseEnter}
            onMouseLeave={startSourcePickerHideTimer}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-gray-300">Nguồn</h4>
            <Button
                size="sm"
              variant="ghost"
                className="text-xs text-gray-200 hover:text-white px-2 py-1"
                // Hover reveals the panel; click not required
              >
                + Thêm nguồn
              </Button>
            </div>

            {isAddingSource && (
              <div 
                className={`border border-white/10 rounded-md p-3 bg-gray-900/50 transition-opacity duration-75 ${
                  isSourcePickerVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Source type selector */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { key: "text", label: "Text" },
                    { key: "article", label: "Article Link" },
                    { key: "youtube", label: "YouTube" },
                    { key: "tiktok", label: "TikTok" },
                    { key: "pdf", label: "PDF" },
                    { key: "audio", label: "Audio" },
                  ].map((t) => (
                    <Button
                      key={t.key}
                      size="sm"
                      variant={selectedSourceType === (t.key as any) ? "secondary" : "ghost"}
                      className={selectedSourceType === (t.key as any) ? "bg-white/10" : ""}
                      onClick={() => setSelectedSourceType(t.key as any)}
                    >
                      {t.label}
            </Button>
                  ))}
                </div>

                {/* Placeholder input area depending on type */}
                <div className="space-y-2">
                  {selectedSourceType === "text" && (
                    <Textarea placeholder="Paste or type your text source..." className="bg-gray-900/50 border-white/10" />
                  )}
                  {selectedSourceType !== "text" && (
                    <Input
                      placeholder={
                        selectedSourceType === "article"
                          ? "Paste article URL..."
                          : selectedSourceType === "youtube"
                          ? "Paste YouTube link..."
                          : selectedSourceType === "tiktok"
                          ? "Paste TikTok link..."
                          : selectedSourceType === "pdf"
                          ? "Paste PDF link..."
                          : "Paste audio link..."
                      }
                      className="bg-gray-900/50 border-white/10"
                    />
                  )}

                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="bg-[#E33265] hover:bg-[#c52b57]">Save</Button>
                    <Button size="sm" variant="outline" className="bg-transparent" onClick={() => setIsAddingSource(false)}>
                      Cancel
            </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Content Creation - add 30px top padding */}
          <div className={`${activeSection === "create" ? "w-[calc(100vw-656px)]" : "w-[calc(100vw-256px)]"} p-6 pt-[30px] h-full overflow-hidden`}>{renderMainContent()}</div>

          {/* AI Assistant Panel (only shown for Create Post) */}
          {activeSection === "create" && (
          <div className="w-[400px] border-l border-white/10 pt-[25px] px-4 pb-[24px]">
            <Card className="bg-gray-900/50 border-white/10 h-full flex flex-col">
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
                        <div className="absolute mt-2 w-56 bg-[#0F111A] border border-white/10 rounded-md shadow-lg py-2 z-20">
                          {["ChatGPT","Claude Sonnet 4","gpt-4.1","o4-mini","o3","gpt-4o"].map((m) => (
                            <button
                              key={m}
                              onClick={() => { setSelectedChatModel(m); setShowModelMenu(false) }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${selectedChatModel === m ? 'text-white' : 'text-white/80'}`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
              </div>

              <div className="h-[calc(100%-130px)] p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div className="space-y-4 min-h-0">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`text-sm ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div className={`rounded-lg p-3 max-w-[80%] break-words ${
                        message.role === "user" 
                          ? "bg-[#E33265] text-white ml-auto inline-block" 
                          : "bg-gray-800/50 text-white inline-block"
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat input area */}
              <div className="border-t border-white/10 relative pt-[5px] pl-[9px] pr-[5px]">
                <textarea
                  placeholder="Tôi là trợ lý viết mới của bạn. Bạn muốn viết về điều gì?"
                  className="w-full h-[100px] bg-transparent border-none outline-none resize-none text-white placeholder-gray-400 text-sm"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      submitChat()
                    }
                  }}
                />
              </div>
            </Card>
          </div>
          )}
        </div>
      </div>

      {/* Video Upload Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0F111A] border border-white/10 rounded-lg p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Generate captions with AI</h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Video Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-[#E33265] bg-[#E33265]/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-orange-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-white mb-2">
                Drop or <button className="underline font-medium">browse your video</button>
              </p>
              <p className="text-sm text-gray-400">
                MP4 or MOV, Max length: 5.00 min Max size: 2GB
              </p>
              
              {/* Hidden file input */}
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer"
              >
                <span className="sr-only">Upload video</span>
              </label>
            </div>

            {/* Sample Video Section */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">
                Or try this sample video 👉
              </p>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center">
                  <PlayIcon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Demo</div>
                  <div className="text-xs text-gray-400">32s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal for Add Media */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#190F2F] border border-white/10 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Share some pictures</h2>
              <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOverImage ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
            >
              <div className="text-blue-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <p className="text-white mb-2">Drop images or <button className="underline font-medium">browse</button></p>
              <p className="text-sm text-gray-400">PNG or JPG, Max size: 10MB</p>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageFileSelect} className="hidden" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="sr-only">Upload image</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={publishModalRef} className="bg-[#190F2F] rounded-2xl p-6 w-96 max-w-[90vw] relative">
            {/* Platform Selection */}
            <div className="mb-4">
              {/* Account Selection with Platform Icon */}
              <div className="flex items-center gap-6 mb-4 pl-[9px]">
                {/* Platform Icon - raw icon only, no background box, match avatar 32x32 */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {selectedPlatform === 'Twitter' && (
                    <img src="/x.png" alt="Twitter" className="w-8 h-8 filter brightness-0 invert" />
                  )}
                  {selectedPlatform === 'Instagram' && (
                    <img src="/instagram.png" alt="Instagram" className="w-8 h-8" />
                  )}
                  {selectedPlatform === 'Facebook' && (
                    <img src="/fb.svg" alt="Facebook" className="w-8 h-8" />
                  )}
                  {selectedPlatform === 'LinkedIn' && (
                    <img src="/link.svg" alt="LinkedIn" className="w-8 h-8" />
                  )}
                  {selectedPlatform === 'Threads' && (
                    <img src="/threads.png" alt="Threads" className="w-8 h-8 filter brightness-0 invert" />
                  )}
                  {selectedPlatform === 'Bluesky' && (
                    <img src="/bluesky.png" alt="Bluesky" className="w-8 h-8" />
                  )}
                  {selectedPlatform === 'YouTube' && (
                    <img src="/ytube.png" alt="YouTube" className="w-8 h-8" />
                  )}
                  {(['Tiktok','TikTok'].includes(selectedPlatform as any)) && (
                    <img src="/tiktok.png" alt="TikTok" className="w-8 h-8" />
                  )}
                  {selectedPlatform === 'Pinterest' && (
                    <img src="/pinterest.svg" alt="Pinterest" className="w-8 h-8" />
                  )}
                </div>
                {/* Account Selection Box */}
                <div className="flex-1 relative">
                  <div 
                    className={`flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 h-12 cursor-pointer hover:bg-gray-700/50 transition-colors ${showAccountDropdown ? 'ring-2 ring-[#E33265]' : ''}`}
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={selectedAccountPic || selectedAccountInfo?.profilePic || "/shego.jpg"} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white flex-1">{selectedAccount}</span>
                    <div className="flex flex-col">
                      <ChevronUpIcon className="w-4 h-4 text-white" />
                      <ChevronDownIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Account Dropdown: only show if more than one account for platform */}
                  {showAccountDropdown && getAccountsForPlatform(selectedPlatform).length > 1 && (
                    <div ref={accountDropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg border border-gray-700 z-10 max-h-48 overflow-y-auto">
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

              {/* Publishing Schedule */}
              <div className="mb-4">
                <p className="text-white mb-2">Khi nào bạn muốn đăng nó?</p>
                <div className={`relative rounded-lg ${isScheduleFocused ? 'ring-2 ring-[#E33265]' : ''}`}>
                  <select 
                    value={publishTime} 
                    onChange={(e) => {
                      setPublishTime(e.target.value)
                      if (e.target.value === "pick a time") {
                        setShowCalendar(true)
                      } else {
                        setShowCalendar(false)
                      }
                    }}
                    onFocus={() => setIsScheduleFocused(true)}
                    onBlur={() => setIsScheduleFocused(false)}
                    className="w-full bg-gray-800/50 text-white rounded-lg p-3 appearance-none pr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E33265]"
                  >
                    <option value="now|Bây giờ">Bây giờ</option>
                    <option value="next free slot">Khe trống tiếp theo</option>
                    <option value="pick a time">Chọn thời gian</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                </div>
              </div>

              {/* Pick a time summary box under selector (only when "Chọn thời gian") */}
              {publishTime === "pick a time" && (
                <div className="mb-4">
                  <div className="text-white mb-2">Chọn thời gian</div>
                  <div 
                    className={`w-full bg-gray-800/50 text-white rounded-lg p-3 cursor-pointer hover:bg-gray-700/50 ${showCalendar ? 'ring-2 ring-[#E33265]' : ''}`}
                    onClick={() => setShowCalendar(true)}
                    role="button"
                    aria-label="Chọn thời gian"
                  >
                    {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {` ${selectedTime}`}
                  </div>
                </div>
              )}

              {/* Calendar Popup */}
              {showCalendar && publishTime === "pick a time" && (
                <div
                  ref={calendarRef}
                  className="absolute left-full top-0 ml-4 bg-gray-900/70 rounded-xl p-4 w-[320px] shadow-xl border border-white/10"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmPickTime()
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setMonth(newDate.getMonth() - 1)
                        setSelectedDate(newDate)
                      }}
                      className="text-white hover:text-gray-300"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h3 className="text-white font-semibold">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button 
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setMonth(newDate.getMonth() + 1)
                        setSelectedDate(newDate)
                      }}
                      className="text-white hover:text-gray-300"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                      <div key={day} className="text-center text-gray-400 text-sm py-2">
                        {day}
                      </div>
                    ))}
                    {(() => {
                      const year = selectedDate.getFullYear()
                      const month = selectedDate.getMonth()
                      const daysInMonth = getDaysInMonth(year, month)
                      // JS getDay(): 0=Sun..6=Sat. Convert to Monday-first index: 0=Mon..6=Sun
                      const firstDayJs = new Date(year, month, 1).getDay()
                      const offset = (firstDayJs + 6) % 7
                      const cells = Array.from({ length: offset + daysInMonth })
                      return cells.map((_, i) => {
                        if (i < offset) {
                          return <div key={`empty-${i}`} />
                        }
                        const day = i - offset + 1
                        const isSelected = day === selectedDate.getDate()
                        const dow = new Date(year, month, day).getDay()
                        const isWeekend = dow === 0 || dow === 6
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              const newDate = new Date(selectedDate)
                              newDate.setDate(day)
                              setSelectedDate(newDate)
                            }}
                            className={`text-center py-2 rounded ${
                              isSelected
                                ? 'bg-[#E33265] text-white'
                                : isWeekend
                                  ? 'text-red-400 hover:bg-gray-700'
                                  : 'text-white hover:bg-gray-700'
                            }`}
                          >
                            {day}
                          </button>
                        )
                      })
                    })()}
                  </div>

                  {/* Time Input */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-700 text-white rounded px-3 py-2 gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={timeHour}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2)
                          setTimeHour(v)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmPickTime()
                        }}
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmPickTime()
                        }}
                        className="w-8 bg-transparent text-center"
                        placeholder="– –"
                        aria-label="Phút"
                      />
                      <select
                        value={timeAmPm}
                        onChange={(e) => setTimeAmPm(e.target.value as any)}
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-[#E33265] text-white hover:bg-[#E33265]/10"
                onClick={() => setShowPublishModal(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1 bg-[#E33265] hover:bg-[#c52b57] text-white"
                onClick={handlePublishConfirm}
              >
                <PlayIcon className="w-4 h-4 mr-1" />
                Đăng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
