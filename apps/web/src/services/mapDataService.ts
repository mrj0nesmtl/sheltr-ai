import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { geocodeAddress, getFallbackCoordinates } from './geocodingService';

export interface MapLocation {
  id: string;
  name: string;
  type: 'shelter' | 'participant' | 'donor';
  coordinates: {
    lat: number;
    lng: number;
  };
  status: string;
  email?: string;
  shelter_id?: string;
  shelter_name?: string;
  address?: string;
  location?: string;
  capacity?: number;
  currentOccupancy?: number;
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
}

/**
 * Fetch all shelters with their coordinates (using real geocoding from addresses)
 */
export const getSheltersForMap = async (): Promise<MapLocation[]> => {
  try {
    console.log('🏠 Fetching shelters for map with real geocoding...');
    const sheltersSnapshot = await getDocs(collection(db, 'shelters'));
    
    const shelters: MapLocation[] = [];
    
    // Process each shelter and geocode its address
    for (const doc of sheltersSnapshot.docs) {
      const data = doc.data();
      const address = data.address;
      const name = data.name || 'Unknown Shelter';
      
      if (!address) {
        console.warn(`⚠️ No address found for shelter: ${name}`);
        continue;
      }
      
      console.log(`📍 Processing ${name}: ${address}`);
      
      // Try to geocode the address
      let coordinates;
      try {
        const geocodingResult = await geocodeAddress(address);
        
        if (geocodingResult) {
          coordinates = {
            lat: geocodingResult.lat,
            lng: geocodingResult.lng
          };
          console.log(`✅ Geocoded ${name} -> (${coordinates.lat}, ${coordinates.lng})`);
        } else {
          // Fallback to smart default coordinates based on address
          coordinates = getFallbackCoordinates(address);
          console.log(`🔄 Using fallback coordinates for ${name} -> (${coordinates.lat}, ${coordinates.lng})`);
        }
      } catch (error) {
        console.error(`❌ Geocoding failed for ${name}:`, error);
        coordinates = getFallbackCoordinates(address);
        console.log(`🔄 Using fallback coordinates for ${name} -> (${coordinates.lat}, ${coordinates.lng})`);
      }
      
      shelters.push({
        id: doc.id,
        name,
        type: 'shelter',
        coordinates,
        status: data.status || 'pending',
        address: data.address,
        location: data.location,
        capacity: data.capacity,
        currentOccupancy: data.currentOccupancy,
        contact: data.contact
      });
      
      // Rate limiting: wait 1 second between geocoding requests
      if (sheltersSnapshot.docs.indexOf(doc) < sheltersSnapshot.docs.length - 1) {
        console.log('⏳ Waiting 1s for rate limiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`✅ Successfully processed ${shelters.length} shelters with real coordinates`);
    return shelters;
  } catch (error) {
    console.error('❌ Error fetching shelters for map:', error);
    return [];
  }
};

/**
 * Fetch participants with coordinates (from users and demo_participants)
 */
export const getParticipantsForMap = async (): Promise<MapLocation[]> => {
  try {
    console.log('👥 Fetching participants for map...');
    
    // Get shelters for name mapping
    const sheltersSnapshot = await getDocs(collection(db, 'shelters'));
    const sheltersMap = new Map();
    sheltersSnapshot.forEach(doc => {
      sheltersMap.set(doc.id, doc.data().name || 'Unknown Shelter');
    });
    
    const participants: MapLocation[] = [];
    
    // Get participants from users collection
    const participantsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'participant')
    );
    const participantsSnapshot = await getDocs(participantsQuery);
    
    participantsSnapshot.forEach((doc) => {
      const data = doc.data();
      const shelterId = data.shelter_id;
      
      if (shelterId && sheltersMap.has(shelterId)) {
        // Get shelter coordinates for this participant
        const shelterData = sheltersSnapshot.docs.find(s => s.id === shelterId)?.data();
        const shelterCoords = shelterData?.coordinates;
        
        if (shelterCoords && shelterCoords.lat && shelterCoords.lng) {
          // Add small random offset so participants don't overlap exactly with shelter
          const latOffset = (Math.random() - 0.5) * 0.002; // ~200m radius
          const lngOffset = (Math.random() - 0.5) * 0.002;
          
          participants.push({
            id: doc.id,
            name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Anonymous Participant',
            type: 'participant',
            coordinates: {
              lat: shelterCoords.lat + latOffset,
              lng: shelterCoords.lng + lngOffset
            },
            status: data.status || 'active',
            email: data.email,
            shelter_id: shelterId,
            shelter_name: sheltersMap.get(shelterId)
          });
        }
      }
    });
    
    // Get demo participants (they don't have coordinates, so we'll place them at demo shelters)
    const demoParticipantsSnapshot = await getDocs(collection(db, 'demo_participants'));
    
    demoParticipantsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Place demo participants at Old Brewery Mission coordinates with random offset
      const baseCoords = { lat: 45.5017, lng: -73.5673 };
      const latOffset = (Math.random() - 0.5) * 0.003;
      const lngOffset = (Math.random() - 0.5) * 0.003;
      
      participants.push({
        id: doc.id,
        name: data.name || `Demo Participant ${doc.id.slice(-4)}`,
        type: 'participant',
        coordinates: {
          lat: baseCoords.lat + latOffset,
          lng: baseCoords.lng + lngOffset
        },
        status: data.status || 'active',
        shelter_id: data.shelter_id || 'demo-shelter',
        shelter_name: 'Demo Shelter'
      });
    });
    
    console.log(`✅ Found ${participants.length} participants for map`);
    return participants;
  } catch (error) {
    console.error('❌ Error fetching participants for map:', error);
    return [];
  }
};

/**
 * Fetch donors with coordinates (place them in Montreal area with random distribution)
 */
export const getDonorsForMap = async (): Promise<MapLocation[]> => {
  try {
    console.log('💰 Fetching donors for map...');
    
    const donorsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'donor')
    );
    const donorsSnapshot = await getDocs(donorsQuery);
    
    const donors: MapLocation[] = [];
    
    donorsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Place donors randomly in Montreal area
      const baseCoords = { lat: 45.5017, lng: -73.5673 };
      const latOffset = (Math.random() - 0.5) * 0.02; // ~2km radius
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      donors.push({
        id: doc.id,
        name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Anonymous Donor',
        type: 'donor',
        coordinates: {
          lat: baseCoords.lat + latOffset,
          lng: baseCoords.lng + lngOffset
        },
        status: data.status || 'active',
        email: data.email
      });
    });
    
    console.log(`✅ Found ${donors.length} donors for map`);
    return donors;
  } catch (error) {
    console.error('❌ Error fetching donors for map:', error);
    return [];
  }
};

/**
 * Fetch all map data (shelters, participants, donors)
 */
export const getAllMapData = async (): Promise<MapLocation[]> => {
  try {
    console.log('🗺️ Fetching all map data...');
    
    const [shelters, participants, donors] = await Promise.all([
      getSheltersForMap(),
      getParticipantsForMap(),
      getDonorsForMap()
    ]);
    
    const allData = [...shelters, ...participants, ...donors];
    console.log(`✅ Total map locations: ${allData.length} (${shelters.length} shelters, ${participants.length} participants, ${donors.length} donors)`);
    
    return allData;
  } catch (error) {
    console.error('❌ Error fetching all map data:', error);
    return [];
  }
};
