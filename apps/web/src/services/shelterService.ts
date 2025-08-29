import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc,
  updateDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { tenantService, ShelterTenant } from './tenantService';

export interface ShelterPublicConfig {
  id: string;
  name: string;
  slug: string;
  publicUrl: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  description?: string;
  mission?: string;
  services?: string[];
  operatingHours?: {
    [key: string]: string;
  };
  established?: string;
  certifications?: string[];
  socialMedia?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  customizations?: {
    primaryColor?: string;
    secondaryColor?: string;
    headerStyle?: 'modern' | 'classic' | 'minimal';
  };
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class ShelterService {
  
  /**
   * Generate URL slug from shelter name
   */
  generateSlug(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get shelter logo storage path
   */
  getShelterLogoPath(shelterId: string): string {
    return `shelters/${shelterId}/logo`;
  }

  /**
   * Get shelter background image storage path
   */
  getShelterBackgroundPath(shelterId: string): string {
    return `shelters/${shelterId}/background`;
  }

  /**
   * Upload shelter logo
   */
  async uploadShelterLogo(shelterId: string, file: File): Promise<string> {
    try {
      console.log(`📸 Uploading logo for shelter: ${shelterId}`);
      
      // Create storage reference
      const logoRef = ref(storage, this.getShelterLogoPath(shelterId));
      
      // Upload file
      const snapshot = await uploadBytes(logoRef, file);
      console.log('✅ Logo uploaded successfully');
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('📎 Logo URL generated:', downloadURL);
      
      return downloadURL;
      
    } catch (error) {
      console.error('❌ Error uploading shelter logo:', error);
      throw error;
    }
  }

  /**
   * Upload shelter background image
   */
  async uploadShelterBackground(shelterId: string, file: File): Promise<string> {
    try {
      console.log(`🖼️ Uploading background image for shelter: ${shelterId}`);
      
      // Create storage reference
      const backgroundRef = ref(storage, this.getShelterBackgroundPath(shelterId));
      
      // Upload file
      const snapshot = await uploadBytes(backgroundRef, file);
      console.log('✅ Background image uploaded successfully');
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('📎 Background image URL generated:', downloadURL);
      
      return downloadURL;
      
    } catch (error) {
      console.error('❌ Error uploading shelter background:', error);
      throw error;
    }
  }

  /**
   * Delete shelter image from storage
   */
  async deleteShelterImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      console.log('✅ Shelter image deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting shelter image:', error);
      throw error;
    }
  }

