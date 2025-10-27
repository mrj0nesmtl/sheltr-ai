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
import { Checkbox } from '@/components/ui/checkbox';
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
  Download,
  Trash2,
  MailOpen,
  MailX
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
  onBulkMarkAsRead?: (ids: string[]) => Promise<void>;
  onBulkMarkAsUnread?: (ids: string[]) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onNotificationClick?: (notification: UnifiedNotification) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onBulkMarkAsRead,
  onBulkMarkAsUnread,
  onBulkDelete,
  onNotificationClick,
  loading = false,
  emptyMessage = 'No notifications yet'
}: NotificationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all');
  // Default to showing ONLY unread notifications
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Filter out malformed notifications (missing required fields)
    if (!notification.title || !notification.message || !notification.category) {
      console.warn('⚠️ Skipping malformed notification:', notification);
      return false;
    }

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

  // Get unique categories from notifications (filter out undefined/null)
  const categories = Array.from(
    new Set(notifications.map(n => n.category).filter(Boolean))
  );

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = filteredNotifications.length > 0 && 
    filteredNotifications.every(n => selectedIds.has(n.id));

  // Bulk actions
  const handleBulkMarkAsRead = async () => {
    if (!onBulkMarkAsRead || selectedIds.size === 0) return;
    setIsProcessing(true);
    try {
      await onBulkMarkAsRead(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to mark as read:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkMarkAsUnread = async () => {
    if (!onBulkMarkAsUnread || selectedIds.size === 0) return;
    setIsProcessing(true);
    try {
      await onBulkMarkAsUnread(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to mark as unread:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} notifications? This cannot be undone.`)) return;
    setIsProcessing(true);
    try {
      await onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
            {categories.map((category, index) => (
              <SelectItem key={`${category}-${index}`} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
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
          {showUnreadOnly ? 'Show All' : 'Unread Only'}
        </Button>
      </div>

      {/* Bulk Selection & Actions Toolbar */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedIds.size > 0 ? (
                `${selectedIds.size} selected`
              ) : (
                'Select all'
              )}
            </span>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkAsRead}
                disabled={isProcessing}
                className="gap-2"
              >
                <MailOpen className="h-4 w-4" />
                Mark Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkAsUnread}
                disabled={isProcessing}
                className="gap-2"
              >
                <MailX className="h-4 w-4" />
                Mark Unread
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isProcessing}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      )}

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
                showCheckbox={true}
                isSelected={selectedIds.has(notification.id)}
                onSelect={handleSelectOne}
              />
            ))}
            
            {/* Show count */}
            <div className="text-center py-4 text-sm text-muted-foreground border-t">
              Showing {filteredNotifications.length} of {notifications.length} notifications
              {selectedIds.size > 0 && ` (${selectedIds.size} selected)`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

