'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import QualifiedInvestorRegistration from '@/components/admin/QualifiedInvestorRegistration';
import QualifiedInvestorDirectory from '@/components/admin/QualifiedInvestorDirectory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Users,
  UserPlus,
  Database,
  Lock,
  FileText,
  TrendingUp
} from 'lucide-react';

export default function IRDataroomDashboard() {
  const { user, loading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Check authentication and permissions
  if (!loading && !user) {
    redirect('/login');
  }

  // Check role permissions (super_admin, leadership, platform_admin)
  const userRole = user?.role;
  const hasAccess = userRole === 'super_admin' || userRole === 'leadership' || userRole === 'platform_admin';
  const canManageInvestors = userRole === 'super_admin' || userRole === 'leadership';

  if (!loading && !hasAccess) {
    redirect('/dashboard');
  }

  // Handle successful investor creation
  const handleInvestorCreated = () => {
    // Refresh the directory
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">IR Dataroom Management</h1>
            <p className="text-muted-foreground">
              Manage qualified investor access to the investor relations dataroom
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            {userRole === 'super_admin' ? 'Super Admin' : userRole === 'leadership' ? 'Leadership' : 'Platform Admin'}
          </Badge>
          {canManageInvestors ? (
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-200 text-green-700">
              <UserPlus className="h-3 w-3 mr-1" />
              Can Create Investors
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 text-orange-700">
              View Only
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Active Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">Accredited investors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-600" />
              Dataroom Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Secure</div>
            <p className="text-xs text-muted-foreground mt-1">Role-based control</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Investor Directory
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="flex items-center gap-2"
            disabled={!canManageInvestors}
          >
            <UserPlus className="h-4 w-4" />
            Register New
          </TabsTrigger>
        </TabsList>

        {/* Directory Tab */}
        <TabsContent value="directory">
          <QualifiedInvestorDirectory 
            key={refreshKey}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        </TabsContent>

        {/* Registration Tab */}
        <TabsContent value="register">
          {canManageInvestors ? (
            <QualifiedInvestorRegistration onSuccess={handleInvestorCreated} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Access Restricted</CardTitle>
                <CardDescription>
                  Only Super Admins and Leadership can register new qualified investors.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">About IR Dataroom Management</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Super Admins and Leadership</strong> can register new qualified investors, providing them with secure access to the investor relations dataroom.
          </p>
          <p>
            <strong>Platform Admins</strong> can view the investor directory but cannot create new accounts.
          </p>
          <p>
            When creating a new investor account, a secure password is auto-generated and displayed <strong>only once</strong>. 
            Make sure to copy and securely provide it to the investor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

