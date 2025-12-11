'use client';

import Link from 'next/link';
import { ArrowRight, QrCode, Home, Truck, Drone, Users, TrendingUp, CheckCircle, Zap, Shield, Wallet, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { useQRCodeTracking } from '@/hooks/useQRCodeTracking';
import { StandardHero } from '@/components/StandardHero';

export default function EcosystemPage() {
  const { heroImage } = useHeroImage('/ecosystem', '/backgrounds/hero-bg.jpg');
  
  // Track QR code scans
  useQRCodeTracking();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavigation />

      {/* Hero Section */}
      <StandardHero
        imageUrl={heroImage.url}
        mediaType={heroImage.mediaType}
        videoType={heroImage.type}
        badgeText="THE COMPLETE ECOSYSTEM"
        badgeVariant="secondary"
        badgeClassName="bg-white/20 text-white border-white/30 backdrop-blur-sm"
        title={
          <>
            From QR Code to <span className="text-blue-400">Housing</span>
          </>
        }
        subtitle="Follow the journey: One scan. One donation. One life changed."
      />


      {/* Philosophy - Million Dollar Murray */}
      <section className="py-16 bg-gradient-to-br from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6" variant="outline">INSPIRED BY MALCOLM GLADWELL</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              It's Better to <span className="text-blue-400">Solve</span> than Manage
            </h2>
            <div className="bg-card rounded-2xl p-8 md:p-12 border-2 border-primary/10 shadow-lg">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                In his groundbreaking essay <em>&quot;Million Dollar Murray&quot;</em>, Malcolm Gladwell revealed a profound truth: 
                <strong className="text-foreground"> it costs society more to manage chronic homelessness than to solve it.</strong>
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                SHELTR was built on this principle. We don&apos;t just manage the problem—we create <strong className="text-foreground">sustainable 
                pathways out of homelessness</strong> through technology, dignity, and purpose. Every component of our ecosystem 
                works together to transform lives, not just track them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Complete Journey - Visual Flow */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">THE COMPLETE JOURNEY</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Follow a Donation from <span className="text-green-400">Scan</span> to <span className="text-blue-400">Shelter</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every piece of our ecosystem is designed to work together seamlessly, creating a transparent 
              pathway from compassion to housing.
            </p>
          </div>

          {/* Journey Steps */}
          <div className="space-y-12">
            {/* Step 1: The Scan */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="border-2 border-green-400/50 hover:border-green-400 transition-all hover:shadow-xl hover:shadow-green-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-green-500/10">
                        <QrCode className="h-12 w-12 text-green-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-green-500/20 text-green-700 dark:text-green-300">STEP 1</Badge>
                        <CardTitle className="text-3xl">The Scan</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">Where compassion meets technology</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      A donor encounters a participant and scans their unique QR code. In seconds, a secure 
                      connection is established—no cash, no cards, just instant digital compassion.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Participant receives unique, secure QR code</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Donor scans with any smartphone camera</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Blockchain transaction initiated instantly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>100% transparent, trackable, secure</span>
                      </li>
                    </ul>
                    <Link href="/scan-give">
                      <Button variant="outline" className="w-full border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                        Explore Scan & Give
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">The Power of the QR Code</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This isn&apos;t just a donation—it&apos;s the beginning of a journey. The QR code is the participant&apos;s 
                    digital identity, their connection to resources, and their pathway to stability.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Average scan-to-donation time: <strong>8 seconds</strong></span>
                  </div>
                </div>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:flex justify-center my-8">
                <ArrowRight className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </div>

            {/* Step 2: SmartFund™ Distribution */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Automated Intelligence</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Smart contracts automatically split every donation according to our proven 80-15-5 model. 
                    No overhead, no delays—just instant, intelligent distribution.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Blockchain-verified • Immutable • Transparent</span>
                  </div>
                </div>

                <Card className="border-2 border-blue-400/50 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/20 order-1 md:order-2">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-blue-500/10">
                        <Zap className="h-12 w-12 text-blue-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-blue-500/20 text-blue-700 dark:text-blue-300">STEP 2</Badge>
                        <CardTitle className="text-3xl">SmartFund™ Split</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">Intelligent, automated distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      The moment a donation is received, our smart contracts execute a three-way split designed 
                      for maximum impact—immediate needs, long-term housing, and shelter support.
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">80%</span>
                        </div>
                        <div>
                          <p className="font-semibold">Immediate Access</p>
                          <p className="text-sm text-muted-foreground">Virtual debit card for essential needs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">15%</span>
                        </div>
                        <div>
                          <p className="font-semibold">Housing Fund</p>
                          <p className="text-sm text-muted-foreground">Staked & compounding towards POD</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">5%</span>
                        </div>
                        <div>
                          <p className="font-semibold">Shelter Operations</p>
                          <p className="text-sm text-muted-foreground">Supports infrastructure & services</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/docs/tokenomics">
                        <Button className="w-full" variant="outline">
                          Learn More About Tokenomics
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:flex justify-center my-8">
                <ArrowRight className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </div>

            {/* Step 3: Participant Engagement */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="border-2 border-purple-400/50 hover:border-purple-400 transition-all hover:shadow-xl hover:shadow-purple-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-purple-500/10">
                        <Wallet className="h-12 w-12 text-purple-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-purple-500/20 text-purple-700 dark:text-purple-300">STEP 3</Badge>
                        <CardTitle className="text-3xl">Immediate Impact</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">Dignity through direct access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The 80% instantly loads onto the participant&apos;s virtual debit card. They can buy food, 
                      clothing, medicine—whatever they need, with dignity and autonomy.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>Virtual Mastercard accepted everywhere</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>Real-time transaction tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>AI case management monitors progress</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>Shelter coordination & support services</span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Link href="/impact">
                        <Button className="w-full" variant="outline">
                          See Our Impact
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Building Towards Housing</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    While the participant uses their 80% for immediate needs, the 15% housing fund is working 
                    behind the scenes—staking, compounding, growing towards their POD deployment goal.
                  </p>
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                      <span className="font-semibold">Housing Fund Growth</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Through institutional staking (Coinbase, Lido), the 15% allocation compounds at ~4-6% APY, 
                      accelerating the path to permanent housing.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:flex justify-center my-8">
                <ArrowRight className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </div>

            {/* Step 4: POD Deployment */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">Flat-Pack Housing Solution</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    When the housing fund reaches the threshold, a Model A POD is deployed. These aren&apos;t just shelters—they&apos;re 
                    dignified, secure, climate-controlled micro-homes with EcoFlow power, connectivity, and privacy. Ships flat, assembles in 2-4 hours.
                  </p>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">28 sq ft</p>
                        <p className="text-xs text-muted-foreground">Living space</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">2-4 hrs</p>
                        <p className="text-xs text-muted-foreground">Assembly time</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="border-2 border-orange-400/50 hover:border-orange-400 transition-all hover:shadow-xl hover:shadow-orange-500/20 order-1 md:order-2">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-orange-500/10">
                        <Home className="h-12 w-12 text-orange-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-orange-500/20 text-orange-700 dark:text-orange-300">STEP 4</Badge>
                        <CardTitle className="text-3xl">POD Deployment</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">From street to shelter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our flat-pack Model A PODs provide immediate, dignified housing. Each unit ships on 2-3 pallets 
                      and assembles in hours with everything needed for safety, comfort, and stability.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>EcoFlow DELTA 2 power (1kWh + 400W solar)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>Climate-controlled with heating/cooling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>Smart lock with QR code access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>Bed, desk, storage, sink included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>2-4 hour assembly time</span>
                      </li>
                    </ul>
                    <Link href="/pods">
                      <Button variant="outline" className="w-full border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                        Explore POD Solutions
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:flex justify-center my-8">
                <ArrowRight className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </div>

            {/* Step 5: Basecamp & Drone Support */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="border-2 border-cyan-400/50 hover:border-cyan-400 transition-all hover:shadow-xl hover:shadow-cyan-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-cyan-500/10">
                        <Home className="h-12 w-12 text-cyan-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">STEP 5</Badge>
                        <CardTitle className="text-3xl">Basecamp Hub</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">Community support center</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Basecamp is a larger POD facility staffed by community volunteers 7 days a week. It serves as the 
                      central hub for growing POD communities, providing essential services and coordination.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>24/7 staffed community support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Case management & resource coordination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Meal services & emergency supplies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Community gathering & support space</span>
                      </li>
                    </ul>
                    <Link href="/basecamp">
                      <Button variant="outline" className="w-full border-cyan-400 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950">
                        Explore Basecamp
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-400/50 hover:border-indigo-400 transition-all hover:shadow-xl hover:shadow-indigo-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-indigo-500/10">
                        <Drone className="h-12 w-12 text-indigo-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">STEP 5</Badge>
                        <CardTitle className="text-3xl">Drone Delivery</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">Rapid emergency response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      For urgent needs or hard-to-reach locations, our drone network delivers critical supplies 
                      within minutes—medicine, food, water, blankets, and emergency items.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span>5-15 minute emergency response</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span>GPS-tracked delivery to exact location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span>Medical supplies & emergency kits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span>Weather-resistant payload capacity</span>
                      </li>
                    </ul>
                    <Link href="/drones">
                      <Button variant="outline" className="w-full border-indigo-400 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                        Explore Drone Network
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:flex justify-center my-8">
                <ArrowRight className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </div>

            {/* Step 6: Reintegration */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">The Ultimate Goal</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This is where the ecosystem comes full circle. With stable housing, ongoing support, and 
                    coordinated services, participants rebuild their lives and reintegrate into society.
                  </p>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">Success metrics we track:</strong>
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Employment secured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Permanent housing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Healthcare access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Social reconnection</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="border-2 border-emerald-400/50 hover:border-emerald-400 transition-all hover:shadow-xl hover:shadow-emerald-500/20 order-1 md:order-2">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-full bg-emerald-500/10">
                        <Users className="h-12 w-12 text-emerald-500" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">STEP 6</Badge>
                        <CardTitle className="text-3xl">Reintegration</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">Back to stability & purpose</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      With a stable foundation, participants work with case managers, access job training, 
                      secure employment, and transition to permanent housing—breaking the cycle for good.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>AI-powered case management & goal tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Job training & employment placement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Healthcare coordination & mental health support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Permanent housing transition assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Community reintegration & social services</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Technology Behind It All */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">POWERED BY INNOVATION</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The Technology Behind the <span className="text-blue-400">Ecosystem</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every component is connected through cutting-edge technology—blockchain, AI, IoT, and cloud infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-blue-400/50 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-blue-500/10 w-fit">
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Every transaction secured and verified through Base L2 blockchain, ensuring complete transparency and immutability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-400/50 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-purple-500/10 w-fit">
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>AI Agent Orchestra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Multi-agent AI system coordinates case management, resource allocation, and predictive analytics across the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-400/50 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-green-500/10 w-fit">
                  <Globe className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Cloud Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Built on Google Cloud and Firebase, ensuring 99.9% uptime, real-time data sync, and global scalability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-400/50 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 w-fit">
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Live dashboards track every metric—donations, deployments, outcomes—providing complete visibility to all stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/backgrounds/impact-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-900/70 to-purple-900/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Be Part of the Solution
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 drop-shadow-md leading-relaxed">
            Every scan, every donation, every POD deployed—it all adds up to lives transformed. 
            Join us in proving that it&apos;s better to solve than manage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/scan-give">
              <Button 
                size="lg" 
                className="text-xl px-10 py-6 bg-green-600 hover:bg-green-700 text-white font-bold shadow-2xl"
              >
                <QrCode className="h-6 w-6 mr-2" />
                Start Giving Today
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-black font-bold shadow-2xl"
              >
                Join the Platform
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-300">
            <CheckCircle className="h-4 w-4 inline mr-2" />
            From QR code to housing • Complete transparency • Measurable impact
          </p>
        </div>
      </section>

      <Footer />
      <PublicChatbot />
    </div>
  );
}

