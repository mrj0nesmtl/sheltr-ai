'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Heart, 
  Calendar, 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit3,
  Pause,
  Play,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function DonorDonationsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for donations
  const donationHistory = [
    {
      id: 'DN001',
      amount: 150.00,
      shelter: 'Downtown Hope Shelter',
      date: '2024-01-09',
      type: 'one-time',
      status: 'completed',
      impact: 'Provided 30 meals',
      receipt: 'available'
    },
    {
      id: 'DN002', 
      amount: 75.00,
      shelter: 'Old Brewery Mission',
      date: '2024-01-01',
      type: 'monthly',
      status: 'completed',
      impact: 'Provided 15 meals',
      receipt: 'available'
    },
    {
      id: 'DN003',
      amount: 200.00,
      shelter: 'Union Gospel Mission',
      date: '2023-12-15',
      type: 'one-time',
      status: 'completed', 
      impact: 'Provided 2 nights shelter',
      receipt: 'available'
    },
    {
      id: 'DN004',
      amount: 75.00,
      shelter: 'Old Brewery Mission',
      date: '2023-12-01',
      type: 'monthly',
      status: 'completed',
      impact: 'Provided 15 meals',
      receipt: 'available'
    }
  ];

  const recurringGifts = [
    {
      id: 'RG001',
      amount: 75.00,
      shelter: 'Old Brewery Mission',
      frequency: 'Monthly',
      nextDate: '2024-02-01',
      status: 'active',
      startDate: '2023-06-01',
      totalDonated: 600.00
    },
    {
      id: 'RG002',
      amount: 50.00,
      shelter: 'Downtown Hope Shelter', 
      frequency: 'Quarterly',
      nextDate: '2024-04-01',
      status: 'active',
      startDate: '2023-01-01',
      totalDonated: 200.00
    },
    {
      id: 'RG003',
      amount: 25.00,
      shelter: 'Union Gospel Mission',
      frequency: 'Weekly',
      nextDate: '2024-01-16',
      status: 'paused',
      startDate: '2023-08-01',
      totalDonated: 125.00
    }
  ];

  const paymentMethods = [
    {
      id: 'PM001',
      type: 'Credit Card',
      details: '•••• •••• •••• 4532',
      brand: 'Visa',
      isDefault: true,
      expiryDate: '12/26'
    },
    {
      id: 'PM002',
      type: 'Bank Account',
      details: '•••• •••• 8901',
      brand: 'TD Bank',
      isDefault: false,
      expiryDate: null
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'active':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            My Donations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your giving, track impact, and update payment methods
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Make New Donation
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">$2,850</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Recurring</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$225</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history">Donation History</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Gifts</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Donation History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                View all your past donations and download receipts
              </CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationHistory.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(donation.status)}
                      <div>
                        <p className="font-medium">${donation.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{donation.shelter}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{donation.date}</p>
                      <Badge variant="secondary" className={getStatusColor(donation.status)}>
                        {donation.type}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600">{donation.impact}</p>
                      <p className="text-xs text-gray-500">Direct Impact</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recurring Gifts Tab */}
        <TabsContent value="recurring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Gifts</CardTitle>
              <CardDescription>
                Manage your automatic recurring donations
              </CardDescription>
              <Button className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Set Up New Recurring Gift
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recurringGifts.map((gift) => (
                  <div key={gift.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(gift.status)}
                      <div>
                        <p className="font-medium">${gift.amount.toFixed(2)} {gift.frequency}</p>
                        <p className="text-sm text-gray-600">{gift.shelter}</p>
                        <p className="text-xs text-gray-500">Started: {gift.startDate}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Next: {gift.nextDate}</p>
                      <Badge variant="secondary" className={getStatusColor(gift.status)}>
                        {gift.status}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">${gift.totalDonated.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total Donated</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {gift.status === 'active' ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods for donations
              </CardDescription>
              <Button className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{method.type}</p>
                          {method.isDefault && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.details}</p>
                        <p className="text-xs text-gray-500">{method.brand}</p>
                      </div>
                    </div>
                    {method.expiryDate && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Expires</p>
                        <p className="text-sm font-medium">{method.expiryDate}</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation Preferences</CardTitle>
              <CardDescription>
                Configure your donation settings and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="defaultAmount">Default Donation Amount</Label>
                  <Input id="defaultAmount" type="number" placeholder="50" />
                </div>
                <div>
                  <Label htmlFor="preferredShelter">Preferred Shelter</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>No preference</option>
                    <option>Downtown Hope Shelter</option>
                    <option>Old Brewery Mission</option>
                    <option>Union Gospel Mission</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label>Email Notifications</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Donation confirmations</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Monthly impact reports</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Shelter updates and news</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Special campaigns and events</span>
                    </label>
                  </div>
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 