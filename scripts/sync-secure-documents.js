/**
 * Secure Document Sync Script
 * Syncs local secure documents from .local-secure-docs/ to Firestore
 * 
 * Usage:
 *   node scripts/sync-secure-documents.js
 * 
 * This script:
 *   1. Reads files from .local-secure-docs/ subdirectories (dataroom, development, fintec, founders, operations, platform-admin, vault)
 *   2. Uploads them to Firestore knowledge_documents collection
 *   3. Uploads files to Firebase Storage at /secure-docs/[directory]/ (direct to root, not /secure-docs/founders/)
 *   4. Sets appropriate permission levels per directory
 *   5. Auto-publishes to Founders Portal or IR Data Room based on directory
 *   6. Generates slugs and metadata
 * 
 * FOLDER STRUCTURE:
 *   - dataroom/        → IR Data Room documents (qualified_investor access)
 *   - development/     → Development session logs (platform_admin access)
 *   - fintec/          → Financial technology docs (platform_admin, published to founders)
 *   - founders/        → Founders Portal documents (founders access)
 *   - operations/      → Operational documents (platform_admin access)
 *   - platform-admin/  → Platform admin only documents (platform_admin access)
 *   - vault/           → Super Admin only documents (super_admin access)
 * 
 * IMPORTANT - FILE EXCLUSIONS:
 *   
 *   WELCOME LETTERS:
 *   - 14 welcome letters are stored in secure storage but NOT synced to knowledge base
 *   - These letters are activated/embedded on each user's dashboard sidebar
 *   - They remain in Firebase secure storage for dashboard reference
 *   - Patterns: *welcome*.md, *welcome-letter*.md, [role]-welcome.md
 *   
 *   CREDENTIALS FILES:
 *   - Files containing sensitive credentials/passwords are excluded
 *   - Stored in secure storage but NOT in knowledge base
 *   - Patterns: *credentials*.md, *password*.md, platform-admin-credentials.md
 *   
 *   DRAFT DOCUMENTS:
 *   - Blog post drafts and work-in-progress documents excluded
 *   - Should be moved to /drafts folder or marked with -draft suffix
 *   - Patterns: *draft*.md, *blog-post*.md, the-sheltr-journey-blog-post*.md
 *   
 *   README FILES:
 *   - Directory navigation/overview files excluded from knowledge base
 *   - These pollute the KB with summary links, not substantive content
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables from all possible locations
// 1. Try .env.local (root)
// 2. Try apps/api/.env (backend env)
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
  require('dotenv').config({ path: path.join(__dirname, '../apps/api/.env') });
  console.log('✅ Loaded environment variables');
} catch (error) {
  // Dotenv not installed - manually parse both env files
  const envFiles = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../apps/api/.env')
  ];
  
  envFiles.forEach(envPath => {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
          }
        }
      });
    }
  });
  console.log('✅ Loaded environment variables manually');
}

// Initialize Firebase Admin
// Try service account file first, fall back to environment variables (same as Python backend)
let credential;

try {
  // Try to load from service account file (check multiple locations)
  let serviceAccount;
  const possiblePaths = [
    path.join(__dirname, '../apps/api/service-account-key.json'),
    path.join(__dirname, '../service-account-key.json')
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`✅ Using service account from: ${filePath}`);
      break;
    }
  }
  
  if (serviceAccount) {
    credential = admin.credential.cert(serviceAccount);
  } else {
    throw new Error('Service account file not found');
  }
} catch (error) {
  // Fall back to environment variables
  const serviceAccountEnv = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  };
  
  if (!serviceAccountEnv.project_id || !serviceAccountEnv.private_key || !serviceAccountEnv.client_email) {
    throw new Error('Firebase credentials not found. Please set service-account-key.json or environment variables.');
  }
  
  credential = admin.credential.cert(serviceAccountEnv);
  console.log('✅ Using environment variables for Firebase auth');
}

admin.initializeApp({
  credential: credential
});

const db = admin.firestore();

// Configuration
const SECURE_DOCS_ROOT = path.join(__dirname, '../.local-secure-docs');
const COLLECTIONS_TO_SYNC = {
  'dataroom': {
    permission_level: 'qualified_investor',
    published_to_founders: false,
    published_to_ir: true,
    visibility_scope: 'global',
    secure_badge: 'IR Data Room',
    secure_badge_color: 'emerald'
  },
  'development': {
    permission_level: 'platform_admin',
    published_to_founders: false,
    published_to_ir: false,
    visibility_scope: 'global',
    secure_badge: 'Development',
    secure_badge_color: 'blue'
  },
  'fintec': {
    permission_level: 'platform_admin',
    published_to_founders: true,
    published_to_ir: false,
    visibility_scope: 'global',
    secure_badge: 'FinTec',
    secure_badge_color: 'cyan'
  },
  'founders': {
    permission_level: 'founders',
    published_to_founders: true,
    published_to_ir: false,
    visibility_scope: 'global',
    secure_badge: 'Founders Only',
    secure_badge_color: 'purple'
  },
  'operations': {
    permission_level: 'platform_admin',
    published_to_founders: false,
    published_to_ir: false,
    visibility_scope: 'global',
    secure_badge: 'Operations',
    secure_badge_color: 'orange'
  },
  'platform-admin': {
    permission_level: 'platform_admin',
    published_to_founders: false,
    published_to_ir: false,
    visibility_scope: 'global',
    secure_badge: 'Admin Only',
    secure_badge_color: 'red'
  },
  'vault': {
    permission_level: 'super_admin',
    published_to_founders: false,
    published_to_ir: false,
    visibility_scope: 'global',
    secure_badge: 'Vault',
    secure_badge_color: 'slate'
  }
};

/**
 * Generate URL-safe slug from filename
 */
