'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Lock, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Simple hardcoded list of documents available to investors
const INVESTOR_DOCUMENTS = [
  {
    id: 'adyen-integration',
    title: 'Adyen Integration Strategy',
    description: 'Comprehensive analysis of Adyen for Platforms (Balanced Model) with 16-week implementation roadmap for SmartFund™ 80-15-5 distribution',
    badge: 'Strategic',
    badgeColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-200',
  },
  {
    id: 'blockchain-architecture',
    title: 'Blockchain Architecture',
    description: 'Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed returns',
    badge: 'SmartFund™',
    badgeColor: 'bg-orange-600',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
  },
  {
    id: 'business-plan',
    title: 'Business Plan',
    description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
    badge: 'Secure',
    badgeColor: 'bg-red-600',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    id: 'covenant-house-outreach',
    title: 'Covenant House Proposal',
    description: 'Executive partnership proposal for Covenant House Canada 2026-2027 youth homelessness innovation pilot',
    badge: 'Partnership',
    badgeColor: 'bg-pink-600',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
  },
  {
    id: 'development-roadmap',
    title: 'Development Roadmap',
    description: '60-day public launch timeline with client onboarding strategy and AI achievements',
    badge: 'Launch Plan',
    badgeColor: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-200',
  },
  {
    id: 'github-repository',
    title: 'GitHub Repository',
    description: 'Complete source code, smart contracts, and development history',
    badge: 'Source Code',
    badgeColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    isExternal: true,
  },
  {
    id: 'investor-relations',
    title: 'Investor Relations',
    description: 'Pre-seed funding information, financial projections, and investment terms',
    badge: 'Pre-Seed',
    badgeColor: 'bg-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    id: 'leadership-team',
    title: 'Leadership Team',
    description: 'Meet the SHELTR leadership team, founders, and key contributors driving our mission',
    badge: 'Team',
    badgeColor: 'bg-indigo-600',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
  },
  {
    id: 'msb-registration',
    title: 'MSB Registration Guide',
    description: 'Canadian regulatory compliance guide for crypto-enabled donation platforms - FINTRAC MSB requirements and incorporation',
    badge: 'Legal',
    badgeColor: 'bg-red-600',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    id: 'proposed-payment-rails',
    title: 'Proposed Payment Rails',
    description: 'Adyen + Coinbase integration architecture with single-token stable fund model',
    badge: 'Enterprise',
    badgeColor: 'bg-green-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
  {
    id: 'platform-admin-guide',
    title: 'Platform Administrator Guide',
    description: 'Complete operational guide for Platform Administrators - user management, security monitoring, and strategic oversight',
    badge: 'Essential',
    badgeColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    id: 'shelter-research',
    title: 'Shelter Research Hub',
    description: 'Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, and innovative programs across North America',
    badge: 'Research',
    badgeColor: 'bg-teal-600',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
  },
  {
    id: 'system-design',
    title: 'System Design Architecture',
    description: 'Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration blueprints',
    badge: 'Architecture',
    badgeColor: 'bg-slate-600',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  },
  {
    id: 'technical-whitepaper',
    title: 'Technical White Paper',
    description: 'Revolutionary enterprise-grade platform with single-token architecture and blockchain transparency',
    badge: 'v2.0',
    badgeColor: 'bg-emerald-600',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
];

export default function InvestorDataRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Authorization check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else if (user.role !== 'investor') {
        toast.error('Access denied: Investor credentials required');
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
        // Grant session access for embedded pages
        sessionStorage.setItem('investor-access', 'granted');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Investor Data Room</h1>
                <p className="text-xs text-muted-foreground">Secure Investment Materials</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome to the SHELTR Investor Data Room.</h2>
              <p className="text-blue-100">
                This secure portal contains confidential investment materials, financial projections, and strategic documents. 
                All materials are proprietary and subject to NDA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Documents */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Investment Documents</h3>
            <p className="text-muted-foreground">Confidential materials for authorized investors</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INVESTOR_DOCUMENTS.map((doc) => (
              <Card
                key={doc.id}
                className={`group hover:shadow-lg transition-all duration-200 border-2 ${doc.borderColor} cursor-pointer`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <FileText className={`h-5 w-5 ${doc.textColor}`} />
                    </div>
                    <Badge className={`${doc.badgeColor} text-white`}>
                      {doc.badge}
                    </Badge>
                  </div>

                  <h4 className={`text-lg font-bold mb-2 ${doc.textColor}`}>
                    {doc.title}
                  </h4>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {doc.description}
                  </p>

                  <Link href={`/ir/documents/${doc.id}`}>
                    <Button
                      variant="outline"
                      className={`w-full border-2 ${doc.textColor} hover:bg-opacity-10`}
                    >
                      View Document
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 border-t bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Lock className="inline h-4 w-4 mr-1" />
            All documents are confidential and protected. Unauthorized sharing or distribution is strictly prohibited.
          </p>
        </div>
      </section>
    </div>
  );
}
