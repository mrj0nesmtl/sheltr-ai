'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { QrCode, Heart, Share2, MapPin, Target, Calendar, User, ExternalLink, Copy, Check, Home, ChevronRight, ArrowLeft } from 'lucide-react';
import { getParticipantProfile, type ParticipantProfile } from '@/services/platformMetrics';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  story: string;
  shelter_name: string;
  location: {
    city: string;
    state: string;
    zipcode: string;
  };
  goals: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    status: string;
    target_date: string;
  }>;
  skills: string[];
  interests: string[];
  total_received: number;
  donation_count: number;
  services_completed: number;
  progress: number;
  qr_code: string;
  photo_url?: string;
  featured: boolean;
  demo?: boolean;
}

interface ParticipantProfileClientProps {
  participantId: string;
}

export function ParticipantProfileClient({ participantId }: ParticipantProfileClientProps) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadParticipant = async () => {
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // First try to load real participant data by ID or name-based URL
        try {
          let realParticipant = null;
          
          // Try to find participant by UID first
          const realParticipantData = await getParticipantProfile(participantId);
          if (realParticipantData) {
            realParticipant = {
              id: participantId,
              firstName: realParticipantData.firstName,
              lastName: realParticipantData.lastName,
              age: 32,
              story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
              shelter_name: realParticipantData.shelterName || "Old Brewery Mission",
              location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
              goals: [
                { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 68, status: "in_progress", target_date: "2024-10-01" },
                { id: "employment-goal", title: "Career Development", description: "Build skills and secure meaningful employment", progress: 55, status: "in_progress", target_date: "2024-09-15" },
                { id: "community-goal", title: "Community Engagement", description: "Give back and help others in similar situations", progress: 42, status: "in_progress", target_date: "2024-12-01" }
              ],
              skills: ["Communication", "Leadership", "Problem Solving", "Community Outreach"],
              interests: ["Community Service", "Personal Development", "Mentoring", "Social Impact"],
              total_received: 0.00,
              donation_count: 0,
              services_completed: 0,
              progress: 55,
              qr_code: `SHELTR-${realParticipantData.firstName.toUpperCase()}-${Date.now()}`,
              featured: true,
              demo: false
            };
          } else {
            // Try to find by name-based URL (michael-rodriguez)
            const [firstName, lastName] = participantId.split('-').map(name => name.charAt(0).toUpperCase() + name.slice(1));
            if (firstName && lastName) {
              const usersSnapshot = await getDocs(
                query(collection(db, 'users'), 
                  where('firstName', '==', firstName),
                  where('lastName', '==', lastName),
                  where('role', '==', 'participant')
                )
              );
              
              if (!usersSnapshot.empty) {
                const userData = usersSnapshot.docs[0].data();
                realParticipant = {
                  id: usersSnapshot.docs[0].id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  age: 32,
                  story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
                  shelter_name: userData.shelterName || "Old Brewery Mission",
                  location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
                  goals: [
                    { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 68, status: "in_progress", target_date: "2024-10-01" },
                    { id: "employment-goal", title: "Career Development", description: "Build skills and secure meaningful employment", progress: 55, status: "in_progress", target_date: "2024-09-15" },
                    { id: "community-goal", title: "Community Engagement", description: "Give back and help others in similar situations", progress: 42, status: "in_progress", target_date: "2024-12-01" }
                  ],
                  skills: ["Communication", "Leadership", "Problem Solving", "Community Outreach"],
                  interests: ["Community Service", "Personal Development", "Mentoring", "Social Impact"],
                  total_received: 0.00,
                  donation_count: 0,
                  services_completed: 0,
                  progress: 55,
                  qr_code: `SHELTR-${userData.firstName.toUpperCase()}-${Date.now()}`,
                  featured: true,
                  demo: false
                };
              }
            }
          }
          
          if (realParticipant) {
            setParticipant(realParticipant);
            console.log('✅ Real participant profile loaded:', realParticipant);
            return;
          }
        } catch (error) {
          console.error('❌ Error loading real participant:', error);
        }

        // Fallback to demo data for demo-participant-001 or if no real participant found
        if (participantId === 'demo-participant-001') {
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
          
          setParticipant(mockParticipant);
          setLoading(false);
          return;
        }
        
        // Try to call backend API
        const response = await fetch(`${apiBaseUrl}/demo/donations/participant/${participantId}`);
        const result = await response.json();
        
        if (result.success) {
          setParticipant(result.data.participant);
        } else {
          setError('Participant not found');
        }
      } catch (error) {
        console.error('Error loading participant:', error);
        
        // Fallback to mock data if participantId is demo-participant-001
        if (participantId === 'demo-participant-001') {
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
          
          setParticipant(mockParticipant);
        } else {
          setError('Failed to load participant profile');
        }
      } finally {
        setLoading(false);
      }
    };

    if (participantId) {
      loadParticipant();
    }
  }, [participantId]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${participant?.firstName} ${participant?.lastName}`,
          text: `Help ${participant?.firstName} achieve their goals through SHELTR`,
          url: url,
        });
      } catch (error) {
        // Fallback to copy URL
        copyUrl();
      }
    } else {
      copyUrl();
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonate = () => {
    window.location.href = `/donate?demo=${participant?.demo || false}&participant=${participantId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading participant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'This participant profile does not exist.'}</p>
          <Link href="/scan-give">
            <Button>Back to Scan & Give</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {participant && (
        <Head>
          <title>Support {participant.firstName} {participant.lastName} | SHELTR</title>
          <meta name="description" content={`Help ${participant.firstName} achieve their goals through SHELTR. ${participant.story.substring(0, 150)}...`} />
          <meta property="og:title" content={`Support ${participant.firstName} ${participant.lastName}`} />
          <meta property="og:description" content={participant.story.substring(0, 200)} />
          <meta property="og:image" content={participant.photo_url || '/images/logo.svg'} />
          <meta property="og:url" content={`https://sheltr-ai.web.app/participant/${participant.id}`} />
          <meta property="og:type" content="profile" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`Support ${participant.firstName} ${participant.lastName}`} />
          <meta name="twitter:description" content={participant.story.substring(0, 200)} />
          <meta name="twitter:image" content={participant.photo_url || '/images/logo.svg'} />
        </Head>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center">
                  <ThemeLogo className="h-10 w-10" />
                </Link>
                
                {/* Breadcrumb */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  <Link href="/scan-give" className="hover:text-foreground transition-colors">
                    Scan & Give
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground font-medium">
                    {participant.firstName} {participant.lastName}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {participant.demo && (
                  <Badge variant="secondary" className="bg-orange-500 text-white">
                    Demo Profile
                  </Badge>
                )}
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {copied ? <Check className="h-4 w-4" /> : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Breadcrumb */}
        <div className="sm:hidden bg-background/50 border-b px-4 py-2">
          <div className="flex items-center space-x-2">
            <Link href="/scan-give">
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/scan-give" className="text-muted-foreground hover:text-foreground transition-colors">
                Scan & Give
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {participant.firstName} {participant.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Header */}
              <Card className="border-2">
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {participant.photo_url ? (
                      <img 
                        src={participant.photo_url} 
                        alt={`${participant.firstName} ${participant.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-2xl">
                    {participant.firstName} {participant.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Age {participant.age} • {participant.shelter_name}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {participant.location.city}, {participant.location.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {participant.progress}% Progress
                    </div>
                  </div>
                  {participant.featured && (
                    <Badge className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      ⭐ Featured Participant
                    </Badge>
                  )}
                </CardHeader>
              </Card>

              {/* Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{participant.story}</p>
                </CardContent>
              </Card>

              {/* Current Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Current Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {participant.goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{goal.title}</h4>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {participant.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {participant.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Action Panel */}
            <div className="space-y-6">
              
              {/* QR Code & Donation */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Support {participant.firstName}</CardTitle>
                  <CardDescription>Scan or click to donate directly</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {/* QR Code Display */}
                  <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                      {participant.demo ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=${participant.id}`)}&format=png`}
                          alt={`QR Code for ${participant.qr_code}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to text display if QR service fails
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <QrCode className="h-16 w-16 text-gray-400" />
                      )}
                      <div className="hidden w-full h-full flex items-center justify-center">
                        <span className="text-xs text-center font-mono break-all p-2">
                          {participant.qr_code}
                        </span>
                      </div>
                      <span className="sr-only">QR Code for {participant.qr_code}</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleDonate} className="w-full" size="lg">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    Secure donations through Adyen
                  </div>
                </CardContent>
              </Card>

              {/* Impact Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impact So Far</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${participant.total_received.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Received</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">{participant.donation_count}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{participant.services_completed}</div>
                        <div className="text-xs text-muted-foreground">Services</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Housing Fund Progress */}
              <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-green-600" />
                    Housing Fund Progress
                  </CardTitle>
                  <CardDescription>Progress towards emergency housing solution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    // Calculate housing fund progress (15% of total received)
                    const housingFundContributed = Math.round(participant.total_received * 0.15);
                    const tinyHomeTarget = 5000; // $5,000 target for emergency housing
                    const progressPercentage = Math.min((housingFundContributed / tinyHomeTarget) * 100, 100);
                    const remainingAmount = Math.max(tinyHomeTarget - housingFundContributed, 0);
                    
                    return (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Emergency Housing Fund</span>
                            <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>${housingFundContributed.toLocaleString()} contributed</span>
                            <span>${tinyHomeTarget.toLocaleString()} goal</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              ${housingFundContributed.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Saved for Housing</div>
                          </div>
                          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">
                              ${remainingAmount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Still Needed</div>
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                          <div className="text-sm font-medium text-green-800 dark:text-green-200">
                            🏠 Target: Emergency Housing Deposit
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                            {remainingAmount > 0 
                              ? `${Math.ceil(remainingAmount / (participant.total_received * 0.15 / participant.donation_count || 1))} more donations of this size needed`
                              : "Housing goal achieved! 🎉"
                            }
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Social Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleShare} variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share on Social Media
                  </Button>
                  
                  <Button onClick={copyUrl} variant="outline" className="w-full" size="sm">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        URL Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Profile URL
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}