# 🔄 Knowledge Base Sync System

Automated synchronization system between GitHub documentation and the SHELTR-AI Knowledge Base.

## 🎯 Sync Strategy Overview

### Current Challenge
- Documentation exists in `/docs` folder on GitHub
- Knowledge Base UI shows folder structure but missing content
- Manual upload process is inefficient for 26+ documents
- Need automatic detection of new/updated files

### Proposed Solution: Smart Sync System

## 🚀 Implementation Plan

### Phase 1: GitHub Integration API

```python
# apps/api/services/github_sync_service.py
import os
import base64
import hashlib
from typing import List, Dict, Optional
from github import Github
from datetime import datetime

class GitHubSyncService:
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.repo_name = "mrj0nesmtl/sheltr-ai"
        self.docs_path = "docs"
        self.g = Github(self.github_token)
        self.repo = self.g.get_repo(self.repo_name)
    
    async def scan_documentation_changes(self) -> Dict[str, List[str]]:
        """Scan for new, modified, or deleted documentation files"""
        changes = {
            "new": [],
            "modified": [],
            "deleted": [],
            "unchanged": []
        }
        
        # Get all markdown files from GitHub
        github_files = self._get_github_markdown_files()
        
        # Get existing knowledge documents from Firestore
        existing_docs = await self._get_existing_knowledge_docs()
        
        for file_path, file_data in github_files.items():
            existing_doc = existing_docs.get(file_path)
            
            if not existing_doc:
                changes["new"].append(file_path)
            elif self._has_content_changed(file_data, existing_doc):
                changes["modified"].append(file_path)
            else:
                changes["unchanged"].append(file_path)
        
        # Check for deleted files
        for existing_path in existing_docs.keys():
            if existing_path not in github_files:
                changes["deleted"].append(existing_path)
        
        return changes
    
    def _get_github_markdown_files(self) -> Dict[str, Dict]:
        """Recursively get all .md files from docs folder"""
        files = {}
        
        def process_contents(contents, current_path=""):
            for content in contents:
                if content.type == "dir":
                    # Skip certain directories
                    if content.name in ["legacy-migration-archived-20250822", "development_archive"]:
                        continue
                    
                    subpath = f"{current_path}/{content.name}" if current_path else content.name
                    sub_contents = self.repo.get_contents(f"{self.docs_path}/{subpath}")
                    process_contents(sub_contents, subpath)
                
                elif content.name.endswith('.md'):
                    # Skip README files except main ones
                    if content.name == "README.md" and current_path not in ["", "templates"]:
                        continue
                    
                    file_path = f"{current_path}/{content.name}" if current_path else content.name
                    files[file_path] = {
                        "content": base64.b64decode(content.content).decode('utf-8'),
                        "sha": content.sha,
                        "size": content.size,
                        "last_modified": content.last_modified,
                        "download_url": content.download_url
                    }
        
        try:
            contents = self.repo.get_contents(self.docs_path)
            process_contents(contents)
        except Exception as e:
            print(f"Error accessing GitHub repository: {e}")
        
        return files
    
    def _has_content_changed(self, github_file: Dict, existing_doc: Dict) -> bool:
        """Check if file content has changed using SHA hash"""
        existing_sha = existing_doc.get('github_sha')
        return github_file['sha'] != existing_sha
    
    async def sync_file_to_knowledge_base(self, file_path: str, file_data: Dict) -> bool:
        """Sync a single file to the knowledge base with embeddings"""
        try:
            # Extract metadata
            title = self._extract_title_from_content(file_data['content'])
            category = self._determine_category_from_path(file_path)
            
            # Create/update knowledge document
            doc_data = {
                'title': title,
                'file_path': f"knowledge-base/public/{file_path}",
                'category': category,
                'content': file_data['content'],
                'github_sha': file_data['sha'],
                'github_url': file_data['download_url'],
                'file_size': file_data['size'],
                'last_synced': datetime.utcnow(),
                'sync_source': 'github_auto',
                'status': 'processing'
            }
            
            # Save to Firestore and trigger embedding generation
            from services.knowledge_dashboard_service import knowledge_dashboard_service
            doc_id = await knowledge_dashboard_service.create_or_update_document(
                file_path, doc_data
            )
            
            # Generate embeddings
            await self._generate_embeddings_for_document(doc_id, file_data['content'])
            
            return True
            
        except Exception as e:
            print(f"Error syncing file {file_path}: {e}")
            return False
```

### Phase 2: Frontend Sync UI Component

