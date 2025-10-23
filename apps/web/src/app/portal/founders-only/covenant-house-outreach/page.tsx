'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Download,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Calendar,
  Target,
  DollarSign,
  CheckCircle,
  Rocket
} from 'lucide-react';
import { checkFounderAccess } from '@/services/founderAccessService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MARKDOWN_CONTENT = `
# Covenant House Canada Partnership Proposal

## Executive Outreach: SHELTR + Covenant House Pilot Project 2026-2027

**Date:** October 2025  
**Prepared For:** Covenant House Canada Leadership  
**Subject:** Next-Generation HMIS Platform & Youth Empowerment Technology Pilot

---

## 🎯 Executive Summary

SHELTR is proposing a transformative pilot partnership with Covenant House Canada to revolutionize how we support youth experiencing homelessness. Our platform combines next-generation HMIS capabilities with breakthrough funding technology that empowers youth while generating sustainable operational revenue for shelter partners.

**Think of it as: "Venmo for the Unhoused"** — A dignified, tech-for-good platform that creates direct pathways from crisis to stability. It's a GoFundMe system with dignity, transparency, and measurable outcomes built in.

**The Mission:** Overflow management and emergency temporary housing solutions. **Anything is better than a tent.**

---

## 🌐 How SHELTR Works: One Platform, Every Stakeholder

SHELTR operates as a **unified open-source ecosystem** where every stakeholder contributes and benefits from a revolutionary approach to addressing homelessness. We've built upon traditional HMIS systems by unleashing intelligent systems into the status quo.

### **The Unified Ecosystem**

Every donation is strategically distributed through our **SmartFund™ technology**:
- **80%** directly empowers participants for immediate needs
- **15%** funds emergency housing solutions (PODS deployment & mobile housing)
- **5%** sustains platform operations and shelter partners

This creates a **self-reinforcing cycle** where immediate relief generates lasting systemic change, transforming charity into measurable investment with compound returns for the entire community.

### **Stakeholder Benefits**

**🧑 Participants: Empowered Through Direct Support**
- **Personal QR Code**: Unique identifier for receiving direct donations
- **Instant Financial Access**: 80% of donations immediately available via virtual card
- **Housing Pathway**: 15% automatically contributes to emergency housing solutions
- **Dignity & Agency**: Direct control over their resources and journey

**💚 Donors: Give with Attitude, Demand Returns**
- **Blockchain Transparency**: Donations controlled by immutable smart contracts
- **Impact Measurement**: Real-time updates on measurable impact
- **Instant Giving**: QR code scanning with no intermediaries, no delays

**🏢 Shelters: Operational Excellence with Overflow Solutions**
- **Participant Management**: Digital profiles, QR code generation, progress tracking
- **Real-Time Analytics**: Track donations, impact metrics, resource allocation
- **Overflow Relief**: Seamlessly connect youth to emergency PODS and mobile housing
- **Sustainable Revenue**: 5% of all participant donations flows to operations

### **The Tech-for-Good Promise**

**Anything is better than a tent.** SHELTR provides immediate overflow management and emergency temporary housing pathways when traditional shelters are at capacity. We're not replacing Covenant House—we're **amplifying your capacity** and creating safety nets when beds aren't available.

---

## 📊 Pilot Proposal: Covenant House Toronto & Vancouver

### **Phase 1: Foundation (Months 1-3)**

**Participants:** 25 youth at Toronto, 25 youth at Vancouver  
**Timeline:** January–March 2026  

**Expected Outcomes (Month 3):**
- 50 youth actively using the platform
- $500–$1,000 in initial community donations
- 8x faster intake process (45 min → 8 min)
- 100% digital case file management

### **Phase 2: Scale & Optimize (Months 4-12)**

**Participants:** Scale to 100 youth per site (200 total)  
**Timeline:** April 2026–December 2026

**Expected Outcomes (Month 12):**
- 200 youth empowered with direct community funding
- $50,000+/month in community donations across both sites
- $2,500+/month in automated operations revenue per site
- 75% reduction in administrative burden

---

## 💰 Financial Model & ROI

### **Conservative Projections (100 Youth per Site)**

**Annual Impact per Site:**
- Covenant House operations revenue: **$30,000/year**
- Total platform volume: **$600,000/year**
- Youth directly empowered: 100+ lives

**ROI Calculation:**
- **$15,000/year** in staff time savings
- **$25,000/year** in improved grant success
- **$30,000/year** in automated operations revenue
- **= $70,000/year total value**
- **= 300% first-year ROI**

---

## 📞 Key Contacts & Next Steps

### **Covenant House Toronto**

**Mark Aston**, Executive Director  
Email: mark.aston@covenanthouse.ca  
Phone: 416-598-4898  
Address: 20 Gerrard St E, Toronto, ON M5B 2P3

