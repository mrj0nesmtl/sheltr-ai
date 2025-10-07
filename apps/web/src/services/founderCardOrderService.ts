/**
 * Service for managing the order of Founder Portal Quick Access cards
 * Supports two-tier system:
 * 1. Global Default (set by Super Admin) - becomes the default for all Platform Admins
 * 2. Individual User Order (personal customization)
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface CardOrderData {
  userId: string;
  cardOrder: string[]; // Array of card IDs in desired order
  updatedAt?: unknown;
}

export interface GlobalDefaultData {
  cardOrder: string[];
  setBy: string; // Super Admin user ID
  setByName?: string;
  updatedAt?: unknown;
}

/**
 * Get the global default card order (set by Super Admin)
 */
export async function getGlobalDefaultOrder(): Promise<string[] | null> {
  try {
    const docRef = doc(db, 'founder_card_orders', 'global_default');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as GlobalDefaultData;
      console.log('📋 Global default order loaded (set by Super Admin)');
      return data.cardOrder;
    }

    console.log('📋 No global default order set yet');
    return null;
  } catch (error) {
    console.error('❌ Error fetching global default order:', error);
    return null;
  }
}

/**
 * Set the global default card order (Super Admin only)
 */
export async function setGlobalDefaultOrder(
  cardOrder: string[],
  adminUserId: string,
  adminName?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'founder_card_orders', 'global_default');
    
    const data: GlobalDefaultData = {
      cardOrder,
      setBy: adminUserId,
      setByName: adminName,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, data);
    console.log('✅ Global default order set successfully by Super Admin');
  } catch (error) {
    console.error('❌ Error setting global default order:', error);
    throw error;
  }
}

/**
 * Get the saved card order for a user
 * Falls back to global default if no personal order is set
 */
export async function getUserCardOrder(userId: string): Promise<string[] | null> {
  try {
    // First, try to get the user's personal order
    const docRef = doc(db, 'founder_card_orders', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as CardOrderData;
      console.log('✅ User personal card order loaded');
      return data.cardOrder;
    }

    // If no personal order, fall back to global default
    console.log('📋 No personal order found, checking global default...');
    return await getGlobalDefaultOrder();
  } catch (error) {
    console.error('❌ Error fetching card order:', error);
    return null;
  }
}

/**
 * Save the card order for a user
 */
export async function saveUserCardOrder(userId: string, cardOrder: string[]): Promise<void> {
  try {
    const docRef = doc(db, 'founder_card_orders', userId);
    
    const data: CardOrderData = {
      userId,
      cardOrder,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, data);
    console.log('✅ Card order saved successfully');
  } catch (error) {
    console.error('❌ Error saving card order:', error);
    throw error;
  }
}

/**
 * Reset card order to global default (or empty if no global default exists)
 * This removes the user's personal customization
 */
export async function resetUserCardOrder(userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'founder_card_orders', userId);
    await setDoc(docRef, {
      userId,
      cardOrder: [],
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Card order reset - will now use global default');
  } catch (error) {
    console.error('❌ Error resetting card order:', error);
    throw error;
  }
}

