"use client";

import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function RegisterPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get default role from URL params
  const roleParam = searchParams.get('role') as UserRole;
  const defaultRole: UserRole = ['super_admin', 'admin', 'participant', 'donor'].includes(roleParam) 
    ? roleParam 
    : 'participant';

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render register form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors z-10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="w-full">
        {/* SHELTR Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="cursor-pointer transition-transform hover:scale-105">
              <img 
                src="/icon.svg" 
                alt="SHELTR" 
                className="h-16 w-auto filter invert dark:invert-0"
              />
            </Link>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Hacking Homelessness Through Technology
          </p>
        </div>

        {/* Registration Form */}
        <RegisterForm defaultRole={defaultRole} />

        {/* Additional Information */}
        <div className="mt-8 text-center space-y-4">
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 Join the Revolution
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              SHELTR is transforming how we support individuals experiencing homelessness through technology, transparency, and direct action.
            </p>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <a 
              href="mailto:support@sheltr-ai.com" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* SHELTR Wordmark */}
        <div className="text-center mt-12">
          <div className="flex justify-center">
            <img 
              src="/logo.svg" 
              alt="SHELTR" 
              className="h-8 w-auto filter invert dark:invert-0 opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
} 