/**
 * Utility functions for localStorage operations
 * Handles saving and loading data with error handling
 */

/**
 * Save data to localStorage with error handling
 * @param key - The localStorage key
 * @param data - The data to save (will be JSON stringified)
 */
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Load data from localStorage with error handling
 * @param key - The localStorage key
 * @param defaultValue - Default value to return if key doesn't exist or parsing fails
 * @returns The parsed data or default value
 */
export const loadFromLocalStorage = (key: string, defaultValue: any): any => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

