'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Code, ExternalLink, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function APIDocumentationPage() {
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
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Code className="h-12 w-12 text-orange-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">API Documentation</h1>
                  <Badge className="bg-orange-500 text-white text-sm">Technical</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Comprehensive API reference for developers, integration guides, and technical specifications
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.16.0</span>
                  <span>•</span>
                  <span>Updated September 21, 2025</span>
                  <span>•</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">PRODUCTION READY</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/api/README.md" target="_blank" rel="noopener noreferrer">
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

      {/* API Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2>API Overview</h2>
              <p>
                The SHELTR API provides developers with comprehensive access to platform functionality, 
                enabling seamless integration with shelter management systems, donor platforms, and 
                participant services. Built on modern REST principles with blockchain integration.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6">
                <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">✅ Current Status: Production-Ready Multi-Tenant Platform</h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  <strong>Base URL</strong>: <code>https://sheltr-api-714964620823.us-central1.run.app</code> (Production)<br/>
                  <strong>Authentication</strong>: Firebase ID tokens ✅ <strong>OPERATIONAL</strong><br/>
                  <strong>Multi-Tenant</strong>: 10 shelter tenants with real data connectivity ✅ <strong>LIVE</strong>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>REST API Endpoints</CardTitle>
                  <CardDescription>
                    RESTful API with consistent JSON responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Multi-tenant user management</li>
                    <li>• Real donation processing (Adyen)</li>
                    <li>• QR code generation & tracking</li>
                    <li>• Analytics & financial reporting</li>
                    <li>• AI chatbot integration</li>
                    <li>• Knowledge base management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication & Security</CardTitle>
                  <CardDescription>
                    Enterprise-grade security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Firebase ID token authentication</li>
                    <li>• 5-role access control system</li>
                    <li>• Multi-tenant data isolation</li>
                    <li>• CORS protection</li>
                    <li>• Real-time security monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 5-Role System */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">🎯 5-Role Access Control System</h2>
              <div className="grid md:grid-cols-5 gap-4 mb-8">
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Super Admin</CardTitle>
                    <CardDescription className="text-xs">Platform-wide access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-red-500 text-white text-xs">Full Access</Badge>
                    <p className="text-xs text-muted-foreground mt-2">All endpoints & operations</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Platform Admin</CardTitle>
                    <CardDescription className="text-xs">Cross-tenant management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-purple-500 text-white text-xs">Admin Level</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Multi-tenant operations</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Shelter Admin</CardTitle>
                    <CardDescription className="text-xs">Shelter-specific data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-blue-500 text-white text-xs">Tenant Access</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Shelter management</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Participant</CardTitle>
                    <CardDescription className="text-xs">Personal profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-green-500 text-white text-xs">User Access</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Own data & services</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Donor</CardTitle>
                    <CardDescription className="text-xs">Donation tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-orange-500 text-white text-xs">Donor Access</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Impact & donations</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* API Endpoints */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">📚 API Endpoints</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      Authentication (/auth)
                    </CardTitle>
                    <CardDescription>User registration, login, and role management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><code className="text-green-600">POST</code> /auth/register - Register new user</li>
                      <li><code className="text-blue-600">GET</code> /auth/profile - Get user profile</li>
                      <li><code className="text-orange-600">PUT</code> /auth/profile - Update profile</li>
                      <li><code className="text-blue-600">GET</code> /auth/users - List users (admin)</li>
                      <li><code className="text-orange-600">PUT</code> /auth/role/&#123;user_id&#125; - Update role</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-green-600" />
                      Analytics (/analytics)
                    </CardTitle>
                    <CardDescription>Platform and shelter analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><code className="text-blue-600">GET</code> /analytics/platform - Platform metrics</li>
                      <li><code className="text-blue-600">GET</code> /analytics/shelter/&#123;id&#125; - Shelter analytics</li>
                      <li><code className="text-blue-600">GET</code> /analytics/user/&#123;id&#125; - User analytics</li>
                      <li><code className="text-green-600">POST</code> /analytics/report - Custom reports</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-600" />
                      Services (/services)
                    </CardTitle>
                    <CardDescription>Shelter service management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><code className="text-blue-600">GET</code> /services/ - List services</li>
                      <li><code className="text-green-600">POST</code> /services/ - Create service</li>
                      <li><code className="text-orange-600">PUT</code> /services/&#123;id&#125; - Update service</li>
                      <li><code className="text-red-600">DELETE</code> /services/&#123;id&#125; - Delete service</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-orange-600" />
                      Donations (/donations)
                    </CardTitle>
                    <CardDescription>Donation processing and tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><code className="text-green-600">POST</code> /donations/create - Process donation</li>
                      <li><code className="text-blue-600">GET</code> /donations/&#123;id&#125; - Get donation</li>
                      <li><code className="text-blue-600">GET</code> /donations/participant/&#123;id&#125; - Participant donations</li>
                      <li><code className="text-blue-600">GET</code> /donations/donor/&#123;id&#125; - Donor history</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Quick Start</h3>
              <div className="bg-black rounded-lg p-4 mb-6">
                <code className="text-green-400 text-sm">
                  {`# Get user profile
curl -X GET "https://sheltr-api-714964620823.us-central1.run.app/auth/profile" \\
  -H "Authorization: Bearer <firebase-id-token>" \\
  -H "Content-Type: application/json"

# Standard API Response
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "timestamp": 1691827200.0
}`}
                </code>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Production Environment</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Base URL:</strong> <code className="text-blue-600">https://sheltr-api-714964620823.us-central1.run.app</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Authentication:</strong> Firebase ID tokens required for all endpoints
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Development Environment</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Base URL:</strong> <code className="text-blue-600">http://localhost:8000</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interactive documentation available at <code className="text-blue-600">/docs</code> endpoint
                  </p>
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