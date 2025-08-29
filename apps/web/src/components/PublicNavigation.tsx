'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, ArrowRight, User, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import ThemeLogo from '@/components/ThemeLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const getDashboardUrl = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'super_admin':
      case 'platform_admin':
        return '/dashboard';
      case 'admin':
        return '/dashboard/shelter-admin';
      case 'participant':
        return '/dashboard/participant';
      case 'donor':
        return '/dashboard/donor';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <ThemeLogo />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/about" className="hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/solutions" className="hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Solutions
              </Link>
              <Link href="/scan-give" className="hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Scan & Give
              </Link>
              <Link href="/impact" className="hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Impact
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Welcome, {user?.displayName || user?.email}</span>
                </div>
                <Link href={getDashboardUrl()}>
                  <Button size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b">
            {/* Home link - always show in mobile */}
            <Link
              href="/"
              className="hover:text-primary block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Home
            </Link>
            
            <Link
              href="/about"
              className="hover:text-primary block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/solutions"
              className="hover:text-primary block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link
              href="/scan-give"
              className="hover:text-primary block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Scan & Give
            </Link>
            <Link
              href="/impact"
              className="hover:text-primary block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Impact
            </Link>
            
            <div className="pt-4 pb-3 border-t border-border">
              {isAuthenticated ? (
                <div className="px-3 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Welcome, {user?.displayName || user?.email}</span>
                  </div>
                  <Link href={getDashboardUrl()} onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-stretch px-3 space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
