'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Users, 
  Shield, 
  Book,
  Code,
  Building,
  ArrowRight,
  Rocket,
  Heart,
  Building2,
  Mail,
  Send,
  MessageSquare,
  CheckSquare,
  BookOpen,
  Eye,
  Github,
  CreditCard,
  TreePine,
  Search,
  X,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { UnifiedInquiryService } from '@/services/unifiedInquiryService';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { docsHubService, type DocsHubCard } from '@/services/docsHubService';

export default function DocsPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Document State
  const [documents, setDocuments] = useState<DocsHubCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Category and Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/docs', '/backgrounds/hero-bg.jpg');

  // Fetch published documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const publishedDocs = await docsHubService.getPublishedDocuments();
      setDocuments(publishedDocs);
    } catch (err) {
      console.error('Failed to load published documents:', err);
      setError('Failed to load documentation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await UnifiedInquiryService.createNewsletterSignup({
        email: email.trim(),
        source: 'docs_page_cta',
        page: 'documentation_hub'
      });

      setSubmitMessage('✅ Thank you! We\'ll be in touch soon.');
      setEmail('');
    } catch (error) {
      console.error('Error saving email:', error);
      setSubmitMessage('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  // Helper: Get icon based on badge
  const getBadgeIcon = (badge: string) => {
    const iconMap: Record<string, any> = {
      'Strategic Vision': Users,
      'Architecture': Building,
      'Published': FileText,
      'Implementation': Code,
      'Technical': Code,
      'Enterprise': Building2,
      'Launch Plan': Rocket,
      'AI System': Users,
      'MCP System': Shield,
      'QA Framework': CheckSquare,
      'Admin Guide': BookOpen,
      'Donor Guide': Heart,
      'User Guide': Users
    };
    return iconMap[badge] || FileText;
  };

  // Helper: Get badge color
  const getBadgeColor = (badge: string) => {
    const colorMap: Record<string, string> = {
      'Strategic Vision': 'border-purple-400 text-purple-400',
      'Architecture': 'border-blue-400 text-blue-400',
      'Published': 'border-emerald-400 text-emerald-400',
      'Implementation': 'border-orange-400 text-orange-400',
      'Technical': 'border-red-400 text-red-400',
      'Enterprise': 'border-indigo-400 text-indigo-400',
      'Launch Plan': 'border-pink-400 text-pink-400',
      'AI System': 'border-cyan-400 text-cyan-400',
      'MCP System': 'border-teal-400 text-teal-400',
      'QA Framework': 'border-yellow-400 text-yellow-400',
      'Admin Guide': 'border-gray-400 text-gray-400',
      'Donor Guide': 'border-rose-400 text-rose-400',
      'User Guide': 'border-sky-400 text-sky-400'
    };
    return colorMap[badge] || 'border-gray-400 text-gray-400';
  };

  // Calculate category counts
  const categoryCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Documents', icon: BookOpen, count: documents.length },
    { id: 'core', name: 'Core Documentation', icon: FileText, count: categoryCounts['core'] || 0 },
    { id: 'additional', name: 'Additional Resources', icon: Book, count: categoryCounts['additional'] || 0 }
  ];

  // Filter documents by category and search
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.audience.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Split into core and additional
  const coreDocuments = filteredDocuments.filter(doc => doc.category === 'core');
  const additionalResources = filteredDocuments.filter(doc => doc.category === 'additional');

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavigation />

      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-black via-red-950 to-black text-white py-24 overflow-hidden"
        style={{
          backgroundImage: heroImage ? `linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(139, 0, 0, 0.8)), url(${heroImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black/50 to-black"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Documentation Hub
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Comprehensive guides, API references, and technical documentation for the SHELTR platform
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="https://github.com/mrj0nesmtl/sheltr-ai/tree/main/docs" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow bg-black">
        <div className="container mx-auto px-4 sm:px-6 py-16" id="docs">
          
          {/* Search and Category Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                        ${isActive 
                          ? 'bg-red-600 border-red-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="outline" className={`ml-1 ${isActive ? 'border-white/30' : 'border-white/20'}`}>
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active filters indicator */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Filter className="h-4 w-4" />
                <span>
                  Showing {filteredDocuments.length} of {documents.length} documents
                </span>
                {searchQuery && (
                  <Badge variant="outline" className="border-red-500 text-red-400">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    Category: {categories.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-red-400 hover:text-red-300 underline ml-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
              <p className="text-gray-400">Loading documentation...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
              <p className="text-red-400 text-lg font-medium mb-2">Failed to Load Documentation</p>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button onClick={loadDocuments} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredDocuments.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No documents found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'No published documentation available yet'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-900/20"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Core Documents Section */}
          {!loading && !error && coreDocuments.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Core Documentation</h2>
                <p className="text-gray-400">Essential guides and primary platform documentation</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {coreDocuments.map((doc) => {
                  const Icon = getBadgeIcon(doc.badge);
                  
                  return (
                    <Card key={doc.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors">
                            <Icon className="h-6 w-6 text-red-400" />
                          </div>
                          <Badge variant="outline" className={`${getBadgeColor(doc.badge)} text-xs px-2 py-1`}>
                            {doc.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-white mb-2">{doc.title}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm leading-relaxed">
                          {doc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Audience */}
                        {doc.audience.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Users className="h-3 w-3" />
                              <span>Target Audience</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {doc.audience.slice(0, 3).map((aud, idx) => (
                                <Badge key={idx} variant="outline" className="border-white/20 text-white/70 text-xs">
                                  {aud}
                                </Badge>
                              ))}
                              {doc.audience.length > 3 && (
                                <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                                  +{doc.audience.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        {doc.topics.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <BookOpen className="h-3 w-3" />
                              <span>Key Topics</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {doc.topics.slice(0, 3).map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="border-red-500/30 text-red-400/90 text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {doc.topics.length > 3 && (
                                <Badge variant="outline" className="border-red-500/30 text-red-400/90 text-xs">
                                  +{doc.topics.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          {/* Use external link if configured, otherwise use internal link */}
                          {doc.use_external_link && doc.external_link ? (
                            <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                              <a href={doc.external_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on GitHub
                              </a>
                            </Button>
                          ) : (
                            <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                              <Link href={doc.link}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Online
                              </Link>
                            </Button>
                          )}
                          {doc.github_link && !doc.use_external_link && (
                            <Button asChild variant="outline" className="border-white/20 hover:bg-white/10" size="icon">
                              <a href={doc.github_link} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* Last Updated */}
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>Last updated:</span>
                          <span className="text-gray-400">{doc.updated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* Additional Resources Section */}
          {!loading && !error && additionalResources.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Additional Resources</h2>
                <p className="text-gray-400">Supporting materials and supplementary documentation</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalResources.map((doc) => {
                  const Icon = getBadgeIcon(doc.badge);
                  
                  return (
                    <Card key={doc.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white/5 rounded">
                            <Icon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-white mb-1">{doc.title}</CardTitle>
                            <CardDescription className="text-sm text-gray-400">{doc.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {/* Use external link if configured, otherwise use internal link */}
                          {doc.use_external_link && doc.external_link ? (
                            <Button asChild size="sm" variant="outline" className="flex-1 border-white/20 hover:bg-white/10">
                              <a href={doc.external_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View on GitHub
                              </a>
                            </Button>
                          ) : (
                            <Button asChild size="sm" variant="outline" className="flex-1 border-white/20 hover:bg-white/10">
                              <Link href={doc.link}>
                                <Eye className="mr-2 h-3 w-3" />
                                View
                              </Link>
                            </Button>
                          )}
                          {doc.github_link && !doc.use_external_link && (
                            <Button asChild size="sm" variant="ghost" className="hover:bg-white/10">
                              <a href={doc.github_link} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* CTA Section */}
        <section className="border-t border-white/10 bg-gradient-to-r from-red-900/20 to-black py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center">
                  <MessageSquare className="h-12 w-12 text-red-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Need Help or Have Questions?
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Our team is here to help you get started with SHELTR. Get in touch for technical support, integration assistance, or partnership inquiries.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                    <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Get in Touch
                        </>
                      )}
                    </Button>
                  </form>
                  {submitMessage && (
                    <p className="mt-4 text-sm text-center">{submitMessage}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

