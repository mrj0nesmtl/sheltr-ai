'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users, QrCode, DollarSign, Home, Heart, Shield, Smartphone, CheckCircle, CreditCard, Bike, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

export default function ParticipantsPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/solutions/participants', '/images/sheltr_units/pods-2.jpeg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <PublicNavigation />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/solutions" className="hover:text-primary flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Solutions
          </Link>
          <span>/</span>
          <span className="text-green-600 dark:text-green-400">Participants</span>
        </div>
      </div>

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="For Participants"
        badgeVariant="secondary"
        badgeClassName="bg-green-500/20 text-green-300 border-green-500/30"
        title="Make a Move"
        subtitle="Your journey respected, your privacy protected."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-2 border-green-400 text-green-400 hover:bg-green-500/10 backdrop-blur-sm bg-black/20">
              <Users className="h-4 w-4 mr-2" />
              Get Started Today
            </Button>
          </Link>
        </div>
      </StandardHero>

      {/* Core Benefits */}
      <section className="py-16 bg-green-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Direct Support as You Need It</h2>
            <p className="text-xl text-muted-foreground">Simple, respectful access to resources and opportunities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-green-600 dark:text-green-400">Direct Financial Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  80% of all donations go directly to you for immediate needs like food, 
                  clothing, transportation, and essential services.
                </p>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300">
                    No strings attached
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <Home className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-green-600 dark:text-green-400">Housing Pathway</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  15% of donations automatically go towards housing solutions, 
                  building a foundation for your urgent stability.
                </p>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300">
                    Creating Equity • Building Dignity 
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-green-600 dark:text-green-400">Privacy Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Your personal information is secure and private. You control what 
                  you share and maintain dignity throughout your journey.
                </p>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300">
                    Your data, your control
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SHELTR Integrated Supply Chain */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Integrated Supply Chain</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your donations directly fund emergency housing solutions through our PODS and MOBI ecosystem - 
              creating immediate shelter and mobility options connected to your account.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* PODS Integration */}
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-center text-2xl text-blue-600 dark:text-blue-400">Emergency PODS</CardTitle>
                <CardDescription className="text-center">
                  Secure, mobile micro-housing units funded by your donations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Winter-Rated Shelter:</strong> Secure housing rated for -25°C with full amenities
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Solar Powered:</strong> Off-grid capability with battery backup systems
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Smart Security:</strong> Biometric locks and QR code integration for safety
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Donation Funded:</strong> Your housing fund directly supports POD deployment
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/pods">
                    <Button variant="outline" className="w-full bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                      <Building2 className="h-4 w-4 mr-2" />
                      Explore PODS
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* MOBI Integration */}
            <Card className="border-2 border-orange-500/20 bg-orange-500/5">
              <CardHeader>
                <Bike className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-center text-2xl text-orange-600 dark:text-orange-400">MOBI Cycle</CardTitle>
                <CardDescription className="text-center">
                  Electric transportation and POD delivery system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <strong>POD Transport:</strong> Specialized bikes for moving and positioning PODS
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <strong>Personal Mobility:</strong> Transportation access for work and services
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <strong>All-Terrain:</strong> Urban and rural capability for any environment
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <strong>Account Connected:</strong> Access through your participant account
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/pods/mobi">
                    <Button variant="outline" className="w-full bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-300">
                      <Bike className="h-4 w-4 mr-2" />
                      Explore MOBI
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supply Chain Flow */}
          <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-orange-500/10 rounded-xl p-8 border border-green-500/20">
            <h3 className="text-2xl font-bold text-center mb-6">How Your Donations Create Housing Solutions</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">Donations Received</h4>
                <p className="text-sm text-muted-foreground">80% direct support, 15% housing fund</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="font-semibold mb-2">POD Deployment</h4>
                <p className="text-sm text-muted-foreground">Housing funds trigger emergency shelter</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike className="h-8 w-8 text-orange-500" />
                </div>
                <h4 className="font-semibold mb-2">MOBI Transport</h4>
                <p className="text-sm text-muted-foreground">Delivery and positioning of your POD</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-purple-500" />
                </div>
                <h4 className="font-semibold mb-2">Stable Housing</h4>
                <p className="text-sm text-muted-foreground">Pathway to permanent accommodation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Steps to Get Support</h2>
            <p className="text-xl text-muted-foreground">Getting help shouldn&apos;t be complicated</p>
            <div className="mt-6 inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-6 py-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Most people get their QR code the same day they visit
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Getting Started */}
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <QrCode className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle className="text-2xl">Your Personal QR Code</CardTitle>
                <CardDescription>Your unique identifier for receiving support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Visit any partner shelter or service center <em>(find locations near you)</em></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Complete a simple registration process <em>(usually takes 10-15 minutes)</em></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Receive your unique QR code card <em>(yours to keep, works immediately)</em></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Start receiving donations immediately <em>(no waiting period)</em></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Using the System */}
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <Smartphone className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle className="text-2xl">Managing Your Support</CardTitle>
                <CardDescription>Track your progress and access resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Check donation history and balance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Access funds through partner locations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>View housing fund progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Connect with support services</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Access */}
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle className="text-2xl">Accessing Your Funds</CardTitle>
                <CardDescription>Multiple ways to use your donations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Pre-paid vitrual or cards for immediate use</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Direct payments to service providers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Cash disbursement at partner locations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Emergency fund access 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Services */}
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle className="text-2xl">Additional Support</CardTitle>
                <CardDescription>Comprehensive assistance beyond financial help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Case management and advocacy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Healthcare and mental health services</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Job training and employment assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Benefits enrollment and advocacy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-green-500/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-600/10 rounded-lg p-8 border border-green-500/20">
            <h3 className="text-2xl font-semibold mb-4">Ready to Start a SHELTR Journey?</h3>
            <p className="text-muted-foreground mb-4">
              Every person deserves dignity, respect, and the opportunity for a stable life. 
              SHELTR provides some tools and support to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-2 border-green-400 text-green-400 hover:bg-green-500/10 backdrop-blur-sm dark:text-green-300 dark:border-green-300">
                  <Users className="h-4 w-4 mr-2" />
                  Join SHELTR Today
                </Button>
              </Link>
              <Link href="/docs/participant-guide">
                <Button variant="outline" size="lg" className="border-green-500/20 text-green-600 dark:text-green-400">
                  <Heart className="h-4 w-4 mr-2" />
                  Get Support Guide
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