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
  Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { tenantService, ShelterTenant } from '@/services/tenantService';
import { shelterService, ShelterPublicConfig } from '@/services/shelterService';

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
            qr_code: publicConfig?.qr_code
          };
          
          setShelter(shelterData);
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

          {/* Shelter Name */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{shelter.name}</h1>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {shelter.description}
          </p>

          {/* Capacity Badge */}
          {shelter.available_beds !== undefined && (
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full">
              <Users className="h-4 w-4" />
              <span className="font-medium">{shelter.available_beds} beds available</span>
              <span className="text-sm text-muted-foreground">(Real Data)</span>
            </div>
          )}
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Services & Info */}
          <div className="lg:col-span-2 space-y-6">
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
                <div className="space-y-4">
                  {shelter.operating_hours ? (
                    <div className="space-y-2">
                      {Object.entries(shelter.operating_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-muted-foreground">
                            {hours.open} - {hours.close}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Check-in Time:</span>
                        <span className="text-muted-foreground">{shelter.check_in_time}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Check-out Time:</span>
                        <span className="text-muted-foreground">{shelter.check_out_time}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Operating Hours:</span>
                        <Badge variant="outline">24/7</Badge>
                      </div>
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
          </div>

          {/* Right Column - Contact & QR Code */}
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
                    <p>{shelter.address}</p>
                    <p>{shelter.city}, {shelter.province} {shelter.postal_code}</p>
                  </div>
                </div>

                {/* Phone */}
                {shelter.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a href={`tel:${shelter.phone}`} className="text-sm hover:text-primary transition-colors">
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
                    <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a href={shelter.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Social Media */}
                {shelter.social_media && (
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      {shelter.social_media.facebook && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={shelter.social_media.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {shelter.social_media.twitter && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={shelter.social_media.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {shelter.social_media.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={shelter.social_media.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code & Donation */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Support This Shelter
                </CardTitle>
                <CardDescription>Scan to make a direct donation</CardDescription>
              </CardHeader>
              <CardContent>
                {shelter.qr_code ? (
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <Image 
                      src={shelter.qr_code} 
                      alt="QR Code for donations" 
                      width={200} 
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                ) : (
                  <div className="bg-muted p-8 rounded-lg mb-4">
                    <div className="w-48 h-48 mx-auto bg-background rounded-lg flex items-center justify-center">
                      <Building className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mb-4">
                  Donations follow our SmartProof™ 80-15-5 model
                </p>
                <Button className="w-full" asChild>
                  <Link href={`/donate?shelter=${shelter.id}`}>
                    Donate Online
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Verification Badge */}
            {shelter.verified && (
              <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Verified Shelter</span>
                  </div>
                  {shelter.lastUpdated && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Last updated: {new Date(shelter.lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
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
