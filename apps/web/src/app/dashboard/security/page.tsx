"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  User,
  MapPin,
  Activity,
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Database,
  Key
} from 'lucide-react';

// Mock data for security oversight
const securityMetrics = {
  threatLevel: 'Low',
  blockedAttempts: 47,
  activeIncidents: 2,
  complianceScore: 98.5,
  lastSecurityAudit: '2024-07-20',
  vulnerabilities: 1,
  systemUptime: 99.98,
  encryptionStatus: 'Active'
};

const recentAccessLogs = [
  {
    id: 1,
    user: 'joel@sheltr.ai',
    role: 'Super Admin',
    action: 'Dashboard Access',
    ipAddress: '192.168.1.100',
    location: 'Vancouver, BC',
    timestamp: '2024-07-24 14:25:00',
    status: 'success',
    device: 'Chrome/Mac'
  },
  {
    id: 2,
    user: 'sarah@downtownhope.org',
    role: 'Admin',
    action: 'User Management',
    ipAddress: '10.0.0.45',
    location: 'Seattle, WA',
    timestamp: '2024-07-24 14:15:30',
    status: 'success',
    device: 'Safari/iOS'
  },
  {
    id: 3,
    user: 'unknown@suspicious.com',
    role: 'Attempted Access',
    action: 'Login Attempt',
    ipAddress: '185.220.101.32',
    location: 'Unknown/VPN',
    timestamp: '2024-07-24 13:45:22',
    status: 'blocked',
    device: 'Bot/Automated'
  },
  {
    id: 4,
    user: 'mchen@riverside.org',
    role: 'Admin',
    action: 'Data Export',
    ipAddress: '192.168.1.205',
    location: 'Portland, OR',
    timestamp: '2024-07-24 13:30:10',
    status: 'success',
    device: 'Firefox/Windows'
  }
];

const securityIncidents = [
  {
    id: 1,
    title: 'Suspicious Login Pattern',
    severity: 'medium',
    description: 'Multiple failed login attempts from same IP range',
    status: 'investigating',
    assignee: 'Security Team',
    created: '2024-07-24 12:30:00',
    updated: '2024-07-24 13:15:00'
  },
  {
    id: 2,
    title: 'Data Access Anomaly',
    severity: 'low',
    description: 'User accessed unusual amount of participant data',
    status: 'resolved',
    assignee: 'Compliance Team',
    created: '2024-07-23 16:45:00',
    updated: '2024-07-24 09:30:00'
  }
];

const complianceChecks = [
  { id: 1, requirement: 'Data Encryption at Rest', status: 'compliant', lastCheck: '2024-07-24', score: 100 },
  { id: 2, requirement: 'Access Control Policies', status: 'compliant', lastCheck: '2024-07-24', score: 98 },
  { id: 3, requirement: 'Audit Trail Retention', status: 'compliant', lastCheck: '2024-07-23', score: 100 },
  { id: 4, requirement: 'Data Privacy Controls', status: 'warning', lastCheck: '2024-07-22', score: 95 },
  { id: 5, requirement: 'Incident Response Plan', status: 'compliant', lastCheck: '2024-07-20', score: 97 }
];

const systemVulnerabilities = [
  {
    id: 1,
    title: 'Outdated SSL Certificate',
    severity: 'low',
    description: 'SSL certificate expires in 30 days',
    impact: 'Low security risk if not renewed',
    remediation: 'Schedule certificate renewal',
    timeline: '30 days'
  }
];

