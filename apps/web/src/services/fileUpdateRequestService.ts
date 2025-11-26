/**
 * SHELTR-AI File Update Request Service
 * Manages requests for source file updates (GitHub/Local)
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export interface FileUpdateRequest {
  id?: string;
  document_id: string;
  document_title: string;
  document_path: string;
  source_type: 'github' | 'secure_docs';
  request_type: 'content_update' | 'correction' | 'addition' | 'removal' | 'other';
  summary: string;
  details: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requested_by: string;
  requested_by_name: string;
  assigned_to?: string;
  assigned_to_name?: string;
  admin_notes?: string;
  completed_at?: Timestamp;
  rejected_reason?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

class FileUpdateRequestService {
  private collectionName = 'file_update_requests';

  /**
   * Create a new file update request
   */
  async createRequest(data: Omit<FileUpdateRequest, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      console.log('✅ File update request created:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating file update request:', error);
      throw error;
    }
  }

  /**
   * Get all requests for a specific document
   */
  async getRequestsForDocument(documentId: string): Promise<FileUpdateRequest[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('document_id', '==', documentId),
        orderBy('created_at', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FileUpdateRequest));
    } catch (error) {
      console.error('❌ Error fetching requests for document:', error);
      return [];
    }
  }

  /**
   * Get all pending requests (for admin dashboard)
   */
  async getPendingRequests(): Promise<FileUpdateRequest[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'pending'),
        orderBy('created_at', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FileUpdateRequest));
    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
      return [];
    }
  }

  /**
   * Get all requests by status
   */
  async getRequestsByStatus(status: FileUpdateRequest['status']): Promise<FileUpdateRequest[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('created_at', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FileUpdateRequest));
    } catch (error) {
      console.error('❌ Error fetching requests by status:', error);
      return [];
    }
  }

  /**
   * Get requests by user
   */
  async getRequestsByUser(userEmail: string): Promise<FileUpdateRequest[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('requested_by', '==', userEmail),
        orderBy('created_at', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FileUpdateRequest));
    } catch (error) {
      console.error('❌ Error fetching requests by user:', error);
      return [];
    }
  }

  /**
   * Update request status
   */
  async updateRequestStatus(
    requestId: string, 
    status: FileUpdateRequest['status'],
    adminEmail?: string,
    adminName?: string,
    notes?: string
  ): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {
        status,
        updated_at: serverTimestamp()
      };

      if (status === 'in_progress' && adminEmail) {
        updateData.assigned_to = adminEmail;
        updateData.assigned_to_name = adminName || adminEmail;
      }

      if (status === 'completed') {
        updateData.completed_at = serverTimestamp();
      }

      if (notes) {
        updateData.admin_notes = notes;
      }

      await updateDoc(doc(db, this.collectionName, requestId), updateData);
      console.log('✅ Request status updated:', requestId, status);
    } catch (error) {
      console.error('❌ Error updating request status:', error);
      throw error;
    }
  }

  /**
   * Reject a request
   */
  async rejectRequest(requestId: string, reason: string, adminEmail: string, adminName: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, requestId), {
        status: 'rejected',
        rejected_reason: reason,
        assigned_to: adminEmail,
        assigned_to_name: adminName,
        updated_at: serverTimestamp()
      });
      console.log('✅ Request rejected:', requestId);
    } catch (error) {
      console.error('❌ Error rejecting request:', error);
      throw error;
    }
  }

  /**
   * Get request by ID
   */
  async getRequestById(requestId: string): Promise<FileUpdateRequest | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collectionName, requestId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as FileUpdateRequest;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching request by ID:', error);
      return null;
    }
  }

  /**
   * Get request statistics
   */
  async getRequestStats(): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    rejected: number;
  }> {
    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      const requests = snapshot.docs.map(doc => doc.data() as FileUpdateRequest);

      return {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
        rejected: requests.filter(r => r.status === 'rejected').length
      };
    } catch (error) {
      console.error('❌ Error fetching request stats:', error);
      return {
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        rejected: 0
      };
    }
  }
}

export const fileUpdateRequestService = new FileUpdateRequestService();

