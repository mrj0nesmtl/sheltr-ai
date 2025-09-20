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
  RotateCcw
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
  verticalListSortingStrategy,
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
  isHero: boolean;
  order: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const categories = ['pods', 'mobi', 'drones', 'technology', 'fabrication', 'concepts'];

// Sortable Image Card Component
interface SortableImageCardProps {
  image: GalleryImage;
  index: number;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onToggleHero: (image: GalleryImage) => void;
}

function SortableImageCard({ image, index, onEdit, onDelete, onToggleHero }: SortableImageCardProps) {
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
      <div className="relative aspect-square">
        <Image
          src={image.src}
          alt={image.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant={image.isPublic ? "default" : "secondary"} className="text-xs">
            {image.isPublic ? "Public" : "Private"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {image.category}
          </Badge>
          {image.isHero && (
            <Badge variant="default" className="text-xs bg-yellow-500 hover:bg-yellow-600">
              HERO
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
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id={`hero-${image.id}`}
            checked={image.isHero || false}
            onChange={() => onToggleHero(image)}
            className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor={`hero-${image.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Hero Image
          </label>
        </div>
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
    isHero: false
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

      // Save to Firestore
      const imageData = {
        src: downloadURL,
        title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
        category: formData.category,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: new Date().getFullYear().toString(),
        isPublic: formData.isPublic,
        isHero: formData.isHero,
        order: images.length,
        uploadedBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'gallery_images'), imageData);
      
      showAlert('success', 'Image uploaded successfully!');
      setUploadDialogOpen(false);
      setFormData({ title: '', category: '', description: '', tags: '', isPublic: true, isHero: false });
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
                    <label htmlFor="isHero" className="text-sm">Set as hero image</label>
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
    </div>
  );
}
