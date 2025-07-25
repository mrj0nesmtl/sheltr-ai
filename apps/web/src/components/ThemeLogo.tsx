'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeLogoProps {
  className?: string;
  alt?: string;
}

export default function ThemeLogo({ className = "h-6 w-auto", alt = "SHELTR-AI" }: ThemeLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder while mounting to avoid hydration mismatch
    return <div className={className} />;
  }

  // Use the appropriate logo based on the resolved theme
  const logoSrc = (resolvedTheme === 'dark') ? '/logo.svg' : '/logo-black.svg';

  return (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={`${className} hover:opacity-80 transition-opacity`} 
    />
  );
} 