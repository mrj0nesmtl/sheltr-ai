import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  RotateCcw, 
  Zap, 
  User, 
  Brain, 
  Shield, 
  Smartphone, 
  BarChart3,
  CheckCircle,
  Rocket,
  Users,
  Building2,
  ArrowLeft,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { PublicChatbot } from '@/components/PublicChatbot';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'Understanding HMIS: SHELTR\'s Revolutionary Approach | SHELTR',
  description: 'Learn about Homeless Management Information Systems and how SHELTR is revolutionizing homeless services through AI, blockchain, and human-centered technology.',
  keywords: 'HMIS, homeless management information system, HUD compliance, homeless services technology, case management software, continuum of care',
};

const HomelessnessTypeCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  solution, 
  percentage 
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description: string;
  solution: string;
  percentage?: string;
}) => (
  <Card className="h-full border-2">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-foreground" />
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            {percentage && (
              <Badge variant="outline" className="text-xs">
                {percentage}
              </Badge>
            )}
          </CardTitle>
          {subtitle && (
            <CardDescription className="text-sm text-muted-foreground">
              {subtitle}
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">{description}</p>
      <div className="bg-muted p-3 rounded-lg border-l-4 border-foreground">
        <p className="text-sm font-medium text-foreground">
          <span className="font-semibold">SHELTR Solution:</span> {solution}
        </p>
      </div>
    </CardContent>
  </Card>
);

const ComparisonRow = ({ 
  feature, 
  traditional, 
  sheltr 
}: {
  feature: string;
  traditional: string;
  sheltr: string;
}) => (
  <tr className="border-b">
    <td className="py-3 px-4 font-medium text-foreground">{feature}</td>
    <td className="py-3 px-4 text-muted-foreground">{traditional}</td>
    <td className="py-3 px-4 text-foreground font-medium">{sheltr}</td>
  </tr>
);

export default function HMISGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="SHELTR" className="h-6 w-auto hover:opacity-80 transition-opacity" />
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
          <Link href="/solutions/organizations" className="hover:text-primary">
            Organizations
          </Link>
          <span>/</span>
          <span className="text-foreground">HMIS Guide</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="bg-white text-black mb-4 border border-white">
            HMIS Education
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Understanding HMIS: Why SHELTR is the Future of Homeless Services Technology
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            A comprehensive guide to Homeless Management Information Systems and how SHELTR revolutionizes the approach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Reality of Homelessness */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Reality of Homelessness: Beyond the Statistics
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Homelessness isn't a single problem—it's a complex web of interconnected challenges that require nuanced, 
              technology-driven solutions. At SHELTR, we believe that <strong>better data leads to better outcomes</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
            <HomelessnessTypeCard
              icon={Home}
              title="Chronic Homelessness"
              percentage="24% of population"
              description="Continuously homeless for 1+ years or 4+ episodes in 3 years. Typically older individuals with complex medical/mental health needs."
              solution="AI-powered predictive analytics identify intervention opportunities before crises escalate"
            />
            <HomelessnessTypeCard
              icon={RotateCcw}
              title="Episodic Homelessness"
              description="Three or more periods of homelessness in the previous year. Often younger individuals struggling with substance abuse."
              solution="Pattern recognition algorithms help break the cycle through targeted support"
            />
            <HomelessnessTypeCard
              icon={Zap}
              title="Transitional Homelessness"
              subtitle="Most Common"
              description="Caused by catastrophic events or major life changes. Frequently affects younger populations seeking temporary shelter."
              solution="Rapid response tools and streamlined intake reduce time to housing"
            />
            <HomelessnessTypeCard
              icon={User}
              title="Hidden Homelessness"
              subtitle="Hardest to Track"
              description="Individuals without secure housing, staying temporarily with others. Often unreported to official systems."
              solution="Community outreach tools and anonymous reporting mechanisms capture hidden populations"
            />
          </div>
        </div>
      </section>

      {/* What is HMIS */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What is HMIS? (And Why It's Not Enough Anymore)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Traditional HMIS was built for compliance, not innovation. SHELTR transforms essential compliance functions 
              into tools that empower both providers and participants.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Traditional HMIS vs. SHELTR-AI Platform</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900">Feature</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-600">Traditional HMIS</th>
                    <th className="py-3 px-4 text-left font-semibold text-blue-600">SHELTR-AI Platform</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow
                    feature="Data Approach"
                    traditional="Static data collection"
                    sheltr="Dynamic, AI-powered insights"
                  />
                  <ComparisonRow
                    feature="User Focus"
                    traditional="Provider-focused"
                    sheltr="Participant-empowered"
                  />
                  <ComparisonRow
                    feature="Primary Goal"
                    traditional="Compliance-driven"
                    sheltr="Outcome-oriented"
                  />
                  <ComparisonRow
                    feature="Implementation Time"
                    traditional="Months to implement"
                    sheltr="Weeks to deploy"
                  />
                  <ComparisonRow
                    feature="Cost Model"
                    traditional="High setup costs"
                    sheltr="Community-supported model"
                  />
                  <ComparisonRow
                    feature="Technology Stack"
                    traditional="Legacy systems"
                    sheltr="AI, Blockchain, Mobile-first"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Revolution */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Technology Revolution in Homeless Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SHELTR doesn't just track homelessness—we help prevent it through predictive intelligence, 
              blockchain transparency, and participant empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Predictive Intelligence</CardTitle>
                <CardDescription>Beyond Data Collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Risk Assessment: ML identifies high-risk individuals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Resource Optimization: Predictive analytics guide allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Outcome Tracking: Real-time stability measurement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Blockchain Transparency</CardTitle>
                <CardDescription>Trust Through Technology</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>80% Direct Impact:</strong> Automated smart contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>15% Housing Fund:</strong> Sustainable investments tracked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>5% Operations:</strong> Minimal overhead with full accountability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Participant Empowerment</CardTitle>
                <CardDescription>Technology with Dignity</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Personal QR Codes: Direct donation capability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Digital Wallets: Participants control resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Progress Tracking: Real-time journey visibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HUD Partnership */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The HUD Partnership: Compliance Made Simple
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We maintain full compliance with HUD mandates while adding transformative capabilities that go far beyond basic requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Understanding HUD's Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The Department of Housing and Urban Development, established in 1965 as part of President Johnson's "Great Society," works to:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Address America's housing needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Develop and improve communities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enforce fair housing laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Support homeownership for lower/moderate-income families</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Rocket className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>SHELTR Meets HUD Requirements (And Exceeds Them)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Required HUD Data Elements ✅</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Demographics, veteran status, family composition</li>
                      <li>• Project enrollment and exit data</li>
                      <li>• Service utilization tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">SHELTR Enhancements 🚀</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Real-time outcome measurement</li>
                      <li>• Predictive risk modeling</li>
                      <li>• Automated grant reporting</li>
                      <li>• Impact visualization dashboards</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CoC Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Role of Continuums of Care (CoCs)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SHELTR supercharges CoC effectiveness by transforming manual processes into automated intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Traditional CoC Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Manual data collection and reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Siloed information systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Limited real-time visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Resource allocation guesswork</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">SHELTR Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Automated Reporting:</strong> Real-time dashboards eliminate manual reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Integrated Systems:</strong> Single platform connects all providers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Live Analytics:</strong> Instant visibility into trends and gaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Smart Allocation:</strong> AI-driven resource optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Organizations Choose SHELTR */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Organizations Choose SHELTR
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beyond traditional case management software—SHELTR reimagines what's possible for every stakeholder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>For Staff: Tools That Actually Help</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Mobile-first design for field work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Offline capability for remote areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>AI-assisted case planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automated documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <User className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>For Participants: Technology with Dignity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Personal donation codes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Direct access to their own data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Progress tracking and goal setting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Community connection tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>For Organizations: Results That Matter</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>1-2 week implementation (vs. 2-6 months)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automated compliance reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time impact measurement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Community-supported pricing model</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            The Future of Homeless Services is Here
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">From Managing Homelessness to Solving It</h3>
              <p className="text-blue-100">
                Traditional HMIS systems help you manage the problem. SHELTR helps you solve it.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-blue-100">
                A world where homelessness is rare, brief, and non-recurring—powered by technology that treats every person with dignity.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-800 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Join the Revolution?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold mb-2">For Shelter Directors</p>
                <p className="text-blue-200">Transform operations in weeks, not months</p>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-2">For CoC Coordinators</p>
                <p className="text-blue-200">Unified data and AI insights</p>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-2">For Case Managers</p>
                <p className="text-blue-200">Tools designed by frontline workers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-2">For Participants</p>
                <p className="text-blue-200">Technology that maintains dignity</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
              Schedule a Demo
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                Contact Our Team
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-800">
            <p className="text-lg italic text-blue-100">
              "Better to Solve than Manage" isn't just our tagline—it's our commitment to revolutionizing 
              how we approach homelessness through human-centered technology.
            </p>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <PublicChatbot />
    </div>
  );
}
