'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '@/lib/firebase';

interface BlogImageUploadProps {
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

export default function BlogImageUpload({
  onImageUploaded,
  onImageRemoved,
  currentImageUrl,
  disabled = false
}: BlogImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const storage = getStorage(app);
      const timestamp = Date.now();
      const filename = `blog-images/${timestamp}-${file.name}`;
      const storageRef = ref(storage, filename);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setUploadProgress(100);
      onImageUploaded(downloadURL);
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    onImageRemoved();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Featured Image</label>
        {currentImageUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          <img
            src={currentImageUrl}
            alt="Featured image preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={triggerFileSelect}
              disabled={disabled || isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!currentImageUrl && (
        <div
          onClick={triggerFileSelect}
          className={`
            relative border-2 border-dashed border-gray-300 dark:border-gray-600 
            rounded-lg p-8 text-center cursor-pointer transition-colors
            hover:border-gray-400 dark:hover:border-gray-500
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            ${isUploading ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-600' : ''}
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <ImageIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Click to upload featured image'}
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WebP up to 5MB
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
