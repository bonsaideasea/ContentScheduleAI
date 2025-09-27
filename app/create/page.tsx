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
  // Sidebar collapse/expand state controlled by hover
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // Source modal (full-screen overlay) state
  const [showSourceModal, setShowSourceModal] = useState(false)
  // Initialize active section from URL (?section=...)
  useEffect(() => {
    const s = searchParams.get("section")
    if (s) {
      setActiveSection(s as any)
    }
  }, [searchParams])

  // localStorage persistence functions
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return defaultValue
    }
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load open posts
    const savedOpenPosts = loadFromLocalStorage('openPosts', [])
    if (savedOpenPosts.length > 0) {
      setOpenPosts(savedOpenPosts)
    }

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

    // Remove the green YouTube note on day 26 if it exists
    if (savedCalendarEvents[26]) {
      const updatedEvents = { ...savedCalendarEvents }
      updatedEvents[26] = updatedEvents[26].filter(note => 
        !(note.platform === 'YouTube' && note.noteType === 'green')
      )
      if (updatedEvents[26].length === 0) {
        delete updatedEvents[26]
      }
      setCalendarEvents(updatedEvents)
      saveToLocalStorage('calendarEvents', updatedEvents)
    }

    // Clear draft posts localStorage to show hardcoded data
    localStorage.removeItem('draftPosts')
    
    // Load draft posts - only if there's existing data in localStorage
    const savedDraftPosts = loadFromLocalStorage('draftPosts', [])
    if (savedDraftPosts.length > 0) {
      setDraftPosts(savedDraftPosts)
    }
    // If no saved data, keep the hardcoded draft posts from initial state

    // Load published posts
    const savedPublishedPosts = loadFromLocalStorage('publishedPosts', [])
    if (savedPublishedPosts.length > 0) {
      setPublishedPosts(savedPublishedPosts)
    }

    // Load failed posts
    const savedFailedPosts = loadFromLocalStorage('failedPosts', [])
    if (savedFailedPosts.length > 0) {
      setFailedPosts(savedFailedPosts)
    }
  }, [])
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
  const calendarAnchorRef = useRef<HTMLDivElement | null>(null)
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

  // Initialize default time to user's local current time on mount
  useEffect(() => {
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
  }, [])

  // When opening the calendar via "Chọn thời gian", ensure time defaults to user's current local time
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

  // Ensure the calendar popup is fully visible by computing a fixed screen position
  const [calendarPos, setCalendarPos] = useState<{ top: number; left: number } | null>(null)
  useEffect(() => {
    if (!(showCalendar && publishTime === 'pick a time')) return
    // Wait a tick so the calendar renders and has dimensions
    const id = window.setTimeout(() => {
      const anchor = calendarAnchorRef.current
      const popup = calendarRef.current
      if (!anchor || !popup) return
      const anchorRect = anchor.getBoundingClientRect()
      const popupRect = popup.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Prefer to the right of the anchor; if it overflows, place to the left
      const gap = 12
      let left = anchorRect.right + gap
      if (left + popupRect.width > viewportWidth - 8) {
        left = Math.max(8, anchorRect.left - popupRect.width - gap)
      }
      // Vertically align with anchor top; clamp to viewport
      let top = anchorRect.top
      const maxTop = viewportHeight - popupRect.height - 8
      if (top > maxTop) top = Math.max(8, maxTop)
      if (top < 8) top = 8
      setCalendarPos({ top, left })
    }, 0)
    return () => window.clearTimeout(id)
  }, [showCalendar, publishTime])

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

  // Helper to calculate maximum width needed for profile names
  function getMaxProfileWidth(posts: any[]) {
    let maxWidth = 0
    posts.forEach(post => {
      const account = getAccountsForPlatform(post.platform)[0]
      const username = account?.username || "Unknown Account"
      // Estimate width based on character count (rough approximation)
      const estimatedWidth = username.length * 6 + 28 // 6px per char + 28px for profile picture and gap
      maxWidth = Math.max(maxWidth, estimatedWidth)
    })
    return Math.min(maxWidth, 200) // Cap at 200px to prevent excessive width
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
  const [calendarEvents, setCalendarEvents] = useState<{[key: string]: Array<{platform: string, time: string, status: string, noteType: 'red' | 'yellow' | 'green'}>}>({})
  // Calendar note popup state
  const [selectedNote, setSelectedNote] = useState<{dayNum: number, noteIndex: number, year: number, month: number} | null>(null)
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
  const [failedPosts, setFailedPosts] = useState<Array<{ id: number; content: string; platform: string; date: string; error: string }>>([
    {
      id: 1,
      content: "Just finished reading an amazing book that completely changed my perspective on life. Sometimes the best adventures happen between the pages of a good book. What's everyone reading lately? 📚✨",
      platform: "Facebook",
      date: "2024-01-15",
      error: "Network timeout"
    },
    {
      id: 2,
      content: "Coffee mugs are seriously underrated. There's something magical about finding the perfect mug that fits your hands just right. It's like a warm hug every morning ☕️💕",
      platform: "Instagram",
      date: "2024-01-14",
      error: "Authentication failed"
    },
    {
      id: 3,
      content: "This is an extremely long post that definitely exceeds the character limit for Twitter. I'm going to keep typing and typing to make sure this post is way too long for the platform. The character limit for Twitter is 280 characters, and this post is going to be much longer than that. I need to keep adding more text to ensure it exceeds the limit. This is getting quite long now, and I'm still not at the character limit yet. Let me keep going and going until I definitely exceed the 280 character limit for Twitter. This should be long enough now to trigger the character limit error. I hope this works!",
      platform: "Twitter",
      date: "2024-01-13",
      error: "Character limit exceeded"
    },
    {
      id: 4,
      content: "Working from home today and honestly, the productivity is unmatched. No commute, comfy clothes, and my cat as my co-worker. What's your WFH setup like? 🏠💻",
      platform: "LinkedIn",
      date: "2024-01-12",
      error: "Rate limit exceeded"
    },
    {
      id: 5,
      content: "Just discovered this incredible new coffee shop downtown. The barista made a latte art of a cat! 🐱☕️ Sometimes it's the little things that make your day. #CoffeeLife #LocalBusiness",
      platform: "Twitter",
      date: "2024-01-11",
      error: "Content policy violation"
    },
    {
      id: 6,
      content: "Weekend vibes: cooking a new recipe, catching up on Netflix, and planning next week's goals. How do you like to unwind? 🍳📺✨",
      platform: "Threads",
      date: "2024-01-10",
      error: "Server error 500"
    },
    {
      id: 7,
      content: "Morning walk in the park was exactly what I needed. Fresh air, birds chirping, and time to think. Nature has a way of resetting your mind. 🌳🚶‍♀️",
      platform: "TikTok",
      date: "2024-01-09",
      error: "Video processing failed"
    },
    {
      id: 8,
      content: "Just finished a 5K run and feeling amazing! The endorphins are real. Who else loves that post-workout high? 🏃‍♀️💪 #FitnessMotivation",
      platform: "Bluesky",
      date: "2024-01-08",
      error: "Account suspended"
    },
    {
      id: 9,
      content: "Tried a new recipe today - homemade pasta from scratch! It was messy but so worth it. Cooking is such a therapeutic activity. 🍝👨‍🍳",
      platform: "YouTube",
      date: "2024-01-07",
      error: "Video upload failed"
    },
    {
      id: 10,
      content: "Found the perfect spot for my home office. Natural light, plants everywhere, and a view of the garden. Productivity level: maximum! 🌱💻",
      platform: "Pinterest",
      date: "2024-01-06",
      error: "Image upload failed"
    },
    {
      id: 11,
      content: "Late night coding session with some good music and even better coffee. The best ideas come at 2 AM, right? 💻🎵☕️ #DeveloperLife",
      platform: "Twitter",
      date: "2024-01-05",
      error: "API key expired"
    },
    {
      id: 12,
      content: "Another extremely long post that will definitely exceed the character limit for Threads platform. Threads has a 500 character limit, and this post is going to be much longer than that. I need to keep adding more text to ensure it exceeds the limit. This is getting quite long now, and I'm still not at the character limit yet. Let me keep going and going until I definitely exceed the 500 character limit for Threads. This should be long enough now to trigger the character limit error. I hope this works! Let me add even more text to make sure we exceed the limit. This is definitely going to be over 500 characters now.",
      platform: "Threads",
      date: "2024-01-04",
      error: "Character limit exceeded"
    },
    {
      id: 13,
      content: "Beautiful sunset today! 🌅",
      platform: "Instagram",
      date: "2024-01-03",
      error: "Connection timeout"
    },
    {
      id: 14,
      content: "Just had the most amazing dinner at this new restaurant downtown. The chef is incredible and the atmosphere is perfect for a date night. Highly recommend checking it out if you're in the area! 🍽️✨",
      platform: "Facebook",
      date: "2024-01-02",
      error: "Authentication failed"
    },
    {
      id: 15,
      content: "This is another very long post that will exceed the character limit for Bluesky. Bluesky has a 300 character limit, and this post is going to be much longer than that. I need to keep adding more text to ensure it exceeds the limit. This is getting quite long now, and I'm still not at the character limit yet. Let me keep going and going until I definitely exceed the 300 character limit for Bluesky. This should be long enough now to trigger the character limit error. I hope this works!",
      platform: "Bluesky",
      date: "2024-01-01",
      error: "Character limit exceeded"
    },
    {
      id: 16,
      content: "New year, new goals! 🎯",
      platform: "LinkedIn",
      date: "2023-12-31",
      error: "Rate limit exceeded"
    },
    {
      id: 17,
      content: "This post contains some potentially sensitive content that might violate platform policies. Let's see what happens when we try to post something that could be flagged by content moderation systems. This is just a test to see how the platform handles different types of content.",
      platform: "TikTok",
      date: "2023-12-30",
      error: "Content policy violation"
    },
    {
      id: 18,
      content: "Another extremely long post for Pinterest that will definitely exceed the character limit. Pinterest has a 500 character limit, and this post is going to be much longer than that. I need to keep adding more text to ensure it exceeds the limit. This is getting quite long now, and I'm still not at the character limit yet. Let me keep going and going until I definitely exceed the 500 character limit for Pinterest. This should be long enough now to trigger the character limit error. I hope this works! Let me add even more text to make sure we exceed the limit.",
      platform: "Pinterest",
      date: "2023-12-29",
      error: "Character limit exceeded"
    },
    {
      id: 19,
      content: "Quick update: Everything is going great! 👍",
      platform: "YouTube",
      date: "2023-12-28",
      error: "Video processing failed"
    },
    {
      id: 20,
      content: "This is a very long post for LinkedIn that will exceed the character limit. LinkedIn has a 3000 character limit, and this post is going to be much longer than that. I need to keep adding more text to ensure it exceeds the limit. This is getting quite long now, and I'm still not at the character limit yet. Let me keep going and going until I definitely exceed the 3000 character limit for LinkedIn. This should be long enough now to trigger the character limit error. I hope this works! Let me add even more text to make sure we exceed the limit. This is definitely going to be over 3000 characters now. I need to keep typing to reach that limit. This is getting quite extensive now. Let me continue adding more content to ensure we definitely exceed the LinkedIn character limit. This should be more than enough text to trigger the character limit error. I'm going to keep adding more and more text until we're absolutely sure we've exceeded the 3000 character limit for LinkedIn posts. This is getting quite long now, and I'm still adding more text to make sure we definitely exceed the limit. I hope this works!",
      platform: "LinkedIn",
      date: "2023-12-27",
      error: "Character limit exceeded"
    }
  ])
  // Removed experimental calendar UI flag
  // Helper: Vietnamese month names "Tháng 1" .. "Tháng 12"
  const vietnameseMonths = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  // Helper: get number of days in month for simplistic grid
  function getDaysInMonth(year: number, monthIndex: number) {
    return new Date(year, monthIndex + 1, 0).getDate()
  }

  // Helper: generate month-specific key for calendar events
  function getCalendarKey(year: number, month: number, day: number): string {
    return `${year}-${month}-${day}`
  }

  // Helper: get calendar events for a specific day
  function getCalendarEventsForDay(year: number, month: number, day: number) {
    const key = getCalendarKey(year, month, day)
    return calendarEvents[key] || []
  }

  // Drag and drop handlers for social media icons
  const handleIconDragStart = (e: React.DragEvent, platform: string) => {
    setDraggedIcon(platform)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleCalendarNoteDragStart = (e: React.DragEvent, dayNum: number, noteIndex: number, year: number, month: number) => {
    console.log('Drag start triggered for day:', dayNum, 'note:', noteIndex, 'year:', year, 'month:', month)
    const key = getCalendarKey(year, month, dayNum)
    const event = calendarEvents[key]?.[noteIndex]
    console.log('Event data:', event)
    // Allow dragging only for scheduled (yellow) and not scheduled (red) notes. Published (green) is locked.
    if (event && (event.noteType === 'yellow' || event.noteType === 'red')) {
      console.log('Note is draggable, setting up drag data')
      const eventData = {
        sourceDay: dayNum,
        eventIndex: noteIndex,
        event: event,
        sourceYear: year,
        sourceMonth: month
      }
      e.dataTransfer.setData('application/json', JSON.stringify(eventData))
      e.dataTransfer.effectAllowed = 'move'
      // Prevent click event during drag
      e.currentTarget.style.pointerEvents = 'none'
    } else {
    console.log('Note is not draggable (published note)')
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

  const handleCalendarDrop = (e: React.DragEvent, dayNum: number, year: number, month: number) => {
    e.preventDefault()
    console.log('Drop triggered on day:', dayNum, 'year:', year, 'month:', month)
    const draggedEventData = e.dataTransfer.getData('application/json')
    console.log('Dragged event data:', draggedEventData)
    
    // Check if the date is in the past
    const currentDate = new Date()
    const todayDay = currentDate.getDate()
    const todayMonth = currentDate.getMonth()
    const todayYear = currentDate.getFullYear()
    
    // Only allow drops on today or future dates (same month and year)
    if (dayNum >= todayDay && month === todayMonth && year === todayYear) {
      // If dragging an existing calendar note (yellow/red)
      if (draggedEventData) {
        try {
          const eventData = JSON.parse(draggedEventData)
          const { sourceDay, eventIndex, event, sourceYear, sourceMonth } = eventData
          console.log('Moving event from day', sourceDay, 'to day', dayNum)
          
          // Remove from source day using month-specific key
          setCalendarEvents(prev => {
            const newEvents = { ...prev }
            const sourceKey = getCalendarKey(sourceYear, sourceMonth, sourceDay)
            if (newEvents[sourceKey]) {
              newEvents[sourceKey] = newEvents[sourceKey].filter((_, idx) => idx !== eventIndex)
              if (newEvents[sourceKey].length === 0) {
                delete newEvents[sourceKey]
              }
            }
            return newEvents
          })
          
          // Add to new day using month-specific key
          setCalendarEvents(prev => {
            const targetKey = getCalendarKey(year, month, dayNum)
            const updatedEvents = {
            ...prev,
            [targetKey]: [...(prev[targetKey] || []), event]
            }
            saveToLocalStorage('calendarEvents', updatedEvents)
            return updatedEvents
          })
          
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
          noteType: 'red' as 'red' | 'yellow' | 'green'
        }
        setCalendarEvents(prev => {
          const updatedEvents = {
          ...prev,
          [dayNum]: [...(prev[dayNum] || []), newEvent]
          }
          saveToLocalStorage('calendarEvents', updatedEvents)
          return updatedEvents
        })
      }
    } else {
      console.log('Drop rejected - past date')
    }
    setDraggedIcon(null)
  }

  // Calendar note popup handlers
  const handleNoteClick = (dayNum: number, noteIndex: number, year: number, month: number, event: React.MouseEvent) => {
    console.log('handleNoteClick called for day:', dayNum, 'noteIndex:', noteIndex, 'year:', year, 'month:', month)
    // Get the note to check its type using month-specific key
    const key = getCalendarKey(year, month, dayNum)
    const note = calendarEvents[key]?.[noteIndex]
    console.log('Note found:', note)
    
    // Don't show popup if no note
    if (!note) {
      console.log('No note found, returning')
      return
    }
    
    const rect = event.currentTarget.getBoundingClientRect()
    console.log('Calendar note rect:', rect)
    const popupWidth = 250 // More accurate popup width
    const popupHeight = 150 // More accurate popup height
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const margin = 10 // Minimum margin from viewport edges
    
    // Calculate initial position (prefer right side) - 10px away from the note
    let x = rect.right + 10
    let y = rect.top
    console.log('Initial popup position:', { x, y })
    
    // Check if popup would overflow horizontally
    if (x + popupWidth > viewportWidth - margin) {
      // Try left side - 10px away from the note
      x = rect.left - popupWidth - 10
      // If still overflows, center it horizontally
      if (x < margin) {
        x = Math.max(margin, (viewportWidth - popupWidth) / 2)
      }
    }
    
    // Check if popup would overflow vertically
    if (y + popupHeight > viewportHeight - margin) {
      // Try above the note - 10px away from the note
      y = rect.top - popupHeight - 10
      // If still overflows, center it vertically
      if (y < margin) {
        y = Math.max(margin, (viewportHeight - popupHeight) / 2)
      }
    }
    
    // Final bounds checking to ensure popup is always visible
    x = Math.max(margin, Math.min(x, viewportWidth - popupWidth - margin))
    y = Math.max(margin, Math.min(y, viewportHeight - popupHeight - margin))
    
    setNotePopupPosition({ x, y })
    setSelectedNote({dayNum, noteIndex, year, month})
    setShowNotePopup(true)
    // Set current time from user's local time
    const now = new Date()
    const hours24 = now.getHours()
    const minutes = now.getMinutes()
    const ampm: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM'
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
    const hh = String(hours12).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')
      setNoteTime({
      hour: hh,
      minute: mm,
      amPm: ampm
    })
  }

  const handleDeleteClick = () => {
    console.log('Delete button clicked, selectedNote:', selectedNote)
    console.log('showDeleteConfirm will be set to true')
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    console.log('handleConfirmDelete called, selectedNote:', selectedNote)
    if (selectedNote) {
      const { dayNum, noteIndex, year, month } = selectedNote
      console.log('Deleting note from day:', dayNum, 'index:', noteIndex, 'year:', year, 'month:', month)
      
      // Get current calendar events
      const currentEvents = calendarEvents
      console.log('Current calendar events before delete:', currentEvents)
      
      setCalendarEvents(prev => {
        const newEvents = {...prev}
        console.log('Previous events in setState:', prev)
        
        const key = getCalendarKey(year, month, dayNum)
        if (newEvents[key]) {
          console.log('Events for day', dayNum, ':', newEvents[key])
          newEvents[key] = newEvents[key].filter((_, index) => {
            console.log('Checking index', index, 'against', noteIndex)
            return index !== noteIndex
          })
          console.log('Events after filter:', newEvents[key])
          
          if (newEvents[key].length === 0) {
            console.log('No events left for day', dayNum, ', deleting day')
            delete newEvents[key]
          }
        } else {
          console.log('No events found for day', dayNum)
        }
        
        console.log('Final updated calendar events:', newEvents)
        saveToLocalStorage('calendarEvents', newEvents)
        return newEvents
      })
      
      // Close both the note popup and delete confirmation
      setShowNotePopup(false)
      setSelectedNote(null)
      setShowDeleteConfirm(false)
      console.log('Delete confirmation closed')
    } else {
      console.log('No selectedNote found, cannot delete')
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

  // Get failure reason and character limit for a post
  const getFailureReason = (post: any) => {
    const platform = post.platform.toLowerCase()
    const contentLength = post.content.length
    
    // Character limits for each platform
    const characterLimits = {
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
    
    const limit = characterLimits[platform as keyof typeof characterLimits] || 2200
    
    // Determine failure reason based on error message and content length
    if (post.error.includes('character') || post.error.includes('limit') || contentLength > limit) {
      return {
        type: 'character_limit',
        message: `Character limit exceeded. Please reduce it to ${limit} characters.`,
        currentLength: contentLength,
        limit: limit
      }
    } else if (post.error.includes('network') || post.error.includes('timeout') || post.error.includes('connection')) {
      return {
        type: 'connection',
        message: 'Connection was poor. Please try again.',
        currentLength: contentLength,
        limit: limit
      }
    } else if (post.error.includes('authentication') || post.error.includes('auth')) {
      return {
        type: 'authentication',
        message: 'Authentication failed. Please check your account settings.',
        currentLength: contentLength,
        limit: limit
      }
    } else if (post.error.includes('policy') || post.error.includes('violation')) {
      return {
        type: 'policy',
        message: 'Content policy violation. Please review and modify your content.',
        currentLength: contentLength,
        limit: limit
      }
    } else if (post.error.includes('rate limit') || post.error.includes('limit exceeded')) {
      return {
        type: 'rate_limit',
        message: 'Rate limit exceeded. Please wait a moment before trying again.',
        currentLength: contentLength,
        limit: limit
      }
    } else {
      return {
        type: 'other',
        message: 'An unexpected error occurred. Please try again.',
        currentLength: contentLength,
        limit: limit
      }
    }
  }

  // Handle retry click for failed posts
  const handleRetryClick = (id: number) => {
    setPostToRetry(id)
    setShowRetryConfirm(true)
  }

  // Handle retry confirmation
  const handleRetryConfirm = () => {
    if (postToRetry) {
      const postToMove = failedPosts.find(post => post.id === postToRetry)
      if (postToMove) {
        const failureReason = getFailureReason(postToMove)
        
        if (failureReason.type === 'character_limit' || failureReason.type === 'policy') {
          // For character limit or content policy issues, create a new post tab for editing
          const newPostId = Date.now()
          setOpenPosts(prev => [...prev, { id: newPostId, type: postToMove.platform }])
          setSelectedPostId(newPostId)
          setPostContents(prev => ({
            ...prev,
            [newPostId]: postToMove.content
          }))
          
          // Remove from failed posts
          const updatedFailedPosts = failedPosts.filter(post => post.id !== postToRetry)
          setFailedPosts(updatedFailedPosts)
          saveToLocalStorage('failedPosts', updatedFailedPosts)
          
          // Switch to the create tab to show the new post with full formatting
          setActiveSection('create')
        } else {
          // For other issues, show loading then result popup
          setShowRetryLoading(true)
          
          // Simulate retry process with random success/failure
          setTimeout(() => {
            const isSuccess = Math.random() > 0.4 // 60% success rate
            
            if (isSuccess) {
              // Success - remove from failed posts and add to published
              const updatedFailedPosts = failedPosts.filter(post => post.id !== postToRetry)
              setFailedPosts(updatedFailedPosts)
              saveToLocalStorage('failedPosts', updatedFailedPosts)
              
              const newPublishedPost = {
                id: Date.now(),
                content: postToMove.content,
                platform: postToMove.platform,
                date: new Date().toISOString().split('T')[0],
                status: 'published',
                url: `https://${postToMove.platform.toLowerCase()}.com/post/${Date.now()}`
              }
              const updatedPublished = [...publishedPosts, newPublishedPost]
              setPublishedPosts(updatedPublished)
              saveToLocalStorage('publishedPosts', updatedPublished)
            } else {
              // Failure - keep in failed posts but update error message
              const updatedFailedPosts = failedPosts.map(post => 
                post.id === postToRetry 
                  ? { ...post, error: failureReason.message }
                  : post
              )
              setFailedPosts(updatedFailedPosts)
              saveToLocalStorage('failedPosts', updatedFailedPosts)
              setRetryFailureReason(failureReason.message)
            }
            
            // Show result modal
            setShowRetryLoading(false)
            setRetrySuccess(isSuccess)
            setShowRetryResult(true)
          }, 2000) // 2 second loading simulation
        }
      }
    }
    setShowRetryConfirm(false)
    setPostToRetry(null)
  }

  // Handle retry cancellation
  const handleRetryCancel = () => {
    setShowRetryConfirm(false)
    setPostToRetry(null)
  }

  // Handle retry result modal close
  const handleRetryResultClose = () => {
    setShowRetryResult(false)
    setRetrySuccess(false)
    setRetryFailureReason("")
  }

  // Handle draft delete confirmation
  const handleDraftDeleteConfirm = () => {
    if (draftToDelete) {
      setDraftPosts(prev => {
        const updatedDrafts = prev.filter(draft => draft.id !== draftToDelete)
        saveToLocalStorage('draftPosts', updatedDrafts)
        return updatedDrafts
      })
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
      // Don't clear selectedNote if delete confirmation is open
      if (showDeleteConfirm) return
      
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
  }, [showNotePopup, showDeleteConfirm])

  const handleUpdateTime = () => {
    if (selectedNote) {
      // Convert 12-hour format to 24-hour format for storage
      let hour24 = parseInt(noteTime.hour)
      if (noteTime.amPm === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (noteTime.amPm === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      const newTime = `${hour24.toString().padStart(2, '0')}:${noteTime.minute}`
      setCalendarEvents(prev => {
        const key = getCalendarKey(selectedNote.year, selectedNote.month, selectedNote.dayNum)
        const updatedEvents = {
        ...prev,
        [key]: prev[key].map((note, index) => 
          index === selectedNote.noteIndex 
            ? {...note, time: newTime}
            : note
        )
        }
        saveToLocalStorage('calendarEvents', updatedEvents)
        return updatedEvents
      })
      setShowNotePopup(false)
      setSelectedNote(null)
    }
  }

  const handleCalendarNoteView = () => {
    if (selectedNote) {
      const { dayNum, noteIndex, year, month } = selectedNote
      const noteKey = `${year}-${month}-${dayNum}-${noteIndex}`
      const key = getCalendarKey(year, month, dayNum)
      const event = calendarEvents[key]?.[noteIndex]
      
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
      const { dayNum, noteIndex, year, month } = selectedNote
      const key = getCalendarKey(year, month, dayNum)
      const event = calendarEvents[key]?.[noteIndex]
      
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
  // Track whether the Add Post button should appear active (pink) while picker is open
  const [isAddPostActive, setIsAddPostActive] = useState(false)

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
    setIsAddPostActive(true)
  }

  // Close the post picker with the existing fade-out delay and deactivate Add Post button
  function closePostPickerWithDelay() {
    setIsPostPickerVisible(false)
    // Hide the picker after fade animation completes
    window.setTimeout(() => {
      setShowPostPicker(false)
      setIsAddPostActive(false)
    }, 80)
  }

  // Close on outside click or Escape key
  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!showPostPicker) return
      const target = event.target as Node
      if (postPickerRef.current && !postPickerRef.current.contains(target)) {
        closePostPickerWithDelay()
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (!showPostPicker) return
      if (event.key === 'Escape') {
        closePostPickerWithDelay()
      }
    }
    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showPostPicker])

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
      
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file (MP4, MOV, etc.)')
        return
      }
      
      // Validate file size (2GB = 2 * 1024 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size must be less than 2GB')
        return
      }
      
      setSelectedVideoFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setVideoPreview(previewUrl)
      
      // Add to main content area
      setUploadedMedia(prev => [...prev, {type: 'video', file, preview: previewUrl}])
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
      
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please drop a video file (MP4, MOV, etc.)')
        return
      }
      
      // Validate file size (2GB = 2 * 1024 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size must be less than 2GB')
        return
      }
      
      setSelectedVideoFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setVideoPreview(previewUrl)
      
      // Add to main content area
      setUploadedMedia(prev => [...prev, {type: 'video', file, preview: previewUrl}])
    }
  }

  // Image upload handlers for Add Media
  function handleImageFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length === 0) {
        alert('Please select image files (JPG, PNG, GIF, etc.)')
        return
      }
      
      // Validate file sizes (10MB per image)
      const maxSize = 10 * 1024 * 1024
      const oversizedFiles = imageFiles.filter(file => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        alert(`Some files are too large. Maximum size per image is 10MB.`)
        return
      }
      
      setSelectedImageFiles(prev => [...prev, ...imageFiles])
      
      // Create preview URLs
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
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
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length === 0) {
        alert('Please drop image files (JPG, PNG, GIF, etc.)')
        return
      }
      
      // Validate file sizes (10MB per image)
      const maxSize = 10 * 1024 * 1024
      const oversizedFiles = imageFiles.filter(file => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        alert(`Some files are too large. Maximum size per image is 10MB.`)
        return
      }
      
      setSelectedImageFiles(prev => [...prev, ...imageFiles])
      
      // Create preview URLs
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
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
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  // Image upload modal state for Add Media
  const [showImageModal, setShowImageModal] = useState(false)
  const [isDragOverImage, setIsDragOverImage] = useState(false)
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  // Media in main content area
  const [uploadedMedia, setUploadedMedia] = useState<Array<{type: 'image' | 'video', file: File, preview: string}>>([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Function to detect if message is gibberish or meaningless
  function isGibberish(text: string): boolean {
    const cleanText = text.toLowerCase().replace(/[^a-z\s]/g, '')
    const words = cleanText.split(/\s+/).filter(word => word.length > 0)
    
    if (words.length === 0) return true
    
    // Check for obvious gibberish patterns
    const hasRepeatedChars = /(.)\1{4,}/.test(text) // More than 4 repeated chars
    const hasRandomSequence = /[a-z]{12,}/.test(cleanText) && !hasRepeatedChars // Very long sequences
    
    // Check for common English words to validate the message
    const commonWords = [
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'make', 'create', 'post', 'about', 'help', 'want', 'need', 'like', 'love',
      'facebook', 'twitter', 'instagram', 'youtube', 'tiktok', 'linkedin', 'threads',
      'hunger', 'food', 'coffee', 'work', 'life', 'fun', 'happy', 'sad', 'good', 'bad'
    ]
    
    const hasCommonWords = words.some(word => commonWords.includes(word))
    
    // Only consider it gibberish if it has obvious patterns AND no common words
    return (hasRepeatedChars || hasRandomSequence) && !hasCommonWords
  }

  // Function to detect if user wants to create a post
  function shouldCreatePost(userMessage: string): boolean {
    const message = userMessage.toLowerCase().trim()
    const createPostKeywords = [
      'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'create', 'make', 'write', 'post',
      'help me', 'help', 'assist', 'generate', 'draft', 'content', 'social media',
      'facebook', 'twitter', 'x', 'threads', 'instagram', 'linkedin', 'tiktok', 'youtube',
      'bluesky', 'bsky', 'pinterest', 'pinterest'
    ]
    
    return createPostKeywords.some(keyword => message.includes(keyword))
  }

  // Function to detect platform from user message
  function detectPlatform(userMessage: string): string | null {
    const message = userMessage.toLowerCase().trim()
    
    if (message.includes('facebook') || message.includes('fb')) return 'Facebook'
    if (message.includes('twitter') || message.includes('x')) return 'Twitter'
    if (message.includes('threads')) return 'Threads'
    if (message.includes('instagram') || message.includes('ig')) return 'Instagram'
    if (message.includes('linkedin')) return 'LinkedIn'
    if (message.includes('tiktok')) return 'TikTok'
    if (message.includes('youtube') || message.includes('yt')) return 'YouTube'
    if (message.includes('pinterest')) return 'Pinterest'
    if (message.includes('bluesky') || message.includes('bsky')) return 'Bluesky'
    
    return null
  }

  // Function to generate AI content for social media posts
  function generatePostContent(userMessage: string, platform: string): string {
    const message = userMessage.toLowerCase().trim()
    
    // Extract key topics from the message
    const topics = message.split(' ').filter(word => word.length > 3)
    
    // Generate platform-specific content
    switch (platform) {
      case 'Twitter':
        return `🚀 Just had a thought about ${topics[0] || 'this topic'}...\n\n${userMessage}\n\nWhat do you think? Drop your thoughts below! 👇\n\n#${topics[0] || 'thoughts'} #discussion #community`
      
      case 'Facebook':
        return `Hey everyone! 👋\n\nI wanted to share something that's been on my mind: ${userMessage}\n\nI'd love to hear your thoughts and experiences on this. Have any of you had similar thoughts or experiences?\n\nLet's start a conversation! 💬`
      
      case 'Instagram':
        return `✨ ${userMessage}\n\nSometimes the simplest thoughts can spark the biggest conversations. What's your take on this? 🤔\n\n#${topics[0] || 'thoughts'} #community #discussion #mindfulness`
      
      case 'LinkedIn':
        return `Professional insight: ${userMessage}\n\nIn my experience, this perspective has been valuable for understanding our industry better. I'm curious about your thoughts and how this might apply to your work.\n\nWhat are your thoughts on this topic?`
      
      case 'Threads':
        return `Just thinking out loud here...\n\n${userMessage}\n\nAnyone else feel this way? Would love to hear different perspectives! 🧵`
      
      case 'TikTok':
        return `POV: You're scrolling and see this thought\n\n${userMessage}\n\nBut honestly, what do you think? Drop your hot takes! 🔥\n\n#fyp #thoughts #discussion`
      
      case 'Bluesky':
        return `Just thinking out loud...\n\n${userMessage}\n\nWhat's your take on this? The conversation is open! 🌟\n\n#thoughts #discussion #community`
      
      case 'Pinterest':
        return `💭 ${userMessage}\n\nSometimes the best ideas come from simple thoughts. What do you think about this? Pin your thoughts below! 📌\n\n#${topics[0] || 'thoughts'} #ideas #discussion`
      
      case 'YouTube':
        return `🎥 ${userMessage}\n\nWhat do you think about this topic? I'd love to hear your thoughts in the comments below! Don't forget to like and subscribe if you found this helpful! 👍\n\n#${topics[0] || 'thoughts'} #discussion #community #youtube`
      
      default:
        return `Just sharing a thought: ${userMessage}\n\nWhat's your perspective on this? I'd love to hear your thoughts! 💭`
    }
  }

  // Function to generate intelligent LLM response
  function generateLLMResponse(userMessage: string): { response: string; shouldCreatePost: boolean; platform?: string; postContent?: string } {
    const message = userMessage.toLowerCase().trim()
    
    // Check if it's gibberish
    if (isGibberish(userMessage)) {
      return {
        response: "Hi! It looks like your message might have been typed by accident or is a placeholder. Could you please clarify or resend the message you'd like help with? I'd love to assist you with refining or brainstorming your social media post!",
        shouldCreatePost: false
      }
    }
    
    // Check if user wants to create a post
    const wantsToCreate = shouldCreatePost(userMessage)
    const detectedPlatform = detectPlatform(userMessage)
    
    // Check for common social media content topics
    const socialMediaKeywords = [
      'coffee', 'food', 'travel', 'work', 'life', 'fun', 'happy', 'sad', 'excited', 'tired',
      'weather', 'music', 'movie', 'book', 'game', 'sport', 'fitness', 'fashion', 'beauty',
      'family', 'friend', 'love', 'relationship', 'job', 'career', 'school', 'study',
      'shopping', 'sale', 'deal', 'discount', 'new', 'old', 'best', 'worst', 'favorite',
      'opinion', 'think', 'believe', 'feel', 'like', 'hate', 'love', 'want', 'need'
    ]
    
    const hasSocialKeywords = socialMediaKeywords.some(keyword => 
      message.includes(keyword)
    )
    
    // If user wants to create a post or mentions a platform
    if (wantsToCreate || detectedPlatform) {
      const platform = detectedPlatform || 'Facebook' // Default to Facebook if no platform specified
      const postContent = generatePostContent(userMessage, platform)
      
      let response = "Perfect! I'll create a new post for you"
      if (detectedPlatform) {
        response += ` on ${platform}`
      }
      response += ". I've generated some content based on what you shared - you can edit it however you'd like!"
      
      return {
        response,
        shouldCreatePost: true,
        platform,
        postContent
      }
    }
    
    // Generate contextual response based on content
    if (hasSocialKeywords || message.length > 10) {
      // Extract potential topics
      const topics = socialMediaKeywords.filter(keyword => 
        message.includes(keyword)
      )
      
      let response = "Interesting take! "
      
      if (topics.includes('coffee')) {
        response += "Not everyone loves the smell of coffee—in fact, while many people find it comforting or energizing, others can be turned off by its strong, roasted scent. If you're sharing this on social media, maybe lean into the unexpected opinion! Something like:\n\n\"Unpopular opinion: coffee smells terrible. I said what I said. ☕🚫\"\n\nThat kind of bold, casual statement often sparks fun debate and engagement. Want help crafting a post with a little humor or edge to it?"
      } else if (topics.includes('food')) {
        response += "Food content always performs well on social media! Whether you're sharing a recipe, restaurant review, or just your thoughts on a meal, people love to engage with food posts. What's your angle? Are you reviewing something, sharing a cooking tip, or just expressing your feelings about it?"
      } else if (topics.includes('work') || topics.includes('job') || topics.includes('career')) {
        response += "Work and career content resonates with so many people! Whether it's celebrating a win, venting about challenges, or sharing insights, professional content often gets great engagement. What aspect of work life are you thinking about sharing?"
      } else if (topics.includes('travel')) {
        response += "Travel content is gold for social media! People love seeing new places, getting travel tips, or living vicariously through others' adventures. Are you planning a trip, reminiscing about one, or sharing travel advice?"
      } else if (topics.includes('fitness') || topics.includes('workout')) {
        response += "Fitness content has such an engaged community! Whether it's motivation, tips, or just sharing your journey, fitness posts often inspire others. What's your fitness story or tip you want to share?"
      } else {
        response += `That's a great topic for social media! "${userMessage}" could definitely spark some interesting conversations. What's your main point or angle? Are you looking to inform, entertain, or start a discussion? I can help you craft it into an engaging post!`
      }
      
      return { response, shouldCreatePost: false }
    } else {
      // Short or unclear messages
      return {
        response: `I see you mentioned "${userMessage}" - that could be a great starting point for a social media post! Could you tell me more about what you're thinking? Are you looking to share an experience, ask a question, or start a conversation about it?`,
        shouldCreatePost: false
      }
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages, isTyping])

  async function submitChat() {
    const text = chatInput.trim()
    if (!text) return
    
    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: text }])
    setChatInput("")
    
    // Show typing indicator
    setIsTyping(true)
    
    // Simulate typing delay (1-3 seconds)
    const delay = Math.random() * 2000 + 1000
    await new Promise(resolve => setTimeout(resolve, delay))
    
    // Generate AI response and check if we should create a post
    const aiResponse = generateLLMResponse(text)
    setChatMessages((prev) => [...prev, { role: "assistant", content: aiResponse.response }])
    
    // If AI suggests creating a post, create it
    if (aiResponse.shouldCreatePost && aiResponse.platform && aiResponse.postContent) {
      // Create new post
      const newPostId = Date.now()
      const newPost = {
        id: newPostId,
        type: aiResponse.platform
      }
      
      // Add to open posts
      const updatedOpenPosts = [...openPosts, newPost]
      setOpenPosts(updatedOpenPosts)
      saveToLocalStorage('openPosts', updatedOpenPosts)
      
      // Set as selected post
      setSelectedPostId(newPostId)
      
      // Set the AI-generated content
      const updatedPostContents = {
        ...postContents,
        [newPostId]: aiResponse.postContent!
      }
      setPostContents(updatedPostContents)
      saveToLocalStorage('postContents', updatedPostContents)
      
      // Close any open post picker
      setShowPostPicker(false)
      setIsPostPickerVisible(false)
    }
    
    // Hide typing indicator
    setIsTyping(false)
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


  // Filter and search states
  const [draftSearchTerm, setDraftSearchTerm] = useState("")
  const [draftDateFilter, setDraftDateFilter] = useState("newest")
  const [draftPlatformFilter, setDraftPlatformFilter] = useState("all")
  const [publishedSearchTerm, setPublishedSearchTerm] = useState("")
  const [publishedDateFilter, setPublishedDateFilter] = useState("newest")
  const [publishedPlatformFilter, setPublishedPlatformFilter] = useState("all")
  const [showDraftPlatformDropdown, setShowDraftPlatformDropdown] = useState(false)
  const [showPublishedPlatformDropdown, setShowPublishedPlatformDropdown] = useState(false)
  const [showRetryConfirm, setShowRetryConfirm] = useState(false)
  const [postToRetry, setPostToRetry] = useState<number | null>(null)
  const [showRetryLoading, setShowRetryLoading] = useState(false)
  const [showRetryResult, setShowRetryResult] = useState(false)
  const [retrySuccess, setRetrySuccess] = useState(false)
  const [retryFailureReason, setRetryFailureReason] = useState("")

  // Filter and sort functions
  const filterAndSortPosts = (posts: any[], searchTerm: string, dateFilter: string, platformFilter: string) => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.platform.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPlatform = platformFilter === "all" || !platformFilter || post.platform.toLowerCase() === platformFilter.toLowerCase()
      
      return matchesSearch && matchesPlatform
    })

    if (dateFilter === "newest") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (dateFilter === "oldest") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    return filtered
  }

  // Platform options for dropdown
  const platformOptions = [
    { value: "all", label: "All Platforms", icon: null },
    { value: "facebook", label: "Facebook", icon: "/fb.svg" },
    { value: "instagram", label: "Instagram", icon: "/instagram.png" },
    { value: "twitter", label: "Twitter", icon: "/x.png" },
    { value: "linkedin", label: "LinkedIn", icon: "/link.svg" },
    { value: "pinterest", label: "Pinterest", icon: "/pinterest.svg" },
    { value: "tiktok", label: "TikTok", icon: "/tiktok.png" },
    { value: "threads", label: "Threads", icon: "/threads.png" },
    { value: "bluesky", label: "Bluesky", icon: "/bluesky.png" },
    { value: "youtube", label: "YouTube", icon: "/ytube.png" }
  ]

  // Draft posts state so new drafts appear in the Drafts section
  const [draftPosts, setDraftPosts] = useState<Array<{ id: number; content: string; platform: string; platformIcon?: string; date: string; status: string }>>([
    {
      id: 1,
      content: "Just finished reading an amazing book that completely changed my perspective on life. Sometimes the best adventures happen between the pages of a good book. What's everyone reading lately? 📚✨",
      platform: "Facebook",
      platformIcon: "Facebook",
      date: "2024-01-15",
      status: "draft"
    },
    {
      id: 2,
      content: "Coffee mugs are seriously underrated. There's something magical about finding the perfect mug that fits your hands just right. It's like a warm hug every morning ☕️💕",
      platform: "Instagram",
      platformIcon: "Instagram",
      date: "2024-01-14",
      status: "draft"
    },
    {
      id: 3,
      content: "Waking up early is hard, but there's something peaceful about watching the sunrise. The world feels quieter, more hopeful. Early birds, what's your secret? 🌅",
      platform: "Twitter",
      platformIcon: "Twitter",
      date: "2024-01-13",
      status: "draft"
    },
    {
      id: 4,
      content: "If I could fly on a broom, I'd definitely choose a sunset flight over the city. The view from up there must be incredible! ✨🧹 #MagicalThinking",
      platform: "TikTok",
      platformIcon: "TikTok",
      date: "2024-01-12",
      status: "draft"
    },
    {
      id: 5,
      content: "Dancing at midnight hits different. There's something liberating about moving to music when the world is asleep. Who else loves a good midnight dance session? 💃🌙",
      platform: "YouTube",
      platformIcon: "YouTube",
      date: "2024-01-11",
      status: "draft"
    },
    {
      id: 6,
      content: "The freedom to buy whatever you want (within reason) is such a luxury. Sometimes it's the small things that bring the most joy. What's something small that made you happy today? 🛍️💫",
      platform: "LinkedIn",
      platformIcon: "LinkedIn",
      date: "2024-01-10",
      status: "draft"
    },
    {
      id: 7,
      content: "Speaking kindly costs nothing but means everything. A simple 'thank you' or 'you're doing great' can completely change someone's day. Let's spread more kindness today 💝",
      platform: "Threads",
      platformIcon: "Threads",
      date: "2024-01-09",
      status: "draft"
    }
  ])

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
      setDraftPosts(prev => {
        const updatedDrafts = prev.map((draft, index) => 
        index === existingDraftIndex ? newDraft : draft
        )
        saveToLocalStorage('draftPosts', updatedDrafts)
        return updatedDrafts
      })
    } else {
      // Create new draft only if none exists for this platform
      setDraftPosts(prev => {
        const updatedDrafts = [...prev, newDraft]
        saveToLocalStorage('draftPosts', updatedDrafts)
        return updatedDrafts
      })
    }
  }

  // Save content to calendar note when user is working on a calendar note
  useEffect(() => {
    if (selectedNote) {
      const { dayNum, noteIndex, year, month } = selectedNote
      const noteKey = `${year}-${month}-${dayNum}-${noteIndex}`
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

    // If scheduled for later, create a YELLOW calendar note (scheduled)
    if (publishTime === "pick a time" && selectedDate && selectedTime) {
      const scheduledDate = new Date(selectedDate)
      const dayNum = scheduledDate.getDate()
      const month = scheduledDate.getMonth()
      const year = scheduledDate.getFullYear()
      
      // Convert selectedTime from 12-hour to 24-hour format for storage
      const timeParts = selectedTime.split(' ')
      const timeOnly = timeParts[0] // "11:34"
      const ampm = timeParts[1] // "PM"
      const [hourStr, minuteStr] = timeOnly.split(':')
      let hour24 = parseInt(hourStr)
      
      if (ampm === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (ampm === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      const time24Hour = `${hour24.toString().padStart(2, '0')}:${minuteStr}`
      
      // Create calendar note
      const calendarNote = {
        platform: selectedPlatform,
        time: time24Hour,
        status: `scheduled ${selectedTime}`,
        noteType: 'yellow' as const
      }
      
      // Add to calendar events using month-specific key
      setCalendarEvents(prev => {
        const key = getCalendarKey(year, month, dayNum)
        const updatedEvents = {
        ...prev,
        [key]: [...(prev[key] || []), calendarNote]
        }
        saveToLocalStorage('calendarEvents', updatedEvents)
        return updatedEvents
      })
      
      // Save content to calendar note using month-specific key
      const key = getCalendarKey(year, month, dayNum)
      const noteKey = `${year}-${month}-${dayNum}-${(calendarEvents[key] || []).length}`
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
      setPublishedPosts(prev => {
        const updatedPublished = [...prev, newPublishedPost]
        saveToLocalStorage('publishedPosts', updatedPublished)
        return updatedPublished
      })
      
      // Create GREEN calendar note for today (successfully posted)
      const now = new Date()
      const today = now.getDate()
      const month = now.getMonth()
      const year = now.getFullYear()
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      
      // Convert currentTime to 24-hour format for storage
      const timeParts = currentTime.split(' ')
      const timeOnly = timeParts[0] // "11:34"
      const ampm = timeParts[1] // "PM"
      const [hourStr, minuteStr] = timeOnly.split(':')
      let hour24 = parseInt(hourStr)
      
      if (ampm === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (ampm === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      const time24Hour = `${hour24.toString().padStart(2, '0')}:${minuteStr}`
      
                const redCalendarNote = {
                  platform: selectedPlatform,
                  time: time24Hour,
                  status: `posted ${currentTime}`,
                  noteType: 'green' as const
                }
                
                console.log("Creating red calendar note with platform:", selectedPlatform)
                console.log("Calendar note object:", redCalendarNote)
                console.log("TikTok platform check:", selectedPlatform === 'TikTok')
      
      // Add to calendar events using month-specific key
      setCalendarEvents(prev => {
        const key = getCalendarKey(year, month, today)
        const updatedEvents = {
        ...prev,
        [key]: [...(prev[key] || []), redCalendarNote]
        }
        saveToLocalStorage('calendarEvents', updatedEvents)
        return updatedEvents
      })
      
      // Save content to calendar note using month-specific key
      const key = getCalendarKey(year, month, today)
      const noteKey = `${year}-${month}-${today}-${(calendarEvents[key] || []).length}`
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
        setDraftPosts(prev => {
          const updatedDrafts = prev.map((draft, index) => 
          index === existingDraftIndex ? newDraft : draft
          )
          saveToLocalStorage('draftPosts', updatedDrafts)
          return updatedDrafts
        })
      } else {
        // Create new draft
        setDraftPosts(prev => {
          const updatedDrafts = [...prev, newDraft]
          saveToLocalStorage('draftPosts', updatedDrafts)
          return updatedDrafts
        })
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

  // Close platform dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Check if click is outside draft platform dropdown
      if (showDraftPlatformDropdown) {
        const draftDropdown = document.querySelector('[data-draft-platform-dropdown]')
        if (draftDropdown && !draftDropdown.contains(target)) {
          setShowDraftPlatformDropdown(false)
        }
      }
      
      // Check if click is outside published platform dropdown
      if (showPublishedPlatformDropdown) {
        const publishedDropdown = document.querySelector('[data-published-platform-dropdown]')
        if (publishedDropdown && !publishedDropdown.contains(target)) {
          setShowPublishedPlatformDropdown(false)
        }
      }
    }
    
    if (showDraftPlatformDropdown || showPublishedPlatformDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDraftPlatformDropdown, showPublishedPlatformDropdown])


  const renderMainContent = () => {
    switch (activeSection) {
      case "settings":
        return (
          <div className="w-full max-w-none mx-0">
            <h2 className="text-2xl font-bold mb-6">Kết nối mạng xã hội và đăng nhập</h2>
            <p className="text-white/70 mb-6">Connect to your social media and login.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[ 
                { name: 'Twitter (X)', icon: '/x.png', url: 'https://twitter.com/login', connected: true },
                { name: 'LinkedIn', icon: '/link.svg', url: 'https://www.linkedin.com/login', connected: false },
                { name: 'Facebook', icon: '/fb.svg', url: 'https://www.facebook.com/login', connected: false },
                { name: 'TikTok', icon: '/tiktok.png', url: 'https://www.tiktok.com/login', connected: false },
                { name: 'Instagram', icon: '/instagram.png', url: 'https://www.instagram.com/accounts/login/', connected: false },
                { name: 'Threads', icon: '/threads.png', url: 'https://www.threads.net/login', connected: false },
                { name: 'Bluesky', icon: '/bluesky.png', url: 'https://bsky.app', connected: false },
                { name: 'YouTube', icon: '/ytube.png', url: 'https://accounts.google.com/signin/v2/identifier', connected: false },
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(s.url, '_blank')}
                  className="flex items-center justify-between px-4 py-3 rounded-md hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                  <img src={s.icon} alt={s.name} className={`w-[36px] h-[36px] ${['Twitter (X)','Threads','TikTok'].includes(s.name) ? 'filter brightness-0 invert' : ''} cursor-pointer hover:opacity-80 transition-opacity`} />
                    <span className="text-[#F5F5F7] font-medium">{s.name}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${s.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                <div className="rounded-lg border border-white/10 overflow-hidden mt-4 h-[calc(100vh-120px)] flex flex-col">
                {/* Weekday headers - Vietnamese: T2..CN */}
                <div className="grid grid-cols-7 bg-white/5">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-white/70 py-2">
                      {day}
                    </div>
              ))}
            </div>
                {/* Day grid */}
                <div className="grid grid-cols-7 grid-rows-5 flex-1 overflow-y-auto">
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
                    // Get events for this day from state using month-specific key
                    const dayEvents = getCalendarEventsForDay(cellDate.getFullYear(), cellDate.getMonth(), dayNum)
                    const cellEvents: Array<{ platform: string; label: string; color: string; text: string; icon: string }> = dayEvents.map((event, eventIdx) => {
                      console.log("Rendering calendar note for platform:", event.platform)
                      console.log("TikTok check:", event.platform === 'TikTok')
                      console.log("Icon path:", event.platform === 'TikTok' ? '/tiktok.png' : 'not tiktok')
                      return {
                      platform: event.platform,
                      label: event.noteType === 'green' ? (() => {
                               const timeParts = event.time.split(':')
                               const hour24 = parseInt(timeParts[0])
                               const minute = timeParts[1]
                               const ampm = hour24 >= 12 ? 'PM' : 'AM'
                               const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
                               return `posted ${hour12}:${minute} ${ampm}`
                             })() :
                             event.noteType === 'yellow' ? (() => {
                               const timeParts = event.time.split(':')
                               const hour24 = parseInt(timeParts[0])
                               const minute = timeParts[1]
                               const ampm = hour24 >= 12 ? 'PM' : 'AM'
                               const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
                               return `scheduled ${hour12}:${minute} ${ampm}`
                             })() :
                             event.noteType === 'red' ? (() => {
                               const noteKey = `${dayNum}-${eventIdx}`
                               const hasContent = calendarNoteContent[noteKey] && calendarNoteContent[noteKey].trim() !== ''
                               return hasContent ? 'add time' : 'no content'
                             })() :
                             `${event.status} ${event.time}`,
                      color: event.noteType === 'green' ? 'bg-[#8AE177]/20 border-[#8AE177]/40' :
                             event.noteType === 'yellow' ? 'bg-[#FACD5B]/20 border-[#FACD5B]/40' :
                             event.noteType === 'red' ? 'bg-[#FF4F4F]/20 border-[#FF4F4F]/40' :
                             'bg-white/10 border-white/20',
                      text: event.noteType === 'green' ? 'text-[#8AE177]' :
                            event.noteType === 'yellow' ? 'text-[#FACD5B]' :
                            event.noteType === 'red' ? 'text-[#FF4F4F]' :
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
                        className={`h-full p-2 cursor-pointer ${
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
                        onDrop={(e) => handleCalendarDrop(e, dayNum, cellDate.getFullYear(), cellDate.getMonth())}
                      >
              <div className="relative">
                          {(() => {
                            const currentDate = new Date()
                            const isToday = cellDate.getDate() === currentDate.getDate() && 
                                           cellDate.getMonth() === currentDate.getMonth() && 
                                           cellDate.getFullYear() === currentDate.getFullYear()
                            return isToday ? (
                              <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#E33265] rounded-full flex items-center justify-center">
                                <div className="text-xs text-white font-medium">{dayNum}</div>
                              </div>
                            ) : null
                          })()}
                          <div className={`text-xs ${inCurrentMonth ? 'text-white/90' : 'text-white/40'}`}>{dayNum}</div>
            </div>
                        <div className="mt-2 space-y-1 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                          {cellEvents.map((ev, idx) => {
                            const key = getCalendarKey(cellDate.getFullYear(), cellDate.getMonth(), dayNum)
                            const event = calendarEvents[key]?.[idx]
                            const isDraggable = event && (event.noteType === 'yellow' || event.noteType === 'red')
                            
        return (
                              <button
                                key={idx}
                                onClick={(e) => handleNoteClick(dayNum, idx, cellDate.getFullYear(), cellDate.getMonth(), e)}
                                draggable={isDraggable}
                                onDragStart={(e) => handleCalendarNoteDragStart(e, dayNum, idx, cellDate.getFullYear(), cellDate.getMonth())}
                                onDragEnd={handleCalendarNoteDragEnd}
                                className={`inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-md border w-full h-6 whitespace-nowrap overflow-visible ${ev.color} ${ev.text} hover:opacity-80 transition-opacity ${isDraggable ? 'cursor-move' : 'cursor-pointer'} ${isDraggable ? 'hover:scale-105' : ''}`}
                              >
                                <img 
                                  src={ev.icon} 
                                  alt={ev.platform} 
                                  className={`w-4 h-4 ${ev.platform === 'Twitter' || ev.platform === 'Threads' || ev.platform === 'TikTok' ? 'filter brightness-0 invert' : ''}`}
                                />
                                <span>{ev.label}</span>
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
              const { dayNum, noteIndex, year, month } = selectedNote
              const key = getCalendarKey(year, month, dayNum)
              const note = calendarEvents[key]?.[noteIndex]
              const isPublishedNote = note?.noteType === 'green' // green means published
              
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
                    {isPublishedNote ? (
                      /* Published (green) - Only View Icon */
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
                      /* Yellow/Red Notes (scheduled/not scheduled) - Conditional Time Selection, View, and Delete Icons */
                      <>
                        {/* Time Selection - Only show if note has content and is scheduled (yellow) or if it's yellow (already scheduled) */}
                        {(() => {
                          const { dayNum, noteIndex, year, month } = selectedNote
                          const key = getCalendarKey(year, month, dayNum)
                          const note = calendarEvents[key]?.[noteIndex]
                          const noteKey = `${year}-${month}-${dayNum}-${noteIndex}`
                          const hasContent = calendarNoteContent[noteKey] && calendarNoteContent[noteKey].trim() !== ''
                          const isScheduled = note?.noteType === 'yellow'
                          const shouldShowTime = isScheduled || (note?.noteType === 'red' && hasContent)
                          
                          return shouldShowTime ? (
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
                          ) : null
                        })()}

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
              <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={handleCancelDelete}
              >
                <div 
                  className="bg-[#190F2F] rounded-lg p-6 w-80 border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">Confirm delete</h3>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          console.log('Yes button clicked')
                          handleConfirmDelete()
                        }}
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
            <div className="w-full max-w-none mx-0 overflow-hidden h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Bản nháp</h2>
              
              {/* Filter and Search Controls */}
              <div className="flex gap-4 mb-6">
                {/* Filter by Platform */}
                <div className="relative">
                      <button
                    onClick={() => setShowDraftPlatformDropdown(!showDraftPlatformDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors"
                  >
                    <span>Filter by Platform</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                  
                  {showDraftPlatformDropdown && (
                    <div data-draft-platform-dropdown className="absolute top-full left-0 mt-1 w-48 bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg z-50">
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
                              className={`w-5 h-5 ${['twitter', 'threads', 'tiktok'].includes(option.value) ? 'filter brightness-0 invert' : ''}`} 
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
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
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
                    placeholder="Search..."
                    value={draftSearchTerm}
                    onChange={(e) => setDraftSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-[#E33265] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <div className="space-y-[1px]">
                {filterAndSortPosts(draftPosts, draftSearchTerm, draftDateFilter, draftPlatformFilter).map((post) => (
                <div 
                  key={post.id} 
                  className="group rounded-xl hover:bg-[#E33265]/70 transition-colors cursor-pointer"
                  onClick={() => handleEditDraft(post)}
                >
                  <div className="flex items-center px-4 py-3 w-full">
                    {/* Left: platform icon + content */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {post.platformIcon === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platformIcon === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platformIcon === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platformIcon === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platformIcon === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platformIcon === 'Bluesky' && <img src="/bluesky.png" alt="Bluesky" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platformIcon === 'YouTube' && <img src="/ytube.png" alt="YouTube" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platformIcon === 'TikTok' && <img src="/tiktok.png" alt="TikTok" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {/* Fallback to platform if platformIcon is not available */}
                      {!post.platformIcon && post.platform === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {!post.platformIcon && post.platform === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {!post.platformIcon && post.platform === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {!post.platformIcon && post.platform === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {!post.platformIcon && post.platform === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      <div className="text-white/90 truncate flex-1 min-w-0 max-w-[1050px]">{post.content}</div>
                    </div>
                    {/* Right: date and delete button */}
                    <div className="flex items-center text-white/80 flex-shrink-0 gap-2 ml-4">
                      <span className="text-sm whitespace-nowrap">{post.date}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDraftDeleteClick(post.id)
                        }}
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
          </div>
        )

      case "published":
        return (
            <div className="w-full max-w-none mx-0 overflow-hidden h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Published Posts</h2>
              
              {/* Filter and Search Controls */}
              <div className="flex gap-4 mb-6">
                {/* Filter by Platform */}
                <div className="relative">
                  <button 
                    onClick={() => setShowPublishedPlatformDropdown(!showPublishedPlatformDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] hover:bg-[#3A3A42] transition-colors"
                  >
                    <span>Filter by Platform</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showPublishedPlatformDropdown && (
                    <div data-published-platform-dropdown className="absolute top-full left-0 mt-1 w-48 bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg z-50">
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
                              className={`w-5 h-5 ${['twitter', 'threads', 'tiktok'].includes(option.value) ? 'filter brightness-0 invert' : ''}`} 
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
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
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
                    placeholder="Search..."
                    value={publishedSearchTerm}
                    onChange={(e) => setPublishedSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#2A2A30] border border-[#3A3A42] rounded-lg text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-[#E33265] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <div className="space-y-[1px]">
                {(() => {
                  const filteredPosts = filterAndSortPosts(publishedPosts, publishedSearchTerm, publishedDateFilter, publishedPlatformFilter)
                  const maxWidth = getMaxProfileWidth(filteredPosts)
                  return filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="group rounded-xl hover:bg-[#E33265]/70 transition-colors cursor-pointer"
                  onClick={() => window.open(post.url, '_blank')}
                >
                  <div className="flex items-center px-4 py-3 w-full">
                    {/* Left: platform icon + content */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {post.platform === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platform === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platform === 'TikTok' && <img src="/tiktok.png" alt="TikTok" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platform === 'Bluesky' && <img src="/bluesky.png" alt="Bluesky" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'YouTube' && <img src="/ytube.png" alt="YouTube" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'Pinterest' && <img src="/pinterest.svg" alt="Pinterest" className="w-[27px] h-[27px] flex-shrink-0" />}
                      <div className="text-white/90 truncate flex-1 min-w-0 max-w-[1050px]">{post.content}</div>
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
                        <span className="text-xs whitespace-nowrap">
                          {getAccountsForPlatform(post.platform)[0]?.username || "Unknown Account"}
                        </span>
                      </div>
                      <span className="text-xs whitespace-nowrap w-full">{post.date}</span>
                  </div>
                  </div>
                </div>
                ))
                })()}
              </div>
            </div>
          </div>
        )

      case "failed":
        return (
          <div className="w-full max-w-none mx-0 overflow-hidden h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Failed Posts</h2>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <div className="space-y-[1px] pb-0">
                {(() => {
                  const maxWidth = getMaxProfileWidth(failedPosts)
                  return failedPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="group rounded-xl hover:bg-[#E33265]/70 transition-colors cursor-pointer"
                  onClick={() => handleRetryClick(post.id)}
                >
                  <div className="flex items-center px-4 py-3 w-full">
                    {/* Left: platform icon + content */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {post.platform === 'Twitter' && <img src="/x.png" alt="X" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platform === 'Instagram' && <img src="/instagram.png" alt="Instagram" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'LinkedIn' && <img src="/link.svg" alt="LinkedIn" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'Facebook' && <img src="/fb.svg" alt="Facebook" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'Threads' && <img src="/threads.png" alt="Threads" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platform === 'TikTok' && <img src="/tiktok.png" alt="TikTok" className="w-[27px] h-[27px] filter brightness-0 invert flex-shrink-0" />}
                      {post.platform === 'Bluesky' && <img src="/bluesky.png" alt="Bluesky" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'YouTube' && <img src="/ytube.png" alt="YouTube" className="w-[27px] h-[27px] flex-shrink-0" />}
                      {post.platform === 'Pinterest' && <img src="/pinterest.svg" alt="Pinterest" className="w-[27px] h-[27px] flex-shrink-0" />}
                      <div className="text-white/90 truncate flex-1 min-w-0 max-w-[1050px]">{post.content}</div>
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
                        <span className="text-xs whitespace-nowrap">
                          {getAccountsForPlatform(post.platform)[0]?.username || "Unknown Account"}
                        </span>
                      </div>
                      <span className="text-xs whitespace-nowrap w-full">{post.date}</span>
                    </div>
                  </div>
                </div>
                ))
                })()}
              </div>
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
                <Button variant="ghost" size="sm" className={`${isAddPostActive ? 'bg-[#E33265] text-white hover:bg-[#c52b57]' : ''}`}>
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Post
              </Button>
                {showPostPicker && (
                  <div 
                    className={`absolute z-20 mt-2 w-[13.75rem] bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] p-3 transition-opacity duration-75 ${
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
            <Card className="bg-[#2A2A30] border-[#3A3A42] p-6 flex-1 flex flex-col">
              {selectedPostId === 0 || openPosts.length === 0 ? (
                /* Empty state when no posts are open */
                <div className="flex-1 flex items-center justify-center">
                  <Button 
                    onClick={() => {
                      setShowPostPicker(true)
                      setIsPostPickerVisible(true)
                      setIsAddPostActive(true)
                    }}
                    className="bg-[#E33265] hover:bg-[#c52b57] text-white"
                  >
                    <PlusIcon className="w-6 h-6 mr-2" />
                    Tạo bài viết
                  </Button>
                </div>
              ) : (
                /* Editor when a post is selected */
                <div className="relative flex-1 overflow-hidden">
              <Textarea
                    placeholder={`Bạn muốn chia sẻ gì trên ${openPosts.find((p) => p.id === selectedPostId)?.type || "bài viết"}?`}
                    value={postContents[selectedPostId] || ""}
                    onChange={(e) => {
                      const updatedPostContents = { ...postContents, [selectedPostId]: e.target.value }
                      setPostContents(updatedPostContents)
                      saveToLocalStorage('postContents', updatedPostContents)
                    }}
                    className="w-full h-full bg-[#2A2A30] border border-[#2A2A30] resize-none text-white placeholder:text-gray-400 focus:ring-0 focus:border-[#2A2A30] p-[10px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                  />
                  
                  {/* Media Preview Area */}
                  {uploadedMedia.length > 0 && (
                    <div className="mt-4">
                      <div className="relative bg-[#1E1E23] rounded-lg p-4 border border-[#3A3A42]">
                        {/* Current Media Display */}
                        <div className="relative">
                          {uploadedMedia[currentMediaIndex]?.type === 'image' ? (
                            <img 
                              src={uploadedMedia[currentMediaIndex].preview} 
                              alt="Uploaded media"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="relative">
                              <video 
                                src={uploadedMedia[currentMediaIndex].preview} 
                                className="w-full h-64 object-cover rounded-lg"
                                controls
                              />
                              {/* Video Player Overlay Controls */}
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </button>
                                  <div className="flex-1 bg-white/20 rounded-full h-1 mx-2">
                                    <div className="bg-white rounded-full h-1 w-1/3"></div>
                                  </div>
                                </div>
                                <button className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Media Type Icon */}
                          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                            {uploadedMedia[currentMediaIndex]?.type === 'image' ? (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        {/* Video Controls Panel - Only for videos */}
                        {uploadedMedia[currentMediaIndex]?.type === 'video' && (
                          <div className="mt-4 space-y-4">
                            {/* Preset Info */}
                            <div className="text-center text-gray-400 text-sm">No Preset</div>
                            
                            {/* Language Selection */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Language</span>
                              <div className="flex items-center gap-2 bg-[#3A3A42] rounded-lg px-3 py-2">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwN0JGRiIvPgo8cGF0aCBkPSJNOCAxMkgxNk0xMiA4VjE2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K" alt="US Flag" className="w-4 h-4" />
                                <span className="text-sm text-white">English</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Multi-Speaker Theme */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300">Multi-Speaker theme</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                  <path d="M12 17h.01"></path>
                                </svg>
                              </div>
                              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                                <div className="w-5 h-5 bg-gray-400 rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                              </div>
                            </div>
                            
                            {/* Translate Captions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300">Translate Captions</span>
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                                </svg>
                              </div>
                              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                                <div className="w-5 h-5 bg-gray-400 rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                              </div>
                            </div>
                            
                            {/* Generate Captions Button */}
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                              Generate captions
                            </button>
                          </div>
                        )}
                        
                        {/* Navigation Controls */}
                        {uploadedMedia.length > 1 && (
                          <div className="flex items-center justify-center mt-3 gap-4">
                            <button
                              onClick={() => setCurrentMediaIndex(prev => prev > 0 ? prev - 1 : uploadedMedia.length - 1)}
                              className="p-2 rounded-full bg-[#3A3A42] hover:bg-[#4A4A52] transition-colors"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            
                            <span className="text-sm text-gray-400">
                              {currentMediaIndex + 1}/{uploadedMedia.length}
                            </span>
                            
                            <button
                              onClick={() => setCurrentMediaIndex(prev => prev < uploadedMedia.length - 1 ? prev + 1 : 0)}
                              className="p-2 rounded-full bg-[#3A3A42] hover:bg-[#4A4A52] transition-colors"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                        
                        {/* Remove Media Button */}
                        <button
                          onClick={() => {
                            const newMedia = uploadedMedia.filter((_, index) => index !== currentMediaIndex)
                            setUploadedMedia(newMedia)
                            if (currentMediaIndex >= newMedia.length && newMedia.length > 0) {
                              setCurrentMediaIndex(newMedia.length - 1)
                            } else if (newMedia.length === 0) {
                              setCurrentMediaIndex(0)
                            }
                          }}
                          className="absolute top-2 left-2 p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
              </div>

              )}
              
              {/* Action buttons - only show when there's an active post */}
              {selectedPostId !== 0 && openPosts.length > 0 && (
              <div className="relative flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                {/* Character count positioned 30px above the white line */}
                <div className="absolute -top-[30px] right-0 text-xs text-gray-400">
                  {(postContents[selectedPostId] || "").length}/
                  {characterLimits[(openPosts.find((p) => p.id === selectedPostId)?.type as keyof typeof characterLimits) || "Facebook"]}
                  {" "}ký tự
                </div>
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
                      <div className="absolute z-20 bottom-full mb-2 right-0 w-[13.75rem] bg-[#2A2A30] border border-[#3A3A42] rounded-lg shadow-lg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] p-3" onMouseEnter={() => setShowClonePicker(true)} onMouseLeave={() => setShowClonePicker(false)}>
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
    <div className="h-screen bg-[#1E1E23] text-white">
      <div className="relative flex h-screen">
        {/* Left Sidebar Overlay + Spacer so main layout doesn't shift */}
        <div className="w-16" />
        <div 
          className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-[width] duration-150 ease-out border-r border-white/10 p-4 pt-[30px] absolute inset-y-0 left-0 z-20 bg-[#1E1E23]`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <nav className="space-y-2">
            <Button
              variant={activeSection === "create" ? "secondary" : "ghost"}
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
                activeSection === "create" ? "bg-purple-500/20 border-purple-500/30" : ""
              }`}
              onClick={() => { setActiveSection("create"); window.history.pushState(null, "", "/create") }}
            >
              <PlusIcon className="w-6 h-6 mr-2" />
              {isSidebarOpen && <span>Tạo bài viết</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-left text-[#F5F5F7] ${
                activeSection === "calendar" ? "bg-purple-500/10" : ""
              }`}
              onClick={() => { setActiveSection("calendar"); window.history.pushState(null, "", "/lich") }}
            >
              <CalendarIcon className="w-6 h-6 mr-2" />
              {isSidebarOpen && <span>Lịch</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
                activeSection === "drafts" ? "bg-purple-500/10" : ""
              }`}
              onClick={() => { setActiveSection("drafts"); window.history.pushState(null, "", "/ban-nhap") }}
            >
              <span className="w-6 h-6 mr-2 text-xl">📝</span>
              {isSidebarOpen && <span>Bản nháp</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
                activeSection === "published" ? "bg-purple-500/10" : ""
              }`}
              onClick={() => { setActiveSection("published"); window.history.pushState(null, "", "/bai-da-dang") }}
            >
              <SendIcon className="w-6 h-6 mr-2" />
              {isSidebarOpen && <span>Bài đã đăng</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
                activeSection === "failed" ? "bg-purple-500/10" : ""
              }`}
              onClick={() => { setActiveSection("failed"); window.history.pushState(null, "", "/bai-loi") }}
            >
              <span className="w-6 h-6 mr-2 text-red-400 text-xl">⚠</span>
              {isSidebarOpen && <span>Bài lỗi</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
                activeSection === "videos" ? "bg-purple-500/10" : ""
              }`}
              onClick={() => { setActiveSection("videos"); window.history.pushState(null, "", "/videos") }}
            >
              <VideoIcon className="w-6 h-6 mr-2" />
              {isSidebarOpen && <span>Video</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${
                activeSection === "api" ? "bg-purple-500/10" : ""
              }`}
              onClick={() => { setActiveSection("api"); window.history.pushState(null, "", "/api-dashboard") }}
            >
              <span className="w-6 h-6 mr-2 text-xl">⚡</span>
              {isSidebarOpen && <span>Bảng điều khiển API</span>}
            </Button>
          </nav>

          {/* Settings */}
          <div className="mb-4">
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-[#F5F5F7] ${activeSection === 'settings' ? 'bg-purple-500/10' : ''}`}
              onClick={() => { setActiveSection('settings'); window.history.pushState(null, '', '/settings') }}
            >
              <SettingsIcon className="w-6 h-6 mr-2" />
              {isSidebarOpen && <span>Cài đặt</span>}
            </Button>
          </div>

        </div>

        {/* Sources Column moved out of sidebar - only show on create page */}
        {activeSection === "create" && (
          <div
          className="w-64 border-r border-white/10 p-4 pt-[30px]"
          >
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
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex ml-4">
          {/* Content Creation - add 30px top padding */}
          <div className={`flex-1 p-6 pt-[30px] h-full overflow-hidden`}>{renderMainContent()}</div>

          {/* AI Assistant Panel (only shown for Create Post) */}
          {activeSection === "create" && (
          <div className="w-[400px] border-l border-white/10 pt-[25px] px-4 pb-[24px]">
            <Card className="bg-[#2A2A30] border-[#3A3A42] h-full flex flex-col">
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
                          <span>AI is typing</span>
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

              {/* Chat input area */}
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
          )}
        </div>
      </div>

      {/* Source Modal (overlay) */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowSourceModal(false) }}>
          <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-2xl w-[1000px] max-w-[95vw] max-h-[90vh] overflow-hidden shadow-xl shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Edit Source</h2>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowSourceModal(false)}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="grid grid-cols-7 gap-3">
                {[
                  { key: "text", label: "Text" },
                  { key: "article", label: "Article" },
                  { key: "youtube", label: "YouTube" },
                  { key: "tiktok", label: "TikTok" },
                  { key: "perplexity", label: "Perplexity" },
                  { key: "audio", label: "Audio" },
                  { key: "pdf", label: "PDF" },
                ].map((t) => (
                  <button
                    key={t.key}
                    className={`px-4 py-3 rounded-md text-sm ${selectedSourceType === (t.key as any) ? 'bg-white/10 text-white' : 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5'}`}
                    onClick={() => setSelectedSourceType(t.key as any)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Body */}
            <div className="px-6 py-4 space-y-3 overflow-auto" style={{ maxHeight: "60vh" }}>
              <div className="text-white">Text</div>
              {selectedSourceType === 'text' && (
                <Textarea placeholder="Paste text here" className="bg-gray-900/50 border-white/10 h-40" />
              )}
              {selectedSourceType !== 'text' && (
                <Input
                  placeholder={
                    selectedSourceType === 'article' ? 'Paste article URL...' :
                    selectedSourceType === 'youtube' ? 'Paste YouTube URL...' :
                    selectedSourceType === 'tiktok' ? 'Paste TikTok URL...' :
                    selectedSourceType === 'pdf' ? 'Paste PDF URL...' :
                    'Paste audio URL...'
                  }
                  className="bg-gray-900/50 border-white/10"
                />
              )}
              <label className="flex items-center gap-3 text-white pt-2">
                <input type="checkbox" className="accent-[#E33265]" />
                <span>Save Source?</span>
              </label>
              <details className="text-white/90">
                <summary className="cursor-pointer select-none">Advanced settings</summary>
                <div className="mt-2 text-sm text-gray-300">No additional settings yet.</div>
              </details>
            </div>
            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-md"
                onClick={() => setShowSourceModal(false)}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-lg p-6 w-full max-w-md mx-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-[#E33265] bg-[#E33265]/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              <div className="text-orange-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-white mb-2">
                Drop or <button 
                  className="underline font-medium hover:text-gray-300 transition-colors"
                  onClick={() => document.getElementById('video-upload')?.click()}
                >
                  browse your video
                </button>
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

            {/* Selected Video Preview */}
            {selectedVideoFile && videoPreview && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">
                  Selected video:
                </p>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <video 
                    src={videoPreview} 
                    className="w-16 h-12 bg-gray-700 rounded object-cover"
                    controls={false}
                    muted
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{selectedVideoFile.name}</div>
                    <div className="text-xs text-gray-400">
                      {(selectedVideoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVideoFile(null)
                      setVideoPreview(null)
                      // Reset the file input
                      const input = document.getElementById('video-upload') as HTMLInputElement
                      if (input) input.value = ''
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Sample Video Section */}
            {!selectedVideoFile && (
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
            )}
          </div>
        </div>
      )}

      {/* Image Upload Modal for Add Media */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-lg p-6 w-full max-w-md mx-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Share some pictures</h2>
              <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOverImage ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <div className="text-blue-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <p className="text-white mb-2">Drop images or <button 
                className="underline font-medium hover:text-gray-300 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                browse
              </button></p>
              <p className="text-sm text-gray-400">PNG or JPG, Max size: 10MB</p>
              <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageFileSelect} className="hidden" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="sr-only">Upload image</span>
              </label>
            </div>

            {/* Selected Images Preview */}
            {selectedImageFiles.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">
                  Click on an image to add it to your post:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedImageFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => {
                        // Add to main content area
                        const newMedia = {
                          type: 'image' as const,
                          file,
                          preview: imagePreviews[index]
                        }
                        setUploadedMedia(prev => [...prev, newMedia])
                        
                        // Close the popup
                        setShowImageModal(false)
                        
                        // Clear the selected files
                        setSelectedImageFiles([])
                        setImagePreviews([])
                        
                        // Reset file input
                        const input = document.getElementById('image-upload') as HTMLInputElement
                        if (input) input.value = ''
                      }}
                    >
                      <img 
                        src={imagePreviews[index]} 
                        alt={file.name}
                        className="w-full h-20 object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-sm font-medium">Add to Post</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">{file.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={publishModalRef} className="bg-[#2A2A30] rounded-2xl p-6 w-96 max-w-[90vw] relative border border-[#3A3A42]">
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
                    className={`flex items-center gap-3 bg-[#1E1E23] rounded-lg p-3 h-12 cursor-pointer transition-colors border border-[#3A3A42] ${showAccountDropdown ? 'ring-2 ring-[#E33265]' : ''}`}
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
                    <div ref={accountDropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-[#1E1E23] rounded-lg border border-gray-700 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] z-10 max-h-48 overflow-y-auto">
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
                <div ref={calendarAnchorRef} className={`relative rounded-lg bg-[#1E1E23] border border-[#3A3A42] ${isScheduleFocused ? 'ring-2 ring-[#E33265]' : ''}`}>
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
                    className="w-full bg-[#1E1E23] text-white rounded-lg p-3 appearance-none pr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E33265]"
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
                    className={`w-full bg-[#1E1E23] text-white rounded-lg p-3 cursor-pointer border border-[#3A3A42] ${showCalendar ? 'ring-2 ring-[#E33265]' : ''}`}
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
                  className="absolute left-full top-0 ml-4 bg-[#2A2A30] rounded-xl p-4 w-[320px] shadow-xl border border-[#3A3A42] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
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

      {/* Retry Confirmation Modal */}
      {showRetryConfirm && (() => {
        const postToMove = failedPosts.find(post => post.id === postToRetry)
        const failureReason = postToMove ? getFailureReason(postToMove) : null
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-lg p-7 w-96 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#F5F5F7] mb-4">Thử lại?</h3>
                
                {failureReason && (
                  <div className="mb-6 text-left">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-red-300 font-medium mb-1">Lý do thất bại:</p>
                          <p className="text-sm text-red-200">{failureReason.message}</p>
                          {failureReason.type === 'character_limit' && (
                            <div className="mt-2 text-xs text-gray-400">
                              Hiện tại: {failureReason.currentLength} ký tự / {failureReason.limit} ký tự
                            </div>
                          )}
                          {(failureReason.type === 'character_limit' || failureReason.type === 'policy') && (
                            <div className="mt-2 text-xs text-blue-300">
                              ✏️ Sẽ mở trong tab chỉnh sửa để bạn có thể sửa nội dung
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRetryCancel}
                    className="bg-gray-600 text-white px-6 py-2 w-30 rounded hover:bg-gray-700 transition-colors"
                  >
                    Không
                  </button>
                  <button
                    onClick={handleRetryConfirm}
                    className="bg-[#E33265] text-white px-6 py-2 w-30 rounded hover:bg-[#E33265]/80 transition-colors"
                  >
                    Có
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Retry Loading Modal */}
      {showRetryLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-lg p-8 w-80 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="text-center">
              <div className="mb-4">
                {/* Animated loading spinner */}
                <div className="inline-block w-8 h-8 border-4 border-[#E33265]/30 border-t-[#E33265] rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-[#F5F5F7] mb-2">Đang thử lại...</h3>
              <p className="text-sm text-gray-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      )}

      {/* Retry Result Modal */}
      {showRetryResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2A2A30] border border-[#3A3A42] rounded-lg p-8 w-80 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="text-center">
              <div className="mb-4">
                {retrySuccess ? (
                  <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-[#F5F5F7] mb-2">
                {retrySuccess ? "Published!" : "Failed"}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {retrySuccess 
                  ? "Bài viết đã được đăng thành công!" 
                  : retryFailureReason
                }
              </p>
              <button
                onClick={handleRetryResultClose}
                className="bg-[#E33265] text-white px-6 py-2 rounded hover:bg-[#E33265]/80 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