export default function SecurityCompliance() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant':
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'warning':
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'blocked':
      case 'critical':
      case 'non_compliant':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant':
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'investigating':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'blocked':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Security & Compliance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Security monitoring, compliance tracking, and incident management
          </p>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Security Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <RefreshCw className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Refresh Status</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityMetrics.threatLevel}</div>
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              All systems secure
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.blockedAttempts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1" />
              Last 24 hours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityMetrics.complianceScore}%</div>
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Excellent compliance
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{securityMetrics.activeIncidents}</div>
            <div className="flex items-center text-xs text-yellow-600">
              <Clock className="h-3 w-3 mr-1" />
              Under investigation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Management Tabs */}
      <Tabs defaultValue="access" className="space-y-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="access" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Access Logs
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Incidents
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="vulnerabilities" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Vulnerabilities
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Stacked Tabs */}
        <div className="sm:hidden">
          <TabsList className="grid grid-cols-4 gap-1 h-14 bg-muted p-1 rounded-md w-full">
            <TabsTrigger 
              value="access" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Access Logs"
            >
              <Eye className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="incidents" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Incidents"
            >
              <AlertTriangle className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Compliance"
            >
              <FileText className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="vulnerabilities" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Vulnerabilities"
            >
              <Shield className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Access Logs Tab */}
        <TabsContent value="access" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Access & Activity Logs</h3>
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

          <div className="space-y-3">
            {recentAccessLogs.map((log) => (
              <Card key={log.id} className="overflow-hidden">
                <CardContent className="p-0 sm:p-6">
                  {/* Mobile Layout - Completely Redesigned */}
                  <div className="block sm:hidden">
                    {/* Header Section */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-blue-950/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white truncate">
                              {log.user}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {log.action}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                              {log.role}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(log.status)} shrink-0 ml-2`} variant="secondary">
                          {log.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Location & Device Section */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
                          <span className="font-medium">{log.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Globe className="h-4 w-4 mr-2 shrink-0 text-green-500" />
                          <span className="font-medium">{log.device}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* IP & Timestamp Section */}
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">IP Address</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {log.ipAddress}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Time</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {log.timestamp.split(' ')[1]}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {log.timestamp.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-between p-6 border-b last:border-b-0">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-lg truncate">{log.user}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{log.action}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{log.location} • {log.device}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{log.role}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Role</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium font-mono">{log.ipAddress}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">IP Address</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{log.timestamp.split(' ')[1]}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp.split(' ')[0]}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(log.status)}
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Security Incidents</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Create Incident
              </Button>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {securityIncidents.map((incident) => (
              <Card key={incident.id} className="overflow-hidden">
                <CardContent className="p-0 sm:p-6">
                  {/* Mobile Layout - Completely Redesigned */}
                  <div className="block sm:hidden">
                    {/* Header Section */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 dark:from-yellow-950/30 dark:via-slate-900 dark:to-yellow-950/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <AlertTriangle className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">
                              {incident.title}
                            </h3>
                            <div className="flex space-x-2 mt-2">
                              <Badge className={getSeverityColor(incident.severity)} variant="secondary">
                                {incident.severity}
                              </Badge>
                              <Badge className={getStatusColor(incident.status)} variant="secondary">
                                {incident.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {incident.description}
                      </div>
                    </div>
                    
                    {/* Assignment & Timestamps Section */}
                    <div className="p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Assigned to</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{incident.assignee}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Created</div>
                            <div className="text-gray-600 dark:text-gray-400">{incident.created.split(' ')[0]}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">{incident.created.split(' ')[1]}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Updated</div>
                            <div className="text-gray-600 dark:text-gray-400">{incident.updated.split(' ')[0]}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">{incident.updated.split(' ')[1]}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-white dark:bg-slate-800 mt-3">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Manage Incident
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-start space-x-4 p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-bold text-lg">{incident.title}</div>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{incident.description}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Assigned to: {incident.assignee} • Created: {incident.created} • Updated: {incident.updated}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Compliance Status</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Run Audit
              </Button>
              <Button variant="outline" size="sm">
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Checks */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Requirements</CardTitle>
                <CardDescription>Current compliance status across all requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceChecks.map((check) => (
                    <div key={check.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <div className="font-medium">{check.requirement}</div>
                          <div className="text-xs text-muted-foreground">Last checked: {check.lastCheck}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                        <div className="text-sm font-medium mt-1">{check.score}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
                <CardDescription>Overall compliance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">{securityMetrics.complianceScore}%</div>
                    <div className="text-sm text-muted-foreground">Overall Compliance Score</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{complianceChecks.filter(c => c.status === 'compliant').length}</div>
                      <div className="text-sm text-muted-foreground">Compliant</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{complianceChecks.filter(c => c.status === 'warning').length}</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Compliance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vulnerabilities Tab */}
        <TabsContent value="vulnerabilities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Security Vulnerabilities</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Scan System
              </Button>
              <Button variant="outline" size="sm">
                Security Settings
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Vulnerability Assessment</CardTitle>
              <CardDescription className="text-sm">Current system vulnerabilities and recommended actions</CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              {systemVulnerabilities.length > 0 ? (
                <div className="space-y-3">
                  {systemVulnerabilities.map((vuln) => (
                    <Card key={vuln.id} className="overflow-hidden">
                      <CardContent className="p-0 sm:p-6">
                        {/* Mobile Layout - Completely Redesigned */}
                        <div className="block sm:hidden">
                          {/* Header Section */}
                          <div className="p-4 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-blue-950/30">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <Shield className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">
                                    {vuln.title}
                                  </h3>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Timeline: {vuln.timeline}
                                  </div>
                                </div>
                              </div>
                              <Badge className={`${getSeverityColor(vuln.severity)} shrink-0 ml-2`} variant="secondary">
                                {vuln.severity}
                              </Badge>
                            </div>
                          </div>

                          {/* Description Section */}
                          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {vuln.description}
                            </div>
                          </div>
                          
                          {/* Impact & Remediation Section */}
                          <div className="p-4">
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Impact</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {vuln.impact}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Remediation</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {vuln.remediation}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="w-full bg-white dark:bg-slate-800 mt-3">
                                <Shield className="h-4 w-4 mr-2" />
                                Address Vulnerability
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:block">
                          <div className="flex items-start space-x-4 p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                              <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="font-bold text-lg">{vuln.title}</div>
                                <Badge className={getSeverityColor(vuln.severity)}>
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{vuln.description}</div>
                              <div className="text-sm mb-2">
                                <strong>Impact:</strong> {vuln.impact}
                              </div>
                              <div className="text-sm mb-2">
                                <strong>Remediation:</strong> {vuln.remediation}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                Timeline: {vuln.timeline}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Address
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <div className="text-lg font-medium">No Critical Vulnerabilities</div>
                  <div className="text-sm text-muted-foreground">Your system is secure and up to date</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 