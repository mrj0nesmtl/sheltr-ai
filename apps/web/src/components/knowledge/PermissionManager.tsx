/**
 * PermissionManager Component
 * Comprehensive permission management interface
 * Combines selector, toggle, and badge components
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Info, Save, X, CheckCircle } from 'lucide-react';
import PermissionSelector from './PermissionSelector';
import PermissionBadge, { PermissionLevel } from './PermissionBadge';
import PermissionToggle, { VisibilityScopeToggle } from './PermissionToggle';

export interface PermissionSettings {
  permission_level: PermissionLevel;
  is_private: boolean;
  allowed_roles?: string[];
  visibility_scope?: 'global' | 'shelter' | 'organization' | null;
  created_by?: string;
  synced_from_github?: boolean;
  github_path?: string;
}

interface PermissionManagerProps {
  documentId?: string;
  currentSettings?: PermissionSettings;
  onSave: (settings: PermissionSettings) => Promise<void>;
  onCancel?: () => void;
  showGitHubInfo?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const PermissionManager: React.FC<PermissionManagerProps> = ({
  documentId,
  currentSettings,
  onSave,
  onCancel,
  showGitHubInfo = false,
  isLoading = false,
  className = ''
}) => {
  const [settings, setSettings] = useState<PermissionSettings>(
    currentSettings || {
      permission_level: 'public',
      is_private: false,
      visibility_scope: 'global'
    }
  );
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePermissionChange = (permission: PermissionLevel) => {
    setSettings(prev => ({ ...prev, permission_level: permission }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handlePrivateChange = (isPrivate: boolean) => {
    setSettings(prev => ({ ...prev, is_private: isPrivate }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleScopeChange = (scope: 'global' | 'shelter' | 'organization' | null) => {
    setSettings(prev => ({ ...prev, visibility_scope: scope }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save permissions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
    setHasChanges(false);
    setSaveSuccess(false);
    onCancel?.();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Document Permissions
              {settings.permission_level && (
                <PermissionBadge permission={settings.permission_level} size="sm" />
              )}
            </CardTitle>
            <CardDescription>
              Control who can access and view this document
            </CardDescription>
          </div>
          {documentId && (
            <span className="text-xs text-muted-foreground">ID: {documentId}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* GitHub Sync Info */}
        {showGitHubInfo && settings.synced_from_github && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              This document is synced from GitHub.
              {settings.github_path && (
                <span className="block mt-1 text-xs text-muted-foreground">
                  Path: {settings.github_path}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Permission Level Selector */}
        <PermissionSelector
          value={settings.permission_level}
          onChange={handlePermissionChange}
          disabled={isLoading || isSaving}
        />

        <Separator />

        {/* Privacy Toggle */}
        <PermissionToggle
          isPrivate={settings.is_private}
          onPrivateChange={handlePrivateChange}
          disabled={isLoading || isSaving}
        />

        <Separator />

        {/* Visibility Scope */}
        <VisibilityScopeToggle
          scope={settings.visibility_scope || null}
          onScopeChange={handleScopeChange}
          disabled={isLoading || isSaving}
        />

        {/* Permission Hierarchy Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Permission Hierarchy:</strong> Higher roles automatically inherit access from lower roles.
            For example, Platform Admins can access Shelter Admin documents.
          </AlertDescription>
        </Alert>

        {/* Save/Cancel Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Permissions saved successfully!</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || isSaving || !hasChanges}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Permissions
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionManager;

