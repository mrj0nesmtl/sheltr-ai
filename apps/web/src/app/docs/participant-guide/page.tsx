'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Users, QrCode, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function ParticipantGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Users className="h-12 w-12 text-teal-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Participant User Guide</h1>
                  <Badge className="bg-teal-500 text-white text-sm">User Guide</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Complete guide for participants using the SHELTR platform, from onboarding to advanced features
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.4.0</span>
                  <span>•</span>
                  <span>July 2025</span>
                  <span>•</span>

                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/docs">
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Users className="h-4 w-4 mr-2" />
                      View Online
                    </Button>
                  </Link>
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/06-user-guides/participant-guide.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2>Getting Started with SHELTR</h2>
              <p>
                This comprehensive guide helps participants understand and effectively use the SHELTR platform. 
                From initial onboarding to advanced features, learn how to maximize your experience and access 
                available support services.
              </p>
            </div>

            {/* SmartFund Flow Chart */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">How SHELTR SmartFund™ Works for You</h2>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-8">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-muted-foreground">
                      Every donation automatically builds your future - no effort required!
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-medium">1. Show Your QR Code</div>
                          <div className="text-sm text-muted-foreground">Your unique, secure digital ID</div>
                        </div>
                      </div>
                      <div className="text-sm text-teal-600 font-medium">Ready instantly</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-px h-8 bg-teal-300"></div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">💰</span>
                        </div>
                        <div>
                          <div className="font-medium">2. Receive Donation</div>
                          <div className="text-sm text-muted-foreground">Someone scans and donates any amount</div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">Instant & secure</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-px h-8 bg-teal-300"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border text-center">
                        <div className="font-bold text-green-600 text-xl">85%</div>
                        <div className="text-sm font-medium">Your Immediate Access</div>
                        <div className="text-xs text-muted-foreground mt-1">Stable SHELTR-S tokens</div>
                        <div className="text-xs text-muted-foreground">Use right away for needs</div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border text-center">
                        <div className="font-bold text-purple-600 text-xl">10%</div>
                        <div className="text-sm font-medium">Your Housing Savings</div>
                        <div className="text-xs text-muted-foreground mt-1">Automatically invested</div>
                        <div className="text-xs text-muted-foreground">Growing towards permanent housing</div>
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border text-center">
                        <div className="font-bold text-orange-600 text-xl">5%</div>
                        <div className="text-sm font-medium">Shelter Support</div>
                        <div className="text-xs text-muted-foreground mt-1">Supports your shelter</div>
                        <div className="text-xs text-muted-foreground">Better services for everyone</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-px h-8 bg-teal-300"></div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-green-100 dark:from-purple-900/20 dark:to-green-900/20 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🏠</span>
                        </div>
                        <div>
                          <div className="font-medium">3. Your Housing Fund Grows</div>
                          <div className="text-sm text-muted-foreground">Passive savings accumulating for your transition out</div>
                        </div>
                      </div>
                      <div className="text-sm text-purple-600 font-medium">Automatic & compound</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">💡 The Magic</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You don&apos;t have to do anything special. Every donation automatically creates immediate support 
                      AND builds your future housing fund. The more people who donate, the faster you reach housing independence!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-teal-200 dark:hover:border-teal-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    Platform Onboarding
                  </CardTitle>
                  <CardDescription>
                    Step-by-step registration and setup process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">✓</span>
                      <span>Account creation and verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">✓</span>
                      <span>Profile setup and documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">✓</span>
                      <span>Welcome bonus activation (100 SHELTR-S tokens)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">✓</span>
                      <span>Security settings configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">✓</span>
                      <span>Interactive platform tutorial walkthrough</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-blue-200 dark:hover:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    QR Code & Digital Wallet
                  </CardTitle>
                  <CardDescription>
                    Managing your digital identity and funds securely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span>Understanding your unique QR code (your digital ID)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span>SHELTR-S wallet management (stable, secure tokens)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span>Receiving donations instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span>Transaction history tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span>Privacy protection & security best practices</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-purple-200 dark:hover:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-purple-600" />
                    Service Access
                  </CardTitle>
                  <CardDescription>
                    Discovering and using available support services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Service directory navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Booking appointments and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Emergency assistance access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Progress tracking towards housing goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Feedback and rating system</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-green-600">🆘</span>
                    Support Resources
                  </CardTitle>
                  <CardDescription>
                    Getting help when you need it most
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>24/7 support hotline access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Direct case worker communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Peer support groups and community</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Crisis intervention services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Comprehensive community resource directory</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Quick Reference</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Emergency Support</h4>
                  <p className="text-sm text-muted-foreground">Call 911 for immediate emergencies</p>
                  <p className="text-sm text-muted-foreground">Text "HELP" to access crisis support</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Help</h4>
                  <p className="text-sm text-muted-foreground">Platform support available 24/7</p>
                  <p className="text-sm text-muted-foreground">In-app help center and tutorials</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Welcome Bonus</h4>
                  <p className="text-sm text-muted-foreground">100 SHELTR-S tokens ($100 value)</p>
                  <p className="text-sm text-muted-foreground">Available immediately upon registration</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-8 text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Join a New Paradigm in Emergency Assistance?</h2>
              <p className="text-lg mb-6 opacity-90">
                SHELTR isn&apos;t just another charity platform - it&apos;s your pathway to housing independence. 
                Every donation received automatically builds your future while meeting your immediate needs.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">$100</div>
                  <div className="text-sm opacity-80">Welcome bonus in SHELTR-S tokens</div>
                  <div className="text-xs opacity-70 mt-1">Available immediately upon registration</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">0%</div>
                  <div className="text-sm opacity-80">Platform fees for participants</div>
                  <div className="text-xs opacity-70 mt-1">Everything goes to you and your future</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-80">Support and assistance</div>
                  <div className="text-xs opacity-70 mt-1">Help when you need it most</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-base opacity-90">
                  🎯 <strong>Your goal:</strong> Stable housing and independence<br />
                  💡 <strong>Our method:</strong> Smart technology that automatically saves for your future<br />
                  🤝 <strong>Community support:</strong> Real people who understand your journey
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 px-8">
                      <Users className="h-5 w-5 mr-2" />
                      Get Started Today
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-600 px-8">
                    <QrCode className="h-5 w-5 mr-2" />
                    See QR Demo
                  </Button>
                </div>
                
                <p className="text-sm opacity-75 mt-4">
                  Join thousands already building their path to housing independence through SHELTR
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  <Book className="h-5 w-5 mr-2" />
                  Back to Documentation Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 