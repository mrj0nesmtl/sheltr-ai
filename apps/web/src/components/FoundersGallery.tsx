'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface FoundersGalleryMedia {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  mediaType: 'image' | 'video';
  duration?: number;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  fileSize?: number;
  createdAt: Date;
  uploadedBy: string;
}

export default function FoundersGallery() {
  const [media, setMedia] = useState<FoundersGalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Load founders gallery media
  useEffect(() => {
    const loadFoundersMedia = async () => {
      try {
        // Simple query first - we'll sort in memory to avoid index issues
        const q = query(
          collection(db, 'gallery_images'),
          where('isFoundersGallery', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const mediaData: FoundersGalleryMedia[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          mediaData.push({
            id: doc.id,
            src: data.src,
            title: data.title,
            category: data.category,
            description: data.description,
            tags: data.tags || [],
            mediaType: data.mediaType || 'image',
            duration: data.duration,
            thumbnailUrl: data.thumbnailUrl,
            width: data.width,
            height: data.height,
            aspectRatio: data.aspectRatio,
            fileSize: data.fileSize,
            createdAt: data.createdAt?.toDate() || new Date(),
            uploadedBy: data.uploadedBy
          });
        });
        
        // Sort by creation date (newest first)
        mediaData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        console.log('Founders gallery loaded:', mediaData.length, 'items');
        setMedia(mediaData);
      } catch (error) {
        console.error('Error loading founders gallery:', error);
        console.error('Error details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFoundersMedia();
  }, []);

  const openViewer = (index: number) => {
    setSelectedMedia(index);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedMedia(null);
  };

  const nextMedia = () => {
    if (selectedMedia !== null && selectedMedia < media.length - 1) {
      setSelectedMedia(selectedMedia + 1);
    }
  };

  const prevMedia = () => {
    if (selectedMedia !== null && selectedMedia > 0) {
      setSelectedMedia(selectedMedia - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewerOpen) {
        switch (event.key) {
          case 'Escape':
            closeViewer();
            break;
          case 'ArrowLeft':
            prevMedia();
            break;
          case 'ArrowRight':
            nextMedia();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewerOpen, selectedMedia]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-3 text-muted-foreground">Loading founders gallery...</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Media Shared Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-md">
            Media marked as "Share to Founders Portal" in the gallery management will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item, index) => (
          <Card 
            key={item.id} 
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
            onClick={() => openViewer(index)}
          >
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
              {item.mediaType === 'video' ? (
                <>
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {/* Video Duration Badge */}
                  {item.duration && (
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toFixed(0).padStart(2, '0')}
                    </Badge>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="h-6 w-6 text-gray-800" />
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}
              
              {/* Media Type Badge */}
              <Badge 
                className={`absolute top-2 left-2 ${
                  item.mediaType === 'video' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}
              >
                {item.mediaType === 'video' ? 'Video' : 'Image'}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.createdAt.toLocaleDateString()}
                </span>
              </div>
              
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Viewer */}
      {viewerOpen && selectedMedia !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 z-60 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          {media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                disabled={selectedMedia === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextMedia}
                disabled={selectedMedia === media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Media Content */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {media[selectedMedia]?.mediaType === 'video' ? (
              <video
                src={media[selectedMedia]?.src || ''}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ maxHeight: 'calc(90vh - 120px)' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={media[selectedMedia]?.src || ''}
                alt={media[selectedMedia]?.title || ''}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            )}
          </div>

          {/* Media Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{media[selectedMedia]?.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{media[selectedMedia]?.description}</p>
                
                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="text-white capitalize">{media[selectedMedia]?.mediaType}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <div className="text-white">{media[selectedMedia]?.category}</div>
                  </div>
                  {media[selectedMedia]?.width && media[selectedMedia]?.height && (
                    <div>
                      <span className="text-gray-500">Dimensions:</span>
                      <div className="text-white">{media[selectedMedia].width} × {media[selectedMedia].height}</div>
                    </div>
                  )}
                  {media[selectedMedia]?.mediaType === 'video' && media[selectedMedia]?.duration && (
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="text-white">
                        {Math.floor(media[selectedMedia].duration! / 60)}:{(media[selectedMedia].duration! % 60).toFixed(0).padStart(2, '0')}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {media[selectedMedia]?.tags && media[selectedMedia].tags.length > 0 && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {media[selectedMedia].tags.map((tag, idx) => (
                        <span key={idx} className="bg-white/20 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right text-sm text-gray-300 ml-4">
                <div className="text-lg font-semibold">{selectedMedia + 1} of {media.length}</div>
                <div className="text-xs mt-1">
                  Shared: {media[selectedMedia]?.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
