'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDonorMetrics, getDonationHistory } from '@/services/platformMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Home, 
  Utensils, 
  TrendingUp,
  Share2,
  Download,
  Sparkles,
  Award,
  Target
} from 'lucide-react';

export default function DonorImpactPage() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [donorMetrics, setDonorMetrics] = useState<any>(null);
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;
      
      try {
        const [metrics, history] = await Promise.all([
          getDonorMetrics(user.uid),
          getDonationHistory(user.uid)
        ]);
        
        setDonorMetrics(metrics);
        setDonationHistory(history);
        console.log('✅ Loaded donor impact data:', { metrics, historyCount: history.length });
      } catch (error) {
        console.error('❌ Failed to load impact data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  if (user?.role !== 'donor' && user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Access denied. Donor role required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your impact...</p>
        </div>
      </div>
    );
  }

  const totalDonated = donorMetrics?.totalDonated || 0;
  const peopleHelped = donorMetrics?.participantsHelped || 0;
  const mealsProvided = Math.floor(totalDonated / 5); // $5 per meal
  const nightsShelter = Math.floor(totalDonated / 50); // $50 per night
  const sheltersSupported = donorMetrics?.sheltersSupported || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Impact</h1>
          <p className="text-muted-foreground mt-2">
            See the difference you're making in people's lives
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      {/* Timeframe Selector - Compact */}
      <div className="flex items-center justify-end gap-2">
        {['3m', '6m', '1y', 'all'].map((period) => (
          <Button
            key={period}
            variant={selectedTimeframe === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe(period)}
          >
            {period === 'all' ? 'All Time' : period.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Hero Impact Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Donated - Largest */}
            <div className="lg:col-span-2">
              <div className="flex items-start space-x-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                  <p className="text-4xl font-bold mt-1">${totalDonated.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {donorMetrics?.totalDonations || 0} {donorMetrics?.totalDonations === 1 ? 'donation' : 'donations'}
                  </p>
                </div>
              </div>
            </div>

            {/* People Helped */}
            <div>
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">People Helped</p>
                  <p className="text-3xl font-bold mt-1">{peopleHelped}</p>
                </div>
              </div>
            </div>

            {/* Meals Provided */}
            <div>
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Utensils className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Meals Provided</p>
                  <p className="text-3xl font-bold mt-1">{mealsProvided}</p>
                </div>
              </div>
            </div>

            {/* Nights Shelter */}
            <div>
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Nights Shelter</p>
                  <p className="text-3xl font-bold mt-1">{nightsShelter}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SmartFund Distribution Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            SmartFund™ Distribution
          </CardTitle>
          <CardDescription>
            How your ${totalDonated.toLocaleString()} has been allocated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Direct to Participants - 80% */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Direct to Participants</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">${(totalDonated * 0.8).toFixed(2)}</span>
                  <span className="text-muted-foreground ml-2">80%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Directly supporting {peopleHelped} {peopleHelped === 1 ? 'person' : 'people'} in need
              </p>
            </div>

            {/* Housing Fund - 15% */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Housing Fund</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">${(totalDonated * 0.15).toFixed(2)}</span>
                  <span className="text-muted-foreground ml-2">15%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Building long-term housing solutions
              </p>
            </div>

            {/* Shelter Operations - 5% */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="font-medium">Shelter Operations</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">${(totalDonated * 0.05).toFixed(2)}</span>
                  <span className="text-muted-foreground ml-2">5%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '5%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Supporting {sheltersSupported} {sheltersSupported === 1 ? 'shelter' : 'shelters'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Donations Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Recent Impact
          </CardTitle>
          <CardDescription>
            Your latest {donationHistory.length} {donationHistory.length === 1 ? 'donation' : 'donations'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donationHistory.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No donations yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Make your first donation to start creating impact
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/donate'}>
                Make a Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {donationHistory.slice(0, 5).map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {donation.participant_name ? `Donation to ${donation.participant_name}` : 'Direct donation'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${donation.amount.toFixed(2)}</p>
                    <Badge variant="secondary" className="mt-1">
                      {donation.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Achievement Badges */}
      {totalDonated > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Your Achievements
            </CardTitle>
            <CardDescription>
              Milestones you've reached through your generosity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {totalDonated >= 100 && (
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                  <div className="text-3xl mb-2">🌟</div>
                  <p className="font-semibold">First $100</p>
                  <p className="text-xs text-muted-foreground">Giving Champion</p>
                </div>
              )}
              {peopleHelped >= 1 && (
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <div className="text-3xl mb-2">❤️</div>
                  <p className="font-semibold">First Life</p>
                  <p className="text-xs text-muted-foreground">Changed</p>
                </div>
              )}
              {mealsProvided >= 10 && (
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="font-semibold">10+ Meals</p>
                  <p className="text-xs text-muted-foreground">Fed</p>
                </div>
              )}
              {nightsShelter >= 1 && (
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
                  <div className="text-3xl mb-2">🏠</div>
                  <p className="font-semibold">Shelter</p>
                  <p className="text-xs text-muted-foreground">Provider</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Monthly Trend
          </CardTitle>
          <CardDescription>
            Your giving activity this year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{peopleHelped}</p>
              <p className="text-sm text-muted-foreground mt-1">People Housed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{mealsProvided}</p>
              <p className="text-sm text-muted-foreground mt-1">Meals Served</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{nightsShelter}</p>
              <p className="text-sm text-muted-foreground mt-1">Nights Safe</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
