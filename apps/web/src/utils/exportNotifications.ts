/**
 * SHELTR Notification Export Utility
 * 
 * Export notifications to CSV format for archival and reporting
 */

import type { UnifiedNotification } from '@/types/notifications';
import { Timestamp } from 'firebase/firestore';

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(timestamp: Timestamp | Date): string {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return date.toISOString().split('T')[0];
}

/**
 * Format time as HH:MM:SS
 */
function formatTime(timestamp: Timestamp | Date): string {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return date.toTimeString().split(' ')[0];
}

/**
 * Escape CSV field (handle quotes and commas)
 */
function escapeCSV(field: string | number | boolean | undefined): string {
  if (field === undefined || field === null) return '';
  
  const str = String(field);
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export notifications to CSV and trigger download
 */
export function exportNotificationsToCSV(
  notifications: UnifiedNotification[],
  filename: string = `notifications-${new Date().toISOString().split('T')[0]}.csv`
): void {
  if (notifications.length === 0) {
    alert('No notifications to export');
    return;
  }

  // Create CSV headers
  const headers = [
    'ID',
    'Date',
    'Time',
    'Category',
    'Priority',
    'Title',
    'Message',
    'Read Status',
    'Type',
    'Created At (ISO)'
  ];

  // Convert notifications to CSV rows
  const rows = notifications.map(n => {
    const createdAt = n.created_at || n.createdAt;
    return [
      escapeCSV(n.id || ''),
      escapeCSV(formatDate(createdAt)),
      escapeCSV(formatTime(createdAt)),
      escapeCSV(n.category),
      escapeCSV(n.priority),
      escapeCSV(n.title),
      escapeCSV(n.message),
      escapeCSV(n.isRead ? 'Read' : 'Unread'),
      escapeCSV(n.type),
      escapeCSV(createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : new Date(createdAt).toISOString())
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Add BOM for proper Excel UTF-8 handling
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link and trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Get export statistics
 */
export function getExportStats(notifications: UnifiedNotification[]): {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  dateRange: { earliest: Date; latest: Date } | null;
} {
  if (notifications.length === 0) {
    return {
      total: 0,
      unread: 0,
      byCategory: {},
      byPriority: {},
      dateRange: null
    };
  }

  const byCategory: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let unread = 0;

  notifications.forEach(n => {
    // Count by category
    byCategory[n.category] = (byCategory[n.category] || 0) + 1;
    
    // Count by priority
    byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
    
    // Count unread
    if (!n.isRead) unread++;
  });

  // Find date range
  const timestamps = notifications
    .map(n => {
      const ts = n.created_at || n.createdAt;
      return ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    })
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    total: notifications.length,
    unread,
    byCategory,
    byPriority,
    dateRange: {
      earliest: timestamps[0],
      latest: timestamps[timestamps.length - 1]
    }
  };
}

