import Link from 'next/link';
import { Home, Building2, Users, Heart, DollarSign, BarChart3, Shield, QrCode, Handshake, MapPin, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SolutionsPage() {
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
              <Link href="/solutions" className="text-foreground hover:text-primary transition-colors">Solutions</Link>
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

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/solutions-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Platform Solutions</Badge>
          <h1 className="text-5xl font-bold mb-6 text-white">
            One Platform, Every Stakeholder
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            SHELTR-AI serves shelters, government agencies, homeless participants, and donors 
            through a unified platform that ensures transparency, dignity, and maximum impact.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How SHELTR-AI Works for Everyone</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform creates value for every participant in the homelessness ecosystem, 
              from frontline organizations to individual donors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shelters & NGOs */}
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
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
                  <Button className="w-full mt-6">
                    <Building2 className="h-4 w-4 mr-2" />
                    Learn More for Organizations
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Government */}
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
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
                  <Button className="w-full mt-6" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Government Solutions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Participants (Homeless) */}
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
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
                  <Button className="w-full mt-6" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Participant Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Donors */}
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
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
                  <Button className="w-full mt-6">
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
          <h2 className="text-3xl font-bold mb-6">Why Choose SHELTR-AI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">100% Transparent</h3>
              <p className="text-muted-foreground">Blockchain technology ensures every transaction is visible and verified</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Data-Driven</h3>
              <p className="text-muted-foreground">Real-time analytics help optimize resource allocation and impact</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-primary" />
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
          <h2 className="text-3xl font-bold mb-6">Ready to Transform How You Address Homelessness?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join organizations, governments, and individuals already using SHELTR-AI to create lasting change.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Building2 className="h-4 w-4 mr-2" />
              Organization Sign Up
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Individual Donor
            </Button>
            <Button variant="outline" size="lg">
              <MapPin className="h-4 w-4 mr-2" />
              Government Partnership
            </Button>
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