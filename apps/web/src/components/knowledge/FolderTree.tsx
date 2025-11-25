'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  FileText,
  Hash,
  Github,
  Shield,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { KnowledgeDocument } from '@/services/knowledgeDashboardService';

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'document' | 'repository';
  source?: 'github' | 'firebase';
  children?: FolderNode[];
  documentCount?: number;
  isExpanded?: boolean;
  icon?: string;
  badge?: string;
  securityLevel?: string;
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
  // Start with all folders collapsed by default for cleaner UI
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([])
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
    const isRepository = node.type === 'repository';

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
            isSelected && "bg-primary/10 border border-primary/20",
            level > 0 && "ml-4",
            isRepository && "font-semibold bg-muted/30 border-l-4",
            isRepository && node.source === 'github' && "border-l-green-500",
            isRepository && node.source === 'firebase' && "border-l-orange-500"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder' || node.type === 'repository') {
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
          {(node.type === 'folder' || node.type === 'repository') && hasChildren && (
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

          {/* Folder/Document/Repository Icon */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {node.type === 'repository' ? (
              node.source === 'github' ? (
                <Github className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <Shield className="h-4 w-4 text-orange-500 flex-shrink-0" />
              )
            ) : node.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className={cn(
                  "h-4 w-4 flex-shrink-0",
                  node.source === 'firebase' ? "text-orange-500" : "text-blue-500"
                )} />
              ) : (
                <Folder className={cn(
                  "h-4 w-4 flex-shrink-0",
                  node.source === 'firebase' ? "text-orange-500" : "text-blue-500"
                )} />
              )
            ) : (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                {node.securityLevel && node.securityLevel !== 'public' && (
                  <Lock className="h-3 w-3 text-orange-400 flex-shrink-0" />
                )}
              </div>
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
        {(node.type === 'folder' || node.type === 'repository') && hasChildren && isExpanded && (
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
/**
 * Build hierarchical folder tree from file paths (mirrors GitHub structure)
 * This creates an actual directory tree based on file_path, not categories
 */
export function buildFolderTree(documents: KnowledgeDocument[]): FolderNode[] {
  const root: Map<string, FolderNode> = new Map();
  
  // Helper to get or create folder node
  const getOrCreateFolder = (path: string, name: string, fullPath: string): FolderNode => {
    if (!root.has(path)) {
      root.set(path, {
        id: path,
        name: name,
        path: fullPath,
        type: 'folder',
        children: [],
        documentCount: 0
      });
    }
    return root.get(path)!;
  };

  // Process each document
  documents.forEach(doc => {
    const filePath = doc.file_path || doc.github_path || '';
    if (!filePath) {
      console.warn(`Document "${doc.title}" has no file path`);
      return;
    }

    // Split path into parts (e.g., "docs/features/chatbot/README.md" -> ["docs", "features", "chatbot", "README.md"])
    const parts = filePath.split('/').filter(p => p.length > 0);
    if (parts.length === 0) return;

    let currentPath = '';
    let currentNode: FolderNode | null = null;

    // Build folder hierarchy
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Get or create folder
      let folder = getOrCreateFolder(currentPath, part, currentPath);

      // If this is not a root folder, add it to parent's children
      if (parentPath) {
        const parent = root.get(parentPath);
        if (parent && !parent.children!.some(c => c.id === folder.id)) {
          parent.children!.push(folder);
        }
      }

      currentNode = folder;
    }

    // Add document to the last folder
    if (currentNode) {
      const docNode: FolderNode = {
        id: doc.id,
        name: parts[parts.length - 1], // Use filename
        path: filePath,
        type: 'document'
      };
      currentNode.children!.push(docNode);
      currentNode.documentCount = (currentNode.documentCount || 0) + 1;
    } else {
      // Document is at root level
      const docNode: FolderNode = {
        id: doc.id,
        name: parts[0],
        path: filePath,
        type: 'document'
      };
      root.set(filePath, docNode);
    }
  });

  // Extract root-level folders (folders with no parent)
  const rootFolders: FolderNode[] = [];
  const allPaths = Array.from(root.keys());
  
  allPaths.forEach(path => {
    // Root level = no '/' in path OR is a document at root
    if (!path.includes('/')) {
      rootFolders.push(root.get(path)!);
    }
  });

  // Sort folders and their children recursively
  const sortNode = (node: FolderNode) => {
    if (node.children) {
      // Sort: folders first, then documents, alphabetically within each group
      node.children.sort((a, b) => {
        if (a.type === 'folder' && b.type === 'document') return -1;
        if (a.type === 'document' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
      // Recursively sort children
      node.children.forEach(sortNode);
    }
  };

  rootFolders.forEach(sortNode);
  rootFolders.sort((a, b) => {
    if (a.type === 'folder' && b.type === 'document') return -1;
    if (a.type === 'document' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  console.log('🌳 Built hierarchical folder tree:', rootFolders.map(f => `${f.name} (${f.documentCount || 0} docs)`));

  return rootFolders;
}

/**
 * Build dual repository tree structure (GitHub + Firebase)
 * Groups documents by source and creates repository-level nodes
 */
export function buildDualRepositoryTree(documents: KnowledgeDocument[]): FolderNode[] {
  // Separate documents by source
  // Firebase docs are identified by having a source_directory field
  const firebaseDocs = documents.filter(d => 
    d.source_directory !== undefined && d.source_directory !== null && d.source_directory !== ''
  );
  
  // GitHub docs are everything else (synced from GitHub OR no source_directory)
  const githubDocs = documents.filter(d => 
    !d.source_directory || d.source_directory === ''
  );

  console.log('🔍 Document separation:');
  console.log(`  Firebase docs: ${firebaseDocs.length}`, firebaseDocs.map(d => ({ title: d.title, source_dir: d.source_directory })));
  console.log(`  GitHub docs: ${githubDocs.length}`);

  const repositories: FolderNode[] = [];

  // Build GitHub repository node
  if (githubDocs.length > 0) {
    const githubTree = buildFolderTree(githubDocs);
    
    // Add source to all GitHub nodes
    const addGithubSource = (node: FolderNode): FolderNode => ({
      ...node,
      source: 'github',
      children: node.children?.map(addGithubSource)
    });

    repositories.push({
      id: 'github-repository',
      name: '🐙 GitHub Repository',
      path: 'github',
      type: 'repository',
      source: 'github',
      children: githubTree.map(addGithubSource),
      documentCount: githubDocs.length,
      badge: 'Public Docs'
    });
  }

  // Build Firebase repository node with hierarchical structure from file paths
  if (firebaseDocs.length > 0) {
    // Folder icons for secure directories
    const folderIcons: Record<string, string> = {
      'dataroom': '📊',
      'fintec': '💳',
      'founders': '👑',
      'leadership': '🎯',
      'operations': '⚙️',
      'blog-posts': '📝'
    };

    // Build hierarchical tree from file_path (e.g., "secure-docs/leadership/strategy/file.md")
    const firebaseTree = buildFolderTree(firebaseDocs);
    
    // Add Firebase source and icons to all nodes
    const addFirebaseMetadata = (node: FolderNode, depth: number = 0): FolderNode => {
      const updatedNode: FolderNode = {
        ...node,
        source: 'firebase'
      };

      // Add icon to root-level folders (dataroom, fintec, etc.)
      if (depth === 1 && node.type === 'folder') {
        const folderName = node.name.toLowerCase();
        const icon = folderIcons[folderName] || '🔒';
        updatedNode.name = `${icon} ${node.name.charAt(0).toUpperCase() + node.name.slice(1)}`;
      }

      // Recursively process children
      if (node.children) {
        updatedNode.children = node.children.map(child => addFirebaseMetadata(child, depth + 1));
      }

      return updatedNode;
    };

    // The tree is wrapped in "secure-docs" folder, extract its children
    let secureDocsChildren: FolderNode[] = [];
    if (firebaseTree.length > 0 && firebaseTree[0].name === 'secure-docs') {
      secureDocsChildren = firebaseTree[0].children || [];
    } else {
      secureDocsChildren = firebaseTree;
    }

    // Add metadata to all nodes
    const enhancedChildren = secureDocsChildren.map(node => addFirebaseMetadata(node, 1));

    repositories.push({
      id: 'firebase-repository',
      name: '🔥 Firebase Secure Docs',
      path: 'firebase',
      type: 'repository',
      source: 'firebase',
      children: enhancedChildren,
      documentCount: firebaseDocs.length,
      badge: 'Secure'
    });
  }

  return repositories;
}
