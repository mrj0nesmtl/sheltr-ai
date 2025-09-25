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
  PlatformAdminProfileService, 
  type PlatformAdminProfile, 
  type PlatformAdminProfileUpdate 
} from '@/services/platformAdminProfileService';
import { uploadProfilePicture } from '@/services/fileStorageService';
import {
  User, 
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Phone,
  Mail,
  Linkedin,
  Twitter,
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
  Loader2
} from 'lucide-react';

export default function PlatformAdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PlatformAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<PlatformAdminProfileUpdate>({});
  
  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const profileData = await PlatformAdminProfileService.getPlatformAdminProfile(user.uid);
        if (profileData) {
          setProfile(profileData);
          setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            displayName: profileData.displayName,
            department: profileData.department,
            specialization: profileData.specialization,
            jobTitle: profileData.jobTitle,
            bio: profileData.bio,
            expertise: profileData.expertise,
            phone: profileData.phone,
            linkedIn: profileData.linkedIn,
            twitter: profileData.twitter,
            website: profileData.website,
            yearsOfExperience: profileData.yearsOfExperience,
            education: profileData.education,
            certifications: profileData.certifications,
            notificationPreferences: profileData.notificationPreferences,
            profileVisibility: profileData.profileVisibility,
            showContactInfo: profileData.showContactInfo,
            showExperience: profileData.showExperience
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user?.uid]);
  
  // Handle form input changes
  const handleInputChange = (field: keyof PlatformAdminProfileUpdate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle boolean input changes for switches
  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle expertise array changes
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
  
  // Handle education array changes
  const handleEducationChange = (index: number, field: string, value: any) => {
    const newEducation = [...(formData.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    handleInputChange('education', newEducation);
  };
  
  const addEducation = () => {
    handleInputChange('education', [...(formData.education || []), { degree: '', institution: '', year: new Date().getFullYear() }]);
  };
  
  const removeEducation = (index: number) => {
    const newEducation = [...(formData.education || [])];
    newEducation.splice(index, 1);
    handleInputChange('education', newEducation);
  };
  
  // Handle certification array changes
  const handleCertificationChange = (index: number, field: string, value: any) => {
    const newCertifications = [...(formData.certifications || [])];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    handleInputChange('certifications', newCertifications);
  };
  
  const addCertification = () => {
    handleInputChange('certifications', [...(formData.certifications || []), { name: '', issuer: '', year: new Date().getFullYear() }]);
  };
  
  const removeCertification = (index: number) => {
    const newCertifications = [...(formData.certifications || [])];
    newCertifications.splice(index, 1);
    handleInputChange('certifications', newCertifications);
  };
  
  // Save profile changes
  const handleSave = async () => {
    if (!user?.uid) return;
    
    try {
      setSaving(true);
      const success = await PlatformAdminProfileService.updatePlatformAdminProfile(user.uid, formData);
      
      if (success) {
        // Reload profile data
        const updatedProfile = await PlatformAdminProfileService.getPlatformAdminProfile(user.uid);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    try {
      setUploadingPicture(true);
      console.log('🔄 Uploading profile picture...');

      // Upload the image
      const profilePictureUrl = await uploadProfilePicture(file, user.uid);
      
      if (profilePictureUrl) {
        // Update the profile with the new picture URL
        const success = await PlatformAdminProfileService.updatePlatformAdminProfile(user.uid, {
          profilePicture: profilePictureUrl
        });
        
        if (success) {
          // Reload profile to get updated data
          const updatedProfile = await PlatformAdminProfileService.getPlatformAdminProfile(user.uid);
          if (updatedProfile) {
            setProfile(updatedProfile);
          }
          console.log('✅ Profile picture updated successfully');
        }
      }
    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
    } finally {
      setUploadingPicture(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        department: profile.department,
        specialization: profile.specialization,
        jobTitle: profile.jobTitle,
        bio: profile.bio,
        expertise: profile.expertise,
        phone: profile.phone,
        linkedIn: profile.linkedIn,
        twitter: profile.twitter,
        website: profile.website,
        yearsOfExperience: profile.yearsOfExperience,
        education: profile.education,
        certifications: profile.certifications,
        notificationPreferences: profile.notificationPreferences,
        profileVisibility: profile.profileVisibility,
        showContactInfo: profile.showContactInfo,
        showExperience: profile.showExperience
      });
    }
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
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
  
  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Administrator Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your professional profile and platform settings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <UserStatusSelector userId={user?.uid || ''} />
          {isEditing ? (
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
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
      
      {/* Profile Completion Status */}
      <Card className={`border-2 ${profile.profileComplete ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${profile.profileComplete ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <div>
                <p className="font-medium">
                  {profile.profileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.profileComplete 
                    ? 'Your profile is complete and visible to team members' 
                    : 'Complete your profile to enhance team collaboration'
                  }
                </p>
              </div>
            </div>
            <Badge variant={profile.profileComplete ? 'default' : 'secondary'}>
              {profile.profileComplete ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="profilePictureUpload"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => document.getElementById('profilePictureUpload')?.click()}
                    disabled={uploadingPicture}
                  >
                    {uploadingPicture ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF (max. 2MB)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Basic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your fundamental profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName || ''}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="How you'd like to be addressed"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
        </TabsContent>
        
        {/* Professional Tab */}
        <TabsContent value="professional" className="space-y-6">
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
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Engineering, Marketing"
                  />
                </div>
                
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Product Design & Engineering"
                  />
                </div>
                
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Senior Product Engineer"
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
                      placeholder="e.g., React Development"
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
                  value={formData.profileVisibility || 'team'}
                  onValueChange={(value) => handleInputChange('profileVisibility', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Public - Visible to everyone
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
                        <Eye className="h-4 w-4 mr-2" />
                        Private - Only visible to you
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive platform updates via email
                  </p>
                </div>
                <Switch
                  checked={formData.notificationPreferences?.email ?? true}
                  onCheckedChange={(checked: boolean) => 
                    handleInputChange('notificationPreferences', {
                      ...formData.notificationPreferences,
                      email: checked
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={formData.notificationPreferences?.push ?? true}
                  onCheckedChange={(checked: boolean) => 
                    handleInputChange('notificationPreferences', {
                      ...formData.notificationPreferences,
                      push: checked
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive urgent alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={formData.notificationPreferences?.sms ?? false}
                  onCheckedChange={(checked: boolean) => 
                    handleInputChange('notificationPreferences', {
                      ...formData.notificationPreferences,
                      sms: checked
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive weekly platform activity summaries
                  </p>
                </div>
                <Switch
                  checked={formData.notificationPreferences?.weeklyReports ?? true}
                  onCheckedChange={(checked: boolean) => 
                    handleInputChange('notificationPreferences', {
                      ...formData.notificationPreferences,
                      weeklyReports: checked
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive critical system and security alerts
                  </p>
                </div>
                <Switch
                  checked={formData.notificationPreferences?.systemAlerts ?? true}
                  onCheckedChange={(checked: boolean) => 
                    handleInputChange('notificationPreferences', {
                      ...formData.notificationPreferences,
                      systemAlerts: checked
                    })
                  }
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
