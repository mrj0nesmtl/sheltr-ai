'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Heart, ExternalLink, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { tenantService, ShelterTenant } from '@/services/tenantService';
import { shelterService, ShelterPublicConfig } from '@/services/shelterService';

export default function SheltersPage() {
  const [sheltersData, setSheltersData] = useState<Array<{ shelter: ShelterTenant; config: ShelterPublicConfig }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShelters = async () => {
      try {
        const publicShelters = await shelterService.getAllPublicShelters();
        setSheltersData(publicShelters);
      } catch (error) {
        console.error('Error loading shelters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShelters();
  }, []);

  const getShelterSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getShelterTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency Shelter':
        return 'bg-red-100 text-red-800';
      case 'Transitional Housing':
        return 'bg-blue-100 text-blue-800';
      case 'Family Shelter':
        return 'bg-green-100 text-green-800';
      case 'Youth Shelter':
        return 'bg-purple-100 text-purple-800';
      case 'Day Center':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const calculateOccupancyPercentage = (current: number, capacity: number) => {
    if (capacity === 0) return 0;
    return Math.round((current / capacity) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-md h-80">
                    <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Affiliated Shelters
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the network of shelters working together to provide safety, support, and hope 
            to those experiencing homelessness across Montreal.
          </p>
          <div className="mt-6 flex justify-center items-center space-x-6">
            <div className="flex items-center text-gray-600">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">{sheltersData.length} Partner Shelters</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">
                {sheltersData.reduce((total, item) => total + item.shelter.capacity, 0)} Total Beds
              </span>
            </div>
          </div>
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sheltersData.map(({ shelter, config }) => {
            const occupancyPercentage = calculateOccupancyPercentage(
              shelter.currentOccupancy, 
              shelter.capacity
            );
            const shelterSlug = config.slug;

            return (
              <Card key={shelter.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Shelter Image/Logo */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600">
                  {config.backgroundImageUrl ? (
                    <Image
                      src={config.backgroundImageUrl}
                      alt={shelter.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      {config.logoUrl ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-white p-2">
                          <Image
                            src={config.logoUrl}
                            alt={`${shelter.name} logo`}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Heart className="h-8 w-8" />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold">{shelter.name}</h3>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{shelter.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {shelter.address}
                      </CardDescription>
                    </div>
                    <Badge className={getShelterTypeColor(shelter.type)}>
                      {shelter.type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Capacity Info */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Capacity</span>
                      <span className={`text-sm font-semibold ${getOccupancyColor(occupancyPercentage)}`}>
                        {shelter.currentOccupancy}/{shelter.capacity} ({occupancyPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          occupancyPercentage >= 90 ? 'bg-red-500' :
                          occupancyPercentage >= 70 ? 'bg-orange-500' :
                          occupancyPercentage >= 50 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  {shelter.contact && (
                    <div className="mb-4 space-y-1">
                      {shelter.contact.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {shelter.contact.phone}
                        </div>
                      )}
                      {shelter.contact.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {shelter.contact.email}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="mb-4">
                    <Badge 
                      variant={shelter.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {shelter.status.charAt(0).toUpperCase() + shelter.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      asChild 
                      className="flex-1"
                      variant="default"
                    >
                      <Link href={`/shelter-${shelterSlug}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Page
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline"
                      size="sm"
                    >
                      <Link href={`/donate?shelter=${shelter.id}`}>
                        <Heart className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {sheltersData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No shelters found</h3>
            <p className="text-gray-500">
              We're working on adding shelter partners to our network.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Partner With Us?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our network of shelters providing transparent, efficient support to those in need.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                <Heart className="h-5 w-5 mr-2" />
                Become a Partner
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
