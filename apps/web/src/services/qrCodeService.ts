/**
 * QR Code Generation Service
 * Handles QR code generation for shelters, participants, and donations
 */

import QRCode from 'qrcode';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface QRCodeData {
  type: 'shelter' | 'participant' | 'donation';
  id: string;
  url: string;
  displayName: string;
  metadata?: Record<string, any>;
}

export interface QRCodeResult {
  qrCodeUrl: string;
  qrCodeStoragePath: string;
  publicUrl: string;
  dataUrl: string;
}

/**
 * Generate a QR code for a shelter's donation page
 */
export async function generateShelterQRCode(
  shelterId: string, 
  shelterName: string,
  options: {
    size?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  } = {}
): Promise<QRCodeResult> {
  try {
    const {
      size = 400,
      margin = 2,
      color = {
        dark: '#1f2937', // gray-800
        light: '#ffffff'
      }
    } = options;

    // Create the donation URL for this shelter
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sheltr-ai.web.app' 
      : 'http://localhost:3000';
    
    const donationUrl = `${baseUrl}/donate?shelter=${shelterId}`;

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(donationUrl, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'M'
    });

    // Convert data URL to blob
    const response = await fetch(qrDataUrl);
    const blob = await response.blob();

    // Generate filename
    const timestamp = Date.now();
    const filename = `qr-shelter-${shelterId}-${timestamp}.png`;
    const storagePath = `shelters/${shelterId}/qr-codes/${filename}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);

    // Update shelter's public config with QR code info
    const configRef = doc(db, 'shelters', shelterId, 'public_config', 'settings');
    await updateDoc(configRef, {
      qrCode: {
        url: downloadUrl,
        storagePath,
        donationUrl,
        generatedAt: new Date().toISOString(),
        type: 'donation'
      }
    });

    console.log(`✅ QR code generated for shelter: ${shelterName}`);
    console.log(`   Donation URL: ${donationUrl}`);
    console.log(`   QR Code URL: ${downloadUrl}`);

    return {
      qrCodeUrl: downloadUrl,
      qrCodeStoragePath: storagePath,
      publicUrl: donationUrl,
      dataUrl: qrDataUrl
    };

  } catch (error) {
    console.error('Error generating shelter QR code:', error);
    throw new Error(`Failed to generate QR code for shelter ${shelterName}: ${error}`);
  }
}

/**
 * Generate a QR code for a participant's profile page
 */
export async function generateParticipantQRCode(
  participantId: string,
  participantName: string,
  options: {
    size?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  } = {}
): Promise<QRCodeResult> {
  try {
    const {
      size = 300,
      margin = 2,
      color = {
        dark: '#1f2937',
        light: '#ffffff'
      }
    } = options;

    // Create the participant profile URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sheltr-ai.web.app' 
      : 'http://localhost:3000';
    
    const profileUrl = `${baseUrl}/participant/${participantId}`;

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(profileUrl, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'M'
    });

    // Convert data URL to blob
    const response = await fetch(qrDataUrl);
    const blob = await response.blob();

    // Generate filename
    const timestamp = Date.now();
    const filename = `qr-participant-${participantId}-${timestamp}.png`;
    const storagePath = `participants/${participantId}/qr-codes/${filename}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);

    // Update participant profile with QR code info
    const participantRef = doc(db, 'users', participantId);
    await updateDoc(participantRef, {
      qrCode: {
        url: downloadUrl,
        storagePath,
        profileUrl,
        generatedAt: new Date().toISOString(),
        type: 'profile'
      }
    });

    console.log(`✅ QR code generated for participant: ${participantName}`);
    console.log(`   Profile URL: ${profileUrl}`);
    console.log(`   QR Code URL: ${downloadUrl}`);

    return {
      qrCodeUrl: downloadUrl,
      qrCodeStoragePath: storagePath,
      publicUrl: profileUrl,
      dataUrl: qrDataUrl
    };

  } catch (error) {
    console.error('Error generating participant QR code:', error);
    throw new Error(`Failed to generate QR code for participant ${participantName}: ${error}`);
  }
}

