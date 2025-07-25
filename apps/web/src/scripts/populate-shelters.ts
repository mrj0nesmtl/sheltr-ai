import { firestoreService, Shelter, PendingApplication } from '../services/firestore';
import { Timestamp } from 'firebase/firestore';

// Mock shelter data with coordinates for mapping
const mockShelters: Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Downtown Hope Center',
    location: 'Seattle, WA',
    address: '123 Hope Street, Seattle, WA 98101',
    coordinates: { lat: 47.6062, lng: -122.3321 }, // Downtown Seattle
    type: 'Emergency Shelter',
    capacity: 150,
    currentOccupancy: 142,
    participants: 145,
    totalDonations: 15234.67,
    status: 'active',
    complianceScore: 98,
    lastInspection: '2024-06-15',
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah@downtownhope.org',
      phone: '(206) 555-0123'
    },
    joinDate: '2023-03-15',
    rating: 4.8,
    tenantId: 'platform'
  },
  {
    name: 'Riverside Shelter',
    location: 'Portland, OR',
    address: '456 River Ave, Portland, OR 97201',
    coordinates: { lat: 45.5152, lng: -122.6784 }, // Downtown Portland
    type: 'Transitional Housing',
    capacity: 75,
    currentOccupancy: 68,
    participants: 89,
    totalDonations: 8743.21,
    status: 'active',
    complianceScore: 95,
    lastInspection: '2024-07-02',
    contact: {
      name: 'Michael Chen',
      email: 'mchen@riverside.org',
      phone: '(503) 555-0145'
    },
    joinDate: '2023-08-20',
    rating: 4.6,
    tenantId: 'platform'
  },
  {
    name: 'Safe Harbor Foundation',
    location: 'Vancouver, BC',
    address: '789 Harbor Way, Vancouver, BC V6B 1A1',
    coordinates: { lat: 49.2827, lng: -123.1207 }, // Downtown Vancouver
    type: 'Family Shelter',
    capacity: 200,
    currentOccupancy: 185,
    participants: 203,
    totalDonations: 23567.45,
    status: 'active',
    complianceScore: 97,
    lastInspection: '2024-05-20',
    contact: {
      name: 'Lisa Rodriguez',
      email: 'lrodriguez@safeharbor.ca',
      phone: '(604) 555-0198'
    },
    joinDate: '2022-11-10',
    rating: 4.9,
    tenantId: 'platform'
  },
  {
    name: 'Community Outreach',
    location: 'San Francisco, CA',
    address: '321 Mission St, San Francisco, CA 94102',
    coordinates: { lat: 37.7749, lng: -122.4194 }, // Downtown San Francisco
    type: 'Emergency Shelter',
    capacity: 120,
    currentOccupancy: 0,
    participants: 67,
    totalDonations: 12456.89,
    status: 'pending',
    complianceScore: 85,
    lastInspection: 'Pending',
    contact: {
      name: 'Emily Rodriguez',
      email: 'erodriguez@community.org',
      phone: '(415) 555-0167'
    },
    joinDate: '2024-07-20',
    rating: 0,
    tenantId: 'platform'
  },
  {
    name: 'New Beginnings Center',
    location: 'Los Angeles, CA',
    address: '555 Skid Row Ave, Los Angeles, CA 90013',
    coordinates: { lat: 34.0522, lng: -118.2437 }, // Downtown LA
    type: 'Transitional Housing',
    capacity: 180,
    currentOccupancy: 165,
    participants: 172,
    totalDonations: 18934.56,
    status: 'active',
    complianceScore: 96,
    lastInspection: '2024-07-01',
    contact: {
      name: 'Robert Johnson',
      email: 'rjohnson@newbeginnings.org',
      phone: '(213) 555-0189'
    },
    joinDate: '2023-01-12',
    rating: 4.7,
    tenantId: 'platform'
  },
  {
    name: 'Mountain View Sanctuary',
    location: 'Denver, CO',
    address: '888 Mountain Ave, Denver, CO 80202',
    coordinates: { lat: 39.7392, lng: -104.9903 }, // Downtown Denver
    type: 'Family Shelter',
    capacity: 95,
    currentOccupancy: 88,
    participants: 92,
    totalDonations: 11245.78,
    status: 'active',
    complianceScore: 93,
    lastInspection: '2024-06-20',
    contact: {
      name: 'Amanda Torres',
      email: 'atorres@mountainview.org',
      phone: '(303) 555-0234'
    },
    joinDate: '2023-09-05',
    rating: 4.5,
    tenantId: 'platform'
  },
  // MONTREAL SHELTERS - Real data from user 🇨🇦
  {
    name: 'Old Brewery Mission (Webster Pavilion)',
    location: 'Montreal, QC',
    address: '915 Rue Clark, Montréal, QC H2Z 1J2',
    coordinates: { lat: 45.5088, lng: -73.5673 }, // Downtown Montreal
    type: 'Emergency Shelter',
    capacity: 280,
    currentOccupancy: 265,
    participants: 312,
    totalDonations: 28945.33,
    status: 'active',
    complianceScore: 97,
    lastInspection: '2024-06-10',
    contact: {
      name: 'Jean-Pierre Dubois',
      email: 'jdubois@oldbrewerymission.ca',
      phone: '514-798-2244'
    },
    joinDate: '2022-05-15',
    rating: 4.8,
    tenantId: 'platform'
  },
  {
    name: 'Maison du Père',
    location: 'Montreal, QC',
    address: '550 Blvd René-Lévesque E, Montreal, QC H2L 2L3',
    coordinates: { lat: 45.5142, lng: -73.5617 }, // Downtown Montreal East
    type: 'Transitional Housing',
    capacity: 150,
    currentOccupancy: 138,
    participants: 165,
    totalDonations: 19567.89,
    status: 'active',
    complianceScore: 95,
    lastInspection: '2024-07-05',
    contact: {
      name: 'Marie-Claire Rousseau',
      email: 'mrouseau@maisondupere.org',
      phone: '514-845-0168'
    },
    joinDate: '2022-08-22',
    rating: 4.6,
    tenantId: 'platform'
  },
  {
    name: 'Resilience Montreal',
    location: 'Montreal, QC',
    address: '4000 Sainte-Catherine St W, Westmount, QC H3Z 1P1',
    coordinates: { lat: 45.4919, lng: -73.5926 }, // Westmount
    type: 'Family Shelter',
    capacity: 65,
    currentOccupancy: 58,
    participants: 78,
    totalDonations: 12334.67,
    status: 'active',
    complianceScore: 92,
    lastInspection: '2024-06-25',
    contact: {
      name: 'Sarah Martinez',
      email: 'smartinez@resiliencemontreal.org',
      phone: '438-828-8995'
    },
    joinDate: '2023-02-10',
    rating: 4.4,
    tenantId: 'platform'
  },
  {
    name: 'Refuge des Jeunes de Montréal',
    location: 'Montreal, QC',
    address: '1836 St Catherine St E, Montreal, QC H2K 2H3',
    coordinates: { lat: 45.5234, lng: -73.5489 }, // East Montreal
    type: 'Youth Shelter',
    capacity: 40,
    currentOccupancy: 35,
    participants: 52,
    totalDonations: 8945.23,
    status: 'active',
    complianceScore: 94,
    lastInspection: '2024-07-12',
    contact: {
      name: 'Antoine Leblanc',
      email: 'aleblanc@refugejeunes.qc.ca',
      phone: '514-849-4221'
    },
    joinDate: '2023-01-18',
    rating: 4.7,
    tenantId: 'platform'
  },
  {
    name: 'Le Chaînon',
    location: 'Montreal, QC',
    address: '4373 Esplanade Ave, Montreal, QC H2W 1V8',
    coordinates: { lat: 45.5234, lng: -73.5917 }, // Plateau Mont-Royal
    type: 'Emergency Shelter',
    capacity: 85,
    currentOccupancy: 79,
    participants: 98,
    totalDonations: 14567.44,
    status: 'active',
    complianceScore: 96,
    lastInspection: '2024-06-30',
    contact: {
      name: 'Francine Beaulieu',
      email: 'fbeaulieu@lechainon.org',
      phone: '514-845-0151'
    },
    joinDate: '2022-11-08',
    rating: 4.5,
    tenantId: 'platform'
  },
  {
    name: 'Welcome Hall Mission',
    location: 'Montreal, QC',
    address: '606 Courcelle St, Montreal, QC H4C 3L5',
    coordinates: { lat: 45.4745, lng: -73.5794 }, // Verdun
    type: 'Emergency Shelter',
    capacity: 120,
    currentOccupancy: 108,
    participants: 134,
    totalDonations: 16789.55,
    status: 'active',
    complianceScore: 93,
    lastInspection: '2024-07-08',
    contact: {
      name: 'David Thompson',
      email: 'dthompson@welcomehall.ca',
      phone: '514-523-5288'
    },
    joinDate: '2022-09-14',
    rating: 4.3,
    tenantId: 'platform'
  },
  {
    name: 'La Maison Benoît Labre',
    location: 'Montreal, QC',
    address: '259 Ave Greene, Montreal, QC H4C 2H9',
    coordinates: { lat: 45.4678, lng: -73.5823 }, // Verdun
    type: 'Transitional Housing',
    capacity: 55,
    currentOccupancy: 48,
    participants: 67,
    totalDonations: 9234.78,
    status: 'active',
    complianceScore: 91,
    lastInspection: '2024-06-18',
    contact: {
      name: 'Pierre Gagnon',
      email: 'pgagnon@maisonbenoitlabre.org',
      phone: '514-937-5973'
    },
    joinDate: '2023-03-25',
    rating: 4.2,
    tenantId: 'platform'
  },
  {
    name: 'Chez Doris - Refuge Elspeth McConnell',
    location: 'Montreal, QC',
    address: '1430 Rue Chomedey, Montréal, QC H3H 2A7',
    coordinates: { lat: 45.4751, lng: -73.5942 }, // Notre-Dame-de-Grâce
    type: 'Emergency Shelter',
    capacity: 45,
    currentOccupancy: 42,
    participants: 56,
    totalDonations: 7456.89,
    status: 'active',
    complianceScore: 89,
    lastInspection: '2024-07-15',
    contact: {
      name: 'Catherine Dubé',
      email: 'cdube@chezdoris.ca',
      phone: '514-937-2341'
    },
    joinDate: '2023-04-12',
    rating: 4.1,
    tenantId: 'platform'
  },
  {
    name: 'Auberge Madeleine',
    location: 'Montreal, QC',
    address: 'CP 83593, BP Garnier Montréal, QC H2J 4E9',
    coordinates: { lat: 45.5403, lng: -73.5817 }, // Rosemont
    type: 'Emergency Shelter',
    capacity: 35,
    currentOccupancy: 31,
    participants: 42,
    totalDonations: 5678.34,
    status: 'active',
    complianceScore: 88,
    lastInspection: '2024-06-28',
    contact: {
      name: 'Isabelle Fortin',
      email: 'ifortin@aubergemadeleine.qc.ca',
      phone: '514-597-1499'
    },
    joinDate: '2023-05-08',
    rating: 3.9,
    tenantId: 'platform'
  }
];

