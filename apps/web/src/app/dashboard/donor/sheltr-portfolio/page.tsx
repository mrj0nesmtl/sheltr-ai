'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockWallet } from '@/components/blockchain/MockWalletProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  TrendingUp, 
  Star, 
  Gift, 
  Trophy,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Share2,
  Download,
  Target,
  Calendar,
  Zap
} from 'lucide-react';

export default function DonorSheltrPortfolioPage() {
  const { user } = useAuth();
  const mockWallet = useMockWallet();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');

  // Mock portfolio data
  const portfolioStats = {
    totalTokens: 285,
    tokenValue: 14.25, // Value per token in USD
    totalValue: 4061.25,
    monthlyGrowth: 12.3,
    stakingRewards: 24.5,
    nextRewardDate: '2024-02-01'
  };

  const rewardHistory = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'donation_reward',
      amount: 15,
      reason: 'Monthly donation to Downtown Hope',
      status: 'completed',
      value: 213.75
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'impact_bonus',
      amount: 8,
      reason: 'Helped secure permanent housing',
      status: 'completed',
      value: 114.00
    },
    {
      id: 3,
      date: '2024-01-05',
      type: 'community_reward',
      amount: 5,
      reason: 'Community milestone achieved',
      status: 'completed',
      value: 71.25
    },
    {
      id: 4,
      date: '2024-01-01',
      type: 'staking_reward',
      amount: 12,
      reason: 'Monthly staking rewards',
      status: 'completed',
      value: 171.00
    }
  ];

  const stakingPools = [
    {
      id: 1,
      name: 'Emergency Shelter Pool',
      description: 'Support emergency shelter operations',
      apy: 8.5,
      minStake: 10,
      yourStake: 100,
      totalStaked: 15420,
      nextReward: '2024-02-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Job Training Pool',
      description: 'Fund job training and placement programs',
      apy: 12.0,
      minStake: 25,
      yourStake: 50,
      totalStaked: 8750,
      nextReward: '2024-02-05',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mental Health Pool',
      description: 'Support mental health and counseling services',
      apy: 15.0,
      minStake: 50,
      yourStake: 0,
      totalStaked: 4200,
      nextReward: '2024-02-10',
      status: 'available'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Compassionate Giver',
      description: 'Made 10+ donations',
      icon: <Gift className="h-6 w-6" />,
      progress: 100,
      reward: 25,
      unlocked: true
    },
    {
      id: 2,
      title: 'Community Builder',
      description: 'Helped 20+ people find shelter',
      icon: <Trophy className="h-6 w-6" />,
      progress: 75,
      reward: 50,
      unlocked: false
    },
    {
      id: 3,
      title: 'Long-term Supporter',
      description: 'Active for 1+ year',
      icon: <Star className="h-6 w-6" />,
      progress: 45,
      reward: 100,
      unlocked: false
    },
    {
      id: 4,
      title: 'Impact Multiplier',
      description: 'Staked 500+ tokens',
      icon: <Zap className="h-6 w-6" />,
      progress: 30,
      reward: 75,
      unlocked: false
    }
  ];

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'donation_reward':
        return 'bg-purple-100 text-purple-800';
      case 'impact_bonus':
        return 'bg-green-100 text-green-800';
      case 'community_reward':
        return 'bg-blue-100 text-blue-800';
      case 'staking_reward':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'donation_reward':
        return <Gift className="h-4 w-4" />;
      case 'impact_bonus':
        return <TrendingUp className="h-4 w-4" />;
      case 'community_reward':
        return <Star className="h-4 w-4" />;
      case 'staking_reward':
        return <Coins className="h-4 w-4" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  // Only show for donor role
  if (user?.role !== 'donor' && user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Donor role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SHELTR Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your blockchain rewards, staking investments, and token portfolio
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={mockWallet.refreshWallet}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Portfolio
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total SHELTR Tokens</p>
                <p className="text-3xl font-bold text-purple-600">{portfolioStats.totalTokens}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">${portfolioStats.totalValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">${portfolioStats.tokenValue} per token</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-600">+{portfolioStats.monthlyGrowth}%</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">This month</span>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staking Rewards</p>
                <p className="text-2xl font-bold text-orange-600">{portfolioStats.stakingRewards}</p>
                <p className="text-sm text-gray-600">Next: {portfolioStats.nextRewardDate}</p>
              </div>
              <Coins className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="staking">Staking Pools</TabsTrigger>
          <TabsTrigger value="rewards">Reward History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Portfolio Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Distribution</CardTitle>
                <CardDescription>
                  How your SHELTR tokens are allocated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Available Balance</span>
                    <span className="font-bold">135 SHELTR</span>
                  </div>
                  <Progress value={47} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Staked in Pools</span>
                    <span className="font-bold">150 SHELTR</span>
                  </div>
                  <Progress value={53} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">47%</p>
                      <p className="text-sm text-gray-600">Available</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">53%</p>
                      <p className="text-sm text-gray-600">Staked</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Your portfolio performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">All-time Return</span>
                    <span className="font-bold text-green-600">+156%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Best Month</span>
                    <span className="font-bold text-green-600">+28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Rewards Earned</span>
                    <span className="font-bold text-purple-600">185 SHELTR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Impact Score</span>
                    <div className="flex items-center">
                      <span className="font-bold text-blue-600 mr-2">8.7/10</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your SHELTR portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="p-6 h-auto flex-col">
                  <Target className="h-8 w-8 mb-2" />
                  <span className="font-medium">Stake Tokens</span>
                  <span className="text-sm text-gray-600">Earn up to 15% APY</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Gift className="h-8 w-8 mb-2" />
                  <span className="font-medium">Donate More</span>
                  <span className="text-sm text-gray-600">Earn bonus tokens</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Share2 className="h-8 w-8 mb-2" />
                  <span className="font-medium">Refer Friends</span>
                  <span className="text-sm text-gray-600">Get referral rewards</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staking Pools Tab */}
        <TabsContent value="staking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Staking Pools</CardTitle>
              <CardDescription>
                Stake your tokens to earn rewards while supporting specific causes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stakingPools.map((pool) => (
                  <div key={pool.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{pool.name}</h3>
                        <p className="text-sm text-gray-600">{pool.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {pool.apy}% APY
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Min Stake</p>
                        <p className="font-medium">{pool.minStake} SHELTR</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Your Stake</p>
                        <p className="font-medium">{pool.yourStake} SHELTR</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Staked</p>
                        <p className="font-medium">{pool.totalStaked.toLocaleString()} SHELTR</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Reward</p>
                        <p className="font-medium">{pool.nextReward}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={pool.status === 'active' ? 'text-green-600' : 'text-blue-600'}>
                        {pool.status === 'active' ? 'Currently Staking' : 'Available'}
                      </Badge>
                      <div className="flex gap-2">
                        {pool.status === 'active' ? (
                          <>
                            <Button variant="outline" size="sm">Add More</Button>
                            <Button variant="outline" size="sm">Withdraw</Button>
                          </>
                        ) : (
                          <Button size="sm">Stake Now</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reward History Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
              <CardDescription>
                Track all your SHELTR token rewards and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardHistory.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getRewardTypeIcon(reward.type)}
                      </div>
                      <div>
                        <p className="font-medium">+{reward.amount} SHELTR</p>
                        <p className="text-sm text-gray-600">{reward.reason}</p>
                        <p className="text-xs text-gray-500">{reward.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${reward.value.toFixed(2)}</p>
                      <Badge variant="secondary" className={getRewardTypeColor(reward.type)}>
                        {reward.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Rewards</CardTitle>
              <CardDescription>
                Unlock special achievements to earn bonus SHELTR tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`border rounded-lg p-6 ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-green-100 text-green-800">
                          Unlocked!
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      <p className="text-sm text-gray-600">
                        Reward: <span className="font-medium text-purple-600">{achievement.reward} SHELTR</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 