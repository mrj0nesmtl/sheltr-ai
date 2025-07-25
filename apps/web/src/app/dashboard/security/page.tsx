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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security & Compliance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Security monitoring, compliance tracking, and incident management
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Security Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="access">
            <Eye className="mr-2 h-4 w-4" />
            Access Logs
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <FileText className="mr-2 h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities">
            <Shield className="mr-2 h-4 w-4" />
            Vulnerabilities
          </TabsTrigger>
        </TabsList>

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

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {recentAccessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-6 border-b last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-sm text-muted-foreground">{log.action}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {log.location} • {log.device}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{log.role}</div>
                        <div className="text-xs text-muted-foreground">Role</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{log.ipAddress}</div>
                        <div className="text-xs text-muted-foreground">IP Address</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{log.timestamp.split(' ')[1]}</div>
                        <div className="text-xs text-muted-foreground">{log.timestamp.split(' ')[0]}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

          <Card>
            <CardContent className="space-y-4">
              {securityIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{incident.title}</div>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{incident.description}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Assigned to: {incident.assignee} • Created: {incident.created} • Updated: {incident.updated}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
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
            <CardHeader>
              <CardTitle>Vulnerability Assessment</CardTitle>
              <CardDescription>Current system vulnerabilities and recommended actions</CardDescription>
            </CardHeader>
            <CardContent>
              {systemVulnerabilities.length > 0 ? (
                <div className="space-y-4">
                  {systemVulnerabilities.map((vuln) => (
                    <div key={vuln.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium">{vuln.title}</div>
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{vuln.description}</div>
                        <div className="text-sm mt-2">
                          <strong>Impact:</strong> {vuln.impact}
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Remediation:</strong> {vuln.remediation}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Timeline: {vuln.timeline}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Address
                      </Button>
                    </div>
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