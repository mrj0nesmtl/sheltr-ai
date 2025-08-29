'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Users, Heart, ExternalLink, Phone, Mail, Clock, MapIcon, Sparkles, Filter, Search, Map } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ShelterTenant } from '@/services/tenantService';
import { shelterService, ShelterPublicConfig } from '@/services/shelterService';
import PublicNavigation from '@/components/PublicNavigation';

export default function SheltersPage() {
  const [sheltersData, setSheltersData] = useState<Array<{ shelter: ShelterTenant; config: ShelterPublicConfig }>>([]);
  const [filteredShelters, setFilteredShelters] = useState<Array<{ shelter: ShelterTenant; config: ShelterPublicConfig }>>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const loadShelters = async () => {
      try {
        const publicShelters = await shelterService.getAllPublicShelters();
        setSheltersData(publicShelters);
        setFilteredShelters(publicShelters);
      } catch (error) {
        console.error('Error loading shelters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShelters();
  }, []);

  // Filter shelters based on search and type
  useEffect(() => {
    let filtered = sheltersData;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shelter.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.config.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(item => 
        item.shelter.type === selectedType
      );
    }

    setFilteredShelters(filtered);
  }, [sheltersData, searchTerm, selectedType]);

  // Removed unused getShelterSlug function

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Here you would integrate with your email service (e.g., Mailchimp, ConvertKit, etc.)
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage('Thank you! We&apos;ll be in touch soon.');
      setEmail('');
    } catch {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/backgrounds/solutions-bg.jpg")',
          opacity: 0.5,
          zIndex: -2
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-100/80 z-[-1]" />
      
      <PublicNavigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
            Our Affiliated Shelters
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto drop-shadow-sm">
            Discover the network of shelters working together to provide safety, support, and hope 
            to those experiencing homelessness across Montreal.
          </p>
          <div className="mt-6 flex justify-center items-center space-x-6">
            <div className="flex items-center text-gray-800 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">{sheltersData.length} Partner Shelters</span>
            </div>
            <div className="flex items-center text-gray-800 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">
                {sheltersData.reduce((total, item) => total + item.shelter.capacity, 0)} Total Beds
              </span>
            </div>
          </div>
        </div>

        {/* Filtering Toolbar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search shelters, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-10 pr-10 py-2 bg-white/80 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="Emergency Shelter">Emergency Shelter</option>
                  <option value="Transitional Housing">Transitional Housing</option>
                  <option value="Family Shelter">Family Shelter</option>
                  <option value="Youth Shelter">Youth Shelter</option>
                  <option value="Women's Shelter">Women&apos;s Shelter</option>
                </select>
              </div>
            </div>

            {/* Map Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {filteredShelters.length} of {sheltersData.length} shelters
              </span>
              <Button
                variant={showMap ? "default" : "outline"}
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 mb-8">
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive map coming soon...</p>
                <p className="text-sm text-gray-500 mt-1">
                  Will show all {filteredShelters.length} shelter locations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShelters.map(({ shelter, config }) => {
            const occupancyPercentage = calculateOccupancyPercentage(
              shelter.currentOccupancy, 
              shelter.capacity
            );
            const shelterSlug = config.slug;

            return (
              <Link href={`/${shelterSlug}`} key={shelter.id}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer bg-white/95 backdrop-blur-sm border border-white/50 hover:bg-white hover:scale-[1.02]">
                  {/* Shelter Image/Logo */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600">
                    {config.backgroundImageUrl ? (
                      <Image
                        src={config.backgroundImageUrl}
                        alt={shelter.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full"></div>
                      <div className="absolute top-12 right-8 w-6 h-6 bg-white rounded-full"></div>
                      <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full"></div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        {config.logoUrl ? (
                          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 bg-white/90 backdrop-blur-sm p-3 shadow-lg border border-white/30">
                            <Image
                              src={config.logoUrl}
                              alt={`${shelter.name} logo`}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/30">
                            <Heart className="h-10 w-10" />
                          </div>
                        )}
                        <h3 className="text-xl font-bold drop-shadow-sm">{shelter.name}</h3>
                      </div>
                    </div>
                    
                    {/* Shelter Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getShelterTypeColor(shelter.type)} backdrop-blur-sm`}>
                        {shelter.type}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg line-clamp-2">{shelter.name}</CardTitle>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Coming Soon
                          </Badge>
                        </div>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {shelter.address}
                      </CardDescription>
                      <div className="mt-2">
                        <Badge className={getShelterTypeColor(shelter.type)}>
                          {shelter.type}
                        </Badge>
                      </div>
                    </div>
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

                  {/* Action Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Click to visit page
                    </div>
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                  </div>
                </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {sheltersData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No shelters found</h3>
            <p className="text-gray-500">
              We&apos;re working on adding shelter partners to our network.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden">
            <div className="px-8 py-12 md:px-12 md:py-16">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Expanding Across Canada
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  We&apos;re actively seeking shelter partners and affiliates across Canada to join our revolutionary platform. 
                  Be part of the future of transparent, blockchain-powered homelessness support.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <MapIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Coast to Coast</h3>
                    <p className="text-blue-100 text-sm">
                      From Vancouver to Halifax, we&apos;re building a national network
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">FREE Platform</h3>
                    <p className="text-blue-100 text-sm">
                      Our platform is completely free for all shelter partners
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
                    <p className="text-blue-100 text-sm">
                      Full onboarding, training, and ongoing technical support
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Interested in Partnering?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Join our waitlist to be the first to know when we launch in your region.
                  </p>
                  
                  <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your organization's email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/90 border-white/20 text-gray-900 placeholder-gray-500"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                    >
                      {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                    </Button>
                  </form>
                  
                  {submitMessage && (
                    <p className="mt-3 text-center text-white font-medium">
                      {submitMessage}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Link href="/solutions">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View Solutions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Link href="/contact">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
