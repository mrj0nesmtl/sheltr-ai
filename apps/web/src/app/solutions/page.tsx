'use client';

import Link from 'next/link';
import { Home, Building2, Users, Heart, DollarSign, Shield, QrCode, Handshake, MapPin, UserCheck, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/solutions-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Better-to-Solve</Badge>
          <h1 className="text-5xl font-bold mb-6 text-white">
            One Platform, <span className="text-blue-400">Every</span> Stakeholder
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            A unified open-source platform that ensures transparency, dignity, and maximum impact.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How SHELTR Works</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-6">
                SHELTR operates as a unified ecosystem where every stakeholder contributes and benefits from a revolutionary approach to addressing the unhoused. SHELTR builds upon traditional HMIS systems by unleashing intelligent systems into the status quo.
              </p>
               <div className="bg-muted/30 rounded-lg p-6 max-w-4xl mx-auto">
                 <p className="text-base text-muted-foreground">
                   Every donation is strategically distributed: <strong>80% directly empowers participants</strong> for immediate needs, <strong>15% funds housing solutions</strong> through the <Link href="/pods" className="text-blue-600 hover:text-blue-800 font-semibold underline">PODS</Link> deployment, and <strong>5% sustains platform operations</strong>. This creates a self-reinforcing cycle where immediate relief generates lasting systemic change, transforming charity into measurable investment with compound returns for the entire community.
                 </p>
               </div>
            </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Participants (First) */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Participants</CardTitle>
                <CardDescription className="text-lg">
                  Empowered through direct QR code support, PODS and MOBI's are provided as and pathway to safe, mobile mini-housing.
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
                      <p className="text-sm text-muted-foreground">80% of donations are immediately depositited to a Participant's virtual card. These funds are available to purchase food, clothing, transportation, and essential services.</p>
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
                <div>
                  <Link href="/solutions/participants">
                    <Button className="w-full border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Donors (Second) */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl">Donors</CardTitle>
                <CardDescription className="text-lg">
                  Give with attitude. Demand a return. SmartFund™ with transparent, measurable returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Blockchain Transparency</h4>
                      <p className="text-sm text-muted-foreground">Your donation is contolled by an immutable smart contract, with its mission publicly verifiable on the blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Impact Measurement</h4>
                      <p className="text-sm text-muted-foreground">Updates on how your donation helped, and the impact it had.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <QrCode className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Giving with Purpose</h4>
                      <p className="text-sm text-muted-foreground">Instant donations via QR code scanning. No intermediaries, no delays, no hidden fees.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Link href="/solutions/donors">
                    <Button className="w-full border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Shelters (Third) */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Shelters</CardTitle>
                <CardDescription className="text-lg">
                  Operational efficiency with integrated PODS deployment and SmartFund™ resource optimization
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
                <div>
                  <Link href="/solutions/organizations">
                    <Button className="w-full border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline" size="sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Government (Fourth) */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Government</CardTitle>
                <CardDescription className="text-lg">
                  Evidence-based policy development with measurable ROI through SmartFund™ impact metrics
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
                <div>
                  <Link href="/solutions/government">
                    <Button className="w-full border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-110" 
          style={{backgroundImage: 'url(/images/sheltr_units/pods-1.jpeg)'}}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">Why Trust SHELTR?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 space-y-4 hover:bg-black/50 transition-all duration-300">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-red-500/20">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-semibold text-white">Human-Centered</h3>
              <p className="text-gray-200">Built with dignity and respect for all participants in the system</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 space-y-4 hover:bg-black/50 transition-all duration-300">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-semibold text-white">100% Transparent</h3>
              <p className="text-gray-200">Blockchain tech ensures every transaction is visible and verified</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 space-y-4 hover:bg-black/50 transition-all duration-300">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-500/20">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full opacity-20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-semibold text-white">Data-Driven</h3>
              <p className="text-gray-200">Real-time analytics help optimize resource allocation and impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Unhoused in the Age of Abundance</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We need to lean in.
          </p>
          
          <div className="flex justify-center">
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                <BookOpen className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <PublicChatbot />
    </div>
  );
} 