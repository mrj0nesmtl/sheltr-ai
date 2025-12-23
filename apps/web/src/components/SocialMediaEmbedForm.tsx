/**
 * Social Media Embed Form Component
 * Allows adding TikTok, X (Twitter), and YouTube videos by URL
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link as LinkIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parseSocialMediaUrl, getPlatformDisplayName, getPlatformAspectRatio, ParsedSocialMedia } from '@/lib/socialMediaParser';

interface SocialMediaEmbedFormProps {
  categories: string[];
  onSubmit: (data: EmbedFormData) => Promise<void>;
  onCancel?: () => void;
}

export interface EmbedFormData {
  // Social media fields
  embedUrl: string;
  embedType: 'tiktok' | 'twitter' | 'youtube';
  embedId: string;
  embedUsername?: string;
  
  // Standard media fields
  title: string;
  description: string;
  category: string;
  tags: string[];
  
  // Metadata
  aspectRatio: string;
  
  // Flags
  isPublic: boolean;
  isAngelsVideo: boolean;
  angelsOrder?: number;
}

export function SocialMediaEmbedForm({ categories, onSubmit, onCancel }: SocialMediaEmbedFormProps) {
  const [url, setUrl] = useState('');
  const [parsedData, setParsedData] = useState<ParsedSocialMedia | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'clips',
    tags: '',
    isPublic: true,
    isAngelsVideo: false,
    angelsOrder: 0,
  });

  // Validate URL when it changes
  useEffect(() => {
    if (!url.trim()) {
      setParsedData(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsValidating(true);
      const parsed = parseSocialMediaUrl(url);
      setParsedData(parsed);
      setIsValidating(false);
      
      // Auto-fill title if valid
      if (parsed.isValid && !formData.title) {
        const platformName = getPlatformDisplayName(parsed.platform);
        setFormData(prev => ({
          ...prev,
          title: `${platformName} Video${parsed.username ? ` by ${parsed.username}` : ''}`,
        }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parsedData || !parsedData.isValid) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const embedData: EmbedFormData = {
        embedUrl: parsedData.originalUrl,
        embedType: parsedData.platform as 'tiktok' | 'twitter' | 'youtube',
        embedId: parsedData.videoId!,
        embedUsername: parsedData.username,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        aspectRatio: getPlatformAspectRatio(parsedData.platform),
        isPublic: formData.isPublic,
        isAngelsVideo: formData.isAngelsVideo,
        angelsOrder: formData.isAngelsVideo ? formData.angelsOrder : undefined,
      };

      await onSubmit(embedData);
      
      // Reset form
      setUrl('');
      setParsedData(null);
      setFormData({
        title: '',
        description: '',
        category: 'clips',
        tags: '',
        isPublic: true,
        isAngelsVideo: false,
        angelsOrder: 0,
      });
    } catch (error) {
      console.error('Failed to submit embed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Social Media Video URL</label>
        <div className="relative">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste TikTok, X (Twitter), or YouTube link..."
            className="pr-10"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : parsedData?.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : url && parsedData && !parsedData.isValid ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        {/* Validation Feedback */}
        {parsedData && !parsedData.isValid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{parsedData.error}</AlertDescription>
          </Alert>
        )}
        
        {parsedData && parsedData.isValid && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{getPlatformDisplayName(parsedData.platform)}</strong> video detected
              {parsedData.username && <span> from <strong>{parsedData.username}</strong></span>}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Form Fields - Only show when URL is valid */}
      {parsedData && parsedData.isValid && (
        <>
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Video title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Video description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          {/* Visibility Options */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              />
              <label htmlFor="isPublic" className="text-sm font-medium">Make public</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAngelsVideo"
                checked={formData.isAngelsVideo}
                onChange={(e) => setFormData(prev => ({ ...prev, isAngelsVideo: e.target.checked }))}
              />
              <label htmlFor="isAngelsVideo" className="text-sm font-medium">
                Add to Angels Page ("Because the System is Broken")
              </label>
            </div>

            {formData.isAngelsVideo && (
              <div className="ml-6 mt-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.angelsOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, angelsOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Add Video Link
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
