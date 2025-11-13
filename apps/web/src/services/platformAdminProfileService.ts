/**
 * Platform Administrator Profile Service
 * Manages enhanced profile data for platform administrators including roles, specializations, and metadata
 */

import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Enhanced Platform Administrator Profile Interface
export interface PlatformAdminProfile {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  
  // Professional Information
  department: string;
  specialization: string;
  jobTitle?: string;
  bio?: string;
  expertise: string[];
  
  // Contact Information
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  
  // Platform Role Information
  accessLevel: 'platform_admin' | 'super_admin';
  joinDate: string;
  permissions: string[];
  dashboardAccess: string[];
  
  // Professional Details
  yearsOfExperience?: number;
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    year: number;
    expiryYear?: number;
  }[];
  
  // Preferences
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weeklyReports: boolean;
    systemAlerts: boolean;
  };
  
  // Privacy Settings
  profileVisibility: 'public' | 'team' | 'private';
  showContactInfo: boolean;
  showExperience: boolean;
  
  // Metadata
  profileComplete: boolean;
  lastUpdated: string;
  profilePicture?: string;
  displayOrder?: number;
}

// Update request interface
export interface PlatformAdminProfileUpdate {
  // Basic Information
  firstName?: string;
  lastName?: string;
  displayName?: string;
  
  // Professional Information
  department?: string;
  specialization?: string;
  jobTitle?: string;
  bio?: string;
  expertise?: string[];
  
  // Contact Information
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  
  // Professional Details
  yearsOfExperience?: number;
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    year: number;
    expiryYear?: number;
  }[];
  
  // Preferences
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    weeklyReports?: boolean;
    systemAlerts?: boolean;
  };
  
  // Privacy Settings
  profileVisibility?: 'public' | 'team' | 'private';
  showContactInfo?: boolean;
  showExperience?: boolean;
  
  // Profile Picture
  profilePicture?: string;
  
  // Display Order (for Super Admin drag-drop reordering)
  displayOrder?: number;
}

