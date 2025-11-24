/**
 * SHELTR Chatbot Browser Test Suite
 * 
 * Run this in your browser console while on http://localhost:3000
 * 
 * Usage:
 * 1. Open http://localhost:3000 in browser
 * 2. Open Developer Console (F12)
 * 3. Copy/paste this entire script
 * 4. Run: await runChatbotTests()
 */

// Test Questions
const FAQ_QUESTIONS = [
  "What is SHELTR?",
  "How does SHELTR work?",
  "When does SHELTR launch?",
  "What are PODS?",
  "What are MOBI bikes?",
  "How do I donate?",
  "How do I become a participant?",
  "Is SHELTR secure?",
  "What is the SmartFund model?",
  "Which blockchain does SHELTR use?"
];

const RAG_QUESTIONS = [
  "Explain how the blockchain verifies my donation and what smart contracts are involved",
  "Compare SHELTR to traditional homeless charities in terms of efficiency",
  "Walk me through the complete journey from homeless to getting a pod",
  "How does SHELTR ensure participant privacy while maintaining blockchain transparency?"
];

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  faq_tests: [],
  rag_tests: [],
  summary: {}
};

/**
 * Send message to chatbot API
 */
async function sendChatMessage(message) {
  const startTime = performance.now();
  
  try {
    const response = await fetch('http://localhost:8000/api/v1/chatbot/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        user_id: `test_user_${Date.now()}`,
        conversation_id: `test_conv_${Date.now()}`
      })
    });
    
    const endTime = performance.now();
    const responseTime = (endTime - startTime) / 1000; // Convert to seconds
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      response: data,
      responseTime: responseTime
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = (endTime - startTime) / 1000;
    
    return {
      success: false,
      error: error.message,
      responseTime: responseTime
    };
  }
}

/**
 * Test FAQ question
 */
