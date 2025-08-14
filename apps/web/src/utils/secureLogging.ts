/**
 * Secure Logging Utilities for SHELTR
 * Prevents log injection attacks by sanitizing user input before logging
 */

/**
 * Sanitizes user input to prevent log injection attacks
 * @param input - The input to sanitize
 * @returns Sanitized string safe for logging
 */
export function sanitizeForLogging(input: unknown): string {
  if (input === null || input === undefined) {
    return '[null]';
  }

  let str = String(input);
  
  // Remove or escape dangerous characters that could be used for log injection
  str = str
    // Remove ANSI escape sequences
    .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
    // Remove carriage returns and line feeds that could break log format
    .replace(/[\r\n\f\v]/g, ' ')
    // Escape tab characters
    .replace(/\t/g, '\\t')
    // Limit length to prevent log flooding
    .substring(0, 1000);

  // If the string contains suspicious patterns, further sanitize
  if (containsSuspiciousPatterns(str)) {
    // Base64 encode suspicious content to make it safe
    return `[SANITIZED:${btoa(str).substring(0, 100)}]`;
  }

  return str;
}

/**
 * Checks if a string contains patterns commonly used in log injection attacks
 */
function containsSuspiciousPatterns(str: string): boolean {
  const suspiciousPatterns = [
    // Script injection patterns
    /<script/i,
    /javascript:/i,
    // Log format manipulation
    /\[ERROR\]/i,
    /\[WARN\]/i,
    /\[INFO\]/i,
    // Shell injection patterns
    /\$\(/,
    /`[^`]*`/,
    // Path traversal
    /\.\.\//,
    // SQL injection patterns in logs
    /union\s+select/i,
    /drop\s+table/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(str));
}

/**
 * Secure logging functions that automatically sanitize input
 */
export const secureLog = {
  info: (message: string, ...args: unknown[]) => {
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.log(`[INFO] ${sanitizeForLogging(message)}`, ...sanitizedArgs);
  },

  warn: (message: string, ...args: unknown[]) => {
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.warn(`[WARN] ${sanitizeForLogging(message)}`, ...sanitizedArgs);
  },

  error: (message: string, ...args: unknown[]) => {
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.error(`[ERROR] ${sanitizeForLogging(message)}`, ...sanitizedArgs);
  },

  debug: (message: string, ...args: unknown[]) => {
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.debug(`[DEBUG] ${sanitizeForLogging(message)}`, ...sanitizedArgs);
  },

  // Specialized logging for SHELTR platform
  shelter: (action: string, shelterId: string, details?: unknown) => {
    console.log(
      `🏠 [SHELTER] ${sanitizeForLogging(action)}`,
      `ID: ${sanitizeForLogging(shelterId)}`,
      details ? sanitizeForLogging(details) : ''
    );
  },

  participant: (action: string, participantId: string, details?: unknown) => {
    console.log(
      `👤 [PARTICIPANT] ${sanitizeForLogging(action)}`,
      `ID: ${sanitizeForLogging(participantId)}`,
      details ? sanitizeForLogging(details) : ''
    );
  },

  donation: (action: string, amount: number, participantId?: string) => {
    console.log(
      `💰 [DONATION] ${sanitizeForLogging(action)}`,
      `Amount: $${sanitizeForLogging(amount)}`,
      participantId ? `Participant: ${sanitizeForLogging(participantId)}` : ''
    );
  },

  security: (event: string, details?: unknown) => {
    console.warn(
      `🔒 [SECURITY] ${sanitizeForLogging(event)}`,
      details ? sanitizeForLogging(details) : ''
    );
  },

  analytics: (event: string, data?: Record<string, unknown>) => {
    const sanitizedData = data ? 
      Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          sanitizeForLogging(key),
          sanitizeForLogging(value)
        ])
      ) : {};
    
    console.log(
      `📊 [ANALYTICS] ${sanitizeForLogging(event)}`,
      sanitizedData
    );
  }
};

/**
 * Sanitizes URLs to prevent malicious redirects
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow specific protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '#'; // Return safe fallback
    }

    // Block common malicious domains/patterns
    const blockedPatterns = [
      /bit\.ly/i,
      /tinyurl/i,
      /localhost(?!:3000)/i, // Block localhost except for development
      /127\.0\.0\.1/i,
      /0\.0\.0\.0/i,
    ];

    if (blockedPatterns.some(pattern => pattern.test(parsed.hostname))) {
      return '#';
    }

    return parsed.toString();
  } catch {
    // If URL parsing fails, return safe fallback
    return '#';
  }
}

/**
 * Creates a secure template literal function that sanitizes interpolated values
 */
export function secureTemplate(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = '';
  
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += sanitizeForLogging(values[i]);
    }
  }
  
  return result;
}

// Example usage:
// secureLog.info("User logged in", userId);
// secureLog.shelter("Metrics fetched", shelterId);
// secureLog.donation("Payment completed", amount, participantId);
// secureLog.security("Suspicious activity detected", suspiciousData);
