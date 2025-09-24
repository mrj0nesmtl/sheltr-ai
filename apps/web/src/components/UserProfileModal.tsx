'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { UserStatusSelector } from '@/components/UserStatusSelector';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Shield,
  Star,
  Heart,
  Crown,
  UserCheck,
  Briefcase,
  Globe,
  Clock,
  X,
  Edit,
  ExternalLink
} from 'lucide-react';

export interface UserProfileData {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin?: string;
  
  // Role-specific data
  shelter?: string;
  shelter_id?: string;
  company?: string;
  location?: string;
  bio?: string;
  specialization?: string;
  department?: string;
  
  // Stats
  totalDonated?: number;
  donationCount?: number;
  participants?: number;
  totalReceived?: number;
  qrScans?: number;
  
  // Additional info
  profileComplete?: boolean;
  emailVerified?: boolean;
  
  // Metadata
  created_at?: any;
  updated_at?: any;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfileData | null;
  userType: 'super_admin' | 'platform_admin' | 'shelter_admin' | 'participant' | 'donor';
  canEdit?: boolean;
  onEdit?: () => void;
}

export function UserProfileModal({ 
  isOpen, 
  onClose, 
  userData, 
  userType, 
  canEdit = false, 
  onEdit 
}: UserProfileModalProps) {
  const { user } = useAuth();
  
  if (!userData) return null;

  const getRoleIcon = (role: string) => {
    switch (userType) {
      case 'super_admin':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'platform_admin':
        return <Star className="h-5 w-5 text-orange-600" />;
      case 'shelter_admin':
        return <Shield className="h-5 w-5 text-blue-600" />;
      case 'participant':
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case 'donor':
        return <Heart className="h-5 w-5 text-red-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (userType) {
      case 'super_admin':
        return 'from-purple-500 to-pink-500';
      case 'platform_admin':
        return 'from-orange-500 to-yellow-500';
      case 'shelter_admin':
        return 'from-blue-500 to-cyan-500';
      case 'participant':
        return 'from-green-500 to-emerald-500';
      case 'donor':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
      case 'pending_nda':
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              {getRoleIcon(userData.role)}
              <span>User Profile</span>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {canEdit && onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className={`p-6 rounded-lg bg-gradient-to-r ${getRoleColor(userData.role)} text-white`}>
            <div className="flex items-center space-x-4">
              <ProfileAvatar 
                userId={userData.id} 
                size="large"
                showStatus={true}
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-white/90 mb-2">{userData.email}</p>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {userData.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getStatusBadgeColor(userData.status)}>
                    {userData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.email && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
              )}
              
              {userData.phone && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>
              )}
              
              {userData.location && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{userData.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Information */}
          {(userData.shelter || userData.company || userData.specialization || userData.department) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.shelter && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Shelter</p>
                        <p className="font-medium">{userData.shelter}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData.company && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{userData.company}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData.department && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData.specialization && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Star className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium">{userData.specialization}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Statistics */}
          {(userData.totalDonated || userData.totalReceived || userData.participants || userData.donationCount || userData.qrScans) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Statistics</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userData.totalDonated && (
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(userData.totalDonated)}
                      </p>
                      <p className="text-sm text-gray-500">Total Donated</p>
                    </div>
                  )}
                  
                  {userData.donationCount && (
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{userData.donationCount}</p>
                      <p className="text-sm text-gray-500">Donations</p>
                    </div>
                  )}
                  
                  {userData.totalReceived && (
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(userData.totalReceived)}
                      </p>
                      <p className="text-sm text-gray-500">Total Received</p>
                    </div>
                  )}
                  
                  {userData.participants && (
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{userData.participants}</p>
                      <p className="text-sm text-gray-500">Participants</p>
                    </div>
                  )}
                  
                  {userData.qrScans && (
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">{userData.qrScans}</p>
                      <p className="text-sm text-gray-500">QR Scans</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Bio */}
          {userData.bio && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {userData.bio}
                </p>
              </div>
            </>
          )}

          {/* Account Status */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-500">Email Verified</span>
                <Badge variant={userData.emailVerified ? "default" : "secondary"}>
                  {userData.emailVerified ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-500">Profile Complete</span>
                <Badge variant={userData.profileComplete ? "default" : "secondary"}>
                  {userData.profileComplete ? "Yes" : "No"}
                </Badge>
              </div>
              
              {userData.lastLogin && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-500">Last Login</span>
                  <span className="text-sm font-medium">{userData.lastLogin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
