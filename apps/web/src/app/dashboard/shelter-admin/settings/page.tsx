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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Uploading photos:', files);
    // Handle photo upload logic - will implement in Photos tab
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
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Administrator" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Users className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled={!isEditing}>
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>

                  {/* Admin Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <input 
                          type="text" 
                          value={user?.displayName?.split(' ')[0] || 'Sarah'}
                          disabled={!isEditing}
                          className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <input 
                          type="text" 
                          value={user?.displayName?.split(' ')[1] || 'Manager'}
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
                        value="Shelter Administrator"
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="e.g., Executive Director"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <input 
                        type="email" 
                        value={user?.email || formData.email}
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="admin@shelter.org"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio / About</label>
                      <textarea 
                        disabled={!isEditing}
                        rows={3}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-950"
                        placeholder="Brief introduction about the administrator..."
                        defaultValue="Dedicated to providing compassionate care and comprehensive support services to individuals experiencing homelessness in our community."
                      />
                    </div>
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
                  <CardDescription>How your location appears to visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  {formData.address ? (
                    <div className="rounded-lg overflow-hidden h-64">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(formData.address)}`}
                      />
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
                <CardDescription>Showcase your shelter with photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload New Photos</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add high-quality photos to showcase your shelter
                    </p>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button variant="outline" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Photos
                      </Button>
                    </label>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <input 
                          type="text"
                          value={photo.caption}
                          disabled={!isEditing}
                          placeholder="Add caption..."
                          className="w-full mt-2 p-1 text-xs border rounded"
                        />
                      </div>
                    ))}
                  </div>
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