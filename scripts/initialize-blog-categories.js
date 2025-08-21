/**
 * Initialize Blog Categories Script
 * Creates default blog categories for the SHELTR blog system
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default blog categories
const defaultCategories = [
  {
    name: 'Platform Updates',
    description: 'Latest updates and improvements to the SHELTR platform',
    color: '#3B82F6' // Blue
  },
  {
    name: 'Success Stories',
    description: 'Inspiring stories of participants and their journey to housing',
    color: '#10B981' // Green
  },
  {
    name: 'Technology & Innovation',
    description: 'Articles about blockchain, AI, and technology innovations in homelessness support',
    color: '#8B5CF6' // Purple
  },
  {
    name: 'Community Impact',
    description: 'Stories about community involvement and volunteer efforts',
    color: '#F59E0B' // Amber
  },
  {
    name: 'Policy & Advocacy',
    description: 'Discussions about housing policy, advocacy efforts, and systemic change',
    color: '#EF4444' // Red
  },
  {
    name: 'Educational Resources',
    description: 'Educational content about homelessness, housing, and support services',
    color: '#06B6D4' // Cyan
  },
  {
    name: 'Donor Spotlight',
    description: 'Stories about donors and their impact on the community',
    color: '#84CC16' // Lime
  },
  {
    name: 'Shelter Partnerships',
    description: 'Updates about shelter partnerships and collaborative efforts',
    color: '#F97316' // Orange
  }
];

async function initializeBlogCategories() {
  console.log('🚀 Initializing blog categories...');
  
  try {
    // Check if categories already exist
    const categoriesRef = collection(db, 'blog_categories');
    const existingCategories = await getDocs(categoriesRef);
    
    if (!existingCategories.empty) {
      console.log('⚠️  Blog categories already exist. Skipping initialization.');
      existingCategories.forEach(doc => {
        console.log(`  - ${doc.data().name}`);
      });
      return;
    }
    
    // Create default categories
    console.log('📝 Creating default blog categories...');
    
    for (const category of defaultCategories) {
      try {
        const docRef = await addDoc(collection(db, 'blog_categories'), {
          name: category.name,
          slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: category.description,
          color: category.color,
          created_at: new Date(),
          updated_at: new Date()
        });
        
        console.log(`✅ Created category: ${category.name} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`❌ Failed to create category ${category.name}:`, error);
      }
    }
    
    console.log('🎉 Blog categories initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing blog categories:', error);
  }
}

// Run the initialization
if (require.main === module) {
  initializeBlogCategories()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeBlogCategories };
