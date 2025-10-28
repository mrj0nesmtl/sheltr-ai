/**
 * Initialize Blog Categories for SHELTR-AI
 * Creates default blog categories in Firestore
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Initialize Firebase Admin SDK
let app;
try {
  const serviceAccountPath = './google-credentials.json';
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: 'sheltr-ai'
    });
  } else {
    // Use default credentials in production
    app = initializeApp({
      projectId: 'sheltr-ai'
    });
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

const db = getFirestore(app);

// Default blog categories
const defaultCategories = [
  {
    name: 'Press Release',
    slug: 'press-release',
    description: 'Official press releases and announcements',
    color: '#3B82F6'
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Technical insights and blockchain developments',
    color: '#10B981'
  },
  {
    name: 'Impact Stories',
    slug: 'impact-stories',
    description: 'Real stories of participant empowerment and success',
    color: '#F59E0B'
  },
  {
    name: 'Community Updates',
    slug: 'community-updates',
    description: 'Updates from the SHELTR community and partners',
    color: '#8B5CF6'
  },
  {
    name: 'DeFi & Tokenomics',
    slug: 'defi-tokenomics',
    description: 'DeFi strategies, token economics, and financial empowerment',
    color: '#EF4444'
  },
  {
    name: 'Partnerships',
    slug: 'partnerships',
    description: 'Shelter partnerships and organizational collaborations',
    color: '#06B6D4'
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Educational content about homelessness and solutions',
    color: '#84CC16'
  }
];

async function initializeBlogCategories() {
  try {
    console.log('🏷️  Initializing blog categories...');
    
    for (const category of defaultCategories) {
      // Check if category already exists
      const existingCategories = await db.collection('blog_categories')
        .where('slug', '==', category.slug)
        .limit(1)
        .get();
      
      if (existingCategories.empty) {
        // Create new category
        const categoryData = {
          ...category,
          created_at: new Date(),
          updated_at: new Date()
        };
        
        const docRef = await db.collection('blog_categories').add(categoryData);
        console.log(`✅ Created category: ${category.name} (ID: ${docRef.id})`);
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    }
    
    console.log('🎉 Blog categories initialization completed!');
    
  } catch (error) {
    console.error('❌ Error initializing blog categories:', error);
    throw error;
  }
}

// Run the initialization
initializeBlogCategories()
  .then(() => {
    console.log('✅ Blog categories setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to initialize blog categories:', error);
    process.exit(1);
  });