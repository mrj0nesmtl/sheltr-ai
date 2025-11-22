/**
 * Public Team Service
 * Reads from the public team_members collection (world-readable)
 * No authentication required
 */

import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
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
  instagram?: string;
  twitter?: string;
  website?: string;
  substack?: string;
  
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
  showOnTeamPage?: boolean; // Control visibility on public team page (defaults to true)
  slug?: string; // URL slug for bio page (e.g., "joel-yaffe")
}

export class PublicTeamService {
  /**
   * Get all public team members from the team_members collection
   * Also fetches slug from users collection for bio page links
   */
  static async getPublicTeamMembers(): Promise<PublicTeamMember[]> {
    try {
      console.log('🔄 Loading public team members...');
      
      const teamMembersRef = collection(db, 'team_members');
      const snapshot = await getDocs(teamMembersRef);
      
      const members: PublicTeamMember[] = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PublicTeamMember))
        .filter(member => member.showOnTeamPage !== false); // Only show members where showOnTeamPage is not explicitly false
      
      // Fetch slug and profile picture from users collection (source of truth)
      // Note: This will only work for authenticated users due to Firestore rules
      // For public access, slug should also be stored in team_members collection
      const membersWithUserData = await Promise.all(
        members.map(async (member) => {
          try {
            // Try to get the user document with the same ID
            // This may fail for unauthenticated users due to Firestore security rules
            const userRef = doc(db, 'users', member.id);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data();
              
              // Create updated member object
              const updatedMember = { ...member };
              
              // Always use profile picture from users collection (source of truth)
              if (userData.profilePicture) {
                updatedMember.profilePicture = userData.profilePicture;
              }
              
              // Add slug if it exists and bio is set to show on team page
              if (userData.slug && userData.bio?.showOnTeamPage) {
                updatedMember.slug = userData.slug;
              }
              
              return updatedMember;
            }
          } catch (error) {
            // Expected for unauthenticated users - slug should be in team_members collection
            console.log(`Note: Could not fetch user data for member ${member.name} (likely unauthenticated)`);
          }
          
          // Return member as-is (slug should already be in team_members if public)
          return member;
        })
      );
      
      // Sort: Super Admin first, then by role hierarchy, then alphabetically
      membersWithUserData.sort((a, b) => {
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
      
      console.log(`✅ Loaded ${membersWithUserData.length} public team members (${membersWithUserData.filter(m => m.slug).length} with bio pages)`);
      return membersWithUserData;
      
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

