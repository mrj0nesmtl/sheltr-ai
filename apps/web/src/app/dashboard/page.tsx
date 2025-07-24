"use client";

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

// Role-specific dashboard components
const SuperAdminDashboard = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Super Admin Dashboard</h2>
      <p>Complete platform oversight and management</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Platform Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage all platform operations</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Access Admin Panel
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">User Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage all user accounts and roles</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Manage Users
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Analytics</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Platform-wide analytics and insights</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          View Analytics
        </button>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Shelter Admin Dashboard</h2>
      <p>Manage your shelter operations and participants</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Participant Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage participants in your shelter</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Manage Participants
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Donation Tracking</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Track donations to your shelter</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          View Donations
        </button>
      </div>
    </div>
  </div>
);

const ParticipantDashboard = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Participant Dashboard</h2>
      <p>Access your support services and track your journey</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">My Profile</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your personal information</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Edit Profile
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="font-semibold text-lg mb-2">SHELTR Services</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Access available SHELTR services</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Services
        </button>
      </div>
    </div>
  </div>
);

const DonorDashboard = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Donor Dashboard</h2>
      <p>Track your impact and make new donations</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">My Donations</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Track your donation history</p>
        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          View History
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Make Donation</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Support individuals and shelters</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Donate Now
        </button>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'participant':
        return <ParticipantDashboard />;
      case 'donor':
        return <DonorDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to SHELTR
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your account is being set up. Please contact support if this persists.
            </p>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  SHELTR
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{user?.displayName || user?.email}</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs">
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* User Info Bar */}
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Tenant: {user?.tenantId || 'platform'} | 
                  Email Verified: {user?.emailVerified ? '✅' : '❌'}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last login: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Role-specific Dashboard Content */}
          {renderDashboard()}
        </main>
      </div>
    </ProtectedRoute>
  );
} 