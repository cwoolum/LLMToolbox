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

/**
 * Supported notification types
 */
export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push"
}

/**
 * User contact information
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  deviceId?: string;
}

/**
 * Notification configuration options
 */
export interface NotificationOptions {
  /** Should notification be sent immediately */
  immediate: boolean;
  /** Priority level (1-5) */
  priority?: number;
  /** Retry settings if delivery fails */
  retry?: {
    /** Number of retry attempts */
    count: number;
    /** Delay between retries in seconds */
    delaySeconds: number;
  };
}

/**
 * Send a notification to a user
 * @param userId - ID of the user to notify
 * @param message - Notification message content
 * @param type - Type of notification to send
 * @param contactInfo - User's contact information
 * @param options - Configuration options for the notification
 * @returns Delivery status information
 */
export function sendNotification(
  userId: string, 
  message: string, 
  type: NotificationType, 
  contactInfo: ContactInfo, 
  options?: NotificationOptions
): { delivered: boolean; timestamp: number; messageId: string } {
  return { 
    delivered: true, 
    timestamp: Date.now(), 
    messageId: `msg-${userId}-${Date.now()}` 
  };
}

/**
 * Process an array of items with optional transformation
 * @param items - Array of items to process
 * @param processingOptions - Processing configuration
 * @returns Processing results
 */
export function processItems<T, R = T>(
  items: T[],
  processingOptions: {
    /** Transform function to apply to each item */
    transform?: (item: T) => R;
    /** Filter predicate to select items */
    filter?: (item: T) => boolean;
    /** Maximum number of items to process */
    limit?: number;
  }
): { processed: number; results: R[] } {
  let filteredItems = processingOptions.filter 
    ? items.filter(processingOptions.filter) 
    : items;
  
  if (processingOptions.limit !== undefined) {
    filteredItems = filteredItems.slice(0, processingOptions.limit);
  }
  
  const results = processingOptions.transform 
    ? filteredItems.map(item => processingOptions.transform!(item)) 
    : filteredItems as unknown as R[];
    
  return {
    processed: results.length,
    results
  };
}

/**
 * Data validation result
 */
type ValidationResult = {
  valid: boolean;
  errors?: string[];
};

/**
 * Validate user information against schema
 * @param userData - User data object with various properties 
 * @returns Validation result with errors if invalid
 */
export function validateUserData(
  userData: Record<string, string | number | boolean | null | undefined>
): ValidationResult {
  return { valid: true };
}