/**
 * Clear Platform Admin cache and debug Firestore access issues
 */

console.log('🔧 Platform Admin Cache Clearing & Debug Script');
console.log('=' * 50);

// Clear all relevant caches
console.log('🧹 Clearing localStorage...');
localStorage.clear();

console.log('🧹 Clearing sessionStorage...');
sessionStorage.clear();

// Clear any Firebase cache
console.log('🧹 Clearing Firebase cache...');
if (typeof firebase !== 'undefined' && firebase.auth) {
  firebase.auth().signOut().then(() => {
    console.log('✅ Signed out from Firebase');
  }).catch(e => {
    console.log('ℹ️ No active Firebase session to clear');
  });
}

// Clear indexedDB data (Firebase offline cache)
console.log('🧹 Clearing IndexedDB...');
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      if (db.name.includes('firebase') || db.name.includes('firestore')) {
        console.log(`🗑️ Deleting Firebase database: ${db.name}`);
        indexedDB.deleteDatabase(db.name);
      }
    });
  }).catch(e => {
    console.log('ℹ️ Could not clear IndexedDB:', e.message);
  });
}

console.log('✅ Cache clearing complete!');
console.log('🔄 Please refresh the page and try again.');
console.log('📊 Check console for "FIRESTORE ERROR" or "RETURNING FALLBACK DATA" messages.');
