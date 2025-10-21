/**
 * SHELTR Public Touchpoint Service
 * 
 * Handles notification creation when public users interact with:
 * - Contact forms
 * - Newsletter signups
 * - Shelter page inquiries
 * - Participant inquiries
 * 
 * Routes notifications to the correct recipients based on touchpoint
 */

import {
  createAdminNotification,
  createShelterNotification
} from './unifiedNotificationService';

// ============================================================================
// CONTACT FORM TOUCHPOINTS
// ============================================================================

/**
 * Create notification for contact form submission (Platform Admin)
 */
export async function notifyContactFormSubmission(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  source: string;
}): Promise<void> {
  try {
    // Get all Platform Admins (you'd fetch this from Firestore)
    // For now, we'll use a placeholder - in production, query users with role=platform_admin
    const platformAdminId = 'PLATFORM_ADMIN_ID'; // TODO: Get from Firestore
    
    await createAdminNotification({
      recipient_id: platformAdminId,
      recipient_role: 'platform_admin',
      type: 'contact_inquiry',
      title: 'New Contact Form Submission',
      message: `${data.name} (${data.email}) submitted a contact form${data.subject ? ` about: ${data.subject}` : ''}`,
      priority: 'normal',
      category: 'contact',
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        source: data.source
      }
    });

    console.log('✅ Contact form notification created');
  } catch (error) {
    console.error('❌ Error creating contact form notification:', error);
  }
}

// ============================================================================
// NEWSLETTER TOUCHPOINTS
// ============================================================================

/**
 * Create notification for newsletter signup (Platform Admin)
 */
export async function notifyNewsletterSignup(data: {
  email: string;
  name?: string;
  source: string;
}): Promise<void> {
  try {
    // Get all Platform Admins
    const platformAdminId = 'PLATFORM_ADMIN_ID'; // TODO: Get from Firestore
    
    await createAdminNotification({
      recipient_id: platformAdminId,
      recipient_role: 'platform_admin',
      type: 'newsletter_signup',
      title: 'New Newsletter Subscriber',
      message: `${data.email}${data.name ? ` (${data.name})` : ''} signed up for the newsletter from ${data.source}`,
      priority: 'low',
      category: 'newsletter',
      data: {
        email: data.email,
        name: data.name,
        source: data.source
      }
    });

    console.log('✅ Newsletter signup notification created');
  } catch (error) {
    console.error('❌ Error creating newsletter signup notification:', error);
  }
}

// ============================================================================
// SHELTER TOUCHPOINTS
// ============================================================================

/**
 * Create notification for shelter page inquiry (Shelter Admin)
 */
export async function notifyShelterPageInquiry(data: {
  shelter_id: string;
  shelter_name: string;
  email: string;
  name: string;
  message: string;
  inquiry_type: string;
}): Promise<void> {
  try {
    // Get Shelter Admin for this shelter (query users with shelter_id)
    const shelterAdminId = 'SHELTER_ADMIN_ID'; // TODO: Get from Firestore
    const tenantId = 'TENANT_ID'; // TODO: Get from shelter document
    
    await createShelterNotification({
      shelter_id: data.shelter_id,
      tenant_id: tenantId,
      recipient_id: shelterAdminId,
      type: 'shelter_page_inquiry',
      title: 'New Inquiry from Shelter Page',
      message: `${data.name} (${data.email}) submitted an inquiry: ${data.inquiry_type}`,
      priority: 'normal',
      category: 'shelter',
      data: {
        email: data.email,
        name: data.name,
        message: data.message,
        inquiry_type: data.inquiry_type
      }
    });

    console.log('✅ Shelter page inquiry notification created');
  } catch (error) {
    console.error('❌ Error creating shelter page inquiry notification:', error);
  }
}

/**
 * Create notification for participant inquiry (Shelter Admin)
 */
