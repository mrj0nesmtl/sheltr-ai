'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

export default function Mermaid({ chart, className = '' }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    // Initialize mermaid with dark theme
    mermaid.initialize({
      startOnLoad: true,
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

    const renderDiagram = async () => {
      if (ref.current && chart) {
        try {
          // Clear previous content
          ref.current.innerHTML = '';
          
          // Render new diagram
          const { svg } = await mermaid.render(idRef.current, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
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

    renderDiagram();
  }, [chart]);

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

