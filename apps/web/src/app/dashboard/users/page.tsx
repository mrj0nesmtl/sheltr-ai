"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import UserMap from '@/components/UserMap';
import { 
  Users, 
  UserCheck,
  UserCog,
  Heart,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Map,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Crown,
  Activity,
  MapPin,
  Shield,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  getUserStats,
  getAdminUsers,
  getParticipantUsers,
  getDonorUsers,
  type UserStats,
  type AdminUser,
  type ParticipantUser,
  type DonorUser
} from '@/services/platformMetrics';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function UserManagement() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Real data state
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [participantUsers, setParticipantUsers] = useState<ParticipantUser[]>([]);
  const [donorUsers, setDonorUsers] = useState<DonorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<(AdminUser | ParticipantUser | DonorUser) & { userType: string } | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<(AdminUser | ParticipantUser | DonorUser) & { userType: string } | null>(null);
  const [editFormData, setEditFormData] = useState<{ firstName: string; lastName: string; email: string; }>({ firstName: '', lastName: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ userId: string; userName: string; userType: string } | null>(null);

  // Update current time every minute for live session tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Export users functionality
  const exportUsers = async (userType: 'all' | 'admins' | 'participants' | 'donors') => {
    try {
      console.log(`📤 Exporting ${userType} users...`);
      
      let exportData: Record<string, string | number | null>[] = [];
      let filename = '';
      
      switch (userType) {
        case 'admins':
          exportData = adminUsers.map(user => ({
            Name: user.name,
            Email: user.email,
            Shelter: user.shelter,
            Role: user.role,
            Status: user.status,
            Participants: user.participants,
            JoinDate: user.joinDate,
            LastLogin: user.lastLogin
          }));
          filename = 'admin-users.csv';
          break;
        case 'participants':
          exportData = participantUsers.map(user => ({
            Name: user.name,
            Email: user.email,
            Shelter: user.shelter,
            Status: user.status,
            JoinDate: user.joinDate,
            TotalReceived: user.totalReceived,
            QRScans: user.qrScans
          }));
          filename = 'participants.csv';
          break;
        case 'donors':
          exportData = donorUsers.map(user => ({
            Name: user.name,
            Email: user.email,
            Status: user.status,
            JoinDate: user.joinDate,
            TotalDonated: user.totalDonated,
            DonationCount: user.donationCount,
            FavoriteShelter: user.favoriteShelter
          }));
          filename = 'donors.csv';
          break;
        default:
          // Export all users combined
          exportData = [
            ...adminUsers.map(u => ({ ...u, UserType: 'Admin' })),
            ...participantUsers.map(u => ({ ...u, UserType: 'Participant' })),
            ...donorUsers.map(u => ({ ...u, UserType: 'Donor' }))
          ];
          filename = 'all-users.csv';
      }
      
      // Convert to CSV
      if (exportData.length === 0) {
        alert('No data to export');
        return;
      }
      
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      console.log(`✅ Exported ${exportData.length} ${userType} users`);
    } catch (error) {
      console.error('❌ Error exporting users:', error);
      alert('Error exporting users. Please try again.');
    }
  };

  // View user details
  const viewUser = (user: AdminUser | ParticipantUser | DonorUser, userType: string) => {
    setSelectedUserForView({ ...user, userType });
    console.log(`👁️ Viewing ${userType} user:`, user.name);
  };

  // Edit user
  const editUser = (user: AdminUser | ParticipantUser | DonorUser, userType: string) => {
    setSelectedUserForEdit({ ...user, userType });
    // Populate form with existing data
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    });
    console.log(`✏️ Editing ${userType} user:`, user.name);
  };

  // Save user changes to Firebase
  const saveUserChanges = async () => {
    if (!selectedUserForEdit) return;
    
    setIsSaving(true);
    try {
      console.log(`💾 Saving changes for user: ${selectedUserForEdit.id}`);
      
      // Update Firebase document
      await updateDoc(doc(db, 'users', selectedUserForEdit.id), {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        name: `${editFormData.firstName} ${editFormData.lastName}`.trim(),
        updated_at: new Date()
      });

      // Update local state optimistically
      const updatedUser = {
        ...selectedUserForEdit,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        name: `${editFormData.firstName} ${editFormData.lastName}`.trim()
      };

      switch (selectedUserForEdit.userType) {
        case 'admin':
          setAdminUsers(prev => prev.map(user => 
            user.id === selectedUserForEdit.id 
              ? { ...user, ...updatedUser } as AdminUser
              : user
          ));
          break;
        case 'participant':
          setParticipantUsers(prev => prev.map(user => 
            user.id === selectedUserForEdit.id 
              ? { ...user, ...updatedUser } as ParticipantUser
              : user
          ));
          break;
        case 'donor':
          setDonorUsers(prev => prev.map(user => 
            user.id === selectedUserForEdit.id 
              ? { ...user, ...updatedUser } as DonorUser
              : user
          ));
          break;
      }

      console.log(`✅ Successfully updated user: ${updatedUser.name}`);
      setSelectedUserForEdit(null);
      setEditFormData({ firstName: '', lastName: '', email: '' });
      alert(`User "${updatedUser.name}" updated successfully!`);
      
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert('Error updating user. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Suspend/Activate user
  const toggleUserStatus = async (userId: string, currentStatus: string, userType: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      console.log(`🔄 Toggling user ${userId} from ${currentStatus} to ${newStatus}...`);
      
      // Update Firebase document
      await updateDoc(doc(db, 'users', userId), { 
        status: newStatus,
        updated_at: new Date()
      });
      
      // Update local state optimistically
      switch (userType) {
        case 'admin':
          setAdminUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: newStatus as AdminUser['status'] } : user
          ));
          break;
        case 'participant':
          setParticipantUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: newStatus as ParticipantUser['status'] } : user
          ));
          break;
        case 'donor':
          setDonorUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: newStatus as DonorUser['status'] } : user
          ));
          break;
      }
      
      console.log(`✅ User status updated to ${newStatus} in Firebase`);
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      alert('Error updating user status. Please try again.');
    }
  };

  // Delete user
  const deleteUser = (userId: string, userName: string, userType: string) => {
    setShowDeleteConfirm({ userId, userName, userType });
  };

  // Confirm user deletion
  const confirmDeleteUser = async () => {
    if (!showDeleteConfirm) return;
    
    const { userId, userName, userType } = showDeleteConfirm;
    
    try {
      console.log(`🗑️ Deleting ${userType} user: ${userName} (${userId})`);
      
      // Delete from Firebase
      await deleteDoc(doc(db, 'users', userId));

      // Remove from local state
      switch (userType) {
        case 'admin':
          setAdminUsers(prev => prev.filter(user => user.id !== userId));
          break;
        case 'participant':
          setParticipantUsers(prev => prev.filter(user => user.id !== userId));
          break;
        case 'donor':
          setDonorUsers(prev => prev.filter(user => user.id !== userId));
          break;
      }

      console.log(`✅ Successfully deleted user: ${userName}`);
      setShowDeleteConfirm(null);
      alert(`User "${userName}" has been permanently deleted.`);
      
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  // Bulk actions
  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const bulkDeleteUsers = async () => {
    if (selectedUsers.size === 0) return;
    
    const confirmed = confirm(`Are you sure you want to delete ${selectedUsers.size} selected users? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      console.log(`🗑️ Bulk deleting ${selectedUsers.size} users...`);
      
      // Delete all selected users from Firebase
      const deletePromises = Array.from(selectedUsers).map(userId => 
        deleteDoc(doc(db, 'users', userId))
      );
      await Promise.all(deletePromises);

      // Remove from local state
      setAdminUsers(prev => prev.filter(user => !selectedUsers.has(user.id)));
      setParticipantUsers(prev => prev.filter(user => !selectedUsers.has(user.id)));
      setDonorUsers(prev => prev.filter(user => !selectedUsers.has(user.id)));

      console.log(`✅ Successfully deleted ${selectedUsers.size} users`);
      setSelectedUsers(new Set());
      alert(`${selectedUsers.size} users have been permanently deleted.`);
      
    } catch (error) {
      console.error('❌ Error bulk deleting users:', error);
      alert('Error deleting users. Please try again.');
    }
  };

  // Load user management data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('👥 Loading user management data...');
        
        const [statsData, adminsData, participantsData, donorsData] = await Promise.all([
          getUserStats(),
          getAdminUsers(),
          getParticipantUsers(),
          getDonorUsers()
        ]);

        setUserStats(statsData);
        setAdminUsers(adminsData);
        setParticipantUsers(participantsData);
        setDonorUsers(donorsData);
        
        console.log('✅ User management data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Create live Super Admin data from current user
  const liveUserSession = user ? {
    id: user.uid,
    name: user.displayName || 'Joel Yaffe',
    email: user.email,
    role: 'Platform Owner',
    status: 'active',
    lastLogin: 'Active now',
    sessionStart: new Date().toLocaleTimeString(),
    location: 'Vancouver, BC',
    device: 'Chrome/Mac',
    tenantId: user.tenantId || 'platform',
    emailVerified: user.emailVerified,
    customClaims: user.role,
    joinDate: '2024-01-01' // Platform founding date
  } : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive':
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'pending_verification':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Manage all user accounts and roles across the platform
          </p>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-none"
            onClick={() => exportUsers('all')}
          >
            <Download className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Users</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 sm:flex-none"
            onClick={() => setShowAddUserModal(true)}
          >
            <Users className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* User Statistics Overview - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {loading ? '--' : userStats?.superAdmins.total || 0}
            </div>
            <div className="flex items-center space-x-4 text-xs text-purple-600 dark:text-purple-400 mt-2">
              <span className="flex items-center">
                <Activity className="h-3 w-3 text-green-500 mr-1" />
                {loading ? '--' : userStats?.superAdmins.active || 0} Online
              </span>
              <span className="flex items-center">
                <Shield className="h-3 w-3 text-purple-500 mr-1" />
                Platform Control
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : userStats?.admins.total || 0}
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {loading ? '--' : userStats?.admins.active || 0} Active
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                {loading ? '--' : userStats?.admins.pending || 0} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : userStats?.participants.total.toLocaleString() || 0}
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {loading ? '--' : userStats?.participants.verified || 0} Verified
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                {loading ? '--' : userStats?.participants.pending || 0} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donors</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : userStats?.donors.total.toLocaleString() || 0}
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {loading ? '--' : userStats?.donors.active || 0} Active
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 text-blue-500 mr-1" />
                {loading ? '--' : userStats?.donors.verified || 0} Verified
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs - Updated with Super Admins */}
      <Tabs defaultValue="super-admins" className="space-y-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="super-admins" className="flex items-center">
              <Crown className="mr-2 h-4 w-4" />
              Super Admins
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center">
              <UserCog className="mr-2 h-4 w-4" />
              Admin Users
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center">
              <UserCheck className="mr-2 h-4 w-4" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="donors" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              Donors
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              User Map
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Stacked Tabs */}
        <div className="sm:hidden">
          <TabsList className="grid grid-cols-5 gap-1 h-14 bg-muted p-1 rounded-md w-full">
            <TabsTrigger 
              value="super-admins" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Super Admins"
            >
              <Crown className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="admins" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Admin Users"
            >
              <UserCog className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="participants" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Participants"
            >
              <UserCheck className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="donors" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Donors"
            >
              <Heart className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="User Map"
            >
              <Map className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Super Admins Tab - NEW LIVE DATA */}
        <TabsContent value="super-admins" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Crown className="mr-2 h-5 w-5 text-purple-600" />
                Super Administrators
              </h3>
              <p className="text-sm text-muted-foreground">Platform owners with complete system access</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">LIVE DATA</span>
              </div>
            </div>
          </div>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-0">
              {liveUserSession && (
                <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-4">
                    {/* Top Row: Icon, Name, Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base text-purple-700 dark:text-purple-300 truncate">{liveUserSession.name}</div>
                          <div className="text-sm text-purple-600 dark:text-purple-400 truncate">{liveUserSession.email}</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 shrink-0">
                        Online
                      </Badge>
                    </div>
                    
                    {/* Role and Tenant */}
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="h-3 w-3 mr-1" />
                      {liveUserSession.role} • Tenant: {liveUserSession.tenantId}
                    </div>
                    
                    {/* Session Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-purple-700 dark:text-purple-300">Session Started</div>
                        <div className="text-xs text-muted-foreground">{liveUserSession.sessionStart}</div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600 flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          Active Now
                        </div>
                        <div className="text-xs text-muted-foreground">{currentTime.toLocaleTimeString()}</div>
                      </div>
                    </div>
                    
                    {/* Location & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-700">
                      <div className="text-sm">
                        <div className="font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {liveUserSession.location}
                        </div>
                        <div className="text-xs text-muted-foreground">{liveUserSession.device}</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-purple-700 dark:text-purple-300">{liveUserSession.name}</div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">{liveUserSession.email}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          {liveUserSession.role} • Tenant: {liveUserSession.tenantId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Session Started</div>
                        <div className="text-xs text-muted-foreground">{liveUserSession.sessionStart}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium flex items-center">
                          <Activity className="h-3 w-3 mr-1 text-green-500" />
                          Active Now
                        </div>
                        <div className="text-xs text-muted-foreground">{currentTime.toLocaleTimeString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {liveUserSession.location}
                        </div>
                        <div className="text-xs text-muted-foreground">{liveUserSession.device}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Online
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Super Admin Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Super Admin Capabilities
              </CardTitle>
              <CardDescription>Complete platform control and oversight</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Platform Management</div>
                    <div className="text-sm text-muted-foreground">Full system control</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">User Administration</div>
                    <div className="text-sm text-muted-foreground">All user management</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Financial Oversight</div>
                    <div className="text-sm text-muted-foreground">Transaction monitoring</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="admins" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Shelter Administrators</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportUsers('admins')}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading admin users...</div>
              ) : adminUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No admin users found</div>
              ) : (
                <div className="space-y-0">
                  {adminUsers.map((admin) => (
                  <div key={admin.id} className="p-4 sm:p-6 border-b last:border-b-0">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3">
                      {/* Top Row: Icon, Name, Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{admin.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{admin.email}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(admin.status)} variant="secondary">
                          {admin.status}
                        </Badge>
                      </div>
                      
                      {/* Shelter and Role */}
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {admin.shelter} • {admin.role}
                      </div>
                      
                      {/* Metrics and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{admin.participants}</div>
                            <div className="text-xs text-muted-foreground">Participants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{admin.lastLogin}</div>
                            <div className="text-xs text-muted-foreground">Last Login</div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => viewUser(admin, 'admin')}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => editUser(admin, 'admin')}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleUserStatus(admin.id, admin.status, 'admin')}
                            title={admin.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            {admin.status === 'active' ? 
                              <Ban className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building2 className="h-3 w-3 mr-1" />
                            {admin.shelter} • {admin.role}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{admin.participants}</div>
                          <div className="text-xs text-muted-foreground">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{admin.lastLogin}</div>
                          <div className="text-xs text-muted-foreground">Last Login</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(admin.status)}
                          <Badge className={getStatusColor(admin.status)}>
                            {admin.status}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => viewUser(admin, 'admin')}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => editUser(admin, 'admin')}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleUserStatus(admin.id, admin.status, 'admin')}
                            title={admin.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            {admin.status === 'active' ? 
                              <Ban className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteUser(admin.id, admin.name, 'admin')}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Homeless Participants</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportUsers('participants')}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading participants...</div>
              ) : participantUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No participants found</div>
              ) : (
                <div className="space-y-0">
                  {participantUsers.map((participant) => (
                  <div key={participant.id} className="p-4 sm:p-6 border-b last:border-b-0">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3">
                      {/* Top Row: Icon, Name, Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{participant.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{participant.email}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(participant.status)} variant="secondary">
                          {participant.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {/* Shelter */}
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {participant.shelter}
                      </div>
                      
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">${participant.totalReceived.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Received</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{participant.qrScans}</div>
                          <div className="text-xs text-muted-foreground">QR Scans</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{participant.lastDonation}</div>
                          <div className="text-xs text-muted-foreground">Last Donation</div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-end space-x-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">{participant.email}</div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building2 className="h-3 w-3 mr-1" />
                            {participant.shelter}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">${participant.totalReceived.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Received</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{participant.qrScans}</div>
                          <div className="text-xs text-muted-foreground">QR Scans</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{participant.lastDonation}</div>
                          <div className="text-xs text-muted-foreground">Last Donation</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(participant.status)}
                          <Badge className={getStatusColor(participant.status)}>
                            {participant.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => viewUser(participant, 'participant')}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => editUser(participant, 'participant')}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleUserStatus(participant.id, participant.status, 'participant')}
                            title={participant.status === 'verified' ? 'Suspend User' : 'Activate User'}
                          >
                            {participant.status === 'verified' ? 
                              <Ban className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteUser(participant.id, participant.name, 'participant')}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donors Tab */}
        <TabsContent value="donors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Platform Donors</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportUsers('donors')}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading donors...</div>
              ) : donorUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No donors found</div>
              ) : (
                <div className="space-y-0">
                  {donorUsers.map((donor) => (
                  <div key={donor.id} className="p-4 sm:p-6 border-b last:border-b-0">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3">
                      {/* Top Row: Icon, Name, Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{donor.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{donor.email}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(donor.status)} variant="secondary">
                          {donor.status}
                        </Badge>
                      </div>
                      
                      {/* Preferred Shelter */}
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        Prefers: {donor.favoriteShelter}
                      </div>
                      
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">${donor.totalDonated.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Donated</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{donor.donationCount}</div>
                          <div className="text-xs text-muted-foreground">Donations</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{donor.lastDonation}</div>
                          <div className="text-xs text-muted-foreground">Last Donation</div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-end space-x-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium">{donor.name}</div>
                          <div className="text-sm text-muted-foreground">{donor.email}</div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building2 className="h-3 w-3 mr-1" />
                            Prefers: {donor.favoriteShelter}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">${donor.totalDonated.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Donated</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{donor.donationCount}</div>
                          <div className="text-xs text-muted-foreground">Donations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{donor.lastDonation}</div>
                          <div className="text-xs text-muted-foreground">Last Donation</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(donor.status)}
                          <Badge className={getStatusColor(donor.status)}>
                            {donor.status}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => viewUser(donor, 'donor')}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => editUser(donor, 'donor')}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleUserStatus(donor.id, donor.status, 'donor')}
                            title={donor.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            {donor.status === 'active' ? 
                              <Ban className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteUser(donor.id, donor.name, 'donor')}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2 h-5 w-5" />
                User Location Map
              </CardTitle>
              <CardDescription>
                Interactive map showing participants (orange pins) and donors (green pins) across Montreal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <UserMap height="600px" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This feature will open a form to create new users with role selection and shelter assignment.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('🚀 Opening Add User form...');
                setShowAddUserModal(false);
                alert('Add User form would open here');
              }}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {selectedUserForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedUserForView.name}</div>
              <div><strong>Email:</strong> {selectedUserForView.email}</div>
              <div><strong>Role:</strong> {selectedUserForView.userType}</div>
              <div><strong>Status:</strong> {selectedUserForView.status}</div>
              {'shelter' in selectedUserForView && selectedUserForView.shelter && (
                <div><strong>Shelter:</strong> {selectedUserForView.shelter}</div>
              )}
              <div><strong>Join Date:</strong> {selectedUserForView.joinDate}</div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedUserForView(null)}
              >
                Close
              </Button>
              <Button onClick={() => {
                setSelectedUserForView(null);
                setSelectedUserForEdit(selectedUserForView);
              }}>
                Edit User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Editing: {selectedUserForEdit.name} ({selectedUserForEdit.userType})
            </p>
            
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>

              {/* Preview */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm"><strong>Preview:</strong> {editFormData.firstName} {editFormData.lastName}</p>
                <p className="text-sm text-muted-foreground">{editFormData.email}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedUserForEdit(null);
                  setEditFormData({ firstName: '', lastName: '', email: '' });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveUserChanges}
                disabled={isSaving || !editFormData.firstName || !editFormData.lastName || !editFormData.email}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete User</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to permanently delete:
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md mb-4">
              <p className="font-semibold">{showDeleteConfirm.userName}</p>
              <p className="text-sm text-muted-foreground">
                {showDeleteConfirm.userType} user
              </p>
            </div>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ This action cannot be undone. All user data will be permanently deleted.
            </p>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDeleteUser}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 