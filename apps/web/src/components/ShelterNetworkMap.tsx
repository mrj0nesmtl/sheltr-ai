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

  // Determine if we should use dark mode
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch shelters with coordinates from Firestore
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        console.log('🏠 Fetching shelters from database...');
        setLoading(true);
        
        const sheltersSnapshot = await getDocs(collection(db, 'shelters'));
        const shelterPromises: Promise<ShelterLocation | null>[] = [];
        
        // Fetch each shelter's public config for coordinates
        sheltersSnapshot.forEach((doc) => {
          const shelterPromise = (async () => {
            const data = doc.data();
            if (!data.address || !data.name) {
              return null;
            }
            
            try {
              // Get public config with coordinates
              const publicConfigRef = collection(db, 'shelters', doc.id, 'public_config');
              const configSnapshot = await getDocs(publicConfigRef);
              
              let coordinates = { lat: 45.5017, lng: -73.5673 }; // Default Montreal coordinates
              
              if (!configSnapshot.empty) {
                const configData = configSnapshot.docs[0].data();
                if (configData.coordinates) {
                  coordinates = {
                    lat: configData.coordinates.lat,
                    lng: configData.coordinates.lng
                  };
                  console.log(`✅ ${data.name}: Using stored coordinates (${configData.coordinates.source || 'unknown'})`);
                } else {
                  console.warn(`⚠️ ${data.name}: No coordinates in public_config, using default`);
                }
              } else {
                console.warn(`⚠️ ${data.name}: No public_config found, using default coordinates`);
              }
              
              return {
                id: doc.id,
                name: data.name,
                address: data.address,
                location: data.location || 'Montreal, QC',
                status: data.status || 'pending',
                capacity: data.capacity,
                currentOccupancy: data.currentOccupancy,
                contact: data.contact,
                coordinates
              };
            } catch (error) {
              console.error(`❌ Error loading coordinates for ${data.name}:`, error);
              return {
                id: doc.id,
                name: data.name,
                address: data.address,
                location: data.location || 'Montreal, QC',
                status: data.status || 'pending',
                capacity: data.capacity,
                currentOccupancy: data.currentOccupancy,
                contact: data.contact,
                coordinates: { lat: 45.5017, lng: -73.5673 } // Default
              };
            }
          })();
          
          shelterPromises.push(shelterPromise);
        });
        
        const results = await Promise.all(shelterPromises);
        const validShelters = results.filter((shelter): shelter is ShelterLocation => shelter !== null);
        
        console.log(`✅ Successfully loaded ${validShelters.length} shelters with coordinates`);
        setShelters(validShelters);
        
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
          <span>Loading shelter map...</span>
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
