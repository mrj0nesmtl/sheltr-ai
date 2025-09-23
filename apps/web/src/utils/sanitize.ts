/**
 * Content Sanitization Utilities
 * 
 * Provides secure content sanitization to prevent XSS attacks
 * and DOM text reinterpretation issues.
 */

/**
 * Sanitize text content for safe HTML attribute usage
 * @param input - Raw text input
 * @returns Sanitized text safe for HTML attributes
 */
export function sanitizeForAttribute(input: string | undefined | null): string {
  if (!input) return '';
  
  return input
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .replace(/[\r\n\t]/g, ' ') // Replace line breaks with spaces
    .trim()
    .substring(0, 500); // Limit length to prevent abuse
}

/**
 * Sanitize text content for safe display in React components
 * @param input - Raw text input
 * @returns Sanitized text safe for display
 */
export function sanitizeForDisplay(input: string | undefined | null): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        default: return char;
      }
    })
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize array of tags/categories
 * @param tags - Array of tag strings
 * @returns Sanitized array of tags
 */
export function sanitizeTags(tags: string[] | undefined | null): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  
  return tags
    .map(tag => sanitizeForDisplay(tag))
    .filter(tag => tag.length > 0)
    .slice(0, 20); // Limit number of tags
}

/**
 * Sanitize URL for safe usage in src attributes
 * @param url - Raw URL input
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  try {
    // Allow only http, https, and data URLs
    const parsed = new URL(url);
    if (['http:', 'https:', 'data:'].includes(parsed.protocol)) {
      return url;
    }
    return '';
  } catch {
    // If URL parsing fails, it's not a valid URL
    return '';
  }
}

/**
 * Validate and sanitize category names
 * @param category - Raw category input
 * @returns Sanitized category name
 */
export function sanitizeCategory(category: string | undefined | null): string {
  if (!category) return 'uncategorized';
  
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, '') // Only allow alphanumeric, hyphens, underscores
    .substring(0, 50)
    .trim() || 'uncategorized';
}

/**
 * Sanitize date string for display
 * @param date - Raw date input
 * @returns Sanitized date string
 */
export function sanitizeDate(date: string | Date | undefined | null): string {
  if (!date) return 'Unknown date';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}
