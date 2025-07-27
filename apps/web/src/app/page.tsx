'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <ThemeLogo />
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/about" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    About
                  </Link>
                  <Link href="/solutions" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Solutions
                  </Link>
                  <Link href="/scan-give" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Scan & Give
                  </Link>
                  <Link href="/impact" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Impact
                  </Link>
                  <Link href="/docs" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Docs
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
                <ThemeToggle />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
                  <Link 
                    href="/about" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/solutions" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Solutions
                  </Link>
                  <Link 
                    href="/scan-give" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Scan & Give
                  </Link>
                  <Link 
                    href="/impact" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Impact
                  </Link>
                  <Link 
                    href="/docs" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section 
          className="relative min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: "url('/backgrounds/hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hacking Homelessness<br />
              <span className="text-blue-400">Through Technology</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Revolutionary charitable giving through QR-code donations, blockchain transparency, 
              and AI-driven insights. <strong>80% direct support</strong>, 15% housing fund, 5% operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                  Get Started
                </Button>
              </Link>
              <Link href="/scan-give">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-black">
                  Scan & Give Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Real Impact, Real Numbers</h2>
              <p className="text-xl text-gray-300">Every scan creates measurable change</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">$2.4M+</div>
                <div className="text-white text-lg">Total Donations</div>
                <div className="text-gray-400 text-sm">+$12,847 today</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">8,429</div>
                <div className="text-white text-lg">People Helped</div>
                <div className="text-gray-400 text-sm">+43 this week</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">1,247</div>
                <div className="text-white text-lg">Housed Successfully</div>
                <div className="text-gray-400 text-sm">68% success rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">127</div>
                <div className="text-white text-lg">Cities Reached</div>
                <div className="text-gray-400 text-sm">12 countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How SHELTR Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Three simple steps to create lasting impact using cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Scan QR Code</h3>
                <p className="text-muted-foreground">
                  Find QR codes at partner locations or scan directly from participant cards. 
                  Each code is unique and verified.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Distribution</h3>
                <p className="text-muted-foreground">
                  Our SmartFund™ automatically allocates 80% direct support, 
                  15% housing fund, 5% operations via blockchain.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Impact</h3>
                <p className="text-muted-foreground">
                  Real-time updates on how your donation creates change. 
                  Full transparency through blockchain verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of donors using technology to end homelessness, one scan at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                  Start Giving Today
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
} 