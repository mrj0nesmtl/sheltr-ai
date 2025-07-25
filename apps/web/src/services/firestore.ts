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
  
  // Get shelters for a specific tenant
  async getShelters(tenantId: string = 'platform'): Promise<Shelter[]> {
    try {
      const sheltersRef = collection(db, `tenants/${tenantId}/shelters`);
      const q = query(sheltersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Shelter[];
    } catch (error) {
      console.error('Error fetching shelters:', error);
      return [];
    }
  }

  // Get all shelters across all tenants (for platform admin)
  async getAllShelters(): Promise<Shelter[]> {
    try {
      // For now, get from platform tenant - will expand to cross-tenant later
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

  // Add a new shelter
  async addShelter(shelterData: Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'>, tenantId: string = 'platform'): Promise<string> {
    try {
      const sheltersRef = collection(db, `tenants/${tenantId}/shelters`);
      const now = Timestamp.now();
      
      const docRef = await addDoc(sheltersRef, {
        ...shelterData,
        tenantId,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding shelter:', error);
      throw error;
    }
  }

  // Update shelter
  async updateShelter(shelterId: string, updates: Partial<Shelter>, tenantId: string = 'platform'): Promise<void> {
    try {
      const shelterRef = doc(db, `tenants/${tenantId}/shelters`, shelterId);
      await updateDoc(shelterRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating shelter:', error);
      throw error;
    }
  }

  // Delete shelter
  async deleteShelter(shelterId: string, tenantId: string = 'platform'): Promise<void> {
    try {
      const shelterRef = doc(db, `tenants/${tenantId}/shelters`, shelterId);
      await deleteDoc(shelterRef);
    } catch (error) {
      console.error('Error deleting shelter:', error);
      throw error;
    }
  }

  // Get pending applications
  async getPendingApplications(tenantId: string = 'platform'): Promise<PendingApplication[]> {
    try {
      const applicationsRef = collection(db, `tenants/${tenantId}/shelter_applications`);
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
      const applicationsRef = collection(db, `tenants/${tenantId}/shelter_applications`);
      const now = Timestamp.now();
      
      const docRef = await addDoc(applicationsRef, {
        ...applicationData,
        tenantId,
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
      // Get the application
      const appRef = doc(db, `tenants/${tenantId}/shelter_applications`, applicationId);
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
        tenantId
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

// Database investigation and cleanup functions
export async function investigateDatabase() {
  console.log('🔍 INVESTIGATING DATABASE STRUCTURE...\n');
  
  try {
    // Check tenants collection
    console.log('1. TENANTS COLLECTION:');
    const tenantsRef = collection(db, 'tenants');
    const tenantsSnapshot = await getDocs(tenantsRef);
    console.log(`   Total tenants: ${tenantsSnapshot.size}`);
    
    tenantsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${doc.id} - ${data.name || 'Unnamed'} (${data.type || 'unknown type'})`);
      if (data.organization?.address) {
        console.log(`      Address: ${data.organization.address.street || 'N/A'}, ${data.organization.address.city || 'N/A'}`);
      }
    });

    // Check for shelter data in platform tenant
    console.log('\n2. PLATFORM TENANT SHELTERS:');
    const platformSheltersRef = collection(db, 'tenants/platform/shelters');
    const platformSheltersSnapshot = await getDocs(platformSheltersRef);
    console.log(`   Platform shelters: ${platformSheltersSnapshot.size}`);
    
    platformSheltersSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${doc.id} - ${data.name || 'Unnamed'}`);
      console.log(`      Location: ${data.location || 'N/A'}`);
      console.log(`      Address: ${data.address || 'N/A'}`);
    });

    // Check for other tenant shelters
    console.log('\n3. CHECKING OTHER TENANT COLLECTIONS:');
    for (const tenantDoc of tenantsSnapshot.docs) {
      if (tenantDoc.id !== 'platform') {
        const tenantSheltersRef = collection(db, `tenants/${tenantDoc.id}/shelters`);
        const tenantSheltersSnapshot = await getDocs(tenantSheltersRef);
        if (tenantSheltersSnapshot.size > 0) {
          console.log(`   ${tenantDoc.id} shelters: ${tenantSheltersSnapshot.size}`);
          tenantSheltersSnapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            console.log(`     ${index + 1}. ${data.name || 'Unnamed'}`);
          });
        }
      }
    }

    console.log('\n🔍 Investigation complete!');
    
  } catch (error) {
    console.error('Error investigating database:', error);
  }
}

export async function clearAllShelterData() {
  console.log('🧹 CLEARING ALL SHELTER DATA...\n');
  
  try {
    // Clear platform shelters
    console.log('1. Clearing platform shelters...');
    const platformSheltersRef = collection(db, 'tenants/platform/shelters');
    const platformSheltersSnapshot = await getDocs(platformSheltersRef);
    
    for (const doc of platformSheltersSnapshot.docs) {
      await deleteDoc(doc.ref);
      console.log(`   Deleted: ${doc.data().name || doc.id}`);
    }

    // Clear all tenant shelter organizations (that were created as tenants)
    console.log('\n2. Clearing tenant shelter organizations...');
    const tenantsRef = collection(db, 'tenants');
    const tenantsSnapshot = await getDocs(tenantsRef);
    
    for (const tenantDoc of tenantsSnapshot.docs) {
      const data = tenantDoc.data();
      if (data.type === 'shelter' && tenantDoc.id !== 'platform') {
        await deleteDoc(tenantDoc.ref);
        console.log(`   Deleted tenant: ${data.name || tenantDoc.id}`);
      }
    }

    // Clear any shelter subcollections in other tenants
    console.log('\n3. Clearing shelter subcollections...');
    for (const tenantDoc of tenantsSnapshot.docs) {
      if (tenantDoc.id !== 'platform') {
        const tenantSheltersRef = collection(db, `tenants/${tenantDoc.id}/shelters`);
        const tenantSheltersSnapshot = await getDocs(tenantSheltersRef);
        
        for (const doc of tenantSheltersSnapshot.docs) {
          await deleteDoc(doc.ref);
          console.log(`   Deleted from ${tenantDoc.id}: ${doc.data().name || doc.id}`);
        }
      }
    }

    console.log('\n🧹 All shelter data cleared!');
    
  } catch (error) {
    console.error('Error clearing shelter data:', error);
    throw error;
  }
} 