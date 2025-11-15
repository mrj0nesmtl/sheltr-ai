'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import PublicNavigation from '@/components/PublicNavigation';
import { 
  MapPin, 
  Users, 
  Heart, 
  Phone, 
  Mail, 
  Clock, 
  Shield,
  Building,
  ChevronLeft,
  Share2,
  CheckCircle,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  Youtube,
  Linkedin,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { tenantService, ShelterTenant } from '@/services/tenantService';
import { shelterService, ShelterPublicConfig } from '@/services/shelterService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ShelterConfig {
  id: string;
  name: string;
  slug?: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  available_beds?: number;
  services: string[];
  operating_hours?: {
    [key: string]: { open: string; close: string };
  };
  check_in_time?: string;
  check_out_time?: string;
  languages?: string[];
  amenities?: string[];
  social_media?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  images?: string[];
  logo?: string;
  verified?: boolean;
  status?: string;
  created_at?: string;
  lastUpdated?: string;
  qr_code?: string;
}

// Service icon mapping with Lucide icons
const SERVICE_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'Emergency Shelter': Building,
  'Emergency Overnight Shelter': Building,
  'Meals and Basic Necessities': Heart,
  'Meals (3x daily)': Heart,
  'Case Management Services': Users,
  'Case Management': Users,
  'Mental Health Support': Heart,
  'Mental Health Counseling': Heart,
  'Job Training Programs': Users,
  'Job Training': Users,
  'Housing Assistance': Building,
  'Medical Care Coordination': Heart,
  'Medical Care': Heart,
  'Substance Abuse Support': Heart,
  'Legal Aid': CheckCircle,
  'default': Building
};

function getServiceIcon(serviceName: string) {
  const Icon = SERVICE_ICONS[serviceName] || SERVICE_ICONS['default'];
  return Icon;
}

interface ShelterPageClientProps {
  slug: string;
}

