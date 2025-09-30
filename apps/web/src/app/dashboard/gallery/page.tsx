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

interface GalleryMedia {
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
  isFoundersGallery: boolean; // Show in founders portal gallery
  order: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Media metadata
  width?: number;
  height?: number;
  aspectRatio?: string;
  fileSize?: number;
  // Video-specific fields
  mediaType: 'image' | 'video';
  duration?: number; // Video duration in seconds
  thumbnailUrl?: string; // Generated thumbnail for videos
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

// Helper function to extract video metadata
const extractVideoMetadata = (file: File): Promise<{ width: number; height: number; aspectRatio: string; duration: number; thumbnailUrl: string }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const duration = video.duration;
      const ratio = width / height;
      
      // Calculate aspect ratio
      let aspectRatio = `${width}:${height}`;
      if (Math.abs(ratio - 16/9) < 0.01) aspectRatio = '16:9';
      else if (Math.abs(ratio - 4/3) < 0.01) aspectRatio = '4:3';
      else if (Math.abs(ratio - 9/16) < 0.01) aspectRatio = '9:16';
      else aspectRatio = `${Math.round(ratio * 100) / 100}:1`;
      
      // Generate thumbnail
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      video.currentTime = Math.min(2, duration / 2); // Seek to 2 seconds or middle
      
      video.onseeked = () => {
        ctx?.drawImage(video, 0, 0, width, height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve({ width, height, aspectRatio, duration, thumbnailUrl });
      };
    };
    
    video.onerror = () => resolve({ 
      width: 0, 
      height: 0, 
      aspectRatio: 'Unknown', 
      duration: 0, 
      thumbnailUrl: '' 
    });
    
    video.src = URL.createObjectURL(file);
  });
};

// Sortable Media Card Component
interface SortableMediaCardProps {
  image: GalleryMedia;
  index: number;
  onEdit: (image: GalleryMedia) => void;
  onDelete: (image: GalleryMedia) => void;
  onViewImage: (index: number) => void;
}

