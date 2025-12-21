# 🧪 SHELTR Chatbot - Comprehensive Test Plan

**Date**: November 24, 2025  
**Version**: 2.138.0  
**Status**: 🔄 In Progress

---

## 📋 **Test Overview**

### **Three-Phase Testing**
1. **Dashboard Gemini Models** - Test new Gemini integration
2. **Public Chatbot** - Test authenticated user recognition
3. **FAQ & RAG Integration** - Test orchestrator with 30 questions

---

## 🎯 **Phase 1: Dashboard Gemini Testing**

### **Objective**
Verify Gemini 2.5 Flash models work with all 5 dashboard agents.

### **Test Cases**

#### **Test 1.1: Gemini 2.5 Flash with General Assistant**
- **Model**: Gemini 2.5 Flash ⚡
- **Agent**: General Assistant (blue badge)
- **Question**: "What is SHELTR and how does it work?"
- **Expected**: 
  - Response in 1-2 seconds
  - Clear, concise explanation
  - No errors
- **Status**: ⏳ Pending

#### **Test 1.2: Gemini 2.5 Flash-Lite with SHELTR Support**
- **Model**: Gemini 2.5 Flash-Lite 🚀
- **Agent**: SHELTR Support (green badge)
- **Question**: "Explain the SmartFund 80/15/5 allocation model"
- **Expected**:
  - Response in 0.5-1 seconds (faster than Flash)
  - Accurate SmartFund breakdown
  - SHELTR-specific knowledge
- **Status**: ⏳ Pending

#### **Test 1.3: Gemini with Technical Expert**
- **Model**: Gemini 2.5 Flash ⚡
- **Agent**: Technical Expert (purple badge)
- **Question**: "How is the RAG orchestrator implemented in the backend?"
- **Expected**:
  - Technical, code-focused response
  - Mentions Python, FastAPI, OpenAI
  - Detailed architecture explanation
- **Status**: ⏳ Pending

#### **Test 1.4: Gemini with Business Analyst**
- **Model**: Gemini 2.5 Flash ⚡
- **Agent**: Business Analyst (orange badge)
- **Question**: "Analyze the cost-effectiveness of PODS deployment vs traditional shelters"
- **Expected**:
  - Data-driven analysis
  - ROI considerations
  - Strategic insights
- **Status**: ⏳ Pending

#### **Test 1.5: Gemini with Creative Writer**
- **Model**: Gemini 2.5 Flash-Lite 🚀
- **Agent**: Creative Writer (pink badge)
- **Question**: "Write a compelling donor thank-you email for a $500 donation"
- **Expected**:
  - Engaging, emotional tone
  - Brand-appropriate language
  - Call-to-action included
- **Status**: ⏳ Pending

#### **Test 1.6: Multi-turn Conversation**
- **Model**: Gemini 2.5 Flash ⚡
- **Agent**: General Assistant
- **Questions**:
  1. "What are PODS?"
  2. "How much do they cost?"
  3. "Where are they deployed?"
- **Expected**:
  - Context preserved across messages
  - Coherent conversation flow
  - No memory loss
- **Status**: ⏳ Pending

#### **Test 1.7: Fallback to OpenAI**
- **Scenario**: Gemini service fails (no API key or error)
- **Expected**:
  - Automatic fallback to OpenAI
  - User doesn't see error
  - Response still generated
- **Status**: ⏳ Pending

---

## 🌐 **Phase 2: Public Chatbot Testing**

### **Objective**
Verify public chatbot recognizes authenticated users and adapts behavior.

### **Test Cases**

#### **Test 2.1: Anonymous User**
- **Setup**: Open incognito window
- **URL**: `http://localhost:3000`
- **Action**: Click chatbot widget
- **Question**: "What is SHELTR?"
- **Expected**:
  - No user name shown
  - No role badge
  - Generic welcome message
  - FAQ response (<1s)
- **Status**: ⏳ Pending

#### **Test 2.2: Authenticated User (Super Admin)**
- **Setup**: Login as Joel Yaffe (Super Admin)
- **URL**: `http://localhost:3000`
- **Action**: Click chatbot widget
- **Question**: "Show me platform analytics"
- **Expected**:
  - Shows "Welcome, Joel" ✅
  - Shows "SUPER ADMIN" badge ✅
  - Offers MCP tools (analytics, data queries)
  - Enhanced response with admin context
- **Status**: ⏳ Pending

#### **Test 2.3: Authenticated User (Donor)**
- **Setup**: Login as donor user
- **URL**: `http://localhost:3000`
- **Action**: Click chatbot widget
- **Question**: "How can I make a donation?"
- **Expected**:
  - Shows user name
  - Shows "DONOR" badge
  - Personalized donor-focused response
  - Links to donation page
