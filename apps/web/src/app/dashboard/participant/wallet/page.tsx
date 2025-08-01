"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useMockWallet } from '@/components/blockchain/MockWalletProvider';
import { WalletDisplay } from '@/components/blockchain/WalletDisplay';
import { QRCodeDisplay } from '@/components/blockchain/QRCodeDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  Send,
  QrCode,
  Copy,
  ExternalLink,
  Gift,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Award
} from 'lucide-react';

// Mock earning opportunities
const earningOpportunities = [
  {
    id: 1,
    title: 'Daily Check-in',
    description: 'Check in at the shelter every day',
    reward: 5,
    frequency: 'Daily',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
    available: true,
    completedToday: true
  },
  {
    id: 2,
    title: 'Complete Service Appointment',
    description: 'Attend scheduled counseling or workshop sessions',
    reward: 25,
    frequency: 'Per session',
    icon: Star,
    color: 'bg-blue-100 text-blue-600',
    available: true,
    completedToday: false
  },
  {
    id: 3,
    title: 'Help Fellow Participant',
    description: 'Assist other participants with daily tasks',
    reward: 10,
    frequency: 'As needed',
    icon: Gift,
    color: 'bg-purple-100 text-purple-600',
    available: true,
    completedToday: false
  },
  {
    id: 4,
    title: 'Goal Milestone Achievement',
    description: 'Reach important personal development goals',
    reward: 50,
    frequency: 'Per milestone',
    icon: Target,
    color: 'bg-yellow-100 text-yellow-600',
    available: false,
    completedToday: false
  },
  {
    id: 5,
    title: 'Volunteer at Shelter Event',
    description: 'Help with community events and activities',
    reward: 20,
    frequency: 'Per event',
    icon: Award,
    color: 'bg-indigo-100 text-indigo-600',
    available: true,
    completedToday: false
  }
];

// Mock recent transactions for more detailed history
const recentTransactions = [
  {
    id: 1,
    type: 'earned',
    amount: 25,
    description: 'Completed Individual Counseling Session',
    timestamp: '2024-01-14T16:00:00Z',
    hash: '0xabc123def456...',
    status: 'confirmed',
    category: 'Service Completion'
  },
  {
    id: 2,
    type: 'earned',
    amount: 5,
    description: 'Daily Check-in Reward',
    timestamp: '2024-01-14T08:00:00Z',
    hash: '0xdef456ghi789...',
    status: 'confirmed',
    category: 'Daily Activity'
  },
  {
    id: 3,
    type: 'earned',
    amount: 50,
    description: 'Housing Goal Milestone Reached',
    timestamp: '2024-01-13T14:30:00Z',
    hash: '0xghi789jkl012...',
    status: 'confirmed',
    category: 'Goal Achievement'
  },
  {
    id: 4,
    type: 'earned',
    amount: 10,
    description: 'Helped Fellow Participant with Paperwork',
    timestamp: '2024-01-12T12:15:00Z',
    hash: '0xjkl012mno345...',
    status: 'confirmed',
    category: 'Peer Support'
  },
  {
    id: 5,
    type: 'earned',
    amount: 20,
    description: 'Volunteered at Community Dinner',
    timestamp: '2024-01-11T18:00:00Z',
    hash: '0xmno345pqr678...',
    status: 'confirmed',
    category: 'Community Service'
  }
];

export default function ParticipantWallet() {
  const { user, hasRole } = useAuth();
  const mockWallet = useMockWallet();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  // Check if user has participant or super admin access
  if (!hasRole('participant') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Participant access required for this page.
        </p>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'sent':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'received':
        return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSendTokens = () => {
    // Implement send tokens logic
    alert(`Sending ${sendAmount} SHELTR-S to ${recipientAddress}`);
    setSendAmount('');
    setRecipientAddress('');
  };

  const handleClaimReward = (opportunityId: number) => {
    // Implement claim reward logic
    const opportunity = earningOpportunities.find(op => op.id === opportunityId);
    if (opportunity) {
      alert(`Claimed ${opportunity.reward} SHELTR-S for ${opportunity.title}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your SHELTR tokens and digital wallet
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'earn', label: 'Earn Tokens' },
          { id: 'qr-code', label: 'QR Code' },
          { id: 'settings', label: 'Wallet Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Wallet Display */}
          <WalletDisplay variant="detailed" />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Receive Tokens</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get paid for services
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setActiveTab('qr-code')}>
                  Show QR Code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Earn More</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Complete activities
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setActiveTab('earn')}>
                  View Opportunities
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View History</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track all transactions
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setActiveTab('transactions')}>
                  View Transactions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest SHELTR token transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDateTime(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +{transaction.amount} SHELTR-S
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('transactions')}>
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={mockWallet.refreshWallet}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <div className="space-y-1 mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDateTime(transaction.timestamp)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                            <Badge className={`text-xs ${
                              transaction.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 font-mono">
                            Hash: {transaction.hash}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'earned' || transaction.type === 'received'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'sent' ? '-' : '+'}
                        {transaction.amount} SHELTR-S
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Earn Tokens Tab */}
      {activeTab === 'earn' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Earning Opportunities</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete activities to earn SHELTR tokens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {earningOpportunities.map((opportunity) => {
              const Icon = opportunity.icon;
              return (
                <Card key={opportunity.id} className={`${
                  !opportunity.available ? 'opacity-60' : ''
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${opportunity.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          +{opportunity.reward}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SHELTR-S
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {opportunity.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {opportunity.frequency}
                        </Badge>
                        {opportunity.completedToday && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed Today
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        disabled={!opportunity.available || opportunity.completedToday}
                        onClick={() => handleClaimReward(opportunity.id)}
                      >
                        {opportunity.completedToday 
                          ? 'Completed' 
                          : opportunity.available 
                            ? 'Claim Reward' 
                            : 'Not Available'
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* QR Code Tab */}
      {activeTab === 'qr-code' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Your QR Code</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Share this QR code to receive SHELTR tokens
            </p>
          </div>

          <QRCodeDisplay />
        </div>
      )}

      {/* Wallet Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Wallet Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your wallet security and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Information */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
                <CardDescription>Your wallet details and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Wallet Address</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={mockWallet.wallet?.address || ''}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Private Key</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type={showPrivateKey ? 'text' : 'password'}
                      value={showPrivateKey ? 'mock_private_key_12345...' : '••••••••••••••••'}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Never share your private key with anyone
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Backup Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Protect your wallet and tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Extra security for transactions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified of all transactions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Lock Wallet</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lock wallet after inactivity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Reset Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 