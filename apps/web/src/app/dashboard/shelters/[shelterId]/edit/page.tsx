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

export default function ShelterEditPage() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params.shelterId as string;
  
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    capacity: 0,
    email: '',
    phone: '',
    contactName: '',
    verified: false
  });

  // Administrator management
  const [shelterAdmins, setShelterAdmins] = useState<AdminUser[]>([]);
  const [availableAdmins, setAvailableAdmins] = useState<AdminUser[]>([]);

  useEffect(() => {
    const loadShelter = async () => {
      try {
        console.log(`🏠 Loading shelter for editing: ${shelterId}`);
        const shelterRef = doc(db, 'shelters', shelterId);
        const shelterSnap = await getDoc(shelterRef);
        
        if (shelterSnap.exists()) {
          const shelterData = { id: shelterSnap.id, ...shelterSnap.data() } as Shelter;
          setShelter(shelterData);
          
          // Populate form
          setFormData({
            name: shelterData.name || '',
            location: shelterData.location || '',
            address: shelterData.address || '',
            capacity: shelterData.capacity || 0,
            email: shelterData.contact?.email || '',
            phone: shelterData.contact?.phone || '',
            contactName: shelterData.contact?.name || '',
            verified: shelterData.verified || false
          });
          
          console.log('✅ Shelter loaded successfully');
          
          // Load administrators
          await loadShelterAdministrators(shelterId);
          await loadAvailableAdministrators();
        } else {
          setError('Shelter not found');
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

  const loadShelterAdministrators = async (shelterId: string) => {
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('shelter_id', '==', shelterId),
        where('role', 'in', ['admin', 'shelter_admin'])
      );
      const snapshot = await getDocs(adminsQuery);
      const admins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
      setShelterAdmins(admins);
      console.log(`✅ Loaded ${admins.length} administrators for shelter`);
    } catch (error) {
      console.error('❌ Error loading shelter administrators:', error);
      setShelterAdmins([]);
    }
  };

  const loadAvailableAdministrators = async () => {
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['admin', 'shelter_admin'])
      );
      const snapshot = await getDocs(adminsQuery);
      const allAdmins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
      
      // Filter out admins that already have a shelter assigned
      const unassignedAdmins = allAdmins.filter(admin => !admin.shelter_id || admin.shelter_id === '');
      setAvailableAdmins(unassignedAdmins);
      console.log(`✅ Loaded ${unassignedAdmins.length} available administrators`);
    } catch (error) {
      console.error('❌ Error loading available administrators:', error);
      setAvailableAdmins([]);
    }
  };

  const assignAdministrator = async (adminId: string) => {
    try {
      console.log(`🔗 Assigning administrator ${adminId} to shelter ${shelterId}`);
      
      await updateDoc(doc(db, 'users', adminId), {
        shelter_id: shelterId,
        updated_at: new Date()
      });

      // Refresh the lists
      await loadShelterAdministrators(shelterId);
      await loadAvailableAdministrators();
      
      console.log(`✅ Administrator assigned successfully`);
    } catch (error) {
      console.error('❌ Error assigning administrator:', error);
      alert('Error assigning administrator. Please try again.');
    }
  };

  const removeAdministrator = async (adminId: string) => {
    try {
      console.log(`🔗 Removing administrator ${adminId} from shelter ${shelterId}`);
      
      await updateDoc(doc(db, 'users', adminId), {
        shelter_id: null,
        updated_at: new Date()
      });

      // Refresh the lists
      await loadShelterAdministrators(shelterId);
      await loadAvailableAdministrators();
      
      console.log(`✅ Administrator removed successfully`);
    } catch (error) {
      console.error('❌ Error removing administrator:', error);
      alert('Error removing administrator. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!shelter) return;
    
    setSaving(true);
    try {
      console.log(`💾 Saving changes for shelter: ${shelterId}`);
      
      await updateDoc(doc(db, 'shelters', shelterId), {
        name: formData.name,
        location: formData.location,
        address: formData.address,
        capacity: formData.capacity,
        'contact.email': formData.email,
        'contact.phone': formData.phone,
        'contact.name': formData.contactName,
        verified: formData.verified,
        updatedAt: new Date()
      });

      console.log(`✅ Successfully updated shelter: ${formData.name}`);
      alert(`Shelter "${formData.name}" updated successfully!`);
      router.push(`/dashboard/shelters/${shelterId}/view`);
      
    } catch (error) {
      console.error('❌ Error updating shelter:', error);
      alert('Error updating shelter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/shelters/${shelterId}/view`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Edit Shelter
            </h1>
            <p className="text-muted-foreground mt-1">
              Editing: {shelter.name}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Shelter Details</TabsTrigger>
          <TabsTrigger value="administrators">
            Administrators ({shelterAdmins.length})
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update shelter name, location, and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Shelter Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter shelter name"
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Province"
                />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address"
                />
              </div>

              {/* Capacity */}
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter capacity"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Name */}
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  placeholder="Enter contact name"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Contact Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Shield className="h-5 w-5" />
                Verified Shelter Status
              </CardTitle>
              <CardDescription>
                Verified shelters display a badge on their public page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Verified Status</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.verified ? 'This shelter is verified' : 'This shelter is not verified'}
                  </p>
                </div>
                <Switch
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Administrators Tab */}
        <TabsContent value="administrators" className="space-y-6 mt-6">
          {/* Current Administrators */}
          <Card>
            <CardHeader>
              <CardTitle>Current Administrators</CardTitle>
              <CardDescription>Administrators assigned to this shelter</CardDescription>
            </CardHeader>
            <CardContent>
              {shelterAdmins.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No administrators assigned to this shelter.</p>
              ) : (
                <div className="space-y-2">
                  {shelterAdmins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div>
                        <p className="font-medium">{admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <Badge variant="secondary" className="mt-1 capitalize">{admin.role}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdministrator(admin.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
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
              <CardTitle>Available Administrators</CardTitle>
              <CardDescription>Assign new administrators to this shelter</CardDescription>
            </CardHeader>
            <CardContent>
              {availableAdmins.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No unassigned administrators available.</p>
              ) : (
                <div className="space-y-2">
                  {availableAdmins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <Badge variant="outline" className="mt-1 capitalize">{admin.role}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => assignAdministrator(admin.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

