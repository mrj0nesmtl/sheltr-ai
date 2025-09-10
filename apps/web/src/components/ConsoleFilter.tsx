'use client';

import { useEffect } from 'react';

/**
 * Console Filter Component
 * Suppresses noisy .txt 404 errors for cleaner production demos
 * while preserving important debugging information
 */
export default function ConsoleFilter() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store original console methods
      const originalError = console.error;
      const originalWarn = console.warn;
      
      // Handle uncaught promise rejections
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const error = event.reason;
        const message = error?.message || error?.toString() || 'Unknown error';
        
        // Suppress Firebase connection errors and auth errors during development
        if (message.includes('Could not establish connection') ||
            message.includes('auth/network-request-failed') ||
            message.includes('FirebaseError')) {
          event.preventDefault();
          return;
        }
      };
      
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Override console.error to filter .txt 404s
      console.error = (...args: any[]) => {
        const message = args.join(' ');
        
        // Suppress .txt file 404 errors (RSC payload noise)
        if (message.includes('.txt') && (message.includes('404') || message.includes('Not Found'))) {
          return;
        }
        
        // Suppress other noisy Next.js hydration warnings
        if (message.includes('Warning: Extra attributes from the server') ||
            message.includes('Warning: Prop `') ||
            message.includes('hydration') ||
            message.includes('Could not establish connection') ||
            message.includes('Uncaught (in promise)')) {
          return;
        }
        
        // Allow all other errors through
        originalError.apply(console, args);
      };
      
      // Override console.warn to filter hydration warnings
      console.warn = (...args: any[]) => {
        const message = args.join(' ');
        
        // Suppress hydration warnings
        if (message.includes('Warning: Extra attributes from the server') ||
            message.includes('Warning: Prop `')) {
          return;
        }
        
        // Allow all other warnings through
        originalWarn.apply(console, args);
      };
      
      // Cleanup function to restore original console methods
      return () => {
        console.error = originalError;
        console.warn = originalWarn;
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
