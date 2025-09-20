'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  X, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  Users, 
  Building, 
  Coins,
  ArrowRight,
  Info,
  Calculator,
  Target
} from 'lucide-react';

interface RevenueExplanationTooltipProps {
  className?: string;
}

export function RevenueExplanationTooltip({ className = '' }: RevenueExplanationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const revenueStreams = [
    {
      name: 'SmartFund™ Platform Fees',
      percentage: '5%',
      description: 'Automatic allocation from every donation for platform sustainability',
      example: '$100 donation = $5 platform fee',
      color: 'bg-blue-500',
      icon: DollarSign,
      details: 'This is our primary revenue source. When someone donates $100, $80 goes to the participant, $15 to housing fund, and $5 to platform operations.'
    },
    {
      name: 'Marketplace Transaction Fees',
      percentage: '2-3%',
      description: 'Applied to Homeless Depot purchases (exempt for participants using SHELTR-S)',
      example: 'Premium features for SHELTR holders',
      color: 'bg-green-500',
      icon: Building,
      details: 'Revenue from marketplace transactions where organizations purchase goods/services. Participants using SHELTR-S tokens pay zero fees.'
    },
    {
      name: 'Organization Premium Features',
      percentage: 'Subscription',
      description: 'Advanced analytics, custom branding, white-label solutions',
      example: 'Enterprise dashboards, priority support',
      color: 'bg-purple-500',
      icon: TrendingUp,
      details: 'Monthly/annual subscriptions for shelters and organizations wanting advanced features, custom branding, and priority support.'
    },
    {
      name: 'Corporate Partnership Fees',
      percentage: 'Variable',
      description: 'Enterprise integrations and revenue sharing agreements',
      example: 'Custom deployment, API access',
      color: 'bg-orange-500',
      icon: Users,
      details: 'Revenue from corporate partners who integrate with our platform or participate in revenue sharing agreements.'
    },
    {
      name: 'DeFi Yield Generation',
      percentage: '4-8% APY',
      description: 'Conservative yield strategies on housing fund investments',
      example: 'Risk-managed portfolio allocation',
      color: 'bg-indigo-500',
      icon: Coins,
      details: 'Returns generated from investing the 15% housing fund allocation in conservative DeFi strategies to grow housing solutions funding.'
    }
  ];

  const smartFundBreakdown = [
    { label: 'Direct Participant Support', percentage: 80, color: 'bg-green-500', description: 'Immediate SHELTR-S tokens for essential needs' },
    { label: 'Housing Fund Initiative', percentage: 15, color: 'bg-blue-500', description: 'Long-term housing solutions investment' },
    { label: 'Platform Operations', percentage: 5, color: 'bg-purple-500', description: 'Platform sustainability and operations' }
  ];

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`text-muted-foreground hover:text-foreground p-1 h-6 w-6 ${className}`}
        title="How SHELTR generates revenue"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">SHELTR Revenue Model</CardTitle>
                <p className="text-sm text-muted-foreground">How we sustainably fund social impact</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SmartFund Distribution */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">SmartFund™ Distribution Model</h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Core Revenue</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Every donation is automatically distributed through our transparent SmartFund system:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {smartFundBreakdown.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="font-bold text-lg">{item.percentage}%</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Example: $100 Donation</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>$80 → Participant</div>
                <div>$15 → Housing Fund</div>
                <div className="font-bold text-blue-600">$5 → Platform Revenue</div>
              </div>
            </div>
          </div>

          {/* Revenue Streams */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Diversified Revenue Streams</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {revenueStreams.map((stream, index) => (
                <Card key={index} className="border-l-4" style={{ borderLeftColor: stream.color.replace('bg-', '#') }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${stream.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <stream.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{stream.name}</h4>
                          <Badge variant="outline" className="text-xs">{stream.percentage}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{stream.description}</p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                          <span className="font-medium">Example: </span>
                          {stream.example}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{stream.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Principles */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Revenue Principles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-sm">Participant Protection</h4>
                    <p className="text-xs text-muted-foreground">Zero fees for participants using SHELTR-S tokens</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-sm">Maximum Impact</h4>
                    <p className="text-xs text-muted-foreground">95% of donations reach participants and housing solutions</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-sm">Sustainable Growth</h4>
                    <p className="text-xs text-muted-foreground">Diversified revenue streams ensure long-term viability</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-sm">Complete Transparency</h4>
                    <p className="text-xs text-muted-foreground">All transactions verified on blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Current Implementation Status</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">✅ Active: </span>
                SmartFund distribution, Platform fees calculation
              </div>
              <div>
                <span className="font-medium">🚧 In Development: </span>
                Marketplace fees, Premium subscriptions
              </div>
              <div>
                <span className="font-medium">📋 Planned: </span>
                DeFi yield integration, Corporate partnerships
              </div>
              <div>
                <span className="font-medium">🔍 Data Source: </span>
                Real donation data from demo_donations collection
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-blue-500 to-purple-600">
              Got it, thanks!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
