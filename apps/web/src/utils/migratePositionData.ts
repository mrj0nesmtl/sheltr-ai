/**
 * Migration Script: Sync Hardcoded Position Data to Database
 * 
 * This script takes the hardcoded platform admin position descriptions from
 * the user management directory and injects them into the actual user database
 * records so all profile systems are synchronized.
 */

import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Hardcoded position descriptions from user management directory
const PLATFORM_ADMIN_POSITIONS: { [key: string]: string } = {
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

// Parse position data into structured format
function parsePositionData(positionString: string) {
  const parts = positionString.split(' • ');
  const jobTitle = parts[0] || 'Platform Administrator';
  const specialization = parts[1] || '';
  
  // Extract department from specialization
  let department = 'Operations'; // default
  if (specialization.toLowerCase().includes('engineering') || 
      specialization.toLowerCase().includes('product design') ||
      specialization.toLowerCase().includes('blockchain')) {
    department = 'Engineering';
  } else if (specialization.toLowerCase().includes('marketing') || 
             specialization.toLowerCase().includes('brand') ||
             specialization.toLowerCase().includes('publicity')) {
    department = 'Marketing';
  } else if (specialization.toLowerCase().includes('finance') ||
             specialization.toLowerCase().includes('defi') ||
             specialization.toLowerCase().includes('payments')) {
    department = 'DeFi & Payments';
  } else if (specialization.toLowerCase().includes('co-founder') ||
             specialization.toLowerCase().includes('founder')) {
    department = 'Leadership';
  }
  
  return {
    jobTitle,
    department,
    specialization,
    fullPosition: positionString
  };
}

export class PositionMigrationService {
  /**
   * Migrate hardcoded position data to user database records
   */
  static async migratePositionData(): Promise<void> {
    try {
      console.log('🚀 Starting position data migration...');
      
      const results = {
        updated: [] as string[],
        notFound: [] as string[],
        errors: [] as string[]
      };
      
      for (const [email, positionString] of Object.entries(PLATFORM_ADMIN_POSITIONS)) {
        try {
          console.log(`🔄 Processing ${email}...`);
          
          // Find user by email
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            console.log(`❌ User not found: ${email}`);
            results.notFound.push(email);
            continue;
          }
          
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          // Parse position data
          const positionData = parsePositionData(positionString);
          
          // Update user document with structured position data
          const updateData = {
            // Update adminProfile nested object
            adminProfile: {
              ...userData.adminProfile,
              jobTitle: positionData.jobTitle,
              department: positionData.department,
              specialization: positionData.specialization,
              profileComplete: true,
              profileVisibility: 'public',
              displayOrder: userData.adminProfile?.displayOrder || 999,
              lastUpdated: new Date(),
              updatedBy: 'migration-script'
            },
            
            // Update root level fields for consistency
            role: userData.role || 'platform_admin',
            updated_at: new Date()
          };
          
          await updateDoc(doc(db, 'users', userId), updateData);
          
          console.log(`✅ Updated ${email}: ${positionData.jobTitle} - ${positionData.specialization}`);
          results.updated.push(email);
          
        } catch (error) {
          console.error(`❌ Error updating ${email}:`, error);
          results.errors.push(email);
        }
      }
      
      // Special handling for Joel Yaffe (Super Admin)
      try {
        console.log('🔄 Processing Joel Yaffe (Super Admin)...');
        
        const joelQuery = query(
          collection(db, 'users'), 
          where('email', '==', 'joel.yaffe@gmail.com')
        );
        const joelSnapshot = await getDocs(joelQuery);
        
        if (!joelSnapshot.empty) {
          const joelDoc = joelSnapshot.docs[0];
          const joelData = joelDoc.data();
          
          const joelUpdateData = {
            adminProfile: {
              ...joelData.adminProfile,
              jobTitle: 'CTO, Founder', // Use Joel's preferred title
              department: 'Leadership',
              specialization: 'Chief Technology Officer & Co-Founder',
              bio: joelData.adminProfile?.bio || 'Founder and CTO of SHELTR-AI, pioneering innovative solutions to revolutionize homelessness services through cutting-edge technology and compassionate action.',
              profileComplete: true,
              profileVisibility: 'public',
              displayOrder: -1, // Always first
              lastUpdated: new Date(),
              updatedBy: 'migration-script'
            },
            updated_at: new Date()
          };
          
          await updateDoc(doc(db, 'users', joelDoc.id), joelUpdateData);
          console.log('✅ Updated Joel Yaffe (Super Admin) profile');
          results.updated.push('joel.yaffe@gmail.com');
        } else {
          console.log('❌ Joel Yaffe not found in users collection');
          results.notFound.push('joel.yaffe@gmail.com');
        }
      } catch (error) {
        console.error('❌ Error updating Joel Yaffe:', error);
        results.errors.push('joel.yaffe@gmail.com');
      }
      
      // Summary
      console.log('🎉 Position data migration completed!');
      console.log(`✅ Updated: ${results.updated.length} users`);
      console.log(`❌ Not found: ${results.notFound.length} users`);
      console.log(`🚨 Errors: ${results.errors.length} users`);
      
      if (results.notFound.length > 0) {
        console.log('Not found users:', results.notFound);
      }
      if (results.errors.length > 0) {
        console.log('Error users:', results.errors);
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
  
  /**
   * Verify migration results
   */
  static async verifyMigration(): Promise<void> {
    try {
      console.log('🔍 Verifying migration results...');
      
      for (const email of Object.keys(PLATFORM_ADMIN_POSITIONS)) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const adminProfile = userData.adminProfile;
          
          console.log(`✅ ${email}:`, {
            jobTitle: adminProfile?.jobTitle,
            department: adminProfile?.department,
            specialization: adminProfile?.specialization,
            profileVisibility: adminProfile?.profileVisibility
          });
        }
      }
      
      // Verify Joel
      const joelQuery = query(
        collection(db, 'users'), 
        where('email', '==', 'joel.yaffe@gmail.com')
      );
      const joelSnapshot = await getDocs(joelQuery);
      
      if (!joelSnapshot.empty) {
        const joelData = joelSnapshot.docs[0].data();
        console.log('✅ Joel Yaffe:', {
          jobTitle: joelData.adminProfile?.jobTitle,
          department: joelData.adminProfile?.department,
          specialization: joelData.adminProfile?.specialization,
          profileVisibility: joelData.adminProfile?.profileVisibility,
          displayOrder: joelData.adminProfile?.displayOrder
        });
      }
      
    } catch (error) {
      console.error('❌ Verification failed:', error);
    }
  }
}
