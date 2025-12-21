# AI Agent Quick Reference Guide

**For:** SHELTR Platform Users  
**Updated:** December 20, 2025  
**Status:** ✅ Gemini-Optimized with Flexible Model Selection

---

## 🎯 Which Agent Should You Use?

| Your Need | Best Agent | Default Model | Why |
|-----------|------------|---------------|-----|
| General platform questions | **General Assistant** | Gemini 2.5 Flash ⚡ | Fast, accessible, cost-effective |
| Platform feature help | **SHELTR Support** | Gemini 2.5 Flash ⚡ | Step-by-step guidance, processes |
| Technical/dev questions | **Technical Expert** | GPT-4o Mini 💻 | Best for code, architecture |
| Business strategy | **Business Analyst** | Gemini 2.5 Flash ⚡ | Quick analytics, metrics |
| Content creation | **Creative Writer** | Gemini 2.5 Flash ⚡ | Creative baseline, fast drafts |

**💡 Pro Tip:** Use "Agent Default (Auto) ⭐" in the model selector to automatically use each agent's optimized model!

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

**Default Model:** Gemini 2.5 Flash ⚡ | **Temp:** 0.7 (Balanced) | **Length:** Medium  
**Cost:** ~$0.0001/request | **Speed:** Very Fast | **Override:** Any model available

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

**Default Model:** Gemini 2.5 Flash ⚡ | **Temp:** 0.5 (Precise) | **Length:** Detailed  
**Cost:** ~$0.0001/request | **Speed:** Very Fast | **Override:** GPT-4o for complex issues

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

**Default Model:** Gemini 2.5 Flash ⚡ | **Temp:** 0.6 (Balanced) | **Length:** Analytical  
**Cost:** ~$0.0001/request | **Speed:** Very Fast | **Override:** GPT-4o for complex analysis

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

**Default Model:** Gemini 2.5 Flash ⚡ | **Temp:** 0.8 (Creative) | **Length:** Engaging  
**Cost:** ~$0.0001/request | **Speed:** Very Fast  
**Premium Option:** Claude 3.5 Haiku 🎭 (~$0.0008/request) for critical content  
**Override:** Claude for premium campaigns, GPT-4o for complex storytelling

---

## 🎯 Model Selection Made Easy

### **"Agent Default (Auto)" ⭐ Recommended**

The dashboard features an intelligent model selector that automatically picks the best model for each agent:

```
┌─────────────────────────────────────┐
│  Model Selector (Top Right)         │
├─────────────────────────────────────┤
│  ⭐ Agent Default (Auto)  ← Default │
│  ⚡ Gemini 2.5 Flash                │
│  🪶 Gemini 2.5 Flash-Lite           │
│  💻 GPT-4o Mini                     │
│  🚀 GPT-4o                          │
│  🎭 Claude 3.5 Haiku                │
│  🎨 Claude 3.5 Sonnet               │
└─────────────────────────────────────┘
```

### **How It Works**

1. **Select "Agent Default (Auto)"** (recommended)
   - General Assistant → Uses Gemini 2.5 Flash
   - SHELTR Support → Uses Gemini 2.5 Flash
   - Technical Expert → Uses GPT-4o Mini
   - Business Analyst → Uses Gemini 2.5 Flash
   - Creative Writer → Uses Gemini 2.5 Flash

2. **Or Choose Manually**
   - Override with any model for specific needs
   - Switch models mid-conversation
   - Each message shows which model answered

3. **Visual Indicators**
   - Model badges on messages: "⚡ Gemini 2.5 Flash"
   - Chat header shows current model
   - Quick actions bar displays active model

### **When to Override**

| Situation | Recommended Model | Why |
|-----------|------------------|-----|
| **Quick general queries** | Gemini 2.5 Flash | Fastest, cheapest |
| **Code debugging** | GPT-4o Mini | Best code understanding |
| **Complex architecture** | GPT-4o | Deep reasoning |
| **Premium marketing** | Claude 3.5 Haiku | Creative excellence |
| **Critical content** | Claude 3.5 Sonnet | Highest quality |

