'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { QrCode, Heart, Share2, MapPin, Target, User, ExternalLink, Copy, Check, Home, ChevronRight, ArrowLeft, RefreshCw, TrendingUp, Award, Calendar, Building } from 'lucide-react';
import { getParticipantProfile, type ParticipantProfile } from '@/services/platformMetrics';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getDonationMetrics } from '@/services/donationMetricsService';
import { publicProfileService, type PublicGoalData, type PublicGoalStats } from '@/services/publicProfileService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import ThemeLogo from '@/components/ThemeLogo';

interface ParticipantGoal {
  id?: string;
  title: string;
  description?: string;
  progress: number;
  status?: string;
  target_date?: string;
}

interface ParticipantData {
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
  goals: ParticipantGoal[];
  skills?: string[];
  interests?: string[];
  total_received: number;
  donation_count: number;
  services_completed: number;
  progress: number;
  qr_code?: string;
  photo_url?: string;
  featured?: boolean;
  demo?: boolean;
}

interface ParticipantProfileClientProps {
  participantId: string;
}

export function ParticipantProfileClient({ participantId }: ParticipantProfileClientProps) {
  
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [goalsVisible, setGoalsVisible] = useState(false);

  const loadParticipantGoals = async (participantId: string): Promise<PublicGoalData | null> => {
    try {
      const goalsData = await publicProfileService.getPublicGoals(participantId);
      return goalsData;
    } catch (error) {
      console.error('Error loading participant goals:', error);
      return null;
    }
  };

  const loadRealGoalsIfAvailable = async (participantId: string) => {
    const goalsData = await loadParticipantGoals(participantId);
    if (goalsData && goalsData.goals && goalsData.goals.length > 0) {
      console.log('✅ [DEBUG] Found real goals for participant:', goalsData.goals.length);
      return goalsData.goals.map((goal: PublicGoalData['goals'][0]) => ({
        id: goal.id || '',
        title: goal.title,
        description: goal.description || '',
        progress: goal.progress_percentage || 0,
        status: goal.status || 'in_progress',
        target_date: goal.target_date || ''
      }));
    } else {
      console.log('⚠️ [DEBUG] No real goals found, using default goals');
      setGoalsVisible(true);
    }
  };

  // Use unified donation metrics service for consistency
  const fetchParticipantDonations = async (participantId: string): Promise<{ total_received: number; donation_count: number }> => {
    const metrics = await getDonationMetrics(participantId);
    return {
      total_received: metrics.total_received,
      donation_count: metrics.donation_count
    };
  };

  // Main function to load participant data
  const loadParticipant = async () => {
      console.log(`🔄 [DEBUG] Loading participant data for ID: ${participantId}`);
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // First try to load real participant data by ID or name-based URL
        try {
          let realParticipant = null;
          
          // SKIP real participant loading for demo participants
          if (participantId === 'michael-rodriguez' || participantId === 'demo-participant-001') {
            console.log(`🎯 [DEBUG] Skipping real participant lookup for demo ID: ${participantId}`);
            // Jump directly to demo data loading
            throw new Error('Using demo data for michael-rodriguez');
          }
          
          // Try to find participant by UID first
          const realParticipantData = await getParticipantProfile(participantId);
          if (realParticipantData) {
            // Fetch real donation data
            const donationData = await fetchParticipantDonations(participantId);
            
            // Try to load real goals
            const realGoals = await loadRealGoalsIfAvailable(participantId);
            
            realParticipant = {
              id: participantId,
              firstName: realParticipantData.firstName,
              lastName: realParticipantData.lastName,
              age: 32,
              story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
              shelter_name: realParticipantData.shelterName || "Old Brewery Mission",
              location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
              goals: realGoals || [
                { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 68, status: "in_progress", target_date: "2024-10-01" },
                { id: "employment-goal", title: "Career Development", description: "Build skills and secure meaningful employment", progress: 55, status: "in_progress", target_date: "2024-09-15" },
                { id: "community-goal", title: "Community Engagement", description: "Give back and help others in similar situations", progress: 42, status: "in_progress", target_date: "2024-12-01" }
              ],
              skills: ["Community Outreach", "Leadership", "Communication", "Problem Solving"],
              interests: ["Community Development", "Social Work", "Education"],
              total_received: donationData.total_received,
              donation_count: donationData.donation_count,
              services_completed: 8,
              progress: 55,
              qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=${participantId}`)}&format=png`,
              featured: true,
              demo: false
            };
            
            setParticipant(realParticipant);
            console.log('✅ [DEBUG] Real participant loaded:', realParticipant);
            setLoading(false);
            return;
          }

          // Try to find user by email (name-based URL like "michael-rodriguez")
          const usersRef = collection(db, 'users');
          const usersQuery = query(usersRef, where('role', '==', 'participant'));
          const usersSnapshot = await getDocs(usersQuery);
          
          let userId = null;
          let firstName = '';
          let lastName = '';
          
          for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const userFirstName = userData.firstName?.toLowerCase() || '';
            const userLastName = userData.lastName?.toLowerCase() || '';
            const fullNameSlug = `${userFirstName}-${userLastName}`;
            
            if (fullNameSlug === participantId.toLowerCase()) {
              userId = doc.id;
              firstName = userData.firstName || '';
              lastName = userData.lastName || '';
              break;
            }
          }
          
          if (userId) {
            const userData = usersSnapshot.docs.find(doc => doc.id === userId)?.data();
            const donationData = await fetchParticipantDonations(userId);
            const realGoals = await loadRealGoalsIfAvailable(userId);
            
            realParticipant = {
              id: userId,
              firstName: userData.firstName || firstName,
              lastName: userData.lastName || lastName,
              age: 32,
              story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
              shelter_name: userData.shelterName || "Old Brewery Mission",
              location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
              goals: realGoals || [
                { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 68, status: "in_progress", target_date: "2024-10-01" },
                { id: "employment-goal", title: "Career Development", description: "Build skills and secure meaningful employment", progress: 55, status: "in_progress", target_date: "2024-09-15" },
                { id: "community-goal", title: "Community Engagement", description: "Give back and help others in similar situations", progress: 42, status: "in_progress", target_date: "2024-12-01" }
              ],
              skills: ["Community Outreach", "Leadership", "Communication", "Problem Solving"],
              interests: ["Community Development", "Social Work", "Education"],
              total_received: donationData.total_received,
              donation_count: donationData.donation_count,
              services_completed: 8,
              progress: 55,
              qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=${participantId}`)}&format=png`,
              featured: true,
              demo: false
            };
            
            setParticipant(realParticipant);
            console.log('✅ [DEBUG] Real participant loaded via name:', realParticipant);
            setLoading(false);
            return;
          }

        } catch (realParticipantError) {
          console.log('⚠️ [DEBUG] Could not load real participant, falling back to demo:', realParticipantError);
        }
        
        // Fallback to Michael Rodriguez demo data
        if (participantId === 'demo-participant-001' || participantId === 'michael-rodriguez') {
          // Fetch real donation data for this participant
          const donationData = await fetchParticipantDonations(participantId);
          
          const mockParticipant = {
            id: participantId, // Use the actual participant ID passed in
            firstName: "Michael",
            lastName: "Rodriguez",
            age: 32,
            story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
            shelter_name: "Old Brewery Mission",
            location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
            goals: [
              { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 55, status: "in_progress", target_date: "2024-09-01" },
              { id: "employment-goal", title: "Career Development", description: "Build professional skills and connections", progress: 45, status: "in_progress", target_date: "2024-08-15" },
              { id: "financial-goal", title: "Financial Stability", description: "Build emergency fund and credit score", progress: 30, status: "in_progress", target_date: "2024-12-01" }
            ],
            skills: ["Community Outreach", "Leadership", "Communication", "Problem Solving"],
            interests: ["Community Development", "Social Work", "Education"],
            total_received: donationData.total_received,
            donation_count: donationData.donation_count,
            services_completed: 8,
            progress: 55,
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=${participantId}`)}&format=png`,
            featured: true,
            demo: true
          };
          
          setParticipant(mockParticipant);
          console.log('✅ [DEBUG] Demo participant loaded:', mockParticipant);
          console.log(`💰 [DEBUG] Participant total_received: $${mockParticipant.total_received}`);
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
        
        // Fallback to mock data if participantId is demo-participant-001 or michael-rodriguez
        if (participantId === 'demo-participant-001' || participantId === 'michael-rodriguez') {
          // Fetch real donation data for this participant
          const donationData = await fetchParticipantDonations(participantId);
          
          const mockParticipant = {
            id: participantId, // Use the actual participant ID passed in
            firstName: "Michael",
            lastName: "Rodriguez",
            age: 32,
            story: "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
            shelter_name: "Old Brewery Mission",
            location: { city: "Montreal", state: "QC", zipcode: "H2X 1Y5" },
            goals: [
              { id: "housing-goal", title: "Secure Stable Housing", description: "Find permanent housing solution", progress: 55, status: "in_progress", target_date: "2024-09-01" },
              { id: "employment-goal", title: "Career Development", description: "Build professional skills and connections", progress: 45, status: "in_progress", target_date: "2024-08-15" },
              { id: "financial-goal", title: "Financial Stability", description: "Build emergency fund and credit score", progress: 30, status: "in_progress", target_date: "2024-12-01" }
            ],
            skills: ["Community Outreach", "Leadership", "Communication", "Problem Solving"],
            interests: ["Community Development", "Social Work", "Education"],
            total_received: donationData.total_received,
            donation_count: donationData.donation_count,
            services_completed: 8,
            progress: 55,
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://sheltr-ai.web.app/donate?demo=true&participant=${participantId}`)}&format=png`,
            featured: true,
            demo: true
          };
          
          setParticipant(mockParticipant);
          console.log('✅ [DEBUG] Demo participant loaded (fallback):', mockParticipant);
          setLoading(false);
          return;
        }
        
        setError('Failed to load participant');
        setLoading(false);
      }
    };

  const refreshParticipantData = async () => {
    setLoading(true);
    await loadParticipant();
    setLoading(false);
  };

  useEffect(() => {
    loadParticipant();
  }, [participantId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${participant?.firstName} ${participant?.lastName}`,
          text: participant?.story || '',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-2">Participant Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the participant you're looking for."}
          </p>
          <Link href="/scan-give">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scan & Give
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Head>
        <title>{participant.firstName} {participant.lastName} - SHELTR Participant</title>
        <meta name="description" content={participant.story} />
      </Head>

      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/scan-give">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scan & Give
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {participant.demo && (
                <Badge variant="secondary" className="bg-orange-500 text-white">Demo Profile</Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                {copied ? <Check className="h-4 w-4" /> : 'Share'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Profile Photo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-background rounded-full border-2 border-border shadow-lg mb-6">
            {participant.photo_url ? (
              <Image src={participant.photo_url} alt={`${participant.firstName} ${participant.lastName}`} width={96} height={96} className="rounded-full" />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>

          {/* Name & Details */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {participant.firstName} {participant.lastName}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            Age {participant.age} • <Link href="/old-brewery-mission" className="hover:text-primary underline underline-offset-2 transition-colors">{participant.shelter_name}</Link>
          </p>

          {/* Location & Progress */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            <Badge variant="secondary" className="text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {participant.location.city}, {participant.location.state}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Target className="h-4 w-4 mr-1" />
              {participant.progress}% Complete
            </Badge>
            {participant.featured && (
              <Badge className="text-sm bg-orange-500">
                <Award className="h-4 w-4 mr-1" />
                Featured Participant
              </Badge>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Story & Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Card */}
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

            {/* Goals Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Current Goals
                </CardTitle>
                <CardDescription>Progress towards housing stability and personal growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {participant.goals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills & Interests */}
            <div className="grid sm:grid-cols-2 gap-6">
              {participant.skills && participant.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {participant.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {participant.interests && participant.interests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {participant.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Support & Impact */}
          <div className="space-y-6">
            {/* Support Card with QR Code */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Support {participant.firstName}
                </CardTitle>
                <CardDescription>Scan or click to donate directly</CardDescription>
              </CardHeader>
              <CardContent>
                {participant.qr_code && (
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <Image 
                      src={participant.qr_code} 
                      alt="QR Code for donations" 
                      width={200} 
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mb-4">
                  Donations follow SmartProof™ 80-15-5 model
                </p>
                <Button className="w-full" asChild>
                  <Link href={`/donate?demo=true&participant=${participant.id}`}>
                    Donate Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Impact Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Impact So Far
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      ${participant.total_received.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Received</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{participant.donation_count}</div>
                      <p className="text-xs text-muted-foreground">Donations</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{participant.services_completed}</div>
                      <p className="text-xs text-muted-foreground">Services</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shelter Link Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Shelter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/old-brewery-mission">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit {participant.shelter_name}
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Learn more about the shelter supporting {participant.firstName}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Share Profile CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <Share2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Help Spread the Word</h3>
            <p className="text-muted-foreground mb-6">
              Share {participant.firstName}&apos;s profile to help them reach their goals faster
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleShare} size="lg">
                <Share2 className="mr-2 h-5 w-5" />
                Share Profile
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/scan-give">
                  <Home className="mr-2 h-5 w-5" />
                  Discover More Participants
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
