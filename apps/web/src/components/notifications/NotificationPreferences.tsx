/**
 * SHELTR Notification Preferences Component
 * 
 * Allow users to customize their notification settings
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Volume2, 
  Moon, 
  AlertTriangle,
  Save,
  Loader2
} from 'lucide-react';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useToast } from '@/hooks/use-toast';

const NOTIFICATION_CATEGORIES = [
  { id: 'contact', label: 'Contact Inquiries', description: 'Form submissions and messages' },
  { id: 'newsletter', label: 'Newsletter Signups', description: 'New email subscribers' },
  { id: 'application', label: 'Applications', description: 'Shelter and participant applications' },
  { id: 'security', label: 'Security Alerts', description: 'Fraud and security warnings' },
  { id: 'system', label: 'System Notifications', description: 'Platform updates and maintenance' },
  { id: 'donation', label: 'Donations', description: 'Donation confirmations and receipts' },
  { id: 'service', label: 'Services', description: 'Service appointments and updates' },
  { id: 'appointment', label: 'Appointments', description: 'Scheduled appointments and reminders' },
  { id: 'goal', label: 'Goals', description: 'Housing goal progress updates' },
  { id: 'transaction', label: 'Transactions', description: 'Financial transactions' },
  { id: 'receipt', label: 'Receipts', description: 'Tax receipts and documents' },
  { id: 'participant', label: 'Participants', description: 'Participant-related updates' },
  { id: 'shelter', label: 'Shelters', description: 'Shelter-related updates' }
];

export function NotificationPreferences() {
  const { preferences, loading, updatePreferences, toggleCategory } = useNotificationPreferences();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Unable to load preferences</p>
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Delivery Methods
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications in the SHELTR dashboard
              </p>
            </div>
            <Switch
              checked={preferences.inApp}
              onCheckedChange={(checked) => updatePreferences({ inApp: checked })}
            />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notifications
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive browser notifications even when dashboard is closed
              </p>
            </div>
            <Switch
              checked={preferences.push}
              onCheckedChange={(checked) => updatePreferences({ push: checked })}
              disabled
            />
          </div>

          <Separator />

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={preferences.email}
              onCheckedChange={(checked) => updatePreferences({ email: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Digest Settings */}
      {preferences.email && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Digest
            </CardTitle>
            <CardDescription>
              Receive periodic summaries of your notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={preferences.emailDigest}
                onValueChange={(value: 'never' | 'daily' | 'weekly') => 
                  updatePreferences({ emailDigest: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {preferences.emailDigest !== 'never' && (
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Input
                  type="time"
                  value={preferences.emailDigestTime}
                  onChange={(e) => updatePreferences({ emailDigestTime: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Digest will be sent at this time in your local timezone
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Categories</CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {NOTIFICATION_CATEGORIES.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{category.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <Switch
                  checked={preferences.categories[category.id as keyof typeof preferences.categories]}
                  onCheckedChange={(checked) => toggleCategory(category.id, checked)}
                />
              </div>
              {category.id !== NOTIFICATION_CATEGORIES[NOTIFICATION_CATEGORIES.length - 1].id && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Mute non-urgent notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">
                Only urgent notifications will be shown during this time
              </p>
            </div>
            <Switch
              checked={preferences.quietHoursEnabled}
              onCheckedChange={(checked) => updatePreferences({ quietHoursEnabled: checked })}
            />
          </div>

          {preferences.quietHoursEnabled && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHoursStart}
                    onChange={(e) => updatePreferences({ quietHoursStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHoursEnd}
                    onChange={(e) => updatePreferences({ quietHoursEnd: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Priority Threshold */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Priority Filter
          </CardTitle>
          <CardDescription>
            Only show notifications at or above this priority level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.minPriority}
            onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') =>
              updatePreferences({ minPriority: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">All (Low and above)</SelectItem>
              <SelectItem value="normal">Normal and above</SelectItem>
              <SelectItem value="high">High and urgent only</SelectItem>
              <SelectItem value="urgent">Urgent only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound
          </CardTitle>
          <CardDescription>
            Control notification sounds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notification Sound</Label>
              <p className="text-sm text-muted-foreground">
                Play a sound when notifications arrive
              </p>
            </div>
            <Switch
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => updatePreferences({ soundEnabled: checked })}
            />
          </div>

          {preferences.soundEnabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Volume: {preferences.soundVolume}%</Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.soundVolume}
                  onChange={(e) => updatePreferences({ soundVolume: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

