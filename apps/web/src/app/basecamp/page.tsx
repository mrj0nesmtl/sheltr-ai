'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';
import { PublicChatbot } from '@/components/PublicChatbot';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';
import { 
  ArrowLeft,
  Home,
  Users,
  Wrench,
  Heart,
  Wifi,
  Monitor,
  WashingMachine,
  Coffee,
  CheckCircle,
  Package,
  MapPin,
  Clock,
  Shield,
  Smartphone,
  Laptop,
  Truck,
  Phone,
  Calendar,
  Building2,
  Zap
} from 'lucide-react';

export default function BasecampPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/basecamp', '/images/basecamp/basecamp-1.png');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatOpen = () => {
    setIsChatOpen(true);
    // Scroll to chatbot
    setTimeout(() => {
      const chatbot = document.querySelector('[data-chatbot]');
      if (chatbot) {
        chatbot.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PublicNavigation />

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="STEP 5"
        badgeVariant="secondary"
        badgeClassName="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
        title={
          <>
            <span className="text-cyan-400">Basecamp</span>
          </>
        }
        subtitle="Community support center providing essential services, technical assistance, and coordination for POD deployment."
      >
        <div className="mb-6">
          <Link href="/ecosystem">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ecosystem
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => {
              setIsChatOpen(true);
              setTimeout(() => {
                const chatbot = document.querySelector('[data-chatbot]');
                if (chatbot) {
                  chatbot.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
          >
            Ask About Basecamp
          </Button>
        </div>
      </StandardHero>

      {/* Overview Section */}
      <section id="overview" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">COMMUNITY-CENTERED SUPPORT</Badge>
          <h2 className="text-4xl font-bold mb-6">The Heart of POD Communities</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Basecamp transforms isolated POD living into a thriving community. With dedicated staff 
            and coordinated services, participants have access to resources, social connection, and 
            professional support—all within walking distance of their POD.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
              <h3 className="text-xl font-semibold mb-2">24/7 Staffed Support</h3>
              <p className="text-muted-foreground">Community volunteers providing round-the-clock assistance and coordination</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Essential Services</h3>
              <p className="text-muted-foreground">Meals, medical clinic, laundry, and job placement assistance</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
            <CardContent className="p-6 text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Technical Hub</h3>
              <p className="text-muted-foreground">IT support, computer terminals, and platform assistance</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Basecamp Concept */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">THE CONCEPT</Badge>
              <h2 className="text-4xl font-bold mb-6">From Shipping Container to Community Hub</h2>
              <p className="text-lg text-muted-foreground mb-6">
                When SHELTR deploys PODs into a city, the initial shipment arrives in a <strong>Basecamp shipping container</strong>. 
                Rather than removing it, the container remains on-site with proper permissions and legal agreements, 
                transforming into a permanent support hub for the growing POD community.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-6 w-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Initial Deployment</h4>
                    <p className="text-muted-foreground">PODs arrive in Basecamp container, which stays on-site</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Permanent Hub</h4>
                    <p className="text-muted-foreground">Container transforms into community support center</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Growing Community</h4>
                    <p className="text-muted-foreground">PODs set up nearby with centralized support and services</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/basecamp/basecamp-2.png"
                alt="SHELTR Basecamp Container Hub"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Basecamp Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">COMPREHENSIVE SUPPORT</Badge>
            <h2 className="text-4xl font-bold mb-6">Basecamp Services</h2>
            <p className="text-xl text-muted-foreground">
              Everything participants need for stability, dignity, and progress
            </p>
          </div>

          <Tabs defaultValue="essential" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="essential">Essential Services</TabsTrigger>
              <TabsTrigger value="technical">Technical Support</TabsTrigger>
              <TabsTrigger value="social">Social Services</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="essential" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Coffee className="h-8 w-8 text-orange-500" />
                      <CardTitle>Hot Meals Daily</CardTitle>
                    </div>
                    <CardDescription>
                      Nutritious breakfast, lunch, and dinner prepared on-site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        3 meals per day, 7 days a week
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Dietary accommodations available
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Community dining space
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="h-8 w-8 text-red-500" />
                      <CardTitle>Medical Clinic</CardTitle>
                    </div>
                    <CardDescription>
                      Basic healthcare and wellness services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Nurse practitioner on-site
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        First aid and basic medications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Referrals to specialized care
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <WashingMachine className="h-8 w-8 text-blue-500" />
                      <CardTitle>Laundry Facilities</CardTitle>
                    </div>
                    <CardDescription>
                      Free washing machines and dryers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Industrial washers and dryers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Free detergent provided
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Scheduled access times
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="h-8 w-8 text-green-500" />
                      <CardTitle>Job Placement Help</CardTitle>
                    </div>
                    <CardDescription>
                      Employment assistance and career support
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Resume building workshops
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Job search assistance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Interview preparation
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Laptop className="h-8 w-8 text-purple-500" />
                      <CardTitle>Computer Terminals</CardTitle>
                    </div>
                    <CardDescription>
                      Free internet access and computing resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        6 desktop computers with internet
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Printing and scanning services
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Basic software training available
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Wifi className="h-8 w-8 text-cyan-500" />
                      <CardTitle>WiFi & Connectivity</CardTitle>
                    </div>
                    <CardDescription>
                      High-speed internet throughout Basecamp
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Free WiFi for all participants
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Extends to nearby POD area
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Secure network with tech support
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="h-8 w-8 text-blue-500" />
                      <CardTitle>SHELTR Platform Support</CardTitle>
                    </div>
                    <CardDescription>
                      Technical assistance with the SHELTR ecosystem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Help with QR codes and donations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Dashboard training and support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Device troubleshooting
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Wrench className="h-8 w-8 text-orange-500" />
                      <CardTitle>POD Technical Support</CardTitle>
                    </div>
                    <CardDescription>
                      Maintenance and repairs for POD units
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        EcoFlow system troubleshooting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Lock and security assistance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Climate control adjustments
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-8 w-8 text-cyan-500" />
                      <CardTitle>Case Management</CardTitle>
                    </div>
                    <CardDescription>
                      Personalized support and resource coordination
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Dedicated case managers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Goal setting and progress tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Resource referrals and advocacy
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <CardTitle>Community Events</CardTitle>
                    </div>
                    <CardDescription>
                      Social gatherings and support groups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Weekly community meetings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Peer support groups
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Skills workshops and activities
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-8 w-8 text-green-500" />
                      <CardTitle>Safety & Security</CardTitle>
                    </div>
                    <CardDescription>
                      24/7 security and emergency response
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Security staff on-site
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Emergency response protocols
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Conflict resolution support
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Monitor className="h-8 w-8 text-purple-500" />
                      <CardTitle>Life Skills Training</CardTitle>
                    </div>
                    <CardDescription>
                      Educational programs and skill development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Financial literacy workshops
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Digital skills training
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Health and wellness education
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="h-8 w-8 text-orange-500" />
                      <CardTitle>POD Deployment</CardTitle>
                    </div>
                    <CardDescription>
                      Coordination of POD setup and placement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Site assessment and preparation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        POD assembly coordination
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Participant assignment and onboarding
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-8 w-8 text-red-500" />
                      <CardTitle>Volunteer Coordination</CardTitle>
                    </div>
                    <CardDescription>
                      Managing community volunteer efforts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Volunteer scheduling and shifts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Training and orientation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Community partnership liaison
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-8 w-8 text-blue-500" />
                      <CardTitle>Operating Hours</CardTitle>
                    </div>
                    <CardDescription>
                      24/7 access with staffed support
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        24/7 security and emergency support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Daytime services: 7am - 10pm
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Overnight staff: 10pm - 7am
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="h-8 w-8 text-yellow-500" />
                      <CardTitle>Emergency Response</CardTitle>
                    </div>
                    <CardDescription>
                      Rapid response to participant needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        24-48 hour POD deployment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Medical emergency protocols
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Crisis intervention support
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">TRANSFORMING COMMUNITIES</Badge>
            <h2 className="text-4xl font-bold mb-6">More Than Just a Building</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Basecamp creates community, dignity, and pathways to stability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-cyan-500/30 bg-background/50 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-cyan-500 mb-2">7 days</div>
                <div className="text-muted-foreground">Per week staffed community support</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/30 bg-background/50 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-blue-500 mb-2">2-4 hours</div>
                <div className="text-muted-foreground">Emergency POD deployment time</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/30 bg-background/50 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-purple-500 mb-2">24/7</div>
                <div className="text-muted-foreground">Security and emergency response</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Learn More?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover how Basecamp fits into the complete SHELTR ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ecosystem">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                <Home className="h-5 w-5 mr-2" />
                View Full Ecosystem
              </Button>
            </Link>
            <Link href="/pods">
              <Button size="lg" variant="outline">
                <Package className="h-5 w-5 mr-2" />
                Explore POD Housing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <PublicChatbot />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
