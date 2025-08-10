import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
 */
export const getRecentEmailSignups = async (limitCount: number = 10): Promise<EmailSignup[]> => {
  try {
    console.log('🔔 Fetching recent email signups...');
    
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
    
    console.log(`✅ Found ${signups.length} email signups`);
    return signups;
    
  } catch (error) {
    console.error('❌ Error fetching email signups:', error);
    return [];
  }
};

/**
 * Get notification counts for Super Admin dashboard
 */
export const getNotificationCounts = async (): Promise<NotificationCounts> => {
  try {
    console.log('🔔 Fetching notification counts...');
    
    // Get total email signups
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
    
    // Get pending shelter applications (if collection exists)
    let pendingShelterapplications = 0;
    try {
      const applicationsRef = collection(db, 'shelter_applications');
      const pendingQuery = query(
        applicationsRef,
        where('status', '==', 'pending_review')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      pendingShelterapplications = pendingSnapshot.size;
    } catch (error) {
      console.log('ℹ️ No shelter_applications collection found yet');
    }
    
    const totalNotifications = recentEmailSignups + pendingShelterapplications;
    
    const counts: NotificationCounts = {
      totalEmailSignups,
      recentEmailSignups,
      pendingShelterapplications,
      totalNotifications
    };
    
    console.log('✅ Notification counts:', counts);
    return counts;
    
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
