'use client';

import Link from 'next/link';
import { TrendingUp, Users, Home, DollarSign, Globe, Shield, Heart, MapPin, Clock, CheckCircle, BarChart3, PieChart, Building2, Coins, LogIn, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function ImpactPage() {
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
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-foreground hover:text-primary transition-colors">Impact</Link>
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
              <Link href="/solutions" className="block text-muted-foreground hover:text-primary transition-colors py-2">Solutions</Link>
              <Link href="/scan-give" className="block text-muted-foreground hover:text-primary transition-colors py-2">Scan & Give</Link>
              <Link href="/tokenomics" className="block text-muted-foreground hover:text-primary transition-colors py-2">Tokenomics</Link>
              <Link href="/impact" className="block text-foreground hover:text-primary transition-colors py-2">Impact</Link>
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

      {/* Hero Section - Redesigned to be forward-looking */}
      <section className="py-24 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">Future Impact Vision</Badge>
            <h1 className="text-4xl font-bold mb-6 text-foreground">
              Transforming Lives Through Technology
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
              Our mission is to create systematic, scalable solutions that amplify the incredible work 
              of Internet Angels and ensure every act of kindness creates lasting, measurable impact.
            </p>
          </div>

          {/* Future Impact Projections */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">100K+</h3>
                <p className="text-sm text-muted-foreground">Participants Empowered</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">By 2027</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$500M</h3>
                <p className="text-sm text-muted-foreground">Direct Impact Funding</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Target by 2030</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</h3>
                <p className="text-sm text-muted-foreground">Cities Worldwide</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Global expansion</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">85%</h3>
                <p className="text-sm text-muted-foreground">Housing Success Rate</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Target outcome</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SmartFund Distribution Transparency */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Transparency</h2>
            <p className="text-xl text-muted-foreground">Every dollar tracked on-chain with automated distribution</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Distribution Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Automated Fund Distribution
                </CardTitle>
                <CardDescription>How every donation is automatically allocated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Direct Support (SHELTR-S)</span>
                      <span className="text-sm text-green-600 dark:text-green-400 font-semibold">80% - Direct to participants</span>
                    </div>
                    <Progress value={80} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">Immediate participant relief</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Housing Fund</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">15% - Long-term solutions</span>
                    </div>
                    <Progress value={15} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">Sustainable housing programs</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Platform Operations</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">5% - Infrastructure</span>
                    </div>
                    <Progress value={5} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">Sustainable platform growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Blockchain Verification
                </CardTitle>
                <CardDescription>100% transparent, verifiable transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Base Network Integration</p>
                      <p className="text-sm text-muted-foreground">Low-cost, fast transactions</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                      Ready
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Smart Contract Automation</p>
                      <p className="text-sm text-muted-foreground">Instant fund distribution</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Deployed
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Real-time Analytics</p>
                      <p className="text-sm text-muted-foreground">Live impact tracking</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      In Development
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Internet Angels - Moved from About page and renamed */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Internet Angels</h2>
            <p className="text-xl text-muted-foreground">
              Social impact creators who inspire our mission and will benefit from direct shelter funding distribution
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="text-lg leading-relaxed">
                When we first discovered Ryan and Tiny Tiny Homes in Toronto, we saw the future of homelessness solutions. 
                Their mobile emergency shelters replace unsafe tent encampments with dignified, secure alternatives. 
                Creators like this inspire our vision for what&rsquo;s possible when technology meets compassion.
              </p>
              
              <p className="text-lg leading-relaxed">
                SHELTR builds on the legacy of digital humanitarians who prove that social media platforms can be 
                forces for genuine change, creating systematic, scalable solutions that ensure every act of kindness 
                creates lasting impact through blockchain transparency and AI-driven insights. These Internet Angels will 
                all benefit from SHELTR&rsquo;s direct funding distribution as we energize and contribute to their already incredible efforts.
              </p>
            </div>
            
            {/* Social Impact Creators Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-lg p-4 text-center border hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Just Knate</h4>
                <p className="text-sm text-muted-foreground mb-2">2.8M Followers • 78.5M Likes</p>
                <a href="https://www.tiktok.com/@justknate" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm hover:underline">@justknate</a>
                <p className="text-xs text-muted-foreground mt-1">Cash app $justknate • Venmo @justknate</p>
              </div>
              
              <div className="bg-card rounded-lg p-4 text-center border hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Tiny Tiny Homes</h4>
                <p className="text-sm text-muted-foreground mb-2">237.4K Followers • 2.1M Likes</p>
                <a href="https://www.tiktok.com/@tinytinyhomes" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm hover:underline">@tinytinyhomes</a>
                <p className="text-xs text-muted-foreground mt-1">Contact via website: linktr.ee/tinytinyhomes</p>
              </div>
              
              <div className="bg-card rounded-lg p-4 text-center border hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">THE GOOD BOSS</h4>
                <p className="text-sm text-muted-foreground mb-2">4M Followers • 83.7M Likes</p>
                <a href="https://www.tiktok.com/@victorthegoodboss" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm hover:underline">@victorthegoodboss</a>
                <p className="text-xs text-muted-foreground mt-1">Creator | Entrepreneur | Love Helping Others</p>
              </div>
              
              <div className="bg-card rounded-lg p-4 text-center border hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">EdHelpsYT</h4>
                <p className="text-sm text-muted-foreground mb-2">3.3K Followers • 138.6K Likes</p>
                <a href="https://www.tiktok.com/@edhelpsyt" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm hover:underline">@edhelpsyt</a>
                <p className="text-xs text-muted-foreground mt-1">Here to help those in need</p>
              </div>
              
              <div className="bg-card rounded-lg p-4 text-center border hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Acts of Heart</h4>
                <p className="text-sm text-muted-foreground mb-2">1.5K Followers • 19.8K Likes</p>
                <a href="https://www.tiktok.com/@actsofheart4" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm hover:underline">@actsofheart4</a>
              </div>

              <div className="bg-card rounded-lg p-4 text-center border hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Caleb Simpson</h4>
                <p className="text-sm text-muted-foreground mb-2">8.5M Followers • 322.2M Likes</p>
                <a href="https://www.tiktok.com/@calebwsimpson" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm hover:underline">@calebwsimpson</a>
                <p className="text-xs text-muted-foreground mt-1">Building 51 homes in Cambodia • linktr.ee/calebwsimpson92</p>
              </div>
            </div>
            
            {/* Content Links */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-2">📰</span>
                    SHELTR on Substack
                  </CardTitle>
                  <CardDescription>
                    Read our latest article about hacking homelessness through technology
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="https://substack.com/home/post/p-153502903" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-2">🎧</span>
                    SHELTR Podcast
                  </CardTitle>
                  <CardDescription>
                    Listen to our conversation about solving homelessness on Spotify
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="https://open.spotify.com/episode/2TZquGVy7vT6yZMgDraMYe" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                      Listen Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Future Technology Integration */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Technology Roadmap</h2>
            <p className="text-xl text-muted-foreground">Building the future of social impact technology</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Badge variant="secondary" className="absolute -top-3 -right-3 bg-green-500/10 text-green-600 border-green-500/20">
                    Q1 2025
                  </Badge>
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Smart Contracts</h3>
                  <p className="text-muted-foreground text-sm">Automated fund distribution and transparency</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Badge variant="secondary" className="absolute -top-3 -right-3 bg-blue-500/10 text-blue-600 border-blue-500/20">
                    Q2 2025
                  </Badge>
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Mobile Platform</h3>
                  <p className="text-muted-foreground text-sm">Native apps for all stakeholders</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Badge variant="secondary" className="absolute -top-3 -right-3 bg-purple-500/10 text-purple-600 border-purple-500/20">
                    Q3 2025
                  </Badge>
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">AI Analytics</h3>
                  <p className="text-muted-foreground text-sm">Predictive insights and optimization</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Badge variant="secondary" className="absolute -top-3 -right-3 bg-orange-500/10 text-orange-600 border-orange-500/20">
                    2026
                  </Badge>
                  <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Global Scale</h3>
                  <p className="text-muted-foreground text-sm">Worldwide deployment and impact</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Help us amplify the incredible work of Internet Angels and create systematic solutions 
            that ensure every act of kindness creates lasting impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan-give">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving
              </Button>
            </Link>
            <Link href="/solutions">
              <Button size="lg" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Explore Solutions
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Technical Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 