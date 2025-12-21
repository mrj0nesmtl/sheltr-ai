# 🚀 Quick Test Guide - SHELTR Chatbot

**Use this guide while testing!**

---

## 🎯 **Phase 1: Dashboard Gemini (5 minutes)**

### **Quick Test**
1. Go to `http://localhost:3000/dashboard/chatbots`
2. Click "New Chat"
3. Select **"Gemini 2.5 Flash ⚡"** from dropdown
4. Choose **"General Assistant"**
5. Ask: **"What is SHELTR?"**
6. ✅ **Expected**: Response in 1-2 seconds, no errors

### **If it works**: ✅ Gemini is working!
### **If it fails**: Check backend logs for Gemini errors

---

## 🌐 **Phase 2: Public Chatbot (3 minutes)**

### **Test 1: Anonymous User**
1. Open **incognito window**
2. Go to `http://localhost:3000`
3. Click chatbot widget (bottom right)
4. Ask: **"What is SHELTR?"**
5. ✅ **Expected**: No name shown, generic welcome, FAQ response <1s

### **Test 2: Authenticated User (You!)**
1. **Normal browser** (logged in as Joel)
2. Go to `http://localhost:3000`
3. Click chatbot widget
4. ✅ **Expected**: "Welcome, Joel", "SUPER ADMIN" badge
5. Ask: **"Show me platform analytics"**
6. ✅ **Expected**: Admin-focused response, may offer MCP tools

---

## 🔍 **Phase 3: FAQ Testing (10 minutes)**

### **Quick FAQ Tests** (Should be <1s each)

Copy/paste these into the **public chatbot**:

```
when does sheltr launch?
what are PODS?
how do i become a participant?
why should i donate through sheltr?
how much of my donation goes to participants?
is my donation tax deductible?
what is the smartfund model?
which blockchain does sheltr use?
```

### **✅ Success Indicators**:
- Response time: <1 second
- Confident, specific answers
- No "I don't know" responses

### **❌ Failure Indicators**:
- Response time: >2 seconds (went to RAG instead of FAQ)
- Vague or uncertain answers
- "Let me search..." messages

---

## 🧠 **Phase 3: RAG Testing (5 minutes)**

### **Complex Questions** (Should be 2-8s)

Copy/paste these into the **public chatbot**:

```
explain how the blockchain verifies my donation and what smart contracts are involved

compare sheltr to traditional homeless charities in terms of efficiency and impact

walk me through the complete journey from someone being homeless to getting a pod
```

### **✅ Success Indicators**:
- Response time: 2-8 seconds
- Detailed, comprehensive answers
- May mention searching knowledge base
- Cites specific sources

### **❌ Failure Indicators**:
- Response time: >10 seconds (timeout)
- Generic or incomplete answers
- Error messages

---

## 📊 **Quick Results Checklist**

### **Dashboard Gemini**
- [ ] Gemini models appear in dropdown
- [ ] Can create new chat with Gemini
- [ ] Responses work (no errors)
- [ ] Speed is good (1-2s)

### **Public Chatbot**
- [ ] Anonymous users work
- [ ] Authenticated users recognized
- [ ] Name and role badge show
- [ ] Role-appropriate responses

### **FAQ Service**
- [ ] FAQ questions answer quickly (<1s)
- [ ] Answers are accurate
- [ ] Hit rate >90% (most questions match)

### **RAG Service**
- [ ] Complex questions work (2-8s)
- [ ] Detailed answers provided
- [ ] Knowledge base searched
- [ ] No timeouts or errors

---

## 🐛 **Common Issues & Quick Fixes**

### **Issue**: Gemini falls back to OpenAI
**Fix**: Add Gemini API key to `apps/api/.env`
```bash
GEMINI_API_KEY=your-key-here
```

### **Issue**: Backend not responding
**Check**: `curl http://localhost:8000/health`
**Fix**: Restart backend: `./stop-dev.sh && ./start-dev.sh`

### **Issue**: FAQ misses too many questions
**Note**: Which questions failed
**Fix**: Add new FAQ patterns (later)

### **Issue**: RAG times out
**Check**: Backend logs for errors
**Fix**: May need to optimize search or increase timeout

---

## ✅ **Success = All Green!**

If all phases pass:
- ✅ Gemini integration working
- ✅ Public chatbot working
- ✅ FAQ service working (>90% hit rate)
- ✅ RAG service working
- ✅ **Ready for production!**

---

## 📝 **Report Template**

After testing, report:

```
✅ Phase 1: Gemini Dashboard - [PASS/FAIL]
   - Gemini 2.5 Flash: [PASS/FAIL]
   - Response time: [X seconds]
   - Issues: [None / List issues]

✅ Phase 2: Public Chatbot - [PASS/FAIL]
   - Anonymous user: [PASS/FAIL]
   - Authenticated user: [PASS/FAIL]
   - Role recognition: [PASS/FAIL]
   - Issues: [None / List issues]

✅ Phase 3: FAQ Testing - [PASS/FAIL]
   - Questions tested: [X/22]
   - Hit rate: [X%]
   - Avg response time: [X ms]
   - Issues: [None / List issues]

✅ Phase 3: RAG Testing - [PASS/FAIL]
   - Questions tested: [X/8]
   - Success rate: [X%]
   - Avg response time: [X seconds]
   - Issues: [None / List issues]
```

---

**Ready to test!** 🚀

Start with Phase 1 (easiest), then Phase 2, then Phase 3.

