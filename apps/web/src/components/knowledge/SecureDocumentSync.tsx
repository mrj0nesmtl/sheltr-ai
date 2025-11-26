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

      // UPDATED Nov 25, 2025: Secure docs now have chatbot_accessible: true (role-based)
      // Auto-generate embeddings after successful sync
      if (data.success && data.stats.total > 0) {
        console.log('🧠 Auto-triggering embedding generation...');
        await generateEmbeddings();
      }

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
        {/* Information Alert - UPDATED Nov 25, 2025 */}
        <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-sm text-emerald-900 dark:text-emerald-100">
            <strong>Role-Based AI Access</strong> - Syncs full content to <code className="text-xs">knowledge_documents</code> collection.
            <br />
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300 mt-1 block">
              ✅ Files uploaded to secure cloud storage. Embeddings generated for AI-powered search. Chatbot access controlled by user role & document settings.
            </span>
          </AlertDescription>
        </Alert>

        {/* Sync Categories - 6 Active Directories (Excluding: vault, development, drafts, local) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-1 mb-1">
              <FileText className="h-3 w-3 text-green-600" />
              <span className="text-xs font-semibold">Blog Posts</span>
            </div>
            <Badge className="bg-green-600 text-white text-[10px] px-1 py-0">Admin+</Badge>
          </div>

          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-1 mb-1">
              <Briefcase className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-semibold">Data Room</span>
            </div>
            <Badge className="bg-blue-600 text-white text-[10px] px-1 py-0">Investors</Badge>
          </div>

          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-1 mb-1">
              <CreditCard className="h-3 w-3 text-cyan-600" />
              <span className="text-xs font-semibold">FinTec</span>
            </div>
            <Badge className="bg-cyan-600 text-white text-[10px] px-1 py-0">Admin+</Badge>
          </div>

          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-1 mb-1">
              <Briefcase className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-semibold">Founders</span>
            </div>
            <Badge className="bg-amber-600 text-white text-[10px] px-1 py-0">Founders Only</Badge>
          </div>

          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-1 mb-1">
              <Building className="h-3 w-3 text-indigo-600" />
              <span className="text-xs font-semibold">Leadership</span>
            </div>
            <Badge className="bg-indigo-600 text-white text-[10px] px-1 py-0">Leadership+</Badge>
          </div>

          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-1 mb-1">
              <Settings className="h-3 w-3 text-orange-600" />
              <span className="text-xs font-semibold">Operations</span>
            </div>
            <Badge className="bg-orange-600 text-white text-[10px] px-1 py-0">Admin+</Badge>
          </div>
        </div>

        {/* Sync Button with 2-Stage Progress */}
        <div className="space-y-2">
          <Button
            onClick={handleSync}
            disabled={syncing || generatingEmbeddings}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stage 1/2: Syncing Documents...
              </>
            ) : generatingEmbeddings ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stage 2/2: Generating Embeddings...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Secure Documents
              </>
            )}
          </Button>
          
          {/* Progress Indicator */}
          {(syncing || generatingEmbeddings) && (
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${syncing ? 'bg-purple-600 animate-pulse' : 'bg-green-600'}`} />
                <span className={syncing ? 'font-semibold text-purple-600' : 'text-green-600'}>
                  {syncing ? 'Uploading to Firestore...' : '✓ Documents synced'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${generatingEmbeddings ? 'bg-purple-600 animate-pulse' : syncing ? 'bg-gray-400' : 'bg-green-600'}`} />
                <span className={generatingEmbeddings ? 'font-semibold text-purple-600' : syncing ? 'text-gray-400' : 'text-green-600'}>
                  {generatingEmbeddings ? 'Processing embeddings...' : syncing ? 'Waiting...' : '✓ Embeddings generated'}
                </span>
              </div>
            </div>
          )}
        </div>

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
                    ✅ <strong>Sync Complete:</strong> Documents are now in the Knowledge Base with role-based AI access. Embeddings generated for semantic search.
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

        {/* Tip - UPDATED Nov 25, 2025 */}
        <div className="text-xs text-muted-foreground">
          <strong>💡 Tip:</strong> After syncing, new documents will automatically:
          <ul className="ml-4 mt-1 space-y-0.5">
            <li>• Be added to the Knowledge Base</li>
            <li>• Generate embeddings for AI-powered search</li>
            <li>• Be accessible via chatbot based on user role:
              <ul className="ml-4 mt-0.5 space-y-0.5">
                <li>- <strong>Founders:</strong> Access founders/ docs</li>
                <li>- <strong>Leadership:</strong> Access leadership/ + founders/ docs</li>
                <li>- <strong>Platform Admin:</strong> Access operations/, fintec/, blog-posts/</li>
                <li>- <strong>Investors:</strong> Access dataroom/ docs</li>
              </ul>
            </li>
            <li>• Respect document-level permission overrides</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureDocumentSync;

