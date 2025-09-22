'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Camera,
  Trash2,
  Edit,
  Search,
  Filter,
  Plus,
  Save,
  ExternalLink,
  GripVertical,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
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
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  date: string;
  isPublic: boolean;
  isPrivate: boolean; // Hide from public gallery (internal use only)
  isHero: boolean; // Hero image for gallery page
  isLandingHero: boolean; // Hero image for landing page
  order: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Image metadata
  width?: number;
  height?: number;
  aspectRatio?: string;
  fileSize?: number;
}

const categories = ['pods', 'mobi', 'drones', 'technology', 'fabrication', 'concepts'];

// Helper function to extract image metadata
const extractImageMetadata = (file: File): Promise<{ width: number; height: number; aspectRatio: string }> => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = width / height;
      
      // Calculate common aspect ratios
      let aspectRatio = `${width}:${height}`;
      
      // Check for common ratios
      if (Math.abs(ratio - 16/9) < 0.01) aspectRatio = '16:9';
      else if (Math.abs(ratio - 4/3) < 0.01) aspectRatio = '4:3';
      else if (Math.abs(ratio - 3/2) < 0.01) aspectRatio = '3:2';
      else if (Math.abs(ratio - 1) < 0.01) aspectRatio = '1:1';
      else if (Math.abs(ratio - 9/16) < 0.01) aspectRatio = '9:16';
      else if (Math.abs(ratio - 21/9) < 0.01) aspectRatio = '21:9';
      else aspectRatio = `${Math.round(ratio * 100) / 100}:1`;
      
      resolve({ width, height, aspectRatio });
    };
    img.onerror = () => resolve({ width: 0, height: 0, aspectRatio: 'Unknown' });
    img.src = URL.createObjectURL(file);
  });
};

// Sortable Image Card Component
interface SortableImageCardProps {
  image: GalleryImage;
  index: number;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onToggleHero: (image: GalleryImage) => void;
  onToggleLandingHero: (image: GalleryImage) => void;
  onTogglePrivacy: (image: GalleryImage) => void;
  onViewImage: (index: number) => void;
}

