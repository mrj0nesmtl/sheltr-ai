'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { UserStatusSelector } from '@/components/UserStatusSelector';
import { 
  SystemSettingsService, 
  type SuperAdminProfile
} from '@/services/systemSettingsService';
import { ProfileSyncService } from '@/services/profileSyncService';
import { uploadProfilePicture } from '@/services/fileStorageService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  User, 
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Phone,
  Mail,
  Save,
  Edit3,
  X,
  Plus,
  Trash2,
  Building,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Crown,
  Loader2
} from 'lucide-react';

export default function SuperAdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [formData, setFormData] = useState<Partial<SuperAdminProfile>>({});

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const profileData = await SystemSettingsService.getSuperAdminProfile(user.uid);
        
        if (profileData) {
          setProfile(profileData);
          setFormData(profileData);
          
          // Sync to Platform Admin profile for Team page (run in background)
          ProfileSyncService.syncSuperAdminToPlatformAdmin(user.uid).catch(error => 
            console.error('Background sync failed:', error)
          );
        } else {
          // Initialize with default values if no profile exists
          const defaultProfile = {
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phone: '',
            jobTitle: 'Super Administrator',
            company: 'SHELTR-AI Technologies Inc.',
            location: 'Vancouver, BC',
            bio: '',
            timezone: 'America/Montreal',
            language: 'en',
            twoFactorEnabled: false,
            emailNotifications: true,
            smsNotifications: false,
            loginAlerts: true,
            lastUpdated: new Date(),
            updatedBy: user.uid
          };
          setProfile(defaultProfile);
          setFormData(defaultProfile);
        }
      } catch (error) {
        console.error('Error loading super admin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (field: keyof SuperAdminProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooleanChange = (field: keyof SuperAdminProfile, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    try {
      setUploadingPicture(true);
      console.log('🔄 Uploading Super Admin profile picture...');

      // Upload the image to Firebase Storage
      const profilePictureUrl = await uploadProfilePicture(file, user.uid);
      
      if (profilePictureUrl) {
        console.log('✅ Profile picture uploaded:', profilePictureUrl);
        
        // Update the user document with the profile picture URL
        await updateDoc(doc(db, 'users', user.uid), {
          profilePicture: profilePictureUrl,
          updated_at: new Date()
        });
        
        // Trigger sync to Platform Admin profile for Team page
        console.log('🔄 Syncing profile picture to Team page...');
        await ProfileSyncService.syncSuperAdminToPlatformAdmin(user.uid);
        
        console.log('✅ Profile picture updated and synced to Team page!');
        alert('Profile picture updated successfully!');
        
        // Force page reload to show new picture
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
      alert('Error uploading profile picture. Please try again.');
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    try {
      setSaving(true);
      
      const updateData = {
        ...formData,
        lastUpdated: new Date(),
        updatedBy: user.uid
      };

      // Save to Super Admin profile collection
      const success = await SystemSettingsService.saveSuperAdminProfile(user.uid, updateData);
      
      if (success) {
        // Sync to Platform Admin profile for Team page
        console.log('🔄 Syncing Super Admin profile to Team page...');
        await ProfileSyncService.syncSuperAdminToPlatformAdmin(user.uid);
        
        setProfile({ ...profile, ...updateData } as SuperAdminProfile);
        setIsEditing(false);
        alert('Profile updated successfully and synced to Team page!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Super Admin Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your super administrator profile and system preferences
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header Card */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <ProfileAvatar 
                    userId={user?.uid || ''} 
                    size="large"
                    showStatus={true}
                  />
                  <input
                    type="file"
                    id="profile-picture-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    disabled={uploadingPicture}
                    onClick={() => document.getElementById('profile-picture-upload')?.click()}
                    type="button"
                  >
                    {uploadingPicture ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Super Administrator
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{profile?.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile?.location}</span>
                    </div>
                  </div>
                  
                  <UserStatusSelector userId={user?.uid || ''} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Your personal and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Professional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Position</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={formData.timezone || ''} 
                    onValueChange={(value) => handleInputChange('timezone', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Montreal">America/Montreal</SelectItem>
                      <SelectItem value="America/Toronto">America/Toronto</SelectItem>
                      <SelectItem value="America/Vancouver">America/Vancouver</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={formData.twoFactorEnabled ?? false}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('twoFactorEnabled', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Login Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone signs into your account
                  </p>
                </div>
                <Switch
                  checked={formData.loginAlerts ?? false}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('loginAlerts', checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>
                Control who can see your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={formData.profileVisibility || 'team'}
                  onValueChange={(value) => handleInputChange('profileVisibility', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="profileVisibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Public - Visible on team page to everyone
                      </div>
                    </SelectItem>
                    <SelectItem value="team">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Team - Visible to platform administrators
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <EyeOff className="h-4 w-4 mr-2" />
                        Private - Only visible to you
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {formData.profileVisibility === 'public' && 'Your profile will appear on the public team page at /team'}
                  {formData.profileVisibility === 'team' && 'Your profile will only be visible to other platform administrators'}
                  {formData.profileVisibility === 'private' && 'Your profile will be hidden from the team page'}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Contact Information</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow team members to see your phone and social links
                  </p>
                </div>
                <Switch
                  checked={formData.showContactInfo ?? true}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('showContactInfo', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Experience Details</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Display your years of experience and expertise areas
                  </p>
                </div>
                <Switch
                  checked={formData.showExperience ?? true}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('showExperience', checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications ?? false}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('emailNotifications', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={formData.smsNotifications ?? false}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('smsNotifications', checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Language & Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={formData.language || ''} 
                  onValueChange={(value) => handleInputChange('language', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
