'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// Dynamically import Snowfall to avoid SSR issues
const Snowfall = dynamic(() => import('react-snowfall'), {
  ssr: false,
  loading: () => null,
});

export function SnowfallWrapper({ children }: { children: React.ReactNode }) {
  const [snowEnabled, setSnowEnabled] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved snow preference
    const savedSnowPref = localStorage.getItem('sheltr-snow-enabled');
    if (savedSnowPref === 'true') {
      setSnowEnabled(true);
    }

    // Listen for snow toggle events from SnowToggle component
    const handleSnowToggle = (event: CustomEvent<{ enabled: boolean }>) => {
      setSnowEnabled(event.detail.enabled);
    };

    window.addEventListener('snow-toggle', handleSnowToggle as EventListener);
    
    return () => {
      window.removeEventListener('snow-toggle', handleSnowToggle as EventListener);
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {snowEnabled && (
        <Snowfall
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          snowflakeCount={200}
          color={theme === 'dark' ? '#ffffff' : '#b3d9ff'}
          radius={[0.5, 3.0]}
          speed={[0.5, 3.0]}
          wind={[-0.5, 2.0]}
        />
      )}

      {children}
    </>
  );
}
