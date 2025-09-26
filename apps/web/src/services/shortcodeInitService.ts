/**
 * Shortcode Initialization Service
 * Ensures all admin users have shortcodes for messaging
 */

import { 
  collection, 
  getDocs, 
  query, 
  where,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MessageService } from '@/services/messageService';

export class ShortcodeInitService {
  
  /**
   * Initialize shortcodes for all admin users who don't have them
   */
  static async initializeAllAdminShortcodes(): Promise<{
    success: boolean;
    initialized: number;
    errors: string[];
  }> {
    try {
      console.log('🎯 Starting admin shortcode initialization...');
      
      let initialized = 0;
      const errors: string[] = [];
      
      // Get all admin users (super_admin, platform_admin, shelter_admin)
      const adminRoles = ['super_admin', 'platform_admin', 'admin', 'shelter_admin'];
      
      for (const role of adminRoles) {
        try {
          const usersQuery = query(
            collection(db, 'users'),
            where('role', '==', role)
          );
          
          const usersSnapshot = await getDocs(usersQuery);
          
          for (const userDoc of usersSnapshot.docs) {
            try {
              const userData = userDoc.data();
              const userId = userDoc.id;
              
              // Check if user already has a shortcode
              const existingShortcode = await MessageService.getShortcodeByUserId(userId);
              
              if (!existingShortcode) {
                // Initialize shortcode for this user
                const success = await MessageService.initializeUserShortcode(
                  userId,
                  userData.email || '',
                  userData.displayName || userData.firstName || userData.email?.split('@')[0] || 'User',
                  role === 'admin' ? 'shelter_admin' : role as 'super_admin' | 'platform_admin' | 'shelter_admin'
                );
                
                if (success) {
                  initialized++;
                  console.log(`✅ Initialized shortcode for ${userData.email}`);
                } else {
                  errors.push(`Failed to initialize shortcode for ${userData.email}`);
                }
              } else {
                console.log(`✅ Shortcode already exists for ${userData.email}: @${existingShortcode.shortcode}`);
              }
              
            } catch (userError) {
              console.error('❌ Error processing user:', userError);
              errors.push(`Error processing user ${userDoc.id}: ${userError}`);
            }
          }
          
        } catch (roleError) {
          console.error(`❌ Error querying role ${role}:`, roleError);
          errors.push(`Error querying role ${role}: ${roleError}`);
        }
      }
      
      console.log(`✅ Shortcode initialization complete: ${initialized} users initialized`);
      
      return {
        success: true,
        initialized,
        errors
      };
      
    } catch (error) {
      console.error('❌ Error in shortcode initialization:', error);
      return {
        success: false,
        initialized: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Get shortcode statistics
   */
  static async getShortcodeStats(): Promise<{
    totalShortcodes: number;
    activeShortcodes: number;
    shortcodesByRole: Record<string, number>;
  }> {
    try {
      const shortcodesQuery = query(collection(db, 'user_shortcodes'));
      const shortcodesSnapshot = await getDocs(shortcodesQuery);
      
      let totalShortcodes = 0;
      let activeShortcodes = 0;
      const shortcodesByRole: Record<string, number> = {};
      
      shortcodesSnapshot.forEach((doc) => {
        const data = doc.data();
        totalShortcodes++;
        
        if (data.isActive) {
          activeShortcodes++;
        }
        
        const role = data.role || 'unknown';
        shortcodesByRole[role] = (shortcodesByRole[role] || 0) + 1;
      });
      
      return {
        totalShortcodes,
        activeShortcodes,
        shortcodesByRole
      };
      
    } catch (error) {
      console.error('❌ Error getting shortcode stats:', error);
      return {
        totalShortcodes: 0,
        activeShortcodes: 0,
        shortcodesByRole: {}
      };
    }
  }
  
  /**
   * Verify shortcode system integrity
   */
  static async verifyShortcodeIntegrity(): Promise<{
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const issues: string[] = [];
      const recommendations: string[] = [];
      
      // Check for duplicate shortcodes
      const shortcodesQuery = query(collection(db, 'user_shortcodes'));
      const shortcodesSnapshot = await getDocs(shortcodesQuery);
      
      const shortcodeCounts: Record<string, number> = {};
      const emailCounts: Record<string, number> = {};
      
      shortcodesSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Count shortcode occurrences
        const shortcode = data.shortcode;
        shortcodeCounts[shortcode] = (shortcodeCounts[shortcode] || 0) + 1;
        
        // Count email occurrences
        const email = data.email;
        emailCounts[email] = (emailCounts[email] || 0) + 1;
      });
      
      // Check for duplicates
      Object.entries(shortcodeCounts).forEach(([shortcode, count]) => {
        if (count > 1) {
          issues.push(`Duplicate shortcode detected: @${shortcode} (${count} occurrences)`);
          recommendations.push(`Resolve duplicate shortcode @${shortcode} by updating conflicting entries`);
        }
      });
      
      Object.entries(emailCounts).forEach(([email, count]) => {
        if (count > 1) {
          issues.push(`Duplicate email in shortcodes: ${email} (${count} occurrences)`);
          recommendations.push(`Resolve duplicate email ${email} in shortcode records`);
        }
      });
      
      // Check for admin users without shortcodes
      const adminRoles = ['super_admin', 'platform_admin', 'admin', 'shelter_admin'];
      
      for (const role of adminRoles) {
        const usersQuery = query(
          collection(db, 'users'),
          where('role', '==', role)
        );
        
        const usersSnapshot = await getDocs(usersQuery);
        
        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          const existingShortcode = await MessageService.getShortcodeByUserId(userId);
          
          if (!existingShortcode) {
            issues.push(`Admin user missing shortcode: ${userData.email} (${role})`);
            recommendations.push(`Initialize shortcode for ${userData.email}`);
          }
        }
      }
      
      const isHealthy = issues.length === 0;
      
      return {
        isHealthy,
        issues,
        recommendations
      };
      
    } catch (error) {
      console.error('❌ Error verifying shortcode integrity:', error);
      return {
        isHealthy: false,
        issues: ['Failed to verify shortcode system integrity'],
        recommendations: ['Check database connection and permissions']
      };
    }
  }
}
