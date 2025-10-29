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

        setVideo({
          id: doc.id,
          title: data.title || videoTitle,
          description: data.description || '',
          src: data.src || '',
          type: data.type || 'video/mp4',
          tags: data.tags || [],
        });

        console.log(`✅ Loaded video: ${videoTitle}`);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoTitle]);

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
          <video
            controls
            className="w-full h-full"
            poster={video.src.replace(/\.[^/.]+$/, '') + '_thumbnail.jpg'} // Optional: if you have thumbnails
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

