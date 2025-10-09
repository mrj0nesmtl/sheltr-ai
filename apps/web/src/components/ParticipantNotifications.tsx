'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, CheckCheck, Heart, Calendar, Target, AlertCircle, Stethoscope } from 'lucide-react';
import { 
  getParticipantNotifications, 
  getParticipantNotificationCounts,
  markParticipantNotificationAsRead,
  markAllParticipantNotificationsAsRead,
  ParticipantNotification,
  ParticipantNotificationCounts
} from '@/services/participantNotificationService';
import { formatRelativeTime } from '@/services/notificationService';

interface ParticipantNotificationsProps {
  userId: string;
}

export default function ParticipantNotifications({ userId }: ParticipantNotificationsProps) {
  const [notifications, setNotifications] = useState<ParticipantNotification[]>([]);
  const [counts, setCounts] = useState<ParticipantNotificationCounts>({
    total: 0,
    unread: 0,
    recentDonations: 0,
    upcomingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [notifs, notifCounts] = await Promise.all([
        getParticipantNotifications(userId, 10),
        getParticipantNotificationCounts(userId)
      ]);
      setNotifications(notifs);
      setCounts(notifCounts);
    } catch (error) {
      console.error('Error loading participant notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markParticipantNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setCounts(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAllRead(true);
    const success = await markAllParticipantNotificationsAsRead(userId);
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setCounts(prev => ({ ...prev, unread: 0 }));
    }
    setMarkingAllRead(false);
  };

  const getNotificationIcon = (type: ParticipantNotification['type']) => {
    switch (type) {
      case 'donation_received':
        return <Heart className="h-4 w-4 text-green-600 fill-green-600" />;
      case 'service_update':
        return <Stethoscope className="h-4 w-4 text-blue-600" />;
      case 'appointment_reminder':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'goal_update':
        return <Target className="h-4 w-4 text-orange-600" />;
      case 'system_message':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: ParticipantNotification['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'normal':
        return <Badge variant="outline" className="text-xs border-blue-400 text-blue-600 dark:text-blue-400">Normal</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs border-gray-400 text-gray-600 dark:text-gray-400">Low</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {counts.unread > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {counts.unread}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              <div className="flex flex-col gap-1 mt-1">
                {counts.recentDonations > 0 && (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-current" />
                    {counts.recentDonations} donation{counts.recentDonations !== 1 ? 's' : ''} this week
                  </span>
                )}
                {counts.upcomingAppointments > 0 && (
                  <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {counts.upcomingAppointments} upcoming appointment{counts.upcomingAppointments !== 1 ? 's' : ''}
                  </span>
                )}
                {counts.recentDonations === 0 && counts.upcomingAppointments === 0 && 'No recent activity'}
              </div>
            </CardDescription>
          </div>
          {counts.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              {markingAllRead ? 'Marking...' : 'Mark All Read'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No notifications yet</p>
            <p className="text-sm mt-1">
              You'll see donations, appointments, and updates here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.isRead
                    ? 'bg-muted/30 border-border'
                    : 'bg-primary/5 border-primary/20 dark:bg-primary/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getPriorityBadge(notification.priority)}
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id!)}
                            className="h-6 px-2 text-xs"
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    {notification.amount && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <Heart className="h-3 w-3 fill-current" />
                        ${notification.amount.toFixed(2)}
                        {notification.donorName && (
                          <span className="text-muted-foreground ml-1">
                            from {notification.donorName}
                          </span>
                        )}
                      </div>
                    )}
                    {notification.serviceName && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Service: {notification.serviceName}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(notification.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length >= 10 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  View All Notifications
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

