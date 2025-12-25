'use client';

import * as React from 'react';
import { Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SnowToggle() {
  const [snowEnabled, setSnowEnabled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
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
    
    // Dispatch custom event to notify SnowfallWrapper
    window.dispatchEvent(new CustomEvent('snow-toggle', { detail: { enabled: newState } }));
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0" disabled>
        <Snowflake className="h-[1.2rem] w-[1.2rem] opacity-50" />
        <span className="sr-only">Toggle snow</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSnow}
      className="h-8 w-8 px-0 relative"
      title={snowEnabled ? 'Disable snow ❄️' : 'Enable snow ❄️'}
    >
      <Snowflake 
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          snowEnabled 
            ? 'text-cyan-500 scale-110 rotate-12' 
            : 'text-muted-foreground scale-100 rotate-0'
        }`}
      />
      {snowEnabled && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
        </span>
      )}
      <span className="sr-only">{snowEnabled ? 'Disable snow' : 'Enable snow'}</span>
    </Button>
  );
}
