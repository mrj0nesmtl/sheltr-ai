import Link from 'next/link';
import { ArrowLeft, Heart, Shield, BarChart3, QrCode, Eye, Zap, TrendingUp, CheckCircle, Smartphone, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DonorsPage() {
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
          <span className="text-orange-600 dark:text-orange-400">Donors</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">For Donors</Badge>
          <h1 className="text-4xl font-bold mb-6">
            See Every Dollar Make a Real Difference
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the most transparent charitable giving platform ever created. Watch your donations 
            flow directly to those in need through blockchain technology, with real-time impact tracking 
            and verified outcomes you can trust.
          </p>
        </div>
      </section>

      {/* Core Value Props */}
      <section className="py-16 bg-orange-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Donors Love SHELTR-AI</h2>
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
                    <span>Scan QR codes from participants you meet</span>
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

      {/* Pre-Launch Vision */}
      <section className="py-20 bg-orange-500/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Your Donations Will Create Real Change</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Be among the first donors to make a verified difference in ending homelessness through blockchain transparency.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">Q2 2025</div>
                <p className="text-sm text-muted-foreground">Platform launch target</p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Donation transparency</p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">&lt;5s</div>
                <p className="text-sm text-muted-foreground">Transaction speed</p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">~$0.01</div>
                <p className="text-sm text-muted-foreground">Network fees</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-orange-500/10 p-8 rounded-lg border border-orange-500/20 mb-12">
            <h3 className="text-xl font-semibold mb-4">Average Impact per $50 Donation</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$40</div>
                <p className="text-sm text-muted-foreground">Direct to participant</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$7.50</div>
                <p className="text-sm text-muted-foreground">Housing fund contribution</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$2.50</div>
                <p className="text-sm text-muted-foreground">Platform operations</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Heart className="h-4 w-4 mr-2" />
              Start Giving Today
            </Button>
            <Button variant="outline" size="lg" className="border-orange-500/20 text-orange-600 dark:text-orange-400">
              <Smartphone className="h-4 w-4 mr-2" />
              Try Demo QR Code
            </Button>
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
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 dark:text-orange-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Find a QR Code</h3>
              <p className="text-sm text-muted-foreground">Look for SHELTR-AI QR codes or visit our platform</p>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto hover:opacity-80 transition-opacity" />
              </Link>
              <p className="text-muted-foreground text-sm">
                Hacking homelessness through technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/solutions" className="hover:text-foreground">Solutions</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/scan-give" className="hover:text-foreground">Scan & Give</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground">Discord</a></li>
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SHELTR-AI. Built with ❤️ in memory of Gunnar Blaze.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 