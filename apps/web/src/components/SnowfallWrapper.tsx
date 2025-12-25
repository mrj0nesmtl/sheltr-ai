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

  // Avoid hydration mismatch and load initial state
  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved snow preference
    const savedSnowPref = localStorage.getItem('sheltr-snow-enabled');
    if (savedSnowPref === 'true') {
      setSnowEnabled(true);
    }
  }, []);

  // Listen for snow toggle events from SnowToggle component
  useEffect(() => {
    const handleSnowToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ enabled: boolean }>;
      console.log('❄️ SnowfallWrapper received toggle event:', customEvent.detail.enabled);
      setSnowEnabled(customEvent.detail.enabled);
    };

    window.addEventListener('snow-toggle', handleSnowToggle);
    
    return () => {
      window.removeEventListener('snow-toggle', handleSnowToggle);
    };
  }, []); // Empty dependency array - listener stays consistent

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
