"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
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
  X
} from 'lucide-react';

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
  const [profile, setProfile] = useState(mockProfile);
  const [activeSection, setActiveSection] = useState('personal');

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

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
    // Show success message
  };

  const addGoal = () => {
    const newGoal = {
      id: profile.goals.length + 1,
      title: '',
      description: '',
      category: 'Personal',
      targetDate: '',
      progress: 0,
      status: 'active'
    };
    setProfile(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    setIsEditing(true);
  };

  const removeGoal = (goalId: number) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
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
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
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
          { id: 'preferences', label: 'Preferences', icon: Settings }
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
                    value={profile.personalInfo.firstName}
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
                    value={profile.personalInfo.lastName}
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
                  value={profile.personalInfo.email}
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
                  value={profile.personalInfo.phone}
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
                    value={profile.personalInfo.pronouns}
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
                    value={profile.personalInfo.preferredLanguage}
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
                    {profile.shelter.currentShelter}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Check-in Date:</span>
                    <div className="font-medium">
                      {new Date(profile.shelter.checkInDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Bed Assignment:</span>
                    <div className="font-medium">{profile.shelter.bedNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Room Type:</span>
                    <div className="font-medium">{profile.shelter.roomType}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Case Worker:</span>
                    <div className="font-medium">{profile.shelter.caseWorker}</div>
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
              {Object.entries(profile.preferences.notifications).map(([key, value]) => (
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
                      setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            [key]: !value
                          }
                        }
                      }));
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
              {Object.entries(profile.preferences.privacy).map(([key, value]) => (
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
                      setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          privacy: {
                            ...prev.preferences.privacy,
                            [key]: !value
                          }
                        }
                      }));
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
    </div>
  );
} 