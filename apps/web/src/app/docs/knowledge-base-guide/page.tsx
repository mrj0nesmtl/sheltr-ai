'use client';

import Link from 'next/link';
import { ArrowLeft, Download, BookOpen, ExternalLink, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function KnowledgeBaseGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
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
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="h-12 w-12 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Knowledge Base Update Guide</h1>
                  <Badge className="bg-blue-600 text-white text-sm">Maintenance</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Complete guide for updating SHELTR-AI Knowledge Base documents with embedding regeneration
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>August 22, 2025</span>
                  <span>•</span>
                  <span>250 pages</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/KNOWLEDGE-BASE-UPDATE-GUIDE.md" target="_blank" rel="noopener noreferrer">
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

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-12">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">📊 Current Knowledge Base Status</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>Storage Structure</strong>: Firebase Storage knowledge-base/public/ (9 markdown files)<br/>
                <strong>Firestore Collection</strong>: knowledge_documents (9 document records)<br/>
                <strong>Embeddings</strong>: knowledge_chunks (62+ embedding chunks for chatbot RAG)<br/>
                <strong>Status</strong>: ✅ All documents loaded and operational
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Available Documents (9 Total)</CardTitle>
                  <CardDescription>
                    Current knowledge base documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>README.md</strong> → SHELTR Platform Overview</li>
                    <li>• <strong>blockchain.md</strong> → SHELTR Blockchain Technical Documentation</li>
                    <li>• <strong>donor-guide.md</strong> → Donor User Guide</li>
                    <li>• <strong>hacking_homelessness.md</strong> → Hacking Homelessness Strategy</li>
                    <li>• <strong>participant-guide.md</strong> → Participant User Guide</li>
                    <li>• <strong>shelter-admin-guide.md</strong> → Shelter Admin Guide</li>
                    <li>• <strong>sheltr-tokenomics.md</strong> → SHELTR Tokenomics and SmartFund Model</li>
                    <li>• <strong>system-design.md</strong> → SHELTR System Design and Architecture</li>
                    <li>• <strong>whitepaper_final.md</strong> → SHELTR White Paper</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Update Methods</CardTitle>
                  <CardDescription>
                    Three different approaches for updating documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Method 1: Script-Based Update (Recommended)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Use for bulk updates or when you have local markdown files</p>
                      <ul className="space-y-1 text-xs">
                        <li>• List available documents</li>
                        <li>• Update single document</li>
                        <li>• Update specific document by ID</li>
                        <li>• Update all documents from directory</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Method 2: UI-Based Update</h4>
                      <p className="text-sm text-muted-foreground mb-2">Use for individual document updates through the dashboard</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Login as Super Admin</li>
                        <li>• Find document to update</li>
                        <li>• Edit content in text editor</li>
                        <li>• Save with automatic embedding regeneration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Method 3: Direct File Replacement</h4>
                      <p className="text-sm text-muted-foreground mb-2">Advanced users only - requires manual embedding regeneration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Embedding Regeneration Process</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Why Embeddings Matter</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Chatbots use embeddings for <strong>semantic search</strong></li>
                    <li>• Enables <strong>RAG (Retrieval-Augmented Generation)</strong></li>
                    <li>• When document content changes, old embeddings become <strong>outdated</strong></li>
                    <li>• <strong>New embeddings</strong> ensure chatbots have access to latest information</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Automatic vs Manual Regeneration</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-green-600 mb-1">✅ Automatic Regeneration</h5>
                      <ul className="space-y-1 text-xs">
                        <li>• Using the update script</li>
                        <li>• Using UI update with file upload</li>
                        <li>• Using the new API endpoint</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-600 mb-1">❌ Manual Regeneration Needed</h5>
                      <ul className="space-y-1 text-xs">
                        <li>• Directly editing files in Firebase Storage</li>
                        <li>• Manually updating Firestore documents</li>
                        <li>• Importing documents via other methods</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-12">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">🔧 Recommended Workflow</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>For Regular Updates</strong>: Edit markdown files locally → Run update script → Verify in dashboard → Test chatbot responses<br/>
                <strong>For Single Document Updates</strong>: Edit specific file → Update using script → Check dashboard for updated chunk count<br/>
                <strong>Always verify</strong> that embeddings were regenerated and chatbot responses reflect new information
              </p>
            </div>

            <div className="text-center">
              <Link href="/docs">
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
