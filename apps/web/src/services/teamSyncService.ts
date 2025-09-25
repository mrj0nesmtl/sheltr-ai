/**
 * Team Sync Service
 * Synchronizes Platform Administrator profiles with the public team page
 * Respects privacy settings and provides real-time updates
 */

import { PlatformAdminProfileService, type PlatformAdminProfile } from './platformAdminProfileService';

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
  
  // Contact info (respects privacy settings)
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  
  // Professional details (respects privacy settings)
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    year: number;
  }[];
  
  // Metadata
  joinDate: string;
  profileComplete: boolean;
  isFoundingMember: boolean;
  displayOrder?: number;
}

export class TeamSyncService {
  /**
   * Get all public team members for the team page
   * Only includes Platform Admins with 'public' visibility setting
   */
  static async getPublicTeamMembers(): Promise<PublicTeamMember[]> {
    try {
      console.log('🔄 Syncing public team members from Platform Admin profiles...');
      
      // Get all platform admin profiles (all public for QA stage)
      const publicProfiles = await PlatformAdminProfileService.getAllPlatformAdminProfiles(false);
      
      // Transform to public team member format
      const teamMembers: PublicTeamMember[] = publicProfiles.map(profile => 
        this.transformProfileToTeamMember(profile)
      );
      
      // Ensure Joel Yaffe (Super Admin) is included and prioritized
      const joelEmail = 'joel.yaffe@gmail.com';
      let hasJoel = teamMembers.some(member => member.email.toLowerCase() === joelEmail.toLowerCase());
      
      console.log('🔍 Joel lookup results:', {
        joelEmail,
        totalTeamMembers: teamMembers.length,
        hasJoel,
        teamMemberEmails: teamMembers.map(m => m.email),
        publicProfileEmails: publicProfiles.map(p => p.email)
      });
      
      // If Joel exists in the list but we need to update his info, remove him first
      if (hasJoel) {
        const joelIndex = teamMembers.findIndex(member => member.email.toLowerCase() === joelEmail.toLowerCase());
        if (joelIndex !== -1) {
          console.log('🔄 Found Joel in team list, updating his profile...');
          // Remove existing Joel entry so we can re-add him with proper CEO info
          teamMembers.splice(joelIndex, 1);
          hasJoel = false;
        }
      }
      
      if (!hasJoel) {
        console.log('🏆 Injecting Joel Yaffe (Super Admin) as team leader...');
        
        // Try to get Joel's actual profile data first
        let joelProfile = null;
        try {
          // Check if Joel has a profile in the system
          const allProfiles = await PlatformAdminProfileService.getAllPlatformAdminProfiles(false);
          joelProfile = allProfiles.find(p => p.email.toLowerCase() === joelEmail.toLowerCase());
        } catch {
          console.log('Could not load Joel\'s profile, using defaults');
        }
        
        const joelMember: PublicTeamMember = {
          id: joelEmail,
          name: joelProfile?.displayName || 'Joel Yaffe',
          displayName: joelProfile?.displayName || 'Joel Yaffe',
          email: joelEmail,
          jobTitle: joelProfile?.jobTitle || 'Chief Executive Officer & Founder',
          department: joelProfile?.department || 'Leadership', 
          specialization: joelProfile?.specialization || 'Visionary Leadership & Strategic Direction',
          bio: joelProfile?.bio || 'Founder and CEO of SHELTR-AI, pioneering innovative solutions to revolutionize homelessness services through cutting-edge technology and compassionate action.',
          profilePicture: joelProfile?.profilePicture || '', // Use actual profile picture if available
          expertise: joelProfile?.expertise || ['Strategic Leadership', 'Social Impact', 'Technology Innovation', 'Nonprofit Management', 'Systems Thinking'],
          yearsOfExperience: joelProfile?.yearsOfExperience || 25,
          joinDate: joelProfile?.joinDate || '2024-01-01',
          profileComplete: joelProfile?.profileComplete || true,
          isFoundingMember: true,
          displayOrder: -1, // Always first
          phone: joelProfile?.phone || '',
          linkedIn: joelProfile?.linkedIn || '',
          twitter: joelProfile?.twitter || '',
          website: joelProfile?.website || '',
          education: joelProfile?.education || [],
          certifications: joelProfile?.certifications || []
        };
        
        console.log('🖼️ Joel\'s profile picture:', joelProfile?.profilePicture ? 'Found' : 'Using initials fallback');
        console.log('📊 Joel\'s profile data:', {
          hasProfile: !!joelProfile,
          profileEmail: joelProfile?.email,
          jobTitle: joelProfile?.jobTitle || 'Using fallback',
          department: joelProfile?.department || 'Using fallback',
          specialization: joelProfile?.specialization || 'Using fallback', 
          bio: joelProfile?.bio ? `Custom: ${joelProfile.bio.substring(0, 50)}...` : 'Using fallback',
          location: joelProfile?.location || 'Using fallback',
          fullProfile: joelProfile
        });
        
        // Add Joel at the beginning
        teamMembers.unshift(joelMember);
      }
      
      // Sort by Super Admin custom order (displayOrder) if available, otherwise use hierarchy
      teamMembers.sort((a, b) => {
        // Joel Yaffe (Super Admin) ALWAYS first
        if (a.email.toLowerCase() === joelEmail.toLowerCase()) return -1;
        if (b.email.toLowerCase() === joelEmail.toLowerCase()) return 1;
        
        // Get corresponding profiles to access displayOrder
        const profileA = publicProfiles.find(p => p.email === a.email);
        const profileB = publicProfiles.find(p => p.email === b.email);
        
        // If both have displayOrder, use that (lower numbers first)
        if (profileA?.displayOrder !== undefined && profileB?.displayOrder !== undefined) {
          return profileA.displayOrder - profileB.displayOrder;
        }
        
        // If only one has displayOrder, prioritize it
        if (profileA?.displayOrder !== undefined && profileB?.displayOrder === undefined) {
          return -1;
        }
        if (profileA?.displayOrder === undefined && profileB?.displayOrder !== undefined) {
          return 1;
        }
        
        // Fallback to corporate hierarchy if no custom order
        const hierarchyOrder = this.getHierarchyOrder(a, b);
        if (hierarchyOrder !== 0) return hierarchyOrder;
        
        // Within same level, sort founding members first, then alphabetically
        if (a.isFoundingMember && !b.isFoundingMember) return -1;
        if (!a.isFoundingMember && b.isFoundingMember) return 1;
        
        return a.name.localeCompare(b.name);
      });
      
      console.log(`✅ Successfully synced ${teamMembers.length} public team members`);
      return teamMembers;
      
    } catch (error) {
      console.error('❌ Error syncing public team members:', error);
      return [];
    }
  }
  
