'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Clock, 
  Shield, 
  Package, 
  Heart, 
  Users, 
  CheckCircle, 
  Star,
  Menu,
  X,
  LogIn,
  BarChart3,
  Plane,
  Navigation,
  Battery,
  Radio,
  Eye,
  Target,
  Truck,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useAuth } from '@/contexts/AuthContext';
import { PublicChatbot } from '@/components/PublicChatbot';

export default function DronesPage() {
  const { user, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
              <Link href="/drones" className="text-foreground hover:text-primary transition-colors">Drones</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.displayName || user.email}
                    </span>
                    <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('platform_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'}>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button>
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors py-2">Home</Link>
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors py-2">About</Link>
              <Link href="/solutions" className="block text-muted-foreground hover:text-primary transition-colors py-2">Solutions</Link>
              <Link href="/scan-give" className="block text-muted-foreground hover:text-primary transition-colors py-2">Scan & Give</Link>
              <Link href="/impact" className="block text-muted-foreground hover:text-primary transition-colors py-2">Impact</Link>
              <Link href="/drones" className="block text-foreground hover:text-primary transition-colors py-2">Drones</Link>
              <div className="border-t pt-4 space-y-3">
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground px-3 py-2">
                      Welcome, {user.displayName || user.email}
                    </div>
                    <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('platform_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'} className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" className="block">
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105" 
          style={{backgroundImage: 'url(/images/sheltr_units/drone-delivery.jpeg)'}}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6 border-2 border-blue-400 text-blue-400 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Coming Soon
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Supply <span className="text-blue-400">Drones</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Rapid drone delivery of essential supplies directly to SHELTR PODS using GPS precision. 
            Donors can fund emergency packages that reach participants within minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300" size="lg">
              <Package className="h-4 w-4 mr-2" />
              How It Works
            </Button>
            <Button variant="outline" className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Fund Emergency Supplies
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Drone Delivery Works</h2>
            <p className="text-xl text-muted-foreground">
              From donation to delivery in under 30 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center border-2 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">1. Donate Supplies</CardTitle>
                <CardDescription>
                  Choose emergency supply packages or fund custom requests from participants
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">2. Package Prepared</CardTitle>
                <CardDescription>
                  Our team assembles supplies at the nearest SHELTR distribution center
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">3. Drone Dispatch</CardTitle>
                <CardDescription>
                  Autonomous drone navigates to participant's GPS location using secure coordinates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">4. Precise Delivery</CardTitle>
                <CardDescription>
                  Supplies delivered directly to SHELTR POD with QR code confirmation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Advanced Drone Technology</h2>
            <p className="text-xl text-muted-foreground">
              Military-grade precision meets humanitarian innovation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Technical Specifications</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Navigation className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">GPS Precision</h4>
                    <p className="text-sm text-muted-foreground">±2 meter accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Battery className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Flight Range</h4>
                    <p className="text-sm text-muted-foreground">25km radius</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Payload</h4>
                    <p className="text-sm text-muted-foreground">Up to 5kg capacity</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Delivery Time</h4>
                    <p className="text-sm text-muted-foreground">15-30 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Weather Resistant</h4>
                    <p className="text-sm text-muted-foreground">All-weather operation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Eye className="h-5 w-5 text-cyan-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Live Tracking</h4>
                    <p className="text-sm text-muted-foreground">Real-time monitoring</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-auto rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/drone-tech.jpeg"
                alt="SHELTR Drone Technology"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Manufacturing & QR Integration */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative h-64 lg:h-auto rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/sheltr-fab.jpeg"
                alt="SHELTR Manufacturing Facility"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Manufacturing & Integration</h3>
              <p className="text-muted-foreground">
                Our state-of-the-art manufacturing facility produces custom drones integrated 
                with SHELTR&apos;s QR code system and MOBI transport network.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <QrCode className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">QR Code Integration</h4>
                    <p className="text-sm text-muted-foreground">Seamless participant identification and delivery confirmation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">MOBI Coordination</h4>
                    <p className="text-sm text-muted-foreground">Works with MOBI bikes for comprehensive supply chain</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Radio className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Blockchain Tracking</h4>
                    <p className="text-sm text-muted-foreground">Every delivery recorded on the blockchain for transparency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Supply Packages */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Emergency Supply Packages</h2>
            <p className="text-xl text-muted-foreground">
              Pre-configured packages for immediate response
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Basic Essentials</CardTitle>
                <CardDescription>$25 package</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Water (2L)</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Energy bars (5)</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Basic first aid</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Emergency blanket</li>
                </ul>
                <Link href="/login">
                  <Button className="w-full mt-4" variant="outline">
                    Fund Package
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Comfort Care</CardTitle>
                <CardDescription>$50 package</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" />All basic essentials</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" />Hot meals (3)</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" />Hygiene kit</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" />Phone charger</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" />Warm clothing</li>
                </ul>
                <Link href="/login">
                  <Button className="w-full mt-4" variant="outline">
                    Fund Package
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Complete Support</CardTitle>
                <CardDescription>$100 package</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2" />All comfort care items</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2" />Weekly food supply</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2" />Medical supplies</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2" />Communication device</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2" />Emergency cash card</li>
                </ul>
                <Link href="/login">
                  <Button className="w-full mt-4" variant="outline">
                    Fund Package
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workshop & Development */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Research & Development</h2>
              <p className="text-xl text-muted-foreground">
                Our dedicated R&amp;D team continuously improves drone technology, 
                safety protocols, and delivery efficiency to better serve participants.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Precision Landing</h4>
                    <p className="text-sm text-muted-foreground">Advanced algorithms for safe POD-side delivery</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Safety First</h4>
                    <p className="text-sm text-muted-foreground">Multiple redundancies and emergency protocols</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Rapid Response</h4>
                    <p className="text-sm text-muted-foreground">24/7 emergency supply capability</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/workshop-a.jpeg"
                alt="SHELTR Workshop and Development"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105" 
          style={{backgroundImage: 'url(/images/sheltr_units/qr-applications.jpeg)'}}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Support Emergency Response?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Your donation can deliver life-saving supplies directly to those who need them most, 
            when they need them most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Start Funding Supplies
            </Button>
            <Button variant="outline" className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300" size="lg">
              <Users className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <PublicChatbot />
    </div>
  );
}
