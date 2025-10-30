/**
 * PermissionBadge Component
 * Visual indicator for document permission levels
 * Displays color-coded badges with icons for each permission level
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Users, 
  Heart, 
  User, 
  Building, 
  Shield, 
  Crown, 
  Lock 
} from 'lucide-react';

export type PermissionLevel = 
  | 'public' 
  | 'authenticated' 
  | 'donor' 
  | 'participant' 
  | 'shelter_admin' 
  | 'platform_admin' 
  | 'founders' 
  | 'super_admin';

interface PermissionBadgeProps {
  permission: PermissionLevel;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const permissionConfig = {
  public: {
    label: 'Public',
    description: 'Anyone can view',
    color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    icon: Globe
  },
  authenticated: {
    label: 'Authenticated',
    description: 'Logged-in users',
    color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    icon: Users
  },
  donor: {
    label: 'Donors',
    description: 'Donors only',
    color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    icon: Heart
  },
  participant: {
    label: 'Participants',
    description: 'Participants only',
    color: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
    icon: User
  },
  shelter_admin: {
    label: 'Shelter Admin',
    description: 'Shelter administrators',
    color: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    icon: Building
  },
  platform_admin: {
    label: 'Platform Admin',
    description: 'Platform administrators',
    color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
    icon: Shield
  },
  founders: {
    label: 'Founders',
    description: 'Founders only',
    color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    icon: Crown
  },
  super_admin: {
    label: 'Super Admin',
    description: 'Highest level access',
    color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700',
    icon: Lock
  }
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5'
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({
  permission,
  showDescription = false,
  size = 'md',
  className = ''
}) => {
  const config = permissionConfig[permission];
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${config.color} ${sizeClasses[size]} ${className} border font-semibold inline-flex items-center gap-1.5`}
      >
        <Icon className={iconSizes[size]} />
        <span>{config.label}</span>
      </Badge>
      {showDescription && (
        <span className="text-xs text-muted-foreground">
          {config.description}
        </span>
      )}
    </div>
  );
};

export default PermissionBadge;

