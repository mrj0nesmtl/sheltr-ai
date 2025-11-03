'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, FileText, ExternalLink, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface ResearchDocument {
  id: string;
  title: string;
  slug: string;
  category: string;
  metadata?: {
    description?: string;
    displayTitle?: string;
    color?: string;
  };
  tags: string[];
}

// Component that uses useSearchParams (wrapped in Suspense)
function ShelterResearchHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);

  // Check if embedded in iframe
  useEffect(() => {
    setIsEmbedded(searchParams.get('embed') === 'true');
  }, [searchParams]);

  useEffect(() => {
    const checkAuthAndLoadDocs = async () => {
      // Check for investor session access (set when investor logs in)
      const hasInvestorAccess = typeof window !== 'undefined' && 
                                sessionStorage.getItem('investor-access') === 'granted';

      if (!user && !hasInvestorAccess) {
        router.push('/portal');
        return;
      }

      try {
        // If investor access is granted via session, allow access
        if (hasInvestorAccess) {
          setIsAuthorized(true);
          await loadResearchDocuments();
          setIsLoading(false);
          return;
        }

        // Otherwise, check user role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          
          if (role === 'super_admin' || role === 'platform_admin' || role === 'investor') {
            setIsAuthorized(true);
            await loadResearchDocuments();
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/portal');
        }
      } catch (error) {
        console.error('Authorization error:', error);
        router.push('/portal');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadResearchDocuments = async () => {
    try {
      const q = query(
        collection(db, 'founder_documents'),
        where('category', '==', 'shelter-research')
      );
      const snapshot = await getDocs(q);
      
      const docs: ResearchDocument[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        slug: doc.data().slug,
        category: doc.data().category,
        metadata: doc.data().metadata,
        tags: doc.data().tags || [],
      }));
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading research documents:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const colorMap: Record<string, string> = {
    purple: 'border-purple-200 dark:border-purple-800',
    blue: 'border-blue-200 dark:border-blue-800',
    red: 'border-red-200 dark:border-red-800',
    green: 'border-green-200 dark:border-green-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Hide when embedded */}
      {!isEmbedded && (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-2xl font-bold">
                  SHELTR
                </Link>
                <Badge className="bg-blue-600 text-white">
                  <Lock className="h-3 w-3 mr-1" />
                  Research Hub
                </Badge>
              </div>
              
              <Link href="/portal/founders-only">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Button>
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <Badge className="bg-blue-600 text-white">Research</Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Shelter Research Hub</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, 
            and innovative programs across North America
          </p>
        </div>

        {/* Security Notice */}
        <Alert className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <Lock className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <strong>Founders Only:</strong> This research is compiled exclusively for SHELTR co-founders 
            and contains proprietary market analysis and competitive intelligence.
          </AlertDescription>
        </Alert>

        {/* Research Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {documents.map((doc) => {
            const displayTitle = doc.metadata?.displayTitle || doc.title;
            const description = doc.metadata?.description || '';
            const color = doc.metadata?.color || 'blue';
            const borderClass = colorMap[color] || colorMap.blue;

            return (
              <Card key={doc.id} className={`hover:shadow-lg transition-all ${borderClass}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FileText className={`h-6 w-6 text-${color}-600`} />
                    <Badge className={`bg-${color}-600 text-white`}>
                      {doc.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{displayTitle}</CardTitle>
                  <CardDescription className="text-sm">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doc.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/portal/founders-only/shelter-research/${doc.slug}`}>
                    <Button variant="outline" className="w-full">
                      View Research
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back Button - Dynamic based on context */}
        <div className="flex justify-center">
          <Link href={isEmbedded ? "/ir/dataroom" : "/portal/founders-only"}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEmbedded ? "Back to Data Room" : "Back to Founders Portal"}
            </Button>
          </Link>
        </div>

        {/* Confidentiality Footer */}
        <Card className="mt-8 bg-slate-900 text-white border-slate-700">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Confidential Research</h4>
                <p className="text-sm text-slate-300">
                  All research documents are confidential and proprietary to SHELTR-AI. 
                  Unauthorized sharing or distribution is strictly prohibited.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ShelterResearchHubPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading research hub...</p>
        </div>
      </div>
    }>
      <ShelterResearchHubContent />
    </Suspense>
  );
}

