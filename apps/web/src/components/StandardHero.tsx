/**
 * StandardHero Component
 * 
 * Standardized hero section for all public pages with:
 * - Consistent height (80vh min)
 * - Beautiful gradient overlay for readability
 * - Smooth fade-out effect at bottom
 * - Dynamic hero image from gallery
 * - Responsive design
 */

import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface StandardHeroProps {
  /** Hero image URL from useHeroImage hook */
  imageUrl: string;
  /** Optional badge text (e.g., "BLOCKCHAIN SECURED", "Future Release") */
  badgeText?: string;
  /** Badge variant */
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
  /** Badge className for custom styling */
  badgeClassName?: string;
  /** Main title (can include JSX for colored spans) */
  title: ReactNode;
  /** Subtitle/description */
  subtitle?: string;
  /** Optional CTA buttons or additional content */
  children?: ReactNode;
  /** Custom gradient overlay (defaults to elegant dark gradient) */
  gradientOverlay?: string;
}

export function StandardHero({
  imageUrl,
  badgeText,
  badgeVariant = 'secondary',
  badgeClassName = 'bg-white/20 text-white border-white/30 backdrop-blur-sm',
  title,
  subtitle,
  children,
  gradientOverlay
}: StandardHeroProps) {
  // Default gradient: dark at top, fades to transparent at bottom for smooth blend
  const defaultGradient = 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)';
  
  return (
    <section 
      className="relative min-h-[80vh] flex items-center py-24"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient Overlay with smooth fade-out */}
      <div 
        className="absolute inset-0"
        style={{
          background: gradientOverlay || defaultGradient
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Optional Badge */}
          {badgeText && (
            <Badge 
              variant={badgeVariant} 
              className={`mb-6 ${badgeClassName}`}
            >
              {badgeText}
            </Badge>
          )}
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {/* Optional Children (CTAs, buttons, etc.) */}
          {children}
        </div>
      </div>
    </section>
  );
}

