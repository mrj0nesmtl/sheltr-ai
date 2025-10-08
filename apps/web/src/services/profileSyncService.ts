/**
 * Profile Synchronization Service
 * 
 * This service ensures that profile data is synchronized across multiple collections:
 * - admin_profiles (SystemSettingsService) - Super Admin detailed profile
 * - users.adminProfile (PlatformAdminProfileService) - Platform Admin profile used by Team page
 * - users (base collection) - Basic Firebase user data
 * 
 * This fixes the issue where Joel's Super Admin profile data wasn't appearing on the Team page.
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SystemSettingsService, type SuperAdminProfile } from './systemSettingsService';
import { PlatformAdminProfileService, type PlatformAdminProfile } from './platformAdminProfileService';

export interface UnifiedProfileData {
  // Basic info (common across all systems)
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  
  // Professional info
  jobTitle: string;
  company?: string;
  department?: string;
  specialization?: string;
  location?: string;
  bio?: string;
  
  // Admin-specific fields
  expertise?: string[];
  certifications?: string[];
  education?: string[];
  
  // Contact info
  linkedIn?: string;
  twitter?: string;
  website?: string;
  
  // Privacy & settings
  profileVisibility?: 'public' | 'private';
  displayOrder?: number;
  
  // Metadata
  lastUpdated?: Date;
  updatedBy?: string;
}

export class ProfileSyncService {
  /**
   * Synchronize Super Admin profile data to Platform Admin profile structure
   * This ensures Joel's Super Admin data appears on the Team page
   */
  static async syncSuperAdminToPlatformAdmin(userId: string): Promise<boolean> {
    try {
      console.log('🔄 Syncing Super Admin profile to Platform Admin structure...');
      
      // Get Super Admin profile from admin_profiles collection
      const superAdminProfile = await SystemSettingsService.getSuperAdminProfile(userId);
      if (!superAdminProfile) {
        console.log('❌ No Super Admin profile found to sync');
        return false;
      }
      
      // Get current user document to preserve existing data
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // Try to get profile picture URL from Firebase Storage
      let profilePictureUrl = userData.profilePicture || '';
      
      // If no profile picture in userData, try to fetch from Storage
      if (!profilePictureUrl) {
        try {
          const { ref: storageRef, getDownloadURL } = await import('firebase/storage');
          const { storage } = await import('@/lib/firebase');
          
          // Try common profile picture paths
          const possiblePaths = [
            `profiles/${userId}/avatar.jpg`,
            `profiles/${userId}/avatar.png`,
            `profiles/${userId}/profile.jpg`
          ];
          
          for (const path of possiblePaths) {
            try {
              const fileRef = storageRef(storage, path);
              profilePictureUrl = await getDownloadURL(fileRef);
              console.log(`✅ Found profile picture at: ${path}`);
              break;
            } catch (err) {
              // Continue to next path
            }
          }
        } catch (error) {
          console.log('ℹ️ No profile picture found in Storage');
        }
      }
      
      console.log('🖼️ Profile picture URL for sync:', profilePictureUrl || 'None');
      
      // Map Super Admin profile to Platform Admin structure
      const platformAdminData: Partial<PlatformAdminProfile> = {
        firstName: superAdminProfile.firstName,
        lastName: superAdminProfile.lastName,
        displayName: `${superAdminProfile.firstName} ${superAdminProfile.lastName}`.trim(),
        email: superAdminProfile.email,
        phone: superAdminProfile.phone || '',
        jobTitle: superAdminProfile.jobTitle || 'Chief Executive Officer & Founder',
        company: superAdminProfile.company || 'SHELTR-AI Technologies Inc.',
        department: superAdminProfile.department || 'Leadership',
        specialization: superAdminProfile.specialization || 'Strategic Leadership & Technology Innovation',
        location: superAdminProfile.location || 'Montreal, QC',
        bio: superAdminProfile.bio || 'Founder and CEO of SHELTR-AI, pioneering innovative solutions to revolutionize homelessness services through cutting-edge technology and compassionate action.',
        yearsOfExperience: superAdminProfile.yearsOfExperience || 25,
        
        // Sync privacy settings from Super Admin profile
        profileVisibility: superAdminProfile.profileVisibility || 'public',
        showContactInfo: superAdminProfile.showContactInfo ?? true,
        showExperience: superAdminProfile.showExperience ?? true,
        displayOrder: -1, // Always first
        
        // Sync expertise from Super Admin profile (or use defaults)
        expertise: superAdminProfile.expertise && superAdminProfile.expertise.length > 0 
          ? superAdminProfile.expertise 
          : ['Strategic Leadership', 'Technology Innovation', 'Social Impact', 'Blockchain', 'AI/ML'],
        certifications: [],
        education: [],
        
        // Sync social media links from Super Admin profile
        linkedIn: superAdminProfile.linkedIn || '',
        twitter: superAdminProfile.twitter || '',
        website: superAdminProfile.website || '',
        
        // Profile completeness
        profileComplete: true,
        
        // Metadata
        lastUpdated: new Date(),
        updatedBy: userId
      };
      
      // Update the users collection with adminProfile nested data
      const userUpdateData = {
        // Update base user fields
        displayName: platformAdminData.displayName,
        email: platformAdminData.email,
        profilePicture: profilePictureUrl, // Use fetched or existing profile picture
        
        // Update adminProfile nested object
        adminProfile: {
          ...userData.adminProfile, // Preserve existing adminProfile data
          ...platformAdminData,
          profilePicture: profilePictureUrl, // Sync profile picture to adminProfile
        },
        
        // Update privacy settings
        privacy: {
          ...userData.privacy,
          profileVisibility: superAdminProfile.profileVisibility || 'public',
          showContactInfo: superAdminProfile.showContactInfo ?? true,
          showExperience: superAdminProfile.showExperience ?? true
        },
        
        // Metadata
        updated_at: new Date()
      };
      
      await updateDoc(doc(db, 'users', userId), userUpdateData);
      
      // 🔄 CRITICAL: Sync to team_members collection for public team page
      try {
        console.log('🔄 Syncing Super Admin profile to public team_members collection...');
        await PlatformAdminProfileService.updatePlatformAdminProfile(userId, platformAdminData);
        console.log('✅ Successfully synced to team_members collection');
      } catch (syncError) {
        console.error('⚠️ Warning: Failed to sync to team_members collection:', syncError);
        // Don't fail the entire sync if team sync fails
      }
      
      console.log('✅ Successfully synced Super Admin profile to Platform Admin structure');
      console.log('🔍 Sync details:', {
        userId,
        superAdminData: {
          firstName: superAdminProfile?.firstName,
          lastName: superAdminProfile?.lastName,
          jobTitle: superAdminProfile?.jobTitle,
          bio: superAdminProfile?.bio,
          location: superAdminProfile?.location,
          profileVisibility: superAdminProfile?.profileVisibility
        },
        syncedPlatformData: {
          firstName: platformAdminData.firstName,
          lastName: platformAdminData.lastName,
          jobTitle: platformAdminData.jobTitle,
          bio: platformAdminData.bio,
          location: platformAdminData.location,
          profileVisibility: platformAdminData.profileVisibility
        }
      });
      console.log('📸 Profile picture synced:', profilePictureUrl || 'None');
      console.log('🔒 Privacy settings synced:', {
        profileVisibility: superAdminProfile.profileVisibility || 'public',
        showContactInfo: superAdminProfile.showContactInfo ?? true,
        showExperience: superAdminProfile.showExperience ?? true
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error syncing Super Admin profile:', error);
      return false;
    }
  }
  
  /**
   * Synchronize Platform Admin profile changes back to Super Admin profile
   * This ensures changes made in Platform Admin profile are reflected in Super Admin profile
   */
  static async syncPlatformAdminToSuperAdmin(userId: string): Promise<boolean> {
    try {
      console.log('🔄 Syncing Platform Admin profile to Super Admin structure...');
      
      // Get Platform Admin profile
      const platformAdminProfile = await PlatformAdminProfileService.getPlatformAdminProfile(userId);
      if (!platformAdminProfile) {
        console.log('❌ No Platform Admin profile found to sync');
        return false;
      }
      
      // Map Platform Admin profile to Super Admin structure
      const superAdminData: Partial<SuperAdminProfile> = {
        firstName: platformAdminProfile.firstName,
        lastName: platformAdminProfile.lastName,
        email: platformAdminProfile.email,
        phone: platformAdminProfile.phone || '',
        jobTitle: platformAdminProfile.jobTitle,
        company: platformAdminProfile.company || 'SHELTR-AI Technologies Inc.',
        location: platformAdminProfile.location || 'Vancouver, BC',
        bio: platformAdminProfile.bio || '',
        
        // Default settings for Super Admin
        timezone: 'America/Montreal',
        language: 'en',
        twoFactorEnabled: false,
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true,
        
        // Metadata
        lastUpdated: new Date(),
        updatedBy: userId
      };
      
      // Save to admin_profiles collection
      await SystemSettingsService.saveSuperAdminProfile(userId, superAdminData);
      
      console.log('✅ Successfully synced Platform Admin profile to Super Admin structure');
      return true;
    } catch (error) {
      console.error('❌ Error syncing Platform Admin profile:', error);
      return false;
    }
  }
  
  /**
   * Get unified profile data from all sources
   */
  static async getUnifiedProfile(userId: string): Promise<UnifiedProfileData | null> {
    try {
      // Try to get Super Admin profile first (more detailed)
      const superAdminProfile = await SystemSettingsService.getSuperAdminProfile(userId);
      
      // Get Platform Admin profile
      const platformAdminProfile = await PlatformAdminProfileService.getPlatformAdminProfile(userId);
      
      // Get base user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // Merge data with priority: SuperAdmin > PlatformAdmin > BaseUser
      const unifiedProfile: UnifiedProfileData = {
        firstName: superAdminProfile?.firstName || platformAdminProfile?.firstName || userData.firstName || '',
        lastName: superAdminProfile?.lastName || platformAdminProfile?.lastName || userData.lastName || '',
        displayName: superAdminProfile?.firstName && superAdminProfile?.lastName 
          ? `${superAdminProfile.firstName} ${superAdminProfile.lastName}`.trim()
          : platformAdminProfile?.displayName || userData.displayName || '',
        email: superAdminProfile?.email || platformAdminProfile?.email || userData.email || '',
        phone: superAdminProfile?.phone || platformAdminProfile?.phone || userData.phone || '',
        profilePicture: userData.profilePicture || platformAdminProfile?.profilePicture || '',
        
        jobTitle: superAdminProfile?.jobTitle || platformAdminProfile?.jobTitle || 'Platform Administrator',
        company: superAdminProfile?.company || platformAdminProfile?.company || 'SHELTR-AI Technologies Inc.',
        department: platformAdminProfile?.department || 'Leadership',
        specialization: platformAdminProfile?.specialization || 'Strategic Leadership',
        location: superAdminProfile?.location || platformAdminProfile?.location || 'Vancouver, BC',
        bio: superAdminProfile?.bio || platformAdminProfile?.bio || '',
        
        expertise: platformAdminProfile?.expertise || [],
        certifications: platformAdminProfile?.certifications || [],
        education: platformAdminProfile?.education || [],
        
        linkedIn: platformAdminProfile?.linkedIn || '',
        twitter: platformAdminProfile?.twitter || '',
        website: platformAdminProfile?.website || '',
        
        profileVisibility: platformAdminProfile?.profileVisibility || 'public',
        displayOrder: platformAdminProfile?.displayOrder || 999,
        
        lastUpdated: superAdminProfile?.lastUpdated || platformAdminProfile?.lastUpdated || new Date(),
        updatedBy: superAdminProfile?.updatedBy || platformAdminProfile?.updatedBy || userId
      };
      
      return unifiedProfile;
    } catch (error) {
      console.error('❌ Error getting unified profile:', error);
      return null;
    }
  }
  
  /**
   * Save unified profile data to both collections
   */
  static async saveUnifiedProfile(userId: string, profileData: Partial<UnifiedProfileData>): Promise<boolean> {
    try {
      console.log('💾 Saving unified profile data...');
      
      // Prepare Super Admin profile data
      const superAdminData: Partial<SuperAdminProfile> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        jobTitle: profileData.jobTitle,
        company: profileData.company,
        location: profileData.location,
        bio: profileData.bio,
        lastUpdated: new Date(),
        updatedBy: userId
      };
      
      // Prepare Platform Admin profile data
      const platformAdminData: Partial<PlatformAdminProfile> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: profileData.displayName,
        email: profileData.email,
        phone: profileData.phone,
        profilePicture: profileData.profilePicture,
        jobTitle: profileData.jobTitle,
        company: profileData.company,
        department: profileData.department,
        specialization: profileData.specialization,
        location: profileData.location,
        bio: profileData.bio,
        expertise: profileData.expertise,
        certifications: profileData.certifications,
        education: profileData.education,
        linkedIn: profileData.linkedIn,
        twitter: profileData.twitter,
        website: profileData.website,
        profileVisibility: profileData.profileVisibility,
        displayOrder: profileData.displayOrder,
        lastUpdated: new Date(),
        updatedBy: userId
      };
      
      // Save to both collections
      const [superAdminSuccess, platformAdminSuccess] = await Promise.all([
        SystemSettingsService.saveSuperAdminProfile(userId, superAdminData),
        PlatformAdminProfileService.updatePlatformAdminProfile(userId, platformAdminData)
      ]);
      
      if (superAdminSuccess && platformAdminSuccess) {
        console.log('✅ Successfully saved unified profile to both collections');
        return true;
      } else {
        console.log('⚠️ Partial success saving unified profile');
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving unified profile:', error);
      return false;
    }
  }
  
  /**
   * Initialize profile sync for a user (run once to establish sync)
   */
  static async initializeProfileSync(userId: string): Promise<boolean> {
    try {
      console.log('🚀 Initializing profile sync for user:', userId);
      
      // First, try to sync Super Admin profile to Platform Admin structure
      const syncSuccess = await this.syncSuperAdminToPlatformAdmin(userId);
      
      if (syncSuccess) {
        console.log('✅ Profile sync initialization completed successfully');
        return true;
      } else {
        // If no Super Admin profile exists, try the reverse sync
        console.log('🔄 No Super Admin profile found, trying reverse sync...');
        return await this.syncPlatformAdminToSuperAdmin(userId);
      }
    } catch (error) {
      console.error('❌ Error initializing profile sync:', error);
      return false;
    }
  }
}
