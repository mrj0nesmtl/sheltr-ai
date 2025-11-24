#!/usr/bin/env node
/**
 * Gemini 2.5 Flash Connection Test
 * Tests Firebase AI Logic integration with Gemini models
 */

const { initializeApp } = require('firebase/app');
const { getAI, getGenerativeModel } = require('firebase/ai');
const { GoogleAIBackend } = require('firebase/ai');

// Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDvKr2pJhqNqNOzSGXZOqfQZXkKFxJGSHo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sheltr-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sheltr-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sheltr-ai.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "714964620823",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:714964620823:web:d5b1e3a7c8f9d0e1a2b3c4"
};

console.log('\n🤖 Testing Gemini 2.5 Flash Connection...\n');
console.log('━'.repeat(60));

async function testGemini() {
  try {
    // Step 1: Initialize Firebase
    console.log('\n📱 Step 1: Initializing Firebase...');
    const firebaseApp = initializeApp(firebaseConfig);
    console.log('   ✅ Firebase initialized');

    // Step 2: Initialize AI service
    console.log('\n🧠 Step 2: Initializing Gemini AI service...');
    const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
    console.log('   ✅ AI service initialized');

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
    console.log('\n🎉 Gemini 2.5 Flash is ready for production!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('━'.repeat(60));
    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    console.error('━'.repeat(60));
    process.exit(1);
  }
}

// Run the test
testGemini();

