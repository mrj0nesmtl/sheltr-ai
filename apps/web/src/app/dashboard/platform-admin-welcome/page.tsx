'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Sparkles } from 'lucide-react';

export default function PlatformAdminWelcomePage() {
  const [welcomeContent, setWelcomeContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the markdown content
    const loadWelcomeContent = async () => {
      try {
        const response = await fetch('/docs/platform-admin/welcome-letter.md');
        if (response.ok) {
          const content = await response.text();
          setWelcomeContent(content);
        } else {
          // Fallback content if file is not accessible
          setWelcomeContent(getFallbackContent());
        }
      } catch (error) {
        console.error('Error loading welcome content:', error);
        setWelcomeContent(getFallbackContent());
      } finally {
        setIsLoading(false);
      }
    };

    loadWelcomeContent();
  }, []);

  const getFallbackContent = () => `
# Welcome to SHELTR-AI Platform Administration Team!

Hey there, amazing humans!

Welcome to the SHELTR platform and your administrator dashboard. We're excited to have you as part of the team!

## Getting Started

1. **Explore the Platform Administrator Guide** - Check out the comprehensive guide in your sidebar
2. **Try the MCP Integration** - Experience our revolutionary conversational AI
3. **Test Everything** - Break things, find issues, and help us improve
4. **Provide Feedback** - Your insights are invaluable for our development

## Key Features to Test

- **Multi-tenant Architecture** - Manage multiple shelters and organizations
- **AI-Powered Insights** - Intelligent analytics and reporting
- **Real-time Data** - Live donation tracking and participant management
- **Security Features** - Role-based access and digital signatures

## Need Help?

If you have any questions or encounter issues, please don't hesitate to reach out. Your feedback is crucial for our success!

---

*This is your starting point for exploring SHELTR's platform administration features.*
`;

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for basic formatting
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-100">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-700 dark:text-gray-200">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-600 dark:text-gray-200">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-700 text-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      // Handle markdown links first
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
      // Handle standalone URLs (https://...)
      .replace(/(^|[^"])(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gim, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline break-all">$2</a>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 text-gray-600 dark:text-gray-200">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2 list-decimal text-gray-600 dark:text-gray-200">$1</li>')
      .replace(/\n\n/gim, '</p><p class="mb-4 text-gray-600 dark:text-gray-200">')
      .replace(/\n/gim, '<br />');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Administrator Welcome</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Your guide to getting started with SHELTR</p>
          </div>
          <Badge variant="outline" className="ml-auto bg-white text-red-600 border-red-300">
            Start
          </Badge>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Version Available
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/platform-guide" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Platform Guide
            </a>
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Welcome Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            <div 
              className="space-y-4 text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdown(welcomeContent).replace(/<p class="mb-4">/g, '<p class="mb-4 text-gray-600 dark:text-gray-200">').replace(/<\/p>$/, '</p>')
              }} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('/dashboard/platform-guide', '_blank')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ExternalLink className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Platform Guide</h3>
                <p className="text-sm text-gray-600">Complete administrator documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('/dashboard/chatbots', '_blank')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Try MCP AI</h3>
                <p className="text-sm text-gray-600">Experience conversational management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('/dashboard/analytics', '_blank')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ExternalLink className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Platform Analytics</h3>
                <p className="text-sm text-gray-600">Explore data and insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