  /**
   * Get shelter public configuration
   */
  async getShelterPublicConfig(shelterId: string): Promise<ShelterPublicConfig | null> {
    try {
      console.log(`🔍 Fetching public config for shelter: ${shelterId}`);
      
      const configRef = doc(db, 'shelters', shelterId, 'public_config', 'settings');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        const data = configSnap.data();
        return {
          id: shelterId,
          ...data
        } as ShelterPublicConfig;
      }
      
      // If no config exists, create a default one
      const shelter = await this.getShelterById(shelterId);
      if (shelter) {
        return this.createDefaultPublicConfig(shelter);
      }
      
      return null;
      
    } catch (error) {
      console.error(`❌ Error fetching public config for ${shelterId}:`, error);
      return null;
    }
  }

  /**
   * Update shelter public configuration
   */
  async updateShelterPublicConfig(shelterId: string, config: Partial<ShelterPublicConfig>): Promise<void> {
    try {
      console.log(`💾 Updating public config for shelter: ${shelterId}`);
      
      const configRef = doc(db, 'shelters', shelterId, 'public_config', 'settings');
      
      const updateData = {
        ...config,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(configRef, updateData);
      console.log('✅ Public config updated successfully');
      
    } catch (error) {
      console.error(`❌ Error updating public config for ${shelterId}:`, error);
      throw error;
    }
  }

  /**
   * Get shelter by ID
   */
  async getShelterById(shelterId: string): Promise<ShelterTenant | null> {
    try {
      const shelters = await tenantService.getAllShelterTenants();
      return shelters.find(s => s.id === shelterId) || null;
    } catch (error) {
      console.error(`❌ Error fetching shelter ${shelterId}:`, error);
      return null;
    }
  }

  /**
   * Get shelter by slug
   */
  async getShelterBySlug(slug: string): Promise<{ shelter: ShelterTenant; config: ShelterPublicConfig } | null> {
    try {
      console.log(`🔍 Fetching shelter by slug: ${slug}`);
      
      // Get all shelters and find matching slug
      const shelters = await tenantService.getAllShelterTenants();
      const shelter = shelters.find(s => this.generateSlug(s.name) === slug);
      
      if (!shelter) {
        console.log(`❌ No shelter found for slug: ${slug}`);
        return null;
      }
      
      // Get public config
      const config = await this.getShelterPublicConfig(shelter.id);
      
      if (!config) {
        console.log(`❌ No public config found for shelter: ${shelter.id}`);
        return null;
      }
      
      return { shelter, config };
      
    } catch (error) {
      console.error(`❌ Error fetching shelter by slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Create default public configuration for a shelter
   */
  createDefaultPublicConfig(shelter: ShelterTenant): ShelterPublicConfig {
    const slug = this.generateSlug(shelter.name);
    
    return {
      id: shelter.id,
      name: shelter.name,
      slug: slug,
      publicUrl: `/${slug}`,
      description: `${shelter.name} is committed to providing safe, supportive emergency shelter and services to individuals and families experiencing homelessness in Montreal.`,
      mission: "To provide immediate shelter, support services, and pathways to permanent housing for our community's most vulnerable members.",
      services: [
        'Emergency Overnight Shelter',
        'Meals and Basic Necessities',
        'Case Management Services',
        'Mental Health Support',
        'Job Training Programs',
        'Housing Assistance',
        'Medical Care Coordination',
        'Substance Abuse Support'
      ],
      operatingHours: {
        'Monday': '6:00 PM - 8:00 AM',
        'Tuesday': '6:00 PM - 8:00 AM',
        'Wednesday': '6:00 PM - 8:00 AM',
        'Thursday': '6:00 PM - 8:00 AM',
        'Friday': '6:00 PM - 8:00 AM',
        'Saturday': '24 Hours',
        'Sunday': '24 Hours'
      },
      established: '1985',
      certifications: [
        'Canadian Centre for Accreditation',
        'Montreal Health Services Certified',
        'Emergency Shelter Standards Compliant'
      ],
      socialMedia: {
        website: `https://example.com/${slug}`,
        facebook: `https://facebook.com/${slug}`,
        twitter: `https://twitter.com/${slug}`
      },
      customizations: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        headerStyle: 'modern'
      },
      isPublic: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
  }

  /**
   * Initialize public configurations for all shelters
   */
  async initializeAllShelterConfigs(): Promise<void> {
    try {
      console.log('🚀 Initializing public configurations for all shelters...');
      
      const shelters = await tenantService.getAllShelterTenants();
      
      for (const shelter of shelters) {
        // Check if config already exists
        const existingConfig = await this.getShelterPublicConfig(shelter.id);
        
        if (!existingConfig) {
          // Create default config
          const defaultConfig = this.createDefaultPublicConfig(shelter);
          
          // Save to Firestore
          const configRef = doc(db, 'shelters', shelter.id, 'public_config', 'settings');
          await setDoc(configRef, defaultConfig);
          
          console.log(`✅ Created public config for: ${shelter.name}`);
        } else {
          console.log(`⏭️ Config already exists for: ${shelter.name}`);
        }
      }
      
      console.log('🎉 All shelter public configurations initialized!');
      
    } catch (error) {
      console.error('❌ Error initializing shelter configs:', error);
      throw error;
    }
  }

  /**
   * Get all public shelters for showcase
   */
  async getAllPublicShelters(): Promise<Array<{ shelter: ShelterTenant; config: ShelterPublicConfig }>> {
    try {
      console.log('🏠 Fetching all public shelters...');
      
      const shelters = await tenantService.getAllShelterTenants();
      const publicShelters = [];
      
      for (const shelter of shelters) {
        const config = await this.getShelterPublicConfig(shelter.id);
        
        if (config && config.isPublic) {
          publicShelters.push({ shelter, config });
        }
      }
      
      console.log(`✅ Found ${publicShelters.length} public shelters`);
      return publicShelters.sort((a, b) => a.shelter.name.localeCompare(b.shelter.name));
      
    } catch (error) {
      console.error('❌ Error fetching public shelters:', error);
      return [];
    }
  }
}

// Export singleton instance
export const shelterService = new ShelterService();
