'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function InvestorDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('Document');

  const documentSlug = params.slug as string;

  // Authorization check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else if (user.role !== 'investor' && user.role !== 'super_admin' && user.role !== 'platform_admin') {
        toast.error('Access denied: Investor or Admin credentials required');
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
        // Grant session access for embedded pages
        sessionStorage.setItem('investor-access', 'granted');
      }
    }
  }, [user, authLoading, router]);

  // Set document title from slug
  useEffect(() => {
    if (!isAuthorized) return;
    
    // Convert slug to title (e.g., "adyen-integration" -> "Adyen Integration")
    const title = documentSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    setDocumentTitle(title);
    setIsLoading(false);
  }, [documentSlug, isAuthorized]);

  // Handle external links (GitHub) - MUST BE BEFORE ANY RETURNS
  useEffect(() => {
    if (documentSlug === 'github-repository' && isAuthorized) {
      // Open GitHub in new tab
      window.open('https://github.com/mrj0nesmtl/sheltr-ai', '_blank');
      // Redirect back to data room
      router.push('/ir/dataroom');
    }
  }, [documentSlug, isAuthorized, router]);

  // ALL HOOKS MUST BE ABOVE THIS LINE
  // =====================================

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/ir/dataroom">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Data Room
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map document slugs to their URLs
  const getFoundersPortalUrl = (slug: string): string => {
    const urlMap: Record<string, string> = {
      // Public pages (no auth needed)
      'blockchain-architecture': '/tokenomics',
      'proposed-payment-rails': '/docs/payment-rails',
      'shelter-research': '/portal/founders-only/shelter-research',
      'technical-whitepaper': '/docs/whitepaper',
      'leadership-team': '/team',
      'system-design': '/docs/system-design',
      
      // Founders Portal pages with SecureDocumentViewer
      'adyen-integration': '/portal/founders-only/adyen-integration',
      'business-plan': '/portal/founders-only/business-plan',
      'covenant-house-outreach': '/portal/founders-only/covenant-house-outreach',
      'development-roadmap': '/tokenomics',
      'investor-relations': '/portal/founders-only/investor-relations',
      'msb-registration': '/portal/founders-only/msb-registration',
      'platform-admin-guide': '/docs',
    };

    return urlMap[slug] || `/portal/founders-only/${slug}`;
  };

  const iframeUrl = `${getFoundersPortalUrl(documentSlug)}?embed=true`;

  // Don't render anything for external links (handled by useEffect)
  if (documentSlug === 'github-repository') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Opening GitHub repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Minimal Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/ir/dataroom">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Data Room
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{documentTitle}</span>
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Iframe Content */}
      <div className="w-full" style={{ height: 'calc(100vh - 60px)' }}>
        <iframe
          src={iframeUrl}
          className="w-full h-full border-0"
          title={documentTitle}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}

