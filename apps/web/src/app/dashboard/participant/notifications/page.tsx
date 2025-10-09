'use client';

import { useAuth } from '@/contexts/AuthContext';
import ParticipantNotifications from '@/components/ParticipantNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function ParticipantNotificationsPage() {
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
        <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
          <Bell className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on donations you receive, services, and goals
          </p>
        </div>
      </div>

      {/* Notifications Component */}
      <ParticipantNotifications userId={user.uid} />

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
              <span><strong>Donations Received:</strong> Notification when someone donates to support you</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span><strong>Service Updates:</strong> Reminders and updates about your scheduled services</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span><strong>Appointment Reminders:</strong> Upcoming appointments and check-ins</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span><strong>Goal Updates:</strong> Progress updates on your housing and personal goals</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span><strong>System Messages:</strong> Important platform updates and support messages</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

