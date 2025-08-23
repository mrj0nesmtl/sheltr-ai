'use client';

import { ChevronRight, Home, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  className?: string;
}

export function Breadcrumb({ items, onNavigate, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {/* Home */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 hover:bg-muted"
        onClick={() => onNavigate('/')}
      >
        <Home className="h-4 w-4" />
      </Button>

      {items.length > 0 && <ChevronRight className="h-4 w-4" />}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 hover:bg-muted",
              index === items.length - 1 && "text-foreground font-medium"
            )}
            onClick={() => onNavigate(item.path)}
          >
            <div className="flex items-center gap-1.5">
              {item.icon || <Folder className="h-4 w-4" />}
              <span className="truncate max-w-[120px]">{item.label}</span>
            </div>
          </Button>

          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </nav>
  );
}

// Helper function to build breadcrumb from path
export function buildBreadcrumb(currentPath: string): BreadcrumbItem[] {
  if (!currentPath || currentPath === '/') return [];

  const folderNames: Record<string, string> = {
    '01-overview': '📋 Overview',
    '02-architecture': '🏗️ Architecture', 
    '03-api': '🔌 API',
    '04-development': '💻 Development',
    '05-deployment': '🚀 Deployment',
    '06-user-guides': '👥 User Guides',
    '07-reference': '📚 Reference',
    '08-integrations': '🔗 Integrations',
    '09-migration': '📦 Migration',
    '10-resources': '🎯 Resources'
  };

  const items: BreadcrumbItem[] = [];
  
  // If it's a folder path
  if (folderNames[currentPath]) {
    items.push({
      label: folderNames[currentPath],
      path: currentPath
    });
  }
  
  return items;
}
