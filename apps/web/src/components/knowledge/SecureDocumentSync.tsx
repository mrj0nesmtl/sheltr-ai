'use client';

/**
 * SecureDocumentSync Component
 * UI panel for syncing secure documents from .local-secure-docs to Firestore
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  CreditCard,
  Settings,
  FileText,
  Loader2,
  Building
} from 'lucide-react';
import { getAuth } from 'firebase/auth';

interface SyncStats {
  total: number;
  created: number;
  updated: number;
  errors: number;
}

interface SyncResult {
  success: boolean;
  message: string;
  stats: SyncStats;
  details: Array<{
    directory: string;
    file_count: number;
  }>;
}

export const SecureDocumentSync: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [generatingEmbeddings, setGeneratingEmbeddings] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [embeddingResult, setEmbeddingResult] = useState<{processed: number; failed: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = async (): Promise<string> => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return await user.getIdToken();
  };

  const generateEmbeddings = async () => {
    try {
      setGeneratingEmbeddings(true);
      const token = await getAuthToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/v1/secure-docs/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate embeddings');
      }

      const data = await response.json();
      setEmbeddingResult({
        processed: data.processed,
        failed: data.failed
      });
      
      return data;
    } catch (err) {
      console.error('Embedding generation error:', err);
      throw err;
    } finally {
      setGeneratingEmbeddings(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      setSyncResult(null);
      setEmbeddingResult(null);

      const token = await getAuthToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      // Step 1: Sync documents
      const response = await fetch(`${apiUrl}/api/v1/secure-docs/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to sync secure documents');
      }

      const data: SyncResult = await response.json();
      setSyncResult(data);

      // NOTE: Secure docs have chatbot_accessible: false, so NO embeddings are generated
      // Documents remain accessible only to Platform Admin, Leadership, Super Admin
      // if (data.success && data.stats.total > 0) {
      //   console.log('🧠 Auto-triggering embedding generation...');
      //   await generateEmbeddings();
      // }

    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sync');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-900/10 dark:to-yellow-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Secure Document Sync
              </CardTitle>
              <CardDescription>
                Sync secure document metadata from .local-secure-docs to Firestore
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-orange-400 text-orange-600">
            Beta
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Information Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <FileText className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Platform Admin Access Only</strong> - Syncs metadata to <code className="text-xs">knowledge_documents</code> collection.
            <br />
            <span className="font-mono text-xs text-blue-700 dark:text-blue-300 mt-1 block">
              ⚠️  Files remain local (NOT uploaded to cloud). No embeddings generated (chatbot cannot access).
            </span>
          </AlertDescription>
        </Alert>

        {/* Sync Categories - Only 3 Active Directories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border-2 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-semibold">FinTec</span>
              </div>
              <Badge className="bg-cyan-600 text-white text-xs">Platform Admin</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Financial technology & payment rails documentation
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold">Operations</span>
              </div>
              <Badge className="bg-orange-600 text-white text-xs">Platform Admin</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Operational procedures & workflows
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold">Platform Admin</span>
              </div>
              <Badge className="bg-red-600 text-white text-xs">Admin Only</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Platform admin system documentation
            </p>
          </div>
        </div>

        {/* Sync Button */}
        <Button
          onClick={handleSync}
          disabled={syncing || generatingEmbeddings}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {syncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing Documents...
            </>
          ) : generatingEmbeddings ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Embeddings...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Secure Documents
            </>
          )}
        </Button>

        {/* Success Result */}
        {syncResult && syncResult.success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  {syncResult.message}
                </p>
                
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-green-200">
                    <div className="font-bold text-lg text-green-600">{syncResult.stats.total}</div>
                    <div className="text-muted-foreground">Synced</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-green-200">
                    <div className="font-bold text-lg text-blue-600">{syncResult.stats.created}</div>
                    <div className="text-muted-foreground">Created</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-green-200">
                    <div className="font-bold text-lg text-purple-600">{syncResult.stats.updated}</div>
                    <div className="text-muted-foreground">Updated</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-green-200">
                    <div className="font-bold text-lg text-red-600">{syncResult.stats.errors}</div>
                    <div className="text-muted-foreground">Errors</div>
                  </div>
                </div>

                {/* Embedding Generation Status */}
                {embeddingResult && (
                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        🧠 Embedding Generation Complete
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded border border-purple-200">
                        <div className="font-bold text-lg text-purple-600">{embeddingResult.processed}</div>
                        <div className="text-muted-foreground">Processed</div>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-800 rounded border border-purple-200">
                        <div className="font-bold text-lg text-red-600">{embeddingResult.failed}</div>
                        <div className="text-muted-foreground">Failed</div>
                      </div>
                    </div>
                  </div>
                )}

                {syncResult.details && syncResult.details.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {syncResult.details.map((detail, idx) => (
                      <div key={idx} className="text-xs text-green-800 dark:text-green-200">
                        📁 <span className="font-medium">{detail.directory}</span>: {detail.file_count} files
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    ✅ <strong>Sync Complete:</strong> Document metadata is now in the Knowledge Base (Platform Admin access only).
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Result */}
        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                Sync Failed
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Tip */}
        <div className="text-xs text-muted-foreground">
          <strong>💡 Tip:</strong> After syncing, new documents will automatically:
          <ul className="ml-4 mt-1 space-y-0.5">
            <li>• Be added to the Knowledge Base</li>
            <li>• <strong>NOT</strong> generate embeddings (chatbot_accessible: false)</li>
            <li>• Remain accessible to Platform Admin, Leadership, Super Admin only</li>
            <li>• Respect permission levels automatically</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureDocumentSync;

