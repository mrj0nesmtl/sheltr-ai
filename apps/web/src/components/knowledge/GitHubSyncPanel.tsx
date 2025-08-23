'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  GitBranch, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Zap,
  Github
} from 'lucide-react';

interface SyncChanges {
  new: string[];
  modified: string[];
  deleted: string[];
  unchanged: string[];
}

interface GitHubSyncPanelProps {
  onSyncComplete?: () => void;
}

export const GitHubSyncPanel: React.FC<GitHubSyncPanelProps> = ({ onSyncComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [changes, setChanges] = useState<SyncChanges | null>(null);
  const [syncResults, setSyncResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = async () => {
    // Get Firebase auth token
    const { auth } = await import('@/lib/firebase');
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await currentUser.getIdToken();
  };

  const scanForChanges = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/api/v1/knowledge-dashboard/scan-github-changes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setChanges(data.changes);
    } catch (error) {
      console.error('Error scanning for changes:', error);
      setError('Failed to scan for changes. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const syncAllFiles = async () => {
    if (!changes) return;
    
    setIsSyncing(true);
    setError(null);
    
    try {
      const filesToSync = [...changes.new, ...changes.modified];
      const token = await getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/api/v1/knowledge-dashboard/sync-github-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: filesToSync })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSyncResults(data.results);
      
      // Call the callback to refresh the knowledge base
      if (onSyncComplete) {
        onSyncComplete();
      }
      
    } catch (error) {
      console.error('Error syncing files:', error);
      setError('Failed to sync files. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const totalChanges = changes ? changes.new.length + changes.modified.length : 0;

  return (
    <Card className="mb-6 border-2 border-dashed border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Github className="h-5 w-5" />
          GitHub Documentation Sync
          <Badge variant="outline" className="ml-auto">
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Info Alert */}
        <Alert>
          <GitBranch className="h-4 w-4" />
          <AlertDescription>
            Sync your latest documentation changes from GitHub to the Knowledge Base. 
            This will automatically generate embeddings for the chatbot.
          </AlertDescription>
        </Alert>

        {/* Scan Button */}
        <div className="flex gap-2">
          <Button 
            onClick={scanForChanges} 
            disabled={isScanning || isSyncing}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning GitHub...' : 'Scan for Changes'}
          </Button>
          
          {changes && totalChanges > 0 && (
            <Button 
              onClick={syncAllFiles}
              disabled={isSyncing}
              className="flex-1"
            >
              <Download className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-bounce' : ''}`} />
              {isSyncing ? 'Syncing...' : `Sync ${totalChanges} Files`}
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Changes Summary */}
        {changes && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="default" className="justify-center py-2">
                <FileText className="h-3 w-3 mr-1" />
                {changes.new.length} New
              </Badge>
              <Badge variant="secondary" className="justify-center py-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                {changes.modified.length} Modified
              </Badge>
              <Badge variant="destructive" className="justify-center py-2">
                <XCircle className="h-3 w-3 mr-1" />
                {changes.deleted.length} Deleted
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                {changes.unchanged.length} Unchanged
              </Badge>
            </div>

            {/* File Lists */}
            {totalChanges > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Files Ready to Sync:
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1 bg-white rounded border p-2">
                  {[...changes.new, ...changes.modified].map((file) => (
                    <div key={file} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span className="font-mono text-xs">{file}</span>
                      <Badge 
                        variant={changes.new.includes(file) ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {changes.new.includes(file) ? "New" : "Modified"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalChanges === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>All documentation is up to date!</p>
              </div>
            )}
          </div>
        )}

        {/* Sync Results */}
        {syncResults && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Sync Complete!</strong> {syncResults.successful} files synced successfully.
              {syncResults.failed > 0 && (
                <span className="text-red-600 block">
                  ❌ {syncResults.failed} files failed to sync
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> After syncing, new documents will automatically generate embeddings for the AI chatbot.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
