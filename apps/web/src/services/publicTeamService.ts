/**
 * Public Team Service
 * Reads from the public team_members collection (world-readable)
 * No authentication required
 */

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PublicTeamMember {
  id: string;
  name: string;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  specialization: string;
  bio: string;
  profilePicture?: string;
  expertise: string[];
  yearsOfExperience: number;
  
  // Contact info
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  
  // Professional details
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  
  // Metadata
  role: string;
  joinDate: string;
  profileComplete: boolean;
  isFoundingMember: boolean;
  displayOrder?: number;
}

export class PublicTeamService {
  /**
   * Get all public team members from the team_members collection
   */
  static async getPublicTeamMembers(): Promise<PublicTeamMember[]> {
    try {
      console.log('🔄 Loading public team members...');
      
      const teamMembersRef = collection(db, 'team_members');
      const snapshot = await getDocs(teamMembersRef);
      
      const members: PublicTeamMember[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PublicTeamMember));
      
      // Sort: Super Admin first, then by role hierarchy, then alphabetically
      members.sort((a, b) => {
        // Super Admin always first
        if (a.role === 'super_admin') return -1;
        if (b.role === 'super_admin') return 1;
        
        // If display order exists, use it
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        
        // Founding members before others
        if (a.isFoundingMember && !b.isFoundingMember) return -1;
        if (!a.isFoundingMember && b.isFoundingMember) return 1;
        
        // Alphabetically by name
        return a.name.localeCompare(b.name);
      });
      
      console.log(`✅ Loaded ${members.length} public team members`);
      return members;
      
    } catch (error) {
      console.error('❌ Error loading public team members:', error);
      return [];
    }
  }
  
  /**
   * Get team statistics
   */
  static async getTeamStats() {
    try {
      const members = await this.getPublicTeamMembers();
      
      const totalMembers = members.length;
      const foundingMembers = members.filter(m => m.isFoundingMember).length;
      const totalExperience = members.reduce((sum, m) => sum + m.yearsOfExperience, 0);
      const averageExperience = totalMembers > 0 ? Math.round(totalExperience / totalMembers) : 0;
      
      // Department breakdown
      const deptCounts: Record<string, number> = {};
      members.forEach(member => {
        const dept = member.department || 'General';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });
      
      const departments = Object.entries(deptCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      
      return {
        totalMembers,
        foundingMembers,
        departments,
        totalExperience,
        averageExperience
      };
      
    } catch (error) {
      console.error('Error calculating team stats:', error);
      return {
        totalMembers: 0,
        foundingMembers: 0,
        departments: [],
        totalExperience: 0,
        averageExperience: 0
      };
    }
  }
}

