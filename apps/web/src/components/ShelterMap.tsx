"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngBounds, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation, getAllMapData } from '@/services/mapDataService';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, Phone, Mail, Heart, Home } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';



// Create icons for different map location types
const createLocationIcon = (location: MapLocation) => {
  let IconComponent, color, bgColor;
  
  switch (location.type) {
    case 'shelter':
      IconComponent = Home;
      color = location.status === 'active' ? '#dc2626' : '#f59e0b'; // Red for active, amber for pending
      bgColor = 'white';
      break;
    case 'participant':
      IconComponent = Users;
      color = '#3b82f6'; // Blue for participants
      bgColor = 'white';
      break;
    case 'donor':
      IconComponent = Heart;
      color = '#10b981'; // Green for donors
      bgColor = 'white';
      break;
    default:
      IconComponent = MapPin;
      color = '#6b7280'; // Gray for unknown
      bgColor = 'white';
  }
  
  const iconHtml = ReactDOMServer.renderToString(
    <IconComponent 
      size={18} 
      fill={color} 
      stroke="white" 
      strokeWidth={2}
      className="drop-shadow-lg"
    />
  );
  
  return new DivIcon({
    html: `<div style="background: ${bgColor}; border-radius: 50%; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">${iconHtml}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: `custom-${location.type}-marker`
  });
};

interface ShelterMapProps {
  locations?: MapLocation[];
  className?: string;
  height?: string;
}

// Component to fit map bounds to all locations
function FitBounds({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = new LatLngBounds(
        locations.map(location => [location.coordinates.lat, location.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, locations]);

  return null;
}

export default function ShelterMap({ locations: propLocations, className = '', height = '500px' }: ShelterMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [locations, setLocations] = useState<MapLocation[]>(propLocations || []);
  const [loading, setLoading] = useState(!propLocations);

  // Ensure map only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch all map data if not provided via props
  useEffect(() => {
    if (!propLocations) {
      const fetchMapData = async () => {
        setLoading(true);
        try {
          const allData = await getAllMapData();
          setLocations(allData);
        } catch (error) {
          console.error('Error fetching map data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMapData();
    } else {
      setLocations(propLocations);
      setLoading(false);
    }
  }, [propLocations]);

  if (!isClient || loading) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-500">{loading ? 'Loading map data...' : 'Loading map...'}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'shelter': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'participant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'donor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };



  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={[45.5017, -73.5673]} // Center on Montreal where most data is
        zoom={12}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        {/* Dark mode tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={createLocationIcon(location)}
          >
            <Popup className="location-popup" maxWidth={300}>
              <div className="p-2 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{location.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location.location || (location.shelter_name ? `At ${location.shelter_name}` : 'Montreal, QC')}
                    </div>
                  </div>
                  <Badge className={getTypeColor(location.type)}>
                    {location.type}
                  </Badge>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(location.status)}>
                    {location.status}
                  </Badge>
                </div>

                {/* Type-specific content */}
                {location.type === 'shelter' && (
                  <>
                    {/* Address */}
                    {location.address && (
                      <div className="text-sm text-gray-600">
                        <Building2 className="h-3 w-3 inline mr-1" />
                        {location.address}
                      </div>
                    )}

                    {/* Capacity & Occupancy */}
                    {location.capacity && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Capacity</div>
                          <div className="text-lg font-bold text-blue-600">{location.capacity}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Current</div>
                          <div className="text-lg font-bold text-gray-600">
                            {location.currentOccupancy || 0}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    {location.contact && (
                      <div className="border-t pt-3 space-y-2">
                        <div className="font-medium text-gray-700 text-sm">Contact Information</div>
                        
                        {location.contact.name && (
                          <div className="text-sm text-gray-600">
                            <strong>Contact:</strong> {location.contact.name}
                          </div>
                        )}
                        
                        {location.contact.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            <a href={`tel:${location.contact.phone}`} className="hover:text-blue-600">
                              {location.contact.phone}
                            </a>
                          </div>
                        )}
                        
                        {location.contact.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            <a href={`mailto:${location.contact.email}`} className="hover:text-blue-600">
                              {location.contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Participant-specific content */}
                {location.type === 'participant' && (
                  <>
                    {location.shelter_name && (
                      <div className="text-sm text-gray-600">
                        <Home className="h-3 w-3 inline mr-1" />
                        <strong>Shelter:</strong> {location.shelter_name}
                      </div>
                    )}
                    {location.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {location.email}
                      </div>
                    )}
                  </>
                )}

                {/* Donor-specific content */}
                {location.type === 'donor' && (
                  <>
                    {location.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {location.email}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      <Heart className="h-3 w-3 inline mr-1" />
                      <strong>Supporting local shelters</strong>
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        <FitBounds locations={locations} />
      </MapContainer>
    </div>
  );
} 