'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ThemeLogo from '@/components/ThemeLogo';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  LogOut, 
  ExternalLink,
  Rocket,
  CreditCard,
  FileText,
  Github,
  TrendingUp,
  AlertTriangle,
  Users,
  Lock,
  Building2,
  Blocks,
  Camera,
  GripVertical,
  RotateCcw,
  Star,
  CheckCircle2,
  MessageSquare,
  Menu,
  X,
  Home,
  BarChart3,
  User
} from 'lucide-react';
import { checkFounderAccess, clearFounderAccess, getFounderInfo } from '@/services/founderAccessService';
import FoundersGallery from '@/components/FoundersGallery';
import { useAuth } from '@/contexts/AuthContext';
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
import { getUserCardOrder, saveUserCardOrder, resetUserCardOrder, setGlobalDefaultOrder, getGlobalDefaultOrder } from '@/services/founderCardOrderService';

// Define card data structure
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
  isExternal?: boolean;
  borderClass?: string;
}

// Sortable Card Component
function SortableCard({ card }: { card: QuickAccessCard }) {
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
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded p-1 border border-gray-300 dark:border-gray-600 shadow-sm"
      >
        <GripVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>

      <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${card.borderClass || ''} h-full`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            {card.icon}
            <Badge className={card.badgeClass}>
              {card.badgeText}
            </Badge>
          </div>
          <CardTitle className={card.titleColor}>{card.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {card.description}
          </p>
          {card.isExternal ? (
            <Button asChild variant="outline" className={`w-full ${card.buttonClass}`}>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 no-underline"
              >
                {card.buttonText}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" className={`w-full ${card.buttonClass}`}>
              <Link href={card.href} className="flex items-center justify-center gap-2 no-underline">
                {card.buttonText}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Default card configuration (outside component to avoid recreation)
const DEFAULT_CARDS: QuickAccessCard[] = [
    {
      id: 'dev-roadmap',
      icon: <Rocket className="h-8 w-8 text-orange-600" />,
      badgeText: 'Launch Plan',
      badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      title: 'Development Roadmap',
      titleColor: 'text-orange-600',
      description: '60-day public launch timeline with client onboarding strategy and AI achievements',
      buttonText: 'View Roadmap',
      buttonClass: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:text-orange-400 dark:border-orange-400',
      href: '/docs/roadmap',
      borderClass: 'border-orange-200 dark:border-orange-800',
    },
    {
      id: 'payment-rails',
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      badgeText: 'Enterprise',
      badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      title: 'Proposed Payment Rails',
      titleColor: 'text-green-600',
      description: 'Adyen + Coinbase integration architecture with single-token stable fund model',
      buttonText: 'View Architecture',
      buttonClass: 'border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400 dark:border-green-400',
      href: '/docs/payment-rails',
      borderClass: 'border-green-200 dark:border-green-800',
    },
    {
      id: 'investor-relations',
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      badgeText: 'Pre-Seed',
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      title: 'Investor Relations',
      titleColor: 'text-blue-600',
      description: 'Pre-seed funding information, financial projections, and investment terms',
      buttonText: 'View Details',
      buttonClass: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400',
      href: '/portal/investor-relations',
      borderClass: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'documentation',
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      badgeText: 'Complete',
      badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      title: 'Documentation Hub',
      titleColor: 'text-purple-600',
      description: 'Comprehensive technical documentation, whitepapers, and system architecture',
      buttonText: 'Browse Docs',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:text-purple-400 dark:border-purple-400',
      href: '/docs',
      borderClass: 'border-purple-200 dark:border-purple-800',
    },
    {
      id: 'github',
      icon: <Github className="h-8 w-8 text-gray-600" />,
      badgeText: 'Source Code',
      badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      title: 'GitHub Repository',
      titleColor: 'text-gray-600',
      description: 'Complete source code, smart contracts, and development history',
      buttonText: 'View Repository',
      buttonClass: 'border-2 hover:bg-gray-100 dark:hover:bg-gray-800',
      href: 'https://github.com/mrj0nesmtl/sheltr-ai',
      isExternal: true,
      borderClass: 'border-gray-200 dark:border-gray-800',
    },
    {
      id: 'platform-access',
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      badgeText: 'Live Platform',
      badgeClass: 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white',
      title: 'SHELTR Platform',
      titleColor: 'text-indigo-600',
      description: 'Access the live SHELTR platform with full administrative privileges',
      buttonText: 'Access Platform',
      buttonClass: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-400',
      href: 'https://sheltr-ai.web.app/dashboard',
      isExternal: true,
      borderClass: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      id: 'system-design',
      icon: <Building2 className="h-8 w-8 text-cyan-600" />,
      badgeText: 'Architecture',
      badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      title: 'System Design Architecture',
      titleColor: 'text-cyan-600',
      description: 'Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration blueprints',
      buttonText: 'View Architecture',
      buttonClass: 'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-400',
      href: '/docs/system-design',
      borderClass: 'border-cyan-200 dark:border-cyan-800',
    },
    {
      id: 'whitepaper',
      icon: <FileText className="h-8 w-8 text-emerald-600" />,
      badgeText: 'v2.0',
      badgeClass: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white',
      title: 'Technical White Paper',
      titleColor: 'text-emerald-600',
      description: 'Revolutionary enterprise-grade platform with single-token architecture and blockchain transparency',
      buttonText: 'Read Whitepaper',
      buttonClass: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-400',
      href: '/docs/whitepaper',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'blockchain',
      icon: <Blocks className="h-8 w-8 text-amber-600" />,
      badgeText: 'SmartFund™',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      title: 'Blockchain Architecture',
      titleColor: 'text-amber-600',
      description: 'Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed returns',
      buttonText: 'View Blockchain',
      buttonClass: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:text-amber-400 dark:border-amber-400',
      href: '/docs/blockchain',
      borderClass: 'border-amber-200 dark:border-amber-800',
    },
    {
      id: 'gallery',
      icon: <Camera className="h-8 w-8 text-violet-600" />,
      badgeText: 'Media Hub',
      badgeClass: 'bg-violet-600 text-white dark:bg-violet-500 dark:text-white',
      title: 'Gallery Management',
      titleColor: 'text-violet-600',
      description: 'Upload and manage media content, videos, and images for platform and founders portal sharing',
      buttonText: 'Manage Gallery',
      buttonClass: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 dark:text-violet-400 dark:border-violet-400',
      href: '/dashboard/gallery',
      borderClass: 'border-violet-200 dark:border-violet-800',
    },
    {
      id: 'business-plan',
      icon: <FileText className="h-8 w-8 text-rose-600" />,
      badgeText: 'Secure',
      badgeClass: 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white',
      title: 'Business Plan',
      titleColor: 'text-rose-600',
      description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
      buttonText: 'View Business Plan',
      buttonClass: 'border-2 border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:text-rose-400 dark:border-rose-400',
      href: '/secure-docs/business-plan',
      borderClass: 'border-rose-200 dark:border-rose-800',
    },
    {
      id: 'design-guide',
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      badgeText: 'Secure',
      badgeClass: 'bg-orange-600 text-white dark:bg-orange-500 dark:text-white',
      title: 'Brand & Design Guide',
      titleColor: 'text-orange-600',
      description: 'Comprehensive brand system overview for Royaltri design team - components, colors, navigation, and UX flows',
      buttonText: 'View Design Guide',
      buttonClass: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:text-orange-400 dark:border-orange-400',
      href: '/secure-docs/royaltri-design-guide',
      borderClass: 'border-orange-200 dark:border-orange-800',
    },
    {
      id: 'msb-guide',
      icon: <Shield className="h-8 w-8 text-red-600" />,
      badgeText: 'Legal',
      badgeClass: 'bg-red-600 text-white dark:bg-red-500 dark:text-white',
      title: 'MSB Registration Guide',
      titleColor: 'text-red-600',
      description: 'Canadian regulatory compliance guide for crypto-enabled donation platforms - FINTRAC MSB requirements and incorporation',
      buttonText: 'View Legal Guide',
      buttonClass: 'border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-red-400',
      href: '/secure-docs/msb-registration-canada',
      borderClass: 'border-red-200 dark:border-red-800',
    },
    {
      id: 'platform-admin-guide',
      icon: <Users className="h-8 w-8 text-sky-600" />,
      badgeText: 'Essential',
      badgeClass: 'bg-sky-600 text-white dark:bg-sky-500 dark:text-white',
      title: 'Platform Administrator Guide',
      titleColor: 'text-sky-600',
      description: 'Complete operational guide for Platform Administrators - user management, security monitoring, and strategic oversight',
      buttonText: 'View Admin Guide',
      buttonClass: 'border-2 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 dark:text-sky-400 dark:border-sky-400',
      href: '/dashboard/platform-guide',
      borderClass: 'border-sky-200 dark:border-sky-800',
    },
    {
      id: 'shelter-research',
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      badgeText: 'Research',
      badgeClass: 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white',
      title: 'Shelter Research Hub',
      titleColor: 'text-indigo-600',
      description: 'Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, and innovative programs across North America',
      buttonText: 'Browse Research',
      buttonClass: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-400',
      href: '/secure-docs/shelter-research',
      borderClass: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      id: 'leadership-team',
      icon: <Users className="h-8 w-8 text-teal-600" />,
      badgeText: 'Team',
      badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      title: 'Leadership Team',
      titleColor: 'text-teal-600',
      description: 'Meet the SHELTR leadership team, founders, and key contributors driving our mission',
      buttonText: 'View Team',
      buttonClass: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 dark:text-teal-400 dark:border-teal-400',
      href: '/team',
      borderClass: 'border-teal-200 dark:border-teal-800',
    },
    {
      id: 'mcp-demo',
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      badgeText: 'Live Demo',
      badgeClass: 'bg-purple-600 text-white dark:bg-purple-500 dark:text-white',
      title: 'OpenAI MCP Demo',
      titleColor: 'text-purple-600',
      description: 'Interactive demonstration of SHELTR\'s enhanced chatbot powered by OpenAI Agents SDK and specialized MCP agents',
      buttonText: 'Try Demo',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:text-purple-400 dark:border-purple-400',
      href: '/docs/mcp-demo',
      borderClass: 'border-purple-200 dark:border-purple-800',
    },
  ];

export default function FoundersOnlyPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [founderInfo, setFounderInfo] = useState<{ email: string; name?: string; userId?: string } | null>(null);
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingGlobal, setIsSettingGlobal] = useState(false);
  const [globalDefaultSet, setGlobalDefaultSet] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get ordered cards - IMPORTANT: Always include all cards from DEFAULT_CARDS
  // This ensures new cards are shown even if they're not in the saved order yet
  const orderedCards = React.useMemo(() => {
    if (cardOrder.length === 0) {
      return DEFAULT_CARDS;
    }
    
    // Find cards that exist in savedOrder
    const existingCards = cardOrder
      .map(id => DEFAULT_CARDS.find(card => card.id === id))
      .filter(Boolean) as QuickAccessCard[];
    
    // Find new cards that aren't in savedOrder yet
    const newCards = DEFAULT_CARDS.filter(
      card => !cardOrder.includes(card.id)
    );
    
    console.log('🔍 Card Order Debug:', {
      savedOrder: cardOrder,
      existingCardsCount: existingCards.length,
      newCardsDetected: newCards.map(c => c.id),
      totalCards: existingCards.length + newCards.length,
    });
    
    // Return existing cards in saved order + new cards at the end
    return [...existingCards, ...newCards];
  }, [cardOrder]);

  // Full card order including new cards (for DnD context)
  const fullCardOrder = React.useMemo(() => {
    const existingIds = cardOrder.filter(id => 
      DEFAULT_CARDS.some(card => card.id === id)
    );
    const newIds = DEFAULT_CARDS
      .filter(card => !cardOrder.includes(card.id))
      .map(card => card.id);
    
    return [...existingIds, ...newIds];
  }, [cardOrder]);

  useEffect(() => {
    // Check if user has valid founder access
    const hasAccess = checkFounderAccess();
    const founder = getFounderInfo();
    
    if (!hasAccess || !founder) {
      // Redirect to portal login if not authorized
      router.push('/portal');
      return;
    }
    
    setIsAuthorized(true);
    setFounderInfo(founder);
    setIsLoading(false);

    // Load saved card order
    if (founder.userId) {
      getUserCardOrder(founder.userId).then(savedOrder => {
        if (savedOrder && savedOrder.length > 0) {
          console.log('📋 Loaded saved card order:', savedOrder);
          
          // Check if there are new cards in DEFAULT_CARDS that aren't in savedOrder
          const allDefaultIds = DEFAULT_CARDS.map(card => card.id);
          const newCardIds = allDefaultIds.filter(id => !savedOrder.includes(id));
          
          if (newCardIds.length > 0) {
            console.log('🆕 Detected new cards not in saved order:', newCardIds);
            // Merge: keep saved order + append new cards at the end
            const mergedOrder = [...savedOrder, ...newCardIds];
            setCardOrder(mergedOrder);
            
            // Auto-save the merged order to Firestore
            if (founder.userId) {
              saveUserCardOrder(founder.userId, mergedOrder).catch(err => 
                console.error('Failed to auto-save merged order:', err)
              );
            }
          } else {
            setCardOrder(savedOrder);
          }
        } else {
          // Set default order
          const defaultOrder = DEFAULT_CARDS.map(card => card.id);
          console.log('📋 No saved order, using default:', defaultOrder);
          setCardOrder(defaultOrder);
        }
      });
    }
  }, [router]);

  const handleLogout = () => {
    clearFounderAccess();
    router.push('/');
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Use fullCardOrder for drag operations (includes new cards)
      const currentOrder = fullCardOrder;
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);

      console.log('🔄 Drag end:', {
        from: active.id,
        to: over.id,
        oldIndex,
        newIndex,
        newOrder,
      });

      // Update state
      setCardOrder(newOrder);

      // Save to Firestore
      if (founderInfo?.userId) {
        setIsSaving(true);
        saveUserCardOrder(founderInfo.userId, newOrder)
          .then(() => {
            console.log('✅ Card order saved');
            setIsSaving(false);
          })
          .catch((error) => {
            console.error('❌ Failed to save card order:', error);
            setIsSaving(false);
          });
      }
    }
  };

  // Reset to global default order
  const handleResetOrder = async () => {
    if (!founderInfo?.userId) return;

    setIsSaving(true);

    try {
      // Reset user's personal order
      await resetUserCardOrder(founderInfo.userId);
      
      // Load the global default (or fallback to hardcoded default)
      const globalDefault = await getGlobalDefaultOrder();
      const defaultOrder = globalDefault || DEFAULT_CARDS.map(card => card.id);
      setCardOrder(defaultOrder);
      
      console.log('✅ Card order reset to global default');
      setIsSaving(false);
    } catch (error) {
      console.error('❌ Failed to reset card order:', error);
      setIsSaving(false);
    }
  };

  // Set current order as global default (Super Admin only)
  const handleSetGlobalDefault = async () => {
    if (!user || user.role !== 'super_admin' || !founderInfo?.userId) {
      console.warn('⚠️ Only Super Admin can set global default');
      return;
    }

    setIsSettingGlobal(true);

    try {
      await setGlobalDefaultOrder(
        cardOrder,
        founderInfo.userId,
        founderInfo.name || user.email || 'Super Admin'
      );
      setGlobalDefaultSet(true);
      
      // Show success message for 3 seconds
      setTimeout(() => setGlobalDefaultSet(false), 3000);
      
      console.log('✅ Global default set successfully');
      setIsSettingGlobal(false);
    } catch (error) {
      console.error('❌ Failed to set global default:', error);
      setIsSettingGlobal(false);
    }
  };

  // Check if user is Super Admin
  const isSuperAdmin = user?.role === 'super_admin';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to /portal
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">
                  Welcome, {founderInfo?.name || 'Founder'}
                </span>
              </div>
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-md border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {founderInfo?.name || 'Founder'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {founderInfo?.email}
                  </p>
                  <Badge variant="outline" className="mt-1 border-green-500 text-green-600 text-xs">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    Online
                  </Badge>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Home</span>
                </Link>
                
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">My Dashboard</span>
                </Link>

                <Link
                  href="/portal/founders-only"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Founders Portal</span>
                  <Badge className="ml-auto bg-purple-600 text-white text-xs">Active</Badge>
                </Link>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2 border-t pt-4">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>

              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/logo-sheltr-white.png" 
              alt="SHELTR Logo" 
              width={200}
              height={64}
              className="h-12 sm:h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Portal</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 px-4">
            Confidential access for strategic leadership
          </p>
          <Badge variant="outline" className="border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 px-4 py-1 text-xs sm:text-sm">
            🔒 Restricted Access
          </Badge>
        </div>

        {/* Founders Introduction */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">Welcome to SHELTR&apos;s Executive Command Center</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your Google email addresses provide you with comprehensive access to the SHELTR platform, including full Platform Administrator privileges and executive dashboard capabilities. As co-founders, you have unrestricted access to all system functions, financial oversight, user management, and strategic analytics. Upon logging into the main platform, you will be presented with a Non-Disclosure Agreement (NDA) and a personalized welcome letter tailored to your specific expertise and leadership role within SHELTR. This portal serves as your gateway to confidential business plans, financial reports, and strategic documentation that will be progressively published here as we advance toward our public launch.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Advisory */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 text-sm mb-1">
                  Security Advisory
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  For security purposes, please ensure you log out of the founders portal after each session. 
                  All access is monitored and logged for confidentiality and security compliance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Quick Access Links</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {isSaving && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  Saving...
                </span>
              )}
              {isSettingGlobal && (
                <span className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  Setting Global Default...
                </span>
              )}
              {globalDefaultSet && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Global Default Set!
                </span>
              )}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {isSuperAdmin && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSetGlobalDefault}
                    disabled={isSaving || isSettingGlobal}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-initial"
                  >
                    <Star className="h-4 w-4" />
                    <span className="hidden sm:inline">Set as Global Default</span>
                    <span className="sm:hidden">Set Global</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetOrder}
                  disabled={isSaving || isSettingGlobal}
                  className="flex items-center gap-2 flex-1 sm:flex-initial"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset to Default</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mb-4 text-xs sm:text-sm text-muted-foreground text-center px-4">
            {isSuperAdmin ? (
              <>
                ⭐ <strong>Super Admin:</strong> Your card order can be set as the global default for all Platform Admins
              </>
            ) : (
              <>💡 Hover over any card and drag the grip icon to rearrange</>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={fullCardOrder} strategy={rectSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderedCards.map((card) => (
                  <SortableCard key={card.id} card={card} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Section Divider */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 py-2 bg-background text-muted-foreground font-medium rounded-full border border-gray-200 dark:border-gray-700">
                Quality Assurance & Testing Environment
              </span>
            </div>
          </div>
        </div>

        {/* Demo User Credentials for QA Testing */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-emerald-700 dark:text-emerald-300">QA Testing Demo Accounts</CardTitle>
                  <p className="text-sm text-muted-foreground">Connected test accounts for comprehensive system validation</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Introduction */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    These three interconnected demo accounts simulate the complete SHELTR ecosystem for testing purposes. 
                    The <strong>Participant</strong> and <strong>Shelter Admin</strong> are connected to <strong>Old Brewery Mission</strong> for realistic data flow testing. 
                    The Scan & Give system is currently awaiting payment rail and blockchain integration, but the data stream functions consistently. 
                    <strong>Important:</strong> When logged in as Platform Administrators, donations will be credited to your accounts for testing purposes.
                  </p>
                </div>

                {/* Demo Accounts Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Donor Account */}
                  <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">D</span>
                        </div>
                        <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">Demo Donor</CardTitle>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Jane Supporter</div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Email</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">donor@example.com</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Password</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr123</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Role</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">donor</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Participant Account */}
                  <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">P</span>
                        </div>
                        <CardTitle className="text-green-700 dark:text-green-300 text-lg">Demo Participant</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs font-medium text-green-600 dark:text-green-400">Email</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">participant@example.com</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-green-600 dark:text-green-400">Password</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr123</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-green-600 dark:text-green-400">Role</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">participant</p>
                      </div>
                      <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                        <strong>Connected to:</strong> Old Brewery Mission
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shelter Admin Account */}
                  <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">S</span>
                        </div>
                        <CardTitle className="text-purple-700 dark:text-purple-300 text-lg">Demo Shelter Admin</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs font-medium text-purple-600 dark:text-purple-400">Email</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">shelteradmin@example.com</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-purple-600 dark:text-purple-400">Password</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr123</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-purple-600 dark:text-purple-400">Role</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr-admin</p>
                      </div>
                      <div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-700 dark:text-purple-300">
                        <strong>Organization:</strong> Old Brewery Mission
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Status Notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 text-xs">⚠</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1">Payment & Blockchain Integration Status</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        The Scan & Give donation system is currently in development, awaiting full payment rail (Adyen) and blockchain (Coinbase Base) integration. 
                        However, the data streaming and user interface components are fully functional for testing purposes. All donation flows will be simulated 
                        until payment processing is activated.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Future Content Notice */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-slate-600" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Coming Soon to This Portal</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Business plans, detailed financial reports, and strategic documentation will be progressively published 
                    in this founders portal as we advance toward our public launch timeline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Founders Gallery Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Founders Gallery</h2>
            <p className="text-muted-foreground">
              Curated media content shared exclusively with SHELTR co-founders
            </p>
          </div>
          
          <FoundersGallery />
        </div>

        {/* Footer Security Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-slate-50 dark:bg-slate-800 border rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-slate-600" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                Confidential Information
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All information accessed through this portal is confidential and proprietary to SHELTR-AI. 
              Unauthorized sharing or distribution is strictly prohibited. Access is logged for security and compliance purposes.
            </p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2 mx-auto"
              >
                <LogOut className="h-4 w-4" />
                Secure Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
