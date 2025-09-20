import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createContactInquiryNotification } from './notificationService';

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
    const inquiry: UnifiedInquiry = {
      name: data.name,
      email: data.email,
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
}
