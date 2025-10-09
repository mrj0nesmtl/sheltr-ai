import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createContactInquiryNotification } from './notificationService';

export interface NewsletterSignup {
  email: string;
  name?: string;
  source: 'landing' | 'about' | 'team' | 'other' | string;
  subscribed_at: Date;
  status: 'active' | 'unsubscribed';
  ip_address?: string;
  user_agent?: string;
}

export interface UnifiedInquiry {
  // Core fields
  name?: string;
  email: string;
  organization?: string;
  subject?: string;
  message?: string;
  
  // Inquiry classification
  inquiry_type: 'contact_form' | 'newsletter_signup' | 'partnership_waitlist' | 'investor_inquiry' | 'support_request' | 'app_notification';
  source: string; // Specific page/component source
  priority: 'low' | 'normal' | 'high';
  
  // Status tracking
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  responded: boolean;
  
  // Metadata
  user_id?: string;
  user_agent?: string;
  page_url?: string;
  referrer?: string;
  created_at: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  updated_at: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Helper function to create admin notifications for inquiries
 */
const createInquiryNotification = async (inquiryId: string, inquiry: UnifiedInquiry): Promise<void> => {
  try {
    await createContactInquiryNotification({
      inquiry_id: inquiryId,
      inquiry_type: inquiry.inquiry_type,
      sender_email: inquiry.email,
      sender_name: inquiry.name,
      subject: inquiry.subject || `${inquiry.inquiry_type} from ${inquiry.source}`,
      priority: inquiry.priority,
      source: inquiry.source
    });
  } catch (error) {
    console.error('❌ Failed to create notification (non-blocking):', error);
    // Don't throw - notification failure shouldn't block inquiry creation
  }
};

/**
 * Unified service to capture all types of inquiries and route them to Contact Inquiries dashboard
 */
export class UnifiedInquiryService {
  
  /**
   * Create a contact form inquiry (existing functionality)
   */
  static async createContactInquiry(data: {
    name: string;
    email: string;
    organization?: string;
    inquiry_type: string;
    subject: string;
    message: string;
    user_id?: string;
  }): Promise<string> {
    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email,
      organization: data.organization,
      subject: data.subject,
      message: data.message,
      inquiry_type: 'contact_form',
      source: 'contact_page',
      priority: data.inquiry_type === 'partnership' || data.inquiry_type === 'investor' ? 'high' : 'normal',
      status: 'new',
      responded: false,
      user_id: data.user_id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'contact_inquiries'), inquiry);
    
    // Create admin notification (non-blocking)
    await createInquiryNotification(docRef.id, inquiry);
    
