import { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ParticipantSocialMedia {
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  x?: string; // Twitter/X
  website?: string;
}

export interface ParticipantGoal {
  id: string | number;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface ParticipantProfile {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  pronouns?: string;
  preferredLanguage?: string;
  
  // Profile Details
  profilePicture?: string;
  bio?: string;
  
  // Social Media (optional for participants)
  socialMedia?: ParticipantSocialMedia;
  
  // Shelter Info
  shelter_id?: string;
  tenant_id?: string;
  
  // Emergency Contacts
  emergencyContact?: EmergencyContact;
  emergencyContacts?: EmergencyContact[];
  
  // Goals
  goals?: ParticipantGoal[];
  
  // Preferences
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      inApp?: boolean;
    };
    communication?: {
      preferredMethod?: 'email' | 'sms' | 'in-app';
      language?: string;
      timezone?: string;
    };
    privacy?: {
      shareProgress?: boolean;
      allowPhotos?: boolean;
      publicProfile?: boolean;
      showRealName?: boolean;
      showDonationAmounts?: boolean;
      shareGoals?: boolean;
    };
  };
  
  // Participant Specific Data
  participantProfile?: {
    participantId?: string;
    checkInDate?: string;
    bedAssignment?: string;
    caseWorker?: string;
    organizationId?: string;
    servicesEnrolled?: string[];
    goalProgress?: number;
  };
  
  // Financial Info
  housing_fund_balance?: number;
  total_received?: number;
  donation_count?: number;
  
  // Metadata
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  created_at?: Timestamp | Date;
  updated_at?: Timestamp | Date;
}

export class ParticipantProfileService {
  /**
   * Get participant profile by user ID
   */
  static async getParticipantProfile(userId: string): Promise<ParticipantProfile | null> {
    try {
      console.log(`🔍 Fetching participant profile for: ${userId}`);
      
      const profileRef = doc(db, 'users', userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const data = profileSnap.data() as ParticipantProfile;
        console.log('✅ Participant profile loaded successfully');
        return data;
      }
      
      console.log('⚠️ No participant profile found');
      return null;
      
    } catch (error) {
      console.error('❌ Error fetching participant profile:', error);
      return null;
    }
  }

  /**
   * Create or update participant profile
   */
  static async saveParticipantProfile(
    userId: string, 
    profileData: Partial<ParticipantProfile>
  ): Promise<boolean> {
    try {
      console.log('💾 Saving participant profile...');
      
      const profileRef = doc(db, 'users', userId);
      
      // Check if profile exists
      const profileSnap = await getDoc(profileRef);
      const exists = profileSnap.exists();
      
      const updateData: Partial<ParticipantProfile> = {
        ...profileData,
        updated_at: Timestamp.now()
      };
      
      // Add created_at only for new profiles
      if (!exists) {
        updateData.created_at = Timestamp.now();
      }
      
      if (exists) {
        await updateDoc(profileRef, updateData);
      } else {
        await setDoc(profileRef, updateData);
      }
      
      console.log('✅ Participant profile saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error saving participant profile:', error);
      throw error;
    }
  }

  /**
   * Update social media links
   */
  static async updateSocialMedia(
    userId: string,
    socialMedia: ParticipantSocialMedia
  ): Promise<boolean> {
    try {
      console.log('💾 Updating social media links...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        socialMedia: socialMedia,
        updated_at: Timestamp.now()
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
        updated_at: Timestamp.now()
      });
      
      console.log('✅ Bio updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating bio:', error);
      throw error;
    }
  }

  /**
   * Update emergency contacts
   */
  static async updateEmergencyContacts(
    userId: string,
    contacts: EmergencyContact[]
  ): Promise<boolean> {
    try {
      console.log('💾 Updating emergency contacts...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        emergencyContacts: contacts,
        updated_at: Timestamp.now()
      });
      
      console.log('✅ Emergency contacts updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Update goals
   */
  static async updateGoals(
    userId: string,
    goals: ParticipantGoal[]
  ): Promise<boolean> {
    try {
      console.log('💾 Updating goals...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        goals: goals,
        updated_at: Timestamp.now()
      });
      
      console.log('✅ Goals updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating goals:', error);
      throw error;
    }
  }

  /**
   * Update preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: ParticipantProfile['preferences']
  ): Promise<boolean> {
    try {
      console.log('💾 Updating preferences...');
      
      const profileRef = doc(db, 'users', userId);
      
      await updateDoc(profileRef, {
        preferences: preferences,
        updated_at: Timestamp.now()
      });
      
      console.log('✅ Preferences updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating preferences:', error);
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
        updated_at: Timestamp.now()
      });
      
      console.log('✅ Profile picture updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating profile picture:', error);
      throw error;
    }
  }

  /**
   * Get participant statistics
   */
  static async getParticipantStats(userId: string): Promise<{
    totalReceived: number;
    donationCount: number;
    housingFundBalance: number;
    goalProgress: number;
  } | null> {
    try {
      const profile = await this.getParticipantProfile(userId);
      
      if (!profile) return null;
      
      return {
        totalReceived: profile.total_received || 0,
        donationCount: profile.donation_count || 0,
        housingFundBalance: profile.housing_fund_balance || 0,
        goalProgress: profile.participantProfile?.goalProgress || 0
      };
      
    } catch (error) {
      console.error('❌ Error fetching participant stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const participantProfileService = ParticipantProfileService;

