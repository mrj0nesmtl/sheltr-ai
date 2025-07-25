import Link from 'next/link';
import { TrendingUp, Users, Home, DollarSign, Globe, Shield, Heart, MapPin, Clock, CheckCircle, BarChart3, PieChart, Building2, Coins, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ImpactPage() {
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Live Stats */}
      <section className="py-24 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">Live Impact Dashboard</Badge>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Real Impact, Real Time
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Every donation is tracked on-chain for complete transparency. See how SHELTR-AI is transforming lives across the globe.
            </p>
          </div>

          {/* Live Impact Counters */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$2.4M</h3>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+$12,847 today</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">8,429</h3>
                <p className="text-sm text-muted-foreground">Participants Helped</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">+43 this week</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1,247</h3>
                <p className="text-sm text-muted-foreground">Housed Successfully</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">68% success rate</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">127</h3>
                <p className="text-sm text-muted-foreground">Cities Reached</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">12 countries</p>
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
                      <span className="text-sm text-green-600 dark:text-green-400 font-semibold">80% - $1.92M</span>
                    </div>
                    <Progress value={80} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">Immediate participant relief</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Housing Fund</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">15% - $360K</span>
                    </div>
                    <Progress value={15} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">Long-term housing solutions</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Platform Operations</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">5% - $120K</span>
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
                      <p className="font-medium">Smart Contracts Executed</p>
                      <p className="text-sm text-muted-foreground">Automated distributions</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                      23,847
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Transaction Confirmations</p>
                      <p className="text-sm text-muted-foreground">Average block time: 2.1s</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      99.97%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Gas Fees Saved</p>
                      <p className="text-sm text-muted-foreground">Via Base Network efficiency</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      $47K
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Real people, real transformations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">M</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Marcus T.</h4>
                    <p className="text-sm text-muted-foreground">Seattle, WA</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;After 8 months on the streets, SHELTR-AI helped me get back on my feet. 
                  The direct payments gave me dignity and the housing program found me a permanent place.&quot;
                </p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Permanently housed • 247 days ago
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">S</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Sarah K.</h4>
                    <p className="text-sm text-muted-foreground">Montreal, QC</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;The transparency gave me hope. Seeing exactly how donations helped me 
                  and others motivated me to get the support I needed to rebuild my life.&quot;
                </p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Employed & housed • 89 days ago
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">D</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">David R.</h4>
                    <p className="text-sm text-muted-foreground">Vancouver, BC</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;Being able to use my phone to receive help was game-changing. 
                  No forms, no waiting - just direct support when I needed it most.&quot;
                </p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Stable housing • 156 days ago
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Geographic Impact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Global Reach</h2>
            <p className="text-xl text-muted-foreground">Making impact across continents</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">North America</h3>
                <p className="text-muted-foreground mb-2">89 cities</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">4,231 participants</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Europe</h3>
                <p className="text-muted-foreground mb-2">23 cities</p>
                <p className="text-sm text-green-600 dark:text-green-400">2,847 participants</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Australia</h3>
                <p className="text-muted-foreground mb-2">11 cities</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">892 participants</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Asia</h3>
                <p className="text-muted-foreground mb-2">4 cities</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">459 participants</p>
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
            Every scan, every donation, every interaction creates real impact. 
            Be part of the most transparent charitable giving platform ever created.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan-give">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Live Dashboard
              </Button>
            </Link>
            <Link href="/tokenomics">
              <Button size="lg" variant="outline">
                <Coins className="h-4 w-4 mr-2" />
                Learn About $SHLTR
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Hacking homelessness through technology, transparency, and compassion.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/solutions">Solutions</Link></li>
                <li><Link href="/scan-give">Scan & Give</Link></li>
                <li><Link href="/impact">Impact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tokenomics">Tokenomics</Link></li>
                <li><a href="#">API Documentation</a></li>
                <li><a href="#">Smart Contracts</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">Documentation</Link></li>
                <li><a href="#">Wiki</a></li>
                <li><Link href="/register">Help Center</Link></li>
                <li><Link href="/register">Contact</Link></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SHELTR-AI. Built with ❤️ in memory of Gunnar Blaze.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 