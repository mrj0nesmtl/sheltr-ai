'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Heart, 
  AlertTriangle,
  MessageCircle,
  Users,
  Building2,
  Utensils,
  Shield,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Home,
  Search,
  ExternalLink,
  Star
} from 'lucide-react';

export default function ParticipantSupportPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Emergency hotlines and crisis resources
  const emergencyResources = [
    {
      id: 1,
      name: '911 Emergency Services',
      phone: '911',
      description: 'Police, Fire, Medical Emergency',
      available: '24/7',
      type: 'emergency',
      urgent: true
    },
    {
      id: 2,
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free 24/7 support for people in crisis',
      available: '24/7',
      type: 'crisis',
      urgent: true
    },
    {
      id: 3,
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: 'Free and confidential emotional support',
      available: '24/7',
      type: 'crisis',
      urgent: true
    },
    {
      id: 4,
      name: 'Domestic Violence Hotline',
      phone: '1-800-799-7233',
      description: 'Support for domestic violence survivors',
      available: '24/7',
      type: 'crisis',
      urgent: true
    },
    {
      id: 5,
      name: 'Poison Control',
      phone: '1-800-222-1222',
      description: 'Poison emergency assistance',
      available: '24/7',
      type: 'emergency',
      urgent: true
    }
  ];

  // Local Montreal resources (can be customized for other cities)
  const localResources = [
    {
      id: 1,
      name: 'Old Brewery Mission',
      type: 'shelter',
      address: '915 Rue Clark, Montreal, QC H2Z 1M1',
      phone: '(514) 845-3906',
      services: ['Emergency Shelter', 'Meals', 'Mental Health'],
      hours: '24/7',
      distance: '0.5 km',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Downtown Hope Shelter',
      type: 'shelter',
      address: '1234 Ste-Catherine St W, Montreal, QC',
      phone: '(514) 555-0123',
      services: ['Emergency Shelter', 'Job Training', 'Counseling'],
      hours: '24/7',
      distance: '0.8 km',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Montreal General Hospital',
      type: 'medical',
      address: '1650 Cedar Ave, Montreal, QC H3G 1A4',
      phone: '(514) 934-1934',
      services: ['Emergency Care', 'Mental Health', 'Social Services'],
      hours: '24/7',
      distance: '1.2 km',
      rating: 4.3
    },
    {
      id: 4,
      name: 'Welcome Hall Mission',
      type: 'food',
      address: '606 Rue De Courcelle, Montreal, QC H4C 3N4',
      phone: '(514) 523-0043',
      services: ['Free Meals', 'Food Bank', 'Clothing'],
      hours: 'Mon-Fri 8am-6pm',
      distance: '2.1 km',
      rating: 4.4
    },
    {
      id: 5,
      name: 'CLSC Metro',
      type: 'medical',
      address: '1801 Boulevard De Maisonneuve E, Montreal, QC',
      phone: '(514) 527-2361',
      services: ['Primary Care', 'Mental Health', 'Social Services'],
      hours: 'Mon-Fri 8am-8pm, Weekends 9am-5pm',
      distance: '1.8 km',
      rating: 4.1
    },
    {
      id: 6,
      name: 'Emploi-Québec Centre-Ville',
      type: 'employment',
      address: '393 Rue Saint-Jacques, Montreal, QC H2Y 1N9',
      phone: '(514) 873-4000',
      services: ['Job Search', 'Training Programs', 'Financial Aid'],
      hours: 'Mon-Fri 8:30am-4:30pm',
      distance: '1.5 km',
      rating: 3.9
    }
  ];

  const supportTeam = [
    {
      id: 1,
      name: 'Sarah Williams',
      role: 'Case Manager',
      phone: '(514) 555-0101',
      email: 'sarah.williams@sheltr.com',
      availability: 'Mon-Fri 9am-5pm',
      specialties: ['Housing', 'Benefits', 'Mental Health']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Mental Health Counselor',
      phone: '(514) 555-0102',
      email: 'michael.chen@sheltr.com',
      availability: 'Tue, Thu, Fri 10am-6pm',
      specialties: ['Counseling', 'Crisis Support', 'Addiction']
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      role: 'Employment Specialist',
      phone: '(514) 555-0103',
      email: 'lisa.rodriguez@sheltr.com',
      availability: 'Mon, Wed, Fri 8am-4pm',
      specialties: ['Job Training', 'Resume Help', 'Interview Prep']
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'shelter':
        return <Home className="h-5 w-5" />;
      case 'medical':
        return <Stethoscope className="h-5 w-5" />;
      case 'food':
        return <Utensils className="h-5 w-5" />;
      case 'employment':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'crisis':
        return 'bg-orange-100 text-orange-800';
      case 'shelter':
        return 'bg-blue-100 text-blue-800';
      case 'medical':
        return 'bg-green-100 text-green-800';
      case 'food':
        return 'bg-purple-100 text-purple-800';
      case 'employment':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Only show for participant role
  if (user?.role !== 'participant' && user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Participant role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support & Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Emergency resources, local services, and your support team
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Phone className="h-4 w-4 mr-2" />
          Emergency: 911
        </Button>
      </div>

      {/* Emergency Alert */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Emergency Resources</h3>
              <p className="text-sm text-red-800">
                If you're in immediate danger, call 911. For crisis support, text HOME to 741741 or call 988.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="emergency" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="local">Local Resources</TabsTrigger>
          <TabsTrigger value="team">Support Team</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>

        {/* Emergency Resources Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Crisis & Emergency Hotlines
              </CardTitle>
              <CardDescription>
                Free, confidential support available 24/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyResources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${resource.urgent ? 'bg-red-100' : 'bg-orange-100'}`}>
                        <Phone className={`h-6 w-6 ${resource.urgent ? 'text-red-600' : 'text-orange-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{resource.name}</h3>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{resource.available}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                      <Button className="mt-2 bg-red-600 hover:bg-red-700" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {resource.phone}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local Resources Tab */}
        <TabsContent value="local" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Local Montreal Resources</CardTitle>
              <CardDescription>
                Emergency services and support organizations near you
              </CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search local resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localResources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{resource.name}</h3>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{resource.address}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{resource.hours}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{resource.distance} away</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{resource.rating}</span>
                        </div>
                        <Badge variant="secondary" className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Services Available:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.services.map((service, index) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {resource.phone}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Personal Support Team</CardTitle>
              <CardDescription>
                Dedicated professionals here to help with your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportTeam.map((member) => (
                  <div key={member.id} className="border rounded-lg p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{member.availability}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Support Chat</CardTitle>
              <CardDescription>
                Connect with a support specialist right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">24/7 Live Chat Support</h3>
                <p className="text-gray-600 mb-6">
                  Get immediate help from our trained support specialists
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Links</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Mental Health Support
                    </Button>
                    <Button variant="outline" size="sm">
                      <Home className="h-4 w-4 mr-2" />
                      Housing Help
                    </Button>
                    <Button variant="outline" size="sm">
                      <Utensils className="h-4 w-4 mr-2" />
                      Food Resources
                    </Button>
                    <Button variant="outline" size="sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Job Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 