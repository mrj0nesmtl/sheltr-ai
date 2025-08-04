"use client";

import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Dashboard navigation order based on user role - matches sidebar menu order exactly
  const getDashboardRoutes = (role: string) => {
    switch (role) {
      case 'super_admin':
        return [
          '/dashboard',                    // Overview
          '/dashboard/platform',           // Platform Management  
          '/dashboard/users',              // User Management
          '/dashboard/shelters',           // Shelter Network
          '/dashboard/financial',          // Financial Oversight
          '/dashboard/security',           // Security & Compliance
          '/dashboard/analytics'           // Analytics
        ];
      case 'admin':
      case 'shelter_admin':
        return [
          '/dashboard/shelter-admin',                    // Shelter Overview
          '/dashboard/shelter-admin/participants',       // Participants
          '/dashboard/shelter-admin/services',           // Services
          '/dashboard/shelter-admin/resources',          // Resources
          '/dashboard/shelter-admin/reports',            // Reports
          '/dashboard/shelter-admin/settings'            // Settings
        ];
      case 'participant':
        return [
          '/dashboard/participant',           // My Dashboard
          '/dashboard/participant/profile',   // Profile
          '/dashboard/participant/services',  // Services
          '/dashboard/participant/wallet',    // Wallet
          '/dashboard/participant/support'    // Support
        ];
      case 'donor':
        return [
          '/dashboard/donor',                        // Donor Overview
          '/dashboard/donor/donations',              // Donations
          '/dashboard/donor/impact',                 // Impact
          '/dashboard/donor/tax-documents',          // Tax Documents
          '/dashboard/donor/sheltr-portfolio',       // SHELTR Portfolio
          '/dashboard/donor/settings'                // Settings
        ];
      default:
        return ['/dashboard'];
    }
  };

  const getCurrentRouteIndex = () => {
    if (typeof window === 'undefined') return 0;
    
    const currentPath = window.location.pathname;
    const routes = getDashboardRoutes(user?.role || '');
    const index = routes.findIndex(route => currentPath === route);
    return index !== -1 ? index : 0;
  };

  const navigateBack = () => {
    const routes = getDashboardRoutes(user?.role || '');
    const currentIndex = getCurrentRouteIndex();
    const prevIndex = Math.max(0, currentIndex - 1);
    router.push(routes[prevIndex]);
  };

  const navigateForward = () => {
    const routes = getDashboardRoutes(user?.role || '');
    const currentIndex = getCurrentRouteIndex();
    const nextIndex = Math.min(routes.length - 1, currentIndex + 1);
    router.push(routes[nextIndex]);
  };

  const openChat = () => {
    // Use the global function exposed by ChatbotWidget
    const globalWindow = window as unknown as { openChatbot?: () => void };
    if (globalWindow.openChatbot) {
      globalWindow.openChatbot();
    } else {
      // Fallback to the original method
      const chatButton = document.querySelector('[data-chatbot-trigger]');
      if (chatButton) {
        (chatButton as HTMLElement).click();
      }
    }
  };

  if (!user) return null; // Only show for authenticated users

  // Only show on mobile screens
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if sidebar is open by looking for the sidebar overlay or sidebar visibility
  useEffect(() => {
    const checkSidebarState = () => {
      // Look for mobile sidebar overlay (when sidebar is open)
      const sidebarOverlay = document.querySelector('[data-sidebar-overlay]');
      // Look for sidebar element and check if it's visible
      const sidebarElement = document.querySelector('aside');
      const isVisible = sidebarElement && !sidebarElement.classList.contains('-translate-x-full');
      
      setSidebarOpen(!!sidebarOverlay || !!isVisible);
    };

    // Check initially
    checkSidebarState();

    // Set up observer for DOM changes (sidebar toggle)
    const observer = new MutationObserver(checkSidebarState);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  if (!isMobile || sidebarOpen) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[9999] pointer-events-auto ${className}`} 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        minHeight: '80px',
        maxHeight: '80px',
        width: '100vw',
        maxWidth: '100vw'
      }}
    >
      {/* Apple Liquid Glass Effect Container */}
      <div className="relative w-full">
        {/* Glass Background with Dynamic Blur */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-t border-white/20 dark:border-white/10 rounded-t-3xl shadow-lg" style={{ height: '80px' }}>
          {/* Contextual Color Overlay - adapts to content */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-purple-500/3 to-transparent rounded-t-3xl"></div>
          {/* Glass Refraction Highlights */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>

        {/* Navigation Content */}
        <div className="relative flex items-center justify-around h-20 px-6 py-3 w-full" style={{ height: '80px' }}>
          {/* Back Button */}
          <button
            onClick={navigateBack}
            className="group flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 hover:shadow-lg flex-shrink-0"
            title="Go Back"
            style={{ height: '56px', width: '56px' }}
          >
            <ArrowLeft className="h-7 w-7 text-gray-800 dark:text-white group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Chat Button */}
          <button
            onClick={openChat}
            className="group flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 backdrop-blur-md border border-blue-300/30 dark:border-blue-400/20 hover:bg-blue-500/20 dark:hover:bg-blue-400/20 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex-shrink-0"
            title="Open Chat"
            style={{ height: '56px', width: '56px' }}
          >
            <MessageCircle className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Theme Toggle */}
          <div className="group flex items-center justify-center h-14 w-14 rounded-2xl bg-purple-500/10 dark:bg-purple-400/10 backdrop-blur-md border border-purple-300/30 dark:border-purple-400/20 hover:bg-purple-500/20 dark:hover:bg-purple-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex-shrink-0" style={{ height: '56px', width: '56px' }}>
            <div className="hover:scale-110 transition-transform duration-200 [&>button]:h-7 [&>button]:w-7">
              <ThemeToggle />
            </div>
          </div>

          {/* Forward Button */}
          <button
            onClick={navigateForward}
            className="group flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 hover:shadow-lg flex-shrink-0"
            title="Go Forward"
            style={{ height: '56px', width: '56px' }}
          >
            <ArrowRight className="h-7 w-7 text-gray-800 dark:text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Additional Glass Morphing Effects */}
        <div className="absolute -top-1 left-8 right-8 h-2 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-sm"></div>
      </div>
    </div>
  );
} 