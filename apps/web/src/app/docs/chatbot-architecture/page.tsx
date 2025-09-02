'use client';

import Link from 'next/link';
import { ArrowLeft, Download, MessageSquare, ExternalLink, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function ChatbotArchitecturePage() {
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
      <section className="py-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <MessageSquare className="h-12 w-12 text-purple-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Chatbot Agent Architecture</h1>
                  <Badge className="bg-purple-600 text-white text-sm">AI System</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Comprehensive guide to SHELTR's multi-agent chatbot system with public orchestrator and admin control panel
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>August 22, 2025</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/CHATBOT-AGENT-ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">
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
              <h2>System Overview</h2>
              <p>
                SHELTR-AI has a sophisticated multi-agent chatbot system with two main components:
              </p>
              <ul>
                <li><strong>Public Landing Page Chatbot</strong> - Orchestrator-based system for public users</li>
                <li><strong>Super Admin Chatbot Control Panel</strong> - Configurable agent system for internal use</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Public Landing Page Chatbot</CardTitle>
                  <CardDescription>
                    Orchestrator-based system for public users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Agent Types (7 Specialized Agents)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Emergency</strong> - Crisis response and safety resources</li>
                        <li>• <strong>Participant Support</strong> - Service booking and resource navigation</li>
                        <li>• <strong>Donor Relations</strong> - SmartFund™ explanation and impact tracking</li>
                        <li>• <strong>Public Information</strong> - Platform education and SmartFund™ model</li>
                        <li>• <strong>Public Support</strong> - Getting started and donation guidance</li>
                        <li>• <strong>Shelter Operations</strong> - Participant management and reporting</li>
                        <li>• <strong>Technical Support</strong> - Platform issues and account problems</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How It Works</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Intent Classification - Analyzes user message for intent</li>
                        <li>• Role-Based Routing - Routes to appropriate agent</li>
                        <li>• RAG Enhancement - Uses knowledge base for enhanced responses</li>
                        <li>• Response Generation - Generates contextual responses</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Super Admin Control Panel</CardTitle>
                  <CardDescription>
                    Configurable agent system for internal use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Agent Types (5 Configurable Agents)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>General Assistant</strong> - Various tasks and Q&A</li>
                        <li>• <strong>SHELTR Support</strong> - Platform-specific help</li>
                        <li>• <strong>Technical Expert</strong> - Technical guidance and architecture</li>
                        <li>• <strong>Business Analyst</strong> - Business insights and analytics</li>
                        <li>• <strong>Creative Writer</strong> - Writing assistance and marketing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Session Management - Persistent chat sessions</li>
                        <li>• Agent Selection - Choose from configurable agents</li>
                        <li>• Model Selection - Switch between AI models</li>
                        <li>• Real-time Configuration - Edit agent instructions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">System Integration</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Firebase Storage Status</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Knowledge Base:</strong> ✅ 10 documents loaded</li>
                    <li>• <strong>Storage Bucket:</strong> gs://sheltr-ai.firebasestorage.app</li>
                    <li>• <strong>Collections:</strong> knowledge_documents, knowledge_chunks</li>
                    <li>• <strong>Embeddings:</strong> 62+ embedding chunks for chatbot RAG</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Current Status</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Public Chatbot:</strong> 🟡 All 7 agents in development</li>
                    <li>• <strong>Super Admin Control Panel:</strong> 🟡 All 5 configurable agents in development</li>
                    <li>• <strong>Model Integration:</strong> 🟡 OpenAI GPT-4o and GPT-4o Mini in development</li>
                    <li>• <strong>Session Management:</strong> 🟡 Chat sessions persisting correctly</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-12">
              <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">🟡 Current Status: All Systems in Development</h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                <strong>Public Orchestrator System</strong>: 7 specialized agents for public users with RAG enhancement<br/>
                <strong>Admin Control Panel System</strong>: 5 configurable agents for Super Admin with model selection<br/>
                <strong>Knowledge Base Integration</strong>: Both systems share the same Firebase Storage knowledge base
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
