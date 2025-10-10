'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  Bed, 
  DollarSign, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Edit,
  QrCode,
  Shield,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shelter } from '@/services/firestore';
import Link from 'next/link';

export default function ShelterViewClient() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params.shelterId as string;
  
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [operationsRevenue, setOperationsRevenue] = useState(0); // 5% from participant donations
  const [directDonations, setDirectDonations] = useState(0); // Direct shelter donations

  useEffect(() => {
    const loadShelter = async () => {
      try {
        console.log(`🏠 Loading shelter details for: ${shelterId}`);
        
        // First try direct ID lookup
        let shelterRef = doc(db, 'shelters', shelterId);
        let shelterSnap = await getDoc(shelterRef);
        
        // If not found by ID, try looking up by tenantId
        if (!shelterSnap.exists()) {
          console.log(`🔍 Shelter not found by ID, trying tenant ID lookup...`);
          const { collection: firestoreCollection, query, where, getDocs } = await import('firebase/firestore');
          const sheltersRef = firestoreCollection(db, 'shelters');
          const q = query(sheltersRef, where('tenantId', '==', shelterId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const foundDoc = querySnapshot.docs[0];
            setShelter({ id: foundDoc.id, ...foundDoc.data() } as Shelter);
            console.log('✅ Shelter loaded successfully by tenantId');
            setLoading(false);
            return;
          }
        }
        
        if (shelterSnap.exists()) {
          const shelterData = { id: shelterSnap.id, ...shelterSnap.data() } as Shelter;
          setShelter(shelterData);
          console.log('✅ Shelter loaded successfully by ID');
          
          // Load participant count
          const participantsQuery = query(collection(db, 'users'), where('shelter_id', '==', shelterSnap.id), where('role', '==', 'participant'));
          const participantsSnap = await getDocs(participantsQuery);
          setParticipantCount(participantsSnap.size);
          
          // Load notification count
          const notificationsQuery = query(collection(db, 'shelter_email_signups'), where('shelter_id', '==', shelterSnap.id));
          const notificationsSnap = await getDocs(notificationsQuery);
          setNotificationCount(notificationsSnap.size);
          
          // Calculate REAL donation totals from actual donation collections
          let realDonationTotal = 0;
          let operationsRevenueTotal = 0; // 5% from participant donations
          let directDonationsTotal = 0; // Direct shelter donations
          const uniqueDonors = new Set<string>();
          
          // Get list of participant IDs affiliated with this shelter
          const shelterParticipantIds = new Set<string>();
          participantsSnap.forEach((doc) => {
            shelterParticipantIds.add(doc.id);
          });
          
          // Check demo_donations collection
          try {
            const demoDonationsRef = collection(db, 'demo_donations');
            const demoDonationsSnap = await getDocs(demoDonationsRef);
            demoDonationsSnap.forEach((doc) => {
              const data = doc.data();
              const totalAmount = data.total_amount || 0;
              
              if (data.participant_id && shelterParticipantIds.has(data.participant_id)) {
                // Participant donation - shelter gets 5% operations fee
                const operationsFee = totalAmount * 0.05;
                operationsRevenueTotal += operationsFee;
                realDonationTotal += totalAmount;
                if (data.donor_id) uniqueDonors.add(data.donor_id);
              } else if (!data.participant_id && data.shelter_id === shelterSnap.id) {
                // Direct donation to shelter (no participant)
                directDonationsTotal += totalAmount;
                realDonationTotal += totalAmount;
                if (data.donor_id) uniqueDonors.add(data.donor_id);
              }
            });
          } catch (error) {
            console.warn('No demo_donations collection or error loading:', error);
          }
          
          // Check tenant-specific donations (tenants/{tenantId}/donations)
          try {
            const tenantId = shelterData.tenantId;
            if (tenantId) {
              const tenantDonationsRef = collection(db, `tenants/${tenantId}/donations`);
              const tenantDonationsSnap = await getDocs(tenantDonationsRef);
              tenantDonationsSnap.forEach((doc) => {
                const data = doc.data();
                const totalAmount = data.total_amount || data.amount || 0;
                
                if (data.participant_id && shelterParticipantIds.has(data.participant_id)) {
                  // Participant donation - shelter gets 5% operations fee
                  const operationsFee = totalAmount * 0.05;
                  operationsRevenueTotal += operationsFee;
                  realDonationTotal += totalAmount;
                  if (data.donor_id) uniqueDonors.add(data.donor_id);
                } else if (!data.participant_id) {
                  // Direct donation to shelter (no participant)
                  directDonationsTotal += totalAmount;
                  realDonationTotal += totalAmount;
                  if (data.donor_id) uniqueDonors.add(data.donor_id);
                }
              });
            }
          } catch (error) {
            console.warn('No tenant donations collection or error loading:', error);
          }
          
          setTotalDonations(realDonationTotal);
          setOperationsRevenue(operationsRevenueTotal);
          setDirectDonations(directDonationsTotal);
          setDonorCount(uniqueDonors.size);
          
          console.log(`💰 Calculated real totals for ${shelterSnap.id}:`, {
            totalDonations: realDonationTotal,
            operationsRevenue: operationsRevenueTotal,
            directDonations: directDonationsTotal,
            uniqueDonors: uniqueDonors.size
          });
        } else {
          setError('Shelter not found. Please navigate from the shelters list.');
        }
      } catch (err) {
        console.error('❌ Error loading shelter:', err);
        setError('Failed to load shelter details');
      } finally {
        setLoading(false);
      }
    };

    if (shelterId) {
      loadShelter();
    }
  }, [shelterId]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading shelter details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shelter) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Shelter</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/shelters')}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shelters
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 flex-wrap mb-2">
              <Building2 className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
              <span className="break-words">{shelter.name}</span>
              {shelter.verified && (
                <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 text-xs md:text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm md:text-base">
              <MapPin className="h-4 w-4" />
              {shelter.location}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 mt-2 md:mt-0">
            <Link href={`/dashboard/shelters/${shelterId}/edit`}>
              <Button variant="default" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${shelterId}`} target="_blank">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">View Public Page</span>
                <span className="md:hidden">Public</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <Badge 
          variant={shelter.status === 'active' ? 'default' : 'secondary'}
          className={
            shelter.status === 'active' ? 'bg-green-600' :
            shelter.status === 'pending' ? 'bg-yellow-600' :
            'bg-gray-600'
          }
        >
          {shelter.status}
        </Badge>
        <Badge variant="outline">{shelter.type}</Badge>
      </div>

      {/* Key Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Key Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Participants */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{participantCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Donors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{donorCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Donations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">${totalDonations.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{notificationCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg font-semibold">{shelter.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-lg">{shelter.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-lg">{shelter.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="text-lg">{shelter.address}</p>
            </div>
            {shelter.coordinates && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                <p className="text-sm font-mono">
                  {shelter.coordinates.lat.toFixed(6)}, {shelter.coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{shelter.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-lg">{shelter.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                <p className="text-lg">{shelter.contact.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Overview
            </CardTitle>
            <CardDescription>Revenue breakdown by source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 5% Operations Revenue */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">5% Operations Fee</span>
                <Badge variant="outline" className="border-purple-400 text-purple-600 dark:text-purple-400 text-xs">
                  SmartFund™
                </Badge>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                ${operationsRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">From affiliated participant donations</p>
            </div>

            {/* Direct Donations */}
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Direct Donations</span>
                <Badge variant="outline" className="border-green-400 text-green-600 dark:text-green-400 text-xs">
                  Direct
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${directDonations.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">From shelter QR code donations</p>
            </div>

            {/* Total Revenue */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                <span className="text-2xl font-bold">${totalDonations.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shelter QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Shelter QR Code
            </CardTitle>
            <CardDescription>Quick access to public page</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-block p-4 bg-white rounded-lg border-2 border-dashed">
              <QrCode className="h-32 w-32 mx-auto text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Links to: https://sheltr-ai.web.app/{shelterId}
            </p>
            <Button variant="outline" className="mt-3">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Timeline & Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline & Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Join Date
              </label>
              <p className="text-lg font-semibold mt-1">
                {shelter.createdAt?.toDate ? new Date(shelter.createdAt.toDate()).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Last Inspection
              </label>
              <p className="text-lg font-semibold mt-1">
                {shelter.lastInspection && shelter.lastInspection !== '2024-01-15' ? new Date(shelter.lastInspection).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Last Updated
              </label>
              <p className="text-lg font-semibold mt-1">
                {shelter.updatedAt?.toDate ? new Date(shelter.updatedAt.toDate()).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tenant ID</label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md mt-1">{shelter.tenantId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shelter ID</label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md mt-1">{shelter.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

