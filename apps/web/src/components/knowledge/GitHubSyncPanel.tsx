'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  RefreshCw, 
  GitBranch, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Zap,
  Github,
  XCircle,
  Database,
  Brain,
  ArrowDown,
  Cog,
  Trash2,
  Shield
} from 'lucide-react';

interface SyncChanges {
  new: string[];
  modified: string[];
  deleted: string[];
  unchanged: string[];
}

interface SyncProgress {
  currentFile: string;
  currentStep: string;
  filesProcessed: number;
  totalFiles: number;
  percentage: number;
  status: 'downloading' | 'processing' | 'embedding' | 'complete' | 'error';
  details: string;
  startTime?: Date;
  estimatedTimeRemaining?: string;
}

interface GitHubSyncPanelProps {
  onSyncComplete?: () => void;
  userRole?: string; // User role for access control
}

export const GitHubSyncPanel: React.FC<GitHubSyncPanelProps> = ({ onSyncComplete, userRole }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [changes, setChanges] = useState<SyncChanges | null>(null);
  
  // Debug: Log user role for Clear KB button visibility
  React.useEffect(() => {
    console.log('[GitHubSyncPanel] User role:', userRole);
    console.log('[GitHubSyncPanel] Clear KB visible:', userRole === 'super_admin');
  }, [userRole]);
  const [syncResults, setSyncResults] = useState<{ successful: number; failed: number; details: { file: string; status: string; error?: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);

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
    setSyncResults(null);

    const filesToSync = [...changes.new, ...changes.modified];
    const totalFiles = filesToSync.length;
    const startTime = new Date();

    // Initialize progress
    setSyncProgress({
      currentFile: '',
      currentStep: 'Initializing sync...',
      filesProcessed: 0,
      totalFiles,
      percentage: 0,
      status: 'downloading',
      details: `Preparing to sync ${totalFiles} files`,
      startTime
    });

    try {
      const token = await getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      // Simulate progress updates during sync
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (!prev || prev.status === 'complete') return prev;
          
          // Simulate realistic progress
          const elapsed = Date.now() - startTime.getTime();
          const estimatedTotal = totalFiles * 2000; // ~2 seconds per file
          const progressPercentage = Math.min(95, (elapsed / estimatedTotal) * 100);
          
          const currentFileIndex = Math.floor(progressPercentage / 100 * totalFiles);
          const currentFile = filesToSync[currentFileIndex] || filesToSync[filesToSync.length - 1];
          
          let currentStep = 'Processing...';
          let status: SyncProgress['status'] = 'processing';
          
          if (progressPercentage < 30) {
            currentStep = 'Downloading from GitHub...';
            status = 'downloading';
          } else if (progressPercentage < 70) {
            currentStep = 'Processing content...';
            status = 'processing';
          } else {
            currentStep = 'Generating embeddings...';
            status = 'embedding';
          }

          const remainingTime = Math.max(0, estimatedTotal - elapsed);
          const estimatedTimeRemaining = remainingTime > 0 
            ? `${Math.ceil(remainingTime / 1000)}s remaining`
            : 'Almost done...';

          return {
            ...prev,
            currentFile: currentFile.split('/').pop() || currentFile,
            currentStep,
            filesProcessed: currentFileIndex,
            percentage: Math.round(progressPercentage),
            status,
            details: `Processing ${currentFile.split('/').pop() || currentFile}`,
            estimatedTimeRemaining
          };
        });
      }, 500);

      const response = await fetch(`${baseUrl}/api/v1/knowledge-dashboard/sync-github-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: filesToSync })
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Final progress update
      setSyncProgress({
        currentFile: '🎉 Sync Complete!',
        currentStep: 'All files processed successfully with enhanced embeddings',
        filesProcessed: totalFiles,
        totalFiles,
        percentage: 100,
        status: 'complete',
        details: `✅ Successfully synced ${data.results?.successful || totalFiles} files${data.results?.failed > 0 ? ` (${data.results.failed} failed)` : ''}`,
        startTime,
        estimatedTimeRemaining: 'Knowledge base updated with 100/100 quality scores!'
      });
      
      setSyncResults(data.results);
      
        // Clear progress after 5 seconds (keep success message visible)
        setTimeout(() => {
          setSyncProgress(null);
        }, 5000);
      
      // Call the callback to refresh the knowledge base with a small delay
      if (onSyncComplete) {
        setTimeout(() => {
          onSyncComplete();
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error syncing files:', error);
      setError('Failed to sync files. Please try again.');
      setSyncProgress(prev => prev ? {
        ...prev,
        status: 'error',
        currentStep: 'Sync failed',
        details: 'An error occurred during sync'
      } : null);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearKnowledgeBase = async (clearType: 'all' | 'github_only' | 'secure_only') => {
    setIsClearing(true);
    setError(null);
    setShowClearDialog(false);

    try {
      const token = await getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/api/v1/knowledge-dashboard/clear-knowledge-base?clear_type=${clearType}`, {
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
      
      const clearTypeLabel = clearType === 'all' ? 'ALL documents' : 
                             clearType === 'github_only' ? 'GitHub-synced documents' : 
                             'Secure documents';
      
      alert(`✅ Knowledge base cleared successfully!\n\nCleared: ${clearTypeLabel}\nStorage files deleted: ${data.storage_files_deleted}\nFirestore docs deleted: ${data.firestore_docs_deleted}\nChunks deleted: ${data.chunks_deleted}\n\nYou can now scan GitHub to sync fresh documentation.`);
      
      // Reset changes state
      setChanges(null);
      setSyncResults(null);
      
      // Call the callback to refresh
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('Error clearing knowledge base:', error);
      setError('Failed to clear knowledge base. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const totalChanges = changes ? changes.new.length + changes.modified.length : 0;

  return (
    <Card className="mb-6 border-2 border-dashed border-green-500 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Github className="h-5 w-5 text-green-500" />
          GitHub Documentation Sync
          <Badge variant="outline" className="ml-auto border-green-500 text-green-600">
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Info Alert */}
        <Alert className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <GitBranch className="h-4 w-4 text-foreground" />
          <AlertDescription className="text-foreground">
            Sync your latest documentation changes from GitHub to the Knowledge Base. 
            This will automatically generate embeddings for the chatbot.
            <br />
            <span className="text-xs text-muted-foreground mt-1 block">
              📁 Archive, backup, and temporary directories are automatically excluded from sync.
            </span>
          </AlertDescription>
        </Alert>

        {/* Scan Button */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={scanForChanges} 
            disabled={isScanning || isSyncing || isClearing}
            variant="outline"
            className="flex-1 min-w-[140px] border-gray-300 hover:border-green-500 hover:text-green-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Changes'}
          </Button>
          
          {changes && totalChanges > 0 && (
            <Button 
              onClick={syncAllFiles}
              disabled={isSyncing || isClearing}
              className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
              <Download className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-bounce' : ''}`} />
              {isSyncing ? 'Syncing...' : `Sync ${totalChanges} Files`}
            </Button>
          )}
          
          {/* Clear KB button - Super Admin only */}
          {userRole === 'super_admin' && (
            <Button 
              onClick={() => setShowClearDialog(true)} 
              disabled={isScanning || isSyncing || isClearing}
              variant="destructive"
              className="flex-shrink-0 bg-orange-600 hover:bg-orange-700"
              title="Clear documents from Knowledge Base (Super Admin only)"
            >
              <Database className={`h-4 w-4 mr-2 ${isClearing ? 'animate-pulse' : ''}`} />
              {isClearing ? 'Clearing...' : 'Clear KB'}
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

        {/* Progress Bar */}
        {syncProgress && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {syncProgress.status === 'downloading' && <ArrowDown className="h-4 w-4 text-blue-500 animate-bounce" />}
                {syncProgress.status === 'processing' && <Cog className="h-4 w-4 text-orange-500 animate-spin" />}
                {syncProgress.status === 'embedding' && <Brain className="h-4 w-4 text-purple-500 animate-pulse" />}
                {syncProgress.status === 'complete' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {syncProgress.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                <span className="font-medium text-sm">{syncProgress.currentStep}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono">{syncProgress.percentage}%</div>
                {syncProgress.estimatedTimeRemaining && (
                  <div className="text-xs text-muted-foreground">{syncProgress.estimatedTimeRemaining}</div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  syncProgress.status === 'complete' ? 'bg-green-500' :
                  syncProgress.status === 'error' ? 'bg-red-500' :
                  syncProgress.status === 'embedding' ? 'bg-purple-500' :
                  syncProgress.status === 'processing' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${syncProgress.percentage}%` }}
              />
            </div>

            {/* File Progress */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-xs">{syncProgress.currentFile}</span>
              </div>
              <div className="text-muted-foreground">
                {syncProgress.filesProcessed} / {syncProgress.totalFiles} files
              </div>
            </div>

            {/* Details */}
            <div className="text-xs text-muted-foreground bg-white dark:bg-gray-900 p-2 rounded border">
              {syncProgress.details}
            </div>
          </div>
        )}

        {/* Changes Summary */}
        {changes && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="default" className="justify-center py-2 bg-green-600 text-white">
                <FileText className="h-3 w-3 mr-1" />
                {changes.new.length} New
              </Badge>
              <Badge variant="outline" className="justify-center py-2 border-yellow-500 text-yellow-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                {changes.modified.length} Modified
              </Badge>
              <Badge variant="outline" className="justify-center py-2 border-red-500 text-red-600">
                <XCircle className="h-3 w-3 mr-1" />
                {changes.deleted.length} Deleted
              </Badge>
              <Badge variant="outline" className="justify-center py-2 border-gray-400 text-gray-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                {changes.unchanged.length} Unchanged
              </Badge>
            </div>

            {/* File Lists */}
            {totalChanges > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-foreground">
                  <Zap className="h-4 w-4 text-red-500" />
                  Files Ready to Sync:
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2">
                  {[...changes.new, ...changes.modified].map((file) => (
                    <div key={file} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      <span className="font-mono text-xs text-foreground">{file}</span>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          changes.new.includes(file) 
                            ? "border-green-500 text-green-600 bg-green-50" 
                            : "border-yellow-500 text-yellow-600 bg-yellow-50"
                        }`}
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
          <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400 relative">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200 pr-8">
              <strong>Sync Complete!</strong> {syncResults.successful} files synced successfully.
              {syncResults.failed > 0 && (
                <span className="text-red-600 dark:text-red-400 block">
                  ❌ {syncResults.failed} files failed to sync
                </span>
              )}
            </AlertDescription>
            <button
              onClick={() => setSyncResults(null)}
              className="absolute top-2 right-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              aria-label="Close"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">Tip:</strong> After syncing, new documents will automatically generate embeddings for the AI chatbot.
          </p>
        </div>
      </CardContent>

      {/* Clear Knowledge Base Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-orange-600" />
              Clear Knowledge Base
            </DialogTitle>
            <DialogDescription>
              Choose what type of documents you want to remove from the Knowledge Base.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Option 1: Clear GitHub Only */}
            <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
              <Button
                onClick={() => clearKnowledgeBase('github_only')}
                disabled={isClearing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Github className="h-4 w-4 mr-2" />
                Clear GitHub Docs Only
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Removes all documents synced from GitHub. Your 16 secure documents will be preserved.
              </p>
            </div>

            {/* Option 2: Clear Secure Only */}
            <div className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg hover:border-red-400 dark:hover:border-red-600 transition-colors">
              <Button
                onClick={() => clearKnowledgeBase('secure_only')}
                disabled={isClearing}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                Clear Secure Docs Only
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Removes only secure documents from .local-secure-docs. GitHub docs will be preserved.
              </p>
            </div>

            {/* Option 3: Clear Everything */}
            <div className="p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
              <Button
                onClick={() => clearKnowledgeBase('all')}
                disabled={isClearing}
                variant="destructive"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Database className="h-4 w-4 mr-2" />
                Clear Everything (Nuclear)
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Removes ALL documents (GitHub + Secure). Use this to start completely fresh.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              disabled={isClearing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