export async function notifyParticipantInquiry(data: {
  email: string;
  name: string;
  message: string;
  source: string;
}): Promise<void> {
  try {
    // Get all Shelter Admins (participants can inquire at any shelter)
    // Or route to specific shelter if specified
    const shelterAdminId = 'SHELTER_ADMIN_ID'; // TODO: Get from Firestore
    const shelterId = 'SHELTER_ID'; // TODO: Determine from context
    const tenantId = 'TENANT_ID';
    
    await createShelterNotification({
      shelter_id: shelterId,
      tenant_id: tenantId,
      recipient_id: shelterAdminId,
      type: 'participant_inquiry',
      title: 'New Participant Inquiry',
      message: `${data.name} (${data.email}) is inquiring about participant services`,
      priority: 'high',
      category: 'participant',
      data: {
        email: data.email,
        name: data.name,
        message: data.message,
        source: data.source
      }
    });

    console.log('✅ Participant inquiry notification created');
  } catch (error) {
    console.error('❌ Error creating participant inquiry notification:', error);
  }
}

// ============================================================================
// SHELTER APPLICATION TOUCHPOINTS
// ============================================================================

/**
 * Create notification for shelter admin application (Platform Admin)
 */
export async function notifyShelterApplication(data: {
  shelter_name: string;
  admin_name: string;
  admin_email: string;
  application_id: string;
}): Promise<void> {
  try {
    // Get all Platform Admins
    const platformAdminId = 'PLATFORM_ADMIN_ID'; // TODO: Get from Firestore
    
    await createAdminNotification({
      recipient_id: platformAdminId,
      recipient_role: 'platform_admin',
      type: 'shelter_application',
      title: 'New Shelter Admin Application',
      message: `${data.admin_name} (${data.admin_email}) applied to register ${data.shelter_name}`,
      priority: 'high',
      category: 'application',
      data: {
        shelter_name: data.shelter_name,
        admin_name: data.admin_name,
        admin_email: data.admin_email,
        application_id: data.application_id
      }
    });

    console.log('✅ Shelter application notification created');
  } catch (error) {
    console.error('❌ Error creating shelter application notification:', error);
  }
}

// ============================================================================
// PARTICIPANT SIGNUP TOUCHPOINTS
// ============================================================================

/**
 * Create notification for new participant signup (Platform Admin)
 */
export async function notifyParticipantSignup(data: {
  participant_name: string;
  participant_email: string;
  participant_id: string;
  shelter_name?: string;
}): Promise<void> {
  try {
    // Get all Platform Admins
    const platformAdminId = 'PLATFORM_ADMIN_ID'; // TODO: Get from Firestore
    
    await createAdminNotification({
      recipient_id: platformAdminId,
      recipient_role: 'platform_admin',
      type: 'participant_signup',
      title: 'New Participant Registration',
      message: `${data.participant_name} (${data.participant_email}) registered${data.shelter_name ? ` at ${data.shelter_name}` : ''}`,
      priority: 'normal',
      category: 'participant',
      data: {
        participant_name: data.participant_name,
        participant_email: data.participant_email,
        participant_id: data.participant_id,
        shelter_name: data.shelter_name
      }
    });

    console.log('✅ Participant signup notification created');
  } catch (error) {
    console.error('❌ Error creating participant signup notification:', error);
  }
}

// ============================================================================
// SECURITY TOUCHPOINTS
// ============================================================================

/**
 * Create notification for security alert (Super Admin + Platform Admin)
 */
export async function notifySecurityAlert(data: {
  alert_type: string;
  message: string;
  severity: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    // Get Super Admin
    const superAdminId = 'SUPER_ADMIN_ID'; // TODO: Get from Firestore
    
    await createAdminNotification({
      recipient_id: superAdminId,
      recipient_role: 'super_admin',
      type: 'security_alert',
      title: `Security Alert: ${data.alert_type}`,
      message: data.message,
      priority: data.severity,
      category: 'security',
      data: data.metadata
    });

    console.log('✅ Security alert notification created');
  } catch (error) {
    console.error('❌ Error creating security alert notification:', error);
  }
}

// ============================================================================
// HELPER: Get Platform Admins
// ============================================================================

/**
 * Get all Platform Admin IDs
 * TODO: Implement Firestore query
 */
export async function getPlatformAdminIds(): Promise<string[]> {
  // In production, query Firestore for users with role=platform_admin
  // For now, return placeholder
  return ['PLATFORM_ADMIN_ID'];
}

/**
 * Get Shelter Admin ID for a specific shelter
 * TODO: Implement Firestore query
 */
export async function getShelterAdminId(shelterId: string): Promise<string | null> {
  // In production, query Firestore for users with shelter_id=shelterId and role=admin
  // For now, return placeholder
  return 'SHELTER_ADMIN_ID';
}

