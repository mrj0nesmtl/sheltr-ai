"""
SHELTR-AI Expanded FAQ Database
85 new FAQs extracted from "Hacking Homelessness" thesis
Ready to integrate into faq_service.py

IMPORTANT: SHELTR Platform Status
- Platform currently in development
- Full ecosystem rollout planned for 2026-2027
- Virtual debit card system and core platform launching first
- PODS, MOBI, and drone infrastructure following in phases
"""

# This file contains the expanded FAQ database
# To integrate: Copy the FAQ entries into faq_service.py's _initialize_faq_database() method

# Development status disclaimer for all responses
DEVELOPMENT_DISCLAIMER = " (Platform launching 2026-2027)"

EXPANDED_FAQS = {
    
    # ==========================================
    # PLATFORM STATUS (1 FAQ - CRITICAL)
    # ==========================================
    
    "platform_launch_status": {
        "questions": [
            "when does sheltr launch",
            "is sheltr available now",
            "when can i use sheltr",
            "launch date",
            "when is sheltr launching",
            "is sheltr live",
            "platform availability",
            "when will sheltr be ready"
        ],
        "answer": "SHELTR platform is currently in development with full ecosystem rollout planned for 2026-2027. We're launching in phases: core platform and virtual debit card system first, followed by PODS housing, MOBI bikes, and drone infrastructure. Sign up to stay informed about launch updates!",
        "category": "platform_info",
        "agent_suggestion": "public_information",
        "keywords": ["launch", "when", "available", "live", "ready", "2026", "2027", "development"],
        "priority": "high",
        "actions": [
            {"type": "link", "text": "Get Launch Updates", "url": "/register"},
            {"type": "link", "text": "Read Our Vision", "url": "/docs/hacking-homelessness"},
            {"type": "link", "text": "Contact Us", "url": "/contact"}
        ]
    },
    
    # ==========================================
    # CATEGORY A: SHELTR ECOSYSTEM (10 FAQs)
    # ==========================================
    
    "sheltr_ecosystem_overview": {
        "questions": [
            "what is the sheltr ecosystem",
            "tell me about sheltr ecosystem",
            "sheltr complete ecosystem",
            "what does sheltr ecosystem include",
            "sheltr infrastructure ecosystem"
        ],
        "answer": "SHELTR is a complete ecosystem in development that will transform donations into tangible infrastructure: PODS housing units, MOBI electric bikes, drone delivery networks, and AI-powered platform services. We're not just software—we're 'hacking homelessness' by creating physical solutions.",
        "category": "ecosystem",
        "agent_suggestion": "public_information",
        "keywords": ["ecosystem", "infrastructure", "complete", "physical", "pods", "mobi"],
        "actions": [
            {"type": "link", "text": "View Full Ecosystem", "url": "/solutions"},
            {"type": "link", "text": "Read Thesis", "url": "/docs/hacking-homelessness"}
        ]
    },
    
    "pods_housing_units": {
        "questions": [
            "what are pods",
            "tell me about pods housing",
            "sheltr pods units",
            "modular housing pods",
            "what is a pod"
        ],
        "answer": "PODS are revolutionary modular housing units (64-96 sq ft) with solar power, climate control, smart locks, and mobility features. The base model starts at $5,000 per unit and is funded through our housing fund. Designed for dignity, security, and rapid deployment.",
        "category": "ecosystem",
        "agent_suggestion": "participant_support",
        "keywords": ["pods", "housing", "modular", "units", "shelter"],
        "actions": [
            {"type": "link", "text": "PODs Specifications", "url": "/solutions/participants"},
            {"type": "link", "text": "How to Get a POD", "url": "/contact"}
        ]
    },
    
    "mobi_electric_bikes": {
        "questions": [
            "what are mobi bikes",
            "tell me about mobi",
            "sheltr electric bikes",
            "mobi transportation",
            "how does mobi work"
        ],
        "answer": "MOBI electric bikes provide participants with 50+ mile range, cargo capacity, and all-weather transportation. They cost $2,500 per unit, funded through the housing fund, and enable access to employment, services, and community integration.",
        "category": "ecosystem",
        "agent_suggestion": "participant_support",
        "keywords": ["mobi", "bike", "electric", "transportation", "mobility"],
        "actions": [
            {"type": "link", "text": "MOBI Details", "url": "/solutions/participants"},
            {"type": "link", "text": "Request MOBI", "url": "/contact"}
        ]
    },
    
    "drone_delivery_network": {
        "questions": [
            "what is the drone network",
            "how do drones work",
            "sheltr drone delivery",
            "drone system",
            "delivery drones"
        ],
        "answer": "Our drone network will deliver emergency medications, essential supplies, and critical documents within a 5-mile radius in under 15 minutes. Each drone system costs $8,000 and is funded through the housing fund infrastructure allocation.",
        "category": "ecosystem",
        "agent_suggestion": "public_information",
        "keywords": ["drone", "delivery", "emergency", "rapid", "network"],
        "actions": [
            {"type": "link", "text": "Drone Network Details", "url": "/solutions"},
            {"type": "link", "text": "Emergency Services", "url": "/contact"}
        ]
    },
    
    "fabrication_pipeline": {
        "questions": [
            "what is the fabrication pipeline",
            "how are pods manufactured",
            "sheltr manufacturing",
            "production facility",
            "how do you build pods"
        ],
        "answer": "Our fabrication pipeline in development includes regional manufacturing centers that produce PODS, MOBI bikes, and drone systems. We employ participants and community members, use local sourcing, and maintain rigorous quality control across all facilities.",
        "category": "ecosystem",
        "agent_suggestion": "public_information",
        "keywords": ["fabrication", "manufacturing", "production", "build", "facility"],
        "actions": [
            {"type": "link", "text": "Manufacturing Details", "url": "/docs/hacking-homelessness"},
            {"type": "link", "text": "Employment Opportunities", "url": "/contact"}
        ]
    },
    
    "donations_to_infrastructure": {
        "questions": [
            "how do donations become infrastructure",
            "donation to physical assets",
            "how does sheltr build things",
            "digital to physical transformation",
            "donation infrastructure conversion"
        ],
        "answer": "15% of every donation goes to our housing fund, which generates 4-6% APY through institutional staking. These returns fund PODS manufacturing (50%), MOBI bikes (25%), drone network (15%), and fabrication facilities (10%). Digital donations become physical infrastructure.",
        "category": "ecosystem",
        "agent_suggestion": "donor_relations",
        "keywords": ["infrastructure", "physical", "manufacturing", "housing fund", "transformation"],
        "actions": [
            {"type": "link", "text": "SmartFund Model", "url": "/tokenomics"},
            {"type": "link", "text": "Start Donating", "url": "/scan-give"}
        ]
    },
    
    "internet_angels": {
        "questions": [
            "what are internet angels",
            "who are internet angels",
            "sheltr internet angels",
            "tech for good community",
            "internet angels collective"
        ],
        "answer": "Internet Angels are a collective of innovators doing transformative tech-for-good work. SHELTR is proud to join this community, using technology and social innovation to create lasting structural change in addressing homelessness.",
        "category": "ecosystem",
        "agent_suggestion": "public_information",
        "keywords": ["internet angels", "tech for good", "community", "innovation", "collective"],
        "actions": [
            {"type": "link", "text": "Our Mission", "url": "/about"},
            {"type": "link", "text": "Join the Movement", "url": "/contact"}
        ]
    },
    
    "shelter_platform_support": {
        "questions": [
            "how does sheltr support shelters",
            "shelter operations support",
            "what do shelters get",
            "shelter platform benefits",
            "how shelters benefit"
        ],
        "answer": "Shelters receive 5% of all donations to their participants for infrastructure support, staff development, program expansion, and technology integration. Plus full platform access, training, analytics tools, and technical support at no cost.",
        "category": "ecosystem",
        "agent_suggestion": "shelter_operations",
        "keywords": ["shelter", "support", "operations", "benefits", "platform"],
        "actions": [
            {"type": "link", "text": "Shelter Solutions", "url": "/solutions/organizations"},
            {"type": "link", "text": "Get Started", "url": "/register"}
        ]
    },
    
    "tech_for_good_innovation": {
        "questions": [
            "what is tech for good",
            "sheltr tech innovation",
            "technology social impact",
            "innovation homelessness",
            "tech for good sheltr"
        ],
        "answer": "SHELTR uses cutting-edge AI assistance, predictive analytics, blockchain transparency, and automated support systems to solve homelessness—not just manage it. We prove that technology and social innovation can create lasting structural change.",
        "category": "platform_info",
        "agent_suggestion": "public_information",
        "keywords": ["tech for good", "innovation", "technology", "ai", "social impact"],
        "actions": [
            {"type": "link", "text": "Our Technology", "url": "/docs/website-architecture"},
            {"type": "link", "text": "Read Our Thesis", "url": "/docs/hacking-homelessness"}
        ]
    },
    
    "ai_powered_platform": {
        "questions": [
            "how does ai power sheltr",
            "artificial intelligence sheltr",
            "ai features",
            "sheltr ai capabilities",
            "what ai does sheltr use"
        ],
        "answer": "SHELTR uses AI for intelligent resource allocation, predictive analytics, automated support systems, spending insights for participants, production prioritization, and this chatbot. AI enhances every aspect of our platform for maximum impact.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["ai", "artificial intelligence", "automation", "analytics", "predictive"],
        "actions": [
            {"type": "link", "text": "AI Features", "url": "/solutions"},
            {"type": "link", "text": "Technical Docs", "url": "/docs/website-architecture"}
        ]
    },
    
    # ==========================================
    # CATEGORY B: SMARTFUND MODEL (15 FAQs)
    # ==========================================
    
    "smartfund_explained": {
        "questions": [
            "what is smartfund",
            "explain smartfund",
            "smartfund model",
            "how does smartfund work",
            "tell me about smartfund"
        ],
        "answer": "SmartFund™ is our revolutionary donation distribution model: 80% goes directly to participants via virtual debit cards (zero crypto risk), 15% builds housing fund with guaranteed 4-6% APY returns, and 5% supports shelter operations. 100% of your donation creates impact.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["smartfund", "distribution", "80-15-5", "allocation", "model"],
        "actions": [
            {"type": "link", "text": "SmartFund Details", "url": "/tokenomics"},
            {"type": "link", "text": "Start Donating", "url": "/scan-give"}
        ]
    },
    
    "80_15_5_breakdown": {
        "questions": [
            "how does 80-15-5 work",
            "explain 80 15 5 split",
            "donation split breakdown",
            "80 percent 15 percent 5 percent",
            "fund allocation breakdown"
        ],
        "answer": "80% participant support via instant virtual debit cards + 15% housing fund (PODS, MOBI, drones) with guaranteed 4-6% returns + 5% shelter operations = 100% impact. No overhead, no middlemen, complete blockchain transparency.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["80-15-5", "split", "breakdown", "allocation", "distribution"],
        "actions": [
            {"type": "link", "text": "Full Breakdown", "url": "/tokenomics"},
            {"type": "link", "text": "See Impact", "url": "/impact"}
        ]
    },
    
    "80_percent_participant": {
        "questions": [
            "what is the 80 percent",
            "80% participant allocation",
            "where does 80% go",
            "80 percent to participants",
            "participant 80%"
        ],
        "answer": "80% goes directly to participants through virtual debit cards (Visa/Mastercard network). No crypto exposure, instant access, zero transaction fees. Participants control their funds with complete dignity and privacy. Average delivery time: <1 hour.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["80 percent", "participant", "virtual card", "direct", "instant"],
        "actions": [
            {"type": "link", "text": "Participant Experience", "url": "/solutions/participants"},
            {"type": "link", "text": "Donate Now", "url": "/scan-give"}
        ]
    },
    
    "15_percent_housing_fund": {
        "questions": [
            "what is the 15 percent",
            "15% housing fund",
            "where does 15% go",
            "housing fund allocation",
            "15 percent explained"
        ],
        "answer": "15% builds our housing fund that manufactures PODS (50%), MOBI bikes (25%), drone network (15%), and fabrication facilities (10%). Funds are staked with Coinbase earning guaranteed 4-6% APY, all tracked with SHELTR tokens on blockchain.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["15 percent", "housing fund", "infrastructure", "guaranteed", "apy"],
        "actions": [
            {"type": "link", "text": "Housing Fund Details", "url": "/tokenomics"},
            {"type": "link", "text": "View Infrastructure", "url": "/solutions"}
        ]
    },
    
    "5_percent_shelter_operations": {
        "questions": [
            "what is the 5 percent",
            "5% shelter support",
            "where does 5% go",
            "shelter operations allocation",
            "5 percent explained"
        ],
        "answer": "5% supports the participant's registered shelter for infrastructure, staff development, program expansion, and technology integration. If a participant wasn't onboarded via a shelter, this 5% automatically goes to their housing fund instead (making it 15% total).",
        "category": "tokenomics",
        "agent_suggestion": "shelter_operations",
        "keywords": ["5 percent", "shelter", "operations", "support", "infrastructure"],
        "actions": [
            {"type": "link", "text": "Shelter Benefits", "url": "/solutions/organizations"},
            {"type": "link", "text": "Get Involved", "url": "/register"}
        ]
    },
    
    "tax_deductible_donations": {
        "questions": [
            "are donations tax deductible",
            "can i deduct donations",
            "tax receipt",
            "donation tax benefits",
            "write off donation"
        ],
        "answer": "Yes! All SHELTR donations are tax-deductible. You'll receive an automated receipt via email immediately after donation, and can access all receipts in your donor dashboard. SHELTR is a registered 501(c)(3) charitable organization.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["tax", "deductible", "receipt", "501c3", "write-off"],
        "actions": [
            {"type": "link", "text": "Donor Dashboard", "url": "/dashboard"},
            {"type": "link", "text": "Tax Information", "url": "/docs/donor-guide"}
        ]
    },
    
    "virtual_debit_cards": {
        "questions": [
            "how do virtual debit cards work",
            "participant cards",
            "virtual card system",
            "debit card for participants",
            "how cards work"
        ],
        "answer": "Participants receive virtual debit cards (Visa/Mastercard) through enterprise payment processing (Adyen). Cards load instantly, work globally, have zero transaction fees, and require zero crypto knowledge. Complete privacy and dignity.",
        "category": "tokenomics",
        "agent_suggestion": "participant_support",
        "keywords": ["virtual card", "debit card", "adyen", "payment", "visa"],
        "actions": [
            {"type": "link", "text": "How It Works", "url": "/solutions/participants"},
            {"type": "link", "text": "Get Started", "url": "/register"}
        ]
    },
    
    "no_crypto_risk": {
        "questions": [
            "is there crypto risk",
            "cryptocurrency volatility",
            "participant crypto exposure",
            "crypto risk participants",
            "volatile cryptocurrency"
        ],
        "answer": "ZERO crypto risk for participants! They receive funds via traditional virtual debit cards (USD) with no blockchain exposure. Only the SHELTR platform uses blockchain for transparency—participants never interact with cryptocurrency.",
        "category": "tokenomics",
        "agent_suggestion": "participant_support",
        "keywords": ["crypto", "risk", "volatility", "zero exposure", "protection"],
        "actions": [
            {"type": "link", "text": "Participant Protection", "url": "/solutions/participants"},
            {"type": "link", "text": "Technical Details", "url": "/docs/hacking-homelessness"}
        ]
    },
    
    "institutional_staking": {
        "questions": [
            "what is institutional staking",
            "coinbase staking",
            "how is housing fund invested",
            "staking returns",
            "4-6% apy guaranteed"
        ],
        "answer": "The housing fund uses Coinbase institutional staking with guaranteed 4-6% APY returns. Enterprise-grade custody ensures security. All funds are tracked with SHELTR tokens on blockchain for complete transparency. Returns fund infrastructure manufacturing.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["staking", "coinbase", "guaranteed", "apy", "returns"],
        "actions": [
            {"type": "link", "text": "Staking Details", "url": "/tokenomics"},
            {"type": "link", "text": "View Transparency", "url": "/impact"}
        ]
    },
    
    "sheltr_token_tracking": {
        "questions": [
            "what is sheltr token tracking",
            "how are tokens used",
            "blockchain tracking",
            "sheltr token purpose",
            "token transparency"
        ],
        "answer": "SHELTR tokens track housing fund growth and allocation on the blockchain. They provide transparent verification of all donations, staking returns, and infrastructure manufacturing. Not a speculative investment—purely for transparency and governance.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["token", "tracking", "blockchain", "transparency", "verification"],
        "actions": [
            {"type": "link", "text": "Token Details", "url": "/tokenomics"},
            {"type": "link", "text": "View Blockchain", "url": "/impact"}
        ]
    },
    
    "realtime_donation_tracking": {
        "questions": [
            "can i track my donation",
            "real-time tracking",
            "donation transparency",
            "where did my money go",
            "track donation impact"
        ],
        "answer": "Yes! Every donation is tracked on the blockchain with real-time transparency. See exactly how funds were distributed (80-15-5), view participant updates (with privacy protection), track housing fund growth, and verify all transactions on-chain.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["track", "real-time", "transparency", "blockchain", "verify"],
        "actions": [
            {"type": "link", "text": "Impact Dashboard", "url": "/impact"},
            {"type": "link", "text": "Your Donations", "url": "/dashboard"}
        ]
    },
    
    "blockchain_transparency": {
        "questions": [
            "how is blockchain transparent",
            "blockchain verification",
            "on-chain transparency",
            "verify transactions",
            "blockchain accountability"
        ],
        "answer": "Every SHELTR transaction is verified on the Base blockchain through smart contracts. This creates an immutable, transparent record of all donations, fund distributions, and spending. You can verify any transaction on-chain for 100% accountability.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["blockchain", "transparent", "verify", "on-chain", "smart contract"],
        "actions": [
            {"type": "link", "text": "Blockchain Details", "url": "/docs/blockchain"},
            {"type": "link", "text": "View Transactions", "url": "/impact"}
        ]
    },
    
    "housing_fund_performance": {
        "questions": [
            "what if housing fund underperforms",
            "housing fund guarantees",
            "fund performance risk",
            "guaranteed returns",
            "housing fund safety"
        ],
        "answer": "Housing fund returns are guaranteed at 4-6% APY through Coinbase institutional staking. This is enterprise-grade custody with proven track record. Returns are consistent and predictable, ensuring reliable infrastructure manufacturing funding.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["performance", "guarantee", "risk", "safety", "institutional"],
        "actions": [
            {"type": "link", "text": "Fund Safety", "url": "/tokenomics"},
            {"type": "link", "text": "Contact Us", "url": "/contact"}
        ]
    },
    
    "housing_fund_maturity": {
        "questions": [
            "how long until housing fund matures",
            "when do participants get housing",
            "housing fund timeline",
            "maturity period",
            "when is housing ready"
        ],
        "answer": "The housing fund continuously manufactures PODS, MOBI bikes, and drone infrastructure as funds accumulate. There's no single 'maturity date'—infrastructure is deployed on rolling basis based on community needs and governance voting.",
        "category": "tokenomics",
        "agent_suggestion": "participant_support",
        "keywords": ["maturity", "timeline", "when", "deployment", "housing ready"],
        "actions": [
            {"type": "link", "text": "Manufacturing Timeline", "url": "/solutions"},
            {"type": "link", "text": "Get Updates", "url": "/register"}
        ]
    },
    
    # ==========================================
    # CATEGORY C: PARTICIPANT EXPERIENCE (12 FAQs)
    # ==========================================
    
    "become_participant": {
        "questions": [
            "how do i become a participant",
            "join as participant",
            "participant signup",
            "register as participant",
            "how to join sheltr"
        ],
        "answer": "When SHELTR launches (2026-2027), you can join through a participating shelter or directly through our platform. You'll be verified, receive your virtual debit card, and get your personal QR code for receiving donations. Sign up now to be notified at launch!",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["become", "join", "signup", "register", "participant"],
        "actions": [
            {"type": "link", "text": "Get Launch Updates", "url": "/register"},
            {"type": "link", "text": "Participant Guide", "url": "/solutions/participants"},
            {"type": "link", "text": "Contact Us", "url": "/contact"}
        ]
    },
    
    "participant_verification": {
        "questions": [
            "what is verification process",
            "how do i get verified",
            "participant verification",
            "identity verification",
            "verification requirements"
        ],
        "answer": "Verification ensures platform integrity while protecting participant privacy. You'll provide basic identity information through a shelter partner or our secure platform. The process is designed to be respectful, dignified, and protect your personal information.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["verification", "verify", "identity", "requirements", "process"],
        "actions": [
            {"type": "link", "text": "Privacy Policy", "url": "/docs/participant-guide"},
            {"type": "link", "text": "Learn More", "url": "/solutions/participants"}
        ]
    },
    
    "virtual_card_access": {
        "questions": [
            "how do virtual cards work for participants",
            "access my funds",
            "use virtual debit card",
            "participant card access",
            "how to spend donations"
        ],
        "answer": "Your virtual debit card works like any Visa/Mastercard—use it anywhere cards are accepted. Funds load instantly when someone donates via your QR code. Zero fees, complete privacy, and full control over your funds. Works online and in-store.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["virtual card", "access", "spend", "use", "debit"],
        "actions": [
            {"type": "link", "text": "Card Guide", "url": "/solutions/participants"},
            {"type": "link", "text": "Get Started", "url": "/register"}
        ]
    },
    
    "immediate_fund_access": {
        "questions": [
            "can i access funds immediately",
            "instant access",
            "how fast are donations",
            "immediate funds",
            "donation speed"
        ],
        "answer": "Yes! Donations load to your virtual debit card in under 1 hour (typically within minutes). No waiting periods, no delays. The moment someone scans your QR code and donates, funds are processed and available for your use.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["immediate", "instant", "fast", "quick", "speed"],
        "actions": [
            {"type": "link", "text": "How It Works", "url": "/solutions/participants"}
        ]
    },
    
    "participation_fees": {
        "questions": [
            "is there a fee to participate",
            "participant costs",
            "do i pay anything",
            "participation fees",
            "cost to join"
        ],
        "answer": "SHELTR is 100% free for participants. No signup fees, no transaction fees, no monthly charges. You keep 100% of the 80% direct allocation from every donation. Our mission is to empower, not extract.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["fee", "cost", "free", "charge", "price"],
        "actions": [
            {"type": "link", "text": "Participant Benefits", "url": "/solutions/participants"}
        ]
    },
    
    "get_pod_housing": {
        "questions": [
            "how do i get a pod",
            "pod housing access",
            "request a pod",
            "pod availability",
            "when can i get a pod"
        ],
        "answer": "PODS will be allocated based on community needs and governance voting once manufacturing begins (2026-2027). Your housing fund (15% of donations) accumulates toward this goal. Priority given to those with highest need and longest participation.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["pod", "housing", "get", "access", "request"],
        "actions": [
            {"type": "link", "text": "POD Details", "url": "/solutions/participants"},
            {"type": "link", "text": "Housing Fund Info", "url": "/tokenomics"}
        ]
    },
    
    "get_mobi_bike": {
        "questions": [
            "how do i get a mobi bike",
            "mobi bike access",
            "request mobi",
            "electric bike availability",
            "transportation access"
        ],
        "answer": "MOBI bikes will be allocated through the housing fund infrastructure program (2026-2027). Priority given to participants who need transportation for employment or essential services. Your participation helps fund the manufacturing of these bikes.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["mobi", "bike", "transportation", "get", "access"],
        "actions": [
            {"type": "link", "text": "MOBI Details", "url": "/solutions/participants"}
        ]
    },
    
    "participant_services": {
        "questions": [
            "what services are available",
            "participant services",
            "what help can i get",
            "available support",
            "services for participants"
        ],
        "answer": "Through SHELTR and partner shelters: direct financial support via virtual cards, housing fund accumulation, access to PODS and MOBI (when available), shelter services (meals, counseling, medical care), job training, and AI-powered financial guidance.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["services", "help", "support", "available", "benefits"],
        "actions": [
            {"type": "link", "text": "Full Services", "url": "/solutions/participants"},
            {"type": "link", "text": "Find Shelter", "url": "/shelters"}
        ]
    },
    
    "qr_code_donations": {
        "questions": [
            "how does qr code work",
            "qr code donations",
            "personal qr code",
            "donation qr",
            "scan to donate"
        ],
        "answer": "Your personal QR code is your direct link to receiving donations. When someone scans it, they're taken to your donation page where they can give directly to you. Funds instantly load to your virtual debit card. You can share your QR code digitally or print it.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["qr code", "scan", "donation", "personal", "direct"],
        "actions": [
            {"type": "link", "text": "QR Code Guide", "url": "/solutions/participants"}
        ]
    },
    
    "track_housing_fund": {
        "questions": [
            "can i track my housing fund",
            "housing fund progress",
            "see my savings",
            "track accumulation",
            "housing fund balance"
        ],
        "answer": "Yes! Your participant dashboard shows real-time housing fund balance (15% of all donations to you), growth from staking returns (4-6% APY), and progress toward housing goals. Complete blockchain transparency lets you verify every transaction.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["track", "housing fund", "progress", "balance", "savings"],
        "actions": [
            {"type": "link", "text": "Dashboard Preview", "url": "/dashboard"}
        ]
    },
    
    "transition_stable_housing": {
        "questions": [
            "what happens when i get stable housing",
            "transition out",
            "after stable housing",
            "graduation from program",
            "leaving sheltr"
        ],
        "answer": "When you transition to stable housing, you can choose to: keep your housing fund balance, donate it forward to other participants, or use it for housing deposits/furnishings. You're always welcome in the SHELTR community as a success story and potential donor!",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["transition", "stable housing", "graduate", "leave", "after"],
        "actions": [
            {"type": "link", "text": "Success Stories", "url": "/impact"}
        ]
    },
    
    "access_shelter_services": {
        "questions": [
            "how do i access shelter services",
            "shelter services access",
            "use shelter programs",
            "shelter support",
            "partner shelter services"
        ],
        "answer": "Partner shelters provide meals, emergency shelter, showers, counseling, medical care, job training, and more. Your SHELTR profile integrates with shelter systems for seamless service access. Contact your local participating shelter or use our shelter finder.",
        "category": "participant_support",
        "agent_suggestion": "participant_support",
        "keywords": ["shelter", "services", "access", "programs", "support"],
        "actions": [
            {"type": "link", "text": "Find Shelters", "url": "/shelters"},
            {"type": "link", "text": "Services Guide", "url": "/solutions/participants"}
        ]
    },
    
    # ==========================================
    # CATEGORY D: DONOR JOURNEY (10 FAQs)
    # ==========================================
    
    "why_donate_sheltr": {
        "questions": [
            "why donate through sheltr",
            "sheltr vs traditional charity",
            "why use sheltr",
            "benefits of sheltr donations",
            "why not other charities"
        ],
        "answer": "SHELTR ensures 100% of your donation creates impact: 80% directly to participants (vs 60-70% traditional charities), 15% builds physical infrastructure with guaranteed returns, 5% supports shelters. Complete blockchain transparency lets you verify every dollar. Zero overhead waste.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["why", "vs", "traditional", "benefits", "better"],
        "actions": [
            {"type": "link", "text": "Compare Models", "url": "/docs/hacking-homelessness"},
            {"type": "link", "text": "Start Donating", "url": "/scan-give"}
        ]
    },
    
    "donation_efficiency": {
        "questions": [
            "how much reaches people in need",
            "donation efficiency",
            "overhead costs",
            "administrative fees",
            "where does money go"
        ],
        "answer": "100% of your donation creates impact through our SmartFund model: 80% direct participant support + 15% housing infrastructure + 5% shelter operations = 100% efficiency. Zero administrative overhead. Every dollar is accounted for on blockchain.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["efficiency", "overhead", "reaches", "impact", "percentage"],
        "actions": [
            {"type": "link", "text": "SmartFund Breakdown", "url": "/tokenomics"},
            {"type": "link", "text": "Transparency", "url": "/impact"}
        ]
    },
    
    "donate_specific_person": {
        "questions": [
            "can i donate to specific person",
            "direct donation",
            "choose recipient",
            "donate to individual",
            "specific participant"
        ],
        "answer": "Yes! Scan a participant's QR code to donate directly to them. Your donation follows the SmartFund model: 80% to their virtual card, 15% to their housing fund, 5% to their shelter. You can track their progress (with privacy protection) in your donor dashboard.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["specific", "direct", "individual", "choose", "qr code"],
        "actions": [
            {"type": "link", "text": "How It Works", "url": "/scan-give"},
            {"type": "link", "text": "Find Participants", "url": "/participants"}
        ]
    },
    
    "donate_housing_pool": {
        "questions": [
            "can i donate to housing fund",
            "pool donation",
            "housing fund donation",
            "donate to infrastructure",
            "general fund donation"
        ],
        "answer": "Yes! You can donate to the general housing fund pool that manufactures PODS, MOBI bikes, and drone infrastructure for the entire community. These donations are allocated through community governance voting to maximize impact.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["pool", "housing fund", "general", "infrastructure", "community"],
        "actions": [
            {"type": "link", "text": "Housing Fund", "url": "/tokenomics"},
            {"type": "link", "text": "Donate Now", "url": "/scan-give"}
        ]
    },
    
    "payment_methods": {
        "questions": [
            "what payment methods accepted",
            "how can i pay",
            "payment options",
            "credit card donation",
            "cryptocurrency donation"
        ],
        "answer": "SHELTR will accept: credit/debit cards (Visa, Mastercard, Amex), bank transfers (ACH), PayPal, Venmo, cryptocurrency (Bitcoin, Ethereum, USDC), and more. All methods convert to USD for participant protection from volatility.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["payment", "methods", "credit card", "crypto", "how to pay"],
        "actions": [
            {"type": "link", "text": "Payment Guide", "url": "/docs/donor-guide"},
            {"type": "link", "text": "Donate", "url": "/scan-give"}
        ]
    },
    
    "blockchain_verified_donation": {
        "questions": [
            "is my donation blockchain verified",
            "blockchain tracking",
            "verify my donation",
            "on-chain verification",
            "blockchain proof"
        ],
        "answer": "Yes! Every donation is recorded on the Base blockchain with complete transparency. You receive a transaction hash to verify the donation, fund distribution (80-15-5), and ongoing impact. View your donation history on-chain anytime.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["blockchain", "verified", "verify", "on-chain", "proof"],
        "actions": [
            {"type": "link", "text": "Blockchain Explorer", "url": "/impact"},
            {"type": "link", "text": "How It Works", "url": "/docs/blockchain"}
        ]
    },
    
    "anonymous_donation": {
        "questions": [
            "can i donate anonymously",
            "anonymous giving",
            "private donation",
            "donate without name",
            "anonymous donor"
        ],
        "answer": "Yes! You can donate anonymously without providing personal information. You'll still receive a tax receipt (if you provide email) and can track impact, but your identity remains private to participants and the public.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["anonymous", "private", "without name", "privacy", "confidential"],
        "actions": [
            {"type": "link", "text": "Privacy Options", "url": "/docs/donor-guide"},
            {"type": "link", "text": "Donate Anonymously", "url": "/scan-give"}
        ]
    },
    
    "recurring_donations": {
        "questions": [
            "can i set up recurring donations",
            "monthly donation",
            "automatic donations",
            "recurring giving",
            "subscription donation"
        ],
        "answer": "Yes! Set up recurring donations (weekly, monthly, quarterly, annually) to provide consistent support. You choose the amount and frequency. Cancel or modify anytime. Recurring donors get special recognition and impact reports.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["recurring", "monthly", "automatic", "subscription", "regular"],
        "actions": [
            {"type": "link", "text": "Set Up Recurring", "url": "/scan-give"},
            {"type": "link", "text": "Donor Benefits", "url": "/docs/donor-guide"}
        ]
    },
    
    "track_donation_impact": {
        "questions": [
            "how do i track my impact",
            "see donation results",
            "track my donations",
            "donation impact dashboard",
            "where did my money go"
        ],
        "answer": "Your donor dashboard shows: all donations with blockchain verification, fund distribution breakdown (80-15-5), participant updates (privacy-protected), housing fund growth, infrastructure manufactured, and aggregate community impact. Real-time transparency.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["track", "impact", "dashboard", "results", "transparency"],
        "actions": [
            {"type": "link", "text": "Impact Dashboard", "url": "/impact"},
            {"type": "link", "text": "Your Donations", "url": "/dashboard"}
        ]
    },
    
    # ==========================================
    # CATEGORY E: SHELTER INTEGRATION (10 FAQs)
    # ==========================================
    
    "shelter_join_sheltr": {
        "questions": [
            "how does my shelter join sheltr",
            "shelter partnership",
            "register shelter",
            "shelter signup",
            "become partner shelter"
        ],
        "answer": "Shelters can join SHELTR at launch (2026-2027) at zero cost. Contact us for partnership information, onboarding process, and training. We provide full platform access, technical support, and staff training to ensure successful integration.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["join", "partnership", "register", "shelter", "partner"],
        "actions": [
            {"type": "link", "text": "Shelter Solutions", "url": "/solutions/organizations"},
            {"type": "link", "text": "Contact Us", "url": "/contact"},
            {"type": "link", "text": "Get Updates", "url": "/register"}
        ]
    },
    
    "shelter_costs": {
        "questions": [
            "is there cost for shelters",
            "shelter fees",
            "how much does shelter pay",
            "shelter pricing",
            "free for shelters"
        ],
        "answer": "SHELTR is 100% free for shelters—no setup fees, no monthly costs, no transaction fees. Plus, you receive 5% of all donations to your participants for operational support. Our mission is to empower shelters, not charge them.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["cost", "fee", "free", "price", "charge"],
        "actions": [
            {"type": "link", "text": "Shelter Benefits", "url": "/solutions/organizations"}
        ]
    },
    
    "verify_participants": {
        "questions": [
            "how do we verify participants",
            "participant verification process",
            "identity verification shelters",
            "onboard participants",
            "verification requirements"
        ],
        "answer": "Shelters use our secure platform to verify participant identity, create profiles, and generate QR codes. The process is streamlined, respects privacy, and includes built-in compliance with data protection regulations. Full training provided.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["verify", "verification", "onboard", "identity", "process"],
        "actions": [
            {"type": "link", "text": "Admin Guide", "url": "/docs/shelter-admin-guide"},
            {"type": "link", "text": "Training", "url": "/contact"}
        ]
    },
    
    "shelter_training": {
        "questions": [
            "what training is provided",
            "shelter staff training",
            "how to use platform",
            "training for shelters",
            "onboarding training"
        ],
        "answer": "We provide comprehensive training: platform walkthrough, participant onboarding procedures, dashboard usage, reporting tools, troubleshooting, and ongoing support. Training is available online, in-person, and through detailed documentation.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["training", "learn", "how to use", "education", "onboarding"],
        "actions": [
            {"type": "link", "text": "Training Materials", "url": "/docs/shelter-admin-guide"},
            {"type": "link", "text": "Schedule Training", "url": "/contact"}
        ]
    },
    
    "manage_participant_profiles": {
        "questions": [
            "how do we manage participants",
            "participant management",
            "admin dashboard",
            "manage profiles",
            "participant administration"
        ],
        "answer": "Your shelter admin dashboard provides: participant profile management, QR code generation, donation tracking, service coordination, reporting tools, and analytics. Intuitive interface designed for busy shelter staff.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["manage", "dashboard", "admin", "profiles", "administration"],
        "actions": [
            {"type": "link", "text": "Dashboard Tour", "url": "/docs/shelter-admin-guide"},
            {"type": "link", "text": "Get Access", "url": "/register"}
        ]
    },
    
    "track_participant_donations": {
        "questions": [
            "can we track participant donations",
            "see donations to our participants",
            "donation tracking shelters",
            "monitor participant funding",
            "donation analytics"
        ],
        "answer": "Yes! Your dashboard shows aggregate donation data for all your participants (privacy-protected), fund distribution, housing fund growth, and community impact. Generate reports for board meetings, grant applications, and stakeholder updates.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["track", "donations", "analytics", "monitor", "reports"],
        "actions": [
            {"type": "link", "text": "Analytics Guide", "url": "/docs/shelter-admin-guide"}
        ]
    },
    
    "5_percent_operational_support": {
        "questions": [
            "how does 5% support work",
            "operational support for shelters",
            "shelter 5 percent",
            "what is 5% allocation",
            "shelter funding"
        ],
        "answer": "Your shelter receives 5% of every donation to your participants for: infrastructure maintenance, staff development, program expansion, and technology integration. Funds are distributed monthly via direct deposit or check. No restrictions on usage.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["5 percent", "operational", "support", "funding", "shelter"],
        "actions": [
            {"type": "link", "text": "Funding Details", "url": "/solutions/organizations"}
        ]
    },
    
    "shelter_reporting_tools": {
        "questions": [
            "what reporting tools available",
            "shelter reports",
            "analytics for shelters",
            "generate reports",
            "shelter dashboard reports"
        ],
        "answer": "Generate reports for: participant impact, donation analytics, service utilization, housing fund progress, board presentations, grant applications, and regulatory compliance. Export to PDF, Excel, or CSV. Customizable date ranges and metrics.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["reports", "reporting", "analytics", "generate", "export"],
        "actions": [
            {"type": "link", "text": "Reporting Guide", "url": "/docs/shelter-admin-guide"}
        ]
    },
    
    "participant_transitions": {
        "questions": [
            "how do we handle transitions",
            "participant leaving shelter",
            "transition to stable housing",
            "graduation process",
            "participant exit"
        ],
        "answer": "When participants transition to stable housing, they retain their SHELTR account and housing fund. Shelters can mark them as 'graduated' while maintaining connection. Success stories help attract donors and demonstrate impact.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["transition", "leaving", "graduation", "exit", "stable housing"],
        "actions": [
            {"type": "link", "text": "Transition Guide", "url": "/docs/shelter-admin-guide"}
        ]
    },
    
    "lost_card_support": {
        "questions": [
            "what if participant loses card",
            "lost virtual card",
            "card replacement",
            "deactivate card",
            "card security"
        ],
        "answer": "Participants or shelters can instantly deactivate lost cards through the dashboard and issue replacement cards. Funds are protected and transferred to new card. No fees for replacement. 24/7 support available for urgent issues.",
        "category": "shelter_operations",
        "agent_suggestion": "shelter_operations",
        "keywords": ["lost", "card", "replacement", "deactivate", "security"],
        "actions": [
            {"type": "link", "text": "Card Management", "url": "/docs/shelter-admin-guide"},
            {"type": "link", "text": "Contact Support", "url": "/contact"}
        ]
    },
    
    # ==========================================
    # CATEGORY F: TOKEN ECONOMICS (10 FAQs)
    # ==========================================
    
    "sheltr_vs_sheltr_s_tokens": {
        "questions": [
            "difference between sheltr and sheltr-s",
            "two token system",
            "sheltr token vs sheltr-s",
            "stable vs governance token",
            "why two tokens"
        ],
        "answer": "SHELTR-S is a stable utility token (pegged to $1 USD) for participant protection from volatility. SHELTR is a governance token for community voting and platform growth. This dual system protects vulnerable populations while enabling community governance.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["token", "difference", "dual", "stable", "governance"],
        "actions": [
            {"type": "link", "text": "Token Details", "url": "/tokenomics"},
            {"type": "link", "text": "Whitepaper", "url": "/docs/whitepaper"}
        ]
    },
    
    "token_launch_date": {
        "questions": [
            "when do tokens launch",
            "token launch date",
            "when can i buy tokens",
            "token availability",
            "token sale"
        ],
        "answer": "Token launch is planned for 2026-2027 alongside platform rollout. SHELTR-S will launch first for platform operations, followed by SHELTR governance token. Sign up for launch notifications and early access opportunities.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["launch", "when", "buy", "availability", "sale"],
        "actions": [
            {"type": "link", "text": "Get Launch Updates", "url": "/register"},
            {"type": "link", "text": "Token Roadmap", "url": "/tokenomics"}
        ]
    },
    
    "governance_participation": {
        "questions": [
            "how do i participate in governance",
            "voting rights",
            "community governance",
            "token voting",
            "governance participation"
        ],
        "answer": "SHELTR token holders can vote on: infrastructure allocation priorities, new feature development, partnership approvals, and platform policy changes. Voting power proportional to tokens held. Transparent, blockchain-verified governance.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["governance", "voting", "participate", "community", "rights"],
        "actions": [
            {"type": "link", "text": "Governance Model", "url": "/tokenomics"},
            {"type": "link", "text": "Whitepaper", "url": "/docs/whitepaper"}
        ]
    },
    
    "token_voting_rights": {
        "questions": [
            "what can token holders vote on",
            "voting rights details",
            "governance decisions",
            "what do i vote on",
            "token holder rights"
        ],
        "answer": "Vote on: PODS/MOBI/drone allocation priorities, new city expansions, feature development roadmap, shelter partnership approvals, housing fund investment strategy, and platform policy updates. One token = one vote.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["vote", "voting rights", "decisions", "governance", "what"],
        "actions": [
            {"type": "link", "text": "Governance Details", "url": "/tokenomics"}
        ]
    },
    
    "token_value_appreciation": {
        "questions": [
            "how does token appreciate",
            "token value growth",
            "will tokens increase in value",
            "token appreciation",
            "investment returns"
        ],
        "answer": "SHELTR token value grows through: platform adoption, network effects, governance utility demand, and community growth. Not marketed as investment—value comes from utility and community governance participation. Focus is social impact, not speculation.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["appreciate", "value", "growth", "increase", "returns"],
        "actions": [
            {"type": "link", "text": "Token Economics", "url": "/tokenomics"},
            {"type": "link", "text": "Disclaimer", "url": "/docs/whitepaper"}
        ]
    },
    
    "token_investment_opportunity": {
        "questions": [
            "is this an investment",
            "can i invest in sheltr",
            "token investment",
            "buy tokens as investment",
            "financial returns"
        ],
        "answer": "SHELTR tokens are utility and governance tokens, NOT investment securities. They enable platform participation and community governance. Any value appreciation is secondary to utility. This is a social impact platform, not an investment opportunity. Consult financial advisors.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["investment", "invest", "financial", "returns", "security"],
        "actions": [
            {"type": "link", "text": "Legal Disclaimer", "url": "/docs/whitepaper"},
            {"type": "link", "text": "Token Utility", "url": "/tokenomics"}
        ]
    },
    
    "token_supply": {
        "questions": [
            "what is token supply",
            "how many tokens",
            "total supply",
            "token distribution",
            "token allocation"
        ],
        "answer": "Token supply and distribution details will be published in our whitepaper before launch (2026). Allocation includes: community governance, platform operations, team vesting, ecosystem development, and strategic reserves. Transparent, audited distribution.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["supply", "total", "distribution", "allocation", "how many"],
        "actions": [
            {"type": "link", "text": "Whitepaper (Coming)", "url": "/tokenomics"},
            {"type": "link", "text": "Get Updates", "url": "/register"}
        ]
    },
    
    "token_vesting": {
        "questions": [
            "how does token vesting work",
            "vesting schedule",
            "token lockup",
            "team tokens",
            "vesting period"
        ],
        "answer": "Team and advisor tokens vest over 3-4 years to ensure long-term commitment. Community tokens available immediately. Strategic reserve tokens vest based on milestones. All vesting schedules transparent and enforced by smart contracts.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["vesting", "lockup", "schedule", "team", "period"],
        "actions": [
            {"type": "link", "text": "Vesting Details", "url": "/tokenomics"}
        ]
    },
    
    "participants_earn_tokens": {
        "questions": [
            "can participants earn tokens",
            "participant tokens",
            "earn sheltr tokens",
            "token rewards participants",
            "participant token allocation"
        ],
        "answer": "Yes! Participants can earn SHELTR governance tokens through: platform engagement, community contributions, success milestones, and peer support activities. This gives participants voice in platform governance and community decision-making.",
        "category": "tokenomics",
        "agent_suggestion": "participant_support",
        "keywords": ["earn", "participants", "rewards", "allocation", "get tokens"],
        "actions": [
            {"type": "link", "text": "Participant Rewards", "url": "/solutions/participants"},
            {"type": "link", "text": "Token Utility", "url": "/tokenomics"}
        ]
    },
    
    "token_utility": {
        "questions": [
            "what is token utility",
            "what can i do with tokens",
            "token use cases",
            "token purpose",
            "why hold tokens"
        ],
        "answer": "SHELTR token utility: governance voting rights, platform fee discounts, priority access to new features, community proposal submission, staking rewards, and exclusive donor recognition. SHELTR-S stable token: platform transactions, participant payments, donation processing.",
        "category": "tokenomics",
        "agent_suggestion": "donor_relations",
        "keywords": ["utility", "use", "purpose", "what can", "benefits"],
        "actions": [
            {"type": "link", "text": "Full Utility Details", "url": "/tokenomics"}
        ]
    },
    
    # ==========================================
    # CATEGORY G: TECHNICAL & SECURITY (8 FAQs)
    # ==========================================
    
    "which_blockchain": {
        "questions": [
            "which blockchain does sheltr use",
            "what blockchain",
            "blockchain platform",
            "base blockchain",
            "ethereum layer 2"
        ],
        "answer": "SHELTR uses Base blockchain (Ethereum Layer 2) for: low transaction costs, fast confirmations, Ethereum security, and Coinbase infrastructure integration. Base provides enterprise-grade reliability while maintaining decentralization and transparency.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["blockchain", "base", "ethereum", "layer 2", "which"],
        "actions": [
            {"type": "link", "text": "Technical Details", "url": "/docs/blockchain"},
            {"type": "link", "text": "Why Base", "url": "/docs/website-architecture"}
        ]
    },
    
    "smart_contract_audits": {
        "questions": [
            "are smart contracts audited",
            "security audits",
            "contract security",
            "audited code",
            "smart contract safety"
        ],
        "answer": "Yes! All SHELTR smart contracts will undergo rigorous third-party security audits before launch. Audit reports will be publicly available. We follow industry best practices for smart contract security and conduct continuous monitoring post-launch.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["audit", "security", "smart contract", "safety", "verified"],
        "actions": [
            {"type": "link", "text": "Security Practices", "url": "/docs/blockchain"},
            {"type": "link", "text": "Technical Docs", "url": "/docs/website-architecture"}
        ]
    },
    
    "personal_data_security": {
        "questions": [
            "is my data secure",
            "data security",
            "personal information protection",
            "privacy security",
            "data protection"
        ],
        "answer": "SHELTR uses enterprise-grade encryption, secure data storage, and strict access controls. Personal data is never stored on blockchain—only transaction data. We comply with GDPR, CCPA, and data protection regulations. Regular security audits and penetration testing.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["data", "security", "privacy", "protection", "safe"],
        "actions": [
            {"type": "link", "text": "Privacy Policy", "url": "/docs/privacy"},
            {"type": "link", "text": "Security Practices", "url": "/docs/security"}
        ]
    },
    
    "kyc_aml_compliance": {
        "questions": [
            "how does kyc work",
            "aml compliance",
            "identity verification",
            "regulatory compliance",
            "kyc requirements"
        ],
        "answer": "SHELTR complies with KYC/AML regulations while protecting participant dignity. Verification is streamlined, respectful, and privacy-focused. We use secure third-party verification services and maintain strict data protection. Compliance ensures platform legitimacy and donor confidence.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["kyc", "aml", "compliance", "verification", "regulatory"],
        "actions": [
            {"type": "link", "text": "Compliance Details", "url": "/docs/security"},
            {"type": "link", "text": "Privacy Policy", "url": "/docs/privacy"}
        ]
    },
    
    "verify_transactions_onchain": {
        "questions": [
            "can i verify transactions",
            "on-chain verification",
            "blockchain explorer",
            "verify on blockchain",
            "transaction proof"
        ],
        "answer": "Yes! Every transaction is verifiable on Base blockchain. Use blockchain explorers (BaseScan) to verify: donation amounts, fund distribution (80-15-5), smart contract execution, and housing fund transactions. Complete transparency and immutable records.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["verify", "on-chain", "blockchain", "explorer", "proof"],
        "actions": [
            {"type": "link", "text": "Blockchain Explorer", "url": "/impact"},
            {"type": "link", "text": "How to Verify", "url": "/docs/blockchain"}
        ]
    },
    
    "platform_downtime": {
        "questions": [
            "what if platform goes down",
            "downtime",
            "platform reliability",
            "service interruption",
            "backup systems"
        ],
        "answer": "SHELTR uses enterprise cloud infrastructure with 99.9% uptime guarantee, automatic failover, and redundant systems. Participant funds are secured in smart contracts and accessible even during platform maintenance. 24/7 monitoring and rapid incident response.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["downtime", "reliability", "backup", "interruption", "uptime"],
        "actions": [
            {"type": "link", "text": "System Status", "url": "/status"},
            {"type": "link", "text": "Technical Architecture", "url": "/docs/website-architecture"}
        ]
    },
    
    "participant_privacy": {
        "questions": [
            "how is participant privacy protected",
            "privacy protection",
            "anonymous participants",
            "participant data privacy",
            "identity protection"
        ],
        "answer": "Participant privacy is paramount: optional anonymity, minimal data collection, encrypted storage, no public blockchain exposure of identity, privacy-protected impact reporting, and strict access controls. Participants control their data and visibility settings.",
        "category": "platform_info",
        "agent_suggestion": "participant_support",
        "keywords": ["privacy", "protection", "anonymous", "identity", "participant"],
        "actions": [
            {"type": "link", "text": "Privacy Policy", "url": "/docs/privacy"},
            {"type": "link", "text": "Participant Rights", "url": "/solutions/participants"}
        ]
    },
    
    "security_measures": {
        "questions": [
            "what security measures",
            "platform security",
            "security features",
            "how is sheltr secure",
            "security practices"
        ],
        "answer": "SHELTR security: enterprise encryption (AES-256), multi-factor authentication, smart contract audits, penetration testing, DDoS protection, secure payment processing (PCI-DSS compliant), regular security audits, bug bounty program, and 24/7 monitoring.",
        "category": "platform_info",
        "agent_suggestion": "technical_support",
        "keywords": ["security", "measures", "features", "practices", "protection"],
        "actions": [
            {"type": "link", "text": "Security Details", "url": "/docs/security"},
            {"type": "link", "text": "Report Vulnerability", "url": "/contact"}
        ]
    },
    
    # ==========================================
    # CATEGORY H: IMPACT & METRICS (10 FAQs)
    # ==========================================
    
    "people_helped": {
        "questions": [
            "how many people helped",
            "participants served",
            "people using sheltr",
            "user count",
            "participants total"
        ],
        "answer": "SHELTR is currently in development (launching 2026-2027). At launch, we aim to serve 1,000+ participants in our first year, scaling to 10,000+ by year three. Sign up to be among the first participants or donors when we launch!",
        "category": "impact",
        "agent_suggestion": "public_information",
        "keywords": ["how many", "people", "helped", "served", "participants"],
        "actions": [
            {"type": "link", "text": "Get Launch Updates", "url": "/register"},
            {"type": "link", "text": "Our Vision", "url": "/docs/hacking-homelessness"}
        ]
    },
    
    "time_to_housing": {
        "questions": [
            "average time to stable housing",
            "how long until housed",
            "housing timeline",
            "time to permanent housing",
            "housing success rate"
        ],
        "answer": "While SHELTR is in development, our model is designed to accelerate housing timelines through: immediate financial support (80%), housing fund accumulation (15%), and comprehensive services. Target: reduce average time to stable housing by 40% compared to traditional programs.",
        "category": "impact",
        "agent_suggestion": "public_information",
        "keywords": ["time", "housing", "how long", "timeline", "average"],
        "actions": [
            {"type": "link", "text": "Our Model", "url": "/docs/hacking-homelessness"},
            {"type": "link", "text": "Expected Impact", "url": "/impact"}
        ]
    },
    
    "total_donated": {
        "questions": [
            "how much donated",
            "total donations",
            "donation amount",
            "money raised",
            "total funding"
        ],
        "answer": "SHELTR is currently in development (launching 2026-2027). We're building the platform to handle millions in donations with complete transparency. Sign up to be notified at launch and be among our first donors!",
        "category": "impact",
        "agent_suggestion": "public_information",
        "keywords": ["how much", "total", "donated", "donations", "raised"],
        "actions": [
            {"type": "link", "text": "Get Launch Updates", "url": "/register"},
            {"type": "link", "text": "Donation Model", "url": "/tokenomics"}
        ]
    },
    
    "participant_success_rate": {
        "questions": [
            "what is success rate",
            "participant outcomes",
            "success metrics",
            "how effective is sheltr",
            "program success"
        ],
        "answer": "SHELTR is designed for maximum impact through: 100% donation efficiency (vs 60-70% traditional), immediate support delivery (<1 hour vs 24-72 hours), guaranteed housing fund growth (4-6% APY), and complete transparency. Target: 80%+ transition to stable housing within 18 months.",
        "category": "impact",
        "agent_suggestion": "public_information",
        "keywords": ["success", "rate", "effective", "outcomes", "metrics"],
        "actions": [
            {"type": "link", "text": "Our Model", "url": "/docs/hacking-homelessness"},
            {"type": "link", "text": "Expected Impact", "url": "/impact"}
        ]
    },
    
    "operating_cities": {
        "questions": [
            "which cities is sheltr in",
            "where is sheltr available",
            "operating locations",
            "cities served",
            "geographic coverage"
        ],
        "answer": "SHELTR will launch in select pilot cities (2026-2027) before expanding nationwide and globally. Initial focus on cities with high homelessness rates and strong shelter partnerships. Sign up to request your city and get launch notifications!",
        "category": "platform_info",
        "agent_suggestion": "public_information",
        "keywords": ["cities", "where", "locations", "available", "geographic"],
        "actions": [
            {"type": "link", "text": "Request Your City", "url": "/contact"},
            {"type": "link", "text": "Launch Updates", "url": "/register"}
        ]
    },
    
    "partner_shelters": {
        "questions": [
            "how many shelters partnered",
            "partner shelters",
            "shelter network",
            "shelters using sheltr",
            "shelter partnerships"
        ],
        "answer": "SHELTR is building our shelter network for 2026-2027 launch. We're in discussions with shelters nationwide and aim to launch with 50+ partners, scaling to 500+ within three years. Shelters: contact us to become a founding partner!",
        "category": "platform_info",
        "agent_suggestion": "shelter_operations",
        "keywords": ["shelters", "partners", "network", "how many", "partnerships"],
        "actions": [
            {"type": "link", "text": "Become Partner", "url": "/contact"},
            {"type": "link", "text": "Shelter Solutions", "url": "/solutions/organizations"}
        ]
    },
    
    "pods_deployed": {
        "questions": [
            "how many pods deployed",
            "pods in use",
            "pod count",
            "pods manufactured",
            "pod deployment"
        ],
        "answer": "PODS manufacturing begins after platform launch (2026-2027) as housing fund accumulates. First units expected 2027. Target: 100 PODS in year one, 1,000+ by year three. Manufacturing scales with community needs and governance voting.",
        "category": "ecosystem",
        "agent_suggestion": "public_information",
        "keywords": ["pods", "deployed", "manufactured", "how many", "count"],
        "actions": [
            {"type": "link", "text": "PODs Roadmap", "url": "/solutions/participants"},
            {"type": "link", "text": "Manufacturing Plan", "url": "/docs/hacking-homelessness"}
        ]
    },
    
    "donor_retention": {
        "questions": [
            "what is donor retention rate",
            "recurring donors",
            "donor loyalty",
            "repeat donations",
            "donor retention"
        ],
        "answer": "SHELTR is designed for high donor retention through: complete transparency (blockchain verification), direct impact visibility, regular updates, and community engagement. Target: 70%+ donor retention rate (vs 40-45% traditional charities) through superior experience and accountability.",
        "category": "donation_support",
        "agent_suggestion": "donor_relations",
        "keywords": ["retention", "recurring", "loyalty", "repeat", "donors"],
        "actions": [
            {"type": "link", "text": "Donor Experience", "url": "/docs/donor-guide"},
            {"type": "link", "text": "Transparency", "url": "/impact"}
        ]
    },
    
    "impact_vs_traditional": {
        "questions": [
            "how does sheltr compare",
            "sheltr vs traditional charities",
            "impact comparison",
            "better than other charities",
            "efficiency comparison"
        ],
        "answer": "SHELTR vs Traditional: 100% efficiency (vs 60-70%), <1 hour delivery (vs 24-72 hours), complete transparency (vs opaque), physical infrastructure (vs services only), guaranteed returns (vs uncertain), blockchain-verified (vs trust-based). Better outcomes through better technology.",
        "category": "platform_info",
        "agent_suggestion": "public_information",
        "keywords": ["compare", "vs", "traditional", "better", "efficiency"],
        "actions": [
            {"type": "link", "text": "Read Thesis", "url": "/docs/hacking-homelessness"},
            {"type": "link", "text": "Our Model", "url": "/tokenomics"}
        ]
    },
    
    "aggregate_impact_data": {
        "questions": [
            "can i see aggregate impact",
            "platform impact data",
            "overall statistics",
            "community impact",
            "total impact metrics"
        ],
        "answer": "Yes! At launch, our public impact dashboard will show: total donations, participants served, housing fund growth, PODS/MOBI deployed, success stories, and blockchain-verified metrics. Complete transparency for the entire community. Real-time updates.",
        "category": "impact",
        "agent_suggestion": "public_information",
        "keywords": ["aggregate", "overall", "total", "community", "platform"],
        "actions": [
            {"type": "link", "text": "Impact Dashboard (Preview)", "url": "/impact"},
            {"type": "link", "text": "Get Launch Updates", "url": "/register"}
        ]
    },
}

