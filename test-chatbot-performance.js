#!/usr/bin/env node

/**
 * SHELTR Chatbot Performance Test Suite
 * 
 * Tests both FAQ (instant) and RAG (slower) responses
 * Monitors backend logs in real-time
 * Generates performance report
 * 
 * Usage: node test-chatbot-performance.js
 */

const axios = require('axios');
const fs = require('fs');
const { spawn } = require('child_process');

// Configuration
const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:3000';
const LOG_FILE = './logs/backend.log';
const RESULTS_FILE = './test-results-chatbot.json';

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
  "Which blockchain does SHELTR use?",
  "Is my donation tax deductible?",
  "Can I set up recurring donations?",
  "How does the housing fund work?",
  "What cities is SHELTR in?",
  "How do shelters join SHELTR?",
  "What payment methods do you accept?",
  "How do I track my donation?",
  "Can I donate anonymously?",
  "How does the virtual debit card work?",
  "What are the security features?"
];

const RAG_QUESTIONS = [
  "Explain how the blockchain verifies my donation and what smart contracts are involved",
  "Compare SHELTR to traditional homeless charities in terms of efficiency and impact",
  "Walk me through the complete journey from someone being homeless to getting a pod",
  "How does SHELTR's governance system work and who has voting power?",
  "What happens to my donation if a participant leaves the program before using their housing fund?",
  "How does SHELTR ensure participant privacy while maintaining blockchain transparency?",
  "Explain the technical architecture of the PODS housing units in detail",
  "How does the 4-6% housing fund return guarantee work and who provides it?"
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  faq_tests: [],
  rag_tests: [],
  summary: {
    total_tests: 0,
    passed: 0,
    failed: 0,
    faq_avg_time: 0,
    rag_avg_time: 0,
    faq_hit_rate: 0
  }
};

// Log monitoring
let logTail = null;
let currentTestLogs = [];

/**
 * Start monitoring backend logs
 */
function startLogMonitoring() {
  console.log(`${colors.cyan}📊 Starting backend log monitoring...${colors.reset}\n`);
  
  logTail = spawn('tail', ['-f', LOG_FILE]);
  
  logTail.stdout.on('data', (data) => {
    const logLine = data.toString();
    currentTestLogs.push(logLine);
    
    // Highlight important log lines
    if (logLine.includes('FAQ HIT')) {
      console.log(`${colors.green}✅ ${logLine.trim()}${colors.reset}`);
    } else if (logLine.includes('FAQ MISS')) {
      console.log(`${colors.yellow}⚠️  ${logLine.trim()}${colors.reset}`);
    } else if (logLine.includes('ERROR')) {
      console.log(`${colors.red}❌ ${logLine.trim()}${colors.reset}`);
    } else if (logLine.includes('Slow request')) {
      console.log(`${colors.magenta}⏱️  ${logLine.trim()}${colors.reset}`);
    }
  });
  
  logTail.stderr.on('data', (data) => {
    console.error(`${colors.red}Log Monitor Error: ${data}${colors.reset}`);
  });
}

/**
 * Stop monitoring backend logs
 */
function stopLogMonitoring() {
  if (logTail) {
    logTail.kill();
    console.log(`\n${colors.cyan}📊 Stopped backend log monitoring${colors.reset}\n`);
  }
}

/**
 * Check if backend is healthy
 */
async function checkBackendHealth() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Send message to public chatbot
 */
