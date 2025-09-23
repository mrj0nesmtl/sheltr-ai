'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStatus, UserStatus, statusColors, statusLabels } from '@/services/userStatusService';
import { ChevronDown } from 'lucide-react';

interface UserStatusSelectorProps {
  userId: string;
  className?: string;
}

export function UserStatusSelector({ userId, className = '' }: UserStatusSelectorProps) {
  const { status, updateStatus } = useUserStatus(userId);

  const handleStatusChange = (newStatus: UserStatus) => {
    updateStatus(newStatus);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center space-x-2 ${className}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
          <span className="text-xs font-medium">{statusLabels[status]}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        {Object.entries(statusLabels).map(([statusKey, label]) => (
          <DropdownMenuItem
            key={statusKey}
            onClick={() => handleStatusChange(statusKey as UserStatus)}
            className="flex items-center space-x-2"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${statusColors[statusKey as UserStatus]}`} />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
