'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Smartphone, 
  QrCode, 
  DollarSign, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  FileText, 
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
  Home,
  Bus,
  Heart,
  BookOpen,
  Briefcase,
  ShoppingCart,
  Receipt,
  Wallet,
  Gift,
  Star,
  Zap
} from 'lucide-react';

export default function ParticipantUserJourney() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeStep, setActiveStep] = useState(1);

  const phases = [
    {
      id: 1,
      title: "Initial Onboarding",
      description: "Registration and wallet setup process",
      icon: User,
      steps: [
        {
          id: 1,
          title: "Registration Process",
          description: "Complete registration at shelter and create account",
          details: [
            "Arrive at participating shelter",
            "Meet with staff member",
            "Complete registration form with personal information",
            "Provide government ID and identification",
            "Sign consent forms and privacy agreements",
            "Have photo taken for profile",
            "Receive unique QR code",
            "Get 100 SHELTR-S welcome bonus ($100)",
            "Complete orientation session",
            "Account activated and ready to use"
          ],
          duration: "30-45 minutes",
          requirements: ["Government ID", "Consent forms", "Photo capture"]
        },
        {
          id: 2,
          title: "Wallet Setup & Training",
          description: "Download app and learn to use digital wallet",
          details: [
            "Download SHELTR mobile app",
            "Login using unique QR code",
            "Set up security PIN for wallet access",
            "Enable biometric authentication (fingerprint/face)",
            "View welcome bonus in wallet",
            "Learn basic wallet functions",
            "Practice making transactions",
            "Understand spending categories",
            "Learn about housing fund access",
            "Wallet ready for receiving donations"
          ],
          duration: "15-20 minutes",
          requirements: ["Smartphone", "Internet connection", "Biometric setup"]
        }
      ]
    },
    {
      id: 2,
      title: "Receiving Donations",
      description: "How donations flow to your wallet",
      icon: QrCode,
      steps: [
        {
          id: 1,
          title: "Donation Flow",
          description: "Understanding how donations are processed and distributed",
          details: [
            "Donor scans your unique QR code",
            "Donor selects donation amount",
            "Payment processed securely",
            "Smart contract executes automatically",
            "Funds distributed: 85% to your wallet, 10% to housing fund, 5% to shelter",
            "Your wallet balance updates instantly",
            "Notification received on your phone",
            "Send thank you message to donor",
            "Track impact of donation",
            "Plan how to use funds"
          ],
          duration: "Real-time",
          requirements: ["QR code", "Mobile app", "Internet connection"]
        },
        {
          id: 2,
          title: "Donation Management",
          description: "Managing and responding to donations",
          details: [
            "Receive notification for new donation",
            "View donation details and donor message",
            "Check updated wallet balance",
            "Send personalized thank you message",
            "Plan how to use the funds",
            "Track progress toward goals",
            "Build relationship with donor",
            "Update your story and progress",
            "Share success milestones",
            "Maintain donor connections"
          ],
          duration: "Ongoing",
          requirements: ["Communication skills", "Goal planning", "Progress tracking"]
        }
      ]
    },
    {
      id: 3,
      title: "Spending & Redemptions",
      description: "Using funds for essential needs",
      icon: DollarSign,
      steps: [
        {
          id: 1,
          title: "Essential Needs Spending",
          description: "Making purchases with your SHELTR-S tokens",
          details: [
            "Identify immediate need (food, housing, etc.)",
            "Check current wallet balance",
            "Select participating merchant or service",
            "Present your QR code to merchant",
            "Merchant scans code to process payment",
            "Amount deducted from wallet",
            "Transaction completed instantly",
            "Receipt generated automatically",
            "Balance updated in real-time",
            "Transaction history recorded"
          ],
          duration: "Instant",
          requirements: ["QR code", "Participating merchants", "Mobile app"]
        },
        {
          id: 2,
          title: "Housing Fund Access",
          description: "Accessing housing assistance funds",
          details: [
            "Identify housing need (rent, deposit, utilities)",
            "Contact case manager at shelter",
            "Complete housing application process",
            "Case manager reviews eligibility",
            "Approval decision made",
            "Funds released from housing fund",
            "Housing placement assistance",
            "Follow-up support provided",
            "Success tracking and monitoring",
            "Ongoing housing stability support"
          ],
          duration: "1-3 days",
          requirements: ["Case manager approval", "Housing application", "Eligibility criteria"]
        }
      ]
    },
    {
      id: 4,
      title: "Goal Setting & Progress",
      description: "Planning and tracking your journey",
      icon: Target,
      steps: [
        {
          id: 1,
          title: "Financial Planning",
          description: "Setting and achieving financial goals",
          details: [
            "Set short-term and long-term financial goals",
            "Create budget plan with case manager",
            "Track all income sources (donations, work, benefits)",
            "Monitor spending patterns and categories",
            "Adjust budget based on changing needs",
            "Save portion of funds for future goals",
            "Achieve financial milestones",
            "Update goals as circumstances change",
            "Plan for long-term financial stability",
            "Build emergency savings fund"
          ],
          duration: "Ongoing",
          requirements: ["Goal setting", "Budget planning", "Financial discipline"]
        },
        {
          id: 2,
          title: "Progress Tracking",
          description: "Monitoring your journey and achievements",
          details: [
            "Login to mobile app dashboard",
            "View financial goal progress",
            "Track housing stability progress",
            "Monitor employment status and income",
            "Record education achievements",
            "Document health improvements",
            "Share progress with support team",
            "Update case plan with achievements",
            "Celebrate milestones and successes",
            "Plan next steps and goals"
          ],
          duration: "Weekly",
          requirements: ["Regular check-ins", "Progress documentation", "Support team communication"]
        }
      ]
    }
  ];

  const currentPhase = phases.find(p => p.id === activePhase);
  const currentStep = currentPhase?.steps.find(s => s.id === activeStep);

  const spendingCategories = [
    { name: "Food & Nutrition", icon: ShoppingCart, description: "Groceries, restaurants, meal programs" },
    { name: "Housing", icon: Home, description: "Rent assistance, utilities, deposits" },
    { name: "Transportation", icon: Bus, description: "Public transit, rideshare, vehicle maintenance" },
    { name: "Healthcare", icon: Heart, description: "Medical expenses, prescriptions, dental care" },
    { name: "Education", icon: BookOpen, description: "Classes, books, training programs" },
    { name: "Employment", icon: Briefcase, description: "Work clothes, tools, certification fees" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <User className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Participant User Journey
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your complete guide to getting started and succeeding on SHELTR
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Welcome Bonus</p>
                    <p className="font-semibold">$100 SHELTR-S</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Setup Time</p>
                    <p className="font-semibold">30-45 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Direct Funds</p>
                    <p className="font-semibold">85% to You</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Support</p>
                    <p className="font-semibold">24/7 Available</p>
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
                  Your Journey
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
                      <currentPhase.icon className="h-8 w-8 text-green-600" />
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
                            <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
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

                {/* Spending Categories */}
                {activePhase === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                        Spending Categories
                      </CardTitle>
                      <CardDescription>
                        Use your SHELTR-S tokens for these essential needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {spendingCategories.map((category, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <category.icon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-sm">{category.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                          <h4 className="font-medium">Unique QR Code</h4>
                          <p className="text-sm text-gray-600">Easy way for donors to find and support you directly</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wallet className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Digital Wallet</h4>
                          <p className="text-sm text-gray-600">Secure, instant access to your funds anytime, anywhere</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Direct Connection</h4>
                          <p className="text-sm text-gray-600">Build relationships with donors and share your progress</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Goal Achievement</h4>
                          <p className="text-sm text-gray-600">Track progress and celebrate milestones on your journey</p>
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
