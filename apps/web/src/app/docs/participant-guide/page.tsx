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
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-12 w-12 text-teal-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">Participant User Guide</h1>
                  <Badge className="bg-teal-500 text-white">User Guide</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Complete guide for using the SHELTR platform
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>July 2025</span>
                  <span>•</span>
                  <span>28 pages</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Production Ready</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/06-user-guides/participant-guide.md" target="_blank" rel="noopener noreferrer">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Download className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code Demo
              </Button>
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

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Onboarding</CardTitle>
                  <CardDescription>
                    Step-by-step registration and setup process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Account creation and verification</li>
                    <li>• Profile setup and documentation</li>
                    <li>• Welcome bonus activation</li>
                    <li>• Security settings configuration</li>
                    <li>• Platform tutorial walkthrough</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code & Wallet</CardTitle>
                  <CardDescription>
                    Managing your digital identity and funds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Understanding your unique QR code</li>
                    <li>• SHELTR-S wallet management</li>
                    <li>• Receiving and spending tokens</li>
                    <li>• Transaction history tracking</li>
                    <li>• Security best practices</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Access</CardTitle>
                  <CardDescription>
                    Discovering and using available services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Service directory navigation</li>
                    <li>• Booking appointments and resources</li>
                    <li>• Emergency assistance access</li>
                    <li>• Progress tracking and goals</li>
                    <li>• Feedback and rating system</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Resources</CardTitle>
                  <CardDescription>
                    Getting help when you need it most
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• 24/7 support hotline access</li>
                    <li>• Case worker communication</li>
                    <li>• Peer support groups</li>
                    <li>• Crisis intervention services</li>
                    <li>• Community resource directory</li>
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