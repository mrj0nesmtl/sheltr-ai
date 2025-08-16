/**
 * Secure URL validation and sanitization utilities
 * Fixes CodeQL "Incomplete URL substring sanitization" issues
 */

/**
 * Safely checks if a URL contains a specific domain
 * @param url - The URL to check
 * @param domain - The domain to look for
 * @returns boolean indicating if the domain is present
 */
export function isSecureDomain(url: string | undefined | null, domain: string): boolean {
  if (!url || !domain) return false;
  
  try {
    // Use URL constructor for proper parsing
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const targetDomain = domain.toLowerCase();
    
    // Check for exact match or subdomain
    return hostname === targetDomain || hostname.endsWith(`.${targetDomain}`);
  } catch {
    // If URL parsing fails, return false for security
    return false;
  }
}

/**
 * Safely extracts username from email address
 * @param email - The email address
 * @returns The username part or fallback string
 */
export function getEmailUsername(email: string | undefined | null, fallback: string = 'Unknown'): string {
  if (!email) return fallback;
  
  try {
    // Use URL constructor to safely parse email as mailto URL
    const mailtoUrl = `mailto:${email}`;
    const urlObj = new URL(mailtoUrl);
    const username = urlObj.pathname.split('@')[0];
    
    return username || fallback;
  } catch {
    // If parsing fails, return fallback for security
    return fallback;
  }
}

/**
 * Validates if a string is a safe URL
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is safe
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