# Helper function to integrate these FAQs
def get_all_expanded_faqs():
    """Returns all expanded FAQs ready for integration"""
    return EXPANDED_FAQS

# Helper function to get FAQs by category
def get_faqs_by_category(category: str):
    """Returns all FAQs for a specific category"""
    return {
        faq_id: faq_data 
        for faq_id, faq_data in EXPANDED_FAQS.items() 
        if faq_data["category"] == category
    }

# Helper function to generate FAQ statistics
def get_faq_stats():
    """Returns statistics about the FAQ database"""
    categories = {}
    for faq_data in EXPANDED_FAQS.values():
        category = faq_data["category"]
        categories[category] = categories.get(category, 0) + 1
    
    return {
        "total_faqs": len(EXPANDED_FAQS),
        "categories": categories,
        "total_questions": sum(len(faq["questions"]) for faq in EXPANDED_FAQS.values())
    }

if __name__ == "__main__":
    # Print statistics
    stats = get_faq_stats()
    print(f"Expanded FAQ Database Statistics:")
    print(f"Total FAQs: {stats['total_faqs']}")
    print(f"Total Question Variants: {stats['total_questions']}")
    print(f"\nBy Category:")
    for category, count in stats['categories'].items():
        print(f"  {category}: {count} FAQs")

