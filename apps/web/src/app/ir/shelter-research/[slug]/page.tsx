import Link from 'next/link';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export default async function IRShelterResearchDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params as required by Next.js 15
  const { slug } = await params;
  const metadata = documentMetadata[slug];

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

  // Load markdown file from the app directory at build time
  let content = '';
  let error = null;
  
  try {
    // process.cwd() in Next.js points to apps/web, so start from src/
    const filePath = path.join(process.cwd(), 'src', 'app', 'portal', 'founders-only', 'shelter-research', 'shelter-data', metadata.filename);
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Error loading document:', err);
    error = 'Failed to load document content';
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
          <div className="max-w-5xl mx-auto">
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

            {!error && content && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                        h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                        h4: ({ ...props }) => <h4 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                        p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                        ul: ({ ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        ol: ({ ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        li: ({ ...props }) => <li className="ml-4" {...props} />,
                        a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" {...props} />,
                        code: ({ inline, ...props }: any) =>
                          inline ? (
                            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm" {...props} />
                          ) : (
                            <code className="block bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto" {...props} />
                          ),
                        table: ({ ...props }) => (
                          <div className="overflow-x-auto mb-4">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                          </div>
                        ),
                        th: ({ ...props }) => <th className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold text-left" {...props} />,
                        td: ({ ...props }) => <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700" {...props} />,
                        blockquote: ({ ...props }) => (
                          <blockquote className="border-l-4 border-blue-600 pl-4 italic my-4 text-muted-foreground" {...props} />
                        ),
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

