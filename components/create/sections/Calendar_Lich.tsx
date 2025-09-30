"use client"

import { useState } from "react"
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
  const [currentMonth, setCurrentMonth] = useState<number>(8) // September 2025
  const [currentYear, setCurrentYear] = useState<number>(2025)
  const [calendarView, setCalendarView] = useState<'monthly' | 'weekly'>("monthly")
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [selectedMonth, setSelectedMonth] = useState<number>(8)
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [clickedDays, setClickedDays] = useState<Set<string>>(new Set())
  const [showPopup, setShowPopup] = useState<{x: number, y: number, event: CalendarEvent} | null>(null)
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
    if (onEventAdd) {
      onEventAdd(year, month, day, platform)
    }
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
      
      const dayEvents = getCalendarEventsForDay(cellDate.getFullYear(), cellDate.getMonth(), dayNum, calendarEvents)
      
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

  // Get platform icon for calendar events
  const getPlatformIcon = (platformName: string) => {
    const platform = socialPlatforms.find(p => p.name === platformName)
    return platform ? platform.icon : '/placeholder.svg'
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
  const handleNoteClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation()
    setShowPopup({
      x: e.clientX,
      y: e.clientY,
      event: event
    })
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
              onClick={goPrevMonth}
            >
              ‹
            </Button>
            <div className="px-4 py-1 rounded-md border border-white/20 bg-white/10 text-white flex items-center justify-center">
              {vietnameseMonths[currentMonth]}, {currentYear}
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-8 h-8 text-white/80 hover:text-white" 
              onClick={goNextMonth}
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
                <div className="relative">
                  {/* Day number */}
                  <div className={`text-sm font-medium ${
                    cell.inCurrentMonth ? 'text-white' : 'text-white/40'
                  }`}>
                    {cell.dayNum}
                  </div>
                  
                  {/* Events as labeled chips per spec */}
                  <div className="mt-1 space-y-1">
                    {cell.dayEvents.map((event, eventIdx) => {
                      const [hh, mm] = (event.time || '').split(':')
                      const h24 = parseInt(hh || '0', 10)
                      const ampm = h24 >= 12 ? 'PM' : 'AM'
                      const h12 = h24 % 12 === 0 ? 12 : h24 % 12
                      const label = event.noteType === 'green' ? `posted ${String(h12)}:${(mm||'00')} ${ampm}`
                        : event.noteType === 'yellow' ? `scheduled ${String(h12)}:${(mm||'00')} ${ampm}`
                        : event.noteType === 'red' ? (event.time ? 'add time' : 'no content')
                        : `${event.status} ${event.time}`
                      const color = event.noteType === 'green' ? 'bg-[#8AE177]/20 border-[#8AE177]/40 text-[#8AE177]'
                        : event.noteType === 'yellow' ? 'bg-[#FACD5B]/20 border-[#FACD5B]/40 text-[#FACD5B]'
                        : event.noteType === 'red' ? 'bg-[#FF4F4F]/20 border-[#FF4F4F]/40 text-[#FF4F4F]'
                        : 'bg-white/10 border-white/20 text-white/80'
                      return (
                        <button
                          key={eventIdx}
                          onClick={(e) => handleNoteClick(e, event)}
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

      {/* Popup Menu */}
      {showPopup && (
        <div
          className="fixed z-50 bg-[#2A2A30] border border-white/10 rounded-lg shadow-lg p-4 min-w-[200px]"
          style={{
            left: `${showPopup.x}px`,
            top: `${showPopup.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <img
              src={getPlatformIcon(showPopup.event.platform)}
              alt={showPopup.event.platform}
              className={`w-4 h-4 ${
                needsInversion(showPopup.event.platform) ? 'filter brightness-0 invert' : ''
              }`}
            />
            <span className="font-medium text-white">{showPopup.event.platform}</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-white/70">
              <div>Trạng thái: {showPopup.event.noteType === 'green' ? 'Đã đăng' : 
                                 showPopup.event.noteType === 'yellow' ? 'Chờ đăng' : 'Thất bại'}</div>
              <div>Thời gian: {showPopup.event.time}</div>
              {showPopup.event.noteType === 'yellow' && (
                <div className="mt-2 flex items-center gap-2">
                  <input type="text" value={noteTime.hour} onChange={(e) => setNoteTime(prev => ({...prev, hour: e.target.value}))} className="w-12 bg-gray-800/50 text-white rounded px-2 py-1 text-center" />
                  <span className="text-white">:</span>
                  <input type="text" value={noteTime.minute} onChange={(e) => setNoteTime(prev => ({...prev, minute: e.target.value}))} className="w-12 bg-gray-800/50 text-white rounded px-2 py-1 text-center" />
                  <select value={noteTime.amPm} onChange={(e) => setNoteTime(prev => ({...prev, amPm: e.target.value as 'AM' | 'PM'}))} className="bg-gray-800/50 text-white rounded px-2 py-1">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              )}
              {showPopup.event.content && (
                <div className="mt-2">
                  <div className="text-xs text-white/50 mb-1">Nội dung:</div>
                  <div className="text-xs bg-white/5 p-2 rounded max-h-20 overflow-y-auto">
                    {showPopup.event.content}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  // Handle edit action
                  console.log('Edit event:', showPopup.event)
                  closePopup()
                }}
                className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  // Handle delete action
                  console.log('Delete event:', showPopup.event)
                  closePopup()
                }}
                className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
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
