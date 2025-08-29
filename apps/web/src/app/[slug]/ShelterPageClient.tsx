'use client';

import { useState, useEffect } from 'react';
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
  };
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  capacity?: {
    total: number;
    available: number;
    men?: number;
    women?: number;
    families?: number;
  };
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
      is24Hours?: boolean;
      isClosed?: boolean;
    };
  };
  eligibility?: string[];
  amenities?: string[];
  languages?: string[];
  accessibility?: string[];
  programs?: Array<{
    name: string;
    description: string;
    schedule?: string;
  }>;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  lastUpdated?: string;
  verified?: boolean;
  publiclyVisible?: boolean;
}

interface ShelterPageClientProps {
  slug: string;
}

export default function ShelterPageClient({ slug }: ShelterPageClientProps) {
  const [shelter, setShelter] = useState<ShelterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShelterData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to get shelter data from tenant service
        const tenants = await tenantService.getAllShelterTenants();
        const matchingShelter = tenants.find(tenant => 
          tenant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === slug ||
          tenant.id === slug
        );

        if (matchingShelter) {
          // Get additional shelter configuration if available
          try {
            const publicConfig = await shelterService.getPublicConfig(matchingShelter.id);
            
            const shelterConfig: ShelterConfig = {
              id: matchingShelter.id,
              name: matchingShelter.name,
              slug,
              publicUrl: publicConfig?.publicUrl || `/${slug}`,
              logoUrl: publicConfig?.logoUrl || '/icon.svg',
              description: publicConfig?.description || matchingShelter.description,
              mission: publicConfig?.mission,
              services: publicConfig?.services || [],
              address: {
                street: matchingShelter.address?.street || '',
                city: matchingShelter.address?.city || 'Montreal',
                province: matchingShelter.address?.province || 'QC',
                postalCode: matchingShelter.address?.postalCode || '',
                coordinates: matchingShelter.address?.coordinates
              },
              contact: {
                phone: matchingShelter.contact?.phone,
                email: matchingShelter.contact?.email,
                website: matchingShelter.contact?.website
              },
              capacity: {
                total: matchingShelter.capacity?.total || 0,
                available: matchingShelter.capacity?.available || 0
              },
              operatingHours: publicConfig?.operatingHours,
              eligibility: publicConfig?.eligibility || [],
              amenities: publicConfig?.amenities || [],
              languages: publicConfig?.languages || ['English', 'French'],
              accessibility: publicConfig?.accessibility || [],
              programs: publicConfig?.programs || [],
              socialMedia: publicConfig?.socialMedia,
              qrCode: publicConfig?.qrCode,
              qrCodeClean: publicConfig?.qrCodeClean,
              lastUpdated: publicConfig?.lastUpdated || new Date().toISOString(),
              verified: publicConfig?.verified || false,
              publiclyVisible: publicConfig?.publiclyVisible !== false
            };

            setShelter(shelterConfig);
          } catch (configError) {
            console.warn('Could not fetch shelter public config:', configError);
            
            // Fallback to basic shelter info
            const basicShelter: ShelterConfig = {
              id: matchingShelter.id,
              name: matchingShelter.name,
              slug,
              description: matchingShelter.description || 'Supporting individuals experiencing homelessness in Montreal.',
              address: {
                street: matchingShelter.address?.street || '',
                city: matchingShelter.address?.city || 'Montreal',
                province: matchingShelter.address?.province || 'QC',
                postalCode: matchingShelter.address?.postalCode || ''
              },
              capacity: {
                total: matchingShelter.capacity?.total || 0,
                available: matchingShelter.capacity?.available || 0
              },
              languages: ['English', 'French'],
              publiclyVisible: true
            };
            
            setShelter(basicShelter);
          }
        } else {
          setError('Shelter not found');
        }
      } catch (err) {
        console.error('Error fetching shelter data:', err);
        setError('Failed to load shelter information');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchShelterData();
    }
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && shelter) {
      try {
        await navigator.share({
          title: shelter.name,
          text: shelter.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shelter information...</p>
        </div>
      </div>
    );
  }

  if (error || !shelter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold mb-2">Shelter Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The shelter you\'re looking for doesn\'t exist or isn\'t publicly available.'}
          </p>
          <Link href="/shelters">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Browse All Shelters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!shelter.publiclyVisible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Private Shelter</h1>
          <p className="text-muted-foreground mb-6">
            This shelter's information is not publicly available.
          </p>
          <Link href="/shelters">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Browse Public Shelters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/shelters" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Shelters
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-64 sm:h-80 bg-cover bg-center"
        style={{
          backgroundImage: shelter.backgroundImageUrl 
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${shelter.backgroundImageUrl})`
            : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            {shelter.logoUrl && (
              <div className="mb-4">
                <Image
                  src={shelter.logoUrl}
                  alt={`${shelter.name} logo`}
                  width={80}
                  height={80}
                  className="mx-auto rounded-lg"
                />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{shelter.name}</h1>
            {shelter.description && (
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {shelter.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Quick Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {shelter.address?.street && `${shelter.address.street}, `}
                    {shelter.address?.city || 'Montreal'}, {shelter.address?.province || 'QC'}
                    {shelter.address?.postalCode && ` ${shelter.address.postalCode}`}
                  </span>
                </div>
                
                {shelter.capacity && shelter.capacity.total > 0 && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Capacity: {shelter.capacity.total} beds
                      {shelter.capacity.available !== undefined && (
                        <span className="text-muted-foreground ml-1">
                          ({shelter.capacity.available} available)
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {shelter.contact?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${shelter.contact.phone}`} className="text-sm hover:underline">
                      {shelter.contact.phone}
                    </a>
                  </div>
                )}

                {shelter.contact?.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${shelter.contact.email}`} className="text-sm hover:underline">
                      {shelter.contact.email}
                    </a>
                  </div>
                )}

                {shelter.contact?.website && (
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={shelter.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            {shelter.services && shelter.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {shelter.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Programs */}
            {shelter.programs && shelter.programs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shelter.programs.map((program, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-semibold">{program.name}</h4>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                      {program.schedule && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {program.schedule}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation QR Code */}
            {(shelter.qrCode || shelter.qrCodeClean) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Support This Shelter
                  </CardTitle>
                  <CardDescription>
                    Scan to make a direct donation
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <Image
                      src={shelter.qrCodeClean?.url || shelter.qrCode?.url || ''}
                      alt={`QR Code for ${shelter.name}`}
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Donations follow our SmartFund™ 80-15-5 model
                  </p>
                  {shelter.qrCode?.donationUrl && (
                    <Link href={shelter.qrCode.donationUrl} className="block mt-3">
                      <Button size="sm" className="w-full">
                        Donate Online
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Operating Hours */}
            {shelter.operatingHours && (
              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(shelter.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize">{day}</span>
                      <span>
                        {hours.isClosed ? 'Closed' : 
                         hours.is24Hours ? '24 Hours' : 
                         `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {shelter.languages && shelter.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages Spoken</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {shelter.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accessibility */}
            {shelter.accessibility && shelter.accessibility.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {shelter.accessibility.map((feature, index) => (
                      <div key={index} className="text-sm flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification Status */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                  {shelter.verified ? (
                    <div className="flex items-center text-green-600">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Verified Shelter</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Pending Verification</span>
                    </div>
                  )}
                </div>
                {shelter.lastUpdated && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Last updated: {new Date(shelter.lastUpdated).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