- **Status**: ⏳ Pending

#### **Test 2.4: Role Detection**
- **Setup**: Authenticated user
- **Question**: "I'm homeless and need help"
- **Expected**:
  - Detects participant intent
  - Compassionate, supportive tone
  - Emergency escalation if needed
  - Participant-specific resources
- **Status**: ⏳ Pending

---

## 🔍 **Phase 3: FAQ & RAG Integration Testing**

### **Objective**
Test orchestrator with 30 questions (22 FAQ, 8 RAG).

### **FAQ Questions (Expected <1s)**

#### **Platform Status**
1. ✅ "when does sheltr launch?"
   - **Expected**: FAQ match, mentions 2026-2027
   - **Agent**: `faq_platform_info`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

2. ✅ "is sheltr available now?"
   - **Expected**: FAQ match, pre-launch status
   - **Agent**: `faq_platform_info`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

#### **Ecosystem**
3. ✅ "what is the sheltr ecosystem?"
   - **Expected**: FAQ match, overview of PODS/MOBI/platform
   - **Agent**: `faq_ecosystem`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

4. ✅ "what are PODS?"
   - **Expected**: FAQ match, modular housing explanation
   - **Agent**: `faq_ecosystem`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

5. ✅ "what are MOBI bikes?"
   - **Expected**: FAQ match, mobility solution
   - **Agent**: `faq_ecosystem`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

#### **Participation**
6. ✅ "how do i become a participant?"
   - **Expected**: FAQ match, onboarding steps
   - **Agent**: `faq_participant`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

7. ✅ "how does the virtual debit card work?"
   - **Expected**: FAQ match, card access explanation
   - **Agent**: `faq_participant`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

#### **Donations**
8. ✅ "why should i donate through sheltr?"
   - **Expected**: FAQ match, value proposition
   - **Agent**: `faq_donor`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

9. ✅ "how much of my donation goes to participants?"
   - **Expected**: FAQ match, 80/15/5 breakdown
   - **Agent**: `faq_donor`
   - **Time**: <500ms
   - **Status**: ⏳ Pending

10. ✅ "is my donation tax deductible?"
    - **Expected**: FAQ match, tax info
    - **Agent**: `faq_donor`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

11. ✅ "how do i track my donation?"
    - **Expected**: FAQ match, blockchain tracking
    - **Agent**: `faq_donor`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

12. ✅ "can i donate anonymously?"
    - **Expected**: FAQ match, privacy options
    - **Agent**: `faq_donor`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

13. ✅ "what payment methods do you accept?"
    - **Expected**: FAQ match, payment options
    - **Agent**: `faq_donor`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

14. ✅ "can i set up recurring donations?"
    - **Expected**: FAQ match, recurring gift info
    - **Agent**: `faq_donor`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

#### **SmartFund**
15. ✅ "what is the smartfund model?"
    - **Expected**: FAQ match, 80/15/5 explanation
    - **Agent**: `faq_smartfund`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

16. ✅ "how does the housing fund work?"
    - **Expected**: FAQ match, 15% allocation
    - **Agent**: `faq_smartfund`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

#### **Technical**
17. ✅ "is my data secure?"
    - **Expected**: FAQ match, security measures
    - **Agent**: `faq_technical`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

18. ✅ "which blockchain does sheltr use?"
    - **Expected**: FAQ match, blockchain info
    - **Agent**: `faq_technical`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

#### **Tokens**
19. ✅ "when do tokens launch?"
    - **Expected**: FAQ match, token timeline
    - **Agent**: `faq_tokens`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

#### **Impact**
20. ✅ "how many people has sheltr helped?"
    - **Expected**: FAQ match, impact metrics
    - **Agent**: `faq_impact`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

#### **Operations**
21. ✅ "what cities is sheltr in?"
    - **Expected**: FAQ match, operating locations
    - **Agent**: `faq_operations`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

22. ✅ "how do shelters join sheltr?"
    - **Expected**: FAQ match, shelter onboarding
    - **Agent**: `faq_operations`
    - **Time**: <500ms
    - **Status**: ⏳ Pending

---

### **RAG Questions (Expected 2-8s)**

#### **Complex Technical**
23. 🔍 "explain how the blockchain verifies my donation and what smart contracts are involved"
    - **Expected**: RAG search, technical depth
    - **Agent**: `rag_orchestrator`
    - **Time**: 2-5s
    - **Sources**: Blockchain docs, smart contract specs
    - **Status**: ⏳ Pending

