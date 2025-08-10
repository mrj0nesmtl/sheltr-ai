"use client";
// @ts-nocheck

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { profileService, type UserProfile, type PersonalInfo, type EmergencyContact, type Goal } from '@/services/profileService';
import { getParticipantProfile, type ParticipantProfile } from '@/services/platformMetrics';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User, 
  Camera,
  Save,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Target,
  Heart,
  Settings,
  Shield,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Share2,
  QrCode,
  Eye,
  Copy,
  ExternalLink,
  Download,
  Upload,
  FileText
} from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';

// Extended interface to include shelter info for the participant page
interface ExtendedUserProfile extends UserProfile {
  shelter?: {
    currentShelter: string;
    checkInDate: string;
    bedNumber: string;
    roomType: string;
    caseWorker: string;
  };
}

// Mock participant profile data
const mockProfile = {
  personalInfo: {
    firstName: 'Michael',
    lastName: 'Rodriguez',
    dateOfBirth: '1990-03-15',
    phone: '(555) 123-4567',
    email: 'michael.rodriguez@temp.email',
    preferredLanguage: 'English',
    pronouns: 'He/Him'
  },
  shelter: {
    currentShelter: 'Downtown Hope Shelter',
    checkInDate: '2023-11-15',
    bedNumber: 'B-24',
    roomType: 'Shared',
    caseWorker: 'Sarah Johnson'
  },
  emergencyContacts: [
    {
      name: 'Maria Rodriguez',
      relationship: 'Sister',
      phone: '(555) 987-6543',
      email: 'maria.r@email.com'
    },
    {
      name: 'James Wilson',
      relationship: 'Friend',
      phone: '(555) 456-7890',
      email: 'j.wilson@email.com'
    }
  ],
  goals: [
    {
      id: 1,
      title: 'Find permanent housing',
      description: 'Secure affordable apartment within 6 months',
      category: 'Housing',
      targetDate: '2024-05-15',
      progress: 45,
      status: 'active'
    },
    {
      id: 2,
      title: 'Complete job training program',
      description: 'Finish culinary arts certification',
      category: 'Employment',
      targetDate: '2024-03-30',
      progress: 75,
      status: 'active'
    },
    {
      id: 3,
      title: 'Build emergency savings',
      description: 'Save $1,000 for security deposit',
      category: 'Financial',
      targetDate: '2024-04-01',
      progress: 30,
      status: 'active'
    }
  ],
  preferences: {
    notifications: {
      email: true,
      sms: false,
      inApp: true
    },
    communication: {
      preferredMethod: 'email',
      language: 'en',
      timezone: 'America/Toronto'
    },
    privacy: {
      shareProgress: true,
      allowPhotos: false,
      publicProfile: false
    }
  }
};

