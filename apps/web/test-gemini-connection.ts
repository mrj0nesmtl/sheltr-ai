/**
 * Gemini 2.5 Flash Connection Test
 * Run with: npx tsx test-gemini-connection.ts
 * 
 * Requires environment variables from .env.local:
 * - NEXT_PUBLIC_FIREBASE_API_KEY
 * - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 * - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 * - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel, VertexAIBackend } from 'firebase/ai';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: resolve(__dirname, '.env.local') });

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => {
    // Convert camelCase to UPPER_SNAKE_CASE
    const envKey = key.replace(/([A-Z])/g, '_$1').toUpperCase();
    return `NEXT_PUBLIC_FIREBASE_${envKey}`;
  });

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n💡 Please ensure .env.local exists and contains all Firebase configuration variables.');
  process.exit(1);
}

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!,
};

console.log('\n🤖 Testing Gemini 2.5 Flash Connection...\n');
console.log('━'.repeat(60));

async function testGemini() {
  try {
    // Step 1: Initialize Firebase
    console.log('\n📱 Step 1: Initializing Firebase...');
    const firebaseApp = initializeApp(firebaseConfig);
    console.log('   ✅ Firebase initialized');

    // Step 2: Initialize AI service with Vertex AI backend
    console.log('\n🧠 Step 2: Initializing Gemini AI service (Vertex AI)...');
    const ai = getAI(firebaseApp, { 
      backend: new VertexAIBackend() 
    });
    console.log('   ✅ AI service initialized with Vertex AI backend');

    // Step 3: Create Gemini 2.5 Flash model
    console.log('\n⚡ Step 3: Creating Gemini 2.5 Flash model...');
    const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });
    console.log('   ✅ Model created: gemini-2.5-flash');

    // Step 4: Test text generation
    console.log('\n💬 Step 4: Testing text generation...');
    console.log('   📝 Prompt: "What is SHELTR in one sentence?"');
    
    const result = await model.generateContent('What is SHELTR in one sentence?');
    const response = result.response;
    const text = response.text();
    
    console.log('\n   🎯 Response:');
    console.log('   ' + '─'.repeat(58));
    console.log('   ' + text);
    console.log('   ' + '─'.repeat(58));

    // Step 5: Test Gemini 2.5 Flash-Lite
    console.log('\n⚡ Step 5: Testing Gemini 2.5 Flash-Lite...');
    const liteModel = getGenerativeModel(ai, { model: 'gemini-2.5-flash-lite' });
    console.log('   ✅ Model created: gemini-2.5-flash-lite');
    
    const liteResult = await liteModel.generateContent('Say "Hello from SHELTR!" in 5 words or less.');
    const liteText = liteResult.response.text();
    
    console.log('\n   🎯 Response:');
    console.log('   ' + '─'.repeat(58));
    console.log('   ' + liteText);
    console.log('   ' + '─'.repeat(58));

    // Step 6: Test multi-turn chat
    console.log('\n💬 Step 6: Testing multi-turn chat...');
    const chatModel = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });
    const chat = chatModel.startChat({
      history: []
    });
    
    console.log('   📝 Message 1: "What does SHELTR stand for?"');
    const msg1 = await chat.sendMessage('What does SHELTR stand for?');
    console.log('   🎯 Response: ' + msg1.response.text().substring(0, 100) + '...');
    
    console.log('   📝 Message 2: "How does it help homeless people?"');
    const msg2 = await chat.sendMessage('How does it help homeless people?');
    console.log('   🎯 Response: ' + msg2.response.text().substring(0, 100) + '...');

    // Success summary
    console.log('\n' + '━'.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('━'.repeat(60));
    console.log('\n📊 Test Results:');
    console.log('   ✅ Firebase initialization: SUCCESS');
    console.log('   ✅ AI service connection: SUCCESS');
    console.log('   ✅ Gemini 2.5 Flash: SUCCESS');
    console.log('   ✅ Gemini 2.5 Flash-Lite: SUCCESS');
    console.log('   ✅ Text generation: SUCCESS');
    console.log('   ✅ Multi-turn chat: SUCCESS');
    console.log('\n🎉 Gemini 2.5 Flash is ready for production!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('━'.repeat(60));
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.error('━'.repeat(60));
    process.exit(1);
  }
}

// Run the test
testGemini();

