'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Shield, QrCode, User, MapPin, Target, Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { isSecureDomain } from '@/lib/urlSecurity';
import { getDonationMetrics } from '@/services/donationMetricsService';
import { tenantService } from '@/services/tenantService';
import PublicNavigation from '@/components/PublicNavigation';

// Demo donation amounts
const DEMO_AMOUNTS = [25, 50, 100, 200];

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  story: string;
  shelter_name: string;
  shelter_id?: string;
  location: { city: string; state: string };
  progress: number;
  goals: Array<{ title: string; progress: number }>;
  total_received: number;
  donation_count: number;
  services_completed: number;
}

interface Shelter {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  capacity?: number;
  participantCount?: number;
  services: string[];
}

// Use unified donation metrics service for consistency
const getMichaelRealData = async () => {
  return await getDonationMetrics('michael-rodriguez');
};

function DonatePageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const participantId = searchParams.get('participant');
  const shelterId = searchParams.get('shelter');
  const isDemo = searchParams.get('demo') === 'true';
  const donationType = shelterId ? 'shelter' : 'participant';

  // Load shelter if shelterId is present
  useEffect(() => {
    const loadShelter = async () => {
      if (!shelterId) return;
      
      try {
        setLoading(true);
        // Get shelter from tenant service
        const tenants = await tenantService.getAllShelterTenants();
        const matchingShelter = tenants.find(t => 
          t.id === shelterId || 
          t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === shelterId
        );
        
        if (matchingShelter) {
          // Get participant count for this shelter
          let participantCount = 0;
          try {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            const participantsQuery = query(
              collection(db, 'users'),
              where('role', '==', 'participant'),
              where('shelter_id', '==', matchingShelter.id)
            );
            const participantsSnapshot = await getDocs(participantsQuery);
            participantCount = participantsSnapshot.size;
          } catch (error) {
            console.error('Error fetching participant count:', error);
          }
          
          setShelter({
            id: matchingShelter.id,
            name: matchingShelter.name,
            description: 'Supporting individuals experiencing homelessness in our community',
            address: matchingShelter.address || '',
            city: 'Montreal',
            province: 'QC',
            capacity: 300,
            participantCount: participantCount,
            services: [
              'Emergency Shelter',
              'Meals & Necessities',
              'Case Management',
              'Housing Support',
              'Mental Health Services',
              'Job Training'
            ]
          });
        }
      } catch (error) {
        console.error('Error loading shelter:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (shelterId) {
      loadShelter();
    }
  }, [shelterId]);

  // Load participant if participantId is present
  useEffect(() => {
    const loadParticipant = async () => {
      if (!participantId) return;
      
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Use real participant data for demo - Michael Rodriguez for authentic experience
        const isSecureApiUrl = isProduction && apiBaseUrl && isSecureDomain(apiBaseUrl, 'api.sheltr-ai.com');
        if (isSecureApiUrl || participantId === 'demo-participant-001' || participantId === 'michael-rodriguez') {
          // Get Michael's real donation data from Firestore
          const realDonationData = await getMichaelRealData();
          
          // Michael Rodriguez - Real participant for authentic demo experience
          const realParticipant = {
            id: participantId === 'demo-participant-001' ? 'demo-participant-001' : 'michael-rodriguez',
            firstName: 'Michael',
            lastName: 'Rodriguez',
            age: 32,
            story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
            shelter_name: "Old Brewery Mission",
            shelter_id: "YDJCJnuLGMC9mWOWDSOa", // Actual tenant ID from migration
            location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
            total_received: realDonationData.total_received, // Real donation total
            donation_count: realDonationData.donation_count, // Real donation count
            services_completed: realDonationData.services_completed, // Real or demo services
            progress: 55,
            goals: [
              { title: "Secure Stable Housing", progress: 68 },
              { title: "Career Development", progress: 55 },
              { title: "Community Engagement", progress: 42 }
            ],
            qr_code: participantId === 'demo-participant-001' ? "SHELTR-DEMO-2D88F" : "SHELTR-MICHAEL-REAL",
            featured: true,
            demo: true
          };
          
          setParticipant(realParticipant);
          return;
        }
        
        const endpoint = isDemo 
          ? `${apiBaseUrl}/demo/donations/participant/${participantId}`
          : `${apiBaseUrl}/participants/${participantId}`;
          
        const response = await fetch(endpoint);
        const result = await response.json();
        
        if (result.success) {
          setParticipant(result.data.participant);
        } else {
          console.error('Failed to load participant:', result.message);
        }
      } catch (error) {
        console.error('Failed to load participant:', error);
        
        // Fallback to mock data for demo participant - Michael Rodriguez  
        if (participantId === 'demo-participant-001' || participantId === 'michael-rodriguez') {
          // Get Michael's real donation data from Firestore
          const realDonationData = await getMichaelRealData();
          
          const mockParticipant = {
            id: participantId === 'demo-participant-001' ? 'demo-participant-001' : 'michael-rodriguez',
            firstName: "Michael",
            lastName: "Rodriguez",
            age: 32,
            story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
            shelter_name: "Old Brewery Mission",
            location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
            total_received: realDonationData.total_received, // Real donation total
            donation_count: realDonationData.donation_count, // Real donation count
            services_completed: realDonationData.services_completed, // Real or demo services
            progress: 55,
            goals: [
              { title: "Secure Stable Housing", progress: 68 },
              { title: "Career Development", progress: 55 },
              { title: "Community Engagement", progress: 42 }
            ],
            qr_code: participantId === 'demo-participant-001' ? "SHELTR-DEMO-2D88F" : "SHELTR-MICHAEL-REAL",
            featured: true,
            demo: true
          };
          
          setParticipant(mockParticipant);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadParticipant();
  }, [participantId, isDemo]);

  const handleDonate = async () => {
    // Validate we have either participant or shelter
    if (donationType === 'participant' && !participant) {
      alert('Please select a participant to support.');
      return;
    }
    if (donationType === 'shelter' && !shelter) {
      alert('Please select a shelter to support.');
      return;
    }
    
    setProcessing(true);
    
    try {
      const donationAmount = isCustom ? parseFloat(customAmount) : selectedAmount;
      
      if (isNaN(donationAmount) || donationAmount < 1) {
        alert('Please enter a valid donation amount.');
        setProcessing(false);
        return;
      }

      if (donationType === 'shelter') {
        // 🆕 SHELTER DONATION FLOW
        console.log('💚 Creating shelter donation:', {
          shelter_id: shelter.id,
          amount: donationAmount,
          donor: user?.displayName || 'Guest'
        });

        // Create payment session for shelter donation
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/donations/payment-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shelter_id: shelter.id,
            amount: donationAmount,
            donation_type: 'shelter',
            donor_info: user ? {
              donor_id: user.uid,
              name: user.displayName || user.email || 'Anonymous Donor',
              email: user.email || 'anonymous@sheltr.ai'
            } : {
              name: 'Anonymous Donor',
              email: 'anonymous@sheltr.ai'
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log('✅ Shelter payment session created:', result.data);
          
          // Simulate successful payment by calling the webhook simulation endpoint
          try {
            const simulateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/donations/simulate-success/${result.data.donation_id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (simulateResponse.ok) {
              console.log('✅ Shelter donation success simulated');
            } else {
              console.warn('⚠️ Failed to simulate donation success, but continuing...');
            }
          } catch (simulateError) {
            console.warn('⚠️ Error simulating donation success:', simulateError);
          }
          
          // Redirect to success page after 1 second
          setTimeout(() => {
            window.location.href = `/donation/success?demo=true&amount=${donationAmount}&shelter=${shelter.name}&reference=${result.data.reference}`;
          }, 1000);
        } else {
          throw new Error(result.message || 'Payment session creation failed');
        }

      } else {
        // 🧑 PARTICIPANT DONATION FLOW (existing logic)
        // Create payment session with donor information
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/donations/payment-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            participant_id: participant.id,
            amount: donationAmount,
            demo_session_id: searchParams.get('session_id') || undefined,
            donor_info: user ? {
              donor_id: user.uid,
              name: user.displayName || user.email || 'Anonymous Donor',
              email: user.email || 'anonymous@sheltr.ai'
            } : undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // In a real implementation, this would redirect to Adyen payment page
          // For demo, simulate successful payment and redirect to success page
          console.log('Demo payment session created:', result.data);
          
          // Simulate successful payment by calling the webhook simulation endpoint
          try {
            const simulateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/donations/simulate-success/${result.data.donation_id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (simulateResponse.ok) {
              console.log('✅ Donation success simulated, updating participant stats...');
            } else {
              console.warn('⚠️ Failed to simulate donation success, but continuing...');
            }
          } catch (simulateError) {
            console.warn('⚠️ Error simulating donation success:', simulateError);
          }
          
          // Redirect to success page after 1 second
          setTimeout(() => {
            window.location.href = `/donation/success?demo=true&amount=${donationAmount}&participant=${participant.firstName}&reference=${result.data.reference}`;
          }, 1000);
        } else {
          throw new Error(result.message || 'Payment session creation failed');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // In demo mode, if payment fails, offer to skip to success
      if (isDemo || donationType === 'shelter') {
        const skipToSuccess = confirm('Payment successful, thank you. Click OK to continue to success page to see full flow.');
        if (skipToSuccess) {
          const donationAmount = isCustom ? parseFloat(customAmount) : selectedAmount;
          if (donationType === 'shelter') {
            window.location.href = `/donation/success?demo=true&amount=${donationAmount}&shelter=${shelter.name}&reference=DEMO-FALLBACK-${Date.now()}`;
          } else {
            window.location.href = `/donation/success?demo=true&amount=${donationAmount}&participant=${participant.firstName}&reference=DEMO-FALLBACK-${Date.now()}`;
          }
          return;
        }
      }
      
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateBreakdown = () => {
    const amount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
    
    if (donationType === 'shelter') {
      // Shelter donations: 95% to shelter, 5% platform fee
      return {
        total: amount,
        shelterOperations: Math.round(amount * 0.95 * 100) / 100,
        platformFee: Math.round(amount * 0.05 * 100) / 100,
      };
    } else {
      // Participant donations: 80-15-5 SmartProof™ model
      return {
        total: amount,
        direct: Math.round(amount * 0.80 * 100) / 100,
        housing: Math.round(amount * 0.15 * 100) / 100,
        operations: Math.round(amount * 0.05 * 100) / 100,
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
          <h2 className="text-xl font-semibold">Loading donation page...</h2>
        </div>
      </div>
    );
  }

  // Check if we have the required data based on donation type
  if (donationType === 'participant' && !participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center max-w-md mx-auto px-4">
          <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">Participant Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The QR code you scanned is invalid or expired. Please try scanning again or contact support.
          </p>
          <Link href="/scan-give">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scan & Give
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (donationType === 'shelter' && !shelter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center max-w-md mx-auto px-4">
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">Shelter Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find the shelter you&apos;re trying to support. Please check the link and try again.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const breakdown = calculateBreakdown();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Demo Notice */}
          {isDemo && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                <Heart className="h-4 w-4 mr-2" />
                Experience SHELTR's revolutionary donation flow with Adyen payment processing
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column: Profile Info */}
            <div className="space-y-6">
              
              {donationType === 'participant' && participant ? (
                /* Participant Profile */
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Support {participant.firstName} {participant.lastName}
                        </h2>
                        <p className="text-muted-foreground font-normal">
                          Age {participant.age} • {participant.shelter_name}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">{participant.story}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        {participant.location.city}, {participant.location.state}
                      </Badge>
                      <Badge variant="outline">
                        <Target className="h-3 w-3 mr-1" />
                        {participant.progress}% Progress
                      </Badge>
                    </div>

                    {/* Goals */}
                    {participant.goals && participant.goals.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Current Goals:</h4>
                        {participant.goals.slice(0, 3).map((goal, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{goal.title}</span>
                            <span className="text-muted-foreground">{goal.progress}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${participant.total_received?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Received</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {participant.donation_count}
                      </div>
                      <div className="text-xs text-muted-foreground">Donations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {participant.services_completed}
                      </div>
                      <div className="text-xs text-muted-foreground">Services</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ) : donationType === 'shelter' && shelter ? (
                /* Shelter Profile */
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">
                          Support {shelter.name}
                        </h2>
                      </div>
                      {/* Participant Count Badge */}
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
                        <User className="h-5 w-5 text-green-600" />
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{shelter.participantCount || 0}</div>
                          <div className="text-xs text-muted-foreground">participants</div>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">{shelter.description}</p>
                    
                    {/* Address */}
                    {shelter.address && (
                      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p>{shelter.address}</p>
                          <p>{shelter.city}, {shelter.province}</p>
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {shelter.services && shelter.services.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Services Provided:</h4>
                        <div className="flex flex-wrap gap-2">
                          {shelter.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}

              {/* Breakdown Card */}
              {donationType === 'participant' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    SmartFund™ Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">Direct Support</div>
                        <div className="text-sm text-muted-foreground">Immediate assistance for {participant.firstName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">80%</div>
                        <div className="text-sm text-green-600">${breakdown.direct}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">Housing Fund</div>
                        <div className="text-sm text-muted-foreground">Long-term housing solutions</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">15%</div>
                        <div className="text-sm text-green-600">${breakdown.housing}</div>
                      </div>
                    </div>
                    
                    {/* Housing Fund Impact Preview */}
                    {breakdown.housing > 0 && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                          🏠 Housing Fund Impact
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Your ${breakdown.housing} contribution gets {participant.firstName} closer to a $5,000 emergency housing deposit.
                        </div>
                        {(() => {
                          const currentHousingFund = Math.round(participant.total_received * 0.15);
                          const newTotal = currentHousingFund + breakdown.housing;
                          const tinyHomeTarget = 5000;
                          const newPercentage = Math.min((newTotal / tinyHomeTarget) * 100, 100);
                          const oldPercentage = Math.min((currentHousingFund / tinyHomeTarget) * 100, 100);
                          const progressIncrease = newPercentage - oldPercentage;
                          
                          return (
                            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                              Progress: {oldPercentage.toFixed(1)}% → {newPercentage.toFixed(1)}% 
                              {progressIncrease > 0 && (
                                <span className="font-medium"> (+{progressIncrease.toFixed(1)}%)</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">Operations</div>
                        <div className="text-sm text-muted-foreground">Platform maintenance & security</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">5%</div>
                        <div className="text-sm text-green-600">${breakdown.operations}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Shelter Breakdown Card */}
              {donationType === 'shelter' && shelter && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Donation Breakdown
                    </CardTitle>
                    <CardDescription>Direct support to shelter operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div>
                          <div className="font-semibold text-lg">Shelter Operations</div>
                          <div className="text-sm text-muted-foreground">Direct support for {shelter.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">95%</div>
                          <div className="text-lg text-green-600">${breakdown.shelterOperations}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div>
                          <div className="font-semibold">Platform Fee</div>
                          <div className="text-sm text-muted-foreground">System maintenance & security</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">5%</div>
                          <div className="text-lg text-blue-600">${breakdown.platformFee}</div>
                        </div>
                      </div>

                      {/* What Your Donation Supports */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          Your Impact
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>✓ Emergency shelter beds and safe spaces</p>
                          <p>✓ Daily meals and basic necessities</p>
                          <p>✓ Case management and support services</p>
                          <p>✓ Housing assistance programs</p>
                          <p>✓ Mental health and wellness services</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sign In / Register Prompt for Shelter Donations */}
                {!user && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Track Your Charitable Giving
                      </CardTitle>
                      <CardDescription>Create an account to receive tax receipts and track your impact</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Automatic tax receipts for all donations</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Track your giving history and total impact</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Support multiple shelters from one dashboard</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Receive updates on how your donations help</span>
                          </p>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Link href="/register" className="flex-1">
                            <Button variant="default" className="w-full">
                              Create Account
                            </Button>
                          </Link>
                          <Link href="/login" className="flex-1">
                            <Button variant="outline" className="w-full">
                              Sign In
                            </Button>
                          </Link>
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          Or continue as guest (no tax receipt)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
              )}
            </div>
            
            {/* Right Column: Donation Form */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Make Your Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Account Status */}
                  <div className="space-y-3">
                    {user ? (
                      /* Logged In - Account Connected */
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-center mb-2">
                          <Badge className="bg-green-600 hover:bg-green-600">
                            ✓ Account Connected
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-lg">Welcome back, {user.displayName || user.email?.split('@')[0]}!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your donation will be automatically tracked in your dashboard.
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                            Ready to make a difference?
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Not Logged In - Prompt to Connect */
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
                        <div className="text-center space-y-3">
                          <p className="font-semibold">Track Your Impact</p>
                          <p className="text-sm text-muted-foreground">
                            Sign in to track your donations and see your impact over time.
                          </p>
                          <div className="flex gap-2">
                            <Link href="/login" className="flex-1">
                              <Button variant="default" className="w-full">
                                Sign In
                              </Button>
                            </Link>
                            <Link href="/register" className="flex-1">
                              <Button variant="outline" className="w-full">
                                Register
                              </Button>
                            </Link>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Or continue as guest below
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Choose Amount</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {DEMO_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          variant={!isCustom && selectedAmount === amount ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setIsCustom(false);
                            setCustomAmount('');
                          }}
                          className="h-12 text-lg"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Custom Amount */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Or enter custom amount:</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setIsCustom(true);
                          }}
                          placeholder="0.00"
                          min="1"
                          max="10000"
                          step="0.01"
                          className="w-full pl-8 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Display */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">Your Impact:</h4>
                    <div className="space-y-1 text-sm">
                      {donationType === 'participant' && participant ? (
                        <>
                          <div className="flex justify-between">
                            <span>Direct to {participant.firstName}:</span>
                            <span className="font-medium text-primary">${breakdown.direct}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Housing Fund:</span>
                            <span className="font-medium text-green-600">${breakdown.housing}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operations:</span>
                            <span className="font-medium text-blue-600">${breakdown.operations}</span>
                          </div>
                        </>
                      ) : donationType === 'shelter' && shelter ? (
                        <>
                          <div className="flex justify-between">
                            <span>To {shelter.name}:</span>
                            <span className="font-medium text-green-600">${breakdown.shelterOperations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform Fee:</span>
                            <span className="font-medium text-blue-600">${breakdown.platformFee}</span>
                          </div>
                        </>
                      ) : null}
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total:</span>
                        <span>${breakdown.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button 
                    onClick={handleDonate}
                    disabled={processing || breakdown.total < 1}
                    className="w-full h-12 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                    size="lg"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    {processing ? 'Processing...' : `Donate $${breakdown.total}`}
                  </Button>

                  {/* Demo Skip Button */}
                  {isDemo && (
                    <Button 
                      onClick={() => {
                        const amount = breakdown.total;
                        window.location.href = `/donation/success?demo=true&amount=${amount}&participant=${participant.firstName}&reference=DEMO-${Date.now()}`;
                      }}
                      variant="outline"
                      className="w-full h-10 text-sm border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                      size="sm"
                    >
                      🎭 Demo: Skip to Success Page
                    </Button>
                  )}

                  {/* Security Notice */}
                  <div className="text-center text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Secured by Adyen • PCI DSS Level 1 Compliant
                    {isDemo && (
                      <div className="mt-1 text-yellow-600 dark:text-yellow-400">
                        Demo mode - No real charges will be made
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <DonatePageContent />
    </Suspense>
  );
}