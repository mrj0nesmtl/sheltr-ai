"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Handshake, 
  FileText, 
  Download, 
  Calendar,
  Shield,
  PieChart,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Home
} from 'lucide-react';

export default function TraditionalStrategy() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user came from investor relations page
    const referrer = document.referrer;
    const sessionAccess = sessionStorage.getItem('investor-relations-access');
    
    if (referrer.includes('/investor-relations') || sessionAccess === 'granted') {
      setHasAccess(true);
      sessionStorage.setItem('investor-relations-access', 'granted');
    } else {
      // Redirect to investor relations if no access
      router.push('/investor-relations');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/investor-relations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Investor Relations
          </Link>
          <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">Traditional Strategy</span>
        </nav>
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">SHELTR</h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Traditional Funding Strategy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Executive Summary & Partnership-Based Investment Framework for Q4 2025
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Executive Summary</span>
            </CardTitle>
            <CardDescription>
              Strategic Partnership & Traditional Investment Approach
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">The Opportunity</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  SHELTR represents a paradigm shift in addressing homelessness through technology. 
                  Our platform combines AI-driven resource allocation, blockchain transparency, and 
                  real-time impact tracking to create the first comprehensive homelessness solution ecosystem.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$2.8B</div>
                    <div className="text-xs text-gray-600">Global Homelessness Market</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">580K+</div>
                    <div className="text-xs text-gray-600">Homeless Population (US)</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Traditional Model Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">Regulatory Clarity:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        Established securities framework with clear compliance paths
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">Institutional Familiarity:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        Traditional equity structures that investors understand
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">Institutional Access:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        Broader investor base comfortable with equity investments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Strategy */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Partnership Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Handshake className="w-5 h-5 text-green-600" />
                <span>Strategic Partnership Framework</span>
              </CardTitle>
              <CardDescription>
                Revenue-sharing partnerships with established players
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-300">Tier 1: Payment Processors</h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Partner with payment networks for transaction processing fees
                  </p>
                  <div className="text-xs text-green-600 mt-2">Revenue Share: 15-25%</div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Tier 2: Municipal Contracts</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Government SaaS contracts for shelter management systems
                  </p>
                  <div className="text-xs text-blue-600 mt-2">ARR Target: $50K-200K per city</div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300">Tier 3: HMIS & Shelter Networks</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                    Integration with HMIS platforms and shelter networks - money flows TO shelters, not from them
                  </p>
                  <div className="text-xs text-purple-600 mt-2">License Fee: $10K-50K annually</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <span>Investment Structure</span>
              </CardTitle>
              <CardDescription>
                Traditional equity with performance milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">Pre-Seed Round</div>
                    <div className="text-sm text-gray-600">Q4 2025</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">$150K</div>
                    <div className="text-xs text-gray-500">8-12% equity</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">Seed Round</div>
                    <div className="text-sm text-gray-600">Q2 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">$500K</div>
                    <div className="text-xs text-gray-500">15-20% equity</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">Series A</div>
                    <div className="text-sm text-gray-600">Q4 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">$2M</div>
                    <div className="text-xs text-gray-500">20-25% equity</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Investor Protections</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Board observer rights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Anti-dilution provisions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Performance milestones</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Liquidation preferences</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Financial Projections & Milestones</span>
            </CardTitle>
            <CardDescription>
              Revenue targets and key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Metric</th>
                    <th className="text-center p-2">Q4 2025</th>
                    <th className="text-center p-2">Q2 2026</th>
                    <th className="text-center p-2">Q4 2026</th>
                    <th className="text-center p-2">Q4 2027</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-2 font-medium">Monthly Recurring Revenue</td>
                    <td className="text-center p-2">$5K</td>
                    <td className="text-center p-2">$25K</td>
                    <td className="text-center p-2">$75K</td>
                    <td className="text-center p-2">$200K</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Active Shelter Partners</td>
                    <td className="text-center p-2">3</td>
                    <td className="text-center p-2">15</td>
                    <td className="text-center p-2">50</td>
                    <td className="text-center p-2">150</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Transaction Volume</td>
                    <td className="text-center p-2">$50K</td>
                    <td className="text-center p-2">$500K</td>
                    <td className="text-center p-2">$2M</td>
                    <td className="text-center p-2">$10M</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Team Size</td>
                    <td className="text-center p-2">4</td>
                    <td className="text-center p-2">8</td>
                    <td className="text-center p-2">15</td>
                    <td className="text-center p-2">25</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Valuation</td>
                    <td className="text-center p-2">$1.5M</td>
                    <td className="text-center p-2">$3M</td>
                    <td className="text-center p-2">$8M</td>
                    <td className="text-center p-2">$20M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Doug's Role & Partnership */}
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Strategic Investor & Advisory Opportunity</span>
            </CardTitle>
            <CardDescription>
              Strategic advisory position with payment sector expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Advisory Responsibilities</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Strategic guidance on payment infrastructure & partnerships</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Network introductions to payment sector contacts</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Advisory support for institutional fundraising</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Strategic counsel on financial partnerships</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Compensation Structure</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Strategic Equity</span>
                      <span className="text-green-600 font-bold">3-5%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Vested over 4 years with advisory milestones</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Partnership Bonus</span>
                      <span className="text-blue-600 font-bold">1-2%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">From successful partnerships facilitated</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Advisory Retainer</span>
                      <span className="text-purple-600 font-bold">$2-3K/month</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Flexible commitment, success-based escalation</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Items & Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span>Next Steps & Action Items</span>
            </CardTitle>
            <CardDescription>
              Implementation roadmap for Q4 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Immediate Actions (30 days)</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Finalize partnership agreement with Doug</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Legal structure setup (Delaware C-Corp)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Initial investor prospectus preparation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Payment processor partnership outreach</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Medium-term Goals (90 days)</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Complete $150K pre-seed funding round</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Launch pilot program with 3 shelter partners</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Achieve $5K MRR milestone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    <span className="text-sm">Begin Series A preparation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Documents */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <h3 className="text-lg font-semibold">Supporting Documents</h3>
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Coming Soon</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Access detailed financial models, partnership agreements, and investor materials
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Partnership Agreement Template</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Financial Model (Excel)</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Investor Deck (PDF)</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Market Analysis Report</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          <p>© 2025 SHELTR. Confidential and Proprietary.</p>
          <p>This document contains confidential business information. Distribution limited to authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
}
