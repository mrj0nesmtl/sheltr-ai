'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

// Initialize mermaid once at module level
let mermaidInitialized = false;

export default function Mermaid({ chart, className = '' }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [id] = useState(`mermaid-${Math.random().toString(36).substring(7)}-${Date.now()}`);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Initialize mermaid only once
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false, // Important: prevent auto-start
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#0f172a',
          primaryColor: '#3b82f6',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#475569',
          lineColor: '#64748b',
          secondaryColor: '#8b5cf6',
          tertiaryColor: '#10b981',
          fontSize: '14px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
        securityLevel: 'loose',
      });
      mermaidInitialized = true;
    }

    const renderDiagram = async () => {
      if (ref.current && chart && !isRendered) {
        try {
          // Clear previous content
          ref.current.innerHTML = '';
          
          // Generate a unique ID for each render
          const renderId = `${id}-${Date.now()}`;
          
          // Render new diagram
          const { svg } = await mermaid.render(renderId, chart);
          
          if (ref.current) {
            ref.current.innerHTML = svg;
            setIsRendered(true);
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (ref.current) {
            ref.current.innerHTML = `
              <div class="bg-red-900/20 border border-red-500/50 rounded p-4 text-red-300">
                <strong>Diagram Rendering Error:</strong>
                <pre class="mt-2 text-xs overflow-auto">${error}</pre>
              </div>
            `;
          }
        }
      }
    };

    // Small delay to ensure DOM is ready when tab switches
    const timer = setTimeout(() => {
      setIsRendered(false); // Reset render state to force re-render
      renderDiagram();
    }, 100);

    return () => clearTimeout(timer);
  }, [chart, id, isRendered]);

  return (
    <div 
      ref={ref} 
      className={`mermaid-diagram ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    />
  );
}

