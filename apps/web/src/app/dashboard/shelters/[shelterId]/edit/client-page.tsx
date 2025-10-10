'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Building2, 
  Save,
  Shield,
  Users,
  AlertCircle,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shelter } from '@/services/firestore';
import { AdminUser } from '@/services/platformMetrics';

export default function ShelterEditClient() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params.shelterId as string;
  
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    email: '',
    phone: '',
    contactName: '',
    capacity: 0,
    type: '',
    verified: false
  });

  const [administrators, setAdministrators] = useState<AdminUser[]>([]);
  const [availableAdmins, setAvailableAdmins] = useState<AdminUser[]>([]);

  useEffect(() => {
    const loadShelter = async () => {
      try {
        console.log(`🏠 Loading shelter for edit: ${shelterId}`);
        
        // First try direct ID lookup
        let shelterRef = doc(db, 'shelters', shelterId);
        let shelterSnap = await getDoc(shelterRef);
        let actualShelterId = shelterId;
        
        // If not found by ID, try looking up by tenantId
        if (!shelterSnap.exists()) {
          console.log(`🔍 Shelter not found by ID, trying tenant ID lookup...`);
          const sheltersRef = collection(db, 'shelters');
          const q = query(sheltersRef, where('tenantId', '==', shelterId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const foundDoc = querySnapshot.docs[0];
            actualShelterId = foundDoc.id;
            shelterSnap = foundDoc;
            console.log('✅ Shelter found by tenantId, using ID:', actualShelterId);
          }
        }
        
        if (shelterSnap.exists()) {
          const shelterData = { id: shelterSnap.id, ...shelterSnap.data() } as Shelter;
          setShelter(shelterData);
          
          // Populate form data
          setFormData({
            name: shelterData.name || '',
            location: shelterData.location || '',
            address: shelterData.address || '',
            email: shelterData.contact?.email || '',
            phone: shelterData.contact?.phone || '',
            contactName: shelterData.contact?.name || '',
            capacity: shelterData.capacity || 0,
            type: shelterData.type || '',
            verified: shelterData.verified || false
          });
          
          // Load administrators using actual shelter ID
          await loadAdministrators(actualShelterId);
          
          console.log('✅ Shelter loaded successfully');
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

  const loadAdministrators = async (shelterIdToLoad: string) => {
    try {
      // Get current administrators
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin'),
        where('shelter_id', '==', shelterIdToLoad)
      );
      const adminsSnapshot = await getDocs(adminsQuery);
      const adminsList: AdminUser[] = [];
      adminsSnapshot.forEach((doc) => {
        adminsList.push({ 
          id: doc.id, 
          ...doc.data(),
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          email: doc.data().email || ''
        } as AdminUser);
      });
      setAdministrators(adminsList);

      // Get available admins (admins without shelter_id)
      const availableQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin'),
        where('shelter_id', '==', null)
      );
      const availableSnapshot = await getDocs(availableQuery);
      const availableList: AdminUser[] = [];
      availableSnapshot.forEach((doc) => {
        availableList.push({ 
          id: doc.id, 
          ...doc.data(),
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          email: doc.data().email || ''
        } as AdminUser);
      });
      setAvailableAdmins(availableList);
    } catch (err) {
      console.error('Error loading administrators:', err);
    }
  };

  const handleSave = async () => {
    if (!shelter) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const shelterRef = doc(db, 'shelters', shelterId);
      await updateDoc(shelterRef, {
        name: formData.name,
        location: formData.location,
        address: formData.address,
        capacity: Number(formData.capacity),
        type: formData.type,
        verified: formData.verified,
        contact: {
          email: formData.email,
          phone: formData.phone,
          name: formData.contactName
        },
        updatedAt: new Date()
      });

      setSuccessMessage('✅ Shelter updated successfully!');
      
      // Refresh shelter data
      const updatedSnap = await getDoc(shelterRef);
      if (updatedSnap.exists()) {
        setShelter({ id: updatedSnap.id, ...updatedSnap.data() } as Shelter);
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating shelter:', err);
      setError('Failed to update shelter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const assignAdmin = async (adminId: string) => {
    try {
      const userRef = doc(db, 'users', adminId);
      await updateDoc(userRef, {
        shelter_id: shelterId
      });
      
      await loadAdministrators(shelterId);
      setSuccessMessage('✅ Administrator assigned successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error assigning admin:', err);
      setError('Failed to assign administrator');
    }
  };

  const removeAdmin = async (adminId: string) => {
    try {
      const userRef = doc(db, 'users', adminId);
      await updateDoc(userRef, {
        shelter_id: null
      });
      
      await loadAdministrators(shelterId);
      setSuccessMessage('✅ Administrator removed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error removing admin:', err);
      setError('Failed to remove administrator');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading shelter details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !shelter) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Shelter</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard/shelters')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shelters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/shelters')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shelters
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Edit Shelter: {shelter?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Update shelter information and manage administrators
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Edit Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Shelter Details</TabsTrigger>
          <TabsTrigger value="administrators">Administrators</TabsTrigger>
        </TabsList>

        {/* Shelter Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update shelter name, location, and type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Shelter Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter shelter name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (City, Province/State)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Montreal, QC"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter full address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Shelter Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    placeholder="e.g., Emergency, Transitional, Permanent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Number of Beds)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    placeholder="Enter total capacity"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update shelter contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@shelter.org"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="Enter contact person name"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verified Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verified Shelter Status
              </CardTitle>
              <CardDescription>
                Mark this shelter as verified to display a verification badge on the public page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Verification Status</p>
                  <p className="text-sm text-muted-foreground">
                    Verified shelters are highlighted with a badge on their public page
                  </p>
                </div>
                <Switch
                  checked={formData.verified}
                  onCheckedChange={(checked) => handleInputChange('verified', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Administrators Tab */}
        <TabsContent value="administrators" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Current Administrators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Administrators
                </CardTitle>
                <CardDescription>
                  Shelter admins with access to this shelter&apos;s dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                {administrators.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No administrators assigned yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {administrators.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {admin.firstName} {admin.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdmin(admin.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Administrators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Available Administrators
                </CardTitle>
                <CardDescription>
                  Assign administrators to manage this shelter
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableAdmins.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No available administrators
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableAdmins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {admin.firstName} {admin.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => assignAdmin(admin.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