    return docRef.id;
  }

  /**
   * Create a newsletter signup inquiry
   */
  static async createNewsletterSignup(data: {
    email: string;
    source: string;
    page: string;
    name?: string;
    user_id?: string;
  }): Promise<string> {
    // Check for duplicate newsletter signup
    const isDuplicate = await this.isNewsletterSubscriber(data.email);
    if (isDuplicate) {
      throw new Error('This email is already subscribed to our newsletter');
    }

    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email.toLowerCase(),
      subject: 'Newsletter Signup',
      message: `User signed up for newsletter updates from ${data.page}`,
      inquiry_type: 'newsletter_signup',
      source: data.source,
      priority: 'low',
      status: 'new',
      responded: false,
      user_id: data.user_id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'contact_inquiries'), inquiry);
    
    // Create admin notification (non-blocking)
    await createInquiryNotification(docRef.id, inquiry);
    
    return docRef.id;
  }

  /**
   * Create a partnership waitlist inquiry
   */
  static async createPartnershipWaitlist(data: {
    email: string;
    source: string;
    organization?: string;
    name?: string;
    user_id?: string;
  }): Promise<string> {
    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email,
      organization: data.organization,
      subject: 'Partnership Waitlist',
      message: `Organization interested in partnering with SHELTR. Signed up for partnership waitlist from ${data.source}`,
      inquiry_type: 'partnership_waitlist',
      source: data.source,
      priority: 'high',
      status: 'new',
      responded: false,
      user_id: data.user_id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'contact_inquiries'), inquiry);
    
    // Create admin notification (non-blocking)
    await createInquiryNotification(docRef.id, inquiry);
    
    return docRef.id;
  }

  /**
   * Create an app notification signup inquiry
   */
  static async createAppNotificationSignup(data: {
    email: string;
    source: string;
    name?: string;
    user_id?: string;
  }): Promise<string> {
    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email,
      subject: 'App Launch Notification',
      message: `User requested to be notified when the SHELTR mobile app launches. Signed up from ${data.source}`,
      inquiry_type: 'app_notification',
      source: data.source,
      priority: 'normal',
      status: 'new',
      responded: false,
      user_id: data.user_id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'contact_inquiries'), inquiry);
    
    // Create admin notification (non-blocking)
    await createInquiryNotification(docRef.id, inquiry);
    
    return docRef.id;
  }

  /**
   * Create an investor inquiry
   */
  static async createInvestorInquiry(data: {
    email: string;
    name?: string;
    organization?: string;
    message?: string;
    source: string;
    user_id?: string;
  }): Promise<string> {
    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email,
      organization: data.organization,
      subject: 'Investor Inquiry',
      message: data.message || `Investor inquiry from ${data.source}`,
      inquiry_type: 'investor_inquiry',
      source: data.source,
      priority: 'high',
      status: 'new',
      responded: false,
      user_id: data.user_id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'contact_inquiries'), inquiry);
    
    // Create admin notification (non-blocking)
    await createInquiryNotification(docRef.id, inquiry);
    
    return docRef.id;
  }

  /**
   * Create a support request inquiry
   */
  static async createSupportRequest(data: {
    email: string;
    name?: string;
    subject?: string;
    message?: string;
    source: string;
    user_id?: string;
  }): Promise<string> {
    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email,
      subject: data.subject || 'Support Request',
      message: data.message || `Support request from ${data.source}`,
      inquiry_type: 'support_request',
      source: data.source,
      priority: 'normal',
      status: 'new',
      responded: false,
      user_id: data.user_id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'contact_inquiries'), inquiry);
    
    // Create admin notification (non-blocking)
    await createInquiryNotification(docRef.id, inquiry);
    
    return docRef.id;
  }

  // ========================================
  // NEWSLETTER MANAGEMENT FUNCTIONS
  // ========================================

  /**
   * Check if email is already subscribed to newsletter
   */
  static async isNewsletterSubscriber(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'contact_inquiries'),
        where('inquiry_type', '==', 'newsletter_signup'),
        where('email', '==', email.toLowerCase()),
        where('status', 'in', ['new', 'in_progress']) // Active subscribers
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Error checking newsletter subscriber:', error);
      return false;
    }
  }

  /**
   * Get all newsletter signups from contact_inquiries collection
   */
  static async getAllNewsletterSignups(maxResults: number = 100): Promise<NewsletterSignup[]> {
    try {
      console.log('📧 [UNIFIED] Getting newsletter signups from contact_inquiries...');
      
      const q = query(
        collection(db, 'contact_inquiries'),
        where('inquiry_type', '==', 'newsletter_signup'),
        orderBy('created_at', 'desc'),
        limit(maxResults)
      );
      
      const querySnapshot = await getDocs(q);
      const signups: NewsletterSignup[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        signups.push({
          email: data.email,
          name: data.name || '',
          source: data.source || 'other',
          subscribed_at: data.created_at?.toDate() || new Date(),
          status: data.status === 'closed' ? 'unsubscribed' : 'active',
          user_agent: data.user_agent
        });
      });
      
      console.log(`✅ [UNIFIED] Found ${signups.length} newsletter signups`);
      return signups;
    } catch (error) {
      console.error('❌ Error getting newsletter signups:', error);
      return [];
    }
  }

  /**
   * Get newsletter signup count (active subscribers only)
   */
  static async getNewsletterCount(): Promise<number> {
    try {
      console.log('🔢 [UNIFIED] Counting active newsletter subscribers...');
      
      const q = query(
        collection(db, 'contact_inquiries'),
        where('inquiry_type', '==', 'newsletter_signup'),
        where('status', 'in', ['new', 'in_progress']) // Active subscribers
      );
      
      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;
      
      console.log(`✅ [UNIFIED] Newsletter subscriber count: ${count}`);
      return count;
    } catch (error) {
      console.error('❌ Error getting newsletter count:', error);
      return 0;
    }
  }

  /**
   * Export newsletter emails (for CSV downloads)
   */
  static async exportNewsletterEmails(): Promise<string[]> {
    try {
      console.log('📤 [UNIFIED] Exporting newsletter emails...');
      
      const signups = await this.getAllNewsletterSignups(1000);
      const emails = signups
        .filter(signup => signup.status === 'active')
        .map(signup => signup.email);
      
      console.log(`✅ [UNIFIED] Exported ${emails.length} newsletter emails`);
      return emails;
    } catch (error) {
      console.error('❌ Error exporting newsletter emails:', error);
      return [];
    }
  }
}
