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
export function buildFolderTree(documents: KnowledgeDocument[]): FolderNode[] {
  const folderMap = new Map<string, FolderNode>();
  
  // Define category display metadata (icons and descriptions)
  const categoryMetadata: Record<string, { icon: string; description: string; order: number }> = {
    'Platform': { icon: '📋', description: 'Project introduction and goals', order: 1 },
    'Architecture': { icon: '🏗️', description: 'Technical system design', order: 2 },
    'API': { icon: '🔌', description: 'API documentation', order: 3 },
    'Features': { icon: '✨', description: 'Feature documentation', order: 4 },
    'Development': { icon: '💻', description: 'Development guides', order: 5 },
    'Deployment': { icon: '🚀', description: 'Deployment guides', order: 6 },
    'Operations': { icon: '⚙️', description: 'Operations and maintenance', order: 7 },
    'User Guides': { icon: '👥', description: 'User documentation', order: 8 },
    'Guides': { icon: '📖', description: 'How-to guides', order: 9 },
    'Reference': { icon: '📚', description: 'Technical reference', order: 10 },
    'Integrations': { icon: '🔗', description: 'Third-party integrations', order: 11 },
    'Products': { icon: '🌐', description: 'Ecosystem and products', order: 12 },
    'Resources': { icon: '🎯', description: 'Templates and resources', order: 13 },
    'Archive': { icon: '📦', description: 'Archived documents', order: 99 },
    'Documentation': { icon: '📄', description: 'General documentation', order: 100 }
  };

  // First pass: Dynamically discover all categories from documents
  const categoriesInUse = new Set<string>();
  documents.forEach(doc => {
    if (doc.category) {
      categoriesInUse.add(doc.category);
    }
  });

  // Create folder nodes for each category that has documents
  const rootFolders: FolderNode[] = [];
  categoriesInUse.forEach(category => {
    const metadata = categoryMetadata[category] || { icon: '📁', description: category, order: 50 };
    const node: FolderNode = {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: `${metadata.icon} ${category}`,
      path: category.toLowerCase().replace(/\s+/g, '-'),
      type: 'folder',
      children: [],
      documentCount: 0
    };
    folderMap.set(category, node);
    rootFolders.push(node);
  });

  // Sort folders by order
  rootFolders.sort((a, b) => {
    const aCategory = a.name.replace(/^[^\s]+\s/, ''); // Remove emoji
    const bCategory = b.name.replace(/^[^\s]+\s/, '');
    const aOrder = categoryMetadata[aCategory]?.order || 50;
    const bOrder = categoryMetadata[bCategory]?.order || 50;
    return aOrder - bOrder;
  });

  // Add documents to appropriate folders based on their category
  documents.forEach(doc => {
    // Use the document's category field to assign it to the correct folder
    const category = doc.category || 'Documentation';
    const folder = folderMap.get(category);
    
    if (folder) {
      // Create document node
      const docNode: FolderNode = {
        id: doc.id,
        name: doc.title || 'Untitled',
        path: doc.file_path || `${folder.path}/${doc.id}`,
        type: 'document'
      };
      folder.children!.push(docNode);
      folder.documentCount = (folder.documentCount || 0) + 1;
    } else {
      // Category not found - this shouldn't happen if sync is working correctly
      console.warn(`Document "${doc.title}" has unknown category "${category}"`);
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

/**
 * Build dual repository tree structure (GitHub + Firebase)
 * Groups documents by source and creates repository-level nodes
 */
export function buildDualRepositoryTree(documents: KnowledgeDocument[]): FolderNode[] {
  // Separate documents by source
  const githubDocs = documents.filter(d => 
    d.synced_from_github === true || 
    (!d.synced_from_github && !d.source_directory)
  );
  
  const firebaseDocs = documents.filter(d => 
    d.source_directory !== undefined && d.source_directory !== null
  );

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

  // Build Firebase repository node with secure categories
  if (firebaseDocs.length > 0) {
    const secureCategories = new Map<string, FolderNode>();
    
    // Define secure category metadata
    const secureCategoryMetadata: Record<string, { icon: string; description: string; order: number }> = {
      'founders': { icon: '💼', description: 'Founders Portal documents', order: 1 },
      'payment-rails': { icon: '💳', description: 'Payment system documentation', order: 2 },
      'platform-admin': { icon: '⚙️', description: 'Platform admin documents', order: 3 },
      'shelter-research': { icon: '🏢', description: 'Shelter research documents', order: 4 }
    };

    // Group Firebase docs by source_directory
    firebaseDocs.forEach(doc => {
      const dir = doc.source_directory || 'other';
      
      if (!secureCategories.has(dir)) {
        const metadata = secureCategoryMetadata[dir] || { icon: '🔒', description: 'Secure documents', order: 99 };
        secureCategories.set(dir, {
          id: `firebase-${dir}`,
          name: `${metadata.icon} ${dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
          path: `firebase/${dir}`,
          type: 'folder',
          source: 'firebase',
          children: [],
          documentCount: 0
        });
      }

      const category = secureCategories.get(dir)!;
      category.children!.push({
        id: doc.id,
        name: doc.title || 'Untitled',
        path: doc.file_path || `firebase/${dir}/${doc.id}`,
        type: 'document',
        source: 'firebase',
        securityLevel: doc.permission_level || 'secure'
      });
      category.documentCount = (category.documentCount || 0) + 1;
    });

    // Sort categories and their documents
    const sortedCategories = Array.from(secureCategories.values())
      .sort((a, b) => {
        const aDir = a.path.split('/')[1];
        const bDir = b.path.split('/')[1];
        const aOrder = secureCategoryMetadata[aDir]?.order || 99;
        const bOrder = secureCategoryMetadata[bDir]?.order || 99;
        return aOrder - bOrder;
      });

    sortedCategories.forEach(cat => {
      if (cat.children) {
        cat.children.sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    repositories.push({
      id: 'firebase-repository',
      name: '🔥 Firebase Secure Docs',
      path: 'firebase',
      type: 'repository',
      source: 'firebase',
      children: sortedCategories,
      documentCount: firebaseDocs.length,
      badge: 'Secure'
    });
  }

  return repositories;
}
