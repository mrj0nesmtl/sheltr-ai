/**
 * SHELTR Donor Notifications Dashboard
 * 
 * Notifications for donors about donations, receipts, tax documents, etc.
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Receipt, FileText, Heart, AlertCircle } from 'lucide-react';

export default function DonorNotificationsPage() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  // Redirect if not donor
  if (!user || user.role !== 'donor') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              This page is only available to donors.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const donationConfirmations = notifications.filter(n => n.type === 'donation_confirmation').length;
  const receiptsAvailable = notifications.filter(n => n.type === 'receipt_available').length;
  const taxDocuments = notifications.filter(n => n.type === 'tax_document_ready').length;
  const impactUpdates = notifications.filter(n => n.type === 'impact_update').length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Notifications</h1>
        <p className="text-muted-foreground">
          Track your donations, receipts, tax documents, and impact stories
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Donations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-orange-500" />
              Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donationConfirmations}</div>
            <p className="text-xs text-muted-foreground mt-2">Confirmed</p>
          </CardContent>
        </Card>

        {/* Receipts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Receipt className="h-4 w-4 text-teal-500" />
              Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receiptsAvailable}</div>
            <p className="text-xs text-muted-foreground mt-2">Available</p>
          </CardContent>
        </Card>

        {/* Tax Documents */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Tax Docs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxDocuments}</div>
            <p className="text-xs text-muted-foreground mt-2">Ready</p>
          </CardContent>
        </Card>

        {/* Impact Updates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactUpdates}</div>
            <p className="text-xs text-muted-foreground mt-2">Stories</p>
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
              emptyMessage="No notifications yet. You'll receive confirmations for your donations, tax receipts, and impact stories here."
            />
          )}
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          You'll be notified when your donations are processed, tax receipts are ready, 
          and when we have impact stories to share about how your giving made a difference.
        </p>
      </div>
    </div>
  );
}
