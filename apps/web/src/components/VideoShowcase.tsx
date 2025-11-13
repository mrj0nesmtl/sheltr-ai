'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Loader2 } from 'lucide-react';

interface VideoShowcaseProps {
  videoTitle: string;
  title?: string;
  description?: string;
  className?: string;
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  src: string;
  type: string;
  tags: string[];
  thumbnailUrl?: string;
}

export function VideoShowcase({ 
  videoTitle, 
  title = "Video Showcase",
  description,
  className = "" 
}: VideoShowcaseProps) {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        const videosRef = collection(db, 'gallery_images');
        const q = query(
          videosRef,
          where('title', '==', videoTitle),
          where('mediaType', '==', 'video')
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError(`Video "${videoTitle}" not found in gallery`);
          setLoading(false);
          return;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        const videoData = {
          id: doc.id,
          title: data.title || videoTitle,
          description: data.description || '',
          src: data.src || '',
          type: data.type || 'video/mp4',
          tags: data.tags || [],
          thumbnailUrl: data.thumbnailUrl,
        };
        
        setVideo(videoData);

        console.log(`✅ Loaded video: ${videoTitle}`);
        console.log('Video data:', videoData);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoTitle]);

  // Preload thumbnail when video data is available
  useEffect(() => {
    if (video?.thumbnailUrl) {
      const img = new Image();
      img.onload = () => {
        setThumbnailLoaded(true);
        console.log('✅ Thumbnail loaded successfully');
      };
      img.onerror = () => {
        console.error('❌ Failed to load thumbnail:', video.thumbnailUrl);
        setThumbnailLoaded(false);
      };
      img.src = video.thumbnailUrl;
    }
  }, [video?.thumbnailUrl]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading video...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !video) {
    return (
      <Card className={`border-red-200 dark:border-red-900 ${className}`}>
        <CardContent className="py-12">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="font-medium">{error || 'Video not found'}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Looking for: "{videoTitle}"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-0">
        {/* Video Player */}
        <div className="relative aspect-video bg-black group">
          {/* Show loading state if thumbnail hasn't loaded yet */}
          {video.thumbnailUrl && !thumbnailLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          
          <video
            controls
            className="w-full h-full"
            poster={thumbnailLoaded && video.thumbnailUrl ? video.thumbnailUrl : undefined}
            preload="metadata"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error('Video playback error:', e);
              console.error('Video src:', video.src);
              console.error('Video type:', video.type);
            }}
            onLoadedData={() => {
              console.log('✅ Video loaded successfully');
            }}
          >
            <source src={video.src} type={video.type} />
            Your browser does not support the video tag.
          </video>
          
          {/* Play Overlay (shows before playing) */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-10 w-10 text-black ml-1" />
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6 space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{video.title}</h3>
            {video.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {video.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

