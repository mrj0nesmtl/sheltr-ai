'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingDown, Calendar, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface BudgetCardProps {
  linkPath?: string;
}

interface BudgetData {
  funding: {
    seed_round: number;
  };
  calculated: {
    budget_running_total: number[];
    budget_monthly_burn: number[];
    runway: {
      projected_allocation: number;
      average_burn: number;
      reserve_buffer: number;
    };
  };
  period: {
    months: string[];
  };
}

export function BudgetCard({ linkPath = '/portal/founders-only/budget' }: BudgetCardProps) {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const budgetRef = doc(db, 'financial_budgets', 'seed-budget-2025-2026');
        const budgetSnap = await getDoc(budgetRef);
        
        if (budgetSnap.exists()) {
          setBudgetData(budgetSnap.data() as BudgetData);
        }
      } catch (error) {
        console.error('Error loading budget data for card:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="border-2">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Use loaded data or fallback to defaults
  const seedRound = budgetData?.funding.seed_round || 500000;
  const projectedBurn = budgetData?.calculated.runway.projected_allocation || 227926;
  const avgMonthlyBurn = budgetData?.calculated.runway.average_burn || 18670;
  const reserveBuffer = budgetData?.calculated.runway.reserve_buffer || (seedRound - projectedBurn);
  const projectedRunway = 12; // 12 months from raise to full deployment

  return (
    <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-500" />
              2026 Budget
            </CardTitle>
            <CardDescription>
              Projected financial planning & runway analysis
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
            <p className="text-xs text-muted-foreground">Target Raise</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(seedRound)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Projected Allocation</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(projectedBurn)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Reserve Buffer</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(reserveBuffer)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Projected Runway</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {projectedRunway} mo
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Planned Allocation</span>
            <span className="font-medium">{((projectedBurn / seedRound) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all"
              style={{ width: `${(projectedBurn / seedRound) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Monthly Burn</p>
              <p className="font-semibold">{formatCurrency(avgMonthlyBurn)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Timeline</p>
              <p className="font-semibold">January - December 2026</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={linkPath}>
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            View Full Budget
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