async function sendPublicChatMessage(message) {
  const startTime = Date.now();
  currentTestLogs = []; // Reset logs for this test
  
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/chatbot/public`,
      {
        message: message,
        user_id: `test_user_${Date.now()}`,
        conversation_id: `test_conv_${Date.now()}`
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Convert to seconds
    
    return {
      success: true,
      response: response.data,
      responseTime: responseTime,
      logs: [...currentTestLogs]
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
    
    return {
      success: false,
      error: error.message,
      responseTime: responseTime,
      logs: [...currentTestLogs]
    };
  }
}

/**
 * Test a single FAQ question
 */
async function testFAQQuestion(question, index, total) {
  console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}FAQ Test ${index + 1}/${total}${colors.reset}`);
  console.log(`${colors.cyan}Question: "${question}"${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  const result = await sendPublicChatMessage(question);
  
  // Analyze logs to determine if FAQ was hit
  const faqHit = result.logs.some(log => log.includes('FAQ HIT') || log.includes('FAQ match found'));
  const faqMiss = result.logs.some(log => log.includes('FAQ MISS'));
  
  const testResult = {
    question: question,
    success: result.success,
    responseTime: result.responseTime,
    faqHit: faqHit,
    faqMiss: faqMiss,
    method: faqHit ? 'FAQ' : (faqMiss ? 'RAG (FAQ Miss)' : 'Unknown'),
    response: result.success ? result.response.response : null,
    error: result.error || null,
    timestamp: new Date().toISOString()
  };
  
  // Display result
  if (result.success) {
    const timeColor = result.responseTime < 1 ? colors.green : (result.responseTime < 3 ? colors.yellow : colors.red);
    console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
    console.log(`${timeColor}⏱️  Response Time: ${result.responseTime.toFixed(2)}s${colors.reset}`);
    console.log(`${faqHit ? colors.green : colors.red}📋 Method: ${testResult.method}${colors.reset}`);
    
    if (result.responseTime > 1 && faqHit) {
      console.log(`${colors.yellow}⚠️  Warning: FAQ response took >1s (expected <1s)${colors.reset}`);
    }
    
    if (!faqHit) {
      console.log(`${colors.red}❌ ALERT: FAQ question went to RAG! This should be instant!${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}❌ FAILED: ${result.error}${colors.reset}`);
  }
  
  results.faq_tests.push(testResult);
  results.summary.total_tests++;
  if (result.success) results.summary.passed++;
  else results.summary.failed++;
  
  // Wait 1 second between tests to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return testResult;
}

/**
 * Test a single RAG question
 */
async function testRAGQuestion(question, index, total) {
  console.log(`\n${colors.bright}${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}RAG Test ${index + 1}/${total}${colors.reset}`);
  console.log(`${colors.cyan}Question: "${question}"${colors.reset}`);
  console.log(`${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  const result = await sendPublicChatMessage(question);
  
  // Analyze logs
  const faqHit = result.logs.some(log => log.includes('FAQ HIT'));
  const ragUsed = result.logs.some(log => log.includes('RAG') || log.includes('Knowledge search') || log.includes('embeddings'));
  
  const testResult = {
    question: question,
    success: result.success,
    responseTime: result.responseTime,
    method: faqHit ? 'FAQ (Unexpected!)' : (ragUsed ? 'RAG' : 'Unknown'),
    response: result.success ? result.response.response : null,
    error: result.error || null,
    timestamp: new Date().toISOString()
  };
  
  // Display result
  if (result.success) {
    const timeColor = result.responseTime < 8 ? colors.green : (result.responseTime < 15 ? colors.yellow : colors.red);
    console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
    console.log(`${timeColor}⏱️  Response Time: ${result.responseTime.toFixed(2)}s${colors.reset}`);
    console.log(`${ragUsed ? colors.green : colors.yellow}🔍 Method: ${testResult.method}${colors.reset}`);
    
    if (result.responseTime > 15) {
      console.log(`${colors.red}⚠️  Warning: RAG response took >15s (expected 2-8s)${colors.reset}`);
    }
    
    if (faqHit) {
      console.log(`${colors.yellow}⚠️  Note: Complex question got FAQ response (may be too simple)${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}❌ FAILED: ${result.error}${colors.reset}`);
  }
  
  results.rag_tests.push(testResult);
  results.summary.total_tests++;
  if (result.success) results.summary.passed++;
  else results.summary.failed++;
  
  // Wait 2 seconds between RAG tests (they're more expensive)
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
  
  results.summary.faq_avg_time = faqTimes.length > 0
    ? (faqTimes.reduce((a, b) => a + b, 0) / faqTimes.length)
    : 0;
  
  const faqHits = results.faq_tests.filter(t => t.faqHit).length;
  results.summary.faq_hit_rate = results.faq_tests.length > 0
    ? (faqHits / results.faq_tests.length) * 100
    : 0;
  
  // RAG statistics
  const ragTimes = results.rag_tests
    .filter(t => t.success)
    .map(t => t.responseTime);
  
  results.summary.rag_avg_time = ragTimes.length > 0
    ? (ragTimes.reduce((a, b) => a + b, 0) / ragTimes.length)
    : 0;
  
  // Overall statistics
  results.summary.faq_tests_total = results.faq_tests.length;
  results.summary.rag_tests_total = results.rag_tests.length;
  results.summary.faq_passed = results.faq_tests.filter(t => t.success).length;
  results.summary.rag_passed = results.rag_tests.filter(t => t.success).length;
}

/**
 * Display final report
 */
function displayReport() {
  console.log(`\n\n${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}           📊 CHATBOT PERFORMANCE TEST REPORT           ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  // Overall Summary
  console.log(`${colors.bright}Overall Summary:${colors.reset}`);
  console.log(`  Total Tests: ${results.summary.total_tests}`);
  console.log(`  ${colors.green}Passed: ${results.summary.passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${results.summary.failed}${colors.reset}`);
  console.log(`  Success Rate: ${((results.summary.passed / results.summary.total_tests) * 100).toFixed(1)}%\n`);
  
  // FAQ Summary
  console.log(`${colors.bright}${colors.blue}FAQ Tests (${results.summary.faq_tests_total} questions):${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${results.summary.faq_passed}${colors.reset}`);
  console.log(`  Average Response Time: ${colors.green}${results.summary.faq_avg_time.toFixed(3)}s${colors.reset}`);
  console.log(`  FAQ Hit Rate: ${results.summary.faq_hit_rate >= 90 ? colors.green : colors.red}${results.summary.faq_hit_rate.toFixed(1)}%${colors.reset}`);
  console.log(`  ${results.summary.faq_hit_rate >= 90 ? '✅' : '❌'} Target: >90% FAQ hit rate\n`);
  
  // RAG Summary
  console.log(`${colors.bright}${colors.magenta}RAG Tests (${results.summary.rag_tests_total} questions):${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${results.summary.rag_passed}${colors.reset}`);
  console.log(`  Average Response Time: ${results.summary.rag_avg_time < 8 ? colors.green : colors.yellow}${results.summary.rag_avg_time.toFixed(3)}s${colors.reset}`);
  console.log(`  ${results.summary.rag_avg_time < 8 ? '✅' : '⚠️'} Target: 2-8s response time\n`);
  
  // Performance Analysis
  console.log(`${colors.bright}Performance Analysis:${colors.reset}`);
  
  const speedup = results.summary.rag_avg_time / results.summary.faq_avg_time;
  console.log(`  FAQ is ${colors.green}${speedup.toFixed(1)}x faster${colors.reset} than RAG`);
  
  if (results.summary.faq_avg_time < 1) {
    console.log(`  ${colors.green}✅ FAQ responses are instant (<1s)${colors.reset}`);
  } else {
    console.log(`  ${colors.red}❌ FAQ responses are too slow (>${results.summary.faq_avg_time.toFixed(2)}s)${colors.reset}`);
  }
  
  if (results.summary.faq_hit_rate >= 90) {
    console.log(`  ${colors.green}✅ FAQ hit rate is excellent (>90%)${colors.reset}`);
  } else {
    console.log(`  ${colors.red}❌ FAQ hit rate needs improvement (<90%)${colors.reset}`);
  }
  
  if (results.summary.rag_avg_time <= 8) {
    console.log(`  ${colors.green}✅ RAG responses are within target (2-8s)${colors.reset}`);
  } else {
    console.log(`  ${colors.yellow}⚠️  RAG responses are slower than target (>8s)${colors.reset}`);
  }
  
  // Cost Estimation
  console.log(`\n${colors.bright}Cost Estimation (1000 queries/day):${colors.reset}`);
  const faqCost = 0.0001; // $0.0001 per FAQ query
  const ragCost = 0.01;   // $0.01 per RAG query
  
  const currentMix = results.summary.faq_hit_rate / 100;
  const currentDailyCost = (1000 * currentMix * faqCost) + (1000 * (1 - currentMix) * ragCost);
  const optimalDailyCost = (1000 * 0.9 * faqCost) + (1000 * 0.1 * ragCost);
  
  console.log(`  Current (${results.summary.faq_hit_rate.toFixed(0)}% FAQ): $${(currentDailyCost * 30).toFixed(2)}/month`);
  console.log(`  Optimal (90% FAQ): $${(optimalDailyCost * 30).toFixed(2)}/month`);
  console.log(`  Potential Savings: $${((currentDailyCost - optimalDailyCost) * 30).toFixed(2)}/month\n`);
  
  console.log(`${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  // Save results to file
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log(`${colors.green}✅ Results saved to: ${RESULTS_FILE}${colors.reset}\n`);
}

/**
 * Main test execution
 */
async function runTests() {
  console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║     SHELTR CHATBOT PERFORMANCE TEST SUITE                 ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Check backend health
  console.log(`${colors.yellow}🔍 Checking backend health...${colors.reset}`);
  const isHealthy = await checkBackendHealth();
  
  if (!isHealthy) {
    console.log(`${colors.red}❌ Backend is not responding at ${BACKEND_URL}${colors.reset}`);
    console.log(`${colors.yellow}Please start the backend with: ./start-dev.sh${colors.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Backend is healthy${colors.reset}\n`);
  
  // Start log monitoring
  startLogMonitoring();
  
  // Wait a moment for log monitoring to start
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run FAQ tests
  console.log(`\n${colors.bright}${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}  PHASE 1: FAQ TESTS (${FAQ_QUESTIONS.length} questions)${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}  Expected: <1s response time, FAQ hit${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  
  for (let i = 0; i < FAQ_QUESTIONS.length; i++) {
    await testFAQQuestion(FAQ_QUESTIONS[i], i, FAQ_QUESTIONS.length);
  }
  
  // Run RAG tests
  console.log(`\n${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}  PHASE 2: RAG TESTS (${RAG_QUESTIONS.length} questions)${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}  Expected: 2-8s response time, detailed answers${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  
  for (let i = 0; i < RAG_QUESTIONS.length; i++) {
    await testRAGQuestion(RAG_QUESTIONS[i], i, RAG_QUESTIONS.length);
  }
  
  // Stop log monitoring
  stopLogMonitoring();
  
  // Calculate summary
  calculateSummary();
  
  // Display report
  displayReport();
  
  // Exit
  process.exit(0);
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error(`${colors.red}Uncaught Exception: ${error.message}${colors.reset}`);
  stopLogMonitoring();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Test interrupted by user${colors.reset}`);
  stopLogMonitoring();
  process.exit(0);
});

// Run the tests
runTests().catch((error) => {
  console.error(`${colors.red}Test execution failed: ${error.message}${colors.reset}`);
  stopLogMonitoring();
  process.exit(1);
});