/**
 * Generate QR code for direct donation to a specific participant via shelter
 */
export async function generateDonationQRCode(
  shelterId: string,
  participantId: string,
  amount?: number,
  options: {
    size?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  } = {}
): Promise<QRCodeResult> {
  try {
    const {
      size = 300,
      margin = 2,
      color = {
        dark: '#059669', // green-600
        light: '#ffffff'
      }
    } = options;

    // Create the donation URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sheltr-ai.web.app' 
      : 'http://localhost:3000';
    
    let donationUrl = `${baseUrl}/donate?shelter=${shelterId}&participant=${participantId}`;
    if (amount) {
      donationUrl += `&amount=${amount}`;
    }

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(donationUrl, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'M'
    });

    // Convert data URL to blob
    const response = await fetch(qrDataUrl);
    const blob = await response.blob();

    // Generate filename
    const timestamp = Date.now();
    const filename = `qr-donation-${shelterId}-${participantId}-${timestamp}.png`;
    const storagePath = `donations/qr-codes/${filename}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);

    console.log(`✅ QR code generated for donation`);
    console.log(`   Shelter ID: ${shelterId}, Participant ID: ${participantId}`);
    console.log(`   Donation URL: ${donationUrl}`);
    console.log(`   QR Code URL: ${downloadUrl}`);

    return {
      qrCodeUrl: downloadUrl,
      qrCodeStoragePath: storagePath,
      publicUrl: donationUrl,
      dataUrl: qrDataUrl
    };

  } catch (error) {
    console.error('Error generating donation QR code:', error);
    throw new Error(`Failed to generate donation QR code: ${error}`);
  }
}

/**
 * Get existing QR code for a shelter
 */
export async function getShelterQRCode(shelterId: string): Promise<string | null> {
  try {
    const configRef = doc(db, 'shelters', shelterId, 'public_config', 'settings');
    const configDoc = await getDoc(configRef);
    
    if (configDoc.exists()) {
      const data = configDoc.data();
      return data.qrCode?.url || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting shelter QR code:', error);
    return null;
  }
}

/**
 * Get existing QR code for a participant
 */
export async function getParticipantQRCode(participantId: string): Promise<string | null> {
  try {
    const participantRef = doc(db, 'users', participantId);
    const participantDoc = await getDoc(participantRef);
    
    if (participantDoc.exists()) {
      const data = participantDoc.data();
      return data.qrCode?.url || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting participant QR code:', error);
    return null;
  }
}

/**
 * Validate and get QR code data from URL or scan
 */
export function parseQRCodeUrl(url: string): QRCodeData | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    // Donation QR codes
    if (pathname === '/donate') {
      const shelterId = searchParams.get('shelter');
      const participantId = searchParams.get('participant');
      const amount = searchParams.get('amount');

      if (shelterId) {
        return {
          type: 'donation',
          id: shelterId,
          url,
          displayName: `Donation to Shelter ${shelterId}`,
          metadata: {
            participantId,
            amount: amount ? parseFloat(amount) : undefined
          }
        };
      }
    }

    // Participant profile QR codes
    if (pathname.startsWith('/participant/')) {
      const participantId = pathname.split('/')[2];
      if (participantId) {
        return {
          type: 'participant',
          id: participantId,
          url,
          displayName: `Participant Profile ${participantId}`
        };
      }
    }

    // Shelter page QR codes
    if (pathname.startsWith('/') && pathname !== '/' && !pathname.includes('/')) {
      const shelterSlug = pathname.substring(1);
      return {
        type: 'shelter',
        id: shelterSlug,
        url,
        displayName: `Shelter ${shelterSlug}`
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing QR code URL:', error);
    return null;
  }
}
