'use client';

import Link from 'next/link';
import { ArrowLeft, Download, BookOpen, ExternalLink, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function IRKnowledgeBaseGuidePage() {
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
              <Link href="/ir/dataroom">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Data Room
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Link
              href="/docs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
            
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="h-12 w-12 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Knowledge Base Guide</h1>
                  <Badge className="bg-blue-600 text-white text-sm">AI System</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Complete guide for updating SHELTR-AI Knowledge Base documents with embedding regeneration
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.0.0</span>
                  <span>•</span>
                  <span>Updated September 21, 2025</span>
                  <span>•</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">LIVE SYSTEM</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/knowledge-base/KNOWLEDGE-BASE-STRATEGY.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2>Current System Overview</h2>
              <p>
                The Knowledge Base is critical for chatbot instruction. When you update documents, embeddings must be regenerated 
                for the chatbots to use the latest information. This guide covers all methods for updating documents and ensuring 
                proper embedding regeneration.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-12">
              <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">🚀 Live Knowledge Base Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Total Documents</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">107</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Active Documents</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">107</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Total Chunks</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,059</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Pending Embeddings</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">1</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Total Words</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">209,212</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Categories</div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">10</div>
                </div>
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm mt-4">
                <strong>Status</strong>: ✅ Production-ready multi-agent chatbot system operational with real-time GitHub sync, RAG-powered semantic search, and comprehensive knowledge coverage across all platform domains.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Document Categories (107 Total)</CardTitle>
                  <CardDescription>
                    Complete GitHub repository documentation organized by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Overview</strong> → Platform overviews, plans, mission</li>
                    <li>• <strong>Architecture</strong> → System design, blockchain, tokenomics</li>
                    <li>• <strong>API</strong> → Database schema, endpoints, reference</li>
                    <li>• <strong>Development</strong> → Guides, session docs, implementation</li>
                    <li>• <strong>Deployment</strong> → Firebase, Cloud Run, monitoring</li>
                    <li>• <strong>User Guides</strong> → Role-specific guides, tutorials</li>
                    <li>• <strong>Reference</strong> → API docs, database schema, specs</li>
                    <li>• <strong>Integrations</strong> → Firebase, payment rails, external APIs</li>
                    <li>• <strong>Migration</strong> → Legacy system migration docs</li>
                    <li>• <strong>Resources</strong> → Additional resources, references</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Update Methods</CardTitle>
                  <CardDescription>
                    Multiple approaches with Session 15+ improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">🔄 GitHub Sync (NEW)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Real-time sync with progress tracking</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Scan for repository changes</li>
                        <li>• Progress bar with file tracking</li>
                        <li>• Selective sync with change detection</li>
                        <li>• Automatic embedding regeneration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🖥️ Enhanced Dashboard UI</h4>
                      <p className="text-sm text-muted-foreground mb-2">Desktop-optimized with dedicated edit pages</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Full-screen editing experience</li>
                        <li>• Folder tree navigation</li>
                        <li>• Educational AI system components</li>
                        <li>• Privacy & access controls</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">⚡ Script-Based Updates</h4>
                      <p className="text-sm text-muted-foreground mb-2">Bulk operations with enhanced quality scoring</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 100/100 quality optimization</li>
                        <li>• Duplicate detection & cleanup</li>
                        <li>• Enhanced metadata processing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI System Integration</CardTitle>
                  <CardDescription>
                    Advanced embedding system for multi-agent chatbots
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">🧠 Embedding Technology</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Model</strong>: text-embedding-ada-002 (OpenAI)</li>
                      <li>• <strong>Dimensions</strong>: 1536-dimensional vectors</li>
                      <li>• <strong>Total Chunks</strong>: 1,059 processed chunks</li>
                      <li>• <strong>Strategy</strong>: Overlapping chunks for context</li>
                      <li>• <strong>Quality</strong>: High-quality semantic search</li>
                      <li>• <strong>Tags</strong>: AI-generated relevant keywords</li>
                    </ul>
                  </div>
                    <div>
                      <h4 className="font-semibold mb-2">🤖 Multi-Agent Support</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Public landing page chatbot</li>
                        <li>• Super Admin control panel agent</li>
                        <li>• RAG-powered semantic search</li>
                        <li>• Real-time knowledge updates</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Advanced Embedding & Quality System</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🎯 Quality Scoring (100/100)</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Chunk Count</strong>: Optimal document segmentation</li>
                    <li>• <strong>Word Count</strong>: Comprehensive content analysis</li>
                    <li>• <strong>Embedding Status</strong>: Completion verification</li>
                    <li>• <strong>AI Tags</strong>: GPT-4o-mini generated keywords</li>
                    <li>• <strong>Content Enhancement</strong>: Auto-summary for short docs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🔄 Automatic Processing</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-green-600 mb-1">✅ Auto-Regeneration Triggers</h5>
                      <ul className="space-y-1 text-xs">
                        <li>• GitHub sync operations</li>
                        <li>• Dashboard UI updates</li>
                        <li>• API endpoint calls</li>
                        <li>• Script-based bulk updates</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-600 mb-1">🚀 Enhanced Features</h5>
                      <ul className="space-y-1 text-xs">
                        <li>• Duplicate detection & cleanup</li>
                        <li>• Progress tracking with visual feedback</li>
                        <li>• Quality optimization algorithms</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🤖 Multi-Agent RAG</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Semantic Search</strong>: Vector similarity matching</li>
                    <li>• <strong>Context Retrieval</strong>: Relevant document chunks</li>
                    <li>• <strong>Real-time Updates</strong>: Immediate knowledge refresh</li>
                    <li>• <strong>Agent Orchestration</strong>: Public + Admin chatbots</li>
                    <li>• <strong>Session Persistence</strong>: Conversation memory</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-12">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-4">🛠️ Comprehensive Workflow Guide</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">📋 For Regular GitHub Sync Updates</h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Navigate to <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">localhost:3000/dashboard/knowledge</code></li>
                    <li>Click <strong>&ldquo;Scan for Changes&rdquo;</strong> in GitHub Sync panel</li>
                    <li>Review detected changes (new, modified, deleted files)</li>
                    <li>Click <strong>&ldquo;Sync Files&rdquo;</strong> with progress tracking</li>
                    <li>Verify embedding regeneration and quality scores</li>
                    <li>Test chatbot responses with updated knowledge</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">✏️ For Individual Document Editing</h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Find document in folder tree or search</li>
                    <li>Click <strong>&ldquo;Edit&rdquo;</strong> to open dedicated edit page</li>
                    <li>Use full-screen Markdown editor with metadata</li>
                    <li>Configure privacy, access controls, and sharing</li>
                    <li>Save with automatic embedding regeneration</li>
                    <li>Monitor quality score improvements</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-12">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-4">🚨 Advanced Troubleshooting & Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Common Issues & Solutions</h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <li>• <strong>Quality Score &lt; 100</strong>: Check word count, add tags, enhance content</li>
                    <li>• <strong>Embedding Generation Failed</strong>: Verify OpenAI API key, check content validity</li>
                    <li>• <strong>GitHub Sync Errors</strong>: Ensure GitHub token configured, check repository access</li>
                    <li>• <strong>Chatbot Not Updated</strong>: Wait 1-2 minutes for propagation, restart if needed</li>
                    <li>• <strong>Duplicate Documents</strong>: Use cleanup scripts, keep highest quality version</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Production Best Practices</h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <li>• <strong>Always use GitHub sync</strong> for reliable, tracked updates</li>
                    <li>• <strong>Monitor quality scores</strong> and optimize for 100/100 rating</li>
                    <li>• <strong>Test chatbot responses</strong> after major knowledge updates</li>
                    <li>• <strong>Use dedicated edit pages</strong> for comprehensive document management</li>
                    <li>• <strong>Leverage AI tags</strong> for improved semantic search performance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-6 mb-12">
              <h3 className="text-purple-800 dark:text-purple-200 font-semibold mb-4">🔮 Future Enhancements & Roadmap</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">Planned Features</h4>
                  <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                    <li>• <strong>OpenAI MCP Integration</strong>: Enhanced embedding control and manipulation</li>
                    <li>• <strong>Automated Sync Scheduling</strong>: Webhook-based or scheduled sync options</li>
                    <li>• <strong>Advanced Analytics</strong>: Document usage tracking and optimization insights</li>
                    <li>• <strong>Version Control</strong>: Document history and rollback capabilities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">Integration Opportunities</h4>
                  <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                    <li>• <strong>Real-time Collaboration</strong>: Multi-user editing with conflict resolution</li>
                    <li>• <strong>AI-Powered Suggestions</strong>: Content improvement recommendations</li>
                    <li>• <strong>Cross-Platform Sync</strong>: Integration with other documentation systems</li>
                    <li>• <strong>Performance Optimization</strong>: Faster embedding generation and search</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/ir/dataroom">
                <Button variant="outline" size="lg">
                  <Book className="h-5 w-5 mr-2" />
                  Back to Documentation Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
