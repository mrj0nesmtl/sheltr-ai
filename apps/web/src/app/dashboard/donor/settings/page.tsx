'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { donorProfileService, DonorProfile } from '@/services/donorProfileService';
import { uploadProfilePicture } from '@/services/fileStorageService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Check,
  Loader2,
  Camera,
  Globe
} from 'lucide-react';

export default function DonorSettingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || 'donor@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Montreal, QC H2X 1Y5',
    preferredShelter: 'Downtown Hope Shelter',
    defaultDonationAmount: '50',
    anonymousDonations: false,
    bio: '',
    occupation: '',
    company: '',
    socialMedia: {
      tiktok: '',
      instagram: '',
      facebook: '',
      youtube: '',
      x: '',
      website: ''
    }
  });

  // Load real user data from Firestore using donorProfileService
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const profile = await donorProfileService.getDonorProfile(user.uid);
        if (profile) {
          console.log('✅ Loaded donor profile for settings:', profile);
          setDonorProfile(profile);
          
          setFormData(prev => ({
            ...prev,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || user.email || '',
            phone: profile.phone || prev.phone,
            address: profile.address || prev.address,
            bio: profile.bio || '',
            occupation: profile.occupation || '',
            company: profile.company || '',
            preferredShelter: profile.preferredShelter || prev.preferredShelter,
            defaultDonationAmount: profile.defaultDonationAmount?.toString() || prev.defaultDonationAmount,
            anonymousDonations: profile.anonymousDonations || false,
            socialMedia: {
              tiktok: profile.socialMedia?.tiktok || '',
              instagram: profile.socialMedia?.instagram || '',
              facebook: profile.socialMedia?.facebook || '',
              youtube: profile.socialMedia?.youtube || '',
              x: profile.socialMedia?.x || '',
              website: profile.socialMedia?.website || ''
            }
          }));
        } else {
          console.log('⚠️ No donor profile found, using defaults');
          // For donor@example.com, set the correct name from database
          if (user.email === 'donor@example.com') {
            setFormData(prev => ({
              ...prev,
              firstName: 'Jane',
              lastName: 'Supporter',
              email: user.email
            }));
          }
        }
      } catch (error) {
        console.error('❌ Error loading donor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

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

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      // Save profile data to Firestore
      await donorProfileService.saveDonorProfile(user.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        occupation: formData.occupation,
        company: formData.company,
        socialMedia: formData.socialMedia,
        preferredShelter: formData.preferredShelter,
        defaultDonationAmount: parseInt(formData.defaultDonationAmount) || 50,
        anonymousDonations: formData.anonymousDonations
      });
      
      // Save notification preferences
      await donorProfileService.updateNotificationPreferences(user.uid, notifications);
      
      // Save privacy settings
      await donorProfileService.updatePrivacySettings(user.uid, privacy);
      
      setIsEditing(false);
      alert('Profile saved successfully!');
      console.log('✅ Donor profile saved successfully');
    } catch (error) {
      console.error('❌ Error saving donor profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setUploadingPhoto(true);
    try {
      console.log('📸 Uploading donor profile picture...');
      
      // Upload to Firebase Storage
      const photoUrl = await uploadProfilePicture(file, user.uid);
      
      // Update profile with new photo URL
      await donorProfileService.updateProfilePicture(user.uid, photoUrl);
      
      // Update local state
      setDonorProfile(prev => prev ? { ...prev, profilePicture: photoUrl } : null);
      
      alert('Profile picture uploaded successfully!');
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
      alert(`Failed to upload profile picture: ${error}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!user?.uid) return;
    
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    
    try {
      await donorProfileService.updateProfilePicture(user.uid, '');
      setDonorProfile(prev => prev ? { ...prev, profilePicture: '' } : null);
      alert('Profile picture removed successfully!');
    } catch (error) {
      console.error('❌ Error removing profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Donor Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

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
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
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
                  Your photo helps personalize your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {donorProfile?.profilePicture || user?.photoURL ? (
                    <img 
                      src={donorProfile?.profilePicture || user?.photoURL} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="file"
                    id="donor-photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={!isEditing || uploadingPhoto}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!isEditing || uploadingPhoto}
                    onClick={() => document.getElementById('donor-photo-upload')?.click()}
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Photo
                      </>
                    )}
                  </Button>
                  {(donorProfile?.profilePicture || user?.photoURL) && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700"
                      disabled={!isEditing}
                      onClick={handlePhotoDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Public Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Share a bit about yourself and why you support SHELTR..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This bio may be displayed publicly on your donor profile
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media & Website
              </CardTitle>
              <CardDescription>
                Connect your social media profiles and website (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={formData.socialMedia.tiktok}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, tiktok: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.socialMedia.youtube}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="https://youtube.com/@username"
                  />
                </div>
                <div>
                  <Label htmlFor="x">X (Twitter)</Label>
                  <Input
                    id="x"
                    value={formData.socialMedia.x}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, x: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="https://x.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={formData.socialMedia.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, website: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods for donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Credit Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">Credit Card</p>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Default
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">•••• •••• •••• 4532</p>
                      <p className="text-xs text-gray-500">Visa</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                      <p className="text-sm font-medium">12/26</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bank Account */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">•••• •••• 8901</p>
                      <p className="text-xs text-gray-500">TD Bank</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add New Payment Method Button */}
                <Button className="w-full sm:w-auto" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
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