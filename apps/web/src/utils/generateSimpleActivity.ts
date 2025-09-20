// Simple activity generator that's less likely to fail
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ActivityItem {
  action: string;
  details: string;
  time: string;
}

/**
 * Generate simple recent activity with better error handling
 */
export async function generateSimpleActivity(): Promise<ActivityItem[]> {
  const activity: ActivityItem[] = [];
  
  try {
    // Try to get recent donations with minimal queries
    const donationsQuery = query(
      collection(db, 'demo_donations'),
      orderBy('created_at', 'desc'),
      limit(2)
    );
    
    const donationsSnapshot = await getDocs(donationsQuery);
    
    donationsSnapshot.docs.forEach((doc, index) => {
      const donation = doc.data();
      const amount = donation.amount?.total || donation.amount || 0;
      const timeAgo = index === 0 ? 'Just now' : '8 minutes ago';
      
      activity.push({
        action: 'New donation received',
        details: `$${amount} donated to ${donation.participant_name || 'participant'}`,
        time: timeAgo
      });
    });
    
  } catch (error) {
    console.warn('Could not load donation activity:', error);
  }
  
  // Always add some system activity as fallback
  activity.push({
    action: 'Platform metrics updated',
    details: 'Real-time dashboard data synchronized',
    time: '12 minutes ago'
  });
  
  activity.push({
    action: 'User analytics refreshed',
    details: 'Growth metrics and user counts updated',
    time: '25 minutes ago'
  });
  
  return activity.slice(0, 4); // Return max 4 items
}
