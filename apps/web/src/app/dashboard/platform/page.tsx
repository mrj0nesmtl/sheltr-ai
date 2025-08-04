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
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

// Mock data for platform management
const systemHealth = {
  uptime: '99.98%',
  apiResponseTime: '125ms',
  databaseConnections: 45,
  activeUsers: 234,
  queueSize: 12,
  errorRate: '0.02%'
};

const featureFlags = [
  { id: 'donation_processing', name: 'Donation Processing', enabled: true, description: 'Core donation functionality' },
  { id: 'qr_generation', name: 'QR Code Generation', enabled: true, description: 'Participant QR code system' },
  { id: 'blockchain_integration', name: 'Blockchain Integration', enabled: false, description: 'Smart contract integration' },
  { id: 'ai_analytics', name: 'AI Analytics', enabled: true, description: 'Advanced analytics features' },
  { id: 'mobile_app', name: 'Mobile App', enabled: false, description: 'Mobile application access' },
  { id: 'multi_language', name: 'Multi-Language Support', enabled: false, description: 'Internationalization features' }
];

const tenantMetrics = [
  { 
    id: 1, 
    name: 'Downtown Hope Center', 
    region: 'North America', 
    participants: 145, 
    donations: 15234.67, 
    status: 'active',
    lastActivity: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Riverside Shelter', 
    region: 'North America', 
    participants: 89, 
    donations: 8743.21, 
    status: 'active',
    lastActivity: '15 minutes ago'
  },
  { 
    id: 3, 
    name: 'Community Outreach', 
    region: 'Europe', 
    participants: 67, 
    donations: 12456.89, 
    status: 'pending',
    lastActivity: '1 day ago'
  },
  { 
    id: 4, 
    name: 'Safe Harbor Foundation', 
    region: 'Asia Pacific', 
    participants: 203, 
    donations: 23567.45, 
    status: 'active',
    lastActivity: '30 minutes ago'
  }
];

const systemAlerts = [
  { id: 1, level: 'warning', message: 'High donation volume detected - consider scaling', time: '5 minutes ago' },
  { id: 2, level: 'info', message: 'Weekly backup completed successfully', time: '2 hours ago' },
  { id: 3, level: 'success', message: 'New shelter onboarded: Community Center', time: '1 day ago' }
];

export default function PlatformManagement() {
  const [flags, setFlags] = useState(featureFlags);

  const toggleFeature = (featureId: string) => {
    setFlags(prev => prev.map(flag => 
      flag.id === featureId 
        ? { ...flag, enabled: !flag.enabled }
        : flag
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Platform Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
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
            <div className="text-2xl font-bold text-green-600">{systemHealth.uptime}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemHealth.apiResponseTime}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DB Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.databaseConnections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.queueSize}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemHealth.errorRate}</div>
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
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                {getAlertIcon(alert.level)}
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
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
            {tenantMetrics.map((tenant) => (
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
                        <div className="text-sm text-muted-foreground">{tenant.region}</div>
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
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">${tenant.donations.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      Manage
                    </Button>
                  </div>
                  
                  {/* Last Activity */}
                  <div className="text-xs text-muted-foreground pt-1 border-t border-gray-200 dark:border-gray-700">
                    Last activity: {tenant.lastActivity}
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
                      <div className="text-sm text-muted-foreground">{tenant.region}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{tenant.participants}</div>
                      <div className="text-xs text-muted-foreground">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">${tenant.donations.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Donations</div>
                    </div>
                    <div className="text-center min-w-[100px]">
                      <Badge className={getStatusColor(tenant.status)} variant="secondary">
                        {tenant.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{tenant.lastActivity}</div>
                    </div>
                    <Button variant="outline" size="sm" className="min-w-[80px]">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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