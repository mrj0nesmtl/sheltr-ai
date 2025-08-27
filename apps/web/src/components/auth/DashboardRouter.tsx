"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Define role-based dashboard routes
const ROLE_DASHBOARD_MAP = {
  'super_admin': '/dashboard',
  'platform_admin': '/dashboard',
  'admin': '/dashboard/shelter-admin', 
  'participant': '/dashboard/participant',
  'donor': '/dashboard/donor'
} as const;

interface DashboardRouterProps {
  children: React.ReactNode;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading or if not authenticated
    if (loading || !user) return;

    // Only handle dashboard routes
    if (!pathname.startsWith('/dashboard')) return;

    // Get the appropriate dashboard for the user's role
    const userRole = user.role;
    const targetDashboard = userRole ? ROLE_DASHBOARD_MAP[userRole] : null;

    // If user has a role but no target dashboard defined, they might have an invalid role
    if (userRole && !targetDashboard) {
      console.warn(`No dashboard defined for role: ${userRole}`);
      return;
    }

    // If user has no role, they might not be properly set up
    if (!userRole) {
      console.warn('User has no role assigned');
      return;
    }

    // If user is on the generic dashboard route, redirect to their specific dashboard
    if (pathname === '/dashboard' && targetDashboard && targetDashboard !== '/dashboard') {
      router.replace(targetDashboard);
      return;
    }

    // Check if user is trying to access a dashboard they don't have permission for
    const currentDashboardRole = getCurrentDashboardRole(pathname);
    
    if (currentDashboardRole && currentDashboardRole !== userRole && userRole !== 'super_admin') {
      // Super admins can access any dashboard, others are restricted to their own
      console.warn(`User with role ${userRole} attempted to access ${currentDashboardRole} dashboard`);
      if (targetDashboard) {
        router.replace(targetDashboard);
      }
      return;
    }

  }, [user, loading, pathname, router]);

  return <>{children}</>;
};

// Helper function to determine what role a dashboard path is intended for
function getCurrentDashboardRole(pathname: string): keyof typeof ROLE_DASHBOARD_MAP | null {
  if (pathname === '/dashboard') return 'super_admin';
  if (pathname.startsWith('/dashboard/shelter-admin')) return 'admin';
  if (pathname.startsWith('/dashboard/participant')) return 'participant';  
  if (pathname.startsWith('/dashboard/donor')) return 'donor';
  return null;
}

export default DashboardRouter; 