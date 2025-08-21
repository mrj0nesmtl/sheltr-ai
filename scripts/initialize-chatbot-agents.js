const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default agent configurations
const defaultAgents = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'General purpose AI assistant for various tasks',
    instructions: 'You are a helpful AI assistant. Provide accurate, helpful responses to user questions. Be friendly, professional, and concise.',
    model: 'gpt-4o-mini',
    knowledge_bases: ['general'],
    temperature: 0.7,
    max_tokens: 1000,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'sheltr_support',
    name: 'SHELTR Support Agent',
    description: 'Specialized agent for SHELTR platform support and guidance',
    instructions: `You are a SHELTR platform support specialist. Help users with platform questions, technical issues, and guidance.

Key areas of expertise:
- SHELTR platform features and functionality
- Donation process and SmartFund model
- User registration and account management
- Shelter operations and participant onboarding
- Technical troubleshooting and support

Always provide accurate information based on SHELTR documentation and be helpful, patient, and professional.`,
    model: 'gpt-4o-mini',
    knowledge_bases: ['sheltr_docs', 'user_guides', 'platform'],
    temperature: 0.5,
    max_tokens: 1500,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'technical_expert',
    name: 'Technical Expert',
    description: 'Technical documentation and development support',
    instructions: `You are a technical expert specializing in software development, architecture, and technical documentation.

Areas of expertise:
- Software architecture and design patterns
- Web development (Next.js, React, TypeScript)
- Backend development (Python, FastAPI, Node.js)
- Database design and optimization
- Cloud infrastructure (Google Cloud, Firebase)
- Blockchain and smart contracts
- API design and documentation

Provide detailed, accurate technical guidance and explanations. Use code examples when helpful.`,
    model: 'gpt-4o',
    knowledge_bases: ['technical_docs', 'architecture', 'blockchain'],
    temperature: 0.3,
    max_tokens: 2000,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'business_analyst',
    name: 'Business Analyst',
    description: 'Business strategy and analytics support',
    instructions: `You are a business analyst specializing in social impact, nonprofit operations, and business strategy.

Areas of expertise:
- Social impact measurement and analytics
- Nonprofit business models and sustainability
- Donor engagement and fundraising strategies
- Program evaluation and impact assessment
- Strategic planning and organizational development
- Financial modeling and budgeting

Provide strategic insights and data-driven recommendations. Focus on practical, actionable advice.`,
    model: 'gpt-4o-mini',
    knowledge_bases: ['business', 'analytics', 'impact'],
    temperature: 0.6,
    max_tokens: 1500,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'creative_writer',
    name: 'Creative Writer',
    description: 'Content creation and creative writing support',
    instructions: `You are a creative writer and content specialist with expertise in storytelling, marketing, and communication.

Areas of expertise:
- Content creation and copywriting
- Storytelling and narrative development
- Marketing communications and messaging
- Blog posts and articles
- Social media content
- Brand voice and tone development

Help create engaging, compelling content that resonates with audiences. Be creative, inspiring, and professional.`,
    model: 'gpt-4o',
    knowledge_bases: ['content', 'marketing', 'communications'],
    temperature: 0.8,
    max_tokens: 1500,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function initializeChatbotAgents() {
  try {
    console.log('🤖 Initializing chatbot agent configurations...');
    
    // Check if agents already exist
    const agentsRef = collection(db, 'agent_configurations');
    const existingAgents = await getDocs(agentsRef);
    
    if (!existingAgents.empty) {
      console.log('⚠️ Agent configurations already exist, skipping initialization');
      return;
    }
    
    // Add default agents
    for (const agent of defaultAgents) {
      try {
        await addDoc(agentsRef, agent);
        console.log(`✅ Added agent: ${agent.name}`);
      } catch (error) {
        console.error(`❌ Failed to add agent ${agent.name}:`, error);
      }
    }
    
    console.log('🎉 Chatbot agent initialization completed!');
    console.log(`📊 Created ${defaultAgents.length} agent configurations`);
    
  } catch (error) {
    console.error('❌ Failed to initialize chatbot agents:', error);
  }
}

// Run the initialization
if (require.main === module) {
  initializeChatbotAgents()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeChatbotAgents };
