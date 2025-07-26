'use client';

import Link from 'next/link';
import { Home, QrCode, BarChart3, Heart, LogIn, Smartphone, Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
              <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
                <Link href="/" className="block px-3 py-2 text-foreground hover:text-primary">Home</Link>
                <Link href="/about" className="block px-3 py-2 text-muted-foreground hover:text-primary">About</Link>
                <Link href="/solutions" className="block px-3 py-2 text-muted-foreground hover:text-primary">Solutions</Link>
                <Link href="/scan-give" className="block px-3 py-2 text-muted-foreground hover:text-primary">Scan & Give</Link>
                <Link href="/impact" className="block px-3 py-2 text-muted-foreground hover:text-primary">Impact</Link>
                <Link href="/docs" className="block px-3 py-2 text-muted-foreground hover:text-primary">Docs</Link>
                <div className="border-t pt-3 mt-3">
                  <Link href="/login" className="block px-3 py-2 text-muted-foreground hover:text-primary">Sign In</Link>
                  <Link href="/register" className="block px-3 py-2 text-muted-foreground hover:text-primary">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/hero-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Hacking Homelessness Through Technology
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              SHELTR-AI revolutionizes charitable giving through QR-code donations, 
              blockchain transparency, and AI-driven insights. Every donation follows our 
              SmartFund™ distribution: 80% direct support, 15% housing fund, 5% operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=donor">
                <Button size="lg">
                  <Heart className="h-4 w-4 mr-2" />
                  Start Giving
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SmartFund Distribution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Distribution</h2>
            <p className="text-lg text-muted-foreground">Every donation automatically distributed through smart contracts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">80%</div>
              <h3 className="text-xl font-semibold mb-2">Direct Support</h3>
              <p className="text-muted-foreground">Goes directly to participants for immediate needs</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">15%</div>
              <h3 className="text-xl font-semibold mb-2">Housing Fund</h3>
              <p className="text-muted-foreground">Builds sustainable long-term housing solutions</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <div className="text-4xl font-bold text-gray-600 dark:text-gray-400 mb-2">5%</div>
              <h3 className="text-xl font-semibold mb-2">Operations</h3>
              <p className="text-muted-foreground">Maintains and improves the platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple, secure, transparent giving in three steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Scan QR Code</h3>
              <p className="text-muted-foreground">Use any smartphone to scan a participant&apos;s unique QR code</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Choose Amount</h3>
              <p className="text-muted-foreground">Select donation amount and payment method securely</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Instant Impact</h3>
              <p className="text-muted-foreground">Funds distributed immediately via blockchain smart contracts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-xl mb-6">
            Transform charitable giving through technology. SHELTR-AI creates direct connections 
            between donors and those who need help most, with every donation tracked and verified 
            through blockchain transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=donor">
              <Button size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" size="lg">
                Join Our Movement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 