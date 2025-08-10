'use client';

import Link from 'next/link';
import { Home, QrCode, Heart, Shield, Smartphone, ArrowRight, Check, LogIn, Menu, X, Camera, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';
import { DemoQRModal } from '@/components/demo/DemoQRModal';

export default function ScanGivePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoQR, setShowDemoQR] = useState(false);
  const [demoParticipant, setDemoParticipant] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTryDemo = async () => {
    setLoading(true);
    try {
      // Check if we're in production and backend is not available
      const isProduction = process.env.NODE_ENV === 'production';
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (isProduction && apiBaseUrl?.includes('api.sheltr-ai.com')) {
        // Use mock data for production demo until backend is deployed
        const mockParticipant = {
          id: "demo-participant-001",
          firstName: "Alex",
          lastName: "Thompson",
          age: 28,
          story: "Former chef who lost housing due to medical emergency. Working towards stability through SHELTR services. Alex is passionate about cooking and hopes to open a food truck once housing is secured.",
          shelter_name: "Downtown Community Shelter",
          location: { city: "San Francisco", state: "CA", zipcode: "94102" },
          goals: [
            { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 75, status: "in_progress", target_date: "2024-09-01" },
            { id: "employment-goal", title: "Find Employment", description: "Secure full-time work in food service", progress: 60, status: "in_progress", target_date: "2024-08-15" },
            { id: "financial-goal", title: "Financial Stability", description: "Build emergency fund and credit score", progress: 40, status: "in_progress", target_date: "2024-12-01" }
          ],
          skills: ["Cooking", "Food Safety", "Customer Service", "Team Leadership"],
          interests: ["Culinary Arts", "Nutrition", "Community Gardening"],
          total_received: 2847.5,
          donation_count: 52,
          services_completed: 8,
          progress: 65,
          qr_code: "SHELTR-DEMO-2D88F",
          featured: true,
          demo: true
        };
        
        // Generate QR code URL directly
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=demo-participant-001`)}&format=png`;
        
        setDemoParticipant(mockParticipant);
        setQrCodeUrl(qrCodeUrl);
        setShowDemoQR(true);
        return;
      }
      
      // Try to call backend API (development mode)
      const response = await fetch(`${apiBaseUrl}/demo/donations/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setDemoParticipant(result.data.participant);
        setQrCodeUrl(result.data.qr_code_url);
        setShowDemoQR(true);
      } else {
        console.error('Failed to generate demo QR:', result.message);
        alert('Failed to generate demo QR code. Please try again.');
      }
    } catch (error) {
      console.error('Error generating demo QR:', error);
      
      // Fallback to mock data if API call fails
      const mockParticipant = {
        id: "demo-participant-001",
        firstName: "Alex",
        lastName: "Thompson",
        age: 28,
        story: "Former chef who lost housing due to medical emergency. Working towards stability through SHELTR services. Alex is passionate about cooking and hopes to open a food truck once housing is secured.",
        shelter_name: "Downtown Community Shelter",
        location: { city: "San Francisco", state: "CA", zipcode: "94102" },
        goals: [
          { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 75, status: "in_progress", target_date: "2024-09-01" },
          { id: "employment-goal", title: "Find Employment", description: "Secure full-time work in food service", progress: 60, status: "in_progress", target_date: "2024-08-15" },
          { id: "financial-goal", title: "Financial Stability", description: "Build emergency fund and credit score", progress: 40, status: "in_progress", target_date: "2024-12-01" }
        ],
        skills: ["Cooking", "Food Safety", "Customer Service", "Team Leadership"],
        interests: ["Culinary Arts", "Nutrition", "Community Gardening"],
        total_received: 2847.5,
        donation_count: 52,
        services_completed: 8,
        progress: 65,
        qr_code: "SHELTR-DEMO-2D88F",
        featured: true,
        demo: true
      };
      
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=demo-participant-001`)}&format=png`;
      
      setDemoParticipant(mockParticipant);
      setQrCodeUrl(qrCodeUrl);
      setShowDemoQR(true);
    } finally {
      setLoading(false);
    }
  };
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
              <Link href="/scan-give" className="text-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-4">
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
              <Link href="/scan-give" className="block text-foreground hover:text-primary transition-colors py-2">Scan & Give</Link>
              <Link href="/tokenomics" className="block text-muted-foreground hover:text-primary transition-colors py-2">Tokenomics</Link>
              <Link href="/impact" className="block text-muted-foreground hover:text-primary transition-colors py-2">Impact</Link>
              <div className="border-t pt-4 space-y-3">
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
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        className="py-24 relative"
        style={{
          backgroundImage: "url('/backgrounds/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">Instant Impact</Badge>
          <h1 className="text-4xl font-bold mb-6 text-white">
            Scan & Give in Seconds
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Put money directly into the hands of those who need it most.
          </p>
          <Button 
            size="lg" 
            onClick={handleTryDemo}
            disabled={loading}
          >
            <QrCode className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Try Demo QR Code'}
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to make a direct impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Red for Scan QR Code */}
            <Card className="group text-center border-2 border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 active:border-red-400 dark:active:border-red-600 hover:shadow-xl hover:scale-105 active:scale-105 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/20 transition-colors">
                  <QrCode className="h-6 w-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">1. Scan QR Code</CardTitle>
                <CardDescription>
                  Use your phone camera to scan a participant&apos;s unique QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-lg mx-auto flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-500/20 transition-all">
                  <QrCode className="h-16 w-16 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Yellow for Choose Amount */}
            <Card className="group text-center border-2 border-gray-200 dark:border-gray-800 hover:border-yellow-300 dark:hover:border-yellow-700 active:border-yellow-400 dark:active:border-yellow-600 hover:shadow-xl hover:scale-105 active:scale-105 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
                  <Heart className="h-6 w-6 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">2. Choose Amount</CardTitle>
                <CardDescription>
                  Select your donation amount with transparent breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-yellow-500/20 rounded-lg p-3 group-hover:bg-yellow-500/30 transition-colors">
                    <div className="text-sm font-medium">$10 Donation</div>
                    <div className="text-xs text-muted-foreground">$8.00 Direct • $1.50 Housing • $0.50 Shelter Operations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Green for Instant Transfer */}
            <Card className="group text-center border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 active:border-green-400 dark:active:border-green-600 hover:shadow-xl hover:scale-105 active:scale-105 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">3. Instant Transfer</CardTitle>
                <CardDescription>
                  Secure blockchain transaction delivers funds immediately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-48 h-32 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-lg mx-auto flex items-center justify-center mb-4 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                      <span>Verified Transfer</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                      <span>Blockchain Recorded</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                      <span>Instant Notification</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SmartFund Breakdown */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Distribution</h2>
            <p className="text-xl text-muted-foreground">
              Every donation is automatically split to maximize impact
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div>
                    <div className="font-semibold text-green-700 dark:text-green-400">Direct Support</div>
                    <div className="text-sm text-muted-foreground">Immediate participant assistance</div>
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">80%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-400">Housing Fund</div>
                    <div className="text-sm text-muted-foreground">Long-term housing solutions</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">15%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <div>
                    <div className="font-semibold text-gray-700 dark:text-gray-400">Shelter Operations</div>
                    <div className="text-sm text-muted-foreground">In-house Platform maintenance & security</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">5%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of donors making direct, transparent contributions to end homelessness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                <QrCode className="h-4 w-4 mr-2" />
                Find QR Codes Near Me
              </Button>
            </Link>
            <Link href="/solutions/organizations">
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Become a Partner Shelter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Demo QR Modal */}
      <DemoQRModal 
        open={showDemoQR}
        onOpenChange={setShowDemoQR}
        participant={demoParticipant}
        qrCodeUrl={qrCodeUrl}
      />
    </div>
  );
} 