'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Calendar, ArrowRight, Lock, Target } from 'lucide-react';

interface RevenueCardProps {
  linkPath?: string;
}

export function RevenueCard({ linkPath = '/portal/founders-only/revenue' }: RevenueCardProps) {
  const totalRevenue24Months = 385338;
  const year1ARR = 500000; // Projected Year 1 ARR
  const year2ARR = 2000000; // Approaching Year 2 ARR
  const profitabilityMonth = 12; // Month 12 = August 2025
  const avgMonthlyRevenueY2 = 27712; // Final month revenue

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              2-Year Revenue Projections
            </CardTitle>
            <CardDescription>
              Pre-revenue to scale financial forecasting (24 months)
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Lock className="h-3 w-3 mr-1" />
            Confidential
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Revenue (24mo)</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalRevenue24Months)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Year 1 ARR Target</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(year1ARR)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Year 2 ARR Path</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(year2ARR)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Final MRR</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {formatCurrency(avgMonthlyRevenueY2)}
            </p>
          </div>
        </div>

        {/* Progress Bar - Path to Profitability */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Path to $500K ARR</span>
            <span className="font-medium">{((totalRevenue24Months / year1ARR) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 transition-all"
              style={{ width: `${(totalRevenue24Months / year1ARR) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Break-even Month</p>
              <p className="font-semibold">Month {profitabilityMonth}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Timeline</p>
              <p className="font-semibold">Sep 24 - Aug 26</p>
            </div>
          </div>
        </div>

        {/* Revenue Streams Badge */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Badge variant="outline" className="text-xs">Transaction Fees</Badge>
          <Badge variant="outline" className="text-xs">SaaS Subscriptions</Badge>
          <Badge variant="outline" className="text-xs">Sponsorships</Badge>
          <Badge variant="outline" className="text-xs">White Label</Badge>
          <Badge variant="outline" className="text-xs">Grants</Badge>
          <Badge variant="outline" className="text-xs">+3 more</Badge>
        </div>

        {/* CTA Button */}
        <Link href={linkPath}>
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            View Full Revenue Projections
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

