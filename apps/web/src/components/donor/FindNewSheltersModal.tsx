'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Users, DollarSign, Clock, Star, ExternalLink } from 'lucide-react';

interface FindNewSheltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shelter {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  services: string[];
  capacity: number;
  currentOccupancy: number;
  totalDonations: number;
  rating: number;
  distance: number;
  urgentNeeds: string[];
  established: string;
  website?: string;
  phone?: string;
}

export function FindNewSheltersModal({ isOpen, onClose }: FindNewSheltersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<Shelter[]>([]);

  // Mock shelter data
  useEffect(() => {
    const mockShelters: Shelter[] = [
      {
        id: 'old-brewery-mission',
        name: 'Old Brewery Mission',
        location: 'Montreal, QC',
        address: '915 Clark Street, Montreal, QC H2Z 1M8',
        description: 'Providing comprehensive support services to homeless individuals since 1889. Offers emergency shelter, meals, healthcare, and rehabilitation programs.',
        services: ['Emergency Shelter', 'Meals', 'Healthcare', 'Job Training', 'Addiction Support'],
        capacity: 150,
        currentOccupancy: 142,
        totalDonations: 125000,
        rating: 4.8,
        distance: 2.3,
        urgentNeeds: ['Winter Clothing', 'Medical Supplies'],
        established: '1889',
        website: 'https://missionoldbrewery.ca',
        phone: '(514) 845-3906'
      },
      {
        id: 'dans-la-rue',
        name: 'Dans la rue',
        location: 'Montreal, QC', 
        address: '606 René-Lévesque Blvd W, Montreal, QC H3B 1M7',
        description: 'Dedicated to supporting homeless youth in Montreal through outreach, shelter, and long-term support programs.',
        services: ['Youth Shelter', 'Outreach', 'Education', 'Mental Health', 'Life Skills'],
        capacity: 50,
        currentOccupancy: 38,
        totalDonations: 67000,
        rating: 4.6,
        distance: 1.8,
        urgentNeeds: ['Educational Materials', 'Technology'],
        established: '1988',
        website: 'https://danslarue.org',
        phone: '(514) 284-9335'
      },
      {
        id: 'mission-bon-accueil',
        name: 'Mission Bon Accueil',
        location: 'Montreal, QC',
        address: '427 Rue de la Commune E, Montreal, QC H2Y 1J1',
        description: 'Emergency shelter and rehabilitation services for men experiencing homelessness, with focus on reintegration.',
        services: ['Emergency Shelter', 'Rehabilitation', 'Counseling', 'Job Placement'],
        capacity: 80,
        currentOccupancy: 65,
        totalDonations: 89000,
        rating: 4.4,
        distance: 3.1,
        urgentNeeds: ['Hygiene Products', 'Work Clothes'],
        established: '1892',
        website: 'https://missionbonaccueil.com',
        phone: '(514) 845-3906'
      },
      {
        id: 'welcome-hall-mission',
        name: 'Welcome Hall Mission',
        location: 'Montreal, QC',
        address: '606 de Maisonneuve Blvd E, Montreal, QC H2L 1K8',
        description: 'Comprehensive services for individuals and families experiencing homelessness, including emergency shelter and transitional housing.',
        services: ['Family Shelter', 'Transitional Housing', 'Childcare', 'Food Bank'],
        capacity: 120,
        currentOccupancy: 95,
        totalDonations: 156000,
        rating: 4.7,
        distance: 4.2,
        urgentNeeds: ['Baby Supplies', 'School Supplies'],
        established: '1892',
        website: 'https://welcomehallmission.com',
        phone: '(514) 523-7483'
      },
      {
        id: 'shelter-of-hope',
        name: 'Shelter of Hope',
        location: 'Laval, QC',
        address: '123 Hope Street, Laval, QC H7S 1A1',
        description: 'Community-based shelter focusing on women and children, providing safe housing and support services.',
        services: ['Women\'s Shelter', 'Childcare', 'Counseling', 'Legal Aid'],
        capacity: 40,
        currentOccupancy: 32,
        totalDonations: 45000,
        rating: 4.5,
        distance: 12.5,
        urgentNeeds: ['Children\'s Clothing', 'Toys'],
        established: '2005',
        phone: '(450) 555-0123'
      }
    ];

    setShelters(mockShelters);
    setFilteredShelters(mockShelters);
  }, []);

  // Filter and sort shelters
  useEffect(() => {
    const filtered = shelters.filter(shelter => {
      const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shelter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shelter.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = locationFilter === 'all' || shelter.location.includes(locationFilter);
      const matchesService = serviceFilter === 'all' || shelter.services.some(service => 
        service.toLowerCase().includes(serviceFilter.toLowerCase())
      );

      return matchesSearch && matchesLocation && matchesService;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'urgency':
          return b.urgentNeeds.length - a.urgentNeeds.length;
        case 'capacity':
          return (b.capacity - b.currentOccupancy) - (a.capacity - a.currentOccupancy);
        default:
          return 0;
      }
    });

    setFilteredShelters(filtered);
  }, [shelters, searchTerm, locationFilter, serviceFilter, sortBy]);

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleDonate = (shelterId: string) => {
    // This would open the donation modal with the shelter pre-selected
    console.log('Donate to shelter:', shelterId);
    alert(`Donation modal would open for ${shelterId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Find New Shelters
          </DialogTitle>
          <DialogDescription>
            Discover shelters in your area and learn how you can help support their mission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search shelters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Montreal">Montreal</SelectItem>
                <SelectItem value="Laval">Laval</SelectItem>
              </SelectContent>
            </Select>

            {/* Service Filter */}
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="emergency">Emergency Shelter</SelectItem>
                <SelectItem value="youth">Youth Services</SelectItem>
                <SelectItem value="family">Family Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="urgency">Urgent Needs</SelectItem>
                <SelectItem value="capacity">Available Space</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Found {filteredShelters.length} shelter{filteredShelters.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Shelter Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredShelters.map((shelter) => (
              <Card key={shelter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{shelter.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {shelter.location} • {shelter.distance} km away
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{shelter.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {shelter.description}
                  </p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1">
                    {shelter.services.slice(0, 3).map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {shelter.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{shelter.services.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className={`font-medium ${getOccupancyColor(shelter.currentOccupancy, shelter.capacity)}`}>
                          {shelter.currentOccupancy}/{shelter.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Occupancy</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          ${(shelter.totalDonations / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Raised</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{shelter.established}</span>
                      </div>
                      <p className="text-xs text-gray-500">Est.</p>
                    </div>
                  </div>

                  {/* Urgent Needs */}
                  {shelter.urgentNeeds.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">Urgent Needs:</p>
                      <div className="flex flex-wrap gap-1">
                        {shelter.urgentNeeds.map((need) => (
                          <Badge key={need} className="bg-red-100 text-red-800 text-xs">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleDonate(shelter.id)}
                      className="flex-1"
                      size="sm"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Donate
                    </Button>
                    {shelter.website && (
                      <Button 
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={shelter.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredShelters.length === 0 && (
            <Card className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No shelters found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or filters
              </p>
            </Card>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
