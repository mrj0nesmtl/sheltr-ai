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
import { ProfileAvatar, clearProfilePictureCache } from '@/components/ProfileAvatar';
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
  Globe,
  Mail,
  Save,
  Edit3,
  X,
  Plus,
  Trash2,
  Building,
  MapPin,
  Shield,
  Settings,
  Bell,
  Eye,
  Camera,
  Crown,
  Loader2,
  Award,
  Linkedin,
  Twitter
} from 'lucide-react';

export default function SuperAdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
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
            jobTitle: 'Chief Executive Officer & Founder',
            company: 'SHELTR-AI Technologies Inc.',
            location: 'Montreal, QC',
            bio: '',
            department: 'Leadership',
            specialization: 'Strategic Leadership & Technology Innovation',
            yearsOfExperience: 25,
            expertise: [],
            linkedIn: '',
            twitter: '',
            website: '',
            timezone: 'America/Montreal',
            language: 'en',
            twoFactorEnabled: false,
            emailNotifications: true,
            smsNotifications: false,
            loginAlerts: true,
            profileVisibility: 'public',
            showContactInfo: true,
            showExperience: true,
            lastUpdated: new Date(),
            updatedBy: user.uid
          };
          setProfile(defaultProfile);
          setFormData(defaultProfile);
        }
      } catch (error) {
        console.error('Error loading Super Admin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Handle input changes
  const handleInputChange = (field: keyof SuperAdminProfile, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle expertise changes
  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...(formData.expertise || [])];
    newExpertise[index] = value;
    handleInputChange('expertise', newExpertise);
  };

  const addExpertise = () => {
    handleInputChange('expertise', [...(formData.expertise || []), '']);
  };

  const removeExpertise = (index: number) => {
    const newExpertise = [...(formData.expertise || [])];
    newExpertise.splice(index, 1);
    handleInputChange('expertise', newExpertise);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    try {
      setUploadingPicture(true);
      const profilePictureUrl = await uploadProfilePicture(file, user.uid);
      
      if (profilePictureUrl) {
        // Update Firestore user document
        await updateDoc(doc(db, 'users', user.uid), {
          profilePicture: profilePictureUrl
        });
        
        // Clear cache and reload
        await clearProfilePictureCache(user.uid);
        
        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  // Save profile changes
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
        console.log('🔄 Syncing Super Admin profile to Platform Admin structure...');
        await ProfileSyncService.syncSuperAdminToPlatformAdmin(user.uid);
        
        // Note: The syncSuperAdminToPlatformAdmin function updates users.adminProfile,
        // which will automatically trigger a sync to team_members via PlatformAdminProfileService
        
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Loading your profile...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your super administrator profile and system preferences
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <UserStatusSelector userId={user?.uid || ''} />
          {isEditing ? (
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Status Badge */}
      <Card className="border-2 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">Super Administrator</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Full platform access with elevated privileges
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Super Admin
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile & Bio</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile & Bio Tab (Consolidated) */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Picture
                </CardTitle>
                <CardDescription>Your professional headshot</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative mx-auto w-fit">
                  <ProfileAvatar userId={user?.uid || ''} size="large" showStatus={true} />
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
                <div>
                  <p className="font-medium">{profile?.firstName} {profile?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{profile?.jobTitle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Your personal and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Brief description of your role and expertise..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Role Information
                </CardTitle>
                <CardDescription>Your position and responsibilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Chief Executive Officer"
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Leadership, Engineering"
                  />
                </div>
                
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Strategic Leadership & Technology Innovation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience || 0}
                    onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    min="0"
                    max="50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Montreal, QC"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact & Social */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Contact & Social
                </CardTitle>
                <CardDescription>Professional links and contact methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedIn" className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedIn"
                    value={formData.linkedIn || ''}
                    onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter" className="flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter Profile
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.twitter || ''}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Areas of Expertise
                </div>
                {isEditing && (
                  <Button onClick={addExpertise} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expertise
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Your key skills and specializations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(formData.expertise || []).map((expertise, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={expertise}
                      onChange={(e) => handleExpertiseChange(index, e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Strategic Leadership"
                    />
                    {isEditing && (
                      <Button
                        onClick={() => removeExpertise(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(!formData.expertise || formData.expertise.length === 0) && !isEditing && (
                  <p className="text-gray-500 italic">No expertise areas added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control who can see your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={formData.profileVisibility || 'public'}
                  onValueChange={(value: 'public' | 'team' | 'private') => handleInputChange('profileVisibility', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="profileVisibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Public - Visible to everyone</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="team">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Team - Visible to team members only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Private - Hidden from everyone</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Contact Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Display email and phone on team page
                  </p>
                </div>
                <Switch
                  checked={formData.showContactInfo ?? true}
                  onCheckedChange={(checked) => handleInputChange('showContactInfo', checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Experience</Label>
                  <p className="text-sm text-muted-foreground">
                    Display years of experience and expertise
                  </p>
                </div>
                <Switch
                  checked={formData.showExperience ?? true}
                  onCheckedChange={(checked) => handleInputChange('showExperience', checked)}
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
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Preferences
              </CardTitle>
              <CardDescription>Your system and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone || 'America/Montreal'}
                    onValueChange={(value) => handleInputChange('timezone', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Montreal">America/Montreal</SelectItem>
                      <SelectItem value="America/Toronto">America/Toronto</SelectItem>
                      <SelectItem value="America/Vancouver">America/Vancouver</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language || 'en'}
                    onValueChange={(value) => handleInputChange('language', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications ?? true}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS alerts for critical system events
                  </p>
                </div>
                <Switch
                  checked={formData.smsNotifications ?? false}
                  onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch
                  checked={formData.loginAlerts ?? true}
                  onCheckedChange={(checked) => handleInputChange('loginAlerts', checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={formData.twoFactorEnabled ?? false}
                  onCheckedChange={(checked) => handleInputChange('twoFactorEnabled', checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
