/**
 * Service for managing the order of Founder Portal Quick Access cards
 * Persists card order to Firestore for each user
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface CardOrderData {
  userId: string;
  cardOrder: string[]; // Array of card IDs in desired order
  updatedAt?: any;
}

/**
 * Get the saved card order for a user
 */
export async function getUserCardOrder(userId: string): Promise<string[] | null> {
  try {
    const docRef = doc(db, 'founder_card_orders', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as CardOrderData;
      return data.cardOrder;
    }

    return null;
  } catch (error) {
    console.error('Error fetching card order:', error);
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
 * Reset card order to default (delete custom order)
 */
export async function resetUserCardOrder(userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'founder_card_orders', userId);
    await setDoc(docRef, {
      userId,
      cardOrder: [],
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Card order reset to default');
  } catch (error) {
    console.error('❌ Error resetting card order:', error);
    throw error;
  }
}

