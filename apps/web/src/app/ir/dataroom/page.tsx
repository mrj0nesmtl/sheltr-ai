'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Lock, Shield, ExternalLink, GripVertical, Save, RotateCcw, LogOut, DollarSign, Home, ChevronRight, AlertTriangle, Image as ImageIcon, CheckCircle, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { BudgetCard } from '@/components/dashboard/BudgetCard';
import { RevenueCard } from '@/components/dashboard/RevenueCard';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Document type definition
interface InvestorDocument {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  isExternal?: boolean;
  externalUrl?: string;
  secureSlug?: string; // Custom slug from knowledge base config
  hubSlug?: string; // Public docs hub slug
  permissionLevel?: string; // public vs platform_admin
}

// Badge color mapping based on document category/type
const getBadgeColors = (badge: string): { badgeColor: string; textColor: string; borderColor: string } => {
  const colorMap: Record<string, { badgeColor: string; textColor: string; borderColor: string }> = {
    'Strategic': { badgeColor: 'bg-blue-500', textColor: 'text-blue-500', borderColor: 'border-blue-200' },
    'SmartFund™': { badgeColor: 'bg-orange-600', textColor: 'text-orange-600', borderColor: 'border-orange-200' },
    'Secure': { badgeColor: 'bg-red-600', textColor: 'text-red-600', borderColor: 'border-red-200' },
    'Partnership': { badgeColor: 'bg-pink-600', textColor: 'text-pink-600', borderColor: 'border-pink-200' },
    'Launch Plan': { badgeColor: 'bg-orange-500', textColor: 'text-orange-500', borderColor: 'border-orange-200' },
    'Source Code': { badgeColor: 'bg-purple-600', textColor: 'text-purple-600', borderColor: 'border-purple-200' },
    'Pre-Seed': { badgeColor: 'bg-blue-600', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
    'Team': { badgeColor: 'bg-indigo-600', textColor: 'text-indigo-600', borderColor: 'border-indigo-200' },
    'Legal': { badgeColor: 'bg-red-600', textColor: 'text-red-600', borderColor: 'border-red-200' },
    'Enterprise': { badgeColor: 'bg-green-600', textColor: 'text-green-600', borderColor: 'border-green-200' },
    'Essential': { badgeColor: 'bg-purple-600', textColor: 'text-purple-600', borderColor: 'border-purple-200' },
    'Research': { badgeColor: 'bg-teal-600', textColor: 'text-teal-600', borderColor: 'border-teal-200' },
    'Architecture': { badgeColor: 'bg-slate-600', textColor: 'text-slate-600', borderColor: 'border-slate-200' },
    'v2.0': { badgeColor: 'bg-emerald-600', textColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
  };
  
  return colorMap[badge] || { badgeColor: 'bg-gray-500', textColor: 'text-gray-500', borderColor: 'border-gray-200' };
};

// Fallback hardcoded documents (only used if Firestore query fails)
const FALLBACK_INVESTOR_DOCUMENTS: InvestorDocument[] = [
  {
    id: 'adyen-integration',
    title: 'Adyen Integration Strategy',
    description: 'Comprehensive analysis of Adyen for Platforms (Balanced Model) with 16-week implementation roadmap for SmartFund™ 80-15-5 distribution',
    badge: 'Strategic',
    badgeColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-200',
  },
  {
    id: 'blockchain-architecture',
    title: 'Blockchain Architecture',
    description: 'Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed returns',
    badge: 'SmartFund™',
    badgeColor: 'bg-orange-600',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
  },
  {
    id: 'business-plan',
    title: 'Business Plan',
    description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
    badge: 'Secure',
    badgeColor: 'bg-red-600',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    id: 'covenant-house-outreach',
    title: 'Covenant House Proposal',
    description: 'Executive partnership proposal for Covenant House Canada 2026-2027 youth homelessness innovation pilot',
    badge: 'Partnership',
    badgeColor: 'bg-pink-600',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
  },
  {
    id: 'development-roadmap',
    title: 'Development Roadmap',
    description: '60-day public launch timeline with client onboarding strategy and AI achievements',
    badge: 'Launch Plan',
    badgeColor: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-200',
  },
  {
    id: 'github-repository',
    title: 'GitHub Repository',
    description: 'Complete source code, smart contracts, and development history',
    badge: 'Source Code',
    badgeColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    isExternal: true,
    externalUrl: 'https://github.com/mrj0nesmtl/sheltr-ai',
  },
  {
    id: 'investor-relations',
    title: 'Investor Relations',
    description: 'Pre-seed funding information, financial projections, and investment terms',
    badge: 'Pre-Seed',
    badgeColor: 'bg-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    id: 'leadership-team',
    title: 'Leadership Team',
    description: 'Meet the SHELTR leadership team, founders, and key contributors driving our mission',
    badge: 'Team',
    badgeColor: 'bg-indigo-600',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
  },
  {
    id: 'msb-registration',
    title: 'MSB Registration Guide',
    description: 'Canadian regulatory compliance guide for crypto-enabled donation platforms - FINTRAC MSB requirements and incorporation',
    badge: 'Legal',
    badgeColor: 'bg-red-600',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    id: 'proposed-payment-rails',
    title: 'Proposed Payment Rails',
    description: 'Adyen + Coinbase integration architecture with single-token stable fund model',
    badge: 'Enterprise',
    badgeColor: 'bg-green-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
  {
    id: 'platform-admin-guide',
    title: 'Platform Administrator Guide',
    description: 'Complete operational guide for Platform Administrators - user management, security monitoring, and strategic oversight',
    badge: 'Essential',
    badgeColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    id: 'shelter-research',
    title: 'Shelter Research Hub',
    description: 'Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, and innovative programs across North America',
    badge: 'Research',
    badgeColor: 'bg-teal-600',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
  },
  {
    id: 'system-design',
    title: 'System Design Architecture',
    description: 'Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration blueprints',
    badge: 'Architecture',
    badgeColor: 'bg-slate-600',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  },
  {
    id: 'technical-whitepaper',
    title: 'Technical White Paper',
    description: 'Revolutionary enterprise-grade platform with single-token architecture and blockchain transparency',
    badge: 'v2.0',
    badgeColor: 'bg-emerald-600',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
];

// Sortable Card Component
interface SortableCardProps {
  doc: InvestorDocument;
  isSuperAdmin: boolean;
}

function SortableCard({ doc, isSuperAdmin }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: doc.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle external links (like GitHub)
  const handleClick = (e: React.MouseEvent) => {
    if (doc.isExternal && doc.externalUrl) {
      e.preventDefault();
      window.open(doc.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card
        className={`group hover:shadow-lg transition-all duration-200 border-2 ${doc.borderColor} ${
          isDragging ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <CardContent className="p-6">
          {/* Drag Handle - Only visible for Super Admins */}
          {isSuperAdmin && (
            <div
              {...attributes}
              {...listeners}
              className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FileText className={`h-5 w-5 ${doc.textColor}`} />
            </div>
            <Badge className={`${doc.badgeColor} text-white`}>
              {doc.badge}
            </Badge>
          </div>

          <h4 className={`text-lg font-bold mb-2 ${doc.textColor}`}>
            {doc.title}
          </h4>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {doc.description}
          </p>

          {doc.isExternal && doc.externalUrl ? (
            <Button
              variant="outline"
              className={`w-full border-2 ${doc.textColor} hover:bg-opacity-10`}
              onClick={handleClick}
            >
              View Repository
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href={`/ir/${doc.hubSlug || doc.secureSlug || doc.id}`}>
              <Button
                variant="outline"
                className={`w-full border-2 ${doc.textColor} hover:bg-opacity-10`}
              >
                View Document
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  type: 'image' | 'video';
  createdAt: string;
}

interface HeroImage {
  url: string;
  alt: string;
  mediaType: 'image' | 'video';
}

export default function IRInvestorDataRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [showFinancialOverview, setShowFinancialOverview] = useState(false);
  const [showQATestingAccounts, setShowQATestingAccounts] = useState(false);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin';

  // Theme toggle functionality
  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Authorization check - Allow qualified investors, investors, AND super admins
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else {
        // Allow super_admin and check for custom investor claims
        const userWithClaims = user as { role?: string; investor?: boolean; qualified_investor?: boolean };
        const hasInvestorAccess = 
          user.role === 'super_admin' || 
          userWithClaims.qualified_investor === true ||
          userWithClaims.investor === true;
        
        if (!hasInvestorAccess) {
          toast.error('Access denied: Investor credentials required');
          router.push('/dashboard');
        } else {
          setIsAuthorized(true);
          // Grant session access for embedded pages
          sessionStorage.setItem('investor-access', 'granted');
        }
      }
    }
  }, [user, authLoading, router]);

  // Load IR documents from Firestore (where published_to_ir is true)
  useEffect(() => {
    if (!isAuthorized) return;

    const loadIRDocuments = async () => {
      setDocumentsLoading(true);
      try {
        // Query knowledge_documents where published_to_ir is true
        const docsQuery = query(
          collection(db, 'knowledge_documents'),
          where('published_to_ir', '==', true),
          where('status', '==', 'active')
        );
        
        const snapshot = await getDocs(docsQuery);
        
        if (snapshot.empty) {
          console.log('⚠️  No IR documents found - Data Room is empty');
          setDocuments([]); // Empty array instead of fallback
        } else {
          const irDocs: InvestorDocument[] = snapshot.docs.map(doc => {
            const data = doc.data();
            const colors = getBadgeColors(data.secure_badge || data.badge || 'Default');
            
            return {
              id: doc.id,
              title: data.title || 'Untitled',
              description: data.ir_description || data.description || '',
              badge: data.secure_badge || data.badge || 'Document',
              ...colors,
              isExternal: data.external_link && data.use_external_link,
              externalUrl: data.use_external_link ? data.external_link : undefined,
              secureSlug: data.secure_slug || undefined,
              hubSlug: data.hub_slug || undefined,
              permissionLevel: data.permission_level || undefined,
            };
          });
          
          console.log(`✅ Loaded ${irDocs.length} IR documents from Firestore`);
          setDocuments(irDocs);
        }
      } catch (error) {
        console.error('Error loading IR documents:', error);
        toast.error('Failed to load documents');
        // Show empty on error (no fallback)
        setDocuments([]);
      } finally {
        setDocumentsLoading(false);
      }
    };

    loadIRDocuments();
  }, [isAuthorized]);

  // Load saved card order from Firestore and apply to loaded documents
  useEffect(() => {
    if (!isAuthorized || documentsLoading || documents.length === 0) return;

    const loadCardOrder = async () => {
      try {
        // Load card order from Founders Portal settings (cascades to IR Dataroom)
        const orderDoc = await getDoc(doc(db, 'portal_settings', 'founders_card_order'));
        
        if (orderDoc.exists()) {
          const savedOrder = orderDoc.data().order as string[];
          
          // Reorder current documents based on saved order from Founders Portal
          const orderedDocs = savedOrder
            .map((id: string) => documents.find((d: InvestorDocument) => d.id === id))
            .filter((d): d is InvestorDocument => d !== undefined);
          
          // Add any new documents that aren't in the saved order
          const newDocs = documents.filter(
            (d: InvestorDocument) => !savedOrder.includes(d.id)
          );
          
          setDocuments([...orderedDocs, ...newDocs]);
        }
      } catch (error) {
        console.error('Error loading card order:', error);
        // Silently fail - use default order
      }
    };

    loadCardOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, documents.length, documentsLoading]);

  // Load financial overview toggle state
  useEffect(() => {
    if (!isAuthorized) return;

    const loadFinancialToggle = async () => {
      try {
        const financialDoc = await getDoc(doc(db, 'secure_documents', 'financial-overview'));
        if (financialDoc.exists()) {
          setShowFinancialOverview(financialDoc.data().isInvestorDataRoom || false);
        }
      } catch (error) {
        console.error('Error loading financial overview toggle:', error);
      }
    };

    const loadQATestingToggle = async () => {
      try {
        const qaTestingDoc = await getDoc(doc(db, 'secure_documents', 'qa-testing-accounts'));
        if (qaTestingDoc.exists()) {
          setShowQATestingAccounts(qaTestingDoc.data().isInvestorDataRoom || false);
        }
      } catch (error) {
        console.error('Error loading QA testing toggle:', error);
      }
    };

    const loadPitchDeckToggle = async () => {
      try {
        // Check knowledge_documents for pitch-deck (hardcoded cards are stored here)
        const pitchDeckDoc = await getDoc(doc(db, 'knowledge_documents', 'pitch-deck'));
        if (pitchDeckDoc.exists()) {
          setShowPitchDeck(pitchDeckDoc.data().published_to_ir || false);
        }
      } catch (error) {
        console.error('Error loading pitch deck toggle:', error);
      }
    };

    loadFinancialToggle();
    loadQATestingToggle();
    loadPitchDeckToggle();
  }, [isAuthorized]);

  // Load hero image for this page
  useEffect(() => {
    if (!isAuthorized) return;

    const loadHeroImage = async () => {
      try {
        const galleryRef = collection(db, 'gallery_images');
        const heroQuery = query(
          galleryRef,
          where('heroPages', 'array-contains', '/ir/dataroom')
        );

        const snapshot = await getDocs(heroQuery);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          const mediaType = data.mediaType || (data.type?.startsWith('video') ? 'video' : 'image');

          setHeroImage({
            url: data.src || data.url || '',
            alt: data.title || 'SHELTR Investor Data Room',
            mediaType: mediaType,
          });
        }
      } catch (error) {
        console.error('Error loading hero image:', error);
      }
    };

    loadHeroImage();
  }, [isAuthorized]);

  // Load gallery items from Firestore
  useEffect(() => {
    if (!isAuthorized) return;

    const loadGalleryItems = async () => {
      setGalleryLoading(true);
      try {
        const galleryQuery = query(
          collection(db, 'gallery_images'),
          where('isInvestorDataRoom', '==', true)
        );
        
        const snapshot = await getDocs(galleryQuery);
        const items: GalleryItem[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            url: data.src || data.url || '', // Try 'src' first, then 'url'
            title: data.title || 'Untitled',
            description: data.description || '',
            type: data.mediaType || data.type || 'image',
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          };
        });

        // Sort by creation date (newest first)
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setGalleryItems(items);
      } catch (error) {
        console.error('Error loading gallery items:', error);
        toast.error('Failed to load gallery items');
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGalleryItems();
  }, [isAuthorized]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setDocuments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasUnsavedChanges(true);
    }
  };

  // Save card order to Firestore (Super Admin only) - saves to same location as Founders Portal
  const saveCardOrder = async () => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admins can save the default card order');
      return;
    }

    setIsSaving(true);
    try {
      const order = documents.map(doc => doc.id);
      
      // Save to portal_settings/founders_card_order so it cascades from Founders Portal to IR Dataroom
      await setDoc(doc(db, 'portal_settings', 'founders_card_order'), {
        order,
        updatedBy: user?.email || 'unknown',
        updatedAt: new Date(),
      });

      toast.success('Card order saved as global default for all investors and founders');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving card order:', error);
      toast.error('Failed to save card order');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default order (reload from Firestore)
  const resetToDefault = async () => {
    setDocumentsLoading(true);
    try {
      // Reload from Firestore
      const docsQuery = query(
        collection(db, 'knowledge_documents'),
        where('published_to_ir', '==', true),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(docsQuery);
      
      if (snapshot.empty) {
        console.log('⚠️  No IR documents found after reset');
        setDocuments([]); // Empty array instead of fallback
      } else {
        const irDocs: InvestorDocument[] = snapshot.docs.map(doc => {
          const data = doc.data();
          const colors = getBadgeColors(data.secure_badge || data.badge || 'Default');
          
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            description: data.ir_description || data.description || '',
            badge: data.secure_badge || data.badge || 'Document',
            ...colors,
            isExternal: data.external_link && data.use_external_link,
            externalUrl: data.use_external_link ? data.external_link : undefined,
            secureSlug: data.secure_slug || undefined,
            hubSlug: data.hub_slug || undefined,
            permissionLevel: data.permission_level || undefined,
          };
        });
        
        setDocuments(irDocs);
      }
      setHasUnsavedChanges(false);
      toast.success('Documents reloaded from database');
    } catch (error) {
      console.error('Error reloading documents:', error);
      toast.error('Failed to reload documents');
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
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
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* SHELTR Icon */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <Image
                  src="/icon.svg"
                  alt="SHELTR"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-xl font-bold truncate">
                  Data Room
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Secure Investment Materials</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Personalized Welcome Message */}
              <div className="hidden lg:flex items-center mr-2">
                <span className="text-sm text-muted-foreground">
                  Welcome <span className="font-medium text-foreground">{user?.displayName || user?.email?.split('@')[0] || 'Investor'}</span>
                </span>
              </div>

              <Badge className="bg-blue-600 text-white hidden sm:flex">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
              <Badge className="bg-blue-600 text-white sm:hidden p-2">
                <Shield className="h-3 w-3" />
              </Badge>
              
              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hidden md:flex"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              
              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await signOut(auth);
                    sessionStorage.removeItem('investor-access');
                    sessionStorage.removeItem('investor-info');
                    toast.success('Logged out successfully');
                    router.push('/ir');
                  } catch (error) {
                    console.error('Logout error:', error);
                    toast.error('Failed to logout');
                  }
                }}
                className="border-2"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
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
            <Link href="/ir" className="hover:text-foreground transition-colors">
              Investor Relations
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              Data Room
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
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
                Confidential
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Welcome{user?.displayName ? `, ${user.displayName}` : user?.email ? `, ${user.email.split('@')[0]}` : ''} to the SHELTR Data Room
            </h1>
            
            <p className="text-xl text-blue-50 mb-6 leading-relaxed">
              Thank you for your interest in SHELTR. As a potential partner in our mission to hack homelessness through tech-for-good, 
              your support and expertise are crucial to our success. We&apos;re excited to share our progress, vision, and strategic roadmap with you.
            </p>
            
            <p className="text-blue-100 mb-8">
              This secure portal contains confidential investment materials, financial projections, technical documentation, and strategic plans. 
              All materials are proprietary and subject to NDA agreements. We appreciate your commitment to maintaining the confidentiality of these materials.
            </p>

            {/* Security Advisory */}
            <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-100 mb-1">Security Advisory</p>
                  <p className="text-sm text-yellow-50">
                    Please log out when you finish reviewing materials, especially when accessing from shared or public devices. 
                    Your session will automatically expire after 2 hours of inactivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            
            {/* Pitch Deck Accordion */}
            {showPitchDeck && (
              <AccordionItem value="pitch-deck" className="border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-2xl font-bold">Pitch Deck</h3>
                      <p className="text-sm text-muted-foreground">
                        2026 business plan and investor presentation hosted on Gamma
                      </p>
                    </div>
                    <Badge className="bg-purple-600 text-white">Live Document</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-6">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                      <strong>Interactive Presentation:</strong> Our comprehensive pitch deck covers executive summary, market opportunity, 
                      solution overview, technology stack, business model, financial projections, team, and exit strategy.
                    </p>
                    <div className="flex gap-2 text-xs text-purple-600 dark:text-purple-400">
                      <span>• Executive Summary</span>
                      <span>• Market Analysis</span>
                      <span>• Financial Projections</span>
                      <span>• Team & Leadership</span>
                    </div>
                  </div>

                  <a 
                    href="https://2026-business-plan-ogqhgdb.gamma.site/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Open Pitch Deck
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* Deep Dive Documents */}
            <AccordionItem value="investment-documents" className="border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-2xl font-bold">Deep Dive</h3>
                    <p className="text-sm text-muted-foreground">
                      {isSuperAdmin 
                        ? 'Drag cards to reorder. Changes apply to all investors.' 
                        : 'Technical documentation, business plans, and strategic resources'}
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white">{documents.length} Docs</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6">
                {/* Save/Reset Buttons - Only for Super Admin */}
                {isSuperAdmin && hasUnsavedChanges && (
                  <div className="flex gap-2 mb-6 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetToDefault}
                      disabled={isSaving}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveCardOrder}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Global Order'}
                    </Button>
                  </div>
                )}

                {documentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading documents...</p>
                    </div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No documents available for investors at this time.</p>
                    </div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={documents.map(doc => doc.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc) => (
                          <SortableCard key={doc.id} doc={doc} isSuperAdmin={isSuperAdmin} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Financial Overview Accordion */}
            {showFinancialOverview && (
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
                  {/* Financial Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BudgetCard linkPath="/ir/budget" />
                    <RevenueCard linkPath="/ir/revenue" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* QA Testing Demo Accounts Accordion */}
            {showQATestingAccounts && (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Demo Donor */}
                    <Card className="border-2 border-blue-500">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <h4 className="font-bold">Demo Donor</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Jane Supporter</p>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            donor@example.com
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Password</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
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
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <h4 className="font-bold">Demo Participant</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Michael Rodriguez</p>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            participant@example.com
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Password</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            sheltr123
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Role</p>
                          <Badge variant="outline">participant</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Demo Shelter Admin */}
                    <Card className="border-2 border-purple-500">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <h4 className="font-bold">Demo Shelter Admin</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Sarah Manager</p>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            sheltradmin@example.com
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Password</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            sheltr123
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Role</p>
                          <Badge variant="outline">admin</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Platform Admin */}
                    <Card className="border-2 border-orange-500">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <h4 className="font-bold">Platform Admin</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Gunnar Blaze</p>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            gunnar.blaze@gmail.com
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Password</p>
                          <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">
                            nPBSYUJXTemp!
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Role</p>
                          <Badge variant="outline">platform_admin</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>System Validation:</strong> These interconnected accounts demonstrate the complete SHELTR ecosystem functionality. 
                      The Participant and Shelter Admin are connected to Old Brewery Mission for realistic data flow testing.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Media Gallery Accordion */}
            {galleryItems.length > 0 && (
              <AccordionItem value="media-gallery" className="border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-2xl font-bold">Media Gallery</h3>
                      <p className="text-sm text-muted-foreground">
                        Visual insights and updates from the SHELTR team
                      </p>
                    </div>
                    <Badge className="bg-purple-600 text-white">{galleryItems.length} Items</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-6">
                  {galleryLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {galleryItems.map((item) => (
                        <Card
                          key={item.id}
                          className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
                          onClick={() => setSelectedImage(item)}
                        >
                          <div className="relative aspect-video bg-slate-200 dark:bg-slate-800">
                            {item.type === 'image' ? (
                              <Image
                                src={item.url}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                controls={false}
                              />
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

          </Accordion>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setSelectedImage(null)}
            >
              ✕ Close
            </Button>
            <div className="relative w-full h-full">
              {selectedImage.type === 'image' ? (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  width={1920}
                  height={1080}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={selectedImage.url}
                  className="w-full h-auto max-h-[80vh]"
                  controls
                  autoPlay
                />
              )}
            </div>
            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-sm text-gray-300">{selectedImage.description}</p>
              )}
            </div>
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
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Portal
              </Badge>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/ir" className="text-muted-foreground hover:text-foreground transition-colors">
                    Investor Relations Home
                  </Link>
                </li>
                <li>
                  <Link href="/ir/budget" className="text-muted-foreground hover:text-foreground transition-colors">
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
                <span>Investor Portal v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
