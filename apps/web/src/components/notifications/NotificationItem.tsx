/**
 * SHELTR Notification Item Component
 * 
 * A single notification item in the unified notification list
 * Displays notification with icon, badge, priority, and actions
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  Mail, 
  FileText, 
  Shield, 
  Settings, 
  DollarSign, 
  Wrench, 
  Calendar, 
  Target, 
  CreditCard, 
  Receipt, 
  Users, 
  Home,
  Check,
  X,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  UnifiedNotification, 
  NotificationCategory,
  NotificationPriority 
} from '@/types/notifications';
import { formatRelativeTime } from '@/services/unifiedNotificationService';

interface NotificationItemProps {
  notification: UnifiedNotification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  showCheckbox?: boolean;
}

// Icon mapping
const ICON_MAP: Record<NotificationCategory, LucideIcon> = {
  contact: MessageSquare,
  newsletter: Mail,
  application: FileText,
  security: Shield,
  system: Settings,
  donation: DollarSign,
  service: Wrench,
  appointment: Calendar,
  goal: Target,
  transaction: CreditCard,
  receipt: Receipt,
  participant: Users,
  shelter: Home
};

// Badge color mapping
const BADGE_COLORS: Record<NotificationCategory, string> = {
  contact: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  newsletter: 'bg-green-500/10 text-green-500 border-green-500/20',
  application: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  security: 'bg-red-500/10 text-red-500 border-red-500/20',
  system: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  donation: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  service: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  appointment: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  goal: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  transaction: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  receipt: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  participant: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  shelter: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
};

// Priority indicator
const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: 'border-l-gray-400',
  normal: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-500 animate-pulse'
};

export function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  onClick,
  isSelected = false,
  onSelect,
  showCheckbox = false
}: NotificationItemProps) {
  // Defensive check: Don't render if missing critical fields
  if (!notification || !notification.title || !notification.message) {
    console.error('❌ NotificationItem received invalid notification:', notification);
    return null;
  }

  const Icon = ICON_MAP[notification.category] || Settings;
  const badgeColor = BADGE_COLORS[notification.category] || BADGE_COLORS.system;
  const priorityColor = PRIORITY_COLORS[notification.priority] || PRIORITY_COLORS.normal;

  return (
    <div
      className={cn(
        'group relative flex items-start gap-4 p-4 border-l-4 rounded-lg transition-all duration-200',
        'border border-border/40 bg-card/50',
        'hover:bg-accent/30 hover:border-border hover:shadow-md hover:scale-[1.01]',
        priorityColor,
        !notification.isRead && 'bg-muted/40 border-2 border-primary/30 shadow-sm',
        isSelected && 'bg-primary/10 ring-2 ring-primary border-primary/50'
      )}
    >
      {/* Left: Icon */}
      <div 
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer',
          badgeColor
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0">
        {/* Title and Badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={cn(
            'font-medium text-sm',
            !notification.isRead && 'font-semibold'
          )}>
            {notification.title}
          </h4>
          <Badge variant="outline" className={cn('text-xs flex-shrink-0', badgeColor)}>
            {notification.category}
          </Badge>
        </div>

        {/* Message */}
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {notification.message}
        </p>

        {/* Footer: Time and Priority */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatRelativeTime(notification.created_at)}</span>
          {notification.priority !== 'normal' && (
            <>
              <span>•</span>
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs h-5 px-1.5',
                  notification.priority === 'urgent' && 'text-red-500 border-red-500/20',
                  notification.priority === 'high' && 'text-orange-500 border-orange-500/20',
                  notification.priority === 'low' && 'text-gray-500 border-gray-500/20'
                )}
              >
                {notification.priority}
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions (Show on hover) */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {!notification.isRead && onMarkAsRead && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              notification.id && onMarkAsRead(notification.id);
            }}
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              notification.id && onDelete(notification.id);
            }}
            title="Delete"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {/* Checkbox for bulk selection - Always visible on the right */}
        {showCheckbox && (
          <div className="flex items-center">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect?.(notification.id, checked as boolean)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Unread indicator dot (only show when no checkbox) */}
      {!notification.isRead && !showCheckbox && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
      )}
    </div>
  );
}

