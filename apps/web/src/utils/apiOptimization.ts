/**
 * API Optimization Utilities
 * Helps reduce unnecessary API calls and monitor usage
 */

// Cache for API responses to reduce duplicate calls
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

/**
 * Cache API responses to reduce duplicate calls
 */
export function cacheApiResponse<T>(key: string, data: T, ttlMinutes: number = 5): void {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  });
}

/**
 * Get cached API response if still valid
 */
export function getCachedApiResponse<T>(key: string): T | null {
  const cached = apiCache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > cached.ttl;
  if (isExpired) {
    apiCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

/**
 * Debounce function to prevent rapid API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), waitMs);
  };
}

/**
 * Throttle function to limit API call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limitMs) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * API call counter for monitoring
 */
class ApiMonitor {
  private calls: Map<string, number> = new Map();
  private startTime = Date.now();
  
  logCall(endpoint: string): void {
    const current = this.calls.get(endpoint) || 0;
    this.calls.set(endpoint, current + 1);
  }
  
  getStats(): { endpoint: string; calls: number; callsPerMinute: number }[] {
    const elapsed = (Date.now() - this.startTime) / (1000 * 60); // minutes
    
    return Array.from(this.calls.entries()).map(([endpoint, calls]) => ({
      endpoint,
      calls,
      callsPerMinute: Math.round((calls / elapsed) * 100) / 100
    }));
  }
  
  reset(): void {
    this.calls.clear();
    this.startTime = Date.now();
  }
}

export const apiMonitor = new ApiMonitor();

/**
 * Optimized intervals for different types of data
 */
export const REFRESH_INTERVALS = {
  REAL_TIME: 30 * 1000,      // 30 seconds - for critical real-time data
  FREQUENT: 2 * 60 * 1000,   // 2 minutes - for frequently changing data
  NORMAL: 5 * 60 * 1000,     // 5 minutes - for normal dashboard data
  SLOW: 15 * 60 * 1000,      // 15 minutes - for slow-changing data
  STATIC: 60 * 60 * 1000,    // 1 hour - for mostly static data
} as const;

/**
 * Smart refresh hook that adjusts interval based on user activity
 */
export function useSmartRefresh(
  callback: () => void,
  baseInterval: number,
  dependencies: any[] = []
): void {
  // This would be implemented as a React hook in a real scenario
  // For now, it's a utility function
}

/**
 * Log API optimization recommendations
 */
export function logOptimizationStats(): void {
  const stats = apiMonitor.getStats();
  
  console.group('🚀 API Optimization Stats');
  console.table(stats);
  
  // Recommendations
  const highFrequency = stats.filter(s => s.callsPerMinute > 2);
  if (highFrequency.length > 0) {
    console.warn('⚠️ High frequency endpoints (>2 calls/min):');
    highFrequency.forEach(s => {
      console.warn(`  ${s.endpoint}: ${s.callsPerMinute} calls/min`);
    });
    console.info('💡 Consider caching, debouncing, or increasing intervals');
  }
  
  console.groupEnd();
}
