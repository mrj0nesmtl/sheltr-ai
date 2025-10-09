'use client';

import { useAuth } from '@/contexts/AuthContext';
import DonorNotifications from '@/components/DonorNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function DonorNotificationsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please log in to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Bell className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on your donations, receipts, and transaction updates
          </p>
        </div>
      </div>

      {/* Notifications Component */}
      <DonorNotifications userId={user.uid} />

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Notifications</CardTitle>
          <CardDescription>What notifications will you receive?</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Donation Confirmations:</strong> Instant confirmation when your donation is processed</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span><strong>Receipt Available:</strong> Notification when your tax receipt is ready for download</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span><strong>Transaction Updates:</strong> Updates on recurring donations and payment methods</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span><strong>Tax Documents:</strong> Annual tax documents and year-end summaries</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span><strong>System Messages:</strong> Important platform updates and announcements</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

