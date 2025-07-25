import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Migration configuration
const MIGRATION_CONFIG = {
  tenantId: 'Vc48fjy0cajJrstbLQRr',
  sheltersCollectionPath: 'tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data'
};

// Types based on the migration document schema
export interface Shelter {
  id: string;
  name: string;
  location: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'Emergency Shelter' | 'Transitional Housing' | 'Family Shelter' | 'Youth Shelter' | 'Day Center';
  capacity: number;
  currentOccupancy: number;
  participants: number;
  totalDonations: number;
  status: 'active' | 'pending' | 'inactive' | 'under_review';
  complianceScore: number;
  lastInspection: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  joinDate: string;
  rating: number;
  tenantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Migration metadata (optional)
  _migration?: {
    originalPath: string;
    migratedAt: Timestamp;
    migrationVersion: string;
  };
}

export interface PendingApplication {
  id: string;
  name: string;
  location: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  type: string;
  capacity: number;
  applicant: string;
  email: string;
  submittedDate: string;
  documents: string[];
  status: 'under_review' | 'pending_documents' | 'approved' | 'rejected';
  tenantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Firestore service class
export class FirestoreService {
  
  // Get shelters for a specific tenant (updated for new structure)
  async getShelters(tenantId: string = 'platform'): Promise<Shelter[]> {
    try {
      // Use the migrated structure for the primary tenant
      if (tenantId === 'platform') {
        const sheltersRef = collection(db, MIGRATION_CONFIG.sheltersCollectionPath);
        const q = query(sheltersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Shelter[];
      } else {
        // For other tenants, use their specific structure (when implemented)
        const sheltersRef = collection(db, `tenants/${tenantId}/platform/shelters/data`);
        const q = query(sheltersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Shelter[];
      }
    } catch (error) {
      console.error('Error fetching shelters:', error);
      console.log('💡 Using migrated path:', MIGRATION_CONFIG.sheltersCollectionPath);
      return [];
    }
  }

  // Get all shelters across all tenants (for platform admin)
  async getAllShelters(): Promise<Shelter[]> {
    try {
      // For now, get from migrated platform tenant
      return this.getShelters('platform');
    } catch (error) {
      console.error('Error fetching all shelters:', error);
      return [];
    }
  }

  // Get shelter organizations from tenants collection
  async getShelterOrganizations(): Promise<Shelter[]> {
    try {
      const tenantsRef = collection(db, 'tenants');
      const q = query(tenantsRef, where('type', '==', 'shelter'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          location: `${data.organization?.address?.city}, ${data.organization?.address?.state}`,
          address: `${data.organization?.address?.street}, ${data.organization?.address?.city}, ${data.organization?.address?.state} ${data.organization?.address?.zipCode}`,
          coordinates: {
            lat: data.organization?.address?.city === 'Montreal' ? 45.5017 :
                 data.organization?.address?.city === 'Vancouver' ? 49.2827 : 47.6062,
            lng: data.organization?.address?.city === 'Montreal' ? -73.5673 :
                 data.organization?.address?.city === 'Vancouver' ? -123.1207 : -122.3321
          },
          type: 'Emergency Shelter',
          capacity: data.subscription?.limits?.maxParticipants || 100,
          currentOccupancy: Math.floor(Math.random() * (data.subscription?.limits?.maxParticipants || 100) * 0.8),
          participants: Math.floor(Math.random() * (data.subscription?.limits?.maxParticipants || 100) * 0.8),
          totalDonations: Math.floor(Math.random() * 50000) + 10000,
          status: data.status === 'active' ? 'active' : 'inactive',
          complianceScore: Math.floor(Math.random() * 20) + 80,
          lastInspection: '2024-01-15',
          contact: {
            name: data.organization?.contact?.name || 'Contact Person',
            phone: data.organization?.contact?.phone || '',
            email: data.organization?.contact?.email || ''
          },
          joinDate: data.createdAt?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Shelter;
      });
    } catch (error) {
      console.error('Error fetching shelter organizations:', error);
      return [];
    }
  }

  // Add a new shelter (updated for new structure)
  async addShelter(shelterData: Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'>, tenantId: string = 'platform'): Promise<string> {
    try {
      let sheltersRef;
      
      if (tenantId === 'platform') {
        sheltersRef = collection(db, MIGRATION_CONFIG.sheltersCollectionPath);
      } else {
        sheltersRef = collection(db, `tenants/${tenantId}/platform/shelters/data`);
      }
      
      const now = Timestamp.now();
      
      const docRef = await addDoc(sheltersRef, {
        ...shelterData,
        tenantId: tenantId === 'platform' ? MIGRATION_CONFIG.tenantId : tenantId,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding shelter:', error);
      throw error;
    }
  }

  // Update shelter (updated for new structure)
  async updateShelter(shelterId: string, updates: Partial<Shelter>, tenantId: string = 'platform'): Promise<void> {
    try {
      let shelterRef;
      
      if (tenantId === 'platform') {
        shelterRef = doc(db, MIGRATION_CONFIG.sheltersCollectionPath, shelterId);
      } else {
        shelterRef = doc(db, `tenants/${tenantId}/platform/shelters/data`, shelterId);
      }
      
      await updateDoc(shelterRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating shelter:', error);
      throw error;
    }
  }

  // Delete shelter (updated for new structure)
  async deleteShelter(shelterId: string, tenantId: string = 'platform'): Promise<void> {
    try {
      let shelterRef;
      
      if (tenantId === 'platform') {
        shelterRef = doc(db, MIGRATION_CONFIG.sheltersCollectionPath, shelterId);
      } else {
        shelterRef = doc(db, `tenants/${tenantId}/platform/shelters/data`, shelterId);
      }
      
      await deleteDoc(shelterRef);
    } catch (error) {
      console.error('Error deleting shelter:', error);
      throw error;
    }
  }

  // Get pending applications
  async getPendingApplications(tenantId: string = 'platform'): Promise<PendingApplication[]> {
    try {
      // Applications remain in the old structure for now
      const actualTenantId = tenantId === 'platform' ? MIGRATION_CONFIG.tenantId : tenantId;
      const applicationsRef = collection(db, `tenants/${actualTenantId}/shelter_applications`);
      const q = query(applicationsRef, where('status', 'in', ['under_review', 'pending_documents']));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PendingApplication[];
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      return [];
    }
  }

  // Add pending application
  async addPendingApplication(
    applicationData: Omit<PendingApplication, 'id' | 'createdAt' | 'updatedAt'>, 
    tenantId: string = 'platform'
  ): Promise<string> {
    try {
      const actualTenantId = tenantId === 'platform' ? MIGRATION_CONFIG.tenantId : tenantId;
      const applicationsRef = collection(db, `tenants/${actualTenantId}/shelter_applications`);
      const now = Timestamp.now();
      
      const docRef = await addDoc(applicationsRef, {
        ...applicationData,
        tenantId: actualTenantId,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding pending application:', error);
      throw error;
    }
  }

  // Approve application (move to shelters collection)
  async approveApplication(applicationId: string, tenantId: string = 'platform'): Promise<void> {
    try {
      const actualTenantId = tenantId === 'platform' ? MIGRATION_CONFIG.tenantId : tenantId;
      
      // Get the application
      const appRef = doc(db, `tenants/${actualTenantId}/shelter_applications`, applicationId);
      const appSnap = await getDoc(appRef);
      
      if (!appSnap.exists()) {
        throw new Error('Application not found');
      }
      
      const appData = appSnap.data() as PendingApplication;
      
      // Create shelter record
      const shelterData: Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'> = {
        name: appData.name,
        location: appData.location,
        address: appData.address,
        coordinates: appData.coordinates || { lat: 0, lng: 0 },
        type: appData.type as Shelter['type'],
        capacity: appData.capacity,
        currentOccupancy: 0,
        participants: 0,
        totalDonations: 0,
        status: 'active',
        complianceScore: 85, // Starting score
        lastInspection: 'Pending',
        contact: {
          name: appData.applicant,
          email: appData.email,
          phone: ''
        },
        joinDate: new Date().toISOString().split('T')[0],
        rating: 0,
        tenantId: actualTenantId
      };
      
      await this.addShelter(shelterData, tenantId);
      
      // Update application status
      await updateDoc(appRef, {
        status: 'approved',
        updatedAt: Timestamp.now()
      });
      
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();

// Database investigation and cleanup functions (updated)
export async function investigateDatabase() {
  console.log('🔍 INVESTIGATING MIGRATED DATABASE STRUCTURE...\n');
  
  try {
    // Check migrated shelter data
    console.log('1. MIGRATED SHELTER DATA:');
    const migratedSheltersRef = collection(db, MIGRATION_CONFIG.sheltersCollectionPath);
    const migratedSheltersSnapshot = await getDocs(migratedSheltersRef);
    console.log(`   Migrated shelters: ${migratedSheltersSnapshot.size}`);
    
    migratedSheltersSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${doc.id} - ${data.name || 'Unnamed'}`);
      console.log(`      Location: ${data.location || 'N/A'}`);
      console.log(`      Status: ${data.status || 'N/A'}`);
      if (data._migration) {
        console.log(`      🔄 Migrated from: ${data._migration.originalPath}`);
      }
    });

    // Check tenants collection
    console.log('\n2. TENANTS COLLECTION:');
    const tenantsRef = collection(db, 'tenants');
    const tenantsSnapshot = await getDocs(tenantsRef);
    console.log(`   Total tenants: ${tenantsSnapshot.size}`);
    
    tenantsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${doc.id} - ${data.name || 'Unnamed'} (${data.type || 'unknown type'})`);
      if (doc.id === MIGRATION_CONFIG.tenantId) {
        console.log(`      ✅ This is the primary tenant for migrated data`);
      }
    });

    console.log('\n🔍 Migration investigation complete!');
    console.log(`📍 Primary tenant: ${MIGRATION_CONFIG.tenantId}`);
    console.log(`📁 Shelters path: ${MIGRATION_CONFIG.sheltersCollectionPath}`);
    
  } catch (error) {
    console.error('Error investigating database:', error);
  }
}

export async function clearAllShelterData() {
  console.log('🧹 CLEARING MIGRATED SHELTER DATA...\n');
  
  try {
    // Clear migrated shelters
    console.log('1. Clearing migrated shelters...');
    const migratedSheltersRef = collection(db, MIGRATION_CONFIG.sheltersCollectionPath);
    const migratedSheltersSnapshot = await getDocs(migratedSheltersRef);
    
    for (const doc of migratedSheltersSnapshot.docs) {
      await deleteDoc(doc.ref);
      console.log(`   Deleted: ${doc.data().name || doc.id}`);
    }

    // Note: We'll keep tenant data intact since it's properly structured now
    console.log('\n🧹 Migrated shelter data cleared!');
    console.log('ℹ️  Tenant structure preserved');
    
  } catch (error) {
    console.error('Error clearing shelter data:', error);
    throw error;
  }
} 