// Utility to fix Michael Rodriguez participant data inconsistencies
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Fix Michael Rodriguez participant data inconsistencies
 * - Fix tenant_id: "shelter-old-brewery-mission" → "old-brewery-mission"
 * - Keep shelter_id: "old-brewery-mission" (already correct)
 * - Fix participantProfile.organizationId: "downtown-hope-shelter" → "old-brewery-mission"
 */
export async function fixMichaelRodriguezData() {
  console.log('🔧 Starting Michael Rodriguez data fix...');
  
  const userId = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';
  const userRef = doc(db, 'users', userId);
  
  try {
    // Get current data first
    console.log('📋 Getting current data...');
    const currentDoc = await getDoc(userRef);
    
    if (!currentDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const currentData = currentDoc.data();
    
    console.log('📊 Current values:');
    console.log('   tenant_id:', currentData.tenant_id);
    console.log('   shelter_id:', currentData.shelter_id);
    console.log('   organizationId:', currentData.participantProfile?.organizationId);
    
    // Prepare update data - fix all inconsistencies to "old-brewery-mission"
    const updateData = {
      tenant_id: 'old-brewery-mission',
      shelter_id: 'old-brewery-mission', // Ensure consistency even though it's already correct
      'participantProfile.organizationId': 'old-brewery-mission',
      updated_at: serverTimestamp()
    };
    
    console.log('🔄 Updating document...');
    await updateDoc(userRef, updateData);
    
    console.log('✅ Update successful! Verifying changes...');
    
    // Verify the update
    const updatedDoc = await getDoc(userRef);
    const updatedData = updatedDoc.data();
    
    console.log('🎯 Updated values:');
    console.log('   tenant_id:', updatedData?.tenant_id);
    console.log('   shelter_id:', updatedData?.shelter_id);
    console.log('   organizationId:', updatedData?.participantProfile?.organizationId);
    
    // Validate all values are now consistent
    const allCorrect = 
      updatedData?.tenant_id === 'old-brewery-mission' &&
      updatedData?.shelter_id === 'old-brewery-mission' &&
      updatedData?.participantProfile?.organizationId === 'old-brewery-mission';
    
    if (allCorrect) {
      console.log('🎉 SUCCESS: All Michael Rodriguez data is now consistent!');
      console.log('✅ tenant_id: old-brewery-mission');
      console.log('✅ shelter_id: old-brewery-mission');
      console.log('✅ participantProfile.organizationId: old-brewery-mission');
      return { success: true, message: 'Data fixed successfully' };
    } else {
      console.error('❌ ERROR: Some values are still inconsistent');
      return { success: false, message: 'Fix incomplete' };
    }
    
  } catch (error) {
    console.error('❌ Error fixing Michael Rodriguez data:', error);
    return { success: false, message: `Error: ${error}` };
  }
}

// Export for console usage
if (typeof window !== 'undefined') {
  (window as any).fixMichaelRodriguezData = fixMichaelRodriguezData;
}
