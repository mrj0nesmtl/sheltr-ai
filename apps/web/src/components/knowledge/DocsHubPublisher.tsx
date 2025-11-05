'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';

export interface DocsHubSettings {
  published_to_hub: boolean;
  hub_category: string;
  hub_badge: string;
  hub_order: number;
  hub_slug: string;
  hub_description?: string;
  hub_audience?: string[];
  hub_topics?: string[];
  hub_icon?: string;
  external_link?: string; // GitHub or external URL instead of rendering the page
  use_external_link?: boolean; // Toggle to use external link
}

interface DocsHubPublisherProps {
  documentId?: string;
  documentTitle: string;
  currentSettings: DocsHubSettings;
  permissionLevel: string;
  onSave: (settings: DocsHubSettings) => Promise<void>;
  isLoading?: boolean;
}

const HUB_CATEGORIES = [
  { value: 'core', label: 'Core Documentation', description: 'Primary project documentation' },
  { value: 'additional', label: 'Additional Resources', description: 'Supporting materials and references' }
];

const HUB_BADGES = [
  'Strategic Vision',
  'Architecture',
  'Published',
  'Implementation',
  'Technical',
  'Enterprise',
  'Launch Plan',
  'AI System',
  'MCP System',
  'QA Framework',
  'Admin Guide',
  'Donor Guide',
  'User Guide'
];

