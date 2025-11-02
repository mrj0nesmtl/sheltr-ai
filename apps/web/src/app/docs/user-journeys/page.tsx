'use client';

import Link from 'next/link';
import { 
  Building2, 
  Heart, 
  Landmark,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  Home,
  ChevronRight,
  FileText,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function UserJourneysHub() {
  const journeys = [
    {
      title: "Shelter Organizations",
      description: "Complete journey from registration to ongoing operations for shelter partners",
      icon: Building2,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/docs/user-journeys/shelters",
      phases: [
        "Organization Onboarding",
        "Participant Management",
        "Daily Operations",
        "Growth & Optimization"
      ],
      keyFeatures: [
        "Multi-tenant dashboard",
        "QR code generation",
        "Real-time analytics",
        "Participant verification"
      ]
    },
    {
      title: "Donors & Contributors",
      description: "From first donation to becoming an engaged community member",
      icon: Heart,
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      href: "/docs/user-journeys/donors",
      phases: [
        "Discovery",
        "First Donation",
        "Engagement",
        "Community Building"
      ],
      keyFeatures: [
        "Instant QR donations",
        "Impact tracking",
        "Social features",
        "Tax receipts"
      ]
    },
    {
      title: "Government Partners",
      description: "Stakeholder engagement from evaluation to strategic partnership",
      icon: Landmark,
      color: "purple",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      href: "/docs/user-journeys/government",
      phases: [
        "Initial Evaluation",
        "Pilot Program",
        "Integration",
        "Strategic Partnership"
      ],
      keyFeatures: [
        "Impact analytics",
        "Compliance reporting",
        "Data transparency",
        "Policy integration"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/docs" className="flex items-center space-x-3">
              <ThemeLogo />
              <div>
                <h1 className="text-xl font-bold">User Journeys</h1>
                <p className="text-sm text-muted-foreground">Stakeholder Experience Mapping</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Interactive Guides
              </Badge>
              <Badge variant="outline" className="text-xs">
                Updated: November 2, 2025
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted p-1 h-auto"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted px-2 py-1 h-auto"
            >
              <Link href="/docs">
                Documentation
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              User Journeys
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="h-8 w-8 text-purple-600" />
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                USER EXPERIENCE
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stakeholder User Journeys
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Comprehensive end-to-end experience mapping for shelters, donors, and government partners. 
              Explore how each stakeholder interacts with the SHELTR platform from initial discovery to ongoing engagement.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardHeader>
                <Target className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Phase-by-Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown of each journey stage with clear milestones and success metrics
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Timeline Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Realistic timeframes and touchpoints from initial contact to full platform integration
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Success Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clear KPIs and measurement criteria for tracking stakeholder engagement and satisfaction
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Journey Cards */}
      <section className="py-12 px-4 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore User Journeys</h2>
          
          <div className="space-y-8">
            {journeys.map((journey, index) => (
              <Card 
                key={index} 
                className={`${journey.borderColor} hover:shadow-lg transition-all duration-300`}
              >
                <CardHeader className={`bg-gradient-to-r ${journey.bgGradient} rounded-t-lg`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${journey.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <journey.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{journey.title}</CardTitle>
                        <CardDescription className="text-base">
                          {journey.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Journey Phases */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className={`h-4 w-4 text-${journey.color}-600`} />
                        Journey Phases
                      </h4>
                      <ul className="space-y-2">
                        {journey.phases.map((phase, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{phase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className={`h-4 w-4 text-${journey.color}-600`} />
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {journey.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      asChild 
                      size="lg"
                      className={`bg-gradient-to-r ${journey.gradient} hover:opacity-90 text-white`}
                    >
                      <Link href={journey.href} className="flex items-center gap-2">
                        Explore Journey
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Each journey is designed to provide clarity, reduce friction, and ensure successful 
            outcomes for every stakeholder in the SHELTR ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/login" className="flex items-center gap-2">
                Visit Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link href="/docs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Browse Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

