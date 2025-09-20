/**
 * SHELTR-AI Change Tracker Component
 * Tracks document changes and displays change history in the sidebar
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  GitBranch, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Settings,
  Share2,
  Eye
} from 'lucide-react';
import { changeTrackingService, DocumentChange } from '@/services/changeTrackingService';
import { useAuth } from '@/contexts/AuthContext';

interface ChangeTrackerProps {
  documentId: string;
  documentTitle: string;
  documentPath?: string;
  onChangeDetected?: (hasChanges: boolean) => void;
}

export function ChangeTracker({ 
  documentId, 
  documentTitle, 
  documentPath,
  onChangeDetected 
}: ChangeTrackerProps) {
  const { user } = useAuth();
  const [changes, setChanges] = useState<DocumentChange[]>([]);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Load recent changes for this document
  useEffect(() => {
    loadRecentChanges();
  }, [documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRecentChanges = async () => {
    try {
      setLoading(true);
      const recentChanges = await changeTrackingService.getRecentChanges(documentId, 5);
      setChanges(recentChanges);
      
      // Check if there are pending GitHub syncs
      const hasPendingSync = recentChanges.some(change => 
        change.requires_github_sync && !change.github_sync_completed
      );
      setPendingChanges(hasPendingSync);
      onChangeDetected?.(hasPendingSync);
    } catch (error) {
      console.error('Error loading recent changes:', error);
    } finally {
      setLoading(false);
    }
  };

  // trackChange functionality is handled by the useChangeTracker hook

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'content': return <FileText className="h-3 w-3" />;
      case 'metadata': return <Settings className="h-3 w-3" />;
      case 'publishing': return <Eye className="h-3 w-3" />;
      case 'sharing': return <Share2 className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'content': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'metadata': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'publishing': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sharing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTimestamp = (timestamp: unknown) => {
    if (!timestamp) return 'Unknown time';
    
    const date = (timestamp as { toDate?: () => Date })?.toDate ? (timestamp as { toDate: () => Date }).toDate() : new Date(timestamp as string);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Note: trackChange function is available through the useChangeTracker hook

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          Change Tracking
          {pendingChanges && (
            <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Sync Needed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* GitHub Sync Status */}
        {pendingChanges && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <GitBranch className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  GitHub Update Needed
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-200 mt-1">
                  Content changes detected. Admins have been notified to update the GitHub repository.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Changes */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Recent Changes
          </h4>
          
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : changes.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No recent changes
            </p>
          ) : (
            <div className="space-y-2">
              {changes.map((change, index) => (
                <div key={change.id || index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded ${getChangeTypeColor(change.change_type)}`}>
                      {getChangeTypeIcon(change.change_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {change.change_type}
                        </Badge>
                        {change.requires_github_sync && (
                          change.github_sync_completed ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                          )
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {change.changes.length} field{change.changes.length !== 1 ? 's' : ''} changed
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {change.changed_by_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {formatTimestamp(change.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Change Details */}
                  <div className="mt-2 space-y-1">
                    {change.changes.slice(0, 2).map((fieldChange, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-medium">{fieldChange.field}:</span>
                        <span className="text-muted-foreground ml-1">
                          &quot;{String(fieldChange.old_value).substring(0, 20)}
                          {String(fieldChange.old_value).length > 20 ? '...' : ''}&quot;
                          {' → '}
                          &quot;{String(fieldChange.new_value).substring(0, 20)}
                          {String(fieldChange.new_value).length > 20 ? '...' : ''}&quot;
                        </span>
                      </div>
                    ))}
                    {change.changes.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{change.changes.length - 2} more changes
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Refresh Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadRecentChanges}
          className="w-full text-xs"
          disabled={loading}
        >
          <Clock className="h-3 w-3 mr-1" />
          {loading ? 'Loading...' : 'Refresh Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

// Export the trackChange function for external use
export const useChangeTracker = (
  documentId: string,
  documentTitle: string,
  documentPath?: string
) => {
  const { user } = useAuth();

  const trackChange = async (
    changeType: 'content' | 'metadata' | 'publishing' | 'sharing',
    changes: { field: string; old_value: unknown; new_value: unknown }[]
  ) => {
    if (!user) return;

    try {
      const requiresSync = changeTrackingService.requiresGitHubSync(changes);
      
      await changeTrackingService.trackDocumentChange({
        document_id: documentId,
        document_title: documentTitle,
        document_path: documentPath,
        change_type: changeType,
        changes,
        changed_by: user.uid,
        changed_by_name: user.displayName || 'Unknown User',
        changed_by_email: user.email || '',
        requires_github_sync: requiresSync
      });
    } catch (error) {
      console.error('Error tracking change:', error);
    }
  };

  return { trackChange };
};
