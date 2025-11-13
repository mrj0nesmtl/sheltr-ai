'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowUp,
  ArrowDown,
  Save,
  RefreshCw,
  Eye,
  ExternalLink,
  Info,
  CheckCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

interface PublishedDocument {
  id: string;
  title: string;
  hub_order: number;
  hub_badge: string;
  hub_slug: string;
  published_to_hub: boolean;
}

export function DocsHubOrderManager() {
  const [documents, setDocuments] = useState<PublishedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch all published documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docsQuery = query(
        collection(db, 'knowledge_documents'),
        where('published_to_hub', '==', true)
      );
      
      const snapshot = await getDocs(docsQuery);
      const docs: PublishedDocument[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          title: data.title || 'Untitled',
          hub_order: data.hub_order || 999,
          hub_badge: data.hub_badge || 'Technical',
          hub_slug: data.hub_slug || '',
          published_to_hub: data.published_to_hub || false
        });
      });
      
      // Sort by current order
      docs.sort((a, b) => a.hub_order - b.hub_order);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', text: 'Failed to load documents' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Move document up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newDocs = [...documents];
    [newDocs[index - 1], newDocs[index]] = [newDocs[index], newDocs[index - 1]];
    setDocuments(newDocs);
  };

  // Move document down
  const moveDown = (index: number) => {
    if (index === documents.length - 1) return;
    const newDocs = [...documents];
    [newDocs[index], newDocs[index + 1]] = [newDocs[index + 1], newDocs[index]];
    setDocuments(newDocs);
  };

  // Update position directly
  const updatePosition = (index: number, newPosition: number) => {
    const pos = Math.max(1, Math.min(50, newPosition));
    const newDocs = [...documents];
    newDocs[index].hub_order = pos;
    
    // Re-sort
    newDocs.sort((a, b) => a.hub_order - b.hub_order);
    setDocuments(newDocs);
  };

  // Save all positions to Firestore
  const saveOrder = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      // Update each document with its new position (index + 1)
      const updates = documents.map(async (document, index) => {
        const position = index + 1;
        const docRef = doc(db, 'knowledge_documents', document.id);
        await updateDoc(docRef, { hub_order: position });
      });
      
      await Promise.all(updates);
      
      setMessage({ 
        type: 'success', 
        text: `✓ Successfully saved order for ${documents.length} documents!` 
      });
      
      // Refresh to get clean state
      setTimeout(() => fetchDocuments(), 1000);
    } catch (error) {
      console.error('Error saving order:', error);
      setMessage({ type: 'error', text: 'Failed to save order. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading documents...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📄 Docs Hub Display Order</span>
          <Badge variant="outline">{documents.length} Published</Badge>
        </CardTitle>
        <CardDescription>
          Drag documents to reorder them, or use the arrows and position numbers. 
          Position 1 appears first on the docs hub page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>How it works:</strong> The order you see here is the exact order visitors will see on the 
            <a href="/docs" target="_blank" className="text-blue-600 hover:underline mx-1">
              /docs page <ExternalLink className="h-3 w-3 inline" />
            </a>
            Click "Save Order" when you're done rearranging.
          </AlertDescription>
        </Alert>

        {/* Document List */}
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div 
              key={doc.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {/* Position Number */}
              <div className="flex-shrink-0 w-16">
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={doc.hub_order}
                  onChange={(e) => updatePosition(index, parseInt(e.target.value) || 1)}
                  className="text-center font-bold text-sm h-8"
                />
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{doc.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {doc.hub_badge}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Slug: {doc.hub_slug}</span>
                  <a 
                    href={`/docs/${doc.hub_slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </a>
                </div>
              </div>

              {/* Move Buttons */}
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="h-7 w-7 p-0"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveDown(index)}
                  disabled={index === documents.length - 1}
                  className="h-7 w-7 p-0"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={fetchDocuments}
            disabled={loading || saving}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={saveOrder}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </>
            )}
          </Button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Info className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

