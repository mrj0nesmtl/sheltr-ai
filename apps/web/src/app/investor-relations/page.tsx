'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeLogo from '@/components/ThemeLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Coins, 
  Globe, 
  BarChart3, 
  Target,
  Lock,
  CheckCircle,
  ArrowRight,
  Download,
  Calendar,
  PieChart,
  LineChart,
  Building,
  Handshake,
  Mail,
  Clock,
  AlertCircle,
  ShieldCheck,
  Eye,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Rocket,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarService, SchedulingResult } from '@/services/calendarService';

// Investment Deck Slides Data
const investmentSlides = [
  {
    id: 1,
    type: 'title',
    title: 'SHELTR',
    subtitle: 'Hacking Homelessness Through Technology',
    description: 'Pre-Seed ICO: $150K Raise',
    highlight: 'Dual-Token Architecture for Social Impact',
    icon: Coins,
    bgGradient: 'from-blue-600 to-purple-600',
    content: null
  },
  {
    id: 2,
    type: 'problem',
    title: 'The Charitable Giving Crisis',
    subtitle: 'Traditional systems are fundamentally broken',
    description: 'Only 60-70% of donations reach beneficiaries',
    icon: Target,
    bgGradient: 'from-red-600 to-orange-600',
    content: {
      stats: [
        { label: 'Administrative Overhead', value: '30-40%', color: 'text-red-600' },
        { label: 'Delivery Time', value: '24-72 hours', color: 'text-orange-600' },
        { label: 'Transparency', value: 'Limited', color: 'text-yellow-600' },
        { label: 'Market Size', value: '$45B Global', color: 'text-green-600' }
      ],
      problems: [
        'Multi-layer intermediaries create friction',
        'Opaque processes prevent impact verification',
        'Volatility exposure in crypto donations',
        'Centralized control creates single points of failure'
      ]
    }
  },
  {
    id: 3,
    type: 'solution',
    title: 'SHELTR Solution',
    subtitle: 'Revolutionary dual-token architecture with AI integration',
    description: '100% efficiency through blockchain transparency and AI-powered insights',
    icon: Shield,
    bgGradient: 'from-green-600 to-blue-600',
    content: {
      features: [
        'QR-code enabled direct donations',
        'Blockchain verification of every transaction',
        'Dual-token architecture (SHELTR-S + SHELTR)',
        'Smart contract automated distribution (85/10/5)',
        'AI-powered chatbot with knowledge base integration',
        'Multi-tenant shelter management platform',
        'Real-time analytics and impact tracking',
        'Visa MCP traditional payment integration'
      ],
      comparison: {
        traditional: '60-70% efficiency',
        sheltr: '100% efficiency',
        improvement: '40% increase'
      }
    }
  },
  {
    id: 4,
    type: 'market',
    title: 'Market Opportunity',
    subtitle: 'Massive addressable market',
    description: '$10-20B global homelessness donations',
    icon: Globe,
    bgGradient: 'from-purple-600 to-pink-600',
    content: {
      marketSizes: [
        { label: 'Global Charitable Giving', value: '$530B', description: 'Total market (2024)' },
        { label: 'Homelessness Donations', value: '$10-20B', description: 'Annual direct spending' },
        { label: 'Digital Giving Segment', value: '$2-8B', description: '20-40% of homelessness donations' },
        { label: 'U.S. Shelter Industry', value: '$21.9B', description: 'Annual revenue (2024)' }
      ],
      growth: '8.5% CAGR in charitable giving',
      projections: [
        { year: '2024', value: '$530B', description: 'Global charitable giving' },
        { year: '2033', value: '$848B', description: 'Projected market size' },
        { year: '2031', value: '$342B', description: 'Transitional housing services' }
      ],
      segments: ['Individual donors', 'Corporate partnerships', 'Government contracts', 'International expansion']
    }
  },
  {
    id: 5,
    type: 'technology',
    title: 'Technology & Architecture',
    subtitle: 'Enterprise-grade blockchain infrastructure',
    description: 'Built on Base L2 for optimal performance',
    icon: Zap,
    bgGradient: 'from-indigo-600 to-blue-600',
    content: {
      stack: [
        { component: 'Frontend', tech: 'Next.js 15 + React 18 + TypeScript' },
        { component: 'Backend', tech: 'FastAPI + Python 3.11 + Firebase' },
        { component: 'Blockchain', tech: 'Base L2 + Smart Contracts + OpenZeppelin' },
        { component: 'AI/ML', tech: 'OpenAI GPT-4 + LangChain + Custom Analytics' }
      ],
      features: [
        'Multi-tenant SaaS architecture',
        'Real-time blockchain verification',
        'AI-powered impact analytics',
        'Mobile-first responsive design'
      ]
    }
  },
  {
    id: 6,
    type: 'tokens',
    title: 'Dual-Token Economics',
    subtitle: 'Revolutionary token architecture with updated distribution',
    description: 'Stability for participants, growth for investors',
    icon: Coins,
    bgGradient: 'from-green-600 to-purple-600',
    content: {
      sheltrS: {
        name: 'SHELTR-S (Stable)',
        price: '$1.00 USD',
        supply: 'Unlimited (demand-driven)',
        backing: '1:1 USDC reserve',
        use: 'Participant protection and daily transactions'
      },
      sheltr: {
        name: 'SHELTR (Growth)',
        price: 'Market-driven',
        supply: '100,000,000 fixed',
        mechanism: 'Deflationary (2% annual burn)',
        use: 'Governance and community growth'
      },
      distribution: {
        participants: '85%',
        housing: '10%',
        operations: '5%'
      }
    }
  },
  {
    id: 7,
    type: 'revenue',
    title: 'Revenue Model & Traction',
    subtitle: 'Multiple sustainable revenue streams',
    description: 'Platform fees + token appreciation + DeFi yields',
    icon: TrendingUp,
    bgGradient: 'from-green-600 to-blue-600',
    content: {
      revenueStreams: [
        { source: 'Platform Fees', percentage: '2-3%', description: 'Marketplace transactions' },
        { source: 'Token Appreciation', percentage: 'Variable', description: 'Deflationary mechanics' },
        { source: 'DeFi Yields', percentage: '6-8% APY', description: 'Housing fund investments' },
        { source: 'Partnership Fees', percentage: 'Variable', description: 'Enterprise integrations' }
      ],
      projections: {
        year1: '$500K ARR',
        year2: '$2M ARR',
        year3: '$5M ARR'
      }
    }
  },
  {
    id: 8,
    type: 'competitive',
    title: 'Competitive Advantages',
    subtitle: 'First-mover in dual-token charitable architecture',
    description: 'Regulatory-compliant utility token structure',
    icon: Award,
    bgGradient: 'from-yellow-600 to-orange-600',
    content: {
      advantages: [
        'First dual-token charitable ecosystem',
        'Regulatory-compliant (not securities)',
        'Immediate utility through marketplace',
        'Deflationary mechanics driving value',
        'Community governance ensuring alignment'
      ],
      moats: [
        'Network effects from participant adoption',
        'Data moat from blockchain transparency',
        'Regulatory moat from compliance structure',
        'Technology moat from dual-token architecture'
      ]
    }
  },
  {
    id: 9,
    type: 'team',
    title: 'Team & Advisors',
    subtitle: 'Experienced leadership in blockchain and social impact',
    description: 'Combined expertise in technology and homelessness solutions',
    icon: Users,
    bgGradient: 'from-blue-600 to-purple-600',
    content: {
      founder: {
        name: 'Joel Yaffe',
        role: 'Founder & CEO',
        background: 'Blockchain technology, social impact, entrepreneurship',
        expertise: ['Smart contract development', 'Social enterprise', 'Platform scaling']
      },
      advisors: [
        { name: 'Technical Advisory Board', focus: 'Blockchain architecture and security' },
        { name: 'Social Impact Advisors', focus: 'Homelessness sector expertise' },
        { name: 'Regulatory Advisors', focus: 'Compliance and legal framework' }
      ]
    }
  },
  {
    id: 10,
    type: 'financial',
    title: 'Financial Projections',
    subtitle: 'Clear path to profitability and token appreciation',
    description: 'Conservative projections with significant upside potential',
    icon: BarChart3,
    bgGradient: 'from-green-600 to-blue-600',
    content: {
      ico: {
        round: 'Pre-Seed ICO',
        price: '$0.05 per token',
        target: '$150K raise',
        tokens: '3M SHELTR tokens',
        progress: 30
      },
      public: {
        round: 'Public Launch (Q4 2025)',
        price: '$0.10 per token',
        allocation: '30M tokens',
        marketCap: '$3M'
      },
      projections: {
        year1: '$1M market cap',
        year2: '$5M market cap',
        year3: '$15M market cap'
      }
    }
  },
  {
    id: 11,
    type: 'funds',
    title: 'Use of Funds',
    subtitle: 'Strategic allocation for maximum growth',
    description: '40% development, 30% marketing, 20% compliance, 10% operations',
    icon: Building,
    bgGradient: 'from-purple-600 to-pink-600',
    content: {
      allocation: [
        { category: 'Platform Development', percentage: 40, amount: '$60K', focus: 'Core technology and scaling' },
        { category: 'Marketing & User Acquisition', percentage: 30, amount: '$45K', focus: 'Community building and growth' },
        { category: 'Legal & Regulatory Compliance', percentage: 20, amount: '$30K', focus: 'Compliance framework' },
        { category: 'Team & Operations', percentage: 10, amount: '$15K', focus: 'Key hires and infrastructure' }
      ],
      milestones: [
        'Q1 2025: Core platform launch',
        'Q3 2025: AI & Knowledge Base',
        'Q4 2025: Token launch ($SHLTR)',
        'Q1-Q2 2026: Market expansion'
      ]
    }
  },
  {
    id: 12,
    type: 'terms',
    title: 'Investment Terms',
    subtitle: 'ICO structure with governance rights',
    description: 'Token-based investment with immediate utility and governance',
    icon: FileText,
    bgGradient: 'from-indigo-600 to-purple-600',
    content: {
      structure: {
        type: 'ICO (Initial Coin Offering)',
        token: 'SHELTR (utility token)',
        governance: 'Immediate voting rights',
        vesting: 'No lock-up period'
      },
      benefits: [
        'Governance rights from day one',
        'Staking rewards (8% APY target)',
        'Platform fee revenue sharing',
        'Deflationary mechanics (2% annual burn)',
        'Premium marketplace features'
      ],
      timeline: {
        ico: 'Q1 2025 (Current)',
        public: 'Q4 2025',
        exchange: 'Q1 2026'
      }
    }
  },
  {
    id: 13,
    type: 'risks',
    title: 'Risk Assessment',
    subtitle: 'Comprehensive risk management',
    description: 'Identified risks with mitigation strategies',
    icon: Shield,
    bgGradient: 'from-red-600 to-orange-600',
    content: {
      risks: [
        {
          risk: 'Regulatory Compliance',
          impact: 'Medium',
          mitigation: 'Legal framework designed for utility token compliance'
        },
        {
          risk: 'Market Adoption',
          impact: 'Medium',
          mitigation: 'Proven demand through pilot programs and partnerships'
        },
        {
          risk: 'Technical Implementation',
          impact: 'Low',
          mitigation: 'Experienced team with proven track record'
        },
        {
          risk: 'Competition',
          impact: 'Low',
          mitigation: 'First-mover advantage and unique dual-token architecture'
        }
      ]
    }
  },
  {
    id: 14,
    type: 'cta',
    title: 'Join the Revolution',
    subtitle: 'Invest in the future of humanitarian technology',
    description: 'Be part of the solution to homelessness',
    icon: Rocket,
    bgGradient: 'from-green-600 to-blue-600',
    content: {
      summary: [
        'Revolutionary dual-token architecture',
        '$45B addressable market opportunity',
        '95% efficiency vs traditional 60-70%',
        'Immediate utility and governance rights',
        'Clear path to $15M market cap by 2027'
      ],
      nextSteps: [
        'Schedule investor meeting',
        'Review technical documentation',
        'Join community governance',
        'Participate in token sale'
      ],
      contact: 'joel@arcanaconcept.com'
    }
  }
];

