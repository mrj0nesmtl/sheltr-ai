'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Search, 
  QrCode, 
  DollarSign, 
  BarChart3, 
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
  Smartphone,
  Tablet,
  Monitor,
  Users,
  Eye,
  Share2,
  Gift,
  Star,
  Zap,
  Target,
  Receipt,
  Download,
  Settings,
  Bell,
  Users2,
  BookOpen,
  Video,
  MapPin as Location
} from 'lucide-react';

export default function DonorUserJourney() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeStep, setActiveStep] = useState(1);

  const phases = [
    {
      id: 1,
      title: "Discovery & Registration",
      description: "Learn about SHELTR and create your account",
      icon: Heart,
      steps: [
        {
          id: 1,
          title: "Platform Discovery",
          description: "Learn about SHELTR's mission and technology",
          details: [
            "Discover SHELTR through social media, search, or word of mouth",
            "Visit sheltr-ai.web.app to learn about the mission",
            "Read about blockchain transparency and impact",
            "View participant success stories and testimonials",
            "Understand the 85/10/5 fund distribution model",
            "Review platform security and verification processes",
            "Learn about QR code donation system",
            "Explore impact metrics and transparency reports",
            "Create free account to get started",
            "Complete profile setup and preferences"
          ],
          duration: "10-15 minutes",
          requirements: ["Internet connection", "Email address", "Basic information"]
        },
        {
          id: 2,
          title: "Account Setup",
          description: "Complete registration and configure preferences",
          details: [
            "Fill out registration form with personal information",
            "Verify email address and set up password",
            "Configure security preferences and two-factor authentication",
            "Add payment methods (credit card, bank account, crypto)",
            "Set donation preferences and frequency",
            "Choose privacy settings and communication preferences",
            "Complete welcome tutorial and platform overview",
            "Set up notification preferences",
            "Explore dashboard features",
            "Account ready for making donations"
          ],
          duration: "15-20 minutes",
          requirements: ["Valid payment method", "Email verification", "Security setup"]
        }
      ]
    },
    {
      id: 2,
      title: "Finding & Connecting",
      description: "Discover participants and build relationships",
      icon: Search,
      steps: [
        {
          id: 1,
          title: "Participant Discovery",
          description: "Browse and find participants to support",
          details: [
            "Browse participants by location or category",
            "Use search filters (veterans, families, youth, seniors)",
            "Read participant stories and personal narratives",
            "View progress updates and success metrics",
            "Check impact metrics and housing progress",
            "Review verified shelter partnerships",
            "Select participants that resonate with you",
            "Review detailed profiles and goals",
            "Understand participant needs and aspirations",
            "Prepare to make your first donation"
          ],
          duration: "5-10 minutes",
          requirements: ["Account access", "Location preferences", "Cause interests"]
        },
        {
          id: 2,
          title: "Connection Building",
          description: "Build meaningful relationships with participants",
          details: [
            "Read full participant stories and background",
            "View photos and personal updates",
            "Check current goals and progress status",
            "Review recent achievements and milestones",
            "Send personalized message to participant",
            "Receive response and build rapport",
            "Establish ongoing relationship",
            "Receive regular progress updates",
            "Share encouragement and support",
            "Maintain long-term connection"
          ],
          duration: "Ongoing",
          requirements: ["Communication skills", "Empathy", "Consistent engagement"]
        }
      ]
    },
    {
      id: 3,
      title: "Making Donations",
      description: "Donate securely and track your impact",
      icon: DollarSign,
      steps: [
        {
          id: 1,
          title: "Donation Process",
          description: "Complete secure donation transactions",
          details: [
            "Scan participant's unique QR code",
            "Select donation amount from preset options",
            "Add personalized message of encouragement",
            "Choose payment method (card, bank, crypto, mobile pay)",
            "Review transaction details and fees",
            "Confirm donation and authorize payment",
            "Payment processed securely through blockchain",
            "Smart contract executes fund distribution",
            "Receive immediate confirmation email",
            "Track real-time impact of your donation"
          ],
          duration: "2-3 minutes",
          requirements: ["QR code", "Payment method", "Internet connection"]
        },
        {
          id: 2,
          title: "Payment Methods",
          description: "Multiple secure payment options available",
          details: [
            "Credit/Debit Cards: Instant processing with security",
            "Bank Transfer (ACH): Lower fees, 2-3 day processing",
            "Cryptocurrency: Bitcoin, Ethereum, other major coins",
            "Mobile Pay: Apple Pay, Google Pay integration",
            "Recurring Donations: Set up automatic monthly giving",
            "Corporate Matching: Leverage employer programs",
            "Tax Documentation: Automatic receipt generation",
            "Payment History: Complete transaction records",
            "Security Features: Fraud protection and encryption",
            "Support: 24/7 payment assistance available"
          ],
          duration: "Instant to 3 days",
          requirements: ["Valid payment method", "Account verification", "Sufficient funds"]
        }
      ]
    },
    {
      id: 4,
      title: "Impact Tracking",
      description: "Monitor your donations and see real results",
      icon: BarChart3,
      steps: [
        {
          id: 1,
          title: "Real-Time Impact",
          description: "See immediate results of your donations",
          details: [
            "Receive immediate donation confirmation",
            "Track fund distribution: 85% to participant, 10% to housing, 5% to shelter",
            "See participant notification and thank you message",
            "Monitor housing fund growth and investment strategy",
            "Track shelter operational support impact",
            "View participant progress updates",
            "Receive success story notifications",
            "Monitor long-term impact metrics",
            "Track community-wide improvements",
            "See transparency reports and audits"
          ],
          duration: "Real-time",
          requirements: ["Account access", "Notification preferences", "Regular check-ins"]
        },
        {
          id: 2,
          title: "Ongoing Engagement",
          description: "Stay connected and involved in the community",
          details: [
            "Receive regular progress reports from participants",
            "Read success stories and transformation updates",
            "View impact metrics and outcome data",
            "Access financial transparency reports",
            "Participate in community events and meetups",
            "Join volunteer opportunities and programs",
            "Engage in advocacy campaigns and awareness",
            "Attend educational content and webinars",
            "Network with other donors and supporters",
            "Contribute to continued platform growth"
          ],
          duration: "Ongoing",
          requirements: ["Active engagement", "Community participation", "Regular updates"]
        }
      ]
    },
    {
      id: 5,
      title: "Advanced Features",
      description: "Access advanced tools and community features",
      icon: Settings,
      steps: [
        {
          id: 1,
          title: "Donor Dashboard",
          description: "Comprehensive dashboard for managing your giving",
          details: [
            "View complete donation history and records",
            "Track impact metrics and participant progress",
            "Manage recurring donations and payment methods",
            "Download tax receipts and documentation",
            "Share success stories on social media",
            "Invite friends and family to join",
            "Participate in fundraising campaigns",
            "Set giving goals and track progress",
            "Access donor-only content and updates",
            "Connect with other donors in the community"
          ],
          duration: "Real-time",
          requirements: ["Account access", "Regular usage", "Community engagement"]
        },
        {
          id: 2,
          title: "Community Building",
          description: "Connect with other donors and build community",
          details: [
            "Join donor forums and discussion groups",
            "Share success stories and experiences",
            "Coordinate volunteer activities and events",
            "Participate in advocacy and awareness campaigns",
            "Access educational content and resources",
            "Attend networking events and meetups",
            "Contribute to impact reporting and feedback",
            "Help shape platform development and features",
            "Mentor new donors and share best practices",
            "Build lasting relationships and community"
          ],
          duration: "Ongoing",
          requirements: ["Community participation", "Regular engagement", "Sharing mindset"]
        }
      ]
    }
  ];

  const currentPhase = phases.find(p => p.id === activePhase);
  const currentStep = currentPhase?.steps.find(s => s.id === activeStep);

  const donationOptions = [
    { name: "One-time", icon: Gift, description: "Immediate donations of any amount" },
    { name: "Recurring", icon: Calendar, description: "Monthly, quarterly, or annual commitments" },
    { name: "Campaign", icon: Target, description: "Special fundraising events or causes" },
    { name: "Matching", icon: Users2, description: "Corporate matching programs" },
    { name: "Crypto", icon: Zap, description: "Bitcoin, Ethereum, or other cryptocurrencies" }
  ];

  const discoveryChannels = [
    { name: "Social Media", icon: Share2, description: "Facebook, Instagram, Twitter campaigns" },
    { name: "Word of Mouth", icon: Users, description: "Friend recommendations, community events" },
    { name: "Search Engines", icon: Search, description: "SEO-optimized content, targeted ads" },
    { name: "Partnerships", icon: Globe, description: "Corporate sponsorships, community organizations" },
    { name: "Traditional Media", icon: Video, description: "News coverage, radio interviews" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Donor User Journey
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your complete guide to making a difference through transparent, impactful giving
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Transparency</p>
                    <p className="font-semibold">100% Visible</p>
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
                    <p className="font-semibold">15-20 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Direct Impact</p>
                    <p className="font-semibold">85% to Participant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tax Benefits</p>
                    <p className="font-semibold">Deductible</p>
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
                      <currentPhase.icon className="h-8 w-8 text-red-600" />
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
                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
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

                {/* Donation Options */}
                {activePhase === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-blue-600" />
                        Donation Options
                      </CardTitle>
                      <CardDescription>
                        Multiple ways to give and make an impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {donationOptions.map((option, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <option.icon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-sm">{option.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Discovery Channels */}
                {activePhase === 1 && activeStep === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-blue-600" />
                        Discovery Channels
                      </CardTitle>
                      <CardDescription>
                        How donors discover and learn about SHELTR
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {discoveryChannels.map((channel, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <channel.icon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-sm">{channel.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{channel.description}</p>
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
                        <Eye className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium">100% Transparency</h4>
                          <p className="text-sm text-gray-600">See exactly how your donation helps through blockchain tracking</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <QrCode className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Direct Connection</h4>
                          <p className="text-sm text-gray-600">Connect directly with participants and build meaningful relationships</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Real-time Impact</h4>
                          <p className="text-sm text-gray-600">Track the immediate and long-term impact of your donations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Receipt className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Tax Benefits</h4>
                          <p className="text-sm text-gray-600">Receive automatic tax receipts and documentation</p>
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
