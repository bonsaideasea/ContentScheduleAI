"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { vietnameseMonths, vietnameseWeekdays, socialPlatforms, getDaysInMonth, getCalendarEventsForDay, CalendarEvent } from "@/utils/calendar"

interface CalendarSectionProps {
  calendarEvents: Record<string, CalendarEvent[]>
  onEventAdd?: (year: number, month: number, day: number, platform: string) => void
  onClearAll?: () => void
}

/**
 * Calendar section component for scheduling and viewing posts
 * Displays a monthly calendar with drag-and-drop functionality for social media platforms
 */
export default function CalendarSection({ calendarEvents, onEventAdd, onClearAll }: CalendarSectionProps) {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState<number>(8) // September 2025
  const [currentYear, setCurrentYear] = useState<number>(2025)
  const [calendarView, setCalendarView] = useState<'monthly' | 'weekly'>("monthly")
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Initialize with current week
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() + daysToMonday)
    return startOfWeek
  })
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [selectedMonth, setSelectedMonth] = useState<number>(8)
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [clickedDays, setClickedDays] = useState<Set<string>>(new Set())
  const [showPopup, setShowPopup] = useState<{x: number, y: number, event: CalendarEvent, year?: number, month?: number, day?: number} | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // Local mirror state for calendar events to support inline deletion
  const [localEvents, setLocalEvents] = useState<Record<string, CalendarEvent[]>>(calendarEvents)
  const [noteTime, setNoteTime] = useState<{ hour: string; minute: string; amPm: 'AM' | 'PM' }>({ hour: '', minute: '', amPm: 'AM' })

  // Navigation functions
  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Weekly navigation functions
  const goPrevWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newWeekStart)
  }

  const goNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newWeekStart)
  }

  // Drag and drop handlers
  const handleIconDragStart = (e: React.DragEvent, platform: string) => {
    e.dataTransfer.setData('text/plain', platform)
  }

  const handleCalendarDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleCalendarDrop = (e: React.DragEvent, day: number, year: number, month: number) => {
    e.preventDefault()
    const platform = e.dataTransfer.getData('text/plain')
    // Disallow scheduling in the past
    try {
      const target = new Date(year, month, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (target.getTime() < today.getTime()) return
    } catch {}
    if (onEventAdd) {
      onEventAdd(year, month, day, platform)
    }
  }

  // Calendar note drag handlers
  const handleCalendarNoteDragStart = (e: React.DragEvent, day: number, eventIndex: number, year: number, month: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ day, eventIndex, year, month }))
  }

  const handleCalendarNoteDragEnd = (e: React.DragEvent) => {
    // Handle drag end if needed
  }

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Monday-first index
    
    return Array.from({ length: 35 }, (_, i) => {
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
      
      const dayEvents = getCalendarEventsForDay(cellDate.getFullYear(), cellDate.getMonth(), dayNum, localEvents)
      
      return {
        dayNum,
        inCurrentMonth,
        isSelected,
        isClicked,
        clickedKey,
        dayEvents,
        cellDate
      }
    })
  }

  const calendarGrid = generateCalendarGrid()

  // Get platform icon for calendar events (case-insensitive + fallback map)
  const getPlatformIcon = (platformName: string) => {
    const lower = (platformName || '').toLowerCase()
    const platform = socialPlatforms.find(p => p.name.toLowerCase() === lower)
    if (platform) return platform.icon
    const fallback: Record<string, string> = {
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
    return fallback[lower] || '/placeholder.svg'
  }

  // Check if platform icon needs inversion
  const needsInversion = (platformName: string) => {
    const platform = socialPlatforms.find(p => p.name === platformName)
    return platform ? platform.invert : false
  }

  // Get the correct text for calendar notes based on type and conditions
  const getNoteText = (event: CalendarEvent) => {
    switch (event.noteType) {
      case 'green':
        return `Đã đăng ${event.time}`
      case 'yellow':
        if (!event.content || event.content.trim() === '') {
          return 'Trống'
        }
        if (!event.hasScheduledTime) {
          return 'Không có lịch trình thời gian'
        }
        return `Sẽ đăng ${event.time}`
      case 'red':
        return `Thất bại ${event.time}`
      default:
        return `${event.platform} - ${event.time}`
    }
  }

  // Handle calendar note click to show popup
  const handleNoteClick = (e: React.MouseEvent, event: CalendarEvent, date?: Date) => {
    e.stopPropagation()
    setShowPopup({
      x: e.clientX,
      y: e.clientY,
      event: event,
      year: date?.getFullYear(),
      month: date?.getMonth(),
      day: date?.getDate()
    })
    setShowDeleteConfirm(false)
    // Prefill time when scheduled (yellow)
    try {
      if (event.noteType === 'yellow' && event.time) {
        const [hh, mm] = event.time.split(':')
        const hour24 = parseInt(hh || '0', 10)
        const amPm: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM'
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
        setNoteTime({ hour: String(hour12).padStart(2, '0'), minute: (mm || '00').padStart(2, '0'), amPm })
      }
    } catch {}
  }

  // Trigger create flow in editor from calendar popup
  const handleOpenCreateFromCalendar = (event: CalendarEvent) => {
    const isGreen = event.noteType === 'green' || (event.status || '').toLowerCase() === 'posted'
    const url = (event as any).url as string | undefined
    if (isGreen) {
      // Prefer explicit URL; fallback to platform homepage if missing
      const fallback = `https://${(event.platform || '').toLowerCase()}.com/`
      try { window.open(url || fallback, '_blank') } catch {}
    } else {
      const platform = (event.platform || '').toLowerCase()
      router.push(`/create?section=create&platform=${encodeURIComponent(platform)}`)
    }
    closePopup()
  }

  // Close popup
  const closePopup = () => {
    setShowPopup(null)
  }

  return (
    <div className="w-full max-w-none mx-4 mt-[30px]">
      {/* Calendar toolbar */}
      <div className="flex items-center justify-between mb-6 -mt-2.5">
        <div className="flex items-center gap-3">
          {/* Month selector */}
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-8 h-8 text-white/80 hover:text-white" 
              onClick={calendarView === 'monthly' ? goPrevMonth : goPrevWeek}
            >
              ‹
            </Button>
            <div className="px-4 py-1 rounded-md border border-white/20 bg-white/10 text-white flex items-center justify-center">
              {calendarView === 'monthly' 
                ? `${vietnameseMonths[currentMonth]}, ${currentYear}`
                : (() => {
                    // Calculate week range for weekly view using currentWeekStart
                    const startOfWeek = new Date(currentWeekStart)
                    const endOfWeek = new Date(startOfWeek)
                    endOfWeek.setDate(startOfWeek.getDate() + 6)
                    
                    const formatDate = (date: Date) => {
                      const day = date.getDate()
                      const month = date.getMonth() + 1
                      return `${day}/${month}`
                    }
                    
                    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
                  })()
              }
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-8 h-8 text-white/80 hover:text-white" 
              onClick={calendarView === 'monthly' ? goNextMonth : goNextWeek}
            >
              ›
            </Button>
          </div>
        </div>

        {/* Social media icons */}
        <div className="flex items-center gap-[30px] -ml-[70px]">
          {socialPlatforms.map((platform) => (
            <img
              key={platform.name}
              src={platform.icon}
              alt={platform.name}
              className={`w-[36px] h-[36px] cursor-grab hover:opacity-80 transition-opacity ${
                platform.invert ? 'filter brightness-0 invert' : ''
              }`}
              draggable
              onDragStart={(e) => handleIconDragStart(e, platform.name)}
            />
          ))}
        </div>

        {/* View toggle */}
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

      {/* Calendar grid */}
      {calendarView === 'monthly' && (
        <div className="rounded-lg border border-white/10 overflow-hidden mt-4 h-[calc(100vh-120px)] flex flex-col">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-white/5">
            {vietnameseWeekdays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-white/70 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Day grid */}
          <div className="grid grid-cols-7 grid-rows-5 flex-1 overflow-y-auto">
            {calendarGrid.map((cell, i) => (
              <div
                key={i}
                className={`h-full p-2 cursor-pointer ${
                  cell.isClicked ? "border-2 border-[#E33265]" : "border-t border-b border-white/10"
                } ${
                  cell.isSelected ? "outline outline-2 outline-[#E33265]/60" : ""
                }`}
                onClick={() => {
                  setSelectedYear(cell.cellDate.getFullYear())
                  setSelectedMonth(cell.cellDate.getMonth())
                  setSelectedDay(cell.dayNum)
                  setClickedDays(new Set([cell.clickedKey]))
                }}
                onDragOver={handleCalendarDragOver}
                onDrop={(e) => handleCalendarDrop(e, cell.dayNum, cell.cellDate.getFullYear(), cell.cellDate.getMonth())}
              >
                <div className="relative flex flex-col h-full">
                  {/* Today indicator bubble */}
                  {(() => {
                    const now = new Date()
                    const isToday =
                      cell.cellDate.getDate() === now.getDate() &&
                      cell.cellDate.getMonth() === now.getMonth() &&
                      cell.cellDate.getFullYear() === now.getFullYear()
                    if (!isToday) return null
                    return (
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#E33265] rounded-full flex items-center justify-center">
                        <div className="text-xs text-white font-medium">
                          {cell.dayNum}
                        </div>
                      </div>
                    )
                  })()}
                  {/* Day number */}
                  <div className={`text-sm font-medium ${
                    cell.inCurrentMonth ? 'text-white' : 'text-white/40'
                  }`}>
                    {cell.dayNum}
                  </div>
                  
                  {/* Events list (individually scrollable per day cell) */}
                  <div className="mt-1 space-y-1 flex-1 overflow-y-auto scrollbar-hide pr-1">
                    {cell.dayEvents.map((event, eventIdx) => {
                      const [hh, mm] = (event.time || '').split(':')
                      const h24 = parseInt(hh || '0', 10)
                      const ampm = h24 >= 12 ? 'PM' : 'AM'
                      const h12 = h24 % 12 === 0 ? 12 : h24 % 12
                      const label = event.noteType === 'green' ? `Đã đăng ${String(h12)}:${(mm||'00')} ${ampm}`
                        : event.noteType === 'yellow' ? (() => {
                            const hasContent = !!(event as any).content || (event.status || '').toLowerCase().startsWith('scheduled')
                            if (!hasContent) return 'Trống'
                            return `Sẽ đăng ${String(h12)}:${(mm||'00')} ${ampm}`
                          })()
                        : event.noteType === 'red' ? (event.time ? 'add time' : 'no content')
                        : `${event.status} ${event.time}`
                      const baseColor = event.noteType === 'green' ? 'bg-[#8AE177]/20 border-[#8AE177]/40 text-[#8AE177]'
                        : event.noteType === 'yellow' ? 'bg-[#FACD5B]/20 border-[#FACD5B]/40 text-[#FACD5B]'
                        : event.noteType === 'red' ? 'bg-[#FF4F4F]/20 border-[#FF4F4F]/40 text-[#FF4F4F]'
                        : 'bg-white/10 border-white/20 text-white/80'
                      const hoverTint = event.noteType === 'green' ? 'hover:bg-[#8AE177]/30'
                        : event.noteType === 'yellow' ? 'hover:bg-[#FACD5B]/30'
                        : event.noteType === 'red' ? 'hover:bg-[#FF4F4F]/30'
                        : 'hover:bg-white/20'
                      const color = `${baseColor} ${hoverTint}`
                      return (
                        <button
                          key={eventIdx}
                          onClick={(e) => handleNoteClick(e, event, cell.cellDate)}
                          className={`inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-md border w-full h-6 whitespace-nowrap overflow-visible ${color}`}
                        >
                          <img src={getPlatformIcon(event.platform)} alt={event.platform} className={`w-4 h-4 ${needsInversion(event.platform) ? 'filter brightness-0 invert' : ''}`} />
                          <span style={{ fontFamily: '"Fira Mono", monospace', fontWeight: 500 }}>{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly view */}
      {calendarView === 'weekly' && (
        <div className="rounded-lg border border-white/10 overflow-hidden mt-4 h-[calc(100vh-120px)] flex flex-col">
          {/* Weekday headers */}
          <div className="flex bg-white/5">
            <div className="w-12 flex items-center justify-center py-2 border-r border-white/10">
              <span className="text-xs font-medium text-white/70">Giờ</span>
            </div>
            <div className="grid grid-cols-7 flex-1">
              {vietnameseWeekdays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-white/70 py-2 border-r border-white/10 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly grid with time lines - show current week */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex h-full">
              {/* Time column - fixed 40px width, separate from grid */}
              <div className="w-12 pr-0 flex-shrink-0">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="h-20 flex items-end justify-end pr-1 pb-1">
                    <span className="text-xs text-white/60">
                      {String(hour).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Days columns - 7 equal columns */}
              <div className="grid grid-cols-7 flex-1">
              {(() => {
                // Use the current week start from state
                const startOfWeek = new Date(currentWeekStart)
                
                // Generate 7 days for the week
                const weekDays = []
                for (let i = 0; i < 7; i++) {
                  const date = new Date(startOfWeek)
                  date.setDate(startOfWeek.getDate() + i)
                  weekDays.push(date)
                }
                
                return weekDays.map((date, index) => {
                  const dayNum = date.getDate()
                  const month = date.getMonth()
                  const year = date.getFullYear()
                  const isCurrentMonth = month === currentMonth
                  const isToday = date.toDateString() === new Date().toDateString()
                  
                  // Get events for this day
                  const dayEvents = getCalendarEventsForDay(year, month, dayNum, localEvents)
                  
                  return (
                    <div
                      key={index}
                      className={`border-r border-white/10 ${index === 6 ? 'border-r-0' : ''}`}
                      onClick={() => {
                        setSelectedYear(year)
                        setSelectedMonth(month)
                        setSelectedDay(dayNum)
                        setClickedDays(new Set([`${year}-${month}-${dayNum}`]))
                      }}
                      onDragOver={handleCalendarDragOver}
                      onDrop={(e) => handleCalendarDrop(e, dayNum, year, month)}
                    >
                      {/* Day header */}
                      <div className="h-8 border-b border-white/5 flex items-center justify-center bg-white/5">
                        <div className="relative">
                          {isToday && (
                            <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#E33265] rounded-full flex items-center justify-center">
                              <div className="text-xs text-white font-medium">{dayNum}</div>
                            </div>
                          )}
                          <div className={`text-xs font-medium ${isCurrentMonth ? 'text-white/90' : 'text-white/40'} ${isToday ? 'invisible' : ''}`}>
                            {dayNum}
                          </div>
                        </div>
                      </div>
                      
                      {/* Time slots */}
                      {Array.from({ length: 24 }, (_, hour) => {
                        // Find events for this specific hour
                        const hourEvents = dayEvents.filter(event => {
                          const timeParts = event.time.split(':')
                          const eventHour = parseInt(timeParts[0])
                          return eventHour === hour
                        })
                        
                        return (
                          <div key={hour} className="h-20 border-b border-white/5 group hover:bg-white/5">
                            {/* Event indicators - stacked vertically */}
                            <div className="flex flex-col gap-1 p-1 h-full overflow-y-auto">
                              {hourEvents.map((event, eventIdx) => {
                                const timeParts = event.time.split(':')
                                const minute = timeParts[1]
                                const ampm = hour >= 12 ? 'PM' : 'AM'
                                const hour12 = hour % 12 === 0 ? 12 : hour % 12
                                
                                const color = event.noteType === 'green' 
                                  ? 'bg-[#8AE177]/20 border-[#8AE177]/40'
                                  : event.noteType === 'yellow' 
                                  ? 'bg-[#FACD5B]/20 border-[#FACD5B]/40'
                                  : event.noteType === 'red'
                                  ? 'bg-[#FF4F4F]/20 border-[#FF4F4F]/40'
                                  : 'bg-white/10 border-white/20'
                                
                                const icon = event.platform === 'Instagram' ? '/instagram.png' 
                                  : event.platform === 'Facebook' ? '/fb.svg'
                                  : event.platform === 'Twitter' ? '/x.png'
                                  : event.platform === 'Threads' ? '/threads.png'
                                  : event.platform === 'Bluesky' ? '/bluesky.png'
                                  : event.platform === 'YouTube' ? '/ytube.png'
                                  : event.platform === 'TikTok' ? '/tiktok.png'
                                  : event.platform === 'Pinterest' ? '/pinterest.svg'
                                  : ''
                                
                                return (
                                  <button
                                    key={eventIdx}
                                    draggable={event.noteType === 'yellow' || event.noteType === 'red'}
                                    onDragStart={(e) => handleCalendarNoteDragStart(e, dayNum, eventIdx, year, month)}
                                    onDragEnd={handleCalendarNoteDragEnd}
                                    onClick={(e) => handleNoteClick(e, event, date)}
                                    className={`h-6 rounded border flex items-center gap-1 px-2 ${color} hover:opacity-80 flex-shrink-0`}
                                  >
                                    <img src={icon} alt={event.platform} className={`w-3 h-3 ${needsInversion(event.platform) ? 'filter brightness-0 invert' : ''}`} />
                                    <span className="text-[10px] truncate" style={{ fontFamily: '"Fira Mono", monospace', fontWeight: 500 }}>
                                      {hour12}:{minute} {ampm}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Menu */}
      {showPopup && (
        <div
          className="fixed z-50 bg-[#2A2A30] border border-white/10 rounded-md shadow-lg w-[110px] h-[55px] p-0 flex items-center justify-center gap-3"
          style={{
            left: `${showPopup.x}px`,
            top: `${showPopup.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {/* Header intentionally empty to avoid showing platform text/icon */}
          
          <div className="flex items-center justify-center h-full">
            <button onClick={() => handleOpenCreateFromCalendar(showPopup.event)} aria-label="Open post in editor">
              <img src="/Eye.svg" alt="view" className="w-6 h-6 opacity-80" />
            </button>
          </div>

          {/* Trash icon for yellow notes */}
          {showPopup.event.noteType === 'yellow' && (
            <div className="flex items-center justify-center h-full">
              <button onClick={() => setShowDeleteConfirm(true)} aria-label="Delete calendar note" className="p-1 rounded hover:bg-white/10">
                <img src="/Trash.svg" alt="delete" className="w-5 h-5 opacity-80" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog (centered modal with dark backdrop) */}
      {showPopup && showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-[#2A2A30] border border-white/10 rounded-lg shadow-lg w-[300px] p-7 text-center">
              <div className="text-xl text-white font-semibold mb-8">Xác nhận xóa?</div>
              <div className="flex items-center justify-center gap-3">
                <button className="px-4 py-2 text-m rounded bg-white/10 text-white hover:bg-white/20 w-[100px] mr-2" onClick={() => setShowDeleteConfirm(false)}>Không</button>
                <button
                  className="px-4 py-2 text-m rounded bg-red-500/80 text-white hover:bg-red-500 w-[100px]"
                  onClick={() => {
                    try {
                      const y = showPopup.year!, m = showPopup.month!, d = showPopup.day!
                      const key = `${y}-${m}-${d}`
                      const list = [...(localEvents[key] || [])]
                      const idx = list.findIndex(ev => ev === showPopup.event)
                      if (idx >= 0) {
                        list.splice(idx, 1)
                        const updated = { ...localEvents, [key]: list }
                        setLocalEvents(updated)
                        try { localStorage.setItem('calendarEvents', JSON.stringify(updated)) } catch {}
                      }
                    } catch {}
                    setShowDeleteConfirm(false)
                    setShowPopup(null)
                  }}
                >Xóa</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Backdrop to close popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-10"
          onClick={closePopup}
        />
      )}
    </div>
  )
}
