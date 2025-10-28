const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK using Application Default Credentials
// This will work if you have the Firebase CLI installed and authenticated
if (!admin.apps.length) {
  try {
    // Try to initialize with default credentials (Firebase CLI)
    admin.initializeApp({
      projectId: 'sheltr-ai',
      storageBucket: 'sheltr-ai.firebasestorage.app'
    });
    console.log('✅ Firebase Admin initialized with default credentials');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    console.log('💡 Please run: firebase login');
    process.exit(1);
  }
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Image metadata mapping with enhanced descriptions and tags
const imageMetadata = {
  'hero-pods.png': {
    title: 'SHELTR PODS Hero',
    category: 'pods',
    description: 'Main hero image showcasing SHELTR PODS units in an urban setting',
    tags: ['hero', 'pods', 'housing', 'emergency', 'urban'],
    date: '2024'
  },
  'pods-1.jpeg': {
    title: 'PODS Unit - Front View',
    category: 'pods',
    description: 'Front view of a SHELTR POD unit showing entrance and design details',
    tags: ['pods', 'exterior', 'design', 'entrance'],
    date: '2024'
  },
  'pods-2.jpeg': {
    title: 'PODS Unit - Side View',
    category: 'pods',
    description: 'Side view showcasing the compact design and mobility features',
    tags: ['pods', 'exterior', 'mobile', 'compact'],
    date: '2024'
  },
  'pods-overhead.jpeg': {
    title: 'PODS Overhead View',
    category: 'pods',
    description: 'Aerial view of PODS unit showing roof and solar panel configuration',
    tags: ['pods', 'aerial', 'solar', 'roof', 'energy'],
    date: '2024'
  },
  'interior-1.jpeg': {
    title: 'PODS Interior Space',
    category: 'pods',
    description: 'Interior view showing living space functionality and comfort features',
    tags: ['pods', 'interior', 'living', 'comfort'],
    date: '2024'
  },
  'sleeper-1.jpeg': {
    title: 'PODS Sleeping Area',
    category: 'pods',
    description: 'Comfortable sleeping area with integrated storage solutions',
    tags: ['pods', 'interior', 'sleeping', 'comfort', 'storage'],
    date: '2024'
  },
  'sleeper-2.jpeg': {
    title: 'PODS Night Configuration',
    category: 'pods',
    description: 'Evening setup showing lighting and comfort features',
    tags: ['pods', 'interior', 'lighting', 'night', 'ambiance'],
    date: '2024'
  },
  'security.jpeg': {
    title: 'Security Features',
    category: 'pods',
    description: 'Security and access control systems for participant safety',
    tags: ['pods', 'security', 'access', 'safety', 'protection'],
    date: '2024'
  },
  'bike-1.jpeg': {
    title: 'MOBI Electric Bike',
    category: 'mobi',
    description: 'SHELTR MOBI electric mountain bike for urban logistics and transport',
    tags: ['mobi', 'bike', 'electric', 'transport', 'logistics'],
    date: '2024'
  },
  'bike-2.jpeg': {
    title: 'MOBI Cargo Configuration',
    category: 'mobi',
    description: 'MOBI bike configured for cargo and supply transport operations',
    tags: ['mobi', 'bike', 'cargo', 'logistics', 'supplies'],
    date: '2024'
  },
  'sheltr-mobility.jpg': {
    title: 'Urban Mobility Solution',
    category: 'mobi',
    description: 'MOBI bike in urban environment for emergency response scenarios',
    tags: ['mobi', 'urban', 'mobility', 'emergency', 'response'],
    date: '2024'
  },
  'closeup-wheels.jpeg': {
    title: 'MOBI Technical Details',
    category: 'mobi',
    description: 'Close-up view of wheel and technical components',
    tags: ['mobi', 'technical', 'wheels', 'details', 'engineering'],
    date: '2024'
  },
  'drone-delivery.jpeg': {
    title: 'Drone Delivery System',
    category: 'drones',
    description: 'SHELTR drone delivery system for emergency supply distribution',
    tags: ['drones', 'delivery', 'emergency', 'supplies', 'aerial'],
    date: '2024'
  },
  'drone-tech.jpeg': {
    title: 'Drone Technology',
    category: 'drones',
    description: 'Technical view of drone delivery capabilities and systems',
    tags: ['drones', 'technology', 'aerial', 'logistics', 'innovation'],
    date: '2024'
  },
  'qr-applications.jpeg': {
    title: 'QR Code Applications',
    category: 'technology',
    description: 'QR code integration for platform access and donation systems',
    tags: ['qr', 'technology', 'access', 'donations', 'digital'],
    date: '2024'
  },
  'mobi-tech.jpeg': {
    title: 'MOBI Technology Integration',
    category: 'technology',
    description: 'Technology integration and smart features in MOBI systems',
    tags: ['mobi', 'technology', 'integration', 'smart', 'digital'],
    date: '2024'
  },
  'sheltr-fab.jpeg': {
    title: 'SHELTR Fabrication',
    category: 'fabrication',
    description: 'Manufacturing and fabrication processes for SHELTR units',
    tags: ['fabrication', 'manufacturing', 'production', 'assembly'],
    date: '2024'
  },
  'workshop-a.jpeg': {
    title: 'Workshop Environment',
    category: 'fabrication',
    description: 'Workshop and development environment for SHELTR projects',
    tags: ['workshop', 'development', 'fabrication', 'workspace'],
    date: '2024'
  },
  'cube-and-storage.jpeg': {
    title: 'Storage Solutions',
    category: 'fabrication',
    description: 'Storage and organizational systems for fabrication workflow',
    tags: ['storage', 'organization', 'systems', 'workflow'],
    date: '2024'
  },
  'sketch-1.jpeg': {
    title: 'Concept Sketch 1',
    category: 'concepts',
    description: 'Early concept sketches and design ideas for SHELTR systems',
    tags: ['concept', 'sketch', 'design', 'planning', 'ideation'],
    date: '2024'
  },
  'sketch-2.jpeg': {
    title: 'Concept Sketch 2',
    category: 'concepts',
    description: 'Design development and planning sketches for system architecture',
    tags: ['concept', 'sketch', 'development', 'architecture'],
    date: '2024'
  },
  'sketch-3.jpeg': {
    title: 'Concept Sketch 3',
    category: 'concepts',
    description: 'Technical concept illustrations and system diagrams',
    tags: ['concept', 'sketch', 'technical', 'diagrams'],
    date: '2024'
  }
};

async function uploadImageToStorage(localPath, fileName) {
  const timestamp = Date.now();
  const storageFileName = `gallery/${timestamp}_${fileName}`;
  
  console.log(`📤 Uploading ${fileName} to ${storageFileName}...`);
  
  try {
    // Upload file to Firebase Storage
    await bucket.upload(localPath, {
      destination: storageFileName,
      metadata: {
        contentType: getContentType(fileName),
        cacheControl: 'public, max-age=31536000', // 1 year cache
      }
    });
    
    // Make file publicly readable and get public URL
    const file = bucket.file(storageFileName);
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/sheltr-ai.firebasestorage.app/${storageFileName}`;
    
    console.log(`✅ Successfully uploaded: ${fileName}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error);
    throw error;
  }
}