async function testFAQQuestion(question, index, total) {
  console.log(`\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #3b82f6; font-weight: bold');
  console.log(`%cFAQ Test ${index + 1}/${total}`, 'color: #3b82f6; font-weight: bold; font-size: 14px');
  console.log(`%cQuestion: "${question}"`, 'color: #06b6d4');
  console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #3b82f6; font-weight: bold');
  
  const result = await sendChatMessage(question);
  
  const testResult = {
    question: question,
    success: result.success,
    responseTime: result.responseTime,
    method: result.response?.metadata?.method || 'Unknown',
    faqHit: result.response?.metadata?.method === 'faq',
    response: result.success ? result.response.response : null,
    error: result.error || null,
    timestamp: new Date().toISOString()
  };
  
  // Display result
  if (result.success) {
    const timeColor = result.responseTime < 1 ? '#10b981' : (result.responseTime < 3 ? '#f59e0b' : '#ef4444');
    console.log(`%c✅ SUCCESS`, 'color: #10b981; font-weight: bold');
    console.log(`%c⏱️  Response Time: ${result.responseTime.toFixed(3)}s`, `color: ${timeColor}; font-weight: bold`);
    console.log(`%c📋 Method: ${testResult.method}`, `color: ${testResult.faqHit ? '#10b981' : '#ef4444'}`);
    
    if (result.responseTime > 1 && testResult.faqHit) {
      console.log(`%c⚠️  Warning: FAQ response took >1s (expected <1s)`, 'color: #f59e0b');
    }
    
    if (!testResult.faqHit) {
      console.log(`%c❌ ALERT: FAQ question went to RAG! This should be instant!`, 'color: #ef4444; font-weight: bold');
    }
    
    // Show response preview
    const preview = result.response.response?.substring(0, 100) + '...';
    console.log(`%cResponse: ${preview}`, 'color: #6b7280; font-style: italic');
  } else {
    console.log(`%c❌ FAILED: ${result.error}`, 'color: #ef4444; font-weight: bold');
  }
  
  results.faq_tests.push(testResult);
  
  // Wait 1 second between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return testResult;
}

/**
 * Test RAG question
 */
async function testRAGQuestion(question, index, total) {
  console.log(`\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #a855f7; font-weight: bold');
  console.log(`%cRAG Test ${index + 1}/${total}`, 'color: #a855f7; font-weight: bold; font-size: 14px');
  console.log(`%cQuestion: "${question}"`, 'color: #06b6d4');
  console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #a855f7; font-weight: bold');
  
  const result = await sendChatMessage(question);
  
  const testResult = {
    question: question,
    success: result.success,
    responseTime: result.responseTime,
    method: result.response?.metadata?.method || 'Unknown',
    response: result.success ? result.response.response : null,
    error: result.error || null,
    timestamp: new Date().toISOString()
  };
  
  // Display result
  if (result.success) {
    const timeColor = result.responseTime < 8 ? '#10b981' : (result.responseTime < 15 ? '#f59e0b' : '#ef4444');
    console.log(`%c✅ SUCCESS`, 'color: #10b981; font-weight: bold');
    console.log(`%c⏱️  Response Time: ${result.responseTime.toFixed(3)}s`, `color: ${timeColor}; font-weight: bold`);
    console.log(`%c🔍 Method: ${testResult.method}`, 'color: #10b981');
    
    if (result.responseTime > 15) {
      console.log(`%c⚠️  Warning: RAG response took >15s (expected 2-8s)`, 'color: #ef4444');
    }
    
    // Show response preview
    const preview = result.response.response?.substring(0, 150) + '...';
    console.log(`%cResponse: ${preview}`, 'color: #6b7280; font-style: italic');
  } else {
    console.log(`%c❌ FAILED: ${result.error}`, 'color: #ef4444; font-weight: bold');
  }
  
  results.rag_tests.push(testResult);
  
  // Wait 2 seconds between RAG tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return testResult;
}

/**
 * Calculate summary statistics
 */
function calculateSummary() {
  // FAQ statistics
  const faqTimes = results.faq_tests
    .filter(t => t.success)
    .map(t => t.responseTime);
  
  const faqAvgTime = faqTimes.length > 0
    ? (faqTimes.reduce((a, b) => a + b, 0) / faqTimes.length)
    : 0;
  
  const faqHits = results.faq_tests.filter(t => t.faqHit).length;
  const faqHitRate = results.faq_tests.length > 0
    ? (faqHits / results.faq_tests.length) * 100
    : 0;
  
  // RAG statistics
  const ragTimes = results.rag_tests
    .filter(t => t.success)
    .map(t => t.responseTime);
  
  const ragAvgTime = ragTimes.length > 0
    ? (ragTimes.reduce((a, b) => a + b, 0) / ragTimes.length)
    : 0;
  
  // Overall statistics
  const totalTests = results.faq_tests.length + results.rag_tests.length;
  const passed = results.faq_tests.filter(t => t.success).length + results.rag_tests.filter(t => t.success).length;
  const failed = totalTests - passed;
  
  results.summary = {
    total_tests: totalTests,
    passed: passed,
    failed: failed,
    faq_tests_total: results.faq_tests.length,
    rag_tests_total: results.rag_tests.length,
    faq_passed: results.faq_tests.filter(t => t.success).length,
    rag_passed: results.rag_tests.filter(t => t.success).length,
    faq_avg_time: faqAvgTime,
    rag_avg_time: ragAvgTime,
    faq_hit_rate: faqHitRate,
    speedup: ragAvgTime / faqAvgTime
  };
}

/**
 * Display final report
 */
function displayReport() {
  console.log(`\n\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #06b6d4; font-weight: bold; font-size: 16px');
  console.log(`%c           📊 CHATBOT PERFORMANCE TEST REPORT           `, 'color: #06b6d4; font-weight: bold; font-size: 16px');
  console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #06b6d4; font-weight: bold; font-size: 16px');
  
  console.log(`\n%cOverall Summary:`, 'font-weight: bold; font-size: 14px');
  console.log(`  Total Tests: ${results.summary.total_tests}`);
  console.log(`  %cPassed: ${results.summary.passed}`, 'color: #10b981');
  console.log(`  %cFailed: ${results.summary.failed}`, 'color: #ef4444');
  console.log(`  Success Rate: ${((results.summary.passed / results.summary.total_tests) * 100).toFixed(1)}%`);
  
  console.log(`\n%cFAQ Tests (${results.summary.faq_tests_total} questions):`, 'color: #3b82f6; font-weight: bold; font-size: 14px');
  console.log(`  %cPassed: ${results.summary.faq_passed}`, 'color: #10b981');
  console.log(`  %cAverage Response Time: ${results.summary.faq_avg_time.toFixed(3)}s`, 'color: #10b981; font-weight: bold');
  console.log(`  %cFAQ Hit Rate: ${results.summary.faq_hit_rate.toFixed(1)}%`, results.summary.faq_hit_rate >= 90 ? 'color: #10b981' : 'color: #ef4444');
  console.log(`  ${results.summary.faq_hit_rate >= 90 ? '✅' : '❌'} Target: >90% FAQ hit rate`);
  
  console.log(`\n%cRAG Tests (${results.summary.rag_tests_total} questions):`, 'color: #a855f7; font-weight: bold; font-size: 14px');
  console.log(`  %cPassed: ${results.summary.rag_passed}`, 'color: #10b981');
  console.log(`  %cAverage Response Time: ${results.summary.rag_avg_time.toFixed(3)}s`, results.summary.rag_avg_time < 8 ? 'color: #10b981' : 'color: #f59e0b');
  console.log(`  ${results.summary.rag_avg_time < 8 ? '✅' : '⚠️'} Target: 2-8s response time`);
  
  console.log(`\n%cPerformance Analysis:`, 'font-weight: bold; font-size: 14px');
  console.log(`  %cFAQ is ${results.summary.speedup.toFixed(1)}x faster than RAG`, 'color: #10b981; font-weight: bold');
  
  if (results.summary.faq_avg_time < 1) {
    console.log(`  %c✅ FAQ responses are instant (<1s)`, 'color: #10b981');
  } else {
    console.log(`  %c❌ FAQ responses are too slow (>${results.summary.faq_avg_time.toFixed(2)}s)`, 'color: #ef4444');
  }
  
  if (results.summary.faq_hit_rate >= 90) {
    console.log(`  %c✅ FAQ hit rate is excellent (>90%)`, 'color: #10b981');
  } else {
    console.log(`  %c❌ FAQ hit rate needs improvement (<90%)`, 'color: #ef4444');
  }
  
  if (results.summary.rag_avg_time <= 8) {
    console.log(`  %c✅ RAG responses are within target (2-8s)`, 'color: #10b981');
  } else {
    console.log(`  %c⚠️  RAG responses are slower than target (>8s)`, 'color: #f59e0b');
  }
  
  console.log(`\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #06b6d4; font-weight: bold');
  
  // Return results for further analysis
  return results;
}

/**
 * Main test runner
 */
async function runChatbotTests() {
  console.clear();
  console.log(`%c╔════════════════════════════════════════════════════════════╗`, 'color: #06b6d4; font-weight: bold; font-size: 16px');
  console.log(`%c║     SHELTR CHATBOT PERFORMANCE TEST SUITE                 ║`, 'color: #06b6d4; font-weight: bold; font-size: 16px');
  console.log(`%c╚════════════════════════════════════════════════════════════╝`, 'color: #06b6d4; font-weight: bold; font-size: 16px');
  
  // Check backend health
  console.log(`\n%c🔍 Checking backend health...`, 'color: #f59e0b');
  try {
    const healthCheck = await fetch('http://localhost:8000/health');
    if (!healthCheck.ok) {
      throw new Error('Backend not responding');
    }
    console.log(`%c✅ Backend is healthy`, 'color: #10b981');
  } catch (error) {
    console.log(`%c❌ Backend is not responding at http://localhost:8000`, 'color: #ef4444');
    console.log(`%cPlease start the backend with: ./start-dev.sh`, 'color: #f59e0b');
    return;
  }
  
  // Run FAQ tests
  console.log(`\n%c═══════════════════════════════════════════════════════════`, 'color: #3b82f6; font-weight: bold');
  console.log(`%c  PHASE 1: FAQ TESTS (${FAQ_QUESTIONS.length} questions)`, 'color: #3b82f6; font-weight: bold; font-size: 14px');
  console.log(`%c  Expected: <1s response time, FAQ hit`, 'color: #3b82f6');
  console.log(`%c═══════════════════════════════════════════════════════════`, 'color: #3b82f6; font-weight: bold');
  
  for (let i = 0; i < FAQ_QUESTIONS.length; i++) {
    await testFAQQuestion(FAQ_QUESTIONS[i], i, FAQ_QUESTIONS.length);
  }
  
  // Run RAG tests
  console.log(`\n%c═══════════════════════════════════════════════════════════`, 'color: #a855f7; font-weight: bold');
  console.log(`%c  PHASE 2: RAG TESTS (${RAG_QUESTIONS.length} questions)`, 'color: #a855f7; font-weight: bold; font-size: 14px');
  console.log(`%c  Expected: 2-8s response time, detailed answers`, 'color: #a855f7');
  console.log(`%c═══════════════════════════════════════════════════════════`, 'color: #a855f7; font-weight: bold');
  
  for (let i = 0; i < RAG_QUESTIONS.length; i++) {
    await testRAGQuestion(RAG_QUESTIONS[i], i, RAG_QUESTIONS.length);
  }
  
  // Calculate summary and display report
  calculateSummary();
  const finalResults = displayReport();
  
  console.log(`\n%c💾 Results saved to window.chatbotTestResults`, 'color: #10b981');
  console.log(`%cAccess with: window.chatbotTestResults`, 'color: #6b7280; font-style: italic');
  
  // Store results globally
  window.chatbotTestResults = finalResults;
  
  return finalResults;
}

// Export for use
console.log(`%c✅ Chatbot test suite loaded!`, 'color: #10b981; font-weight: bold; font-size: 14px');
console.log(`%cRun tests with: await runChatbotTests()`, 'color: #06b6d4; font-weight: bold');
console.log(`%cOr test single question: await sendChatMessage("What is SHELTR?")`, 'color: #6b7280; font-style: italic');

