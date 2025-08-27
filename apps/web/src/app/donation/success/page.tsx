'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Heart, Home, Share2, Mail, ArrowRight, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import confetti from 'canvas-confetti';

function SuccessPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [showAnimation, setShowAnimation] = useState(false);
  
  const isDemo = searchParams.get('demo') === 'true';
  const amount = searchParams.get('amount') || '100';
  const participantName = searchParams.get('participant') || 'Michael';
  const reference = searchParams.get('ref') || 'DEMO-' + Date.now();

  // Calculate SmartFund breakdown
  const donationAmount = parseFloat(amount);
  const breakdown = {
    total: donationAmount,
    direct: Math.round(donationAmount * 0.80 * 100) / 100,
    housing: Math.round(donationAmount * 0.15 * 100) / 100,
    operations: Math.round(donationAmount * 0.05 * 100) / 100,
  };

  useEffect(() => {
    // Trigger celebration animation
    const timer = setTimeout(() => {
      setShowAnimation(true);
      
      // Confetti celebration
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'I just donated to SHELTR!',
      text: `I made a $${amount} donation to support ${participantName} through SHELTR's transparent donation platform. 80% goes directly to those in need!`,
      url: window.location.origin + '/scan-give',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Shared to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 transition-all duration-1000 ${showAnimation ? 'scale-110' : 'scale-100'}`}>
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
              Donation Successful! 🎉
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Thank you for supporting {participantName} through SHELTR
            </p>

            {isDemo && (
              <Badge variant="secondary" className="mt-3 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                🎭 Demo Complete - Experience the full SHELTR flow!
              </Badge>
            )}
          </div>

          {/* Donation Summary */}
          <Card className="mb-6 shadow-lg border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Your Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total Donation:</span>
                  <span className="font-bold text-green-600">${breakdown.total}</span>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Direct to {participantName}</div>
                      <div className="text-sm text-muted-foreground">Immediate support</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">80% • ${breakdown.direct}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Housing Fund</div>
                      <div className="text-sm text-muted-foreground">Long-term solutions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">15% • ${breakdown.housing}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Platform Operations</div>
                      <div className="text-sm text-muted-foreground">Secure & transparent</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">5% • ${breakdown.operations}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mt-4">
                  <div className="text-sm text-muted-foreground">
                    <strong>Transaction Reference:</strong> {reference}
                  </div>
                  {isDemo && (
                    <div className="text-sm text-blue-600 mt-1">
                      This was a demonstration - no real payment was processed
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Visualization */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Immediate Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">${breakdown.direct}</div>
                  <div className="text-sm text-muted-foreground">
                    Available immediately to {participantName}
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Instant</div>
                  <div className="text-sm text-muted-foreground">
                    Transfer to digital wallet
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-muted-foreground">
                    Blockchain verified
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Continue Your SHELTR Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="h-12"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Impact
                </Button>
                
                <Link href="/register">
                  <Button className="w-full h-12">
                    <Mail className="h-4 w-4 mr-2" />
                    Get Updates
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Join SHELTR to track your impact and support more participants
                </p>
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Create SHELTR Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <div className="flex gap-4 justify-center">
              <Link href="/scan-give">
                <Button variant="outline" size="lg">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Scan & Give
                </Button>
              </Link>
              
              {participantName && (
                <Link href={`/participant/michael-rodriguez`}>
                  <Button variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-50">
                    <User className="h-4 w-4 mr-2" />
                    View {participantName}'s Profile
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Help us end homelessness, one scan at a time.
            </div>
          </div>

          {/* Demo Info */}
          {isDemo && (
            <Card className="mt-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    🎭 Demo Experience Complete!
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                    You've experienced SHELTR's complete donation flow with Adyen payment processing. 
                    In production, this would process real payments and create actual blockchain transactions.
                  </p>
                  <div className="space-y-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <div>✅ QR Code Generation</div>
                    <div>✅ Participant Profile Display</div>
                    <div>✅ SmartFund™ Breakdown Calculation</div>
                    <div>✅ Adyen Payment Session Creation</div>
                    <div>✅ Success Flow & Impact Visualization</div>
                  </div>
                  
                  {/* Test Donation Button for Old Brewery Mission */}
                  <button 
                    onClick={async () => {
                      console.log('🧪 Test donation button clicked!');
                      try {
                        console.log('📦 Importing Firebase...');
                        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
                        const { db } = await import('@/lib/firebase');
                        console.log('✅ Firebase imported successfully');
                        
                        const donationData = {
                          participant_id: 'michael-rodriguez',
                          participant_name: 'Michael Rodriguez',
                          shelter_id: 'YDJCJnuLGMC9mWOWDSOa', // Old Brewery Mission tenant ID
                          shelter_name: 'Old Brewery Mission',
                          recipient_id: 'YDJCJnuLGMC9mWOWDSOa', // Ensure both fields
                          amount: { total: 100, currency: 'USD' },
                          donor_id: user?.uid || null, // **FIX: Include user ID for tracking**
                          donor_info: { 
                            name: user?.displayName || user?.email || 'Demo User', 
                            email: user?.email || 'demo.user@example.com' 
                          },
                          status: 'completed',
                          type: 'one-time',
                          purpose: 'Test donation from success page',
                          payment_data: { adyen_reference: `TEST-${Date.now()}`, status: 'completed' },
                          created_at: serverTimestamp(),
                          updated_at: serverTimestamp(),
                          demo: true,
                          source: user?.uid ? 'scan-give-success-page-logged-in' : 'scan-give-success-page-anonymous'
                        };
                        
                        console.log('📝 Creating donation with data:', donationData);
                        const docRef = await addDoc(collection(db, 'demo_donations'), donationData);
                        console.log('✅ Donation created with ID:', docRef.id);
                        
                        // Also add to tenant-specific collection
                        console.log('📝 Adding to tenant collection...');
                        await addDoc(collection(db, `tenants/YDJCJnuLGMC9mWOWDSOa/donations`), donationData);
                        console.log('✅ Added to tenant collection!');
                        
                        const donorMessage = user?.uid ? 
                          `✅ Test donation added and tracked to ${user.email || 'your account'}! Check your donor dashboard.` :
                          '✅ Test donation added to Old Brewery Mission! Log in to track your donations.';
                        alert(donorMessage);
                      } catch (error) {
                        console.error('❌ Error creating test donation:', error);
                        alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }}
                    className="w-full mt-4 px-4 py-2 border border-green-500 text-green-600 bg-white hover:bg-green-50 rounded-md text-sm font-medium transition-colors"
                  >
                    🧪 {user?.uid ? `Add Tracked Donation (${user.email})` : 'Add Test Donation to Metrics'}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}