'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, FileText, MapPin, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function IRShelterResearchPage() {
  const researchDocuments = [
    {
      id: 'general-research',
      title: 'General Research',
      slug: 'general-research',
      description: 'Comprehensive overview of homeless shelter systems, HMIS implementation, and innovative programs',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'shelters-state-by-state',
      title: 'Shelters State by State',
      slug: 'shelters-state-by-state',
      description: 'Detailed analysis of homeless shelter infrastructure across all 50 US states',
      icon: MapPin,
      color: 'green'
    },
    {
      id: 'top-homeless-shelters-canada',
      title: 'Top Homeless Shelters Canada',
      slug: 'top-homeless-shelters-canada',
      description: 'Leading homeless shelters and innovative programs across Canadian provinces',
      icon: Building2,
      color: 'purple'
    },
    {
      id: 'unique-shelter-programs',
      title: 'Unique Shelter Programs',
      slug: 'unique-shelter-programs',
      description: 'Innovative and effective homeless shelter programs from around North America',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; text: string; bg: string; hover: string }> = {
      blue: {
        border: 'border-blue-400/50',
        text: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-500/10',
        hover: 'hover:border-blue-400 hover:shadow-blue-500/20'
      },
      green: {
        border: 'border-green-400/50',
        text: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-500/10',
        hover: 'hover:border-green-400 hover:shadow-green-500/20'
      },
      purple: {
        border: 'border-purple-400/50',
        text: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-500/10',
        hover: 'hover:border-purple-400 hover:shadow-purple-500/20'
      },
      orange: {
        border: 'border-orange-400/50',
        text: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-500/10',
        hover: 'hover:border-orange-400 hover:shadow-orange-500/20'
      }
    };
    return colors[color] || colors.blue;
  };

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
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
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
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Shelter Research Hub</h1>
                  <Badge className="bg-blue-500 text-white text-sm">RESEARCH</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, 
                  and innovative programs across North America
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Research Hub</span>
                  <span>•</span>
                  <span>4 Research Documents</span>
                  <span>•</span>
                  <Badge className="bg-purple-500 text-white text-xs">DATA & ANALYSIS</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Documents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Research Documents</h2>
              <p className="text-muted-foreground">
                Explore our comprehensive research on homeless shelter systems, innovative programs, 
                and state-by-state analysis across North America.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {researchDocuments.map((doc) => {
                const Icon = doc.icon;
                const colors = getColorClasses(doc.color);
                
                return (
                  <Link key={doc.id} href={`/ir/shelter-research/${doc.slug}`}>
                    <Card className={`border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-xl group cursor-pointer h-full`}>
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-4 rounded-full ${colors.bg}`}>
                            <Icon className={`h-8 w-8 ${colors.text}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl">{doc.title}</CardTitle>
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          {doc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View Research
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

