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
                  <span>Updated September 21, 2025</span>
                  <span>•</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">ACTIVE DEVELOPMENT</Badge>
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

            {/* Agent Responsibilities Matrix */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🎯 Agent Responsibilities Matrix</h2>
              
              {/* Public-Facing Agents */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">Public-Facing Agents (Orchestrator)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Agent</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Primary Users</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Key Functions</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">emergency</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Crisis situations</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Crisis intervention, safety resources</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">participant_support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Homeless individuals</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Service booking, resource navigation</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">donor_relations</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Donors</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">SmartFund™ explanation, impact tracking</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">public_information</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">General public</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Platform education, SmartFund™ model</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">public_support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">New users</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Getting started, donation guidance</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">shelter_operations</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelter admins</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Participant management, reporting</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">technical_support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">All users</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Platform issues, account problems</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin-Facing Agents */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">Admin-Facing Agents (Control Panel)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Agent</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Primary Use</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Key Functions</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">general</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">General assistance</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Various tasks, Q&A</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">sheltr_support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Platform support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">SHELTR-specific help</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">technical_expert</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Development support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Technical guidance, architecture</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">business_analyst</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Strategy support</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Business insights, analytics</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">creative_writer</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Content creation</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Writing assistance, marketing</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          <Badge className="bg-green-500 text-white text-xs">✅ Active</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* System Comparison */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🔄 System Architecture Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Aspect</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Orchestrator Agents</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Control Panel Agents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">Configuration</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Hardcoded in prompts.py</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Configurable via UI</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">Purpose</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public user support</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Super Admin tooling</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">Persistence</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session-based</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Full conversation history</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">Model Selection</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Fixed per agent</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">User-selectable</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">Knowledge Base</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">RAG-enhanced</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Configurable per agent</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public users</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Super Admin only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">System Integration</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Firebase Storage Status</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Knowledge Base:</strong> ✅ 10+ documents loaded</li>
                    <li>• <strong>Storage Bucket:</strong> gs://sheltr-ai.firebasestorage.app</li>
                    <li>• <strong>Collections:</strong> knowledge_documents, knowledge_chunks</li>
                    <li>• <strong>Embeddings:</strong> 100+ embedding chunks for RAG</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Technical Implementation</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Orchestrator:</strong> apps/api/services/chatbot/orchestrator.py</li>
                    <li>• <strong>Control Panel:</strong> apps/web/src/app/dashboard/chatbots/page.tsx</li>
                    <li>• <strong>Models:</strong> GPT-4o, GPT-4o Mini, Claude (configurable)</li>
                    <li>• <strong>RAG System:</strong> Real-time knowledge enhancement</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-12">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">🚀 Current Status: Multi-Agent System Active</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                <strong>Public Orchestrator System</strong>: ✅ 7 specialized agents operational with intent classification and role-based routing<br/>
                <strong>Admin Control Panel System</strong>: ✅ 5 configurable agents with real-time model switching (GPT-4o, GPT-4o Mini, Claude)<br/>
                <strong>Knowledge Base Integration</strong>: ✅ RAG enhancement with 100+ document chunks for contextual responses<br/>
                <strong>Session Management</strong>: ✅ Persistent conversations with full history tracking for admin agents
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-3 border border-amber-200 dark:border-amber-800">
                <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">🔧 Technical Architecture</h4>
                <div className="text-amber-700 dark:text-amber-300 text-xs space-y-1">
                  <div><strong>Orchestrator Location:</strong> <code>apps/api/services/chatbot/orchestrator.py</code></div>
                  <div><strong>Control Panel Location:</strong> <code>apps/web/src/app/dashboard/chatbots/page.tsx</code></div>
                  <div><strong>Knowledge Enhancement:</strong> Firebase Firestore with vector embeddings</div>
                  <div><strong>Model Support:</strong> OpenAI GPT-4o/Mini, Anthropic Claude (configurable)</div>
                </div>
              </div>
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
