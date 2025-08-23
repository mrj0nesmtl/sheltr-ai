'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  FileText,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'document';
  children?: FolderNode[];
  documentCount?: number;
  isExpanded?: boolean;
}

interface FolderTreeProps {
  folders: FolderNode[];
  selectedPath?: string;
  onFolderSelect: (path: string) => void;
  onDocumentSelect?: (documentId: string) => void;
  className?: string;
}

export function FolderTree({ 
  folders, 
  selectedPath, 
  onFolderSelect, 
  onDocumentSelect,
  className 
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['01-overview', '02-architecture', '03-api', '04-development', '05-deployment', '06-user-guides', '07-reference', '08-integrations', '09-migration', '10-resources'])
  );

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedPath === node.path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
            isSelected && "bg-primary/10 border border-primary/20",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              if (hasChildren) {
                toggleFolder(node.path);
              }
              onFolderSelect(node.path);
            } else if (onDocumentSelect) {
              onDocumentSelect(node.id);
            }
          }}
        >
          {/* Expand/Collapse Icon */}
          {node.type === 'folder' && hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.path);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* Folder/Document Icon */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {node.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )
            ) : (
              <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
            )}

            {/* Name */}
            <span className={cn(
              "text-sm truncate",
              isSelected && "font-medium text-primary"
            )}>
              {node.name}
            </span>

            {/* Document Count Badge */}
            {node.type === 'folder' && node.documentCount !== undefined && node.documentCount > 0 && (
              <Badge variant="secondary" className="h-5 text-xs ml-auto flex-shrink-0">
                <Hash className="h-3 w-3 mr-1" />
                {node.documentCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Children */}
        {node.type === 'folder' && hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-1", className)}>
      {folders.map(folder => renderNode(folder))}
    </div>
  );
}

// Helper function to build folder tree from documents
export function buildFolderTree(documents: any[]): FolderNode[] {
  const folderMap = new Map<string, FolderNode>();
  const rootFolders: FolderNode[] = [];

  // Initialize folder structure
  const folderStructure = [
    { path: '01-overview', name: '📋 Overview', description: 'Project introduction and goals' },
    { path: '02-architecture', name: '🏗️ Architecture', description: 'Technical system design' },
    { path: '03-api', name: '🔌 API', description: 'API documentation' },
    { path: '04-development', name: '💻 Development', description: 'Development guides' },
    { path: '05-deployment', name: '🚀 Deployment', description: 'Deployment guides' },
    { path: '06-user-guides', name: '👥 User Guides', description: 'User documentation' },
    { path: '07-reference', name: '📚 Reference', description: 'Technical reference' },
    { path: '08-integrations', name: '🔗 Integrations', description: 'Third-party integrations' },
    { path: '09-migration', name: '📦 Migration', description: 'Migration documentation' },
    { path: '10-resources', name: '🎯 Resources', description: 'Templates and resources' }
  ];

  // Create folder nodes
  folderStructure.forEach(folder => {
    const node: FolderNode = {
      id: folder.path,
      name: folder.name,
      path: folder.path,
      type: 'folder',
      children: [],
      documentCount: 0
    };
    folderMap.set(folder.path, node);
    rootFolders.push(node);
  });

  // Add documents to appropriate folders
  documents.forEach(doc => {
    if (doc.file_path) {
      // Extract folder from file_path 
      // Handle both formats: "knowledge-base/01-overview/README.md" and "knowledge-base/public/01-overview/README.md"
      const pathParts = doc.file_path.split('/');
      let folderPath = '';
      
      if (pathParts.length >= 3 && pathParts[1] === 'public') {
        // New format: "knowledge-base/public/01-overview/README.md" -> "01-overview"
        folderPath = pathParts[2];
      } else if (pathParts.length >= 2) {
        // Old format: "knowledge-base/01-overview/README.md" -> "01-overview"
        folderPath = pathParts[1];
      }
      
      const folder = folderMap.get(folderPath);
      
      if (folder) {
        const docNode: FolderNode = {
          id: doc.id,
          name: doc.title || 'Untitled',
          path: doc.file_path,
          type: 'document'
        };
        
        folder.children!.push(docNode);
        folder.documentCount = (folder.documentCount || 0) + 1;
      }
    }
  });

  // Sort documents within folders
  rootFolders.forEach(folder => {
    if (folder.children) {
      folder.children.sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return rootFolders;
}
