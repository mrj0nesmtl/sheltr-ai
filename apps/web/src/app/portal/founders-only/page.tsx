'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  TrendingUp,
  FileText,
  CreditCard,
  AlertTriangle,
  BookOpen,
  Users,
  Rocket,
  BarChart3,
  FileCode,
  Palette,
  Github,
  Database,
  Lock,
  ExternalLink,
  GripVertical,
  Star,
  RotateCcw,
  Shield,
  Play,
  CheckCircle,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Home,
  ChevronRight,
  X,
  ChevronLeft,
  Info,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { BudgetCard } from '@/components/dashboard/BudgetCard';
import { RevenueCard } from '@/components/dashboard/RevenueCard';
import { toast } from 'sonner';

// Quick Access Card Type
interface QuickAccessCard {
  id: string;
  icon: React.ReactNode;
  badgeText: string;
  badgeClass: string;
  title: string;
  titleColor: string;
  description: string;
  buttonText: string;
  buttonClass: string;
  href: string;
  borderClass: string;
  category: 'public' | 'secure' | 'platform';
  isInvestorDataRoom?: boolean; // New field for investor data room sharing
}

// Gallery Item Type
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'image';
  thumbnail: string;
  url?: string;
  tags: string[];
  date: string;
  duration?: string;
}

// Hero Image Type
interface HeroImage {
  url: string;
  alt: string;
  mediaType: 'image' | 'video';
}

