"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallbackPath?: string;
  showLoading?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/login',
  showLoading = true
}) => {
  const { user, loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push(fallbackPath);
    return null;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need {requiredRole} role to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Your current role: {user.role || 'None'}
          </p>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need the &quot;{requiredPermission}&quot; permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Role-specific route components
export const SuperAdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="super_admin">{children}</ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const ParticipantRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="participant">{children}</ProtectedRoute>
);

export const DonorRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="donor">{children}</ProtectedRoute>
);

// Admin or SuperAdmin route (for shared admin functionality)
export const AdminOrSuperRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need admin or super admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Permission-based route component
interface PermissionRouteProps {
  children: ReactNode;
  permission: string;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ 
  children, 
  permission 
}) => (
  <ProtectedRoute requiredPermission={permission}>{children}</ProtectedRoute>
); 