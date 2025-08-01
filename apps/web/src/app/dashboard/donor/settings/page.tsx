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
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Download,
  Upload,
  Trash2,
  Edit3,
  Save,
  X,
  Check
} from 'lucide-react';

export default function DonorSettingsPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: user?.email || 'donor@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Montreal, QC H2X 1Y5',
    preferredShelter: 'Downtown Hope Shelter',
    defaultDonationAmount: '50',
    anonymousDonations: false
  });

  const [notifications, setNotifications] = useState({
    donationConfirmations: true,
    monthlyReports: true,
    impactUpdates: true,
    emergencyAlerts: false,
    eventInvitations: true,
    newsletterUpdates: false,
    taxDocumentReady: true,
    recurringReminders: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'supporters',
    showDonationAmounts: false,
    shareImpactStories: true,
    allowDataAnalytics: true,
    twoFactorAuth: false
  });

  const handleSave = () => {
    // Here you would typically save to database
    setIsEditing(false);
    // You could also update the user context here
  };

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
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
            Settings & Preferences
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your profile, privacy, and notification preferences
          </p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Your photo helps shelter staff recognize you
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-16 w-16 text-purple-600" />
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">
                    {privacy.twoFactorAuth ? 'Disable' : 'Enable'} 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'donationConfirmations', label: 'Donation Confirmations', description: 'Receipts for all donations' },
                  { key: 'monthlyReports', label: 'Monthly Impact Reports', description: 'See your monthly impact summary' },
                  { key: 'impactUpdates', label: 'Impact Updates', description: 'Stories from people you\'ve helped' },
                  { key: 'emergencyAlerts', label: 'Emergency Alerts', description: 'Urgent shelter needs and crisis updates' },
                  { key: 'eventInvitations', label: 'Event Invitations', description: 'Invites to volunteer events and fundraisers' },
                  { key: 'newsletterUpdates', label: 'Newsletter & Updates', description: 'General SHELTR news and updates' },
                  { key: 'taxDocumentReady', label: 'Tax Document Alerts', description: 'When annual tax summaries are ready' },
                  { key: 'recurringReminders', label: 'Recurring Donation Reminders', description: 'Upcoming automatic donations' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your information is shared and used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-gray-600">Who can see your donor profile</p>
                    </div>
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    >
                      <option value="private">Private</option>
                      <option value="supporters">Other Supporters</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Show Donation Amounts</h3>
                      <p className="text-sm text-gray-600">Display donation amounts on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.showDonationAmounts}
                        onChange={(e) => handlePrivacyChange('showDonationAmounts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Share Impact Stories</h3>
                      <p className="text-sm text-gray-600">Allow us to share stories about your impact</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.shareImpactStories}
                        onChange={(e) => handlePrivacyChange('shareImpactStories', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Data Analytics</h3>
                      <p className="text-sm text-gray-600">Help improve SHELTR with anonymous usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.allowDataAnalytics}
                        onChange={(e) => handlePrivacyChange('allowDataAnalytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Data Protection</h4>
                  <p className="text-sm text-blue-800">
                    Your data is protected by industry-standard encryption and never sold to third parties. 
                    Read our <a href="/privacy" className="underline">Privacy Policy</a> for more details.
                  </p>
                </div>
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
                Set your default donation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultAmount">Default Donation Amount</Label>
                  <Input
                    id="defaultAmount"
                    type="number"
                    value={formData.defaultDonationAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultDonationAmount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredShelter">Preferred Shelter</Label>
                  <select 
                    id="preferredShelter"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.preferredShelter}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredShelter: e.target.value }))}
                  >
                    <option value="">No preference</option>
                    <option value="Downtown Hope Shelter">Downtown Hope Shelter</option>
                    <option value="Old Brewery Mission">Old Brewery Mission</option>
                    <option value="Union Gospel Mission">Union Gospel Mission</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymousDonations"
                  checked={formData.anonymousDonations}
                  onChange={(e) => setFormData(prev => ({ ...prev, anonymousDonations: e.target.checked }))}
                />
                <Label htmlFor="anonymousDonations">Make all donations anonymous by default</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Download your data and donation history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Donation History</h3>
                    <p className="text-sm text-gray-600">Complete record of all donations</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Tax Documents</h3>
                    <p className="text-sm text-gray-600">All tax receipts and summaries</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download ZIP
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Complete Data Export</h3>
                    <p className="text-sm text-gray-600">All your data in machine-readable format</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Request Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-medium text-red-900">Delete Account</h3>
                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 