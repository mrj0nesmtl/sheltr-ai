"use client";

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Settings, 
  Users, 
  Building2, 
  DollarSign, 
  Shield, 
  BarChart3,
  Menu,
  X,
  LogOut,
  UserCog,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const navigationItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: Home,
    description: 'Platform overview and metrics'
  },
  {
    title: 'Platform Management',
    href: '/dashboard/platform',
    icon: Settings,
    description: 'System configuration and settings'
  },
  {
    title: 'User Management',
    href: '/dashboard/users',
    icon: Users,
    description: 'Manage all user accounts and roles'
  },
  {
    title: 'Shelter Network',
    href: '/dashboard/shelters',
    icon: Building2,
    description: 'Shelter directory and onboarding'
  },
  {
    title: 'Financial Oversight',
    href: '/dashboard/financial',
    icon: DollarSign,
    description: 'Transaction monitoring and analytics'
  },
  {
    title: 'Security & Compliance',
    href: '/dashboard/security',
    icon: Shield,
    description: 'Security monitoring and compliance'
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Platform-wide analytics and insights'
  }
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-72';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo and Brand */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80" onClick={closeSidebar}>
                <Image
                  src="/icon.svg"
                  alt="SHELTR"
                  width={32}
                  height={32}
                  className="invert dark:invert-0 flex-shrink-0"
                />
                {!sidebarCollapsed && (
                  <Image
                    src="/logo.svg"
                    alt="SHELTR"
                    width={120}
                    height={28}
                    className="invert dark:invert-0 transition-opacity duration-300"
                  />
                )}
              </Link>
              
              {/* Collapse toggle for desktop */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Close button for mobile */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* User Info */}
            {!sidebarCollapsed && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <UserCog className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.displayName || user?.email}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-100">
                        SUPER ADMIN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed user avatar */}
            {sidebarCollapsed && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <UserCog className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white hover:scale-[1.02]'
                        }
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                      title={sidebarCollapsed ? item.title : undefined}
                    >
                      <Icon className={`flex-shrink-0 h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${sidebarCollapsed ? '' : 'mr-3'}`} />
                      {!sidebarCollapsed && (
                        <div className="flex-1 transition-opacity duration-300">
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className={`text-xs mt-0.5 transition-colors duration-200 ${
                            isActive 
                              ? 'text-blue-100' 
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      )}
                      
                      {/* Active indicator */}
                      {isActive && sidebarCollapsed && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className={`
                  w-full transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-300
                  ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}
                  text-gray-700 dark:text-gray-300
                `}
                title={sidebarCollapsed ? 'Sign Out' : undefined}
              >
                <LogOut className={`h-5 w-5 transition-transform duration-200 hover:scale-110 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`
          ${isMobile ? '' : (sidebarCollapsed ? 'ml-16' : 'ml-72')} 
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
        `}>
          {/* Mobile header */}
          {isMobile && (
            <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                  <Image
                    src="/icon.svg"
                    alt="SHELTR"
                    width={24}
                    height={24}
                    className="invert dark:invert-0"
                  />
                  <Image
                    src="/logo.svg"
                    alt="SHELTR"
                    width={100}
                    height={24}
                    className="invert dark:invert-0"
                  />
                </Link>
                <div className="w-10" />
              </div>
            </div>
          )}
          
          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 