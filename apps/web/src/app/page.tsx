'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, QrCode, Shield, BarChart3, Home, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import { useAuth } from '@/contexts/AuthContext';
import { GalleryService, GalleryImage } from '@/services/galleryService';
import NewsletterSignup from '@/components/NewsletterSignup';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

export default function HomePage() {
  const { user, hasRole } = useAuth();
  
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/', '/backgrounds/hero-bg.jpg');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

        {/* Hero Section - Standardized */}
        <StandardHero
          imageUrl={heroImage.url}
          badgeText="TECH-4-GOOD"
          badgeVariant="secondary"
          badgeClassName="bg-white/20 text-white border-white/30 backdrop-blur-sm"
          title={
            <>
              Better to <span className="text-blue-400">Solve</span> than Manage
            </>
          }
          subtitle=""
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/scan-give">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 backdrop-blur-sm transition-all">
                Scan & Give
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-transparent border-2 border-white/60 text-white hover:bg-white hover:text-black hover:border-white backdrop-blur-sm transition-all">
                <ArrowRight className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </StandardHero>

        {/* Feature Cards Section - 6 Cards in 2x3 Grid */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
                Let&apos;s create a world where every act of kindness is amplified 
                and ensures lasting, measurable impact for everyone in the ecosystem. 
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Direct Impact */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Direct Impact</h3>
                <p className="text-muted-foreground">
                  Your donations directly support individuals in need through secure, transparent transactions.
                </p>
              </div>

              {/* Smart Allocation */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">SmartFund™ Allocation</h3>
                <p className="text-muted-foreground">
                  Donated funds are automatically distributed: 80% for immediate needs, 15% for housing, and 5% for shelter operations.
                </p>
              </div>

              {/* Housing Focus */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Housing Focus</h3>
                <p className="text-muted-foreground">
                  Every donation contributes to a dedicated POD housing fund, helping to facilitate real world change.
                </p>
              </div>

              {/* QR Technology */}
              <div className="bg-card rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-colors p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">QR Technology</h3>
                <p className="text-muted-foreground">
                  Scan QR codes to make instant, secure donations to specific individuals in need.
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
                  See the real impact of your donations in real-time.
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

        {/* CTA Section - With Background Image and Overlay */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/backgrounds/impact-bg.jpg)' }}
          />
          
          {/* Dark Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
               How We Address the Unhoused, Needs to Change
              </h4>
              <p className="text-xl mb-8 text-white/95 drop-shadow-md">
                Every scan creates transparency, 
                every donation builds housing, every participant finds dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black dark:hover:bg-gray-100 font-semibold shadow-lg"
                  >
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/solutions">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-2 border-white text-white bg-transparent hover:bg-white hover:text-black font-semibold shadow-lg transition-all duration-200"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup source="landing" variant="banner" />
      
      <Footer />
      
      {/* Public Chatbot */}
      <PublicChatbot />
    </div>
  );
} 