  /**
   * Transform a Platform Admin profile to a public team member
   * Respects privacy settings for contact info and experience
   */
  private static transformProfileToTeamMember(profile: PlatformAdminProfile): PublicTeamMember {
    // Determine if this is a founding member based on join date or email
    const isFoundingMember = this.isFoundingMember(profile.email, profile.joinDate);
    
    const teamMember: PublicTeamMember = {
      id: profile.email, // Use email as unique identifier for public display
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      displayName: profile.displayName || `${profile.firstName} ${profile.lastName}`.trim(),
      email: profile.email, // Always include email for QA stage
      jobTitle: profile.jobTitle || 'Platform Administrator',
      department: profile.department || 'General',
      specialization: profile.specialization || '',
      bio: profile.bio || '',
      profilePicture: profile.profilePicture,
      expertise: profile.expertise || [],
      yearsOfExperience: profile.yearsOfExperience || 0,
      joinDate: profile.joinDate,
      profileComplete: profile.profileComplete,
      isFoundingMember,
      displayOrder: profile.displayOrder
    };
    
    // For QA stage: Always show contact information and experience
    teamMember.phone = profile.phone;
    teamMember.linkedIn = profile.linkedIn;
    teamMember.twitter = profile.twitter;
    teamMember.website = profile.website;
    teamMember.education = profile.education;
    teamMember.certifications = profile.certifications;
    
    return teamMember;
  }
  
