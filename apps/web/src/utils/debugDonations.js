// Debug script to check Jane's donations
// Run this in the browser console when logged in as Jane

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

window.debugJaneDonations = async function() {
  try {
    console.log('🔍 Debugging Jane\'s donations...');
    
    // Get current user info
    const auth = getAuth();
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser?.uid, currentUser?.email);
    
    // Query all donations
    console.log('\n📊 ALL DONATIONS:');
    const allDonationsQuery = query(collection(db, 'demo_donations'), orderBy('created_at', 'desc'));
    const allDonationsSnapshot = await getDocs(allDonationsQuery);
    
    allDonationsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ${doc.id}: $${data.amount?.total || data.amount} by ${data.donor_info?.name} (donor_id: ${data.donor_id})`);
    });
    
    // Query Jane's donations specifically
    if (currentUser?.uid) {
      console.log(`\n👩 JANE'S DONATIONS (User ID: ${currentUser.uid}):`);
      const janeQuery = query(
        collection(db, 'demo_donations'),
        where('donor_id', '==', currentUser.uid),
        orderBy('created_at', 'desc')
      );
      const janeSnapshot = await getDocs(janeQuery);
      
      if (janeSnapshot.empty) {
        console.log('❌ No donations found for Jane\'s user ID');
      } else {
        janeSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`✅ Found: $${data.amount?.total || data.amount} - ${data.created_at?.toDate?.()}`);
        });
      }
      
      // Also check by email
      console.log(`\n📧 DONATIONS BY EMAIL (${currentUser.email}):`);
      const emailQuery = query(
        collection(db, 'demo_donations'),
        where('donor_info.email', '==', currentUser.email),
        orderBy('created_at', 'desc')
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      emailSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`✅ Found by email: $${data.amount?.total || data.amount} - donor_id: ${data.donor_id}`);
      });
    }
    
    // Calculate Michael's total
    console.log('\n🎯 MICHAEL\'S TOTALS:');
    const michaelQuery = query(
      collection(db, 'demo_donations'),
      where('participant_id', '==', 'michael-rodriguez')
    );
    const michaelSnapshot = await getDocs(michaelQuery);
    
    let totalForMichael = 0;
    let donationCount = 0;
    
    michaelSnapshot.forEach(doc => {
      const data = doc.data();
      const amount = data.amount?.total || data.amount || 0;
      totalForMichael += amount;
      donationCount++;
      console.log(`- $${amount} from ${data.donor_info?.name || 'Anonymous'} (${data.source || 'unknown source'})`);
    });
    
    console.log(`\n💰 MICHAEL TOTAL: $${totalForMichael} from ${donationCount} donations`);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

console.log('🐛 Debug function loaded! Run: debugJaneDonations()');
