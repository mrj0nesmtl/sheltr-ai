"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  // Don't render login form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Beta Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                <span className="font-semibold">BETA Platform:</span> SHELTR is currently in development with daily feature updates. 
                User accounts may be reset during testing. Production launch targeted for December 2025.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="fixed top-20 left-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors z-10"
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

        {/* Login Form */}
        <LoginForm />

        {/* Additional Links */}
        <div className="mt-8 text-center">
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
    </div>
  );
} 