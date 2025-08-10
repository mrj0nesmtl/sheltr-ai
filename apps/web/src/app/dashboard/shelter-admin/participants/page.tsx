'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  FileText,
  Heart,
  Bed,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { getShelterParticipants, getShelterMetrics, ShelterParticipant, ShelterMetrics } from '@/services/platformMetrics';

// Mock data removed - now using real Firebase data

export default function ParticipantsPage() {
  const { user, hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [participants, setParticipants] = useState<ShelterParticipant[]>([]);
  const [shelterMetrics, setShelterMetrics] = useState<ShelterMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Registration form state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalNotes: '',
    housingGoals: '',
    intake_notes: ''
  });

  // Load participants data
  useEffect(() => {
    const loadData = async () => {
      const shelterId = user?.customClaims?.shelter_id;
      
      if (!shelterId) {
        setError('No shelter assigned to this admin');
        setLoading(false);
        return;
      }

      try {
        // Load both participants and shelter metrics
        const [participantsData, metricsData] = await Promise.all([
          getShelterParticipants(shelterId),
          getShelterMetrics(shelterId)
        ]);

        setParticipants(participantsData);
        setShelterMetrics(metricsData);
      } catch (error) {
        console.error('❌ Failed to load participants data:', error);
        setError('Failed to load participants data');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('admin')) {
      loadData();
    }
  }, [user, hasRole]);

  // Registration function
  const handleRegistration = async () => {
    const shelterId = user?.customClaims?.shelter_id;
    
    if (!shelterId) {
      alert('Error: No shelter assigned to this admin');
      return;
    }

    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      alert('Please fill in required fields (First Name and Last Name)');
      return;
    }

    setRegistrationLoading(true);
    
    try {
      console.log('👤 Registering new participant...');
      
      // Create participant document
      const participantData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        shelter_id: shelterId,
        tenant_id: `shelter-${shelterId}`,
        role: 'participant',
        status: 'new',
        emergencyContact: formData.emergencyContactName ? {
          name: formData.emergencyContactName.trim(),
          phone: formData.emergencyContactPhone.trim(),
          relationship: formData.emergencyContactRelationship.trim()
        } : null,
        medicalNotes: formData.medicalNotes.trim() || null,
        housingGoals: formData.housingGoals.trim() || null,
        intake_notes: formData.intake_notes.trim() || null,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        createdBy: user.uid,
        profileComplete: false
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'users'), participantData);
      
      console.log('✅ Participant registered with ID:', docRef.id);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        medicalNotes: '',
        housingGoals: '',
        intake_notes: ''
      });
      
      // Close modal
      setShowRegistrationModal(false);
      
      // Reload participants data
      const updatedParticipants = await getShelterParticipants(shelterId);
      setParticipants(updatedParticipants);
      
      // Reload shelter metrics
      const updatedMetrics = await getShelterMetrics(shelterId);
      setShelterMetrics(updatedMetrics);
      
      alert('✅ Participant registered successfully!');
      
    } catch (error) {
      console.error('❌ Error registering participant:', error);
      alert('Error registering participant. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'transitioning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'; // Default to active
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Participants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage participant registrations, profiles, and services
          </p>
        </div>
        <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Participant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Participant</DialogTitle>
              <DialogDescription>
                Add a new participant to your shelter. All information will be stored securely.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="participant@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Select value={formData.emergencyContactRelationship} onValueChange={(value) => setFormData({...formData, emergencyContactRelationship: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes</Label>
                  <Textarea
                    id="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={(e) => setFormData({...formData, medicalNotes: e.target.value})}
                    placeholder="Any medical conditions, allergies, or medications"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="housingGoals">Housing Goals</Label>
                  <Textarea
                    id="housingGoals"
                    value={formData.housingGoals}
                    onChange={(e) => setFormData({...formData, housingGoals: e.target.value})}
                    placeholder="Participant's housing and life goals"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intake_notes">Intake Notes</Label>
                  <Textarea
                    id="intake_notes"
                    value={formData.intake_notes}
                    onChange={(e) => setFormData({...formData, intake_notes: e.target.value})}
                    placeholder="Initial assessment notes"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRegistrationModal(false)}
                disabled={registrationLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleRegistration}
                disabled={registrationLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {registrationLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {registrationLoading ? 'Registering...' : 'Register Participant'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : shelterMetrics?.totalParticipants || '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Real data connected'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">New registrations coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successfully Housed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Housing tracking coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Stay Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Duration tracking coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Participant Directory</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="transitioning">Transitioning</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading participants...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center p-8 text-red-600">
                      <AlertCircle className="h-8 w-8" />
                      <span className="ml-2">{error}</span>
                    </div>
                  ) : participants.filter(p => p.status === 'active').length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No active participants found</p>
                    </div>
                  ) : (
                    participants.filter(p => p.status === 'active').map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.email} • ID: {participant.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              Participant
                            </Badge>
                            <Badge variant="secondary">
                              {shelterMetrics?.shelterName || 'Assigned Shelter'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Real data from database • Shelter: {participant.shelter_id}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </TabsContent>
                
                <TabsContent value="new" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading participants...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center p-8 text-red-600">
                      <AlertCircle className="h-8 w-8" />
                      <span className="ml-2">{error}</span>
                    </div>
                  ) : participants.filter(p => p.status === 'new').length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No new participants found</p>
                    </div>
                  ) : (
                    participants.filter(p => p.status === 'new').map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.email} • ID: {participant.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              Participant
                            </Badge>
                            <Badge variant="secondary">
                              {shelterMetrics?.shelterName || 'Assigned Shelter'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Real data from database • Shelter: {participant.shelter_id}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </TabsContent>
                
                <TabsContent value="transitioning" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading participants...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center p-8 text-red-600">
                      <AlertCircle className="h-8 w-8" />
                      <span className="ml-2">{error}</span>
                    </div>
                  ) : participants.filter(p => p.status === 'transitioning').length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No transitioning participants found</p>
                    </div>
                  ) : (
                    participants.filter(p => p.status === 'transitioning').map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.email} • ID: {participant.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              Participant
                            </Badge>
                            <Badge variant="secondary">
                              {shelterMetrics?.shelterName || 'Assigned Shelter'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Real data from database • Shelter: {participant.shelter_id}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </TabsContent>
                
                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading participants...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center p-8 text-red-600">
                      <AlertCircle className="h-8 w-8" />
                      <span className="ml-2">{error}</span>
                    </div>
                  ) : participants.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No participants found</p>
                    </div>
                  ) : (
                    participants.map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.email} • ID: {participant.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              Participant
                            </Badge>
                            <Badge variant="secondary">
                              {shelterMetrics?.shelterName || 'Assigned Shelter'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Real data from database • Shelter: {participant.shelter_id}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest participant updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">Loading activity...</span>
                </div>
              ) : participants.length > 0 ? (
                participants.slice(0, 3).map((participant, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Real participant data loaded</p>
                      <p className="text-xs text-gray-500">Connected to {shelterMetrics?.shelterName}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                New Registration
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Intake
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bed className="mr-2 h-4 w-4" />
                Manage Beds
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 