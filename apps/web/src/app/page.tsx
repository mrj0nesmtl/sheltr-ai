'use client';

import Link from 'next/link';
import { Heart, Wallet, Home, QrCode, Shield, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <PublicNavigation />

        {/* Hero Section - Transform Donations into Impact */}
        <section 
          className="relative py-24 min-h-[80vh] flex items-center bg-gradient-to-r from-slate-900 to-slate-800"
          style={{
            backgroundImage: "url('/backgrounds/hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Better to <span className="text-blue-400">Solve</span> than Manage
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                An ecosystem where every donation creates immediate, transparent impact 
                through direct participant empowerment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scan-give">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
                    Scan & Donate
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-black">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section - 6 Cards in 2x3 Grid */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Direct Impact */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Direct Impact</h3>
                <p className="text-muted-foreground">
                  Your donations directly support individuals in need through secure, transparent blockchain transactions.
                </p>
              </div>

              {/* Smart Allocation */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Allocation</h3>
                <p className="text-muted-foreground">
                  Funds are automatically distributed: 80% for immediate needs, 15% for housing, and 5% for operations.
                </p>
              </div>

              {/* Housing Focus */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Housing Focus</h3>
                <p className="text-muted-foreground">
                  Every donation contributes to a dedicated housing fund, helping create lasting change.
                </p>
              </div>

              {/* QR Technology */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">QR Technology</h3>
                <p className="text-muted-foreground">
                  Scan unique QR codes to make instant, secure donations to specific individuals in need.
                </p>
              </div>

              {/* Blockchain Security */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Blockchain Security</h3>
                <p className="text-muted-foreground">
                  Every transaction is secured and verified through blockchain technology, ensuring complete transparency.
                </p>
              </div>

              {/* Impact Tracking */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Impact Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your contributions and see the real impact of your donations in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose SHELTR Section */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose SHELTR?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SHELTR combines cutting-edge technology with proven social impact methodologies 
                to create the most transparent and effective charitable giving platform ever built.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
                <p className="text-muted-foreground">
                  Blockchain technology ensures every transaction is visible and verified
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Data-Driven</h3>
                <p className="text-muted-foreground">
                  Real-time analytics help optimize resource allocation and impact
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Human-Centered</h3>
                <p className="text-muted-foreground">
                  Built with dignity and respect for all participants in the system
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Fixed Learn More button text */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform How You Address the Unhoused?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join the SHELTR movement - Every scan creates transparency, 
                every donation builds housing, every participant finds dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/scan-give">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-primary-foreground bg-white/10 hover:bg-white hover:text-black">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      
      <Footer />
      
      {/* Public Chatbot */}
      <PublicChatbot />
    </div>
  );
} 