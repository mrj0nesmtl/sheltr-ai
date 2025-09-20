"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, TrendingDown, Building2, Users, DollarSign, Heart } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface GeographicRegion {
  region: string;
  shelters: number;
  participants: number;
  donations: number;
  growth: number;
  hasData: boolean;
}

interface GeographicMapProps {
  geographicData: GeographicRegion[];
}

// Geographic location data for regions
interface RegionLocation {
  region: string;
  coordinates: { lat: number; lng: number };
  shelters: number;
  participants: number;
  donations: number;
  growth: number;
  hasData: boolean;
}

// Create region activity icons
const createRegionIcon = (region: GeographicRegion) => {
  const getColor = () => {
    if (!region.hasData) return '#6b7280'; // Gray
    if (region.donations > 5000) return '#16a34a'; // Green
    if (region.donations > 1000) return '#3b82f6'; // Blue  
    return '#f97316'; // Orange
  };

  const getSize = () => {
    if (region.donations > 5000) return 40;
    if (region.donations > 1000) return 32;
    if (region.donations > 100) return 24;
    return 20;
  };

  const color = getColor();
  const size = getSize();
  
  const iconHtml = ReactDOMServer.renderToString(
    React.createElement(region.hasData ? Heart : MapPin, {
      size: size * 0.6,
      fill: color,
      stroke: 'white',
      strokeWidth: 2,
      className: 'drop-shadow-lg'
    })
  );
  
  return new DivIcon({
    html: `<div style="background: white; border-radius: 50%; padding: ${size * 0.15}px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; border: 2px solid ${color};">${iconHtml}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className: `custom-region-marker region-${region.hasData ? 'active' : 'inactive'}`
  });
};

// Component to fit map bounds to all regions
function FitBounds({ regions }: { regions: RegionLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (regions.length > 0) {
      const bounds = new LatLngBounds(
        regions.map(region => [region.coordinates.lat, region.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [regions, map]);

  return null;
}

export function GeographicMap({ geographicData }: GeographicMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert data to region locations with coordinates
  const regionLocations: RegionLocation[] = geographicData.map(item => {
    // Define approximate center coordinates for each region
    const getRegionCoordinates = (region: string) => {
      switch (region.toLowerCase()) {
        case 'north america':
          return { lat: 45.5017, lng: -73.5673 }; // Montreal (primary market)
        case 'europe':
          return { lat: 48.8566, lng: 2.3522 }; // Paris
        case 'asia pacific':
          return { lat: 35.6762, lng: 139.6503 }; // Tokyo
        case 'other':
        case 'other regions':
          return { lat: -33.8688, lng: 151.2093 }; // Sydney
        default:
          return { lat: 45.5017, lng: -73.5673 }; // Default to Montreal
      }
    };

    return {
      ...item,
      coordinates: getRegionCoordinates(item.region)
    };
  });

  const getStatusColor = (region: GeographicRegion) => {
    if (!region.hasData) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    if (region.donations > 5000) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (region.donations > 1000) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
  };

  const getActivityLabel = (region: GeographicRegion) => {
    if (!region.hasData) return 'No Data';
    if (region.donations > 5000) return 'High Activity';
    if (region.donations > 1000) return 'Medium Activity';
    return 'Low Activity';
  };

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center h-96">
          <div className="flex items-center space-x-2 text-gray-500">
            <MapPin className="h-5 w-5 animate-pulse" />
            <span>Loading geographic map...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Leaflet Map */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Global Platform Reach
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive map showing SHELTR platform activity worldwide
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <MapContainer
              center={[20, 0]} // Global view center
              zoom={2}
              style={{ height: '500px', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <FitBounds regions={regionLocations} />
              
              {regionLocations.map((region) => (
                <Marker
                  key={region.region}
                  position={[region.coordinates.lat, region.coordinates.lng]}
                  icon={createRegionIcon(region)}
                >
                  <Popup className="region-popup" maxWidth={300}>
                    <div className="p-3 space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{region.region}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Platform Region</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(region)} variant="secondary">
                          {getActivityLabel(region)}
                        </Badge>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">Shelters</span>
                          </div>
                          <span className="font-medium">{region.shelters}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-700 dark:text-gray-300">Participants</span>
                          </div>
                          <span className="font-medium">{region.participants.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">Total Donations</span>
                          </div>
                          <span className="font-medium">${region.donations.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {region.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-gray-700 dark:text-gray-300">Growth Rate</span>
                          </div>
                          <span className={`font-medium ${region.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {region.growth > 0 ? '+' : ''}{region.growth}%
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Status: <span className="font-medium">{region.hasData ? 'Active' : 'Planning Phase'}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Map Legend */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 dark:text-gray-300">High Activity ($5K+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 dark:text-gray-300">Medium Activity ($1K+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 dark:text-gray-300">Low Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 dark:text-gray-300">No Data</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {geographicData.filter(region => region.hasData).length} active regions
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {geographicData.filter(region => region.hasData).map((region) => (
          <Card key={region.region} className="overflow-hidden border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{region.region}</CardTitle>
                <Badge variant={region.growth > 0 ? "default" : "secondary"} className="flex items-center gap-1">
                  {region.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {region.growth}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-2">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{region.shelters}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Shelters</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg mx-auto mb-2">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{region.participants}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Participants</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg mx-auto mb-2">
                    <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${region.donations.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Donations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Global Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {geographicData.reduce((sum, region) => sum + region.shelters, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Shelters</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {geographicData.reduce((sum, region) => sum + region.participants, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${geographicData.reduce((sum, region) => sum + region.donations, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Donations</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {geographicData.filter(region => region.hasData).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Regions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}