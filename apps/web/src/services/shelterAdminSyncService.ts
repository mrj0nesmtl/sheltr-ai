/**
 * Shelter Admin Sync Service
 * 
 * Ensures bi-directional synchronization between:
 * - Shelter Admin profile (users collection)
 * - Shelter contact information (shelters collection)
 * 
 * This prevents data inconsistencies between the Shelter Admin dashboard
 * and the Super Admin/Platform Admin shelter management dashboard.
 */

import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ShelterContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface AdminProfileInfo {
  displayName?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export class ShelterAdminSyncService {
  
  /**
   * Sync shelter admin profile to shelter contact info
   * Called when a shelter admin updates their profile
   */
  static async syncAdminToShelter(adminUserId: string, shelterId: string): Promise<void> {
    try {
      console.log(`🔄 Syncing admin ${adminUserId} to shelter ${shelterId}...`);
      
      // Get admin's profile from users collection
      const userRef = doc(db, 'users', adminUserId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error('❌ Admin user not found');
        return;
      }
      
      const userData = userSnap.data();
      
      // Build contact info from admin profile
      const contactName = userData.displayName || 
                         `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
                         'Shelter Administrator';
      
      const contactEmail = userData.email || '';
      const contactPhone = userData.phone || userData.phoneNumber || '';
      
      // Update shelter's contact information
      const shelterRef = doc(db, 'shelters', shelterId);
      await updateDoc(shelterRef, {
        'contact.name': contactName,
        'contact.email': contactEmail,
        'contact.phone': contactPhone,
        updatedAt: new Date()
      });
      
      console.log(`✅ Successfully synced admin profile to shelter contact`);
      console.log(`   Name: ${contactName}`);
      console.log(`   Email: ${contactEmail}`);
      console.log(`   Phone: ${contactPhone}`);
      
    } catch (error) {
      console.error('❌ Error syncing admin to shelter:', error);
      throw error;
    }
  }
  
  /**
   * Sync shelter contact info to assigned admin profile
   * Called when a super admin updates shelter contact information
   */
  static async syncShelterToAdmin(shelterId: string, contactInfo: ShelterContactInfo): Promise<void> {
    try {
      console.log(`🔄 Syncing shelter ${shelterId} contact to assigned admin...`);
      
      // Find the admin assigned to this shelter
      const usersRef = collection(db, 'users');
      const adminQuery = query(
        usersRef,
        where('shelter_id', '==', shelterId),
        where('role', '==', 'admin')
      );
      
      const adminSnap = await getDocs(adminQuery);
      
      if (adminSnap.empty) {
        console.log('ℹ️  No admin assigned to this shelter yet');
        return;
      }
      
      // Update each assigned admin (usually just one)
      const updatePromises = adminSnap.docs.map(async (adminDoc) => {
        const adminId = adminDoc.id;
        const adminRef = doc(db, 'users', adminId);
        
        // Parse name into first/last if possible
        const nameParts = contactInfo.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await updateDoc(adminRef, {
          displayName: contactInfo.name,
          firstName: firstName,
          lastName: lastName,
          email: contactInfo.email,
          phone: contactInfo.phone,
          updatedAt: new Date()
        });
        
        console.log(`✅ Synced shelter contact to admin ${adminId}`);
      });
      
      await Promise.all(updatePromises);
      
    } catch (error) {
      console.error('❌ Error syncing shelter to admin:', error);
      throw error;
    }
  }
  
  /**
   * Initial sync when an admin is assigned to a shelter
   * Populates shelter contact with admin's profile info
   */
  static async syncOnAdminAssignment(adminUserId: string, shelterId: string): Promise<void> {
    try {
      console.log(`🔄 Initial sync: Assigning admin ${adminUserId} to shelter ${shelterId}...`);
      
      // Get admin's profile
      const userRef = doc(db, 'users', adminUserId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error('❌ Admin user not found');
        return;
      }
      
      const userData = userSnap.data();
      
      // Update user's shelter_id
      await updateDoc(userRef, {
        shelter_id: shelterId,
        updatedAt: new Date()
      });
      
      // Sync admin profile to shelter contact
      await this.syncAdminToShelter(adminUserId, shelterId);
      
      console.log(`✅ Admin successfully assigned and synced to shelter`);
      
    } catch (error) {
      console.error('❌ Error syncing on admin assignment:', error);
      throw error;
    }
  }
  
  /**
   * Get current shelter admin info
   */
  static async getShelterAdmin(shelterId: string): Promise<AdminProfileInfo | null> {
    try {
      const usersRef = collection(db, 'users');
      const adminQuery = query(
        usersRef,
        where('shelter_id', '==', shelterId),
        where('role', '==', 'admin')
      );
      
      const adminSnap = await getDocs(adminQuery);
      
      if (adminSnap.empty) {
        return null;
      }
      
      const adminData = adminSnap.docs[0].data();
      return {
        displayName: adminData.displayName,
        email: adminData.email,
        phone: adminData.phone || adminData.phoneNumber,
        firstName: adminData.firstName,
        lastName: adminData.lastName
      };
      
    } catch (error) {
      console.error('❌ Error getting shelter admin:', error);
      return null;
    }
  }
  
  /**
   * Verify sync status between admin and shelter
   * Returns true if in sync, false if out of sync
   */
  static async verifySyncStatus(adminUserId: string, shelterId: string): Promise<boolean> {
    try {
      // Get admin profile
      const userRef = doc(db, 'users', adminUserId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return false;
      
      const userData = userSnap.data();
      
      // Get shelter contact
      const shelterRef = doc(db, 'shelters', shelterId);
      const shelterSnap = await getDoc(shelterRef);
      
      if (!shelterSnap.exists()) return false;
      
      const shelterData = shelterSnap.data();
      const contact = shelterData.contact || {};
      
      // Compare key fields
      const adminName = userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      const adminEmail = userData.email || '';
      
      const inSync = (
        contact.name === adminName &&
        contact.email === adminEmail
      );
      
      if (!inSync) {
        console.log('⚠️  Sync status check: OUT OF SYNC');
        console.log(`   Admin: ${adminName} (${adminEmail})`);
        console.log(`   Shelter: ${contact.name} (${contact.email})`);
      } else {
        console.log('✅ Sync status check: IN SYNC');
      }
      
      return inSync;
      
    } catch (error) {
      console.error('❌ Error verifying sync status:', error);
      return false;
    }
  }
}

export const shelterAdminSyncService = new ShelterAdminSyncService();

