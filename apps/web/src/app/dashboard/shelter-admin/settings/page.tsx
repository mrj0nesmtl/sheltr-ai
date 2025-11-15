'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getShelterMetrics, ShelterMetrics } from '@/services/platformMetrics';
import { generateShelterQRCode } from '@/services/qrCodeService';
import { shelterService, ShelterPublicConfig } from '@/services/shelterService';
import { uploadProfilePicture } from '@/services/fileStorageService';
import { ShelterAdminSyncService } from '@/services/shelterAdminSyncService';
import { 
  QrCode, 
  Camera, 
  MapPin,
  Globe,
  Upload,
  Eye,
  Save,
  Download,
  Edit,
  Trash2,
  Plus,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  Clock,
  Users,
  Bed,
  Heart,
  Shield,
  Copy,
  CheckCircle,
  ExternalLink,
  Image,
  Map,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [shelterData, setShelterData] = useState<ShelterMetrics | null>(null);
  const [publicConfig, setPublicConfig] = useState<ShelterPublicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Real shelter configuration - this would come from a detailed shelter profile
  const [formData, setFormData] = useState({
    name: '',
    description: 'Providing safe, dignified shelter and comprehensive support services to help individuals and families transition from homelessness to stable housing.',
    address: '300 Rue Smith, Montreal, QC H3J 2S2', // Old Brewery Mission real address
    phone: '(514) 935-4590', // Old Brewery Mission real phone
    email: 'info@missionoldbrewery.ca',
    website: 'https://www.missionoldbrewery.ca',
    capacity: 300,
    currentOccupancy: 1,
    established: '1889', // Old Brewery Mission established date
    operatingHours: '24/7',
    checkInTime: '8:00 PM',
    checkOutTime: '7:00 AM',
    qrCode: 'https://sheltr-ai.web.app/old-brewery-mission',
    socialMedia: {
      facebook: 'https://facebook.com/OldBreweryMission',
      twitter: 'https://twitter.com/OBMission',
      instagram: 'https://instagram.com/oldbrewerymission'
    },
    services: [
      'Emergency Shelter',
      'Meals (3x daily)',
      'Medical Care',
      'Mental Health Counseling',
      'Job Training',
      'Legal Aid',
      'Case Management',
      'Housing Assistance'
    ],
    photos: [
      { id: 1, url: '/api/placeholder/400/300', caption: 'Main entrance and reception area' },
      { id: 2, url: '/api/placeholder/400/300', caption: 'Dining hall during evening meal' },
      { id: 3, url: '/api/placeholder/400/300', caption: 'Clean, safe sleeping quarters' },
      { id: 4, url: '/api/placeholder/400/300', caption: 'Medical clinic and pharmacy' }
    ]
  });

  const serviceIcons = {
    'Emergency Shelter': Bed,
    'Meals (3x daily)': Heart,
    'Medical Care': Shield,
    'Mental Health Counseling': Heart,
    'Job Training': Users,
    'Legal Aid': Shield,
    'Case Management': Users,
    'Housing Assistance': Bed
  };

  // Load admin profile picture and profile data from Firestore
  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAdminProfilePicture(userData.profilePicture || user.photoURL || '');
          
          // Load admin profile data
          setAdminProfile({
            firstName: userData.firstName || user.displayName?.split(' ')[0] || '',
            lastName: userData.lastName || user.displayName?.split(' ')[1] || '',
            title: userData.title || 'Shelter Administrator',
            email: userData.email || user.email || '',
            phone: userData.phone || userData.phoneNumber || '',
            bio: userData.bio || ''
          });
        } else {
          setAdminProfilePicture(user.photoURL || '');
          setAdminProfile({
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            title: 'Shelter Administrator',
            email: user.email || '',
            phone: '',
            bio: ''
          });
        }
      } catch (error) {
        console.error('Error loading admin profile:', error);
        setAdminProfilePicture(user.photoURL || '');
      }
    };

    if (user) {
      loadAdminProfile();
    }
  }, [user]);

  // Load real shelter data and public configuration
  useEffect(() => {
    const loadShelterData = async () => {
      const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
      
      if (!shelterId) {
        setError('No shelter assigned to this admin');
        setLoading(false);
        return;
      }

      try {
        console.log('🏠 Loading shelter settings for:', shelterId);
        
        // Load metrics
        const metrics = await getShelterMetrics(shelterId);
        if (metrics) {
          setShelterData(metrics);
        }
        
        // Load public configuration
        const config = await shelterService.getShelterPublicConfig(shelterId);
        if (config) {
          setPublicConfig(config);
          
          // Load existing QR code if available
          if (config.qrCode?.url) {
            setQrCodeUrl(config.qrCode.url);
            console.log('✅ Existing QR code loaded:', config.qrCode.url);
          }
          
          // Update form data with real shelter information
          setFormData({
            name: config.name || metrics?.shelterName || '',
            description: config.description || '',
            address: config.address || '',
            phone: config.phone || '',
            email: config.email || '',
            website: config.socialMedia?.website || '',
            capacity: metrics?.capacity || 0,
            currentOccupancy: metrics?.totalParticipants || 0,
            established: config.established || '',
            operatingHours: '24/7', // Will be derived from config
            checkInTime: '', // Will be added to config
            checkOutTime: '', // Will be added to config
            qrCode: config.qrCode?.url || '',
            socialMedia: {
              facebook: config.socialMedia?.facebook || '',
              twitter: config.socialMedia?.twitter || '',
              instagram: config.socialMedia?.instagram || ''
            },
            services: config.services || [],
            photos: [] // Will be loaded separately
          });
          
          console.log('✅ Shelter configuration loaded:', config);
        } else {
          console.log('⚠️ No public config found, will create on first save');
        }
        
      } catch (error) {
        console.error('❌ Failed to load shelter data:', error);
        setError('Failed to load shelter data');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('admin')) {
      loadShelterData();
    }
  }, [user, hasRole]);

  const handleSave = async () => {
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    
    if (!shelterId) {
      alert('Error: No shelter ID found');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Saving shelter configuration...');
      
      // Prepare update data
      const updateData: Partial<ShelterPublicConfig> = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        services: formData.services,
        established: formData.established,
        socialMedia: {
          website: formData.website,
          facebook: formData.socialMedia.facebook,
          twitter: formData.socialMedia.twitter,
          instagram: formData.socialMedia.instagram
        }
      };
      
      // Update public configuration
      await shelterService.updateShelterPublicConfig(shelterId, updateData);
      
      console.log('✅ Shelter configuration saved successfully');
      alert('Settings saved successfully!');
      setIsEditing(false);
      
      // Reload config to get fresh data
      const updatedConfig = await shelterService.getShelterPublicConfig(shelterId);
      if (updatedConfig) {
        setPublicConfig(updatedConfig);
      }
      
    } catch (error) {
      console.error('❌ Error saving shelter configuration:', error);
      alert(`Failed to save settings: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  const generateQRCode = async () => {
    // Get shelter ID from user's custom claims
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    
    if (!shelterId) {
      console.error('No shelter ID available');
      alert('Error: Unable to generate QR code. Shelter ID not found.');
      return;
    }

    try {
      setGeneratingQR(true);
      console.log(`🔄 Generating QR code for shelter: ${shelterData?.shelterName} (${shelterId})`);
      
      const result = await generateShelterQRCode(
        shelterId,
        shelterData?.shelterName || 'Shelter',
        {
          size: 400,
          margin: 2
        }
      );

      setQrCodeUrl(result.qrCodeUrl);
      console.log('✅ QR code generated successfully:', result.qrCodeUrl);
      alert('QR code generated successfully! It will now appear on your public shelter page.');
      
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
      alert(`Failed to generate QR code: ${error}`);
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    if (!shelterId) {
      alert('Error: No shelter ID found');
      return;
    }

    try {
      setUploadingLogo(true);
      console.log('📸 Uploading shelter logo...');
      
      const logoUrl = await shelterService.uploadShelterLogo(shelterId, file);
      
      // Update public config with new logo
      await shelterService.updateShelterPublicConfig(shelterId, { logoUrl });
      
      // Reload config
      const updatedConfig = await shelterService.getShelterPublicConfig(shelterId);
      if (updatedConfig) {
        setPublicConfig(updatedConfig);
      }
      
      console.log('✅ Logo uploaded successfully');
      alert('Logo uploaded successfully!');
      
    } catch (error) {
      console.error('❌ Error uploading logo:', error);
      alert(`Failed to upload logo: ${error}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    if (!shelterId) {
      alert('Shelter ID not found');
      return;
    }
    
    setUploadingPhoto(true);
    
    try {
      console.log(`📸 Uploading ${files.length} photo(s)...`);
      
      // Get current photos to determine order
      const currentPhotos = publicConfig?.photos || [];
      let nextOrder = currentPhotos.length;
      
      // Upload all files
      const uploadPromises = files.map(async (file) => {
        const photo = await shelterService.uploadShelterPhoto(shelterId, file, nextOrder++);
        return photo;
      });
      
      const newPhotos = await Promise.all(uploadPromises);
      
      // Update public config with new photos
      const updatedPhotos = [...currentPhotos, ...newPhotos];
      await shelterService.updateShelterPublicConfig(shelterId, { photos: updatedPhotos });
      
      // Reload config
      const updatedConfig = await shelterService.getShelterPublicConfig(shelterId);
      if (updatedConfig) setPublicConfig(updatedConfig);
      
      alert(`Successfully uploaded ${newPhotos.length} photo(s)!`);
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Error uploading photos:', error);
      alert(`Failed to upload photos: ${error}`);
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  const handlePhotoDelete = async (photoId: string) => {
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    if (!shelterId || !publicConfig?.photos) return;
    
    const photo = publicConfig.photos.find(p => p.id === photoId);
    if (!photo) return;
    
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      await shelterService.deleteShelterPhoto(shelterId, photo);
      
      // Reload config
      const updatedConfig = await shelterService.getShelterPublicConfig(shelterId);
      if (updatedConfig) setPublicConfig(updatedConfig);
      
      alert('Photo deleted successfully!');
      
    } catch (error) {
      console.error('❌ Error deleting photo:', error);
      alert(`Failed to delete photo: ${error}`);
    }
  };
  
  const handleCaptionChange = async (photoId: string, caption: string) => {
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    if (!shelterId) return;
    
    try {
      await shelterService.updatePhotoCaption(shelterId, photoId, caption);
      
      // Update local state immediately for better UX
      if (publicConfig?.photos) {
        const updatedPhotos = publicConfig.photos.map(p => 
          p.id === photoId ? { ...p, caption } : p
        );
        setPublicConfig({ ...publicConfig, photos: updatedPhotos });
      }
      
    } catch (error) {
      console.error('❌ Error updating caption:', error);
      alert(`Failed to update caption: ${error}`);
    }
  };

  const [uploadingAdminPhoto, setUploadingAdminPhoto] = useState(false);
  const [adminProfilePicture, setAdminProfilePicture] = useState<string>('');
  const [adminProfile, setAdminProfile] = useState({
    firstName: '',
    lastName: '',
    title: 'Shelter Administrator',
    email: '',
    phone: '',
    bio: ''
  });

  const handleAdminProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;

    setUploadingAdminPhoto(true);

    try {
      console.log('📸 Uploading admin profile picture...');
      
      // Upload to Firebase Storage
      const photoUrl = await uploadProfilePicture(file, user.uid);
      
      // CRITICAL: Update Firestore with the new profile picture URL
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'users', user.uid), {
        profilePicture: photoUrl
      });
      
      // Update local state immediately
      setAdminProfilePicture(photoUrl);
      
      // Sync admin profile to shelter contact info
      if (shelterId) {
        console.log('🔄 Syncing admin profile to shelter...');
        await ShelterAdminSyncService.syncAdminToShelter(user.uid, shelterId);
      }
      
      console.log('✅ Profile picture uploaded and saved to Firestore');
      alert('Profile picture uploaded successfully!');
      
    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
      alert(`Failed to upload profile picture: ${error}`);
    } finally {
      setUploadingAdminPhoto(false);
    }
  };

  const handleAdminProfilePictureDelete = async () => {
    if (!user?.uid || !adminProfilePicture) return;
    
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    
    // Safety check: Don't delete fallback images from /profiles/leadership/
    if (adminProfilePicture.includes('/profiles/leadership/')) {
      alert('Cannot delete fallback team images. Please upload your own picture first.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    setUploadingAdminPhoto(true);

    try {
      console.log('🗑️ Deleting admin profile picture...');
      
      // Update Firestore to remove profile picture
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'users', user.uid), {
        profilePicture: ''
      });
      
      // Update local state immediately
      setAdminProfilePicture('');
      
      // Sync admin profile to shelter contact info
      if (shelterId) {
        console.log('🔄 Syncing admin profile to shelter...');
        await ShelterAdminSyncService.syncAdminToShelter(user.uid, shelterId);
      }
      
      console.log('✅ Profile picture deleted from Firestore');
      alert('Profile picture deleted successfully!');
      
    } catch (error) {
      console.error('❌ Error deleting profile picture:', error);
      alert(`Failed to delete profile picture: ${error}`);
    } finally {
      setUploadingAdminPhoto(false);
    }
  };

  const handleAdminProfileSave = async () => {
    if (!user?.uid) return;
    
    const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
    
    try {
      setSaving(true);
      console.log('💾 Saving admin profile...');
      
      // Update Firestore with admin profile data
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      const displayName = `${adminProfile.firstName} ${adminProfile.lastName}`.trim();
      
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: adminProfile.firstName,
        lastName: adminProfile.lastName,
        displayName: displayName,
        title: adminProfile.title,
        email: adminProfile.email,
        phone: adminProfile.phone,
        bio: adminProfile.bio,
        updatedAt: new Date()
      });
      
      // Sync admin profile to shelter contact info
      if (shelterId) {
        console.log('🔄 Syncing admin profile to shelter contact...');
        await ShelterAdminSyncService.syncAdminToShelter(user.uid, shelterId);
      }
      
      console.log('✅ Admin profile saved and synced successfully');
      alert('Your profile has been saved and synced to the shelter!');
      
    } catch (error) {
      console.error('❌ Error saving admin profile:', error);
      alert(`Failed to save profile: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  // Check if user has shelter admin or super admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Shelter Admin access required for this dashboard.
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings & Configuration</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading shelter settings...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading shelter configuration...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !shelterData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings & Configuration Error</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Unable to load shelter settings
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Settings</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings & Configuration</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {formData.name} • Real Shelter Configuration • Status: ✅ Live Data Connected
          </p>
        </div>
        <div className="flex space-x-2">
          {previewMode ? (
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Mode
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Public Page
            </Button>
          )}
          {isEditing ? (
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit Information
            </Button>
          )}
        </div>
      </div>

      {previewMode ? (
        // Public Page Preview
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900 dark:text-blue-100">Public Page Preview</CardTitle>
              </div>
              <a 
                href={`https://sheltr-ai.web.app/${shelterData?.shelterId || 'old-brewery-mission'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  Live at sheltr-ai.web.app/{shelterData?.shelterId || 'old-brewery-mission'}
                </Badge>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {/* Public Page Content */}
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">{formData.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {formData.description}
                </p>
                <div className="flex justify-center space-x-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <Bed className="mr-1 h-3 w-3" />
                    {formData.capacity - formData.currentOccupancy} beds available (Real Data)
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    {formData.operatingHours}
                  </Badge>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{photo.caption}</p>
                  </div>
                ))}
              </div>

              {/* Services Grid */}
              <div>
                <h2 className="text-2xl font-bold text-center mb-6">Services We Provide</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.services.map((service, index) => {
                    const IconComponent = serviceIcons[service as keyof typeof serviceIcons] || Heart;
                    return (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <div className="flex justify-center mb-2">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                          </div>
                        </div>
                        <p className="text-sm font-medium">{service}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formData.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formData.email}</span>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <Button variant="outline" size="sm">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hours & Check-in</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Operating Hours:</span>
                      <span className="text-sm">{formData.operatingHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Check-in Time:</span>
                      <span className="text-sm">{formData.checkInTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Check-out Time:</span>
                      <span className="text-sm">{formData.checkOutTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Established:</span>
                      <span className="text-sm">{formData.established}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* QR Code Section */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Quick Access QR Code</h3>
                <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600 mt-2">Scan for shelter info & services</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Configuration Tabs
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="location">Location & Map</TabsTrigger>
            <TabsTrigger value="photos">Photos & Media</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Shelter Logo Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="h-5 w-5" />
                  <span>Shelter Logo</span>
                </CardTitle>
                <CardDescription>Upload your shelter's logo for public page and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                      {publicConfig?.logoUrl ? (
                        <img 
                          src={publicConfig.logoUrl} 
                          alt="Shelter Logo" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <Image className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upload a high-quality logo (recommended: 512x512px, PNG or SVG format)
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={!isEditing || uploadingLogo}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={!isEditing || uploadingLogo}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </>
                        )}
                      </Button>
                      {publicConfig?.logoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={!isEditing}
                          onClick={async () => {
                            if (confirm('Are you sure you want to remove the logo?')) {
                              const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;
                              if (shelterId) {
                                await shelterService.updateShelterPublicConfig(shelterId, { logoUrl: '' });
                                const updatedConfig = await shelterService.getShelterPublicConfig(shelterId);
                                if (updatedConfig) setPublicConfig(updatedConfig);
                              }
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shelter Administrator Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Shelter Administrator Profile</span>
                </CardTitle>
                <CardDescription>Administrator information displayed on public page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Admin Profile Picture */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Profile Picture</label>
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 mx-auto">
                      {adminProfilePicture ? (
                        <img 
                          src={adminProfilePicture} 
                          alt="Administrator" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Users className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="admin-profile-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAdminProfilePictureUpload}
                      disabled={!isEditing || uploadingAdminPhoto}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      disabled={!isEditing || uploadingAdminPhoto}
                      onClick={() => document.getElementById('admin-profile-upload')?.click()}
                    >
                      {uploadingAdminPhoto ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                    
                    {/* Delete Photo Button - Only show if user has uploaded their own picture */}
                    {adminProfilePicture && !adminProfilePicture.includes('/profiles/leadership/') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" 
                        disabled={!isEditing || uploadingAdminPhoto}
                        onClick={handleAdminProfilePictureDelete}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Photo
                      </Button>
                    )}
                  </div>

                  {/* Admin Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <input 
                          type="text" 
                          value={adminProfile.firstName}
                          onChange={(e) => setAdminProfile({...adminProfile, firstName: e.target.value})}
                          disabled={!isEditing}
                          className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <input 
                          type="text" 
                          value={adminProfile.lastName}
                          onChange={(e) => setAdminProfile({...adminProfile, lastName: e.target.value})}
                          disabled={!isEditing}
                          className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title / Position</label>
                      <input 
                        type="text" 
                        value={adminProfile.title}
                        onChange={(e) => setAdminProfile({...adminProfile, title: e.target.value})}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="e.g., Executive Director"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <input 
                        type="email" 
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="admin@shelter.org"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <input 
                        type="tel" 
                        value={adminProfile.phone}
                        onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio / About</label>
                      <textarea 
                        value={adminProfile.bio}
                        onChange={(e) => setAdminProfile({...adminProfile, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="Brief introduction about the administrator..."
                      />
                    </div>
                    
                    {/* Save Admin Profile Button */}
                    {isEditing && (
                      <Button 
                        onClick={handleAdminProfileSave}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving & Syncing...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save & Sync Profile
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Core details about your shelter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Shelter Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      value={formData.description}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full mt-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Capacity</label>
                      <input 
                        type="number" 
                        value={formData.capacity}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md"
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Established</label>
                      <input 
                        type="text" 
                        value={formData.established}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md"
                        onChange={(e) => setFormData({...formData, established: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How people can reach your shelter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <input 
                      type="url" 
                      value={formData.website}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                  <CardDescription>Schedule and availability information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Operating Hours</label>
                    <input 
                      type="text" 
                      value={formData.operatingHours}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Check-in Time</label>
                      <input 
                        type="time" 
                        value={formData.checkInTime}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md"
                        onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Check-out Time</label>
                      <input 
                        type="time" 
                        value={formData.checkOutTime}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md"
                        onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Connect your social media presence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <input 
                      type="url" 
                      placeholder="Facebook URL"
                      value={formData.socialMedia.facebook}
                      disabled={!isEditing}
                      className="flex-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialMedia: {...formData.socialMedia, facebook: e.target.value}
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <input 
                      type="url" 
                      placeholder="Twitter URL"
                      value={formData.socialMedia.twitter}
                      disabled={!isEditing}
                      className="flex-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialMedia: {...formData.socialMedia, twitter: e.target.value}
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <input 
                      type="url" 
                      placeholder="Instagram URL"
                      value={formData.socialMedia.instagram}
                      disabled={!isEditing}
                      className="flex-1 p-2 border rounded-md"
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialMedia: {...formData.socialMedia, instagram: e.target.value}
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Address & Location</CardTitle>
                  <CardDescription>Physical location of your shelter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Address</label>
                    <textarea 
                      value={formData.address}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full mt-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Enter your shelter's full address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input 
                        type="email"
                        value={formData.email}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contact@shelter.org"
                      />
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (formData.address) {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
                        window.open(mapsUrl, '_blank');
                      } else {
                        alert('Please enter an address first');
                      }
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Google Maps
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Map Preview</CardTitle>
                  <CardDescription>Interactive map showing your shelter location</CardDescription>
                </CardHeader>
                <CardContent>
                  {formData.address ? (
                    <div className="space-y-4">
                      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        // Live Google Maps Embed
                        <div className="rounded-lg overflow-hidden h-64 border border-gray-200 dark:border-gray-700">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(formData.address)}`}
                          />
                        </div>
                      ) : (
                        // Fallback UI (no API key)
                        <div className="rounded-lg overflow-hidden h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <div className="text-center p-6">
                            <MapPin className="h-12 w-12 mx-auto text-blue-500 mb-3" />
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {formData.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              Click below to view on Google Maps
                            </p>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
                                window.open(mapsUrl, '_blank');
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open in Google Maps
                            </Button>
                          </div>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
                          window.open(mapsUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Full Google Maps
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Enter an address to see map preview
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>Showcase your shelter with high-quality photos (max 8 photos recommended)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload New Photos</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add high-quality photos to showcase your shelter (JPG, PNG, max 5MB each)
                    </p>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      disabled={uploadingPhoto}
                    />
                    <label htmlFor="photo-upload">
                      <Button 
                        variant="outline" 
                        className="cursor-pointer"
                        disabled={uploadingPhoto}
                        asChild
                      >
                        <span>
                          {uploadingPhoto ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Choose Photos
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>

                  {/* Photo Grid */}
                  {publicConfig?.photos && publicConfig.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {publicConfig.photos
                        .sort((a, b) => a.order - b.order)
                        .map((photo) => (
                          <div key={photo.id} className="relative group">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 overflow-hidden">
                              <img 
                                src={photo.url} 
                                alt={photo.caption || 'Shelter photo'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 p-0"
                                onClick={() => handlePhotoDelete(photo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <input 
                              type="text"
                              value={photo.caption || ''}
                              onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                              placeholder="Add caption..."
                              className="w-full mt-2 p-2 text-xs border rounded dark:bg-gray-800 dark:border-gray-700"
                            />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No photos uploaded yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Upload photos to showcase your shelter</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
                <CardDescription>List the services your shelter provides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          {serviceIcons[service as keyof typeof serviceIcons] && 
                            React.createElement(serviceIcons[service as keyof typeof serviceIcons], {
                              className: "h-4 w-4 text-blue-600 dark:text-blue-300"
                            })
                          }
                        </div>
                        <span className="font-medium">{service}</span>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Service
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr-codes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shelter QR Code</CardTitle>
                  <CardDescription>Quick access to your shelter's public page</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {qrCodeUrl ? (
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <img 
                        src={qrCodeUrl} 
                        alt="Shelter QR Code" 
                        className="h-48 w-48 mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Links to: https://sheltr-ai.web.app/{user?.customClaims?.shelter_id || 'old-brewery-mission'}
                  </p>
                  <div className="flex space-x-2 justify-center">
                    <Button 
                      variant="outline" 
                      onClick={generateQRCode}
                      disabled={generatingQR}
                    >
                      {generatingQR ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <QrCode className="mr-2 h-4 w-4" />
                          Regenerate
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      disabled={!qrCodeUrl}
                      asChild={!!qrCodeUrl}
                    >
                      {qrCodeUrl ? (
                        <a href={qrCodeUrl} download="shelter-qr-code.png">
                          <Download className="mr-2 h-4 w-4" />
                          Download PNG
                        </a>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PNG
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const link = `https://sheltr-ai.web.app/${user?.customClaims?.shelter_id || 'old-brewery-mission'}`;
                        navigator.clipboard.writeText(link);
                        alert('Link copied to clipboard!');
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Usage</CardTitle>
                  <CardDescription>How to use your shelter's QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Print & Display</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Place at your entrance, on flyers, and information boards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Share Digitally</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Include in emails, social media, and digital materials
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Easy Access</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          People can scan to instantly view your services and contact info
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Public Page Features:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Real-time bed availability</li>
                      <li>• Service listings & descriptions</li>
                      <li>• Contact information & hours</li>
                      <li>• Photo gallery</li>
                      <li>• Map & directions</li>
                      <li>• Social media links</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 