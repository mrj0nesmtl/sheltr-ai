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
  }, []);

  const toggleSnow = () => {
    const newState = !snowEnabled;
    setSnowEnabled(newState);
    localStorage.setItem('sheltr-snow-enabled', String(newState));
  };

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

      {/* Floating Snow Toggle Button */}
      <button
        onClick={toggleSnow}
        className="fixed bottom-6 right-6 z-[10000] rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 active:scale-95"
        aria-label={snowEnabled ? 'Disable snow' : 'Enable snow'}
        title={snowEnabled ? 'Disable snow ❄️' : 'Enable snow ❄️'}
      >
        <div className="relative flex items-center justify-center">
          {snowEnabled ? (
            // Snowflake icon (enabled)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white animate-pulse"
            >
              <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5M2 12h20M7 7l5 5-5 5M17 17l-5-5-5 5" />
            </svg>
          ) : (
            // Snowflake icon (disabled)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white opacity-60"
            >
              <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5M2 12h20M7 7l5 5-5 5M17 17l-5-5-5 5" />
            </svg>
          )}
          
          {/* Festive badge */}
          {snowEnabled && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
            </span>
          )}
        </div>
      </button>

      {children}
    </>
  );
}
