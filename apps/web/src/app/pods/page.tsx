'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageViewer } from '@/components/ui/image-viewer';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { usePodModelImages } from '@/hooks/usePodModelImages';
import { StandardHero } from '@/components/StandardHero';
import { 
  Shield, 
  Battery, 
  Wifi, 
  Lock, 
  Fingerprint,
  Sun,
  Home,
  Smartphone,
  Zap,
  Snowflake,
  CheckCircle,
  Eye,
  Wrench,
  Paintbrush,
  Package,
  Recycle
} from 'lucide-react';

export default function PodsPage() {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/pods', '/images/sheltr_units/hero-pods.png');
  
  // Fetch pod model images from gallery (or use fallbacks)
  const podModelImages = usePodModelImages();

  // Pod Model Images Data
  const podImages = [
    {
      src: '/images/sheltr_units/sleeper-1.jpeg',
      alt: 'SHELTR Model A - Flat-Pack Emergency Housing',
      title: 'Model A - Flat-Pack Design'
    }
  ];

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % podImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + podImages.length) % podImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        title={
          <>
            Model A <span className="text-blue-400">Flat-Pack</span>
          </>
        }
        subtitle="One Model. Infinite Possibilities."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => document.getElementById('flat-pack-features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Features
          </Button>
          <Link href="/pods/buildout">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Technical Specs
            </Button>
          </Link>
        </div>
      </StandardHero>

      {/* Overview Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Flat-Pack Modular Emergency Housing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The SHELTR Model A represents a revolutionary flat-pack approach to emergency housing. Ships disassembled on standard pallets, assembles in 2-4 hours with two people and basic tools. No heavy equipment required. Simplified logistics, reduced costs, faster deployment—all while maintaining our commitment to dignified temporary housing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="text-base px-4 py-2">
              🏗️ Flat-Pack Design
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              ⚡ EcoFlow Powered
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              🔧 2-Hour Assembly
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              🌍 Canadian Made
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Ships Flat</h3>
              <p className="text-muted-foreground">60% smaller shipping volume on 3 standard pallets</p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">Easy Assembly</h3>
              <p className="text-muted-foreground">2-4 hours with 2 people, no heavy equipment needed</p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">EcoFlow Power</h3>
              <p className="text-muted-foreground">Integrated DELTA 2 system with 400W solar array</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <Recycle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Modular Design</h3>
              <p className="text-muted-foreground">Expandable and recyclable with Canadian manufacturing</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flat-Pack Features Section */}
      <section id="flat-pack-features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Model A Specifications</h2>
            <p className="text-xl text-muted-foreground">Single model, optimized design, maximum impact.</p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Model A - Flat-Pack Specifications */}
            <Card className="border-2 overflow-hidden">
              <div 
                className="relative h-64 bg-muted/20 cursor-pointer group"
                onClick={() => openImageViewer(0)}
              >
                <Image
                  src={podModelImages.modelA.url}
                  alt={podModelImages.modelA.alt}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-blue-600 text-white">Model A</Badge>
                  <Badge variant="outline" className="bg-white/90 text-black border-0">Flat-Pack</Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                    <Eye className="h-6 w-6 text-gray-800" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Assembled Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Assembled:</strong><br />
                    7&apos; × 4&apos; × 6.5&apos;
                  </div>
                  <div>
                    <strong>Flat-Pack:</strong><br />
                    3 pallets (60% smaller)
                  </div>
                  <div>
                    <strong>Assembly Time:</strong><br />
                    2-4 hours
                  </div>
                  <div>
                    <strong>Weight:</strong><br />
                    650 lbs assembled
                  </div>
                  <div>
                    <strong>Floor Area:</strong><br />
                    ~28 sq. ft.
                  </div>
                  <div>
                    <strong>Price:</strong><br />
                    $10K-$12K CAD
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Interior Features:</h4>
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
                      10L water tank with pump
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Compact shelving system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Concealed porta potty
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Flat-Pack Features Card */}
            <Card className="border-2 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <Package className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Flat-Pack Innovation</h3>
                  <p className="text-white/90">Revolutionizing emergency housing deployment</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-6 w-6" />
                  Power & Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>EcoFlow DELTA 2:</strong><br />
                      1kWh capacity, 1800W output, expandable to 3kWh
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Solar Array:</strong><br />
                      400W rooftop panels with MPPT controller
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Snowflake className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Winter Rated:</strong><br />
                      -25°C sustained with R-20 walls, R-30 roof
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Smart Security:</strong><br />
                      QR code, biometric, PIN, and app access
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Home className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Canadian Made:</strong><br />
                      ATS Containers partnership (Ontario)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assembly Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Simple Assembly Process</h2>
            <p className="text-xl text-muted-foreground">From flat-pack to fully functional in 2-4 hours</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold mb-2">Foundation & Frame</h3>
                <p className="text-sm text-muted-foreground">45 minutes - Lay floor panel, assemble aluminum frame</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold mb-2">Panel Installation</h3>
                <p className="text-sm text-muted-foreground">60 minutes - Snap-fit wall and roof panels</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold mb-2">Systems Integration</h3>
                <p className="text-sm text-muted-foreground">45 minutes - EcoFlow, solar, plumbing, smart lock</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="font-semibold mb-2">Interior & Finishing</h3>
                <p className="text-sm text-muted-foreground">30 minutes - Furniture, fixtures, final inspection</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              No heavy equipment required • Tool-free assembly where possible • Comprehensive assembly guide included
            </p>
            <Link href="/pods/buildout">
              <Button size="lg" variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                View Assembly Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pod Security Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Advanced Security System</h2>
            <p className="text-xl text-muted-foreground">Multi-factor authentication with local resilience and remote management</p>
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
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <span><strong>QR Code Access:</strong> Platform-generated codes (primary method)</span>
                    </div>
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
                      <span><strong>Mobile App:</strong> Bluetooth and remote unlock capability</span>
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
          
          {/* Security Deep Dive Button */}
          <div className="text-center mt-12">
            <Link href="/security">
              <Button size="lg" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Explore Security
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Materials & Construction Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Flat-Pack Modular Construction</h2>
            <p className="text-xl text-muted-foreground">Manufactured by ATS Containers (Ontario) to Canadian Standards</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <Badge className="bg-blue-600 text-white px-4 py-2">ISO Certified</Badge>
                <Badge className="bg-green-600 text-white px-4 py-2">NBC 2020</Badge>
                <Badge variant="outline" className="px-4 py-2">🍁 Canadian Made</Badge>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Modular Frame System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Aluminum Frame:</strong> Bolt-together 6063-T5 aluminum sections (no welding required) with powder-coat finish (ASTM B221)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Composite Wall Panels:</strong> 2&quot; EPS foam core with Polyurea coating and steel plate reinforcement (R-20 walls, R-30 roof)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Exterior:</strong> Powder-coated galvanized steel panels, impact resistant 250 J/m
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Windows:</strong> Double-pane polycarbonate with low-E coating (U-factor: 0.28)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/pods-overhead.jpeg"
                alt="SHELTR Pod Construction"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <Card className="border-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Canadian Standards & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <strong className="text-blue-600">CSA Z240 RV</strong>
                  <p className="text-sm text-muted-foreground">Recreational vehicle standards</p>
                </div>
                <div>
                  <strong className="text-blue-600">NBC 2020</strong>
                  <p className="text-sm text-muted-foreground">National Building Code of Canada</p>
                </div>
                <div>
                  <strong className="text-blue-600">CAN/ULC-S102</strong>
                  <p className="text-sm text-muted-foreground">Fire testing standards</p>
                </div>
                <div>
                  <strong className="text-blue-600">CSA C22.1</strong>
                  <p className="text-sm text-muted-foreground">Canadian Electrical Code</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Strategic Partnerships Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Strategic Partnerships</h2>
            <p className="text-xl text-muted-foreground">World-class manufacturing and power systems integration</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ATS Containers Partnership */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-blue-600" />
                  ATS Containers (Ontario)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Primary manufacturing partner for flat-pack engineering and modular container design.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Manufacturing Expertise:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      ISO-certified manufacturing facility
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Aluminum frame fabrication
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      SIP panel production
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Quality control and testing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Domestic Canadian production
                    </li>
                  </ul>
                </div>
                <Badge variant="outline" className="mt-3">🍁 Made in Canada</Badge>
              </CardContent>
            </Card>

            {/* EcoFlow Partnership */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  EcoFlow DELTA Series
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Integrated power solutions with the EcoFlow DELTA 2 portable power station.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Power System Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      1kWh capacity (expandable to 3kWh)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      1800W continuous output
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      400W solar array integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Mobile app monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      5-year warranty
                    </li>
                  </ul>
                </div>
                <Badge variant="outline" className="mt-3">⚡ Pre-Integrated</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customization Options Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "url('/images/sheltr_units/interior-1.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Customization Options</h2>
            <p className="text-xl text-gray-200">Personalize your POD with premium upgrades and accessories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-2 hover:border-purple-400 transition-colors bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Paintbrush className="h-10 w-10 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2 text-white">Custom Paint</h3>
                <p className="text-sm text-gray-300">Professional automotive-grade finishes</p>
                <Badge variant="outline" className="mt-3 border-purple-400 text-purple-300">From $800</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-400 transition-colors bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Sun className="h-10 w-10 mx-auto mb-4 text-blue-400" />
                <h3 className="font-semibold mb-2 text-white">Skylight Window</h3>
                <p className="text-sm text-gray-300">18&quot; × 18&quot; with ventilation</p>
                <Badge variant="outline" className="mt-3 border-blue-400 text-blue-300">From $600</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-400 transition-colors bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Battery className="h-10 w-10 mx-auto mb-4 text-green-400" />
                <h3 className="font-semibold mb-2 text-white">Power Pro Package</h3>
                <p className="text-sm text-gray-300">EcoFlow DELTA Pro upgrade (3.6kWh)</p>
                <Badge variant="outline" className="mt-3 border-green-400 text-green-300">From $2,500</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-400 transition-colors bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="h-10 w-10 mx-auto mb-4 text-yellow-400" />
                <h3 className="font-semibold mb-2 text-white">Premium Lighting</h3>
                <p className="text-sm text-gray-300">Smart RGB+CCT LED system</p>
                <Badge variant="outline" className="mt-3 border-yellow-400 text-yellow-300">From $400</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/pods/buildout#accessories">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black transition-all">
                View All Customization Options
              </Button>
            </Link>
          </div>
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
                    <li>• Bolt-together aluminum frame (no welding)</li>
                    <li>• Powder-coated for corrosion resistance</li>
                    <li>• Modular SIP panels (snap-fit)</li>
                    <li>• Galvanized steel exterior skin</li>
                    <li>• EPS foam core with Polyurea coating and steel reinforcement</li>
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
                    <li>• EcoFlow DELTA 2 (1kWh, 1800W)</li>
                    <li>• 400W rooftop solar array</li>
                    <li>• 4× 110V AC outlets</li>
                    <li>• 2× USB-C (100W) + 4× USB-A</li>
                    <li>• Low-wattage LED lighting</li>
                    <li>• Mobile app monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Water & Sanitation</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 10L fresh water tank</li>
                    <li>• 12V low-flow pump system</li>
                    <li>• Compact stainless steel sink</li>
                    <li>• Quick-connect plumbing</li>
                    <li>• 5L chemical porta potty</li>
                    <li>• Concealed storage design</li>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Deploy?</h2>
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

      {/* Public Chatbot */}
      <PublicChatbot />

      {/* Footer */}
      <Footer />

      {/* Image Viewer */}
      <ImageViewer
        images={podImages}
        currentIndex={currentImageIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </div>
  );
}
