'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft,
  Github,
  Eye,
  Calendar,
  Users,
  BookOpen,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';
import { docsHubService, type DocsHubDocument } from '@/services/docsHubService';

export default function DocPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [document, setDocument] = useState<DocsHubDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadDocument();
    }
  }, [slug]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      const doc = await docsHubService.getDocumentBySlug(slug);
      setDocument(doc);
    } catch (err: any) {
      console.error('Failed to load document:', err);
      if (err.message === 'Document not found') {
        setError('Document not found');
      } else {
        setError('Failed to load document. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get badge color
  const getBadgeColor = (badge: string) => {
    const colorMap: Record<string, string> = {
      'Strategic Vision': 'bg-purple-500',
      'Architecture': 'bg-blue-500',
      'Published': 'bg-emerald-500',
      'Implementation': 'bg-orange-500',
      'Technical': 'bg-red-500',
      'Enterprise': 'bg-indigo-500',
      'Launch Plan': 'bg-pink-500',
      'AI System': 'bg-cyan-500',
      'MCP System': 'bg-teal-500',
      'QA Framework': 'bg-yellow-500',
      'Admin Guide': 'bg-gray-500',
      'Donor Guide': 'bg-rose-500',
      'User Guide': 'bg-sky-500'
    };
    return colorMap[badge] || 'bg-gray-500';
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <PublicNavigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Loading document...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error State - 404
  if (error === 'Document not found') {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <PublicNavigation />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <Card className="max-w-2xl mx-auto bg-white/5 border-white/10">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-white mb-4">Document Not Found</h1>
                <p className="text-gray-400 text-lg mb-8">
                  The document you're looking for doesn't exist or has been removed.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="/docs">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse All Docs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error State - Other
  if (error || !document) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <PublicNavigation />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <Card className="max-w-2xl mx-auto bg-white/5 border-white/10">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-white mb-4">Failed to Load Document</h1>
                <p className="text-gray-400 text-lg mb-8">
                  {error || 'An unexpected error occurred.'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={loadDocument} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
                    Try Again
                  </Button>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="/docs">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse All Docs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // External Link Document - Show redirect UI
  if (document.use_external_link && document.external_link) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <PublicNavigation />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-red-950 to-black text-white py-16 border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black/50 to-black"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <span>/</span>
                <Link href="/docs" className="hover:text-white transition">Documentation</Link>
                <span>/</span>
                <span className="text-white">{document.title}</span>
              </div>

              {/* Title & Badge */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-bold flex-1">{document.title}</h1>
                <Badge className={`${getBadgeColor(document.badge)} text-white px-4 py-1`}>
                  {document.badge}
                </Badge>
              </div>

              <p className="text-gray-300 text-lg mb-8">
                All notable changes to the SHELTR project will be documented in this file.
              </p>
            </div>
          </div>
        </section>

        {/* External Link CTA */}
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
              <CardContent className="p-12 text-center">
                <Github className="h-20 w-20 text-red-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  View on GitHub
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  This document is maintained in our GitHub repository. Click below to view the full changelog with complete version history and commit details.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
                  >
                    <a href={document.external_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Open Changelog on GitHub
                    </a>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/20 hover:bg-white/10 text-lg px-8 py-6"
                  >
                    <Link href="/docs">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Docs
                    </Link>
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    The format is based on <a href="https://keepachangelog.com/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 underline">Keep a Changelog</a>, 
                    and this project adheres to <a href="https://semver.org/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 underline">Semantic Versioning</a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Success State - Render Document
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-red-950 to-black text-white py-16 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black/50 to-black"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link href="/docs" className="hover:text-white transition">Documentation</Link>
              <span>/</span>
              <span className="text-white">{document.title}</span>
            </div>

            {/* Title & Badge */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold flex-1">{document.title}</h1>
              <Badge className={`${getBadgeColor(document.badge)} text-white px-4 py-1`}>
                {document.badge}
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(document.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{document.view_count} views</span>
              </div>
            </div>

            {/* Audience & Topics */}
            <div className="mt-6 space-y-3">
              {document.audience && document.audience.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Target Audience:</span>
                  {document.audience.map((aud, idx) => (
                    <Badge key={idx} variant="outline" className="border-white/30 text-white/90">
                      {aud}
                    </Badge>
                  ))}
                </div>
              )}

              {document.topics && document.topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Topics:</span>
                  {document.topics.map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="border-red-500/40 text-red-400">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {document.github_path && (
                <Button asChild variant="outline" className="border-white/20 hover:bg-white/10">
                  <a 
                    href={`https://github.com/mrj0nesmtl/sheltr-ai/blob/main/${document.github_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 md:p-12">
                {/* Markdown Content */}
                <div className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
                  prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                  prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-semibold
                  prose-em:text-gray-300 prose-em:italic
                  prose-code:text-red-400 prose-code:bg-red-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
                  prose-ul:text-gray-300 prose-ul:my-4
                  prose-ol:text-gray-300 prose-ol:my-4
                  prose-li:my-2
                  prose-blockquote:text-gray-400 prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:shadow-lg
                  prose-hr:border-white/10 prose-hr:my-8
                  prose-table:border-collapse prose-table:w-full
                  prose-th:bg-white/5 prose-th:border prose-th:border-white/10 prose-th:p-3 prose-th:text-left prose-th:text-white
                  prose-td:border prose-td:border-white/10 prose-td:p-3 prose-td:text-gray-300
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {document.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Related Actions */}
            <div className="mt-8 flex justify-between items-center">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Documentation
              </Button>

              {document.github_path && (
                <Button asChild variant="ghost" className="hover:bg-white/10">
                  <a 
                    href={`https://github.com/mrj0nesmtl/sheltr-ai/blob/main/${document.github_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Edit on GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

