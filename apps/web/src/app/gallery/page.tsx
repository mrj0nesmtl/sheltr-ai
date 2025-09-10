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
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

// Gallery image interface
interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  date: string;
  isPublic: boolean;
  order: number;
}

const categories = ['all', 'pods', 'mobi', 'drones', 'technology', 'fabrication', 'concepts'];
const gridSizes = [
  { icon: LayoutGrid, cols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', size: 'sm' },
  { icon: Grid2X2, cols: 'grid-cols-2 md:grid-cols-3', size: 'md' },
  { icon: Grid3X3, cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', size: 'lg' }
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [gridSize, setGridSize] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load images from Firebase
  const loadImages = async () => {
    try {
      const imagesQuery = query(
        collection(db, 'gallery_images'),
        where('isPublic', '==', true)
      );
      const snapshot = await getDocs(imagesQuery);
      const loadedImages: GalleryImage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedImages.push({
          id: doc.id,
          src: data.src,
          title: data.title,
          category: data.category,
          description: data.description,
          tags: data.tags || [],
          date: data.date,
          isPublic: data.isPublic,
          order: data.order
        });
      });
      
      // Sort images by order manually since we can't use orderBy in the query yet
      loadedImages.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setImages(loadedImages);
      setFilteredImages(loadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
      setFilteredImages([]);
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
                {filteredImages.length} images
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images, tags, or descriptions..."
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
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 6}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
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
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
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

            {/* Main Image */}
            <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image Info Panel */}
            {showImageInfo && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-6 text-white">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold mb-2">{filteredImages[selectedImage].title}</h2>
                  <p className="text-gray-300 mb-4">{filteredImages[selectedImage].description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span className="capitalize">{filteredImages[selectedImage].category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{filteredImages[selectedImage].date}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {filteredImages[selectedImage].tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
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