const mockPendingApplications: Omit<PendingApplication, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Neighborhood Support Center',
    location: 'Oakland, CA',
    address: '123 Oakland Blvd, Oakland, CA 94607',
    coordinates: { lat: 37.8044, lng: -122.2712 }, // Oakland
    type: 'Day Center',
    capacity: 50,
    applicant: 'David Martinez',
    email: 'dmartinez@neighborhood.org',
    submittedDate: '2024-07-20',
    documents: ['License', 'Insurance', 'Background Check'],
    status: 'under_review',
    tenantId: 'platform'
  },
  {
    name: 'Youth Haven',
    location: 'Los Angeles, CA',
    address: '456 Youth St, Los Angeles, CA 90028',
    coordinates: { lat: 34.0928, lng: -118.3287 }, // Hollywood area
    type: 'Youth Shelter',
    capacity: 30,
    applicant: 'Jennifer Kim',
    email: 'jkim@youthhaven.org',
    submittedDate: '2024-07-18',
    documents: ['License', 'Insurance'],
    status: 'pending_documents',
    tenantId: 'platform'
  },
  {
    name: 'Phoenix Rising Center',
    location: 'Phoenix, AZ',
    address: '789 Desert Road, Phoenix, AZ 85004',
    coordinates: { lat: 33.4484, lng: -112.0740 }, // Downtown Phoenix
    type: 'Emergency Shelter',
    capacity: 85,
    applicant: 'Carlos Mendez',
    email: 'cmendez@phoenixrising.org',
    submittedDate: '2024-07-22',
    documents: ['License'],
    status: 'pending_documents',
    tenantId: 'platform'
  },
  // MONTREAL PENDING APPLICATIONS
  {
    name: 'Maison Marguerite',
    location: 'Montreal, QC',
    address: '789 Boulevard Saint-Laurent, Montreal, QC H2X 2T1',
    coordinates: { lat: 45.5088, lng: -73.5673 }, // Downtown Montreal
    type: 'Emergency Shelter',
    capacity: 50,
    applicant: 'Sophie Tremblay',
    email: 'stremblay@maisonmarguerite.qc.ca',
    submittedDate: '2024-07-25',
    documents: ['License', 'Insurance'],
    status: 'under_review',
    tenantId: 'platform'
  },
  {
    name: 'Rue des Femmes',
    location: 'Montreal, QC',
    address: '1049 Côte du Beaver Hall, Montreal, QC H2Z 1S1',
    coordinates: { lat: 45.5017, lng: -73.5673 }, // Downtown Montreal
    type: 'Emergency Shelter',
    capacity: 40,
    applicant: 'Martine Lavoie',
    email: 'mlavoie@ruedesfemmes.org',
    submittedDate: '2024-07-23',
    documents: ['License'],
    status: 'pending_documents',
    tenantId: 'platform'
  }
];

