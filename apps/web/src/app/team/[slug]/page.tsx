'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
    description: string;
    expertise: string[];
    experience: string;
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

// For static export - generate paths for known team members
export function generateStaticParams() {
  return [
    { slug: 'joel-yaffe' },
    // Add more team members as they're created
  ];
}

export default function TeamMemberBioPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [userData, setUserData] = useState<UserBioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/team">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </Link>
      </div>

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
          description={userData.bio.description}
          expertise={userData.bio.expertise}
          experience={userData.bio.experience}
        />
        
        {/* Career Highlights */}
        {userData.bio.careerHighlights && userData.bio.careerHighlights.length > 0 && (
          <CareerHighlights highlights={userData.bio.careerHighlights} />
        )}
      </div>
    </div>
  );
}

