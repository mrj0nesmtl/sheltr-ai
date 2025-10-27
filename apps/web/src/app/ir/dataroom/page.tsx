'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  FileText,
  CreditCard,
  BookOpen,
  Users,
  Rocket,
  BarChart3,
  Database,
  Lock,
  ExternalLink,
  Star,
  Shield,
  Image as ImageIcon,
  Loader2,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
  isInvestorDataRoom?: boolean; // New field
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
  isInvestorDataRoom?: boolean; // New field
}

export default function InvestorDataRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cards, setCards] = useState<QuickAccessCard[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Authorization check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else if (user.role !== 'investor') {
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  // Load cards and gallery items shared to investor data room
  useEffect(() => {
    const loadInvestorContent = async () => {
      if (!isAuthorized) return;

      try {
        // Load cards from Firestore (secure_documents with isInvestorDataRoom = true)
        const docsQuery = query(
          collection(db, 'secure_documents'),
          where('isInvestorDataRoom', '==', true)
        );
        const docsSnapshot = await getDocs(docsQuery);
        
        // Map Firestore documents to cards with proper formatting
        const loadedCards: QuickAccessCard[] = docsSnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Determine icon based on category or use FileText as default
          let icon = <FileText className="h-6 w-6 text-blue-600" />;
          
          // If it's a secure document, add lock icon overlay
          if (data.category === 'secure') {
            icon = (
              <div className="relative">
                <FileText className="h-6 w-6 text-blue-600" />
                <Lock className="h-3 w-3 text-blue-600 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
              </div>
            );
          }
          
          return {
            id: doc.id,
            icon: icon,
            badgeText: data.badgeText || 'Document',
            badgeClass: data.badgeClass || 'bg-blue-600 text-white',
            title: data.title || 'Untitled Document',
            titleColor: data.titleColor || 'text-blue-600',
            description: data.description || 'No description available',
            buttonText: data.buttonText || 'View Document',
            buttonClass: data.buttonClass || 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
            href: `/ir/dataroom/${doc.id}`,
            borderClass: data.borderClass || 'border-blue-200',
            category: (data.category as 'public' | 'secure' | 'platform') || 'secure',
            isInvestorDataRoom: true,
          };
        });

        setCards(loadedCards);

        // Load gallery items shared to investor data room
        const galleryQuery = query(
          collection(db, 'gallery_images'),
          where('isInvestorDataRoom', '==', true)
        );
        const gallerySnapshot = await getDocs(galleryQuery);
        
        const loadedGallery: GalleryItem[] = gallerySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            type: data.type || 'image',
            thumbnail: data.url || '',
            url: data.url || '',
            tags: data.tags || [],
            date: data.uploadedAt?.toDate().toLocaleDateString() || '',
            duration: data.duration || undefined,
            isInvestorDataRoom: true,
          };
        });

        setGalleryItems(loadedGallery);
      } catch (error) {
        console.error('Error loading investor content:', error);
        toast.error('Failed to load data room content');
      }
    };

    loadInvestorContent();
  }, [isAuthorized]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/ir');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo-sheltr-white.png"
                  alt="SHELTR Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight whitespace-nowrap">
                  Investor Data Room
                </h1>
                <p className="text-sm text-muted-foreground">
                  Secure Investment Materials
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Investor Access
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Alert className="border-2 border-primary/20 bg-primary/5">
            <Star className="h-5 w-5 text-primary" />
            <AlertDescription className="ml-2">
              <strong>Welcome to the SHELTR Investor Data Room.</strong> This secure portal contains confidential investment materials, financial projections, and strategic documents. All content is proprietary and confidential.
            </AlertDescription>
          </Alert>
        </div>

        {/* Quick Access Cards */}
        {cards.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Investment Documents</h2>
              <p className="text-muted-foreground">
                Confidential materials for authorized investors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card key={card.id} className={`hover:shadow-lg transition-all ${card.borderClass}`}>
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
                  <CardContent>
                    <Link href={card.href}>
                      <Button variant="outline" className={`w-full ${card.buttonClass}`}>
                        {card.buttonText}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {galleryItems.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Media Gallery</h2>
              <p className="text-muted-foreground">
                Visual presentations and demonstrations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    {item.type === 'video' && item.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                        {item.duration}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {cards.length === 0 && galleryItems.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Content Available</h3>
            <p className="text-muted-foreground">
              No documents or media have been shared to the investor data room yet.
              <br />
              Please check back later or contact{' '}
              <a href="mailto:joel@arcanaconcept.com" className="text-primary hover:underline">
                joel@arcanaconcept.com
              </a>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            <strong>Confidential & Proprietary</strong>
            <br />
            This data room and all its contents are confidential and intended solely for authorized investors.
            <br />
            © {new Date().getFullYear()} SHELTR. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}

