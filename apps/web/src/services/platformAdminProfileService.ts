/**
 * Platform Administrator Profile Service
 * Manages enhanced profile data for platform administrators including roles, specializations, and metadata
 */

import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
        
        // Professional Information
        department: adminProfile.department || '',
        specialization: adminProfile.specialization || '',
        jobTitle: adminProfile.jobTitle || '',
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
          weeklyReports: adminProfile.weeklyReports ?? true,
          systemAlerts: adminProfile.systemAlerts ?? true,
        },
        
        // Privacy Settings
        profileVisibility: userData.privacy?.profileVisibility || 'team',
        showContactInfo: adminProfile.showContactInfo ?? true,
        showExperience: adminProfile.showExperience ?? true,
        
        // Metadata
        profileComplete: userData.profileComplete || false,
        lastUpdated: userData.updated_at || userData.created_at || '',
        profilePicture: userData.profilePicture || '',
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
      const updateData: any = {
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
      const adminProfileUpdates: any = {};
      
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
      
      // Apply admin profile updates
      Object.keys(adminProfileUpdates).forEach(key => {
        updateData[`adminProfile.${key}`] = adminProfileUpdates[key];
      });
      
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
      
      // Check if profile is becoming complete
      const currentProfile = await this.getPlatformAdminProfile(userId);
      if (currentProfile) {
        const isComplete = this.checkProfileCompletion(currentProfile, updates);
        updateData.profileComplete = isComplete;
      }
      
      // Update the document
      await updateDoc(doc(db, 'users', userId), updateData);
      
      console.log('Platform admin profile updated successfully:', userId);
      return true;
      
    } catch (error) {
      console.error('Error updating platform admin profile:', error);
      return false;
    }
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
    ];
    
    // Check if all required fields are present and not empty
    return requiredFields.every(field => {
      const value = mergedProfile[field as keyof PlatformAdminProfile];
      return value && value.toString().trim().length > 0;
    });
  }
  
  /**
   * Get all platform administrators with their profiles
   */
  static async getAllPlatformAdminProfiles(): Promise<PlatformAdminProfile[]> {
    try {
      // This would typically use a query, but for now we'll need to implement
      // based on the existing user management logic
      console.log('Getting all platform admin profiles...');
      // Implementation would go here
      return [];
      
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
}
