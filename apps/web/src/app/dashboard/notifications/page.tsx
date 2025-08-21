"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { getNotificationCounts, getRecentEmailSignups, NotificationCounts, EmailSignup, formatRelativeTime } from '@/services/notificationService';
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
  CheckCircle
} from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts | null>(null);
  const [allEmailSignups, setAllEmailSignups] = useState<EmailSignup[]>([]);
  const [filteredSignups, setFilteredSignups] = useState<EmailSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadNotifications();
    }
  }, [user?.role]);

  // Filter signups based on search term
  useEffect(() => {
    let filtered = allEmailSignups;
    
    if (searchTerm) {
      filtered = filtered.filter(signup => 
        signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.page.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSignups(filtered);
  }, [allEmailSignups, searchTerm]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      console.log('🔔 Loading all notifications...');
      
      // Get API data for active users
      let activeUsersCount = 0;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/analytics/test-platform`);
        if (response.ok) {
          const data = await response.json();
          const userData = data.data.users;
          activeUsersCount = userData.active_today || userData.total || 0;
        }
      } catch (apiError) {
        console.warn('⚠️ Could not fetch active users from API:', apiError);
      }
      
      const [counts, emailSignups] = await Promise.all([
        getNotificationCounts(),
        getRecentEmailSignups(50) // Get more for the dedicated page
      ]);
      
      setNotificationCounts(counts);
      setAllEmailSignups(emailSignups);
      setFilteredSignups(emailSignups);
      setActiveUsers(activeUsersCount);
      console.log('✅ All notifications loaded:', { counts, emailSignups, activeUsers: activeUsersCount });
      
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

  // Redirect if not super admin
  if (user?.role !== 'super_admin') {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">Only Super Admins can view notifications.</p>
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
            Manage platform notifications and user communications
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

      {/* Notification Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationCounts?.totalNotifications || 0}</div>
            <p className="text-xs text-muted-foreground">Active items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationCounts?.totalEmailSignups || 0}</div>
            <p className="text-xs text-muted-foreground">
              {notificationCounts?.recentEmailSignups || 0} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationCounts?.pendingShelterapplications || 0}</div>
            <p className="text-xs text-muted-foreground">Shelter admin requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="email-signups">Email Signups</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
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
                    <div key={signup.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                    <div key={signup.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