**John Harvey**, Chief Program Officer

---

### **Covenant House Vancouver**

**Deb Lester**, CEO  
Email: deb.lester@covenanthousebc.org  
Phone: 604-685-5437

**Maya Singh**, Senior Director, Business Transformation & Strategic Initiatives

---

## 🎯 Immediate Next Steps

### **Stage 1: Discovery Call (30 minutes)**
- Introduction to SHELTR platform and vision
- Overview of pilot structure and commitments
- Q&A on technology, privacy, and youth impact
- **Proposed:** November 2025

### **Stage 2: Detailed Presentation (60 minutes)**
- Live platform demonstration
- In-depth financial model review
- **Proposed:** December 2025

### **Stage 3: Pilot Agreement & Launch**
- Finalize pilot scope and success metrics
- Execute partnership agreement
- **Target Launch:** January 2026

---

**Together, we can prove that technology + community + compassion = the end of youth homelessness.**
`;

export default function CovenantHouseOutreachPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hasAccess = checkFounderAccess();
    
    if (!hasAccess) {
      router.push('/portal');
      return;
    }
    
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
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
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/portal/founders-only" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Founders Portal</span>
            </Link>
            <Badge variant="outline" className="border-pink-600 text-pink-600">
              <Building2 className="h-3 w-3 mr-1" />
              Partnership Proposal
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Title Section */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-pink-600 text-white">Strategic Partnership</Badge>
          <h1 className="text-4xl font-bold mb-4">Covenant House Canada Outreach</h1>
          <p className="text-xl text-muted-foreground">
            Executive Partnership Proposal for 2026-2027 Youth Homelessness Innovation Pilot
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-600">
              <Rocket className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <a href="https://github.com/mrjones/sheltr-ai/blob/main/docs/06-user-guides/covenant-house-canada-outreach.md" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View on GitHub
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                <a href="https://sheltr-ai.web.app/solutions/organizations/case-study" target="_blank" rel="noopener noreferrer">
                  <Target className="h-4 w-4 mr-2" />
                  View Case Study
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <a href="https://sheltr-ai.web.app/solutions/organizations/hmis-guide" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  HMIS Guide
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">200 Youth</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">Toronto + Vancouver</p>
              <p className="text-sm text-muted-foreground">Pilot Scale by Month 12</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">$60K/Year</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">Operations Revenue</p>
              <p className="text-sm text-muted-foreground">Combined Both Sites</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">300% ROI</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">First-Year Return</p>
              <p className="text-sm text-muted-foreground">Conservative Projection</p>
            </CardContent>
          </Card>
        </div>

        {/* Primary Contacts */}
        <Card className="mb-8 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Mail className="h-5 w-5" />
              Primary Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Toronto Contact */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-3">🇨🇦 Toronto</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-sm">Mark Aston</p>
                    <p className="text-xs text-muted-foreground">Executive Director</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a href="mailto:mark.aston@covenanthouse.ca" className="hover:underline">
                      mark.aston@covenanthouse.ca
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>416-598-4898</span>
                  </div>
                </div>
              </div>

              {/* Vancouver Contact */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-green-700 dark:text-green-300 mb-3">🇨🇦 Vancouver</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-sm">Deb Lester</p>
                    <p className="text-xs text-muted-foreground">CEO</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-green-600" />
                    <a href="mailto:deb.lester@covenanthousebc.org" className="hover:underline">
                      deb.lester@covenanthousebc.org
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>604-685-5437</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Calendar className="h-5 w-5" />
              3-Stage Engagement Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold">Discovery Call (30 min) - November 2025</p>
                  <p className="text-sm text-muted-foreground">Introduction, overview, Q&A</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold">Detailed Presentation (60 min) - December 2025</p>
                  <p className="text-sm text-muted-foreground">Live demo, financial review, training preview</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-semibold">Pilot Launch - January 2026</p>
                  <p className="text-sm text-muted-foreground">Agreement execution, onboarding, training</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Proposal Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Full Proposal Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">{children}</h3>,
                  p: ({children}) => <p className="mb-4 text-foreground/90 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                  li: ({children}) => <li className="text-foreground/90">{children}</li>,
                  strong: ({children}) => <strong className="font-bold text-foreground">{children}</strong>,
                  hr: () => <hr className="my-8 border-border" />,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>,
                }}
              >
                {MARKDOWN_CONTENT}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Proceed?</h3>
            <p className="text-muted-foreground mb-6">
              Download the full proposal or contact Covenant House leadership to schedule the discovery call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white">
                <a href="https://github.com/mrjones/sheltr-ai/blob/main/docs/06-user-guides/covenant-house-canada-outreach.md" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Proposal
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-pink-600 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <Link href="/portal/founders-only">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