// Sortable Card Component
function SortableCard({ 
  card, 
  onToggleInvestorDataRoom 
}: { 
  card: QuickAccessCard;
  onToggleInvestorDataRoom: (cardId: string, value: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`relative group hover:shadow-lg transition-all ${card.borderClass}`}>
        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute top-2 right-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {card.icon}
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={card.badgeClass}>{card.badgeText}</Badge>
                {/* IR Sharing Status Indicator */}
                {card.isInvestorDataRoom && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Shared to IR
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <CardTitle className={`text-lg ${card.titleColor}`}>
            {card.title}
          </CardTitle>
          <CardDescription className="text-sm">
            {card.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Investor Data Room Toggle - Show for ALL cards */}
          <div className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
            card.isInvestorDataRoom 
              ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700' 
              : 'bg-muted/50 border-border/40'
          }`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${card.isInvestorDataRoom ? 'text-blue-600' : 'text-red-600'}`} />
                <Label htmlFor={`investor-toggle-${card.id}`} className="text-sm font-medium cursor-pointer">
                  {card.isInvestorDataRoom ? 'Shared with Investors' : 'Share to Investor Data Room'}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                {card.isInvestorDataRoom 
                  ? 'Toggle OFF to remove from Data Room' 
                  : 'Toggle ON to make visible to investors'}
              </p>
            </div>
            <Switch
              id={`investor-toggle-${card.id}`}
              checked={card.isInvestorDataRoom || false}
              onCheckedChange={(checked) => onToggleInvestorDataRoom(card.id, checked)}
            />
          </div>
          
          {card.href.startsWith('http') ? (
            <a href={card.href} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className={`w-full ${card.buttonClass}`}>
                {card.buttonText}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          ) : (
            <Link href={card.href}>
              <Button variant="outline" className={`w-full ${card.buttonClass}`}>
                {card.buttonText}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FoundersOnlyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cards, setCards] = useState<QuickAccessCard[]>([]);
  const [defaultCardOrder, setDefaultCardOrder] = useState<string[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showFinancialInIR, setShowFinancialInIR] = useState(false);
  const [showQATestingInIR, setShowQATestingInIR] = useState(false);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showManagementPanel, setShowManagementPanel] = useState(false);
  const [actualIRCount, setActualIRCount] = useState<number>(0); // Actual count from knowledge_documents
  
  // Gallery Lightbox State
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);
  const [showImageInfo, setShowImageInfo] = useState(false);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initial Quick Access Cards
  const initialCards: QuickAccessCard[] = [
    {
      id: 'investor-relations',
      icon: (
        <div className="relative">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <Lock className="h-3 w-3 text-blue-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Pre-Seed',
      badgeClass: 'bg-blue-600 text-white',
      title: 'Investor Relations',
      titleColor: 'text-blue-600',
      description: 'Pre-seed funding information, financial projections, and investment terms',
      buttonText: 'View Details',
      buttonClass: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      href: '/portal/founders-only/investor-relations',
      borderClass: 'border-blue-200',
      category: 'secure',
    },
    {
      id: 'pitch-deck',
      icon: (
        <div className="relative">
          <FileText className="h-6 w-6 text-purple-600" />
          <Lock className="h-3 w-3 text-purple-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Live Document',
      badgeClass: 'bg-purple-600 text-white',
      title: 'Pitch Deck',
      titleColor: 'text-purple-600',
      description: '2026 business plan and investor presentation hosted on Gamma',
      buttonText: 'Open Pitch Deck',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
      href: 'https://2026-business-plan-ogqhgdb.gamma.site/',
      borderClass: 'border-purple-200',
      category: 'secure',
    },
    {
      id: 'business-plan',
      icon: (
        <div className="relative">
          <FileText className="h-6 w-6 text-red-600" />
          <Lock className="h-3 w-3 text-red-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Secure',
      badgeClass: 'bg-red-600 text-white',
      title: 'Business Plan',
      titleColor: 'text-red-600',
      description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
      buttonText: 'View Business Plan',
      buttonClass: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
      href: '/portal/founders-only/business-plan',
      borderClass: 'border-red-200',
      category: 'secure',
    },
    {
      id: 'covenant-house-outreach',
      icon: (
        <div className="relative">
          <Rocket className="h-6 w-6 text-pink-600" />
          <Lock className="h-3 w-3 text-pink-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Partnership',
      badgeClass: 'bg-pink-600 text-white',
      title: 'Covenant House Proposal',
      titleColor: 'text-pink-600',
      description: 'Executive partnership proposal for Covenant House Canada 2026-2027 youth homelessness innovation pilot',
      buttonText: 'View Proposal',
      buttonClass: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50',
      href: '/portal/founders-only/covenant-house-outreach',
      borderClass: 'border-pink-200',
      category: 'secure',
    },
    {
      id: 'adyen-integration',
      icon: (
        <div className="relative">
          <CreditCard className="h-6 w-6 text-blue-500" />
          <Lock className="h-3 w-3 text-blue-500 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Strategic',
      badgeClass: 'bg-blue-500 text-white',
      title: 'Adyen Integration Strategy',
      titleColor: 'text-blue-500',
      description: 'Comprehensive analysis of Adyen for Platforms (Balanced Model) with 16-week implementation roadmap for SmartFund™ 80-15-5 distribution',
      buttonText: 'View Strategy',
      buttonClass: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
      href: '/portal/founders-only/adyen-integration',
      borderClass: 'border-blue-200',
      category: 'secure',
    },
    {
      id: 'implementation-readiness',
      icon: (
        <div className="relative">
          <Rocket className="h-6 w-6 text-green-500" />
          <Lock className="h-3 w-3 text-green-500 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Ready',
      badgeClass: 'bg-green-500 text-white',
      title: 'Implementation Readiness',
      titleColor: 'text-green-500',
      description: 'Executive summary of payment architecture readiness with complete flow, financial model, timeline, and next steps for Adyen partnership',
      buttonText: 'View Summary',
      buttonClass: 'border-2 border-green-500 text-green-500 hover:bg-green-50',
      href: '/portal/founders-only/implementation-readiness',
      borderClass: 'border-green-200',
      category: 'secure',
    },
    {
      id: 'payment-rails',
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      badgeText: 'Enterprise',
      badgeClass: 'bg-green-600 text-white',
      title: 'Proposed Payment Rails',
      titleColor: 'text-green-600',
      description: 'Adyen + Coinbase integration architecture with single-token stable fund model',
      buttonText: 'View Architecture',
      buttonClass: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
      href: '/docs/payment-rails',
      borderClass: 'border-green-200',
      category: 'public',
    },
    {
      id: 'msb-registration',
      icon: (
        <div className="relative">
          <Shield className="h-6 w-6 text-red-600" />
          <Lock className="h-3 w-3 text-red-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Legal',
      badgeClass: 'bg-red-600 text-white',
      title: 'MSB Registration Guide',
      titleColor: 'text-red-600',
      description: 'Canadian regulatory compliance guide for crypto-enabled donation platforms - FINTRAC MSB requirements and incorporation',
      buttonText: 'View Legal Guide',
      buttonClass: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
      href: '/portal/founders-only/msb-registration',
      borderClass: 'border-red-200',
      category: 'secure',
    },
    {
      id: 'platform-admin-guide',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      badgeText: 'Essential',
      badgeClass: 'bg-purple-600 text-white',
      title: 'Platform Administrator Guide',
      titleColor: 'text-purple-600',
      description: 'Complete operational guide for Platform Administrators - user management, security monitoring, and strategic oversight',
      buttonText: 'View Admin Guide',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
      href: '/dashboard/platform-guide',
      borderClass: 'border-purple-200',
      category: 'public',
    },
    {
      id: 'documentation-hub',
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      badgeText: 'Complete',
      badgeClass: 'bg-purple-600 text-white',
      title: 'Documentation Hub',
      titleColor: 'text-purple-600',
      description: 'Comprehensive technical documentation, whitepapers, and system architecture',
      buttonText: 'Browse Docs',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
      href: '/docs',
      borderClass: 'border-purple-200',
      category: 'public',
    },
    {
      id: 'system-design',
      icon: <Database className="h-6 w-6 text-cyan-600" />,
      badgeText: 'Architecture',
      badgeClass: 'bg-cyan-600 text-white',
      title: 'System Design Architecture',
      titleColor: 'text-cyan-600',
      description: 'Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration blueprints',
      buttonText: 'View Architecture',
      buttonClass: 'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50',
      href: '/docs/system-design',
      borderClass: 'border-cyan-200',
      category: 'public',
    },
    {
      id: 'development-roadmap',
      icon: <Rocket className="h-6 w-6 text-orange-600" />,
      badgeText: 'Launch Plan',
      badgeClass: 'bg-orange-600 text-white',
      title: 'Development Roadmap',
      titleColor: 'text-orange-600',
      description: '60-day public launch timeline with client onboarding strategy and AI achievements',
      buttonText: 'View Roadmap',
      buttonClass: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
      href: '/docs/roadmap',
      borderClass: 'border-orange-200',
      category: 'public',
    },
    {
      id: 'leadership-team',
      icon: <Users className="h-6 w-6 text-teal-600" />,
      badgeText: 'Team',
      badgeClass: 'bg-teal-600 text-white',
      title: 'Leadership Team',
      titleColor: 'text-teal-600',
      description: 'Meet the SHELTR leadership team, founders, and key contributors driving our mission',
      buttonText: 'View Team',
      buttonClass: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50',
      href: '/team',
      borderClass: 'border-teal-200',
      category: 'public',
    },
    {
      id: 'shelter-research',
      icon: (
        <div className="relative">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <Lock className="h-3 w-3 text-blue-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Research',
      badgeClass: 'bg-blue-600 text-white',
      title: 'Shelter Research Hub',
      titleColor: 'text-blue-600',
      description: 'Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, and innovative programs across North America',
      buttonText: 'Browse Research',
      buttonClass: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      href: '/portal/founders-only/shelter-research',
      borderClass: 'border-blue-200',
      category: 'secure',
    },
    {
      id: 'technical-whitepaper',
      icon: <FileCode className="h-6 w-6 text-green-600" />,
      badgeText: 'v2.0',
      badgeClass: 'bg-green-600 text-white',
      title: 'Technical White Paper',
      titleColor: 'text-green-600',
      description: 'Revolutionary enterprise-grade platform with single-token architecture and blockchain transparency',
      buttonText: 'Read Whitepaper',
      buttonClass: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
      href: '/docs/whitepaper',
      borderClass: 'border-green-200',
      category: 'public',
    },
    {
      id: 'blockchain-architecture',
      icon: <Lock className="h-6 w-6 text-orange-600" />,
      badgeText: 'SmartFund™',
      badgeClass: 'bg-orange-600 text-white',
      title: 'Blockchain Architecture',
      titleColor: 'text-orange-600',
      description: 'Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed returns',
      buttonText: 'View Blockchain',
      buttonClass: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
      href: '/docs/blockchain',
      borderClass: 'border-orange-200',
      category: 'public',
    },
    {
      id: 'brand-design-guide',
      icon: (
        <div className="relative">
          <Palette className="h-6 w-6 text-red-600" />
          <Lock className="h-3 w-3 text-red-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
        </div>
      ),
      badgeText: 'Secure',
      badgeClass: 'bg-red-600 text-white',
      title: 'Brand & Design Guide',
      titleColor: 'text-red-600',
      description: 'Comprehensive brand system overview for Royaltri design team - components, colors, navigation, and UX flows',
      buttonText: 'View Design Guide',
      buttonClass: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
      href: '/portal/founders-only/design-guide',
      borderClass: 'border-red-200',
      category: 'secure',
    },
    {
      id: 'sheltr-platform',
      icon: <Database className="h-6 w-6 text-purple-600" />,
      badgeText: 'Live Platform',
      badgeClass: 'bg-purple-600 text-white',
      title: 'SHELTR Platform',
      titleColor: 'text-purple-600',
      description: 'Access the live SHELTR platform with full administrative privileges',
      buttonText: 'Access Platform',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
      href: '/dashboard',
      borderClass: 'border-purple-200',
      category: 'platform',
    },
    {
      id: 'gallery-management',
      icon: <ImageIcon className="h-6 w-6 text-pink-600" />,
      badgeText: 'Media Hub',
      badgeClass: 'bg-pink-600 text-white',
      title: 'Gallery Management',
      titleColor: 'text-pink-600',
      description: 'Upload and manage media content, videos, and images for platform and founders portal sharing',
      buttonText: 'Manage Gallery',
      buttonClass: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50',
      href: '/dashboard/gallery',
      borderClass: 'border-pink-200',
      category: 'platform',
    },
    {
      id: 'github-repository',
      icon: <Github className="h-6 w-6 text-gray-600" />,
      badgeText: 'Source Code',
      badgeClass: 'bg-gray-600 text-white',
      title: 'GitHub Repository',
      titleColor: 'text-gray-600',
      description: 'Complete source code, smart contracts, and development history',
      buttonText: 'View Repository',
      buttonClass: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50',
      href: 'https://github.com/mrj0nesmtl/sheltr-ai',
      borderClass: 'border-gray-200',
      category: 'public',
    },
    {
      id: 'openai-mcp-demo',
      icon: <Play className="h-6 w-6 text-purple-600" />,
      badgeText: 'Live Demo',
      badgeClass: 'bg-purple-600 text-white',
      title: 'OpenAI MCP Demo',
      titleColor: 'text-purple-600',
              description: 'Interactive demonstration of SHELTR&apos;s enhanced chatbot powered by OpenAI Agents SDK and specialized MCP agents',
      buttonText: 'Try Demo',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
      href: '/dashboard/chatbots',
      borderClass: 'border-purple-200',
      category: 'platform',
    },
  ];

  // Check authorization
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('🔄 Founders Portal: Waiting for auth to load...');
        return;
      }

      // If auth is loaded and no user, redirect to login
      if (!user) {
        console.log('❌ Founders Portal: No user found, redirecting to /portal');
        router.push('/portal');
        return;
      }

      console.log('✅ Founders Portal: User authenticated:', user.email);

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          
          console.log('👤 Founders Portal: User role:', role);
          
          if (role === 'super_admin' || role === 'platform_admin') {
            console.log('✅ Founders Portal: User authorized!');
            setIsAuthorized(true);
            await loadCardOrder();
            await loadHeroImage();
            await loadGalleryItems();
          } else {
            console.log('⚠️  Founders Portal: User not authorized, redirecting to /dashboard');
            router.push('/dashboard');
          }
        } else {
          console.log('❌ Founders Portal: User document not found, redirecting to /portal');
          router.push('/portal');
        }
      } catch (error) {
        console.error('❌ Founders Portal: Authorization error:', error);
        router.push('/portal');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  // Load actual IR count from ALL knowledge_documents (not just those visible in Founders Portal)
  useEffect(() => {
    if (!isAuthorized) return;

    const loadActualIRCount = async () => {
      try {
        const irQuery = query(
          collection(db, 'knowledge_documents'),
          where('published_to_ir', '==', true),
          where('status', '==', 'active')
        );
        
        const snapshot = await getDocs(irQuery);
        const count = snapshot.size;
        
        console.log(`📊 Actual IR Data Room count: ${count} documents`);
        setActualIRCount(count);
      } catch (error) {
        console.error('Error loading actual IR count:', error);
      }
    };

    loadActualIRCount();
  }, [isAuthorized]);

  // Helper function to reload IR count (used after toggle/clear operations)
  const reloadActualIRCount = async () => {
    try {
      const irQuery = query(
        collection(db, 'knowledge_documents'),
        where('published_to_ir', '==', true),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(irQuery);
      const count = snapshot.size;
      
      console.log(`📊 Reloaded IR Data Room count: ${count} documents`);
      setActualIRCount(count);
    } catch (error) {
      console.error('Error reloading actual IR count:', error);
    }
  };

  // Protected cards that should NEVER be replaced by dynamic documents
  const PROTECTED_CARDS = new Set([
    'investor-relations',      // Custom IR page
    'pitch-deck',              // External Gamma presentation
    'shelter-research',        // Hub for 4 secure docs
    'leadership-team',         // Team page
    'gallery-management',      // Dashboard link
    // Public docs with custom beautiful pages
    'documentation-hub',
    'system-design',
    'development-roadmap',
    'technical-whitepaper',
    'blockchain-architecture',
    'platform-admin-guide',
    'payment-rails',
    'sheltr-platform',
    'github-repository',
    'openai-mcp-demo',
    'brand-design-guide',
  ]);

  // Load dynamic documents from Knowledge Base (published_to_founders)
  const loadDynamicDocuments = async (): Promise<QuickAccessCard[]> => {
    try {
      console.log('🔥 Loading dynamic documents from Firestore...');
      
      const docsQuery = query(
        collection(db, 'knowledge_documents'),
        where('published_to_founders', '==', true)
      );
      
      const snapshot = await getDocs(docsQuery);
      console.log(`📚 Found ${snapshot.size} published documents`);
      
      const dynamicCards: QuickAccessCard[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const isPublic = data.permission_level === 'public';
        const slug = isPublic ? (data.hub_slug || data.secure_slug || doc.id) : (data.secure_slug || doc.id);
        
        // For public documents, link to public Docs Hub URL
        // For secure documents, link to secure Founders Portal URL
        const href = isPublic ? `/docs/${slug}` : `/portal/founders-only/${slug}`;
        
        console.log(`📄 Dynamic doc: ${data.title} (${slug}) | Public: ${isPublic} | URL: ${href}`);
        
        return {
          id: slug,
          icon: (
            <div className="relative">
              <FileText className="h-6 w-6 text-red-600" />
              {!isPublic && (
                <Lock className="h-3 w-3 text-red-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
              )}
            </div>
          ),
          badgeText: data.secure_badge || (isPublic ? 'Public' : 'Secure'),
          badgeClass: `bg-${data.secure_badge_color || 'red'}-600 text-white`,
          title: data.title || 'Untitled',
          titleColor: `text-${data.secure_badge_color || 'red'}-600`,
          description: data.founders_description || data.description || '',
          buttonText: 'View Document',
          buttonClass: `border-2 border-${data.secure_badge_color || 'red'}-600 text-${data.secure_badge_color || 'red'}-600 hover:bg-${data.secure_badge_color || 'red'}-50`,
          href: href,
          borderClass: `border-${data.secure_badge_color || 'red'}-200`,
          category: isPublic ? 'public' : 'secure',
          isInvestorDataRoom: data.published_to_ir || false,
        };
      });
      
      return dynamicCards;
    } catch (error) {
      console.error('❌ Error loading dynamic documents:', error);
      return [];
    }
  };

  // Load saved card order and toggle states
  const loadCardOrder = async () => {
    try {
      // Step 1: Load dynamic documents from Knowledge Base
      const dynamicCards = await loadDynamicDocuments();
      
      // Step 2: Merge with hardcoded cards (dynamic overrides non-protected)
      const mergedCards = [...initialCards];
      
      dynamicCards.forEach(dynamicCard => {
        // Check if this card is protected by ID
        if (PROTECTED_CARDS.has(dynamicCard.id)) {
          console.log(`🛡️  Protected card by ID, keeping hardcoded: ${dynamicCard.id}`);
          return; // Skip, keep hardcoded version
        }
        
        // Check if a protected card with the same title already exists (prevents duplicates)
        const protectedTitles = ['Investor Relations', 'Pitch Deck', 'Development Roadmap'];
        const hasDuplicateTitle = mergedCards.some(existingCard => 
          protectedTitles.includes(existingCard.title) && 
          existingCard.title === dynamicCard.title
        );
        
        if (hasDuplicateTitle) {
          console.log(`🛡️  Protected card by title, skipping duplicate: "${dynamicCard.title}"`);
          return; // Skip duplicate with protected title
        }
        
        // Find if a hardcoded card exists with this ID
        const existingIndex = mergedCards.findIndex(c => c.id === dynamicCard.id);
        
        if (existingIndex >= 0) {
          // Replace hardcoded card with dynamic version
          console.log(`🔄 Replacing hardcoded card: ${dynamicCard.id}`);
          mergedCards[existingIndex] = dynamicCard;
        } else {
          // Add new dynamic card
          console.log(`✨ Adding new dynamic card: ${dynamicCard.id}`);
          mergedCards.push(dynamicCard);
        }
      });
      
      console.log(`📊 Final card count: ${mergedCards.length} (${dynamicCards.length} dynamic, ${initialCards.length} hardcoded)`);
      
      // Step 2.5: Filter cards based on published_to_founders toggle
      // EXCEPTION: Always show "investor-relations" card (custom portal page)
      console.log(`📋 Starting card filtering with ${mergedCards.length} merged cards...`);
      
      const filteredCards = mergedCards.filter((card) => {
        // ALWAYS SHOW: Investor Relations card (custom portal page, not KB-backed)
        if (card.id === 'investor-relations') {
          console.log(`✅ KEEPING: investor-relations card (protected portal page)`);
          return true;
        }
        
        // ALWAYS SHOW: Pitch Deck card (external link, not KB-backed)
        if (card.id === 'pitch-deck') {
          console.log(`✅ KEEPING: pitch-deck card (external Gamma link)`);
          return true;
        }
        
        // For all other cards, check if they have a KB document with published_to_founders: true
        try {
          // Query knowledge_documents for this card
          const q = query(
            collection(db, 'knowledge_documents'),
            where('published_to_founders', '==', true),
            where('status', '==', 'active')
          );
          
          // We'll check if any document matches this card by ID, title, or slug
          // This is done synchronously in the filter, but ideally should be pre-loaded
          // For now, we'll use a simpler approach: only show dynamic cards from loadDynamicDocuments
          
          // If the card was added by loadDynamicDocuments, it already has published_to_founders: true
          // If it's a hardcoded card from initialCards that wasn't replaced, we need to check
          const isDynamicCard = dynamicCards.some(dc => dc.id === card.id);
          
          if (isDynamicCard) {
            console.log(`✅ KEEPING: ${card.title} (dynamic from KB with published_to_founders: true)`);
            return true;
          } else {
            console.log(`🚫 FILTERING OUT: ${card.title} (hardcoded, no KB entry with published_to_founders: true)`);
            return false;
          }
        } catch (error) {
          console.warn(`⚠️  Error checking ${card.title}:`, error);
          return false; // On error, hide the card
        }
      });
      
      const visibleCards = filteredCards;
      console.log(`👁️  Visible cards after filtering: ${visibleCards.length}/${mergedCards.length}`);
      
      // Step 3: Load card order (with error handling for permission issues)
      let orderedCards = visibleCards;
      
      try {
        const orderDoc = await getDoc(doc(db, 'portal_settings', 'founders_card_order'));
        
        if (orderDoc.exists()) {
          const savedOrder = orderDoc.data().order as string[];
          setDefaultCardOrder(savedOrder);
          
          // Reorder cards based on saved order
          orderedCards = savedOrder
            .map(id => visibleCards.find(card => card.id === id))
            .filter(Boolean) as QuickAccessCard[];
          
          // Add any new cards that weren't in the saved order
          const newCards = visibleCards.filter(
            card => !savedOrder.includes(card.id)
          );
          
          orderedCards = [...orderedCards, ...newCards];
          console.log('✅ Applied saved card order');
        } else {
          console.log('ℹ️  No saved card order, using default order');
        }
      } catch (orderError) {
        console.warn('⚠️  Could not load saved card order (using default order):', orderError);
        // Continue with mergedCards as orderedCards (already set above)
      }

      // Load toggle states - Check BOTH knowledge_documents AND secure_documents
      // Priority: knowledge_documents.published_to_ir > secure_documents.isInvestorDataRoom
      const toggleStates = await Promise.all(
        orderedCards.map(async (card) => {
          try {
            // First, check knowledge_documents (for dynamic documents)
            const kbDocRef = doc(db, 'knowledge_documents', card.id);
            const kbDocSnap = await getDoc(kbDocRef);
            
            if (kbDocSnap.exists()) {
              const kbData = kbDocSnap.data();
              const isShared = kbData.published_to_ir || false;
              console.log(`✅ KB Doc ${card.id}: published_to_ir = ${isShared}`);
              return {
                ...card,
                isInvestorDataRoom: isShared
              };
            }
            
            // Fallback: check secure_documents (for hardcoded cards)
            const secureDocRef = doc(db, 'secure_documents', card.id);
            const secureDocSnap = await getDoc(secureDocRef);
            
            if (secureDocSnap.exists()) {
              const secureData = secureDocSnap.data();
              const isShared = secureData.isInvestorDataRoom || false;
              console.log(`📁 Secure Doc ${card.id}: isInvestorDataRoom = ${isShared}`);
              return {
                ...card,
                isInvestorDataRoom: isShared
              };
            }
            
            // No data found, default to false
            console.log(`ℹ️  Card ${card.id}: No sharing data found, defaulting to OFF`);
            return card;
          } catch (error) {
            console.error(`❌ Error loading toggle state for ${card.id}:`, error);
            return card;
          }
        })
      );

      setCards(toggleStates);
      
      // Load Financial Overview toggle state
      try {
        const financialDoc = await getDoc(doc(db, 'secure_documents', 'financial-overview'));
        if (financialDoc.exists()) {
          setShowFinancialInIR(financialDoc.data().isInvestorDataRoom || false);
        }
      } catch (error) {
        console.error('Error loading financial overview toggle:', error);
      }

      // Load QA Testing toggle state
      try {
        const qaTestingDoc = await getDoc(doc(db, 'secure_documents', 'qa-testing-accounts'));
        if (qaTestingDoc.exists()) {
          setShowQATestingInIR(qaTestingDoc.data().isInvestorDataRoom || false);
        }
      } catch (error) {
        console.error('Error loading QA testing toggle:', error);
      }
    } catch (error) {
      console.error('Error loading card order:', error);
      setCards(initialCards);
    }
  };

  // Load gallery items
  // Load hero image for this page
  const loadHeroImage = async () => {
    try {
      const galleryRef = collection(db, 'gallery_images');
      const heroQuery = query(
        galleryRef,
        where('heroPages', 'array-contains', '/portal/founders-only')
      );

      const snapshot = await getDocs(heroQuery);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        const mediaType = data.mediaType || (data.type?.startsWith('video') ? 'video' : 'image');

        setHeroImage({
          url: data.src || data.url || '',
          alt: data.title || 'SHELTR Founders Portal',
          mediaType: mediaType,
        });
        console.log(`✅ Loaded hero image for Founders Portal: ${data.title}`);
      } else {
        console.log('ℹ️  No hero image found for Founders Portal');
      }
    } catch (error) {
      console.error('Error loading hero image:', error);
    }
  };

  const loadGalleryItems = async () => {
    try {
      const galleryQuery = query(
        collection(db, 'gallery_images'),
        where('isFoundersGallery', '==', true)
      );
      const snapshot = await getDocs(galleryQuery);
      
      const items: GalleryItem[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          description: data.description || '',
          type: data.mediaType || 'video',
          thumbnail: data.thumbnailUrl || data.src || '',
          url: data.src,
          tags: data.tags || [],
          date: data.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString(),
          duration: data.duration,
        };
      });
      
      setGalleryItems(items);
      console.log(`✅ Loaded ${items.length} gallery items for Founders Portal`);
    } catch (error) {
      console.error('Error loading gallery items:', error);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasUnsavedChanges(true);
        return newOrder;
      });
    }
  };

  // Toggle Financial Overview in Investor Data Room
  const handleToggleFinancialOverview = async (value: boolean) => {
    try {
      // Update local state immediately
      setShowFinancialInIR(value);

      // Store in Firestore
      const docRef = doc(db, 'secure_documents', 'financial-overview');
      await setDoc(docRef, {
        id: 'financial-overview',
        title: 'Seed Budget 2025-26',
        description: 'Projected financial planning & runway analysis',
        category: 'Financial',
        isInvestorDataRoom: value,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast.success(value 
        ? 'Financial Overview enabled in Investor Data Room' 
        : 'Financial Overview disabled in Investor Data Room'
      );
    } catch (error) {
      console.error('Error toggling financial overview:', error);
      toast.error('Failed to update Investor Data Room settings');
      // Revert on error
      setShowFinancialInIR(!value);
    }
  };

  // Toggle QA Testing Accounts in Investor Data Room
  const handleToggleQATestingAccounts = async (value: boolean) => {
    try {
      // Update local state immediately
      setShowQATestingInIR(value);

      // Store in Firestore
      const docRef = doc(db, 'secure_documents', 'qa-testing-accounts');
      await setDoc(docRef, {
        id: 'qa-testing-accounts',
        title: 'QA Testing Demo Accounts',
        description: 'Connected test accounts for comprehensive system validation',
        category: 'Testing',
        isInvestorDataRoom: value,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast.success(value 
        ? 'QA Testing Accounts enabled in Investor Data Room' 
        : 'QA Testing Accounts disabled in Investor Data Room'
      );
    } catch (error) {
      console.error('Error toggling QA testing accounts:', error);
      toast.error('Failed to update Investor Data Room settings');
      // Revert on error
      setShowQATestingInIR(!value);
    }
  };

  // Gallery Lightbox Functions
  const openGalleryLightbox = (index: number) => {
    setSelectedGalleryImage(index);
  };

  const closeGalleryLightbox = useCallback(() => {
    setSelectedGalleryImage(null);
    setShowImageInfo(false);
  }, []);

  const nextGalleryImage = useCallback(() => {
    setSelectedGalleryImage(prev => (prev === null ? 0 : prev + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const prevGalleryImage = useCallback(() => {
    setSelectedGalleryImage(prev => prev === 0 ? galleryItems.length - 1 : (prev || 1) - 1);
  }, [galleryItems.length]);

  // Gallery Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedGalleryImage !== null) {
        if (e.key === 'Escape') {
          closeGalleryLightbox();
        } else if (e.key === 'ArrowLeft') {
          prevGalleryImage();
        } else if (e.key === 'ArrowRight') {
          nextGalleryImage();
        } else if (e.key === 'i' || e.key === 'I') {
          setShowImageInfo(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryImage, closeGalleryLightbox, prevGalleryImage, nextGalleryImage]);

  // Toggle Investor Data Room visibility
  const handleToggleInvestorDataRoom = async (cardId: string, value: boolean) => {
    try {
      // Find the card to get all its data
      const card = cards.find(c => c.id === cardId);
      if (!card) return;

      // Update local state immediately for responsive UI
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === cardId ? { ...c, isInvestorDataRoom: value } : c
        )
      );

      // Update knowledge_documents collection (SINGLE SOURCE OF TRUTH)
      const kbDocRef = doc(db, 'knowledge_documents', cardId);
      const kbDocSnap = await getDoc(kbDocRef);
      
      if (kbDocSnap.exists()) {
        // Document exists in knowledge_documents - update published_to_ir field
        await setDoc(kbDocRef, {
          published_to_ir: value,
          updated_at: new Date()
        }, { merge: true });
        
        console.log(`✅ Updated knowledge_documents/${cardId}: published_to_ir = ${value}`);
        
        // Reload actual IR count to keep it in sync
        await reloadActualIRCount();
        
        // Success feedback
        if (value) {
          toast.success(`✅ Added to IR Data Room`, {
            description: `"${card.title}" is now visible to investors. The document card and full content will appear in the Investor Data Room.`,
            duration: 5000,
          });
        } else {
          toast.success(`🗑️ Removed from IR Data Room`, {
            description: `"${card.title}" is no longer visible to investors and has been removed from the Data Room.`,
            duration: 5000,
          });
        }
      } else {
        // Hardcoded card - create a knowledge_documents entry so IR Dataroom can find it
        console.log(`⚠️  Card ${cardId} not found in knowledge_documents, creating entry...`);
        
        const kbDocRef = doc(db, 'knowledge_documents', cardId);
        await setDoc(kbDocRef, {
          id: cardId,
          title: card.title,
          description: card.description,
          secure_badge: card.badgeText,
          secure_badge_color: card.badgeClass,
          secure_slug: card.href,
          permission_level: 'founders',
          visibility_scope: 'organization',
          is_private: true,
          chatbot_accessible: false,
          published_to_founders: true, // Already visible in Founders Portal
          published_to_ir: value,      // Toggle IR visibility
          published_to_hub: false,
          status: 'active',
          source: 'hardcoded_portal_card',
          created_at: new Date(),
          updated_at: new Date()
        }, { merge: true });
        
        console.log(`✅ Created/Updated knowledge_documents/${cardId}: published_to_ir = ${value}`);
        
        // Reload actual IR count to keep it in sync
        await reloadActualIRCount();
        
        // Success feedback
        if (value) {
          toast.success(`✅ Added to IR Data Room`, {
            description: `"${card.title}" is now visible to investors. The document card will appear in the Investor Data Room.`,
            duration: 5000,
          });
        } else {
          toast.success(`🗑️ Removed from IR Data Room`, {
            description: `"${card.title}" is no longer visible to investors and has been removed from the Data Room.`,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error updating investor data room status:', error);
      toast.error('Failed to update Investor Data Room', {
        description: 'Please try again or contact support if the issue persists.',
      });
      // Revert local state on error
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isInvestorDataRoom: !value } : card
        )
      );
    }
  };

  // Clear ALL documents from IR Data Room
  const handleClearAllFromIR = async () => {
    if (!confirm('⚠️ Remove ALL documents from Investor Data Room?\n\nThis will:\n• Remove all document cards from IR Data Room\n• Set all toggles to OFF\n• Cannot be undone\n\nContinue?')) {
      return;
    }

    setIsClearing(true);
    try {
      let clearedCount = 0;
      let errorCount = 0;

      // Clear all cards
      for (const card of cards) {
        try {
          // Update knowledge_documents
          const kbDocRef = doc(db, 'knowledge_documents', card.id);
          const kbDocSnap = await getDoc(kbDocRef);
          
          if (kbDocSnap.exists()) {
            await setDoc(kbDocRef, {
              published_to_ir: false,
              updated_at: new Date()
            }, { merge: true });
            clearedCount++;
          } else {
            // Update secure_documents
            const secureDocRef = doc(db, 'secure_documents', card.id);
            await setDoc(secureDocRef, {
              isInvestorDataRoom: false,
              updatedAt: new Date().toISOString(),
            }, { merge: true });
            clearedCount++;
          }
        } catch (error) {
          console.error(`Error clearing ${card.id}:`, error);
          errorCount++;
        }
      }

      // Clear Financial Overview toggle
      try {
        const financialDocRef = doc(db, 'secure_documents', 'financial-overview');
        await setDoc(financialDocRef, {
          isInvestorDataRoom: false,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        setShowFinancialInIR(false);
      } catch (error) {
        console.error('Error clearing financial overview:', error);
        errorCount++;
      }

      // Clear QA Testing toggle
      try {
        const qaTestingDocRef = doc(db, 'secure_documents', 'qa-testing-accounts');
        await setDoc(qaTestingDocRef, {
          isInvestorDataRoom: false,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        setShowQATestingInIR(false);
      } catch (error) {
        console.error('Error clearing QA testing accounts:', error);
        errorCount++;
      }

      // Update local state
      setCards(prevCards => prevCards.map(card => ({ ...card, isInvestorDataRoom: false })));

      // Reload actual IR count to keep it in sync
      await reloadActualIRCount();

      toast.success(`✅ Cleared ${clearedCount} documents from IR Data Room`, {
        description: errorCount > 0 ? `${errorCount} errors occurred` : 'All documents removed successfully',
        duration: 6000,
      });
    } catch (error) {
      console.error('Error clearing IR Data Room:', error);
      toast.error('Failed to clear IR Data Room');
    } finally {
      setIsClearing(false);
    }
  };

  // Re-sync toggles from database (fixes mismatches)
  const handleReSyncToggles = async () => {
    toast.info('🔄 Re-syncing toggles from database...', { duration: 2000 });
    
    try {
      await loadCardOrder();
      toast.success('✅ Toggles re-synced successfully', {
        description: 'All toggle states now match the database',
        duration: 4000,
      });
    } catch (error) {
      console.error('Error re-syncing toggles:', error);
      toast.error('Failed to re-sync toggles');
    }
  };

  // Save card order as global default
  const saveAsGlobalDefault = async () => {
    try {
      const newOrder = cards.map(card => card.id);
      await setDoc(doc(db, 'portal_settings', 'founders_card_order'), {
        order: newOrder,
        updatedBy: user?.uid,
        updatedAt: new Date(),
      });
      setDefaultCardOrder(newOrder);
      setHasUnsavedChanges(false);
      alert('✅ Card order saved as global default!');
    } catch (error) {
      console.error('Error saving card order:', error);
      alert('❌ Failed to save card order');
    }
  };

  // Reset to default order
  const resetToDefault = () => {
    const orderedCards = defaultCardOrder
      .map(id => initialCards.find(card => card.id === id))
      .filter(Boolean) as QuickAccessCard[];
    setCards(orderedCards);
    setHasUnsavedChanges(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo */}
            <Link href="/dashboard" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              SHELTR
            </Link>
            
            {/* Center: Badge */}
            <div className="flex-1 flex justify-center">
              <Badge className="bg-purple-600 text-white px-4 py-1.5">
                <Lock className="h-4 w-4 mr-2" />
                Restricted Access
              </Badge>
            </div>
            
            {/* Right: Welcome message */}
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{user?.displayName || user?.email?.split('@')[0]}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              Founders Portal
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white py-16 overflow-hidden">
        {/* Hero Image/Video Background */}
        {heroImage ? (
          <div className="absolute inset-0">
            {heroImage.mediaType === 'video' ? (
              <video
                src={heroImage.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-40"
              />
            ) : (
              <Image
                src={heroImage.url}
                alt={heroImage.alt}
                fill
                className="object-cover opacity-40"
                priority
              />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-indigo-900/80"></div>
          </div>
        ) : (
          <>
            {/* Background Pattern - Only shown when no hero image */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            
            {/* Hero Image Placeholder - Only shown when no hero image */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-32 w-32 text-white/30" />
              </div>
            </div>
          </>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Lock className="h-7 w-7" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-1" />
                Leadership
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Welcome to SHELTR&apos;s Leadership Command Center
            </h1>
            
            <p className="text-xl text-purple-50 mb-6 leading-relaxed">
              Your account credentials provide you with comprehensive access to the SHELTR platform, including full Platform
              Administrator privileges and executive dashboard capabilities. As Administrators, you have unrestricted access to all
              system functions, financial oversight, user management, and strategic analytics.
            </p>
            
            <p className="text-purple-100 mb-8">
              Upon logging into the main platform, you will be presented with a Non-Disclosure Agreement (NDA) and a personalized 
              welcome letter tailored to your specific expertise and leadership role within SHELTR. This portal serves as your gateway 
              to confidential business plans, financial reports, and strategic documentation that will be progressively published here 
              as we advance toward our public launch.
            </p>

            {/* Security Advisory */}
            <div className="bg-orange-500/20 border-2 border-orange-400/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-100 mb-1">Security Advisory</p>
                  <p className="text-sm text-orange-50">
                    For security purposes, please ensure you log out of the founders portal after each session. All access is 
                    monitored and logged for confidentiality and security compliance. Your session will automatically expire after 
                    2 hours of inactivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* IR Data Room Management Panel */}
        <Card className="mb-6 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-yellow-600" />
                <div>
                  <CardTitle className="text-lg">IR Data Room Management</CardTitle>
                  <CardDescription className="text-sm">
                    Control what investors see • {actualIRCount} documents currently shared
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManagementPanel(!showManagementPanel)}
              >
                {showManagementPanel ? 'Hide Tools' : 'Show Tools'}
              </Button>
            </div>
          </CardHeader>
          
          {showManagementPanel && (
            <CardContent className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{actualIRCount}</div>
                  <div className="text-xs text-muted-foreground">Shared to IR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{cards.length - cards.filter(c => c.isInvestorDataRoom).length}</div>
                  <div className="text-xs text-muted-foreground">Not Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{cards.length}</div>
                  <div className="text-xs text-muted-foreground">Total Documents</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleReSyncToggles}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Re-Sync Toggles
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearAllFromIR}
                  disabled={isClearing || cards.filter(c => c.isInvestorDataRoom).length === 0}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                >
                  {isClearing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Clear All from IR
                    </>
                  )}
                </Button>
              </div>

              {/* Help Text */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Re-Sync Toggles:</strong> Fixes toggle states if they don&apos;t match the actual IR Data Room contents.<br />
                  <strong>Clear All:</strong> Removes ALL documents from IR Data Room. Cannot be undone.
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>

        {/* Main Accordion Sections */}
        <Accordion type="single" collapsible className="space-y-4 mb-8">
          
          {/* Quick Access Links Accordion */}
          <AccordionItem value="quick-access" className="border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold">Quick Access Links</h3>
                  <p className="text-sm text-muted-foreground">
                    Strategic documents, secure portals, and platform resources
                  </p>
                </div>
                <Badge className="bg-purple-600 text-white">{cards.length} Cards</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-6">
              {/* Save/Reset Buttons - Only for Super Admin */}
              {hasUnsavedChanges && (
                <div className="flex gap-2 mb-6 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToDefault}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveAsGlobalDefault}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Set as Global Default
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <strong>Super Admin:</strong> Your card order can be set as the global default for all Platform Admins
              </p>

              {/* Drag and Drop Grid */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={cards.map(c => c.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                      <SortableCard 
                        key={card.id} 
                        card={card} 
                        onToggleInvestorDataRoom={handleToggleInvestorDataRoom}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </AccordionContent>
          </AccordionItem>

          {/* Financial Overview Accordion */}
          <AccordionItem value="financial-overview" className="border-2 border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-green-50 dark:hover:bg-green-900/20">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold">Financial Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Seed budget projections & 2-year revenue forecasting • 8 revenue streams • Path to profitability
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">Confidential</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-6">
              {/* Investor Data Room Toggle */}
              <div className="flex items-center justify-between p-4 mb-6 bg-muted/50 rounded-lg border-2 border-border/40">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <Label htmlFor="financial-toggle" className="text-base font-medium cursor-pointer">
                    Share to Investor Data Room
                  </Label>
                </div>
                <Switch
                  id="financial-toggle"
                  checked={showFinancialInIR}
                  onCheckedChange={handleToggleFinancialOverview}
                />
              </div>
              
              {/* Financial Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetCard />
                <RevenueCard />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* QA Testing Accordion */}
          <AccordionItem value="qa-testing" className="border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold">QA Testing Demo Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Connected test accounts for comprehensive system validation
                  </p>
                </div>
                <Badge className="bg-blue-600 text-white">4 Accounts</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-6">
              {/* Investor Data Room Toggle */}
              <div className="flex items-center justify-between p-4 mb-6 bg-muted/50 rounded-lg border-2 border-border/40">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <Label htmlFor="qa-testing-toggle" className="text-base font-medium cursor-pointer">
                    Share to Investor Data Room
                  </Label>
                </div>
                <Switch
                  id="qa-testing-toggle"
                  checked={showQATestingInIR}
                  onCheckedChange={handleToggleQATestingAccounts}
                />
              </div>

              <Card className="bg-slate-50 dark:bg-slate-900 border-2">
            <CardContent className="pt-6">
              <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-500">
              <AlertDescription className="text-sm text-green-700 dark:text-green-300">
                These three interconnected demo accounts simulate the complete SHELTR ecosystem for testing purposes. The <strong>Participant</strong>
                {' '}and <strong>Shelter Admin</strong> are connected to <strong>Old Brewery Mission</strong> for realistic data flow testing. The Scan & Give system is currently
                awaiting payment rail and blockchain integration, but the data stream functions consistently. <strong>Important:</strong> When logged in as
                Platform Administrators, donations will be credited to your accounts for testing purposes.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Demo Donor */}
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Demo Donor
                  </CardTitle>
                  <CardDescription>Jane Supporter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      donor@example.com
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      sheltr123
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <Badge variant="outline">donor</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Participant */}
              <Card className="border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Demo Participant
                  </CardTitle>
                  <CardDescription>Michael Rodriguez</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      participant@example.com
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      sheltr123
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <Badge variant="outline">participant</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Connected to</p>
                    <Badge className="bg-green-600 text-white">Old Brewery Mission</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Shelter Admin */}
              <Card className="border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Demo Shelter Admin
                  </CardTitle>
                  <CardDescription>Sarah Chen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      shelteradmin@example.com
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      sheltr123
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <Badge variant="outline">shelter-admin</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Organization</p>
                    <Badge className="bg-purple-600 text-white">Old Brewery Mission</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Investor */}
              <Card className="border-2 border-red-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Demo Investor
                  </CardTitle>
                  <CardDescription>Investor Data Room</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      investor@sheltr-demo.com
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      Investor2025!
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <Badge variant="outline">investor</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Portal</p>
                    <Link href="/ir" target="_blank">
                      <Badge className="bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                        /ir (Data Room)
                      </Badge>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment & Blockchain Status */}
            <Alert className="mt-4 bg-orange-50 dark:bg-orange-900/20 border-orange-500">
              <Clock className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-sm text-orange-700 dark:text-orange-300">
                <strong>Payment & Blockchain Integration Status:</strong> The Scan & Give donation system is currently in development, awaiting full payment rail (Adyen) and blockchain (Coinbase Base)
                integration. However, the data streaming and user interface are fully functional for testing purposes. All donation flows will
                be simulated until payment processing is activated.
              </AlertDescription>
            </Alert>
            </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Founders Gallery Accordion */}
          {galleryItems.length > 0 && (
            <AccordionItem value="founders-gallery" className="border-2 border-pink-200 dark:border-pink-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-2xl font-bold">Founders Gallery</h3>
                    <p className="text-sm text-muted-foreground">
                      Curated media content shared exclusively with SHELTR co-founders
                    </p>
                  </div>
                  <Badge className="bg-pink-600 text-white">{galleryItems.length} Items</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => openGalleryLightbox(index)}
                >
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                    {item.type === 'video' && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                        Video
                      </Badge>
                    )}
                    {item.duration && (
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        {item.duration}
                      </Badge>
                    )}
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Clickable Overlay with Eye Icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Eye className="h-6 w-6 text-gray-800" />
                      </div>
                    </div>
                    {item.type === 'video' && item.url && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-black ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

        </Accordion>

        {/* Coming Soon Notice */}
        <Alert className="mb-12 bg-blue-50 dark:bg-blue-900/20 border-blue-500">
          <AlertDescription className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            <strong>Coming Soon to This Portal:</strong> Business plans, detailed financial reports, and strategic documentation will be progressively published in this founders portal as we advance
            toward our public launch timeline.
          </AlertDescription>
        </Alert>

        {/* Confidential Information Footer */}
        <Card className="bg-slate-900 text-white border-slate-700">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Confidential Information</h4>
                <p className="text-sm text-slate-300">
                  All information accessed through this portal is confidential and proprietary to SHELTR-AI. Unauthorized sharing or distribution is
                  strictly prohibited. Access is logged for security and compliance purposes.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-white text-white hover:bg-white hover:text-black"
                  onClick={() => router.push('/portal')}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Secure Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage !== null && galleryItems[selectedGalleryImage] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeGalleryLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Info Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageInfo(!showImageInfo)}
              className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
            >
              <Info className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {galleryItems.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevGalleryImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextGalleryImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Media */}
            <div className="relative max-w-5xl max-h-[70vh] w-full h-full">
              {galleryItems[selectedGalleryImage]?.type === 'video' && galleryItems[selectedGalleryImage]?.url ? (
                <video
                  key={galleryItems[selectedGalleryImage]?.url}
                  src={galleryItems[selectedGalleryImage].url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-full object-contain rounded-lg mx-auto"
                  style={{ maxHeight: 'calc(70vh - 60px)' }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={galleryItems[selectedGalleryImage].thumbnail}
                  alt={galleryItems[selectedGalleryImage].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </div>

            {/* Always Visible Metadata Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent">
              <div className="max-w-5xl mx-auto px-6 py-4">
                {/* Title and Type Badge */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-xl text-white flex-1 mr-4">
                    {galleryItems[selectedGalleryImage].title}
                  </h3>
                  {galleryItems[selectedGalleryImage]?.type === 'video' && (
                    <Badge className="bg-red-600 text-white">Video</Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {galleryItems[selectedGalleryImage].description}
                </p>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-3">
                  {/* Upload Date */}
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{galleryItems[selectedGalleryImage].date}</span>
                  </div>

                  {/* Media Type */}
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span className="capitalize">{galleryItems[selectedGalleryImage]?.type || 'image'}</span>
                  </div>

                  {/* Duration for videos */}
                  {galleryItems[selectedGalleryImage]?.duration && (
                    <div className="flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5" />
                      <span>{galleryItems[selectedGalleryImage].duration}</span>
                    </div>
                  )}

                  {/* Item count */}
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{selectedGalleryImage + 1} of {galleryItems.length}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {galleryItems[selectedGalleryImage].tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20">
                      {tag}
                    </Badge>
                  ))}
                  {galleryItems[selectedGalleryImage].tags.length > 5 && (
                    <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">
                      +{galleryItems[selectedGalleryImage].tags.length - 5} more
                    </Badge>
                  )}
                </div>

                {/* Keyboard Hints */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <p className="text-xs text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white">ESC</kbd> to close • 
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white ml-1">←</kbd> 
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white ml-1">→</kbd> to navigate
                    {showImageInfo && (
                      <span className="ml-2">• <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white">I</kbd> to hide details</span>
                    )}
                  </p>
                  {!showImageInfo && galleryItems[selectedGalleryImage].tags.length > 5 && (
                    <button 
                      onClick={() => setShowImageInfo(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all tags →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Extended Info Panel (Toggle with I key) */}
            {showImageInfo && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-10">
                <div className="bg-slate-900 text-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
                  {/* Close Extended Info */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-2xl">{galleryItems[selectedGalleryImage].title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowImageInfo(false)}
                      className="text-white hover:bg-white/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Full Description */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                    <p className="text-base text-gray-200">{galleryItems[selectedGalleryImage].description}</p>
                  </div>

                  {/* All Tags */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {galleryItems[selectedGalleryImage].tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm bg-blue-500/10 border-blue-500/30 text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">Upload Date:</span>
                      <span>{galleryItems[selectedGalleryImage].date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">Type:</span>
                      <span className="capitalize">{galleryItems[selectedGalleryImage]?.type || 'image'}</span>
                    </div>
                    {galleryItems[selectedGalleryImage]?.duration && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Play className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">Duration:</span>
                        <span>{galleryItems[selectedGalleryImage].duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-300">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">Position:</span>
                      <span>{selectedGalleryImage + 1} of {galleryItems.length}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white">I</kbd> or click × to close details
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/icon.svg"
                    alt="SHELTR"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg">SHELTR</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Revolutionary platform ending homelessness through technology-driven transparency and direct support.
              </p>
              <Badge className="bg-purple-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Founders Portal
              </Badge>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/portal/founders-only/investor-relations" className="text-muted-foreground hover:text-foreground transition-colors">
                    Investor Relations Home
                  </Link>
                </li>
                <li>
                  <Link href="/portal/founders-only/budget" className="text-muted-foreground hover:text-foreground transition-colors">
                    Budget & Projections
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                    Public Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Return to Homepage
                  </Link>
                </li>
              </ul>
            </div>

            {/* Security & Support */}
            <div>
              <h4 className="font-semibold mb-4">Security & Support</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    All materials are encrypted and protected
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    NDA-protected confidential information
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Remember to log out after your session
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} SHELTR. All rights reserved. Confidential and proprietary.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure Session
                </span>
                <span>•</span>
                <span>Founders Portal v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

