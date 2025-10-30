/**
 * PermissionToggle Component
 * Toggle switches for document privacy and visibility settings
 * Includes public/private toggle and additional permission controls
 */

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Lock, Unlock, Eye, EyeOff, Users, Building } from 'lucide-react';

interface PermissionToggleProps {
  isPrivate: boolean;
  onPrivateChange: (isPrivate: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const PermissionToggle: React.FC<PermissionToggleProps> = ({
  isPrivate,
  onPrivateChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Public/Private Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="flex items-start gap-3 flex-1">
          {isPrivate ? (
            <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
          ) : (
            <Unlock className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          )}
          <div className="flex-1">
            <Label 
              htmlFor="privacy-toggle" 
              className="text-sm font-semibold cursor-pointer"
            >
              {isPrivate ? 'Private Document' : 'Public Document'}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {isPrivate 
                ? 'Only users with appropriate permissions can access this document'
                : 'Document visibility is determined by permission level setting'
              }
            </p>
          </div>
        </div>
        <Switch
          id="privacy-toggle"
          checked={isPrivate}
          onCheckedChange={onPrivateChange}
          disabled={disabled}
          className="ml-4"
        />
      </div>

      {/* Additional Info */}
      {isPrivate && (
        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
          <div className="flex items-start gap-2">
            <EyeOff className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-orange-800 dark:text-orange-300">
                Private Document Settings
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                This document will be hidden from public view and search results. 
                Access is restricted to users with explicit permission.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isPrivate && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-green-800 dark:text-green-300">
                Document Visibility
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                Document visibility is controlled by the permission level. 
                Users with matching or higher roles can access this document.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface VisibilityScopeToggleProps {
  scope: 'global' | 'shelter' | 'organization' | null;
  onScopeChange: (scope: 'global' | 'shelter' | 'organization' | null) => void;
  disabled?: boolean;
  className?: string;
}

export const VisibilityScopeToggle: React.FC<VisibilityScopeToggleProps> = ({
  scope,
  onScopeChange,
  disabled = false,
  className = ''
}) => {
  const scopes = [
    { value: 'global' as const, label: 'Global', icon: Users, description: 'Available across entire platform' },
    { value: 'shelter' as const, label: 'Shelter', icon: Building, description: 'Limited to specific shelter' },
    { value: 'organization' as const, label: 'Organization', icon: Building, description: 'Limited to organization' }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">Visibility Scope</Label>
      <div className="grid grid-cols-3 gap-2">
        {scopes.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onScopeChange(s.value)}
            disabled={disabled}
            className={`
              p-3 rounded-lg border-2 transition-all text-left
              ${scope === s.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{s.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PermissionToggle;

