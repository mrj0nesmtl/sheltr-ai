"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDonorMetrics, getDonationHistory, DonorMetrics, DonationRecord } from '@/services/platformMetrics';
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users, 
  MapPin,
  Target,
  Calendar,
  PiggyBank,
  Receipt,
  Award,
  ChevronRight,
  ExternalLink,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { MakeNewDonationModal } from '@/components/donor/MakeNewDonationModal';
import { RecurringGiftModal } from '@/components/donor/RecurringGiftModal';
import { TaxDocumentsModal } from '@/components/donor/TaxDocumentsModal';
import { FindNewSheltersModal } from '@/components/donor/FindNewSheltersModal';

export default function DonorDashboard() {
  const { user, hasRole } = useAuth();
  const [donorMetrics, setDonorMetrics] = useState<DonorMetrics | null>(null);
  const [recentDonations, setRecentDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showSheltersModal, setShowSheltersModal] = useState(false);

  // Load real donor data based on user's ID
  useEffect(() => {
    const loadDonorData = async () => {
      if (!user?.uid) {
        setError('No user ID available');
        setLoading(false);
        return;
      }

      try {
        console.log('💰 Loading donor data for:', user.uid);
        
        // Load both metrics and donation history
        const [metrics, donations] = await Promise.all([
          getDonorMetrics(user.uid),
          getDonationHistory(user.uid)
        ]);
        
        if (metrics) {
          setDonorMetrics(metrics);
          setRecentDonations(donations.slice(0, 3)); // Show latest 3 donations
          console.log('✅ Donor data loaded:', { metrics, donationCount: donations.length });
        } else {
          // For users with no donation history, create empty metrics instead of error
          const emptyMetrics: DonorMetrics = {
            donorName: user.displayName || user.email || 'Platform Administrator',
            totalDonated: 0,
            taxDeductible: 0,
            impactScore: 0,
            donationsThisYear: 0,
            lastDonation: null,
            recurringDonations: 0,
            sheltersSupported: 0,
            participantsHelped: 0,
            totalTaxDocuments: 0,
            pendingReceipts: 0,
            totalRewards: 0
          };
          setDonorMetrics(emptyMetrics);
          console.log('📊 No donation history found - showing empty state for user:', user.uid);
        }
      } catch (error) {
        console.error('❌ Failed to load donor data:', error);
        setError('Failed to load donor data');
      } finally {
        setLoading(false);
      }
    };

    if (user && (hasRole('donor') || hasRole('platform_admin') || hasRole('super_admin'))) {
      loadDonorData();
    }
  }, [user, hasRole]);

  // Show fallback message if no donations
  // Show actual donations or empty state message
  const displayDonations = recentDonations;

  // Dynamic impact metrics based on real data
  // Only show unique metrics not already displayed in top stats
  const getImpactMetrics = () => {
    if (!donorMetrics) return [];
    
    return [
      {
        icon: MapPin,
        label: "Shelters Supported",
        value: donorMetrics.sheltersSupported || 0,
        description: "Organizations receiving support"
      },
      {
        icon: Heart,
        label: "Total Donations",
        value: donorMetrics.donationsThisYear || 0,
        description: "Contributions this year"
      }
    ];
  };

  // Check if user has donor, platform admin, or super admin access
  // Platform Admins can access their giving dashboard regardless of donation status
  if (!hasRole('donor') && !hasRole('platform_admin') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Donor access required for this dashboard.
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Loading My Giving Dashboard...
          </h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading your giving data...</span>
        </div>
      </div>
    );
  }

  // Error state (only show if there's a real error, not just missing data)
  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Giving Dashboard
          </h1>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Giving Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  // If we don't have metrics at this point, something went wrong
  if (!donorMetrics) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Giving Dashboard
          </h1>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Setting up your giving dashboard...</p>
        </div>
      </div>
    );
  }

  const impactMetrics = getImpactMetrics();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {donorMetrics.donorName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your Giving Dashboard • Real Data Connected • Status: ✅ Ready for donations
          {donorMetrics.donationsThisYear > 0 && donorMetrics.lastDonation 
            ? ` • Last donation: ${new Date(donorMetrics.lastDonation).toLocaleDateString()}`
            : ' • Start your giving journey today!'
          }
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donorMetrics.totalDonated > 0 ? `$${donorMetrics.totalDonated.toLocaleString()}` : '$0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {donorMetrics.totalDonated > 0 ? 
                `Tax deductible: $${donorMetrics.taxDeductible.toLocaleString()}` : 
                'Start your giving journey today'
              }
            </p>
            <Badge variant="outline" className="mt-2">
              <Heart className="h-3 w-3 mr-1" />
              Real Data Connected
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SHELTR Rewards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donorMetrics.totalRewards || 0}</div>
            <p className="text-xs text-muted-foreground">
              SHELTR tokens earned
            </p>
            <Badge variant="outline" className="mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Blockchain Ready
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Helped</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donorMetrics.participantsHelped || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {donorMetrics.sheltersSupported || 0} shelters
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{donorMetrics.impactScore || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Community impact rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Management & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your giving and impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start"
              onClick={() => setShowDonationModal(true)}
            >
              <Heart className="mr-2 h-4 w-4" />
              Make New Donation
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setShowRecurringModal(true)}
            >
              <PiggyBank className="mr-2 h-4 w-4" />
              Setup Recurring Gift
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setShowTaxModal(true)}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Download Tax Docs
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setShowSheltersModal(true)}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Find New Shelters
            </Button>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your latest contributions and their impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayDonations.length > 0 ? (
                displayDonations.map((donation) => (
                  <Link 
                    key={donation.id} 
                    href={`/dashboard/donor/wallet?transaction=${donation.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">${donation.amount.toFixed(2)}</p>
                          <Badge variant={donation.type === 'recurring' ? 'default' : 'outline'}>
                            {donation.type}
                          </Badge>
                          {donation.status === 'completed' && (
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {donation.shelter} • {new Date(donation.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {donation.impact}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Recent donations will appear here</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your donation history and impact will be displayed in this section
                  </p>
                  <Button onClick={() => setShowDonationModal(true)}>
                    <Heart className="mr-2 h-4 w-4" />
                    Make Your First Donation
                  </Button>
                </div>
              )}
            </div>
            {displayDonations.length > 0 && (
              <div className="mt-4">
                <Link href="/dashboard/donor/donations" className="block">
                  <Button variant="outline" className="w-full">
                    View All Donations
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {impactMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tax Documents & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Documents</CardTitle>
            <CardDescription>Download receipts and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">2024 Tax Summary</p>
                  <p className="text-xs text-muted-foreground">
                    {donorMetrics.totalDonated > 0 ? 
                      `$${donorMetrics.totalDonated.toLocaleString()} deductible` :
                      'No donations for tax year yet'
                    }
                  </p>
                </div>
                <Button size="sm" variant="outline" disabled={donorMetrics.totalDonated === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Individual Receipts</p>
                  <p className="text-xs text-muted-foreground">
                    {donorMetrics.totalTaxDocuments || 0} documents available
                  </p>
                </div>
                <Button size="sm" variant="outline" disabled={donorMetrics.totalTaxDocuments === 0}>
                  <FileText className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>

              {donorMetrics.pendingReceipts > 0 && (
                <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Pending Receipts</p>
                    <p className="text-xs text-muted-foreground">
                      {donorMetrics.pendingReceipts} receipts being processed
                    </p>
                  </div>
                  <Badge variant="outline">
                    Processing
                  </Badge>
                </div>
              )}
              
              {donorMetrics.totalTaxDocuments === 0 && donorMetrics.pendingReceipts === 0 && (
                <div className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">No tax documents yet</p>
                    <p className="text-xs text-gray-500">Documents will appear here after your first donation</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SHELTR Portfolio (Preview)</CardTitle>
            <CardDescription>Your blockchain rewards and token holdings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium">Blockchain Integration Coming Soon</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your SHELTR tokens will appear here when blockchain features launch
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold">{donorMetrics.totalRewards || 0}</div>
                  <div className="text-xs text-muted-foreground">SHELTR Earned</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold">$0.00</div>
                  <div className="text-xs text-muted-foreground">Token Value</div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Learn About SHELTR Tokens
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Donations Status */}
      {donorMetrics.recurringDonations > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recurring Donations</CardTitle>
            <CardDescription>Your automatic giving schedule and next payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {donorMetrics.recurringDonations} active recurring donations
                </p>
                <p className="text-xs text-muted-foreground">
                  Real data connected - ready for recurring giving
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm">
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Up Recurring Donations</CardTitle>
            <CardDescription>Make a lasting impact with automatic monthly giving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Start Recurring Giving</h3>
              <p className="text-gray-600 mb-4">
                Set up automatic monthly donations to make a consistent impact in your community.
              </p>
              <div className="flex space-x-2 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Heart className="h-4 w-4 mr-2" />
                  Set Up Monthly Giving
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Components */}
      <MakeNewDonationModal 
        isOpen={showDonationModal} 
        onClose={() => setShowDonationModal(false)} 
      />
      <RecurringGiftModal 
        isOpen={showRecurringModal} 
        onClose={() => setShowRecurringModal(false)} 
      />
      <TaxDocumentsModal 
        isOpen={showTaxModal} 
        onClose={() => setShowTaxModal(false)} 
      />
      <FindNewSheltersModal 
        isOpen={showSheltersModal} 
        onClose={() => setShowSheltersModal(false)} 
      />
    </div>
  );
} 