  /**
   * Get corporate hierarchy order for sorting
   * Returns negative if a should come before b, positive if b should come before a, 0 if same level
   */
  private static getHierarchyOrder(a: PublicTeamMember, b: PublicTeamMember): number {
    const getHierarchyLevel = (member: PublicTeamMember): number => {
      const email = member.email.toLowerCase();
      const dept = member.department.toLowerCase();
      const specialization = member.specialization.toLowerCase();
      
      // 1. Co-Founders (highest priority)
      if (specialization.includes('co-founder') || email.includes('gunnar.blaze')) {
        return 1;
      }
      
      // 2. Leadership & Advisors
      if (dept === 'leadership' || specialization.includes('advisor') || specialization.includes('founder')) {
        return 2;
      }
      
      // 3. Engineering & Development
      if (dept === 'engineering' || specialization.includes('engineering') || 
          specialization.includes('product design') || specialization.includes('blockchain') ||
          specialization.includes('ai team')) {
        return 3;
      }
      
      // 4. Finance & Payments
      if (specialization.includes('defi') || specialization.includes('payments') || 
          dept === 'analytics' || specialization.includes('data analyst')) {
        return 4;
      }
      
      // 5. Operations & Partnerships
      if (dept === 'operations' || specialization.includes('operations') || 
          specialization.includes('partnerships')) {
        return 5;
      }
      
      // 6. Marketing & Public Relations
      if (dept === 'marketing' || specialization.includes('marketing') || 
          specialization.includes('brand') || specialization.includes('publicity') ||
          specialization.includes('public relations') || specialization.includes('outreach')) {
        return 6;
      }
      
      // 7. Support & Services
      if (dept === 'support' || specialization.includes('support services') || 
          specialization.includes('ecosystem')) {
        return 7;
      }
      
      // 8. General (lowest priority)
      return 8;
    };
    
    return getHierarchyLevel(a) - getHierarchyLevel(b);
  }

  /**
   * Determine if a team member is a founding member
   * Based on join date or specific email addresses
   */
  private static isFoundingMember(email: string, joinDate: string): boolean {
    // Founding member emails (core team who started the project)
    const foundingEmbers = [
      'joel.yaffe@gmail.com',
      'gunnar.blaze@gmail.com',
      'doug.kukura@gmail.com',
      'alaghetts@gmail.com', // Alex
      'zaffialaplante@gmail.com', // Zaffia
      'deefactorial@gmail.com', // Dominique
      'f.tjeff79@gmail.com' // Marc
    ];
    
    // Check if email is in founding members list
    if (foundingEmbers.includes(email.toLowerCase())) {
      return true;
    }
    
    // Check if join date is before a certain cutoff (e.g., before 2025-01-01)
    try {
      const joinDateTime = new Date(joinDate).getTime();
      const foundingCutoff = new Date('2025-01-01').getTime();
      return joinDateTime < foundingCutoff;
    } catch {
      return false;
    }
  }
  
  /**
   * Get team statistics for public display
   */
  static async getTeamStats(): Promise<{
    totalMembers: number;
    foundingMembers: number;
    departments: { name: string; count: number }[];
    totalExperience: number;
    averageExperience: number;
  }> {
    try {
      const teamMembers = await this.getPublicTeamMembers();
      
      // Calculate statistics
      const totalMembers = teamMembers.length;
      const foundingMembers = teamMembers.filter(member => member.isFoundingMember).length;
      const totalExperience = teamMembers.reduce((sum, member) => sum + member.yearsOfExperience, 0);
      const averageExperience = totalMembers > 0 ? Math.round(totalExperience / totalMembers) : 0;
      
      // Department breakdown
      const departmentCounts = teamMembers.reduce((acc, member) => {
        const dept = member.department || 'General';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const departments = Object.entries(departmentCounts)
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
  
  /**
   * Get team members by department for organized display
   */
  static async getTeamMembersByDepartment(): Promise<Record<string, PublicTeamMember[]>> {
    try {
      const teamMembers = await this.getPublicTeamMembers();
      
      // Group by department
      const byDepartment = teamMembers.reduce((acc, member) => {
        const dept = member.department || 'General';
        if (!acc[dept]) {
          acc[dept] = [];
        }
        acc[dept].push(member);
        return acc;
      }, {} as Record<string, PublicTeamMember[]>);
      
      // Sort members within each department by founding status, then name
      Object.keys(byDepartment).forEach(dept => {
        byDepartment[dept].sort((a, b) => {
          // Founding members first
          if (a.isFoundingMember && !b.isFoundingMember) return -1;
          if (!a.isFoundingMember && b.isFoundingMember) return 1;
          
          // Then alphabetically by name
          return a.name.localeCompare(b.name);
        });
      });
      
      return byDepartment;
      
    } catch (error) {
      console.error('Error grouping team members by department:', error);
      return {};
    }
  }
}
