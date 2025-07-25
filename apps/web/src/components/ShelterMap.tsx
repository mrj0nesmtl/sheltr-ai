"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shelter } from '@/services/firestore';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, Star, Phone, Mail } from 'lucide-react';

// Fix for default markers in React Leaflet
const DefaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom shelter marker icons
const ShelterIcon = new Icon({
  iconUrl: '/shelter-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const PendingShelterIcon = new Icon({
  iconUrl: '/shelter-marker.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: 'pending-shelter-marker opacity-60'
});

interface ShelterMapProps {
  shelters: Shelter[];
  className?: string;
  height?: string;
}

// Component to fit map bounds to all shelters
function FitBounds({ shelters }: { shelters: Shelter[] }) {
  const map = useMap();

  useEffect(() => {
    if (shelters.length > 0) {
      const bounds = new LatLngBounds(
        shelters.map(shelter => [shelter.coordinates.lat, shelter.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, shelters]);

  return null;
}

export default function ShelterMap({ shelters, className = '', height = '500px' }: ShelterMapProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure map only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Loading map...</p>
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

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'text-red-600';
    if (occupancy >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Calculate occupancy percentage
  const getOccupancyPercentage = (shelter: Shelter) => {
    return shelter.capacity > 0 ? Math.round((shelter.currentOccupancy / shelter.capacity) * 100) : 0;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      <MapContainer
        center={[39.8283, -98.5795]} // Center of US
        zoom={4}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {shelters.map((shelter) => (
          <Marker
            key={shelter.id}
            position={[shelter.coordinates.lat, shelter.coordinates.lng]}
            icon={shelter.status === 'active' ? ShelterIcon : PendingShelterIcon}
          >
            <Popup className="shelter-popup" maxWidth={300}>
              <div className="p-2 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{shelter.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {shelter.location}
                    </div>
                  </div>
                  <Badge className={getStatusColor(shelter.status)}>
                    {shelter.status}
                  </Badge>
                </div>

                {/* Address */}
                <div className="text-sm text-gray-600">
                  <Building2 className="h-3 w-3 inline mr-1" />
                  {shelter.address}
                </div>

                {/* Shelter Type */}
                <div className="text-sm">
                  <strong>Type:</strong> {shelter.type}
                </div>

                {/* Capacity & Occupancy */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600">Capacity</div>
                    <div className="font-semibold flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {shelter.capacity}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Occupancy</div>
                    <div className={`font-semibold ${getOccupancyColor(getOccupancyPercentage(shelter))}`}>
                      {getOccupancyPercentage(shelter)}% ({shelter.currentOccupancy})
                    </div>
                  </div>
                </div>

                {/* Rating & Donations */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600">Rating</div>
                    <div className="flex items-center space-x-1">
                      {renderStars(shelter.rating)}
                      <span className="text-xs text-gray-500 ml-1">
                        {shelter.rating > 0 ? shelter.rating.toFixed(1) : 'New'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Donations</div>
                    <div className="font-semibold text-green-600">
                      ${shelter.totalDonations.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="text-sm">
                    <strong>{shelter.contact.name}</strong>
                  </div>
                  <div className="text-xs text-gray-600 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {shelter.contact.email}
                  </div>
                  {shelter.contact.phone && (
                    <div className="text-xs text-gray-600 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {shelter.contact.phone}
                    </div>
                  )}
                </div>

                {/* Compliance Score */}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Compliance Score</span>
                    <span className={`font-semibold ${
                      shelter.complianceScore >= 95 ? 'text-green-600' :
                      shelter.complianceScore >= 85 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {shelter.complianceScore}%
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <FitBounds shelters={shelters} />
      </MapContainer>
    </div>
  );
} 