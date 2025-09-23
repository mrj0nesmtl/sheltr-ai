/**
 * Secure Random Utilities
 * 
 * Provides cryptographically secure random ID generation
 * to replace insecure Math.random() usage.
 */

/**
 * Generate a cryptographically secure random ID
 * @param length - Length of the random string (default: 12)
 * @param prefix - Optional prefix for the ID
 * @returns Secure random ID string
 */
export function generateSecureId(length: number = 12, prefix?: string): string {
  // Use crypto.getRandomValues for secure randomness
  const array = new Uint8Array(Math.ceil(length * 3 / 4));
  crypto.getRandomValues(array);
  
  // Convert to base64 and clean up
  const base64 = btoa(String.fromCharCode(...array))
    .replace(/[+/]/g, '')  // Remove +/ characters
    .replace(/=/g, '')     // Remove padding
    .substring(0, length); // Trim to desired length
  
  return prefix ? `${prefix}_${base64}` : base64;
}

/**
 * Generate a secure session ID
 * @returns Secure session ID with timestamp and random component
 */
export function generateSecureSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSecureId(9);
  return `sess_${timestamp}_${randomPart}`;
}

/**
 * Generate a secure public session ID for anonymous users
 * @returns Secure public session ID
 */
export function generateSecurePublicSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSecureId(9);
  return `public_${timestamp}_${randomPart}`;
}

/**
 * Check if crypto.getRandomValues is available
 * Falls back to a warning if not available (shouldn't happen in modern browsers)
 */
export function isSecureRandomAvailable(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function';
}

/**
 * Fallback for environments without crypto.getRandomValues
 * @param length - Length of the random string
 * @deprecated Use generateSecureId instead
 */
export function generateInsecureId(length: number = 12): string {
  console.warn('⚠️ Using insecure random ID generation - crypto.getRandomValues not available');
  return Math.random().toString(36).substr(2, length);
}
