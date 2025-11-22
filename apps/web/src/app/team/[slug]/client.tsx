'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ArrowLeft, ArrowRight, Home, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import ThemeLogo from '@/components/ThemeLogo';
import BioHero from '../components/BioHero';
import BioContent from '../components/BioContent';
import CareerHighlights from '../components/CareerHighlights';

interface UserBioData {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  profilePicture?: string;
  slug: string;
  bio: {
    title: string;
    subtitle?: string;
    tagline?: string;
    summary?: string;
    fullBio?: string;
    expertise?: string[];
    yearsOfExperience?: number;
    department: string;
    careerHighlights?: Array<{
      id: string;
      title: string;
      organization: string;
      description: string;
      year: string;
      logo?: string;
      link?: string;
    }>;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
      email?: string;
    };
    showOnTeamPage: boolean;
  };
  bioImages?: Array<{
    id: string;
    url: string;
    caption?: string;
    order: number;
  }>;
}

interface ClientPageProps {
  slug: string;
}

export default function TeamMemberBioClient({ slug }: ClientPageProps) {
  const router = useRouter();
  
  const [userData, setUserData] = useState<UserBioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTeamMembers, setAllTeamMembers] = useState<Array<{slug: string, name: string}>>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    loadTeamMember();
  }, [slug]);

  const loadTeamMember = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Loading team member with slug:', slug);

      // Query users collection by slug
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('slug', '==', slug),
        where('bio.showOnTeamPage', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as UserBioData;
        console.log('✅ Team member loaded:', data.displayName);
        setUserData(data);
      } else {
        console.log('❌ Team member not found');
        setError('Team member not found');
      }
      
      // Load all team members for navigation
      const allMembersQuery = query(
        usersRef,
        where('bio.showOnTeamPage', '==', true)
      );
      const allMembersSnapshot = await getDocs(allMembersQuery);
      const members = allMembersSnapshot.docs
        .map(doc => ({
          slug: doc.data().slug,
          name: doc.data().displayName,
          order: doc.data().bio?.order || 999
        }))
        .filter(m => m.slug) // Only include members with slugs
        .sort((a, b) => a.order - b.order);
      
      setAllTeamMembers(members);
      
      // Find current member's index
      const idx = members.findIndex(m => m.slug === slug);
      setCurrentIndex(idx);
      
    } catch (err) {
      console.error('❌ Error loading team member:', err);
      setError('Failed to load team member');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600" />
          <p className="text-lg text-muted-foreground">Loading team member...</p>
        </div>
      </div>
    );
  }

  // Error or Not Found state
  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">🤔</div>
          <h1 className="text-3xl font-bold">Team Member Not Found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the team member you're looking for.
          </p>
          <Link href="/team">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get previous and next members
  const previousMember = currentIndex > 0 ? allTeamMembers[currentIndex - 1] : null;
  const nextMember = currentIndex >= 0 && currentIndex < allTeamMembers.length - 1 ? allTeamMembers[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors flex items-center">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/team" className="hover:text-foreground transition-colors flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Team
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{userData?.displayName}</span>
            </div>
            
            {/* Back to Team Button */}
            <Link href="/team">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bio Hero */}
      <BioHero 
        name={userData.displayName}
        title={userData.bio.title}
        subtitle={userData.bio.subtitle}
        tagline={userData.bio.tagline}
        profileImage={userData.profilePicture}
        socialLinks={userData.bio.socialLinks}
        department={userData.bio.department}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Bio Content */}
        <BioContent 
          description={userData.bio.fullBio || userData.bio.summary || ''}
          expertise={userData.bio.expertise || []}
          experience={userData.bio.yearsOfExperience ? `${userData.bio.yearsOfExperience}+ years` : ''}
          memberName={userData.displayName}
        />
        
        {/* Career Highlights */}
        {userData.bio.careerHighlights && userData.bio.careerHighlights.length > 0 && (
          <CareerHighlights highlights={userData.bio.careerHighlights} />
        )}
        
        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Previous Member */}
              <div className="flex-1 w-full">
                {previousMember ? (
                  <Link href={`/team/${previousMember.slug}`}>
                    <Button variant="outline" className="w-full justify-start group hover:border-emerald-500 transition-all">
                      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground">Previous</div>
                        <div className="font-semibold">{previousMember.name}</div>
                      </div>
                    </Button>
                  </Link>
                ) : (
                  <div className="opacity-0">
                    <Button variant="outline" className="w-full" disabled>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Back to Team Center Button */}
              <div className="flex-shrink-0">
                <Link href="/team">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                    <Users className="h-5 w-5 mr-2" />
                    View All Team Members
                  </Button>
                </Link>
              </div>
              
              {/* Next Member */}
              <div className="flex-1 w-full">
                {nextMember ? (
                  <Link href={`/team/${nextMember.slug}`}>
                    <Button variant="outline" className="w-full justify-end group hover:border-emerald-500 transition-all">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Next</div>
                        <div className="font-semibold">{nextMember.name}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <div className="opacity-0">
                    <Button variant="outline" className="w-full" disabled>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

