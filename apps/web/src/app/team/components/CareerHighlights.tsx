'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';

interface CareerHighlight {
  id: string;
  title: string;
  organization: string;
  description: string;
  year: string;
  logo?: string;
  link?: string;
}

interface CareerHighlightsProps {
  highlights: CareerHighlight[];
}

export default function CareerHighlights({ highlights }: CareerHighlightsProps) {
  // Sort by year (most recent first)
  const sortedHighlights = [...highlights].sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    return yearB - yearA;
  });

  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Career Highlights
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A journey of innovation, disruption, and impact across multiple industries
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 rounded-full" />

        <div className="space-y-12">
          {sortedHighlights.map((highlight, index) => (
            <div 
              key={highlight.id}
              className={`relative flex items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 w-8 h-8 -ml-4 bg-white dark:bg-slate-900 border-4 border-emerald-500 rounded-full z-10 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              {/* Spacer for mobile */}
              <div className="w-16 md:hidden" />

              {/* Content Card */}
              <Card className={`flex-1 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} border-2 hover:shadow-xl transition-all group`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge className="mb-3 bg-emerald-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {highlight.year}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                        {highlight.title}
                      </h3>
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-3">
                        {highlight.organization}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>

                    {/* Logo */}
                    {highlight.logo && (
                      <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden border">
                        <Image
                          src={highlight.logo}
                          alt={`${highlight.organization} logo`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  {highlight.link && (
                    <div>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        className="group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                      >
                        <a href={highlight.link} target="_blank" rel="noopener noreferrer">
                          Learn More
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