export function DocsHubPublisher({
  documentId,
  documentTitle,
  currentSettings,
  permissionLevel,
  onSave,
  isLoading = false
}: DocsHubPublisherProps) {
  const [settings, setSettings] = useState<DocsHubSettings>(currentSettings);
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-generate slug from title if not set
  useEffect(() => {
    if (!settings.hub_slug && documentTitle) {
      const autoSlug = generateSlug(documentTitle);
      setSettings(prev => ({ ...prev, hub_slug: autoSlug }));
    }
  }, [documentTitle, settings.hub_slug]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  };

  const validateSlug = (slug: string): boolean => {
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slug || !slugPattern.test(slug)) {
      setSlugError('Slug must contain only lowercase letters, numbers, and hyphens');
      return false;
    }
    if (slug.length < 3) {
      setSlugError('Slug must be at least 3 characters long');
      return false;
    }
    setSlugError(null);
    return true;
  };

  const handlePublishToggle = (checked: boolean) => {
    setSettings(prev => ({ ...prev, published_to_hub: checked }));
    
    // Auto-generate slug if publishing and slug is empty
    if (checked && !settings.hub_slug) {
      const autoSlug = generateSlug(documentTitle);
      setSettings(prev => ({ ...prev, hub_slug: autoSlug }));
    }
  };

  const handleSave = async () => {
    if (settings.published_to_hub && !validateSlug(settings.hub_slug)) {
      return;
    }

    setSaving(true);
    setShowSuccess(false);

    try {
      await onSave(settings);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save hub settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const isPublic = permissionLevel === 'public';
  const canPublish = isPublic && documentId;
  const hubUrl = settings.hub_slug ? `https://sheltr-ai.web.app/docs/${settings.hub_slug}` : null;

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Public Documentation Hub
            </CardTitle>
            <CardDescription>
              Publish this document to the public docs hub at sheltr-ai.web.app/docs
            </CardDescription>
          </div>
          
          {settings.published_to_hub && hubUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={hubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Permission Check Alert */}
        {!isPublic && (
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Document must have "Public" permission level to be published to the docs hub.
              Change the permission level above to enable publishing.
            </AlertDescription>
          </Alert>
        )}

        {/* Publish Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="publish-toggle" className="text-base font-medium">
              Publish to Docs Hub
            </Label>
            <p className="text-sm text-muted-foreground">
              Make this document visible on the public documentation hub
            </p>
          </div>
          <Switch
            id="publish-toggle"
            checked={settings.published_to_hub}
            onCheckedChange={handlePublishToggle}
            disabled={!canPublish || isLoading}
          />
        </div>

        {/* Hub Settings (shown when publishing) */}
        {settings.published_to_hub && canPublish && (
          <div className="space-y-4 pt-4 border-t">
            {/* URL Slug */}
            <div className="space-y-2">
              <Label htmlFor="hub-slug">
                URL Slug *
                <span className="text-xs text-muted-foreground ml-2">
                  (lowercase, letters, numbers, hyphens only)
                </span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="hub-slug"
                  value={settings.hub_slug}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase();
                    setSettings(prev => ({ ...prev, hub_slug: slug }));
                    validateSlug(slug);
                  }}
                  placeholder="my-document-title"
                  className={slugError ? 'border-red-500' : ''}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const newSlug = generateSlug(documentTitle);
                    setSettings(prev => ({ ...prev, hub_slug: newSlug }));
                    validateSlug(newSlug);
                  }}
                >
                  Auto-Generate
                </Button>
              </div>
              {slugError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {slugError}
                </p>
              )}
              {hubUrl && !slugError && (
                <p className="text-sm text-muted-foreground">
                  Will be available at: <span className="font-mono text-xs">{hubUrl}</span>
                </p>
              )}
            </div>

            {/* Badge Type */}
            <div className="space-y-2">
              <Label htmlFor="hub-badge">Badge *</Label>
              <Select
                value={settings.hub_badge}
                onValueChange={(value) => setSettings(prev => ({ ...prev, hub_badge: value }))}
              >
                <SelectTrigger id="hub-badge">
                  <SelectValue placeholder="Select badge type" />
                </SelectTrigger>
                <SelectContent>
                  {HUB_BADGES.map((badge) => (
                    <SelectItem key={badge} value={badge}>
                      {badge}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="hub-category">Category *</Label>
              <Select
                value={settings.hub_category}
                onValueChange={(value) => setSettings(prev => ({ ...prev, hub_category: value }))}
              >
                <SelectTrigger id="hub-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {HUB_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex flex-col">
                        <span>{cat.label}</span>
                        <span className="text-xs text-muted-foreground">{cat.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="hub-order">
                Display Order
                <span className="text-xs text-muted-foreground ml-2">
                  (lower numbers appear first)
                </span>
              </Label>
              <Input
                id="hub-order"
                type="number"
                min="0"
                max="9999"
                value={settings.hub_order}
                onChange={(e) => setSettings(prev => ({ ...prev, hub_order: parseInt(e.target.value) || 999 }))}
              />
            </div>

            {/* Custom Description (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="hub-description">
                Custom Description (Optional)
              </Label>
              <Input
                id="hub-description"
                value={settings.hub_description || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, hub_description: e.target.value }))}
                placeholder="Leave empty to auto-generate from content"
              />
              <p className="text-xs text-muted-foreground">
                If left empty, a description will be automatically extracted from the document content
              </p>
            </div>

            {/* External Link Option */}
            <div className="space-y-4 pt-4 border-t border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="external-link-toggle" className="text-base font-medium flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                    Link to External Source (GitHub)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Instead of rendering the document, open an external link (e.g., GitHub changelog)
                  </p>
                </div>
                <Switch
                  id="external-link-toggle"
                  checked={settings.use_external_link || false}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, use_external_link: checked }))}
                />
              </div>

              {/* External URL Input */}
              {settings.use_external_link && (
                <div className="space-y-2">
                  <Label htmlFor="external-url">
                    External URL *
                  </Label>
                  <Input
                    id="external-url"
                    value={settings.external_link || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, external_link: e.target.value }))}
                    placeholder="https://github.com/username/repo/blob/main/CHANGELOG.md"
                    className="font-mono text-sm"
                  />
                  <Alert className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                    <Info className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-sm text-muted-foreground">
                      When enabled, clicking this document in the docs hub will open the external URL in a new tab instead of displaying the content on your platform.
                      Perfect for long documents like changelogs that you want to keep in GitHub.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {settings.published_to_hub 
                ? 'Document published to docs hub successfully!' 
                : 'Document unpublished from docs hub'}
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        {settings.published_to_hub && canPublish && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Published documents will appear on the public documentation hub at sheltr-ai.web.app/docs.
              Anyone can view them without authentication.
            </AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving || isLoading || !canPublish || (settings.published_to_hub && !!slugError)}
            className="flex-1"
          >
            {saving ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {settings.published_to_hub ? 'Save & Publish' : 'Save Settings'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

