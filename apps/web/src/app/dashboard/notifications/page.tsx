"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { getNotificationDashboardCounts, getShelterNotificationCounts, getRecentEmailSignups, getRecentContactInquiries, getAdminNotifications, markNotificationAsRead, NotificationDashboardCounts, EmailSignup, ContactInquiryNotification, AdminNotification, formatRelativeTime } from '@/services/notificationService';
import { 
  Mail, 
  Bell, 
  Search, 
  Filter, 
  Download,
  Loader2,
  Building,
  Users,
  Calendar,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Shield,
  ShieldAlert
} from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notificationCounts, setNotificationCounts] = useState<NotificationDashboardCounts | null>(null);
  const [allEmailSignups, setAllEmailSignups] = useState<EmailSignup[]>([]);
  const [filteredSignups, setFilteredSignups] = useState<EmailSignup[]>([]);
  const [allContactInquiries, setAllContactInquiries] = useState<ContactInquiryNotification[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiryNotification[]>([]);
  const [allAdminNotifications, setAllAdminNotifications] = useState<AdminNotification[]>([]);
  const [filteredAdminNotifications, setFilteredAdminNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    if (user?.role === 'super_admin' || user?.role === 'platform_admin' || user?.role === 'admin') {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  // Filter signups, inquiries, and admin notifications based on search term
  useEffect(() => {
    let filteredSignupsResult = allEmailSignups;
    let filteredInquiriesResult = allContactInquiries;
    let filteredAdminNotificationsResult = allAdminNotifications;
    
    if (searchTerm) {
      filteredSignupsResult = filteredSignupsResult.filter(signup => 
        signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.page?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      filteredInquiriesResult = filteredInquiriesResult.filter(inquiry => 
        inquiry.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.inquiry_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      filteredAdminNotificationsResult = filteredAdminNotificationsResult.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSignups(filteredSignupsResult);
    setFilteredInquiries(filteredInquiriesResult);
    setFilteredAdminNotifications(filteredAdminNotificationsResult);
  }, [allEmailSignups, allContactInquiries, allAdminNotifications, searchTerm]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const userRole = user?.role || 'super_admin';
      const userId = user?.uid || '';
      
      // Check if this is a Shelter Admin
      const isShelterAdmin = userRole === 'admin';
      
      if (isShelterAdmin) {
        console.log('🏠 Loading shelter-specific notifications...');
        
        // Get shelter_id from user
        const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user && 'shelter_id' in user ? (user as Record<string, unknown>).shelter_id : null) as string | undefined;
        
        if (!shelterId) {
          console.error('❌ No shelter_id found for Shelter Admin');
          setLoading(false);
          return;
        }
        
        // Load shelter-specific data
        const [counts, adminNotifications] = await Promise.all([
          getShelterNotificationCounts(userId, shelterId), // Shelter-specific counts
          getAdminNotifications(userId, 50) // User's admin notifications
        ]);
        
        setNotificationCounts(counts);
        setAllAdminNotifications(adminNotifications);
        setFilteredAdminNotifications(adminNotifications);
        setActiveUsers(counts.activeUsers);
        
        // Clear platform-wide data (not relevant for shelter admin)
        setAllEmailSignups([]);
        setFilteredSignups([]);
        setAllContactInquiries([]);
        setFilteredInquiries([]);
        
        console.log('✅ Shelter notifications loaded:', { counts, adminNotifications });
        
      } else {
        console.log('🔔 Loading platform-wide notifications...');
        
        // Get API data for active users (platform-wide)
        let activeUsersCount = 0;
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/analytics/test-platform`);
          if (response.ok) {
            const data = await response.json();
            const userData = data.data.users;
            activeUsersCount = userData.active_today !== undefined ? userData.active_today : (userData.total || 0);
          }
        } catch (apiError) {
          console.warn('⚠️ Could not fetch active users from API:', apiError);
        }
        
        // Load platform-wide data (Super Admin / Platform Admin)
        const [counts, emailSignups, contactInquiries, adminNotifications] = await Promise.all([
          getNotificationDashboardCounts(userId, userRole), // Platform-wide counts
          getRecentEmailSignups(50), // Get more for the dedicated page
          getRecentContactInquiries(50), // Get recent contact inquiries
          getAdminNotifications(userId, 50) // Get recent admin notifications
        ]);
        
        // Update active users count from API
        counts.activeUsers = activeUsersCount;
        
        setNotificationCounts(counts);
        setAllEmailSignups(emailSignups);
        setFilteredSignups(emailSignups);
        setAllContactInquiries(contactInquiries);
        setFilteredInquiries(contactInquiries);
        setAllAdminNotifications(adminNotifications);
        setFilteredAdminNotifications(adminNotifications);
        setActiveUsers(activeUsersCount);
        
        console.log('✅ Platform notifications loaded:', { counts, emailSignups, contactInquiries, adminNotifications, activeUsers: activeUsersCount });
      }
      
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportEmailSignups = () => {
    const csvContent = [
      'Email,Source,Page,Status,Signup Date',
      ...filteredSignups.map(signup => 
        `${signup.email},${signup.source},${signup.page},${signup.status},"${signup.signup_date?.toDate?.()?.toISOString() || 'N/A'}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sheltr-email-signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Redirect if not super admin or platform admin
  if (user?.role !== 'super_admin' && user?.role !== 'platform_admin' && user?.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">Only Admins can view notifications.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <Bell className="h-8 w-8 mr-3" />
            Notifications Center
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {user?.role === 'admin' 
              ? 'Manage shelter notifications and communications'
              : 'Manage platform notifications and user communications'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportEmailSignups} disabled={filteredSignups.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadNotifications} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Notification Summary Cards - Redesigned for Perfect Responsiveness (3x2 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        
        {/* Total Notifications Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">Total</p>
                  <p className="text-xs text-muted-foreground">Notifications</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold">{notificationCounts?.totalNotifications || 0}</div>
              <p className="text-xs text-muted-foreground">Active items</p>
            </div>
          </CardContent>
        </Card>

        {/* Email Signups Card - Only for Super Admin / Platform Admin */}
        {user?.role !== 'admin' && (
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">Email</p>
                    <p className="text-xs text-muted-foreground">Signups</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold">{notificationCounts?.totalEmailSignups || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {notificationCounts?.recentEmailSignups || 0} new this week
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Applications Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  {user?.role === 'admin' ? (
                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <Building className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">Pending</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'admin' ? 'Participants' : 'Applications'}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold">{notificationCounts?.pendingShelterapplications || 0}</div>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'admin' ? 'Pending participant registrations' : 'Shelter admin requests'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Inquiries Card - Only for Super Admin / Platform Admin */}
        {user?.role !== 'admin' && (
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">Contact</p>
                    <p className="text-xs text-muted-foreground">Inquiries</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold">{notificationCounts?.contactInquiries || 0}</div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{notificationCounts?.recentContactInquiries || 0} new this week</span>
                  {(notificationCounts?.repliedContactInquiries || 0) > 0 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {notificationCounts?.repliedContactInquiries} replied
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notifications Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">Security</p>
                  <p className="text-xs text-muted-foreground">Notifications</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold">
                {filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').length}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length} unread
                    </span>
                  )}
                  {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length === 0 && "All secure"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Second Row of Metric Cards - Only for Super Admin / Platform Admin */}
      {user?.role !== 'admin' && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        
        {/* Pending Applications Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Building className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">Pending</p>
                  <p className="text-xs text-muted-foreground">Applications</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold">{notificationCounts?.pendingShelterapplications || 0}</div>
              <p className="text-xs text-muted-foreground">Shelter admin requests</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">Active</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
          </CardContent>
        </Card>

        {/* System Health Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">System</p>
                  <p className="text-xs text-muted-foreground">Health</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold">100%</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      )}

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="admin-notifications">Admin</TabsTrigger>
          <TabsTrigger value="contact-inquiries">Contact</TabsTrigger>
          <TabsTrigger value="email-signups">Email</TabsTrigger>
          <TabsTrigger value="applications">Apps</TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* All Notifications Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6">
            {/* Security Notifications Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2 text-red-600" />
                  Security Notifications
                  {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length > 0 && (
                    <Badge variant="destructive" className="ml-2 animate-pulse">
                      {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length} urgent
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').length === 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Shield className="h-4 w-4" />
                    <p className="text-sm font-medium">All systems secure - No security alerts</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').slice(0, 3).map((notification) => (
                      <div key={notification.id} className={`p-3 rounded border-l-4 ${
                        notification.type === 'fraud_alert' 
                          ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10' 
                          : 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10'
                      } ${!notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {notification.type === 'fraud_alert' && <AlertCircle className="h-3 w-3 text-red-500" />}
                          {notification.type === 'system_alert' && <ShieldAlert className="h-3 w-3 text-orange-500" />}
                          <span className="font-medium text-xs">{notification.title}</span>
                          <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {notification.priority}
                          </Badge>
                          {!notification.read && <Badge variant="default" className="bg-blue-500 text-xs animate-pulse">URGENT</Badge>}
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.created_at && formatRelativeTime(
                            notification.created_at instanceof Date 
                              ? notification.created_at 
                              : notification.created_at.toDate?.() || new Date()
                          )}
                        </p>
                      </div>
                    ))}
                    {filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').length > 3 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveTab('security')}
                        className="w-full mt-2 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        View All Security Alerts ({filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Notifications Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Admin Notifications
                  {filteredAdminNotifications.filter(n => !n.read).length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {filteredAdminNotifications.filter(n => !n.read).length} unread
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAdminNotifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No admin notifications</p>
                ) : (
                  <div className="space-y-2">
                    {filteredAdminNotifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className={`p-3 rounded border ${!notification.read ? 'bg-blue-900/20 border-blue-600/50 dark:bg-blue-900/20 dark:border-blue-600/50' : 'bg-gray-800/50 border-gray-700/50 dark:bg-gray-800/50 dark:border-gray-700/50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {notification.type === 'fraud_alert' && <AlertCircle className="h-3 w-3 text-red-500" />}
                          {notification.type === 'system_alert' && <Bell className="h-3 w-3 text-yellow-500" />}
                          <span className="font-medium text-xs">{notification.title}</span>
                          <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {notification.priority}
                          </Badge>
                          {!notification.read && <Badge variant="default" className="bg-blue-500 text-xs">New</Badge>}
                        </div>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.created_at && formatRelativeTime(
                            notification.created_at instanceof Date 
                              ? notification.created_at 
                              : notification.created_at.toDate?.() || new Date()
                          )}
                        </p>
                      </div>
                    ))}
                    {filteredAdminNotifications.length > 3 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveTab('admin-notifications')}
                        className="w-full mt-2"
                      >
                        View All Admin Notifications ({filteredAdminNotifications.length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Inquiries Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Recent Contact Inquiries
                  <Badge className="ml-2 bg-blue-500 text-white">
                    {notificationCounts?.recentContactInquiries || 0} new
                  </Badge>
                </CardTitle>
                <CardDescription>Latest contact form submissions and inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allContactInquiries.slice(0, 3).map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          inquiry.priority === 'high' ? 'bg-red-500' : 
                          inquiry.priority === 'normal' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{inquiry.sender_name || inquiry.sender_email}</p>
                          <p className="text-xs text-gray-500 truncate max-w-48">
                            {inquiry.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {inquiry.created_at?.toDate ? formatRelativeTime(inquiry.created_at.toDate()) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{inquiry.inquiry_type}</Badge>
                        <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                          {inquiry.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('contact-inquiries')}>
                  View All Contact Inquiries
                </Button>
              </CardContent>
            </Card>

            {/* Email Signups Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Recent Email Signups
                  <Badge className="ml-2 bg-green-500 text-white">
                    {notificationCounts?.recentEmailSignups || 0} new
                  </Badge>
                </CardTitle>
                <CardDescription>Latest newsletter subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allEmailSignups.slice(0, 3).map((signup) => (
                    <div key={signup.id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{signup.email}</p>
                          <p className="text-xs text-gray-500">
                            {signup.signup_date?.toDate ? formatRelativeTime(signup.signup_date.toDate()) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{signup.source}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('email-signups')}>
                  View All Email Signups
                </Button>
              </CardContent>
            </Card>

            {/* Pending Applications Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Pending Shelter Applications
                  <Badge className="ml-2 bg-orange-500 text-white">
                    {notificationCounts?.pendingShelterapplications || 0} pending
                  </Badge>
                </CardTitle>
                <CardDescription>Shelter admin registration requests</CardDescription>
              </CardHeader>
              <CardContent>
                {notificationCounts?.pendingShelterapplications === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500">No pending applications</p>
                    <p className="text-xs text-gray-400">All applications have been processed</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Building className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-gray-500">Applications management coming soon</p>
                    <p className="text-xs text-gray-400">Feature in development</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Notifications Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                Security Notifications ({filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').length})
                {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length} unread
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Fraud alerts, security warnings, and system security notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading security notifications...</span>
                </div>
              ) : filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-600 font-medium mb-2">All Secure</p>
                  <p className="text-gray-500">No security alerts or warnings detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAdminNotifications.filter(n => n.type === 'fraud_alert' || n.type === 'system_alert').map((notification) => (
                    <Card key={notification.id} className={`transition-colors border-l-4 ${
                      notification.type === 'fraud_alert' 
                        ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10' 
                        : 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10'
                    } ${!notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {notification.type === 'fraud_alert' && <AlertCircle className="h-4 w-4 text-red-500" />}
                              {notification.type === 'system_alert' && <ShieldAlert className="h-4 w-4 text-orange-500" />}
                              
                              <span className="font-medium text-sm">{notification.title}</span>
                              
                              <Badge variant={
                                notification.priority === 'high' ? 'destructive' : 
                                notification.priority === 'medium' ? 'default' : 
                                'secondary'
                              } className="text-xs">
                                {notification.priority}
                              </Badge>
                              
                              {!notification.read && (
                                <Badge variant="default" className="bg-blue-500 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                              {notification.message}
                            </p>
                            
                            {notification.data && Object.keys(notification.data).length > 0 && (
                              <div className="text-xs text-gray-300 bg-gray-800/50 border border-gray-700/50 p-3 rounded mb-3">
                                <strong className="text-gray-900 dark:text-gray-100">Security Details:</strong>
                                {notification.type === 'fraud_alert' && notification.data?.fraud_alert_id && (
                                  <div className="mt-1">🚨 Alert ID: {String(notification.data.fraud_alert_id)}</div>
                                )}
                                {notification.data?.level && (
                                  <div className="mt-1">⚡ Threat Level: {String(notification.data.level).toUpperCase()}</div>
                                )}
                                {notification.data?.timestamp && (
                                  <div className="mt-1">🕒 Detection Time: {String(notification.data.timestamp)}</div>
                                )}
                                {notification.data?.details && (
                                  <div className="mt-1">📋 Details: {String(notification.data.details)}</div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">
                                {notification.created_at && formatRelativeTime(
                                  notification.created_at instanceof Date 
                                    ? notification.created_at 
                                    : notification.created_at.toDate?.() || new Date()
                                )}
                                {notification.target_roles && (
                                  <span className="ml-2">• Target: {notification.target_roles.join(', ')}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      if (notification.id) {
                                        const success = await markNotificationAsRead(notification.id);
                                        if (success) {
                                          loadNotifications();
                                        }
                                      }
                                    }}
                                    className="text-xs px-2 py-1"
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setActiveTab('admin-notifications')}
                                  className="text-xs px-2 py-1"
                                >
                                  View in Admin
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Security Status Summary */}
              <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Status Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      filteredAdminNotifications.filter(n => n.type === 'fraud_alert' && n.priority === 'high').length > 0 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-green-500'
                    }`}></div>
                    <span>Fraud Alerts: {filteredAdminNotifications.filter(n => n.type === 'fraud_alert').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      filteredAdminNotifications.filter(n => n.type === 'system_alert' && n.priority === 'high').length > 0 
                        ? 'bg-orange-500 animate-pulse' 
                        : 'bg-green-500'
                    }`}></div>
                    <span>System Alerts: {filteredAdminNotifications.filter(n => n.type === 'system_alert').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length > 0 
                        ? 'bg-blue-500 animate-pulse' 
                        : 'bg-green-500'
                    }`}></div>
                    <span>Unread: {filteredAdminNotifications.filter(n => (n.type === 'fraud_alert' || n.type === 'system_alert') && !n.read).length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Notifications Tab */}
        <TabsContent value="admin-notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications ({filteredAdminNotifications.length})</CardTitle>
              <CardDescription>System notifications, fraud alerts, and administrative messages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading admin notifications...</span>
                </div>
              ) : filteredAdminNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No admin notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAdminNotifications.map((notification) => (
                    <Card key={notification.id} className={`transition-colors ${notification.read ? 'bg-gray-800/30 border-gray-700/50' : 'bg-blue-900/20 border-blue-600/50'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {notification.type === 'fraud_alert' && <AlertCircle className="h-4 w-4 text-red-500" />}
                              {notification.type === 'system_alert' && <Bell className="h-4 w-4 text-yellow-500" />}
                              {notification.type === 'contact_inquiry' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                              {notification.type === 'user_signup' && <Users className="h-4 w-4 text-green-500" />}
                              {notification.type === 'donation' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {notification.type === 'github_sync_required' && <ExternalLink className="h-4 w-4 text-purple-500" />}
                              
                              <span className="font-medium text-sm">{notification.title}</span>
                              
                              <Badge variant={
                                notification.priority === 'high' ? 'destructive' : 
                                notification.priority === 'medium' ? 'default' : 
                                'secondary'
                              } className="text-xs">
                                {notification.priority}
                              </Badge>
                              
                              {!notification.read && (
                                <Badge variant="default" className="bg-blue-500 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {notification.message}
                            </p>
                            
                            {notification.data && Object.keys(notification.data).length > 0 && (
                              <div className="text-xs text-gray-400 bg-gray-800/50 border border-gray-700/50 p-2 rounded mt-2">
                                <strong>Details:</strong>
                                {notification.type === 'fraud_alert' && notification.data?.fraud_alert_id && (
                                  <div>Alert ID: {String(notification.data.fraud_alert_id)}</div>
                                )}
                                {notification.data?.level && (
                                  <div>Level: {String(notification.data.level)}</div>
                                )}
                                {notification.data?.timestamp && (
                                  <div>Timestamp: {String(notification.data.timestamp)}</div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-gray-500">
                                {notification.created_at && formatRelativeTime(
                                  notification.created_at instanceof Date 
                                    ? notification.created_at 
                                    : notification.created_at.toDate?.() || new Date()
                                )}
                                {notification.target_roles && (
                                  <span className="ml-2">• Target: {notification.target_roles.join(', ')}</span>
                                )}
                              </div>
                              
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    if (notification.id) {
                                      const success = await markNotificationAsRead(notification.id);
                                      if (success) {
                                        // Refresh notifications
                                        loadNotifications();
                                      }
                                    }
                                  }}
                                  className="text-xs px-2 py-1"
                                >
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Inquiries Tab */}
        <TabsContent value="contact-inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contact Inquiries ({filteredInquiries.length})</CardTitle>
              <CardDescription>Complete list of contact form submissions and inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading contact inquiries...</span>
                </div>
              ) : filteredInquiries.length > 0 ? (
                <div className="space-y-3">
                  {filteredInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-start justify-between p-4 border border-gray-700/50 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          inquiry.priority === 'high' ? 'bg-red-500' : 
                          inquiry.priority === 'normal' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{inquiry.sender_name || inquiry.sender_email}</p>
                            <Badge variant={inquiry.status === 'new' ? 'default' : 'outline'} className="text-xs">
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">{inquiry.subject}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {inquiry.inquiry_type.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {inquiry.source}
                            </Badge>
                            <Badge variant={inquiry.priority === 'high' ? 'destructive' : inquiry.priority === 'normal' ? 'default' : 'secondary'} className="text-xs">
                              {inquiry.priority} priority
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Received {inquiry.created_at?.toDate ? formatRelativeTime(inquiry.created_at.toDate()) : 'recently'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/dashboard/contact-inquiries`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No contact inquiries found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'Contact inquiries will appear here as users submit forms'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Signups Tab */}
        <TabsContent value="email-signups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Email Signups ({filteredSignups.length})</CardTitle>
              <CardDescription>Complete list of newsletter subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading email signups...</span>
                </div>
              ) : filteredSignups.length > 0 ? (
                <div className="space-y-3">
                  {filteredSignups.map((signup) => (
                    <div key={signup.id} className="flex items-start justify-between p-4 border border-gray-700/50 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{signup.email}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {signup.source}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {signup.page}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {signup.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Signed up {signup.signup_date?.toDate ? formatRelativeTime(signup.signup_date.toDate()) : 'recently'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No email signups found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'Email signups will appear here as users subscribe'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shelter Applications</CardTitle>
              <CardDescription>Manage shelter admin registration requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Applications Management</h3>
                <p className="text-gray-500 mb-4">
                  This feature is currently in development. Shelter admin applications will be managed here.
                </p>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
