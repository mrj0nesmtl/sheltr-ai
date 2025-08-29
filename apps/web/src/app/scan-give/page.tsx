'use client';

import Link from 'next/link';
import { Home, QrCode, Heart, Shield, Smartphone, ArrowRight, Check, LogIn, Menu, X, Camera, Share2, BarChart3, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';
import { DemoQRModal } from '@/components/demo/DemoQRModal';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDonationMetrics } from '@/services/donationMetricsService';

export default function ScanGivePage() {
  const { user, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoQR, setShowDemoQR] = useState(false);
  const [demoParticipant, setDemoParticipant] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Use unified donation metrics service for consistency
  const getMichaelRealData = async () => {
    return await getDonationMetrics('michael-rodriguez');
  };

  const handleTryDemo = async () => {
    setLoading(true);
    try {
      // Fetch real Michael Rodriguez data from API
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      try {
        // Fetch real participant data from API
        const response = await fetch(`${apiBaseUrl}/demo/donations/participant/michael-rodriguez`);
        if (response.ok) {
          const data = await response.json();
          const realParticipant = data.data.participant;
          
          // Generate QR code URL for Michael Rodriguez
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=michael-rodriguez`)}&format=png`;
          
          setDemoParticipant(realParticipant);
          setQrCodeUrl(qrCodeUrl);
          setShowDemoQR(true);
          console.log('✅ Loaded real Michael Rodriguez data:', realParticipant);
        } else {
          throw new Error('Failed to fetch participant data');
        }
      } catch (apiError) {
        console.warn('⚠️ API call failed, using fallback data with real donation metrics:', apiError);
        
        // Get Michael's real donation data from Firestore
        const realDonationData = await getMichaelRealData();
        
        // Fallback to hardcoded data if API fails, but with real donation metrics
        const fallbackParticipant = {
          id: "michael-rodriguez",
          firstName: "Michael",
          lastName: "Rodriguez",
          age: 32,
          story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
          shelter_name: "Old Brewery Mission",
          shelter_id: "YDJCJnuLGMC9mWOWDSOa", // Actual tenant ID from migration
          location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
          goals: [
            { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 68, status: "in_progress", target_date: "2024-10-01" },
            { id: "employment-goal", title: "Career Development", description: "Build skills and secure meaningful employment", progress: 55, status: "in_progress", target_date: "2024-09-15" },
            { id: "community-goal", title: "Community Engagement", description: "Give back and help others in similar situations", progress: 42, status: "in_progress", target_date: "2024-12-01" }
          ],
          skills: ["Communication", "Leadership", "Problem Solving", "Community Outreach"],
          interests: ["Community Service", "Personal Development", "Mentoring", "Social Impact"],
          total_received: realDonationData.total_received, // Real donation total
          donation_count: realDonationData.donation_count, // Real donation count
          services_completed: realDonationData.services_completed, // Real or demo services
          progress: 55,
          qr_code: "SHELTR-MICHAEL-REAL",
          featured: true,
          demo: true
        };
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=michael-rodriguez`)}&format=png`;
        
        setDemoParticipant(fallbackParticipant);
        setQrCodeUrl(qrCodeUrl);
        setShowDemoQR(true);
      }
    } catch (error) {
      console.error('Error generating demo QR:', error);
      alert('Failed to generate demo QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailSubmitting(true);
    setEmailError('');

    try {
      // Add email to Firestore
      await addDoc(collection(db, 'newsletter_signups'), {
        email: email.toLowerCase().trim(),
        source: 'mobile_app_teaser',
        page: 'scan-give',
        signup_date: serverTimestamp(),
        ip_address: null, // Could be added if needed
        user_agent: navigator.userAgent,
        status: 'active'
      });

      setEmailSubmitted(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setEmailSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error saving email signup:', error);
      setEmailError('Failed to sign up. Please try again.');
    } finally {
      setEmailSubmitting(false);
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
                {user ? (
                  // Logged in user navigation
                  <>
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.displayName || user.email}
                    </span>
                    <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'}>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Non-logged in navigation
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
              <Link href="/scan-give" className="block text-foreground hover:text-primary transition-colors py-2">Scan & Give</Link>
              <Link href="/tokenomics" className="block text-muted-foreground hover:text-primary transition-colors py-2">Tokenomics</Link>
              <Link href="/impact" className="block text-muted-foreground hover:text-primary transition-colors py-2">Impact</Link>
              <div className="border-t pt-4 space-y-3">
                {user ? (
                  // Logged in mobile menu
                  <>
                    <div className="text-sm text-muted-foreground px-3 py-2">
                      Welcome, {user.displayName || user.email}
                    </div>
                    <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'} className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Non-logged in mobile menu
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

      {/* Donor Login Section */}
      {!user ? (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                Connect Your Account
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Track Your Impact</h2>
              <p className="text-xl text-muted-foreground">
                Log in to connect your donations to your SHELTR account and see your impact metrics in real-time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Donation Dashboard
                  </CardTitle>
                  <CardDescription>
                    View all your donations, impact metrics, and tax documents in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Track total donations and impact
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Download tax receipts
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      See participant progress
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-purple-600" />
                    SHELTR Rewards
                  </CardTitle>
                  <CardDescription>
                    Earn SHELTR tokens and build your blockchain giving portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Earn 1 token per $10 donated
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Portfolio tracking
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Future utility features
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Track Donations
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                ✓ Account Connected
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Welcome back, {user.displayName || user.email}!</h2>
              <p className="text-xl text-muted-foreground">
                Your donations will be automatically tracked in your dashboard. Ready to make a difference?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hasRole('donor') ? (
                <Link href="/dashboard/donor">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
              )}
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleTryDemo}
                disabled={loading}
              >
                <QrCode className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Try Demo Now'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Mobile App Coming Soon */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
            Coming Soon
          </Badge>
          <h2 className="text-3xl font-bold mb-6">SHELTR Mobile App</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Scan QR codes, make instant donations, and track your impact - all from your mobile device.
          </p>
          
          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="relative">
              <Button 
                size="lg" 
                variant="outline" 
                disabled
                className="cursor-not-allowed opacity-60 bg-black text-white hover:bg-black border-black dark:bg-white dark:text-black dark:hover:bg-white dark:border-white"
              >
                <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download on the App Store
              </Button>
            </div>
            
            <div className="relative">
              <Button 
                size="lg" 
                variant="outline" 
                disabled
                className="cursor-not-allowed opacity-60"
              >
                <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Get it on Google Play
              </Button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Instant QR Scanning</h3>
              <p className="text-sm text-muted-foreground">Native camera integration for seamless QR code scanning</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">One-Tap Donations</h3>
              <p className="text-sm text-muted-foreground">Quick donation amounts with biometric authentication</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Impact Tracking</h3>
              <p className="text-sm text-muted-foreground">Real-time notifications and donation history</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border">
            {emailSubmitted ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                  Thanks for signing up!
                </h3>
                <p className="text-sm text-muted-foreground">
                  We'll notify you as soon as the SHELTR mobile app is available.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold mb-4">Be the first to know when the app launches</h3>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={emailSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-50"
                      required
                    />
                    <Button type="submit" disabled={emailSubmitting || !email}>
                      {emailSubmitting ? 'Signing up...' : 'Notify Me'}
                    </Button>
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      {emailError}
                    </p>
                  )}
                </form>
              </>
            )}
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