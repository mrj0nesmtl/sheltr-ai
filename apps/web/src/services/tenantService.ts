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

// Updated configuration for proper multi-tenant architecture
const CONFIG = {
  // Each shelter is now its own tenant
  defaultTenant: 'old-brewery-mission', // Default for development
  globalCollectionPath: 'global',
  tenantsCollectionPath: 'tenants'
};

// Shelter/Tenant interface for the new architecture
export interface ShelterTenant {
  id: string; // tenant_id (e.g., 'old-brewery-mission')
  name: string;
  address: string;
  type: 'Emergency Shelter' | 'Transitional Housing' | 'Family Shelter' | 'Youth Shelter' | 'Day Center';
  capacity: number;
  currentOccupancy: number;
  status: 'active' | 'pending' | 'inactive';
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  features_enabled: {
    participant_management: boolean;
    donation_processing: boolean;
    qr_code_generation: boolean;
    analytics_dashboard: boolean;
    staff_management: boolean;
    resource_tracking: boolean;
    smartfund_integration: boolean;
  };
  subscription: 'free'; // Always free for shelters
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Participant interface for tenant-scoped participants
export interface TenantParticipant {
  id: string;
  tenantId: string; // Which shelter they belong to
  name: string;
  age?: number;
  gender?: string;
  checkinDate: Timestamp;
  status: 'active' | 'transitioned' | 'inactive';
  verified: boolean;
  qrCodeHash?: string;
  walletAddress?: string;
  totalDonationsReceived: number;
  lastActivity: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Staff interface for tenant-scoped staff
export interface TenantStaff {
  id: string;
  tenantId: string;
  userId: string; // Reference to global user
  role: 'admin' | 'staff' | 'volunteer';
  permissions: string[];
  department?: string;
  startDate: Timestamp;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Service for managing multi-tenant operations
export class TenantService {
  
  /**
   * Get collection path for a specific tenant and collection
   */
  getTenantCollectionPath(tenantId: string, collectionName: string): string {
    return `${CONFIG.tenantsCollectionPath}/${tenantId}/${collectionName}`;
  }

  /**
   * Get global collection path
   */
  getGlobalCollectionPath(collectionName: string): string {
    return `${CONFIG.globalCollectionPath}/${collectionName}`;
  }

  /**
   * Get all shelter tenants (for platform admin)
   */
  async getAllShelterTenants(): Promise<ShelterTenant[]> {
    try {
      console.log('🏠 [SESSION 13] Fetching all shelter tenants with FIXED database structure...');
      
      // FIXED: Based on migration docs, shelters are in tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data/
      const MIGRATED_TENANT_ID = 'Vc48fjy0cajJrstbLQRr';
      
      console.log(`🔍 Looking for migrated shelters in tenant: ${MIGRATED_TENANT_ID}`);
      
      const shelters: ShelterTenant[] = [];
      
      try {
        // Check the migrated shelter structure from the migration docs
        const migratedSheltersRef = collection(db, CONFIG.tenantsCollectionPath, MIGRATED_TENANT_ID, 'platform', 'shelters', 'data');
        const sheltersSnapshot = await getDocs(migratedSheltersRef);
        
        console.log(`🔍 Found ${sheltersSnapshot.size} migrated shelter documents`);
        
        sheltersSnapshot.forEach((shelterDoc) => {
          const shelterId = shelterDoc.id;
          const shelterData = shelterDoc.data();
          
          console.log(`🏠 Processing migrated shelter: ${shelterId} - ${shelterData.name}`);
          
          const shelter: ShelterTenant = {
            id: shelterId,
            name: shelterData.name || 'Unknown Shelter',
            address: shelterData.address || shelterData.location || '',
            type: shelterData.type || 'Emergency Shelter',
            capacity: shelterData.capacity || 0,
            currentOccupancy: shelterData.currentOccupancy || 0,
            status: shelterData.status || 'active',
            contact: shelterData.contact || { name: '', email: '', phone: '' },
            coordinates: shelterData.coordinates || { lat: 45.5017, lng: -73.5673 }, // Default Montreal
            features_enabled: {
              participant_management: true,
              donation_processing: true,
              qr_code_generation: true,
              analytics_dashboard: true,
              staff_management: true,
              resource_tracking: true,
              smartfund_integration: true
            },
            subscription: 'free',
            createdAt: shelterData.createdAt || Timestamp.now(),
            updatedAt: Timestamp.now()
          };
          
          shelters.push(shelter);
        });
        
      } catch (error) {
        console.error('❌ Error fetching migrated shelters:', error);
      }
      
      console.log(`✅ Found ${shelters.length} shelter tenants from migrated structure`);
      return shelters.sort((a, b) => a.name.localeCompare(b.name));
      
    } catch (error) {
      console.error('❌ Error fetching shelter tenants:', error);
      return [];
    }
  }

