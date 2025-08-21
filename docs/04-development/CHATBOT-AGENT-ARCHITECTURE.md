# SHELTR-AI Chatbot Agent Architecture Documentation

## 🎯 **Overview**

SHELTR-AI has a sophisticated multi-agent chatbot system with two main components:

1. **Public Landing Page Chatbot** - Orchestrator-based system for public users
2. **Super Admin Chatbot Control Panel** - Configurable agent system for internal use

---

## 🤖 **Agent Architecture Map**

### **📍 Location 1: Public Landing Page Chatbot**
**File:** `apps/api/services/chatbot/orchestrator.py`

This is the **ORIGINAL** chatbot system that routes public users to specialized agents based on their role and intent.

#### **🎭 Agent Types (Hardcoded in Orchestrator):**

| Agent Name | Purpose | User Role | Description |
|------------|---------|-----------|-------------|
| `emergency` | Crisis Response | All Users | Handles emergency situations, suicide prevention, immediate danger |
| `participant_support` | Participant Services | `participant` | Helps homeless individuals access services, book appointments |
| `donor_relations` | Donor Support | `donor` | Explains SmartFund, impact tracking, tax documents |
| `shelter_operations` | Shelter Admin | `admin`, `super_admin` | Manages participants, reports, resource allocation |
| `public_information` | Public Info | `public` | Explains SHELTR platform, SmartFund model |
| `public_support` | Public Support | `public` | Helps public users get started, make donations |
| `technical_support` | Technical Issues | All Users | Handles platform issues, account problems |

#### **🧠 How It Works:**
1. **Intent Classification** - Analyzes user message for intent (emergency, information, action, support)
2. **Role-Based Routing** - Routes to appropriate agent based on user role
3. **RAG Enhancement** - Uses knowledge base for enhanced responses
4. **Response Generation** - Generates contextual responses with actions

---

### **📍 Location 2: Super Admin Chatbot Control Panel**
**File:** `apps/web/src/app/dashboard/chatbots/page.tsx`

This is the **NEW** configurable agent system for Super Admin use.

#### **🎭 Agent Types (Configurable in UI):**

| Agent Name | Purpose | Model | Knowledge Bases | Status |
|------------|---------|-------|-----------------|--------|
| `general` | General Assistant | GPT-4o Mini | general | Active |
| `sheltr_support` | SHELTR Platform Support | GPT-4o Mini | sheltr_docs, user_guides | Active |
| `technical_expert` | Technical Documentation | GPT-4o | technical_docs, architecture | Active |
| `business_analyst` | Business Strategy | GPT-4o Mini | business, analytics, impact | Active |
| `creative_writer` | Content Creation | GPT-4o | content, marketing, communications | Active |

#### **🧠 How It Works:**
1. **Session Management** - Creates persistent chat sessions
2. **Agent Selection** - Choose from configurable agents
3. **Model Selection** - Switch between AI models (GPT-4o, GPT-4o Mini, Claude)
4. **Real-time Configuration** - Edit agent instructions on the fly

---

## 🔄 **System Integration**

### **📊 Firebase Storage Status**
- **Knowledge Base:** ✅ 10 documents loaded
- **Storage Bucket:** `gs://sheltr-ai.firebasestorage.app`
- **Collections:** `knowledge_documents`, `knowledge_chunks`

### **🔗 How Agents Connect to Knowledge Base**

#### **Public Chatbot (Orchestrator):**
```python
# Uses RAG orchestrator for knowledge enhancement
from services.chatbot.rag_orchestrator import rag_orchestrator

rag_response = await rag_orchestrator.generate_knowledge_enhanced_response(
    user_message=message,
    user_role=user_role,
    conversation_context=context,
    agent_type=selected_agent,
    intent=intent
)
```

#### **Super Admin Chatbot:**
```typescript
// Uses configurable knowledge bases per agent
const agentConfig = {
  knowledge_bases: ['sheltr_docs', 'user_guides', 'technical_docs']
}
```

---

## 📋 **Agent Configuration Comparison**

### **🔄 Orchestrator Agents (Public) vs Control Panel Agents (Admin)**

| Aspect | Orchestrator Agents | Control Panel Agents |
|--------|-------------------|---------------------|
| **Configuration** | Hardcoded in prompts.py | Configurable via UI |
| **Purpose** | Public user support | Super Admin tooling |
| **Persistence** | Session-based | Full conversation history |
| **Model Selection** | Fixed per agent | User-selectable |
| **Knowledge Base** | RAG-enhanced | Configurable per agent |
| **Access** | Public users | Super Admin only |

