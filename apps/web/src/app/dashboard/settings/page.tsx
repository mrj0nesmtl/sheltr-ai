"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { SystemHealthService, SystemHealthMetrics } from '@/services/systemHealthService';
import { NDAPreview } from '@/components/admin/NDAPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { FileUpload } from '@/components/FileUpload';
import { 
  Settings, 
  Database, 
  Shield, 
  Mail, 
  Users,
  Globe,
  Key,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Code,
  Zap,
  Activity,
  User,
  Camera,
  Calendar,
  MapPin,
  Bot,
  Brain,
  Wifi,
  HardDrive,
  Eye
} from 'lucide-react';

export default function SystemSettingsPage() {
  const { user, isSuperAdmin, isPlatformAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [showNDAPreview, setShowNDAPreview] = useState(false);

  // Mock settings state - would be replaced with real API calls
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'SHELTR',
    platformVersion: '2.7.0',
    maintenanceMode: false,
    debugMode: false,
    dataRetentionDays: 365,
    maxFileUploadSize: 10,
    emailVerificationRequired: true,
    multiFactorAuthEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    pushNotificationsEnabled: true,
    newUserRegistrations: true,
    newShelterApplications: true,
    systemAlerts: true,
    dailyReports: true,
    adminDigestFrequency: 'weekly'
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    ipWhitelistEnabled: false,
    encryptionLevel: 'AES-256',
    auditLoggingEnabled: true,
    dataBackupFrequency: 'daily'
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    firebaseConfigured: true,
    adyenConfigured: true,
    emailServiceConfigured: true,
    smsServiceConfigured: false,
    blockchainIntegration: 'development',
    analyticsTracking: true,
    errorReporting: true,
    performanceMonitoring: true
  });

  const [userProfile, setUserProfile] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    position: '', // Changed from jobTitle to position - read-only for platform admins
    company: 'SHELTR-AI Technologies Inc.',
    location: '',
    bio: '',
    timezone: 'America/Montreal',
    language: 'English',
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    linkedIn: '',
    twitter: '',
    website: ''
  });

  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);

  // Function to load system health metrics
  const loadSystemHealth = async () => {
    try {
      setHealthLoading(true);
      console.log('🏥 Loading system health metrics...');
      const health = await SystemHealthService.getSystemHealth();
      setSystemHealth(health);
      console.log('✅ System health loaded:', health);
    } catch (error) {
      console.error('❌ Error loading system health:', error);
    } finally {
      setHealthLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.uid) return;
      
      try {
        setInitialLoading(true);
        
        // Load system settings
        const systemSettings = await SystemSettingsService.getSystemSettings();
        if (systemSettings) {
          setGeneralSettings(systemSettings.general);
          setSecuritySettings(systemSettings.security);
          setNotificationSettings(systemSettings.notifications);
          setIntegrationSettings(systemSettings.integrations);
        }
        
        // Load user profile based on role
        if (isSuperAdmin()) {
          const profile = await SystemSettingsService.getSuperAdminProfile(user.uid);
          if (profile) {
            setUserProfile(prev => ({
              ...prev,
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              phone: profile.phone,
              position: profile.jobTitle, // Super admin can edit position
              company: profile.company,
              location: profile.location,
              bio: profile.bio,
              timezone: profile.timezone,
              language: profile.language,
              twoFactorEnabled: profile.twoFactorEnabled,
              emailNotifications: profile.emailNotifications,
              smsNotifications: profile.smsNotifications,
              loginAlerts: profile.loginAlerts
            }));
          }
        } else if (isPlatformAdmin()) {
          // Load platform admin profile using our enhanced service
          const { PlatformAdminProfileService } = await import('@/services/platformAdminProfileService');
          const profile = await PlatformAdminProfileService.getPlatformAdminProfile(user.uid);
          if (profile) {
            setUserProfile(prev => ({
              ...prev,
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              phone: profile.phone || '',
              position: profile.specialization, // Read-only from database
              company: 'SHELTR-AI Technologies Inc.',
              location: profile.department,
              bio: profile.bio || '',
              linkedIn: profile.linkedIn || '',
              twitter: profile.twitter || '',
              website: profile.website || ''
            }));
          }
        }
        
      } catch (error) {
        console.error('❌ Error loading settings:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadSettings();
    loadSystemHealth();
  }, [user?.uid, isSuperAdmin, isPlatformAdmin]);

  const handleSaveSettings = async (settingsType: string) => {
    if (!user?.uid) return;
    
    setSaveStatus('saving');
    setIsLoading(true);
    
    try {
      let success = false;
      
      switch (settingsType) {
        case 'general':
          success = await SystemSettingsService.saveSystemSettings(
            { general: generalSettings }, 
            user.uid, 
            'general'
          );
          break;
          
        case 'security':
          success = await SystemSettingsService.saveSystemSettings(
            { security: securitySettings }, 
            user.uid, 
            'security'
          );
          break;
          
        case 'notifications':
          success = await SystemSettingsService.saveSystemSettings(
            { notifications: notificationSettings }, 
            user.uid, 
            'notifications'
          );
          break;
          
        case 'integrations':
          success = await SystemSettingsService.saveSystemSettings(
            { integrations: integrationSettings }, 
            user.uid, 
            'integrations'
          );
          break;
          
        case 'profile':
        case 'admin-security':
          if (isSuperAdmin()) {
            success = await SystemSettingsService.saveSuperAdminProfile(
              user.uid, 
              userProfile
            );
          } else if (isPlatformAdmin()) {
            const { PlatformAdminProfileService } = await import('@/services/platformAdminProfileService');
            success = await PlatformAdminProfileService.updatePlatformAdminProfile(
              user.uid,
              {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                bio: userProfile.bio,
                phone: userProfile.phone,
                linkedIn: userProfile.linkedIn,
                twitter: userProfile.twitter,
                website: userProfile.website
                // Note: position (specialization) is read-only for platform admins
              }
            );
          }
          break;
          
        default:
          console.warn(`Unknown settings type: ${settingsType}`);
          success = false;
      }
      
      if (success) {
        setSaveStatus('saved');
        
        // Create audit log
        await SystemSettingsService.createAuditLog(
          user.uid,
          `Updated ${settingsType} settings`,
          settingsType,
          { timestamp: new Date() }
        );
      } else {
        setSaveStatus('error');
      }
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not super admin or platform admin
  if (user?.role !== 'super_admin' && user?.role !== 'platform_admin') {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">Only Super Admins and Platform Administrators can access system settings.</p>
      </div>
    );
  }

  // Show loading state while loading initial settings
  if (initialLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-lg font-semibold mb-2">Loading System Settings</h2>
            <p className="text-gray-600">Please wait while we load your configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            System Settings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Configure platform settings and system parameters
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === 'super_admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNDAPreview(true)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview NDA</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSystemHealth()}
            disabled={healthLoading}
            className="flex items-center space-x-2"
          >
            {healthLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Refresh Status</span>
          </Button>
          {saveStatus === 'saved' && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Saved
            </Badge>
          )}
          {saveStatus === 'error' && (
            <Badge className="bg-red-500 text-white">
              <AlertCircle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
      </div>

      {/* System Health Status Cards */}
      {healthLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Platform Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth?.platform.status === 'operational' ? 'bg-green-500' :
                  systemHealth?.platform.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium capitalize">
                  {systemHealth?.platform.status || 'Operational'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.platform.uptime || '99.9%'} uptime
              </p>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth?.database.status === 'connected' ? 'bg-green-500' :
                  systemHealth?.database.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium capitalize">
                  {systemHealth?.database.status || 'Connected'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.database.totalCollections || 0} collections
              </p>
            </CardContent>
          </Card>

          {/* AI Chatbot Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Chatbot</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth?.aiChatbot.status === 'active' ? 'bg-green-500' :
                  systemHealth?.aiChatbot.status === 'starting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium capitalize">
                  {systemHealth?.aiChatbot.status || 'Starting'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.aiChatbot.activeConnections || 0} active connections
              </p>
            </CardContent>
          </Card>

          {/* Knowledge Base Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth?.knowledgeBase.status === 'ready' ? 'bg-green-500' :
                  systemHealth?.knowledgeBase.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium capitalize">
                  {systemHealth?.knowledgeBase.status || 'Ready'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.knowledgeBase.totalDocuments || 0} documents
              </p>
            </CardContent>
          </Card>

          {/* API Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth?.api.status === 'operational' ? 'bg-green-500' :
                  systemHealth?.api.status === 'slow' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {systemHealth?.api.responseTime || 0}ms
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.api.uptime || 99.9}% uptime
              </p>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    systemHealth?.security.status === 'protected' ? 'bg-green-500' :
                    systemHealth?.security.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium capitalize">
                    {systemHealth?.security.status || 'Protected'}
                  </span>
                </div>
                {systemHealth?.security.status === 'warning' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      // Navigate to Security & Compliance dashboard
                      window.location.href = '/dashboard/security';
                    }}
                  >
                    View
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.security.encryptionLevel || 'AES-256'}
              </p>
            </CardContent>
          </Card>

          {/* Integrations Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integrations</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  (systemHealth?.integrations.firebase && systemHealth?.integrations.openai) ? 'bg-green-500' :
                  (systemHealth?.integrations.firebase || systemHealth?.integrations.openai) ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {Object.values(systemHealth?.integrations || {}).filter(Boolean).length} / {Object.keys(systemHealth?.integrations || {}).length} Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Firebase, OpenAI, Email
              </p>
            </CardContent>
          </Card>

          {/* Platform Version */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Version</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                v{systemHealth?.platform.version || generalSettings.platformVersion}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemHealth?.platform.lastDeployment 
                  ? `Deployed ${systemHealth.platform.lastDeployment.toLocaleDateString()}`
                  : 'Latest stable'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Basic platform settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={generalSettings.platformName}
                    onChange={(e) => setGeneralSettings({...generalSettings, platformName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="platformVersion">Platform Version</Label>
                  <Input
                    id="platformVersion"
                    value={generalSettings.platformVersion}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="dataRetention">Data Retention (Days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={generalSettings.dataRetentionDays}
                    onChange={(e) => setGeneralSettings({...generalSettings, dataRetentionDays: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxFileSize">Max File Upload (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={generalSettings.maxFileUploadSize}
                    onChange={(e) => setGeneralSettings({...generalSettings, maxFileUploadSize: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">System Modes</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="debugMode"
                    checked={generalSettings.debugMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, debugMode: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="debugMode">Debug Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailVerification"
                    checked={generalSettings.emailVerificationRequired}
                    onChange={(e) => setGeneralSettings({...generalSettings, emailVerificationRequired: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="emailVerification">Require Email Verification</Label>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('general')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>Authentication, authorization, and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="encryptionLevel">Encryption Level</Label>
                  <Input
                    id="encryptionLevel"
                    value={securitySettings.encryptionLevel}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Security Features</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireSpecialChars"
                    checked={securitySettings.requireSpecialChars}
                    onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="requireSpecialChars">Require Special Characters in Passwords</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auditLogging"
                    checked={securitySettings.auditLoggingEnabled}
                    onChange={(e) => setSecuritySettings({...securitySettings, auditLoggingEnabled: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="auditLogging">Enable Audit Logging</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ipWhitelist"
                    checked={securitySettings.ipWhitelistEnabled}
                    onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelistEnabled: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="ipWhitelist">IP Whitelist (Admin Only)</Label>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('security')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={notificationSettings.emailNotificationsEnabled}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotificationsEnabled: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={notificationSettings.smsNotificationsEnabled}
                    onChange={(e) => setNotificationSettings({...notificationSettings, smsNotificationsEnabled: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={notificationSettings.pushNotificationsEnabled}
                    onChange={(e) => setNotificationSettings({...notificationSettings, pushNotificationsEnabled: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Event Notifications</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newUserRegistrations"
                    checked={notificationSettings.newUserRegistrations}
                    onChange={(e) => setNotificationSettings({...notificationSettings, newUserRegistrations: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="newUserRegistrations">New User Registrations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newShelterApplications"
                    checked={notificationSettings.newShelterApplications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, newShelterApplications: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="newShelterApplications">New Shelter Applications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="systemAlerts"
                    checked={notificationSettings.systemAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, systemAlerts: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('notifications')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Integrations</CardTitle>
              <CardDescription>Manage third-party services and API connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Firebase</p>
                      <p className="text-sm text-gray-500">Authentication & Database</p>
                    </div>
                  </div>
                  <Badge className={integrationSettings.firebaseConfigured ? "bg-green-500" : "bg-red-500"}>
                    {integrationSettings.firebaseConfigured ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Adyen</p>
                      <p className="text-sm text-gray-500">Payment Processing</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500">
                    In Development
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Email Service</p>
                      <p className="text-sm text-gray-500">Transactional Emails</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500">
                    Testing
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Blockchain Integration</p>
                      <p className="text-sm text-gray-500">Smart Contracts & Transactions</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500">
                    {integrationSettings.blockchainIntegration === 'development' ? "In Development" : "Configured"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Monitoring & Analytics</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="analyticsTracking"
                    checked={integrationSettings.analyticsTracking}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, analyticsTracking: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="errorReporting"
                    checked={integrationSettings.errorReporting}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, errorReporting: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="errorReporting">Error Reporting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="performanceMonitoring"
                    checked={integrationSettings.performanceMonitoring}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, performanceMonitoring: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="performanceMonitoring">Performance Monitoring</Label>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('integrations')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Admin Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your platform administrator profile and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <ProfileAvatar userId={user?.uid || ''} size="large" showStatus={true} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                    onClick={() => setAvatarUploadOpen(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Profile Picture</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a professional headshot for your profile
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAvatarUploadOpen(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userProfile.firstName}
                    onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userProfile.lastName}
                    onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="flex items-center">
                    Position
                    <Badge variant="outline" className="ml-2 text-xs">Read-only</Badge>
                  </Label>
                  <Input
                    id="position"
                    value={userProfile.position}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">Position is managed by system administrators</p>
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={userProfile.company}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Professional Links */}
              <div className="space-y-4">
                <h4 className="font-medium">Professional Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    <Input
                      id="linkedIn"
                      value={userProfile.linkedIn}
                      onChange={(e) => setUserProfile({...userProfile, linkedIn: e.target.value})}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter Profile</Label>
                    <Input
                      id="twitter"
                      value={userProfile.twitter}
                      onChange={(e) => setUserProfile({...userProfile, twitter: e.target.value})}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      value={userProfile.website}
                      onChange={(e) => setUserProfile({...userProfile, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea
                  id="bio"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background"
                  rows={3}
                  placeholder="Brief description of your role and expertise..."
                />
              </div>

              <Button 
                onClick={() => handleSaveSettings('profile')} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Profile Changes
              </Button>
            </CardContent>
          </Card>

          {/* Role Information - Read Only */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role & Permissions
              </CardTitle>
              <CardDescription>Your platform access and responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Current Role</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Platform Administrator
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{userProfile.position}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Department</h4>
                  <p className="text-sm text-gray-600">{userProfile.location}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Access Permissions</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'Platform Overview',
                    'User Management',
                    'Shelter Management',
                    'Financial Oversight',
                    'Analytics Access',
                    'Notification Management',
                    'Platform Settings',
                    'Security Monitoring',
                    'Knowledge Base Access',
                    'Contact Inquiries'
                  ].map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* NDA Preview Modal for Super Admins */}
      {showNDAPreview && (
        <NDAPreview onClose={() => setShowNDAPreview(false)} />
      )}
    </div>
  );
}