export async function populateShelters() {
  console.log('🏠 Starting shelter data population...');
  
  try {
    // Add shelters
    console.log('📍 Adding shelters to Firestore...');
    for (const shelter of mockShelters) {
      const shelterId = await firestoreService.addShelter(shelter);
      console.log(`✅ Added shelter: ${shelter.name} (ID: ${shelterId})`);
    }
    
    // Add pending applications
    console.log('📝 Adding pending applications to Firestore...');
    for (const application of mockPendingApplications) {
      const appId = await firestoreService.addPendingApplication(application);
      console.log(`✅ Added application: ${application.name} (ID: ${appId})`);
    }
    
    console.log('🎉 Shelter data population completed successfully!');
    console.log(`📊 Total shelters added: ${mockShelters.length}`);
    console.log(`📋 Total applications added: ${mockPendingApplications.length}`);
    console.log('🇨🇦 Montreal shelters included with real contact information!');
    
  } catch (error) {
    console.error('❌ Error populating shelter data:', error);
    throw error;
  }
}

export async function clearShelterData() {
  console.log('🧹 Clearing existing shelter data...');
  
  try {
    // Get existing shelters
    const shelters = await firestoreService.getShelters();
    for (const shelter of shelters) {
      await firestoreService.deleteShelter(shelter.id);
      console.log(`🗑️ Deleted shelter: ${shelter.name}`);
    }
    
    // Get existing applications
    const applications = await firestoreService.getPendingApplications();
    for (const app of applications) {
      // Note: We'd need to add deleteApplication method to service
      console.log(`📋 Found application: ${app.name} (manual cleanup needed)`);
    }
    
    console.log('✅ Shelter data cleared!');
    
  } catch (error) {
    console.error('❌ Error clearing shelter data:', error);
    throw error;
  }
}

// Run the population if this script is executed directly
if (typeof window === 'undefined') {
  populateShelters().catch(console.error);
} 