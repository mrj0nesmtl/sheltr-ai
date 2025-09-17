import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users, QrCode, DollarSign, Home, Heart, Shield, Smartphone, CheckCircle, CreditCard, Bike, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';

export default function ParticipantsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/tokenomics" className="text-muted-foreground hover:text-primary transition-colors">Tokenomics</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

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

      {/* Hero Section */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sheltr_units/pods-2.jpeg"
            alt="SHELTR PODS - Mobile emergency housing units in urban setting"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-green-500/20 text-green-300 border-green-500/30">
            For Participants
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Make a Move
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto">
          Your journey respected, your privacy protected.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                <p className="text-muted-foreground text-center">
                  80% of all donations go directly to you for immediate needs like food, 
                  clothing, transportation, and essential services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <Home className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-green-600 dark:text-green-400">Housing Pathway</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  15% of donations automatically go towards housing solutions, 
                  building a foundation for your permanent stability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-green-600 dark:text-green-400">Privacy Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Your personal information is secure and private. You control what 
                  you share and maintain dignity throughout your journey.
                </p>
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
                    <span>Visit any partner shelter or service center</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Complete a simple registration process</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Receive your unique QR code card</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Start receiving donations immediately</span>
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
                    <span>Pre-paid cards for immediate use</span>
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

      {/* Path to Housing Success */}
      <section className="py-20 bg-green-500/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Your Path to Housing Success</h2>
            <p className="text-xl text-muted-foreground">
              How SHELTR tokens, PODS, and MOBI work together to provide immediate relief and long-term housing stability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1: Immediate Relief */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-center">Immediate Relief</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Receive SHELTR tokens directly for immediate needs like food, transportation, 
                  and emergency shelter while PODS are being deployed.
                </p>
                <div className="bg-green-600/10 rounded-lg p-3">
                  <div className="text-lg font-semibold text-green-600">$40 direct support</div>
                  <div className="text-xs text-muted-foreground">per $50 donation received</div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Housing Fund Building */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-center">Emergency PODS Deployment</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  15% of donations fund emergency PODS deployment through MOBI transport - 
                  providing immediate secure shelter while building toward permanent housing.
                </p>
                <div className="bg-blue-600/10 rounded-lg p-3">
                  <div className="text-lg font-semibold text-blue-600">$7.50 PODS fund</div>
                  <div className="text-xs text-muted-foreground">per $50 donation received</div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Sustainable Independence */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-center">Sustainable Independence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  From PODS to permanent housing with continued MOBI access for transportation, 
                  job training, healthcare access, and financial literacy support.
                </p>
                <div className="bg-purple-600/10 rounded-lg p-3">
                  <div className="text-lg font-semibold text-purple-600">Ongoing support</div>
                  <div className="text-xs text-muted-foreground">until sustainable independence</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-green-600/10 rounded-lg p-8 mb-8 border border-green-500/20">
              <h3 className="text-xl font-semibold mb-4">Ready to Start Your Journey?</h3>
              <p className="text-muted-foreground mb-6">
                Every person deserves dignity, respect, and the opportunity for a stable life. 
                SHELTR provides the tools and support to make it happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">Although these pages look awesome
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
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
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pods">
                  <Button variant="outline" size="lg" className="border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Building2 className="h-4 w-4 mr-2" />
                    Explore PODS
                  </Button>
                </Link>
                <Link href="/pods/mobi">
                  <Button variant="outline" size="lg" className="border-orange-500/20 text-orange-600 dark:text-orange-400">
                    <Bike className="h-4 w-4 mr-2" />
                    Explore MOBI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 