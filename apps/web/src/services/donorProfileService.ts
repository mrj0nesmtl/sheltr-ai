import { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DonorSocialMedia {
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  x?: string; // Twitter/X
  website?: string;
}

export interface DonorProfile {
  // Basic Info
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  phone?: string;
  address?: string;
  
  // Profile Details
  profilePicture?: string;
  bio?: string;
  occupation?: string;
  company?: string;
  
  // Social Media
  socialMedia?: DonorSocialMedia;
  
  // Donation Preferences
  preferredShelter?: string;
  defaultDonationAmount?: number;
  anonymousDonations?: boolean;
  recurringDonation?: boolean;
  donationFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  
  // Notifications
  notifications?: {
    donationConfirmations?: boolean;
    impactUpdates?: boolean;
    shelterNews?: boolean;
    monthlyReports?: boolean;
    eventInvitations?: boolean;
  };
  
  // Privacy
  privacy?: {
    showNamePublicly?: boolean;
    showDonationAmounts?: boolean;
    allowContactFromShelters?: boolean;
  };
  
  // Metadata
  totalDonated?: number;
  donationCount?: number;
  memberSince?: Timestamp | Date;
  lastDonation?: Timestamp | Date;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export class DonorProfileService {
  /**
   * Get donor profile by user ID
   */
  static async getDonorProfile(userId: string): Promise<DonorProfile | null> {
    try {
      console.log(`🔍 Fetching donor profile for: ${userId}`);
      
      const profileRef = doc(db, 'users', userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const data = profileSnap.data() as DonorProfile;
        console.log('✅ Donor profile loaded successfully');
        return data;
      }
      
      console.log('⚠️ No donor profile found');
      return null;
      
    } catch (error) {
      console.error('❌ Error fetching donor profile:', error);
      return null;
    }
  }

  /**
   * Create or update donor profile
   */
  static async saveDonorProfile(
    userId: string, 
    profileData: Partial<DonorProfile>
  ): Promise<boolean> {
    try {
      console.log('💾 Saving donor profile...');
      
      const profileRef = doc(db, 'users', userId);
      
      // Check if profile exists
      const profileSnap = await getDoc(profileRef);
      const exists = profileSnap.exists();
      
      const updateData: Partial<DonorProfile> = {
        ...profileData,
        updatedAt: Timestamp.now()
      };
      
      // Add createdAt and memberSince only for new profiles
      if (!exists) {
        updateData.createdAt = Timestamp.now();
        updateData.memberSince = Timestamp.now();
        updateData.totalDonated = 0;
        updateData.donationCount = 0;
      }
      
      if (exists) {
        await updateDoc(profileRef, updateData);
      } else {
        await setDoc(profileRef, updateData);
      }
      
      console.log('✅ Donor profile saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error saving donor profile:', error);
      throw error;
    }
  }

  /**
   * Update social media links
   */
  static async updateSocialMedia(
    userId: string,
    socialMedia: DonorSocialMedia
  ): Promise<boolean> {
    try {
      console.log('💾 Updating social media links...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        socialMedia: socialMedia,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Social media links updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating social media:', error);
      throw error;
    }
  }

  /**
   * Update bio
   */
  static async updateBio(
    userId: string,
    bio: string
  ): Promise<boolean> {
    try {
      console.log('💾 Updating bio...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        bio: bio,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Bio updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating bio:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(
    userId: string,
    notifications: DonorProfile['notifications']
  ): Promise<boolean> {
    try {
      console.log('💾 Updating notification preferences...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        notifications: notifications,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Notification preferences updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(
    userId: string,
    privacy: DonorProfile['privacy']
  ): Promise<boolean> {
    try {
      console.log('💾 Updating privacy settings...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        privacy: privacy,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Privacy settings updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating privacy settings:', error);
      throw error;
    }
  }

  /**
   * Update donation preferences
   */
  static async updateDonationPreferences(
    userId: string,
    preferences: {
      preferredShelter?: string;
      defaultDonationAmount?: number;
      anonymousDonations?: boolean;
      recurringDonation?: boolean;
      donationFrequency?: DonorProfile['donationFrequency'];
    }
  ): Promise<boolean> {
    try {
      console.log('💾 Updating donation preferences...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        ...preferences,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Donation preferences updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating donation preferences:', error);
      throw error;
    }
  }

  /**
   * Update profile picture URL
   */
  static async updateProfilePicture(
    userId: string,
    profilePictureUrl: string
  ): Promise<boolean> {
    try {
      console.log('💾 Updating profile picture...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        profilePicture: profilePictureUrl,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Profile picture updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating profile picture:', error);
      throw error;
    }
  }

  /**
   * Get donation statistics
   */
  static async getDonationStats(userId: string): Promise<{
    totalDonated: number;
    donationCount: number;
    lastDonation?: Date;
    memberSince?: Date;
  } | null> {
    try {
      const profile = await this.getDonorProfile(userId);
      
      if (!profile) return null;
      
      return {
        totalDonated: profile.totalDonated || 0,
        donationCount: profile.donationCount || 0,
        lastDonation: profile.lastDonation 
          ? (profile.lastDonation as Timestamp).toDate() 
          : undefined,
        memberSince: profile.memberSince 
          ? (profile.memberSince as Timestamp).toDate() 
          : undefined
      };
      
    } catch (error) {
      console.error('❌ Error fetching donation stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const donorProfileService = DonorProfileService;

