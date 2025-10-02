/**
 * Calendar utility functions
 * Handles date calculations and calendar operations
 */

/**
 * Get the number of days in a specific month
 * @param year - The year
 * @param month - The month (0-11)
 * @returns Number of days in the month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Vietnamese month names
 */
export const vietnameseMonths = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

/**
 * Vietnamese weekday names (Monday first)
 */
export const vietnameseWeekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

/**
 * Social media platforms configuration
 */
export const socialPlatforms = [
  { name: 'Facebook', icon: '/fb.svg', color: 'bg-blue-500' },
  { name: 'Instagram', icon: '/instagram.png', color: 'bg-pink-500' },
  { name: 'Twitter', icon: '/x.png', color: 'bg-black', invert: true },
  { name: 'Threads', icon: '/threads.png', color: 'bg-black', invert: true },
  { name: 'Bluesky', icon: '/bluesky.png', color: 'bg-sky-500' },
  { name: 'YouTube', icon: '/ytube.png', color: 'bg-red-500' },
  { name: 'TikTok', icon: '/tiktok.png', color: 'bg-black' },
  { name: 'Pinterest', icon: '/pinterest.svg', color: 'bg-red-500' }
]

/**
 * Calendar event types
 */
export type CalendarEventType = 'green' | 'yellow' | 'red'

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  platform: string
  time: string
  status: string
  noteType: CalendarEventType
  content?: string // For checking if content is written
  hasScheduledTime?: boolean // For checking if time is set
  isPublished?: boolean // For published posts
  isFailed?: boolean // For failed posts
}

/**
 * Get calendar events for a specific day
 * @param year - The year
 * @param month - The month (0-11)
 * @param day - The day
 * @param calendarEvents - The calendar events object
 * @returns Array of events for the day
 */
export const getCalendarEventsForDay = (
  year: number, 
  month: number, 
  day: number, 
  calendarEvents: Record<string, CalendarEvent[]>
): CalendarEvent[] => {
  // Use year-month-day as unique key to avoid cross-month collisions (e.g., day 3 in different months)
  const key = `${year}-${month}-${day}`
  return calendarEvents[key] || []
}