// Investment Deck Slideshow Component
function InvestmentDeckSlideshow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % investmentSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + investmentSlides.length) % investmentSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  const slide = investmentSlides[currentSlide];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Slide Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-background rounded-lg shadow-2xl overflow-hidden">
        {/* Slide Content */}
        <div className="h-full flex flex-col">
          {/* Slide Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">SHELTR Investment Deck</h2>
              <Badge variant="secondary">{currentSlide + 1} / {investmentSlides.length}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Slide Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className={`h-full bg-gradient-to-br ${slide.bgGradient} rounded-lg p-8 text-white`}>
              {/* Slide Type Specific Content */}
              {slide.type === 'title' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
                    <slide.icon className="h-12 w-12" />
                  </div>
                  <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
                  <h2 className="text-3xl font-semibold mb-6 text-white/90">{slide.subtitle}</h2>
                  <p className="text-xl mb-8">{slide.description}</p>
                  <div className="bg-white/20 px-6 py-3 rounded-full">
                    <p className="text-lg font-semibold">{slide.highlight}</p>
                  </div>
                </div>
              )}

              {slide.type === 'problem' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Side-by-Side Comparison */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Fundraising Methods Comparison</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Traditional Method */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-red-400/30">
                        <div className="absolute inset-0 bg-red-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold mb-4 text-red-200 text-center">Traditional Fundraising</h4>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <span className="text-white/90">Multi-layer intermediaries</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <span className="text-white/90">Opaque donation tracking</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <span className="text-white/90">60-70% efficiency rate</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <span className="text-white/90">Centralized control</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <span className="text-white/90">24-72 hour delivery</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* SHELTR Method */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-green-400/30">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold mb-4 text-green-200 text-center">SHELTR Solution</h4>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-white/90">Direct blockchain transactions</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-white/90">Real-time transparency</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-white/90">95% efficiency rate</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-white/90">Decentralized platform</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-white/90">Instant delivery</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Statistics */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Key Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {slide.content.stats?.map((stat, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10">
                            <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                            <div className={`text-2xl font-bold ${stat.color} drop-shadow-sm`}>{stat.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Core Problems */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Core Problems</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {slide.content.problems?.map((problem, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-3">
                          <div className="absolute inset-0 bg-white/10"></div>
                          <div className="relative z-10 flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                            <span className="text-white/90">{problem}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'solution' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm mb-4">{slide.description}</p>
                    
                    {/* Philosophy Blurb */}
                    <div className="bg-white/15 backdrop-blur-sm p-4 rounded-lg border border-white/20 max-w-2xl mx-auto">
                      <p className="text-lg font-semibold text-white drop-shadow-sm">
                        &ldquo;Better to Solve than Manage&rdquo; - We don&apos;t just manage homelessness, we solve it through direct action and immediate impact.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                                          <div>
                        <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Key Features</h3>
                        <div className="space-y-3">
                          {slide.content.features?.map((feature, index) => (
                            <div key={index} className="relative overflow-hidden rounded-lg p-3">
                              <div className="absolute inset-0 bg-white/10"></div>
                              <div className="relative z-10 flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                <span className="text-white/90">{feature}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                                          <div>
                        <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Efficiency Comparison</h3>
                        <div className="space-y-4">
                          <div className="relative overflow-hidden rounded-lg p-4 border border-red-400/30">
                            <div className="absolute inset-0 bg-red-500/20"></div>
                            <div className="relative z-10">
                              <div className="text-sm text-white/70">Traditional Charity</div>
                              <div className="text-2xl font-bold text-red-400">{slide.content.comparison?.traditional}</div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4 border border-green-400/30">
                            <div className="absolute inset-0 bg-green-500/20"></div>
                            <div className="relative z-10">
                              <div className="text-sm text-white/70">SHELTR Platform</div>
                              <div className="text-2xl font-bold text-green-400">{slide.content.comparison?.sheltr}</div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4 border border-blue-400/30">
                            <div className="absolute inset-0 bg-blue-500/20"></div>
                            <div className="relative z-10">
                              <div className="text-sm text-white/70">Improvement</div>
                              <div className="text-2xl font-bold text-blue-400">{slide.content.comparison?.improvement}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  
                  {/* Technical Solution Breakdown */}
                  <div className="mt-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Technical Solution Architecture</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      
                      {/* Smart Contract Solution */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-blue-400/30">
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-xl font-bold mb-4 text-blue-200 text-center">Smart Contract Solution</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <span className="text-white/90 text-sm">Automated fund distribution</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <span className="text-white/90 text-sm">Transparent transaction logs</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <span className="text-white/90 text-sm">Immutable audit trail</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <span className="text-white/90 text-sm">No human intervention</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <span className="text-white/90 text-sm">Instant execution</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* QR Code System */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-green-400/30">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-xl font-bold mb-4 text-green-200 text-center">QR Code System</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-white/90 text-sm">Unique participant identifiers</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-white/90 text-sm">Secure donation scanning</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-white/90 text-sm">Mobile-first accessibility</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-white/90 text-sm">Real-time verification</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-white/90 text-sm">Privacy-preserving design</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Donor Attachment Factor */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-purple-400/30">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-xl font-bold mb-4 text-purple-200 text-center">Donor Attachment Factor</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-purple-400" />
                              <span className="text-white/90 text-sm">Giving at a distance</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-purple-400" />
                              <span className="text-white/90 text-sm">Immediate impact visibility</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-purple-400" />
                              <span className="text-white/90 text-sm">Personal connection to recipients</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-purple-400" />
                              <span className="text-white/90 text-sm">Transparent fund tracking</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-purple-400" />
                              <span className="text-white/90 text-sm">Emotional engagement</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'market' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Market Size Statistics */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Market Size Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {slide.content.marketSizes?.map((market, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10 text-center">
                            <div className="text-sm text-white/80 font-medium mb-1">{market.label}</div>
                            <div className="text-2xl font-bold text-white drop-shadow-sm mb-1">{market.value}</div>
                            <div className="text-xs text-white/70">{market.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Growth Projections */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Growth Projections</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Array.isArray(slide.content.projections) && slide.content.projections.map((projection: { year: string; value: string; description: string }, index: number) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                          <div className="absolute inset-0 bg-white/10"></div>
                          <div className="relative z-10 text-center">
                            <div className="text-lg font-bold text-white mb-1">{projection.year}</div>
                            <div className="text-xl font-bold text-purple-300 mb-1">{projection.value}</div>
                            <div className="text-sm text-white/80">{projection.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Key Market Segments */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Target Market Segments</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {slide.content.segments?.map((segment, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-3">
                          <div className="absolute inset-0 bg-white/10"></div>
                          <div className="relative z-10 flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                            <span className="text-white/90">{segment}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'technology' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Technology Stack */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Technology Stack</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {slide.content.stack?.map((tech, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-6 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10">
                            <h4 className="text-xl font-bold text-white mb-3 text-center">{tech.component}</h4>
                            <div className="bg-white/10 p-4 rounded-lg">
                              <p className="text-white/90 text-center font-mono text-sm">{tech.tech}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Key Features */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Key Features</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {slide.content.features?.map((feature, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-3">
                          <div className="absolute inset-0 bg-white/10"></div>
                          <div className="relative z-10 flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                            <span className="text-white/90">{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'tokens' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Token Overview */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Dual-Token Architecture</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* SHELTR-S Card */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-green-400/30">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold text-green-200 mb-4 text-center">{slide.content.sheltrS?.name}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Price:</span>
                              <span className="font-bold text-green-300">{slide.content.sheltrS?.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Supply:</span>
                              <span className="font-bold text-green-300">{slide.content.sheltrS?.supply}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Backing:</span>
                              <span className="font-bold text-green-300">{slide.content.sheltrS?.backing}</span>
                            </div>
                            <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                              <p className="text-sm text-white/90">{slide.content.sheltrS?.use}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* SHELTR Card */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-purple-400/30">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold text-purple-200 mb-4 text-center">{slide.content.sheltr?.name}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Price:</span>
                              <span className="font-bold text-purple-300">{slide.content.sheltr?.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Supply:</span>
                              <span className="font-bold text-purple-300">{slide.content.sheltr?.supply}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Mechanism:</span>
                              <span className="font-bold text-purple-300">{slide.content.sheltr?.mechanism}</span>
                            </div>
                            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
                              <p className="text-sm text-white/90">{slide.content.sheltr?.use}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* SmartFund Distribution */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">SmartFund™ Distribution</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-3xl font-bold text-blue-300 mb-2">{slide.content.distribution?.participants}</div>
                          <div className="text-sm text-white/80">Direct to Participants</div>
                          <div className="text-xs text-white/60 mt-1">Immediate impact & dignity</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-3xl font-bold text-green-300 mb-2">{slide.content.distribution?.housing}</div>
                          <div className="text-sm text-white/80">Housing Fund</div>
                          <div className="text-xs text-white/60 mt-1">Long-term solutions</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-3xl font-bold text-purple-300 mb-2">{slide.content.distribution?.operations}</div>
                          <div className="text-sm text-white/80">Platform Operations</div>
                          <div className="text-xs text-white/60 mt-1">Sustainable growth</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'revenue' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Revenue Streams */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Revenue Streams</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {slide.content.revenueStreams?.map((stream, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-6 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10">
                            <h4 className="text-xl font-bold text-white mb-3">{stream.source}</h4>
                            <div className="text-3xl font-bold text-green-300 mb-2">{stream.percentage}</div>
                            <p className="text-sm text-white/80">{stream.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Revenue Projections */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Revenue Projections</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Year 1</div>
                          <div className="text-2xl font-bold text-blue-300 mb-1">{(slide.content.projections as { year1: string; year2: string; year3: string })?.year1}</div>
                          <div className="text-xs text-white/70">Platform launch & early adoption</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Year 2</div>
                          <div className="text-2xl font-bold text-green-300 mb-1">{(slide.content.projections as { year1: string; year2: string; year3: string })?.year2}</div>
                          <div className="text-xs text-white/70">Market expansion & partnerships</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Year 3</div>
                          <div className="text-2xl font-bold text-purple-300 mb-1">{(slide.content.projections as { year1: string; year2: string; year3: string })?.year3}</div>
                          <div className="text-xs text-white/70">International scaling</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'competitive' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* First-Mover Advantages */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">First-Mover Advantages</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {slide.content.advantages?.map((advantage, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10 flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                            <span className="text-white/90 font-medium">{advantage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Competitive Moats */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Competitive Moats</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {slide.content.moats?.map((moat, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                          <div className="absolute inset-0 bg-white/10"></div>
                          <div className="relative z-10">
                            <h4 className="text-lg font-bold text-white mb-2">{moat}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <span className="text-sm text-white/80">Sustainable competitive advantage</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Blockchain Innovation Highlight */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Revolutionary Blockchain Integration</h3>
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-white/20">
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-white mb-3">First Mobile Donation Platform with Blockchain Transparency</h4>
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-300 mb-1">95%</div>
                            <div className="text-sm text-white/80">Efficiency vs 60-70% Traditional</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-300 mb-1">100%</div>
                            <div className="text-sm text-white/80">Transparent Transactions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-300 mb-1">24/7</div>
                            <div className="text-sm text-white/80">Blockchain Verification</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'financial' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* ICO Information */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Pre-Seed ICO Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* ICO Card */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-blue-400/30">
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold text-blue-200 mb-4 text-center">{slide.content.ico?.round}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Token Price:</span>
                              <span className="font-bold text-blue-300">{slide.content.ico?.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Target Raise:</span>
                              <span className="font-bold text-blue-300">{slide.content.ico?.target}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Tokens Available:</span>
                              <span className="font-bold text-blue-300">{slide.content.ico?.tokens}</span>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/80">Progress:</span>
                                <span className="font-bold text-blue-300">{slide.content.ico?.progress}%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-3">
                                <div 
                                  className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${slide.content.ico?.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Public Launch Card */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-green-400/30">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold text-green-200 mb-4 text-center">{slide.content.public?.round}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Token Price:</span>
                              <span className="font-bold text-green-300">{slide.content.public?.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Allocation:</span>
                              <span className="font-bold text-green-300">{slide.content.public?.allocation}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Market Cap:</span>
                              <span className="font-bold text-green-300">{slide.content.public?.marketCap}</span>
                            </div>
                            <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                              <p className="text-sm text-white/90">100% discount to pre-seed investors</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Market Cap Projections */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">5-Year Market Cap Projections</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Year 1</div>
                          <div className="text-2xl font-bold text-blue-300 mb-1">{(slide.content.projections as { year1: string; year2: string; year3: string })?.year1}</div>
                          <div className="text-xs text-white/70">Platform launch & early adoption</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Year 2</div>
                          <div className="text-2xl font-bold text-green-300 mb-1">{(slide.content.projections as { year1: string; year2: string; year3: string })?.year2}</div>
                          <div className="text-xs text-white/70">Market expansion & partnerships</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Year 3</div>
                          <div className="text-2xl font-bold text-purple-300 mb-1">{(slide.content.projections as { year1: string; year2: string; year3: string })?.year3}</div>
                          <div className="text-xs text-white/70">International scaling</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'funds' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Fund Allocation */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Strategic Fund Allocation</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {slide.content.allocation?.map((item, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-6 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-xl font-bold text-white">{item.category}</h4>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-purple-300">{item.percentage}%</div>
                                <div className="text-sm text-white/80">{item.amount}</div>
                              </div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                              <div 
                                className="bg-purple-400 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-white/80">{item.focus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Development Milestones */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Key Development Milestones</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      {slide.content.milestones?.map((milestone, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                          <div className="absolute inset-0 bg-white/10"></div>
                          <div className="relative z-10 text-center">
                            <div className="text-lg font-bold text-white mb-2">{milestone}</div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <span className="text-xs text-white/70">Strategic milestone</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'terms' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Investment Structure */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Investment Structure</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Structure Card */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-indigo-400/30">
                        <div className="absolute inset-0 bg-indigo-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold text-indigo-200 mb-4 text-center">ICO Structure</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Type:</span>
                              <span className="font-bold text-indigo-300">{slide.content.structure?.type}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Token:</span>
                              <span className="font-bold text-indigo-300">{slide.content.structure?.token}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Governance:</span>
                              <span className="font-bold text-indigo-300">{slide.content.structure?.governance}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Vesting:</span>
                              <span className="font-bold text-indigo-300">{slide.content.structure?.vesting}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Benefits Card */}
                      <div className="relative overflow-hidden rounded-lg p-6 border-2 border-purple-400/30">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold text-purple-200 mb-4 text-center">Investor Benefits</h4>
                          <div className="space-y-2">
                            {slide.content.benefits?.map((benefit, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                                <span className="text-sm text-white/90">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Investment Timeline</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">ICO</div>
                          <div className="text-xl font-bold text-blue-300 mb-1">{(slide.content.timeline as { ico: string; public: string; exchange: string })?.ico}</div>
                          <div className="text-xs text-white/70">Pre-seed token sale</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-green-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Public</div>
                          <div className="text-xl font-bold text-green-300 mb-1">{(slide.content.timeline as { ico: string; public: string; exchange: string })?.public}</div>
                          <div className="text-xs text-white/70">Public token launch</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg p-4 border border-white/20">
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-white mb-1">Exchange</div>
                          <div className="text-xl font-bold text-purple-300 mb-1">{(slide.content.timeline as { ico: string; public: string; exchange: string })?.exchange}</div>
                          <div className="text-xs text-white/70">Major exchange listings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'risks' && slide.content && (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-2 text-white/90 drop-shadow-md">{slide.subtitle}</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">{slide.description}</p>
                  </div>
                  
                  {/* Risk Assessment */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Risk Assessment & Mitigation</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {slide.content.risks?.map((risk, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg p-6 border border-white/20">
                          <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-bold text-white">{risk.risk}</h4>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                risk.impact === 'High' ? 'bg-red-500/20 text-red-300' :
                                risk.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {risk.impact} Impact
                              </div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg">
                              <p className="text-sm text-white/80">{risk.mitigation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Risk Management Framework */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">Risk Management Framework</h3>
                    <div className="bg-gradient-to-r from-red-500/20 to-green-500/20 p-6 rounded-lg border border-white/20">
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-white mb-4">Proactive Risk Management Strategy</h4>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-300 mb-1">Multiple</div>
                            <div className="text-sm text-white/80">Security Audits</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-300 mb-1">Insurance</div>
                            <div className="text-sm text-white/80">Coverage</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-300 mb-1">Legal</div>
                            <div className="text-sm text-white/80">Framework</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-300 mb-1">Emergency</div>
                            <div className="text-sm text-white/80">Pause</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.type === 'cta' && slide.content && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  {/* Main CTA */}
                  <div className="mb-12">
                    <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">Join the Revolution</h1>
                    <h2 className="text-3xl font-semibold mb-4 text-white/90 drop-shadow-md">Invest in the future of humanitarian technology</h2>
                    <p className="text-xl text-white/80 drop-shadow-sm">Be part of the solution to homelessness</p>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-4">Get In Touch</h3>
                      <div className="flex items-center justify-center space-x-4">
                        <Mail className="h-6 w-6 text-white/80" />
                        <a 
                          href="mailto:info@arcanaconcept.com" 
                          className="text-xl font-semibold text-white hover:text-blue-300 transition-colors"
                        >
                          info@arcanaconcept.com
                        </a>
                        <span className="text-white/60">- General Inquiries</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <a 
                      href="/solutions" 
                      className="relative overflow-hidden rounded-lg p-6 border-2 border-green-400/30 hover:border-green-400/50 transition-all"
                    >
                      <div className="absolute inset-0 bg-green-500/20"></div>
                      <div className="relative z-10 text-center">
                        <h4 className="text-2xl font-bold text-green-200 mb-2">Get Started</h4>
                        <p className="text-sm text-white/80">Explore our solutions and sign up</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://github.com/mrj0nesmtl/sheltr-ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="relative overflow-hidden rounded-lg p-6 border-2 border-blue-400/30 hover:border-blue-400/50 transition-all"
                    >
                      <div className="absolute inset-0 bg-blue-500/20"></div>
                      <div className="relative z-10 text-center">
                        <h4 className="text-2xl font-bold text-blue-200 mb-2">View Code</h4>
                        <p className="text-sm text-white/80">Open source on GitHub</p>
                      </div>
                    </a>
                  </div>
                  
                  {/* Resources Grid */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white drop-shadow-md">Learn More</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <a 
                        href="https://open.substack.com/pub/arcanaconcept/p/sheltr-redefining-charitable-giving?r=4gkajt&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg p-4 border border-white/20 hover:border-white/40 transition-all"
                      >
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-purple-200 mb-1">Substack</div>
                          <div className="text-xs text-white/70">SHELTR Redefining Charitable Giving</div>
                        </div>
                      </a>
                      
                      <a 
                        href="https://www.arcanaconcept.com/concepts/sheltr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg p-4 border border-white/20 hover:border-white/40 transition-all"
                      >
                        <div className="absolute inset-0 bg-orange-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-orange-200 mb-1">Arcana Concept</div>
                          <div className="text-xs text-white/70">SHELTR Concept Page</div>
                        </div>
                      </a>
                      
                      <a 
                        href="https://bsky.app/profile/sheltrops.bsky.social" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg p-4 border border-white/20 hover:border-white/40 transition-all"
                      >
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-lg font-bold text-blue-200 mb-1">Bluesky</div>
                          <div className="text-xs text-white/70">Follow @sheltrops.bsky.social</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  
                  {/* Technology Partners */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-white/80 drop-shadow-md">Powered By</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <a 
                        href="https://www.base.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg p-3 border border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="absolute inset-0 bg-green-500/10"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-sm font-bold text-green-200">Base L2</div>
                          <div className="text-xs text-white/60">Ethereum L2 Network</div>
                        </div>
                      </a>
                      
                      <a 
                        href="https://developer.visa.com/use-cases/visa-intelligent-commerce-for-agents" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg p-3 border border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="absolute inset-0 bg-blue-500/10"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-sm font-bold text-blue-200">Visa</div>
                          <div className="text-xs text-white/60">Intelligent Commerce</div>
                        </div>
                      </a>
                      
                      <a 
                        href="https://corporate.visa.com/en/products/intelligent-commerce.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg p-3 border border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="absolute inset-0 bg-yellow-500/10"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-sm font-bold text-yellow-200">Visa Corporate</div>
                          <div className="text-xs text-white/60">Payment Solutions</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Add more slide type renderers as needed */}
              {slide.type !== 'title' && slide.type !== 'problem' && slide.type !== 'solution' && slide.type !== 'market' && slide.type !== 'technology' && slide.type !== 'tokens' && slide.type !== 'revenue' && slide.type !== 'competitive' && slide.type !== 'financial' && slide.type !== 'funds' && slide.type !== 'terms' && slide.type !== 'risks' && slide.type !== 'cta' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                  <h2 className="text-2xl font-semibold mb-2">{slide.subtitle}</h2>
                  <p className="text-xl">{slide.description}</p>
                  <div className="mt-8 text-lg">
                    <p>Slide content for {slide.type} coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {investmentSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextSlide}
              disabled={currentSlide === investmentSlides.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvestorRelationsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [deckOpen, setDeckOpen] = useState(false);

  // Calendar/Meeting state
  const [isScheduling, setIsScheduling] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedulingResult, setSchedulingResult] = useState<SchedulingResult | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    name: '',
    email: '',
    company: '',
    investmentRange: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'America/New_York',
    additionalNotes: '',
  });

  const calendarService = new CalendarService();

  const tokenProjections = [
    { year: 2025, users: 2500, transactions: 125000, tokenValue: 0.10, marketCap: 250000, phase: 'Beta Launch' },
    { year: 2026, users: 10000, transactions: 500000, tokenValue: 0.25, marketCap: 2500000, phase: 'Market Expansion' },
    { year: 2027, users: 25000, transactions: 1250000, tokenValue: 0.50, marketCap: 12500000, phase: 'Scale Phase' },
    { year: 2028, users: 50000, transactions: 2500000, tokenValue: 0.85, marketCap: 42500000, phase: 'International' },
    { year: 2029, users: 100000, transactions: 5000000, tokenValue: 1.20, marketCap: 120000000, phase: 'Market Leader' }
  ];

  const fundingAllocation = [
    { category: 'Platform Development', percentage: 40, amount: 60000, color: 'bg-blue-500' },
    { category: 'AI & Knowledge Base', percentage: 20, amount: 30000, color: 'bg-yellow-500' },
    { category: 'Blockchain Infrastructure', percentage: 15, amount: 22500, color: 'bg-green-500' },
    { category: 'Regulatory & Compliance', percentage: 15, amount: 22500, color: 'bg-purple-500' },
    { category: 'Marketing & Partnerships', percentage: 10, amount: 15000, color: 'bg-orange-500' }
  ];

  const milestones = [
    { quarter: 'Q1 2025', title: 'Platform Beta Launch', status: 'completed' },
    { quarter: 'Q2 2025', title: 'Blockchain Integration', status: 'in-progress' },
    { quarter: 'Q3 2025', title: 'AI & Knowledge Base', status: 'planned' },
    { quarter: 'Q4 2025', title: 'Token Launch ($SHLTR)', status: 'planned' },
    { quarter: 'Q1-Q2 2026', title: 'Market Expansion', status: 'planned' },
    { quarter: 'Q3-Q4 2026', title: 'Multi-City Rollout', status: 'planned' }
  ];

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingForm.name || !meetingForm.email || !meetingForm.preferredDate || !meetingForm.preferredTime) {
      setSchedulingResult({
        success: false,
        message: 'Please fill in all required fields.',
      });
      return;
    }

    setIsScheduling(true);
    setSchedulingResult(null);

    try {
      // Combine date and time
      const dateTime = new Date(`${meetingForm.preferredDate}T${meetingForm.preferredTime}`);
      
      const result = await calendarService.createInvestorMeeting(
        meetingForm.email,
        meetingForm.name,
        dateTime.toISOString(),
        meetingForm.additionalNotes
      );

      setSchedulingResult(result);
      
      if (result.success) {
        // Reset form on success
        setMeetingForm({
          name: '',
          email: '',
          company: '',
          investmentRange: '',
          preferredDate: '',
          preferredTime: '',
          timezone: 'America/New_York',
          additionalNotes: '',
        });
      }
    } catch (error) {
      setSchedulingResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleScheduleButtonClick = () => {
    setShowScheduleForm(true);
    setSchedulingResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ThemeLogo />
              <Badge variant="secondary" className="text-xs">INVESTOR RELATIONS</Badge>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Lock className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-muted-foreground">Private & Confidential</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/backgrounds/hero-bg.jpg)',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80" />
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-amber-600 text-black">PRE-SEED FUNDING ROUND</Badge>
            <h1 className="text-5xl font-bold mb-6">
              Invest in the Future of 
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Humanitarian Technology</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Join us in revolutionizing homelessness support through our dual-token architecture: 
              SHELTR-S (stable) for participant protection and SHELTR (growth) for community governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-black"
                onClick={() => setDeckOpen(true)}
              >
                <Eye className="h-5 w-5 mr-2" />
                View Investment Deck
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={handleScheduleButtonClick}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Meeting Modal/Form */}
      {showScheduleForm && (
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Schedule Investor Meeting
                  </CardTitle>
                  <CardDescription>
                    Book a 45-minute discussion about SHELTR investment opportunity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    {schedulingResult && (
                      <div className={`mb-6 p-4 rounded-lg ${
                        schedulingResult.success 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        <div className="flex items-center gap-2">
                          {schedulingResult.success ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <AlertCircle className="h-5 w-5" />
                          )}
                          <span className="font-medium">{schedulingResult.message}</span>
                        </div>
                        {schedulingResult.success && schedulingResult.meetingLink && (
                          <div className="mt-2">
                            <a 
                              href={schedulingResult.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Join Meeting Link
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <form onSubmit={handleScheduleMeeting} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={meetingForm.name}
                            onChange={(e) => setMeetingForm({...meetingForm, name: e.target.value})}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={meetingForm.email}
                            onChange={(e) => setMeetingForm({...meetingForm, email: e.target.value})}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company/Organization</Label>
                          <Input
                            id="company"
                            value={meetingForm.company}
                            onChange={(e) => setMeetingForm({...meetingForm, company: e.target.value})}
                            placeholder="Your company name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="investmentRange">Investment Range</Label>
                          <select
                            id="investmentRange"
                            value={meetingForm.investmentRange}
                            onChange={(e) => setMeetingForm({...meetingForm, investmentRange: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select range</option>
                            <option value="$1K-$5K">$1,000 - $5,000</option>
                            <option value="$5K-$25K">$5,000 - $25,000</option>
                            <option value="$25K-$50K">$25,000 - $50,000</option>
                            <option value="$50K+">$50,000+</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preferredDate">Preferred Date *</Label>
                          <Input
                            id="preferredDate"
                            type="date"
                            value={meetingForm.preferredDate}
                            onChange={(e) => setMeetingForm({...meetingForm, preferredDate: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredTime">Preferred Time (EST) *</Label>
                          <Input
                            id="preferredTime"
                            type="time"
                            value={meetingForm.preferredTime}
                            onChange={(e) => setMeetingForm({...meetingForm, preferredTime: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <textarea
                          id="additionalNotes"
                          value={meetingForm.additionalNotes}
                          onChange={(e) => setMeetingForm({...meetingForm, additionalNotes: e.target.value})}
                          placeholder="Any specific topics you'd like to discuss or questions you have..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button 
                          type="submit" 
                          disabled={isScheduling}
                          className="flex-1"
                        >
                          {isScheduling ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Meeting
                            </>
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowScheduleForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

      {/* Investment Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold mb-2">$150K</h3>
                <p className="text-muted-foreground">Pre-Seed Target</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold mb-2">3 Months</h3>
                <p className="text-muted-foreground">Development Timeline</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Coins className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                <h3 className="text-2xl font-bold mb-2">$SHLTR</h3>
                <p className="text-muted-foreground">Utility Token</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold mb-2">30x</h3>
                <p className="text-muted-foreground">5-Year ROI Projection</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Executive Summary</TabsTrigger>
              <TabsTrigger value="product">Product & Technology</TabsTrigger>
              <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
              <TabsTrigger value="projections">Financial Projections</TabsTrigger>
              <TabsTrigger value="investment">Investment Terms</TabsTrigger>
            </TabsList>

            {/* Executive Summary */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Market Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold">Global Homelessness</h4>
                        <p className="text-2xl font-bold text-red-600">150M+</p>
                        <p className="text-sm text-muted-foreground">People worldwide</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Annual Spending</h4>
                        <p className="text-2xl font-bold text-green-600">$45B</p>
                        <p className="text-sm text-muted-foreground">Global aid budget</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Problems We Solve</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Lack of donation transparency
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Inefficient resource allocation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Participant dignity and privacy
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Data fragmentation across agencies
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Limited shelter revenue opportunities
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          No AI-powered support systems
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Competitive Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">Blockchain Transparency</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Every transaction immutably recorded</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">AI-Driven Insights</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">Predictive analytics for resource optimization</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300">Multi-Stakeholder Platform</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Unified solution for all participants</p>
                      </div>
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-300">Dignity-First Design</h4>
                        <p className="text-sm text-amber-600 dark:text-amber-400">Privacy-preserving participant experience</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">AI-Powered Support</h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">24/7 chatbot with knowledge base integration</p>
                      </div>
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-300">Shelter Revenue Model</h4>
                        <p className="text-sm text-cyan-600 dark:text-cyan-400">Direct revenue generation for partner shelters</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Fundraising Thesis & Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-blue-700 dark:text-blue-300">Token-Based Investment Structure</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h5 className="font-semibold">SHELTR-S (Stable Token)</h5>
                            <p className="text-sm text-muted-foreground">USD-pegged utility token for participant protection. Every new participant receives 100 SHELTR-S tokens ($100 value) upon signup.</p>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <h5 className="font-semibold">SHELTR (Growth Token)</h5>
                            <p className="text-sm text-muted-foreground">Community governance token with deflationary mechanics. Pre-seed investors receive SHELTR tokens with 50% discount.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-green-700 dark:text-green-300">Multi-Round Strategy</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                              <h5 className="font-semibold">Pre-Seed (Current)</h5>
                              <p className="text-sm text-muted-foreground">Platform completion & token launch</p>
                            </div>
                            <span className="font-bold text-green-600">$150K</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div>
                              <h5 className="font-semibold">Seed Round (2025 Q4)</h5>
                              <p className="text-sm text-muted-foreground">Market expansion & partnerships</p>
                            </div>
                            <span className="font-bold text-purple-600">$1M</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <div>
                              <h5 className="font-semibold">Series A (2026)</h5>
                              <p className="text-sm text-muted-foreground">Global scaling & institutional adoption</p>
                            </div>
                            <span className="font-bold text-amber-600">$5M+</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <h4 className="font-bold mb-3">Why Token-Based Investment?</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Direct utility alignment with platform success</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Governance rights in platform decisions</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Built-in liquidity through DeFi markets</span>
                          </li>
                        </ul>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Global accessibility for international investors</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Deflationary mechanics drive long-term value</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Transparent on-chain fund management</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Development Roadmap & Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="relative">
                        <div className={`p-4 rounded-lg border-2 ${
                          milestone.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                          milestone.status === 'in-progress' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                          'border-gray-300 bg-gray-50 dark:bg-gray-800'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={
                              milestone.status === 'completed' ? 'default' :
                              milestone.status === 'in-progress' ? 'secondary' : 'outline'
                            }>
                              {milestone.quarter}
                            </Badge>
                            {milestone.status === 'completed' && 
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            }
                          </div>
                          <h4 className="font-semibold text-sm">{milestone.title}</h4>
                        </div>
                        {index < milestones.length - 1 && (
                          <ArrowRight className="h-4 w-4 absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product & Technology */}
            <TabsContent value="product" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>System Architecture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg">
                        <h4 className="font-bold mb-3 text-center">SHELTR-AI Platform Stack</h4>
                        <div className="space-y-3">
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border text-center shadow-sm">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Globe className="h-5 w-5 text-blue-600" />
                              <strong className="text-gray-900 dark:text-white">Frontend:</strong>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Next.js + React + TypeScript</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border text-center shadow-sm">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Building className="h-5 w-5 text-green-600" />
                              <strong className="text-gray-900 dark:text-white">Backend:</strong>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">FastAPI + Python + Firebase</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border text-center shadow-sm">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Coins className="h-5 w-5 text-yellow-600" />
                              <strong className="text-gray-900 dark:text-white">Blockchain:</strong>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Ethereum + Smart Contracts</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border text-center shadow-sm">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Shield className="h-5 w-5 text-purple-600" />
                              <strong className="text-gray-900 dark:text-white">Database:</strong>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Firestore + Multi-Tenant Architecture</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border text-center shadow-sm">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <BarChart3 className="h-5 w-5 text-orange-600" />
                              <strong className="text-gray-900 dark:text-white">AI/ML:</strong>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">OpenAI + Anthropic + Firestore Embeddings + Predictive Analytics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Core Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Multi-Role Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Blockchain Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">Real-Time Analytics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-orange-500" />
                          <span className="font-medium">QR Code Integration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">AI Chatbot Service</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-pink-500" />
                          <span className="font-medium">Knowledge Base</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">Token Economy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PieChart className="h-5 w-5 text-red-500" />
                          <span className="font-medium">Impact Tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Privacy Protection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-teal-500" />
                          <span className="font-medium">Predictive Modeling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-cyan-500" />
                          <span className="font-medium">Shelter Revenue Model</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-emerald-500" />
                          <span className="font-medium">Visa MCP Integration</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Data Flow & Transaction Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg">
                    <div className="grid md:grid-cols-5 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h4 className="font-semibold">Donor Scans QR</h4>
                        <p className="text-xs text-muted-foreground">Mobile app or web interface</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h4 className="font-semibold">Smart Contract</h4>
                        <p className="text-xs text-muted-foreground">Blockchain verification</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h4 className="font-semibold">Fund Allocation</h4>
                        <p className="text-xs text-muted-foreground">85% direct, 10% housing, 5% operations</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <h4 className="font-semibold">Impact Tracking</h4>
                        <p className="text-xs text-muted-foreground">Real-time analytics</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-white font-bold">5</span>
                        </div>
                        <h4 className="font-semibold">Donor Feedback</h4>
                        <p className="text-xs text-muted-foreground">Transparent reporting</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    AI & Knowledge Base Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-600">AI Chatbot Service</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h5 className="font-semibold text-blue-700 dark:text-blue-300">Multi-Agent System</h5>
                          <p className="text-sm text-blue-600 dark:text-blue-400">5 specialized AI agents for different user needs</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h5 className="font-semibold text-green-700 dark:text-green-300">Knowledge Base Integration</h5>
                          <p className="text-sm text-green-600 dark:text-green-400">RAG-powered responses with real-time document access</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <h5 className="font-semibold text-purple-700 dark:text-purple-300">24/7 Support</h5>
                          <p className="text-sm text-purple-600 dark:text-purple-400">Always-available assistance for participants and donors</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-600">Shelter Revenue Model</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h5 className="font-semibold text-green-700 dark:text-green-300">Participant Onboarding</h5>
                          <p className="text-sm text-green-600 dark:text-green-400">Shelters earn revenue by registering participants</p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <h5 className="font-semibold text-amber-700 dark:text-amber-300">5% Operations Support</h5>
                          <p className="text-sm text-amber-600 dark:text-amber-400">Direct funding from participant donations</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h5 className="font-semibold text-blue-700 dark:text-blue-300">Platform Services</h5>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Management tools and analytics for shelter operations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tokenomics */}
            <TabsContent value="tokenomics" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-amber-500" />
                      $SHLTR Token Economics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <h4 className="font-bold text-2xl text-amber-600">100M</h4>
                        <p className="text-sm">Total Supply</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-bold text-2xl text-blue-600">$0.10</h4>
                        <p className="text-sm">Initial Price</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Token Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Public Sale (50%)</span>
                          <span className="font-mono">50,000,000 $SHLTR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Team & Advisors (15%)</span>
                          <span className="font-mono">15,000,000 $SHLTR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>SHELTR Operations (15%)</span>
                          <span className="font-mono">15,000,000 $SHLTR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Participant Onboarding Rewards (10%)</span>
                          <span className="font-mono">10,000,000 $SHLTR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Strategic Partnerships (5%)</span>
                          <span className="font-mono">5,000,000 $SHLTR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Reserve Fund (5%)</span>
                          <span className="font-mono">5,000,000 $SHLTR</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Token Utility & Value Drivers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">Transaction Fees</h4>
                        <p className="text-sm text-muted-foreground">2% platform fee paid in $SHLTR</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">Governance Rights</h4>
                        <p className="text-sm text-muted-foreground">Vote on platform upgrades and policies</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300">Staking Rewards</h4>
                        <p className="text-sm text-muted-foreground">Earn yield for providing liquidity</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-300">Welcome Bonus</h4>
                        <p className="text-sm text-muted-foreground">New participants receive 100 SHELTR-S tokens</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Deflationary Mechanics</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 1% of transaction fees burned quarterly</li>
                        <li>• Buy-back program from platform revenue</li>
                        <li>• Staking locks reduce circulating supply</li>
                      </ul>
                    </div>
                    
                    {/* ROI Visualization */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-4 text-center">Investment ROI Timeline</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { year: '2025', roi: '1x', price: '$0.05', label: 'Pre-Seed' },
                          { year: '2026', roi: '5x', price: '$0.25', label: 'Token Launch' },
                          { year: '2027', roi: '10x', price: '$0.50', label: 'Scale' },
                          { year: '2028', roi: '17x', price: '$0.85', label: 'Expand' },
                          { year: '2029', roi: '30x', price: '$1.20', label: 'Leader' }
                        ].map((item, index) => (
                          <div key={item.year} className="text-center">
                            <div className="relative h-32 flex flex-col justify-end">
                              <div 
                                className="bg-gradient-to-b from-green-500 to-blue-500 rounded-t-lg mx-auto transition-all duration-500"
                                style={{ 
                                  height: `${Math.max(20, (parseInt(item.roi) / 30) * 100)}px`,
                                  width: '70%'
                                }}
                              ></div>
                              <div className="text-xs font-bold mt-1 text-green-600">{item.roi}</div>
                              <div className="text-xs text-muted-foreground">{item.price}</div>
                              <div className="text-xs font-medium">{item.year}</div>
                              <div className="text-xs text-muted-foreground">{item.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Token Release Schedule</CardTitle>
                </CardHeader>
                                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { year: 'Year 1', percentage: 40, description: 'Initial Release' },
                          { year: 'Year 2', percentage: 35, description: 'Growth Phase' },
                          { year: 'Year 3', percentage: 25, description: 'Final Unlock' }
                        ].map((item, index) => (
                          <div key={item.year} className="text-center">
                            <div className="relative h-32 flex flex-col justify-end">
                              <div 
                                className="bg-gradient-to-b from-blue-500 to-blue-300 rounded-t-lg mx-auto transition-all duration-500"
                                style={{ 
                                  height: `${(item.percentage / 40) * 100}px`,
                                  width: '60%'
                                }}
                              ></div>
                              <div className="absolute inset-0 flex items-end justify-center pb-2">
                                <span className="text-white font-bold text-sm">{item.percentage}%</span>
                              </div>
                            </div>
                            <span className="text-sm font-medium">{item.year}</span>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Three-year staggered release schedule ensures long-term value alignment and prevents market dumping
                      </p>
                    </div>
                  </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Projections */}
            <TabsContent value="projections" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>5-Year Growth Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tokenProjections.map((projection, index) => (
                        <div key={projection.year} className="grid grid-cols-5 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="text-center">
                            <div className="font-bold">{projection.year}</div>
                            <div className="text-xs text-muted-foreground">Year</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-blue-600">{projection.users.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Users</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-600">${projection.tokenValue}</div>
                            <div className="text-xs text-muted-foreground">Token Value</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-purple-600">${(projection.marketCap / 1000000).toFixed(1)}M</div>
                            <div className="text-xs text-muted-foreground">Market Cap</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-amber-600">{projection.phase}</div>
                            <div className="text-xs text-muted-foreground">Phase</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Visual Growth Chart */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <h4 className="font-semibold mb-4 text-center">5-Year Growth Trajectory</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {tokenProjections.map((projection, index) => (
                          <div key={projection.year} className="text-center">
                            <div className="relative h-32 flex flex-col justify-end">
                              <div 
                                className="bg-gradient-to-b from-blue-500 to-purple-500 rounded-t-lg mx-auto transition-all duration-500"
                                style={{ 
                                  height: `${Math.max(20, (projection.marketCap / 120000000) * 100)}px`,
                                  width: '60%'
                                }}
                              ></div>
                              <div className="text-xs font-bold mt-1">${(projection.marketCap / 1000000).toFixed(0)}M</div>
                              <div className="text-xs text-muted-foreground">{projection.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pre-Seed Fund Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fundingAllocation.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.category}</span>
                            <span className="font-bold">${item.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-muted-foreground">{item.percentage}% of total funding</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Expected ROI Timeline</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-bold text-lg">6 months</div>
                          <div className="text-sm">MVP Launch</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">12 months</div>
                          <div className="text-sm">Token Generation</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">24 months</div>
                          <div className="text-sm">Market Expansion</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Projections & Business Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-600">Platform Fees</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Year 1:</span>
                          <span className="font-mono">$25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Year 3:</span>
                          <span className="font-mono">$375,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Year 5:</span>
                          <span className="font-mono">$2,500,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-600">Subscription Revenue</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Enterprise Clients:</span>
                          <span className="font-mono">$500/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Government Contracts:</span>
                          <span className="font-mono">$5,000/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium Analytics:</span>
                          <span className="font-mono">$100/month</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-purple-600">Token Appreciation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Initial Investment:</span>
                          <span className="font-mono">$0.10/token</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3-Year Target:</span>
                          <span className="font-mono">$0.50/token</span>
                        </div>
                        <div className="flex justify-between">
                          <span>5-Year Target:</span>
                          <span className="font-mono">$1.20/token</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investment Terms */}
            <TabsContent value="investment" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Handshake className="h-5 w-5 text-blue-500" />
                      Investment Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Dual-Token Investment Structure</h4>
                        <div className="space-y-3 text-sm">
                          <div className="border-b pb-2">
                            <h5 className="font-semibold">SHELTR (Growth Token)</h5>
                            <div className="flex justify-between">
                              <span>Pre-Seed Price:</span>
                              <span className="font-mono font-bold">$0.05/token</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Public Launch Price:</span>
                              <span className="font-mono">$0.10/token</span>
                            </div>
                            <div className="flex justify-between">
                              <span>5-Year Target:</span>
                              <span className="font-mono text-green-600">$1.20/token</span>
                            </div>
                          </div>
                          <div className="border-b pb-2">
                            <h5 className="font-semibold">SHELTR-S (Stable Token)</h5>
                            <div className="flex justify-between">
                              <span>Always Pegged:</span>
                              <span className="font-mono">$1.00 USD</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Participant Welcome:</span>
                              <span className="font-mono">100 tokens/signup</span>
                            </div>
                            <div className="flex justify-between">
                              <span>USDC Backing:</span>
                              <span className="font-mono text-green-600">100%</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <span>Minimum Investment:</span>
                              <span className="font-mono">$5,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Maximum Investment:</span>
                              <span className="font-mono">$37,500</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Pre-Seed:</span>
                              <span className="font-mono font-bold">$150,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ROI Potential:</span>
                              <span className="font-mono text-green-600 font-bold">30x (5 years)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">Investor Benefits</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 50% discount to public token price</li>
                        <li>• Early access to platform features</li>
                        <li>• Governance voting rights</li>
                        <li>• Priority customer support</li>
                        <li>• Quarterly investor updates</li>
                        <li>• Optional advisory board participation</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">Vesting Schedule</h4>
                      <div className="space-y-1 text-sm">
                        <div>• 25% released at Token Generation Event (TGE)</div>
                        <div>• 75% vested over 12 months</div>
                        <div>• Monthly linear release</div>
                        <div>• No cliff period for pre-seed investors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Legal & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Regulatory Compliance</h4>
                        <ul className="text-sm space-y-1">
                          <li>• SEC utility token classification</li>
                          <li>• CFTC compliance for derivatives</li>
                          <li>• International securities law review</li>
                          <li>• Privacy regulations (GDPR, CCPA)</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Investor Protections</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Accredited investor verification</li>
                          <li>• Multi-signature treasury management</li>
                          <li>• Third-party audit of smart contracts</li>
                          <li>• Insurance coverage for platform funds</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Documentation Required</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Accredited investor certification</li>
                          <li>• KYC/AML verification</li>
                          <li>• Investment agreement execution</li>
                          <li>• Risk acknowledgment forms</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps for Interested Investors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-xl">1</span>
                      </div>
                      <h4 className="font-semibold">Initial Contact</h4>
                      <p className="text-sm text-muted-foreground">
                        Schedule a confidential call to discuss your investment interests and answer questions.
                      </p>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Call
                      </Button>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-xl">2</span>
                      </div>
                      <h4 className="font-semibold">Due Diligence</h4>
                      <p className="text-sm text-muted-foreground">
                        Access detailed technical documentation, financial models, and legal frameworks.
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Data Room
                      </Button>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-xl">3</span>
                      </div>
                      <h4 className="font-semibold">Investment Execution</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete KYC verification and execute investment agreements with legal review.
                      </p>
                      <Button variant="outline" size="sm">
                        <Handshake className="h-4 w-4 mr-2" />
                        Invest Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Investment Deck Slideshow */}
      <InvestmentDeckSlideshow isOpen={deckOpen} onClose={() => setDeckOpen(false)} />

      {/* Plan B - Alternative Funding Strategy */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
                Alternative Investment Strategy
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Plan B: Traditional Conservative Funding
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                For investors who prefer traditional equity structures over token-based offerings, 
                we&apos;ve developed a comprehensive alternative funding strategy that addresses regulatory 
                concerns while maintaining our growth potential through strategic partnerships.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Regulatory Compliance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Traditional equity structure eliminates SEC token classification risks and regulatory uncertainty.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-green-200 dark:border-green-800">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Handshake className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Strategic Partnerships</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Leverage established payment sector relationships for revenue-sharing and growth acceleration.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Proven Growth Model</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Traditional funding rounds with clear milestones: $150K → $500K → $2M over 18 months.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-blue-300 dark:border-blue-700 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Why Conservative Investors Choose Plan B
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>No Cryptocurrency Exposure:</strong> Pure equity investment without token volatility
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Institutional Grade:</strong> Delaware C-Corp structure with standard investor protections
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Payment Sector Expertise:</strong> Strategic CFO with 20+ years industry experience
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Clear Exit Strategy:</strong> Traditional acquisition or IPO pathways
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Proven Revenue Model:</strong> SaaS subscriptions + transaction processing fees
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Municipal Contracts:</strong> Government partnerships provide stable recurring revenue
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => window.open('/executive-access', '_blank')}
              >
                <FileText className="mr-2 h-5 w-5" />
                Access Plan B: Traditional Funding Strategy
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Confidential executive summary and partnership framework • Investment-grade documentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ThemeLogo />
            <Badge variant="secondary">INVESTOR RELATIONS</Badge>
          </div>
          <p className="text-slate-400 mb-4">
            This document contains confidential and proprietary information. Distribution is restricted to qualified investors only.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-400">
            <span>© 2025 SHELTR-AI Technologies Inc.</span>
            <span>•</span>
            <span>Private & Confidential</span>
            <span>•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
} 