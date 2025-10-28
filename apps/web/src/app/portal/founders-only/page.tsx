'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

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
              <div>
                <Badge className={card.badgeClass}>{card.badgeText}</Badge>
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
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border-2 border-border/40">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              <Label htmlFor={`investor-toggle-${card.id}`} className="text-sm font-medium cursor-pointer">
                Share to Investor Data Room
              </Label>
            </div>
            <Switch
              id={`investor-toggle-${card.id}`}
              checked={card.isInvestorDataRoom || false}
              onCheckedChange={(checked) => onToggleInvestorDataRoom(card.id, checked)}
            />
          </div>
          
          <Link href={card.href}>
            <Button variant="outline" className={`w-full ${card.buttonClass}`}>
              {card.buttonText}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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

  // Load saved card order and toggle states
  const loadCardOrder = async () => {
    try {
      // Load card order
      const orderDoc = await getDoc(doc(db, 'portal_settings', 'founders_card_order'));
      let orderedCards = [...initialCards];
      
      if (orderDoc.exists()) {
        const savedOrder = orderDoc.data().order as string[];
        setDefaultCardOrder(savedOrder);
        
        // Reorder cards based on saved order
        orderedCards = savedOrder
          .map(id => initialCards.find(card => card.id === id))
          .filter(Boolean) as QuickAccessCard[];
        
        // Add any new cards that weren't in the saved order
        const newCards = initialCards.filter(
          card => !savedOrder.includes(card.id)
        );
        
        orderedCards = [...orderedCards, ...newCards];
      }

      // Load toggle states from Firestore
      const toggleStates = await Promise.all(
        orderedCards.map(async (card) => {
          try {
            const docRef = doc(db, 'secure_documents', card.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return {
                ...card,
                isInvestorDataRoom: docSnap.data().isInvestorDataRoom || false
              };
            }
            return card;
          } catch (error) {
            console.error(`Error loading toggle state for ${card.id}:`, error);
            return card;
          }
        })
      );

      setCards(toggleStates);
    } catch (error) {
      console.error('Error loading card order:', error);
      setCards(initialCards);
    }
  };

  // Load gallery items
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

      // Store complete card data in Firestore (excluding React components)
      const docRef = doc(db, 'secure_documents', cardId);
      const cardData = {
        id: card.id,
        title: card.title,
        description: card.description,
        badgeText: card.badgeText,
        badgeClass: card.badgeClass,
        titleColor: card.titleColor,
        buttonText: card.buttonText,
        buttonClass: card.buttonClass,
        href: card.href,
        borderClass: card.borderClass,
        category: card.category,
        isInvestorDataRoom: value,
        updatedAt: new Date().toISOString(),
      };

      // If toggling ON, also copy document content from founder_documents if it exists
      if (value) {
        try {
          const founderDocRef = doc(db, 'founder_documents', cardId);
          const founderDocSnap = await getDoc(founderDocRef);
          
          if (founderDocSnap.exists()) {
            const founderData = founderDocSnap.data();
            // Merge the founder document content with card metadata
            Object.assign(cardData, {
              content: founderData.content,
              slug: founderData.slug || cardId,
              type: founderData.type || 'secure',
              tags: founderData.tags || [],
              metadata: founderData.metadata || {},
              version: founderData.version,
              author: founderData.author,
            });
            console.log(`📄 Copied document content from founder_documents for ${cardId}`);
          }
        } catch (err) {
          console.warn(`⚠️  Could not copy content from founder_documents for ${cardId}:`, err);
        }
      }

      await setDoc(docRef, cardData, { merge: true });

      console.log(`✅ Updated ${cardId}: isInvestorDataRoom = ${value}`);
    } catch (error) {
      console.error('Error updating investor data room status:', error);
      // Revert local state on error
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isInvestorDataRoom: !value } : card
        )
      );
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Portal Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-4">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Portal</h1>
          <p className="text-muted-foreground text-lg">
            Confidential access for strategic leadership
          </p>
        </div>

        {/* Welcome Message */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Welcome to SHELTR&apos;s Executive Command Center</CardTitle>
            <CardDescription>
              Your Google email addresses provide you with comprehensive access to the SHELTR platform, including full Platform
              Administrator privileges and executive dashboard capabilities. As co-founders, you have unrestricted access to all
              system functions, financial oversight, user management, and strategic analytics. Upon logging into the main
              platform, you will be presented with a Non-Disclosure Agreement (NDA) and a personalized welcome letter tailored
              to your specific expertise and leadership role within SHELTR. This portal serves as your gateway to confidential
              business plans, financial reports, and strategic documentation that will be progressively published here as we
              advance toward our public launch.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Security Advisory */}
        <Alert className="mb-8 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            <strong>Security Advisory:</strong> For security purposes, please ensure you log out of the founders portal after each session. All access is monitored and logged
            for confidentiality and security compliance.
          </AlertDescription>
        </Alert>

        {/* Quick Access Links */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Quick Access Links</h2>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <>
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
                </>
              )}
            </div>
          </div>

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
        </div>

        {/* Quality Assurance & Testing Environment */}
        <Card className="mb-8 bg-slate-50 dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>QA Testing Demo Accounts</CardTitle>
            </div>
            <CardDescription>
              Connected test accounts for comprehensive system validation
            </CardDescription>
          </CardHeader>
          <CardContent>
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

        {/* Coming Soon Notice */}
        <Alert className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-500">
          <AlertDescription className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            <strong>Coming Soon to This Portal:</strong> Business plans, detailed financial reports, and strategic documentation will be progressively published in this founders portal as we advance
            toward our public launch timeline.
          </AlertDescription>
        </Alert>

        {/* Founders Gallery */}
        {galleryItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Founders Gallery</h2>
            <p className="text-muted-foreground mb-6">
              Curated media content shared exclusively with SHELTR co-founders
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all">
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
                    {item.type === 'video' && item.url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-black ml-1" />
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
          </div>
        )}

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
    </div>
  );
}

