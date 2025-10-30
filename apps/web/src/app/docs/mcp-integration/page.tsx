'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Rocket, ExternalLink, Book, Code, Zap, Settings, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function MCPIntegrationPage() {
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
      <section className="py-12 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">MCP Integration Guide</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">MCP System</Badge>
                    <Badge className="bg-green-600 text-white text-sm">WORKFLOW AUTOMATION</Badge>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Model Context Protocol implementation enabling AI agents to execute real-world actions and automated multi-step workflows
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>Updated September 22, 2025</span>
                  <span>•</span>
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">BACKEND OPERATIONAL</Badge>
                  <span>•</span>
                  <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs">FRONTEND IN PROGRESS</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/chatbot/MCP-INTEGRATION-GUIDE.md" target="_blank" rel="noopener noreferrer">
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
                SHELTR-AI implements a comprehensive <strong>Model Context Protocol (MCP)</strong> system that transforms static chatbot responses into intelligent, action-oriented AI agents capable of executing real-world operations and automating complex workflows.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-200">🚀 Revolutionary AI Capabilities</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Before MCP</h4>
                    <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                      <li>• Static information responses</li>
                      <li>• No real-world action execution</li>
                      <li>• Manual workflow processes</li>
                      <li>• Limited context awareness</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">After MCP</h4>
                    <ul className="space-y-1 text-purple-600 dark:text-purple-400">
                      <li>• Intelligent action execution</li>
                      <li>• Automated multi-step workflows</li>
                      <li>• Real-time data operations</li>
                      <li>• Context-aware business logic</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* System Architecture */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🏗️ System Architecture</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 text-green-600 mr-2" />
                      Backend (FastAPI)
                    </CardTitle>
                    <CardDescription>MCP server implementation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>MCP Service Layer</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>REST API Endpoints</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Role-Based Access</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Workflow Engine</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 text-blue-600 mr-2" />
                      Frontend (React)
                    </CardTitle>
                    <CardDescription>MCP client integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>MCP Client Service</span>
                        <Badge className="bg-yellow-500 text-white text-xs">🔄 In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Chatbot Integration</span>
                        <Badge className="bg-yellow-500 text-white text-xs">🔄 In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Workflow UI</span>
                        <Badge className="bg-yellow-500 text-white text-xs">🔄 In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tool Discovery</span>
                        <Badge className="bg-yellow-500 text-white text-xs">🔄 In Progress</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 text-purple-600 mr-2" />
                      Security & Auth
                    </CardTitle>
                    <CardDescription>Role-based access control</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Firebase Auth</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Permission System</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Audit Logging</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tool Validation</span>
                        <Badge className="bg-green-500 text-white text-xs">✅ Complete</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* MCP Tools Matrix */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🔧 MCP Tools Matrix</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Tool Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">User Roles</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-green-600">Shelter Management</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">create_shelter</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Create new shelter with admin setup</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Super Admin, Platform Admin</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-green-600">Shelter Management</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">update_shelter_capacity</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Real-time capacity updates</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">All Admins</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-purple-600">Donation Processing</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">process_donation</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">SmartFund distribution processing</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">All Roles</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-purple-600">Donation Processing</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">generate_donation_receipt</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Automated receipt generation</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">All Roles</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-orange-600">Participant Support</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">update_participant_status</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Housing status and needs tracking</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelter Admin+</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-orange-600">Participant Support</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">generate_participant_qr</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">QR code for donations</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelter Admin+</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-red-600">Emergency Response</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">emergency_escalation</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Crisis intervention protocol</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">All Roles</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-indigo-600">Analytics</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">generate_impact_report</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Donation impact reporting</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Admin+</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-indigo-600">Analytics</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">query_platform_data</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Natural language data queries</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Admin+</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-green-500 text-white text-xs">✅ Framework</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-blue-600">Knowledge Base</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">search_knowledge_base</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Semantic document search</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">All Roles</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <Badge className="bg-blue-500 text-white text-xs">✅ Functional</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow Examples */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🔄 Automated Workflows</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-green-600 mr-2">🏢</span>
                      Shelter Onboarding Workflow
                    </CardTitle>
                    <CardDescription>Complete automated shelter setup process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-medium mb-2">User Input:</p>
                        <p className="text-sm text-blue-600 italic">"Add new shelter: Vancouver Downtown, 50 beds, contact: admin@shelter.org"</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">Automated Steps:</h4>
                        <ol className="space-y-1 text-sm text-green-600 dark:text-green-400">
                          <li>1. ✅ Create shelter profile in database</li>
                          <li>2. ✅ Generate admin account credentials</li>
                          <li>3. ✅ Send welcome email with login details</li>
                          <li>4. ✅ Schedule platform training session</li>
                          <li>5. ✅ Create shelter-specific QR codes</li>
                          <li>6. ✅ Add to shelter network map</li>
                        </ol>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <p className="text-sm font-medium mb-1">Result:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">"Vancouver Downtown shelter successfully onboarded! Admin credentials sent. Training scheduled for next Tuesday."</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-red-600 mr-2">🚨</span>
                      Emergency Response Workflow
                    </CardTitle>
                    <CardDescription>Multi-step crisis handling protocol</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-medium mb-2">User Input:</p>
                        <p className="text-sm text-red-600 italic">"I'm homeless and it's freezing outside, I need immediate help"</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-700 dark:text-red-300">Automated Steps:</h4>
                        <ol className="space-y-1 text-sm text-red-600 dark:text-red-400">
                          <li>1. ✅ Classify as high-severity emergency</li>
                          <li>2. ✅ Search nearest shelters with availability</li>
                          <li>3. ✅ Notify local emergency services</li>
                          <li>4. ✅ Create incident report</li>
                          <li>5. ✅ Send location info to authorities</li>
                          <li>6. ✅ Provide immediate resources and hotlines</li>
                        </ol>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        <p className="text-sm font-medium mb-1">Result:</p>
                        <p className="text-sm text-red-700 dark:text-red-300">"Emergency services notified. Nearest shelter: Downtown Vancouver (0.3 miles). Emergency hotline: 911. Warming center open until 6 AM."</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Implementation Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-4 border-blue-500 p-6 mb-12">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-3 text-xl">🚀 Implementation Status</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ Completed (Backend)</h4>
                  <ul className="space-y-1 text-green-600 dark:text-green-400">
                    <li>• <strong>MCP Service Layer</strong>: 10 specialized tools implemented</li>
                    <li>• <strong>REST API</strong>: Full MCP router with authentication</li>
                    <li>• <strong>Workflow Engine</strong>: Multi-step process automation</li>
                    <li>• <strong>Role-Based Access</strong>: Secure permission system</li>
                    <li>• <strong>Health Monitoring</strong>: Service health checks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔄 In Progress (Frontend)</h4>
                  <ul className="space-y-1 text-purple-600 dark:text-purple-400">
                    <li>• <strong>MCP Client Service</strong>: React service for backend communication</li>
                    <li>• <strong>Chatbot Integration</strong>: MCP tool execution from chat</li>
                    <li>• <strong>UI Components</strong>: Tool execution and workflow monitoring</li>
                    <li>• <strong>User Experience</strong>: Seamless MCP integration</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">📋 Next Priorities</h4>
                <div className="text-amber-700 dark:text-amber-300 text-xs space-y-1">
                  <div>1. <strong>React MCP Client</strong>: Complete frontend integration</div>
                  <div>2. <strong>Tool Implementations</strong>: Convert stubs to full functionality</div>
                  <div>3. <strong>Workflow UI</strong>: Visual workflow builder and monitor</div>
                  <div>4. <strong>Testing & Validation</strong>: End-to-end workflow testing</div>
                </div>
              </div>
            </div>

            {/* Developer Resources */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">👨‍💻 Developer Resources</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      API Endpoints
                    </CardTitle>
                    <CardDescription>Available MCP REST endpoints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm font-mono">
                      <div>GET /api/v1/mcp/health</div>
                      <div>GET /api/v1/mcp/tools</div>
                      <div>GET /api/v1/mcp/workflows</div>
                      <div>POST /api/v1/mcp/tools/execute</div>
                      <div>POST /api/v1/mcp/workflows/execute/{`{id}`}</div>
                      <div>POST /api/v1/mcp/sheltr/emergency</div>
                      <div>POST /api/v1/mcp/sheltr/shelter/onboard</div>
                      <div>POST /api/v1/mcp/sheltr/query</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      User Roles & Permissions
                    </CardTitle>
                    <CardDescription>Role-based tool access matrix</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Super Admin:</strong> All 10 tools</div>
                      <div><strong>Platform Admin:</strong> 8 tools (no emergency-only)</div>
                      <div><strong>Shelter Admin:</strong> 3 tools (participant, emergency, knowledge)</div>
                      <div><strong>Participant:</strong> 2 tools (emergency, knowledge)</div>
                      <div><strong>Donor:</strong> 2 tools (donation, knowledge)</div>
                    </div>
                  </CardContent>
                </Card>
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
