'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <ThemeLogo />
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/about" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    About
                  </Link>
                  <Link href="/solutions" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Solutions
                  </Link>
                  <Link href="/scan-give" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Scan & Give
                  </Link>
                  <Link href="/impact" className="hover:text-primary px-3 py-2 text-sm font-medium">
                    Impact
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
                <ThemeToggle />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
                  <Link 
                    href="/about" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/solutions" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Solutions
                  </Link>
                  <Link 
                    href="/scan-give" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Scan & Give
                  </Link>
                  <Link 
                    href="/impact" 
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Impact
                  </Link>
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section - Fixed height like About/Solutions pages */}
        <section 
          className="relative py-20 bg-gradient-to-r from-slate-900 to-slate-800"
          style={{
            backgroundImage: "url('/backgrounds/hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Better to Solve,<br />
                <span className="text-blue-400">than Manage.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                SHELTR is hacking homelessness via QR-code donations, blockchain transparency, 
                and AI-driven insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                    Get Started
                  </Button>
                </Link>
                <Link href="/scan-give">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-black">
                    Scan & Give Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>



        {/* How it Works Section - Updated with combined content */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How SHELTR Works for Everyone</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SHELTR serves shelters, government agencies, homeless participants, and donors 
                through a unified platform that ensures transparency, dignity, and maximum impact. 
                Our platform creates value for every participant in the homelessness ecosystem, from 
                frontline organizations to individual donors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Shelters & NGOs */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold">Shelters & NGOs</h4>
                </div>
                <p className="text-muted-foreground mb-6">Streamlined operations and enhanced participant support</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Participant Management</div>
                      <div className="text-sm text-muted-foreground">Digital intake, QR code generation, and progress tracking</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Real-Time Analytics</div>
                      <div className="text-sm text-muted-foreground">Track capacity, services, finances, and resource allocation</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Compliance & Reporting</div>
                      <div className="text-sm text-muted-foreground">Automated reports for funders and regulatory requirements</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/solutions/organizations">
                    <Button variant="outline" className="w-full">Learn More for Organizations</Button>
                  </Link>
                </div>
              </div>

              {/* Government Agencies */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold">Government Agencies</h4>
                </div>
                <p className="text-muted-foreground mb-6">Data-driven policy making and budget transparency</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Policy Insights</div>
                      <div className="text-sm text-muted-foreground">Real-time homelessness data and trend analysis</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Budget Transparency</div>
                      <div className="text-sm text-muted-foreground">Track government fund usage and impact measurement</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Multi-Agency Coordination</div>
                      <div className="text-sm text-muted-foreground">Unified platform for cross-department collaboration</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/solutions/government">
                    <Button variant="outline" className="w-full">Government Solutions</Button>
                  </Link>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold">Participants</h4>
                </div>
                <p className="text-muted-foreground mb-6">Dignified support with direct access to resources</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Personal QR Code</div>
                      <div className="text-sm text-muted-foreground">Instant donations via QR code linked to their SHELTR-S wallet</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Direct Financial Support</div>
                      <div className="text-sm text-muted-foreground">80% of donations go directly to participant needs</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Housing Priority</div>
                      <div className="text-sm text-muted-foreground">Automatic entry into housing fund for permanent solutions</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/solutions/participants">
                    <Button variant="outline" className="w-full">Participant Support</Button>
                  </Link>
                </div>
              </div>

              {/* Donors */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold">Donors</h4>
                </div>
                <p className="text-muted-foreground mb-6">Transparent giving with measurable impact</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Blockchain Transparency</div>
                      <div className="text-sm text-muted-foreground">Every donation tracked on-chain through our SmartFund</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Impact Measurement</div>
                      <div className="text-sm text-muted-foreground">Real-time updates on how your donation helps participants</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="font-semibold text-sm">Easy Giving</div>
                      <div className="text-sm text-muted-foreground">Instant donations via QR code scanning</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/solutions/donors">
                    <Button variant="outline" className="w-full">Start Giving Today</Button>
                  </Link>
                </div>
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
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
                <p className="text-muted-foreground">
                  Blockchain technology ensures every transaction is visible and verified
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Data-Driven</h3>
                <p className="text-muted-foreground">
                  Real-time analytics help optimize resource allocation and impact
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                Join the revolution in charitable giving. Every scan creates transparency, 
                every donation builds housing, every participant finds dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/scan-give">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-black bg-white/20 hover:bg-white hover:text-black">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
} 