```tsx
// apps/web/src/components/knowledge/SyncPanel.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, GitBranch, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface SyncChanges {
  new: string[];
  modified: string[];
  deleted: string[];
  unchanged: string[];
}

export const KnowledgeBaseSyncPanel: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [changes, setChanges] = useState<SyncChanges | null>(null);
  const [syncResults, setSyncResults] = useState<any>(null);

  const scanForChanges = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/v1/knowledge-dashboard/scan-github-changes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setChanges(data.changes);
    } catch (error) {
      console.error('Error scanning for changes:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const syncSelectedFiles = async (filesToSync: string[]) => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/v1/knowledge-dashboard/sync-github-files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: filesToSync })
      });
      
      const results = await response.json();
      setSyncResults(results);
      
      // Refresh the knowledge base after sync
      window.location.reload();
    } catch (error) {
      console.error('Error syncing files:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          GitHub Documentation Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Scan Button */}
        <div className="flex gap-2">
          <Button 
            onClick={scanForChanges} 
            disabled={isScanning}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Changes'}
          </Button>
        </div>

        {/* Changes Summary */}
        {changes && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="default" className="justify-center">
                <FileText className="h-3 w-3 mr-1" />
                {changes.new.length} New
              </Badge>
              <Badge variant="secondary" className="justify-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {changes.modified.length} Modified
              </Badge>
              <Badge variant="destructive" className="justify-center">
                {changes.deleted.length} Deleted
              </Badge>
              <Badge variant="outline" className="justify-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                {changes.unchanged.length} Unchanged
              </Badge>
            </div>

            {/* File Lists */}
            {(changes.new.length > 0 || changes.modified.length > 0) && (
              <div className="space-y-2">
                <h4 className="font-medium">Files to Sync:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {[...changes.new, ...changes.modified].map((file) => (
                    <div key={file} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span>{file}</span>
                      <Badge variant={changes.new.includes(file) ? "default" : "secondary"}>
                        {changes.new.includes(file) ? "New" : "Modified"}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => syncSelectedFiles([...changes.new, ...changes.modified])}
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? 'Syncing...' : `Sync ${changes.new.length + changes.modified.length} Files`}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Sync Results */}
        {syncResults && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-medium">
              ✅ Sync Complete: {syncResults.successful} files synced successfully
            </p>
            {syncResults.failed > 0 && (
              <p className="text-red-600">
                ❌ {syncResults.failed} files failed to sync
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

### Phase 3: Backend API Endpoints

```python
# apps/api/routers/knowledge_dashboard.py - Add these endpoints

@router.post("/scan-github-changes")
async def scan_github_changes(
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Scan GitHub repository for documentation changes"""
    try:
        github_service = GitHubSyncService()
        changes = await github_service.scan_documentation_changes()
        
        return {
            "success": True,
            "changes": changes,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error scanning GitHub changes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync-github-files")
async def sync_github_files(
    request: Dict[str, List[str]],
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Sync selected files from GitHub to knowledge base"""
    try:
        files_to_sync = request.get("files", [])
        github_service = GitHubSyncService()
        
        results = {
            "successful": 0,
            "failed": 0,
            "details": []
        }
        
        for file_path in files_to_sync:
            try:
                # Get file data from GitHub
                file_data = github_service.get_file_content(file_path)
                
                # Sync to knowledge base
                success = await github_service.sync_file_to_knowledge_base(file_path, file_data)
                
                if success:
                    results["successful"] += 1
                    results["details"].append({"file": file_path, "status": "success"})
                else:
                    results["failed"] += 1
                    results["details"].append({"file": file_path, "status": "failed"})
                    
            except Exception as e:
                results["failed"] += 1
                results["details"].append({"file": file_path, "status": "error", "error": str(e)})
        
        return {
            "success": True,
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error syncing GitHub files: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

## 🔄 Automated Sync Options

### Option 1: Manual Sync (Recommended for now)
- Click "Scan for Changes" button
- Review changes before syncing
- Select files to sync
- Trigger embedding generation

### Option 2: Webhook-Based Auto Sync (Future)
- GitHub webhook on documentation changes
- Automatic background sync
- Notification system for sync status

### Option 3: Scheduled Sync (Future)
- Daily/hourly sync checks
- Background processing
- Email notifications for changes

## 🎯 Immediate Action Plan

1. **Add GitHub Token** to environment variables
2. **Implement GitHubSyncService** in backend
3. **Add sync endpoints** to knowledge dashboard API
4. **Create SyncPanel component** in frontend
5. **Test with current documentation** changes

## 🔗 Related Documentation

- [Knowledge Base Update Guide](./KNOWLEDGE-BASE-UPDATE-GUIDE.md)
- [GitHub Integration](../08-integrations/github-integration.md)
- [API Reference](../07-reference/api-reference.md)
