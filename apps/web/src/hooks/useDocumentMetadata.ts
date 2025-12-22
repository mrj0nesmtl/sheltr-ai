/**
 * useDocumentMetadata Hook
 * 
 * Fetches document metadata from Firestore knowledge_documents collection
 * for hybrid rendering approach - keeps custom TSX layouts while syncing
 * metadata (dates, versions, titles) from Knowledge Base.
 * 
 * Used by public doc pages to display always-current metadata while
 * preserving beautiful custom designs and complex elements (tables, charts).
 */

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export interface DocumentMetadata {
  title: string;
  updated_at: Date;
  created_at?: Date;
  version?: string;
  author?: string;
  status?: string;
  description?: string;
  badge?: string;
  badge_color?: string;
  category?: string;
  tags?: string[];
}

interface UseDocumentMetadataResult {
  metadata: DocumentMetadata | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch document metadata from Firestore by slug
 * 
 * @param slug - The document slug (e.g., 'hacking-homelessness')
 * @param collection_name - Firestore collection (default: 'knowledge_documents')
 * @returns Document metadata, loading state, and error
 * 
 * @example
 * ```tsx
 * const { metadata, loading } = useDocumentMetadata('hacking-homelessness');
 * 
 * if (loading) return <LoadingSpinner />;
 * 
 * return (
 *   <div>
 *     <h1>{metadata?.title}</h1>
 *     <p>Updated: {format(metadata?.updated_at, 'MMMM dd, yyyy')}</p>
 *   </div>
 * );
 * ```
 */
export function useDocumentMetadata(
  slug: string,
  collection_name: string = 'knowledge_documents'
): UseDocumentMetadataResult {
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query for document by slug
        // Try both 'slug' and 'secure_slug' fields for compatibility
        const docsQuery = query(
          collection(db, collection_name),
          where('slug', '==', slug)
        );
        
        let snapshot = await getDocs(docsQuery);
        
        // If not found by 'slug', try 'secure_slug'
        if (snapshot.empty) {
          const secureQuery = query(
            collection(db, collection_name),
            where('secure_slug', '==', slug)
          );
          snapshot = await getDocs(secureQuery);
        }
        
        if (snapshot.empty) {
          console.warn(`⚠️ Document not found with slug: ${slug}`);
          setError('Document not found');
          setLoading(false);
          return;
        }
        
        const doc = snapshot.docs[0].data();
        
        // Convert Firestore Timestamps to JavaScript Dates
        const updated_at = doc.updated_at instanceof Timestamp 
          ? doc.updated_at.toDate() 
          : new Date(doc.updated_at || Date.now());
          
        const created_at = doc.created_at instanceof Timestamp
          ? doc.created_at.toDate()
          : doc.created_at ? new Date(doc.created_at) : undefined;
        
        setMetadata({
          title: doc.title || 'Untitled Document',
          updated_at,
          created_at,
          version: doc.version,
          author: doc.author || doc.created_by,
          status: doc.status,
          description: doc.description,
          badge: doc.badge || doc.secure_badge,
          badge_color: doc.badge_color || doc.secure_badge_color,
          category: doc.category,
          tags: doc.tags || []
        });
        
        console.log(`✅ Loaded metadata for: ${doc.title} (updated: ${updated_at.toLocaleDateString()})`);
      } catch (err: any) {
        console.error('❌ Failed to fetch document metadata:', err);
        setError(err.message || 'Failed to load document metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [slug, collection_name]);

  return { metadata, loading, error };
}

/**
 * Format a date for display
 * Helper function for consistent date formatting
 */
export function formatDocumentDate(date: Date | undefined, fallback: string = 'Unknown'): string {
  if (!date) return fallback;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get badge color classes for Tailwind
 * Helper function for consistent badge styling
 */
export function getBadgeColorClasses(color?: string): string {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-500 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-500 text-white',
    emerald: 'bg-emerald-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
    teal: 'bg-teal-500 text-white',
    indigo: 'bg-indigo-500 text-white'
  };
  
  return colorMap[color?.toLowerCase() || ''] || 'bg-gray-500 text-white';
}
