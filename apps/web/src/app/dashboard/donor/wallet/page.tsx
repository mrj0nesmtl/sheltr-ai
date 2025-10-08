'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDonorMetrics, getDonationHistory } from '@/services/platformMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  DollarSign,
  TrendingUp, 
  ArrowUpRight,
  Plus,
  History,
  Download,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function DonorWalletPage() {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWalletData = async () => {
      if (!user?.uid) return;
      
      try {
        const [metrics, history] = await Promise.all([
          getDonorMetrics(user.uid),
          getDonationHistory(user.uid)
        ]);
        
        setTotalDonated(metrics.totalDonated || 0);
        setDonationCount(metrics.totalDonations || 0);
        setRecentTransactions(history.slice(0, 5)); // Latest 5 transactions
        
        console.log('✅ Loaded donor wallet data:', { metrics, historyCount: history.length });
      } catch (error) {
        console.error('❌ Failed to load wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWalletData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Manage your wallet balance and donation history
        </p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Current Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wallet Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${walletBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available to donate
            </p>
            <Button className="w-full mt-4" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Load Funds
            </Button>
          </CardContent>
        </Card>

        {/* Total Donated */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donated
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonated.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {donationCount} {donationCount === 1 ? 'donation' : 'donations'} all time
            </p>
            <Button className="w-full mt-4" size="sm" variant="outline">
              View History
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" size="sm" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Statements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest donation activity</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <History className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your donation history will appear here
              </p>
              <Button className="mt-4">
                Make Your First Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.participant}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      -${transaction.amount.toFixed(2)}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No payment methods</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add a payment method to make donations faster
            </p>
            <Button className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

