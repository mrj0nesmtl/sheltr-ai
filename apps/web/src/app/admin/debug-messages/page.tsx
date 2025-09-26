'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  Database,
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageService } from '@/services/messageService';
import { NotificationService } from '@/services/notificationService';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DebugMessagesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  // Check if user has access
  const hasAccess = user && ['super_admin', 'platform_admin'].includes(user.role || '');

  const runFullDebug = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    const results: any = {};
    
    try {
      console.log('🔍 Starting full message system debug for user:', user.email);
      
      // 1. Check user shortcode
      console.log('📋 Checking user shortcode...');
      const userShortcode = await MessageService.getShortcodeByUserId(user.uid);
      results.userShortcode = userShortcode;
      
      // 2. Check all conversations in database
      console.log('💬 Checking all conversations...');
      const allConversationsQuery = query(collection(db, 'message_conversations'));
      const allConversationsSnapshot = await getDocs(allConversationsQuery);
      results.allConversations = [];
      allConversationsSnapshot.forEach(doc => {
        results.allConversations.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // 3. Check user's conversations
      console.log('👤 Checking user conversations...');
      const userConversations = await MessageService.getUserConversations(user.uid);
      results.userConversations = userConversations;
      
      // 4. Check all messages
      console.log('📨 Checking all messages...');
      const allMessagesQuery = query(
        collection(db, 'internal_messages'),
        orderBy('createdAt', 'desc')
      );
      const allMessagesSnapshot = await getDocs(allMessagesQuery);
      results.allMessages = [];
      allMessagesSnapshot.forEach(doc => {
        results.allMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // 5. Check user's messages (sent and received)
      console.log('📤 Checking sent messages...');
      const sentMessagesQuery = query(
        collection(db, 'internal_messages'),
        where('fromUserId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const sentMessagesSnapshot = await getDocs(sentMessagesQuery);
      results.sentMessages = [];
      sentMessagesSnapshot.forEach(doc => {
        results.sentMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('📥 Checking received messages...');
      const receivedMessagesQuery = query(
        collection(db, 'internal_messages'),
        where('toUserId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const receivedMessagesSnapshot = await getDocs(receivedMessagesQuery);
      results.receivedMessages = [];
      receivedMessagesSnapshot.forEach(doc => {
        results.receivedMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // 6. Check notifications
      console.log('🔔 Checking notifications...');
      const notifications = await NotificationService.getUnreadNotifications(user.uid);
      results.notifications = notifications;
      
      // 7. Check notification counts
      console.log('📊 Checking notification counts...');
      const notificationCounts = await NotificationService.getNotificationSummary(user.uid);
      results.notificationCounts = notificationCounts;
      
      console.log('✅ Debug complete:', results);
      setDebugData(results);
      
    } catch (error: any) {
      console.error('❌ Debug error:', error);
      setError(error.message || 'Debug failed');
      results.error = error.message;
      setDebugData(results);
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
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This debug page is only available to Super Admins and Platform Admins.
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
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debug Messages</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Debug messaging system for {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Button
          onClick={runFullDebug}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          Run Full Debug
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

      {Object.keys(debugData).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>UID:</strong> {user?.uid}</div>
                <div><strong>Email:</strong> {user?.email}</div>
                <div><strong>Role:</strong> {user?.role}</div>
                <div><strong>Shortcode:</strong> {debugData.userShortcode ? `@${debugData.userShortcode.shortcode}` : 'None'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Conversations */}
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>All Conversations:</strong> {debugData.allConversations?.length || 0}</div>
                <div><strong>User Conversations:</strong> {debugData.userConversations?.length || 0}</div>
                {debugData.allConversations?.map((conv: any, i: number) => (
                  <div key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    <div><strong>ID:</strong> {conv.id}</div>
                    <div><strong>Participants:</strong> {conv.participantIds?.join(', ')}</div>
                    <div><strong>Shortcodes:</strong> {conv.participantShortcodes?.join(', ')}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>All Messages:</strong> {debugData.allMessages?.length || 0}</div>
                <div><strong>Sent Messages:</strong> {debugData.sentMessages?.length || 0}</div>
                <div><strong>Received Messages:</strong> {debugData.receivedMessages?.length || 0}</div>
                {debugData.allMessages?.slice(0, 3).map((msg: any, i: number) => (
                  <div key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    <div><strong>From:</strong> {msg.fromUserShortcode} → <strong>To:</strong> {msg.toUserShortcode}</div>
                    <div><strong>Content:</strong> {msg.content}</div>
                    <div><strong>Status:</strong> {msg.status}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Unread Notifications:</strong> {debugData.notifications?.length || 0}</div>
                <div><strong>Unread Messages:</strong> {debugData.notificationCounts?.unreadMessages || 0}</div>
                <div><strong>Unread Total:</strong> {debugData.notificationCounts?.unreadNotifications || 0}</div>
                {debugData.notifications?.map((notif: any, i: number) => (
                  <div key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    <div><strong>Type:</strong> {notif.type}</div>
                    <div><strong>From:</strong> {notif.fromUserDisplayName}</div>
                    <div><strong>Content:</strong> {notif.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
