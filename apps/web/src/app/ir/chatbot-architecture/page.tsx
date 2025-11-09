'use client';

import Link from 'next/link';
import { ArrowLeft, Download, MessageSquare, ExternalLink, Book, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function IRChatbotArchitecturePage() {
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
                Comprehensive guide to SHELTR's multi-agent chatbot system with MCP-powered workflow automation, public orchestrator, and admin control panel
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>Version 2.0.0</span>
                <span>•</span>
                <span>Updated September 22, 2025</span>
                <span>•</span>
                <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">MCP ENHANCED</Badge>
                <span>•</span>
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs">WORKFLOW AUTOMATION</Badge>
              </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/chatbot/SHELTR-AGENT-ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                  <Link href="/docs/chatbot-user-guide">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Rocket className="h-4 w-4 mr-2" />
                      Revolutionary User Guide
                    </Button>
                  </Link>
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
              <h2 className="text-2xl font-bold mb-4">System Overview</h2>
              <p className="mb-4">
                SHELTR-AI features a next-generation AI system with three integrated components powered by Model Context Protocol (MCP):
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Public Landing Page Chatbot</strong> - Orchestrator-based system with MCP workflow automation</li>
                <li><strong>Super Admin Chatbot Control Panel</strong> - Configurable agents with MCP tool integration</li>
                <li><strong>MCP Workflow Engine</strong> - 10 specialized tools + 2 automated multi-step workflows</li>
              </ul>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-200">🚀 MCP Integration Highlights</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Intelligent Actions</h4>
                    <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                      <li>• Real-world action execution (donations, status updates)</li>
                      <li>• Automated workflows (shelter onboarding, emergency response)</li>
                      <li>• Smart data queries with natural language</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Technical Features</h4>
                    <ul className="space-y-1 text-purple-600 dark:text-purple-400">
                      <li>• 10 specialized MCP tools for platform operations</li>
                      <li>• Role-based access control for secure tool usage</li>
                      <li>• Multi-step workflow automation with dependencies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Public Landing Page Chatbot</CardTitle>
                  <CardDescription>
                    MCP-powered orchestrator system for public users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Agent Types (7 MCP-Enhanced Agents)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Emergency</strong> - Crisis response with automated escalation workflow</li>
                        <li>• <strong>Participant Support</strong> - Real status updates, QR code generation</li>
                        <li>• <strong>Donor Relations</strong> - Live donation processing, receipt generation</li>
                        <li>• <strong>Public Information</strong> - Enhanced knowledge search and platform queries</li>
                        <li>• <strong>Public Support</strong> - Intelligent onboarding and guidance</li>
                        <li>• <strong>Shelter Operations</strong> - Real-time capacity updates, reporting</li>
                        <li>• <strong>Technical Support</strong> - System queries and account management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">MCP-Enhanced Workflow</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Intent Classification + MCP Tool Detection</li>
                        <li>• Role-Based Routing + Permission Validation</li>
                        <li>• RAG Enhancement + Real-Time Data Access</li>
                        <li>• Response Generation + Action Execution</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Super Admin Control Panel</CardTitle>
                  <CardDescription>
                    MCP-integrated configurable agent system for internal use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Agent Types (5 MCP-Integrated Agents)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>General Assistant</strong> - All MCP tools based on user role</li>
                        <li>• <strong>SHELTR Support</strong> - Platform tools, shelter onboarding workflows</li>
                        <li>• <strong>Technical Expert</strong> - System queries, performance analysis</li>
                        <li>• <strong>Business Analyst</strong> - Analytics tools, revenue reporting</li>
                        <li>• <strong>Creative Writer</strong> - Knowledge search for content research</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">MCP-Enhanced Features</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Session Management + Workflow Execution History</li>
                        <li>• Agent Selection + Tool Access Based on Role</li>
                        <li>• Model Selection + MCP Tool Integration</li>
                        <li>• Real-time Configuration + Action Monitoring</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* MCP Tools & Workflows */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🛠️ MCP Tools & Workflows</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-blue-600 mr-2">🔧</span>
                      MCP Tools (10 Available)
                    </CardTitle>
                    <CardDescription>Specialized tools for platform operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-1">Shelter Management</h4>
                        <p>create_shelter, update_shelter_capacity</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-1">Donation Processing</h4>
                        <p>process_donation, generate_donation_receipt</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-600 mb-1">Participant Support</h4>
                        <p>update_participant_status, generate_participant_qr</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-1">Emergency Response</h4>
                        <p>emergency_escalation</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-600 mb-1">Analytics & Knowledge</h4>
                        <p>generate_impact_report, query_platform_data, search_knowledge_base</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-purple-600 mr-2">🔄</span>
                      MCP Workflows (2 Active)
                    </CardTitle>
                    <CardDescription>Multi-step automated processes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Shelter Onboarding</h4>
                        <ul className="space-y-1 text-green-600 dark:text-green-400">
                          <li>1. Create shelter profile</li>
                          <li>2. Send welcome email</li>
                          <li>3. Schedule training</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Emergency Response</h4>
                        <ul className="space-y-1 text-red-600 dark:text-red-400">
                          <li>1. Escalate emergency</li>
                          <li>2. Notify authorities (if critical)</li>
                          <li>3. Create incident report</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold mb-3 text-green-800 dark:text-green-200">🎯 User Experience Enhancement</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Before MCP</h4>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>User:</strong> "I need help with housing"</p>
                      <p className="text-gray-600 dark:text-gray-400"><strong>Bot:</strong> "Here are some resources about housing assistance..."</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">After MCP</h4>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>User:</strong> "I need help with housing"</p>
                      <p className="text-blue-600 dark:text-blue-400"><strong>Bot:</strong> "Let me check your status and available options..."</p>
                      <p className="text-green-600 dark:text-green-400 text-xs mt-1">[Executes: update_participant_status, search_knowledge_base]</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2"><strong>Bot:</strong> "Found 3 shelters with availability. Generated your QR code. Here are your next steps..."</p>
                    </div>
                  </div>
                </div>
              </div>
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

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-4 border-blue-500 p-6 mb-12">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-3 text-xl">🚀 Current Status: MCP-Enhanced Multi-Agent System</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm mb-4">
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">✅ Operational Systems</h4>
                  <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                    <li><strong>Public Orchestrator</strong>: 7 MCP-enhanced agents with workflow automation</li>
                    <li><strong>Admin Control Panel</strong>: 5 agents with MCP tool integration</li>
                    <li><strong>MCP Backend</strong>: 10 specialized tools + 2 automated workflows</li>
                    <li><strong>Knowledge Base</strong>: 57+ documents with semantic search</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔄 In Progress</h4>
                  <ul className="space-y-1 text-purple-600 dark:text-purple-400">
                    <li><strong>Frontend MCP Client</strong>: React integration for tool execution</li>
                    <li><strong>Tool Implementations</strong>: Converting stubs to full functionality</li>
                    <li><strong>Workflow UI</strong>: Visual workflow execution monitoring</li>
                    <li><strong>Testing & Validation</strong>: End-to-end workflow testing</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-3">🔧 Technical Architecture</h4>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="text-amber-700 dark:text-amber-300 space-y-1">
                    <div><strong>Orchestrator:</strong> <code>apps/api/services/chatbot/orchestrator.py</code></div>
                    <div><strong>Control Panel:</strong> <code>apps/web/src/app/dashboard/chatbots/page.tsx</code></div>
                    <div><strong>MCP Service:</strong> <code>apps/api/services/mcp_service.py</code></div>
                  </div>
                  <div className="text-amber-700 dark:text-amber-300 space-y-1">
                    <div><strong>MCP Router:</strong> <code>apps/api/routers/mcp.py</code></div>
                    <div><strong>Knowledge Base:</strong> Firebase Firestore with vector embeddings</div>
                    <div><strong>Models:</strong> OpenAI GPT-4o/Mini, Anthropic Claude</div>
                  </div>
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
