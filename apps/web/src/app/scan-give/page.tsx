import Link from 'next/link';
import { Home, QrCode, Heart, Shield, Smartphone, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ScanGivePage() {
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
              <Link href="/scan-give" className="text-foreground hover:text-primary transition-colors">Scan & Give</Link>
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

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <Badge variant="secondary" className="mb-4">Instant Impact</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Scan & Give in Seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Revolutionary QR-code based donations that put money directly into the hands 
            of those who need it most. 80% goes directly to participants, 15% to housing, 5% to operations.
          </p>
          <Button size="lg" className="mr-4">
            <QrCode className="h-4 w-4 mr-2" />
            Try Demo QR Code
          </Button>
          <Button variant="outline" size="lg">
            <Smartphone className="h-4 w-4 mr-2" />
            Download App
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to make a direct impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Scan QR Code</CardTitle>
                <CardDescription>
                  Use your phone camera to scan a participant&apos;s unique QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Choose Amount</CardTitle>
                <CardDescription>
                  Select your donation amount with transparent breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-primary/20 rounded-lg p-3">
                    <div className="text-sm font-medium">$10 Donation</div>
                    <div className="text-xs text-muted-foreground">$8.00 Direct • $1.50 Housing • $0.50 Operations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Instant Transfer</CardTitle>
                <CardDescription>
                  Secure blockchain transaction delivers funds immediately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Verified Transfer</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Blockchain Recorded</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Instant Notification</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SmartFund Breakdown */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Distribution</h2>
            <p className="text-xl text-muted-foreground">
              Every donation is automatically split to maximize impact
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div>
                    <div className="font-semibold text-green-700 dark:text-green-400">Direct Support</div>
                    <div className="text-sm text-muted-foreground">Immediate participant assistance</div>
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">80%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-400">Housing Fund</div>
                    <div className="text-sm text-muted-foreground">Long-term housing solutions</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">15%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <div>
                    <div className="font-semibold text-gray-700 dark:text-gray-400">Operations</div>
                    <div className="text-sm text-muted-foreground">Platform maintenance & security</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">5%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of donors making direct, transparent contributions to end homelessness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <QrCode className="h-4 w-4 mr-2" />
              Find QR Codes Near Me
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Become a Partner Shelter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 