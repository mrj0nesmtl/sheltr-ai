# AI Agent Quick Reference Guide

**For:** SHELTR Platform Users  
**Updated:** October 15, 2025

---

## 🎯 Which Agent Should You Use?

| Your Need | Best Agent | Why |
|-----------|------------|-----|
| General platform questions | **General Assistant** | Accessible, comprehensive overview |
| Platform feature help | **SHELTR Support** | Step-by-step guidance, troubleshooting |
| Technical/dev questions | **Technical Expert** | Security, architecture, code |
| Business strategy | **Business Analyst** | Metrics, ROI, impact measurement |
| Content creation | **Creative Writer** | Marketing copy, storytelling, brand |

---

## 🤖 Agent Personalities

### 1️⃣ General Assistant
**Best For:** First-time users, general inquiries, compassionate support

**Personality Traits:**
- 🤝 Warm and approachable
- 💙 Empathetic and respectful
- 📚 Educational and clear
- 🎯 Action-oriented guidance

**Example Questions:**
- "What is SHELTR?"
- "How do donations work?"
- "I need help with participant support"
- "What resources are available?"

**Response Style:**
```
Warm greeting → Clear explanation → Practical next steps → Compassionate closing
```

**Model:** GPT-4o Mini | **Temp:** 0.7 (Balanced) | **Length:** Medium

---

### 2️⃣ SHELTR Support
**Best For:** Platform features, processes, troubleshooting

**Personality Traits:**
- 🛠️ Process-oriented
- 📋 Step-by-step methodical
- 🔍 Detail-focused
- 🔗 Documentation-aware

**Example Questions:**
- "How do I set up QR codes?"
- "Walk me through SmartFund distribution"
- "How does the 80-15-5 model work?"
- "Troubleshoot donation processing"

**Response Style:**
```
Feature overview → Step-by-step process → Technical details → Links to docs
```

**Model:** GPT-4o | **Temp:** 0.5 (Precise) | **Length:** Detailed

---

### 3️⃣ Technical Expert
**Best For:** Development, architecture, security, API integration

**Personality Traits:**
- 💻 Code-focused
- 🔐 Security-conscious
- 🏗️ Architecture-aware
- 📊 Performance-oriented

**Example Questions:**
- "How is participant data encrypted?"
- "What's the API authentication flow?"
- "How do we implement RLS policies?"
- "Optimize database queries"

**Response Style:**
```
Technical context → Implementation details → Code examples → Best practices
```

**Model:** GPT-4o | **Temp:** 0.3 (Precise) | **Length:** In-depth

---

### 4️⃣ Business Analyst
**Best For:** Strategy, metrics, impact measurement, stakeholder analysis

**Personality Traits:**
- 📊 Data-driven
- 🎯 Strategic thinker
- 💰 ROI-focused
- 🌍 Impact-oriented

**Example Questions:**
- "What metrics should we track?"
- "Calculate housing fund ROI"
- "Stakeholder engagement strategy"
- "How do we measure social impact?"

**Response Style:**
```
Strategic context → Data analysis → Recommendations → Metrics/KPIs
```

**Model:** GPT-4o Mini | **Temp:** 0.6 (Balanced) | **Length:** Analytical

---

### 5️⃣ Creative Writer
**Best For:** Marketing copy, storytelling, content strategy, brand voice

**Personality Traits:**
- ✍️ Narrative-driven
- 💫 Emotionally resonant
- 🎨 Brand-conscious
- 📢 Engagement-focused

**Example Questions:**
- "Write a donor appeal"
- "Create participant success story"
- "Social media post about PODS"
- "Grant proposal narrative"

**Response Style:**
```
Engaging hook → Compelling narrative → Emotional connection → Clear CTA
```

**Model:** GPT-4o | **Temp:** 0.8 (Creative) | **Length:** Engaging

---

## 🔄 When to Switch Agents

### Start General → Switch to Specialist

```
User: "Tell me about SHELTR"
↓ (General Assistant gives overview)
User: "How do I set up the donation API?"
↓ (Switch to Technical Expert for implementation)
```

### Use Multiple Agents for Same Topic

**Example: Launching a new feature**

1. **Business Analyst** → Strategic planning, success metrics
2. **Technical Expert** → Implementation architecture
3. **SHELTR Support** → User documentation, processes
4. **Creative Writer** → Launch announcement, marketing
5. **General Assistant** → User onboarding, support

---

## 📊 Agent Comparison Matrix

| Feature | General | Support | Technical | Business | Creative |
|---------|---------|---------|-----------|----------|----------|
| **Warmth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Technical Depth** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Actionable Steps** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Creativity** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Data Analysis** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Storytelling** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Response Speed** | Fast | Medium | Medium | Fast | Medium |
| **Response Length** | Medium | Long | Very Long | Long | Medium |

---

## 🎯 Pro Tips

### Maximize Agent Effectiveness:

1. **Be Specific**
   - ❌ "Tell me about donations"
   - ✅ "Walk me through the 80-15-5 SmartFund distribution"

2. **Match Task to Agent**
   - Strategy questions → Business Analyst
   - Code questions → Technical Expert
   - Brand content → Creative Writer

3. **Provide Context**
   - "I'm a shelter admin setting up QR codes for the first time"
   - "I'm a donor wanting to understand blockchain transparency"

4. **Use Follow-ups**
   - Agents maintain conversation history
   - Build on previous responses
   - Dive deeper into specific areas

5. **Switch When Needed**
   - Start broad (General Assistant)
   - Go deep (Specialized agent)
   - Different angles (Multiple agents)

---

## 🔐 Access Levels

| Agent Feature | Super Admin | Platform Admin | Shelter Admin | Donor | Participant |
|--------------|-------------|----------------|---------------|-------|-------------|
| **Use All Agents** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View History** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Edit Agent Config** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Create Custom Agents** | 🔜 | 🔜 | ❌ | ❌ | ❌ |

---

## 📚 Related Documentation

- [Chatbot Architecture](./CHATBOT-ARCHITECTURE-ANALYSIS.md)
- [Agent Personality Test](./AGENT-PERSONALITY-TEST.md)
- [Chatbot User Guide](../06-user-guides/chatbot-user-guide.md)
- [Knowledge Base Strategy](./KNOWLEDGE-BASE-STRATEGY.md)

---

## 🆘 Need Help?

- **General Questions:** Use General Assistant first
- **Technical Issues:** Contact support@sheltr.com
- **Feature Requests:** Submit via platform feedback
- **Agent Not Working:** Report to Super Admin

---

**Remember:** All agents have access to SHELTR's knowledge base and use RAG (Retrieval-Augmented Generation) for enhanced, factual responses! 🧠✨

