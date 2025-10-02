'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  Grid2X2,
  LayoutGrid,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Camera,
  Calendar,
  Tag
} from 'lucide-react';
import { GalleryService } from '@/services/galleryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { sanitizeForAttribute, sanitizeForDisplay, sanitizeTags, sanitizeUrl, sanitizeCategory, sanitizeDate } from '@/utils/sanitize';

// Gallery media interface
interface GalleryMedia {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  date: string;
  isPublic: boolean;
  isHero: boolean; // Hero image for gallery page
  isLandingHero: boolean; // Hero image for landing page
  order: number;
  createdAt: Date;
  updatedAt: Date;
  // Video-specific fields
  mediaType?: 'image' | 'video';
  duration?: number;
  thumbnailUrl?: string;
}

const categories = ['all', 'pods', 'mobi', 'drones', 'technology', 'fabrication', 'concepts'];
const gridSizes = [
  { icon: LayoutGrid, cols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', size: 'sm' },
  { icon: Grid2X2, cols: 'grid-cols-2 md:grid-cols-3', size: 'md' },
  { icon: Grid3X3, cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', size: 'lg' }
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryMedia[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryMedia[]>([]);
  const [heroImage, setHeroImage] = useState<GalleryMedia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [gridSize, setGridSize] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load images from Firebase using GalleryService
  const loadImages = async () => {
    try {
      // Load all public gallery images
      const loadedImages = await GalleryService.getPublicGalleryImages();
      
      // Get the gallery hero image
      const foundHeroImage = await GalleryService.getGalleryHeroImage();
      
      setImages(loadedImages);
      setFilteredImages(loadedImages);
      setHeroImage(foundHeroImage);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
      setFilteredImages([]);
      setHeroImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter images based on search and category
  useEffect(() => {
    const filtered = images.filter(image => {
      const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredImages(filtered);
  }, [images, searchTerm, selectedCategory]);

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        } else if (e.key === 'ArrowLeft') {
          setSelectedImage(prev => prev === 0 ? filteredImages.length - 1 : (prev || 1) - 1);
        } else if (e.key === 'ArrowRight') {
          setSelectedImage(prev => (prev === null ? 0 : prev + 1) % filteredImages.length);
        } else if (e.key === 'i' || e.key === 'I') {
          setShowImageInfo(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages.length]);


  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setShowImageInfo(false);
  };

  const nextImage = () => {
    setSelectedImage(prev => (prev === null ? 0 : prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setSelectedImage(prev => prev === 0 ? filteredImages.length - 1 : (prev || 1) - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center">
                <Camera className="h-6 w-6 mr-2 text-primary" />
                <h1 className="text-xl font-bold">SHELTR Gallery</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                {filteredImages.length} items
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-muted/20">
        {/* Hero Background Image */}
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={sanitizeUrl(heroImage.src) || '/images/fallback.jpg'}
              alt={sanitizeForAttribute(heroImage.title)}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/40 to-background/70"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
              Ecosystem Visuals
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our innovative solutions for urban mobility, emergency response, and sustainable living. 
              From SHELTR PODS to drone delivery systems, discover the technology shaping tomorrow&apos;s cities.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>{filteredImages.length} Items</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{categories.length - 1} Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-input rounded-md px-3 py-2 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Size Toggle */}
            <div className="flex items-center border rounded-md">
              {gridSizes.map((size, index) => {
                const IconComponent = size.icon;
                return (
                  <Button
                    key={index}
                    variant={gridSize === index ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setGridSize(index)}
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-4 ${gridSizes[gridSize].cols}`}>
          {filteredImages.map((image, index) => (
            <Card
              key={index}
              className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => openLightbox(index)}
            >
              <CardContent className="p-0 relative">
                <div className="relative aspect-square">
                  <Image
                    src={sanitizeUrl(image.mediaType === 'video' ? (image.thumbnailUrl || image.src) : image.src) || '/images/fallback.jpg'}
                    alt={sanitizeForAttribute(image.title)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 6}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Video Play Indicator */}
                  {image.mediaType === 'video' && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                          <svg className="h-6 w-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {image.duration && (
                        <Badge className="absolute top-2 left-2 bg-black/70 text-white text-xs">
                          {Math.floor(image.duration / 60)}:{(image.duration % 60).toFixed(0).padStart(2, '0')}
                        </Badge>
                      )}
                    </>
                  )}
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="text-xs">
                      {image.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {image.title}
                    </h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-2">
                      <Eye className="h-5 w-5 text-gray-800" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Main Media */}
            <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
              {filteredImages[selectedImage]?.mediaType === 'video' ? (
                <video
                  key={filteredImages[selectedImage]?.src}
                  src={sanitizeUrl(filteredImages[selectedImage].src) || ''}
                  controls
                  autoPlay
                  playsInline
                  muted
                  preload="auto"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{ maxHeight: 'calc(80vh - 60px)' }}
                  onError={(e) => {
                    console.error('❌ Video load error:', e);
                    console.error('Video src:', filteredImages[selectedImage]?.src);
                  }}
                  onLoadStart={() => console.log('🎥 Video loading:', filteredImages[selectedImage]?.src)}
                  onCanPlay={() => console.log('✅ Video can play:', filteredImages[selectedImage]?.title)}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={sanitizeUrl(filteredImages[selectedImage].src) || '/images/fallback.jpg'}
                  alt={sanitizeForAttribute(filteredImages[selectedImage].title)}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </div>

            {/* Image Info Panel */}
            {showImageInfo && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-6 text-white">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold mb-2">{sanitizeForDisplay(filteredImages[selectedImage].title)}</h2>
                  <p className="text-gray-300 mb-4">{sanitizeForDisplay(filteredImages[selectedImage].description)}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span className="capitalize">{sanitizeCategory(filteredImages[selectedImage].category)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{sanitizeDate(filteredImages[selectedImage].date)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sanitizeTags(filteredImages[selectedImage].tags).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {sanitizeForDisplay(tag)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
              {selectedImage + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border">
        <div>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">ESC</kbd> to close</div>
        <div>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">I</kbd> for info</div>
        <div>Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">←</kbd> <kbd className="px-1 py-0.5 bg-muted rounded text-xs">→</kbd> to navigate</div>
      </div>
    </div>
  );
}
