/**
 * URL Security Utilities for SHELTR
 * Prevents URL-based attacks and malicious redirects
 */

/**
 * Comprehensive URL validation and sanitization
 */
export function sanitizeUrl(url: string): string {
  try {
    // Handle empty or null URLs
    if (!url || typeof url !== 'string') {
      return '#';
    }

    // Remove dangerous characters and normalize
    url = url.trim();
    
    // Block obvious malicious patterns
    const maliciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
      /<script/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
    ];

    if (maliciousPatterns.some(pattern => pattern.test(url))) {
      console.warn('🔒 [SECURITY] Blocked malicious URL pattern:', url.substring(0, 50));
      return '#';
    }

    // Parse URL to validate structure
    const parsed = new URL(url, window.location.origin);
    
    // Only allow specific protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn('🔒 [SECURITY] Blocked disallowed protocol:', parsed.protocol);
      return '#';
    }

    // Block suspicious domains/IPs
    const blockedPatterns = [
      /127\.0\.0\.1/,
      /0\.0\.0\.0/,
      /localhost(?!:3000|:8000)/i, // Allow dev servers
      /\.internal$/i,
      /\.local$/i,
      /10\.\d+\.\d+\.\d+/, // Private IP ranges
      /192\.168\.\d+\.\d+/,
      /172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/,
    ];

    if (blockedPatterns.some(pattern => pattern.test(parsed.hostname))) {
      console.warn('🔒 [SECURITY] Blocked suspicious hostname:', parsed.hostname);
      return '#';
    }

    // For external URLs, validate against whitelist in production
    if (process.env.NODE_ENV === 'production' && !isInternalUrl(parsed)) {
      if (!isWhitelistedDomain(parsed.hostname)) {
        console.warn('🔒 [SECURITY] External URL not in whitelist:', parsed.hostname);
        return '#';
      }
    }

    return parsed.toString();
  } catch (error) {
    console.warn('🔒 [SECURITY] URL parsing failed:', error);
    return '#';
  }
}

/**
 * Check if URL is internal to SHELTR
 */
function isInternalUrl(parsed: URL): boolean {
  const internalDomains = [
    'sheltr-ai.web.app',
    'sheltr-ai.firebaseapp.com',
    'localhost',
    '127.0.0.1',
  ];

  return internalDomains.some(domain => 
    parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
  );
}

/**
 * Check if domain is in the whitelist for external links
 */
function isWhitelistedDomain(hostname: string): boolean {
  const whitelistedDomains = [
    // Social media
    'twitter.com',
    'x.com',
    'facebook.com',
    'linkedin.com',
    'instagram.com',
    'bsky.app',
    
    // Documentation and resources
    'github.com',
    'firebase.google.com',
    'docs.firebase.com',
    'nextjs.org',
    'reactjs.org',
    
    // Payment and financial
    'adyen.com',
    'stripe.com',
    
    // Maps and location
    'maps.google.com',
    'openstreetmap.org',
    
    // Blockchain and crypto
    'etherscan.io',
    'coinbase.com',
    
    // News and media
    'perplexity.ai', // For Toni Lane Casserly link
    
    // Government and official
    'gov',
    'org',
  ];

  return whitelistedDomains.some(domain => 
    hostname === domain || 
    hostname.endsWith(`.${domain}`) ||
    (domain.startsWith('.') && hostname.endsWith(domain))
  );
}

/**
 * Validate and sanitize redirect URLs
 */
export function sanitizeRedirectUrl(url: string, allowedOrigins?: string[]): string {
  const sanitized = sanitizeUrl(url);
  
  if (sanitized === '#') {
    return '/'; // Safe fallback to home
  }

  try {
    const parsed = new URL(sanitized);
    
    // If allowedOrigins specified, check against them
    if (allowedOrigins && allowedOrigins.length > 0) {
      const isAllowed = allowedOrigins.some(origin => {
        const allowedParsed = new URL(origin);
        return parsed.origin === allowedParsed.origin;
      });
      
      if (!isAllowed) {
        console.warn('🔒 [SECURITY] Redirect to non-allowed origin blocked:', parsed.origin);
        return '/';
      }
    }

    // Additional checks for redirects
    if (parsed.pathname.includes('..')) {
      console.warn('🔒 [SECURITY] Path traversal in redirect blocked');
      return '/';
    }

    return sanitized;
  } catch {
    return '/';
  }
}

/**
 * Create a secure link element with proper attributes
 */
export function createSecureLink(url: string, text: string, options?: {
  external?: boolean;
  className?: string;
  target?: string;
}): HTMLAnchorElement {
  const link = document.createElement('a');
  const sanitizedUrl = sanitizeUrl(url);
  
  link.href = sanitizedUrl;
  link.textContent = text;
  
  if (options?.className) {
    link.className = options.className;
  }
  
  // For external links, add security attributes
  if (options?.external || !isInternalUrl(new URL(sanitizedUrl, window.location.origin))) {
    link.target = options?.target || '_blank';
    link.rel = 'noopener noreferrer';
  }
  
  return link;
}

/**
 * Validate query parameters for potential injection
 */
export function sanitizeQueryParams(params: URLSearchParams): URLSearchParams {
  const sanitized = new URLSearchParams();
  
  for (const [key, value] of params.entries()) {
    // Sanitize key and value
    const sanitizedKey = key.replace(/[^\w-_]/g, '');
    const sanitizedValue = value.replace(/[<>'"&\x00-\x1f\x7f-\x9f]/g, '');
    
    if (sanitizedKey && sanitizedValue.length <= 1000) { // Limit value length
      sanitized.set(sanitizedKey, sanitizedValue);
    }
  }
  
  return sanitized;
}

/**
 * React hook for secure URL handling
 */
export function useSecureUrl(url: string) {
  try {
    const sanitized = sanitizeUrl(url);
    const isExternal = !isInternalUrl(new URL(sanitized, window.location.origin));
    
    return {
      sanitizedUrl: sanitized,
      isExternal,
      linkProps: {
        href: sanitized,
        ...(isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer'
        })
      }
    };
  } catch {
    return {
      sanitizedUrl: '#',
      isExternal: false,
      linkProps: { href: '#' }
    };
  }
}

// Example usage:
// const safeUrl = sanitizeUrl(userInput);
// const { sanitizedUrl, linkProps } = useSecureUrl(someUrl);
// const secureLink = createSecureLink(url, 'Click here', { external: true });
