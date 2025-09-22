import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export interface NDASignature {
  userId: string;
  userEmail: string;
  userName: string;
  signature: string;
  ipAddress: string;
  userAgent: string;
  signedAt?: Date;
  documentVersion?: string;
}

export interface NDARecord extends NDASignature {
  id: string;
  signedAt: Date;
  documentVersion: string;
  auditTrail: {
    createdAt: Date;
    ipAddress: string;
    userAgent: string;
  };
}

export class NDAService {
  private static readonly COLLECTION_NAME = 'nda_agreements';
  private static readonly NOTIFICATION_COLLECTION = 'admin_notifications';
  private static readonly DOCUMENT_VERSION = '1.0.0';

  /**
   * Check if a user has signed the NDA
   */
  static async hasUserSignedNDA(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTION_NAME, userId));
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking NDA status:', error);
      return false;
    }
  }

  /**
   * Sign the NDA for a user
   */
  static async signNDA(signature: NDASignature): Promise<boolean> {
    try {
      const ndaRecord: Omit<NDARecord, 'id'> = {
        ...signature,
        signedAt: new Date(),
        documentVersion: this.DOCUMENT_VERSION,
        auditTrail: {
          createdAt: new Date(),
          ipAddress: signature.ipAddress,
          userAgent: signature.userAgent
        }
      };

      // Save NDA signature with userId as document ID
      await setDoc(doc(db, this.COLLECTION_NAME, signature.userId), {
        ...ndaRecord,
        signedAt: serverTimestamp(),
        'auditTrail.createdAt': serverTimestamp()
      });

      // Send notification to Super Admin
      await this.notifySuperAdmin(signature);

      console.log(`✅ NDA signed successfully for user: ${signature.userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Error saving NDA signature:', error);
      return false;
    }
  }

  /**
   * Get NDA record for a user
   */
  static async getNDARecord(userId: string): Promise<NDARecord | null> {
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTION_NAME, userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        signedAt: data.signedAt?.toDate() || new Date(),
        auditTrail: {
          ...data.auditTrail,
          createdAt: data.auditTrail?.createdAt?.toDate() || new Date()
        }
      } as NDARecord;
    } catch (error) {
      console.error('Error fetching NDA record:', error);
      return null;
    }
  }

  /**
   * Get all NDA records (Super Admin only)
   */
  static async getAllNDARecords(): Promise<NDARecord[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const records: NDARecord[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          ...data,
          signedAt: data.signedAt?.toDate() || new Date(),
          auditTrail: {
            ...data.auditTrail,
            createdAt: data.auditTrail?.createdAt?.toDate() || new Date()
          }
        } as NDARecord);
      });

      return records.sort((a, b) => b.signedAt.getTime() - a.signedAt.getTime());
    } catch (error) {
      console.error('Error fetching all NDA records:', error);
      return [];
    }
  }

  /**
   * Send notification to Super Admin about new NDA signature
   */
  private static async notifySuperAdmin(signature: NDASignature): Promise<void> {
    try {
      // Get all super admin users
      const superAdminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'super_admin')
      );
      
      const superAdminsSnapshot = await getDocs(superAdminsQuery);
      
      // Create notifications for each super admin
      const notifications = superAdminsSnapshot.docs.map(async (superAdminDoc) => {
        const notification = {
          type: 'nda_signed',
          title: 'NDA Agreement Signed',
          message: `Platform Administrator ${signature.userName} (${signature.userEmail}) has signed the NDA agreement.`,
          data: {
            userId: signature.userId,
            userEmail: signature.userEmail,
            userName: signature.userName,
            signedAt: new Date(),
            documentVersion: this.DOCUMENT_VERSION
          },
          recipient_id: superAdminDoc.id,
          recipient_role: 'super_admin',
          is_read: false,
          priority: 'medium',
          category: 'compliance',
          created_at: serverTimestamp(),
          expires_at: null
        };

        return addDoc(collection(db, this.NOTIFICATION_COLLECTION), notification);
      });

      await Promise.all(notifications);
      console.log(`📧 Notifications sent to ${superAdminsSnapshot.size} Super Admin(s)`);
    } catch (error) {
      console.error('❌ Error sending Super Admin notifications:', error);
    }
  }

  /**
   * Get NDA statistics (Super Admin only)
   */
  static async getNDAStatistics(): Promise<{
    totalSigned: number;
    recentSignatures: number;
    pendingAdmins: number;
  }> {
    try {
      // Get total signed NDAs
      const ndaSnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const totalSigned = ndaSnapshot.size;

      // Get signatures from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let recentSignatures = 0;
      ndaSnapshot.forEach((doc) => {
        const data = doc.data();
        const signedAt = data.signedAt?.toDate();
        if (signedAt && signedAt >= thirtyDaysAgo) {
          recentSignatures++;
        }
      });

      // Get total platform admins
      const platformAdminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'platform_admin')
      );
      const platformAdminsSnapshot = await getDocs(platformAdminsQuery);
      const totalPlatformAdmins = platformAdminsSnapshot.size;

      const pendingAdmins = Math.max(0, totalPlatformAdmins - totalSigned);

      return {
        totalSigned,
        recentSignatures,
        pendingAdmins
      };
    } catch (error) {
      console.error('Error fetching NDA statistics:', error);
      return {
        totalSigned: 0,
        recentSignatures: 0,
        pendingAdmins: 0
      };
    }
  }

  /**
   * Validate NDA signature format
   */
  static validateSignature(signature: string, userName: string): boolean {
    if (!signature || signature.trim().length < 2) {
      return false;
    }

    // Basic validation - signature should contain at least some letters
    const hasLetters = /[a-zA-Z]/.test(signature);
    if (!hasLetters) {
      return false;
    }

    // Optional: Check if signature somewhat matches the user name
    // This is a soft validation, not required
    return true;
  }

  /**
   * Get document version
   */
  static getDocumentVersion(): string {
    return this.DOCUMENT_VERSION;
  }
}
