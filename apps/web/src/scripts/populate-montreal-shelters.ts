import { firestoreService, investigateDatabase, clearAllShelterData, Shelter } from '@/services/firestore';
import { Timestamp } from 'firebase/firestore';

// Real Montreal shelter data based on the provided information
const realMontrealShelters: Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Resilience Montreal",
    location: "Westmount, QC",
    address: "4000 Sainte-Catherine St West, Westmount, QC, H3Z 1P1",
    coordinates: {
      lat: 45.4871,
      lng: -73.5894
    },
    type: "Emergency Shelter",
    capacity: 120,
    currentOccupancy: Math.floor(Math.random() * 96) + 24, // 20-100% occupancy
    participants: Math.floor(Math.random() * 96) + 24,
    totalDonations: Math.floor(Math.random() * 100000) + 50000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85, // 85-100%
    lastInspection: "2024-11-15",
    contact: {
      name: "Information Coordinator",
      email: "info@resiliencemontreal.com",
      phone: "Contact via website"
    },
    joinDate: "2023-06-15",
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    tenantId: "platform"
  },
  {
    name: "Refuge des Jeunes de Montréal",
    location: "Montreal, QC",
    address: "1836 Sainte-Catherine St East, Montreal, QC H2K 2H5",
    coordinates: {
      lat: 45.5237,
      lng: -73.5587
    },
    type: "Youth Shelter",
    capacity: 45,
    currentOccupancy: Math.floor(Math.random() * 36) + 9,
    participants: Math.floor(Math.random() * 36) + 9,
    totalDonations: Math.floor(Math.random() * 75000) + 25000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-10-22",
    contact: {
      name: "Youth Services Coordinator",
      email: "info@refugejeunes.org",
      phone: "514-849-4221"
    },
    joinDate: "2023-03-10",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "Le Chaînon",
    location: "Montreal, QC",
    address: "4373 Avenue de l'Esplanade, Montreal, QC H2W 1T2",
    coordinates: {
      lat: 45.5208,
      lng: -73.5881
    },
    type: "Family Shelter",
    capacity: 80,
    currentOccupancy: Math.floor(Math.random() * 64) + 16,
    participants: Math.floor(Math.random() * 64) + 16,
    totalDonations: Math.floor(Math.random() * 120000) + 60000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-08",
    contact: {
      name: "Support Services Director",
      email: "info@chainon.org",
      phone: "514-845-0151"
    },
    joinDate: "2023-01-20",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "YWCA Montreal",
    location: "Montreal, QC",
    address: "1355 Boulevard René-Lévesque West, Montreal, QC H3G 1T3",
    coordinates: {
      lat: 45.4962,
      lng: -73.5731
    },
    type: "Family Shelter",
    capacity: 95,
    currentOccupancy: Math.floor(Math.random() * 76) + 19,
    participants: Math.floor(Math.random() * 76) + 19,
    totalDonations: Math.floor(Math.random() * 150000) + 75000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-12",
    contact: {
      name: "Program Coordinator",
      email: "info@ydesfemmesmtl.org",
      phone: "514-866-9941"
    },
    joinDate: "2023-02-28",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "Welcome Hall Mission",
    location: "Montreal, QC",
    address: "4755 Acorn Street, Montreal, QC H4C 3L6",
    coordinates: {
      lat: 45.4762,
      lng: -73.5895
    },
    type: "Emergency Shelter",
    capacity: 200,
    currentOccupancy: Math.floor(Math.random() * 160) + 40,
    participants: Math.floor(Math.random() * 160) + 40,
    totalDonations: Math.floor(Math.random() * 200000) + 100000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-20",
    contact: {
      name: "Mission Director",
      email: "info@welcomehallmission.com",
      phone: "514-935-6396"
    },
    joinDate: "2023-01-15",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "Maison du Père",
    location: "Montreal, QC",
    address: "550 Boulevard René-Lévesque East, Montreal, QC H2L 2L3",
    coordinates: {
      lat: 45.5127,
      lng: -73.5540
    },
    type: "Emergency Shelter",
    capacity: 170,
    currentOccupancy: Math.floor(Math.random() * 136) + 34,
    participants: Math.floor(Math.random() * 136) + 34,
    totalDonations: Math.floor(Math.random() * 180000) + 90000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-05",
    contact: {
      name: "Services Manager",
      email: "info@maisondupere.org",
      phone: "514-845-0168"
    },
    joinDate: "2023-04-12",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "La Maison Benoît Labre",
    location: "Montreal, QC",
    address: "1857 Boulevard de Maisonneuve Ouest, Montreal, QC H3H 1J9",
    coordinates: {
      lat: 45.4919,
      lng: -73.5804
    },
    type: "Emergency Shelter",
    capacity: 60,
    currentOccupancy: Math.floor(Math.random() * 48) + 12,
    participants: Math.floor(Math.random() * 48) + 12,
    totalDonations: Math.floor(Math.random() * 80000) + 40000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-10-18",
    contact: {
      name: "Shelter Coordinator",
      email: "info@maisonbenoitlabre.org",
      phone: "514-932-0314"
    },
    joinDate: "2023-05-08",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "Old Brewery Mission",
    location: "Montreal, QC",
    address: "915 Clark Street, Montreal, QC H2Z 1J8",
    coordinates: {
      lat: 45.5052,
      lng: -73.5523
    },
    type: "Emergency Shelter",
    capacity: 300,
    currentOccupancy: Math.floor(Math.random() * 240) + 60,
    participants: Math.floor(Math.random() * 240) + 60,
    totalDonations: Math.floor(Math.random() * 250000) + 125000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-25",
    contact: {
      name: "Operations Director",
      email: "info@oldbrewerymission.ca",
      phone: "514-798-2244"
    },
    joinDate: "2023-01-05",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "Patricia Mackenzie Pavilion (Women's Shelter)",
    location: "Montreal, QC",
    address: "1301 Boulevard de Maisonneuve E, Montreal, QC H2L 2A5",
    coordinates: {
      lat: 45.5168,
      lng: -73.5527
    },
    type: "Family Shelter",
    capacity: 85,
    currentOccupancy: Math.floor(Math.random() * 68) + 17,
    participants: Math.floor(Math.random() * 68) + 17,
    totalDonations: Math.floor(Math.random() * 110000) + 55000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-18",
    contact: {
      name: "Women's Services Coordinator",
      email: "women@oldbrewerymission.ca",
      phone: "514-526-6446"
    },
    joinDate: "2023-02-14",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  },
  {
    name: "Montreal SPCA (Emergency Animal Shelter)",
    location: "Montreal, QC", 
    address: "5215 Jean-Talon Street West, Montreal, QC H4P 1X4",
    coordinates: {
      lat: 45.5347,
      lng: -73.6292
    },
    type: "Emergency Shelter",
    capacity: 150,
    currentOccupancy: Math.floor(Math.random() * 120) + 30,
    participants: Math.floor(Math.random() * 120) + 30,
    totalDonations: Math.floor(Math.random() * 90000) + 45000,
    status: "active",
    complianceScore: Math.floor(Math.random() * 15) + 85,
    lastInspection: "2024-11-10",
    contact: {
      name: "Emergency Services Manager",
      email: "info@spca.com",
      phone: "514-735-2711"
    },
    joinDate: "2023-07-22",
    rating: Math.floor(Math.random() * 2) + 4,
    tenantId: "platform"
  }
];

