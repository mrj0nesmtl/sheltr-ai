'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  FileText, 
  Settings,
  QrCode,
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Banknote,
  Smartphone,
  Tablet,
  Monitor,
  ChevronRight,
  Home
} from 'lucide-react';

export default function ShelterUserJourney() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeStep, setActiveStep] = useState(1);

  const phases = [
    {
      id: 1,
      title: "Organization Onboarding",
      description: "Complete registration and platform setup",
      icon: Building2,
      steps: [
        {
          id: 1,
          title: "Initial Registration",
          description: "Visit website and complete registration form",
          details: [
            "Visit sheltr-ai.web.app",
            "Click 'Organization Sign Up'",
            "Enter organization details (name, address, contact info, tax ID)",
            "Upload documentation (501(c)(3) status, licenses, insurance)",
            "Verification process (2-5 business days)",
            "Account approval and welcome email"
          ],
          duration: "2-5 business days",
          requirements: ["501(c)(3) status", "Operating licenses", "Insurance certificates"]
        },
        {
          id: 2,
          title: "Platform Setup",
          description: "Configure organization settings and staff accounts",
          details: [
            "Complete profile setup (mission statement, service areas)",
            "Configure organization settings",
            "Set up staff accounts with role-based access",
            "Customize branding (logo, colors, messaging)",
            "Configure payment methods and withdrawal preferences",
            "Set up analytics preferences and complete tutorial"
          ],
          duration: "1-2 hours",
          requirements: ["Staff information", "Bank account details", "Branding assets"]
        }
      ]
    },
    {
      id: 2,
      title: "Participant Management",
      description: "Onboard and support participants",
      icon: Users,
      steps: [
        {
          id: 1,
          title: "Participant Onboarding",
          description: "Register new participants and set up their accounts",
          details: [
            "Staff login to dashboard",
            "Navigate to 'Add Participant'",
            "Complete participant information form",
            "Obtain consent and privacy agreements",
            "Capture/upload participant photo",
            "Generate unique QR code",
            "Distribute 100 SHELTR-S welcome bonus ($100)",
            "Conduct orientation session"
          ],
          duration: "30-45 minutes per participant",
          requirements: ["Government ID", "Consent forms", "Photo capture"]
        },
        {
          id: 2,
          title: "Ongoing Support",
          description: "Provide continuous support and assistance",
          details: [
            "Handle wallet issues and technical support",
            "Answer donation and transaction questions",
            "Provide housing assistance and guidance",
            "Monitor progress and adjust support plans",
            "Document interactions and follow-ups"
          ],
          duration: "Ongoing",
          requirements: ["Staff training", "Support protocols", "Documentation systems"]
        }
      ]
    },
    {
      id: 3,
      title: "Financial Management",
      description: "Manage donations and revenue",
      icon: DollarSign,
      steps: [
        {
          id: 1,
          title: "Donation Processing",
          description: "Smart contract processing and fund distribution",
          details: [
            "Donation received and processed",
            "Smart contract execution",
            "Fund distribution: 85% to participant, 10% to housing fund, 5% to shelter operations",
            "Automatic wallet updates",
            "Notification system activation",
            "Investment strategy for housing fund"
          ],
          duration: "Real-time",
          requirements: ["Smart contract integration", "Wallet management", "Notification system"]
        },
        {
          id: 2,
          title: "Revenue Management",
          description: "Track and manage multiple income sources",
          details: [
            "Monthly revenue reporting",
            "Participant onboarding fees",
            "5% operations support from donations",
            "Platform service fees",
            "Government contracts and grants",
            "Budget allocation and planning"
          ],
          duration: "Monthly",
          requirements: ["Financial tracking", "Budget planning", "Reporting tools"]
        }
      ]
    },
    {
      id: 4,
      title: "Analytics & Reporting",
      description: "Monitor performance and impact",
      icon: BarChart3,
      steps: [
        {
          id: 1,
          title: "Real-Time Dashboard",
          description: "Access key metrics and performance indicators",
          details: [
            "Active participants count and engagement rates",
            "Total donations and average amounts",
            "Participant success stories and outcomes",
            "Revenue trends and financial performance",
            "Impact metrics and housing success rates",
            "Export reports and share with stakeholders"
          ],
          duration: "Real-time",
          requirements: ["Analytics platform", "Data integration", "Reporting tools"]
        }
      ]
    }
  ];

  const currentPhase = phases.find(p => p.id === activePhase);
  const currentStep = currentPhase?.steps.find(s => s.id === activeStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/solutions" className="hover:text-primary transition-colors">
              Solutions
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary font-medium">Shelter & NGO Journey</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Shelter & NGO User Journey
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Complete guide to onboarding and managing your organization on SHELTR
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Setup Time</p>
                    <p className="font-semibold">2-5 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Verification</p>
                    <p className="font-semibold">Required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Revenue Model</p>
                    <p className="font-semibold">5% + Fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Impact Tracking</p>
                    <p className="font-semibold">Real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Phase Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Journey Phases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phases.map((phase) => (
                  <div key={phase.id}>
                    <Button
                      variant={activePhase === phase.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => {
                        setActivePhase(phase.id);
                        setActiveStep(1);
                      }}
                    >
                      <div className="flex items-start gap-3 text-left">
                        <phase.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{phase.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {phase.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                    {activePhase === phase.id && (
                      <div className="ml-8 mt-2 space-y-1">
                        {phase.steps.map((step) => (
                          <Button
                            key={step.id}
                            variant={activeStep === step.id ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => setActiveStep(step.id)}
                          >
                            {step.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentPhase && currentStep && (
              <div className="space-y-6">
                {/* Phase Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <currentPhase.icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-2xl">{currentPhase.title}</CardTitle>
                        <CardDescription className="text-lg">{currentPhase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Step Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Step {currentStep.id}: {currentStep.title}</CardTitle>
                        <CardDescription className="text-base mt-2">{currentStep.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {currentStep.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Process Flow */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Process Flow
                      </h4>
                      <div className="space-y-3">
                        {currentStep.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <p className="text-sm">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.requirements.map((requirement, index) => (
                          <Badge key={index} variant="secondary">
                            {requirement}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        disabled={activeStep === 1 && activePhase === 1}
                        onClick={() => {
                          if (activeStep > 1) {
                            setActiveStep(activeStep - 1);
                          } else if (activePhase > 1) {
                            const prevPhase = phases.find(p => p.id === activePhase - 1);
                            setActivePhase(activePhase - 1);
                            setActiveStep(prevPhase?.steps.length || 1);
                          }
                        }}
                      >
                        Previous Step
                      </Button>
                      <Button
                        onClick={() => {
                          const currentPhaseData = phases.find(p => p.id === activePhase);
                          if (activeStep < (currentPhaseData?.steps.length || 1)) {
                            setActiveStep(activeStep + 1);
                          } else if (activePhase < phases.length) {
                            setActivePhase(activePhase + 1);
                            setActiveStep(1);
                          }
                        }}
                        disabled={activeStep === (currentPhase?.steps.length || 1) && activePhase === phases.length}
                      >
                        Next Step
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Key Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <QrCode className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium">QR Code System</h4>
                          <p className="text-sm text-gray-600">Easy participant identification and donation processing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Direct Communication</h4>
                          <p className="text-sm text-gray-600">Connect donors with participants through the platform</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Revenue Growth</h4>
                          <p className="text-sm text-gray-600">Multiple income streams and transparent fund distribution</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Real-time Analytics</h4>
                          <p className="text-sm text-gray-600">Track impact, donations, and participant progress</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
