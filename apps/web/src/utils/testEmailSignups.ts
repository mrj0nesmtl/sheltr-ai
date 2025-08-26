import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Utility function to create test email signups for notification testing
 * SESSION 13: Multi-tenant notification system testing
 */
export async function createTestEmailSignup(email: string, source = 'dashboard_test', page = 'admin_testing') {
  try {
    console.log(`📧 Creating test email signup: ${email}`);
    
    const signupData = {
      email: email.toLowerCase().trim(),
      source,
      page,
      signup_date: serverTimestamp(),
      user_agent: 'SHELTR Dashboard Test',
      status: 'active'
    };
    
    const docRef = await addDoc(collection(db, 'newsletter_signups'), signupData);
    console.log(`✅ Test email signup created with ID: ${docRef.id}`);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test email signup:', error);
    throw error;
  }
}

/**
 * Create multiple test email signups for comprehensive testing
 */
export async function createMultipleTestSignups() {
  const testEmails = [
    'session13.test1@sheltr.ai',
    'session13.test2@sheltr.ai', 
    'session13.test3@sheltr.ai',
    'joel.testing@sheltr.ai',
    'multitenant.demo@sheltr.ai'
  ];
  
  console.log('📧 Creating multiple test email signups...');
  
  const results = [];
  for (const email of testEmails) {
    try {
      const id = await createTestEmailSignup(email, 'session13_testing', 'multi_tenant_validation');
      results.push({ email, id, status: 'success' });
    } catch (error) {
      results.push({ email, id: null, status: 'error', error });
    }
  }
  
  console.log('✅ Test email signups created:', results);
  return results;
}
