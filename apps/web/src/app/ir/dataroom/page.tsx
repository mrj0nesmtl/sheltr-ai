'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Lock, Shield, ExternalLink, GripVertical, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
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
}

// Simple hardcoded list of documents available to investors
const INVESTOR_DOCUMENTS: InvestorDocument[] = [
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
            <Link href={`/ir/documents/${doc.id}`}>
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

export default function InvestorDataRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [documents, setDocuments] = useState(INVESTOR_DOCUMENTS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const isSuperAdmin = user?.role === 'super_admin';

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Authorization check - Allow both investors AND super admins
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else if (user.role !== 'investor' && user.role !== 'super_admin') {
        toast.error('Access denied: Investor or Super Admin credentials required');
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
        // Grant session access for embedded pages
        sessionStorage.setItem('investor-access', 'granted');
      }
    }
  }, [user, authLoading, router]);

  // Load saved card order from Firestore
  useEffect(() => {
    if (!isAuthorized) return;

    const loadCardOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'investor_dataroom_config', 'card_order'));
        
        if (orderDoc.exists()) {
          const savedOrder = orderDoc.data().order as string[];
          
          // Reorder documents based on saved order
          const orderedDocs = savedOrder
            .map(id => INVESTOR_DOCUMENTS.find(doc => doc.id === id))
            .filter(Boolean) as typeof INVESTOR_DOCUMENTS;
          
          // Add any new documents that aren't in the saved order
          const newDocs = INVESTOR_DOCUMENTS.filter(
            doc => !savedOrder.includes(doc.id)
          );
          
          setDocuments([...orderedDocs, ...newDocs]);
        }
      } catch (error) {
        console.error('Error loading card order:', error);
        // Silently fail - use default order
      }
    };

    loadCardOrder();
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

  // Save card order to Firestore (Super Admin only)
  const saveCardOrder = async () => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admins can save the default card order');
      return;
    }

    setIsSaving(true);
    try {
      const order = documents.map(doc => doc.id);
      
      await setDoc(doc(db, 'investor_dataroom_config', 'card_order'), {
        order,
        updatedBy: user?.email || 'unknown',
        updatedAt: new Date().toISOString(),
      });

      toast.success('Card order saved as global default for all investors');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving card order:', error);
      toast.error('Failed to save card order');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default order
  const resetToDefault = () => {
    setDocuments(INVESTOR_DOCUMENTS);
    setHasUnsavedChanges(true);
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Investor Data Room</h1>
                <p className="text-xs text-muted-foreground">Secure Investment Materials</p>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Investor Access
            </Badge>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome to the SHELTR Investor Data Room.</h2>
              <p className="text-blue-100">
                This secure portal contains confidential investment materials, financial projections, and strategic documents. 
                All materials are proprietary and subject to NDA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Documents */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Investment Documents</h3>
              <p className="text-muted-foreground">
                {isSuperAdmin 
                  ? 'Drag cards to reorder. Changes apply to all investors.' 
                  : 'Confidential materials for authorized investors'}
              </p>
            </div>
            
            {/* Save/Reset Buttons - Only for Super Admin */}
            {isSuperAdmin && hasUnsavedChanges && (
              <div className="flex gap-2">
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
          </div>

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
        </div>
      </section>

      {/* Media Gallery Section */}
      {galleryItems.length > 0 && (
        <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Media Gallery</h3>
              <p className="text-muted-foreground">
                Visual insights and updates from the SHELTR team
              </p>
            </div>

            {galleryLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          </div>
        </section>
      )}

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

      {/* Footer Note */}
      <section className="py-8 border-t bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Lock className="inline h-4 w-4 mr-1" />
            All documents are confidential and protected. Unauthorized sharing or distribution is strictly prohibited.
          </p>
        </div>
      </section>
    </div>
  );
}
