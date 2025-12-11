'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';
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
  Home,
  Thermometer,
  Layers,
  HardHat,
  Factory,
  Award,
  FileCheck,
  Paintbrush,
  Lightbulb
} from 'lucide-react';

export default function PodsBuildoutPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/pods/buildout', '/images/sheltr_units/pods-2.jpeg');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PublicNavigation />

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        title="SPECS"
        subtitle="Complete technical specifications and buildout guide for SHELTR mobile micro-housing units. Professional fabrication documentation for manufacturers and partners."
      >
        <div className="mb-6">
          <Link href="/pods">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to PODS
            </Button>
          </Link>
        </div>
      </StandardHero>

      {/* Canadian Winter Rating Banner */}
      <section className="py-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white text-center md:text-left">
            <div className="flex items-center gap-3">
              <Thermometer className="h-8 w-8" />
              <div>
                <div className="font-bold text-lg">Winter Rated -25°C</div>
                <div className="text-sm text-blue-100">Tested for Canadian climates</div>
              </div>
            </div>
            <div className="hidden md:block h-12 w-px bg-blue-400" />
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8" />
              <div>
                <div className="font-bold text-lg">CSA Compliant</div>
                <div className="text-sm text-blue-100">Canadian Standards Association certified</div>
              </div>
            </div>
            <div className="hidden md:block h-12 w-px bg-blue-400" />
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8" />
              <div>
                <div className="font-bold text-lg">Emergency Shelter Certified</div>
                <div className="text-sm text-blue-100">Meets Canadian emergency housing standards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            <Card className="border-2 text-center hover:border-primary transition-colors">
              <CardContent className="p-6">
                <Layers className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="font-semibold mb-2">Materials & Build</h3>
                <p className="text-sm text-muted-foreground">SIPs, aluminum frame, insulation</p>
              </CardContent>
            </Card>

            <Card className="border-2 text-center hover:border-primary transition-colors">
              <CardContent className="p-6">
                <Sun className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold mb-2">Power Systems</h3>
                <p className="text-sm text-muted-foreground">Solar panels, batteries, inverters</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 text-center hover:border-primary transition-colors">
              <CardContent className="p-6">
                <Home className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Interior Systems</h3>
                <p className="text-sm text-muted-foreground">Furniture, appliances, storage</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 text-center hover:border-primary transition-colors">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Security & Tech</h3>
                <p className="text-sm text-muted-foreground">Smart locks, QR codes, monitoring</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 text-center hover:border-primary transition-colors">
              <CardContent className="p-6">
                <Bike className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold mb-2">Mobility</h3>
                <p className="text-sm text-muted-foreground">Bike hitch, wheels, transport</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Materials & Construction Section - NEW */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HardHat className="h-10 w-10 text-indigo-600" />
              <h2 className="text-4xl font-bold">Materials & Construction</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional-grade materials engineered for Canadian winters. Every component selected for durability, 
              insulation efficiency, and long-term performance in extreme weather conditions.
            </p>
          </div>

          {/* Structural Framework */}
          <div className="mb-16">
            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardHeader className="bg-indigo-50 dark:bg-indigo-950/50">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Factory className="h-7 w-7 text-indigo-600" />
                  Structural Framework & Shell
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Primary Structure
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-indigo-600">Frame System:</strong>
                        <p className="mt-2">Welded 6063-T5 aluminum square tubing (2&quot; × 2&quot; × 1/8&quot; wall thickness). Powder-coated for corrosion resistance (ASTM B221 compliant).</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Award className="h-3 w-3" />
                          <span>Weight: 180 lbs (Model A) | 320 lbs (Model B)</span>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-indigo-600">Exterior Panels:</strong>
                        <p className="mt-2">Powder-coated galvanized steel (22-gauge) or aluminum composite panels (ACM). UV-resistant matte dark gray finish. Impact resistance: 250 J/m.</p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-indigo-600">Roof System:</strong>
                        <p className="mt-2">EPDM rubber membrane (60 mil thickness) with integrated aluminum solar panel mounting rails. 20-year waterproof warranty. Reinforced for 60 psf snow load.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Snowflake className="h-5 w-5 text-blue-600" />
                      Insulation & Climate Barrier
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-blue-600">Advanced Composite Wall Panels:</strong>
                        <p className="mt-2">2&quot; EPS foam core with Polyurea spray coating on both sides. Steel plate reinforcement bonded to exterior and interior faces. Thermal resistance: R-20 minimum. Waterproof barrier. Fire-rated Class A (ASTM E84).</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-semibold">
                          <Thermometer className="h-3 w-3" />
                          <span>-25°C Winter Rated • 40% Stronger</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-blue-600">Roof Insulation:</strong>
                        <p className="mt-2">4&quot; polyisocyanurate foam (R-30). Reflective radiant barrier reduces summer heat gain by 40%. CAN/ULC-S102 fire-rated.</p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-blue-600">Floor System:</strong>
                        <p className="mt-2">Steel-reinforced subfloor with 2&quot; XPS foam insulation (R-10). 6-mil polyethylene vapor barrier. Marine-grade 3/4&quot; plywood decking.</p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                        <strong className="text-blue-600">Interior Finish:</strong>
                        <p className="mt-2">Smooth white coating applied over interior steel plate. Antimicrobial properties. Easy-clean durable finish. Mold-resistant.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Windows & Entry */}
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-bold text-lg mb-4">Windows & Entry Door</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-300">
                      <CardContent className="p-4">
                        <strong className="text-blue-700 dark:text-blue-300">Windows (2×)</strong>
                        <p className="text-sm mt-2">Double-pane polycarbonate with low-E coating. U-factor: 0.28. Operable with integrated insect screens. Dimensions: 24&quot; × 18&quot;.</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-300">
                      <CardContent className="p-4">
                        <strong className="text-green-700 dark:text-green-300">Entry Door</strong>
                        <p className="text-sm mt-2">Insulated steel construction (R-5). Automotive-grade weatherstripping. Multi-point locking system. Dimensions: 32&quot; × 76&quot;.</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-300">
                      <CardContent className="p-4">
                        <strong className="text-purple-700 dark:text-purple-300">Sealing System</strong>
                        <p className="text-sm mt-2">Silicone-based weather seals. EPDM door gasket. Aluminum threshold with thermal break. Air leakage: 0.15 CFM/ft².</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Flooring */}
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-bold text-lg mb-4">Flooring System</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong>Surface:</strong> Commercial-grade anti-slip vinyl composite tile (VCT). Class 33 wear rating. Thickness: 3mm. Easy-clean matte finish.
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong>Underlayment:</strong> Sound-dampening rubber mat (2mm). Reduces footstep noise by 18 dB.
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong>Weight Capacity:</strong> 100 lbs/ft² live load rating (Model A: 2,800 lbs | Model B: 7,200 lbs total).
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong>Cleanability:</strong> Waterproof, chemical-resistant. Compatible with standard floor cleaners.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance & Standards */}
                <div className="mt-8 pt-8 border-t bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 -mx-8 -mb-8 p-8 rounded-b-lg">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                    Canadian Standards & Compliance
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border">
                      <strong className="text-blue-600">CSA Z240 RV</strong>
                      <p className="text-xs mt-1">Recreational vehicle standards compliance</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border">
                      <strong className="text-blue-600">NBC 2020</strong>
                      <p className="text-xs mt-1">National Building Code of Canada</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border">
                      <strong className="text-blue-600">CAN/ULC-S102</strong>
                      <p className="text-xs mt-1">Fire testing standards</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border">
                      <strong className="text-blue-600">CSA C22.1</strong>
                      <p className="text-xs mt-1">Canadian Electrical Code</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unit Dimensions Comparison */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle>Model A: Single-Person Unit</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">Exterior Dimensions:</span>
                    <span>7&apos; L × 4&apos; W × 6.5&apos; H</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="font-medium">Interior Space:</span>
                    <span>~28 sq ft usable</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">Total Weight:</span>
                    <span>800 lbs (fully equipped)</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="font-medium">Occupancy:</span>
                    <span>1 person</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">Bike-Towable:</span>
                    <span className="text-green-600 font-semibold">✓ Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle>Model B: Two-Person Unit</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">Exterior Dimensions:</span>
                    <span>12&apos; L × 6&apos; W × 7&apos; H</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="font-medium">Interior Space:</span>
                    <span>~72 sq ft usable</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">Total Weight:</span>
                    <span>1,450 lbs (fully equipped)</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="font-medium">Occupancy:</span>
                    <span>2 persons</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">Bike-Towable:</span>
                    <span className="text-red-600 font-semibold">✗ Vehicle required</span>
                  </div>
                </div>
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
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/sheltr_units/interior-1.jpeg"
                alt="SHELTR Pod Interior - Model B with full amenities"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-sm font-medium">
                  Model B Interior: Complete living space with sink, washer/dryer, workspace, and sleeping area
                </p>
              </div>
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

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-purple-500" />
                    Connectivity Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-purple-600 text-white rounded-full p-2">
                        <Wifi className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="text-purple-700 dark:text-purple-300 text-lg">Starlink Satellite Internet</strong>
                        <Badge className="ml-2 bg-blue-600">Partnership In Progress</Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Global connectivity anywhere on Earth. High-speed satellite internet with optional Starlink Mini terminal integration.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>Speed:</strong> 50-200 Mbps download
                      </div>
                      <div>
                        <strong>Latency:</strong> 20-40ms
                      </div>
                      <div>
                        <strong>Coverage:</strong> Global (70°N to 70°S)
                      </div>
                      <div>
                        <strong>Power:</strong> 40-60W average draw
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <strong>Cellular Backup:</strong> 4G/5G multi-carrier SIM with WiFi hotspot (100GB/month data plan)
                    </div>
                    <div>
                      <strong>Smart Controls:</strong> App-controlled lighting, climate, security via SHELTR mobile app
                    </div>
                    <div>
                      <strong>System Monitoring:</strong> Real-time power, water, and environmental status dashboard
                    </div>
                    <div>
                      <strong>OTA Updates:</strong> Over-the-air firmware updates for all smart systems
                    </div>
                    <div>
                      <strong>Emergency Services:</strong> GPS tracking, SOS button, automatic emergency alerts
                    </div>
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

      {/* Accessories & Customization Section - NEW */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Settings className="h-10 w-10 text-purple-600" />
              <h2 className="text-4xl font-bold">Accessories & Customization</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Personalize your SHELTR pod with premium upgrades and optional accessories. 
              Each add-on is professionally engineered to integrate seamlessly with the base unit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Custom Paint Job */}
            <Card className="border-2 hover:border-purple-400 transition-all hover:shadow-xl group">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 text-center pb-6 pt-8">
                <div className="flex justify-center mb-4">
                  <Paintbrush className="h-12 w-12 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-xl mb-2">Custom Paint Job</CardTitle>
                <Badge className="bg-purple-600 mx-auto w-fit">Exterior</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Professional automotive-grade paint finishes with UV protection and anti-graffiti coating.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Standard Colors:</strong> 12 matte and gloss options
                  </div>
                  <div>
                    <strong>Custom Colors:</strong> Pantone color matching available
                  </div>
                  <div>
                    <strong>Special Finishes:</strong> Metallic, pearlescent, matte wraps
                  </div>
                  <div>
                    <strong>Durability:</strong> 10-year fade warranty
                  </div>
                  <div>
                    <strong>Process:</strong> 3-layer powder coat system
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Popular Options:</div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2" title="Matte Black" />
                    <div className="w-8 h-8 rounded-full bg-white border-2" title="Arctic White" />
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2" title="Ocean Blue" />
                    <div className="w-8 h-8 rounded-full bg-green-600 border-2" title="Forest Green" />
                  </div>
                </div>
                <Badge variant="outline" className="mt-4">+ $800 - $1,500</Badge>
              </CardContent>
            </Card>

            {/* Skylight */}
            <Card className="border-2 hover:border-blue-400 transition-all hover:shadow-xl group">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 text-center pb-6 pt-8">
                <div className="flex justify-center mb-4">
                  <Sun className="h-12 w-12 text-blue-600 dark:text-cyan-400" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-xl mb-2">Skylight Window</CardTitle>
                <Badge className="bg-blue-600 mx-auto w-fit">Roof</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Double-pane acrylic skylight with ventilation, blackout shade, and insect screen.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Size:</strong> 14&quot; × 14&quot; (Model A) | 22&quot; × 22&quot; (Model B)
                  </div>
                  <div>
                    <strong>Material:</strong> Impact-resistant acrylic (1/4&quot; thick)
                  </div>
                  <div>
                    <strong>UV Protection:</strong> 99% UV-blocking coating
                  </div>
                  <div>
                    <strong>Insulation:</strong> Double-pane with air gap (R-4)
                  </div>
                  <div>
                    <strong>Ventilation:</strong> Crank-operated opening mechanism
                  </div>
                  <div>
                    <strong>Shade:</strong> Honeycomb blackout blind with pull cord
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs">Increases natural light by 40%</span>
                  </div>
                </div>
                <Badge variant="outline" className="mt-4">+ $600 - $900</Badge>
              </CardContent>
            </Card>

            {/* Bunk Bed System */}
            <Card className="border-2 hover:border-green-400 transition-all hover:shadow-xl group">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 text-center pb-6 pt-8">
                <div className="flex justify-center mb-4">
                  <Bed className="h-12 w-12 text-green-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-xl mb-2">Bunk Bed System</CardTitle>
                <Badge className="bg-green-600 mx-auto w-fit">Interior</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Space-saving bunk bed configuration with integrated storage and safety rails.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Compatibility:</strong> Model B only
                  </div>
                  <div>
                    <strong>Dimensions:</strong> 2× 36&quot; × 75&quot; sleeping surfaces
                  </div>
                  <div>
                    <strong>Materials:</strong> Marine-grade plywood with birch veneer
                  </div>
                  <div>
                    <strong>Weight Capacity:</strong> 300 lbs per bunk
                  </div>
                  <div>
                    <strong>Mattresses:</strong> 6&quot; memory foam (included)
                  </div>
                  <div>
                    <strong>Safety:</strong> Removable guard rails, ladder with anti-slip steps
                  </div>
                  <div>
                    <strong>Storage:</strong> Under-bed drawers and side cubbies
                  </div>
                </div>
                <Badge variant="outline" className="mt-4">+ $1,200 - $1,800</Badge>
              </CardContent>
            </Card>

            {/* Premium Lighting */}
            <Card className="border-2 hover:border-yellow-400 transition-all hover:shadow-xl group">
              <CardHeader className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900 text-center pb-6 pt-8">
                <div className="flex justify-center mb-4">
                  <Lightbulb className="h-12 w-12 text-yellow-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-xl mb-2">Premium Lighting</CardTitle>
                <Badge className="bg-yellow-600 mx-auto w-fit">Electrical</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Smart LED lighting system with color tuning, dimming, and automated schedules.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>System:</strong> RGB+CCT smart LED strips (3000K-6500K)
                  </div>
                  <div>
                    <strong>Brightness:</strong> 2,000 lumens total output
                  </div>
                  <div>
                    <strong>Control:</strong> App, voice (Alexa/Google), wall switch
                  </div>
                  <div>
                    <strong>Zones:</strong> 4× independent lighting zones
                  </div>
                  <div>
                    <strong>Power Draw:</strong> 15W max (90% more efficient)
                  </div>
                  <div>
                    <strong>Features:</strong> Color scenes, circadian rhythm mode, motion sensor
                  </div>
                  <div>
                    <strong>Lifespan:</strong> 50,000 hours (15 years @ 8hrs/day)
                  </div>
                </div>
                <Badge variant="outline" className="mt-4">+ $400 - $650</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Additional Upgrades Grid */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">Additional Upgrades & Options</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Snowflake className="h-6 w-6 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">Arctic Package</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enhanced insulation (R-30 walls), heated floor mat, propane heater upgrade, -40°C rated windows.
                      </p>
                      <Badge variant="outline">+ $2,000</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Battery className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">Power Pro Package</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        400W solar panels, 200Ah battery upgrade, 2000W inverter, shore power hookup with automatic transfer switch.
                      </p>
                      <Badge variant="outline">+ $3,500</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">Security Plus</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Interior/exterior cameras, motion sensors, alarm system, cellular monitoring, reinforced door lock.
                      </p>
                      <Badge variant="outline">+ $1,200</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Wind className="h-6 w-6 text-cyan-500 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">Climate Control Pro</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Upgraded 8,000 BTU mini-split A/C, humidity control, air purifier with HEPA filters, smart thermostat.
                      </p>
                      <Badge variant="outline">+ $1,800</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Monitor className="h-6 w-6 text-indigo-500 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">Smart Home Package</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Voice assistant hub, smart blinds, automated climate controls, touchscreen control panel, app integration.
                      </p>
                      <Badge variant="outline">+ $900</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Droplets className="h-6 w-6 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">Water Upgrade</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        40L fresh water tank, 40L gray water tank, water heater (6L), filtration upgrade, shower attachment.
                      </p>
                      <Badge variant="outline">+ $1,500</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Custom Configuration CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
            <Settings className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-bold mb-3">Need a Custom Configuration?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our engineering team can design bespoke modifications and integrations for your specific needs. 
              From medical equipment installations to specialized communication systems.
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Request Custom Quote
            </Button>
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
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Request More Information
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
