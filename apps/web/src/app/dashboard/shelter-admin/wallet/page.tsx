'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  DollarSign,
  TrendingUp, 
  ArrowDownLeft,
  Building2,
  QrCode,
  Download,
  RefreshCw,
  PieChart
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ShelterRevenue {
  operationsRevenue: number;
  directDonations: number;
  totalRevenue: number;
  transactionCount: number;
}

export default function ShelterAdminWalletPage() {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState<ShelterRevenue>({
    operationsRevenue: 0,
    directDonations: 0,
    totalRevenue: 0,
    transactionCount: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shelterName, setShelterName] = useState('');

  useEffect(() => {
    const loadShelterWallet = async () => {
      if (!user?.uid) return;
      
      try {
        // Get shelter ID from user profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const shelterId = userData?.shelter_id || 'old-brewery-mission';
        
        // Get shelter info and stats directly from shelter document
        const shelterDoc = await getDoc(doc(db, 'shelters', shelterId));
        let operationsRevenue = 0;
        
        if (shelterDoc.exists()) {
          const shelterData = shelterDoc.data();
          setShelterName(shelterData.name || 'Your Shelter');
          // Read operations revenue directly from shelter document (updated by success page)
          operationsRevenue = shelterData.operations_revenue || 0;
          console.log(`📊 Shelter operations revenue from doc: $${operationsRevenue}`);
        }

        // Query demo_donations for participant donations to this shelter (5% operations fee)
        const participantDonationsQuery = query(
          collection(db, 'demo_donations'),
          where('shelter_id', '==', shelterId),
          where('status', '==', 'completed')
        );
        const participantDonationsSnapshot = await getDocs(participantDonationsQuery);
        
        const opsTransactions: any[] = [];
        let calculatedOpsRevenue = 0;
        
        participantDonationsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          // 5% goes to shelter operations from each participant donation
          const opsAmount = data.amount?.breakdown?.operations || (data.amount?.total * 0.05) || 0;
          calculatedOpsRevenue += opsAmount;
          
          opsTransactions.push({
            id: doc.id,
            type: 'operations',
            amount: opsAmount,
            participant: data.participant_name || 'Participant',
            donor: data.donor_info?.name || 'Anonymous Donor',
            date: data.created_at?.toDate() || new Date(),
            reference: data.payment_data?.adyen_reference
          });
        });

        console.log(`💰 Calculated operations revenue from ${participantDonationsSnapshot.size} participant donations: $${calculatedOpsRevenue}`);

        // Query direct shelter donations (future: when shelter has own QR code)
        // For now, this will be 0 as we don't have direct shelter donations yet
        const directDonations = 0;
        const directTransactions: any[] = [];
        
        // Use whichever is higher (shelter doc or calculated) to handle any sync issues
        operationsRevenue = Math.max(operationsRevenue, calculatedOpsRevenue);

        // Combine and sort transactions by date
        const allTransactions = [...opsTransactions, ...directTransactions].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );

        setRevenue({
          operationsRevenue,
          directDonations,
          totalRevenue: operationsRevenue + directDonations,
          transactionCount: allTransactions.length
        });
        
        setTransactions(allTransactions);
        
        console.log('✅ Loaded shelter wallet data:', {
          shelterId,
          operationsRevenue,
          directDonations,
          transactionCount: allTransactions.length
        });
        
      } catch (error) {
        console.error('❌ Failed to load shelter wallet:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadShelterWallet();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shelter Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Track operations revenue and direct donations for {shelterName}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Revenue */}
        <Card className="border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${revenue.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {revenue.transactionCount} {revenue.transactionCount === 1 ? 'transaction' : 'transactions'} all time
            </p>
          </CardContent>
        </Card>

        {/* Operations Revenue (5% Split) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operations Revenue
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenue.operationsRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              5% from SmartFund™ distributions
            </p>
            <Badge variant="outline" className="mt-2">
              Operations
            </Badge>
          </CardContent>
        </Card>

        {/* Direct Donations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Direct Donations
            </CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenue.directDonations.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Via shelter QR code
            </p>
            <Badge variant="outline" className="mt-2">
              Direct
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Visual breakdown of your revenue sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Operations Revenue Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Operations (5% Split)</span>
                <span className="text-sm text-muted-foreground">
                  ${revenue.operationsRevenue.toFixed(2)}
                  {revenue.totalRevenue > 0 && (
                    <span className="ml-2">
                      ({((revenue.operationsRevenue / revenue.totalRevenue) * 100).toFixed(0)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{
                    width: revenue.totalRevenue > 0
                      ? `${(revenue.operationsRevenue / revenue.totalRevenue) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            {/* Direct Donations Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Direct Donations</span>
                <span className="text-sm text-muted-foreground">
                  ${revenue.directDonations.toFixed(2)}
                  {revenue.totalRevenue > 0 && (
                    <span className="ml-2">
                      ({((revenue.directDonations / revenue.totalRevenue) * 100).toFixed(0)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: revenue.totalRevenue > 0
                      ? `${(revenue.directDonations / revenue.totalRevenue) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All revenue received by your shelter</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
              <TabsTrigger value="operations">
                Operations ({transactions.filter(t => t.type === 'operations').length})
              </TabsTrigger>
              <TabsTrigger value="direct">
                Direct ({transactions.filter(t => t.type === 'direct').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Revenue will appear here as donations are received
                  </p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowDownLeft className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === 'operations' ? 'Operations Revenue' : 'Direct Donation'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +${transaction.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={transaction.type === 'operations' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {transaction.type === 'operations' ? '5% Split' : 'Direct'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="operations" className="space-y-4 mt-4">
              {transactions.filter(t => t.type === 'operations').length === 0 ? (
                <div className="text-center py-12">
                  <PieChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No operations revenue yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    5% splits from participant donations will appear here
                  </p>
                </div>
              ) : (
                transactions
                  .filter(t => t.type === 'operations')
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <PieChart className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Operations Revenue (5%)</p>
                          <p className="text-sm text-muted-foreground">
                            From donation to {transaction.participant || 'participant'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {transaction.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +${transaction.amount.toFixed(2)}
                        </p>
                        <Badge variant="default" className="mt-1">
                          5% Split
                        </Badge>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>

            <TabsContent value="direct" className="space-y-4 mt-4">
              {transactions.filter(t => t.type === 'direct').length === 0 ? (
                <div className="text-center py-12">
                  <QrCode className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No direct donations yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Donations via your shelter QR code will appear here
                  </p>
                </div>
              ) : (
                transactions
                  .filter(t => t.type === 'direct')
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <QrCode className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Direct Donation</p>
                          <p className="text-sm text-muted-foreground">
                            From {transaction.donor}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {transaction.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +${transaction.amount.toFixed(2)}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          Direct
                        </Badge>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

