'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Fingerprint, 
  Smartphone,
  Wifi,
  Battery,
  Key,
  Eye,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowLeft,
  Monitor,
  Server,
  Globe
} from 'lucide-react';
import Footer from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

export default function SecurityPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/security', '/images/sheltr_units/security.jpeg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <PublicNavigation />

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="Security & Privacy"
        badgeVariant="secondary"
        badgeClassName="bg-blue-500/20 text-blue-300 border-blue-500/30"
        title="Advanced Security System"
        subtitle="Multi-layer protection with biometric authentication, smart locks, and remote control. Your safety, privacy, and dignity protected at every level."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="#security-features">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Shield className="h-4 w-4 mr-2" />
              Explore Security Features
            </Button>
          </Link>
          <Link href="/pods">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Eye className="h-4 w-4 mr-2" />
              View PODS
            </Button>
          </Link>
        </div>
      </StandardHero>

      {/* Security Features Overview */}
      <section id="security-features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Multi-Layer Protection</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SHELTR PODS feature state-of-the-art security systems designed to protect participants 
              while maintaining dignity and ease of access.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <Fingerprint className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Biometric Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>99.9% recognition accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Optical & capacitive sensors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>AES-256 encrypted storage</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">Smart Keypad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>4-8 digit PIN codes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Backlit capacitive touch</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Weather-resistant design</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <Smartphone className="h-16 w-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">Remote Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Web app control</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Real-time status updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Emergency override access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Technical Specifications</h2>
            <p className="text-xl text-muted-foreground">
              Enterprise-grade security with fail-safe design and redundant power systems
            </p>
          </div>

          <Tabs defaultValue="hardware" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
              <TabsTrigger value="power">Power</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="connectivity">API Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hardware" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Lock Body & Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Casing:</span>
                      <span>Powder-coated aluminum alloy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Handle:</span>
                      <span>Stainless steel (black anodized)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weatherproofing:</span>
                      <span>IP65-rated enclosure</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Electronics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processor:</span>
                      <span>ARM Cortex-M4 120MHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recognition:</span>
                      <span>99.9% accuracy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connectivity:</span>
                      <span>WiFi, BLE 5.0, Optional LoRa</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="power" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Power System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Primary Power:</span>
                      <span>12V DC (solar/battery system)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Backup Battery:</span>
                      <span>3.7V 5000mAh Li-ion</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Runtime:</span>
                      <span>36-48 hours backup power</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Battery className="h-5 w-5" />
                      Fail-Safe Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Mechanical key override if battery dead</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Local PIN/biometric works offline</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Tamper alerts to central system</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Encryption & Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Local Encryption:</span>
                      <span>AES-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Communication:</span>
                      <span>TLS 1.3 End-to-End</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificates:</span>
                      <span>Mutual Authentication</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Access Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Multi-factor: PIN + Biometric</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Remote app unlock</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Emergency mechanical override</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connectivity" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      API Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-mono bg-muted p-2 rounded mb-1">
                        POST /api/v1/lock/{'{device_id}'}/unlock
                      </div>
                      <div className="text-muted-foreground">Remote unlock command</div>
                    </div>
                    <div>
                      <div className="font-mono bg-muted p-2 rounded mb-1">
                        POST /api/v1/lock/{'{device_id}'}/lock
                      </div>
                      <div className="text-muted-foreground">Remote lock command</div>
                    </div>
                    <div>
                      <div className="font-mono bg-muted p-2 rounded mb-1">
                        GET /api/v1/lock/{'{device_id}'}/status
                      </div>
                      <div className="text-muted-foreground">Real-time status & battery</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Web App Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span>Real-time lock/unlock control</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span>Access logs & event history</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span>Battery status & alerts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span>Optional geofencing</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Privacy & Data Protection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Privacy & Data Protection</h2>
            <p className="text-xl text-muted-foreground">
              Your privacy and dignity are fundamental rights we protect at every level
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400 flex items-center gap-3">
                  <Shield className="h-8 w-8" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Local Storage:</strong> Biometric data never leaves the device
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Encrypted Communication:</strong> All data transmission uses TLS 1.3
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Access Logs:</strong> Minimal data collection with participant consent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400 flex items-center gap-3">
                  <Eye className="h-8 w-8" />
                  Participant Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Full Control:</strong> You control your own access methods and data
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>No Surveillance:</strong> No cameras or audio recording inside PODS
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <strong>Data Deletion:</strong> Right to remove all personal data anytime
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Security Meets Dignity</h2>
          <p className="text-xl mb-8 opacity-90">
            Advanced protection that respects your privacy and empowers your independence
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pods">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Eye className="h-4 w-4 mr-2" />
                Explore PODS
              </Button>
            </Link>
            <Link href="/solutions/participants">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Shield className="h-4 w-4 mr-2" />
                Learn More About SHELTR
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
