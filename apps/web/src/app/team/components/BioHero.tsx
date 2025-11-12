'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Globe, Mail, Twitter } from 'lucide-react';

interface BioHeroProps {
  name: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  profileImage?: string;
  department: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
}

export default function BioHero({ 
  name, 
  title, 
  subtitle,
  tagline, 
  profileImage, 
  department,
  socialLinks 
}: BioHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-white/20">
              <Image 
                src={profileImage || '/images/default-avatar.jpg'}
                alt={name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-emerald-600 shadow-lg text-sm px-4 py-1">
              {department}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {name}
              </h1>
              <p className="text-xl md:text-3xl text-emerald-100 font-semibold mb-2">
                {title}
              </p>
              {subtitle && (
                <p className="text-lg md:text-xl text-blue-100 font-medium mb-3">
                  {subtitle}
                </p>
              )}
              {tagline && (
                <p className="text-lg md:text-2xl italic opacity-90 mt-4 font-light">
                  "{tagline}"
                </p>
              )}
            </div>

            {/* Social Links */}
            {socialLinks && (
              <div className="flex gap-3 justify-center md:justify-start pt-4">
                {socialLinks.email && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                  >
                    <a href={`mailto:${socialLinks.email}`} target="_blank" rel="noopener noreferrer">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialLinks.linkedin && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                  >
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialLinks.github && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                  >
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialLinks.twitter && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                  >
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialLinks.website && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                  >
                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" 
                fill="currentColor" 
                className="text-slate-50 dark:text-slate-900" 
          />
        </svg>
      </div>
    </div>
  );
}

