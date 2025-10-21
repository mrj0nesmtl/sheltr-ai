/**
 * SHELTR Notification List Component
 * 
 * Unified notification list that replaces the cluttered dashboard cards
 * Clean, simple, and efficient
 */

'use client';

import { useState } from 'react';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bell, 
  CheckCheck, 
  Search, 
  Filter,
  AlertCircle,
  Download 
} from 'lucide-react';
import type { 
  UnifiedNotification, 
  NotificationCategory 
} from '@/types/notifications';
import { cn } from '@/lib/utils';
import { exportNotificationsToCSV } from '@/utils/exportNotifications';

interface NotificationListProps {
  notifications: UnifiedNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onNotificationClick?: (notification: UnifiedNotification) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
  loading = false,
  emptyMessage = 'No notifications yet'
}: NotificationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) {
      return false;
    }

    // Unread filter
    if (showUnreadOnly && notification.isRead) {
      return false;
    }

    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Get unique categories from notifications
  const categories = Array.from(
    new Set(notifications.map(n => n.category))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button */}
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportNotificationsToCSV(notifications)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          )}
          
          {/* Mark All Read Button */}
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onMarkAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as NotificationCategory | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Unread Filter Toggle */}
        <Button
          variant={showUnreadOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Unread only
        </Button>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {searchQuery || categoryFilter !== 'all' || showUnreadOnly 
                ? 'No notifications match your filters' 
                : emptyMessage
              }
            </p>
            {(searchQuery || categoryFilter !== 'all' || showUnreadOnly) && (
              <p className="text-sm">
                Try adjusting your filters or search query
              </p>
            )}
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                onClick={() => onNotificationClick?.(notification)}
              />
            ))}
            
            {/* Show count */}
            <div className="text-center py-4 text-sm text-muted-foreground border-t">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
          </>
        )}
      </div>
    </div>
  );
}

