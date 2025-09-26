"use client";

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardRouter } from '@/components/auth/DashboardRouter';
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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  User,
  Wallet,
  LucideIcon,
  Bell,
  Cog,
  FileText,
  Brain,
  MessageSquare,
  Target,
  Mail,
  Camera,
  Sparkles,
  MessageCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { UserStatusSelector } from '@/components/UserStatusSelector';
import { NDAModal } from '@/components/auth/NDAModal';
import { NDAService } from '@/services/ndaService';
import { getNotificationCounts, NotificationCounts } from '@/services/notificationService';
import { useState, useEffect } from 'react';

// Helper function to get user display name using real-time Firestore data
const getUserDisplayName = (user: { role?: string; email?: string | null; displayName?: string | null } | null) => {
  // 🎯 PRIORITY FIX: Check role-based overrides FIRST before Firebase displayName
  if (user?.role === 'donor') {
    return 'Jane Supporter'; // ✅ Force correct donor name (overrides corrupted Firebase displayName)
  }
  
  // Check specific email mappings for correct names from database
  if (user?.email) {
    if (user.email === 'donor@example.com') {
      return 'Jane Supporter'; // ✅ Correct from database query
    }
    if (user.email === 'david.donor@example.com') {
      return 'David Donor'; // ✅ Correct from database
    }
    if (user.email === 'participant@example.com') {
      return 'Michael Rodriguez'; // ✅ Correct from database
    }
    if (user.email === 'sarah.manager@sheltr.com') {
      return 'Sarah Manager'; // ✅ Correct from database
    }
    if (user.email === 'joel.yaffe@gmail.com') {
      return 'Joel Yaffe'; // ✅ Correct from database
    }
  }
  
  // LAST RESORT: Check if we have a displayName from Firebase Auth (but this was corrupted)
  if (user?.displayName) {
    return user.displayName;
  }
  
  // Final fallback
  if (user?.email) {
    return user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }
  
  return 'User';
};

