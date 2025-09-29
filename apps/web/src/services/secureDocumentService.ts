import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Document interfaces
export interface SecureDocument {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'html' | 'text';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
  isActive: boolean;
  metadata?: {
    description?: string;
    author?: string;
    confidentialityLevel?: 'founder' | 'platform_admin' | 'internal';
    [key: string]: any;
  };
}

export interface CreateSecureDocumentData {
  title: string;
  content: string;
  type: 'markdown' | 'html' | 'text';
  category: string;
  tags?: string[];
  metadata?: {
    description?: string;
    author?: string;
    confidentialityLevel?: 'founder' | 'platform_admin' | 'internal';
    [key: string]: any;
  };
}

export interface UpdateSecureDocumentData {
  title?: string;
  content?: string;
  type?: 'markdown' | 'html' | 'text';
  category?: string;
  tags?: string[];
  metadata?: {
    description?: string;
    author?: string;
    confidentialityLevel?: 'founder' | 'platform_admin' | 'internal';
    [key: string]: any;
  };
}

/**
 * Secure Document Service
 * Handles CRUD operations for sensitive documents stored in Firestore
 * with proper authentication and authorization
 */
export class SecureDocumentService {
  
  /**
   * Get a founder document by ID
   */
  static async getFounderDocument(documentId: string): Promise<SecureDocument | null> {
    try {
      const docRef = doc(db, 'founder_documents', documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SecureDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching founder document:', error);
      throw error;
    }
  }

  /**
   * Get a platform admin document by ID
   */
  static async getPlatformAdminDocument(documentId: string): Promise<SecureDocument | null> {
    try {
      const docRef = doc(db, 'platform_admin_documents', documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SecureDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching platform admin document:', error);
      throw error;
    }
  }

  /**
   * Get all founder documents
   */
  static async getAllFounderDocuments(): Promise<SecureDocument[]> {
    try {
      const q = query(
        collection(db, 'founder_documents'),
        where('isActive', '==', true),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const documents: SecureDocument[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SecureDocument);
      });
      
      return documents;
    } catch (error) {
      console.error('Error fetching founder documents:', error);
      throw error;
    }
  }

  /**
   * Get all platform admin documents
   */
  static async getAllPlatformAdminDocuments(): Promise<SecureDocument[]> {
    try {
      const q = query(
        collection(db, 'platform_admin_documents'),
        where('isActive', '==', true),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const documents: SecureDocument[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SecureDocument);
      });
      
      return documents;
    } catch (error) {
      console.error('Error fetching platform admin documents:', error);
      throw error;
    }
  }

  /**
   * Create a new founder document
   */
  static async createFounderDocument(
    data: CreateSecureDocumentData, 
    userId: string
  ): Promise<string> {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
        lastModifiedBy: userId,
        version: 1,
        isActive: true,
        tags: data.tags || [],
        metadata: data.metadata || {}
      };

      const docRef = await addDoc(collection(db, 'founder_documents'), docData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating founder document:', error);
      throw error;
    }
  }

  /**
   * Create a new platform admin document
   */
  static async createPlatformAdminDocument(
    data: CreateSecureDocumentData, 
    userId: string
  ): Promise<string> {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
        lastModifiedBy: userId,
        version: 1,
        isActive: true,
        tags: data.tags || [],
        metadata: data.metadata || {}
      };

      const docRef = await addDoc(collection(db, 'platform_admin_documents'), docData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating platform admin document:', error);
      throw error;
    }
  }

  /**
   * Update a founder document
   */
  static async updateFounderDocument(
    documentId: string,
    data: UpdateSecureDocumentData,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, 'founder_documents', documentId);
      const currentDoc = await getDoc(docRef);
      
      if (!currentDoc.exists()) {
        throw new Error('Document not found');
      }

      const currentData = currentDoc.data();
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId,
        version: (currentData.version || 1) + 1
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating founder document:', error);
      throw error;
    }
  }

  /**
   * Update a platform admin document
   */
  static async updatePlatformAdminDocument(
    documentId: string,
    data: UpdateSecureDocumentData,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, 'platform_admin_documents', documentId);
      const currentDoc = await getDoc(docRef);
      
      if (!currentDoc.exists()) {
        throw new Error('Document not found');
      }

      const currentData = currentDoc.data();
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId,
        version: (currentData.version || 1) + 1
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating platform admin document:', error);
      throw error;
    }
  }

  /**
   * Soft delete a founder document (set isActive to false)
   */
  static async deleteFounderDocument(documentId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'founder_documents', documentId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId
      });
    } catch (error) {
      console.error('Error deleting founder document:', error);
      throw error;
    }
  }

  /**
   * Soft delete a platform admin document (set isActive to false)
   */
  static async deletePlatformAdminDocument(documentId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'platform_admin_documents', documentId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId
      });
    } catch (error) {
      console.error('Error deleting platform admin document:', error);
      throw error;
    }
  }

  /**
   * Get document by category and title (for easy lookup)
   */
  static async getDocumentBySlug(
    collection_name: 'founder_documents' | 'platform_admin_documents',
    category: string,
    slug: string
  ): Promise<SecureDocument | null> {
    try {
      const q = query(
        collection(db, collection_name),
        where('category', '==', category),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        // Create a slug from the title for comparison
        const titleSlug = data.title?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        if (titleSlug === slug) {
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as SecureDocument;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching document by slug:', error);
      throw error;
    }
  }
}

export default SecureDocumentService;
