/**
 * Gemini 2.5 Flash Connection Test
 * Run with: npx tsx test-gemini-connection.ts
 */

import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel, VertexAIBackend } from 'firebase/ai';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvKr2pJhqNqNOzSGXZOqfQZXkKFxJGSHo",
  authDomain: "sheltr-ai.firebaseapp.com",
  projectId: "sheltr-ai",
  storageBucket: "sheltr-ai.firebasestorage.app",
  messagingSenderId: "714964620823",
  appId: "1:714964620823:web:d5b1e3a7c8f9d0e1a2b3c4"
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

  } catch (error: any) {
    console.error('\n❌ TEST FAILED!');
    console.error('━'.repeat(60));
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.error('━'.repeat(60));
    process.exit(1);
  }
}

// Run the test
testGemini();

