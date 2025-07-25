"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Heart, Mail, Phone, Calendar } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// User data interfaces
interface User {
  id: string;
  name: string;
  type: 'participant' | 'donor';
  email: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'pending' | 'verified';
  joinDate: string;
  totalDonations?: number;
  shelterName?: string;
}

// Create user pin icons
const createUserIcon = (type: 'participant' | 'donor', status: string) => {
  const color = type === 'participant' ? '#f97316' : '#16a34a'; // Orange for participants, green for donors
  const iconComponent = type === 'participant' ? Users : Heart;
  
  const iconHtml = ReactDOMServer.renderToString(
    React.createElement(iconComponent, {
      size: 18,
      fill: color,
      stroke: 'white',
      strokeWidth: 2,
      className: 'drop-shadow-lg'
    })
  );
  
  return new DivIcon({
    html: `<div style="background: white; border-radius: 50%; padding: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; border: 2px solid ${color};">${iconHtml}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: `custom-user-marker user-${type}`
  });
};

interface UserMapProps {
  users?: User[];
  className?: string;
  height?: string;
}

// Component to fit map bounds to all users
function FitBounds({ users }: { users: User[] }) {
  const map = useMap();

  useEffect(() => {
    if (users.length > 0) {
      const bounds = new LatLngBounds(
        users.map(user => [user.coordinates.lat, user.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [users, map]);

  return null;
}

// Mock user data for Montreal area
const mockUsers: User[] = [
  // Participants (Orange pins)
  {
    id: '1',
    name: 'Sarah Johnson',
    type: 'participant',
    email: 'sarah.j@email.com',
    location: 'Downtown Montreal',
    coordinates: { lat: 45.5017, lng: -73.5673 },
    status: 'verified',
    joinDate: '2024-03-15',
    shelterName: 'Old Brewery Mission'
  },
  {
    id: '2',
    name: 'Michael Chen',
    type: 'participant',
    email: 'mike.c@email.com',
    location: 'Plateau Montreal',
    coordinates: { lat: 45.5200, lng: -73.5800 },
    status: 'active',
    joinDate: '2024-02-28',
    shelterName: 'Welcome Hall Mission'
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    type: 'participant',
    email: 'maria.r@email.com',
    location: 'Verdun',
    coordinates: { lat: 45.4580, lng: -73.5673 },
    status: 'verified',
    joinDate: '2024-04-10',
    shelterName: 'Maison du Père'
  },
  {
    id: '4',
    name: 'David Thompson',
    type: 'participant',
    email: 'david.t@email.com',
    location: 'Saint-Laurent',
    coordinates: { lat: 45.5088, lng: -73.6789 },
    status: 'pending',
    joinDate: '2024-11-20',
    shelterName: 'Resilience Montreal'
  },
  
  // Donors (Green pins)
  {
    id: '5',
    name: 'Emily Watson',
    type: 'donor',
    email: 'emily.watson@email.com',
    location: 'Westmount',
    coordinates: { lat: 45.4871, lng: -73.5894 },
    status: 'verified',
    joinDate: '2023-08-15',
    totalDonations: 2500
  },
  {
    id: '6',
    name: 'Robert Kim',
    type: 'donor',
    email: 'robert.kim@email.com',
    location: 'Outremont',
    coordinates: { lat: 45.5240, lng: -73.6089 },
    status: 'verified',
    joinDate: '2023-11-22',
    totalDonations: 5200
  },
  {
    id: '7',
    name: 'Jennifer Liu',
    type: 'donor',
    email: 'jennifer.liu@email.com',
    location: 'NDG',
    coordinates: { lat: 45.4700, lng: -73.6100 },
    status: 'active',
    joinDate: '2024-01-08',
    totalDonations: 1800
  },
  {
    id: '8',
    name: 'Marcus Brown',
    type: 'donor',
    email: 'marcus.brown@email.com',
    location: 'Mile End',
    coordinates: { lat: 45.5267, lng: -73.6040 },
    status: 'verified',
    joinDate: '2023-12-03',
    totalDonations: 3400
  },
  {
    id: '9',
    name: 'Sophie Dubois',
    type: 'donor',
    email: 'sophie.dubois@email.com',
    location: 'Rosemont',
    coordinates: { lat: 45.5418, lng: -73.5740 },
    status: 'verified',
    joinDate: '2024-05-18',
    totalDonations: 950
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export default function UserMap({ users = mockUsers, className = '', height = '500px' }: UserMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="flex items-center space-x-2 text-gray-500">
          <MapPin className="h-5 w-5 animate-pulse" />
          <span>Loading user map...</span>
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
        zoom={11}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds users={users} />
        
        {users.map((user) => (
          <Marker
            key={user.id}
            position={[user.coordinates.lat, user.coordinates.lng]}
            icon={createUserIcon(user.type, user.status)}
          >
            <Popup className="user-popup" maxWidth={300}>
              <div className="p-2 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {user.type === 'participant' ? (
                      <Users className="h-5 w-5 text-orange-600" />
                    ) : (
                      <Heart className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(user.status)} variant="secondary">
                    {user.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{user.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">Joined {user.joinDate}</span>
                  </div>

                  {/* Type-specific information */}
                  {user.type === 'participant' && user.shelterName && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {user.shelterName}
                        </span>
                      </div>
                    </div>
                  )}

                  {user.type === 'donor' && user.totalDonations && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          ${user.totalDonations.toLocaleString()} donated
                        </span>
                      </div>
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
            <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">Participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">Donors</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {users.length} total users mapped
          </div>
        </div>
      </div>
    </div>
  );
} 