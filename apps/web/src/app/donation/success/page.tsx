'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Heart, Home, Share2, ArrowRight, Sparkles, User } from 'lucide-react';
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
  const donationCreatedRef = useRef(false); // Prevent duplicate creation
  
  const isDemo = searchParams.get('demo') === 'true';
  const amount = searchParams.get('amount') || '100';
  const participantName = searchParams.get('participant') || 'Michael';
  const shelterName = searchParams.get('shelter') || 'Old Brewery Mission';
  const reference = searchParams.get('ref') || searchParams.get('reference') || 'DEMO-' + Date.now();
  
  // 🆕 Detect donation type
  // If 'participant' param exists, it's a participant donation
  // If only 'shelter' param exists, it's a direct shelter donation
  const hasParticipant = !!searchParams.get('participant');
  const donationType = hasParticipant ? 'participant' : 'shelter';
  
  // Generate profile links
  const participantSlug = 'michael-rodriguez'; // Could be derived from participantName
  const shelterSlug = 'old-brewery-mission'; // Could be derived from shelterName

  // Calculate SmartFund™ breakdown based on donation type
  const donationAmount = parseFloat(amount);
  const breakdown = donationType === 'shelter' 
    ? {
        // 🏠 DIRECT SHELTER DONATION: 95% to shelter, 5% platform
        total: donationAmount,
        shelter: Math.round(donationAmount * 0.95 * 100) / 100,
        platform: Math.round(donationAmount * 0.05 * 100) / 100,
      }
    : {
        // 🧑 PARTICIPANT DONATION: 80-15-5 SmartFund model
        total: donationAmount,
        direct: Math.round(donationAmount * 0.80 * 100) / 100,
        housing: Math.round(donationAmount * 0.15 * 100) / 100,
        operations: Math.round(donationAmount * 0.05 * 100) / 100,
      };

  useEffect(() => {
    // Trigger celebration animation and create donation automatically
    const timer = setTimeout(async () => {
      setShowAnimation(true);
      
      // Create donation automatically for demo donations (ONLY ONCE)
      if (isDemo && user?.uid && !donationCreatedRef.current) {
        donationCreatedRef.current = true; // Mark as created immediately
        
        try {
          console.log('🎯 Automatically creating demo donation with SmartFund distribution...');
          const { addDoc, collection, serverTimestamp, doc, updateDoc, increment } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase');
          
          // Calculate SmartFund distribution
          const totalAmount = parseFloat(amount);
          const directAmount = Math.round(totalAmount * 0.80 * 100) / 100;
          const housingAmount = Math.round(totalAmount * 0.15 * 100) / 100;
          const operationsAmount = Math.round(totalAmount * 0.05 * 100) / 100;
          
          // Get Michael's actual Firebase UID (not the slug)
          const participantUserId = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1'; // Michael's Firebase UID
          
          const donationData = {
            participant_id: participantUserId, // Use Firebase UID instead of slug
            participant_slug: 'michael-rodriguez', // Keep slug for reference
            participant_name: participantName,
            shelter_id: 'old-brewery-mission',
            shelter_name: 'Old Brewery Mission',
            amount: { 
              total: totalAmount, 
              currency: 'USD',
              breakdown: {
                direct: directAmount,
                housing: housingAmount,
                operations: operationsAmount
              }
            },
            donor_id: user.uid,
            donor_info: { 
              name: user.displayName || user.email || 'Anonymous Donor', 
              email: user.email || 'anonymous@sheltr.ai',
              donor_id: user.uid
            },
            status: 'completed',
            type: 'one-time',
            purpose: 'Demo donation from scan-give',
            payment_data: { 
              adyen_reference: reference, 
              status: 'completed' 
            },
            smartfund_distribution: {
              total: totalAmount,
              direct: directAmount,
              housing: housingAmount,
              shelter_operations: operationsAmount,
              currency: 'USD',
              recipient_type: 'shelter',
              shelter_id: 'old-brewery-mission',
              shelter_name: 'Old Brewery Mission',
              processed_at: new Date().toISOString(),
              status: 'completed'
            },
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            completed_at: serverTimestamp(),
            demo: true,
            source: 'scan-give-logged-in',
            anonymous: false,
            public: true
          };
          
          console.log('📝 Creating demo donation with SmartFund:', donationData);
          // TODO: Switch to tenant-specific collection when payment rails are ready
          // const docRef = await addDoc(collection(db, 'tenants/YDJCJnuLGMC9mWOWDSOa/donations'), donationData);
          const docRef = await addDoc(collection(db, 'demo_donations'), donationData);
          console.log('✅ Demo donation created with ID:', docRef.id);
          
          // Update Michael's participant stats via backend API (bypasses security rules)
          try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${apiBaseUrl}/api/v1/demo/donations/update-participant-stats`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                participant_id: participantUserId,
                direct_amount: directAmount,
                housing_amount: housingAmount
              })
            });
            
            if (response.ok) {
              console.log('✅ Updated participant stats via API:', { 
                participantId: participantUserId,
                direct: directAmount,
                housing: housingAmount 
              });
            } else {
              console.error('❌ API error updating participant stats:', await response.text());
            }
          } catch (error) {
            console.error('❌ Error updating participant stats:', error);
          }
          
          // ✅ NEW: Create notifications for BOTH donor and participant
          try {
            console.log('🔔 Starting notification creation...');
            console.log('   Donor ID:', user.uid);
            console.log('   Participant ID:', participantUserId);
            console.log('   Amount:', totalAmount);
            
            const { notifyDonationComplete } = await import('@/services/donationNotificationService');
            console.log('✅ notifyDonationComplete function imported');
            
            const notificationResult = await notifyDonationComplete({
              donationId: docRef.id,
              donorId: user.uid,
              donorName: user.displayName || user.email || 'Anonymous Donor',
              participantId: participantUserId,
              participantName: participantName,
              totalAmount: totalAmount,
              directAmount: directAmount,
              housingAmount: housingAmount,
              shelterAmount: operationsAmount
            });
            console.log('✅ Created donor & participant notifications:', notificationResult);
          } catch (error) {
            console.error('❌ Error creating donation notifications:', error);
            console.error('❌ Error details:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined
            });
          }
          
          // Update Old Brewery Mission shelter operations
          try {
            const shelterRef = doc(db, 'shelters', 'old-brewery-mission');
            await updateDoc(shelterRef, {
              operations_revenue: increment(operationsAmount),
              total_donations_received: increment(totalAmount),
              updated_at: serverTimestamp()
            });
            console.log('✅ Updated Old Brewery Mission operations:', { operations: operationsAmount });
          } catch (error) {
            console.error('❌ Error updating shelter operations:', error);
          }
          
          // Update donor (Jane's) stats
          try {
            const donorRef = doc(db, 'users', user.uid);
            await updateDoc(donorRef, {
              totalDonated: increment(totalAmount),
              donation_count: increment(1),
              updated_at: serverTimestamp()
            });
            console.log('✅ Updated donor stats:', { donor: user.uid, amount: totalAmount });
          } catch (error) {
            console.error('❌ Error updating donor stats:', error);
          }
          
        } catch (error) {
          console.error('❌ Error creating automatic demo donation:', error);
        }
      }
      
      // Confetti celebration (with error handling for production)
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: Record<string, unknown>) {
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
      } catch (confettiError) {
        console.warn('⚠️ Confetti failed to load:', confettiError);
        // Fallback: just show the success animation
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isDemo, amount, participantName, reference, user]);

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
              Thank you for supporting{' '}
              {donationType === 'participant' ? (
                <Link href={`/participant/${participantSlug}`} className="text-primary hover:underline font-medium">
                  {participantName}
                </Link>
              ) : (
                <Link href={`/${shelterSlug}`} className="text-primary hover:underline font-medium">
                  {shelterName}
                </Link>
              )}
              {' '}through SHELTR
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
                  {donationType === 'shelter' ? (
                    // 🏠 SHELTER DONATION BREAKDOWN
                    <>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">
                            Direct support for{' '}
                            <Link href={`/${shelterSlug}`} className="text-primary hover:underline">
                              {shelterName}
                            </Link>
                          </div>
                          <div className="text-sm text-muted-foreground">Operations & participant services</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">95% • ${breakdown.shelter}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Platform Operations</div>
                          <div className="text-sm text-muted-foreground">Secure & transparent</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">5% • ${breakdown.platform}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // 🧑 PARTICIPANT DONATION BREAKDOWN
                    <>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">
                            Direct to{' '}
                            <Link href={`/participant/${participantSlug}`} className="text-primary hover:underline">
                              {participantName}
                            </Link>
                          </div>
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
                    </>
                  )}
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
              {donationType === 'shelter' ? (
                // 🏠 SHELTER DONATION IMPACT
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${breakdown.shelter}</div>
                    <div className="text-sm text-muted-foreground">
                      Supporting operations at{' '}
                      <Link href={`/${shelterSlug}`} className="text-primary hover:underline font-medium">
                        {shelterName}
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-muted-foreground">
                      Blockchain verified
                    </div>
                  </div>
                </div>
              ) : (
                // 🧑 PARTICIPANT DONATION IMPACT
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">${breakdown.direct}</div>
                    <div className="text-sm text-muted-foreground">
                      Available immediately to{' '}
                      <Link href={`/participant/${participantSlug}`} className="text-primary hover:underline font-medium">
                        {participantName}
                      </Link>
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
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Continue Your SHELTR Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="h-11"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Impact
                </Button>
                
                <Link href={`/participant/${participantSlug}`}>
                  <Button variant="outline" className="w-full h-11 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30">
                    <User className="h-4 w-4 mr-2" />
                    View {participantName}&apos;s Profile
                  </Button>
                </Link>
              </div>
              
              <div className="text-center pt-2">
                {user ? (
                  // Logged-in users see dashboard link
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Track your impact and view donation history
                    </p>
                    <Link href="/dashboard/donor">
                      <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Go to Your Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  // Anonymous users see account creation
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Create an account to track your impact and support more participants
                    </p>
                    <Link href="/register">
                      <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Create SHELTR Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <div className="text-center space-y-4">
            <Link href="/scan-give">
              <Button variant="outline" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Back to Scan & Give
              </Button>
            </Link>
            
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
                    You&apos;ve experienced SHELTR&apos;s complete donation flow with Adyen payment processing. 
                    In production, this would process real payments and create actual blockchain transactions.
                  </p>
                  <div className="space-y-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <div>✅ QR Code Generation</div>
                    <div>✅ Participant Profile Display</div>
                    <div>✅ SmartFund™ Breakdown Calculation</div>
                    <div>✅ Adyen Payment Session Creation</div>
                    <div>✅ Success Flow & Impact Visualization</div>
                    <div>✅ Atomic User Stats Updates</div>
                  </div>
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