  /**
   * Get participants for a specific shelter tenant
   */
  async getTenantParticipants(tenantId: string): Promise<TenantParticipant[]> {
    try {
      console.log(`👥 Fetching participants for tenant: ${tenantId}`);
      
      const participantsRef = collection(db, this.getTenantCollectionPath(tenantId, 'participants'));
      const q = query(participantsRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const participants = querySnapshot.docs
        .filter(doc => doc.id !== '_placeholder') // Filter out placeholder
        .map(doc => ({
          id: doc.id,
          tenantId,
          ...doc.data()
        })) as TenantParticipant[];
      
      console.log(`✅ Found ${participants.length} participants for ${tenantId}`);
      return participants;
      
    } catch (error) {
      console.error(`❌ Error fetching participants for ${tenantId}:`, error);
      return [];
    }
  }

  /**
   * Get staff for a specific shelter tenant
   */
  async getTenantStaff(tenantId: string): Promise<TenantStaff[]> {
    try {
      console.log(`👨‍💼 Fetching staff for tenant: ${tenantId}`);
      
      const staffRef = collection(db, this.getTenantCollectionPath(tenantId, 'staff'));
      const q = query(staffRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const staff = querySnapshot.docs
        .filter(doc => doc.id !== '_placeholder')
        .map(doc => ({
          id: doc.id,
          tenantId,
          ...doc.data()
        })) as TenantStaff[];
      
      console.log(`✅ Found ${staff.length} staff members for ${tenantId}`);
      return staff;
      
    } catch (error) {
      console.error(`❌ Error fetching staff for ${tenantId}:`, error);
      return [];
    }
  }

  /**
   * Create a new participant for a shelter tenant
   */
  async createTenantParticipant(tenantId: string, participantData: Partial<TenantParticipant>): Promise<string> {
    try {
      console.log(`➕ Creating participant for tenant: ${tenantId}`);
      
      const participantsRef = collection(db, this.getTenantCollectionPath(tenantId, 'participants'));
      
      const newParticipant = {
        ...participantData,
        tenantId,
        status: 'active',
        verified: false,
        totalDonationsReceived: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastActivity: Timestamp.now()
      };
      
      const docRef = await addDoc(participantsRef, newParticipant);
      console.log(`✅ Created participant with ID: ${docRef.id}`);
      
      return docRef.id;
      
    } catch (error) {
      console.error(`❌ Error creating participant for ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Get analytics for a specific shelter tenant
   */
  async getTenantAnalytics(tenantId: string): Promise<any> {
    try {
      console.log(`📊 Fetching analytics for tenant: ${tenantId}`);
      
      // Get participants count
      const participants = await this.getTenantParticipants(tenantId);
      
      // Get staff count
      const staff = await this.getTenantStaff(tenantId);
      
      // Get donations (placeholder for now)
      const donationsRef = collection(db, this.getTenantCollectionPath(tenantId, 'donations'));
      const donationsSnapshot = await getDocs(donationsRef);
      const donationsCount = donationsSnapshot.docs.filter(doc => doc.id !== '_placeholder').length;
      
      const analytics = {
        participants: {
          total: participants.length,
          active: participants.filter(p => p.status === 'active').length,
          verified: participants.filter(p => p.verified).length
        },
        staff: {
          total: staff.length,
          admins: staff.filter(s => s.role === 'admin').length,
          volunteers: staff.filter(s => s.role === 'volunteer').length
        },
        donations: {
          total: donationsCount,
          // Add more donation analytics as they become available
        },
        lastUpdated: Timestamp.now()
      };
      
      console.log(`✅ Generated analytics for ${tenantId}`);
      return analytics;
      
    } catch (error) {
      console.error(`❌ Error fetching analytics for ${tenantId}:`, error);
      return null;
    }
  }

  /**
   * Validate user access to tenant
   */
  async validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    try {
      // Check if user is a staff member of this tenant
      const staffRef = collection(db, this.getTenantCollectionPath(tenantId, 'staff'));
      const q = query(staffRef, where('userId', '==', userId), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.length > 0;
      
    } catch (error) {
      console.error(`❌ Error validating tenant access for ${userId} to ${tenantId}:`, error);
      return false;
    }
  }

  /**
   * Get tenant context from user (for shelter admins)
   */
  async getUserTenantContext(userId: string): Promise<string | null> {
    try {
      // Find which tenant this user belongs to
      const tenantsSnapshot = await getDocs(collection(db, CONFIG.tenantsCollectionPath));
      
      for (const tenantDoc of tenantsSnapshot.docs) {
        const tenantId = tenantDoc.id;
        const hasAccess = await this.validateTenantAccess(userId, tenantId);
        
        if (hasAccess) {
          return tenantId;
        }
      }
      
      return null;
      
    } catch (error) {
      console.error(`❌ Error getting tenant context for user ${userId}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const tenantService = new TenantService();
