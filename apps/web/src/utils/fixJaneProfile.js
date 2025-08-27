// Fix Jane's user profile in Firebase
// Run this in browser console when logged in as Jane

window.fixJaneProfile = async function() {
  try {
    console.log('🔧 Fixing Jane\'s profile...');
    
    // Import Firebase functions
    const { getFirestore, doc, updateDoc, getDoc } = await import('firebase/firestore');
    const { getAuth, updateProfile } = await import('firebase/auth');
    
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('❌ No user logged in');
      return;
    }
    
    console.log('Current user:', currentUser.uid, currentUser.email);
    
    // Update Firebase Auth profile
    await updateProfile(currentUser, {
      displayName: 'Jane Supporter'
    });
    console.log('✅ Updated Firebase Auth displayName to "Jane Supporter"');
    
    // Update Firestore user document if it exists
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          name: 'Jane Supporter',
          firstName: 'Jane',
          lastName: 'Supporter',
          displayName: 'Jane Supporter'
        });
        console.log('✅ Updated Firestore user document');
      } else {
        console.log('ℹ️ No Firestore user document found');
      }
    } catch (error) {
      console.log('⚠️ Could not update Firestore user document:', error);
    }
    
    console.log('🎉 Profile update complete! Refresh the page to see changes.');
    
  } catch (error) {
    console.error('❌ Error fixing profile:', error);
  }
};

console.log('🔧 Profile fix utility loaded! Run: fixJaneProfile()');
