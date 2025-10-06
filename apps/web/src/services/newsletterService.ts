/**
 * Newsletter Signup Service
 * Handles newsletter email collection and admin notifications
 */

import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface NewsletterSignup {
  email: string;
  name?: string;
  source: 'landing' | 'about' | 'team' | 'other';
  subscribed_at: Date;
  status: 'active' | 'unsubscribed';
  ip_address?: string;
  user_agent?: string;
}

const NEWSLETTER_COLLECTION = 'newsletter_signups';
const NOTIFICATIONS_COLLECTION = 'admin_notifications';

/**
 * Add a new newsletter signup
 */
export async function addNewsletterSignup(
  email: string,
  name?: string,
  source: 'landing' | 'about' | 'team' | 'other' = 'other'
): Promise<{ success: boolean; message: string; alreadyExists?: boolean }> {
  try {
    // Check if email already exists
    const existingQuery = query(
      collection(db, NEWSLETTER_COLLECTION),
      where('email', '==', email.toLowerCase())
    );
    
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      // Check if they're already subscribed
      const existingDoc = existingDocs.docs[0].data();
      if (existingDoc.status === 'active') {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter!',
          alreadyExists: true
        };
      }
      // If they were unsubscribed, we could re-subscribe them here
    }

    // Add new signup
    const signupData: NewsletterSignup = {
      email: email.toLowerCase(),
      name: name || '',
      source,
      subscribed_at: new Date(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, NEWSLETTER_COLLECTION), signupData);
    
    console.log('✅ Newsletter signup added:', docRef.id);

    // Create notification for admins
    await createAdminNotification(email, name, source);

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    };
  } catch (error) {
    console.error('❌ Error adding newsletter signup:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
}

/**
 * Create notification for platform and super admins
 */
async function createAdminNotification(
  email: string,
  name: string | undefined,
  source: string
): Promise<void> {
  try {
    const notificationData = {
      type: 'newsletter_signup',
      title: 'New Newsletter Signup',
      message: `${name || 'Someone'} (${email}) signed up for the newsletter from the ${source} page`,
      email,
      name: name || '',
      source,
      created_at: Timestamp.now(),
      read: false,
      priority: 'low',
      metadata: {
        email,
        name: name || '',
        source,
        timestamp: new Date().toISOString()
      }
    };

    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationData);
    console.log('✅ Admin notification created for newsletter signup');
  } catch (error) {
    console.error('❌ Error creating admin notification:', error);
  }
}

/**
 * Get all newsletter signups (admin only)
 */
export async function getAllNewsletterSignups(
  maxResults: number = 100
): Promise<NewsletterSignup[]> {
  try {
    const q = query(
      collection(db, NEWSLETTER_COLLECTION),
      orderBy('subscribed_at', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const signups: NewsletterSignup[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      signups.push({
        email: data.email,
        name: data.name || '',
        source: data.source,
        subscribed_at: data.subscribed_at?.toDate() || new Date(),
        status: data.status || 'active'
      });
    });

    return signups;
  } catch (error) {
    console.error('❌ Error fetching newsletter signups:', error);
    return [];
  }
}

/**
 * Get newsletter signup count
 */
export async function getNewsletterCount(): Promise<number> {
  try {
    const q = query(
      collection(db, NEWSLETTER_COLLECTION),
      where('status', '==', 'active')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('❌ Error getting newsletter count:', error);
    return 0;
  }
}

/**
 * Export newsletter emails (admin only)
 */
export async function exportNewsletterEmails(): Promise<string[]> {
  try {
    const signups = await getAllNewsletterSignups(1000);
    return signups
      .filter(signup => signup.status === 'active')
      .map(signup => signup.email);
  } catch (error) {
    console.error('❌ Error exporting newsletter emails:', error);
    return [];
  }
}

