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
            <Link 
              href="/docs" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
            <div className="flex items-start gap-4 mb-6">
              <Users className="h-12 w-12 text-teal-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Participant User Guide</h1>
                  <Badge className="bg-teal-500 text-white text-sm">User Guide</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Your complete guide to using SHELTR as a donation recipient - from QR codes to digital wallets to POD independence
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.1</span>
                  <span>•</span>
                  <span>Updated November 21, 2025</span>
                  <span>•</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">LIVE PLATFORM</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/user-guides/participant-guide.md" target="_blank" rel="noopener noreferrer">
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
              <h2>Welcome to SHELTR</h2>
              <p>
                <strong>You are at the heart of the SHELTR platform.</strong> This guide will help you understand how to use the system to receive donations, manage your profile, and track your progress toward stability and independence.
              </p>
              <p>
                SHELTR is a platform that connects you directly with people who want to help. When someone scans your personal QR code, they can instantly donate money that goes directly to your digital wallet - no delays, no intermediaries.
              </p>
            </div>

            {/* Getting Started Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🚀 Getting Started</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-blue-600">🏠</span>
                      Option A: Through a Partner Shelter
                    </CardTitle>
                    <CardDescription>
                      The recommended path with support from shelter staff
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">1.</span>
                        <span><strong>Visit a partner shelter</strong> that works with SHELTR-AI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">2.</span>
                        <span><strong>Speak with staff</strong> about joining the platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">3.</span>
                        <span><strong>Provide basic information</strong> (name, contact, needs)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">4.</span>
                        <span><strong>Complete verification</strong> with shelter staff assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">5.</span>
                        <span><strong>Receive your QR code</strong> and wallet setup</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-green-600">📱</span>
                      Option B: Independent Registration
                    </CardTitle>
                    <CardDescription>
                      Direct registration through our mobile app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">1.</span>
                        <span><strong>Download the SHELTR mobile app</strong> (iOS/Android)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">2.</span>
                        <span><strong>Create your account</strong> with email or phone number</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">3.</span>
                        <span><strong>Complete your profile</strong> with basic information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">4.</span>
                        <span><strong>Submit verification documents</strong> (ID, proof of situation)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">5.</span>
                        <span><strong>Wait for approval</strong> (usually 24-48 hours)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">6.</span>
                        <span><strong>Receive your QR code</strong> and digital wallet</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* SmartFund™ Flow Chart */}
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
                        <div className="font-bold text-green-600 text-xl">80%</div>
                        <div className="text-sm font-medium">Your Immediate Access</div>
                        <div className="text-xs text-muted-foreground mt-1">Stable SHELTR-S tokens</div>
                        <div className="text-xs text-muted-foreground">Use right away for needs</div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border text-center">
                        <div className="font-bold text-purple-600 text-xl">15%</div>
                        <div className="text-sm font-medium">Your SmartFund™ Housing Fund</div>
                        <div className="text-xs text-muted-foreground mt-1">Automatically invested</div>
                        <div className="text-xs text-muted-foreground">Growing towards permanent housing</div>
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border text-center">
                        <div className="font-bold text-orange-600 text-xl">5%</div>
                        <div className="text-sm font-medium">Platform Support</div>
                        <div className="text-xs text-muted-foreground mt-1">Supports platform operations</div>
                        <div className="text-xs text-muted-foreground">Keeps SHELTR running</div>
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

            {/* SHELTR Ecosystem Components */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🏠 SHELTR Ecosystem Benefits</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
                Every donation to you also contributes to long-term solutions. <strong>15% of every donation</strong> goes to a housing fund that accumulates over time across all participants, funding permanent housing solutions in your area.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow duration-300 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-blue-600">🏠</span>
                      PODS (Portable Emergency Housing)
                    </CardTitle>
                    <CardDescription>
                      Rapid deployment emergency shelter units
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span><strong>Emergency shelter units</strong> deployed rapidly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span><strong>Fully equipped</strong> with power, water, climate control</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span><strong>Secure and dignified</strong> temporary housing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span><strong>Available for emergencies</strong> and transitions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-green-600">🚴</span>
                      MOBI (Electric Transportation)
                    </CardTitle>
                    <CardDescription>
                      Electric mountain bikes for mobility needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span><strong>Electric mountain bikes</strong> for transportation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span><strong>Job interview transportation</strong> and services access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span><strong>Mobile service delivery</strong> to your location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span><strong>Emergency communication</strong> and support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-purple-600">🚁</span>
                      Drone Delivery System
                    </CardTitle>
                    <CardDescription>
                      Emergency supply delivery within 15-30 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span><strong>Emergency supply delivery</strong> within 15-30 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span><strong>Medical supplies, food, essentials</strong> delivered directly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span><strong>GPS-precise delivery</strong> to your location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span><strong>Available 24/7</strong> for emergency situations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
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

            {/* Safety & Privacy Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">⚠️ Safety & Privacy</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="hover:shadow-lg transition-shadow duration-300 border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-red-600">🛡️</span>
                      Personal Safety Guidelines
                    </CardTitle>
                    <CardDescription>
                      Essential safety practices for all interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span><strong>Never meet donors</strong> in private locations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span><strong>Use public spaces</strong> for any interactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span><strong>Trust your instincts</strong> about situations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span><strong>Report suspicious behavior</strong> immediately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span><strong>Let shelter staff know</strong> your location</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-blue-600">🔒</span>
                      Privacy Protection
                    </CardTitle>
                    <CardDescription>
                      Your personal information is always protected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>Only first name</strong> is public</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>No personal address</strong> shared</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>Optional photo</strong> for your profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>You control</strong> what information to share</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>Donors cannot track</strong> your location</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <span>📞</span>
                  Reporting Issues
                </h4>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded border">
                    <div className="font-semibold text-red-600">Emergency</div>
                    <div className="text-xs text-muted-foreground mt-1">Call 911</div>
                    <div className="text-xs text-muted-foreground">Immediate</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded border">
                    <div className="font-semibold text-orange-600">Harassment</div>
                    <div className="text-xs text-muted-foreground mt-1">Report in app</div>
                    <div className="text-xs text-muted-foreground">2-4 hours</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                    <div className="font-semibold text-blue-600">Technical</div>
                    <div className="text-xs text-muted-foreground mt-1">Help chat</div>
                    <div className="text-xs text-muted-foreground">1 hour</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded border">
                    <div className="font-semibold text-green-600">General</div>
                    <div className="text-xs text-muted-foreground mt-1">Support email</div>
                    <div className="text-xs text-muted-foreground">24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Quick Reference</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Emergency Support</h4>
                  <p className="text-sm text-muted-foreground">Call 911 for immediate emergencies</p>
                  <p className="text-sm text-muted-foreground">Crisis Support: National Suicide Prevention Lifeline 988</p>
                  <p className="text-sm text-muted-foreground">Homeless Services: 211 (dial 2-1-1)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">SHELTR-AI Support</h4>
                  <p className="text-sm text-muted-foreground">Technical Help: help@sheltr.ai</p>
                  <p className="text-sm text-muted-foreground">User Support: support@sheltr.ai</p>
                  <p className="text-sm text-muted-foreground">Emergency Line: 1-800-SHELTR-AI</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Your Journey Forward</h4>
                  <p className="text-sm text-muted-foreground">You are <strong>not defined</strong> by your current situation</p>
                  <p className="text-sm text-muted-foreground">Every donation represents someone who believes in you</p>
                </div>
              </div>
            </div>

            {/* Success Stories & Inspiration */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🌟 A Journey Forward</h2>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Stories from Other Participants</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <blockquote className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm italic mb-4">
                      &ldquo;Started with food donations, saved up enough for a job interview outfit, got hired, and now have my own POD!&rdquo;
                    </p>
                    <footer className="text-xs text-muted-foreground">— Maria, Los Angeles</footer>
                  </blockquote>
                  <blockquote className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm italic mb-4">
                      &ldquo;The SmartFund helped me get into POD housing. Having my own co-ordinates made all the difference in etting my shit together.&rdquo;
                    </p>
                    <footer className="text-xs text-muted-foreground">— James, Seattle</footer>
                  </blockquote>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">Immediate (1-30 days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>• Secure basic daily needs</li>
                      <li>• Establish safe routine</li>
                      <li>• Build emergency fund</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">Short-term (1-6 months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>• Access stable temporary housing</li>
                      <li>• Connect with job training</li>
                      <li>• Build support network</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">Long-term (6+ months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>• Secure permanent housing</li>
                      <li>• Achieve stable employment</li>
                      <li>• Give back to community</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Call to Action */}
            <div className="relative rounded-lg overflow-hidden p-8 text-center mb-12">
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070')",
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Content */}
              <div className="relative z-10 text-white">
                <h2 className="text-3xl font-bold mb-4">🏠 You Have the Strength to Overcome</h2>
                <p className="text-lg mb-6 opacity-90">
                  <strong>You are not defined by your current situation.</strong> SHELTR-AI is here to support you every step of the way toward stability and independence.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">Direct</div>
                    <div className="text-sm opacity-80">Connection to donors</div>
                    <div className="text-xs opacity-70 mt-1">No delays, no intermediaries</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">80%</div>
                    <div className="text-sm opacity-80">Goes directly to you</div>
                    <div className="text-xs opacity-70 mt-1">15% builds your housing fund</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-80">Support and assistance</div>
                    <div className="text-xs opacity-70 mt-1">Help when you need it most</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-base opacity-90">
                    Every donation represents someone who believes in you and wants to help you succeed. 
                    You have the strength to overcome your current challenges.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 px-8">
                        <Users className="h-5 w-5 mr-2" />
                        Start Your Journey
                      </Button>
                    </Link>
                    <Link href="/scan-give">
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-600 px-8">
                        <QrCode className="h-5 w-5 mr-2" />
                        See How It Works
                      </Button>
                    </Link>
                  </div>
                  
                  <p className="text-sm opacity-75 mt-4">
                    ✨ SHELTR-AI is a tool to help you on your journey toward stability and independence ✨
                  </p>
                </div>
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