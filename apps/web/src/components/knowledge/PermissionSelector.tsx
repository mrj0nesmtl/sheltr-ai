/**
 * PermissionSelector Component
 * Dropdown selector for choosing document permission levels
 * Includes visual indicators and descriptions for each level
 */

import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Globe, 
  Users, 
  Heart, 
  User, 
  Building, 
  Shield, 
  Crown, 
  Lock,
  Info
} from 'lucide-react';
import { PermissionLevel } from './PermissionBadge';

interface PermissionSelectorProps {
  value: PermissionLevel;
  onChange: (value: PermissionLevel) => void;
  disabled?: boolean;
  className?: string;
  showHelp?: boolean;
}

const permissionOptions = [
  {
    value: 'public' as PermissionLevel,
    label: 'Public',
    description: 'Anyone can view (no authentication required)',
    icon: Globe,
    color: 'text-green-600 dark:text-green-400',
    category: 'Open Access'
  },
  {
    value: 'authenticated' as PermissionLevel,
    label: 'Authenticated Users',
    description: 'Any logged-in user can access',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    category: 'Basic Access'
  },
  {
    value: 'donor' as PermissionLevel,
    label: 'Donors Only',
    description: 'Accessible to donors and higher roles',
    icon: Heart,
    color: 'text-purple-600 dark:text-purple-400',
    category: 'Role-Based Access'
  },
  {
    value: 'participant' as PermissionLevel,
    label: 'Participants Only',
    description: 'Accessible to participants and higher roles',
    icon: User,
    color: 'text-teal-600 dark:text-teal-400',
    category: 'Role-Based Access'
  },
  {
    value: 'shelter_admin' as PermissionLevel,
    label: 'Shelter Administrators',
    description: 'Shelter admin access and above',
    icon: Building,
    color: 'text-orange-600 dark:text-orange-400',
    category: 'Administrative Access'
  },
  {
    value: 'platform_admin' as PermissionLevel,
    label: 'Platform Administrators',
    description: 'Platform admin access and above',
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    category: 'Administrative Access'
  },
  {
    value: 'founders' as PermissionLevel,
    label: 'Founders Only',
    description: 'Founders and leadership only',
    icon: Crown,
    color: 'text-amber-600 dark:text-amber-400',
    category: 'Executive Access'
  },
  {
    value: 'super_admin' as PermissionLevel,
    label: 'Super Administrators',
    description: 'Highest level access - Super admins only',
    icon: Lock,
    color: 'text-gray-600 dark:text-gray-400',
    category: 'Executive Access'
  }
];

// Group options by category
const groupedOptions = permissionOptions.reduce((acc, option) => {
  if (!acc[option.category]) {
    acc[option.category] = [];
  }
  acc[option.category].push(option);
  return acc;
}, {} as Record<string, typeof permissionOptions>);

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  showHelp = true
}) => {
  const selectedOption = permissionOptions.find(opt => opt.value === value);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Permission Level</label>
        {showHelp && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Higher roles inherit lower permissions</span>
          </div>
        )}
      </div>

      <Select
        value={value}
        onValueChange={(val) => onChange(val as PermissionLevel)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedOption && (
              <div className="flex items-center gap-2">
                <selectedOption.icon className={`h-4 w-4 ${selectedOption.color}`} />
                <span>{selectedOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-[400px]">
          {Object.entries(groupedOptions).map(([category, options]) => (
            <SelectGroup key={category}>
              <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                {category}
              </SelectLabel>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-3 py-1">
                    <option.icon className={`h-5 w-5 ${option.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {selectedOption && (
        <p className="text-xs text-muted-foreground">
          {selectedOption.description}
        </p>
      )}
    </div>
  );
};

export default PermissionSelector;

