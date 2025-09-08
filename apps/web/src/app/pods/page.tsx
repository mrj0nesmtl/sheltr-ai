'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Battery, 
  Wifi, 
  Lock, 
  Fingerprint,
  Sun,
  Home,
  Users,
  User,
  Bike,
  Smartphone,
  Zap,
  Snowflake,
  CheckCircle,
  Eye,
  Wrench
} from 'lucide-react';

export default function PodsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sheltr_units/hero-pods.png"
            alt="SHELTR Pods"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            PODS
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 max-w-2xl mx-auto">
            Secure, Mobile, Functional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => document.getElementById('pod-models')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Models
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="/pods/buildout">Technical Specs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Revolutionary Micro-Housing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SHELTR mobile micro-housing units provide safe, insulated, and weather-resistant accommodations 
            designed for dignity, mobility, and sustainability. Engineered for Canadian winters and rated for -25°C.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Snowflake className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Winter Rated</h3>
              <p className="text-muted-foreground">Rated for -25°C sustained temperatures with R-20 wall insulation</p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Sun className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Solar Powered</h3>
              <p className="text-muted-foreground">200-300W rooftop solar array with battery storage and 110V outlets</p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Smart Security</h3>
              <p className="text-muted-foreground">Biometric locks with remote access and tamper protection</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pod Models Section */}
      <section id="pod-models" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Pod Models</h2>
            <p className="text-xl text-muted-foreground">Choose the right size for your needs</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Model A - One Person */}
            <Card className="border-2 overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/sheltr_units/sleeper-1.jpeg"
                  alt="SHELTR One-Person Unit"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">Model A</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  One-Person Unit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Dimensions:</strong><br />
                    7&apos; × 4&apos; × 6.5&apos;
                  </div>
                  <div>
                    <strong>Floor Area:</strong><br />
                    ~28 sq. ft.
                  </div>
                  <div>
                    <strong>Water Tank:</strong><br />
                    10L capacity
                  </div>
                  <div>
                    <strong>Occupancy:</strong><br />
                    1 person
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Single bed with storage trunk
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Folding wall-mounted desk
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Compact shelving
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      12V ceramic heater
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Concealed porta potty
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Model B - Two Person */}
            <Card className="border-2 overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/sheltr_units/sleeper-2.jpeg"
                  alt="SHELTR Two-Person Unit"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 text-white">Model B</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Two-Person Unit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Dimensions:</strong><br />
                    12&apos; × 6&apos; × 7&apos;
                  </div>
                  <div>
                    <strong>Floor Area:</strong><br />
                    ~72 sq. ft.
                  </div>
                  <div>
                    <strong>Water Tank:</strong><br />
                    20L capacity
                  </div>
                  <div>
                    <strong>Occupancy:</strong><br />
                    2 persons
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Two single beds or one full bed
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Desk with integrated shelving
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Compact washer/dryer combo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Propane-compatible heater
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Full sink module
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SHELTR Mountain Bike Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">SHELTR Mountain Bike</h2>
            <p className="text-xl text-muted-foreground">Ultimate mobility and transportation solution</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/sheltr_units/bike-1.jpeg"
                    alt="SHELTR Mountain Bike"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/sheltr_units/bike-2.jpeg"
                    alt="SHELTR Mountain Bike Detail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Bike className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Mobility & Transport</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <strong>Pod Transport:</strong> Optional bicycle hitch for towing Model A units
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <strong>All-Terrain:</strong> Mountain bike design for urban and rural environments
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <strong>Cargo Capacity:</strong> Integrated storage for personal belongings
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <strong>Durability:</strong> Built for daily use and weather resistance
                  </div>
                </div>
              </div>

              <Button className="w-full sm:w-auto">
                Learn More About Mobility
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pod Security Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Advanced Security System</h2>
            <p className="text-xl text-muted-foreground">Smart locks with biometric authentication and remote control</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/security.jpeg"
                alt="SHELTR Security System"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Multi-Layer Protection</h3>
              </div>

              <Tabs defaultValue="authentication" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="authentication">Authentication</TabsTrigger>
                  <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
                  <TabsTrigger value="failsafe">Failsafe</TabsTrigger>
                </TabsList>
                
                <TabsContent value="authentication" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-blue-500" />
                      <span><strong>Biometric Scanner:</strong> 99.9% recognition accuracy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-blue-500" />
                      <span><strong>Keypad Entry:</strong> 4-8 digit PINs with backlit display</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <span><strong>Remote Access:</strong> Web app control with real-time status</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="connectivity" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-green-500" />
                      <span><strong>WiFi 2.4GHz:</strong> IEEE 802.11 b/g/n connectivity</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-green-500" />
                      <span><strong>Bluetooth LE:</strong> BLE 5.0 for local pairing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span><strong>Encryption:</strong> AES-256 with TLS 1.3</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="failsafe" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Battery className="h-5 w-5 text-orange-500" />
                      <span><strong>Backup Power:</strong> 36-48 hrs runtime on internal battery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-orange-500" />
                      <span><strong>Mechanical Override:</strong> Emergency key access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-orange-500" />
                      <span><strong>Tamper Detection:</strong> Alerts sent to central dashboard</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Security Technical Specs */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Hardware</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Powder-coated aluminum casing</li>
                    <li>• IP65-rated weatherproofing</li>
                    <li>• ARM Cortex-M4 120MHz</li>
                    <li>• 5000mAh backup battery</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Power</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 12V DC primary power</li>
                    <li>• Solar system integration</li>
                    <li>• Low-power optimization</li>
                    <li>• Auto power management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• AES-256 encryption</li>
                    <li>• Secure boot process</li>
                    <li>• Certificate authentication</li>
                    <li>• OTA firmware updates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">API Integration</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• RESTful API endpoints</li>
                    <li>• WebSocket real-time</li>
                    <li>• MQTT over TLS 1.3</li>
                    <li>• Fleet management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Design Blueprints Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Design & Engineering</h2>
            <p className="text-xl text-muted-foreground">Technical blueprints and design sketches</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/sheltr_units/sketch-1.jpeg"
                  alt="Design Sketch 1"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Structural Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Welded aluminum frame with SIP panels and powder-coated finish for durability and insulation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/sheltr_units/sketch-2.jpeg"
                  alt="Design Sketch 2"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Interior Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimized space utilization with folding furniture, storage solutions, and essential amenities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/sheltr_units/sketch-3.jpeg"
                  alt="Design Sketch 3"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Systems Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Solar power, water systems, heating, and smart technology integration blueprints.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Images Gallery */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/pods-overhead.jpeg"
                alt="Pods Overhead View"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/closeup-wheels.jpeg"
                alt="Mobility System"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/cube-and-storage.jpeg"
                alt="Storage Solutions"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/interior-1.jpeg"
                alt="Interior View"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Technical Specifications</h2>
            <p className="text-xl text-muted-foreground">Complete engineering details and materials</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Structural Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Frame & Panels</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Welded lightweight aluminum square tubing</li>
                    <li>• Powder-coated for corrosion resistance</li>
                    <li>• Structural Insulated Panels (SIPs)</li>
                    <li>• Galvanized steel exterior skin</li>
                    <li>• Rigid closed-cell polyurethane core</li>
                    <li>• Marine-grade plywood interior</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Insulation & Weather</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• R-20 wall insulation, R-30 roof</li>
                    <li>• EPDM rubber membrane roofing</li>
                    <li>• Double-pane polycarbonate windows</li>
                    <li>• Gasketed insulated entry door</li>
                    <li>• Steel-reinforced subfloor</li>
                    <li>• Anti-slip vinyl composite flooring</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Systems & Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Power & Electrical</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 200-300W rooftop solar array</li>
                    <li>• 12V deep-cycle battery storage</li>
                    <li>• 600-1000W inverter/charger</li>
                    <li>• 110V AC outlets + USB charging</li>
                    <li>• Low-wattage LED lighting</li>
                    <li>• GFCI-protected electrical</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Water & Sanitation</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 10L (Model A) / 20L (Model B) water tank</li>
                    <li>• 12V low-flow pump system</li>
                    <li>• Compact stainless steel sink</li>
                    <li>• 5L chemical porta potty</li>
                    <li>• Concealed storage design</li>
                    <li>• Drain system integration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 mt-8">
            <CardHeader>
              <CardTitle>Safety & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Fire Safety</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Fire-retardant interior panels</li>
                    <li>• NFPA 701 compliant materials</li>
                    <li>• Smoke/CO2 detector included</li>
                    <li>• Safety release door mechanism</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mobility</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Heavy-duty caster wheels</li>
                    <li>• Locking wheel mechanisms</li>
                    <li>• Bicycle hitch compatibility</li>
                    <li>• Retractable stabilizer legs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Climate Control</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Roof-mounted ventilation fan</li>
                    <li>• 12V ceramic heater (Model A)</li>
                    <li>• Propane heater option (Model B)</li>
                    <li>• Operable windows for airflow</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Deploy SHELTR Pods?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact us to learn more about pod deployment, customization options, and partnership opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Request Information
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
