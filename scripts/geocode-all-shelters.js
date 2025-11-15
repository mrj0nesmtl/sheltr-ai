/**
 * Geocode All Shelters - Migration Script
 * 
 * This script geocodes all existing shelter addresses and stores the coordinates
 * in their public_config subcollection.
 * 
 * Run with: node scripts/geocode-all-shelters.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Google Maps API Key - replace with your key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCfJpsIbZmyJxmU7IgkijCNTv1l8SJZM7E';

/**
 * Geocode an address using Google Maps Geocoding API
 */
async function geocodeAddress(address) {
  try {
    console.log(`  🌍 Geocoding: ${address}`);
    
    // Add Montreal, Quebec, Canada if not already in address
    let fullAddress = address;
    if (!address.toLowerCase().includes('montreal') && !address.toLowerCase().includes('quebec')) {
      fullAddress = `${address}, Montreal, Quebec, Canada`;
    }
    
    const encodedAddress = encodeURIComponent(fullAddress);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const coordinates = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        geocodedAt: new Date().toISOString(),
        source: 'google'
      };
      
      console.log(`  ✅ Geocoded: (${coordinates.lat}, ${coordinates.lng})`);
      console.log(`     Formatted: ${result.formatted_address}`);
      
      return coordinates;
    } else {
      console.warn(`  ⚠️ Geocoding failed: ${data.status}`);
      if (data.error_message) {
        console.warn(`     Error: ${data.error_message}`);
      }
      return null;
    }
  } catch (error) {
    console.error(`  ❌ Geocoding error:`, error.message);
    return null;
  }
}

/**
 * Get fallback coordinates based on neighborhood keywords
 */
function getFallbackCoordinates(address) {
  const addressLower = address.toLowerCase();
  
  const neighborhoods = {
    'westmount': { lat: 45.4833, lng: -73.5978 },
    'plateau': { lat: 45.5200, lng: -73.5800 },
    'saint-laurent': { lat: 45.5200, lng: -73.5800 },
    'verdun': { lat: 45.4580, lng: -73.5673 },
    'rosemont': { lat: 45.5418, lng: -73.5740 },
    'outremont': { lat: 45.5240, lng: -73.6089 },
    'ndg': { lat: 45.4700, lng: -73.6100 },
    'notre-dame-de-grâce': { lat: 45.4700, lng: -73.6100 },
    'mile end': { lat: 45.5267, lng: -73.6040 },
    'hochelaga': { lat: 45.5500, lng: -73.5400 },
    'ville-marie': { lat: 45.5080, lng: -73.5540 },
    'côte-des-neiges': { lat: 45.4937, lng: -73.6298 },
  };
  
  for (const [neighborhood, coords] of Object.entries(neighborhoods)) {
    if (addressLower.includes(neighborhood)) {
      console.log(`  📍 Using fallback for ${neighborhood}`);
      return {
        ...coords,
        geocodedAt: new Date().toISOString(),
        source: 'fallback'
      };
    }
  }
  
  // Default: Downtown Montreal
  console.log(`  📍 Using default downtown Montreal coordinates`);
  return {
    lat: 45.5017,
    lng: -73.5673,
    geocodedAt: new Date().toISOString(),
    source: 'fallback'
  };
}

/**
 * Main migration function
 */
async function geocodeAllShelters() {
  try {
    console.log('🏠 Starting shelter geocoding migration...\n');
    
    const sheltersRef = db.collection('shelters');
    const snapshot = await sheltersRef.get();
    
    console.log(`📍 Found ${snapshot.size} shelters to process\n`);
    
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;
    
    for (const doc of snapshot.docs) {
      const shelter = doc.data();
      const shelterId = doc.id;
      
      console.log(`\n🏢 Processing: ${shelter.name || shelterId}`);
      console.log(`   Address: ${shelter.address || 'N/A'}`);
      
      if (!shelter.address) {
        console.log(`   ⏭️  Skipped: No address found`);
        skippedCount++;
        continue;
      }
      
      // Check if coordinates already exist in public_config
      const publicConfigRef = db.collection('shelters').doc(shelterId).collection('public_config').doc('config');
      const configSnap = await publicConfigRef.get();
      
      if (configSnap.exists && configSnap.data().coordinates) {
        console.log(`   ℹ️  Already has coordinates: (${configSnap.data().coordinates.lat}, ${configSnap.data().coordinates.lng})`);
        console.log(`   Source: ${configSnap.data().coordinates.source || 'unknown'}`);
        skippedCount++;
        continue;
      }
      
      // Geocode the address
      let coordinates = await geocodeAddress(shelter.address);
      
      if (!coordinates) {
        coordinates = getFallbackCoordinates(shelter.address);
      }
      
      // Update or create public_config with coordinates
      try {
        await publicConfigRef.set({
          coordinates: coordinates,
          address: shelter.address,
          name: shelter.name,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`   ✅ Saved coordinates to public_config`);
        successCount++;
      } catch (saveError) {
        console.error(`   ❌ Error saving coordinates:`, saveError.message);
        failureCount++;
      }
      
      // Rate limiting: wait 1 second between Google API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n\n📊 Migration Complete!`);
    console.log(`✅ Success: ${successCount} shelters`);
    console.log(`⏭️  Skipped: ${skippedCount} shelters (already had coordinates or no address)`);
    console.log(`❌ Failed: ${failureCount} shelters`);
    console.log(`📍 Total processed: ${snapshot.size} shelters\n`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the migration
geocodeAllShelters();

