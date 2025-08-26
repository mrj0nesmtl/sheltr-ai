import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// API base URL for notifications
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface EmailSignup {
  id: string;
  email: string;
  source: string;
  page: string;
  signup_date: Timestamp;
  user_agent?: string;
  status: string;
  created_at?: string;
}

export interface NotificationCounts {
  totalEmailSignups: number;
  recentEmailSignups: number;
  pendingShelterapplications: number;
  totalNotifications: number;
}

/**
 * Fetch recent email signups from newsletter_signups collection
 * SESSION 13: MULTI-TENANT - Prioritize REAL database data over mock data
 */
export const getRecentEmailSignups = async (limitCount: number = 10): Promise<EmailSignup[]> => {
  try {
    console.log('🔔 [SESSION 13] Fetching REAL email signups from newsletter_signups collection...');
    
    // PRIORITY 1: Real Firestore data from newsletter_signups collection
    const signupsRef = collection(db, 'newsletter_signups');
    const q = query(
      signupsRef,
      orderBy('signup_date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const signups: EmailSignup[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      signups.push({
        id: doc.id,
        email: data.email,
        source: data.source || 'unknown',
        page: data.page || 'unknown',
        signup_date: data.signup_date,
        user_agent: data.user_agent,
        status: data.status || 'active',
        created_at: data.signup_date?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    console.log(`✅ [SESSION 13] Found ${signups.length} REAL email signups from newsletter_signups collection`);
    
    // If we have real data, return it
    if (signups.length > 0) {
      console.log('📧 Real email signups:', signups.map(s => ({ email: s.email, source: s.source, page: s.page })));
      return signups;
    }
    
    // FALLBACK: Only use mock data if no real signups exist
    console.log('⚠️ No real email signups found, checking API for backup data...');
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/analytics/test-platform`);
      if (response.ok) {
        const data = await response.json();
        const userData = data.data.users;
        const totalUsers = userData.total || 0;
        
        // Only generate minimal mock data if absolutely no real data exists
        if (totalUsers > 0) {
          console.log('🎭 Generating minimal fallback data (no real signups found)');
          const fallbackSignups: EmailSignup[] = [
            {
              id: 'fallback_1',
              email: 'demo@sheltr.ai',
              source: 'demo',
              page: 'fallback',
              signup_date: Timestamp.now(),
              user_agent: 'SHELTR Demo System',
              status: 'demo',
              created_at: new Date().toISOString()
            }
          ];
          
          return fallbackSignups;
        }
      }
    } catch (apiError) {
      console.warn('⚠️ API also failed, returning empty array:', apiError);
    }
    
    // Return empty array if no data available
    console.log('ℹ️ No email signups available (neither real nor fallback)');
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching email signups:', error);
    return [];
  }
};

/**
 * Get notification counts for Super Admin dashboard
 * SESSION 13: MULTI-TENANT - Use REAL database data first
 */
export const getNotificationCounts = async (): Promise<NotificationCounts> => {
  try {
    console.log('🔔 [SESSION 13] Fetching REAL notification counts from database...');
    
    // PRIORITY 1: Real Firestore data from actual collections
    console.log('🔔 Getting real data from newsletter_signups and applications...');
    
    // Get total email signups from real collection
    const signupsRef = collection(db, 'newsletter_signups');
    const totalSignupsSnapshot = await getDocs(signupsRef);
    const totalEmailSignups = totalSignupsSnapshot.size;
    
    // Get recent email signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSignupsQuery = query(
      signupsRef,
      where('signup_date', '>=', Timestamp.fromDate(sevenDaysAgo))
    );
    const recentSignupsSnapshot = await getDocs(recentSignupsQuery);
    const recentEmailSignups = recentSignupsSnapshot.size;
    
    // Get pending shelter applications from multi-tenant structure
    let pendingShelterapplications = 0;
    try {
      // Try global applications collection first
      const globalAppsRef = collection(db, 'global/platform_admin/applications');
      const globalAppsSnapshot = await getDocs(globalAppsRef);
      pendingShelterapplications += globalAppsSnapshot.size;
      
      // Also check legacy shelter_applications collection
      const legacyAppsRef = collection(db, 'shelter_applications');
      const pendingQuery = query(
        legacyAppsRef,
        where('status', '==', 'pending_review')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      pendingShelterapplications += pendingSnapshot.size;
      
    } catch (error) {
      console.log('ℹ️ No applications collections found yet');
    }
    
    const totalNotifications = recentEmailSignups + pendingShelterapplications;
    
    const counts: NotificationCounts = {
      totalEmailSignups,
      recentEmailSignups,
      pendingShelterapplications,
      totalNotifications
    };
    
    console.log('✅ [SESSION 13] Real notification counts from database:', counts);
    console.log(`📧 Real signups: ${totalEmailSignups} total, ${recentEmailSignups} recent`);
    console.log(`📋 Pending applications: ${pendingShelterapplications}`);
    
    // If we have some real data, return it
    if (totalEmailSignups > 0 || pendingShelterapplications > 0) {
      return counts;
    }
    
    // FALLBACK: Only if absolutely no real data exists, use minimal mock data
    console.log('⚠️ No real notification data found, using minimal fallback...');
    
    return {
      totalEmailSignups: 0,
      recentEmailSignups: 0,
      pendingShelterapplications: 0,
      totalNotifications: 0
    };
    
  } catch (error) {
    console.error('❌ Error fetching notification counts:', error);
    return {
      totalEmailSignups: 0,
      recentEmailSignups: 0,
      pendingShelterapplications: 0,
      totalNotifications: 0
    };
  }
};

/**
 * Format relative time for notifications
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};
