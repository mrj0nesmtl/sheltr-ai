import Link from 'next/link';
import { ArrowLeft, Users, QrCode, DollarSign, Home, Heart, Shield, Smartphone, CheckCircle, CreditCard, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">For Participants</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Your Path to Stability Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            SHELTR provides you with direct access to resources, financial support, and a pathway to permanent housing. 
            Your journey matters, your dignity is respected, and your privacy is protected every step of the way.
          </p>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-16 bg-green-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Direct Support When You Need It</h2>
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
                  15% of donations automatically go toward long-term housing solutions, 
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

      {/* How It Works */}
      <section className="py-20">
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
              How SHELTR-S tokens help you save money and achieve stable housing through our systematic approach.
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
                  Receive SHELTR-S stable tokens directly to your digital wallet for immediate needs like food, 
                  transportation, and emergency shelter.
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
                <CardTitle className="text-center">Housing Fund Building</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  15% of every donation automatically builds a dedicated housing fund that provides security deposits, 
                  first month&apos;s rent, and move-in assistance.
                </p>
                <div className="bg-blue-600/10 rounded-lg p-3">
                  <div className="text-lg font-semibold text-blue-600">$7.50 housing fund</div>
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
                  Once housed, continue receiving support for job training, healthcare access, and financial literacy 
                  to maintain long-term stability.
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Services Near Me
                </Button>
                <Button variant="outline" size="lg" className="border-green-500/20 text-green-600 dark:text-green-400">
                  <Heart className="h-4 w-4 mr-2" />
                  Get Support Now
                </Button>
              </div>
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
            <p>&copy; 2025 SHELTR. Built with ❤️ in memory of Gunnar Blaze.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 