/**
 * Goals Management Service for SHELTR-AI
 * Handles participant goal creation, tracking, and progress updates
 */

import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Goal {
  id: string;
  participantId: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  createdDate: string;
  progress: number;
  status: GoalStatus;
  milestones: GoalMilestone[];
  priority: GoalPriority;
  notes?: string;
  assignedCaseWorker?: string;
  relatedServices?: string[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

export type GoalCategory = 
  | 'Housing' 
  | 'Employment' 
  | 'Financial' 
  | 'Health' 
  | 'Education' 
  | 'Personal' 
  | 'Social' 
  | 'Legal';

export type GoalStatus = 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled' 
  | 'overdue';

export type GoalPriority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

export interface GoalTemplate {
  category: GoalCategory;
  title: string;
  description: string;
  suggestedTimeframe: number; // days
  defaultMilestones: Omit<GoalMilestone, 'id' | 'completed' | 'completedDate'>[];
}

class GoalsService {
  
  /**
   * Create a new goal for a participant
   */
  async createGoal(participantId: string, goalData: Omit<Goal, 'id' | 'participantId' | 'createdDate' | 'milestones'>): Promise<string> {
    try {
      const goalId = this.generateGoalId();
      const goal: Goal = {
        id: goalId,
        participantId,
        createdDate: new Date().toISOString(),
        milestones: [],
        ...goalData
      };

      await setDoc(doc(db, 'participant_goals', goalId), goal);
      console.log(`✅ Created goal: ${goal.title} for participant: ${participantId}`);
      return goalId;
    } catch (error) {
      console.error('❌ Error creating goal:', error);
      throw error;
    }
  }

  /**
   * Get all goals for a participant
   */
  async getParticipantGoals(participantId: string): Promise<Goal[]> {
    try {
      const goalsQuery = query(
        collection(db, 'participant_goals'),
        where('participantId', '==', participantId),
        orderBy('createdDate', 'desc')
      );

      const querySnapshot = await getDocs(goalsQuery);
      const goals: Goal[] = [];

      querySnapshot.forEach((doc) => {
        goals.push(doc.data() as Goal);
      });

      console.log(`📋 Found ${goals.length} goals for participant: ${participantId}`);
      return goals;
    } catch (error) {
      console.error('❌ Error fetching participant goals:', error);
      // Return empty array instead of throwing to gracefully handle missing data
      return [];
    }
  }

  /**
   * Update goal progress and status
   */
  async updateGoalProgress(goalId: string, progress: number, status?: GoalStatus, notes?: string): Promise<void> {
    try {
      const updateData: any = {
        progress,
        updated_at: new Date().toISOString()
      };

      if (status) {
        updateData.status = status;
        if (status === 'completed') {
          updateData.completedDate = new Date().toISOString();
        }
      }

      if (notes) {
        updateData.notes = notes;
      }

      await updateDoc(doc(db, 'participant_goals', goalId), updateData);
      console.log(`📈 Updated goal progress: ${goalId} to ${progress}%`);
    } catch (error) {
      console.error('❌ Error updating goal progress:', error);
      throw error;
    }
  }

  /**
   * Add a milestone to a goal
   */
  async addMilestone(goalId: string, milestone: Omit<GoalMilestone, 'id'>): Promise<void> {
    try {
      const goalDoc = await getDoc(doc(db, 'participant_goals', goalId));
      if (!goalDoc.exists()) {
        throw new Error('Goal not found');
      }

      const goal = goalDoc.data() as Goal;
      const newMilestone: GoalMilestone = {
        id: this.generateMilestoneId(),
        ...milestone
      };

      const updatedMilestones = [...(goal.milestones || []), newMilestone];

      await updateDoc(doc(db, 'participant_goals', goalId), {
        milestones: updatedMilestones,
        updated_at: new Date().toISOString()
      });

      console.log(`🎯 Added milestone to goal: ${goalId}`);
    } catch (error) {
      console.error('❌ Error adding milestone:', error);
      throw error;
    }
  }

  /**
   * Complete a milestone
   */
  async completeMilestone(goalId: string, milestoneId: string): Promise<void> {
    try {
      const goalDoc = await getDoc(doc(db, 'participant_goals', goalId));
      if (!goalDoc.exists()) {
        throw new Error('Goal not found');
      }

      const goal = goalDoc.data() as Goal;
      const updatedMilestones = goal.milestones.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: true, completedDate: new Date().toISOString() }
          : milestone
      );

      // Calculate new progress based on completed milestones
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const totalCount = updatedMilestones.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : goal.progress;

      await updateDoc(doc(db, 'participant_goals', goalId), {
        milestones: updatedMilestones,
        progress: newProgress,
        updated_at: new Date().toISOString()
      });

      console.log(`✅ Completed milestone: ${milestoneId} for goal: ${goalId}`);
    } catch (error) {
      console.error('❌ Error completing milestone:', error);
      throw error;
    }
  }

  /**
   * Delete a goal
   */
  async deleteGoal(goalId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'participant_goals', goalId));
      console.log(`🗑️ Deleted goal: ${goalId}`);
    } catch (error) {
      console.error('❌ Error deleting goal:', error);
      throw error;
    }
  }

  /**
   * Get goal suggestions based on participant profile
   */
  getGoalTemplates(): GoalTemplate[] {
    return [
      {
        category: 'Housing',
        title: 'Find Stable Housing',
        description: 'Secure permanent housing within the next 6 months',
        suggestedTimeframe: 180,
        defaultMilestones: [
          { title: 'Complete housing application', description: 'Apply for housing assistance programs', targetDate: '' },
          { title: 'Save for security deposit', description: 'Accumulate first month rent + deposit', targetDate: '' },
          { title: 'View potential apartments', description: 'Schedule and attend apartment viewings', targetDate: '' },
          { title: 'Sign lease agreement', description: 'Complete rental application and lease signing', targetDate: '' }
        ]
      },
      {
        category: 'Employment',
        title: 'Secure Stable Employment',
        description: 'Find and maintain steady employment',
        suggestedTimeframe: 90,
        defaultMilestones: [
          { title: 'Update resume', description: 'Create or update professional resume', targetDate: '' },
          { title: 'Complete job training', description: 'Finish relevant skills training program', targetDate: '' },
          { title: 'Apply for jobs', description: 'Submit applications to target employers', targetDate: '' },
          { title: 'Complete job interviews', description: 'Attend scheduled interviews', targetDate: '' }
        ]
      },
      {
        category: 'Financial',
        title: 'Build Financial Stability',
        description: 'Establish emergency savings and improve financial literacy',
        suggestedTimeframe: 120,
        defaultMilestones: [
          { title: 'Open bank account', description: 'Establish banking relationship', targetDate: '' },
          { title: 'Create budget plan', description: 'Develop monthly budget and spending plan', targetDate: '' },
          { title: 'Save emergency fund', description: 'Accumulate $500 emergency savings', targetDate: '' },
          { title: 'Improve credit score', description: 'Work on credit repair and building', targetDate: '' }
        ]
      },
      {
        category: 'Health',
        title: 'Improve Physical Health',
        description: 'Address health needs and establish regular healthcare',
        suggestedTimeframe: 90,
        defaultMilestones: [
          { title: 'Complete health assessment', description: 'Get comprehensive medical evaluation', targetDate: '' },
          { title: 'Find primary care doctor', description: 'Establish ongoing healthcare relationship', targetDate: '' },
          { title: 'Address immediate health needs', description: 'Treat urgent health concerns', targetDate: '' },
          { title: 'Develop health maintenance plan', description: 'Create routine for ongoing health', targetDate: '' }
        ]
      }
    ];
  }

  /**
   * Generate unique goal ID
   */
  private generateGoalId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique milestone ID
   */
  private generateMilestoneId(): string {
    return `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get goal statistics for a participant
   */
  async getGoalStatistics(participantId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageProgress: number;
    overdueGoals: number;
  }> {
    try {
      const goals = await this.getParticipantGoals(participantId);
      
      const stats = {
        totalGoals: goals.length,
        activeGoals: goals.filter(g => g.status === 'active').length,
        completedGoals: goals.filter(g => g.status === 'completed').length,
        averageProgress: goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0,
        overdueGoals: goals.filter(g => g.status === 'overdue' || (g.status === 'active' && new Date(g.targetDate) < new Date())).length
      };

      return stats;
    } catch (error) {
      console.error('❌ Error calculating goal statistics:', error);
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        averageProgress: 0,
        overdueGoals: 0
      };
    }
  }
}

export const goalsService = new GoalsService();
