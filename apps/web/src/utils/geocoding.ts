/**
 * Geocoding Utilities
 * Converts addresses to latitude/longitude coordinates using Google Maps Geocoding API
 */

export interface Coordinates {
  lat: number;
  lng: number;
  geocodedAt?: string;
  source?: 'google' | 'manual' | 'fallback';
}

/**
 * Geocode an address using Google Maps Geocoding API
 * @param address - Full address to geocode
 * @returns Coordinates object or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    console.log(`🌍 Geocoding address: ${address}`);
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key not found');
      return null;
    }
    
    // Add Montreal, Quebec, Canada if not already in address
    let fullAddress = address;
    if (!address.toLowerCase().includes('montreal') && !address.toLowerCase().includes('quebec')) {
      fullAddress = `${address}, Montreal, Quebec, Canada`;
    }
    
    const encodedAddress = encodeURIComponent(fullAddress);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const coordinates: Coordinates = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        geocodedAt: new Date().toISOString(),
        source: 'google'
      };
      
      console.log(`✅ Geocoded: ${address}`);
      console.log(`   → (${coordinates.lat}, ${coordinates.lng})`);
      console.log(`   → Formatted: ${result.formatted_address}`);
      
      return coordinates;
    } else {
      console.warn(`⚠️ Geocoding failed for: ${address}`);
      console.warn(`   Status: ${data.status}`);
      if (data.error_message) {
        console.warn(`   Error: ${data.error_message}`);
      }
      return null;
    }
  } catch (error) {
    console.error(`❌ Geocoding error for "${address}":`, error);
    return null;
  }
}

/**
 * Get fallback coordinates based on Montreal neighborhood keywords
 * @param address - Address to analyze
 * @returns Approximate coordinates for the neighborhood
 */
export function getFallbackCoordinates(address: string): Coordinates {
  const addressLower = address.toLowerCase();
  
  // Montreal neighborhoods with approximate coordinates
  const neighborhoods: Record<string, { lat: number; lng: number }> = {
    'westmount': { lat: 45.4833, lng: -73.5978 },
    'plateau': { lat: 45.5200, lng: -73.5800 },
    'saint-laurent': { lat: 45.5200, lng: -73.5800 },
    'verdun': { lat: 45.4580, lng: -73.5673 },
    'rosemont': { lat: 45.5418, lng: -73.5740 },
    'outremont': { lat: 45.5240, lng: -73.6089 },
    'ndg': { lat: 45.4700, lng: -73.6100 },
    'notre-dame-de-grâce': { lat: 45.4700, lng: -73.6100 },
    'mile end': { lat: 45.5267, lng: -73.6040 },
    'hochelaga': { lat: 45.5500, lng: -73.5400 },
    'ville-marie': { lat: 45.5080, lng: -73.5540 },
    'côte-des-neiges': { lat: 45.4937, lng: -73.6298 },
  };
  
  // Check for neighborhood matches
  for (const [neighborhood, coords] of Object.entries(neighborhoods)) {
    if (addressLower.includes(neighborhood)) {
      console.log(`📍 Using fallback coordinates for ${neighborhood}`);
      return {
        ...coords,
        geocodedAt: new Date().toISOString(),
        source: 'fallback'
      };
    }
  }
  
  // Check for directional keywords
  if (addressLower.includes('east') || addressLower.includes('est')) {
    return { lat: 45.5200, lng: -73.5500, geocodedAt: new Date().toISOString(), source: 'fallback' };
  } else if (addressLower.includes('west') || addressLower.includes('ouest')) {
    return { lat: 45.4995, lng: -73.5848, geocodedAt: new Date().toISOString(), source: 'fallback' };
  }
  
  // Default: Downtown Montreal
  console.log(`📍 Using default downtown Montreal coordinates`);
  return {
    lat: 45.5017,
    lng: -73.5673,
    geocodedAt: new Date().toISOString(),
    source: 'fallback'
  };
}

/**
 * Geocode an address with fallback
 * Tries Google Geocoding API first, falls back to neighborhood-based coordinates
 * @param address - Address to geocode
 * @returns Coordinates (never null)
 */
export async function geocodeAddressWithFallback(address: string): Promise<Coordinates> {
  const coordinates = await geocodeAddress(address);
  
  if (coordinates) {
    return coordinates;
  }
  
  // Fallback to neighborhood-based coordinates
  return getFallbackCoordinates(address);
}

