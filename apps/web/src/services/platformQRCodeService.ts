/**
 * Platform QR Code Service
 * 
 * Manages QR code generation, storage, and tracking for platform administrators.
 * Allows creation of trackable QR codes for public-facing website pages.
 */

import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import QRCode from 'qrcode';

export interface PlatformQRCode {
  id: string;
  name: string;
  description?: string;
  targetUrl: string;
  fullUrl: string;
  qrCodeUrl: string;
  category: 'marketing' | 'donation' | 'info' | 'event' | 'other';
  isActive: boolean;
  scanCount: number;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  lastScannedAt?: Date;
  expiresAt?: Date;
  metadata?: {
    campaign?: string;
    medium?: string;
    source?: string;
    [key: string]: any;
  };
}

export interface QRCodeStats {
  totalCodes: number;
  activeCodes: number;
  totalScans: number;
  topPerformingCodes: Array<{
    id: string;
    name: string;
    scanCount: number;
  }>;
  recentScans: Array<{
    qrCodeId: string;
    scannedAt: Date;
  }>;
}

export class PlatformQRCodeService {
  private static readonly COLLECTION = 'platform_qr_codes';
  private static readonly STORAGE_PATH = 'qr-codes/platform';
  private static readonly BASE_URL = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://sheltr-ai.web.app';

  /**
   * Generate a new QR code for a platform page
   */
  static async generateQRCode(
    data: {
      name: string;
      description?: string;
      targetUrl: string;
      category: PlatformQRCode['category'];
      expiresAt?: Date;
      metadata?: PlatformQRCode['metadata'];
    },
    createdBy: string,
    createdByName: string
  ): Promise<PlatformQRCode> {
    try {
      // Generate unique ID
      const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create trackable URL with QR code ID
      const fullUrl = `${this.BASE_URL}${data.targetUrl}?qr=${qrCodeId}`;
      
      // Generate QR code image
      const qrCodeDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });

      // Upload QR code image to Firebase Storage
      const storageRef = ref(storage, `${this.STORAGE_PATH}/${qrCodeId}.png`);
      await uploadString(storageRef, qrCodeDataUrl, 'data_url');
      const qrCodeUrl = await getDownloadURL(storageRef);

      // Create QR code document
      const qrCode: PlatformQRCode = {
        id: qrCodeId,
        name: data.name,
        description: data.description,
        targetUrl: data.targetUrl,
        fullUrl,
        qrCodeUrl,
        category: data.category,
        isActive: true,
        scanCount: 0,
        createdBy,
        createdByName,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: data.expiresAt,
        metadata: data.metadata
      };

      // Save to Firestore
      await setDoc(doc(db, this.COLLECTION, qrCodeId), {
        ...qrCode,
        createdAt: Timestamp.fromDate(qrCode.createdAt),
        updatedAt: Timestamp.fromDate(qrCode.updatedAt),
        expiresAt: qrCode.expiresAt ? Timestamp.fromDate(qrCode.expiresAt) : null
      });

      console.log('✅ Platform QR code generated:', qrCodeId);
      return qrCode;
    } catch (error) {
      console.error('❌ Error generating platform QR code:', error);
      throw error;
    }
  }

  /**
   * Get all platform QR codes
   */
  static async getAllQRCodes(): Promise<PlatformQRCode[]> {
    try {
      const qrCodesRef = collection(db, this.COLLECTION);
      const q = query(qrCodesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastScannedAt: data.lastScannedAt?.toDate(),
          expiresAt: data.expiresAt?.toDate()
        } as PlatformQRCode;
      });
    } catch (error) {
      console.error('❌ Error fetching platform QR codes:', error);
      throw error;
    }
  }

  /**
   * Get a single QR code by ID
   */
  static async getQRCode(qrCodeId: string): Promise<PlatformQRCode | null> {
    try {
      const docRef = doc(db, this.COLLECTION, qrCodeId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastScannedAt: data.lastScannedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate()
      } as PlatformQRCode;
    } catch (error) {
      console.error('❌ Error fetching QR code:', error);
      throw error;
    }
  }

  /**
   * Record a QR code scan
   */
  static async recordScan(qrCodeId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, qrCodeId);
      await updateDoc(docRef, {
        scanCount: increment(1),
        lastScannedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      console.log('✅ QR code scan recorded:', qrCodeId);
    } catch (error) {
      console.error('❌ Error recording scan:', error);
      throw error;
    }
  }

  /**
   * Update QR code details
   */
  static async updateQRCode(
    qrCodeId: string,
    updates: Partial<Pick<PlatformQRCode, 'name' | 'description' | 'isActive' | 'expiresAt' | 'metadata'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, qrCodeId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
        ...(updates.expiresAt && { expiresAt: Timestamp.fromDate(updates.expiresAt) })
      });

      console.log('✅ QR code updated:', qrCodeId);
    } catch (error) {
      console.error('❌ Error updating QR code:', error);
      throw error;
    }
  }

  /**
   * Delete a QR code
   */
  static async deleteQRCode(qrCodeId: string): Promise<void> {
    try {
      // Delete from Storage
      const storageRef = ref(storage, `${this.STORAGE_PATH}/${qrCodeId}.png`);
      try {
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn('⚠️ QR code image not found in storage:', storageError);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, this.COLLECTION, qrCodeId));

      console.log('✅ QR code deleted:', qrCodeId);
    } catch (error) {
      console.error('❌ Error deleting QR code:', error);
      throw error;
    }
  }

  /**
   * Get QR code statistics
   */
  static async getQRCodeStats(): Promise<QRCodeStats> {
    try {
      const qrCodes = await this.getAllQRCodes();

      const activeCodes = qrCodes.filter(qr => qr.isActive);
      const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0);

      const topPerforming = [...qrCodes]
        .sort((a, b) => b.scanCount - a.scanCount)
        .slice(0, 5)
        .map(qr => ({
          id: qr.id,
          name: qr.name,
          scanCount: qr.scanCount
        }));

      const recentScans = qrCodes
        .filter(qr => qr.lastScannedAt)
        .sort((a, b) => (b.lastScannedAt?.getTime() || 0) - (a.lastScannedAt?.getTime() || 0))
        .slice(0, 10)
        .map(qr => ({
          qrCodeId: qr.id,
          scannedAt: qr.lastScannedAt!
        }));

      return {
        totalCodes: qrCodes.length,
        activeCodes: activeCodes.length,
        totalScans,
        topPerformingCodes: topPerforming,
        recentScans
      };
    } catch (error) {
      console.error('❌ Error fetching QR code stats:', error);
      throw error;
    }
  }

  /**
   * Toggle QR code active status
   */
  static async toggleActive(qrCodeId: string, isActive: boolean): Promise<void> {
    try {
      await this.updateQRCode(qrCodeId, { isActive });
      console.log(`✅ QR code ${isActive ? 'activated' : 'deactivated'}:`, qrCodeId);
    } catch (error) {
      console.error('❌ Error toggling QR code status:', error);
      throw error;
    }
  }

  /**
   * Get QR codes by category
   */
  static async getQRCodesByCategory(category: PlatformQRCode['category']): Promise<PlatformQRCode[]> {
    try {
      const qrCodesRef = collection(db, this.COLLECTION);
      const q = query(
        qrCodesRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastScannedAt: data.lastScannedAt?.toDate(),
          expiresAt: data.expiresAt?.toDate()
        } as PlatformQRCode;
      });
    } catch (error) {
      console.error('❌ Error fetching QR codes by category:', error);
      throw error;
    }
  }
}

