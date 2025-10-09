'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  LogIn, 
  ArrowRight, 
  User, 
  Home, 
  LayoutDashboard,
  Github,
  Globe,
  Music,
  BookOpen,
  ExternalLink,
  Heart,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import ThemeLogo from '@/components/ThemeLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-background sticky top-0 z-50 border-b">
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
              <Link href="/pods" className="hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Pods
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
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    <span>Welcome, {user?.displayName || user?.email?.split('@')[0]}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <Link 
                          href={getDashboardUrl()}
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
              onClick={() => {
                console.log('🍔 Mobile menu toggled:', !isMenuOpen);
                setIsMenuOpen(!isMenuOpen);
              }}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">{isMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="px-4 py-6 space-y-6">
            
            {/* Quick Actions */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Welcome back!</p>
                      <p className="text-xs text-muted-foreground">{user?.displayName || user?.email}</p>
                    </div>
                  </div>
                  <Link href={getDashboardUrl()} onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start" 
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-center">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Main Navigation Sections */}
            <div className="grid grid-cols-2 gap-6">
              {/* Platform Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Platform
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/solutions"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Solutions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pods"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pods
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/impact"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Impact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Technology Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  Technology
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/scan-give"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Scan & Give
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tokenomics"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tokenomics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/docs/whitepaper"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      White Paper
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/mrj0nesmtl/sheltr-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Github className="h-3 w-3 mr-1" />
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>

              {/* Community Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Community
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/angels"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Angels
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://bsky.app/profile/sheltrops.bsky.social"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      BlueSky
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Support
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/terms"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Media & Connect */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Connect With Us
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <a
                  href="https://arcanaconcept.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Substack</span>
                </a>
                
                <a
                  href="https://notebooklm.google.com/sheltr-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">NotebookLM</span>
                </a>
                
                <a
                  href="https://open.spotify.com/show/3Q2RpnzF9sUv26yPMP9tWI?si=7096be4358e94b57"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Music className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Spotify</span>
                </a>
                
                <a
                  href="https://github.com/mrj0nesmtl/sheltr-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Github className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              </div>
            </div>

            {/* Footer info */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                &copy; 2025 SHELTR
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
