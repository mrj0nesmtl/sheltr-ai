'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingDown, Calendar, ArrowRight, Lock } from 'lucide-react';

export function BudgetCard() {
  const seedRound = 250000;
  const totalBurn = 227926;
  const remainingFunds = seedRound - totalBurn;
  const burnRate = 18670;
  const runway = Math.floor(remainingFunds / burnRate);

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
              <DollarSign className="h-6 w-6 text-green-500" />
              Seed Budget 2025-26
            </CardTitle>
            <CardDescription>
              Financial planning & runway analysis
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            <Lock className="h-3 w-3 mr-1" />
            Confidential
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Seed Round</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(seedRound)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Burn</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalBurn)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(remainingFunds)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Runway</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {runway} mo
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget Utilization</span>
            <span className="font-medium">{((totalBurn / seedRound) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
              style={{ width: `${(totalBurn / seedRound) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Monthly Burn</p>
              <p className="font-semibold">{formatCurrency(burnRate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Timeline</p>
              <p className="font-semibold">Sep 25 - Aug 26</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/dashboard/founders/budget">
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            View Full Budget
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