function SortableMediaCard({ image, index, onEdit, onDelete, onViewImage }: SortableMediaCardProps) {
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
          src={image.mediaType === 'video' && image.thumbnailUrl ? image.thumbnailUrl : image.src}
          alt={image.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Video play indicator */}
        {image.mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        
        {/* Duration badge for videos */}
        {image.mediaType === 'video' && image.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {Math.floor(image.duration / 60)}:{(image.duration % 60).toFixed(0).padStart(2, '0')}
          </div>
        )}
        
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
  const [images, setImages] = useState<GalleryMedia[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryMedia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryMedia | null>(null);
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
    isLandingHero: false,
    isFoundersGallery: false
  });

  // File selection state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{
    type: 'image' | 'video' | null;
    size: string;
    dimensions?: string;
    duration?: string;
  }>({ type: null, size: '' });

  // Helper function to show alerts
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto dismiss after 5 seconds
  };

  // Handle file selection and metadata extraction
  const handleFileSelection = async (file: File) => {
    setSelectedFile(file);
    
    // Auto-populate title from filename (remove extension)
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setFormData(prev => ({ ...prev, title: fileName }));
    
    // Determine file type
    const isVideo = file.type.startsWith('video/');
    const fileType = isVideo ? 'video' : 'image';
    
    // Format file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeString = `${sizeInMB} MB`;
    
    // Extract metadata based on file type
    let dimensions = '';
    let duration = '';
    
    try {
      if (isVideo) {
        const videoMetadata = await extractVideoMetadata(file);
        dimensions = `${videoMetadata.width} × ${videoMetadata.height}`;
        duration = `${Math.floor(videoMetadata.duration / 60)}:${(videoMetadata.duration % 60).toFixed(0).padStart(2, '0')}`;
      } else {
        const imageMetadata = await extractImageMetadata(file);
        dimensions = `${imageMetadata.width} × ${imageMetadata.height}`;
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
    }
    
    setFileMetadata({
      type: fileType,
      size: sizeString,
      dimensions,
      duration
    });
  };

  // Reset form function
  const resetForm = () => {
    setFormData({ 
      title: '', 
      category: '', 
      description: '', 
      tags: '', 
      isPublic: true, 
      isPrivate: false, 
      isHero: false, 
      isLandingHero: false,
      isFoundersGallery: false
    });
    setSelectedFile(null);
    setFileMetadata({ type: null, size: '' });
  };

  // Check permissions
  const canManageGallery = hasRole('super_admin') || hasRole('platform_admin');

  // Load media from Firestore
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
  const handleFileUpload = async (file?: File) => {
    const fileToUpload = file || selectedFile;
    if (!fileToUpload || !user) return;

    setUploading(true);
    try {
      // Determine media type
      const isVideo = fileToUpload.type.startsWith('video/');
      const mediaType = isVideo ? 'video' : 'image';
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `gallery/${timestamp}_${fileToUpload.name}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, fileToUpload);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Extract metadata based on file type
      let metadata;
      let thumbnailUrl = '';
      let duration = 0;
      
      if (isVideo) {
        const videoMetadata = await extractVideoMetadata(fileToUpload);
        metadata = {
          width: videoMetadata.width,
          height: videoMetadata.height,
          aspectRatio: videoMetadata.aspectRatio
        };
        duration = videoMetadata.duration;
        
        // Upload thumbnail if generated
        if (videoMetadata.thumbnailUrl) {
          const thumbnailBlob = await fetch(videoMetadata.thumbnailUrl).then(r => r.blob());
          const thumbnailRef = ref(storage, `gallery/thumbnails/${timestamp}_thumb.jpg`);
          const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnailBlob);
          thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);
        }
      } else {
        metadata = await extractImageMetadata(fileToUpload);
      }

      // Save to Firestore
      const mediaData = {
        src: downloadURL,
        title: formData.title || fileToUpload.name.replace(/\.[^/.]+$/, ""),
        category: formData.category,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: new Date().getFullYear().toString(),
        isPublic: formData.isPublic,
        isPrivate: formData.isPrivate,
        isHero: formData.isHero,
        isLandingHero: formData.isLandingHero,
        isFoundersGallery: formData.isFoundersGallery,
        order: images.length,
        uploadedBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Media metadata
        mediaType,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.aspectRatio,
        fileSize: fileToUpload.size,
        // Video-specific fields
        ...(isVideo && {
          duration,
          thumbnailUrl
        })
      };

      await addDoc(collection(db, 'gallery_images'), mediaData);
      
      showAlert('success', `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
      setUploadDialogOpen(false);
      resetForm();
      loadImages();
    } catch (error) {
      console.error('Error uploading media:', error);
      showAlert('error', 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  // Handle media update
  const handleUpdateImage = async (imageId: string, updates: Partial<GalleryMedia>) => {
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
            Manage public gallery media and content. Total: {images.length} items
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
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload New Media</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* File Selection - Top Priority */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Media File</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    {!selectedFile ? (
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Plus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <Button
                            type="button"
                            onClick={() => document.getElementById('file-input')?.click()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Choose File
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Images or Videos up to 100MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          {fileMetadata.type === 'video' ? (
                            <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          ) : (
                            <Camera className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{selectedFile.name}</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Size: {fileMetadata.size}</p>
                            {fileMetadata.dimensions && <p>Dimensions: {fileMetadata.dimensions}</p>}
                            {fileMetadata.duration && <p>Duration: {fileMetadata.duration}</p>}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFile(null);
                              setFileMetadata({ type: null, size: '' });
                              setFormData(prev => ({ ...prev, title: '' }));
                            }}
                            className="mt-2"
                          >
                            Change File
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelection(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields - Only show when file is selected */}
                {selectedFile && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Media title"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
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
                        placeholder="Media description"
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

                    {/* Video-specific fields */}
                    {fileMetadata.type === 'video' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Video Settings</h4>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          <p>• Thumbnail will be auto-generated at 2 seconds</p>
                          <p>• Duration: {fileMetadata.duration}</p>
                          <p>• Resolution: {fileMetadata.dimensions}</p>
                        </div>
                      </div>
                    )}
                    
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
                          id="isFoundersGallery"
                          checked={formData.isFoundersGallery}
                          onChange={(e) => setFormData(prev => ({ ...prev, isFoundersGallery: e.target.checked }))}
                        />
                        <label htmlFor="isFoundersGallery" className="text-sm">Share to Founders Portal</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isHero"
                          checked={formData.isHero}
                          onChange={(e) => setFormData(prev => ({ ...prev, isHero: e.target.checked }))}
                        />
                        <label htmlFor="isHero" className="text-sm">Set as hero media gallery</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isLandingHero"
                          checked={formData.isLandingHero}
                          onChange={(e) => setFormData(prev => ({ ...prev, isLandingHero: e.target.checked }))}
                        />
                        <label htmlFor="isLandingHero" className="text-sm">Set as hero media landing page</label>
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleFileUpload()}
                        disabled={uploading || !formData.title || !formData.category}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Upload {fileMetadata.type === 'video' ? 'Video' : 'Image'}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setUploadDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
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
            placeholder="Search media..."
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
              <SortableMediaCard
                key={image.id}
                image={image}
                index={index}
                onEdit={setEditingImage}
                onDelete={handleDeleteImage}
                onViewImage={handleViewImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No media found</h3>
          <p className="text-muted-foreground">Upload your first media or adjust your search criteria</p>
        </div>
      )}

      {/* Edit Dialog */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Media</DialogTitle>
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
                  <label htmlFor="editIsHero" className="text-sm">Set as hero image for gallery</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsLandingHero"
                    checked={editingImage.isLandingHero || false}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, isLandingHero: e.target.checked } : null)}
                  />
                  <label htmlFor="editIsLandingHero" className="text-sm">Set as hero image for landing page</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsPrivate"
                    checked={editingImage.isPrivate || false}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, isPrivate: e.target.checked } : null)}
                  />
                  <label htmlFor="editIsPrivate" className="text-sm">Hide from public gallery</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsFoundersGallery"
                    checked={editingImage.isFoundersGallery || false}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, isFoundersGallery: e.target.checked } : null)}
                  />
                  <label htmlFor="editIsFoundersGallery" className="text-sm">Share to Founders Portal</label>
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

      {/* Media Viewer Modal */}
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

          {/* Media Content */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {filteredImages[currentImageIndex]?.mediaType === 'video' ? (
              <video
                src={filteredImages[currentImageIndex]?.src || ''}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ maxHeight: 'calc(90vh - 120px)' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={filteredImages[currentImageIndex]?.src || ''}
                alt={filteredImages[currentImageIndex]?.title || ''}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            )}
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{filteredImages[currentImageIndex]?.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{filteredImages[currentImageIndex]?.description}</p>
                
                {/* Enhanced Metadata Section */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-gray-400">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="text-white capitalize">{filteredImages[currentImageIndex]?.mediaType || 'Image'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <div className="text-white">{filteredImages[currentImageIndex]?.category || 'N/A'}</div>
                  </div>
                  {filteredImages[currentImageIndex]?.width && filteredImages[currentImageIndex]?.height && (
                    <div>
                      <span className="text-gray-500">Dimensions:</span>
                      <div className="text-white">{filteredImages[currentImageIndex].width} × {filteredImages[currentImageIndex].height}</div>
                    </div>
                  )}
                  {filteredImages[currentImageIndex]?.mediaType === 'video' && filteredImages[currentImageIndex]?.duration && (
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="text-white">
                        {Math.floor(filteredImages[currentImageIndex].duration! / 60)}:{(filteredImages[currentImageIndex].duration! % 60).toFixed(0).padStart(2, '0')}
                      </div>
                    </div>
                  )}
                  {filteredImages[currentImageIndex]?.aspectRatio && (
                    <div>
                      <span className="text-gray-500">Aspect Ratio:</span>
                      <div className="text-white">{filteredImages[currentImageIndex].aspectRatio}</div>
                    </div>
                  )}
                  {filteredImages[currentImageIndex]?.fileSize && (
                    <div>
                      <span className="text-gray-500">File Size:</span>
                      <div className="text-white">{(filteredImages[currentImageIndex].fileSize! / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {filteredImages[currentImageIndex]?.tags && filteredImages[currentImageIndex].tags.length > 0 && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {filteredImages[currentImageIndex].tags.map((tag, idx) => (
                        <span key={idx} className="bg-white/20 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right text-sm text-gray-300 ml-4">
                <div className="text-lg font-semibold">{currentImageIndex + 1} of {filteredImages.length}</div>
                <div className="text-xs mt-1">
                  {filteredImages[currentImageIndex]?.isHero && <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded mr-1">Gallery Hero</span>}
                  {filteredImages[currentImageIndex]?.isLandingHero && <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded mr-1">Landing Hero</span>}
                  {filteredImages[currentImageIndex]?.isPrivate && <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">Hidden</span>}
                </div>
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
