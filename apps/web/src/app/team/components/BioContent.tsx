'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award, Briefcase } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BioContentProps {
  description: string;
  expertise: string[];
  experience: string;
  memberName?: string; // Optional: to check if this is Joel Yaffe
}

export default function BioContent({ 
  description, 
  expertise, 
  experience,
  memberName 
}: BioContentProps) {
  // Only show quick stats for Joel Yaffe (founder metrics)
  const showQuickStats = memberName === 'Joel Yaffe';
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Main Bio Content - Takes up 2 columns */}
      <div className="md:col-span-2 space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Briefcase className="h-6 w-6 text-emerald-600" />
              Biography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-emerald-600 hover:text-emerald-700 underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  strong: ({ node, ...props }) => <strong className="font-bold text-emerald-600 dark:text-emerald-400" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-4" {...props} />
                  ),
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Expertise & Experience */}
      <div className="space-y-6">
        {/* Experience - Only show if we have experience data */}
        {experience && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {experience}
                </div>
                <p className="text-sm text-muted-foreground">
                  of innovation and leadership
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expertise */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats - Only show for Joel Yaffe (founder metrics) */}
        {showQuickStats && (
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">$9M+</div>
                  <div className="text-xs text-muted-foreground">Raised in Funding</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">160+</div>
                  <div className="text-xs text-muted-foreground">Cities Worldwide</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">25+</div>
                  <div className="text-xs text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

