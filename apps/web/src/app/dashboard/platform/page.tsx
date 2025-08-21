"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  getPlatformTenants, 
  getRealTimePlatformMetrics,
  updateFeatureFlag,
  type FeatureFlag,
  type SystemAlert,
  type PlatformTenant,
  type RealTimePlatformMetrics
} from '@/services/platformMetrics';

export default function PlatformManagement() {
  const router = useRouter();
  
  // Real-time data state
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [tenants, setTenants] = useState<PlatformTenant[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimePlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all data on component mount
  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        console.log('🚀 Loading platform management data...');
        
        const [flagsData, alertsData, tenantsData, metricsData] = await Promise.all([
          getFeatureFlags(),
          getSystemAlerts(),
          getPlatformTenants(),
          getRealTimePlatformMetrics()
        ]);

        setFlags(flagsData);
        setAlerts(alertsData);
        setTenants(tenantsData);
        setRealTimeMetrics(metricsData);
        
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
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

  // Handle Manage Tenant
  const handleManageTenant = () => {
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

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Tenant Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Building2 className="mr-2 h-5 w-5" />
            Tenant Management
          </CardTitle>
          <CardDescription className="text-sm">Overview of all platform tenants and their activity</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading tenants...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tenants found</div>
            ) : (
              tenants.map((tenant) => (
              <div key={tenant.id} className="p-4 border rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 hover:shadow-md transition-all duration-200">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                  {/* Top Row: Icon, Name, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base truncate">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">{tenant.location}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(tenant.status)} variant="secondary">
                      {tenant.status}
                    </Badge>
                  </div>
                  
                  {/* Bottom Row: Metrics and Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{tenant.participants}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {typeof tenant.donations === 'number' ? `$${tenant.donations.toLocaleString()}` : tenant.donations}
                        </div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shrink-0"
                      onClick={handleManageTenant}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Manage
                    </Button>
                  </div>
                  
                  {/* Last Activity */}
                  <div className="text-xs text-muted-foreground pt-1 border-t border-gray-200 dark:border-gray-700">
                    Last activity: {formatTime(tenant.lastActivity)}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg truncate">{tenant.name}</div>
                      <div className="text-sm text-muted-foreground">{tenant.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{tenant.participants}</div>
                      <div className="text-xs text-muted-foreground">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {typeof tenant.donations === 'number' ? `$${tenant.donations.toLocaleString()}` : tenant.donations}
                      </div>
                      <div className="text-xs text-muted-foreground">Donations</div>
                    </div>
                    <div className="text-center min-w-[100px]">
                      <Badge className={getStatusColor(tenant.status)} variant="secondary">
                        {tenant.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{formatTime(tenant.lastActivity)}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="min-w-[80px]"
                      onClick={handleManageTenant}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Building2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add New Tenant</span>
              <span className="sm:hidden">Add Tenant</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">View All Tenants</span>
              <span className="sm:hidden">View All</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <Server className="h-6 w-6" />
          <span>System Maintenance</span>
        </Button>
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <Database className="h-6 w-6" />
          <span>Database Backup</span>
        </Button>
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <Globe className="h-6 w-6" />
          <span>Deploy Update</span>
        </Button>
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <TrendingUp className="h-6 w-6" />
          <span>Performance Report</span>
        </Button>
      </div>
    </div>
  );
} 