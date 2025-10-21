/**
 * SHELTR Admin Notifications Dashboard
 * 
 * Unified notification dashboard for Super Admin and Platform Admin
 * Clean, simple, and efficient - replacing 6 card components with one list
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Shield, Users, Mail, MessageSquare, AlertCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  // Redirect if not admin
  if (!user || (!user.role.includes('admin') && user.role !== 'super_admin')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Calculate quick stats
  const contactInquiries = notifications.filter(n => n.category === 'contact').length;
  const newsletterSignups = notifications.filter(n => n.category === 'newsletter').length;
  const securityAlerts = notifications.filter(n => n.category === 'security').length;
  const participantSignups = notifications.filter(n => n.category === 'participant').length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications Center</h1>
          <p className="text-muted-foreground">
            Manage platform notifications and user communications
          </p>
        </div>
        <Link href="/dashboard/notification-settings">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="mt-2">
                {unreadCount} unread
                    </Badge>
                  )}
          </CardContent>
        </Card>

            {/* Contact Inquiries */}
            <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-2xl font-bold">{contactInquiries}</div>
            <p className="text-xs text-muted-foreground mt-2">Form submissions</p>
              </CardContent>
            </Card>

        {/* Newsletter Signups */}
            <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-500" />
              Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-2xl font-bold">{newsletterSignups}</div>
            <p className="text-xs text-muted-foreground mt-2">Subscribers</p>
              </CardContent>
            </Card>

        {/* Security Alerts */}
            <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Security
                </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-2xl font-bold">{securityAlerts}</div>
            {securityAlerts > 0 ? (
              <Badge variant="destructive" className="mt-2">
                {securityAlerts} alerts
                  </Badge>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">All secure</p>
                )}
              </CardContent>
            </Card>
          </div>

      {/* Main Notification List */}
          <Card>
        <CardContent className="pt-6">
          {error ? (
            <div className="text-center py-12 text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">{error}</p>
                </div>
              ) : (
            <NotificationList
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              loading={loading}
              emptyMessage="No notifications yet. You'll see updates about contact forms, newsletter signups, and platform activity here."
            />
              )}
            </CardContent>
          </Card>

      {/* Help Text */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          Notifications are updated in real-time. You'll receive alerts about contact forms, 
          newsletter signups, participant registrations, and security events.
                  </p>
                </div>
    </div>
  );
}