export default function ShelterPageClient({ slug }: ShelterPageClientProps) {
  const [shelter, setShelter] = useState<ShelterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState<number>(0);
  
  // Email signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');

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
          // Try to get public config first
          let publicConfig: ShelterPublicConfig | null = null;
          try {
            publicConfig = await shelterService.getShelterPublicConfig(matchingShelter.id);
          } catch (configError) {
            console.log('No public config found, using tenant data directly');
          }

          const shelterData: ShelterConfig = {
            id: matchingShelter.id,
            name: matchingShelter.name,
            description: publicConfig?.description || matchingShelter.address || 'A safe, supportive emergency shelter providing services to individuals experiencing homelessness.',
            address: publicConfig?.address || matchingShelter.address || '',
            city: publicConfig?.city || matchingShelter.city || '',
            province: publicConfig?.province || matchingShelter.province || '',
            postal_code: publicConfig?.postal_code || matchingShelter.postal_code || '',
            phone: publicConfig?.phone || matchingShelter.phone || '',
            email: publicConfig?.email || matchingShelter.email || '',
            website: publicConfig?.website,
            capacity: publicConfig?.capacity || 300,
            available_beds: publicConfig?.available_beds || 50,
            services: publicConfig?.services || [
              'Emergency Overnight Shelter',
              'Meals and Basic Necessities',
              'Case Management Services',
              'Mental Health Support',
              'Job Training Programs',
              'Housing Assistance',
              'Medical Care Coordination',
              'Substance Abuse Support'
            ],
            operating_hours: publicConfig?.operating_hours,
            check_in_time: publicConfig?.check_in_time || '8:00 PM',
            check_out_time: publicConfig?.check_out_time || '7:00 AM',
            languages: publicConfig?.languages || ['English', 'French'],
            amenities: publicConfig?.amenities,
            social_media: publicConfig?.social_media,
            images: publicConfig?.images,
            logo: publicConfig?.logo,
            verified: publicConfig?.verified ?? true,
            status: publicConfig?.status || 'active',
            lastUpdated: publicConfig?.last_updated,
            qr_code: publicConfig?.qrCode?.url || publicConfig?.qr_code // Support both qrCode object and legacy qr_code string
          };
          
          setShelter(shelterData);
          
          // Get participant count from tenant document (public data)
          // This avoids security rule issues with querying the users collection
          setParticipantCount(matchingShelter.participants || 0);
          console.log(`📊 Participant count for ${matchingShelter.name}: ${matchingShelter.participants || 0}`);
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shelter || !signupEmail) {
      return;
    }
    
    setIsSubmittingSignup(true);
    setSignupMessage('');
    
    try {
      const { createShelterEmailSignup } = await import('@/services/notificationService');
      
      await createShelterEmailSignup({
        email: signupEmail,
        name: signupName || undefined,
        shelter_id: shelter.id,
        shelter_name: shelter.name
      });
      
      setSignupMessage('✅ Thank you for signing up! We\'ll keep you updated.');
      setSignupEmail('');
      setSignupName('');
    } catch (error) {
      console.error('Error submitting email signup:', error);
      setSignupMessage('❌ Sorry, there was an error. Please try again.');
    } finally {
      setIsSubmittingSignup(false);
    }
  };

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
            {error || "We couldn't find the shelter you're looking for."}
          </p>
          <Link href="/shelters">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Shelters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (shelter.status !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Shelter Unavailable</h1>
          <p className="text-muted-foreground mb-6">
            This shelter&apos;s public page is currently unavailable.
          </p>
          <Link href="/shelters">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Shelters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <PublicNavigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-background rounded-2xl border-2 border-border shadow-lg mb-6">
            {shelter.logo ? (
              <Image src={shelter.logo} alt={shelter.name} width={64} height={64} className="rounded-lg" />
            ) : (
              <Building className="h-12 w-12 text-primary" />
            )}
          </div>

          {/* Shelter Name with Verified Badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{shelter.name}</h1>
            {shelter.verified && (
              <Badge 
                variant="outline" 
                className="border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 text-sm font-medium px-3 py-1"
              >
                <Shield className="h-3.5 w-3.5 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {shelter.description}
          </p>

          {/* Participants Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full">
            <Users className="h-4 w-4" />
            <span className="font-medium">
              {participantCount} {participantCount === 1 ? 'participant' : 'participants'} enrolled
            </span>
            <span className="text-sm text-muted-foreground">(Real Data)</span>
          </div>
        </div>

        {/* Images Gallery (if available) */}
        {shelter.images && shelter.images.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shelter.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image 
                    src={image} 
                    alt={`${shelter.name} - Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid - Redesigned Balanced Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Services & Operating Info */}
          <div className="space-y-6">
            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Services We Provide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {shelter.services.map((service, index) => {
                    const IconComponent = getServiceIcon(service);
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{service}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Hours & Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-medium">Check-in Time:</span>
                    <span className="text-muted-foreground">{shelter.check_in_time || '8:00 PM'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-medium">Check-out Time:</span>
                    <span className="text-muted-foreground">{shelter.check_out_time || '7:00 AM'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Operating Hours:</span>
                    <Badge variant="outline">
                      {typeof shelter.operating_hours === 'string' 
                        ? shelter.operating_hours 
                        : shelter.operating_hours && typeof shelter.operating_hours === 'object' && Object.keys(shelter.operating_hours).length > 0
                        ? 'See schedule'
                        : '24/7'}
                    </Badge>
                  </div>
                  {shelter.operating_hours && typeof shelter.operating_hours === 'object' && Object.keys(shelter.operating_hours).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                      {Object.entries(shelter.operating_hours).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex justify-between items-center py-1">
                          <span className="text-sm font-medium capitalize">{day}</span>
                          <span className="text-sm text-muted-foreground">
                            {typeof hours === 'object' && hours.open && hours.close 
                              ? `${hours.open} - ${hours.close}` 
                              : hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            {shelter.languages && shelter.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Languages Spoken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {shelter.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">{language}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media - Public Links */}
            {shelter.social_media && Object.values(shelter.social_media).some(link => link) && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Share2 className="h-5 w-5" />
                    Connect With Us
                  </CardTitle>
                  <CardDescription>Follow us on social media for updates and news</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {shelter.social_media.facebook && (
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all"
                        asChild
                      >
                        <a href={shelter.social_media.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-6 w-6 text-blue-600" />
                          <span className="text-xs font-medium">Facebook</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.twitter && (
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                        asChild
                      >
                        <a href={shelter.social_media.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-6 w-6 text-gray-900 dark:text-white" />
                          <span className="text-xs font-medium">X</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.instagram && (
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/50 transition-all"
                        asChild
                      >
                        <a href={shelter.social_media.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-6 w-6 text-pink-600" />
                          <span className="text-xs font-medium">Instagram</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.youtube && (
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
                        asChild
                      >
                        <a href={shelter.social_media.youtube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-6 w-6 text-red-600" />
                          <span className="text-xs font-medium">YouTube</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.linkedin && (
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all"
                        asChild
                      >
                        <a href={shelter.social_media.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-6 w-6 text-blue-700" />
                          <span className="text-xs font-medium">LinkedIn</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.tiktok && (
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                        asChild
                      >
                        <a href={shelter.social_media.tiktok} target="_blank" rel="noopener noreferrer">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          <span className="text-xs font-medium">TikTok</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact, Social, QR, & Map */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">{shelter.address}</p>
                    <p className="text-muted-foreground">{shelter.city}, {shelter.province} {shelter.postal_code}</p>
                  </div>
                </div>

                {/* Phone */}
                {shelter.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a href={`tel:${shelter.phone}`} className="text-sm hover:text-primary transition-colors font-medium">
                      {shelter.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {shelter.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a href={`mailto:${shelter.email}`} className="text-sm hover:text-primary transition-colors break-all">
                      {shelter.email}
                    </a>
                  </div>
                )}

                {/* Website */}
                {shelter.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a href={shelter.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media - Expanded and Prominent */}
            {shelter.social_media && Object.values(shelter.social_media).some(link => link) && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Share2 className="h-5 w-5" />
                    Connect With Us
                  </CardTitle>
                  <CardDescription>Follow our social media for updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {shelter.social_media.facebook && (
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-blue-50 dark:hover:bg-blue-950/50" asChild>
                        <a href={shelter.social_media.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-6 w-6 text-blue-600" />
                          <span className="text-xs">Facebook</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.twitter && (
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900" asChild>
                        <a href={shelter.social_media.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-6 w-6 text-gray-900 dark:text-white" />
                          <span className="text-xs">X</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.instagram && (
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/50" asChild>
                        <a href={shelter.social_media.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-6 w-6 text-pink-600" />
                          <span className="text-xs">Instagram</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.youtube && (
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-red-50 dark:hover:bg-red-950/50" asChild>
                        <a href={shelter.social_media.youtube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-6 w-6 text-red-600" />
                          <span className="text-xs">YouTube</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.linkedin && (
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-blue-50 dark:hover:bg-blue-950/50" asChild>
                        <a href={shelter.social_media.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-6 w-6 text-blue-700" />
                          <span className="text-xs">LinkedIn</span>
                        </a>
                      </Button>
                    )}
                    {shelter.social_media.tiktok && (
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900" asChild>
                        <a href={shelter.social_media.tiktok} target="_blank" rel="noopener noreferrer">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          <span className="text-xs">TikTok</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QR Code & Donation */}
            <Card className="text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-green-900 dark:text-green-100">
                  <Heart className="h-5 w-5 text-red-500" />
                  Support This Shelter
                </CardTitle>
                <CardDescription>Scan to make a direct donation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shelter.qr_code ? (
                  <div className="bg-white dark:bg-gray-950 p-6 rounded-xl inline-block shadow-lg border-2 border-green-200 dark:border-green-800">
                    <Image 
                      src={shelter.qr_code} 
                      alt={`${shelter.name} Donation QR Code`} 
                      width={180} 
                      height={180}
                      className="mx-auto"
                      priority
                    />
                  </div>
                ) : (
                  <div className="bg-muted p-8 rounded-xl">
                    <div className="w-40 h-40 mx-auto bg-background rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground px-4">
                  Donations follow our SmartProof™ 80-15-5 model<br />
                  <span className="font-medium text-primary">80% goes directly to participants</span>
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" asChild>
                  <Link href={`/donate?shelter=${shelter.id}`}>
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Online
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Location Map - Enhanced */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
                <CardDescription>Find us on the map</CardDescription>
              </CardHeader>
              <CardContent>
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <div className="space-y-3">
                    <div className="rounded-lg overflow-hidden h-72 border-2 border-border shadow-sm">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(`${shelter.address}, ${shelter.city}, ${shelter.province} ${shelter.postal_code}`)}&zoom=15`}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shelter.address}, ${shelter.city}, ${shelter.province} ${shelter.postal_code}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Google Maps
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      {shelter.address}<br />
                      {shelter.city}, {shelter.province} {shelter.postal_code}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shelter.address}, ${shelter.city}, ${shelter.province} ${shelter.postal_code}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Google Maps
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Email Signup CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Stay Connected with {shelter.name}</h3>
              <p className="text-muted-foreground mb-6">
                Get updates about our services, programs, and how you can help make a difference.
              </p>
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="flex-1 bg-background"
                    disabled={isSubmittingSignup}
                  />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="flex-1 bg-background"
                    disabled={isSubmittingSignup}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmittingSignup || !signupEmail}
                    className="sm:w-auto"
                  >
                    {isSubmittingSignup ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
                {signupMessage && (
                  <p className={`text-sm font-medium ${signupMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {signupMessage}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