export class PlatformAdminProfileService {
  /**
   * Get enhanced platform administrator profile
   */
  static async getPlatformAdminProfile(userId: string): Promise<PlatformAdminProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        console.error('User document not found:', userId);
        return null;
      }
      
      const userData = userDoc.data();
      
      // Extract platform admin profile data
      const adminProfile = userData.adminProfile || {};
      
      return {
        // Basic Information
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
        
        // Professional Information (Auto-fill from existing role mapping if empty)
        department: adminProfile.department || this.extractDepartmentFromRole(userData.email || ''),
        specialization: adminProfile.specialization || this.extractSpecializationFromRole(userData.email || ''),
        jobTitle: adminProfile.jobTitle || this.getPlatformAdminRoleDescription(userData.email || ''),
        bio: adminProfile.bio || '',
        expertise: adminProfile.expertise || [],
        
        // Contact Information
        phone: userData.contactInfo?.phone || '',
        linkedIn: adminProfile.linkedIn || '',
        twitter: adminProfile.twitter || '',
        website: adminProfile.website || '',
        
        // Platform Role Information
        accessLevel: adminProfile.accessLevel || 'platform_admin',
        joinDate: userData.created_at || '',
        permissions: adminProfile.permissions || [],
        dashboardAccess: adminProfile.dashboardAccess || [],
        
        // Professional Details
        yearsOfExperience: adminProfile.yearsOfExperience || 0,
        education: adminProfile.education || [],
        certifications: adminProfile.certifications || [],
        
        // Preferences
        notificationPreferences: {
          email: userData.privacy?.notificationPreferences?.email ?? true,
          push: userData.privacy?.notificationPreferences?.push ?? true,
          sms: userData.privacy?.notificationPreferences?.sms ?? false,
          weeklyReports: Boolean(adminProfile.weeklyReports ?? true),
          systemAlerts: Boolean(adminProfile.systemAlerts ?? true),
        },
        
        // Privacy Settings (Default to public for QA stage)
        profileVisibility: userData.privacy?.profileVisibility || 'public',
        showContactInfo: adminProfile.showContactInfo ?? true,
        showExperience: adminProfile.showExperience ?? true,
        
        // Metadata
        profileComplete: userData.profileComplete || false,
        lastUpdated: userData.updated_at || userData.created_at || '',
        profilePicture: userData.profilePicture || '',
        displayOrder: adminProfile.displayOrder ?? 999, // Default high number for new admins
      };
      
    } catch (error) {
      console.error('Error fetching platform admin profile:', error);
      return null;
    }
  }
  
  /**
   * Update platform administrator profile
   */
  static async updatePlatformAdminProfile(
    userId: string, 
    updates: PlatformAdminProfileUpdate
  ): Promise<boolean> {
    try {
      // Prepare update object
      const updateData: Record<string, unknown> = {
        updated_at: serverTimestamp(),
      };
      
      // Basic information updates
      if (updates.firstName !== undefined) {
        updateData.firstName = updates.firstName;
      }
      if (updates.lastName !== undefined) {
        updateData.lastName = updates.lastName;
      }
      if (updates.displayName !== undefined) {
        updateData.displayName = updates.displayName;
      }
      
      // Contact information updates
      if (updates.phone !== undefined) {
        updateData['contactInfo.phone'] = updates.phone;
      }
      
      // Admin profile updates
      const adminProfileUpdates: Record<string, unknown> = {};
      
      if (updates.department !== undefined) {
        adminProfileUpdates.department = updates.department;
      }
      if (updates.specialization !== undefined) {
        adminProfileUpdates.specialization = updates.specialization;
      }
      if (updates.jobTitle !== undefined) {
        adminProfileUpdates.jobTitle = updates.jobTitle;
      }
      if (updates.bio !== undefined) {
        adminProfileUpdates.bio = updates.bio;
      }
      if (updates.expertise !== undefined) {
        adminProfileUpdates.expertise = updates.expertise;
      }
      if (updates.linkedIn !== undefined) {
        adminProfileUpdates.linkedIn = updates.linkedIn;
      }
      if (updates.twitter !== undefined) {
        adminProfileUpdates.twitter = updates.twitter;
      }
      if (updates.website !== undefined) {
        adminProfileUpdates.website = updates.website;
      }
      if (updates.yearsOfExperience !== undefined) {
        adminProfileUpdates.yearsOfExperience = updates.yearsOfExperience;
      }
      if (updates.education !== undefined) {
        adminProfileUpdates.education = updates.education;
      }
      if (updates.certifications !== undefined) {
        adminProfileUpdates.certifications = updates.certifications;
      }
      if (updates.showContactInfo !== undefined) {
        adminProfileUpdates.showContactInfo = updates.showContactInfo;
      }
      if (updates.showExperience !== undefined) {
        adminProfileUpdates.showExperience = updates.showExperience;
      }
      if (updates.displayOrder !== undefined) {
        adminProfileUpdates.displayOrder = updates.displayOrder;
      }
      
      // Apply admin profile updates
      Object.keys(adminProfileUpdates).forEach(key => {
        updateData[`adminProfile.${key}`] = adminProfileUpdates[key];
      });
      
      // Profile picture update (stored at root level)
      if (updates.profilePicture !== undefined) {
        updateData.profilePicture = updates.profilePicture;
      }
      
      // Privacy settings updates
      if (updates.profileVisibility !== undefined) {
        updateData['privacy.profileVisibility'] = updates.profileVisibility;
      }
      
      // Notification preferences updates
      if (updates.notificationPreferences) {
        Object.keys(updates.notificationPreferences).forEach(key => {
          if (updates.notificationPreferences![key as keyof typeof updates.notificationPreferences] !== undefined) {
            updateData[`privacy.notificationPreferences.${key}`] = updates.notificationPreferences![key as keyof typeof updates.notificationPreferences];
          }
        });
      }
      
      // Update the document first
      await updateDoc(doc(db, 'users', userId), updateData);
      
      // 🔄 SYNC TO PUBLIC TEAM PAGE: Update team_members collection
      // Fetch profile once after update for both completion check and team sync
      try {
        console.log('🔄 Syncing profile updates to public team_members collection...');
        const updatedProfile = await this.getPlatformAdminProfile(userId);
        
        if (updatedProfile) {
          // Check profile completion with fresh data
          const isComplete = this.checkProfileCompletion(updatedProfile, {});
          if (isComplete !== updatedProfile.profileComplete) {
            await updateDoc(doc(db, 'users', userId), { profileComplete: isComplete });
          }
          
          // Sync to team_members with the profile we just fetched
          await this.syncToPublicTeamCollectionWithProfile(userId, updatedProfile);
        }
        
        console.log('✅ Successfully synced to team_members collection');
      } catch (syncError) {
        console.error('⚠️ Warning: Failed to sync to team_members collection:', syncError);
        // Don't fail the entire update if team sync fails
      }
      
      console.log('Platform admin profile updated successfully:', userId);
      return true;
      
    } catch (error) {
      console.error('Error updating platform admin profile:', error);
      return false;
    }
  }
  
  /**
   * Sync Platform Admin profile changes to the public team_members collection
   * This ensures the team page always shows current data
   * @param userId - The user ID
   * @param fullProfile - The complete profile data (avoids redundant fetch)
   */
  private static async syncToPublicTeamCollectionWithProfile(
    userId: string,
    fullProfile: PlatformAdminProfile
  ): Promise<void> {
    try {
      if (!fullProfile) {
        console.log('⚠️ No profile found to sync to team_members');
        return;
      }
      
      // Check if user has public visibility (or undefined for backwards compatibility)
      const isPublic = !fullProfile.profileVisibility || fullProfile.profileVisibility === 'public';
      
      const teamMemberRef = doc(db, 'team_members', userId);
      
      if (!isPublic) {
        // If profile is now private, remove from team_members
        try {
          await updateDoc(teamMemberRef, { _deleted: true });
          console.log('🔒 Marked team member as private');
        } catch {
          // Document might not exist, which is fine for private profiles
          console.log('ℹ️ Team member document does not exist (profile is private)');
        }
        return;
      }
      
      // Build team member data from profile
      const teamMemberData = {
        id: userId,
        name: `${fullProfile.firstName} ${fullProfile.lastName}`.trim(),
        displayName: fullProfile.displayName || `${fullProfile.firstName} ${fullProfile.lastName}`.trim(),
        email: fullProfile.email,
        jobTitle: fullProfile.jobTitle || 'Platform Administrator',
        department: fullProfile.department || 'General',
        specialization: fullProfile.specialization || '',
        bio: fullProfile.bio || '',
        profilePicture: fullProfile.profilePicture,
        expertise: fullProfile.expertise || [],
        yearsOfExperience: fullProfile.yearsOfExperience || 0,
        
        // Contact info
        phone: fullProfile.phone,
        linkedIn: fullProfile.linkedIn,
        twitter: fullProfile.twitter,
        website: fullProfile.website,
        
        // Professional details
        education: fullProfile.education,
        certifications: fullProfile.certifications,
        
        // Metadata
        role: fullProfile.accessLevel || 'platform_admin',
        joinDate: fullProfile.joinDate || new Date().toISOString(),
        profileComplete: fullProfile.profileComplete || false,
        isFoundingMember: this.isFoundingMember(fullProfile.email, fullProfile.joinDate),
        displayOrder: fullProfile.displayOrder,
        
        // Sync timestamp
        lastSynced: new Date().toISOString(),
        _deleted: false
      };
      
      // Use setDoc with merge to create or update
      await setDoc(teamMemberRef, teamMemberData, { merge: true });
      console.log(`✅ Synced ${fullProfile.firstName} ${fullProfile.lastName} to team_members collection`);
      
    } catch (error) {
      console.error('❌ Error syncing to team_members collection:', error);
      throw error;
    }
  }
  
  /**
   * Determine if a user is a founding member based on join date
   */
  private static isFoundingMember(email: string, joinDate?: string): boolean {
    // Hardcoded founding members by email
    const foundingEmails = [
      'joel.yaffe@gmail.com',
      'alexanderkline13@gmail.com',
      'alaghetts@gmail.com',
      'doug.kukura@gmail.com',
      'morganhirtle@gmail.com'
    ];
    
    if (foundingEmails.includes(email.toLowerCase())) {
      return true;
    }
    
    // Check join date (before 2025)
    if (joinDate) {
      try {
        const joinDateTime = new Date(joinDate).getTime();
        const foundingCutoff = new Date('2025-01-01').getTime();
        return joinDateTime < foundingCutoff;
      } catch {
        return false;
      }
    }
    
    return false;
  }
  
  /**
   * Check if profile is complete
   */
  private static checkProfileCompletion(
    currentProfile: PlatformAdminProfile, 
    updates: PlatformAdminProfileUpdate
  ): boolean {
    // Create merged profile with updates
    const mergedProfile = { ...currentProfile, ...updates };
    
    // Required fields for completion
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'department',
      'specialization',
      'jobTitle',
      'bio'
    ];
    
    // Check if all required fields are present and not empty
    const fieldsComplete = requiredFields.every(field => {
      const value = mergedProfile[field as keyof PlatformAdminProfile];
      return value && value.toString().trim().length > 0;
    });
    
    // CRITICAL: Profile picture is required for completion
    const hasProfilePicture = Boolean(mergedProfile.profilePicture && mergedProfile.profilePicture.trim().length > 0);
    
    // Must have at least one expertise area
    const hasExpertise = Boolean(mergedProfile.expertise && mergedProfile.expertise.length > 0);
    
    return Boolean(fieldsComplete && hasProfilePicture && hasExpertise);
  }
  
  /**
   * Get all platform administrators with their profiles
   * Filters by profileVisibility for public team page display
   */
  static async getAllPlatformAdminProfiles(publicOnly = false): Promise<PlatformAdminProfile[]> {
    try {
      console.log('Getting all platform admin profiles...', { publicOnly });
      
      const { collection, getDocs, query, where, or } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      // Query all users with platform_admin OR super_admin role (for team page)
      const usersQuery = query(
        collection(db, 'users'),
        or(
          where('role', '==', 'platform_admin'),
          where('role', '==', 'super_admin')
        )
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const profiles: PlatformAdminProfile[] = [];
      
      for (const doc of querySnapshot.docs) {
        const userId = doc.id;
        const profile = await this.getPlatformAdminProfile(userId);
        
        if (profile) {
          // If publicOnly is true, only include profiles with 'public' visibility
          if (publicOnly && profile.profileVisibility !== 'public') {
            continue;
          }
          
          profiles.push(profile);
        }
      }
      
      // Sort by join date (newest first)
      profiles.sort((a, b) => {
        const dateA = new Date(a.joinDate).getTime();
        const dateB = new Date(b.joinDate).getTime();
        return dateB - dateA;
      });
      
      console.log(`Found ${profiles.length} platform admin profiles`, { publicOnly });
      return profiles;
      
    } catch (error) {
      console.error('Error fetching all platform admin profiles:', error);
      return [];
    }
  }
  
  /**
   * Update the role description mapping used in the UI
   */
  static getPlatformAdminRoleDescription(email: string): string {
    const roleMap: { [key: string]: string } = {
      'senw@royaltri.com': 'Platform Administrator • Brand, Marketing, Publicity',
      'alaghetts@gmail.com': 'Platform Administrator • Product Design & Engineering',
      'zaffialaplante@gmail.com': 'Platform Administrator • Public Relations, Onboarding, Partnerships',
      'alexanderkline13@gmail.com': 'Platform Administrator • Operations, Partnerships',
      'deefactorial@gmail.com': 'Platform Administrator • Blockchain Engineer, AI Team',
      'doug.kukura@gmail.com': 'Platform Administrator • DeFi, Payments, Partnerships',
      'gunnar.blaze@gmail.com': 'Platform Administrator • Co-Founder',
      'f.tjeff79@gmail.com': 'Platform Administrator • Blockchain Advisor, Networking',
      'christinesavardmedia@gmail.com': 'Platform Administrator • Marketing, Outreach, Onboarding',
      'morganhirtle@gmail.com': 'Platform Administrator • Participant Support Services, EcoSystem',
      'srivastavaaryan005@gmail.com': 'Platform Administrator • Data Analyst',
      'admin@royaltri.com': 'Platform Administrator • Brand, Marketing, Publicity'
    };
    
    return roleMap[email] || 'Platform Administrator';
  }

  /**
   * Extract department from role description
   */
  private static extractDepartmentFromRole(email: string): string {
    const roleDescription = this.getPlatformAdminRoleDescription(email);
    const specialization = roleDescription.split('•')[1]?.trim();
    
    if (!specialization) return 'Leadership';
    
    // Map specializations to departments
    if (specialization.includes('Marketing') || specialization.includes('Brand') || specialization.includes('Publicity')) {
      return 'Marketing';
    }
    if (specialization.includes('Engineering') || specialization.includes('Product Design') || specialization.includes('Blockchain')) {
      return 'Engineering';
    }
    if (specialization.includes('Operations') || specialization.includes('Partnerships')) {
      return 'Operations';
    }
    if (specialization.includes('Co-Founder') || specialization.includes('Advisor')) {
      return 'Leadership';
    }
    if (specialization.includes('Data Analyst')) {
      return 'Analytics';
    }
    if (specialization.includes('Support Services') || specialization.includes('EcoSystem')) {
      return 'Support';
    }
    
    return 'General';
  }

  /**
   * Extract specialization from role description
   */
  private static extractSpecializationFromRole(email: string): string {
    const roleDescription = this.getPlatformAdminRoleDescription(email);
    return roleDescription.split('•')[1]?.trim() || '';
  }
}