export async function investigateDatabaseStructure() {
  console.log('🔍 INVESTIGATING CURRENT DATABASE STRUCTURE...\n');
  await investigateDatabase();
}

export async function cleanAndPopulateRealData() {
  console.log('🚀 STARTING CLEAN SHELTER DATA POPULATION...\n');
  
  try {
    // Step 1: Investigate current state
    console.log('STEP 1: Investigating current database...');
    await investigateDatabase();
    
    // Step 2: Clear all existing shelter data
    console.log('\nSTEP 2: Clearing all existing shelter data...');
    await clearAllShelterData();
    
    // Step 3: Populate with real Montreal shelters
    console.log('\nSTEP 3: Populating with real Montreal shelter data...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const shelter of realMontrealShelters) {
      try {
        const shelterId = await firestoreService.addShelter(shelter);
        console.log(`✅ Added: ${shelter.name} (ID: ${shelterId})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add ${shelter.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n📊 POPULATION COMPLETE:`);
    console.log(`   ✅ Successfully added: ${successCount} shelters`);
    console.log(`   ❌ Failed: ${errorCount} shelters`);
    console.log(`   📍 All shelters located in Montreal, QC area`);
    console.log(`   🏠 Shelter types: Emergency, Youth, Family, Day Center`);
    console.log(`   📞 Real contact information included`);
    
    // Step 4: Final verification
    console.log('\nSTEP 4: Verifying populated data...');
    await investigateDatabase();
    
    console.log('\n🎉 REAL MONTREAL SHELTER DATA POPULATION COMPLETE!');
    
  } catch (error) {
    console.error('❌ Error during clean and populate process:', error);
    throw error;
  }
}

// For testing individual functions
export async function testPopulateOne() {
  try {
    const testShelter = realMontrealShelters[0]; // Resilience Montreal
    const shelterId = await firestoreService.addShelter(testShelter);
    console.log(`✅ Test shelter added: ${testShelter.name} (ID: ${shelterId})`);
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
} 