function generateSlug(filename) {
  return filename
    .toLowerCase()
    .replace(/\.md$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/**
 * Extract frontmatter and content from markdown
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content };
  }
  
  const [, frontmatterStr, bodyContent] = match;
  const frontmatter = {};
  
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  });
  
  return { frontmatter, content: bodyContent };
}

/**
 * Count words in content
 */
function countWords(content) {
  return content.trim().split(/\s+/).length;
}

/**
 * Generate document ID from content hash
 */
function generateDocId(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 20);
}

/**
 * Sync a single document
 */
async function syncDocument(dirName, filename, config) {
  const filePath = path.join(SECURE_DOCS_ROOT, dirName, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, content: bodyContent } = parseFrontmatter(content);
  
  // Generate document data
  const slug = generateSlug(filename);
  const docId = generateDocId(content);
  const wordCount = countWords(bodyContent);
  
  const documentData = {
    // Basic info
    title: frontmatter.title || filename.replace(/\.md$/, '').replace(/-/g, ' '),
    content: bodyContent,
    category: frontmatter.category || 'Secure Documents',
    tags: frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : [dirName],
    status: 'active',
    
    // File metadata
    file_path: `secure-docs/${dirName}/${filename}`,
    file_type: 'markdown',
    file_size: Buffer.byteLength(content, 'utf-8'),
    word_count: wordCount,
    
    // Embedding info
    embedding_status: 'pending',
    chunk_count: 0,
    view_count: 0,
    
    // Permission settings from config
    permission_level: config.permission_level,
    is_private: true,
    visibility_scope: config.visibility_scope,
    
    // Publishing settings
    published_to_founders: config.published_to_founders,
    published_to_ir: config.published_to_ir,
    
    // Secure publishing metadata
    secure_slug: slug,
    secure_badge: config.secure_badge,
    secure_badge_color: config.secure_badge_color,
    secure_icon: 'shield',
    source_directory: dirName,
    local_file_path: filePath,
    
    // Descriptions
    founders_description: frontmatter.description || `Secure document from ${dirName}`,
    ir_description: frontmatter.description || `Secure document from ${dirName}`,
    
    // Legacy fields
    sharing_level: 'role_based',
    access_roles: [config.permission_level],
    is_live: false,
    confidentiality_level: 'confidential',
    
    // Timestamps
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
    created_by: 'sync-script',
    
    // GitHub sync
    synced_from_github: false
  };
  
  // Check if document already exists
  const existingDocs = await db.collection('knowledge_documents')
    .where('local_file_path', '==', filePath)
    .limit(1)
    .get();
  
  if (!existingDocs.empty) {
    // UPDATE EXISTING DOCUMENT WITH SMART MERGE
    // Preserve production configurations while updating content
    const docRef = existingDocs.docs[0].ref;
    const existingData = existingDocs.docs[0].data();
    
    // Fields to UPDATE from local file (content changes)
    const fieldsToUpdate = {
      content: bodyContent,
      title: documentData.title,
      word_count: wordCount,
      file_size: documentData.file_size,
      tags: documentData.tags,
      category: documentData.category,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Fields to PRESERVE from production database (UI configurations)
    // These are set via the Knowledge Dashboard UI and should NOT be overwritten
    const preservedFields = [
      'published_to_founders',    // Toggle in KB dashboard
      'published_to_ir',           // Toggle in KB dashboard
      'secure_badge',              // Custom badge text (e.g., "Founders", "Admin")
      'secure_badge_color',        // Custom badge color (e.g., "red", "blue")
      'founders_description',      // Custom description for Founders Portal
      'ir_description',            // Custom description for IR Data Room
      'hub_slug',                  // Custom slug for public Docs Hub
      'view_count',                // View statistics
      'embedding_status',          // Embedding processing status
      'embedding_count',           // Number of embeddings generated
      'chunk_count'                // Number of chunks created
    ];
    
    // Log what we're preserving
    const preservedValues = {};
    preservedFields.forEach(field => {
      if (existingData[field] !== undefined) {
        preservedValues[field] = existingData[field];
      }
    });
    
    if (Object.keys(preservedValues).length > 0) {
      console.log(`   📌 Preserving: ${Object.keys(preservedValues).join(', ')}`);
    }
    
    // Merge: Update content fields + preserve production configs
    await docRef.update({
      ...fieldsToUpdate,
      ...preservedValues  // Production configs take precedence
    });
    
    console.log(`✅ Updated: ${filename} (${dirName}) - Content refreshed, configs preserved`);
    return { action: 'updated', filename, dirName };
  } else {
    // CREATE NEW DOCUMENT (first sync)
    await db.collection('knowledge_documents').doc(docId).set(documentData);
    console.log(`✨ Created: ${filename} (${dirName})`);
    return { action: 'created', filename, dirName };
  }
}

/**
 * Sync all documents from a directory
 */
async function syncDirectory(dirName, config) {
  const dirPath = path.join(SECURE_DOCS_ROOT, dirName);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirName}`);
    return [];
  }
  
  // Read all .md files, but exclude welcome letters, credentials, drafts, and README files
  // Excluded files remain in secure storage but are NOT ingested into knowledge base
  const allFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  const files = allFiles.filter(f => {
    // Exclude welcome letter files (used by dashboard sidebar, not for knowledge base)
    const isWelcomeLetter = f.toLowerCase().includes('welcome') || 
                           f.toLowerCase().includes('welcome-letter') ||
                           f.match(/^[a-z]+-welcome\.md$/i);
    
    // Exclude sensitive credentials files
    const isCredentials = f.toLowerCase().includes('credentials') ||
                         f.toLowerCase().includes('password') ||
                         f === 'platform-admin-credentials.md';
    
    // Exclude draft blog posts and other drafts
    const isDraft = f.toLowerCase().includes('draft') ||
                   f.toLowerCase().includes('blog-post') ||
                   f.includes('the-sheltr-journey-blog-post');
    
    // Exclude README files (pollute knowledge base with summary links)
    // These are directory overviews, not substantive documentation
    const isReadme = f.toUpperCase() === 'README.MD';
    
    // Exclude MacBook setup guides (local dev only, not for KB)
    const isSetupGuide = f.toLowerCase().includes('macbook-setup') ||
                        f.toLowerCase().includes('quick-macbook-sync');
    
    if (isWelcomeLetter) {
      console.log(`   ⏭️  Skipping welcome letter: ${f} (dashboard use only)`);
    }
    if (isCredentials) {
      console.log(`   🔒 Skipping credentials file: ${f} (too sensitive)`);
    }
    if (isDraft) {
      console.log(`   📝 Skipping draft: ${f} (not ready for KB)`);
    }
    if (isReadme) {
      console.log(`   📋 Skipping README: ${f} (summary/navigation only)`);
    }
    if (isSetupGuide) {
      console.log(`   💻 Skipping setup guide: ${f} (local dev only)`);
    }
    
    return !isWelcomeLetter && !isCredentials && !isDraft && !isReadme && !isSetupGuide;
  });
  
  console.log(`\n📁 Syncing ${dirName}/ (${files.length} files, ${allFiles.length - files.length} excluded)...`);
  
  const results = [];
  for (const filename of files) {
    try {
      const result = await syncDocument(dirName, filename, config);
      results.push(result);
    } catch (error) {
      console.error(`❌ Error syncing ${filename}:`, error.message);
      results.push({ action: 'error', filename, dirName, error: error.message });
    }
  }
  
  return results;
}

/**
 * Main sync function
 */
async function main() {
  console.log('🚀 Starting secure document sync...\n');
  console.log(`📂 Source: ${SECURE_DOCS_ROOT}`);
  console.log(`🔥 Target: Firestore knowledge_documents collection\n`);
  
  const allResults = [];
  
  for (const [dirName, config] of Object.entries(COLLECTIONS_TO_SYNC)) {
    const results = await syncDirectory(dirName, config);
    allResults.push(...results);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(60));
  
  const created = allResults.filter(r => r.action === 'created').length;
  const updated = allResults.filter(r => r.action === 'updated').length;
  const errors = allResults.filter(r => r.action === 'error').length;
  
  console.log(`✨ Created: ${created}`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Errors:  ${errors}`);
  console.log(`📄 Total:   ${allResults.length}`);
  console.log('='.repeat(60));
  
  if (errors > 0) {
    console.log('\n⚠️  Errors occurred:');
    allResults.filter(r => r.action === 'error').forEach(r => {
      console.log(`   - ${r.filename}: ${r.error}`);
    });
  }
  
  console.log('\n✅ Sync complete!\n');
  
  // Don't forget to trigger embeddings!
  console.log('💡 Next steps:');
  console.log('   1. Trigger embedding generation for new documents');
  console.log('   2. Verify documents in Knowledge Base dashboard');
  console.log('   3. Check Founders Portal and IR for published docs\n');
}

// Run the sync
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

