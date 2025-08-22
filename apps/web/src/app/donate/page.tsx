'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, Shield, QrCode, User, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { isSecureDomain } from '@/lib/urlSecurity';

// Demo donation amounts
const DEMO_AMOUNTS = [25, 50, 100, 200];

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  story: string;
  shelter_name: string;
  location: { city: string; state: string };
  progress: number;
  goals: Array<{ title: string; progress: number }>;
  total_received: number;
  donation_count: number;
  services_completed: number;
}

function DonatePageContent() {
  const searchParams = useSearchParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const isDemo = searchParams.get('demo') === 'true';
  const participantId = searchParams.get('participant');

  useEffect(() => {
    const loadParticipant = async () => {
      if (!participantId) return;
      
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Use real participant data for demo - Michael Rodriguez for authentic experience
        if ((isProduction && isSecureDomain(apiBaseUrl, 'api.sheltr-ai.com')) || participantId === 'demo-participant-001' || participantId === 'michael-rodriguez') {
          // Michael Rodriguez - Real participant for authentic demo experience
          const realParticipant = {
            id: participantId === 'demo-participant-001' ? 'demo-participant-001' : 'michael-rodriguez',
            firstName: 'Michael',
            lastName: 'Rodriguez',
            age: 32,
            story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
            shelter_name: "Old Brewery Mission",
            location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
            total_received: 0.00,
            donation_count: 0,
            services_completed: 8,
            progress: 55,
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
        if (participantId === 'demo-participant-001') {
          const mockParticipant = {
            id: "demo-participant-001",
            firstName: "Michael",
            lastName: "Rodriguez",
            age: 32,
            story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
            shelter_name: "Old Brewery Mission",
            location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
            total_received: 0.00,
            donation_count: 0,
            services_completed: 8,
            progress: 55,
            qr_code: "SHELTR-DEMO-2D88F",
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
    if (!participant) return;
    
    setProcessing(true);
    
    try {
      const donationAmount = isCustom ? parseFloat(customAmount) : selectedAmount;
      
      if (isNaN(donationAmount) || donationAmount < 1) {
        alert('Please enter a valid donation amount.');
        setProcessing(false);
        return;
      }

      // Create payment session
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/donations/payment-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_id: participant.id,
          amount: donationAmount,
          demo_session_id: searchParams.get('session_id') || undefined,
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
    } catch (error) {
      console.error('Payment error:', error);
      
      // In demo mode, if payment fails, offer to skip to success
      if (isDemo) {
        const skipToSuccess = confirm('Demo payment failed (expected without live Adyen). Skip to success page to see full flow?');
        if (skipToSuccess) {
          const donationAmount = isCustom ? parseFloat(customAmount) : selectedAmount;
          window.location.href = `/donation/success?demo=true&amount=${donationAmount}&participant=${participant.firstName}&reference=DEMO-FALLBACK-${Date.now()}`;
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
    return {
      total: amount,
      direct: Math.round(amount * 0.80 * 100) / 100,
      housing: Math.round(amount * 0.15 * 100) / 100,
      operations: Math.round(amount * 0.05 * 100) / 100,
    };
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

  if (!participant) {
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

  const breakdown = calculateBreakdown();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/scan-give" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            {isDemo && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                🎭 Demo Mode
              </Badge>
            )}
          </div>
        </div>
      </div>

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
            
            {/* Left Column: Participant Info */}
            <div className="space-y-6">
              
              {/* Participant Profile */}
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

              {/* SmartFund Breakdown */}
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
            </div>
            
            {/* Right Column: Donation Form */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Make Your Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
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