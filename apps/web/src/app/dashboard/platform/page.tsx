"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  Server, 
  Database,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  getFeatureFlags, 
  getSystemAlerts, 
  getRealTimePlatformMetrics,
  getShelterManagementMetrics,
  updateFeatureFlag,
  type FeatureFlag,
  type SystemAlert,
  type RealTimePlatformMetrics,
  type ShelterManagementMetrics
} from '@/services/platformMetrics';

export default function PlatformManagement() {
  const router = useRouter();
  
  // Real-time data state
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimePlatformMetrics | null>(null);
  const [shelterMetrics, setShelterMetrics] = useState<ShelterManagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all data on component mount
  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        console.log('🚀 Loading platform management data...');
        
        const [flagsData, alertsData, metricsData, shelterMetricsData] = await Promise.all([
          getFeatureFlags(),
          getSystemAlerts(),
          getRealTimePlatformMetrics(),
          getShelterManagementMetrics()
        ]);

        setFlags(flagsData);
        setAlerts(alertsData);
        setRealTimeMetrics(metricsData);
        setShelterMetrics(shelterMetricsData);
        
        console.log('✅ Platform management data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading platform data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlatformData();
  }, []);

  const toggleFeature = async (featureId: string) => {
    // Optimistically update the UI
    const currentFlag = flags.find(f => f.id === featureId);
    if (!currentFlag) return;

    const newEnabled = !currentFlag.enabled;
    
    setFlags(prev => prev.map(flag => 
      flag.id === featureId 
        ? { ...flag, enabled: newEnabled }
        : flag
    ));

    // Attempt to update the backend
    const success = await updateFeatureFlag(featureId, newEnabled);
    
    if (!success) {
      // Revert the change if the update failed
      setFlags(prev => prev.map(flag => 
        flag.id === featureId 
          ? { ...flag, enabled: currentFlag.enabled }
          : flag
      ));
      console.error('Failed to update feature flag, reverting change');
    }
  };



  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Handle View All Alerts
  const handleViewAllAlerts = () => {
    router.push('/dashboard/notifications');
  };



  // Handle Add New Shelter
  const handleAddNewShelter = () => {
    router.push('/dashboard/shelters?action=add');
  };

  // Handle View All Shelters
  const handleViewAllShelters = () => {
    router.push('/dashboard/shelters');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Platform Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            System configuration, monitoring, and tenant oversight
          </p>
        </div>
      </div>

      {/* System Health Overview - 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? '--' : `${realTimeMetrics?.uptime || 0}%`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? '--' : `${realTimeMetrics?.apiResponseTime || 0}ms`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DB Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : realTimeMetrics?.dbConnections || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : realTimeMetrics?.activeUsers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : realTimeMetrics?.queueSize || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? '--' : `${realTimeMetrics?.errorRate || 0}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Flags & System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Feature Flags
            </CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between space-x-4">
                <div className="flex-1">
                  <div className="font-medium">{flag.name}</div>
                  <div className="text-sm text-muted-foreground">{flag.description}</div>
                </div>
                <button
                  onClick={() => toggleFeature(flag.id)}
                  className="flex items-center"
                >
                  {flag.enabled ? (
                    <ToggleRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading alerts...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No recent alerts</div>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full" onClick={handleViewAllAlerts}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Shelter Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Building2 className="mr-2 h-5 w-5" />
            Shelter Management
            <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800 text-xs">
              Metrics Overview
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">Platform-wide shelter analytics and performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {loading || !shelterMetrics ? (
            <div className="text-center py-8 text-muted-foreground">Loading shelter metrics...</div>
          ) : (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Platform Utilization */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{shelterMetrics.platformUtilization}%</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Platform Utilization</div>
                    <div className="text-xs text-muted-foreground mt-1">{shelterMetrics.activeShelters}/{shelterMetrics.totalShelters} active</div>
                  </div>
                </div>

                {/* Occupancy Rate */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{shelterMetrics.occupancyRate}%</div>
                    <div className="text-xs text-green-700 dark:text-green-300 mt-1">Occupancy Rate</div>
                    <div className="text-xs text-muted-foreground mt-1">{shelterMetrics.totalOccupancy}/{shelterMetrics.totalCapacity} beds</div>
                  </div>
                </div>

                {/* Total Donations */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">${(shelterMetrics.totalDonations / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">Total Donations</div>
                    <div className="text-xs text-muted-foreground mt-1">${shelterMetrics.averageDonationsPerShelter.toLocaleString()} avg</div>
                  </div>
                </div>

                {/* Platform Growth */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{shelterMetrics.platformGrowth}</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">Platform Growth</div>
                    <div className="text-xs text-muted-foreground mt-1">{shelterMetrics.recentSignups} new this month</div>
                  </div>
                </div>
              </div>

              {/* Feature Adoption & Performance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Feature Adoption */}
                <div className="p-4 border rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
                  <h4 className="font-semibold text-sm mb-3 flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Feature Adoption
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>QR Codes</span>
                      <span className="font-medium">{shelterMetrics.featureAdoption.qrCodes}/{shelterMetrics.totalShelters}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Donations</span>
                      <span className="font-medium">{shelterMetrics.featureAdoption.donations}/{shelterMetrics.totalShelters}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Analytics</span>
                      <span className="font-medium">{shelterMetrics.featureAdoption.analytics}/{shelterMetrics.totalShelters}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Staff Mgmt</span>
                      <span className="font-medium">{shelterMetrics.featureAdoption.staffManagement}/{shelterMetrics.totalShelters}</span>
                    </div>
                  </div>
                </div>

                {/* Top Performer */}
                <div className="p-4 border rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
                  <h4 className="font-semibold text-sm mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Top Performer
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="font-medium">{shelterMetrics.topPerformingShelter.name}</div>
                      <div className="text-muted-foreground">Leading donations this month</div>
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${shelterMetrics.topPerformingShelter.donationsThisMonth.toLocaleString()}
                    </div>
                    {shelterMetrics.sheltersAtCapacity > 0 && (
                      <div className="text-xs text-amber-600 dark:text-amber-400">
                        ⚠️ {shelterMetrics.sheltersAtCapacity} shelter(s) at capacity
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={handleAddNewShelter}
            >
              <Building2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add New Shelter</span>
              <span className="sm:hidden">Add Shelter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={handleViewAllShelters}
            >
              <span className="hidden sm:inline">View All Shelters</span>
              <span className="sm:hidden">View All</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Operations Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Platform Operations
          </CardTitle>
          <CardDescription>System maintenance, monitoring, and operational tools</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="maintenance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span className="hidden sm:inline">Maintenance</span>
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Backup</span>
              </TabsTrigger>
              <TabsTrigger value="deploy" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Deploy</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="maintenance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5" />
                    System Maintenance
                  </CardTitle>
                  <CardDescription>Manage system maintenance tasks and schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">System Maintenance Tools</h3>
                    <p className="text-sm mb-4">Maintenance management features coming soon</p>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="backup" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Database Backup
                  </CardTitle>
                  <CardDescription>Manage database backups and recovery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Database Backup Management</h3>
                    <p className="text-sm mb-4">Backup and recovery tools coming soon</p>
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Manage Backups
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deploy" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Deploy Updates
                  </CardTitle>
                  <CardDescription>Manage platform deployments and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Deployment Management</h3>
                    <p className="text-sm mb-4">Deployment tools and update management coming soon</p>
                    <Button variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      Deploy Updates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Performance Reports
                  </CardTitle>
                  <CardDescription>View system performance metrics and reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Performance Analytics</h3>
                    <p className="text-sm mb-4">Performance reporting and analytics coming soon</p>
                    <Button variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 