/**
 * Geocoding service to convert addresses to coordinates
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  display_name?: string;
  confidence?: number;
}

/**
 * Geocode an address using OpenStreetMap Nominatim API
 */
export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  try {
    console.log(`🌍 Geocoding address: ${address}`);
    
    // Clean up the address for better geocoding results
    const cleanAddress = address
      .replace(/\s+/g, ' ')
      .trim();
    
    const encodedAddress = encodeURIComponent(cleanAddress);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=ca`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SHELTR-AI/1.0 (https://sheltr-ai.web.app)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const coordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name,
        confidence: parseFloat(result.importance || '0')
      };
      
      console.log(`✅ Geocoded ${address} -> (${coordinates.lat}, ${coordinates.lng})`);
      return coordinates;
    } else {
      console.warn(`⚠️ No geocoding results found for: ${address}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error geocoding address "${address}":`, error);
    return null;
  }
};

/**
 * Batch geocode multiple addresses with rate limiting
 */
export const batchGeocodeAddresses = async (
  addresses: { id: string; address: string }[]
): Promise<Map<string, GeocodingResult>> => {
  const results = new Map<string, GeocodingResult>();
  
  console.log(`🌍 Batch geocoding ${addresses.length} addresses...`);
  
  for (let i = 0; i < addresses.length; i++) {
    const { id, address } = addresses[i];
    
    try {
      const result = await geocodeAddress(address);
      
      if (result) {
        results.set(id, result);
      }
      
      // Rate limiting: wait 1 second between requests to be respectful to the free API
      if (i < addresses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed to geocode ${id} (${address}):`, error);
    }
  }
  
  console.log(`✅ Successfully geocoded ${results.size}/${addresses.length} addresses`);
  return results;
};

/**
 * Fallback coordinates for Montreal area if geocoding fails
 */
export const getFallbackCoordinates = (address: string): GeocodingResult => {
  // Provide different fallback coordinates based on address content
  const addressLower = address.toLowerCase();
  
  if (addressLower.includes('westmount')) {
    return { lat: 45.4833, lng: -73.5978 }; // Westmount area
  } else if (addressLower.includes('west') || addressLower.includes('ouest')) {
    return { lat: 45.4995, lng: -73.5848 }; // West Montreal
  } else if (addressLower.includes('east') || addressLower.includes('est')) {
    return { lat: 45.5200, lng: -73.5500 }; // East Montreal
  } else if (addressLower.includes('downtown') || addressLower.includes('centre-ville')) {
    return { lat: 45.5017, lng: -73.5673 }; // Downtown Montreal
  } else {
    // Default Montreal coordinates
    return { lat: 45.5017, lng: -73.5673 };
  }
};
