'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import ReactMarkdown from 'react-markdown';

// Generate static params for shelter research documents
export async function generateStaticParams() {
  return [
    { slug: 'general-research' },
    { slug: 'shelters-state-by-state' },
    { slug: 'top-homeless-shelters-canada' },
    { slug: 'unique-shelter-programs' },
  ];
}

const documentMetadata: Record<string, { title: string; description: string; filename: string }> = {
  'general-research': {
    title: 'General Research',
    description: 'Comprehensive overview of homeless shelter systems, HMIS implementation, and innovative programs',
    filename: 'general-research.md'
  },
  'shelters-state-by-state': {
    title: 'Shelters State by State',
    description: 'Detailed analysis of homeless shelter infrastructure across all 50 US states',
    filename: 'shelters_state_by_state.md'
  },
  'top-homeless-shelters-canada': {
    title: 'Top Homeless Shelters Canada',
    description: 'Leading homeless shelters and innovative programs across Canadian provinces',
    filename: 'top_homeless_shelters_canada.md'
  },
  'unique-shelter-programs': {
    title: 'Unique Shelter Programs',
    description: 'Innovative and effective homeless shelter programs from around North America',
    filename: 'unique_shelter_programs_ for_homelessness.md'
  }
};

export default function IRShelterResearchDocumentPage({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metadata = documentMetadata[params.slug];

  useEffect(() => {
    const loadDocument = async () => {
      if (!metadata) {
        setError('Document not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/portal/founders-only/shelter-research/shelter-data/${metadata.filename}`);
        if (!response.ok) {
          throw new Error('Failed to load document');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document content');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [params.slug, metadata]);

  if (!metadata) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <Link href="/ir/shelter-research">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/ir/dataroom" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
              <Link href="/ir/shelter-research">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Research Hub
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <FileText className="h-12 w-12 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">{metadata.title}</h1>
                  <Badge className="bg-blue-500 text-white text-sm">RESEARCH DOCUMENT</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  {metadata.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading document...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/ir/shelter-research">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Research Hub
                  </Button>
                </Link>
              </div>
            )}

            {!loading && !error && content && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

