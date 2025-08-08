'use client';

import Link from 'next/link';
import { Home, Building2, Users, Heart, DollarSign, BarChart3, Shield, QrCode, Handshake, MapPin, UserCheck, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function SolutionsPage() {
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
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
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
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors py-2">Home</Link>
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors py-2">About</Link>
              <Link href="/solutions" className="block text-foreground hover:text-primary transition-colors py-2">Solutions</Link>
              <Link href="/scan-give" className="block text-muted-foreground hover:text-primary transition-colors py-2">Scan & Give</Link>
              <Link href="/tokenomics" className="block text-muted-foreground hover:text-primary transition-colors py-2">Tokenomics</Link>
              <Link href="/impact" className="block text-muted-foreground hover:text-primary transition-colors py-2">Impact</Link>
              <div className="border-t pt-4 space-y-3">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/solutions-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Platform Solutions</Badge>
          <h1 className="text-5xl font-bold mb-6 text-white">
            One Platform, Every Stakeholder
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            SHELTR serves everyone in the ecosystem through a unified open-source platform that ensures transparency, dignity, and maximum impact.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How SHELTR Works for Everyone</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform creates value for every participant in the homelessness ecosystem, 
              from frontline organizations to individual donors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shelters & NGOs */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Shelters & NGOs</CardTitle>
                <CardDescription className="text-lg">
                  Streamlined operations and enhanced participant support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Participant Management</h4>
                      <p className="text-sm text-muted-foreground">Digital profiles, QR code generation, and progress tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Real-Time Analytics</h4>
                      <p className="text-sm text-muted-foreground">Track donations, impact metrics, and resource allocation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Compliance & Reporting</h4>
                      <p className="text-sm text-muted-foreground">Automated reports for funders and regulatory requirements</p>
                    </div>
                  </div>
                </div>
                <Link href="/solutions/organizations">
                  <Button className="w-full mt-6 border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Learn More for Organizations
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Government */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Government Agencies</CardTitle>
                <CardDescription className="text-lg">
                  Data-driven policy making and budget transparency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Policy Insights</h4>
                      <p className="text-sm text-muted-foreground">Regional homelessness data and trend analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Budget Transparency</h4>
                      <p className="text-sm text-muted-foreground">Track public fund allocation and impact measurement</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Handshake className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Multi-Agency Coordination</h4>
                      <p className="text-sm text-muted-foreground">Unified platform for cross-department collaboration</p>
                    </div>
                  </div>
                </div>
                <Link href="/solutions/government">
                  <Button className="w-full mt-6 border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Government Solutions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Participants (Homeless) */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Participants</CardTitle>
                <CardDescription className="text-lg">
                  Dignified support with direct access to resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <QrCode className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Personal QR Code</h4>
                      <p className="text-sm text-muted-foreground">Unique identifier for receiving direct donations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Direct Financial Support</h4>
                      <p className="text-sm text-muted-foreground">80% of donations go directly to personal needs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Housing Pathway</h4>
                      <p className="text-sm text-muted-foreground">Automatic contribution to long-term housing solutions</p>
                    </div>
                  </div>
                </div>
                <Link href="/solutions/participants">
                  <Button className="w-full mt-6 border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Participant Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Donors */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl">Donors</CardTitle>
                <CardDescription className="text-lg">
                  Transparent giving with measurable impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Blockchain Transparency</h4>
                      <p className="text-sm text-muted-foreground">Every donation tracked and verified on the blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Impact Measurement</h4>
                      <p className="text-sm text-muted-foreground">Real-time updates on how your donation helps</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <QrCode className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Easy Giving</h4>
                      <p className="text-sm text-muted-foreground">Instant donations via QR code scanning</p>
                    </div>
                  </div>
                </div>
                <Link href="/solutions/donors">
                  <Button className="w-full mt-6 border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Start Giving Today
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Trust SHELTR?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-semibold">100% Transparent</h3>
              <p className="text-muted-foreground">Blockchain tech ensures every transaction is visible and verified</p>
            </div>
            <div className="space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-500/20">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full opacity-20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-semibold">Data-Driven</h3>
              <p className="text-muted-foreground">Real-time analytics help optimize resource allocation and impact</p>
            </div>
            <div className="space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-red-500/20">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-semibold">Human-Centered</h3>
              <p className="text-muted-foreground">Built with dignity and respect for all participants in the system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform How We Address the Unhoused?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create lasting change.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/solutions/organizations">
              <Button size="lg">
                <Building2 className="h-4 w-4 mr-2" />
                Organization Sign Up
              </Button>
            </Link>
            <Link href="/solutions/donors">
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Individual Donor
              </Button>
            </Link>
            <Link href="/solutions/government">
              <Button variant="outline" size="lg">
                <MapPin className="h-4 w-4 mr-2" />
                Government Partnership
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 