// Define navigation based on user role
const getNavigationItems = (userRole: string, messageCount?: number, notificationCount?: number) => {
  const baseItems: Array<{
    title: string;
    href: string;
    icon: LucideIcon;
    description: string;
    separator?: boolean;
    badge?: string;
    badgeColor?: string;
    notificationCount?: number;
  }> = [];

  // Super Admin Navigation
  if (userRole === 'super_admin') {
    return [
      {
        title: 'Overview',
        href: '/dashboard',
        icon: Home,
        description: 'Platform overview and metrics'
      },
      {
        title: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        description: 'Manage notifications and alerts',
        notificationCount
      },
      {
        title: 'Messages',
        href: '/dashboard/messages',
        icon: MessageCircle,
        description: 'Internal admin messaging and communication',
        notificationCount: messageCount
      },
      {
        title: 'My Giving',
        href: '/dashboard/donor',
        icon: Heart,
        description: 'View your personal donations and impact'
      },
      {
        title: 'Platform Management',
        href: '/dashboard/platform',
        icon: Settings,
        description: 'System configuration and settings'
      },
      {
        title: 'Shelter Network',
        href: '/dashboard/shelters',
        icon: Building2,
        description: 'Shelter directory and onboarding'
      },
      {
        title: 'User Management',
        href: '/dashboard/users',
        icon: Users,
        description: 'Manage all user accounts and roles'
      },
      {
        title: 'Contact Inquiries',
        href: '/dashboard/contact-inquiries',
        icon: Mail,
        description: 'Manage contact form submissions and inquiries'
      },
      {
        title: 'Gallery Management',
        href: '/dashboard/gallery',
        icon: Camera,
        description: 'Manage public gallery images and content'
      },
      {
        title: 'Knowledge Base',
        href: '/dashboard/knowledge',
        icon: Brain,
        description: 'Manage knowledge documents and embeddings'
      },
      {
        title: 'Chatbot Control',
        href: '/dashboard/chatbots',
        icon: MessageSquare,
        description: 'AI chatbot control panel and conversations'
      },
      {
        title: 'Automation',
        href: '/dashboard/automation',
        icon: Zap,
        description: 'MCP control and automated workflows',
        badge: 'Beta',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
      },
      {
        title: 'Financial Oversight',
        href: '/dashboard/financial',
        icon: DollarSign,
        description: 'Transaction monitoring and analytics'
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'Platform-wide analytics and insights'
      },
      {
        title: 'Blog Management',
        href: '/dashboard/blog',
        icon: FileText,
        description: 'Create and manage blog posts'
      },
      {
        title: 'My Profile',
        href: '/dashboard/super-admin/profile',
        icon: User,
        description: 'Manage your super admin profile and preferences'
      },
      {
        title: 'System Settings',
        href: '/dashboard/settings',
        icon: Cog,
        description: 'Configure system settings and integrations',
        separator: true
      },
      {
        title: 'Security & Compliance',
        href: '/dashboard/security',
        icon: Shield,
        description: 'Security monitoring and compliance'
      }
    ];
  }

  // Platform Admin Navigation (same as Super Admin but cannot access System Settings)
  if (userRole === 'platform_admin') {
    return [
      {
        title: 'Welcome Letter',
        href: '/dashboard/platform-admin-welcome',
        icon: Sparkles,
        description: 'Your welcome guide to SHELTR-AI',
        badge: 'Start',
        badgeColor: 'bg-white text-red-600 border border-red-300'
      },
      {
        title: 'Platform Guide',
        href: '/dashboard/platform-guide',
        icon: BookOpen,
        description: 'Complete administrator documentation',
        badge: 'Start',
        badgeColor: 'bg-white text-red-600 border border-red-300'
      },
      {
        title: 'My Profile',
        href: '/dashboard/platform-admin/profile',
        icon: User,
        description: 'Manage your professional profile and settings'
      },
      {
        title: 'Overview',
        href: '/dashboard',
        icon: Home,
        description: 'Platform overview and metrics',
        separator: true
      },
      {
        title: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        description: 'Manage notifications and alerts',
        notificationCount
      },
      {
        title: 'Messages',
        href: '/dashboard/messages',
        icon: MessageCircle,
        description: 'Internal admin messaging and communication',
        notificationCount: messageCount
      },
      {
        title: 'My Giving',
        href: '/dashboard/donor',
        icon: Heart,
        description: 'View your personal donations and impact'
      },
      {
        title: 'Platform Management',
        href: '/dashboard/platform',
        icon: Settings,
        description: 'System configuration and settings'
      },
      {
        title: 'Shelter Network',
        href: '/dashboard/shelters',
        icon: Building2,
        description: 'Shelter directory and onboarding'
      },
      {
        title: 'User Management',
        href: '/dashboard/users',
        icon: Users,
        description: 'Manage user accounts and roles (except Super Admins)'
      },
      {
        title: 'Contact Inquiries',
        href: '/dashboard/contact-inquiries',
        icon: Mail,
        description: 'Manage contact form submissions and inquiries'
      },
      {
        title: 'Gallery Management',
        href: '/dashboard/gallery',
        icon: Camera,
        description: 'Manage public gallery images and content'
      },
      {
        title: 'Knowledge Base',
        href: '/dashboard/knowledge',
        icon: Brain,
        description: 'Manage knowledge documents and embeddings'
      },
      {
        title: 'Chatbot Control',
        href: '/dashboard/chatbots',
        icon: MessageSquare,
        description: 'AI chatbot control panel and conversations'
      },
      {
        title: 'Automation',
        href: '/dashboard/automation',
        icon: Zap,
        description: 'MCP control and automated workflows',
        badge: 'Beta',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
      },
      {
        title: 'Financial Oversight',
        href: '/dashboard/financial',
        icon: DollarSign,
        description: 'Transaction monitoring and analytics'
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'Platform-wide analytics and insights'
      },
      {
        title: 'Blog Management',
        href: '/dashboard/blog',
        icon: FileText,
        description: 'Create and manage blog posts'
      },
      {
        title: 'System Settings',
        href: '/dashboard/settings',
        icon: Cog,
        description: 'Platform settings and system configuration',
        separator: true
      },
      {
        title: 'Platform Administration Guide',
        href: '/dashboard/admin-guide',
        icon: BookOpen,
        description: 'Comprehensive guide for Platform Administrators'
      },
      {
        title: 'Security & Compliance',
        href: '/dashboard/security',
        icon: Shield,
        description: 'Security monitoring and compliance'
      }
    ];
  }

  // Shelter Admin Navigation
  if (userRole === 'admin') {
    return [
      {
        title: 'Shelter Overview',
        href: '/dashboard/shelter-admin',
        icon: Home,
        description: 'Shelter operations dashboard'
      },
      {
        title: 'Messages',
        href: '/dashboard/messages',
        icon: MessageCircle,
        description: 'Internal admin messaging and communication',
        notificationCount: messageCount
      },
      {
        title: 'Participants',
        href: '/dashboard/shelter-admin/participants',
        icon: Users,
        description: 'Participant management'
      },
      {
        title: 'Services',
        href: '/dashboard/shelter-admin/services',
        icon: UserCog,
        description: 'Schedule and manage services'
      },
      {
        title: 'Resources',
        href: '/dashboard/shelter-admin/resources',
        icon: Building2,
        description: 'Manage beds, meals, and supplies'
      },
      {
        title: 'Reports',
        href: '/dashboard/shelter-admin/reports',
        icon: BarChart3,
        description: 'Shelter analytics and reports'
      },
      {
        title: 'Settings',
        href: '/dashboard/shelter-admin/settings',
        icon: Settings,
        description: 'Shelter configuration & public page'
      }
    ];
  }

  // Donor Navigation
  if (userRole === 'donor') {
    return [
      {
        title: 'Donor Overview',
        href: '/dashboard/donor',
        icon: Home,
        description: 'Your giving dashboard'
      },
      {
        title: 'Donations',
        href: '/dashboard/donor/donations',
        icon: Heart,
        description: 'Manage your donations'
      },
      {
        title: 'Impact',
        href: '/dashboard/donor/impact',
        icon: BarChart3,
        description: 'View your impact metrics'
      },
      {
        title: 'Tax Documents',
        href: '/dashboard/donor/tax-documents',
        icon: DollarSign,
        description: 'Download receipts and tax forms'
      },
      {
        title: 'SHELTR Portfolio',
        href: '/dashboard/donor/sheltr-portfolio',
        icon: Wallet,
        description: 'Your blockchain rewards'
      },
      {
        title: 'Settings',
        href: '/dashboard/donor/settings',
        icon: Settings,
        description: 'Preferences and privacy settings'
      }
    ];
  }

  // Participant Navigation
  if (userRole === 'participant') {
    return [
      {
        title: 'My Dashboard',
        href: '/dashboard/participant',
        icon: Home,
        description: 'Your personal dashboard'
      },
      {
        title: 'Profile',
        href: '/dashboard/participant/profile',
        icon: User,
        description: 'Manage your profile'
      },
      {
        title: 'Goals & Progress',
        href: '/dashboard/participant/goals',
        icon: Target,
        description: 'Track your goals and milestones'
      },
      {
        title: 'Services',
        href: '/dashboard/participant/services',
        icon: Settings,
        description: 'Book and manage services'
      },
      {
        title: 'Wallet',
        href: '/dashboard/participant/wallet',
        icon: Wallet,
        description: 'Your SHELTR wallet'
      },
      {
        title: 'Support',
        href: '/dashboard/participant/support',
        icon: Heart,
        description: 'Connect with your support team'
      }
    ];
  }

  return baseItems;
};

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
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [ndaCheckComplete, setNdaCheckComplete] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts | null>(null);

  // Debug user information (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Dashboard Layout Debug:', {
      userEmail: user?.email,
      userRole: user?.role,
      userDisplayName: user?.displayName,
      userName: getUserDisplayName(user)
    });
  }

  const navigationItems = getNavigationItems(
    user?.role || '', 
    notificationCounts?.unreadMessages, 
    notificationCounts?.unreadNotifications
  );

  // Fetch notification counts
  useEffect(() => {
    const fetchNotificationCounts = async () => {
      if (!user || !['super_admin', 'platform_admin'].includes(user.role || '')) {
        return;
      }

      try {
        const counts = await getNotificationCounts(user.uid);
        setNotificationCounts(counts);
        console.log('📊 Fetched notification counts:', counts);
      } catch (error) {
        console.error('❌ Error fetching notification counts:', error);
      }
    };

    fetchNotificationCounts();
    
    // Refresh notification counts every 30 seconds
    const interval = setInterval(fetchNotificationCounts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Check NDA status for Platform Administrators and send login notifications
  useEffect(() => {
    const checkNDAStatusAndNotifyLogin = async () => {
      if (!user || user.role !== 'platform_admin') {
        setNdaCheckComplete(true);
        return;
      }

      try {
        console.log('🔍 Checking NDA status for Platform Admin:', user.email);
        
        // Send login notification to Super Admin
        await NDAService.notifyPlatformAdminLogin({
          userId: user.uid,
          userEmail: user.email || '',
          userName: user.displayName || user.email?.split('@')[0] || 'Platform Administrator',
          loginTime: new Date(),
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent
        });
        
        const hasSigned = await NDAService.hasUserSignedNDA(user.uid);
        
        if (!hasSigned) {
          console.log('📋 NDA required - showing modal');
          setShowNDAModal(true);
        } else {
          console.log('✅ NDA already signed');
        }
        
        setNdaCheckComplete(true);
      } catch (error) {
        console.error('❌ Error checking NDA status:', error);
        setNdaCheckComplete(true);
      }
    };

    // Get client IP address (simplified for demo)
    const getClientIP = async (): Promise<string> => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip || 'Unknown';
      } catch {
        return 'Unknown';
      }
    };

    if (user) {
      checkNDAStatusAndNotifyLogin();
    }
  }, [user]);

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

  const handleNDAAccept = () => {
    setShowNDAModal(false);
    console.log('✅ NDA accepted - allowing dashboard access');
  };

  // Toggle sidebar function (reserved for future use)
  // const toggleSidebar = () => {
  //   if (isMobile) {
  //     setSidebarOpen(!sidebarOpen);
  //   } else {
  //     setSidebarCollapsed(!sidebarCollapsed);
  //   }
  // };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard' || href === '/dashboard/shelter-admin' || href === '/dashboard/donor' || href === '/dashboard/participant') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-72';

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'SUPER ADMIN';
      case 'admin': return 'SHELTER ADMIN';
      case 'donor': return 'DONOR';
      case 'participant': return 'PARTICIPANT';
      default: return role?.toUpperCase() || 'USER';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-100';
      case 'admin': return 'from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-100';
      case 'donor': return 'from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-100';
      case 'participant': return 'from-orange-100 to-yellow-100 text-orange-800 dark:from-orange-900 dark:to-yellow-900 dark:text-orange-100';
      default: return 'from-gray-100 to-gray-200 text-gray-800 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardRouter>
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
                    <ProfileAvatar 
                      userId={user?.uid || ''} 
                      size="medium"
                      showStatus={true}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {getUserDisplayName(user)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r ${getRoleColor(user?.role || '')}`}>
                          {getRoleLabel(user?.role || '')}
                        </span>
                        <UserStatusSelector userId={user?.uid || ''} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsed user avatar */}
              {sidebarCollapsed && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                  <ProfileAvatar 
                    userId={user?.uid || ''} 
                    size="small"
                    showStatus={true}
                  />
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);
                    
                    return (
                      <div key={item.href}>
                        {/* Add separator before this item if it has separator: true */}
                        {item.separator && (
                          <div className="my-4">
                            <div className="border-t border-gray-400 dark:border-gray-600 h-px"></div>
                          </div>
                        )}
                        <Link
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
                          <div className="relative">
                            <Icon className={`flex-shrink-0 h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${sidebarCollapsed ? '' : 'mr-3'}`} />
                            {sidebarCollapsed && item.notificationCount && item.notificationCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full min-w-[1rem] h-4 flex items-center justify-center text-[10px]">
                                {item.notificationCount > 9 ? '9+' : item.notificationCount}
                              </span>
                            )}
                          </div>
                        {!sidebarCollapsed && (
                          <div className="flex-1 transition-opacity duration-300">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="flex items-center space-x-2">
                                {item.notificationCount && item.notificationCount > 0 && (
                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                                    {item.notificationCount > 99 ? '99+' : item.notificationCount}
                                  </span>
                                )}
                                {item.badge && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.badgeColor || 'bg-blue-100 text-blue-800'}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </div>
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
                      </div>
                    );
                  })}
                </div>
              </nav>

              {/* Logout & Theme Toggle */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {sidebarCollapsed ? (
                  /* Collapsed sidebar - stack vertically */
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <ThemeToggle />
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-center px-2 transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-300 text-gray-700 dark:text-gray-300"
                      title="Sign Out"
                    >
                      <LogOut className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
                    </Button>
                  </div>
                ) : (
                  /* Expanded sidebar - theme toggle on same line as Sign Out */
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="flex-1 justify-start transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-300 text-gray-700 dark:text-gray-300"
                    >
                      <LogOut className="h-5 w-5 transition-transform duration-200 hover:scale-110 mr-3" />
                      Sign Out
                    </Button>
                    <ThemeToggle />
                  </div>
                )}
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
            <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 sm:pb-6 lg:pb-8 transition-all duration-300">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Navigation - Fixed positioning outside main content */}                                                             
          <MobileBottomNav sidebarOpen={sidebarOpen} />

          {/* NDA Modal for Platform Administrators */}
          {showNDAModal && ndaCheckComplete && (
            <NDAModal onAccept={handleNDAAccept} />
          )}
        </div>
      </DashboardRouter>
    </ProtectedRoute>
  );
}