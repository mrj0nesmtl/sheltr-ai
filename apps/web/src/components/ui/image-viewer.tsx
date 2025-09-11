'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function ImageViewer({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  // Reset scale and rotation when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
    }
  }, [currentIndex, isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasMultipleImages && onPrevious) {
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (hasMultipleImages && onNext) {
            onNext();
          }
          break;
        case '+':
        case '=':
          setScale(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          setScale(prev => Math.max(prev - 0.25, 0.5));
          break;
        case 'r':
        case 'R':
          setRotation(prev => prev + 90);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasMultipleImages, onNext, onPrevious, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = currentImage.title || currentImage.alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          {currentImage.title && (
            <h3 className="text-white font-medium text-lg">
              {currentImage.title}
            </h3>
          )}
          {hasMultipleImages && (
            <span className="text-white/70 text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.max(prev - 0.25, 0.5));
            }}
            className="text-white hover:bg-white/20"
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-white text-sm min-w-[4rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.min(prev + 0.25, 3));
            }}
            className="text-white hover:bg-white/20"
            disabled={scale >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {/* Rotate */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setRotation(prev => prev + 90);
            }}
            className="text-white hover:bg-white/20"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {/* Download */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {/* Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {hasMultipleImages && onPrevious && (
        <Button
          variant="ghost"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}
      
      {hasMultipleImages && onNext && (
        <Button
          variant="ghost"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          disabled={currentIndex === images.length - 1}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Image Container */}
      <div 
        className="relative max-w-[90vw] max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center'
          }}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={1200}
            height={800}
            className="max-w-none max-h-none object-contain"
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              width: 'auto',
              height: 'auto'
            }}
            priority
          />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-white/70 text-sm">
          {currentImage.alt}
        </p>
        <p className="text-white/50 text-xs mt-1">
          Use arrow keys to navigate • + / - to zoom • R to rotate • ESC to close
        </p>
      </div>
    </div>
  );
}
