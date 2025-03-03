/**
 * Get weather information for a location
 * @param location - City name or zip code
 * @param unit - Temperature unit (metric or imperial)
 * @returns Weather information
 */
export function getWeather(location: string, unit: string = "metric"): string {
  return `Weather information for ${location} in ${unit}`;
}

/**
 * Search for information on the web
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Search results
 */
export function searchWeb(query: string, limit: number = 5): string[] {
  return Array(limit).fill(`Result for "${query}"`);
}

/**
 * Save a user preference
 * @param key - Preference key
 * @param value - Preference value
 * @param userId - User ID
 * @returns Success message
 */
export function saveUserPreference(key: string, value: string, userId: string): { success: boolean } {
  return { success: true };
}