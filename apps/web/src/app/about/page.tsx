'use client';

import Link from 'next/link';
import { Home, Heart, Shield, Users, ArrowRight, Github, Twitter, Mail, Coins, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function AboutPage() {
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
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
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
              <Link href="/about" className="block text-foreground hover:text-primary transition-colors py-2">About</Link>
              <Link href="/solutions" className="block text-muted-foreground hover:text-primary transition-colors py-2">Solutions</Link>
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
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Our Story</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Hacking Homelessness Through Technology
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            SHELTR-AI was born from the belief that technology should bridge the gap between 
            those who need help and those who want to help. Our platform revolutionizes 
            charitable giving through transparency, efficiency, and genuine impact.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Loyalty</CardTitle>
                <CardDescription>
                  Unwavering commitment to our users and their dignity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We stand by every participant, donor, and shelter partner with 
                  the same commitment to transparency and impact.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Protection</CardTitle>
                <CardDescription>
                  Safeguarding the vulnerable through secure technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our blockchain technology ensures every donation reaches its 
                  intended recipient with complete transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Care</CardTitle>
                <CardDescription>
                  Unconditional support for those experiencing homelessness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every feature we build is designed with compassion, respect, 
                  and the goal of restoring dignity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact & Mission */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Real Impact, Real Change</h2>
            <Badge variant="outline" className="mb-6">Transparent • Scalable • Effective</Badge>
          </div>
          
          <Card className="text-left max-w-2xl mx-auto">
            <CardContent className="p-8">
              <p className="text-lg mb-6">
                SHELTR-AI represents a revolutionary approach to charitable giving, combining 
                cutting-edge technology with compassionate action to create meaningful change 
                in the fight against homelessness.
              </p>
              <p className="text-muted-foreground mb-6">
                Every QR code scan, every blockchain transaction, and every smart contract execution 
                brings us closer to a world where technology bridges the gap between those who need 
                help and those ready to provide it.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="italic text-sm">
                  &quot;Technology should empower dignity, transparency should build trust, 
                  and every donation should create lasting impact for those who need it most.&quot;
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link href="/scan-give">
                  <Button>
                    <Heart className="h-4 w-4 mr-2" />
                    Start Giving
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Phoenix Moment */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Phoenix Moment</h2>
            <p className="text-xl text-muted-foreground">
              How a devastating setback became the catalyst for something far better
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Challenge</h3>
                  <p className="text-muted-foreground">
                    In early 2025, we lost our entire Supabase database due to account neglect during 
                    paid project work. What seemed like a catastrophic failure became an opportunity 
                    to build something revolutionary.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Transformation</h3>
                  <p className="text-muted-foreground mb-4">
                    Instead of rebuilding the same system, we used this moment to create SHELTR-AI 2.0 
                    with modern architecture, enhanced features, and a commitment to real impact.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Legacy SHELTR</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Supabase backend</li>
                        <li>• Single-tenant architecture</li>
                        <li>• Basic blockchain integration</li>
                        <li>• 3-role system</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">SHELTR-AI 2.0</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Firebase + FastAPI</li>
                        <li>• Multi-tenant SaaS platform</li>
                        <li>• Full token system integration</li>
                        <li>• 4-role system with independent participants</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Help us hack homelessness through technology. Every contribution, whether code, 
            donations, or community support, brings us closer to our mission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan-give">
              <Button size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving
              </Button>
            </Link>
            <Link href="/tokenomics">
              <Button variant="outline" size="lg">
                <Coins className="h-4 w-4 mr-2" />
                Learn About $SHLTR
              </Button>
            </Link>
            <Link href="https://github.com/mrj0nesmtl/sheltr-ai" target="_blank">
              <Button variant="outline" size="lg">
                <Github className="h-4 w-4 mr-2" />
                Contribute Code
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                <Users className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 