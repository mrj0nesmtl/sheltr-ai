import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { goalsService, type Goal } from '@/services/goalsService';

export interface PublicProfilePrivacySettings {
  publicProfile: boolean;
  showRealName: boolean;
  showDonationAmounts: boolean;
  shareGoals: boolean;
}

export interface PublicGoalData {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  status: string;
  targetDate: string;
}

export interface PublicGoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
}

class PublicProfileService {
  
  /**
   * Get participant's privacy settings from their profile
   */
  async getParticipantPrivacySettings(participantId: string): Promise<PublicProfilePrivacySettings> {
    try {
      // Check for profile in participant_profiles collection
      const profileRef = doc(db, 'participant_profiles', participantId);
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        const privacy = profileData.preferences?.privacy || {};
        
        return {
          publicProfile: privacy.publicProfile ?? true,
          showRealName: privacy.showRealName ?? true,
          showDonationAmounts: privacy.showDonationAmounts ?? false,
          shareGoals: privacy.shareGoals ?? true
        };
      }
      
      // Default privacy settings if profile not found
      return {
        publicProfile: true,
        showRealName: true,
        showDonationAmounts: false,
        shareGoals: true
      };
      
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      
      // Default to conservative privacy settings on error
      return {
        publicProfile: true,
        showRealName: true,
        showDonationAmounts: false,
        shareGoals: false
      };
    }
  }

  /**
   * Get participant's goals for public display (respecting privacy settings)
   */
  async getPublicGoals(participantId: string): Promise<{ goals: PublicGoalData[]; stats: PublicGoalStats } | null> {
    try {
      // First check if goals sharing is enabled
      const privacySettings = await this.getParticipantPrivacySettings(participantId);
      
      if (!privacySettings.shareGoals) {
        console.log(`🔒 Goals sharing disabled for participant: ${participantId}`);
        return null;
      }

      // Fetch real goals from goalsService
      const realGoals = await goalsService.getParticipantGoals(participantId);
      
      // Convert to public goal format (filter sensitive information)
      const publicGoals: PublicGoalData[] = realGoals
        .filter(goal => goal.status !== 'deleted') // Hide deleted goals
        .map(goal => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          category: goal.category,
          progress: goal.progress,
          status: goal.status,
          targetDate: goal.targetDate
        }));

      // Calculate statistics
      const stats: PublicGoalStats = {
        totalGoals: publicGoals.length,
        activeGoals: publicGoals.filter(g => g.status === 'active').length,
        completedGoals: publicGoals.filter(g => g.status === 'completed').length,
        averageProgress: publicGoals.length > 0 
          ? Math.round(publicGoals.reduce((sum, g) => sum + g.progress, 0) / publicGoals.length)
          : 0
      };

      console.log(`✅ Retrieved ${publicGoals.length} public goals for ${participantId}`);
      return { goals: publicGoals, stats };
      
    } catch (error) {
      console.error('Error fetching public goals:', error);
      return null;
    }
  }

  /**
   * Get fallback demo goals for participants without real goals
   */
  getDemoGoals(participantId: string): { goals: PublicGoalData[]; stats: PublicGoalStats } {
    const demoGoals: PublicGoalData[] = [
      {
        id: 'demo-housing',
        title: 'Find Stable Housing',
        description: 'Secure permanent housing within the next 6 months',
        category: 'Housing',
        progress: 45,
        status: 'active',
        targetDate: '2024-07-01'
      },
      {
        id: 'demo-employment',
        title: 'Complete Job Training',
        description: 'Finish culinary arts certification program',
        category: 'Employment',
        progress: 75,
        status: 'active',
        targetDate: '2024-04-15'
      },
      {
        id: 'demo-financial',
        title: 'Build Emergency Fund',
        description: 'Save $1,000 for emergencies and housing deposit',
        category: 'Financial',
        progress: 30,
        status: 'active',
        targetDate: '2024-06-01'
      }
    ];

    const stats: PublicGoalStats = {
      totalGoals: demoGoals.length,
      activeGoals: demoGoals.filter(g => g.status === 'active').length,
      completedGoals: demoGoals.filter(g => g.status === 'completed').length,
      averageProgress: Math.round(demoGoals.reduce((sum, g) => sum + g.progress, 0) / demoGoals.length)
    };

    return { goals: demoGoals, stats };
  }

  /**
   * Check if participant profile should be publicly visible
   */
  async isProfilePublic(participantId: string): Promise<boolean> {
    try {
      const privacySettings = await this.getParticipantPrivacySettings(participantId);
      return privacySettings.publicProfile;
    } catch (error) {
      console.error('Error checking profile visibility:', error);
      return true; // Default to public on error
    }
  }
}

export const publicProfileService = new PublicProfileService();
