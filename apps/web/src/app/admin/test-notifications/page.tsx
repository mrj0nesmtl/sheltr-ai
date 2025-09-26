'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  MessageCircle, 
  TestTube,
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationService } from '@/services/notificationService';

export default function TestNotificationsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access
  const hasAccess = user && ['super_admin'].includes(user.role || '');

  const createTestNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
      console.log('🧪 Creating test notifications...');
      
      // Create a test message notification for Joel
      const result1 = await NotificationService.createMessageNotification(
        user.uid,
        'message_received',
        'test-message-1',
        'test-conversation-1',
        'gunnar-user-id',
        'Gunnar Blaze',
        'gunnar',
        'This is a test notification to see if the notification system works!'
      );
      
      // Create another test notification
      const result2 = await NotificationService.createMessageNotification(
        user.uid,
        'message_replied',
        'test-message-2',
        'test-conversation-1',
        'gunnar-user-id',
        'Gunnar Blaze',
        'gunnar',
        'Test reply notification'
      );
      
      setResults([
        { action: 'Created message_received notification', success: result1 },
        { action: 'Created message_replied notification', success: result2 }
      ]);
      
      console.log('✅ Test notifications created');
      
    } catch (error: any) {
      console.error('❌ Error creating test notifications:', error);
      setError(error.message || 'Failed to create test notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const checkNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Checking notifications...');
      
      // Get unread notifications
      const notifications = await NotificationService.getUnreadNotifications(user.uid);
      
      // Get notification counts
      const counts = await NotificationService.getNotificationSummary(user.uid);
      
      setResults([
        { action: 'Unread notifications found', success: true, data: notifications.length },
        { action: 'Unread message count', success: true, data: counts.unreadMessages },
        { action: 'Total unread count', success: true, data: counts.unreadNotifications },
        ...notifications.map(notif => ({
          action: `Notification: ${notif.type}`,
          success: true,
          data: `From: ${notif.fromUserDisplayName} - ${notif.content.substring(0, 50)}...`
        }))
      ]);
      
      console.log('✅ Notification check complete');
      
    } catch (error: any) {
      console.error('❌ Error checking notifications:', error);
      setError(error.message || 'Failed to check notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🧹 This would clear test notifications (not implemented)');
      setResults([{ action: 'Clear function not implemented', success: false }]);
    } catch (error: any) {
      console.error('❌ Error clearing notifications:', error);
      setError(error.message || 'Failed to clear notifications');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This test page is only available to Super Admins.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Notifications</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Test notification system for {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button
          onClick={createTestNotifications}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          Create Test Notifications
        </Button>
        
        <Button
          onClick={checkNotifications}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          Check Notifications
        </Button>
        
        <Button
          onClick={clearTestNotifications}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TestTube className="h-4 w-4" />
          )}
          Clear Test Data
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Error</span>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">{result.action}</span>
                  <div className="flex items-center gap-2">
                    {result.data && (
                      <Badge variant="outline" className="text-xs">
                        {result.data}
                      </Badge>
                    )}
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Create Test Notifications:</strong> Creates sample notifications for your user</li>
            <li><strong>Check Notifications:</strong> Verifies if notifications exist and counts are correct</li>
            <li><strong>Test Real Flow:</strong> Send a new message between Joel and Gunnar to test live notifications</li>
            <li><strong>Check Sidebar:</strong> After creating notifications, check if sidebar badges update</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Why notifications show 0:</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Existing messages don't have notifications because they were sent before we implemented the notification system. 
              New messages will create notifications automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
