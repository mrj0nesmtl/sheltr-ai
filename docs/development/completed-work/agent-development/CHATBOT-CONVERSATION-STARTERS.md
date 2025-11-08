# Chatbot Conversation Starters - How They Work

## Overview
The SHELTR AI chatbot provides intelligent, context-aware conversation starters (action buttons) to guide users through helpful topics based on their intent and role.

## How It Works

### Flow Architecture

```
User sends message
    ↓
Intent Classification (donation, shelter, participant, platform info, etc.)
    ↓
Agent Routing (public_information, donor_relations, participant_support, etc.)
    ↓
RAG Orchestrator generates response + action buttons
    ↓
Frontend displays conversation starters below response
```

### Key Components

1. **Intent Classifier** (`apps/api/services/chatbot/orchestrator.py`)
   - Analyzes user message to determine what they're asking about
   - Categories: `DONATION`, `SHELTER_OPERATIONS`, `PARTICIPANT_SERVICES`, `PLATFORM_INFO`, `TECHNICAL`
   - Confidence scoring to determine best agent for response

2. **RAG Orchestrator** (`apps/api/services/chatbot/rag_orchestrator.py`)
   - Generates contextual action buttons via `_generate_knowledge_actions()`
   - **For public users**: Returns helpful conversation starters (not documentation)
   - **For authenticated users**: May include documentation links and advanced features

3. **Conversation Starter Logic** (`_get_public_conversation_starters()`)
   - Maps each intent category to 3 relevant questions
   - Provides clickable URL links to relevant pages
   - Falls back to general starters if intent is unclear

## Current Conversation Starters by Intent

### 💰 Donation Intent
When user asks about donations, giving, or funding:
- "How do I donate?" → `/scan-give`
- "What is the SmartFund?" → `/tokenomics`
- "How does blockchain transparency work?" → `/solutions/donors`

### 🏢 Shelter Operations Intent
When user asks about shelter signup, operations, or features:
- "How do I sign up my shelter?" → `/contact`
- "Is the platform free for shelters?" → `/solutions/shelters`
- "What features do shelters get?" → `/solutions/shelters`

### 👤 Participant Services Intent
When user asks about getting help, PODs, or participant features:
- "How do I participate?" → `/solutions/participants`
- "What is a POD?" → `/about`
- "How do I get a POD?" → `/solutions/participants`

### 🌐 Platform Info Intent
When user asks general questions about SHELTR:
- "What is SHELTR?" → `/about`
- "How does SHELTR make money?" → `/tokenomics`
- "What blockchain is SHELTR on?" → `/tokenomics`

### 🔧 Technical Intent
When user asks about blockchain, smart contracts, or technical details:
- "How does SHELTR use blockchain?" → `/tokenomics`
- "What is the SmartFund?" → `/tokenomics`
- "How do I donate?" → `/scan-give`

### 🆘 Fallback (No Clear Intent)
Default conversation starters:
- "What is SHELTR?" → `/about`
- "How do I donate?" → `/scan-give`
- "How do I participate?" → `/solutions/participants`

## Documentation Filtering

### For Public Users
- ❌ NO technical documentation links (SESSION 20, API docs, etc.)
- ❌ NO internal development documentation
- ✅ YES helpful conversation starters with user-friendly questions
- ✅ YES relevant public pages (about, solutions, tokenomics)

### For Authenticated Users
- ✅ May see relevant documentation from knowledge base
- ✅ Filtered to skip categories: `development`, `technical`, `api`, `migration`, `admin`
- ✅ Only show docs relevant to their role and question

## Adding New Conversation Starters

### Step 1: Identify the Intent Category
Edit `apps/api/services/chatbot/rag_orchestrator.py`, function `_get_public_conversation_starters()`

### Step 2: Add to the `conversation_starters` Dictionary
```python
conversation_starters = {
    IntentCategory.YOUR_NEW_CATEGORY: [
        {'type': 'info', 'label': 'Question 1?', 'url': '/relevant-page-1'},
        {'type': 'info', 'label': 'Question 2?', 'url': '/relevant-page-2'},
        {'type': 'info', 'label': 'Question 3?', 'url': '/relevant-page-3'}
    ],
    # ... existing categories
}
```

### Step 3: Test the Flow
1. Restart backend: `cd apps/api && uvicorn main:app --reload`
2. Open chatbot on frontend
3. Ask a question that should trigger your new intent
4. Verify the conversation starters appear correctly

## Best Practices

### ✅ DO:
- Use simple, clear question phrasing ("How do I...?", "What is...?")
- Link to public, user-friendly pages
- Provide 3 relevant options per intent
- Keep questions focused on user goals (donate, participate, learn)
- Use action-oriented language

### ❌ DON'T:
- Link to technical documentation for public users
- Use jargon or technical terms
- Show internal/development pages
- Provide more than 3 options (overwhelming)
- Assume prior knowledge of SHELTR

## Frontend Display

The conversation starters are rendered as buttons below each chatbot response:

```typescript
// apps/web/src/components/PublicChatbot.tsx
{message.actions?.map((action, index) => {
  const url = action.url || '#';
  const text = action.label || 'Link';
  
  return (
    <Button key={index} variant="outline" onClick={() => handleAction(action)}>
      {text}
    </Button>
  );
})}
```

## Troubleshooting

### Issue: Seeing technical documentation instead of conversation starters
**Cause**: User is being routed to wrong agent or intent classification is incorrect
**Fix**: Check `apps/api/services/chatbot/orchestrator.py` intent classification logic

### Issue: No conversation starters appearing
**Cause**: RAG orchestrator may be returning empty actions array
**Fix**: Verify `_get_public_conversation_starters()` is being called for public users

### Issue: Wrong conversation starters for user's question
**Cause**: Intent classification may be incorrect or starters aren't mapped to that intent
**Fix**: 
1. Check intent classification logs
2. Verify your intent has starters in `conversation_starters` dictionary
3. Test with different phrasings of the question

## Example Conversation Flow

**User (public)**: "Hello. This is a test from your developer. What are your instructions"

**Intent Classified**: `PLATFORM_INFO` (platform information inquiry)

**Agent Selected**: `public_information`

**Response Generated**: "Hello! As SHELTR's Public Information Agent, my main role is to help visitors understand our platform and how it supports homeless individuals through technology..."

**Conversation Starters Displayed**:
- 🔘 "What is SHELTR?" → `/about`
- 🔘 "How does SHELTR make money?" → `/tokenomics`
- 🔘 "What blockchain is SHELTR on?" → `/tokenomics`

**User clicks**: "What is SHELTR?" → Opens `/about` page

## Future Enhancements

1. **Dynamic Conversation Starters**: Generate based on conversation history
2. **Personalization**: Different starters for returning vs. new users
3. **A/B Testing**: Track which starters are most clicked
4. **Multi-language Support**: Translate starters based on user locale
5. **Smart Suggestions**: Use ML to predict best 3 questions per user

## Related Files
- `apps/api/services/chatbot/rag_orchestrator.py` - Generates action buttons
- `apps/api/services/chatbot/orchestrator.py` - Intent classification
- `apps/api/services/chatbot/prompts.py` - Agent system prompts
- `apps/web/src/components/PublicChatbot.tsx` - Frontend display

## Questions?
Contact the platform admin or check `docs/04-development/` for more chatbot documentation.

