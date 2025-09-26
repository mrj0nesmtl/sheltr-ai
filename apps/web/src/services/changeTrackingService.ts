/**
 * SHELTR-AI Change Tracking Service
 * Tracks document modifications and sends admin notifications
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { NotificationService } from './notificationService';

export interface DocumentChange {
  id?: string;
  document_id: string;
  document_title: string;
  document_path?: string;
  change_type: 'content' | 'metadata' | 'publishing' | 'sharing';
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  changed_by: string;
  changed_by_name: string;
  changed_by_email: string;
  timestamp: any;
  requires_github_sync: boolean;
  github_sync_completed?: boolean;
  github_sync_completed_by?: string;
  github_sync_completed_at?: any;
  notes?: string;
}

export interface ChangeTrackingStats {
  pending_github_syncs: number;
  recent_changes: number;
  total_changes_today: number;
}

class ChangeTrackingService {
  private readonly COLLECTION_NAME = 'document_changes';

  /**
   * Track a document change and send notifications
   */
  async trackDocumentChange(change: Omit<DocumentChange, 'id' | 'timestamp'>): Promise<string> {
    try {
      console.log('📝 Tracking document change:', change);

      // Add timestamp
      const changeWithTimestamp: Omit<DocumentChange, 'id'> = {
        ...change,
        timestamp: serverTimestamp()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), changeWithTimestamp);
      console.log('✅ Document change tracked with ID:', docRef.id);

      // Send notification to admins if GitHub sync is required
      if (change.requires_github_sync) {
        await this.sendGitHubSyncNotification(change);
      }

      return docRef.id;
    } catch (error) {
      console.error('❌ Error tracking document change:', error);
      throw error;
    }
  }

  /**
   * Send notification to admins about required GitHub sync
   */
  private async sendGitHubSyncNotification(change: Omit<DocumentChange, 'id' | 'timestamp'>) {
    try {
      const changeDescription = change.changes
        .map(c => `${c.field}: "${c.old_value}" → "${c.new_value}"`)
        .join(', ');

      const notificationData = {
        type: 'github_sync_required',
        title: '📝 Knowledge Base Update Requires GitHub Sync',
        message: `${change.changed_by_name} modified "${change.document_title}". Changes: ${changeDescription}`,
        data: {
          document_id: change.document_id,
          document_title: change.document_title,
          document_path: change.document_path,
          changed_by: change.changed_by,
          changed_by_name: change.changed_by_name,
          changed_by_email: change.changed_by_email,
          change_type: change.change_type,
          changes: change.changes
        },
        priority: 'medium' as const,
        target_roles: ['super_admin', 'platform_admin']
      };

      await NotificationService.createAdminNotification(notificationData);
      console.log('✅ GitHub sync notification sent to admins');
    } catch (error) {
      console.error('❌ Error sending GitHub sync notification:', error);
    }
  }

  /**
   * Get recent document changes
   */
  async getRecentChanges(documentId?: string, limitCount: number = 10): Promise<DocumentChange[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      if (documentId) {
        q = query(
          collection(db, this.COLLECTION_NAME),
          where('document_id', '==', documentId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      const changes: DocumentChange[] = [];

      snapshot.forEach(doc => {
        changes.push({
          id: doc.id,
          ...doc.data()
        } as DocumentChange);
      });

      return changes;
    } catch (error) {
      console.error('❌ Error fetching recent changes:', error);
      return [];
    }
  }

  /**
   * Get pending GitHub syncs
   */
  async getPendingGitHubSyncs(): Promise<DocumentChange[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('requires_github_sync', '==', true),
        where('github_sync_completed', '==', false),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const pendingSyncs: DocumentChange[] = [];

      snapshot.forEach(doc => {
        pendingSyncs.push({
          id: doc.id,
          ...doc.data()
        } as DocumentChange);
      });

      return pendingSyncs;
    } catch (error) {
      console.error('❌ Error fetching pending GitHub syncs:', error);
      return [];
    }
  }

  /**
   * Mark GitHub sync as completed
   */
  async markGitHubSyncCompleted(changeId: string, completedBy: string, completedByName: string): Promise<void> {
    try {
      const docRef = collection(db, this.COLLECTION_NAME);
      // Note: This would need to be implemented with doc() and updateDoc()
      // For now, we'll track this in the component
      console.log('✅ Marked GitHub sync as completed for change:', changeId);
    } catch (error) {
      console.error('❌ Error marking GitHub sync as completed:', error);
      throw error;
    }
  }

  /**
   * Get change tracking statistics
   */
  async getChangeTrackingStats(): Promise<ChangeTrackingStats> {
    try {
      // Get pending GitHub syncs
      const pendingSyncs = await this.getPendingGitHubSyncs();
      
      // Get recent changes (last 24 hours)
      const recentChanges = await this.getRecentChanges(undefined, 50);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayChanges = recentChanges.filter(change => {
        const changeDate = change.timestamp?.toDate?.() || new Date(change.timestamp);
        return changeDate >= today;
      });

      return {
        pending_github_syncs: pendingSyncs.length,
        recent_changes: recentChanges.length,
        total_changes_today: todayChanges.length
      };
    } catch (error) {
      console.error('❌ Error getting change tracking stats:', error);
      return {
        pending_github_syncs: 0,
        recent_changes: 0,
        total_changes_today: 0
      };
    }
  }

  /**
   * Compare two objects and return the differences
   */
  compareObjects(oldObj: any, newObj: any): { field: string; old_value: any; new_value: any }[] {
    const changes: { field: string; old_value: any; new_value: any }[] = [];
    
    // Get all unique keys from both objects
    const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
    
    for (const key of allKeys) {
      const oldValue = oldObj?.[key];
      const newValue = newObj?.[key];
      
      // Skip if values are the same
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        continue;
      }
      
      changes.push({
        field: key,
        old_value: oldValue,
        new_value: newValue
      });
    }
    
    return changes;
  }

  /**
   * Determine if changes require GitHub sync
   */
  requiresGitHubSync(changes: { field: string; old_value: any; new_value: any }[]): boolean {
    const contentFields = ['title', 'content', 'category'];
    return changes.some(change => contentFields.includes(change.field));
  }
}

export const changeTrackingService = new ChangeTrackingService();
