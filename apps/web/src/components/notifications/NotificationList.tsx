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
  MailX,
  ChevronLeft,
  ChevronRight
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

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
        <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value as NotificationCategory | 'all'); handleFilterChange(); }}>
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
          onClick={() => { setShowUnreadOnly(!showUnreadOnly); handleFilterChange(); }}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          {showUnreadOnly ? 'Show All' : 'Unread Only'}
        </Button>

        {/* Items Per Page Selector */}
        <Select value={itemsPerPage.toString()} onValueChange={(value) => { setItemsPerPage(Number(value)); handleFilterChange(); }}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Selection & Actions Toolbar */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-card/80 rounded-lg border-2 border-border/60 shadow-sm">
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
            {paginatedNotifications.map((notification) => (
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4 px-4 border-t border-2 border-primary/20 bg-background/80 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to <span className="font-semibold text-foreground">{Math.min(endIndex, filteredNotifications.length)}</span> of <span className="font-semibold text-foreground">{filteredNotifications.length}</span> notifications
                  {selectedIds.size > 0 && (
                    <span className="ml-2 text-primary font-medium">
                      ({selectedIds.size} selected)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first, last, current, and adjacent pages
                        return page === 1 || 
                               page === totalPages || 
                               Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, array) => {
                        // Add ellipsis between non-consecutive pages
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-muted-foreground">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={cn(
                                'w-9 h-9',
                                currentPage === page && 'font-bold'
                              )}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