export default function ParticipantProfile() {
  const { user, hasRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('personal');

  // Load user profile on component mount
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load real participant data using the platformMetrics service
        const participantData = await getParticipantProfile(user.uid);
        
        if (participantData) {
          // Convert ParticipantProfile to ExtendedUserProfile format
          const profileWithData: ExtendedUserProfile = {
            personalInfo: {
              firstName: participantData.firstName || '',
              lastName: participantData.lastName || '',
              email: participantData.email || '',
              phone: participantData.phone || '',
              dateOfBirth: participantData.dateOfBirth || '',
              pronouns: '',
              preferredLanguage: 'en'
            },
            shelter: {
              currentShelter: participantData.shelterName || 'Old Brewery Mission',
              checkInDate: '2024-11-01',
              bedNumber: 'B-23',
              roomType: 'Standard',
              caseWorker: participantData.caseWorkerName || 'Sarah Johnson'
            },
            preferences: {
              notifications: {
                email: true,
                sms: false,
                inApp: true
              },
              communication: {
                preferredMethod: 'email',
                language: 'en',
                timezone: 'America/Toronto'
              },
              privacy: {
                shareProgress: true,
                allowPhotos: false,
                publicProfile: false
              }
            },
            emergencyContacts: participantData.emergencyContact ? [{
              name: participantData.emergencyContact.name,
              phone: participantData.emergencyContact.phone,
              relationship: participantData.emergencyContact.relationship
            }] : [],
            goals: []
          };
          
          setProfile(profileWithData);
          console.log('✅ Real participant profile loaded:', profileWithData);
        } else {
          // Fallback to mock data if no participant found
          throw new Error('Participant not found');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile. Using default data.');
        // Fallback to mock data
        setProfile(profileService.getMockProfile());
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  // Show error state or return if no profile
  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error || 'Unable to load profile.'}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      if (user.email === 'participant@example.com') return 'Michael Rodriguez';
      if (user.email === 'david.donor@example.com') return 'David Donor';
      return user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Participant';
  };

  // Helper function to safely update profile
  const updateProfile = (updater: (prev: ExtendedUserProfile) => ExtendedUserProfile) => {
    setProfile(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Save the profile to Firestore
      console.log('💾 Saving participant profile to Firestore...');
      
      const userRef = doc(db, 'users', user!.uid);
      const updateData = {
        firstName: profile.personalInfo.firstName,
        lastName: profile.personalInfo.lastName,
        email: profile.personalInfo.email,
        phone: profile.personalInfo.phone,
        dateOfBirth: profile.personalInfo.dateOfBirth,
        // Add emergency contact if exists
        ...(profile.emergencyContacts && profile.emergencyContacts.length > 0 && {
          emergencyContact: {
            name: profile.emergencyContacts[0].name,
            phone: profile.emergencyContacts[0].phone,
            relationship: profile.emergencyContacts[0].relationship
          }
        }),
        updated_at: new Date().toISOString()
      };
      
      await updateDoc(userRef, updateData);
      
      setIsEditing(false);
      console.log('✅ Profile updated successfully in Firestore');
      alert('Profile saved successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please try again.');
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    if (!profile) return;
    
    const newGoal = {
      id: profileService.generateGoalId(),
      title: '',
      description: '',
      category: 'Personal',
      targetDate: '',
      progress: 0,
      status: 'active'
    };
    setProfile(prev => prev ? ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }) : null);
    setIsEditing(true);
  };

  const removeGoal = (goalId: string) => {
    if (!profile) return;
    
    setProfile(prev => prev ? ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }) : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your personal information and goals
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
                              <Button 
                  onClick={handleSave} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'goals', label: 'Goals & Progress', icon: Target },
          { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
          { id: 'preferences', label: 'Preferences', icon: Settings },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'public', label: 'Public Profile', icon: Share2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeSection === tab.id
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Personal Information */}
      {activeSection === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture & Basic Info</CardTitle>
              <CardDescription>Your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getUserDisplayName().split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              {/* Personal Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.personalInfo.email || ''}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.personalInfo.phone || ''}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input
                    id="pronouns"
                    value={profile.personalInfo.pronouns || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, pronouns: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Input
                    id="language"
                    value={profile.personalInfo.preferredLanguage || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, preferredLanguage: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shelter Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shelter Information</CardTitle>
              <CardDescription>Your current accommodation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    {profile.shelter?.currentShelter || 'Old Brewery Mission'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Check-in Date:</span>
                    <div className="font-medium">
                      {profile.shelter?.checkInDate ? new Date(profile.shelter.checkInDate).toLocaleDateString() : 'Not available'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Bed Assignment:</span>
                    <div className="font-medium">{profile.shelter?.bedNumber || 'Not assigned'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Room Type:</span>
                    <div className="font-medium">{profile.shelter?.roomType || 'Standard'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Case Worker:</span>
                    <div className="font-medium">{profile.shelter?.caseWorker || 'Sarah Johnson'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Case Worker
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals & Progress */}
      {activeSection === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Personal Goals</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress towards independence
              </p>
            </div>
            <Button onClick={addGoal} disabled={!isEditing}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="grid gap-4">
            {profile.goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{goal.category}</Badge>
                        <span className="text-sm text-gray-500">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGoal(goal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {goal.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      {activeSection === 'emergency' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Emergency Contacts</h2>
            <p className="text-gray-600 dark:text-gray-400">
              People we can contact in case of emergency
            </p>
          </div>

          <div className="grid gap-4">
            {profile.emergencyContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const updated = [...profile.emergencyContacts];
                          updated[index].name = e.target.value;
                          setProfile(prev => ({ ...prev, emergencyContacts: updated }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input
                        value={contact.relationship}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const updated = [...profile.emergencyContacts];
                          updated[index].relationship = e.target.value;
                          setProfile(prev => ({ ...prev, emergencyContacts: updated }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const updated = [...profile.emergencyContacts];
                          updated[index].phone = e.target.value;
                          setProfile(prev => ({ ...prev, emergencyContacts: updated }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      {activeSection === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be contacted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(profile.preferences?.notifications || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via {key}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!isEditing}
                    onClick={() => {
                      setProfile(prev => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences?.notifications,
                              [key]: !value
                            }
                          }
                        };
                      });
                    }}
                  >
                    {value ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data and visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(profile.preferences?.privacy || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'shareProgress' && 'Allow sharing progress with case workers'}
                      {key === 'allowPhotos' && 'Allow photos in profile and activities'}
                      {key === 'publicProfile' && 'Make profile visible to other participants'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!isEditing}
                    onClick={() => {
                      setProfile(prev => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            privacy: {
                              ...prev.preferences?.privacy,
                              [key]: !value
                            }
                          }
                        };
                      });
                    }}
                  >
                    {value ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documents */}
      {activeSection === 'documents' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Upload and manage your personal documents securely. Only you, your case worker, and authorized shelter staff can access these files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Picture Upload */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Profile Picture</h4>
                  <FileUpload
                    uploadType="profile"
                    userId={user?.uid || ''}
                    showFileList={true}
                    onUploadComplete={(downloadURL) => {
                      console.log('Profile picture uploaded:', downloadURL);
                      // Optionally update the profile state here
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      alert('Upload failed: ' + error);
                    }}
                  />
                </div>

                {/* Personal Documents */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Personal Documents</h4>
                  <FileUpload
                    uploadType="participant"
                    userId={user?.uid || ''}
                    documentType="personal"
                    showFileList={true}
                    onUploadComplete={(downloadURL) => {
                      console.log('Document uploaded:', downloadURL);
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      alert('Upload failed: ' + error);
                    }}
                  />
                </div>
              </div>

              {/* ID Documents */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Identification Documents</h4>
                <FileUpload
                  uploadType="participant"
                  userId={user?.uid || ''}
                  documentType="identification"
                  showFileList={true}
                  onUploadComplete={(downloadURL) => {
                    console.log('ID document uploaded:', downloadURL);
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    alert('Upload failed: ' + error);
                  }}
                />
              </div>

              {/* Medical Documents */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Medical Documents</h4>
                <FileUpload
                  uploadType="participant"
                  userId={user?.uid || ''}
                  documentType="medical"
                  showFileList={true}
                  onUploadComplete={(downloadURL) => {
                    console.log('Medical document uploaded:', downloadURL);
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    alert('Upload failed: ' + error);
                  }}
                />
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 dark:text-blue-100">Secure & Private</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                      Your documents are encrypted and only accessible by you, your assigned shelter staff, and system administrators. 
                      All uploads are logged for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Public Profile */}
      {activeSection === 'public' && (
        <div className="space-y-6">
          {/* Public Profile Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Public Profile Settings</CardTitle>
              <CardDescription>
                Configure your public profile page that supporters can view and donate through
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile URL Configuration */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="publicUrl">Custom Public URL</Label>
                  <div className="space-y-2 mt-1">
                    <div className="px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      <span className="text-sm font-mono">
                        https://sheltr-ai.web.app/participant/
                      </span>
                    </div>
                    <Input
                      id="publicUrl"
                      value={profile?.personalInfo.firstName?.toLowerCase() + '-' + profile?.personalInfo.lastName?.toLowerCase() || 'my-profile'}
                      disabled={!isEditing}
                      placeholder="my-name"
                      className="font-mono"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Choose a custom URL for your public profile (letters, numbers, and hyphens only)
                  </p>
                </div>

                {/* QR Code Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Your QR Code</Label>
                    <div className="mt-2 p-4 border rounded-lg text-center bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <div className="w-32 h-32 mx-auto bg-white rounded flex items-center justify-center p-2">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(`https://sheltr-ai.web.app/participant/${profile?.personalInfo.firstName?.toLowerCase() + '-' + profile?.personalInfo.lastName?.toLowerCase() || 'demo'}`)}&format=png`}
                          alt="Your QR Code"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Supporters can scan this to donate directly
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                          canvas.width = img.width;
                          canvas.height = img.height;
                          ctx?.drawImage(img, 0, 0);
                          const link = document.createElement('a');
                          link.download = 'my-qr-code.png';
                          link.href = canvas.toDataURL();
                          link.click();
                        };
                        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(`https://sheltr-ai.web.app/participant/${profile?.personalInfo.firstName?.toLowerCase() + '-' + profile?.personalInfo.lastName?.toLowerCase() || 'demo'}`)}&format=png`;
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Profile Stats</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Supporters</span>
                        <Badge variant="secondary">0</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                        <Badge variant="secondary">0</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Received</span>
                        <Badge variant="secondary">$0.00</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</span>
                        <Badge variant="secondary">68%</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Public Story */}
                <div>
                  <Label htmlFor="publicStory">Your Public Story</Label>
                  <textarea
                    id="publicStory"
                    rows={4}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Share your story with potential supporters..."
                    defaultValue="Working towards stability and independence. Every donation helps me take another step forward in my journey."
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    This will be displayed on your public profile page
                  </p>
                </div>

                {/* Privacy Settings */}
                <div className="border-t pt-4">
                  <Label>Privacy & Visibility</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Public Profile Enabled</span>
                        <p className="text-sm text-gray-600">Allow people to view your profile and donate</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!isEditing}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Show Real Name</span>
                        <p className="text-sm text-gray-600">Display your full name publicly</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!isEditing}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Show Donation Amounts</span>
                        <p className="text-sm text-gray-600">Display total amount received</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!isEditing}
                      >
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const participantId = profile?.personalInfo.firstName?.toLowerCase() + '-' + profile?.personalInfo.lastName?.toLowerCase() || 'demo';
                      const baseUrl = window.location.origin; // This will use localhost:3000 in dev, production URL in prod
                      const url = `${baseUrl}/participant/${participantId}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const participantId = profile?.personalInfo.firstName?.toLowerCase() + '-' + profile?.personalInfo.lastName?.toLowerCase() || 'demo';
                      const baseUrl = 'https://sheltr-ai.web.app'; // Use production URL for sharing
                      const url = `${baseUrl}/participant/${participantId}`;
                      navigator.clipboard.writeText(url);
                      alert('Profile URL copied to clipboard!');
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const participantId = profile?.personalInfo.firstName?.toLowerCase() + '-' + profile?.personalInfo.lastName?.toLowerCase() || 'demo';
                      const baseUrl = 'https://sheltr-ai.web.app'; // Use production URL for sharing
                      const url = `${baseUrl}/participant/${participantId}`;
                      if (navigator.share) {
                        navigator.share({
                          title: `Support ${profile?.personalInfo.firstName} ${profile?.personalInfo.lastName}`,
                          text: 'Help support someone on their journey to stability',
                          url: url
                        });
                      } else {
                        alert('Sharing not supported on this device');
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 