async function saveImageMetadata(fileName, downloadURL, order) {
  const metadata = imageMetadata[fileName];
  if (!metadata) {
    console.warn(`⚠️  No metadata found for ${fileName}, using defaults`);
  }
  
  const imageData = {
    src: downloadURL,
    title: metadata?.title || fileName.replace(/\.[^/.]+$/, ""),
    category: metadata?.category || 'uncategorized',
    description: metadata?.description || `SHELTR image: ${fileName}`,
    tags: metadata?.tags || ['sheltr'],
    date: metadata?.date || '2024',
    isPublic: true,
    order: order,
    uploadedBy: 'bulk-upload-script',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  console.log(`💾 Saving metadata for ${fileName}...`);
  
  try {
    const docRef = await db.collection('gallery_images').add(imageData);
    console.log(`✅ Metadata saved with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error saving metadata for ${fileName}:`, error);
    throw error;
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

async function bulkUploadImages() {
  const sourceDir = path.join(__dirname, '../apps/web/public/images/sheltr_units');
  
  console.log('🚀 Starting bulk gallery upload...');
  console.log(`📁 Source directory: ${sourceDir}`);
  
  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`);
    process.exit(1);
  }
  
  // Get all image files
  const files = fs.readdirSync(sourceDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort(); // Sort for consistent ordering
  
  console.log(`📸 Found ${files.length} images to upload:`);
  files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  console.log('\n🔄 Starting upload process...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process each image
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(sourceDir, fileName);
    
    try {
      console.log(`\n[${i + 1}/${files.length}] Processing: ${fileName}`);
      
      // Upload to Firebase Storage
      const downloadURL = await uploadImageToStorage(filePath, fileName);
      
      // Save metadata to Firestore
      await saveImageMetadata(fileName, downloadURL, i);
      
      successCount++;
      console.log(`✅ [${i + 1}/${files.length}] Successfully processed: ${fileName}`);
      
      // Small delay to avoid overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${files.length}] Failed to process ${fileName}:`, error.message);
    }
  }
  
  console.log('\n🎉 Bulk upload completed!');
  console.log(`✅ Successfully uploaded: ${successCount} images`);
  console.log(`❌ Failed uploads: ${errorCount} images`);
  console.log(`📊 Total processed: ${successCount + errorCount} images`);
  
  if (successCount > 0) {
    console.log('\n🔗 Next steps:');
    console.log('1. Visit http://localhost:3000/dashboard/gallery to manage images');
    console.log('2. Visit http://localhost:3000/gallery to view public gallery');
    console.log('3. Images are stored in Firebase Storage under the "gallery/" folder');
  }
  
  process.exit(errorCount > 0 ? 1 : 0);
}

// Run the bulk upload
bulkUploadImages().catch(error => {
  console.error('💥 Fatal error during bulk upload:', error);
  process.exit(1);
});
