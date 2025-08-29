'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Users, 
  Heart, 
  Phone, 
  Mail, 
  Clock, 
  Shield,
  Building,
  Calendar,
  Star,
  ChevronLeft,
  ExternalLink,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { tenantService, ShelterTenant } from '@/services/tenantService';
import { shelterService, ShelterPublicConfig } from '@/services/shelterService';

interface ShelterConfig {
  id: string;
  name: string;
  slug: string;
  publicUrl?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  description?: string;
  mission?: string;
  services?: string[];
  qrCode?: {
    url: string;
    storagePath: string;
    donationUrl: string;
    generatedAt: string;
    type: string;
    size?: string;
    format?: string;
  };
  qrCodeClean?: {
    url: string;
    storagePath: string;
    donationUrl: string;
    generatedAt: string;
    type: string;
    size?: string;
    format?: string;
    hasText: boolean;
  };
  operatingHours?: {
    [key: string]: string;
  };
  established?: string;
  certifications?: string[];
  socialMedia?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function ShelterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [shelter, setShelter] = useState<ShelterTenant | null>(null);
  const [shelterConfig, setShelterConfig] = useState<ShelterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const slugToName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const nameToSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const loadShelterData = async () => {
      try {
        // Get shelter and config by slug
        const result = await shelterService.getShelterBySlug(slug);

        if (result) {
          setShelter(result.shelter);
          setShelterConfig(result.config as any); // Type assertion since ShelterConfig is similar to ShelterPublicConfig
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading shelter data:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadShelterData();
    }
  }, [slug]);

  const calculateOccupancyPercentage = (current: number, capacity: number) => {
    if (capacity === 0) return 0;
    return Math.round((current / capacity) * 100);
  };

  const getOccupancyStatus = (percentage: number) => {
    if (percentage >= 95) return { text: 'Full', color: 'bg-red-500 text-white' };
    if (percentage >= 85) return { text: 'Nearly Full', color: 'bg-orange-500 text-white' };
    if (percentage >= 50) return { text: 'Available', color: 'bg-yellow-500 text-white' };
    return { text: 'Available', color: 'bg-green-500 text-white' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-40 bg-gray-300 rounded mb-4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !shelter || !shelterConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shelter Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find a shelter with the name "{slugToName(slug)}".
          </p>
          <Button asChild>
            <Link href="/shelters">
              <ChevronLeft className="h-4 w-4 mr-2" />
              View All Shelters
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const occupancyPercentage = calculateOccupancyPercentage(shelter.currentOccupancy, shelter.capacity);
  const occupancyStatus = getOccupancyStatus(occupancyPercentage);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
        {shelterConfig.backgroundImageUrl && (
          <Image
            src={shelterConfig.backgroundImageUrl}
            alt={shelter.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-between">
          <div className="text-white flex-1">
            <div className="flex items-center mb-4">
              <Button variant="outline" size="sm" asChild className="mr-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link href="/shelters">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  All Shelters
                </Link>
              </Button>
              <Badge className={occupancyStatus.color}>
                {occupancyStatus.text}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{shelter.name}</h1>
            <div className="flex items-center text-lg mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              {shelter.address}
            </div>
            <p className="text-xl text-blue-100 max-w-2xl">
              {shelterConfig.description}
            </p>
          </div>
          
          {/* QR Code Section */}
          {(shelterConfig.qrCodeClean?.url || shelterConfig.qrCode?.url) && (
            <div className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-white rounded-lg p-3 mb-3">
                <Image
                  src={shelterConfig.qrCodeClean?.url || shelterConfig.qrCode?.url || ''}
                  alt={`${shelter.name} donation QR code`}
                  width={120}
                  height={120}
                  className="w-30 h-30"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm mb-1">Quick Donate</p>
                <p className="text-white/80 text-xs">Scan with your phone</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile QR Code Section */}
      {(shelterConfig.qrCodeClean?.url || shelterConfig.qrCode?.url) && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-6">
              <div className="bg-white rounded-lg p-3">
                <Image
                  src={shelterConfig.qrCodeClean?.url || shelterConfig.qrCode?.url || ''}
                  alt={`${shelter.name} donation QR code`}
                  width={80}
                  height={80}
                  className="w-20 h-20"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Quick Donate</p>
                <p className="text-gray-400 text-sm">Scan with your phone</p>
                <Button asChild className="mt-2" size="sm">
                  <Link href={`/donate?shelter=${shelter.id}`}>
                    Donate Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {shelterConfig.mission}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Services We Provide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shelterConfig.services?.map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {shelterConfig.operatingHours && Object.entries(shelterConfig.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  Quick Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Type</div>
                  <Badge variant="outline">{shelter.type}</Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Capacity</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {shelter.currentOccupancy}/{shelter.capacity}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        occupancyPercentage >= 90 ? 'bg-red-500' :
                        occupancyPercentage >= 70 ? 'bg-orange-500' :
                        occupancyPercentage >= 50 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {shelterConfig.established && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Established</div>
                    <div className="text-lg font-semibold text-gray-900">{shelterConfig.established}</div>
                  </div>
                )}

                <Separator />

                {/* Contact Information */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">Contact</div>
                  <div className="space-y-2">
                    {shelter.contact?.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`tel:${shelter.contact.phone}`} className="text-blue-600 hover:underline">
                          {shelter.contact.phone}
                        </a>
                      </div>
                    )}
                    {shelter.contact?.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`mailto:${shelter.contact.email}`} className="text-blue-600 hover:underline">
                          {shelter.contact.email}
                        </a>
                      </div>
                    )}
                    {shelterConfig.socialMedia?.website && (
                      <div className="flex items-center text-sm">
                        <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={shelterConfig.socialMedia.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {shelterConfig.certifications && shelterConfig.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {shelterConfig.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 rounded">
                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm text-green-800">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Donate Button */}
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Our Mission</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your donation helps us provide essential services to those in need.
                </p>
                <Button asChild className="w-full bg-red-500 hover:bg-red-600">
                  <Link href={`/donate?shelter=${shelter.id}`}>
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardContent className="p-6 text-center">
                <Share2 className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">Share This Page</h3>
                <p className="text-xs text-gray-500">
                  Help spread awareness about {shelter.name}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
