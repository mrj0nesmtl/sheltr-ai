/**
 * SHELTR Shelter Admin Notifications Dashboard
 * 
 * Notifications for shelter administrators about participants, inquiries, donations, etc.
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Home, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';

export default function ShelterAdminNotificationsPage() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  // Redirect if not shelter admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              This page is only available to shelter administrators.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const participantInquiries = notifications.filter(n => n.category === 'participant').length;
  const shelterInquiries = notifications.filter(n => n.category === 'shelter').length;
  const donationAlerts = notifications.filter(n => n.category === 'donation').length;
  const contactInquiries = notifications.filter(n => n.category === 'contact').length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Shelter Notifications</h1>
        <p className="text-muted-foreground">
          Manage participant inquiries, donations, and shelter communications
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Participant Inquiries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-500" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantInquiries}</div>
            <p className="text-xs text-muted-foreground mt-2">Inquiries</p>
          </CardContent>
        </Card>

        {/* Shelter Inquiries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-500" />
              Shelter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterInquiries}</div>
            <p className="text-xs text-muted-foreground mt-2">Page inquiries</p>
          </CardContent>
        </Card>

        {/* Donations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donationAlerts}</div>
            <p className="text-xs text-muted-foreground mt-2">Alerts</p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactInquiries}</div>
            <p className="text-xs text-muted-foreground mt-2">Messages</p>
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
              emptyMessage="No notifications yet. You'll receive updates about participant inquiries, donations to your shelter, and page visitors here."
            />
          )}
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          You'll be notified when participants inquire about services, when your shelter 
          receives donations, or when visitors submit inquiries through your public page.
        </p>
      </div>
    </div>
  );
}

