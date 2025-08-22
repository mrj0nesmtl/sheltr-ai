'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  BarChart3, 
  DollarSign, 
  Users, 
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
  Phone,
  Mail,
  Globe,
  CreditCard,
  Banknote,
  Smartphone,
  Tablet,
  Monitor,
  ChevronRight,
  Home,
  Building2,
  Handshake,
  Eye,
  Target,
  Database,
  Network,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Star,
  Lock,
  Unlock,
  Download,
  Upload,
  Share2,
  Users2,
  Briefcase,
  Flag,
  AlertTriangle,
  CheckSquare,
  FileCheck,
  ClipboardList,
  Presentation,
  BookOpen,
  Lightbulb,
  Compass,
  Layers
} from 'lucide-react';

export default function GovernmentUserJourney() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeStep, setActiveStep] = useState(1);

  const phases = [
    {
      id: 1,
      title: "Agency Onboarding",
      description: "Registration and platform access setup",
      icon: MapPin,
      steps: [
        {
          id: 1,
          title: "Agency Registration",
          description: "Complete government agency registration and verification",
          details: [
            "Contact SHELTR government relations team",
            "Complete agency registration form with official details",
            "Provide government credentials and verification documents",
            "Submit department/agency information and contact details",
            "Agree to data sharing and privacy protocols",
            "Receive platform access credentials",
            "Complete security training and compliance review",
            "Account activation and welcome orientation"
          ],
          duration: "5-10 business days",
          requirements: ["Government credentials", "Official documentation", "Security clearance"]
        },
        {
          id: 2,
          title: "Platform Configuration",
          description: "Set up agency-specific dashboards and access levels",
          details: [
            "Configure agency-specific dashboard views",
            "Set up user roles and access permissions",
            "Define data access levels and restrictions",
            "Configure reporting and analytics preferences",
            "Set up notification and alert systems",
            "Establish data sharing protocols",
            "Configure integration with existing systems",
            "Complete platform training and documentation"
          ],
          duration: "2-3 days",
          requirements: ["IT department coordination", "Security protocols", "System integration"]
        }
      ]
    },
    {
      id: 2,
      title: "Data Access & Analytics",
      description: "Access comprehensive homelessness data and insights",
      icon: BarChart3,
      steps: [
        {
          id: 1,
          title: "Regional Data Access",
          description: "Access comprehensive regional homelessness data",
          details: [
            "View real-time homelessness statistics by region",
            "Access demographic breakdowns and trends",
            "Monitor shelter capacity and utilization rates",
            "Track participant outcomes and success metrics",
            "Analyze donation patterns and fund distribution",
            "Review housing placement and stability rates",
            "Access employment and education outcomes",
            "Monitor health and wellness indicators"
          ],
          duration: "Real-time",
          requirements: ["Authorized access", "Data privacy training", "Analytics tools"]
        },
        {
          id: 2,
          title: "Policy Insights & Trends",
          description: "Generate insights for policy development and decision making",
          details: [
            "Identify regional homelessness trends and patterns",
            "Analyze effectiveness of current programs and services",
            "Generate predictive models for resource planning",
            "Assess impact of policy changes and interventions",
            "Compare performance across different regions",
            "Identify gaps in service delivery and coverage",
            "Track progress toward policy goals and objectives",
            "Generate evidence-based policy recommendations"
          ],
          duration: "Daily updates",
          requirements: ["Analytics expertise", "Policy knowledge", "Data interpretation skills"]
        }
      ]
    },
    {
      id: 3,
      title: "Budget Transparency",
      description: "Track public fund allocation and measure impact",
      icon: DollarSign,
      steps: [
        {
          id: 1,
          title: "Fund Allocation Tracking",
          description: "Monitor how public funds are allocated and spent",
          details: [
            "Track public fund distribution across regions",
            "Monitor allocation to different service providers",
            "Analyze fund utilization and efficiency metrics",
            "Track participant outcomes per dollar spent",
            "Monitor administrative costs and overhead",
            "Compare funding effectiveness across programs",
            "Track return on investment for different interventions",
            "Generate transparency reports for public review"
          ],
          duration: "Real-time",
          requirements: ["Financial data access", "Budget tracking tools", "Reporting capabilities"]
        },
        {
          id: 2,
          title: "Impact Measurement",
          description: "Measure and report on the impact of public investments",
          details: [
            "Calculate cost per participant served",
            "Measure reduction in homelessness rates",
            "Track housing stability and employment outcomes",
            "Assess long-term cost savings and benefits",
            "Compare outcomes across different funding models",
            "Generate impact reports for stakeholders",
            "Track progress toward policy objectives",
            "Identify areas for funding optimization"
          ],
          duration: "Monthly",
          requirements: ["Impact measurement tools", "Data analysis capabilities", "Reporting systems"]
        }
      ]
    },
    {
      id: 4,
      title: "Multi-Agency Coordination",
      description: "Collaborate across departments and agencies",
      icon: Users,
      steps: [
        {
          id: 1,
          title: "Inter-Agency Collaboration",
          description: "Coordinate efforts across multiple government departments",
          details: [
            "Share data and insights with partner agencies",
            "Coordinate service delivery across departments",
            "Align policy objectives and implementation strategies",
            "Share best practices and successful interventions",
            "Coordinate funding and resource allocation",
            "Establish joint monitoring and evaluation frameworks",
            "Facilitate cross-agency communication and coordination",
            "Develop integrated service delivery models"
          ],
          duration: "Ongoing",
          requirements: ["Inter-agency agreements", "Data sharing protocols", "Coordination tools"]
        },
        {
          id: 2,
          title: "Stakeholder Engagement",
          description: "Engage with community partners and stakeholders",
          details: [
            "Share insights with community organizations",
            "Engage with advocacy groups and service providers",
            "Facilitate public-private partnerships",
            "Coordinate with academic and research institutions",
            "Engage with media and public communication",
            "Facilitate community feedback and input",
            "Coordinate emergency response and crisis management",
            "Develop community engagement strategies"
          ],
          duration: "Ongoing",
          requirements: ["Stakeholder management", "Communication tools", "Partnership frameworks"]
        }
      ]
    },
    {
      id: 5,
      title: "Policy Development",
      description: "Develop and implement evidence-based policies",
      icon: FileText,
      steps: [
        {
          id: 1,
          title: "Evidence-Based Policy Making",
          description: "Use data and insights to inform policy development",
          details: [
            "Analyze data to identify policy gaps and opportunities",
            "Develop evidence-based policy recommendations",
            "Model potential impacts of policy changes",
            "Engage stakeholders in policy development process",
            "Draft policy proposals with supporting evidence",
            "Conduct cost-benefit analysis of policy options",
            "Develop implementation strategies and timelines",
            "Establish monitoring and evaluation frameworks"
          ],
          duration: "3-6 months",
          requirements: ["Policy expertise", "Data analysis", "Stakeholder engagement"]
        },
        {
          id: 2,
          title: "Implementation & Monitoring",
          description: "Implement policies and monitor their effectiveness",
          details: [
            "Implement approved policies and programs",
            "Monitor implementation progress and challenges",
            "Track policy outcomes and effectiveness",
            "Adjust implementation strategies as needed",
            "Evaluate policy impact and success metrics",
            "Generate implementation reports and updates",
            "Share lessons learned and best practices",
            "Plan for policy refinement and improvement"
          ],
          duration: "Ongoing",
          requirements: ["Implementation expertise", "Monitoring tools", "Evaluation frameworks"]
        }
      ]
    }
  ];

  const currentPhase = phases.find(p => p.id === activePhase);
  const currentStep = currentPhase?.steps.find(s => s.id === activeStep);

  const dataAccessCategories = [
    { name: "Regional Statistics", icon: BarChart3, description: "Real-time homelessness data by region" },
    { name: "Demographic Analysis", icon: PieChart, description: "Detailed demographic breakdowns and trends" },
    { name: "Service Utilization", icon: Activity, description: "Shelter capacity and service usage metrics" },
    { name: "Outcome Tracking", icon: Target, description: "Participant success and stability rates" },
    { name: "Financial Transparency", icon: DollarSign, description: "Fund allocation and spending analysis" },
    { name: "Policy Impact", icon: TrendingUp, description: "Effectiveness of policy interventions" }
  ];

  const collaborationTools = [
    { name: "Data Sharing", icon: Share2, description: "Secure inter-agency data sharing protocols" },
    { name: "Joint Planning", icon: Calendar, description: "Coordinated planning and resource allocation" },
    { name: "Communication", icon: MessageSquare, description: "Multi-agency communication platforms" },
    { name: "Monitoring", icon: Eye, description: "Shared monitoring and evaluation frameworks" },
    { name: "Reporting", icon: FileCheck, description: "Integrated reporting and analytics" },
    { name: "Stakeholder Engagement", icon: Users2, description: "Community and partner engagement tools" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <span className="text-primary font-medium">Government Journey</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Government Agency User Journey
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Complete guide to data-driven policy making and budget transparency
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Security Level</p>
                    <p className="font-semibold">Government Grade</p>
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
                    <p className="font-semibold">5-10 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Data Access</p>
                    <p className="font-semibold">Real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Compliance</p>
                    <p className="font-semibold">Full Audit Trail</p>
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
                      <currentPhase.icon className="h-8 w-8 text-purple-600" />
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
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
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

                {/* Data Access Categories */}
                {activePhase === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        Data Access Categories
                      </CardTitle>
                      <CardDescription>
                        Comprehensive data and analytics available to government agencies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataAccessCategories.map((category, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <category.icon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
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

                {/* Collaboration Tools */}
                {activePhase === 4 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5 text-blue-600" />
                        Collaboration Tools
                      </CardTitle>
                      <CardDescription>
                        Tools and platforms for multi-agency coordination
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collaborationTools.map((tool, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <tool.icon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-sm">{tool.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
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
                        <BarChart3 className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Data-Driven Decisions</h4>
                          <p className="text-sm text-gray-600">Make evidence-based policy decisions with real-time data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Eye className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Budget Transparency</h4>
                          <p className="text-sm text-gray-600">Track public fund allocation and measure impact</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Multi-Agency Coordination</h4>
                          <p className="text-sm text-gray-600">Coordinate efforts across departments and agencies</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Security & Compliance</h4>
                          <p className="text-sm text-gray-600">Government-grade security with full audit trails</p>
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