function SortableImageCard({ image, index, onEdit, onDelete, onToggleHero, onToggleLandingHero, onTogglePrivacy, onViewImage }: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`overflow-hidden ${isDragging ? 'shadow-2xl z-50' : ''}`}
    >
      <div className="relative aspect-square cursor-pointer" onClick={() => onViewImage(index)}>
        <Image
          src={image.src}
          alt={image.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* View overlay on hover */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Eye className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
          <Badge variant={image.isPublic ? "default" : "secondary"} className="text-xs">
            {image.isPublic ? "Public" : "Private"}
          </Badge>
          {image.isPrivate && (
            <Badge variant="destructive" className="text-xs bg-red-500 hover:bg-red-600">
              HIDDEN
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {image.category}
          </Badge>
          {image.isHero && (
            <Badge variant="default" className="text-xs bg-yellow-500 hover:bg-yellow-600">
              GALLERY HERO
            </Badge>
          )}
          {image.isLandingHero && (
            <Badge variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
              LANDING HERO
            </Badge>
          )}
        </div>
        {/* Drag Handle */}
        <div 
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 rounded p-1 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate mb-1">{image.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {image.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {image.tags.slice(0, 3).map((tag, tagIndex) => (
            <Badge key={tagIndex} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {image.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{image.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="space-y-2 mb-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`hero-gallery-${image.id}`}
              checked={image.isHero || false}
              onChange={() => onToggleHero(image)}
              className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor={`hero-gallery-${image.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Hero Image Gallery
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`hero-landing-${image.id}`}
              checked={image.isLandingHero || false}
              onChange={() => onToggleLandingHero(image)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor={`hero-landing-${image.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Hero Image Landing Page
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`private-${image.id}`}
              checked={image.isPrivate || false}
              onChange={() => onTogglePrivacy(image)}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor={`private-${image.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Hide from Public Gallery
            </label>
          </div>
        </div>
        {/* Image Metadata */}
        {(image.width && image.height) && (
          <div className="text-xs text-muted-foreground mb-2 p-2 bg-muted/50 rounded">
            <div className="flex justify-between items-center">
              <span>Dimensions: {image.width} × {image.height}</span>
              <span>Ratio: {image.aspectRatio || 'Unknown'}</span>
            </div>
            {image.fileSize && (
              <div className="mt-1">
                Size: {(image.fileSize / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Order: {index + 1}
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(image)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(image)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GalleryManagementPage() {
  const { user, hasRole } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form state for new/editing images
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    isPublic: true,
    isPrivate: false,
    isHero: false,
    isLandingHero: false
  });

  // Helper function to show alerts
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto dismiss after 5 seconds
  };

  // Check permissions
  const canManageGallery = hasRole('super_admin') || hasRole('platform_admin');

  // Load images from Firestore
  const loadImages = useCallback(async () => {
    try {
      const imagesQuery = query(
        collection(db, 'gallery_images')
      );
      const snapshot = await getDocs(imagesQuery);
      const loadedImages: GalleryImage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedImages.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as GalleryImage);
      });
      
      // Sort images by order manually since we can't use orderBy in the query yet
      loadedImages.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setImages(loadedImages);
      setFilteredImages(loadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      showAlert('error', 'Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter images
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

  useEffect(() => {
    if (canManageGallery) {
      loadImages();
    }
  }, [canManageGallery, loadImages]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file || !user) return;

    setUploading(true);
    try {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `gallery/${timestamp}_${file.name}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Extract image metadata
      const imageMetadata = await extractImageMetadata(file);

      // Save to Firestore
      const imageData = {
        src: downloadURL,
        title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
        category: formData.category,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: new Date().getFullYear().toString(),
        isPublic: formData.isPublic,
        isPrivate: formData.isPrivate,
        isHero: formData.isHero,
        isLandingHero: formData.isLandingHero,
        order: images.length,
        uploadedBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Image metadata
        width: imageMetadata.width,
        height: imageMetadata.height,
        aspectRatio: imageMetadata.aspectRatio,
        fileSize: file.size
      };

      await addDoc(collection(db, 'gallery_images'), imageData);
      
      showAlert('success', 'Image uploaded successfully!');
      setUploadDialogOpen(false);
      setFormData({ title: '', category: '', description: '', tags: '', isPublic: true, isPrivate: false, isHero: false, isLandingHero: false });
      loadImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      showAlert('error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle image update
  const handleUpdateImage = async (imageId: string, updates: Partial<GalleryImage>) => {
    try {
      const imageRef = doc(db, 'gallery_images', imageId);
      await updateDoc(imageRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      showAlert('success', 'Image updated successfully!');
      setEditingImage(null);
      loadImages();
    } catch (error) {
      console.error('Error updating image:', error);
      showAlert('error', 'Failed to update image');
    }
  };

  // Handle hero image toggle
  const handleToggleHero = async (image: GalleryImage) => {
    try {
      setIsReordering(true);
      
      // If setting this image as hero, first unset any existing hero images
      if (!image.isHero) {
        const currentHeroImages = images.filter(img => img.isHero);
        const unsetPromises = currentHeroImages.map(heroImage => 
          updateDoc(doc(db, 'gallery_images', heroImage.id), { 
            isHero: false,
            updatedAt: new Date()
          })
        );
        await Promise.all(unsetPromises);
      }
      
      // Toggle the hero status of the current image
      await updateDoc(doc(db, 'gallery_images', image.id), {
        isHero: !image.isHero,
        updatedAt: new Date()
      });
      
      showAlert('success', image.isHero ? 'Hero image removed!' : 'Hero image set successfully!');
      loadImages();
    } catch (error) {
      console.error('Error toggling hero image:', error);
      showAlert('error', 'Failed to update hero image');
    } finally {
      setIsReordering(false);
    }
  };

  // Handle landing page hero image toggle
  const handleToggleLandingHero = async (image: GalleryImage) => {
    try {
      setIsReordering(true);
      
      // If setting this image as landing hero, first unset any existing landing hero images
      if (!image.isLandingHero) {
        const currentLandingHeroImages = images.filter(img => img.isLandingHero);
        const unsetPromises = currentLandingHeroImages.map(heroImage => 
          updateDoc(doc(db, 'gallery_images', heroImage.id), { 
            isLandingHero: false,
            updatedAt: new Date()
          })
        );
        await Promise.all(unsetPromises);
      }
      
      // Toggle the landing hero status of the current image
      await updateDoc(doc(db, 'gallery_images', image.id), {
        isLandingHero: !image.isLandingHero,
        updatedAt: new Date()
      });
      
      showAlert('success', image.isLandingHero ? 'Landing page hero image removed!' : 'Landing page hero image set successfully!');
      loadImages();
    } catch (error) {
      console.error('Error toggling landing hero image:', error);
      showAlert('error', 'Failed to update landing page hero image');
    } finally {
      setIsReordering(false);
    }
  };

  // Handle privacy toggle (hide from public gallery)
  const handleTogglePrivacy = async (image: GalleryImage) => {
    try {
      setIsReordering(true);
      
      // Toggle the privacy status of the current image
      await updateDoc(doc(db, 'gallery_images', image.id), {
        isPrivate: !image.isPrivate,
        updatedAt: new Date()
      });
      
      showAlert('success', image.isPrivate ? 'Image made visible in public gallery!' : 'Image hidden from public gallery!');
      loadImages();
    } catch (error) {
      console.error('Error toggling privacy:', error);
      showAlert('error', 'Failed to update privacy setting');
    } finally {
      setIsReordering(false);
    }
  };

  // Handle image viewer
  const handleViewImage = (index: number) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  // Keyboard navigation for viewer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewerOpen) {
        switch (event.key) {
          case 'Escape':
            handleCloseViewer();
            break;
          case 'ArrowLeft':
            handlePrevImage();
            break;
          case 'ArrowRight':
            handleNextImage();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewerOpen, handleNextImage, handlePrevImage]);

  // Handle image deletion
  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from Storage
      const storageRef = ref(storage, image.src);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery_images', image.id));
      
      showAlert('success', 'Image deleted successfully!');
      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      showAlert('error', 'Failed to delete image');
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = images.findIndex((item) => item.id === active.id);
    const newIndex = images.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setIsReordering(true);
    
    try {
      // Optimistically update the UI
      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
      setFilteredImages(newImages.filter(image => {
        const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }));

      // Update all affected images' order values in Firebase
      const updatePromises = newImages.map((image, index) => 
        updateDoc(doc(db, 'gallery_images', image.id), { 
          order: index,
          updatedAt: new Date()
        })
      );

      await Promise.all(updatePromises);
      
      showAlert('success', 'Images reordered successfully!');
    } catch (error) {
      console.error('Error reordering images:', error);
      showAlert('error', 'Failed to reorder images');
      // Reload images to revert optimistic update
      loadImages();
    } finally {
      setIsReordering(false);
    }
  };

  // Reset order to original (by creation date)
  const resetOrder = async () => {
    if (!confirm('Reset all images to their original order? This cannot be undone.')) {
      return;
    }

    setIsReordering(true);
    try {
      // Sort by creation date and update order
      const sortedImages = [...images].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      
      const updatePromises = sortedImages.map((image, index) => 
        updateDoc(doc(db, 'gallery_images', image.id), { 
          order: index,
          updatedAt: new Date()
        })
      );

      await Promise.all(updatePromises);
      
      showAlert('success', 'Image order reset to original!');
      loadImages();
    } catch (error) {
      console.error('Error resetting order:', error);
      showAlert('error', 'Failed to reset image order');
    } finally {
      setIsReordering(false);
    }
  };

  if (!canManageGallery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don&apos;t have permission to manage the gallery.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Alert */}
      {alert && (
        <div className="mb-6">
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Camera className="h-8 w-8" />
            Gallery Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage public gallery images and content. Total: {images.length} images
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/gallery" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Gallery
            </a>
          </Button>
          <Button 
            variant="outline" 
            onClick={resetOrder}
            disabled={isReordering}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Order
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Image title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Image description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    />
                    <label htmlFor="isPublic" className="text-sm">Make public</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isHero"
                      checked={formData.isHero}
                      onChange={(e) => setFormData(prev => ({ ...prev, isHero: e.target.checked }))}
                    />
                    <label htmlFor="isHero" className="text-sm">Set as hero image gallery</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isLandingHero"
                      checked={formData.isLandingHero}
                      onChange={(e) => setFormData(prev => ({ ...prev, isLandingHero: e.target.checked }))}
                    />
                    <label htmlFor="isLandingHero" className="text-sm">Set as hero image landing page</label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Select Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="w-full mt-1"
                    disabled={uploading}
                  />
                </div>
                {uploading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drag & Drop Instructions */}
      {filteredImages.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <GripVertical className="inline h-4 w-4 mr-1" />
            Drag images by the grip handle to reorder them. Changes will be reflected on the public gallery page.
            {isReordering && <span className="ml-2 text-primary">Updating order...</span>}
          </p>
        </div>
      )}

      {/* Drag & Drop Images Grid */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={filteredImages.map(img => img.id)} 
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image, index) => (
              <SortableImageCard
                key={image.id}
                image={image}
                index={index}
                onEdit={setEditingImage}
                onDelete={handleDeleteImage}
                onToggleHero={handleToggleHero}
                onToggleLandingHero={handleToggleLandingHero}
                onTogglePrivacy={handleTogglePrivacy}
                onViewImage={handleViewImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground">Upload your first image or adjust your search criteria</p>
        </div>
      )}

      {/* Edit Dialog */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingImage.title}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={editingImage.category} 
                  onValueChange={(value) => setEditingImage(prev => prev ? { ...prev, category: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingImage.description}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  value={editingImage.tags.join(', ')}
                  onChange={(e) => setEditingImage(prev => prev ? { 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={editingImage.isPublic}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, isPublic: e.target.checked } : null)}
                  />
                  <label htmlFor="editIsPublic" className="text-sm">Make public</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsHero"
                    checked={editingImage.isHero || false}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, isHero: e.target.checked } : null)}
                  />
                  <label htmlFor="editIsHero" className="text-sm">Set as hero image</label>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setEditingImage(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdateImage(editingImage.id, editingImage)}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Viewer Modal */}
      {viewerOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={handleCloseViewer}
            className="absolute top-4 right-4 z-60 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <Image
              src={filteredImages[currentImageIndex]?.src || ''}
              alt={filteredImages[currentImageIndex]?.title || ''}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{filteredImages[currentImageIndex]?.title}</h3>
                <p className="text-sm text-gray-300">{filteredImages[currentImageIndex]?.description}</p>
              </div>
              <div className="text-right text-sm text-gray-300">
                <div>{currentImageIndex + 1} of {filteredImages.length}</div>
                {filteredImages[currentImageIndex]?.width && filteredImages[currentImageIndex]?.height && (
                  <div>
                    {filteredImages[currentImageIndex].width} × {filteredImages[currentImageIndex].height}
                    ({filteredImages[currentImageIndex].aspectRatio})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Keyboard Hints */}
          <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-2 text-white text-xs">
            <div>← → Navigate</div>
            <div>ESC Close</div>
          </div>
        </div>
      )}
    </div>
  );
}
