'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import ThemeLogo from '@/components/ThemeLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';
import { 
  ArrowLeft,
  Battery,
  Sun,
  Zap,
  Snowflake,
  Droplets,
  Wind,
  Bed,
  Monitor,
  Wifi,
  Lock,
  QrCode,
  Shield,
  Bike,
  Wrench,
  Settings,
  CheckCircle,
  Info,
  AlertTriangle,
  Home
} from 'lucide-react';

export default function PodsBuildoutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105" 
          style={{backgroundImage: 'url(/images/sheltr_units/sleeper-2.jpeg)'}}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Link href="/pods">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to PODS
              </Button>
            </Link>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Buildout
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Complete technical specifications and buildout guide for SHELTR mobile micro-housing units. 
            Professional fabrication documentation for manufacturers and partners.
          </p>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Sun className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold mb-2">Power Systems</h3>
                <p className="text-sm text-muted-foreground">Solar panels, batteries, inverters</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Home className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Interior Systems</h3>
                <p className="text-sm text-muted-foreground">Furniture, appliances, storage</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Security & Tech</h3>
                <p className="text-sm text-muted-foreground">Smart locks, QR codes, monitoring</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Bike className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold mb-2">Mobility</h3>
                <p className="text-sm text-muted-foreground">Bike hitch, wheels, transport</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Power Systems Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Power & Electrical Systems</h2>
            <p className="text-lg text-muted-foreground">Complete off-grid power solution with solar energy</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/pods-overhead.jpeg"
                alt="Solar Panel System"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <Tabs defaultValue="solar" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="solar">Solar Panel</TabsTrigger>
                  <TabsTrigger value="battery">Battery</TabsTrigger>
                  <TabsTrigger value="electrical">Electrical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="solar" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-xl font-bold">Solar Panel Array</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Capacity:</strong> 200-300W monocrystalline panels
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Mounting:</strong> Integrated roof-mounted system with tilt optimization
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Efficiency:</strong> 20%+ efficiency rating with 25-year warranty
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Weather Rating:</strong> IP67 waterproof with hail resistance
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="battery" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Battery className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-bold">Battery Storage System</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Type:</strong> LiFePO4 (Lithium Iron Phosphate) 12V system
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Capacity:</strong> 100Ah minimum (expandable to 200Ah)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Runtime:</strong> 3-5 days backup power without solar input
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Management:</strong> Built-in BMS with temperature monitoring
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="electrical" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Electrical System</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Inverter:</strong> 1000W pure sine wave inverter/charger
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>AC Outlets:</strong> 2× 110V GFCI-protected outlets
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>USB Charging:</strong> 4× USB-A ports + 2× USB-C PD ports
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Lighting:</strong> LED strip lighting with dimmer controls
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Power Specifications Table */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Power System Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Model A (1-Person)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Solar Panel:</span>
                      <span className="font-medium">200W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Capacity:</span>
                      <span className="font-medium">100Ah LiFePO4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Power Generation:</span>
                      <span className="font-medium">800-1200Wh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backup Runtime:</span>
                      <span className="font-medium">3-4 days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Model B (2-Person)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Solar Panel:</span>
                      <span className="font-medium">300W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Capacity:</span>
                      <span className="font-medium">200Ah LiFePO4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Power Generation:</span>
                      <span className="font-medium">1200-1800Wh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backup Runtime:</span>
                      <span className="font-medium">4-5 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Climate Control Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Climate Control & Ventilation</h2>
            <p className="text-lg text-muted-foreground">Heating, cooling, and air circulation systems</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-500" />
                  Air Conditioning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong>Type:</strong> 12V DC mini-split system
                  </div>
                  <div>
                    <strong>Capacity:</strong> 5,000 BTU/hr cooling
                  </div>
                  <div>
                    <strong>Power Draw:</strong> 400-600W (efficient inverter)
                  </div>
                  <div>
                    <strong>Features:</strong> Remote control, timer, sleep mode
                  </div>
                  <div>
                    <strong>Installation:</strong> Roof-mounted condenser unit
                  </div>
                </div>
                <Badge variant="secondary">Model B Standard</Badge>
                <Badge variant="outline">Model A Optional</Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5 text-orange-500" />
                  Heating System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong>Model A:</strong> 12V ceramic heater (500W)
                  </div>
                  <div>
                    <strong>Model B:</strong> Propane vented heater (8,000 BTU)
                  </div>
                  <div>
                    <strong>Safety:</strong> Automatic shutoff, tip-over protection
                  </div>
                  <div>
                    <strong>Efficiency:</strong> 95%+ heat conversion
                  </div>
                  <div>
                    <strong>Runtime:</strong> 8-12 hours continuous operation
                  </div>
                </div>
                <Badge variant="secondary">Winter Rated -25°C</Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-green-500" />
                  Ventilation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong>Exhaust Fan:</strong> 12V roof-mounted (variable speed)
                  </div>
                  <div>
                    <strong>Windows:</strong> 2× operable windows with screens
                  </div>
                  <div>
                    <strong>Air Exchange:</strong> Complete air change every 15 minutes
                  </div>
                  <div>
                    <strong>Humidity Control:</strong> Automatic moisture detection
                  </div>
                  <div>
                    <strong>Filters:</strong> Replaceable HEPA air filters
                  </div>
                </div>
                <Badge variant="secondary">Smart Controls</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interior Systems Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Interior Systems & Furniture</h2>
            <p className="text-lg text-muted-foreground">Complete living amenities and space optimization</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-blue-500" />
                    Sleeping & Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Model A</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Single bed (36&quot; × 75&quot;)</li>
                        <li>• 6&quot; memory foam mattress</li>
                        <li>• Under-bed storage trunk</li>
                        <li>• Wall-mounted shelving</li>
                        <li>• Clothing hooks & hangers</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Model B</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Full bed (54&quot; × 75&quot;) or 2 singles</li>
                        <li>• 8&quot; hybrid mattress</li>
                        <li>• Built-in dresser drawers</li>
                        <li>• Overhead storage cabinets</li>
                        <li>• Wardrobe closet space</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-green-500" />
                    Workspace & Desk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Model A:</strong> Wall-mounted folding desk (24&quot; × 16&quot;)
                    </div>
                    <div>
                      <strong>Model B:</strong> Built-in desk with storage (48&quot; × 24&quot;)
                    </div>
                    <div>
                      <strong>Features:</strong> Integrated power outlets, USB charging, LED task lighting
                    </div>
                    <div>
                      <strong>Materials:</strong> Marine-grade plywood with laminate surface
                    </div>
                    <div>
                      <strong>Accessories:</strong> Adjustable laptop stand, document storage
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Water & Sink System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Sink:</strong> Compact stainless steel basin with folding faucet
                    </div>
                    <div>
                      <strong>Water Tank:</strong> 10L (Model A) / 20L (Model B) fresh water
                    </div>
                    <div>
                      <strong>Pump:</strong> 12V low-flow pump with pressure switch
                    </div>
                    <div>
                      <strong>Drainage:</strong> Gray water tank with external drain valve
                    </div>
                    <div>
                      <strong>Filtration:</strong> Multi-stage water filter system
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <strong>Water Conservation:</strong> Low-flow aerator reduces consumption by 40%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    Washer/Dryer (Model B)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Type:</strong> Compact 24&quot; ventless washer/dryer combo
                    </div>
                    <div>
                      <strong>Capacity:</strong> 2.7 cu ft (13 lbs wash / 8 lbs dry)
                    </div>
                    <div>
                      <strong>Power:</strong> 110V AC, 1400W max draw
                    </div>
                    <div>
                      <strong>Water Usage:</strong> 13 gallons per full cycle
                    </div>
                    <div>
                      <strong>Features:</strong> 14 wash cycles, delay start, child lock
                    </div>
                  </div>
                  <Badge variant="secondary">Model B Exclusive</Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/interior-1.jpeg"
                alt="SHELTR Pod Interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security & Technology Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Security & Technology</h2>
            <p className="text-lg text-muted-foreground">Advanced security, QR codes, and smart features</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/security.jpeg"
                alt="Security System"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-500" />
                    Smart Lock System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Authentication:</strong> Fingerprint + PIN + Remote access
                  </div>
                  <div>
                    <strong>Hardware:</strong> IP65-rated aluminum casing, ARM Cortex-M4
                  </div>
                  <div>
                    <strong>Power:</strong> 12V DC with 48hr backup battery
                  </div>
                  <div>
                    <strong>Connectivity:</strong> WiFi, Bluetooth LE, optional LoRa
                  </div>
                  <div>
                    <strong>Security:</strong> AES-256 encryption, tamper alerts
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-blue-500" />
                    QR Code System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Location:</strong> Exterior panel near entry door
                  </div>
                  <div>
                    <strong>Material:</strong> UV-resistant vinyl with protective coating
                  </div>
                  <div>
                    <strong>Data:</strong> Encrypted participant ID, donation wallet, contact info
                  </div>
                  <div>
                    <strong>Features:</strong> Dynamic QR codes with real-time updates
                  </div>
                  <div>
                    <strong>Integration:</strong> Links to SHELTR mobile app and web platform
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-purple-500" />
                    Connectivity Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>WiFi Hotspot:</strong> 4G/5G cellular with WiFi sharing
                  </div>
                  <div>
                    <strong>Smart Controls:</strong> App-controlled lighting, climate, security
                  </div>
                  <div>
                    <strong>Monitoring:</strong> Real-time power, water, and system status
                  </div>
                  <div>
                    <strong>Updates:</strong> OTA firmware updates for all smart systems
                  </div>
                  <div>
                    <strong>Emergency:</strong> GPS tracking and emergency alert system
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Security Deep Dive Button */}
          <div className="text-center mt-12">
            <Link href="/security">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Explore Advanced Security
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobility & Transport Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">MOBI Transport Systems</h2>
            <p className="text-lg text-muted-foreground">Bike hitch, wheels, and transportation features</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bike className="h-5 w-5 text-green-500" />
                    Bike Hitch System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Compatibility:</strong> Model A units only (weight limit 800 lbs)
                    </div>
                    <div>
                      <strong>Hitch Type:</strong> Universal ball hitch with safety chain
                    </div>
                    <div>
                      <strong>Installation:</strong> Bolt-on attachment to rear frame
                    </div>
                    <div>
                      <strong>Features:</strong> Quick-release mechanism, adjustable height
                    </div>
                    <div>
                      <strong>Safety:</strong> Reflective tape, LED brake lights, turn signals
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Important:</strong> Requires SHELTR Mountain Bike or equivalent e-bike with 750W+ motor
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    Wheel & Mobility System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Wheels:</strong> 4× heavy-duty caster wheels (6&quot; diameter)
                    </div>
                    <div>
                      <strong>Load Rating:</strong> 300 lbs per wheel (1,200 lbs total)
                    </div>
                    <div>
                      <strong>Locking:</strong> Individual wheel locks for stationary placement
                    </div>
                    <div>
                      <strong>Stabilizers:</strong> 4× retractable steel legs with adjustable feet
                    </div>
                    <div>
                      <strong>Leveling:</strong> Built-in bubble level for proper positioning
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/images/sheltr_units/closeup-wheels.jpeg"
                  alt="SHELTR Heavy-Duty Wheels and Mobility System"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/images/sheltr_units/bike-2.jpeg"
                  alt="MOBI Bike with POD Transport System"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* MOBI Deep Dive Button */}
          <div className="text-center mt-12">
            <Link href="/pods/mobi">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Bike className="h-4 w-4 mr-2" />
                Explore MOBI Details
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Installation & Maintenance */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Installation & Maintenance</h2>
            <p className="text-lg text-muted-foreground">Setup procedures and ongoing maintenance requirements</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Initial Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>• Site preparation and leveling</div>
                  <div>• Power system commissioning</div>
                  <div>• Water system testing</div>
                  <div>• Smart lock pairing</div>
                  <div>• QR code configuration</div>
                  <div>• Safety system verification</div>
                </div>
                <Badge variant="secondary">2-4 hours</Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Regular Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>• Solar panel cleaning (monthly)</div>
                  <div>• Battery system check (quarterly)</div>
                  <div>• Water filter replacement (6 months)</div>
                  <div>• HVAC filter replacement (3 months)</div>
                  <div>• Lock system calibration (annual)</div>
                  <div>• Structural inspection (annual)</div>
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Warranty & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>• 5-year structural warranty</div>
                  <div>• 2-year electronics warranty</div>
                  <div>• 25-year solar panel warranty</div>
                  <div>• 24/7 remote monitoring</div>
                  <div>• Mobile service technicians</div>
                  <div>• Parts & labor coverage</div>
                </div>
                <Badge variant="secondary">Comprehensive</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Need a POD?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact our team for detailed specifications, customization options, and deployment planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Request Technical Specs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
