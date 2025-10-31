'use client';

/**
 * SecureDocumentPublisher Component
 * Allows publishing Knowledge Base documents to Founders Portal and Investor Relations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Briefcase, 
  TrendingUp, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Shield,
  Eye
} from 'lucide-react';
import securePublishingService, { 
  SecurePublishingSettings,
  BadgePreset
} from '@/services/securePublishingService';

// ============================================================================
// TYPES
// ============================================================================

interface SecureDocumentPublisherProps {
  documentId: string;
  documentTitle: string;
  initialSettings?: Partial<SecurePublishingSettings>;
  onSave?: (settings: SecurePublishingSettings) => Promise<void>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SecureDocumentPublisher: React.FC<SecureDocumentPublisherProps> = ({
  documentId,
  documentTitle,
  initialSettings = {},
  onSave
}) => {
  // ============================================================================
  // STATE
  // ============================================================================

  const [settings, setSettings] = useState<SecurePublishingSettings>({
    published_to_founders: initialSettings.published_to_founders || false,
    published_to_ir: initialSettings.published_to_ir || false,
    secure_slug: initialSettings.secure_slug || securePublishingService.generateSlug(documentTitle),
    secure_badge: initialSettings.secure_badge || 'Confidential',
    secure_badge_color: initialSettings.secure_badge_color || 'blue',
    secure_icon: initialSettings.secure_icon || 'shield',
    founders_description: initialSettings.founders_description || '',
    ir_description: initialSettings.ir_description || '',
    source_directory: initialSettings.source_directory || '',
    local_file_path: initialSettings.local_file_path || '',
  });

  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [badgePresets, setBadgePresets] = useState<Record<string, BadgePreset>>({});
  const [loadingPresets, setLoadingPresets] = useState(true);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load badge presets on mount
  useEffect(() => {
    loadBadgePresets();
  }, []);

  // Check slug availability when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (settings.secure_slug) {
        checkSlugAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [settings.secure_slug]);

  // ============================================================================
  // FUNCTIONS
  // ============================================================================

  const loadBadgePresets = async () => {
    try {
      setLoadingPresets(true);
      const response = await securePublishingService.getBadgePresets();
      setBadgePresets(response.presets);
    } catch (error) {
      console.error('Failed to load badge presets:', error);
      // Set default presets if API fails
      setBadgePresets({
        'Confidential': { text: 'Confidential', color: 'red', icon: 'shield' },
        'Internal': { text: 'Internal', color: 'blue', icon: 'lock' },
        'Strategic': { text: 'Strategic', color: 'purple', icon: 'target' },
      });
    } finally {
      setLoadingPresets(false);
    }
  };

  const checkSlugAvailability = async () => {
    const validation = securePublishingService.validateSlugFormat(settings.secure_slug);
    
    if (!validation.valid) {
      setSlugError(validation.error || 'Invalid slug format');
      setSlugAvailable(false);
      return;
    }

    try {
      setSlugChecking(true);
      setSlugError('');
      
      const result = await securePublishingService.checkSlugAvailability(
        settings.secure_slug,
        documentId
      );
      
      setSlugAvailable(result.available);
      if (!result.available) {
        setSlugError(result.message);
      }
    } catch (error) {
      setSlugError('Failed to check slug availability');
      setSlugAvailable(false);
    } finally {
      setSlugChecking(false);
    }
  };

  const handleSave = async () => {
    if (!slugAvailable && (settings.published_to_founders || settings.published_to_ir)) {
      setSaveError('Please fix the slug before publishing');
      return;
    }

    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      // Publish to Founders Portal if toggled
      if (settings.published_to_founders) {
        await securePublishingService.publishToFounders(documentId, {
          published: true,
          settings: {
            ...settings,
            founders_description: settings.founders_description || documentTitle,
          }
        });
      } else if (initialSettings.published_to_founders) {
        // Unpublish if previously published
        await securePublishingService.publishToFounders(documentId, {
          published: false
        });
      }

      // Publish to Investor Relations if toggled
      if (settings.published_to_ir) {
        await securePublishingService.publishToIR(documentId, {
          published: true,
          settings: {
            ...settings,
            ir_description: settings.ir_description || documentTitle,
          }
        });
      } else if (initialSettings.published_to_ir) {
        // Unpublish if previously published
        await securePublishingService.publishToIR(documentId, {
          published: false
        });
      }

      // Call parent save handler if provided
      if (onSave) {
        await onSave(settings);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save secure publishing settings:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSlug = () => {
    const newSlug = securePublishingService.generateSlug(documentTitle);
    setSettings({ ...settings, secure_slug: newSlug });
  };

  const handleBadgeSelect = (badgeName: string) => {
    const preset = badgePresets[badgeName];
    if (preset) {
      setSettings({
        ...settings,
        secure_badge: preset.text,
        secure_badge_color: preset.color,
        secure_icon: preset.icon,
      });
    }
  };

  const isPublishing = settings.published_to_founders || settings.published_to_ir;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Card className="border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-500" />
          Secure Document Publishing
        </CardTitle>
        <CardDescription>
          Publish this document to Founders Portal or Investor Relations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Publishing Destinations */}
        <div className="space-y-4">
          {/* Founders Portal Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg border-purple-500/20">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="publish-founders" className="text-base font-medium">
                  Founders Portal
                </Label>
                <p className="text-sm text-muted-foreground">
                  Visible to Super Admins and Platform Admins only
                </p>
              </div>
            </div>
            <Switch
              id="publish-founders"
              checked={settings.published_to_founders}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, published_to_founders: checked })
              }
            />
          </div>

          {/* Investor Relations Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg border-green-500/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <Label htmlFor="publish-ir" className="text-base font-medium">
                  Investor Relations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Visible to Investors, Super Admins, and Platform Admins
                </p>
              </div>
            </div>
            <Switch
              id="publish-ir"
              checked={settings.published_to_ir}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, published_to_ir: checked })
              }
            />
          </div>
        </div>

        {/* Configuration (only show if publishing) */}
        {isPublishing && (
          <>
            {/* Slug Configuration */}
            <div className="space-y-2">
              <Label htmlFor="secure-slug">Document URL Slug *</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="secure-slug"
                    value={settings.secure_slug}
                    onChange={(e) => setSettings({ ...settings, secure_slug: e.target.value })}
                    placeholder="document-slug"
                  />
                  {slugChecking && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Checking availability...
                    </p>
                  )}
                  {!slugChecking && slugAvailable === true && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Slug is available
                    </p>
                  )}
                  {!slugChecking && slugAvailable === false && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {slugError}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSlug}
                >
                  Generate
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                URL: /secure-docs/{settings.secure_slug}
              </p>
            </div>

            {/* Badge Selection */}
            <div className="space-y-2">
              <Label htmlFor="badge-preset">Security Badge</Label>
              <Select
                value={settings.secure_badge}
                onValueChange={handleBadgeSelect}
                disabled={loadingPresets}
              >
                <SelectTrigger id="badge-preset">
                  <SelectValue placeholder="Select badge preset" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(badgePresets).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-${preset.color}-600 border-${preset.color}-400`}
                        >
                          {preset.text}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Founders Description */}
            {settings.published_to_founders && (
              <div className="space-y-2">
                <Label htmlFor="founders-description">
                  Founders Portal Description
                </Label>
                <Textarea
                  id="founders-description"
                  value={settings.founders_description}
                  onChange={(e) => setSettings({ ...settings, founders_description: e.target.value })}
                  placeholder="Brief description for Founders Portal..."
                  rows={2}
                />
              </div>
            )}

            {/* IR Description */}
            {settings.published_to_ir && (
              <div className="space-y-2">
                <Label htmlFor="ir-description">
                  Investor Relations Description
                </Label>
                <Textarea
                  id="ir-description"
                  value={settings.ir_description}
                  onChange={(e) => setSettings({ ...settings, ir_description: e.target.value })}
                  placeholder="Brief description for Investor Relations..."
                  rows={2}
                />
              </div>
            )}

            {/* Preview Card */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{documentTitle}</h4>
                  <Badge 
                    variant="outline"
                    className={`text-${settings.secure_badge_color}-600 border-${settings.secure_badge_color}-400`}
                  >
                    {settings.secure_badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {settings.published_to_founders ? settings.founders_description : settings.ir_description}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Error Messages */}
        {saveError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {saveError}
            </p>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Publishing settings saved successfully!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {settings.published_to_founders && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open('/secure-docs/founders', '_blank')}
              >
                <Briefcase className="h-4 w-4 mr-1" />
                View in Founders Portal
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
            {settings.published_to_ir && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open('/secure-docs/investor-relations', '_blank')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                View in IR
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || (isPublishing && !slugAvailable)}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Publishing Settings'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureDocumentPublisher;

