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
  ChevronUp,
  ChevronDown
} from 'lucide-react';
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
  order: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const categories = ['pods', 'mobi', 'drones', 'technology', 'fabrication', 'concepts'];

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

  // Form state for new/editing images
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    isPublic: true
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
        order: images.length,
        uploadedBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'gallery_images'), imageData);
      
      showAlert('success', 'Image uploaded successfully!');
      setUploadDialogOpen(false);
      setFormData({ title: '', category: '', description: '', tags: '', isPublic: true });
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

  // Handle reordering
  const handleReorder = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    try {
      const currentImage = images[currentIndex];
      const swapImage = images[newIndex];

      // Update order values
      await updateDoc(doc(db, 'gallery_images', currentImage.id), { order: swapImage.order });
      await updateDoc(doc(db, 'gallery_images', swapImage.id), { order: currentImage.order });

      showAlert('success', 'Image order updated!');
      loadImages();
    } catch (error) {
      console.error('Error reordering images:', error);
      showAlert('error', 'Failed to reorder images');
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
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <label htmlFor="isPublic" className="text-sm">Make public</label>
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

      {/* Images Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
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
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate mb-1">{image.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {image.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {image.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {image.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{image.tags.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReorder(image.id, 'up')}
                    disabled={images.findIndex(img => img.id === image.id) === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReorder(image.id, 'down')}
                    disabled={images.findIndex(img => img.id === image.id) === images.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingImage(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteImage(image)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsPublic"
                  checked={editingImage.isPublic}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, isPublic: e.target.checked } : null)}
                />
                <label htmlFor="editIsPublic" className="text-sm">Make public</label>
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
