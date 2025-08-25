"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Phone, Mail, Building2, Users } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from 'next-themes';

// Shelter data interface
interface ShelterLocation {
  id: string;
  name: string;
  address: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'pending' | 'inactive';
  capacity?: number;
  currentOccupancy?: number;
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
}

// Create shelter pin icon
const createShelterIcon = (status: string) => {
  const color = status === 'active' ? '#dc2626' : status === 'pending' ? '#f59e0b' : '#6b7280';
  
  const iconHtml = ReactDOMServer.renderToString(
    React.createElement(Home, {
      size: 20,
      fill: color,
      stroke: 'white',
      strokeWidth: 2,
      className: 'drop-shadow-lg'
    })
  );
  
  return new DivIcon({
    html: `<div style="background: white; border-radius: 50%; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; border: 2px solid ${color};">${iconHtml}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: `custom-shelter-marker shelter-${status}`
  });
};

interface ShelterNetworkMapProps {
  className?: string;
  height?: string;
  refreshTrigger?: number; // Used to trigger refresh from parent component
}

// Component to fit map bounds to all shelters
function FitBounds({ shelters }: { shelters: ShelterLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (shelters.length > 0) {
      const bounds = new LatLngBounds(
        shelters.map(shelter => [shelter.coordinates.lat, shelter.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [shelters, map]);

  return null;
}

/**
 * Geocode an address using Google Maps Geocoding API
 */
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    console.log(`🌍 Geocoding with Google Maps: ${address}`);
    
    // Get the Google Maps API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key not found, using fallback coordinates');
      return null;
    }
    
    const encodedAddress = encodeURIComponent(address + ', Montreal, Quebec, Canada');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const coordinates = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      };
      
      console.log(`✅ Google geocoded ${address} -> (${coordinates.lat}, ${coordinates.lng})`);
      console.log(`📍 Formatted address: ${result.formatted_address}`);
      return coordinates;
    } else {
      console.warn(`⚠️ Google geocoding failed for: ${address} (Status: ${data.status})`);
      if (data.error_message) {
        console.warn(`   Error: ${data.error_message}`);
      }
      return null;
    }
  } catch (error) {
    console.error(`❌ Google geocoding error for "${address}":`, error);
    return null;
  }
};

/**
 * Get fallback coordinates based on address content
 */
const getFallbackCoordinates = (address: string): { lat: number; lng: number } => {
  const addressLower = address.toLowerCase();
  
  // Montreal neighborhoods with approximate coordinates
  if (addressLower.includes('westmount')) {
    return { lat: 45.4833, lng: -73.5978 };
  } else if (addressLower.includes('plateau') || addressLower.includes('saint-laurent')) {
    return { lat: 45.5200, lng: -73.5800 };
  } else if (addressLower.includes('verdun')) {
    return { lat: 45.4580, lng: -73.5673 };
  } else if (addressLower.includes('rosemont')) {
    return { lat: 45.5418, lng: -73.5740 };
  } else if (addressLower.includes('outremont')) {
    return { lat: 45.5240, lng: -73.6089 };
  } else if (addressLower.includes('ndg') || addressLower.includes('notre-dame-de-grâce')) {
    return { lat: 45.4700, lng: -73.6100 };
  } else if (addressLower.includes('mile end')) {
    return { lat: 45.5267, lng: -73.6040 };
  } else if (addressLower.includes('east') || addressLower.includes('est')) {
    return { lat: 45.5200, lng: -73.5500 };
  } else if (addressLower.includes('west') || addressLower.includes('ouest')) {
    return { lat: 45.4995, lng: -73.5848 };
  } else {
    // Default downtown Montreal
    return { lat: 45.5017, lng: -73.5673 };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export default function ShelterNetworkMap({ className = '', height = '600px', refreshTrigger = 0 }: ShelterNetworkMapProps) {
  const { theme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [shelters, setShelters] = useState<ShelterLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });

  // Determine if we should use dark mode
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch and geocode shelters with persistence
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        console.log('🏠 Fetching shelters from database...');
        setLoading(true);
        
        const sheltersSnapshot = await getDocs(collection(db, 'shelters'));
        const shelterData: Omit<ShelterLocation, 'coordinates'>[] = [];
        
        sheltersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.address && data.name) {
            shelterData.push({
              id: doc.id,
              name: data.name,
              address: data.address,
              location: data.location || 'Montreal, QC',
              status: data.status || 'pending',
              capacity: data.capacity,
              currentOccupancy: data.currentOccupancy,
              contact: data.contact
            });
          }
        });
        
        console.log(`📍 Found ${shelterData.length} shelters`);
        
        // Check for cached coordinates
        const cacheKey = 'sheltr-geocoded-coordinates';
        const cachedData = localStorage.getItem(cacheKey);
        let coordinatesCache: Record<string, { lat: number; lng: number; timestamp: number }> = {};
        
        if (cachedData && refreshTrigger === 0) {
          try {
            coordinatesCache = JSON.parse(cachedData);
            console.log('📦 Found cached geocoding data');
          } catch {
            console.warn('⚠️ Invalid cached data, will re-geocode');
          }
        }
        
        const geocodedShelters: ShelterLocation[] = [];
        let needsGeocoding = 0;
        
        // Check which shelters need geocoding
        for (const shelter of shelterData) {
          const cached = coordinatesCache[shelter.address];
          const isExpired = cached && (Date.now() - cached.timestamp > 7 * 24 * 60 * 60 * 1000); // 7 days
          
          if (!cached || isExpired || refreshTrigger > 0) {
            needsGeocoding++;
          }
        }
        
        if (needsGeocoding > 0) {
          console.log(`🌍 Need to geocode ${needsGeocoding} shelters`);
          setGeocodingProgress({ current: 0, total: needsGeocoding });
        }
        
        let currentIndex = 0;
        
        // Process each shelter
        for (const shelter of shelterData) {
          const cached = coordinatesCache[shelter.address];
          const isExpired = cached && (Date.now() - cached.timestamp > 7 * 24 * 60 * 60 * 1000);
          
          let coordinates;
          
          if (cached && !isExpired && refreshTrigger === 0) {
            // Use cached coordinates
            coordinates = { lat: cached.lat, lng: cached.lng };
            console.log(`💾 Using cached coordinates for ${shelter.name}`);
          } else {
            // Geocode fresh coordinates
            currentIndex++;
            setGeocodingProgress({ current: currentIndex, total: needsGeocoding });
            
            coordinates = await geocodeAddress(shelter.address);
            
            if (!coordinates) {
              coordinates = getFallbackCoordinates(shelter.address);
              console.log(`🔄 Using fallback coordinates for ${shelter.name}`);
            }
            
            // Cache the coordinates
            coordinatesCache[shelter.address] = {
              lat: coordinates.lat,
              lng: coordinates.lng,
              timestamp: Date.now()
            };
            
            // Rate limiting: wait 1 second between requests
            if (currentIndex < needsGeocoding) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          geocodedShelters.push({
            ...shelter,
            coordinates
          });
        }
        
        // Save updated cache
        localStorage.setItem(cacheKey, JSON.stringify(coordinatesCache));
        
        console.log(`✅ Successfully processed ${geocodedShelters.length} shelters (${needsGeocoding} newly geocoded)`);
        setShelters(geocodedShelters);
        
      } catch (error) {
        console.error('❌ Error fetching shelters:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchShelters();
    }
  }, [isClient, refreshTrigger]);

  if (!isClient || loading) {
    return (
      <div className={`w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="flex flex-col items-center space-y-2 text-gray-500">
          <MapPin className="h-8 w-8 animate-pulse" />
          {loading && geocodingProgress.total > 0 ? (
            <div className="text-center">
              <div>Geocoding shelters...</div>
              <div className="text-sm">
                {geocodingProgress.current} of {geocodingProgress.total}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Other locations loaded from cache
              </div>
            </div>
          ) : (
            <span>Loading shelter map...</span>
          )}
        </div>
      </div>
    );
  }

  // Default center (Montreal)
  const defaultCenter: [number, number] = [45.5017, -73.5673];

  return (
    <div className={`w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        {/* Dynamic tile layer based on theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            isDarkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          key={isDarkMode ? 'dark' : 'light'} // Force re-render when theme changes
        />
        
        <FitBounds shelters={shelters} />
        
        {shelters.map((shelter) => (
          <Marker
            key={shelter.id}
            position={[shelter.coordinates.lat, shelter.coordinates.lng]}
            icon={createShelterIcon(shelter.status)}
          >
            <Popup className="shelter-popup" maxWidth={350}>
              <div className="p-3 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{shelter.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shelter.location}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(shelter.status)} variant="secondary">
                    {shelter.status}
                  </Badge>
                </div>

                {/* Address */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{shelter.address}</span>
                  </div>
                  
                  {/* Capacity Info */}
                  {shelter.capacity && (
                    <div className="flex items-center space-x-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Capacity: {shelter.capacity}
                        </span>
                      </div>
                      {shelter.currentOccupancy !== undefined && (
                        <div className="text-gray-700 dark:text-gray-300">
                          Current: {shelter.currentOccupancy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact Information */}
                  {shelter.contact && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                      <div className="font-medium text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                        Contact Information
                      </div>
                      
                      {shelter.contact.name && (
                        <div className="text-gray-700 dark:text-gray-300">
                          <strong>Contact:</strong> {shelter.contact.name}
                        </div>
                      )}
                      
                      {shelter.contact.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`tel:${shelter.contact.phone}`} 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            {shelter.contact.phone}
                          </a>
                        </div>
                      )}
                      
                      {shelter.contact.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`mailto:${shelter.contact.email}`} 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            {shelter.contact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">Active Shelters</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">Pending Approval</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">Inactive</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {shelters.length} shelters mapped
          </div>
        </div>
      </div>
    </div>
  );
}
