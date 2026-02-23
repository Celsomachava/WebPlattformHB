// Clear all cache and localStorage for real-time updates
console.log('🧹 Clearing all cache and localStorage...');

// Clear localStorage
localStorage.clear();
console.log('✅ localStorage cleared');

// Clear sessionStorage  
sessionStorage.clear();
console.log('✅ sessionStorage cleared');

// Clear IndexedDB
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      indexedDB.deleteDatabase(db.name);
    });
  });
  console.log('✅ IndexedDB cleared');
}

// Clear service worker cache
if ('serviceWorker' in navigator && 'caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
    });
  });
  console.log('✅ Service Worker cache cleared');
}

console.log('🎯 All cache cleared! System will now update in real-time.');
console.log('Please refresh the page to see changes.');

// Auto refresh page
setTimeout(() => {
  window.location.reload();
}, 1000);