---

## 🎯 **Agent Responsibilities Matrix**

### **Public-Facing Agents (Orchestrator)**

| Agent | Primary Users | Key Functions | Knowledge Sources |
|-------|---------------|---------------|-------------------|
| `emergency` | Crisis situations | Crisis intervention, safety resources | Emergency protocols |
| `participant_support` | Homeless individuals | Service booking, resource navigation | Local services, SHELTR platform |
| `donor_relations` | Donors | SmartFund explanation, impact tracking | Donation system, transparency |
| `public_information` | General public | Platform education, SmartFund model | SHELTR documentation |
| `public_support` | New users | Getting started, donation guidance | User guides, platform features |
| `shelter_operations` | Shelter admins | Participant management, reporting | Administrative tools |
| `technical_support` | All users | Platform issues, account problems | Technical documentation |

### **Admin-Facing Agents (Control Panel)**

| Agent | Primary Use | Key Functions | Knowledge Sources |
|-------|-------------|---------------|-------------------|
| `general` | General assistance | Various tasks, Q&A | General knowledge |
| `sheltr_support` | Platform support | SHELTR-specific help | Platform docs, user guides |
| `technical_expert` | Development support | Technical guidance, architecture | Technical docs, code |
| `business_analyst` | Strategy support | Business insights, analytics | Business data, impact metrics |
| `creative_writer` | Content creation | Writing assistance, marketing | Content guidelines, brand |

---

## 🔧 **Configuration Management**

### **Orchestrator Agent Configuration**
**File:** `apps/api/services/chatbot/prompts.py`

```python
SYSTEM_PROMPTS = {
    "emergency": "You are SHELTR's Emergency Response Agent...",
    "participant_support": "You are SHELTR's Participant Support Agent...",
    "donor_relations": "You are SHELTR's Donor Relations Agent...",
    # ... more agents
}
```

### **Control Panel Agent Configuration**
**Storage:** Firestore `agent_configurations` collection
**Management:** Super Admin UI at `/dashboard/chatbots`

```typescript
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  knowledge_bases: string[];
  temperature: number;
  max_tokens: number;
  status: 'active' | 'inactive';
}
```

---

## 🚀 **Deployment Status**

### **✅ Currently Active Systems**

1. **Public Chatbot (Orchestrator)**
   - ✅ Running on landing page
   - ✅ RAG-enhanced responses
   - ✅ Role-based routing
   - ✅ Emergency handling

2. **Knowledge Base**
   - ✅ 10 documents loaded
   - ✅ Firebase Storage connected
   - ✅ Embeddings generated
   - ✅ RAG integration working

3. **Super Admin Control Panel**
   - ✅ UI implemented
   - ✅ Backend API ready
   - ✅ Session management
   - ✅ Agent configuration

### **🔄 Integration Points**

1. **Knowledge Base Sharing**
   - Both systems use the same Firebase Storage knowledge base
   - Orchestrator uses RAG for enhanced responses
   - Control Panel agents can be configured to use specific knowledge bases

2. **Agent Instructions**
   - Orchestrator agents have hardcoded instructions in `prompts.py`
   - Control Panel agents have configurable instructions in Firestore

3. **Model Usage**
   - Orchestrator uses fixed models per agent
   - Control Panel allows model selection per session

---

## 📝 **Maintenance & Updates**

### **Adding New Orchestrator Agents**
1. Add agent definition to `SYSTEM_PROMPTS` in `prompts.py`
2. Add routing logic in `AgentRouter.select_agent()` in `orchestrator.py`
3. Add handler method in `ChatbotOrchestrator` class

### **Adding New Control Panel Agents**
1. Create agent configuration in Super Admin UI
2. Set instructions, model, and knowledge bases
3. Agent is immediately available for use

### **Updating Agent Instructions**
- **Orchestrator:** Edit `prompts.py` and redeploy
- **Control Panel:** Edit via UI, changes take effect immediately

---

## 🎯 **Summary**

You now have **TWO COMPLETE CHATBOT SYSTEMS**:

1. **🎭 Public Orchestrator System** - 7 specialized agents for public users
2. **⚙️ Admin Control Panel System** - 5 configurable agents for Super Admin

**No loose agents running around!** Everything is properly documented and organized. The systems are complementary:
- **Public system** handles user support with specialized, hardcoded agents
- **Admin system** provides flexible, configurable agents for internal use

Both systems share the same knowledge base and can be managed independently. 🚀