24. 🔍 "how does sheltr ensure participant privacy while maintaining blockchain transparency?"
    - **Expected**: RAG search, technical balance
    - **Agent**: `rag_orchestrator`
    - **Time**: 2-5s
    - **Sources**: Privacy docs, blockchain architecture
    - **Status**: ⏳ Pending

#### **Comparative Analysis**
25. 🔍 "compare sheltr to traditional homeless charities in terms of efficiency and impact"
    - **Expected**: RAG search + AI analysis
    - **Agent**: `rag_orchestrator`
    - **Time**: 3-8s
    - **Sources**: Impact docs, efficiency metrics
    - **Status**: ⏳ Pending

26. 🔍 "what are the risks of donating through sheltr versus established nonprofits?"
    - **Expected**: RAG search, nuanced discussion
    - **Agent**: `rag_orchestrator`
    - **Time**: 3-8s
    - **Sources**: Risk docs, comparison data
    - **Status**: ⏳ Pending

#### **Complex Financial**
27. 🔍 "how does the 4-6% housing fund return guarantee work and who provides it?"
    - **Expected**: RAG search, financial details
    - **Agent**: `rag_orchestrator`
    - **Time**: 2-5s
    - **Sources**: SmartFund docs, financial model
    - **Status**: ⏳ Pending

#### **Multi-step Process**
28. 🔍 "walk me through the complete journey from someone being homeless to getting a pod"
    - **Expected**: RAG search, comprehensive process
    - **Agent**: `rag_orchestrator`
    - **Time**: 3-8s
    - **Sources**: Participant journey docs, onboarding
    - **Status**: ⏳ Pending

#### **Governance**
29. 🔍 "how does sheltr's governance system work and who has voting power?"
    - **Expected**: RAG search, governance details
    - **Agent**: `rag_orchestrator`
    - **Time**: 2-5s
    - **Sources**: Governance docs, DAO structure
    - **Status**: ⏳ Pending

#### **Edge Cases**
30. 🔍 "what happens to my donation if a participant leaves the program before using their housing fund?"
    - **Expected**: RAG search, edge case handling
    - **Agent**: `rag_orchestrator`
    - **Time**: 2-5s
    - **Sources**: Policy docs, fund management
    - **Status**: ⏳ Pending

---

## 📊 **Success Criteria**

### **Phase 1: Dashboard Gemini**
- ✅ All 5 agents work with Gemini models
- ✅ Response time 1-2s (Flash), 0.5-1s (Flash-Lite)
- ✅ Context preserved in multi-turn conversations
- ✅ Fallback to OpenAI works if Gemini fails
- ✅ No errors or crashes

### **Phase 2: Public Chatbot**
- ✅ Anonymous users get generic experience
- ✅ Authenticated users see name + role badge
- ✅ Role-specific responses (admin, donor, participant)
- ✅ Role detection works (participant intent)
- ✅ MCP tools offered to admins

### **Phase 3: FAQ & RAG**
- ✅ FAQ hit rate: >90% (20/22 questions)
- ✅ FAQ response time: <1s (ideally <500ms)
- ✅ RAG response time: 2-8s
- ✅ RAG sources cited correctly
- ✅ Fallback to AI works if no FAQ/RAG match

---

## 🐛 **Known Issues to Watch For**

### **Potential Issues**
1. **Gemini API Key Missing**
   - Symptom: Falls back to OpenAI
   - Fix: Add `GEMINI_API_KEY` to `.env`

2. **FAQ Misses**
   - Symptom: Question goes to RAG instead of FAQ
   - Fix: Add new FAQ pattern or improve matching

3. **RAG Timeout**
   - Symptom: Response takes >8s or fails
   - Fix: Increase timeout or optimize search

4. **Role Detection Fails**
   - Symptom: Wrong role detected
   - Fix: Improve role classification prompts

---

## 📝 **Test Results Template**

```markdown
### Test: [Test Name]
- **Date**: [Date]
- **Tester**: [Name]
- **Status**: ✅ Pass / ❌ Fail / ⚠️ Partial
- **Response Time**: [Time]
- **Agent Used**: [Agent]
- **Notes**: [Observations]
```

---

## 🚀 **Next Steps**

1. **Execute Phase 1**: Dashboard Gemini testing
2. **Execute Phase 2**: Public chatbot testing
3. **Execute Phase 3**: FAQ & RAG testing (30 questions)
4. **Document Results**: Update this file with results
5. **Fix Issues**: Address any failures
6. **Deploy**: Push to production if all tests pass

---

**Status**: 🔄 Testing In Progress  
**Last Updated**: November 24, 2025  
**Version**: 2.138.0

