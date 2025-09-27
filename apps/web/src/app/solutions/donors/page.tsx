import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Shield, BarChart3, QrCode, Eye, Zap, TrendingUp, CheckCircle, Smartphone, Globe, Users, Target, Gift, Repeat, Bike, Building2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';

export default function DonorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="SHELTR" className="h-6 w-auto hover:opacity-80 transition-opacity" />
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
          <span className="text-orange-600 dark:text-orange-400">Donors</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sheltr_units/closeup-wheels.jpeg"
            alt="SHELTR MOBI wheels - mobility and freedom in motion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-orange-500/20 text-orange-300 border-orange-500/30">
            For Donors
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Every Dollar Turns the Wheel
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-4xl mx-auto">
            Experience the most transparent charitable giving platform ever created. Watch your donations 
            flow directly to those in need, fund MOBI bikes and PODS, sponsor participant journeys, 
            and track real-time impact through blockchain technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan-give">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                <QrCode className="h-4 w-4 mr-2" />
                Start Giving Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Eye className="h-4 w-4 mr-2" />
              Track Your Impact
            </Button>
          </div>
        </div>
      </section>

      {/* Core Value Props */}
      <section className="py-16 bg-orange-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Donors Love SHELTR</h2>
            <p className="text-xl text-muted-foreground">The most transparent and impactful way to end homelessness</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-orange-600 dark:text-orange-400">100% Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Every donation is recorded on the blockchain. See exactly where 
                  your money goes and track its impact in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-orange-600 dark:text-orange-400">Measurable Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Get regular updates on lives changed, housing secured, and 
                  progress made possible by your generosity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-orange-600 dark:text-orange-400">Instant Giving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Scan a QR code and make an immediate difference. No apps to download, 
                  no lengthy forms - just instant impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Donor Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Next-Generation Giving Experience</h2>
            <p className="text-xl text-muted-foreground">Revolutionary features that transform how you support participants</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Distance Scanning & Recurring Sponsorships */}
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-center text-2xl text-blue-600 dark:text-blue-400">Distance Scanning & Sponsorships</CardTitle>
                <CardDescription className="text-center">
                  Support participants from anywhere with recurring sponsorships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Distance QR Scanning:</strong> Donate to participants from photos, social media, or remote locations
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Repeat className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Recurring Sponsorships:</strong> Set up weekly, monthly, or custom recurring donations
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Goal Tracking:</strong> Watch your sponsored participants achieve housing milestones
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Progress Updates:</strong> Receive personalized updates on participant journeys
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MOBI & PODS Gifting */}
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader>
                <Gift className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-center text-2xl text-green-600 dark:text-green-400">MOBI & PODS Gifting</CardTitle>
                <CardDescription className="text-center">
                  Directly fund mobility and housing solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Bike className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Gift MOBI Access:</strong> Fund electric bike access for transportation and work opportunities
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Sponsor PODS:</strong> Directly fund emergency micro-housing deployment
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Targeted Impact:</strong> Choose specific participants to receive MOBI or PODS
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Verified Delivery:</strong> Blockchain-verified deployment and participant access
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Flow */}
          <div className="bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-green-500/10 rounded-xl p-8 border border-orange-500/20">
            <h3 className="text-2xl font-bold text-center mb-6">Complete Ecosystem Integration</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Scan & Sponsor</h4>
                <p className="text-sm text-muted-foreground">Distance scanning with recurring sponsorships</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Track Goals</h4>
                <p className="text-sm text-muted-foreground">Watch participants achieve housing milestones</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Gift Solutions</h4>
                <p className="text-sm text-muted-foreground">Fund MOBI bikes and PODS directly</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Measure Impact</h4>
                <p className="text-sm text-muted-foreground">Real-time blockchain verification of outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giving Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Multiple Ways to Make a Difference</h2>
            <p className="text-xl text-muted-foreground">Choose the giving method that works best for you</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* QR Code Giving */}
            <Card className="border-2 border-orange-500/20">
              <CardHeader>
                <QrCode className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
                <CardTitle className="text-2xl">QR Code Giving</CardTitle>
                <CardDescription>Direct, personal donations to individuals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Scan QR codes in-person or from distance (photos/social media)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Choose your donation amount instantly</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>80% goes directly to the individual</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Receive immediate blockchain confirmation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Giving */}
            <Card className="border-2 border-orange-500/20">
              <CardHeader>
                <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
                <CardTitle className="text-2xl">Platform Giving</CardTitle>
                <CardDescription>Support multiple participants and programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Donate to specific shelters or regions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Support housing fund initiatives</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Recurring monthly donations available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Tax-deductible receipts automatically generated</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corporate Giving */}
            <Card className="border-2 border-orange-500/20">
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
                <CardTitle className="text-2xl">Corporate Partnership</CardTitle>
                <CardDescription>Team giving and employee engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Employee matching donation programs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Team volunteering and QR code campaigns</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Impact reporting for CSR initiatives</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Branded giving campaigns and tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Tracking */}
            <Card className="border-2 border-orange-500/20">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
                <CardTitle className="text-2xl">Impact Dashboard</CardTitle>
                <CardDescription>Real-time transparency and impact measurement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Live donation tracking and allocation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Participant progress updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Regional impact statistics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Stories of lives changed by your generosity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-orange-500/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-orange-600/10 rounded-lg p-8 border border-orange-500/20">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Lives?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the most transparent charitable giving platform ever created. Every donation is tracked, 
              every impact is verified, and every dollar makes a real difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan-give">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Heart className="h-4 w-4 mr-2" />
                  Start Giving Today
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-orange-500/20 text-orange-600 dark:text-orange-400">
                  <QrCode className="h-4 w-4 mr-2" />
                  Create Donor Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Start your giving journey in just minutes and see immediate impact.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 dark:text-orange-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Find a QR Code</h3>
              <p className="text-sm text-muted-foreground">Look for SHELTR QR codes or visit our platform</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 dark:text-orange-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Your Impact</h3>
              <p className="text-sm text-muted-foreground">Select donation amount and see transparent breakdown</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 dark:text-orange-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Track Your Impact</h3>
              <p className="text-sm text-muted-foreground">Receive updates and see how your generosity helps</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan-give">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving Today
              </Button>
            </Link>
            <Link href="/pods">
              <Button variant="outline" size="lg" className="border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Building2 className="h-4 w-4 mr-2" />
                Explore PODS
              </Button>
            </Link>
            <Link href="/pods/mobi">
              <Button variant="outline" size="lg" className="border-green-500/20 text-green-600 dark:text-green-400">
                <Bike className="h-4 w-4 mr-2" />
                Explore MOBI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 