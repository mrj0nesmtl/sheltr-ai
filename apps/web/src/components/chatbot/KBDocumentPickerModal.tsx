/**
 * SHELTR-AI KB Document Picker Modal
 * Allows users to select and attach Knowledge Base documents to chat context
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Search, 
  X,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface KBDocument {
  id: string;
  title: string;
  category: string;
  file_path?: string;
  source_directory?: string;
  synced_from_github?: boolean;
  word_count?: number;
  chunk_count?: number;
}

interface KBDocumentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (documentIds: string[]) => void;
  selectedDocuments: string[];
}

export function KBDocumentPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedDocuments
}: KBDocumentPickerModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedDocuments);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setSelected(selectedDocuments);
    }
  }, [isOpen, selectedDocuments]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const userRole = user?.role || 'participant';
      const response = await fetch(`/api/v1/knowledge/list?user_role=${userRole}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDocuments(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching KB documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.file_path?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDocument = (docId: string) => {
    setSelected(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleAttach = () => {
    onSelect(selected);
    onClose();
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const getSourceBadge = (doc: KBDocument) => {
    if (doc.synced_from_github) {
      return <Badge variant="outline" className="text-xs border-purple-400 text-purple-600">GitHub</Badge>;
    } else if (doc.source_directory) {
      return <Badge variant="outline" className="text-xs border-amber-400 text-amber-600">Secure</Badge>;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Connect Knowledge Base Documents
          </DialogTitle>
          <DialogDescription className="text-sm">
            Select documents to provide focused context for your chat. The AI will prioritize these documents when answering.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, category, or path..."
            className="pl-10"
          />
        </div>

        {/* Selected Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selected.length} document{selected.length !== 1 ? 's' : ''} selected
          </span>
          {selected.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Document List */}
        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No documents match your search' : 'No documents available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => {
                const isSelected = selected.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocument(doc.id)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-border hover:border-blue-300 hover:bg-accent'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleDocument(doc.id)}
                          className="pointer-events-none"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {doc.title}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {doc.category}
                          </Badge>
                          {getSourceBadge(doc)}
                          {doc.word_count && (
                            <span className="text-xs text-muted-foreground">
                              {doc.word_count.toLocaleString()} words
                            </span>
                          )}
                          {doc.chunk_count && (
                            <span className="text-xs text-muted-foreground">
                              {doc.chunk_count} chunks
                            </span>
                          )}
                        </div>
                        
                        {doc.file_path && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {doc.file_path}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAttach}
            disabled={selected.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Attach {selected.length > 0 && `(${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

