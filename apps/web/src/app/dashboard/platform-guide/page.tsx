"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Shield, 
  Users, 
  Building2, 
  DollarSign, 
  BarChart3,
  MessageSquare,
  Camera,
  Brain,
  FileText,
  Mail,
  Heart,
  Settings,
  Bell,
  Cog,
  Home,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function PlatformGuide() {
  const sections = [
    {
      title: "Overview & Navigation",
      icon: Home,
      color: "bg-blue-500",
      features: [
        {
          name: "Platform Overview Dashboard",
          path: "/dashboard",
          icon: Home,
          description: "Your central command center showing key platform metrics, recent activity, and system health.",
          keyFeatures: ["Real-time platform statistics", "Recent user activity", "System alerts", "Quick action buttons"]
        }
      ]
    },
    {
      title: "User & Communication Management", 
      icon: Users,
      color: "bg-green-500",
      features: [
        {
          name: "User Management",
          path: "/dashboard/users",
          icon: Users,
          description: "Comprehensive user account management with role-based access control.",
          keyFeatures: ["View all users except Super Admins", "Manage user roles and permissions", "Export user data to CSV", "Filter by role and activity status"]
        },
        {
          name: "Contact Inquiries",
          path: "/dashboard/contact-inquiries", 
          icon: Mail,
          description: "Centralized management of all contact form submissions and inquiries.",
          keyFeatures: ["View all contact submissions", "Add notes and track responses", "Export inquiries to CSV", "Filter by status and date"]
        },
        {
          name: "Notifications Center",
          path: "/dashboard/notifications",
          icon: Bell,
          description: "Stay informed about platform activities, user actions, and system events.",
          keyFeatures: ["Real-time notifications", "NDA signature alerts", "Security notifications", "Platform activity updates"]
        }
      ]
    },
    {
      title: "Platform Operations",
      icon: Building2,
      color: "bg-purple-500", 
      features: [
        {
          name: "Platform Management",
          path: "/dashboard/platform",
          icon: Settings,
          description: "Core platform configuration and operational oversight.",
          keyFeatures: ["System configuration", "Platform-wide settings", "Operational metrics", "Health monitoring"]
        },
        {
          name: "Shelter Network",
          path: "/dashboard/shelters",
          icon: Building2,
          description: "Comprehensive shelter directory and onboarding management.",
          keyFeatures: ["View all shelters", "Shelter onboarding", "Capacity management", "Interactive shelter map"]
        },
        {
          name: "System Settings",
          path: "/dashboard/settings",
          icon: Cog,
          description: "Advanced platform settings and system configuration.",
          keyFeatures: ["AI chatbot settings", "Knowledge base configuration", "Platform metrics", "System health monitoring"]
        },
        {
          name: "Security & Compliance",
          path: "/dashboard/security",
          icon: Shield,
          description: "Security monitoring, access logs, and compliance management.",
          keyFeatures: ["Access logs", "Security incidents", "Compliance status", "Vulnerability monitoring"]
        }
      ]
    },
    {
      title: "Financial & Analytics",
      icon: DollarSign,
      color: "bg-orange-500",
      features: [
        {
          name: "Financial Oversight", 
          path: "/dashboard/financial",
          icon: DollarSign,
          description: "Monitor all financial transactions, SmartFund distribution, and revenue analytics.",
          keyFeatures: ["Transaction monitoring", "SmartFund analytics", "Revenue tracking", "Fraud detection", "Audit trail"]
        },
        {
          name: "Analytics Dashboard",
          path: "/dashboard/analytics",
          icon: BarChart3,
          description: "Comprehensive platform analytics and business intelligence.",
          keyFeatures: ["User growth analytics", "Geographic distribution", "Donation trends", "Platform performance metrics"]
        },
        {
          name: "My Giving",
          path: "/dashboard/donor",
          icon: Heart,
          description: "Track your personal donations and impact as a Platform Administrator.",
          keyFeatures: ["Personal donation history", "Impact tracking", "Donation receipts", "Giving analytics"]
        }
      ]
    },
    {
      title: "Content & Knowledge Management",
      icon: Brain,
      color: "bg-indigo-500",
      features: [
        {
          name: "Knowledge Base",
          path: "/dashboard/knowledge",
          icon: Brain,
          description: "Manage AI knowledge base documents, embeddings, and chatbot training data.",
          keyFeatures: ["Document management", "GitHub sync", "AI embeddings", "Quality scoring", "Chatbot training"]
        },
        {
          name: "Blog Management",
          path: "/dashboard/blog",
          icon: FileText,
          description: "Create, edit, and manage blog posts for SEO and content marketing.",
          keyFeatures: ["Blog post creation", "SEO optimization", "Content scheduling", "Category management"]
        },
        {
          name: "Gallery Management",
          path: "/dashboard/gallery",
          icon: Camera,
          description: "Manage public gallery images, hero images, and visual content.",
          keyFeatures: ["Image upload and management", "Hero image selection", "Drag-and-drop reordering", "Image privacy controls"]
        },
        {
          name: "Chatbot Control",
          path: "/dashboard/chatbots",
          icon: MessageSquare,
          description: "Advanced AI chatbot configuration and conversation management.",
          keyFeatures: ["Agent configuration", "Conversation monitoring", "MCP tool management", "Response optimization"]
        }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-10 w-10 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Platform Administration Guide
          </h1>
          <Shield className="h-10 w-10 text-purple-600 ml-4" />
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
          Comprehensive guide to SHELTR-AI platform administration. This guide covers all features available 
          to Platform Administrators and provides detailed instructions for effective platform management.
        </p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            NDA Required
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Shield className="h-3 w-3 mr-1" />
            Platform Admin Only
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <BookOpen className="h-3 w-3 mr-1" />
            Comprehensive Guide
          </Badge>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Quick Access Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sections.map((section, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => document.getElementById(section.title.toLowerCase().replace(/\s+/g, '-'))?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className={`p-2 rounded-lg ${section.color} text-white`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{section.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Important Platform Administrator Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-orange-700 dark:text-orange-300">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Dual Role Access</p>
                <p className="text-sm">As a Platform Administrator, you may also have Donor privileges. Your activities will be tracked in both roles across relevant dashboards.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">NDA Compliance</p>
                <p className="text-sm">Access to this guide and Platform Administrator features requires a signed Non-Disclosure Agreement. All activities are logged for compliance.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">User Hierarchy</p>
                <p className="text-sm">You can manage Shelter Admins, Participants, and Donors, but cannot view or modify Super Admin accounts.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} id={section.title.toLowerCase().replace(/\s+/g, '-')}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className={`p-3 rounded-lg ${section.color} text-white mr-4`}>
                  <section.icon className="h-6 w-6" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {section.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <feature.icon className="h-5 w-5 mr-3 text-blue-600" />
                          {feature.name}
                        </CardTitle>
                        <Link href={feature.path}>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Dashboard
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {feature.description}
                      </p>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-gray-900 dark:text-gray-100">Key Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {feature.keyFeatures.map((keyFeature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{keyFeature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Support Section */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
            <MessageSquare className="h-5 w-5 mr-2" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MessageSquare className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">AI Assistant</p>
                <p className="text-sm">Use the AI chatbot (available on every dashboard page) for instant help with platform features and questions.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Support Contact</p>
                <p className="text-sm">For technical issues or questions not covered in this guide, contact: <strong>joel@arcanaconcept.com</strong></p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Documentation</p>
                <p className="text-sm">Visit our comprehensive documentation hub at <Link href="/docs" className="underline hover:text-blue-600">/docs</Link> for additional resources.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Last Updated: September 22, 2025 | SHELTR-AI Platform Administration Guide v1.0
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          This guide is confidential and intended only for authorized Platform Administrators who have signed the required NDA.
        </p>
      </div>
    </div>
  );
}
