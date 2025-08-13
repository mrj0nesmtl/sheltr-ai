import Link from 'next/link';
import { ArrowLeft, Building2, Users, BarChart3, Shield, UserCheck, Clock, DollarSign, CheckCircle, Smartphone, FileText, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';

export default function OrganizationsPage() {
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
          <span className="text-blue-600 dark:text-blue-400">Shelters & NGOs</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Case Study</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Beyond Traditional HMIS: The Next Generation Shelter Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            While WellSky and PlanStreet focus on compliance, SHELTR revolutionizes shelter operations with AI-powered analytics, 
            blockchain donations, and participant empowerment. Implement in 1-2 weeks vs. 2-6 months with traditional systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Building2 className="h-4 w-4 mr-2" />
                Get Started Today
              </Button>
            </Link>
            <Link href="/solutions/organizations/case-study">
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                View Case Study
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Organizations Should Trust SHELTR</h2>
            <p className="text-xl text-muted-foreground">Open source, purpose-built for the unique challenges of emergency homelessness services.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-blue-600 dark:text-blue-400">Save Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Automated reporting, digital intake, and streamlined case management 
                  free up staff time for direct participant support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-blue-600 dark:text-blue-400">Increase Participant Funding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Comprehensive impact data and automated compliance reporting 
                  strengthen grant applications and funder relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-blue-600 dark:text-blue-400">Improve Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Data-driven insights help optimize programs and track participant 
                  progress from intake to permanent housing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Operational Platform</h2>
            <p className="text-xl text-muted-foreground">Everything you need to run efficient, impactful programs</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Participant Management */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Participant Management</CardTitle>
                <CardDescription>Comprehensive case management from intake to housing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Digital intake and assessment forms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Automated QR code generation for donations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Progress tracking and milestone management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Document storage and verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Communication logs and notes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics & Reporting */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Analytics & Reporting</CardTitle>
                <CardDescription>Real-time insights and automated compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Real-time donation tracking and allocation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Outcome measurement and success metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Automated funder reports (HUD, HMIS compatible)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Performance dashboards and KPI tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Custom report builder for stakeholders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Tools */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Staff Tools</CardTitle>
                <CardDescription>Mobile-first tools for frontline workers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Mobile app for field case management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>QR code scanning for quick check-ins</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Real-time notifications and alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Offline capability for field work</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Secure messaging between staff</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Security */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Compliance & Security</CardTitle>
                <CardDescription>Enterprise-grade security and regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>HIPAA-compliant data handling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>SOC 2 Type II certification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Role-based access controls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Audit trails and data backup</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Multi-factor authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How SHELTR will Lead the Market</h2>
            <p className="text-xl text-muted-foreground">
              While traditional HMIS (Homeless Management Information System) solutions focus on compliance, SHELTR revolutionizes shelter operations with modern technology and participant empowerment.
            </p>
          </div>

          {/* Competitive Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">SHELTR-AI</th>
                    <th className="px-6 py-4 text-center font-semibold">WellSky HMIS</th>
                    <th className="px-6 py-4 text-center font-semibold">PlanStreet</th>
                    <th className="px-6 py-4 text-center font-semibold">Traditional HMIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 font-medium">AI-Powered Analytics</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Blockchain Donations</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Participant QR Codes</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-yellow-500">Barcode Only</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Mobile-First Design</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-yellow-500">Limited</td>
                    <td className="px-6 py-4 text-center text-yellow-500">Responsive</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Real-time Fund Tracking</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-yellow-500">Basic</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">HUD Compliance</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Implementation Time</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">1-2 weeks</td>
                    <td className="px-6 py-4 text-center text-yellow-600">2-6 months</td>
                    <td className="px-6 py-4 text-center text-yellow-600">1-3 months</td>
                    <td className="px-6 py-4 text-center text-red-600">3-12 months</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Pricing Model</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">Free / Community Supported</td>
                    <td className="px-6 py-4 text-center text-red-600">Enterprise only</td>
                    <td className="px-6 py-4 text-center text-yellow-600">Tiered</td>
                    <td className="px-6 py-4 text-center text-red-600">High setup costs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="text-center">
                <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-purple-600">Modern Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Built with cutting-edge AI, blockchain, and mobile-first design principles.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />AI-powered predictive analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Blockchain donation transparency</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Native mobile applications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-blue-600">Participant-Centric Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Unlike traditional HMIS systems, SHELTR empowers participants with direct access and control.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Personal QR donation codes</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Digital wallet access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Real-time progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-600">Rapid Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Start seeing results in weeks, not months, with our streamlined onboarding process.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />1-2 week implementation</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Data migration included</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />24/7 launch support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-20 bg-blue-500/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Quick Implementation, Immediate Results</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Our experienced team works with you to ensure a smooth transition and rapid adoption.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Setup & Training</h3>
              <p className="text-sm text-muted-foreground">Complete onboarding in 1-2 weeks with dedicated support</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Data Migration</h3>
              <p className="text-sm text-muted-foreground">Seamless import of existing participant records</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Go Live</h3>
              <p className="text-sm text-muted-foreground">Start seeing results immediately with 24/7 support</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Building2 className="h-4 w-4 mr-2" />
                Get Started Today
              </Button>
            </Link>
            <Link href="/solutions/organizations/case-study">
              <Button variant="outline" size="lg" className="border-blue-500/20 text-blue-600 dark:text-blue-400">
                <FileText className="h-4 w-4 mr-2" />
                Download Case Study
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 