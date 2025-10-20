'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';
import { PublicChatbot } from '@/components/PublicChatbot';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';
import { 
  ArrowLeft,
  Battery,
  Zap,
  Mountain,
  Route,
  Shield,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Gauge,
  Timer,
  Weight,
  MapPin,
  Truck,
  Menu,
  X,
  LogIn
} from 'lucide-react';

export default function MobiPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/pods/mobi', '/images/sheltr_units/sheltr-mobility.jpg');
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
        title="MOBI"
        subtitle="Ultimate mobility and pod transport solution for urban scenarios."
      >
        <div className="mb-6">
          <Link href="/pods">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to PODS
            </Button>
          </Link>
        </div>
        <Button 
          size="lg" 
          className="bg-white text-black hover:bg-gray-200 mt-4"
          onClick={() => document.getElementById('specifications')?.scrollIntoView({ behavior: 'smooth' })}
        >
          View Specifications
        </Button>
      </StandardHero>

      {/* Overview Section */}
      <section id="specifications" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Built for Every Journey</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MOBI combines electric power, all-terrain capability, and integrated 
            transport systems to provide the ultimate POD mobility solution for urban and rural environments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
            <CardContent className="p-6 text-center">
              <Mountain className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">All-Terrain</h3>
              <p className="text-muted-foreground">Designed for urban streets, rural paths, and everything in between</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Electric Power</h3>
              <p className="text-muted-foreground">750W+ motor with long-range battery for extended journeys</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20">
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">POD Transport</h3>
              <p className="text-muted-foreground">Integrated hitch system for towing Model A PODS</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Technical Specifications</h2>
          <p className="text-xl text-muted-foreground">Professional-grade components for MOBI reliability and performance</p>
        </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/sheltr_units/bike-1.jpeg"
                  alt="SHELTR Mountain Bike Profile"
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

            <div className="space-y-6">
              <Tabs defaultValue="motor" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="motor">Motor & Power</TabsTrigger>
                  <TabsTrigger value="frame">Frame & Build</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                </TabsList>
                
                <TabsContent value="motor" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Electric Motor System</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Motor:</strong> 750W mid-drive electric motor
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Battery:</strong> 48V 17.5Ah lithium-ion (840Wh capacity)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Range:</strong> 60-80 miles per charge (without towing)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Top Speed:</strong> 28 mph (Class 3 e-bike)
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="frame" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Mountain className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-bold">Frame & Components</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Frame:</strong> Aluminum alloy with reinforced towing points
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Suspension:</strong> Front fork suspension (120mm travel)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Tires:</strong> 27.5&quot; × 2.8&quot; all-terrain tires
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Brakes:</strong> Hydraulic disc brakes (180mm rotors)
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transport" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="h-6 w-6 text-orange-500" />
                    <h3 className="text-xl font-bold">Transport & Cargo</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Towing Capacity:</strong> 800 lbs (Model A pod compatible)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Cargo Rack:</strong> Rear cargo rack (50 lb capacity)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Hitch System:</strong> Universal ball hitch with safety chain
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <strong>Lighting:</strong> Integrated LED lights and turn signals
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Specifications Table */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Complete Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-blue-500" />
                    Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Motor Power:</span>
                      <span className="font-medium">750W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Speed:</span>
                      <span className="font-medium">28 mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Range:</span>
                      <span className="font-medium">60-80 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Towing Range:</span>
                      <span className="font-medium">40-50 mi</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Battery className="h-5 w-5 text-green-500" />
                    Battery
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">840Wh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voltage:</span>
                      <span className="font-medium">48V</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charge Time:</span>
                      <span className="font-medium">4-6 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycles:</span>
                      <span className="font-medium">1000+</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Weight className="h-5 w-5 text-orange-500" />
                    Dimensions
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span className="font-medium">65 lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frame Size:</span>
                      <span className="font-medium">Large</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wheel Size:</span>
                      <span className="font-medium">27.5&quot;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Load:</span>
                      <span className="font-medium">850 lbs</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-purple-500" />
                    Features
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gears:</span>
                      <span className="font-medium">9-speed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Display:</span>
                      <span className="font-medium">LCD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lights:</span>
                      <span className="font-medium">LED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GPS:</span>
                      <span className="font-medium">Optional</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pod Transport Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">POD Transport System</h2>
            <p className="text-xl text-muted-foreground">Engineered specifically for SHELTR Model A POD towing</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-green-500" />
                    Towing Capability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Maximum Towing Weight:</strong> 800 lbs (Model A POD: ~600 lbs)
                    </div>
                    <div>
                      <strong>Hitch Type:</strong> Universal ball hitch with quick-release mechanism
                    </div>
                    <div>
                      <strong>Safety Features:</strong> Safety chain, breakaway cable, reflective tape
                    </div>
                    <div>
                      <strong>Electrical:</strong> 7-pin connector for POD brake lights and turn signals
                    </div>
                    <div>
                      <strong>Installation:</strong> Bolt-on attachment to reinforced rear frame points
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Range & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Towing Range:</strong> 40-50 miles per charge (with Model A POD)
                    </div>
                    <div>
                      <strong>Towing Speed:</strong> Up to 20 mph (recommended maximum)
                    </div>
                    <div>
                      <strong>Hill Climbing:</strong> 15% grade with full POD load
                    </div>
                    <div>
                      <strong>Terrain:</strong> Paved roads, bike paths, packed dirt trails
                    </div>
                    <div>
                      <strong>Weather Rating:</strong> All-weather capable with proper maintenance
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/sheltr_units/closeup-wheels.jpeg"
                alt="Pod Transport System"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-12">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Safety Requirements</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Valid driver&apos;s license or e-bike certification required for towing operations</li>
                    <li>• Maximum recommended towing speed: 20 mph for safety and stability</li>
                    <li>• Regular brake and hitch system inspection required before each journey</li>
                    <li>• Reflective safety gear and proper lighting mandatory for road use</li>
                    <li>• Local regulations may apply - check with authorities before towing on public roads</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Accessories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Features & Accessories</h2>
            <p className="text-xl text-muted-foreground">Everything you need for the ultimate mobility experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Safety Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Hydraulic disc brakes with 180mm rotors</li>
                  <li>• Integrated LED headlight and taillight</li>
                  <li>• Reflective frame tape and wheel reflectors</li>
                  <li>• Electronic horn and turn signal system</li>
                  <li>• Anti-theft GPS tracking (optional)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-500" />
                  Smart Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• LCD display with speed, range, and battery level</li>
                  <li>• Smartphone app connectivity</li>
                  <li>• Route planning and navigation</li>
                  <li>• Remote diagnostics and maintenance alerts</li>
                  <li>• Theft protection and recovery system</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 2-year comprehensive warranty</li>
                  <li>• Mobile service and repair network</li>
                  <li>• Scheduled maintenance reminders</li>
                  <li>• Parts availability guarantee</li>
                  <li>• Training and certification programs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready for Ultimate Mobility?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the freedom of MOBI. Contact us for test rides, 
            pricing information, and delivery options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleChatOpen}
            >
              Chat with Us
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Get Pricing Info
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Chatbot */}
      <PublicChatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
}
