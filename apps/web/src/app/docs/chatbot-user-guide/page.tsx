'use client';

import Link from 'next/link';
import { ArrowLeft, Download, MessageSquare, ExternalLink, Book, Rocket, Zap, Mic, Smartphone, Settings } from 'lucide-react';
import { RoleAwareChatbot } from '@/components/RoleAwareChatbot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function ChatbotUserGuidePage() {
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
              <Link href="/docs/chatbot-architecture">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Architecture
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Revolutionary Chatbot User Guide</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">VOICE-FIRST ADMIN</Badge>
                    <Badge className="bg-green-600 text-white text-sm">HANDS-FREE MANAGEMENT</Badge>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Discover how SHELTR's MCP-powered AI agents transform platform administration into conversational, mobile, voice-first experiences
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>Updated September 22, 2025</span>
                  <span>•</span>
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">REVOLUTIONARY POTENTIAL</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Potential */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-lg border border-purple-200 dark:border-purple-800">
                <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-200">🚀 The Revolutionary Potential</h2>
                <p className="text-lg text-purple-700 dark:text-purple-300 mb-4">
                  <strong>YES! Absolutely!</strong> As a Super Admin, you can now talk to your chatbot and manage the entire SHELTR platform without ever touching a computer. Eventually, you could have a companion app that you just talk to!
                </p>
                <p className="text-purple-600 dark:text-purple-400">
                  Our MCP integration transforms static chatbot responses into intelligent, action-oriented AI agents capable of executing real-world operations and automating complex workflows.
                </p>
              </div>
            </div>

            {/* What You Can Do RIGHT NOW */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🎯 What You Can Do RIGHT NOW</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                      Via Chatbot Dashboard
                    </CardTitle>
                    <CardDescription>Natural language commands that execute real actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-medium mb-2 text-green-600">💬 "Show me this week's donation analytics"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">→ <code>generate_impact_report</code> tool executes</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-medium mb-2 text-blue-600">💬 "How many participants need housing assistance?"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">→ <code>query_platform_data</code> tool runs</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-medium mb-2 text-purple-600">💬 "What's the capacity at Old Brewery Mission?"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">→ <code>update_shelter_capacity</code> tool checks</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-medium mb-2 text-orange-600">💬 "Create a new shelter in Vancouver"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">→ <code>shelter_onboarding</code> workflow triggers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 text-blue-600 mr-2" />
                      Natural Language → Real Actions
                    </CardTitle>
                    <CardDescription>Complex workflows triggered by simple requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">👤 <strong>You:</strong></p>
                          <p className="text-sm text-blue-600 italic">"I need an emergency response report for downtown Montreal"</p>
                        </div>
                        <div className="border-l-2 border-green-500 pl-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">🤖 <strong>MCP:</strong></p>
                          <p className="text-xs text-green-600">✅ Executing emergency_escalation tool...</p>
                          <p className="text-xs text-green-600">✅ Generating incident report...</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Here's your emergency response summary with 3 nearby shelters and contact info</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Interactive Demo Chatbot */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🤖 Try It Yourself - Interactive Demo</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">Experience MCP-Powered AI Right Now!</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    This chatbot automatically detects your role and provides appropriate access to MCP tools. 
                    {/* Conditional message based on authentication */}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ If You're Signed In</h4>
                    <ul className="space-y-1 text-green-600 dark:text-green-400">
                      <li>• Full MCP tool access based on your role</li>
                      <li>• Real analytics and system queries</li>
                      <li>• Workflow automation capabilities</li>
                      <li>• Personalized responses and data</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">🔒 If You're Not Signed In</h4>
                    <ul className="space-y-1 text-orange-600 dark:text-orange-400">
                      <li>• General platform information</li>
                      <li>• Public knowledge base access</li>
                      <li>• No sensitive data exposure</li>
                      <li>• Prompts to sign in for advanced features</li>
                    </ul>
                  </div>
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    🔐 Secure • Role-Based • MCP-Powered
                  </Badge>
                </div>
              </div>
              
              {/* Embedded Chatbot */}
              <RoleAwareChatbot embedded={true} className="max-w-4xl mx-auto" />
            </div>

            {/* Mobile Companion App Vision */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">📱 Mobile Companion App Vision</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mic className="h-5 w-5 text-purple-600 mr-2" />
                      Voice-First Interface
                    </CardTitle>
                    <CardDescription>Hands-free platform management anywhere</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">🎤 "Hey SHELTR, what's our platform status?"</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">→ Real-time dashboard summary</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">🎤 "Show me today's donations"</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">→ Live financial analytics</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">🎤 "Any emergency alerts?"</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">→ Instant crisis notifications</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">🎤 "Create participant QR code for Alex"</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">→ Generates QR instantly</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="h-5 w-5 text-orange-600 mr-2" />
                      Hands-Free Administration
                    </CardTitle>
                    <CardDescription>Platform management from anywhere</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-600">🚶‍♂️</span>
                        <span><strong>Walking to a meeting?</strong> Get verbal platform updates</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-600">🚗</span>
                        <span><strong>Driving?</strong> Ask for urgent notifications via voice</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-600">🏠</span>
                        <span><strong>At home?</strong> Check system health without opening laptop</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-600">🚨</span>
                        <span><strong>Emergency?</strong> Trigger crisis protocols with voice commands</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Practical Super Admin Scenarios */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🎯 Practical Super Admin Scenarios</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">🌅 Morning Routine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border-l-4 border-green-500">
                      <p className="text-sm font-medium mb-2">💬 "Good morning SHELTR, what happened overnight?"</p>
                      <p className="text-xs text-green-600">→ Platform summary, new registrations, donations, any alerts</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">🏃‍♂️ On-the-Go Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                      <p className="text-sm font-medium mb-2">💬 "SHELTR, approve the new shelter application for Toronto"</p>
                      <p className="text-xs text-blue-600">→ Executes shelter_onboarding workflow automatically</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">🚨 Emergency Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                      <p className="text-sm font-medium mb-2">💬 "SHELTR, we have a crisis at Queen and Spadina, activate emergency protocol"</p>
                      <p className="text-xs text-red-600">→ Triggers emergency_escalation with location data</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Why This is Game-Changing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🚀 Why This is GAME-CHANGING</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-blue-600">No Screen Required</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage entire platform via voice</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-purple-600">Real-time Intelligence</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">AI executes actual operations, not just information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-green-600">Context Awareness</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Knows your role, permissions, current platform state</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-orange-600">Workflow Automation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Complex multi-step processes triggered by simple requests</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</div>
                    <div>
                      <h4 className="font-semibold text-red-600">24/7 Accessibility</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Platform management from anywhere, anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Current Status */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-l-4 border-green-500 p-6 mb-12">
              <h3 className="text-green-800 dark:text-green-200 font-semibold mb-3 text-xl">✅ Current Status: MCP Backend Operational</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🚀 Ready Now</h4>
                  <ul className="space-y-1 text-green-600 dark:text-green-400">
                    <li>• <strong>MCP Backend</strong>: 10 tools + 2 workflows operational</li>
                    <li>• <strong>Chatbot Integration</strong>: Ready for MCP tool execution</li>
                    <li>• <strong>Role-Based Access</strong>: Secure permission system</li>
                    <li>• <strong>Knowledge Base</strong>: 57+ documents accessible</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🔄 Coming Next</h4>
                  <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                    <li>• <strong>Frontend Integration</strong>: React MCP client</li>
                    <li>• <strong>Mobile App</strong>: Voice-first companion</li>
                    <li>• <strong>Real-time Notifications</strong>: Push alerts</li>
                    <li>• <strong>Voice Interface</strong>: Hands-free commands</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">🎯 The Future is Voice-First Administration</h3>
                <p className="text-lg mb-6">
                  Transform platform administration from a desktop-bound task to a conversational, mobile, voice-first experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/docs/mcp-integration">
                    <Button variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Explore MCP Integration
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Book className="h-5 w-5 mr-2" />
                      Back to Documentation Hub
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