### **Cost Comparison**

| Model | Cost/Request | When to Use |
|-------|-------------|-------------|
| Gemini 2.5 Flash ⚡ | $0.0001 | Default for most tasks (95% savings) |
| Gemini 2.5 Flash-Lite 🪶 | $0.00005 | Testing, simple Q&A |
| GPT-4o Mini 💻 | $0.0002 | Code, technical docs |
| GPT-4o 🚀 | $0.002 | Complex reasoning (20x more expensive) |
| Claude 3.5 Haiku 🎭 | $0.0008 | Creative content (8x more expensive) |
| Claude 3.5 Sonnet 🎨 | $0.003 | Premium content (30x more expensive) |

**💡 Pro Tip:** Start with "Agent Default (Auto)" and only switch if you need specific capabilities!

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
| **Default Model** | Gemini ⚡ | Gemini ⚡ | GPT-4o Mini 💻 | Gemini ⚡ | Gemini ⚡ |
| **Cost/Request** | $0.0001 | $0.0001 | $0.0002 | $0.0001 | $0.0001 |
| **Response Speed** | Very Fast | Very Fast | Fast | Very Fast | Very Fast |
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

## 💡 Advanced Tips

### **Maximize Cost Efficiency**

1. **Use "Agent Default (Auto)"** for 95% of tasks
   - Automatically uses cost-optimized models
   - Only switch when you need specific capabilities

2. **Start Cheap, Upgrade if Needed**
   ```
   Gemini Flash → Quick answer
   ↓ (if not satisfied)
   GPT-4o Mini → Better quality
   ↓ (if still not enough)
   GPT-4o/Claude → Premium response
   ```

3. **Know When to Splurge**
   - **Gemini Flash:** General queries, drafts, iterations
   - **GPT-4o Mini:** Code, technical docs, debugging
   - **GPT-4o:** Complex reasoning, critical decisions
   - **Claude:** Premium content, brand-defining copy

### **Model Switching Workflow**

**Example: Creating a Marketing Campaign**

1. **Brainstorm** (Creative Writer + Gemini Flash)
   - Fast idea generation
   - Multiple iterations
   - Cost: ~$0.0005 for 5 drafts

2. **Refine** (Creative Writer + Claude 3.5 Haiku)
   - Polish final copy
   - Premium quality
   - Cost: ~$0.0008 for final version

3. **Total:** $0.0013 vs. $0.015 if using GPT-4o for everything (87% savings!)

### **Conversation History**

All agents maintain conversation history within a session:
- ✅ Build on previous responses
- ✅ Reference earlier context
- ✅ Model switches preserved in history
- ✅ Each message shows which model answered

### **Keyboard Shortcuts**

- **Shift + Enter:** New line in message
- **Enter:** Send message
- **Ctrl/Cmd + K:** Focus model selector
- **Ctrl/Cmd + N:** New chat session

---

## 🎓 Learning Path

### **New Users**
1. Start with **General Assistant** (Gemini Flash)
2. Learn basic platform features
3. Explore other agents as needs arise

### **Power Users**
1. Use **"Agent Default (Auto)"** for efficiency
2. Switch models strategically
3. Combine multiple agents for complex projects
4. Monitor costs and optimize usage

### **Developers**
1. **Technical Expert** (GPT-4o Mini) for code
2. **General Assistant** (Gemini) for quick questions
3. **Business Analyst** (Gemini) for metrics
4. Switch to GPT-4o for complex architecture

---

## 📈 Success Metrics

**After Gemini Migration (December 2025):**
- ✅ **95% cost reduction** vs. all-GPT-4o
- ✅ **Same or better response quality** for most tasks
- ✅ **Faster response times** (Gemini is very fast)
- ✅ **More flexible** with model switching
- ✅ **Better cost transparency** with per-model pricing

---

**Remember:** All agents have access to SHELTR's knowledge base and use RAG (Retrieval-Augmented Generation) for enhanced, factual responses! 🧠✨

**Last Updated:** December 20, 2025  
**Status:** ✅ Gemini-Optimized with Flexible Model Selection

