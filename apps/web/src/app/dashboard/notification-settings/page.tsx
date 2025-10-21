/**
 * SHELTR Notification Settings Page
 * 
 * User notification preferences management
 */

'use client';

import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notifications
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Notification Settings
        </h1>
        <p className="text-muted-foreground">
          Customize how and when you receive notifications
        </p>
      </div>

      {/* Preferences Component */}
      <NotificationPreferences />
    </div>
  );
}

