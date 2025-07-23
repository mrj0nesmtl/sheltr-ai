import Link from 'next/link';
import { ArrowLeft, MapPin, BarChart3, DollarSign, Handshake, Users, Globe, TrendingUp, FileText, CheckCircle, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function GovernmentPage() {
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
          <span className="text-purple-600 dark:text-purple-400">Government Agencies</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">For Government</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Data-Driven Policy Making, Transparent Budget Allocation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            SHELTR-AI provides government agencies with comprehensive regional homelessness data, 
            enabling evidence-based policy decisions and transparent tracking of public fund impact 
            across multiple departments and jurisdictions.
          </p>
        </div>
      </section>

      {/* Key Value Props */}
      <section className="py-16 bg-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Homelessness Intelligence</h2>
            <p className="text-xl text-muted-foreground">Real-time insights for informed policy and budget decisions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-purple-600 dark:text-purple-400">Regional Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Comprehensive dashboard showing homelessness trends, demographics, 
                  and service gaps across your jurisdiction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-purple-600 dark:text-purple-400">Budget Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Track public fund allocation and ROI with blockchain-verified 
                  spending records and outcome measurements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <Handshake className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-purple-600 dark:text-purple-400">Multi-Agency Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Unified platform enabling seamless coordination between health, 
                  housing, social services, and law enforcement departments.
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
            <h2 className="text-3xl font-bold mb-4">Government Intelligence Platform</h2>
            <p className="text-xl text-muted-foreground">Comprehensive tools for policy makers and administrators</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Policy Analytics */}
            <Card className="border-2 border-purple-500/20">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-2xl">Policy Impact Analytics</CardTitle>
                <CardDescription>Measure effectiveness of homelessness initiatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Real-time population flow and trend analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Geographic hotspot identification and mapping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Demographic breakdown and vulnerability assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Service utilization and gap analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Predictive modeling for resource planning</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Management */}
            <Card className="border-2 border-purple-500/20">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-2xl">Public Fund Management</CardTitle>
                <CardDescription>Transparent allocation and impact tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Blockchain-verified fund distribution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Real-time ROI measurement and reporting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Cost-per-outcome analysis by program</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Public spending transparency dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Audit-ready financial documentation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inter-Agency Coordination */}
            <Card className="border-2 border-purple-500/20">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-2xl">Inter-Agency Coordination</CardTitle>
                <CardDescription>Unified approach across departments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Shared case management across departments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Real-time communication and alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Coordinated resource allocation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Joint planning and strategy tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Performance benchmarking across agencies</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Reporting */}
            <Card className="border-2 border-purple-500/20">
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-2xl">Compliance & Reporting</CardTitle>
                <CardDescription>Automated federal and state reporting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>HUD Continuum of Care reporting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>HMIS data integration and validation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Annual performance measurement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Grant compliance monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Legislative reporting requirements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-purple-500/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Proven Return on Investment</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Government partners report significant improvements in efficiency and outcomes.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">35%</div>
                <p className="text-sm text-muted-foreground">Reduction in administrative costs</p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50%</div>
                <p className="text-sm text-muted-foreground">Faster policy impact assessment</p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">25%</div>
                <p className="text-sm text-muted-foreground">Improved inter-agency coordination</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <MapPin className="h-4 w-4 mr-2" />
              Schedule Government Demo
            </Button>
            <Button variant="outline" size="lg" className="border-purple-500/20 text-purple-600 dark:text-purple-400">
              <FileText className="h-4 w-4 mr-2" />
              Download Policy Brief
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