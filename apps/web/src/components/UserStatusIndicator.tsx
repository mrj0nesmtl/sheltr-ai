/**
 * UserStatusIndicator Component
 * 
 * Displays a small colored dot indicating a user's online status.
 * Perfect for showing user status in lists, avatars, and user cards.
 * 
 * Features:
 * - Real-time status updates via Firestore
 * - Multiple sizes (sm, md, lg)
 * - Loading state with pulse animation
 * - Tooltip on hover showing status
 * 
 * Usage:
 * <UserStatusIndicator userId="user123" size="sm" />
 */

'use client';

import React from 'react';
import { useOtherUserStatus, statusColors } from '@/services/userStatusService';

interface UserStatusIndicatorProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserStatusIndicator({ userId, size = 'sm', className = '' }: UserStatusIndicatorProps) {
  const { status, isLoading } = useOtherUserStatus(userId);

  if (isLoading || !userId) {
    return (
      <div className={`rounded-full bg-gray-300 animate-pulse ${getSizeClasses(size)} ${className}`} />
    );
  }

  return (
    <div 
      className={`rounded-full ${statusColors[status]} ${getSizeClasses(size)} ${className}`}
      title={`User is ${status}`}
    />
  );
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-2.5 h-2.5';
    case 'md':
      return 'w-3 h-3';
    case 'lg':
      return 'w-4 h-4';
    default:
      return 'w-2.5 h-2.5';
  }
}
